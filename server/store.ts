import fs from 'fs';
import path from 'path';
import { AdminUser, ContactRequest, Profile, Project, Service } from './types.ts';

interface DatabaseData {
  projects: Project[];
  admins: AdminUser[];
  services: Service[];
  contact_requests: ContactRequest[];
  profile: Profile;
}

const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'emiengcode')
  : path.resolve(process.cwd(), '.data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

// Curated functional template projects demonstrating EMICODE development standards
export const TEMPLATE_PROJECTS: Project[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    title: 'نموذج موقع عيادة أسنان وحجز مواعيد',
    slug: 'demo-dental-clinic',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0002',
    serviceTitle: 'أنظمة حجز المواعيد والخدمات',
    shortDescription: 'مثال توضيحي متكامل لموقع عيادة طبية وجراحة أسنان يشمل استعراض الخدمات، جدول الأطباء، ونظام حجز مواعيد مرن.',
    description: `نموذج تجريبي ومثال توضيحي يبرز معايير تصميم وتطوير المواقع الطبية ومراكز طب الأسنان المتخصصة.

أبرز الميزات والوظائف المعروضة في النموذج:
- استعراض العيادات التخصصية (طب الأسنان التجميلي، التقويم، زراعة الأسنان، وطب أسنان الأطفال).
- واجهة حجز مواعيد ذكية تتيح للزائر تحديد الطبيب المعالج واليوم والوقت المتاح بدقة.
- استعراض الكوادر الطبية والمؤهلات العلمية وسنوات الخبرة لكل طبيب.
- جدول زمني تفاعلي لتسهيل إدارة أوقات الاستشارات الطبية وتقليل فترات الانتظار.
- استعراض أسعار الخدمات والعروض وإرشادات ما بعد العلاج.
- تصميم متجاوب فائق السرعة يعمل بسلاسة تامة على الهواتف الذكية والأجهزة اللوحية.

ملاحظة: هذا العمل نموذج تجريبي استرشادي يوضح جودة الواجهات وهندسة الحجز، ويمكن تخصيصه وربطه بقواعد بياناتك ونظام عيادتك الفعلي.`,
    category: 'booking',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Calendar Booking', 'REST APIs', 'Node.js'],
    coverImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80'
    ],
    liveUrl: null,
    githubUrl: null,
    status: 'prototype',
    isTemplate: true,
    featured: true,
    sortOrder: 1,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z'
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    title: 'نموذج موقع قاعة مناسبات ومؤتمرات',
    slug: 'demo-event-hall',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0001',
    serviceTitle: 'مواقع الشركات والأنشطة التجارية',
    shortDescription: 'مثال توضيحي لموقع تسويقي لقاعات الأفراح والمؤتمرات يبرز معارض الصور التفاعلية، باقات الخدمات، ونظام الاستعلام عن التواريخ.',
    description: `نموذج تجريبي ومثال توضيحي يوضح حلول التجربة الرقمية لقطاع الضيافة وقاعات المناسبات ومراكز الفعاليات الكبرى.

أبرز الميزات والوظائف المعروضة في النموذج:
- معرض صور بانورامي عالي الدقة يستعرض تجهيزات القاعة الكبرى، أجنحة كبار الشخصيات، والديكورات المتنوعة.
- تفاصيل باقات المناسبات (حفلات الزفاف، المؤتمرات، المعارض، الاجتماعات الرسمية) مع خيارات التخصيص.
- نظام تقويم تفاعلي للاستعلام الأولي عن التواريخ والأيام المتاحة قبل التواصل.
- نموذج طلب معاينة ميدانية وحجز مسبق مع ربط مباشر بقنوات التواصل السريع واتساب.
- أقسام مخصصة لخدمات الضيافة والتجهيزات الصوتية والمرئية والإضاءة الذكية.
- سرعة تحميل محسنة مع تأثيرات بصرية جذابة تبرز فخامة القاعة على كافة الشاشات.

ملاحظة: هذا العمل نموذج تجريبي استرشادي يوضح جودة العرض البصري وتجربة المستخدم، ويمكن تنفيذه وتكييفه بالكامل لأي قاعة أو مركز فعاليات.`,
    category: 'web',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Interactive Gallery', 'Booking Engine', 'Vite'],
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'
    ],
    liveUrl: null,
    githubUrl: null,
    status: 'prototype',
    isTemplate: true,
    featured: true,
    sortOrder: 2,
    createdAt: '2026-03-02T10:00:00.000Z',
    updatedAt: '2026-03-02T10:00:00.000Z'
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    title: 'نموذج موقع تجاري لمعارض السيارات',
    slug: 'demo-car-dealership',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0001',
    serviceTitle: 'مواقع الشركات والأنشطة التجارية',
    shortDescription: 'مثال توضيحي لمنصة استعراض وتجارة سيارات مع محرك تصفية متقدم بالموديل والميزانية، ومواصفات فنية وقنوات تواصل سريعة.',
    description: `نموذج تجريبي ومثال توضيحي يجسد معمارية منصات تجارة وعرض السيارات للوكالات والمعارض والموزعين المعتمدين.

أبرز الميزات والوظائف المعروضة في النموذج:
- محرك تصفية وبحث لحظي متقدم حسب الشركة المصنعة، سنة الصنع، الفئة، ناقل الحركة، ونطاق السعر.
- بطاقات سيارات تفاعلية توضح المواصفات الفنية الكاملة، المسافة المقطوعة، وسجل الفحص الفني.
- حاسبة تمويل وتقسيط مالي تقديرية تسهل للعميل مقارنة خطط الدفع المتاحة.
- زر حجز موعد لتجربة القيادة (Test Drive) أو التواصل الفوري مع قسم المبيعات عبر واتساب.
- ميزة مقارنة المواصفات بين سيارتين لمساعدة المشتري في اتخاذ القرار.
- معمارية مهيأة للربط مع قواعد بيانات المخزون المركزي وسجلات المركبات.

ملاحظة: هذا العمل نموذج تجريبي استرشادي يعكس مرونة التصفية وهندسة البيانات، ويمكن ربطه بأنظمة إدارة المعارض (DMS) الخاصة بك.`,
    category: 'commercial',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Filters Engine', 'PostgreSQL Ready', 'Node.js'],
    coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    liveUrl: null,
    githubUrl: null,
    status: 'prototype',
    isTemplate: true,
    featured: true,
    sortOrder: 3,
    createdAt: '2026-03-03T10:00:00.000Z',
    updatedAt: '2026-03-03T10:00:00.000Z'
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    title: 'نموذج تطبيق مهام وإنتاجية Flutter',
    slug: 'demo-flutter-task-app',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0004',
    serviceTitle: 'تطبيقات الهاتف عبر Flutter',
    shortDescription: 'مثال توضيحي لتطبيق جوال لإدارة المهام اليومية والمشاريع بواجهات عصرية وتخزين محلي لنظامي iOS وAndroid.',
    description: `نموذج تجريبي ومثال توضيحي يبرز إمكانيات تطوير تطبيقات الهواتف الذكية العابرة للمنصات عبر إطار عمل Flutter وDart.

أبرز الميزات والوظائف المعروضة في النموذج:
- واجهات مستخدم متقنة مع حركات سلسة ودعم كامل للوضع الداكن (Dark Mode) والوضع الفاتح.
- تصنيف المهام حسب الأولوية، المشاريع، والوسوم، مع دعم السحب لتحديث الحالة (Drag & Drop).
- بنية تخزين محلي آمن تعمل بدون اتصال بالإنترنت (Offline-First) مع مزامنة سحابية عند التوفر.
- لوحة إحصائيات بصرية تتابع مؤشرات الإنجاز الأسبوعي واليومي للتركيز على الإنتاجية.
- تنبيهات محلية وإشعارات مجدولة للمهام العاجلة والمواعيد النهائية.
- كود نظيف مبني وفق Clean Architecture وBLoC/Provider لسهولة التوسع والصيانة.

ملاحظة: هذا العمل نموذج تجريبي استرشادي يوضح دقة تصميم التطبيقات المتنقلة وأداءها العالي، ويمكن تحويله لتطبيق متكامل يلبي نشاطك.`,
    category: 'mobile',
    technologies: ['Flutter', 'Dart', 'Clean Architecture', 'Local Storage', 'State Management', 'Cross-Platform'],
    coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=1200&q=80'
    ],
    liveUrl: null,
    githubUrl: null,
    status: 'prototype',
    isTemplate: true,
    featured: true,
    sortOrder: 4,
    createdAt: '2026-03-04T10:00:00.000Z',
    updatedAt: '2026-03-04T10:00:00.000Z'
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    title: 'نموذج لوحة تحكم إدارية ونظام SaaS لإدارة المبيعات والاشتراكات',
    slug: 'demo-saas-admin-dashboard',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0003',
    serviceTitle: 'لوحات التحكم الإدارية وأنظمة SaaS',
    shortDescription: 'مثال توضيحي للوحة تحكم سحابية متقدمة (Dashboard) لإدارة عمليات الشركات واشتراكات العملاء والتحليلات البيانية المعقدة.',
    description: `نموذج تجريبي ومثال توضيحي يجسد معايير بناء أنظمة SaaS ولوحات التحكم الإدارية الاحترافية للشركات والمؤسسات.

أبرز الميزات والوظائف المعروضة في النموذج:
- نظام صلاحيات وأدوار متعدد المستويات (RBAC) لإدارة الموظفين والمدراء وتدقيق سجل العمليات.
- رسوم بيانية ومؤشرات أداء تفاعلية (KPIs) تتابع نمو الإيرادات ومعدلات التحويل والنشاط اليومي.
- وحدة إدارة العملاء وفواتير الاشتراكات الشهرية والسنوية مع تصدير التقارير بصيغ PDF وExcel.
- تنبيهات فورية للأحداث الهامة وتغيرات البيانات في الوقت الفعلي (Real-Time Notifications).
- واجهات تحكم سريعة الاستجابة مع دعم كامل للشاشات المختلفة وتخصيص الأعمدة والجداول.
- هيكلية برمجية مهيأة للربط المباشر مع واجهات RESTful APIs وقواعد بيانات PostgreSQL.

ملاحظة: هذا العمل نموذج تجريبي استرشادي يوضح جودة هندسة لوحات التحكم، ويمكن تخصيصه وربطه بنظام إدارة أعمالك وخدماتك السحابية.`,
    category: 'saas',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'PostgreSQL', 'Express', 'RBAC'],
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80'
    ],
    liveUrl: null,
    githubUrl: null,
    status: 'prototype',
    isTemplate: true,
    featured: true,
    sortOrder: 5,
    createdAt: '2026-03-05T10:00:00.000Z',
    updatedAt: '2026-03-05T10:00:00.000Z'
  },
  {
    id: '10000000-0000-0000-0000-000000000006',
    title: 'نموذج تطبيق ويب تفاعلي سريع React Single Page App',
    slug: 'demo-react-spa-web-app',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0005',
    serviceTitle: 'تطبيقات React وSingle Page Apps',
    shortDescription: 'مثال توضيحي لتطبيق ويب أحادي الصفحة (SPA) تفاعلي عالي الأداء مع تنقل فوري بدون إعادة تحميل وإدارة حالة متقدمة.',
    description: `نموذج تجريبي ومثال توضيحي يبرز قدرات بناء تطبيقات الويب الحديثة أحادية الصفحة باستخدام أحدث معايير React وTypeScript.

أبرز الميزات والوظائف المعروضة في النموذج:
- تجربة مستخدم فائقة الانسيابية (Zero Page Reload) مع انتقال ذكي وسريع بين التبويبات والصفحات.
- إدارة حالة مركزية مرنة (State Management) تدعم التخزين المؤقت للبيانات وتحديث الواجهة اللحظي.
- واجهات مستخدم متقدمة مع مكونات Modular قابلة لإعادة الاستخدام والتشغيل السلس.
- دعم كامل لتعدد اللغات (i18n) مع التبديل الفوري بين العربية (RTL) والإنجليزية (LTR).
- تكامل ذكي مع الـ Web APIs لتسريع معالجة البيانات وتوفير استهلاك موارد المتصفح.
- بنية أكواد منسقة ومعيارية تسهل عمليات الصيانة والتوسع المستقبلي.

ملاحظة: هذا العمل نموذج تجريبي استرشادي يوضح سلاسة الواجهات وسرعة الأداء في تطبيقات الويب الحديثة.`,
    category: 'web',
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'Zustand', 'SPA Router'],
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80'
    ],
    liveUrl: null,
    githubUrl: null,
    status: 'prototype',
    isTemplate: true,
    featured: true,
    sortOrder: 6,
    createdAt: '2026-03-06T10:00:00.000Z',
    updatedAt: '2026-03-06T10:00:00.000Z'
  },
  {
    id: '10000000-0000-0000-0000-000000000007',
    title: 'نموذج بنية تكامل RESTful APIs وقواعد بيانات موثوقة',
    slug: 'demo-api-database-architecture',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0006',
    serviceTitle: 'قواعد البيانات وربط الأنظمة APIs',
    shortDescription: 'مثال توضيحي لبنية تحتية للواجهات البرمجية وتصميم قواعد بيانات علائقية سحابية مع توثيق Swagger وتأمين الاتصالات.',
    description: [
      'نموذج تجريبي ومثال توضيحي يبرز معمارية الخدمات الخلفية وقواعد البيانات المصممة للتعامل مع آلاف الطلبات المتزامنة بأمان.',
      '',
      'أبرز الميزات والوظائف المعروضة في النموذج:',
      '- تصميم مخططات قواعد بيانات PostgreSQL علائقية محسنة مع الفهارس والعلاقات الخارجية الصارمة.',
      '- بناء واجهات RESTful موثقة بالكامل (Swagger / OpenAPI) تدعم التحقق الدقيق من المدخلات (Data Validation).',
      '- تأمين طبقات الاتصال باستخدام JWT Tokens، سياسات Rate Limiting، ومفاتيح API المشفرة.',
      '- آليات معالجة وتدقيق الأخطاء المركزية وتسجيل النشاطات (Auditing & Error Handling).',
      '- جاهزية الربط السلس مع بوابات الدفع الإلكتروني، إرسال الرسائل القصيرة SMS، والأنظمة البنكية.',
      '- دعم الاتصال المباشر والمجمع عبر Connection Pooling لتحقيق أفضل زمن استجابة.',
      '',
      'ملاحظة: هذا العمل نموذج تجريبي استرشادي يوضح هندسة الاتصالات وقواعد البيانات، ويمكن توظيفه لتشغيل خدمات تطبيقك بكفاءة.'
    ].join('\n'),
    category: 'api',
    technologies: ['Node.js', 'PostgreSQL', 'Neon DB', 'Prisma ORM', 'JWT', 'RESTful API', 'Zod'],
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1200&q=80'
    ],
    liveUrl: null,
    githubUrl: null,
    status: 'prototype',
    isTemplate: true,
    featured: true,
    sortOrder: 7,
    createdAt: '2026-03-07T10:00:00.000Z',
    updatedAt: '2026-03-07T10:00:00.000Z'
  },
  {
    id: '10000000-0000-0000-0000-000000000008',
    title: 'نموذج خط إنتاج ونشر سحابي CI/CD وحاويات Docker',
    slug: 'demo-cloud-devops-infrastructure',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0007',
    serviceTitle: 'النشر السحابي، DevOps والصيانة',
    shortDescription: 'مثال توضيحي لبيئة نشر سحابية مؤتمتة بحاويات Docker وخطوط فحص تلقائي للكود ومراقبة مستمرة للأمان ووقت التشغيل.',
    description: `نموذج تجريبي ومثال توضيحي يجسد منظومة DevOps الاحترافية لضمان الاستقرار والأمان وسرعة الإطلاق في البيئات الإنتاجية.

أبرز الميزات والوظائف المعروضة في النموذج:
- إعداد بيئة حاويات Docker متعددة المراحل (Multi-stage Builds) لتقليل حجم الصور وزيادة سرعة الإقلاع.
- خطوط أنابيب التكامل المستمر والنشر المؤتمت (CI/CD Pipelines) لفحص الأخطاء والنشر التلقائي عند التحديث.
- تكوين خوادم Linux Nginx العكسية مع شهادات أمان SSL/TLS مشفرة ومتجددة تلقائيًا.
- استراتيجيات نشر بدون توقف الخدمة (Zero-Downtime Deployment) على بيئات السحاب المختلفة.
- لوحات مراقبة صحة الخوادم واستهلاك الموارد وسجلات التشغيل في الوقت الفعلي.
- سياسات نسخ احتياطي دورية لقواعد البيانات مع اختبارات الاستعادة لضمان سلامة البيانات.

ملاحظة: هذا العمل نموذج تجريبي استرشادي يوضح ممارسات هندسة النشر والأمان السحابي، ويمكن تجهيزه لمشاريعك ومؤسستك.`,
    category: 'devops',
    technologies: ['Docker', 'CI/CD Pipelines', 'Linux Nginx', 'Vercel / Cloud Run', 'SSL/TLS', 'Health Monitoring'],
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
    ],
    liveUrl: null,
    githubUrl: null,
    status: 'prototype',
    isTemplate: true,
    featured: true,
    sortOrder: 8,
    createdAt: '2026-03-08T10:00:00.000Z',
    updatedAt: '2026-03-08T10:00:00.000Z'
  }
];

