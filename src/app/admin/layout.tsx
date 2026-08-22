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
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

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

  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const s = t.sidebar.admin;

  const ADMIN_NAV: SidebarItem[] = [
    { href: "/admin", label: s.overview, icon: <LayoutDashboard className={iconClass} /> },
    { href: "/admin/profiles", label: s.allProfiles, icon: <ShieldCheck className={iconClass} />, matchPrefix: "/admin/profiles" },
    { href: "/admin/review", label: s.reviewApproval, icon: <Send className={iconClass} /> },
    { href: "/admin/profiles?filter=published", label: s.published, icon: <Eye className={iconClass} /> },
    { href: "/admin/profiles?filter=verified", label: s.verified, icon: <BadgeCheck className={iconClass} /> },
    { href: "/admin/profiles?filter=hidden", label: s.hidden, icon: <EyeOff className={iconClass} /> },
    { href: "/admin/verification", label: s.verificationRequests, icon: <UserCheck className={iconClass} /> },
    { href: "/admin/team?role=staff", label: s.staff, icon: <UsersRound className={iconClass} /> },
    { href: "/admin/team?role=editor", label: s.editors, icon: <UserCog className={iconClass} /> },
    { label: s.media, icon: <Images className={iconClass} />, comingSoon: true },
    { label: s.documents, icon: <FileText className={iconClass} />, comingSoon: true },
    { label: s.reports, icon: <BarChart3 className={iconClass} />, comingSoon: true },
    { href: "/admin/audit-logs", label: s.auditLogs, icon: <ScrollText className={iconClass} /> },
    { href: "/admin/approvals", label: s.accountApprovals, icon: <Users className={iconClass} /> },
    { href: "/admin/organizations", label: s.organizations, icon: <Building2 className={iconClass} /> },
    { href: "/admin/categories", label: s.categories, icon: <Tags className={iconClass} /> },
    { label: s.settings, icon: <Settings className={iconClass} />, comingSoon: true },
  ];

  const SUPER_ADMIN_NAV: SidebarItem[] = [
    { href: "/admin", label: s.overview, icon: <LayoutDashboard className={iconClass} /> },
    { href: "/admin/profiles", label: s.allProfiles, icon: <ShieldCheck className={iconClass} />, matchPrefix: "/admin/profiles" },
    { href: "/admin/users", label: s.users, icon: <Users className={iconClass} />, matchPrefix: "/admin/users" },
    { href: "/admin/review", label: s.reviewApproval, icon: <Send className={iconClass} /> },
    { href: "/admin/team?role=staff", label: s.staff, icon: <UsersRound className={iconClass} /> },
    { href: "/admin/team?role=editor", label: s.editors, icon: <UserCog className={iconClass} /> },
    { href: "/admin/users?role=admin", label: s.admins, icon: <ShieldAlert className={iconClass} /> },
    { href: "/admin/roles", label: s.rolesPermissions, icon: <ShieldAlert className={iconClass} /> },
    { href: "/admin/verification", label: s.verification, icon: <UserCheck className={iconClass} /> },
    { href: "/admin/profiles?filter=published", label: s.published, icon: <Eye className={iconClass} /> },
    { href: "/admin/profiles?filter=hidden", label: s.hidden, icon: <EyeOff className={iconClass} /> },
    { href: "/admin/profiles?filter=archived", label: s.archived, icon: <Archive className={iconClass} /> },
    { label: s.media, icon: <Images className={iconClass} />, comingSoon: true },
    { label: s.documents, icon: <FileText className={iconClass} />, comingSoon: true },
    { label: s.reports, icon: <BarChart3 className={iconClass} />, comingSoon: true },
    { href: "/admin/audit-logs", label: s.auditLogs, icon: <ScrollText className={iconClass} /> },
    { href: "/admin/edit-requests", label: s.editRequests, icon: <KeyRound className={iconClass} /> },
    { href: "/admin/approvals", label: s.accountApprovals, icon: <Users className={iconClass} /> },
    { href: "/admin/organizations", label: s.organizations, icon: <Building2 className={iconClass} /> },
    { href: "/admin/categories", label: s.categories, icon: <Tags className={iconClass} /> },
    { label: s.security, icon: <Lock className={iconClass} />, comingSoon: true },
    { label: s.systemSettings, icon: <Settings className={iconClass} />, comingSoon: true },
    { href: "https://supabase.com/dashboard", label: s.databaseStorage, icon: <Database className={iconClass} /> },
    { label: s.platformConfiguration, icon: <SlidersHorizontal className={iconClass} />, comingSoon: true },
  ];

  const NAV = isSuperAdmin ? SUPER_ADMIN_NAV : ADMIN_NAV;

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <aside className="lg:w-64 lg:shrink-0">
        <div className="lg:sticky lg:top-20 lg:min-h-[calc(100vh-6rem)]">
          <RoleSidebar
            roleLabel={isSuperAdmin ? t.sidebar.roles.superAdmin : t.sidebar.roles.admin}
            items={NAV}
            userEmail={user.email}
          />
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
