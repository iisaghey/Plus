"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LOCALES, LOCALE_META } from "@/i18n/config";
import { useTranslation } from "@/i18n/language-provider";
import { cn } from "@/lib/utils";
import { DURATION, EASE } from "@/lib/motion";

export function LanguageSwitcher({
  compact = false,
  surface = "light",
}: {
  compact?: boolean;
  /** Use "dark" when the surrounding background is navy (e.g. the dashboard sidebar). */
  surface?: "light" | "dark";
}) {
  const { locale, setLocale, t, pending } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        aria-label={t("nav.switchLanguage")}
        className={cn(
          "flex h-10 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium transition-colors disabled:opacity-60",
          surface === "dark"
            ? "text-white/70 hover:bg-white/10 hover:text-white"
            : "text-slate hover:bg-offwhite hover:text-navy dark:hover:text-white"
        )}
      >
        <span className="text-base leading-none">{LOCALE_META[locale].flag}</span>
        {!compact && (
          <span className="hidden sm:inline">{LOCALE_META[locale].label}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute end-0 z-50 mt-1 w-40 origin-top-end rounded-xl border border-mist bg-white p-1.5 shadow-xl dark:bg-offwhite"
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: DURATION.fast, ease: EASE }}
            >
              {LOCALES.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setLocale(l);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    l === locale
                      ? "bg-teal/10 font-semibold text-teal"
                      : "text-navy hover:bg-offwhite dark:text-white"
                  )}
                >
                  <span className="text-base leading-none">{LOCALE_META[l].flag}</span>
                  {LOCALE_META[l].label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
