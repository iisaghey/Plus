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

const NAV: SidebarItem[] = [
  { href: "/staff", label: "Dashboard", icon: LayoutDashboard },
  { href: "/staff", label: "My Profiles", icon: IdCard },
  { href: "/staff", label: "My Tasks", icon: ListChecks },
  { href: "/staff", label: "Drafts", icon: FileEdit },
  { href: "/staff", label: "Submissions", icon: Send },
  { label: "Media", icon: Images, comingSoon: true },
  { label: "Documents", icon: FileText, comingSoon: true },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard", label: "My Account", icon: UserCog },
];

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

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:px-8">
      <aside className="lg:w-56 lg:shrink-0">
        <RoleSidebar roleLabel="Staff" items={NAV} />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
