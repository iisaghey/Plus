const profilesPublic = {
  leaders: {
    label: "القادة",
    title: "القادة الحكوميون والسياسيون",
    description:
      "ملفات رقمية موثّقة للمسؤولين الحكوميين والقادة السياسيين تحفظ تاريخهم القيادي.",
  },
  professionals: {
    label: "المهنيون",
    title: "قادة الأعمال والأكاديميا والمجتمع المدني",
    description:
      "ملفات رقمية موثّقة للمهنيين الذين يبنون إرثهم الرقمي على AqoonsiPlus.",
  },
  organizations: {
    label: "المنظمات",
    heading: "المؤسسات الحكومية",
    description:
      "استكشف المؤسسات الحكومية والهيئات العامة المرتبطة بالملفات القيادية على AqoonsiPlus.",
    categories: [
      "المؤسسات الحكومية الفيدرالية",
      "مؤسسات الولايات الأعضاء الفيدرالية",
      "الحكومة الإقليمية والمحلية",
      "الوزارات والمكاتب الحكومية",
      "الهيئات والوكالات العامة",
    ],
  },
  profilesList: {
    label: "تصفح الملفات الشخصية",
    title: "جميع الملفات الرقمية",
    description:
      "ابحث وصفِّ الملفات الموثّقة للقادة والمهنيين والشخصيات العامة في جميع الفئات.",
  },
  createProfile: {
    accountCreatedToast: "تم إنشاء الحساب — لنبدأ ببناء ملفك الشخصي.",
    checkEmailHeading: "تحقق من بريدك الإلكتروني",
    checkEmailMessagePrefix: "أرسلنا رابط تأكيد إلى",
    checkEmailMessageSuffix:
      "أكّد حسابك لبدء بناء ملفك الشخصي الرقمي.",
    backToSignIn: "العودة إلى تسجيل الدخول",
    heading: "أنشئ ملفك الشخصي",
    subtitle: "ابدأ ببناء إرثك الرقمي الموثّق على AqoonsiPlus.",
    fullNameLabel: "الاسم الكامل",
    fullNamePlaceholder: "اسمك الكامل",
    passwordPlaceholder: "8 أحرف على الأقل",
    submitButton: "أنشئ الملف الشخصي",
    alreadyHaveProfile: "هل لديك ملف شخصي بالفعل؟",
    signInLink: "تسجيل الدخول",
  },
  card: {
    verifiedBadge: "موثّق",
  },
  directory: {
    resultsCountSingular: "ملف شخصي تم العثور عليه",
    resultsCountPlural: "ملفات شخصية تم العثور عليها",
    emptyTitle: "لا توجد ملفات شخصية تطابق بحثك",
    emptyDescription: "حاول تعديل عوامل التصفية أو كلمات البحث.",
  },
  filterBar: {
    searchPlaceholder: "ابحث بالاسم أو المنصب أو المهنة…",
    allCategories: "جميع الفئات",
    allCountries: "جميع الدول",
    anyStatus: "أي حالة",
    verified: "موثّق",
    pending: "قيد الانتظار",
    unverified: "غير موثّق",
    mostViewed: "الأكثر مشاهدة",
    newest: "الأحدث",
    nameAZ: "الاسم (أ–ي)",
  },
  header: {
    verifiedBadge: "ملف موثّق",
    pendingBadge: "التحقق قيد الانتظار",
    websiteAriaLabel: "الموقع الإلكتروني",
    contactButton: "اتصل",
  },
  tabs: {
    tabLabels: {
      overview: "نظرة عامة",
      biography: "السيرة الذاتية",
      career: "المسيرة المهنية",
      positions: "المناصب",
      achievements: "الإنجازات",
      activities: "الأنشطة",
      travel: "السفريات",
      speeches: "الخطابات",
      media: "الوسائط",
      documents: "المستندات",
      timeline: "الجدول الزمني",
    },
    overview: {
      aboutHeading: "نبذة",
      noBioSummary: "لم يتم نشر ملخص السيرة الذاتية بعد.",
      recentAchievements: "الإنجازات الأخيرة",
      statCareerMilestones: "محطات المسيرة المهنية",
      statGovernmentPositions: "المناصب الحكومية",
      statAchievements: "الإنجازات",
      statMediaDocuments: "الوسائط والمستندات",
    },
    biography: {
      heading: "السيرة الذاتية",
      empty: "لم يتم نشر السيرة الذاتية بعد.",
    },
    career: {
      empty: "لم يتم نشر المسيرة المهنية بعد.",
    },
    positions: {
      empty: "لم يتم نشر المناصب الحكومية بعد.",
    },
    achievements: {
      empty: "لم يتم نشر الإنجازات بعد.",
    },
    activities: {
      empty: "لم يتم نشر الأنشطة الرسمية بعد.",
    },
    travel: {
      empty: "لم يتم نشر السفريات الرسمية بعد.",
    },
    speeches: {
      empty: "لم يتم نشر الخطابات بعد.",
    },
    media: {
      empty: "لم يتم نشر أي وسائط بعد.",
    },
    documents: {
      empty: "لم يتم نشر أي مستندات بعد.",
      verifiedBadge: "موثّق",
    },
    timelineKind: {
      career: "مسيرة مهنية",
      government: "حكومي",
    },
  },
  qrCode: {
    showAriaLabel: "إظهار رمز QR",
    modalHeading: "امسح لعرض الملف الشخصي الموثّق",
    download: "تنزيل",
    share: "مشاركة",
    print: "طباعة",
    linkCopied: "تم نسخ رابط الملف الشخصي",
    adminOnlyNote:
      "التنزيل والطباعة متاحان فقط للمسؤولين والمسؤولين العامين.",
    printDocTitle: "{name} — رمز QR الخاص بـ AqoonsiPlus",
    printCaption: "امسح لعرض الملف الشخصي الموثّق لـ {name}",
  },
  shareButton: {
    ariaLabel: "مشاركة الملف الشخصي",
    linkCopied: "تم نسخ رابط الملف الشخصي",
  },
  timeline: {
    empty: "لم يتم نشر أي أحداث زمنية بعد.",
    current: "حالي",
  },
  mediaLightbox: {
    previousAriaLabel: "السابق",
    nextAriaLabel: "التالي",
    openDocument: "فتح المستند",
  },
  submitVerification: {
    button: "إرسال للتحقق",
    successToast: "تم الإرسال للتحقق",
  },
};

export default profilesPublic;
