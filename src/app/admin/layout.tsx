import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BadgeCheck,
  UsersRound,
  UserCog,
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
  SlidersHorizontal,
  ShieldCheck,
  KeyRound,
  Send,
  Eye,
  EyeOff,
  Archive,
  UserCheck,
} from "lucide-react";
import { getStaffContext } from "@/lib/auth/staff";
import { RoleSidebar, type SidebarItem } from "@/components/dashboard/role-sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

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

  const ADMIN_NAV: SidebarItem[] = [
    { href: "/admin", label: "Overview", icon: <LayoutDashboard className={iconClass} /> },
    { href: "/admin/profiles", label: "All Profiles", icon: <ShieldCheck className={iconClass} />, matchPrefix: "/admin/profiles" },
    { href: "/admin/review", label: "Review & Approval", icon: <Send className={iconClass} /> },
    { href: "/admin/profiles?filter=published", label: "Published", icon: <Eye className={iconClass} /> },
    { href: "/admin/profiles?filter=verified", label: "Verified", icon: <BadgeCheck className={iconClass} /> },
    { href: "/admin/profiles?filter=hidden", label: "Hidden", icon: <EyeOff className={iconClass} /> },
    { href: "/admin/verification", label: "Verification Requests", icon: <UserCheck className={iconClass} /> },
    { href: "/admin/team?role=staff", label: "Staff", icon: <UsersRound className={iconClass} /> },
    { href: "/admin/team?role=editor", label: "Editors", icon: <UserCog className={iconClass} /> },
    { label: "Media", icon: <Images className={iconClass} />, comingSoon: true },
    { label: "Documents", icon: <FileText className={iconClass} />, comingSoon: true },
    { label: "Reports", icon: <BarChart3 className={iconClass} />, comingSoon: true },
    { href: "/admin/audit-logs", label: "Audit Logs", icon: <ScrollText className={iconClass} /> },
    { href: "/admin/approvals", label: "Account Approvals", icon: <Users className={iconClass} /> },
    { href: "/admin/organizations", label: "Organizations", icon: <Building2 className={iconClass} /> },
    { href: "/admin/categories", label: "Categories", icon: <Tags className={iconClass} /> },
    { label: "Settings", icon: <Settings className={iconClass} />, comingSoon: true },
  ];

  const SUPER_ADMIN_NAV: SidebarItem[] = [
    { href: "/admin", label: "Overview", icon: <LayoutDashboard className={iconClass} /> },
    { href: "/admin/profiles", label: "All Profiles", icon: <ShieldCheck className={iconClass} />, matchPrefix: "/admin/profiles" },
    { href: "/admin/users", label: "Users", icon: <Users className={iconClass} />, matchPrefix: "/admin/users" },
    { href: "/admin/review", label: "Review & Approval", icon: <Send className={iconClass} /> },
    { href: "/admin/team?role=staff", label: "Staff", icon: <UsersRound className={iconClass} /> },
    { href: "/admin/team?role=editor", label: "Editors", icon: <UserCog className={iconClass} /> },
    { href: "/admin/users?role=admin", label: "Admins", icon: <ShieldAlert className={iconClass} /> },
    { href: "/admin/roles", label: "Roles & Permissions", icon: <ShieldAlert className={iconClass} /> },
    { href: "/admin/verification", label: "Verification", icon: <UserCheck className={iconClass} /> },
    { href: "/admin/profiles?filter=published", label: "Published", icon: <Eye className={iconClass} /> },
    { href: "/admin/profiles?filter=hidden", label: "Hidden", icon: <EyeOff className={iconClass} /> },
    { href: "/admin/profiles?filter=archived", label: "Archived", icon: <Archive className={iconClass} /> },
    { label: "Media", icon: <Images className={iconClass} />, comingSoon: true },
    { label: "Documents", icon: <FileText className={iconClass} />, comingSoon: true },
    { label: "Reports", icon: <BarChart3 className={iconClass} />, comingSoon: true },
    { href: "/admin/audit-logs", label: "Audit Logs", icon: <ScrollText className={iconClass} /> },
    { href: "/admin/edit-requests", label: "Edit Requests", icon: <KeyRound className={iconClass} /> },
    { href: "/admin/approvals", label: "Account Approvals", icon: <Users className={iconClass} /> },
    { href: "/admin/organizations", label: "Organizations", icon: <Building2 className={iconClass} /> },
    { href: "/admin/categories", label: "Categories", icon: <Tags className={iconClass} /> },
    { label: "Security", icon: <Lock className={iconClass} />, comingSoon: true },
    { label: "System Settings", icon: <Settings className={iconClass} />, comingSoon: true },
    { href: "https://supabase.com/dashboard", label: "Database & Storage", icon: <Database className={iconClass} /> },
    { label: "Platform Configuration", icon: <SlidersHorizontal className={iconClass} />, comingSoon: true },
  ];

  const NAV = isSuperAdmin ? SUPER_ADMIN_NAV : ADMIN_NAV;

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <aside className="lg:w-64 lg:shrink-0">
        <div className="lg:sticky lg:top-20 lg:min-h-[calc(100vh-6rem)]">
          <RoleSidebar
            roleLabel={isSuperAdmin ? "Super Admin" : "Admin"}
            items={NAV}
            userEmail={user.email}
          />
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
