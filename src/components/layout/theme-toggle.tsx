"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTranslation } from "@/i18n/language-provider";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState<boolean | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads DOM class set by an inline script before hydration; can't be known during SSR
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? t("common.switchToLightMode") : t("common.switchToDarkMode")}
      className={
        className ??
        "flex h-10 w-10 items-center justify-center rounded-full text-slate transition-colors hover:bg-offwhite hover:text-navy dark:hover:text-white dark:hover:text-white"
      }
    >
      {isDark === null ? (
        <span className="block h-[18px] w-[18px]" />
      ) : isDark ? (
        <Sun className="h-[18px] w-[18px]" />
      ) : (
        <Moon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
