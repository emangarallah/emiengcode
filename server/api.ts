import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from './db.ts';
import { store } from './store.ts';
import { bcrypt, clearAuthCookie, createRateLimiter, requireAdmin, setAuthCookie, signAdminToken } from './auth.ts';
import {
  createContactRequestWithNotifications,
  getClientRequestDetails,
  listAdminNotifications,
  listClientNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  markClientNotificationRead,
  markAllClientNotificationsRead,
  updateContactStatusWithNotifications,
  notifySystemFailure
} from './notifications.ts';

const api = Router();

// Rate limiters
const contactLimiter = createRateLimiter(6, 10 * 60 * 1000); // 6 submissions per 10 mins
const loginLimiter = createRateLimiter(8, 15 * 60 * 1000); // 8 login attempts per 15 mins
const notificationLimiter = createRateLimiter(40, 60 * 1000);

// Validation schemas
const contactSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين').max(100),
  email: z.string().email('صيغة البريد الإلكتروني غير صحيحة').max(150),
  serviceType: z.string().min(2, 'يرجى تحديد نوع الخدمة المطلوب').max(150),
  serviceId: z.string().uuid().optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  budget: z.string().max(100).optional().nullable(),
  timeline: z.string().max(100).optional().nullable(),
  additionalFeatures: z.string().max(3000).optional().nullable(),
  referenceProject: z.string().max(255).optional().nullable(),
  message: z.string().min(10, 'تفاصيل الرسالة يجب أن تكون 10 أحرف على الأقل').max(3000)
});

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب ألا تقل عن 6 أحرف')
});

const projectSchema = z.object({
  title: z.string().min(2, 'عنوان المشروع مطلوب').max(200),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'الرابط المختصر يجب أن يحتوي أحرف إنجليزية وأرقام وشُرط فقط'),
  shortDescription: z.string().min(5).max(300),
  description: z.string().min(10),
  category: z.string().min(2),
  technologies: z.array(z.string()).min(1, 'أضف تقنية واحدة على الأقل'),
  coverImage: z.string().min(5, 'رابط الصورة الأساسية مطلوب'),
  gallery: z.array(z.string()).default([]),
  liveUrl: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  status: z.enum(['completed', 'prototype', 'in_development']),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  serviceId: z.string().uuid().optional().nullable(),
  isTemplate: z.boolean().optional()
});

const serviceSchema = z.object({
  title: z.string().min(2).max(150),
  description: z.string().min(10).max(1000),
  icon: z.string().min(2).max(50),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0)
});

const profileSchema = z.object({
  displayName: z.string().min(2),
  headline: z.string().min(5),
  bio: z.string().min(10),
  email: z.string().email(),
  whatsapp: z.string().min(5),
  githubUrl: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  resumeUrl: z.string().optional().nullable()
});

// ==================== PUBLIC ENDPOINTS ====================

// System & DB Status
api.get('/db-status', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const status = await db.getStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: 'تعذر جلب حالة قاعدة البيانات.' });
  }
});

// Get Projects
api.get('/projects', async (req: Request, res: Response) => {
  try {
    const { search, category, status } = req.query;
    const filters = {
      search: typeof search === 'string' ? search : undefined,
      category: typeof category === 'string' ? category : undefined,
      status: typeof status === 'string' ? status : undefined
    };

    if (await db.waitUntilInitialized()) {
      return res.json(await db.getProjects(filters));
    }

    // Read-only catalog fallback lets public portfolio pages show curated projects
    // while Neon is unavailable. Write operations remain disabled until DB is healthy.
    let projects = store.getProjects();
    if (filters.category && filters.category !== 'all') {
      projects = projects.filter((project) => project.category === filters.category);
    }
    if (filters.status && filters.status !== 'all') {
      projects = projects.filter((project) => project.status === filters.status);
    }
    if (filters.search) {
      const query = filters.search.toLocaleLowerCase();
      projects = projects.filter((project) =>
        [project.title, project.shortDescription, project.description, project.category, ...(project.technologies ?? [])]
          .some((value) => String(value ?? '').toLocaleLowerCase().includes(query))
      );
    }

    res.setHeader('X-EMICODE-Catalog-Source', 'read-only-fallback');
    return res.json(projects);
  } catch (err: any) {
    console.error('[API] Project catalog read failed:', err?.message ?? err);
    return res.status(500).json({ error: 'تعذر جلب المشاريع' });
  }
});