const SEED_SERVICES: Service[] = [
  {
    id: '2b829e92-36fb-48a5-8be5-6132fb7a0001',
    title: 'مواقع الشركات والأنشطة التجارية',
    description: 'تصميم وبرمجة مواقع احترافية سريعة ومتجاوبة تعكس هوية شركتك وتجذب العملاء، مهيأة بالكامل لمحركات البحث (SEO).',
    icon: 'Globe',
    isActive: true,
    sortOrder: 1
  },
  {
    id: '2b829e92-36fb-48a5-8be5-6132fb7a0002',
    title: 'أنظمة حجز المواعيد والخدمات',
    description: 'بناء منصات حجز تفاعلية للعيادات، المكاتب الاستشارية، ومراكز التدريب مع تكامل التقويمات وبوابات الدفع الإلكتروني.',
    icon: 'Calendar',
    isActive: true,
    sortOrder: 2
  },
  {
    id: '2b829e92-36fb-48a5-8be5-6132fb7a0003',
    title: 'لوحات التحكم الإدارية وأنظمة SaaS',
    description: 'تطوير Dashboard حديثة وقوية لإدارة البيانات، المبيعات، صلاحيات المستخدمين، والتقارير الرسومية التحليلية المعقدة.',
    icon: 'LayoutDashboard',
    isActive: true,
    sortOrder: 3
  },
  {
    id: '2b829e92-36fb-48a5-8be5-6132fb7a0004',
    title: 'تطبيقات الهاتف عبر Flutter',
    description: 'برمجة تطبيقات هاتف ذكي أصلية لنظامي iOS وAndroid بكود موحد وسرعة فائقة وأحدث معايير تجربة المستخدم.',
    icon: 'Smartphone',
    isActive: true,
    sortOrder: 4
  },
  {
    id: '2b829e92-36fb-48a5-8be5-6132fb7a0005',
    title: 'تطبيقات React وSingle Page Apps',
    description: 'هندسة واجهات أمامية تفاعلية فائقة السرعة باستخدام React وTypeScript مع أفضل ممارسات State Management والأداء.',
    icon: 'Code2',
    isActive: true,
    sortOrder: 5
  },
  {
    id: '2b829e92-36fb-48a5-8be5-6132fb7a0006',
    title: 'قواعد البيانات وربط الأنظمة APIs',
    description: 'تصميم وتأمين قواعد بيانات PostgreSQL وNeon، وبناء RESTful APIs وWebhooks لربط الأنظمة الخارجية والمصرفية بسلاسة.',
    icon: 'Database',
    isActive: true,
    sortOrder: 6
  },
  {
    id: '2b829e92-36fb-48a5-8be5-6132fb7a0007',
    title: 'النشر السحابي، DevOps والصيانة',
    description: 'نشر المشاريع على Vercel، Cloud Run وDocker، إعداد خطوط CI/CD التلقائية، وتقديم خطط مراقبة وصيانة مستمرة للأمان.',
    icon: 'CloudUpload',
    isActive: true,
    sortOrder: 7
  }
];


