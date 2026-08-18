"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import type { ReactNode } from "react";

export type SidebarItem = {
  href?: string;
  label: string;
  icon: ReactNode;
  comingSoon?: boolean;
  /** Highlight as active for any of these pathnames too (e.g. query-param variants of the same base path). */
  matchPrefix?: string;
};

export function RoleSidebar({
  roleLabel,
  items,
  userEmail,
}: {
  roleLabel: string;
  items: SidebarItem[];
  userEmail?: string | null;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentUrl = search ? `${pathname}?${search}` : pathname;
  const initial = (userEmail?.trim()?.[0] ?? "?").toUpperCase();

  return (
    <div className="flex h-full flex-col rounded-2xl bg-navy p-4 shadow-lg shadow-navy/20">
      <Logo light surface="dark" className="px-1" />
      <span className="mt-4 inline-flex w-fit items-center rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/80 ring-1 ring-white/15">
        {roleLabel} Panel
      </span>

      <nav className="mt-5 flex flex-1 flex-col gap-1">
        {items.map(({ href, label, icon, comingSoon, matchPrefix }) => {
          const isActive =
            Boolean(href) &&
            !comingSoon &&
            (currentUrl === href ||
              pathname === href ||
              (matchPrefix ? pathname.startsWith(matchPrefix) : false));

          return comingSoon || !href ? (
            <span
              key={label}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-white/30"
              title="Coming soon"
            >
              <span className="flex items-center gap-2.5">
                {icon}
                {label}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wide">Soon</span>
            </span>
          ) : (
            <Link
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-teal text-white shadow-sm shadow-teal/30"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              {icon}
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Globe className="h-3.5 w-3.5" />
          View Public Site
        </Link>
        {userEmail && (
          <div className="flex items-center gap-2.5 rounded-xl px-3 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal/20 text-xs font-bold text-teal">
              {initial}
            </span>
            <span className="min-w-0 truncate text-xs font-medium text-white/70">{userEmail}</span>
          </div>
        )}
      </div>
    </div>
  );
}
