"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type SidebarItem = {
  href?: string;
  label: string;
  icon: ReactNode;
  comingSoon?: boolean;
};

export function RoleSidebar({
  roleLabel,
  items,
}: {
  roleLabel: string;
  items: SidebarItem[];
}) {
  const pathname = usePathname();

  return (
    <div className="rounded-2xl border border-mist p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate">
        <ShieldCheck className="h-4 w-4 text-teal" />
        Staff Panel
      </div>
      <p className="mt-1 text-xs text-slate">{roleLabel}</p>
      <nav className="mt-4 flex flex-col gap-1">
        {items.map(({ href, label, icon, comingSoon }) => {
          const isActive = Boolean(href) && !comingSoon && pathname === href;
          return comingSoon || !href ? (
            <span
              key={label}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate/50"
              title="Coming soon"
            >
              <span className="flex items-center gap-2">
                {icon}
                {label}
              </span>
              <span className="text-[10px] uppercase tracking-wide">Soon</span>
            </span>
          ) : (
            <Link
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-teal/10 text-teal"
                  : "text-navy dark:text-white hover:bg-offwhite"
              )}
            >
              {icon}
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
