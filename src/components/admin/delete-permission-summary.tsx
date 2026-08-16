import { Trash2, XCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Enums, Tables } from "@/types/database.types";

const ROLE_ORDER: Enums<"app_role">[] = ["staff", "editor", "admin", "super_admin"];

type Status = {
  icon: typeof XCircle;
  label: string;
  tone: "danger" | "warning" | "success";
};

const TONE_CLASSES: Record<Status["tone"], string> = {
  danger: "text-red-600",
  warning: "text-gold",
  success: "text-emerald",
};

function deleteStatus(
  deleteScope: Enums<"permission_scope">,
  deletePermanentScope: Enums<"permission_scope">
): Status {
  if (deletePermanentScope === "all") {
    return { icon: CheckCircle2, label: "Full delete authority", tone: "success" };
  }
  if (deletePermanentScope === "limited") {
    return {
      icon: AlertTriangle,
      label: "Can request/delete limited content",
      tone: "warning",
    };
  }
  return { icon: XCircle, label: "No permanent delete", tone: "danger" };
}

export function DeletePermissionSummary({
  roles,
  rolePermissions,
}: {
  roles: Tables<"roles">[];
  rolePermissions: Tables<"role_permissions">[];
}) {
  const scopeFor = (roleKey: string, permKey: string): Enums<"permission_scope"> =>
    rolePermissions.find((rp) => rp.role_key === roleKey && rp.permission_key === permKey)
      ?.scope ?? "none";

  const rows = ROLE_ORDER.map((key) => {
    const role = roles.find((r) => r.key === key);
    if (!role) return null;
    const status = deleteStatus(
      scopeFor(key, "records.delete"),
      scopeFor(key, "records.delete_permanent")
    );
    return { role, status };
  }).filter((row): row is NonNullable<typeof row> => row !== null);

  return (
    <div className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-6">
      <div className="flex items-center gap-2">
        <Trash2 className="h-4 w-4 text-teal" />
        <h2 className="font-heading text-base font-bold text-navy dark:text-white">
          Delete Role &amp; Permission
        </h2>
      </div>
      <p className="mt-1 text-xs text-slate">
        Who can soft-delete records versus permanently erase them, derived live from the
        permission matrix below.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="border-b border-mist text-[11px] font-semibold uppercase tracking-wide text-slate">
              <th className="pb-2 pr-4 font-semibold">Role</th>
              <th className="pb-2 font-semibold">Delete Permission</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ role, status }) => (
              <tr key={role.key} className="border-b border-mist last:border-0">
                <td className="py-3 pr-4 font-semibold text-navy dark:text-white">
                  {role.label}
                </td>
                <td className={cn("py-3 flex items-center gap-2", TONE_CLASSES[status.tone])}>
                  <status.icon className="h-4 w-4 shrink-0" />
                  {status.label}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
