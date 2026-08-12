import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BadgeCheck,
  IdCard,
  UsersRound,
  Building2,
  Tags,
  Images,
  FileText,
  BarChart3,
  ScrollText,
  Settings,
  ShieldAlert,
  Lock,
  Database,
  HardDrive,
  SlidersHorizontal,
} from "lucide-react";
import { getStaffContext } from "@/lib/auth/staff";
import { RoleSidebar, type SidebarItem } from "@/components/dashboard/role-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role } = await getStaffContext();
  if (!user) redirect("/login");
  if (role !== "admin" && role !== "super_admin") redirect("/dashboard");

  const isSuperAdmin = role === "super_admin";

  const NAV: SidebarItem[] = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/team", label: "Profiles", icon: IdCard },
    { href: "/admin/review", label: "Content Review", icon: BarChart3 },
    { href: "/admin/verification", label: "Verification", icon: BadgeCheck },
    { href: "/admin/approvals", label: "Account Approvals", icon: Users },
    { href: "/admin/team", label: "Staff & Editors", icon: UsersRound },
    { href: "/admin/organizations", label: "Organizations", icon: Building2 },
    { href: "/admin/categories", label: "Categories", icon: Tags },
    { label: "Media", icon: Images, comingSoon: true },
    { label: "Documents", icon: FileText, comingSoon: true },
    { label: "Reports", icon: BarChart3, comingSoon: true },
    { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
    ...(isSuperAdmin
      ? ([
          { href: "/admin/users", label: "Users", icon: Users },
          { href: "/admin/roles", label: "Roles & Permissions", icon: ShieldAlert },
          { label: "Security", icon: Lock, comingSoon: true },
          { label: "System Settings", icon: Settings, comingSoon: true },
          { href: "https://supabase.com/dashboard", label: "Database", icon: Database },
          { href: "https://supabase.com/dashboard", label: "Storage", icon: HardDrive },
          { label: "Platform Configuration", icon: SlidersHorizontal, comingSoon: true },
        ] satisfies SidebarItem[])
      : [{ label: "Settings", icon: Settings, comingSoon: true }]),
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:px-8">
      <aside className="lg:w-56 lg:shrink-0">
        <RoleSidebar
          roleLabel={isSuperAdmin ? "Super Admin" : "Admin"}
          items={NAV}
        />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