// Get Single Project by Slug
api.get('/projects/:slug', async (req: Request, res: Response) => {
  try {
    const project = await db.waitUntilInitialized()
      ? await db.getProjectBySlug(req.params.slug)
      : store.getProjectBySlug(req.params.slug);

    if (!project) {
      return res.status(404).json({ error: 'المشروع غير موجود' });
    }
    if (!(await db.isNeonConnected())) {
      res.setHeader('X-EMICODE-Catalog-Source', 'read-only-fallback');
    }
    return res.json(project);
  } catch (err: any) {
    console.error('[API] Project detail read failed:', err?.message ?? err);
    return res.status(500).json({ error: 'تعذر جلب بيانات المشروع' });
  }
});

// Get Services (Public: active only)
api.get('/services', async (_req: Request, res: Response) => {
  try {
    if (await db.waitUntilInitialized()) {
      return res.json(await db.getServices(true));
    }

    // Public service list is static seed content; admin writes still require Neon.
    res.setHeader('X-EMICODE-Catalog-Source', 'read-only-fallback');
    return res.json(store.getServices(true));
  } catch (err: any) {
    console.error('[API] Services read failed:', err?.message ?? err);
    return res.status(500).json({ error: 'تعذر جلب الخدمات' });
  }
});

// Get Profile
api.get('/profile', async (_req: Request, res: Response) => {
  try {
    if (await db.waitUntilInitialized()) {
      return res.json(await db.getProfile());
    }

    // Return the non-sensitive seeded public profile when Neon is unavailable.
    // Profile edits still require the primary database and are never reported saved here.
    res.setHeader('X-EMICODE-Catalog-Source', 'read-only-fallback');
    return res.json(store.getSeedData().profile);
  } catch (err: any) {
    console.error('[API] Profile read failed:', err?.message ?? err);
    return res.status(500).json({ error: 'تعذر جلب الملف التعريفي' });
  }
});

// Submit Contact Request
api.post('/contact', contactLimiter, async (req: Request, res: Response) => {
  try {
    if (!(await db.waitUntilInitialized())) {
      return res.status(503).json({ error: 'خدمة الطلبات غير متاحة مؤقتًا. يرجى المحاولة لاحقًا.' });
    }

    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'بيانات غير مكتملة أو غير صالحة',
        issues: parsed.error.issues.map(i => i.message)
      });
    }

    const activeServices = await db.getServices(true);
    const selectedService = parsed.data.serviceId
      ? activeServices.find(service => service.id === parsed.data.serviceId)
      : activeServices.find(service => service.title === parsed.data.serviceType);

    if (!selectedService) {
      return res.status(400).json({ error: 'يرجى اختيار خدمة متاحة من القائمة.' });
    }

    const { request: created, trackingToken } = await createContactRequestWithNotifications({
      ...parsed.data,
      serviceId: selectedService.id,
      serviceType: selectedService.title
    });

    res.status(201).json({
      success: true,
      message: 'تم حفظ طلبك بنجاح.',
      id: created.id,
      trackingToken,
      notificationsEnabled: true
    });
  } catch (_err: any) {
    void notifySystemFailure('contact-storage-failure', 'تعذر حفظ طلب خدمة في قاعدة البيانات. يرجى فحص اتصال Neon وسجل الخادم.').catch(() => undefined);
    res.status(500).json({ error: 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة لاحقًا.' });
  }
});

// Client notifications are accessible only with the unguessable token returned for this request.
const clientNotificationTokenSchema = z.string().regex(/^[a-f0-9]{64}$/i);
const clientNotificationTokensSchema = z.array(clientNotificationTokenSchema).min(1).max(20);
function readClientTokens(body: any): string[] | null {
  const parsedList = clientNotificationTokensSchema.safeParse(body?.trackingTokens);
  if (parsedList.success) return [...new Set(parsedList.data)];
  const parsedSingle = clientNotificationTokenSchema.safeParse(body?.trackingToken);
  return parsedSingle.success ? [parsedSingle.data] : null;
}
api.post('/client/notifications', notificationLimiter, async (req: Request, res: Response) => {
  const tokens = readClientTokens(req.body);
  if (!tokens) return res.status(401).json({ error: 'رمز متابعة الطلب غير صالح.' });
  try {
    const result = await listClientNotifications(tokens, req.body?.includeRead === true);
    if (!result) return res.status(404).json({ error: 'لم يتم العثور على إشعارات لهذا الرمز.' });
    res.json(result);
  } catch {
    res.status(503).json({ error: 'تعذر تحميل الإشعارات مؤقتًا.' });
  }
});

