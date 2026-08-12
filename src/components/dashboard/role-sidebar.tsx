import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type SidebarItem = {
  href?: string;
  label: string;
  icon: LucideIcon;
  comingSoon?: boolean;
};

export function RoleSidebar({
  roleLabel,
  items,
}: {
  roleLabel: string;
  items: SidebarItem[];
}) {
  return (
    <div className="rounded-2xl border border-mist p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate">
        <ShieldCheck className="h-4 w-4 text-teal" />
        Staff Panel
      </div>
      <p className="mt-1 text-xs text-slate">{roleLabel}</p>
      <nav className="mt-4 flex flex-col gap-1">
        {items.map(({ href, label, icon: Icon, comingSoon }) =>
          comingSoon || !href ? (
            <span
              key={label}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate/50"
              title="Coming soon"
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </span>
              <span className="text-[10px] uppercase tracking-wide">Soon</span>
            </span>
          ) : (
            <Link
              key={href}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-navy hover:bg-offwhite"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
