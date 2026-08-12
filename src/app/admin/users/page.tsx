import { redirect } from "next/navigation";
import { getStaffContext } from "@/lib/auth/staff";
import { getAllUsers } from "@/lib/data/admin";
import { TeamMemberRow } from "@/components/admin/team-member-row";
import type { Enums } from "@/types/database.types";

const ALL_ROLES: Enums<"app_role">[] = [
  "profile_owner",
  "staff",
  "editor",
  "admin",
  "super_admin",
];

export default async function AdminUsersPage() {
  // Defense in depth: gated in the layout too, but a page that changes
  // roles must never rely solely on a hidden nav link.
  const { role } = await getStaffContext();
  if (role !== "super_admin") redirect("/admin");

  const users = await getAllUsers();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy">Users</h1>
      <p className="mt-1 text-sm text-slate">
        Every account on the platform. Changing a role here takes effect
        immediately.
      </p>

      <div className="mt-8 space-y-2">
        {users.map((u) => (
          <TeamMemberRow
            key={u.user_id}
            userId={u.user_id}
            email={u.email}
            role={u.role}
            accountStatus={u.account_status}
            assignableRoles={ALL_ROLES}
          />
        ))}
      </div>
    </div>
  );
}
