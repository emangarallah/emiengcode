# EMICODE — معرض أعمال مبرمج احترافي وحلول برمجية متكاملة

معرض أعمال برمجية احترافي عالي الأداء للمهندس ومطور الـ Full-Stack، مبني وفق أحدث المعايير مع واجهة مستخدم فاخرة باللغتين العربية (RTL) والإنجليزية (LTR)، وخادم حقيقي متصل بقاعدة بيانات **Neon PostgreSQL** عبر **Prisma ORM**، مع لوحة تحكم إدارية مؤمنة بالكامل لإدارة المشاريع، الخدمات، وطلبات العملاء.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (تصميم ليلي كحلي فاخر مع تدرجات النيون والبنفسجي)
- **Backend**: Node.js + Express REST API (متوافق تمامًا مع Vercel Serverless)
- **Database**: Neon Serverless PostgreSQL
- **ORM / Data Client**: Prisma ORM + Node-Postgres Driver مع Pooling
- **Authentication**: جلسات آمنة مشفرة عبر JWT مع تجزئة كلمات المرور باستخدام **bcrypt**
- **Icons**: Lucide React
- **Validation**: Zod Schemas مع تحديد معدل الطلبات (Rate Limiting) لحماية الخادم ضد هجمات الإغراق
- **Deployment**: Vercel & Node.js Cloud Run

---

## 🗄️ مخطط قاعدة بيانات Neon PostgreSQL (Database Schema)

يتطابق المخطط مع ملف `prisma/schema.prisma` وجداول Neon المنشأة في `prisma/migrations/0_init/migration.sql`:

1. **`projects` (المشاريع)**:
   - `id`: UUID (Primary Key)
   - `title`: عنوان المشروع
   - `slug`: معرّف الرابط الفريد (Unique Slug)
   - `shortDescription`: وصف مقتضب للبطاقة
   - `description`: الوصف التفصيلي (المشكلة، الحل المعماري، والتحديات التقنية)
   - `category`: تصنيف المشروع (`saas`, `web`, `mobile`, `api`, `enterprise`)
   - `technologies`: مصفوفة التقنيات (Text Array)
   - `coverImage`: رابط صورة الغلاف الأساسية
   - `gallery`: مصفوفة صور المعرض الإضافية
   - `liveUrl`: رابط التجربة المباشرة (Live Demo)
   - `githubUrl`: رابط الكود المصدري على GitHub
   - `status`: حالة المشروع (`completed`, `prototype`, `in_development`)
   - `featured`: تمييز المشروع في واجهة المعرض الرئيسية
   - `sortOrder`: ترتيب الظهور
   - `createdAt` & `updatedAt`: التواريخ الزمنية

2. **`admins` (المديرون)**:
   - `id`: UUID
   - `email`: البريد الإلكتروني (Unique)
   - `passwordHash`: كلمة المرور المجزأة بخوارزمية bcrypt
   - `role`: الصلاحية (`superadmin`, `admin`)
   - `createdAt`: تاريخ الإنشاء

3. **`services` (الخدمات البرمجية)**:
   - `id`: UUID
   - `title`: اسم الخدمة
   - `description`: تفاصيل الخدمة والمخرجات
   - `icon`: معرّف أيقونة Lucide
   - `isActive`: تفعيل أو تعطيل الخدمة
   - `sortOrder`: ترتيب العرض

4. **`contact_requests` (طلبات العملاء)**:
   - `id`: UUID
   - `name`: اسم العميل
   - `email`: البريد الإلكتروني
   - `serviceType`: نوع الخدمة المطلوبة
   - `budget`: الميزانية التقديرية (اختياري)
   - `message`: تفاصيل المشروع
   - `status`: حالة الطلب (`new`, `in_review`, `contacted`, `completed`, `archived`)
   - `createdAt`: وقت الإرسال

