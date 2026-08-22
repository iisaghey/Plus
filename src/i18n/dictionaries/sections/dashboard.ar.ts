import type { DashboardDictionary } from "./dashboard.en";

const dashboard: DashboardDictionary = {
  home: {
    signedInAs: "تم تسجيل الدخول باسم",
    openPanel: "فتح ←",
    panels: {
      superAdmin: {
        label: "لوحة الإدارة",
        description: "إدارة الموظفين والمحررين والتحقق وإعدادات المنصة.",
      },
      admin: {
        label: "لوحة الإدارة",
        description: "مراجعة الموافقات على الحسابات والتحقق من الملفات الشخصية.",
      },
      editor: {
        label: "لوحة التحرير",
        description: "مراجعة الملفات الشخصية المرسلة وإدارة المحتوى.",
      },
      staff: {
        label: "لوحة الموظفين",
        description: "إنشاء مسودات الملفات الشخصية ومتابعة المهام الموكلة إليك.",
      },
    },
    pendingApprovalTitle: "حسابك في انتظار الموافقة",
    pendingApprovalDescription:
      "يقوم أحد أعضاء فريقنا بمراجعة الحسابات الجديدة قبل أن تتمكن من إنشاء ملف شخصي. عادةً ما يكون الأمر سريعًا — تحقق مرة أخرى قريبًا.",
    rejectedTitle: "لم تتم الموافقة على حسابك",
    rejectedDescription: "تواصل مع فريق الدعم لدينا إذا كنت تعتقد أن هذا خطأ.",
    contactSupport: "تواصل مع الدعم",
    noProfileTitle: "لم تُنشئ ملفك الشخصي بعد",
    noProfileDescription: "أضف اسمك ولقبك وسيرتك الذاتية لنشر ملفك الشخصي الرقمي على AqoonsiPlus.",
    createProfileCta: "أنشئ ملفك الشخصي",
    verifiedBadge: "موثّق",
    verificationPendingBadge: "التحقق قيد الانتظار",
    noPositionYet: "لم تتم إضافة منصب بعد",
    editProfileCta: "تعديل الملف الشخصي",
    viewPublicProfileCta: "عرض الملف الشخصي العام",
    profileCompletion: "اكتمال الملف الشخصي",
    completeProfileHint: "أضف فئة ومنظمة وموقعًا وصورة لإكمال ملفك الشخصي.",
    verificationRejectedHint: "لم تتم الموافقة على طلب التحقق الأخير. يمكنك إعادة الإرسال.",
    verificationReadyHint: "هل أنت مستعد للحصول على شارة موثّقة؟ أرسل ملفك الشخصي للمراجعة.",
    moreSectionsTitle: "المسيرة المهنية والإنجازات والوسائط والمستندات",
    moreSectionsDescription:
      "المحررون المخصصون لهذه الأقسام قادمون في المرحلة التالية. ملفك الشخصي الأساسي متاح على",
  },
  profile: {
    lockedMessages: {
      submitted: "تم إرسال ملفك الشخصي وهو في انتظار مراجعته.",
      underReview: "يقوم أحد المحررين حاليًا بمراجعة ملفك الشخصي.",
      editorApproved: "اجتاز ملفك الشخصي المراجعة التحريرية وهو في انتظار موافقة الإدارة.",
      adminReview: "يقوم أحد المسؤولين حاليًا بمراجعة ملفك الشخصي.",
      approved: "تمت الموافقة على ملفك الشخصي وهو في قائمة انتظار النشر.",
      verified: "تم التحقق من ملفك الشخصي وهو في قائمة انتظار النشر.",
      published: "ملفك الشخصي منشور الآن. تواصل مع الدعم إذا احتجت إلى إجراء تغييرات.",
      suspended: "تم تعليق ملفك الشخصي. تواصل مع الدعم لمزيد من التفاصيل.",
      archived: "تمت أرشفة ملفك الشخصي ولم يعد بالإمكان تعديله هنا.",
    },
    lockedFallback: "لا يمكن تعديل ملفك الشخصي في الوقت الحالي.",
    steps: {
      identity: "البيانات الشخصية والتواصل",
      background: "السيرة الذاتية والتعليم",
      career: "المسيرة المهنية والمناصب",
      recognition: "الإنجازات والأنشطة",
      speeches: "الخطابات",
      media: "الوسائط والمستندات",
      review: "المراجعة والإرسال",
    },
    backToDashboard: "العودة إلى لوحة التحكم",
    createHeading: "أنشئ ملفك الشخصي",
    createSubheading:
      "ابدأ بالأساسيات — يمكنك لاحقًا إضافة مسيرتك المهنية وإنجازاتك ووسائطك ومستنداتك من لوحة التحكم.",
    createSubmitLabel: "إنشاء ملف شخصي",
    editHeading: "تعديل ملفك الشخصي",
    editSubheading: "تابع كل قسم بالوتيرة التي تناسبك — يتم حفظ كل شيء أثناء عملك.",
    saveChangesLabel: "حفظ التغييرات",
  },
  notifications: {
    title: "الإشعارات",
  },
  notificationList: {
    empty: "لا توجد إشعارات بعد.",
  },
  pagination: {
    total: "الإجمالي",
  },
  staffDraftForm: {
    newDraft: "مسودة جديدة",
    modalTitle: "إنشاء ملف شخصي جديد",
    fullName: "الاسم الكامل",
    preferredTitle: "اللقب المفضل",
    preferredTitlePlaceholder: "د.، مهندس، الموقر...",
    profession: "المهنة",
    currentPosition: "المنصب الحالي",
    category: "الفئة",
    organization: "المنظمة",
    country: "الدولة",
    location: "الموقع",
    locationPlaceholder: "المدينة، الدولة",
    nationality: "الجنسية",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    phonePlaceholder: "+252...",
    website: "الموقع الإلكتروني",
    shortBio: "نبذة مختصرة",
    shortBioPlaceholder: "ملخص موجز يظهر على بطاقة الملف الشخصي…",
    profilePhotoLabel: "صورة الملف الشخصي *",
    photoRequiredHint: "صورة الملف الشخصي مطلوبة لإنشاء الملف الشخصي.",
    preparingUpload: "جارٍ تجهيز رفع الصورة…",
    createProfileSubmit: "إنشاء ملف شخصي",
    none: "بلا",
  },
  submitReviewButton: {
    buttonLabel: "إرسال للمراجعة",
    successToast: "تم الإرسال للمراجعة",
  },
};

export default dashboard;
