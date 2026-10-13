import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Database, 
  FolderGit2, 
  Briefcase, 
  MessageSquare, 
  User, 
  Star, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Phone,
  Mail,
  Eye,
  EyeOff,
  Upload,
  Lock,
  Key,
  Image as ImageIcon
} from 'lucide-react';
import { Project, Service, ContactRequest, Profile, DbStatus, AdminStats } from '../types.ts';
import { Language, translations } from '../i18n.ts';
import { NotificationCenter } from './NotificationCenter.tsx';

interface AdminPortalProps {
  lang: Language;
  onClose: () => void;
  onDataChanged: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  lang,
  onClose,
  onDataChanged,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  // Auth State
  // Check the server-side HttpOnly session cookie; never trust a browser-stored bearer token.
  const [token, setToken] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'contacts' | 'profile' | 'db'>('projects');

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Project Editor Modal
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  // Service Editor Modal
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

  // Toast / Status Message
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showNotify = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Admin API authentication uses the HttpOnly session cookie exclusively.
  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    return fetch(url, { ...options, credentials: 'include', headers });
  };

  // Check auth & fetch data
  const checkAuthAndLoad = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const meRes = await authFetch('/api/admin/me');
      if (!meRes.ok) {
        // Token invalid
        handleLogout();
        return;
      }
      const meData = await meRes.json();
      setAdminUser(meData.admin);

      // Load Stats & Data
      await Promise.all([
        loadStats(),
        loadDbStatus(),
        loadProjects(),
        loadServices(),
        loadContacts(),
        loadProfile()
      ]);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.removeItem('emicode_token');
    checkAuthAndLoad();
  }, [token]);

  useEffect(() => {
    const handleAdminNavigation = (event: Event) => {
      const target = (event as CustomEvent<string>).detail;
      const tabs: readonly string[] = ['projects', 'services', 'contacts', 'profile', 'db'];
      if (tabs.includes(target)) {
        setActiveTab(target as 'projects' | 'services' | 'contacts' | 'profile' | 'db');
      }
    };
    window.addEventListener('emicode-admin-navigate', handleAdminNavigation);
    return () => window.removeEventListener('emicode-admin-navigate', handleAdminNavigation);
  }, []);

  const loadStats = async () => {
    const res = await authFetch('/api/admin/stats');
    if (res.ok) setStats(await res.json());
  };

  const loadDbStatus = async () => {
    const res = await authFetch('/api/db-status');
    if (res.ok) setDbStatus(await res.json());
  };

  const loadProjects = async () => {
    const res = await fetch('/api/projects');
    if (res.ok) setProjects(await res.json());
  };

  const loadServices = async () => {
    const res = await authFetch('/api/admin/services');
    if (res.ok) setServices(await res.json());
  };

  const loadContacts = async () => {
    const res = await authFetch('/api/admin/contacts');
    if (res.ok) setContacts(await res.json());
  };

  const loadProfile = async () => {
    const res = await fetch('/api/profile');
    if (res.ok) setProfile(await res.json());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل تسجيل الدخول');
      }

      setToken(true);
      setAdminUser(data.admin);
      showNotify(isAr ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
    } catch (err: any) {
      setLoginError(err.message || 'بيانات الدخول غير صحيحة');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    } catch (_) {}
    localStorage.removeItem('emicode_token');
    setToken(false);
    setAdminUser(null);
    onDataChanged();
  };

  // ================= Project Handlers =================
  const handleOpenAddProject = () => {
    setEditingProject({
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      category: 'saas',
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      liveUrl: '',
      githubUrl: '',
      status: 'completed',
      featured: false,
      sortOrder: (projects.length + 1),
      serviceId: services[0]?.id ?? null,
      isTemplate: false
    });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const isNew = !editingProject.id;
      const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${editingProject.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(editingProject)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'تعذر حفظ المشروع');
      }

      showNotify(isAr ? 'تم حفظ المشروع بنجاح!' : 'Project saved successfully!');
      setIsProjectModalOpen(false);
      setEditingProject(null);
      await loadProjects();
      await loadStats();
      onDataChanged();
    } catch (err: any) {
      showNotify(err.message, 'error');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من رغبتك بحذف هذا المشروع؟' : 'Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const res = await authFetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('فشل الحذف');
      showNotify(isAr ? 'تم حذف المشروع' : 'Project deleted');
      await loadProjects();
      await loadStats();
      onDataChanged();
    } catch (err: any) {
      showNotify(err.message, 'error');
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const res = await authFetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        body: JSON.stringify({ featured: !project.featured })
      });
      if (res.ok) {
        await loadProjects();
        await loadStats();
        onDataChanged();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= Service Handlers =================
  const handleOpenAddService = () => {
    setEditingService({
      title: '',
      description: '',
      icon: 'Code2',
      isActive: true,
      sortOrder: services.length + 1
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const isNew = !editingService.id;
      const url = isNew ? '/api/admin/services' : `/api/admin/services/${editingService.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(editingService)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل حفظ الخدمة');

      showNotify(isAr ? 'تم حفظ الخدمة' : 'Service saved');
      setIsServiceModalOpen(false);
      setEditingService(null);
      await loadServices();
      onDataChanged();
    } catch (err: any) {
      showNotify(err.message, 'error');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm(isAr ? 'حذف هذه الخدمة؟' : 'Delete this service?')) return;
    try {
      const res = await authFetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('فشل الحذف');
      showNotify(isAr ? 'تم حذف الخدمة' : 'Service deleted');
      await loadServices();
      onDataChanged();
    } catch (err: any) {
      showNotify(err.message, 'error');
    }
  };

  // ================= Contact Handlers =================
  const handleUpdateContactStatus = async (id: string, status: ContactRequest['status']) => {
    try {
      const res = await authFetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('فشل تحديث الحالة');
      showNotify(isAr ? 'تم تحديث حالة الطلب' : 'Status updated');
      await loadContacts();
      await loadStats();
    } catch (err: any) {
      showNotify(err.message, 'error');
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm(isAr ? 'حذف هذا الطلب؟' : 'Delete this inquiry?')) return;
    try {
      const res = await authFetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('فشل الحذف');
      showNotify(isAr ? 'تم حذف الطلب' : 'Inquiry deleted');
      await loadContacts();
      await loadStats();
    } catch (err: any) {
      showNotify(err.message, 'error');
    }
  };

  // ================= Profile Handlers =================
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const res = await authFetch('/api/admin/profile', {
        method: 'PUT',
        body: JSON.stringify(profile)
      });
      if (!res.ok) throw new Error('فشل تحديث الملف الشخصي');
      showNotify(isAr ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated');
      onDataChanged();
    } catch (err: any) {
      showNotify(err.message, 'error');
    }
  };

  // Password change state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [isChangingPwd, setIsChangingPwd] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      showNotify(isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match', 'error');
      return;
    }
    if (newPwd.length < 8) {
      showNotify(isAr ? 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters', 'error');
      return;
    }

    setIsChangingPwd(true);
    try {
      const res = await authFetch('/api/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'تعذر تغيير كلمة المرور');
      showNotify(isAr ? 'تم تغيير كلمة المرور وتحديثها في قاعدة البيانات بنجاح!' : 'Password updated successfully in database!');
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (err: any) {
      showNotify(err.message, 'error');
    } finally {
      setIsChangingPwd(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotify(isAr ? 'يرجى اختيار ملف صورة صالح' : 'Please select an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotify(isAr ? 'حجم الصورة يجب ألا يتجاوز 5 ميجابايت' : 'Image size must be under 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (editingProject) {
        setEditingProject({ ...editingProject, coverImage: result });
        showNotify(isAr ? 'تم تحميل ومعاينة الصورة بنجاح' : 'Image loaded successfully');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      
      {/* Container */}
      <div 
        className="relative w-full max-w-6xl my-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[95vh] overflow-hidden text-start"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{t.admin.title}</span>
                {adminUser && (
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                    {adminUser.role}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.admin.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {adminUser && <NotificationCenter mode="admin" lang={lang} />}
            {token && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.admin.logout}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {notification && (
          <div className={`px-6 py-2.5 text-xs font-bold flex items-center gap-2 ${
            notification.type === 'success' 
              ? 'bg-emerald-950/90 text-emerald-300 border-b border-emerald-800' 
              : 'bg-rose-950/90 text-rose-300 border-b border-rose-800'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{notification.text}</span>
          </div>
        )}

        {/* ================= IF NOT LOGGED IN: SHOW LOGIN SCREEN ================= */}
        {!token ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full my-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-950/50">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">
                {t.admin.login.title}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr ? 'جلسات مشفرة وتأمين خادم كامل مع خوارزميات التجزئة الآمنة' : 'Encrypted sessions with Argon2id / bcrypt authorization'}
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {t.admin.login.email}
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {t.admin.login.password}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 pe-10 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Security Warning Notice */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {isAr 
                    ? 'هذه البوابة مخصصة حصريًا لإدارة النظام والمشاريع من قبل المهندس المصرح له. جميع محاولات الدخول غير المصرح بها مسجلة ومرفوضة.'
                    : 'This portal is restricted to authorized system administration. All unauthorized attempts are logged.'}
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 hover:opacity-95 transition-all cursor-pointer"
              >
                {isLoggingIn ? (isAr ? 'جارٍ التحقق...' : 'Verifying...') : t.admin.login.submit}
              </button>
            </form>
          </div>
        ) : (
          /* ================= IF LOGGED IN: SHOW DASHBOARD TABS ================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Metrics & DB Health Bar */}
            <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">{isAr ? 'إجمالي المشاريع' : 'Total Projects'}</span>
                <span className="text-lg font-black text-white font-mono">{stats?.totalProjects ?? projects.length}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">{isAr ? 'طلبات جديدة' : 'New Inquiries'}</span>
                <span className="text-lg font-black text-cyan-400 font-mono">{stats?.newContacts ?? 0}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">{isAr ? 'الخدمات المفعلة' : 'Active Services'}</span>
                <span className="text-lg font-black text-emerald-400 font-mono">{stats?.activeServices ?? services.length}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block">{isAr ? 'محرك البيانات' : 'DB Engine'}</span>
                  <span className={`text-xs font-bold font-mono ${dbStatus?.connected ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {dbStatus?.connected ? 'Neon PostgreSQL' : 'Local Resilient'}
                  </span>
                </div>
                <button 
                  onClick={loadDbStatus}
                  title="Refresh status"
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="px-6 border-b border-slate-800 flex items-center gap-2 overflow-x-auto bg-slate-950/30">
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'projects'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>{t.admin.tabs.projects} ({projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'services'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>{t.admin.tabs.services} ({services.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('contacts')}
                className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'contacts'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.admin.tabs.contacts} ({contacts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'profile'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{t.admin.tabs.profile}</span>
              </button>

              <button
                onClick={() => setActiveTab('db')}
                className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'db'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>{t.admin.tabs.dbStatus}</span>
              </button>
            </div>

            {/* Tabs Content */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* TAB 1: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      {isAr ? 'إدارة ونشر وتعديل مشاريع معرض EMICODE الحية في قاعدة البيانات' : 'Manage published projects'}
                    </p>
                    <button
                      onClick={handleOpenAddProject}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t.admin.addProject}</span>
                    </button>
                  </div>

                  <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80">
                    {projects.map((proj) => (
                      <div key={proj.id} className="p-4 bg-slate-900/60 hover:bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={proj.coverImage}
                            alt=""
                            className="w-14 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white line-clamp-1">{proj.title}</h4>
                              <button
                                onClick={() => handleToggleFeatured(proj)}
                                title={proj.featured ? 'إلغاء التمييز' : 'تمييز المشروع في الواجهة'}
                                className={`p-1 rounded cursor-pointer ${proj.featured ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
                              >
                                <Star className="w-3.5 h-3.5 fill-current" />
                              </button>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-cyan-400">/{proj.slug}</span>
                              <span>·</span>
                              <span>{proj.category}</span>
                              <span>·</span>
                              <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                                proj.status === 'completed' ? 'text-emerald-400 bg-emerald-950/60' : 'text-amber-400 bg-amber-950/60'
                              }`}>{proj.status}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => {
                              setEditingProject(proj);
                              setIsProjectModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{t.admin.actions.edit}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 text-xs font-semibold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: SERVICES */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      {isAr ? 'الخدمات التقنية المعروضة للعملاء مع إمكانية التعديل والترتيب' : 'Manage your developer service offerings'}
                    </p>
                    <button
                      onClick={handleOpenAddService}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t.admin.addService}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((srv) => (
                      <div key={srv.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-cyan-400 bg-slate-800 px-2 py-0.5 rounded">
                              icon: {srv.icon}
                            </span>
                            <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                              srv.isActive ? 'text-emerald-400 bg-emerald-950/80' : 'text-slate-500 bg-slate-950'
                            }`}>
                              {srv.isActive ? 'مفعل' : 'معطل'}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{srv.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{srv.description}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingService(srv);
                              setIsServiceModalOpen(true);
                            }}
                            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(srv.id)}
                            className="p-1.5 rounded bg-rose-950/40 text-rose-300 hover:text-rose-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CONTACTS */}
              {activeTab === 'contacts' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    {isAr ? 'طلبات العملاء الواردة والمحفوظة في Neon PostgreSQL مع خيارات الرد وتحديث الحالة' : 'Incoming inquiries stored in database'}
                  </p>

                  <div className="space-y-3">
                    {contacts.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-500">لا توجد طلبات تواصل حتى الآن.</div>
                    ) : (
                      contacts.map((req) => (
                        <div key={req.id} className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-sm font-bold text-white">{req.name}</span>
                              <span className="text-xs text-slate-400 ms-2 font-mono">({req.email})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={req.status}
                                onChange={(e) => handleUpdateContactStatus(req.id, e.target.value as any)}
                                className="px-2.5 py-1 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 outline-none"
                              >
                                <option value="new">جديد (New)</option>
                                <option value="in_review">قيد المراجعة (In Review)</option>
                                <option value="accepted">مقبول (Accepted)</option>
                                <option value="rejected">مرفوض (Rejected)</option>
                                <option value="contacted">تم التواصل (Contacted)</option>
                                <option value="completed">مكتمل (Completed)</option>
                                <option value="archived">مؤرشف (Archived)</option>
                              </select>
                              <button
                                onClick={() => handleDeleteContact(req.id)}
                                className="p-1.5 rounded bg-rose-950/40 text-rose-400 hover:text-rose-200"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-xs text-slate-400 flex flex-wrap gap-4 font-medium">
                            <span className="text-cyan-400">الخدمة: {req.serviceType}</span>
                            {req.budget && <span>الميزانية: {req.budget}</span>}
                            <span>التاريخ: {new Date(req.createdAt).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</span>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800/80 leading-relaxed whitespace-pre-wrap">
                            {req.message}
                          </p>

                          {/* Quick response actions */}
                          <div className="flex items-center gap-2 pt-1 text-xs">
                            <a
                              href={`mailto:${req.email}?subject=بخصوص طلبك لدى EMICODE`}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5"
                            >
                              <Mail className="w-3.5 h-3.5 text-cyan-400" />
                              <span>رد بالبريد</span>
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: PROFILE */}
              {activeTab === 'profile' && profile && (
                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">الاسم المعروض</label>
                      <input
                        type="text"
                        value={profile.displayName}
                        onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">البريد الإلكتروني المهني</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">العنوان التعريفي (Headline)</label>
                    <input
                      type="text"
                      value={profile.headline}
                      onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">النبذة المهنية (Bio)</label>
                    <textarea
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">رقم الواتساب</label>
                      <input
                        type="text"
                        value={profile.whatsapp}
                        onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">GitHub</label>
                      <input
                        type="text"
                        value={profile.githubUrl || ''}
                        onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">LinkedIn</label>
                      <input
                        type="text"
                        value={profile.linkedinUrl || ''}
                        onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ التعديلات</span>
                  </button>
                </form>
              )}

              {/* TAB 5: DATABASE & VERCEL GUIDE */}
              {activeTab === 'db' && (
                <div className="space-y-6 max-w-3xl">
                  {/* Status Banner */}
                  <div className={`p-5 rounded-xl border flex items-start gap-4 ${
                    dbStatus?.connected
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}>
                    <Database className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">
                        {dbStatus?.connected ? 'متصل بقاعدة بيانات Neon PostgreSQL بنجاح' : 'يعمل عبر المحرك المحلي المقاوم للصدمات (Resilient Storage)'}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {dbStatus?.message}
                      </p>
                      <div className="text-[11px] font-mono text-cyan-300 mt-2">
                        DATABASE_URL Configured: {dbStatus?.databaseUrlSet ? 'Yes (configured)' : 'No (using local persistent store)'}
                      </div>
                    </div>
                  </div>

                  {/* Vercel & Neon Instructions */}
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                      <span>خطوات ربط Neon والنشر على Vercel</span>
                    </h4>

                    <ol className="text-xs text-slate-300 space-y-3 list-decimal list-inside leading-relaxed">
                      <li>
                        أنشئ مشروع PostgreSQL مجاني على <strong className="text-white">Neon.tech</strong> وانسخ رابط الاتصال (Connection String).
                      </li>
                      <li>
                        في إعدادات Vercel Project Settings &gt; Environment Variables، أضف المتغير:
                        <code className="block mt-1 p-2 rounded bg-slate-900 text-cyan-300 font-mono text-[11px]">
                          DATABASE_URL="postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require"
                        </code>
                      </li>
                      <li>
                        أضف مفتاح الجلسات المشفرة:
                        <code className="block mt-1 p-2 rounded bg-slate-900 text-cyan-300 font-mono text-[11px]">
                          JWT_SECRET="your-strong-random-jwt-secret-key-32-chars"
                        </code>
                      </li>
                      <li>
                        قم بتشغيل أمر ترحيل Prisma أو تطبيق المخطط التلقائي:
                        <code className="block mt-1 p-2 rounded bg-slate-900 text-emerald-400 font-mono text-[11px]">
                          npx prisma db push
                        </code>
                      </li>
                    </ol>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* ================= PROJECT EDIT MODAL ================= */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-start max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingProject.id ? t.admin.editProject : t.admin.addProject}
              </h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">عنوان المشروع</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">الرابط المختصر (slug)</label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">التصنيف</label>
                  <select
                    value={editingProject.category || 'saas'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="saas">SaaS & Dashboards</option>
                    <option value="web">Web Application</option>
                    <option value="mobile">Flutter Mobile</option>
                    <option value="api">APIs & Gateways</option>
                    <option value="enterprise">Enterprise CRM</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">حالة المشروع</label>
                  <select
                    value={editingProject.status || 'completed'}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="completed">مكتمل ومتاح (completed)</option>
                    <option value="prototype">نموذج تجريبي (prototype)</option>
                    <option value="in_development">قيد التطوير (in_development)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">الترتيب</label>
                  <input
                    type="number"
                    value={editingProject.sortOrder ?? 0}
                    onChange={(e) => setEditingProject({ ...editingProject, sortOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">الخدمة المرتبطة</label>
                  <select
                    value={editingProject.serviceId ?? ''}
                    onChange={(e) => setEditingProject({ ...editingProject, serviceId: e.target.value || null })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="">بدون خدمة مرتبطة</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>{service.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">نوع العرض</label>
                  <label className="flex items-center gap-2 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white">
                    <input
                      type="checkbox"
                      checked={editingProject.isTemplate ?? editingProject.status === 'prototype'}
                      onChange={(e) => setEditingProject({ ...editingProject, isTemplate: e.target.checked, status: e.target.checked ? 'prototype' : (editingProject.status === 'prototype' ? 'completed' : editingProject.status) })}
                    />
                    نموذج تجريبي
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">وصف مختصر (يظهر في البطاقة)</label>
                <input
                  type="text"
                  required
                  value={editingProject.shortDescription || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  الوصف الكامل (المشكلة، الحل المعماري، والتحديات التقنية)
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">التقنيات (مفصولة بفواصل)</label>
                <input
                  type="text"
                  value={editingProject.technologies?.join(', ') || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">رابط صورة الغلاف</label>
                <input
                  type="url"
                  required
                  value={editingProject.coverImage || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">رابط التجربة المباشرة (Live Demo)</label>
                  <input
                    type="url"
                    value={editingProject.liveUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">رابط GitHub (اختياري)</label>
                  <input
                    type="url"
                    value={editingProject.githubUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={editingProject.featured || false}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 bg-slate-950 border-slate-800"
                />
                <label htmlFor="featured-check" className="text-xs font-semibold text-white cursor-pointer">
                  مشروع مميز (Featured) يظهر في واجهة الصفحة الأولى
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  حفظ المشروع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= SERVICE EDIT MODAL ================= */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-start">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingService.id ? t.admin.editService : t.admin.addService}
              </h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">اسم الخدمة</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">الوصف</label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">الأيقونة (Lucide)</label>
                  <select
                    value={editingService.icon || 'Code2'}
                    onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="Globe">Globe (مواقع الشركات)</option>
                    <option value="Calendar">Calendar (حجز المواعيد)</option>
                    <option value="LayoutDashboard">LayoutDashboard (لوحات التحكم)</option>
                    <option value="Smartphone">Smartphone (Flutter)</option>
                    <option value="Code2">Code2 (React)</option>
                    <option value="Database">Database (قواعد البيانات)</option>
                    <option value="CloudUpload">CloudUpload (النشر السحابي)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">الحالة</label>
                  <select
                    value={editingService.isActive ? 'true' : 'false'}
                    onChange={(e) => setEditingService({ ...editingService, isActive: e.target.value === 'true' })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="true">مفعلة (Active)</option>
                    <option value="false">معطلة (Inactive)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