type CatalogProjectInput = Omit<
  Project,
  'id' | 'createdAt' | 'updatedAt' | 'gallery' | 'githubUrl' | 'featured' | 'sortOrder' | 'isTemplate'
> & Partial<Pick<Project, 'gallery' | 'githubUrl' | 'featured' | 'sortOrder' | 'isTemplate'>>;

const makeCatalogProject = (id: string, project: CatalogProjectInput): Project => ({
  ...project,
  id,
  gallery: project.gallery ?? [project.coverImage],
  githubUrl: project.githubUrl ?? null,
  featured: project.featured ?? true,
  sortOrder: project.sortOrder ?? 0,
  isTemplate: project.isTemplate ?? false,
  createdAt: '2026-10-13T10:00:00.000Z',
  updatedAt: '2026-10-13T10:00:00.000Z'
});

const vercelProjectId = (index: number) =>
  '20000000-0000-4000-8000-' + String(index).padStart(12, '0');

const serviceTemplateId = (index: number) =>
  '30000000-0000-4000-8000-' + String(index).padStart(12, '0');

// Deployments discovered in the connected Vercel account. Links use the verified
// production domains registered for each Vercel project.
export const VERCEL_SHOWCASE_PROJECTS: Project[] = [
  makeCatalogProject(vercelProjectId(1), {
    title: 'EMICODE — منصة معرض الأعمال والإدارة',
    slug: 'vercel-emiengcode',
    shortDescription: 'منصة EMICODE لعرض الأعمال والخدمات واستقبال طلبات العملاء وإدارتها.',
    description: 'المشروع الأساسي لمنصة EMICODE، ويجمع معرض الأعمال والخدمات وطلبات التواصل ولوحة الإدارة ونظام الإشعارات.',
    category: 'saas',
    technologies: ['React', 'TypeScript', 'Vite', 'Node.js', 'Neon PostgreSQL', 'Vercel'],
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://emiengcode.vercel.app/',
    status: 'in_development',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0003',
    serviceTitle: 'لوحات التحكم الإدارية وأنظمة SaaS',
    isTemplate: false,
    sortOrder: 101
  }),
  makeCatalogProject(vercelProjectId(4), {
    title: 'EMICODE Portfolio — النسخة العربية',
    slug: 'vercel-emicodin',
    shortDescription: 'نسخة عربية من معرض أعمال EMICODE منشورة على Vercel.',
    description: 'نسخة إضافية من موقع معرض الأعمال؛ تم إدراجها بشكل مستقل كما تظهر في مشاريع Vercel.',
    category: 'web',
    technologies: ['React', 'TypeScript', 'Vite', 'Vercel'],
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://emicodin.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0005',
    serviceTitle: 'تطبيقات React وSingle Page Apps',
    isTemplate: false,
    sortOrder: 104
  }),
  makeCatalogProject(vercelProjectId(5), {
    title: 'عيادة د. كيس — موقع عيادة وحجز',
    slug: 'vercel-clinic-dr-kisss',
    shortDescription: 'موقع عيادة أسنان مع تجربة رقمية مخصصة للمراجعين.',
    description: 'مشروع عيادة منشور على Vercel؛ صُنّف ضمن أنظمة الحجز والخدمات الطبية.',
    category: 'booking',
    technologies: ['React', 'TypeScript', 'Vercel', 'Responsive UI'],
    coverImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://clinic-dr-kisss.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0002',
    serviceTitle: 'أنظمة حجز المواعيد والخدمات',
    isTemplate: false,
    sortOrder: 105
  }),
  makeCatalogProject(vercelProjectId(6), {
    title: 'الأمارة للسيارات — معرض سيارات رقمي',
    slug: 'vercel-alomara-car-concept',
    shortDescription: 'واجهة ويب لمعرض سيارات وعرض المركبات.',
    description: 'مشروع معرض سيارات منشور على Vercel، مدرج ضمن مواقع الأنشطة التجارية.',
    category: 'commercial',
    technologies: ['React', 'TypeScript', 'Vercel', 'Responsive UI'],
    coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://alomara-car-concept.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0001',
    serviceTitle: 'مواقع الشركات والأنشطة التجارية',
    isTemplate: false,
    sortOrder: 106
  }),
  makeCatalogProject(vercelProjectId(7), {
    title: 'قاعة ذو ريدان',
    slug: 'vercel-hallduridaann',
    shortDescription: 'موقع تعريفي لقاعة مناسبات مع تجربة طلب الحجز.',
    description: 'مشروع قاعة مناسبات منشور على Vercel؛ صُنّف ضمن أنظمة الحجز والخدمات.',
    category: 'booking',
    technologies: ['React', 'TypeScript', 'Vercel', 'Booking UI'],
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://hallduridaann.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0002',
    serviceTitle: 'أنظمة حجز المواعيد والخدمات',
    isTemplate: false,
    sortOrder: 107
  }),
  makeCatalogProject(vercelProjectId(8), {
    title: 'عيادة الأسنان — نسخة موقع وحجوزات',
    slug: 'vercel-clinicdr-kis',
    shortDescription: 'نسخة إضافية لمشروع موقع العيادة على Vercel.',
    description: 'نسخة منفصلة مسجلة في Vercel لمشروع موقع عيادة؛ أُدرجت دون افتراض تفاصيل غير ظاهرة عن الميزات.',
    category: 'booking',
    technologies: ['React', 'TypeScript', 'Vercel'],
    coverImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://clinicdr-kis.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0002',
    serviceTitle: 'أنظمة حجز المواعيد والخدمات',
    isTemplate: false,
    sortOrder: 108
  }),
  makeCatalogProject(vercelProjectId(9), {
    title: 'عيادة كيس — نسخة تصميم طبي',
    slug: 'vercel-clinickisss',
    shortDescription: 'نسخة منشورة أخرى من مشروع عيادة الأسنان.',
    description: 'مشروع عيادة منفصل مسجل في Vercel، ويظهر هنا كعنصر مستقل حتى يمكن إدارة رابط كل نسخة.',
    category: 'booking',
    technologies: ['React', 'TypeScript', 'Vercel'],
    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://clinickisss.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0002',
    serviceTitle: 'أنظمة حجز المواعيد والخدمات',
    isTemplate: false,
    sortOrder: 109
  }),
  makeCatalogProject(vercelProjectId(10), {
    title: 'Holly Quran Children — الموقع الرئيسي',
    slug: 'vercel-hollyqranchildren',
    shortDescription: 'موقع موجه للأطفال أو التعليم كما يشير اسم مشروع Vercel.',
    description: 'مشروع منشور مستقل؛ رُبط بخدمة المواقع التجارية بشكل مبدئي ويمكن تعديل فئته ووصفه بعد مراجعة المحتوى الفعلي.',
    category: 'web',
    technologies: ['React', 'TypeScript', 'Vercel'],
    coverImage: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://hollyqranchildren.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0001',
    serviceTitle: 'مواقع الشركات والأنشطة التجارية',
    isTemplate: false,
    sortOrder: 110
  }),
  makeCatalogProject(vercelProjectId(11), {
    title: 'Holly Quran Children — نسخة بديلة',
    slug: 'vercel-hollyqranchildren-sgv9',
    shortDescription: 'نسخة إضافية مسجلة في Vercel للموقع الموجه للأطفال.',
    description: 'نسخة منفصلة مسجلة في Vercel، أُدرجت كما هي لتجنب إسقاط أي مشروع من القائمة.',
    category: 'web',
    technologies: ['React', 'TypeScript', 'Vercel'],
    coverImage: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://hollyqranchildren-sgv9.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0001',
    serviceTitle: 'مواقع الشركات والأنشطة التجارية',
    isTemplate: false,
    sortOrder: 111
  }),
  makeCatalogProject(vercelProjectId(12), {
    title: 'قاعة مناسبات — Hall Rduridan',
    slug: 'vercel-hallrduridan',
    shortDescription: 'نسخة موقع قاعة مناسبات مسجلة على Vercel.',
    description: 'مشروع قاعة مناسبات إضافي مع رابط النشر المسجل في Vercel.',
    category: 'booking',
    technologies: ['React', 'TypeScript', 'Vercel', 'Booking UI'],
    coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://hallrduridan.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0002',
    serviceTitle: 'أنظمة حجز المواعيد والخدمات',
    isTemplate: false,
    sortOrder: 112
  }),
  makeCatalogProject(vercelProjectId(13), {
    title: 'قاعة مناسبات — Hall Ridann',
    slug: 'vercel-hallridann',
    shortDescription: 'نسخة أخرى لموقع قاعة مناسبات مسجلة في Vercel.',
    description: 'مشروع مستقل في Vercel ضمن قطاع القاعات والحجوزات.',
    category: 'booking',
    technologies: ['React', 'TypeScript', 'Vercel', 'Booking UI'],
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://hallridann.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0002',
    serviceTitle: 'أنظمة حجز المواعيد والخدمات',
    isTemplate: false,
    sortOrder: 113
  }),
  makeCatalogProject(vercelProjectId(14), {
    title: 'الشيباني — موقع نشاط تجاري',
    slug: 'vercel-alshibani',
    shortDescription: 'موقع نشاط تجاري مسجل في حساب Vercel.',
    description: 'مشروع باسم الشيباني؛ جرى ربطه بخدمة المواقع التجارية مبدئيًا، ويمكن تحسين العنوان والوصف بعد مراجعة محتوى الموقع.',
    category: 'commercial',
    technologies: ['React', 'TypeScript', 'Vercel'],
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://alshibani.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0001',
    serviceTitle: 'مواقع الشركات والأنشطة التجارية',
    isTemplate: false,
    sortOrder: 114
  }),
  makeCatalogProject(vercelProjectId(15), {
    title: 'EMICODE Portfolio — نسخة 2LPM',
    slug: 'vercel-emicode-2lpm',
    shortDescription: 'نسخة إضافية من معرض EMICODE مسجلة في Vercel.',
    description: 'نسخة مستقلة من معرض أعمال EMICODE. أُدرجت منفصلة لأنها تظهر كمشروع مستقل في حساب Vercel.',
    category: 'web',
    technologies: ['React', 'TypeScript', 'Vercel'],
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://emicode-2lpm.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0005',
    serviceTitle: 'تطبيقات React وSingle Page Apps',
    isTemplate: false,
    sortOrder: 115
  }),
  makeCatalogProject(vercelProjectId(16), {
    title: 'EMICODE Portfolio — نسخة F9DW',
    slug: 'vercel-emicode-f9dw',
    shortDescription: 'نسخة مستقلة إضافية من معرض أعمال EMICODE.',
    description: 'نسخة مسجلة بمشروع مستقل في Vercel؛ احتُفظ بها ضمن القائمة الشاملة.',
    category: 'web',
    technologies: ['React', 'TypeScript', 'Vercel'],
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://emicode-f9dw.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0005',
    serviceTitle: 'تطبيقات React وSingle Page Apps',
    isTemplate: false,
    sortOrder: 116
  }),
  makeCatalogProject(vercelProjectId(17), {
    title: 'EMICODE — نسخة emicode-nu',
    slug: 'vercel-emicode-main-variant',
    shortDescription: 'نسخة EMICODE المنشورة على النطاق emicode-nu.vercel.app.',
    description: 'نطاق الإنتاج المرتبط بمشروع Vercel المسمى emicode؛ أُدرج بالرابط الفعلي المسجل بدل افتراض اسم نطاق مختلف.',
    category: 'web',
    technologies: ['React', 'TypeScript', 'Vercel'],
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://emicode-nu.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0005',
    serviceTitle: 'تطبيقات React وSingle Page Apps',
    isTemplate: false,
    sortOrder: 117
  }),
  makeCatalogProject(vercelProjectId(18), {
    title: 'EMICODE Portfolio — نسخة FWXD',
    slug: 'vercel-emicode-fwxd',
    shortDescription: 'نسخة إضافية من معرض الأعمال مسجلة في Vercel.',
    description: 'نسخة منفصلة ضمن مشاريع Vercel تم الاحتفاظ بها في المعرض بناءً على طلب إدراج جميع المشاريع.',
    category: 'web',
    technologies: ['React', 'TypeScript', 'Vercel'],
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://emicode-fwxd.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0005',
    serviceTitle: 'تطبيقات React وSingle Page Apps',
    isTemplate: false,
    sortOrder: 118
  }),
  makeCatalogProject(vercelProjectId(19), {
    title: 'EMICODE Portfolio — نسخة EOLR',
    slug: 'vercel-emicode-eolr',
    shortDescription: 'نسخة إضافية من موقع EMICODE محفوظة كمشروع مستقل.',
    description: 'مشروع Vercel منفصل باسم emicode-eolr أُدرج ضمن الأعمال مع رابط النشر المطابق له.',
    category: 'web',
    technologies: ['React', 'TypeScript', 'Vercel'],
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://emicode-eolr.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0005',
    serviceTitle: 'تطبيقات React وSingle Page Apps',
    isTemplate: false,
    sortOrder: 119
  }),
  makeCatalogProject(vercelProjectId(20), {
    title: 'قاعة ثوريدان — موقع مناسبات',
    slug: 'vercel-thoridan',
    shortDescription: 'مشروع قاعة مناسبات منشور على Vercel.',
    description: 'مشروع ضمن قطاع القاعات والمناسبات؛ أُضيف إلى قسم الحجوزات مع رابط النشر المسجل.',
    category: 'booking',
    technologies: ['React', 'TypeScript', 'Vercel', 'Booking UI'],
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://thoridan.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0002',
    serviceTitle: 'أنظمة حجز المواعيد والخدمات',
    isTemplate: false,
    sortOrder: 120
  }),
  makeCatalogProject(vercelProjectId(21), {
    title: 'قاعة ريدان — موقع مناسبات',
    slug: 'vercel-hallridan',
    shortDescription: 'مشروع آخر لقاعة مناسبات يظهر ضمن مشاريع Vercel.',
    description: 'مشروع قاعة إضافي مع رابط النشر المسجل، محفوظ بشكل مستقل عن النسخ الأخرى.',
    category: 'booking',
    technologies: ['React', 'TypeScript', 'Vercel', 'Booking UI'],
    coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://hallridan.vercel.app/',
    status: 'completed',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0002',
    serviceTitle: 'أنظمة حجز المواعيد والخدمات',
    isTemplate: false,
    sortOrder: 121
  })
];

