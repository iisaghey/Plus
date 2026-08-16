import Link from "next/link";
import {
  UserPlus,
  ListChecks,
  FileUp,
  BookOpen,
  Trophy,
  ImageIcon,
  type LucideIcon,
} from "lucide-react";

const ACTIONS: {
  label: string;
  href: string;
  icon: LucideIcon;
}[] = [
  { label: "Create Profile", href: "/editor/profiles", icon: UserPlus },
  { label: "Review Profiles", href: "/editor/queue", icon: ListChecks },
  { label: "Upload Documents", href: "/editor/profiles", icon: FileUp },
  { label: "Add Biography", href: "/editor/profiles", icon: BookOpen },
  { label: "Add Achievements", href: "/editor/profiles", icon: Trophy },
  { label: "Add Media", href: "/editor/profiles", icon: ImageIcon },
];

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-6">
      <h2 className="font-heading text-base font-bold text-navy dark:text-white">
        Quick Actions
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ACTIONS.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-start gap-3 rounded-xl border border-mist p-4 transition-colors hover:border-teal/40 hover:bg-teal/5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal/10 text-teal">
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-navy dark:text-white">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
