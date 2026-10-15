export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    brand: 'EMICODE',
    tagline: 'هندسة برمجيات متقدمة وحلول سحابية متكاملة',
    nav: {
      home: 'الرئيسية',
      projects: 'المشاريع',
      services: 'الخدمات',
      workflow: 'طريقة العمل',
      about: 'نبذة عني',
      contact: 'تواصل معي',
      admin: 'لوحة الإدارة',
      requestProject: 'طلب مشروع جديد'
    },
    hero: {
      statusBadge: 'متاح للتعاقد على مشاريع جديدة ومؤسسية',
      titleHighlight: 'EMICODE',
      titlePrefix: 'معرض أعمال',
      titleSuffix: 'تطبيقات وأنظمة برمجية عالية الأداء',
      subtext: 'مهندس برمجيات Full-Stack متخصص في بناء وتطوير تطبيقات الويب السريعة، لوحات التحكم الإدارية، تطبيقات الهاتف الذكي Flutter، وأنظمة قواعد البيانات الموثوقة.',
      viewProjects: 'استعرض المشاريع',
      hireMe: 'اطلب مشروعك الآن',
      stats: {
        experience: 'سنوات خبرة',
        projects: 'مشروع منجز',
        uptime: 'موثوقية المعمارية',
        delivery: 'التزام بالمواعيد'
      }
    },
    featured: {
      kicker: 'أعمال مختارة',
      title: 'مشاريع بارزة أحدثت فارقًا حقيقيًا',
      subtitle: 'نماذج وتطبيقات عملية متكاملة جاهزة للإنتاج تم تصميمها وهندستها بأعلى المعايير.',
      viewAll: 'مشاهدة كافة المشاريع'
    },
    projects: {
      kicker: 'معرض الأعمال',
      title: 'جميع المشاريع البرمجية',
      subtitle: 'استعرض الأنظمة والتطبيقات البرمجية مع روابط المعاينة المباشرة والشرح التقني.',
      searchPlaceholder: 'ابحث بالاسم، الوصف، أو التقنية (مثال: React, PostgreSQL)...',
      categories: {
        all: 'جميع المشاريع',
        saas: 'أنظمة SaaS ولوحات تحكم',
        web: 'تطبيقات الويب',
        mobile: 'تطبيقات Flutter',
        api: 'بوابات APIs وأنظمة خلفية',
        enterprise: 'حلول مؤسسية CRM'
      },
      statusLabels: {
        all: 'جميع الحالات',
        completed: 'مكتمل ومتاح',
        prototype: 'نموذج تجريبي',
        in_development: 'قيد التطوير'
      },
      liveDemo: 'معاينة حية',
      viewCode: 'الكود المصدري',
      codePrivate: 'مستودع خاص للعميل',
      viewDetails: 'تفاصيل المشروع',
      empty: 'لم يتم العثور على مشاريع تطابق خيارات البحث.',
      resetFilters: 'إعادة ضبط التصفية'
    },
    projectDetail: {
      overview: 'نظرة عامة على المشروع',
      problemAndSolution: 'المشكلة والحل المعماري',
      technicalChallenges: 'التحديات التقنية الفعلية',
      technologiesUsed: 'التقنيات المستخدمة',
      status: 'حالة المشروع',
      category: 'التصنيف',
      requestSimilar: 'طلب مشروع مشابه',
      close: 'إغلاق',
      livePreview: 'رابط التجربة المباشرة'
    },
    services: {
      kicker: 'ماذا أقدم؟',
      title: 'خدمات برمجية مصممة لنمو أعمالك',
      subtitle: 'حلول تقنية متكاملة تنفذ باحترافية من الفكرة وحتى النشر والصيانة المستمرة.',
      orderService: 'اطلب هذه الخدمة',
      features: 'المخرجات والضمانات'
    },
    workflow: {
      kicker: 'منهجية العمل',
      title: 'كيف ننتقل بفكرتك إلى منتج حقيقي ناجح؟',
      subtitle: 'خطوات عمل واضحة وشفافة تضمن تسليم المشروع بأعلى جودة وفي الوقت المحدد.',
      step1Title: '1. التخطيط والمعمارية البرمجية',
      step1Desc: 'دراسة المتطلبات بدقة، وتحديد بنية قاعدة البيانات، وهندسة النظام لضمان التوسع والأمان.',
      step2Title: '2. تصميم الواجهات وتجربة المستخدم',
      step2Desc: 'بناء واجهات عصرية تفاعلية وسريعة تركز على سهولة الاستخدام وتجاوبها مع كل الشاشات.',
      step3Title: '3. التطوير البرمجي والاختبار الصارم',
      step3Desc: 'كتابة كود نظيف وفق أفضل الممارسات، واختبار الأداء والحماية ضد الثغرات البرمجية.',
      step4Title: '4. النشر السحابي والدعم الفني',
      step4Desc: 'نشر النظام على خوادم سحابية حديثة، وتجهيز خطوط CI/CD مع دعم فني وصيانة دورية.'
    },
    contact: {
      kicker: 'ابدأ مشروعك اليوم',
      title: 'لنتحدث عن فكرتك البرمجية القادمة',
      subtitle: 'املأ النموذج وسأتواصل معك خلال 24 ساعة لمناقشة التفاصيل وتقديم خطة عمل وعرض سعر ملائم.',
      form: {
        name: 'الاسم الكريم',
        namePlaceholder: 'مثال: محمد عبد الله',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'name@company.com',
        service: 'نوع الخدمة المطلوبة',
        selectService: 'اختر الخدمة...',
        budget: 'الميزانية التقديرية (اختياري)',
        budgetPlaceholder: 'مثال: $2,000 - $5,000',
        phone: 'رقم الهاتف (اختياري)',
        phonePlaceholder: 'مثال: +966 50 123 4567',
        timeline: 'المدة المتوقعة للتنفيذ (اختياري)',
        timelinePlaceholder: 'مثال: شهر إلى شهرين',
        additionalFeatures: 'ميزات أو تفاصيل إضافية (اختياري)',
        additionalFeaturesPlaceholder: 'أي متطلبات تكامل خاصة، بوابات دفع، أو تفاصيل تقنية إضافية...',
        referenceProject: 'المشروع المرجعي المطلوب مثله',
        message: 'تفاصيل المشروع والمتطلبات',
        messagePlaceholder: 'اكتب نبذة عن مشروعك، الميزات المطلوبة، والوقت المستهدف للبدء...',
        submit: 'إرسال طلب المشروع',
        submitting: 'جارٍ الإرسال والتسجيل في قاعدة البيانات...',
        successTitle: 'تم إرسال طلبك بنجاح!',
        successDesc: 'شكرًا لتواصلك. تم حفظ بيانات طلبك في النظام وسأرد عليك قريبًا.',
        errorTitle: 'تعذر إرسال الطلب',
        whatsAppCta: 'تواصل مباشر عبر واتساب',
        emailCta: 'مراسلة عبر البريد'
      }
    },
    admin: {
      title: 'لوحة التحكم الإدارية',
      subtitle: 'إدارة مشاريع المعرض، الخدمات، وطلبات العملاء المتصلة بقاعدة البيانات',
      login: {
        title: 'تسجيل دخول الإدارة',
        email: 'البريد الإلكتروني للمسؤول',
        password: 'كلمة المرور',
        submit: 'تسجيل الدخول',
        credentialsHint: 'بيانات الدخول الافتراضية:',
        backToSite: 'العودة للموقع'
      },
      tabs: {
        projects: 'المشاريع',
        services: 'الخدمات',
        contacts: 'طلبات العملاء',
        profile: 'الملف الشخصي',
        dbStatus: 'حالة قاعدة البيانات والنشر'
      },
      logout: 'تسجيل الخروج',
      addProject: 'إضافة مشروع جديد',
      editProject: 'تعديل المشروع',
      addService: 'إضافة خدمة جديدة',
      editService: 'تعديل الخدمة',
      actions: {
        edit: 'تعديل',
        delete: 'حذف',
        save: 'حفظ التعديلات',
        cancel: 'إلغاء',
        confirmDelete: 'هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذه العملية.'
      }
    },
    footer: {
      rights: 'جميع الحقوق محفوظة © 2026 EMICODE. هندسة برمجيات وتطوير ويب احترافي.',
      databaseBadge: 'مدعوم بقاعدة بيانات Neon PostgreSQL مع Prisma ORM'
    }
  },
  en: {
    brand: 'EMICODE',
    tagline: 'High-Performance Software Engineering & Cloud Solutions',
    nav: {
      home: 'Home',
      projects: 'Projects',
      services: 'Services',
      workflow: 'Process',
      about: 'About',
      contact: 'Contact',
      admin: 'Admin Portal',
      requestProject: 'Request a Project'
    },
    hero: {
      statusBadge: 'Available for enterprise & high-impact projects',
      titleHighlight: 'EMICODE',
      titlePrefix: 'Portfolio of',
      titleSuffix: 'Full-Stack Software Architecture',
      subtext: 'Senior Full-Stack Software Engineer specializing in scalable web platforms, mission-critical admin systems, Flutter mobile applications, and resilient cloud architectures.',
      viewProjects: 'Explore Projects',
      hireMe: 'Start a Project',
      stats: {
        experience: 'Years Experience',
        projects: 'Delivered Projects',
        uptime: 'System Reliability',
        delivery: 'On-time Milestones'
      }
    },
    featured: {
      kicker: 'Featured Work',
      title: 'Flagship Systems & Production Apps',
      subtitle: 'Real-world architectures engineered with modern frontend, robust APIs, and PostgreSQL.',
      viewAll: 'Browse All Projects'
    },
    projects: {
      kicker: 'Portfolio Showcase',
      title: 'Engineered Systems & Applications',
      subtitle: 'Filter and inspect live applications with full architecture breakdowns and code access.',
      searchPlaceholder: 'Search by title, description or stack (e.g. React, PostgreSQL)...',
      categories: {
        all: 'All Systems',
        saas: 'SaaS & Dashboards',
        web: 'Web Applications',
        mobile: 'Flutter Mobile',
        api: 'APIs & Gateways',
        enterprise: 'Enterprise CRM'
      },
      statusLabels: {
        all: 'All Statuses',
        completed: 'Completed & Live',
        prototype: 'Prototype / Demo',
        in_development: 'In Active Development'
      },
      liveDemo: 'Live Demo',
      viewCode: 'Source Code',
      codePrivate: 'Client Private Repo',
      viewDetails: 'Project Details',
      empty: 'No projects match your filter criteria.',
      resetFilters: 'Reset Filters'
    },
    projectDetail: {
      overview: 'System Overview',
      problemAndSolution: 'The Challenge & Architectural Solution',
      technicalChallenges: 'Actual Technical Obstacles & Solutions',
      technologiesUsed: 'Stack & Technologies',
      status: 'Current Status',
      category: 'Category',
      requestSimilar: 'Request Similar Project',
      close: 'Close',
      livePreview: 'Live Interactive URL'
    },
    services: {
      kicker: 'Capabilities',
      title: 'Services Tailored for Growth & Scalability',
      subtitle: 'End-to-end technical execution from initial architecture to continuous cloud maintenance.',
      orderService: 'Hire for This Service',
      features: 'Deliverables & Guarantees'
    },
    workflow: {
      kicker: 'Engineering Workflow',
      title: 'From Concept to Production-Grade Software',
      subtitle: 'A disciplined, transparent development cycle that ensures predictability and velocity.',
      step1Title: '1. Architecture & Data Modeling',
      step1Desc: 'Rigorous requirement analysis, schema modeling with PostgreSQL/Prisma, and scalability planning.',
      step2Title: '2. UI/UX & Interactive Design',
      step2Desc: 'Designing high-converting, intuitive, lightning-fast interfaces for web and mobile.',
      step3Title: '3. Clean Code & Rigorous Testing',
      step3Desc: 'Modern TypeScript, modular components, API rate limiting, and zero-compromise security.',
      step4Title: '4. Cloud Deployment & CI/CD',
      step4Desc: 'Automated deployments on Vercel or cloud run, SSL setup, and continuous operational health.'
    },
    contact: {
      kicker: 'Get in Touch',
      title: 'Let’s Build Your Next Digital System',
      subtitle: 'Fill out the form below. I will review your requirements and respond within 24 hours with an actionable roadmap.',
      form: {
        name: 'Your Name',
        namePlaceholder: 'e.g. John Doe',
        email: 'Business Email',
        emailPlaceholder: 'name@company.com',
        service: 'Service Category',
        selectService: 'Select service...',
        budget: 'Estimated Budget (Optional)',
        budgetPlaceholder: 'e.g. $3,000 - $6,000',
        phone: 'Phone Number (Optional)',
        phonePlaceholder: 'e.g. +1 555 123 4567',
        timeline: 'Expected Timeline (Optional)',
        timelinePlaceholder: 'e.g. 1 to 2 months',
        additionalFeatures: 'Additional Features or Technical Details (Optional)',
        additionalFeaturesPlaceholder: 'Any specific third-party integrations, payment gateways, or custom requirements...',
        referenceProject: 'Reference Project',
        message: 'Project Details & Goals',
        messagePlaceholder: 'Describe your application requirements, timeline, and key features...',
        submit: 'Send Project Request',
        submitting: 'Saving to Database...',
        successTitle: 'Inquiry Received Successfully!',
        successDesc: 'Thank you! Your inquiry has been stored securely in the database. I will contact you shortly.',
        errorTitle: 'Submission Error',
        whatsAppCta: 'Chat Directly on WhatsApp',
        emailCta: 'Send an Email'
      }
    },
    admin: {
      title: 'Admin Control Center',
      subtitle: 'Manage portfolio projects, services, and live customer inquiries connected to Neon PostgreSQL',
      login: {
        title: 'Admin Authentication',
        email: 'Admin Email',
        password: 'Password',
        submit: 'Sign In to Portal',
        credentialsHint: 'Default Admin Credentials:',
        backToSite: 'Return to Showcase'
      },
      tabs: {
        projects: 'Projects',
        services: 'Services',
        contacts: 'Client Inquiries',
        profile: 'Developer Profile',
        dbStatus: 'Database & Deployment'
      },
      logout: 'Sign Out',
      addProject: 'Add New Project',
      editProject: 'Edit Project',
      addService: 'Add New Service',
      editService: 'Edit Service',
      actions: {
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save Changes',
        cancel: 'Cancel',
        confirmDelete: 'Are you sure you want to delete this item? This action cannot be undone.'
      }
    },
    footer: {
      rights: 'All rights reserved © 2026 EMICODE. Professional Full-Stack Software Engineering.',
      databaseBadge: 'Powered by Neon PostgreSQL with Prisma ORM'
    }
  }
};