// Two more starter projects for every service. These are explicitly templates,
// not claims that these example products have already been deployed.
export const SERVICE_TEMPLATE_PROJECTS: Project[] = [
  makeCatalogProject(serviceTemplateId(1), {
    title: 'موقع شركة سياحة وسفر وحج وعمرة',
    slug: 'demo-travel-hajj-umrah',
    shortDescription: 'نموذج موقع لشركة سياحة يعرض البرامج والباقات ووسائل التواصل والحجز المبدئي.',
    description: 'قالب استرشادي لموقع شركة سفر وحج وعمرة، مع أقسام للرحلات والباقات والأسئلة الشائعة ونموذج طلب استشارة. هذا نموذج غير منشور ويمكن تخصيصه للعميل.',
    category: 'web',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'SEO', 'Responsive Design'],
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    liveUrl: null,
    status: 'prototype',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0001',
    serviceTitle: 'مواقع الشركات والأنشطة التجارية',
    isTemplate: true,
    sortOrder: 201
  }),
  makeCatalogProject(serviceTemplateId(2), {
    title: 'موقع متجر إلكتروني للمنتجات المحلية',
    slug: 'demo-local-online-store',
    shortDescription: 'نموذج متجر بواجهات للمنتجات وتصنيفاتها وسلة شراء ووسائل تواصل.',
    description: 'قالب تصوري لمتجر إلكتروني يمكن توصيله لاحقًا بمخزون وقاعدة بيانات ونظام دفع مناسب. ليس متجرًا حيًا ولا يعالج مدفوعات حقيقية.',
    category: 'commercial',
    technologies: ['React', 'TypeScript', 'Catalog UI', 'Cart Prototype'],
    coverImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
    liveUrl: null,
    status: 'prototype',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0001',
    serviceTitle: 'مواقع الشركات والأنشطة التجارية',
    isTemplate: true,
    sortOrder: 202
  }),
  makeCatalogProject(serviceTemplateId(3), {
    title: 'نظام حجز عيادة مع لوحة إدارة',
    slug: 'demo-clinic-booking-admin',
    shortDescription: 'نموذج مسار لحجز المواعيد وإدارة الطلبات من لوحة تحكم.',
    description: 'قالب أولي لحجز عيادة يشمل الخدمات والتقويم وقائمة الطلبات وحالات الموافقة. يتطلب ربط قاعدة بيانات وإعداد صلاحيات قبل الاستخدام الفعلي.',
    category: 'booking',
    technologies: ['React', 'TypeScript', 'Calendar UI', 'Admin Dashboard'],
    coverImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    liveUrl: null,
    status: 'prototype',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0002',
    serviceTitle: 'أنظمة حجز المواعيد والخدمات',
    isTemplate: true,
    sortOrder: 203
  }),
  makeCatalogProject(serviceTemplateId(4), {
    title: 'نظام حجز قاعة مناسبات',
    slug: 'demo-event-hall-booking',
    shortDescription: 'نموذج لعرض القاعة والباقات وتقديم طلب حجز حسب التاريخ.',
    description: 'قالب لقاعة مناسبات يعرض الصور والباقات ويجمع بيانات طلب الحجز. يحتاج ربطًا فعليًا بالتخزين والإشعارات قبل اعتماده.',
    category: 'booking',
    technologies: ['React', 'TypeScript', 'Calendar Booking', 'WhatsApp CTA'],
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    liveUrl: null,
    status: 'prototype',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0002',
    serviceTitle: 'أنظمة حجز المواعيد والخدمات',
    isTemplate: true,
    sortOrder: 204
  }),
  makeCatalogProject(serviceTemplateId(5), {
    title: 'لوحة CRM لإدارة العملاء والمبيعات',
    slug: 'demo-crm-sales-dashboard',
    shortDescription: 'واجهة تجريبية لمتابعة العملاء والفرص والمبيعات والمؤشرات.',
    description: 'قالب لوحة تحكم لإدارة العملاء وسجل التواصل والفرص ومؤشرات المبيعات. بياناته توضيحية فقط ولا تحتوي على نظام إنتاج أو بيانات حقيقية.',
    category: 'saas',
    technologies: ['React', 'TypeScript', 'Dashboard UI', 'Charts', 'RBAC Ready'],
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    liveUrl: null,
    status: 'prototype',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0003',
    serviceTitle: 'لوحات التحكم الإدارية وأنظمة SaaS',
    isTemplate: true,
    sortOrder: 205
  }),
  makeCatalogProject(serviceTemplateId(6), {
    title: 'لوحة مخزون وفواتير واشتراكات',
    slug: 'demo-inventory-subscriptions',
    shortDescription: 'نموذج لإدارة المنتجات والكميات والفواتير وحالة الاشتراك.',
    description: 'قالب أولي لمخزون ومبيعات واشتراكات يمكن ربطه بقاعدة بيانات ومستخدمين وصلاحيات بعد تطويره.',
    category: 'saas',
    technologies: ['React', 'TypeScript', 'PostgreSQL Ready', 'Reports'],
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    liveUrl: null,
    status: 'prototype',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0003',
    serviceTitle: 'لوحات التحكم الإدارية وأنظمة SaaS',
    isTemplate: true,
    sortOrder: 206
  }),
  makeCatalogProject(serviceTemplateId(7), {
    title: 'تطبيق Flutter لإدارة الطلبات',
    slug: 'demo-flutter-orders-mobile',
    shortDescription: 'تصور تطبيق هاتف لمتابعة الطلبات والحالات والإشعارات.',
    description: 'قالب تصور لتطبيق Flutter للأجهزة المحمولة يتابع حالة الطلبات ويعرض التنبيهات. يتطلب بناء تطبيق الهاتف وربطه بواجهة API قبل الاستخدام.',
    category: 'mobile',
    technologies: ['Flutter', 'Dart', 'BLoC', 'REST API'],
    coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
    liveUrl: null,
    status: 'prototype',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0004',
    serviceTitle: 'تطبيقات الهاتف عبر Flutter',
    isTemplate: true,
    sortOrder: 207
  }),
  makeCatalogProject(serviceTemplateId(8), {
    title: 'تطبيق Flutter للتوصيل والمندوبين',
    slug: 'demo-flutter-delivery',
    shortDescription: 'نموذج لتتبع حالة التوصيل والطلبات وملف المندوب.',
    description: 'قالب استرشادي لتطبيق توصيل متعدد الأدوار مع شاشة طلبات ومعلومات المندوب. الخرائط والإشعارات الحقيقية تحتاج تكاملات إضافية.',
    category: 'mobile',
    technologies: ['Flutter', 'Dart', 'Maps Integration Ready', 'Push Notifications Ready'],
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    liveUrl: null,
    status: 'prototype',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0004',
    serviceTitle: 'تطبيقات الهاتف عبر Flutter',
    isTemplate: true,
    sortOrder: 208
  }),
  makeCatalogProject(serviceTemplateId(9), {
    title: 'بوابة React متعددة اللغات',
    slug: 'demo-react-multilingual-portal',
    shortDescription: 'نموذج بوابة عربية وإنجليزية بدعم RTL وLTR والتنقل السريع.',
    description: 'قالب واجهة React متعددة اللغات مع تبديل اتجاه الصفحة ودعم الشاشات المختلفة. هذا نموذج واجهة غير متصل بخدمات إنتاجية.',
    category: 'web',
    technologies: ['React', 'TypeScript', 'i18n', 'RTL/LTR', 'Vite'],
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    liveUrl: null,
    status: 'prototype',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0005',
    serviceTitle: 'تطبيقات React وSingle Page Apps',
    isTemplate: true,
    sortOrder: 209
  }),
  makeCatalogProject(serviceTemplateId(10), {
    title: 'لوحة React لمتابعة العمليات لحظيًا',
    slug: 'demo-react-live-operations-dashboard',
    shortDescription: 'واجهة Dashboard لتجميع حالات الطلبات والتنبيهات والإحصاءات.',
    description: 'نموذج واجهة إدارية تفاعلية يوضح تصميم لوحة عمليات. التحديثات الحية والبيانات الحقيقية تحتاج إلى API وخدمات خلفية.',
    category: 'web',
    technologies: ['React', 'TypeScript', 'Charts', 'REST API Ready'],
    coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
    liveUrl: null,
    status: 'prototype',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0005',
    serviceTitle: 'تطبيقات React وSingle Page Apps',
    isTemplate: true,
    sortOrder: 210
  }),
  makeCatalogProject(serviceTemplateId(11), {
    title: 'REST API لإدارة العملاء والطلبات',
    slug: 'demo-customer-orders-api',
    shortDescription: 'تصور API منظم لإدارة العملاء والطلبات والتحقق من المدخلات.',
    description: 'قالب هندسي لواجهة REST API يوضح الموارد والبيانات والتحقق من المدخلات. ليس endpoint إنتاجيًا حتى يتم تنفيذه وتأمينه وربطه بقاعدة البيانات.',
    category: 'api',
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'Zod', 'REST API'],
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    liveUrl: null,
    status: 'prototype',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0006',
    serviceTitle: 'قواعد البيانات وربط الأنظمة APIs',
    isTemplate: true,
    sortOrder: 211
  }),
  makeCatalogProject(serviceTemplateId(12), {
    title: 'API للإشعارات وسجل الأحداث',
    slug: 'demo-notifications-events-api',
    shortDescription: 'نموذج لتخزين الإشعارات وحالات القراءة وسجل الأحداث.',
    description: 'تصور لخدمة إشعارات بمستلمين وأنواع وأوقات قراءة مع مفاتيح منع التكرار. يحتاج ربط قاعدة بيانات واختبارات صلاحيات قبل الاستخدام الفعلي.',
    category: 'api',
    technologies: ['Node.js', 'PostgreSQL', 'Notifications', 'REST API', 'Security'],
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    liveUrl: null,
    status: 'prototype',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0006',
    serviceTitle: 'قواعد البيانات وربط الأنظمة APIs',
    isTemplate: true,
    sortOrder: 212
  }),
  makeCatalogProject(serviceTemplateId(13), {
    title: 'خط نشر آلي CI/CD لمشروع ويب',
    slug: 'demo-web-ci-cd-pipeline',
    shortDescription: 'تصور خط نشر يشغّل فحص TypeScript والبناء قبل إطلاق النسخة.',
    description: 'نموذج لممارسات CI/CD يشمل تثبيت الاعتمادات وفحص الأنواع والبناء. يحتاج ضبط المستودع وبيئة النشر الخاصة بالمشروع.',
    category: 'devops',
    technologies: ['GitHub Actions', 'Vercel', 'TypeScript', 'CI/CD'],
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    liveUrl: null,
    status: 'prototype',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0007',
    serviceTitle: 'النشر السحابي، DevOps والصيانة',
    isTemplate: true,
    sortOrder: 213
  }),
  makeCatalogProject(serviceTemplateId(14), {
    title: 'مراقبة التطبيقات والنسخ الاحتياطي',
    slug: 'demo-cloud-monitoring-backups',
    shortDescription: 'نموذج خطة تشغيل لمراقبة صحة التطبيق وسلامة النسخ الاحتياطية.',
    description: 'قالب استرشادي لمراقبة الأخطاء وتوافر الخدمة وخطة نسخ احتياطي واختبار الاستعادة. يتطلب إعداد أدوات مراقبة فعلية داخل حساب المشروع.',
    category: 'devops',
    technologies: ['Vercel', 'Monitoring', 'Error Logs', 'Backup Strategy'],
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    liveUrl: null,
    status: 'prototype',
    serviceId: '2b829e92-36fb-48a5-8be5-6132fb7a0007',
    serviceTitle: 'النشر السحابي، DevOps والصيانة',
    isTemplate: true,
    sortOrder: 214
  })
];

