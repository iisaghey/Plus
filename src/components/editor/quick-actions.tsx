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
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export async function QuickActions() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);

  const ACTIONS: {
    label: string;
    href: string;
    icon: LucideIcon;
  }[] = [
    { label: t.editorWorkspace.quickActions.createProfile, href: "/editor/profiles", icon: UserPlus },
    { label: t.editorWorkspace.quickActions.reviewProfiles, href: "/editor/queue", icon: ListChecks },
    { label: t.editorWorkspace.quickActions.uploadDocuments, href: "/editor/profiles", icon: FileUp },
    { label: t.editorWorkspace.quickActions.addBiography, href: "/editor/profiles", icon: BookOpen },
    { label: t.editorWorkspace.quickActions.addAchievements, href: "/editor/profiles", icon: Trophy },
    { label: t.editorWorkspace.quickActions.addMedia, href: "/editor/profiles", icon: ImageIcon },
  ];

  return (
    <div className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-6">
      <h2 className="font-heading text-base font-bold text-navy dark:text-white">
        {t.editorWorkspace.quickActions.heading}
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
