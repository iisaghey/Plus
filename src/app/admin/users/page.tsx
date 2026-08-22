import { redirect } from "next/navigation";
import { getStaffContext } from "@/lib/auth/staff";
import { getAllUsers } from "@/lib/data/admin";
import { TeamMemberRow } from "@/components/admin/team-member-row";
import { SectionHeader } from "@/components/dashboard/section-header";
import type { Enums } from "@/types/database.types";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

const ALL_ROLES: Enums<"app_role">[] = [
  "profile_owner",
  "staff",
  "editor",
  "admin",
  "super_admin",
];

// Admin's set_user_role RPC is scoped server-side to these three roles only
// -- it rejects any attempt to assign or change an admin/super_admin
// account. This list must stay in sync with that so the UI never offers an
// option the backend will reject.
const ADMIN_ASSIGNABLE_ROLES: Enums<"app_role">[] = ["profile_owner", "staff", "editor"];

const TAB_KEYS = ["all", "admin"] as const;

export default async function AdminUsersPage(
  props: PageProps<"/admin/users">
) {
  const locale = await getServerLocale();
  const t = getDictionary(locale);

  const TABS = [
    { key: "all", label: t.admin.users.tabs.all },
    { key: "admin", label: t.admin.users.tabs.admins },
  ] as const;

  // Defense in depth: gated in the layout too, but a page that changes
  // roles must never rely solely on a hidden nav link.
  const { role } = await getStaffContext();
  if (role !== "super_admin" && role !== "admin") redirect("/admin");
  const isSuperAdmin = role === "super_admin";

  const searchParams = await props.searchParams;
  const rawRole = typeof searchParams.role === "string" ? searchParams.role : "all";
  const roleFilter: (typeof TAB_KEYS)[number] = TAB_KEYS.includes(rawRole as (typeof TAB_KEYS)[number])
    ? (rawRole as (typeof TAB_KEYS)[number])
    : "all";

  const allUsers = await getAllUsers();
  const users =
    roleFilter === "admin"
      ? allUsers.filter((u) => u.role === "admin" || u.role === "super_admin")
      : allUsers;

  return (
    <div>
      <SectionHeader
        title={t.admin.users.title}
        subtitle={
          isSuperAdmin
            ? t.admin.users.subtitleSuperAdmin
            : t.admin.users.subtitleAdmin
        }
        tabs={
          isSuperAdmin
            ? TABS.map((tab) => ({
                key: tab.key,
                label: tab.label,
                href: tab.key === "all" ? "/admin/users" : `/admin/users?role=${tab.key}`,
              }))
            : undefined
        }
        activeTabKey={roleFilter}
      />

      <div className="mt-8 space-y-2">
        {users.map((u) => (
          <TeamMemberRow
            key={u.user_id}
            userId={u.user_id}
            email={u.email}
            role={u.role}
            accountStatus={u.account_status}
            assignableRoles={isSuperAdmin ? ALL_ROLES : ADMIN_ASSIGNABLE_ROLES}
          />
        ))}
      </div>
    </div>
  );
}