const SEED_PROJECTS: Project[] = [
  ...TEMPLATE_PROJECTS,
  ...VERCEL_SHOWCASE_PROJECTS,
  ...SERVICE_TEMPLATE_PROJECTS
];


const SEED_PROFILE: Profile = {
  id: '3c929e92-36fb-48a5-8be5-6132fb7a0001',
  displayName: 'م. عماد الدين (EMICODE)',
  headline: 'مهندس برمجيات Full-Stack ومطور حلول مؤسسية متقدمة',
  bio: 'مطور برمجيات ذو خبرة تفوق 6 سنوات في تحويل المتطلبات المعقدة إلى منتجات برمجية متكاملة وسريعة وقابلة للنمو. متخصص في بناء تطبيقات React الحديثة، واجهات برمجة Node.js المتقدمة، حلول قواعد بيانات PostgreSQL/Neon، وتطبيقات Flutter المتنقلة.',
  email: 'emanjarallah646@gmail.com',
  whatsapp: '967713551930',
  githubUrl: 'https://github.com/emicode-org',
  linkedinUrl: 'https://linkedin.com/in/emicode-dev',
  resumeUrl: '#'
};

const SEED_CONTACTS: ContactRequest[] = [];

class ResilientStore {
  private data: DatabaseData;

  constructor() {
    this.data = this.loadOrInit();
  }

