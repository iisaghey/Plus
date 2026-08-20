"use client";

import { createContext, useContext, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_META, type Locale } from "./config";
import { setLocaleCookie } from "./actions";
import type { Dictionary } from "./dictionaries/en";

type LanguageContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  dir: "ltr" | "rtl";
  pending: boolean;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  locale: initialLocale,
  dictionary: initialDictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState(initialLocale);
  const [dictionary, setDictionaryState] = useState(initialDictionary);
  const [pending, startTransition] = useTransition();

  function setLocale(next: Locale) {
    if (next === locale) return;
    setLocaleState(next);
    // Client components read the new dictionary instantly; Server
    // Components pick it up once router.refresh() re-runs the layout.
    import("./get-dictionary").then(({ getDictionary }) => {
      setDictionaryState(getDictionary(next));
    });
    startTransition(async () => {
      await setLocaleCookie(next);
      router.refresh();
    });
  }

  return (
    <LanguageContext.Provider
      value={{ locale, dictionary, dir: LOCALE_META[locale].dir, pending, setLocale }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

function resolvePath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  const ctx = context;
  function t(path: string): string {
    const value = resolvePath(ctx.dictionary, path);
    return typeof value === "string" ? value : path;
  }
  return { t, locale: ctx.locale, dir: ctx.dir, pending: ctx.pending, setLocale: ctx.setLocale };
}
