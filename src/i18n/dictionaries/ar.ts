import type { Dictionary } from "./en";
import admin from "./sections/admin.ar";
import dashboard from "./sections/dashboard.ar";
import editorForms from "./sections/editorForms.ar";
import editorWorkspace from "./sections/editorWorkspace.ar";
import home from "./sections/home.ar";
import profilesPublic from "./sections/profilesPublic.ar";
import publicPages from "./sections/publicPages.ar";

const ar: Dictionary = {
  admin,
  dashboard,
  editorForms,
  editorWorkspace,
  home,
  profilesPublic,
  publicPages,
  nav: {
    profiles: "الملفات الشخصية",
    leaders: "القادة",
    professionals: "المهنيون",
    organizations: "المنظمات",
    about: "من نحن",
    verification: "التحقق",
    contact: "اتصل بنا",
    login: "تسجيل الدخول",
    search: "بحث",
    toggleMenu: "فتح القائمة",
    switchLanguage: "تغيير اللغة",
  },
  footer: {
    tagline: "قيادتك. هويتك. إرثك.",
    description:
      "منصة رقمية لإدارة الهوية القيادية والملفات الشخصية للقادة السياسيين والمسؤولين الحكوميين.",
    platform: "المنصة",
    legal: "قانوني",
    support: "الدعم",
    about: "من نحن",
    profiles: "الملفات الشخصية",
    verification: "التحقق",
    advancedSearch: "بحث متقدم",
    howItWorks: "كيف تعمل المنصة",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    contact: "اتصل بنا",
    helpCenter: "مركز المساعدة",
    rights: "جميع الحقوق محفوظة.",
    securedBy: "محمي بواسطة Supabase · مبني على الثقة",
  },
  hero: {
    badge: "مصممة للقادة السياسيين والمسؤولين العموميين الصوماليين",
    heading: "قيادتك. هويتك. إرثك.",
    subtext:
      "أنشئ وأدر واحفظ ملفك القيادي مع AqoonsiPlus. اجمع هويتك ومسيرتك المهنية وإنجازاتك وأنشطتك ووسائطك وسجلاتك الرسمية في مكان رقمي احترافي واحد.",
    searchPlaceholder: "ابحث عن قادة، مهنيين، شخصيات…",
    advanced: "متقدم",
    search: "بحث",
    exploreProfiles: "استكشف الملفات الشخصية",
    createProfile: "أنشئ ملفًا شخصيًا",
    trustedBy: "موثوق من قبل قادة الصومال ومسؤوليها العموميين",
    statDigitalProfiles: "ملفات رقمية",
    statVerifiedLeaders: "قادة موثّقون",
    statOrganizations: "منظمات",
  },
  common: {
    save: "حفظ",
    cancel: "إلغاء",
    submit: "إرسال",
    delete: "حذف",
    edit: "تعديل",
    close: "إغلاق",
    loading: "جارٍ التحميل…",
    viewAll: "عرض الكل",
    viewProfile: "عرض الملف الشخصي",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    required: "مطلوب",
    optional: "اختياري",
    viewPublicSite: "عرض الموقع العام",
    switchToLightMode: "التبديل إلى الوضع الفاتح",
    switchToDarkMode: "التبديل إلى الوضع الداكن",
  },
  auth: {
    welcomeBack: "مرحبًا بعودتك",
    signInSubtitle: "سجّل الدخول لإدارة ملفك الشخصي على AqoonsiPlus.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    signIn: "تسجيل الدخول",
    noProfileYet: "ليس لديك ملف شخصي بعد؟",
    createOne: "أنشئ واحدًا",
  },
  validation: {
    required: "هذا الحقل مطلوب.",
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح.",
    passwordTooShort: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
  },
};

export default ar;