  private loadOrInit(): DatabaseData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);

        // Filter out any leftover demo mock projects
        const demoSlugs = new Set([
          'emiflow-saas-erp',
          'medilink-telehealth',
          'albayan-flutter-app',
          'finpulse-crypto-analytics',
          'hypergate-api-gateway',
          'dartech-estate-crm',
          'vercel-emicodin-eng',
          'vercel-emicodin-na9l'
        ]);

        const projects = (parsed.projects || []).filter((p: Project) => !demoSlugs.has(p.slug));
        const contacts = parsed.contact_requests || [];
        const admins = Array.isArray(parsed.admins) ? parsed.admins : [];

        // Seed project examples only on first initialization. Do not recreate a template
        // or discard real customer submissions on each application restart.

        const cleaned: DatabaseData = {
          projects,
          admins,
          services: parsed.services || SEED_SERVICES,
          contact_requests: contacts,
          profile: parsed.profile || { id: '', displayName: '', headline: '', bio: '', email: '', whatsapp: '', githubUrl: null, linkedinUrl: null, resumeUrl: null }
        };

        this.saveData(cleaned);
        return cleaned;
      }
    } catch (err) {
      console.warn('[ResilientStore] Error reading store, using defaults:', err);
    }

    const initial: DatabaseData = {
      projects: SEED_PROJECTS,
      admins: [],
      services: SEED_SERVICES,
      contact_requests: [],
      profile: { id: '', displayName: '', headline: '', bio: '', email: '', whatsapp: '', githubUrl: null, linkedinUrl: null, resumeUrl: null }
    };

    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave: DatabaseData) {
    // Vercel function filesystems are read-only except for ephemeral /tmp.
    // Production data must live in Neon; never pretend this fallback is durable.
    if (process.env.VERCEL) return;

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[ResilientStore] Failed to write data:', err);
    }
  }

  // --- Projects ---
  getProjects() {
    return [...this.data.projects]
      .map(p => {
        const srv = p.serviceId ? this.data.services.find(s => s.id === p.serviceId) : null;
        return {
          ...p,
          serviceTitle: p.serviceTitle || srv?.title || null
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getProjectBySlug(slug: string) {
    const p = this.data.projects.find(p => p.slug === slug);
    if (!p) return null;
    const srv = p.serviceId ? this.data.services.find(s => s.id === p.serviceId) : null;
    return {
      ...p,
      serviceTitle: p.serviceTitle || srv?.title || null
    };
  }

  getProjectById(id: string) {
    return this.data.projects.find(p => p.id === id) || null;
  }

  createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.projects.push(newProject);
    this.saveData(this.data);
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.data.projects[index] = {
      ...this.data.projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData(this.data);
    return this.data.projects[index];
  }

  deleteProject(id: string): boolean {
    const beforeLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    if (this.data.projects.length !== beforeLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Services ---
  getServices(activeOnly: boolean = false) {
    let list = [...this.data.services];
    if (activeOnly) {
      list = list.filter(s => s.isActive);
    }
    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  createService(service: Omit<Service, 'id'>): Service {
    const newService: Service = {
      ...service,
      id: crypto.randomUUID()
    };
    this.data.services.push(newService);
    this.saveData(this.data);
    return newService;
  }

  updateService(id: string, updates: Partial<Service>): Service | null {
    const index = this.data.services.findIndex(s => s.id === id);
    if (index === -1) return null;

    this.data.services[index] = {
      ...this.data.services[index],
      ...updates
    };
    this.saveData(this.data);
    return this.data.services[index];
  }

  deleteService(id: string): boolean {
    const beforeLen = this.data.services.length;
    this.data.services = this.data.services.filter(s => s.id !== id);
    if (this.data.services.length !== beforeLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Contacts ---
  getContactRequests() {
    return [...this.data.contact_requests].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  createContactRequest(request: Omit<ContactRequest, 'id' | 'status' | 'createdAt'>): ContactRequest {
    const newContact: ContactRequest = {
      ...request,
      id: crypto.randomUUID(),
      status: 'new',
      createdAt: new Date().toISOString()
    };
    this.data.contact_requests.unshift(newContact);
    this.saveData(this.data);
    return newContact;
  }

  updateContactStatus(id: string, status: ContactRequest['status']): ContactRequest | null {
    const contact = this.data.contact_requests.find(c => c.id === id);
    if (!contact) return null;

    contact.status = status;
    this.saveData(this.data);
    return contact;
  }

  deleteContactRequest(id: string): boolean {
    const before = this.data.contact_requests.length;
    this.data.contact_requests = this.data.contact_requests.filter(c => c.id !== id);
    if (this.data.contact_requests.length !== before) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Profile ---
  getProfile(): Profile {
    return this.data.profile;
  }

  updateProfile(updates: Partial<Profile>): Profile {
    this.data.profile = {
      ...this.data.profile,
      ...updates
    };
    this.saveData(this.data);
    return this.data.profile;
  }

  // --- Admins ---
  findAdminByEmail(email: string): AdminUser | null {
    return this.data.admins.find(a => a.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findAdminById(id: string): AdminUser | null {
    return this.data.admins.find(a => a.id === id) || null;
  }

  updateAdminPassword(adminId: string, newHash: string): boolean {
    const admin = this.data.admins.find(a => a.id === adminId);
    if (!admin) return false;
    admin.passwordHash = newHash;
    this.saveData(this.data);
    return true;
  }

  getSeedData() {
    return {
      projects: SEED_PROJECTS,
      services: SEED_SERVICES,
      profile: SEED_PROFILE,

    };
  }
}

export const store = new ResilientStore();
