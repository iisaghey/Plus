import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionHeader({
  title,
  subtitle,
  tabs,
  activeTabKey,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  tabs?: { key: string; label: string; href: string }[];
  activeTabKey?: string;
  /** Primary/secondary buttons, right-aligned next to the title. */
  actions?: ReactNode;
  /** Extra controls (e.g. a search box) rendered alongside the tab row. */
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-bold uppercase tracking-wide text-navy dark:text-white sm:text-2xl">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-slate">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>

      {(tabs || children) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {tabs && (
            <div className="flex flex-wrap gap-1 rounded-full bg-mist/60 p-1 dark:bg-white/5">
              {tabs.map((tab) => (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                    activeTabKey === tab.key
                      ? "bg-white text-teal shadow-sm dark:bg-offwhite"
                      : "text-slate hover:text-navy dark:hover:text-white"
                  )}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
