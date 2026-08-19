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

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const iconClass = "h-4 w-4";

const NAV: SidebarItem[] = [
  { href: "/editor", label: "Dashboard", icon: <LayoutDashboard className={iconClass} /> },
  { href: "/editor/profiles", label: "My Profiles", icon: <IdCard className={iconClass} />, matchPrefix: "/editor/profiles" },
  { href: "/editor/profiles?status=draft", label: "Drafts", icon: <FileEdit className={iconClass} /> },
  { href: "/editor/profiles?status=in_progress", label: "In Progress", icon: <Loader2 className={iconClass} /> },
  { href: "/editor/profiles?status=incomplete", label: "Incomplete", icon: <AlertTriangle className={iconClass} /> },
  { href: "/editor/queue", label: "Review Queue", icon: <ListChecks className={iconClass} /> },
  { label: "Media", icon: <Images className={iconClass} />, comingSoon: true },
  { label: "Speeches", icon: <Mic className={iconClass} />, comingSoon: true },
  { label: "Documents", icon: <FileText className={iconClass} />, comingSoon: true },
  { href: "/notifications", label: "Notifications", icon: <Bell className={iconClass} /> },
  { label: "Activity", icon: <Activity className={iconClass} />, comingSoon: true },
];

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

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <aside className="lg:w-64 lg:shrink-0">
        <div className="flex flex-col gap-4 lg:sticky lg:top-20 lg:min-h-[calc(100vh-6rem)]">
          <RoleSidebar roleLabel="Editor" items={NAV} userEmail={user.email} />
          <StaffDraftForm action={createStaffDraft} triggerLabel="Create New Profile" />
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
