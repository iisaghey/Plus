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
  ShieldCheck,
  KeyRound,
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
  const iconClass = "h-4 w-4";

  const NAV: SidebarItem[] = [
    { href: "/admin", label: "Overview", icon: <LayoutDashboard className={iconClass} /> },
    { href: "/admin/team", label: "Profiles", icon: <IdCard className={iconClass} /> },
    { href: "/admin/review", label: "Content Review", icon: <BarChart3 className={iconClass} /> },
    { href: "/admin/verification", label: "Verification", icon: <BadgeCheck className={iconClass} /> },
    { href: "/admin/approvals", label: "Account Approvals", icon: <Users className={iconClass} /> },
    { href: "/admin/team", label: "Staff & Editors", icon: <UsersRound className={iconClass} /> },
    { href: "/admin/organizations", label: "Organizations", icon: <Building2 className={iconClass} /> },
    { href: "/admin/categories", label: "Categories", icon: <Tags className={iconClass} /> },
    { label: "Media", icon: <Images className={iconClass} />, comingSoon: true },
    { label: "Documents", icon: <FileText className={iconClass} />, comingSoon: true },
    { label: "Reports", icon: <BarChart3 className={iconClass} />, comingSoon: true },
    { href: "/admin/audit-logs", label: "Audit Logs", icon: <ScrollText className={iconClass} /> },
    ...(isSuperAdmin
      ? ([
          { href: "/admin/profiles", label: "All Profiles", icon: <ShieldCheck className={iconClass} /> },
          { href: "/admin/edit-requests", label: "Edit Requests", icon: <KeyRound className={iconClass} /> },
          { href: "/admin/users", label: "Users", icon: <Users className={iconClass} /> },
          { href: "/admin/roles", label: "Roles & Permissions", icon: <ShieldAlert className={iconClass} /> },
          { label: "Security", icon: <Lock className={iconClass} />, comingSoon: true },
          { label: "System Settings", icon: <Settings className={iconClass} />, comingSoon: true },
          { href: "https://supabase.com/dashboard", label: "Database", icon: <Database className={iconClass} /> },
          { href: "https://supabase.com/dashboard", label: "Storage", icon: <HardDrive className={iconClass} /> },
          { label: "Platform Configuration", icon: <SlidersHorizontal className={iconClass} />, comingSoon: true },
        ] satisfies SidebarItem[])
      : [{ label: "Settings", icon: <Settings className={iconClass} />, comingSoon: true }]),
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