api.post('/client/notifications/read', notificationLimiter, async (req: Request, res: Response) => {
  const tokens = readClientTokens(req.body);
  const id = z.string().uuid().safeParse(req.body?.id);
  if (!tokens || !id.success) return res.status(400).json({ error: 'بيانات الإشعار غير صالحة.' });
  try {
    const updated = await markClientNotificationRead(tokens, id.data);
    if (!updated) return res.status(404).json({ error: 'الإشعار غير موجود.' });
    res.json({ success: true });
  } catch {
    res.status(503).json({ error: 'تعذر تحديث الإشعار مؤقتًا.' });
  }
});

api.post('/client/notifications/read-all', notificationLimiter, async (req: Request, res: Response) => {
  const tokens = readClientTokens(req.body);
  if (!tokens) return res.status(400).json({ error: 'رمز متابعة الطلب غير صالح.' });
  try {
    const updated = await markAllClientNotificationsRead(tokens);
    if (!updated) return res.status(404).json({ error: 'لم يتم العثور على الطلب.' });
    res.json({ success: true });
  } catch {
    res.status(503).json({ error: 'تعذر تحديث الإشعارات مؤقتًا.' });
  }
});

api.post('/client/request-details', notificationLimiter, async (req: Request, res: Response) => {
  const tokens = readClientTokens(req.body);
  const requestId = z.string().uuid().safeParse(req.body?.requestId);
  if (!tokens || !requestId.success) {
    return res.status(400).json({ error: 'بيانات متابعة الطلب غير صالحة.' });
  }
  try {
    const request = await getClientRequestDetails(tokens, requestId.data);
    if (!request) return res.status(404).json({ error: 'لم يتم العثور على تفاصيل هذا الطلب لهذا الرمز.' });
    res.json({ request });
  } catch {
    res.status(503).json({ error: 'تعذر تحميل تفاصيل الطلب مؤقتًا.' });
  }
});

// ==================== ADMIN AUTH ====================

// Admin Login
api.post('/admin/login', loginLimiter, async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'يرجى إدخال بريد إلكتروني وكلمة مرور صحيحة' });
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      return res.status(503).json({ error: 'إعدادات المصادقة غير مكتملة على الخادم.' });
    }
    if (!(await db.waitUntilInitialized())) {
      return res.status(503).json({ error: 'لوحة الإدارة غير متاحة حتى يتم الاتصال بقاعدة Neon.' });
    }

    const { email, password } = parsed.data;
    const admin = await db.findAdminByEmail(email);

    if (!admin) {
      // Keep error message generic for security
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    const isMatch = bcrypt.compareSync(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    const token = signAdminToken({
      id: admin.id,
      email: admin.email,
      role: admin.role
    });

    setAuthCookie(res, token);

    res.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'خطأ في عملية تسجيل الدخول', details: err.message });
  }
});

// Admin Logout
api.post('/admin/logout', (_req: Request, res: Response) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
});

// Current Admin Info
api.get('/admin/me', requireAdmin, (req: Request, res: Response) => {
  res.json({ admin: req.admin });
});

// Change Admin Password
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z.string().min(8, 'كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف')
});

api.post('/admin/change-password', requireAdmin, async (req: Request, res: Response) => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message || 'بيانات غير صالحة' });
    }

    const { currentPassword, newPassword } = parsed.data;
    const admin = await db.findAdminById(req.admin!.adminId);
    if (!admin) {
      return res.status(404).json({ error: 'حساب المدير غير موجود' });
    }

    const isMatch = bcrypt.compareSync(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'كلمة المرور الحالية غير صحيحة' });
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    const success = await db.updateAdminPassword(admin.id, newHash);
    if (!success) {
      return res.status(500).json({ error: 'تعذر تحديث كلمة المرور في قاعدة البيانات' });
    }

    res.json({ success: true, message: 'تم تحديث كلمة المرور بنجاح في قاعدة البيانات' });
  } catch (err: any) {
    res.status(500).json({ error: 'خطأ أثناء تغيير كلمة المرور', details: err.message });
  }
});

