import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  IdCard,
  FileEdit,
  Loader2,
  AlertTriangle,
  Images,
  Mic,
  FileText,
  Bell,
  Activity,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RoleSidebar, type SidebarItem } from "@/components/dashboard/role-sidebar";
import { StaffDraftForm } from "@/components/dashboard/staff-draft-form";
import { createStaffDraft } from "@/lib/actions/profile";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const iconClass = "h-4 w-4";

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const allowed = ["editor", "admin", "super_admin"];
  if (!userRole || !allowed.includes(userRole.role)) redirect("/dashboard");

  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const s = t.sidebar.editor;

  const NAV: SidebarItem[] = [
    { href: "/editor", label: s.dashboard, icon: <LayoutDashboard className={iconClass} /> },
    { href: "/editor/profiles", label: s.myProfiles, icon: <IdCard className={iconClass} />, matchPrefix: "/editor/profiles" },
    { href: "/editor/profiles?status=draft", label: s.drafts, icon: <FileEdit className={iconClass} /> },
    { href: "/editor/profiles?status=in_progress", label: s.inProgress, icon: <Loader2 className={iconClass} /> },
    { href: "/editor/profiles?status=incomplete", label: s.incomplete, icon: <AlertTriangle className={iconClass} /> },
    { href: "/editor/queue", label: s.reviewQueue, icon: <ListChecks className={iconClass} /> },
    { label: s.media, icon: <Images className={iconClass} />, comingSoon: true },
    { label: s.speeches, icon: <Mic className={iconClass} />, comingSoon: true },
    { label: s.documents, icon: <FileText className={iconClass} />, comingSoon: true },
    { href: "/notifications", label: s.notifications, icon: <Bell className={iconClass} /> },
    { label: s.activity, icon: <Activity className={iconClass} />, comingSoon: true },
  ];

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <aside className="lg:w-64 lg:shrink-0">
        <div className="flex flex-col gap-4 lg:sticky lg:top-20 lg:min-h-[calc(100vh-6rem)]">
          <RoleSidebar roleLabel={t.sidebar.roles.editor} items={NAV} userEmail={user.email} />
          <StaffDraftForm action={createStaffDraft} triggerLabel={s.createNewProfile} />
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