5. **`profile` (الملف التعريفي للمطور)**:
   - `id`: UUID
   - `displayName`: الاسم المعروض
   - `headline`: المسمى الوظيفي
   - `bio`: النبذة المهنية
   - `email`: البريد المهني
   - `whatsapp`: رقم الواتساب المباشر
   - `githubUrl`: رابط GitHub
   - `linkedinUrl`: رابط LinkedIn
   - `resumeUrl`: رابط السيرة الذاتية

---

## 🔐 إعداد حساب المدير بأمان

لا توجد بيانات دخول افتراضية أو حساب مدير جاهز داخل المستودع. أضف `DATABASE_URL` و`JWT_SECRET` و`ADMIN_EMAIL` و`ADMIN_PASSWORD` إلى بيئة خاصة محلية أو إلى إعدادات Vercel، ولا تضع القيم الحقيقية في GitHub.

أنشئ كلمة مرور قوية لا تقل عن 12 حرفًا، ثم شغّل `npm run admin:setup` مرة واحدة في بيئة موثوقة متصلة بقاعدة Neon لتعيين حساب المدير. لا تشغّل الإعداد إلا عند قصدك إنشاء الحساب أو إعادة تعيين بياناته.

---

## 🚀 التشغيل المحلي (Local Setup)

1. **تثبيت الحزم**:
   ```bash
   npm install
   ```

2. **إعداد متغيرات البيئة**:
   انسخ ملف `.env.example` إلى `.env`:
   ```bash
   cp .env.example .env
   ```

3. **تشغيل خادم التطوير الكامل (Full-Stack Dev)**:
   ```bash
   npm run dev
   ```
   يعمل التطبيق على المنفذ: `http://localhost:3000`

---

## 🌐 النشر على Vercel وربط Neon PostgreSQL (Vercel & Neon Deployment)

1. أنشئ حسابًا وقاعدة بيانات جديدة على [Neon.tech](https://console.neon.tech).
2. انسخ رابط الاتصال المباشر (Connection String) بصيغة `postgresql://...`.
3. في لوحة تحكم مشروعك على **Vercel**:
   - اذهب إلى **Settings > Environment Variables**.
   - أضف المتغيرات التالية:
     ```env
     DATABASE_URL=postgresql://user:password@ep-sample-pool.eu-central-1.aws.neon.tech/neondb?sslmode=require
     JWT_SECRET=your-secure-production-random-jwt-secret-min-32-chars
     NODE_ENV=production
     ```
4. لتطبيق المخطط البرمجي على قاعدة Neon، شغّل الأمر:
   ```bash
   npx prisma db push
   ```
   أو نفّذ ملف الـ SQL المباشر الموجود في:
   `prisma/migrations/0_init/migration.sql` داخل محرر SQL Console في Neon بنقرة واحدة!

---

## ✨ المميزات الرئيسية للمشروع

- **دعم ثنائي اللغة كامل**: تحويل فوري وسلس بين العربية (RTL مع خطوط Cairo و Tajawal) والإنجليزية (LTR).
- **محرك بيانات هجين مقاوم للأعطال (Resilient Data Engine)**:
  يعمل تلقائيًا عبر Neon PostgreSQL عند توفر `DATABASE_URL`، ومع طبقة تخزين محلية مستمرة متوافقة إذا لم يتم ضبط الاتصال السحابي بعد، مما يضمن عمل التطبيق بنسبة 100% دون انهيار.
- **إدارة كاملة للمشاريع**: إضافة، تعديل، حذف، تمييز (Featured)، وإدارة الروابط والصور.
- **معالجة طلبات العملاء**: استقبال الاستفسارات عبر نموذج مؤمن برمجياً، مع إمكانية تحديث الحالة والرد السريع عبر الواتساب أو البريد.
- **تأمين احترافي**: حماية من هجمات القوة الغاشمة (Brute-force) عبر Rate Limiting، وتشفير الجلسات بـ HttpOnly cookies.