// Validate & Process Project Image Upload
const imageUploadSchema = z.object({
  imageData: z.string().min(10, 'بيانات الصورة مطلوبة'),
  fileName: z.string().optional()
});

api.post('/admin/upload-image', requireAdmin, (req: Request, res: Response) => {
  try {
    const parsed = imageUploadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'بيانات الصورة غير صالحة' });
    }

    const { imageData } = parsed.data;
    if (!imageData.startsWith('data:image/') && !imageData.startsWith('http://') && !imageData.startsWith('https://')) {
      return res.status(400).json({ error: 'صيغة الصورة غير مدعومة. يرجى رفع ملف صورة PNG أو JPG أو WebP.' });
    }

    // Return the sanitized image data URL / link
    res.json({ success: true, imageUrl: imageData });
  } catch (err: any) {
    res.status(500).json({ error: 'تعذر معالجة الصورة', details: err.message });
  }
});

// Real Dashboard Statistics
api.get('/admin/stats', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const projects = await db.getProjects();
    const services = await db.getServices(false);
    const contacts = await db.getContactRequests();

    const stats = {
      totalProjects: projects.length,
      featuredProjects: projects.filter(p => p.featured).length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      activeServices: services.filter(s => s.isActive).length,
      totalContacts: contacts.length,
      newContacts: contacts.filter(c => c.status === 'new').length,
      inReviewContacts: contacts.filter(c => c.status === 'in_review').length,
      completedContacts: contacts.filter(c => c.status === 'completed').length
    };

    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: 'تعذر حساب الإحصائيات', details: err.message });
  }
});

// ==================== NOTIFICATIONS: ADMIN / DEVELOPER ====================

api.get('/admin/notifications', requireAdmin, async (req: Request, res: Response) => {
  try {
    const role = req.admin?.role === 'superadmin' ? 'superadmin' : 'admin';
    res.json(await listAdminNotifications(role, req.query.history === 'true'));
  } catch {
    res.status(503).json({ error: 'تعذر تحميل إشعارات الإدارة مؤقتًا.' });
  }
});

api.post('/admin/notifications/read', requireAdmin, async (req: Request, res: Response) => {
  const parsed = z.string().uuid().safeParse(req.body?.id);
  if (!parsed.success) return res.status(400).json({ error: 'معرف الإشعار غير صالح.' });
  try {
    const role = req.admin?.role === 'superadmin' ? 'superadmin' : 'admin';
    const updated = await markAdminNotificationRead(parsed.data, role);
    if (!updated) return res.status(404).json({ error: 'الإشعار غير موجود.' });
    res.json({ success: true });
  } catch {
    res.status(503).json({ error: 'تعذر تحديث الإشعار مؤقتًا.' });
  }
});

api.post('/admin/notifications/read-all', requireAdmin, async (req: Request, res: Response) => {
  try {
    const role = req.admin?.role === 'superadmin' ? 'superadmin' : 'admin';
    await markAllAdminNotificationsRead(role);
    res.json({ success: true });
  } catch {
    res.status(503).json({ error: 'تعذر تحديث الإشعارات مؤقتًا.' });
  }
});

// ==================== ADMIN CRUD: PROJECTS ====================

api.post('/admin/projects', requireAdmin, async (req: Request, res: Response) => {
  try {
    const parsed = projectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'بيانات المشروع غير صالحة',
        issues: parsed.error.issues.map(i => i.message)
      });
    }

    const existing = await db.getProjectBySlug(parsed.data.slug);
    if (existing) {
      return res.status(409).json({ error: 'الرابط المختصر (slug) مستخدم بالفعل لمشروع آخر' });
    }

    const created = await db.createProject(parsed.data);
    res.status(201).json(created);
  } catch (err: any) {
    void notifySystemFailure('admin-project-create-failure', 'فشلت عملية إنشاء مشروع من لوحة الإدارة. يرجى مراجعة سجلات الخادم.').catch(() => undefined);
    res.status(500).json({ error: 'تعذر إنشاء المشروع' });
  }
});

