import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  IdCard,
  ListChecks,
  FileEdit,
  Send,
  Images,
  FileText,
  Bell,
  UserCog,
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

export default async function StaffLayout({
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

  const allowed = ["staff", "admin", "super_admin"];
  if (!userRole || !allowed.includes(userRole.role)) redirect("/dashboard");

  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const s = t.sidebar.staff;

  const NAV: SidebarItem[] = [
    { href: "/staff", label: s.dashboard, icon: <LayoutDashboard className={iconClass} /> },
    { href: "/staff", label: s.myProfiles, icon: <IdCard className={iconClass} /> },
    { href: "/staff", label: s.myTasks, icon: <ListChecks className={iconClass} /> },
    { href: "/staff", label: s.drafts, icon: <FileEdit className={iconClass} /> },
    { href: "/staff", label: s.submissions, icon: <Send className={iconClass} /> },
    { label: s.media, icon: <Images className={iconClass} />, comingSoon: true },
    { label: s.documents, icon: <FileText className={iconClass} />, comingSoon: true },
    { href: "/notifications", label: s.notifications, icon: <Bell className={iconClass} /> },
    { href: "/dashboard", label: s.myAccount, icon: <UserCog className={iconClass} /> },
  ];

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <aside className="lg:w-64 lg:shrink-0">
        <div className="flex flex-col gap-4 lg:sticky lg:top-20 lg:min-h-[calc(100vh-6rem)]">
          <RoleSidebar roleLabel={t.sidebar.roles.staff} items={NAV} userEmail={user.email} />
          <StaffDraftForm action={createStaffDraft} />
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
