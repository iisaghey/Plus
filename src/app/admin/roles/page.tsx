import { getStaffContext } from "@/lib/auth/staff";
import { getRolesMatrix } from "@/lib/data/admin";
import { PermissionMatrix } from "@/components/admin/permission-matrix";

export default async function AdminRolesPage() {
  const { role } = await getStaffContext();
  const { roles, permissions, rolePermissions } = await getRolesMatrix();
  const isSuperAdmin = role === "super_admin";

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy">
        Roles & Permissions
      </h1>
      <p className="mt-1 text-sm text-slate">
        {isSuperAdmin
          ? "Edit the permission matrix directly — changes apply immediately across the platform."
          : "Admins have read-only access to the permission matrix; only Super Admin can edit it."}
      </p>

      <div className="mt-8">
        <PermissionMatrix
          roles={roles}
          permissions={permissions}
          rolePermissions={rolePermissions}
          editable={isSuperAdmin}
        />
      </div>

      <p className="mt-4 text-xs text-slate">
        Roles marked <em>(future)</em> — like Verifier — have no permissions
        assigned yet. Adding rows here is enough to activate a new role
        without a schema change, per the platform's permission-based design.
      </p>
    </div>
  );
}