api.put('/admin/projects/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const parsed = projectSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'بيانات غير صالحة',
        issues: parsed.error.issues.map(i => i.message)
      });
    }

    // Check slug collision if slug changed
    if (parsed.data.slug) {
      const existing = await db.getProjectBySlug(parsed.data.slug);
      if (existing && existing.id !== req.params.id) {
        return res.status(409).json({ error: 'الرابط المختصر (slug) مستخدم بالفعل لمشروع آخر' });
      }
    }

    const updated = await db.updateProject(req.params.id, parsed.data);
    if (!updated) {
      return res.status(404).json({ error: 'المشروع غير موجود' });
    }
    res.json(updated);
  } catch (err: any) {
    void notifySystemFailure('admin-project-update-failure', 'فشلت عملية تحديث مشروع من لوحة الإدارة. يرجى مراجعة سجلات الخادم.').catch(() => undefined);
    res.status(500).json({ error: 'تعذر تحديث المشروع' });
  }
});

api.delete('/admin/projects/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const success = await db.deleteProject(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'المشروع غير موجود' });
    }
    res.json({ success: true, message: 'تم حذف المشروع بنجاح' });
  } catch (err: any) {
    void notifySystemFailure('admin-project-delete-failure', 'فشلت عملية حذف مشروع من لوحة الإدارة. يرجى مراجعة سجلات الخادم.').catch(() => undefined);
    res.status(500).json({ error: 'تعذر حذف المشروع' });
  }
});

// ==================== ADMIN CRUD: SERVICES ====================

api.get('/admin/services', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const services = await db.getServices(false);
    res.json(services);
  } catch (err: any) {
    res.status(500).json({ error: 'تعذر جلب الخدمات', details: err.message });
  }
});

api.post('/admin/services', requireAdmin, async (req: Request, res: Response) => {
  try {
    const parsed = serviceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'بيانات الخدمة غير صالحة',
        issues: parsed.error.issues.map(i => i.message)
      });
    }
    const created = await db.createService(parsed.data);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: 'تعذر إضافة الخدمة', details: err.message });
  }
});

api.put('/admin/services/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const parsed = serviceSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'بيانات غير صالحة',
        issues: parsed.error.issues.map(i => i.message)
      });
    }
    const updated = await db.updateService(req.params.id, parsed.data);
    if (!updated) {
      return res.status(404).json({ error: 'الخدمة غير موجودة' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'تعذر تعديل الخدمة', details: err.message });
  }
});

api.delete('/admin/services/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const success = await db.deleteService(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'الخدمة غير موجودة' });
    }
    res.json({ success: true, message: 'تم حذف الخدمة بنجاح' });
  } catch (err: any) {
    res.status(500).json({ error: 'تعذر حذف الخدمة', details: err.message });
  }
});

// ==================== ADMIN CRUD: CONTACTS ====================

api.get('/admin/contacts', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const contacts = await db.getContactRequests();
    res.json(contacts);
  } catch (err: any) {
    res.status(500).json({ error: 'تعذر جلب طلبات التواصل', details: err.message });
  }
});

api.patch('/admin/contacts/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!['new', 'in_review', 'accepted', 'rejected', 'contacted', 'completed', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'حالة غير صالحة' });
    }
    const updated = await updateContactStatusWithNotifications(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'طلب التواصل غير موجود' });
    }
    res.json(updated);
  } catch {
    void notifySystemFailure(
      'contact-status-update-failure',
      'فشلت عملية تحديث حالة طلب من لوحة الإدارة. يرجى مراجعة سجلات الخادم.'
    ).catch(() => undefined);
    res.status(500).json({ error: 'تعذر تحديث حالة الطلب. يرجى المحاولة لاحقًا.' });
  }
});

api.delete('/admin/contacts/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const success = await db.deleteContactRequest(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'طلب التواصل غير موجود' });
    }
    res.json({ success: true, message: 'تم حذف طلب التواصل' });
  } catch (err: any) {
    res.status(500).json({ error: 'تعذر حذف طلب التواصل', details: err.message });
  }
});

// ==================== ADMIN CRUD: PROFILE ====================

api.put('/admin/profile', requireAdmin, async (req: Request, res: Response) => {
  try {
    const parsed = profileSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'بيانات غير صالحة',
        issues: parsed.error.issues.map(i => i.message)
      });
    }
    const updated = await db.updateProfile(parsed.data);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'تعذر تحديث الملف الشخصي', details: err.message });
  }
});

export { api };
