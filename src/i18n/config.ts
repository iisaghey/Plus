export const LOCALES = ["en", "so", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "aqoonsiplus_locale";

export const LOCALE_META: Record<Locale, { label: string; flag: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", flag: "🇬🇧", dir: "ltr" },
  so: { label: "Soomaali", flag: "🇸🇴", dir: "ltr" },
  ar: { label: "العربية", flag: "🇸🇦", dir: "rtl" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
