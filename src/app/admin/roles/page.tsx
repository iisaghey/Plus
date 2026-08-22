import { getStaffContext } from "@/lib/auth/staff";
import { getRolesMatrix } from "@/lib/data/admin";
import { PermissionMatrix } from "@/components/admin/permission-matrix";
import { DeletePermissionSummary } from "@/components/admin/delete-permission-summary";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function AdminRolesPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const { role } = await getStaffContext();
  const { roles, permissions, rolePermissions } = await getRolesMatrix();
  const isSuperAdmin = role === "super_admin";

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
        {t.admin.roles.title}
      </h1>
      <p className="mt-1 text-sm text-slate">
        {isSuperAdmin
          ? t.admin.roles.subtitleSuperAdmin
          : t.admin.roles.subtitleAdmin}
      </p>

      <div className="mt-8">
        <DeletePermissionSummary roles={roles} rolePermissions={rolePermissions} />
      </div>

      <div className="mt-8">
        <PermissionMatrix
          roles={roles}
          permissions={permissions}
          rolePermissions={rolePermissions}
          editable={isSuperAdmin}
        />
      </div>

      <p className="mt-4 text-xs text-slate">
        {t.admin.roles.footnotePrefix} <em>{t.admin.roles.footnoteFutureTag}</em>{" "}
        {t.admin.roles.footnoteSuffix}
      </p>
    </div>
  );
}
