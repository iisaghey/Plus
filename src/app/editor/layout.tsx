import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  IdCard,
  Bell,
  UserCog,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RoleSidebar, type SidebarItem } from "@/components/dashboard/role-sidebar";
import { StaffDraftForm } from "@/components/dashboard/staff-draft-form";
import { createStaffDraft } from "@/lib/actions/profile";

const iconClass = "h-4 w-4";

const NAV: SidebarItem[] = [
  { href: "/editor", label: "Dashboard", icon: <LayoutDashboard className={iconClass} /> },
  { href: "/editor/queue", label: "Review Queue", icon: <ListChecks className={iconClass} /> },
  { href: "/editor/profiles", label: "Profiles", icon: <IdCard className={iconClass} /> },
  { href: "/notifications", label: "Notifications", icon: <Bell className={iconClass} /> },
  { href: "/dashboard", label: "My Account", icon: <UserCog className={iconClass} /> },
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
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:px-8">
      <aside className="lg:w-56 lg:shrink-0 flex flex-col gap-4">
        <RoleSidebar roleLabel="Editor" items={NAV} />
        <StaffDraftForm action={createStaffDraft} triggerLabel="+ Create New Profile" />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
