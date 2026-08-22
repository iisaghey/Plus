"use client";

import { Fragment, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setRolePermission } from "@/lib/actions/roles";
import { cn } from "@/lib/utils";
import type { Enums, Tables } from "@/types/database.types";
import { useTranslation } from "@/i18n/language-provider";

const SCOPE_COLOR: Record<Enums<"permission_scope">, string> = {
  none: "text-slate/30",
  assigned: "text-gold",
  limited: "text-gold",
  all: "text-emerald font-bold",
};

const SCOPES: Enums<"permission_scope">[] = ["none", "assigned", "limited", "all"];

export function PermissionMatrix({
  roles,
  permissions,
  rolePermissions,
  editable,
}: {
  roles: Tables<"roles">[];
  permissions: Tables<"permissions">[];
  rolePermissions: Tables<"role_permissions">[];
  editable: boolean;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [pending, startTransition] = useTransition();
  const [overrides, setOverrides] = useState<Record<string, Enums<"permission_scope">>>({});

  const SCOPE_LABEL: Record<Enums<"permission_scope">, string> = {
    none: t("admin.permissionMatrix.scopeNone"),
    assigned: t("admin.permissionMatrix.scopeAssigned"),
    limited: t("admin.permissionMatrix.scopeLimited"),
    all: t("admin.permissionMatrix.scopeAll"),
  };

  const scopeFor = (roleKey: string, permKey: string): Enums<"permission_scope"> => {
    const key = `${roleKey}:${permKey}`;
    if (key in overrides) return overrides[key];
    return (
      rolePermissions.find((rp) => rp.role_key === roleKey && rp.permission_key === permKey)
        ?.scope ?? "none"
    );
  };

  function handleChange(roleKey: string, permKey: string, scope: Enums<"permission_scope">) {
    const key = `${roleKey}:${permKey}`;
    setOverrides((prev) => ({ ...prev, [key]: scope }));
    startTransition(async () => {
      const result = await setRolePermission(roleKey, permKey, scope);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  const categories = Array.from(new Set(permissions.map((p) => p.category)));

  return (
    <div className="overflow-x-auto rounded-2xl border border-mist">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="bg-offwhite text-xs font-semibold uppercase tracking-wide text-slate">
          <tr>
            <th className="px-4 py-3">{t("admin.permissionMatrix.colPermission")}</th>
            {roles.map((r) => (
              <th key={r.key} className="px-4 py-3 text-center">
                {r.label}
                {!r.is_system && (
                  <span className="ml-1 text-[9px] font-normal normal-case text-slate/60">
                    {t("admin.permissionMatrix.futureTag")}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-mist">
          {categories.map((category) => (
            <Fragment key={category}>
              <tr className="bg-offwhite/50">
                <td colSpan={roles.length + 1} className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-teal">
                  {category}
                </td>
              </tr>
              {permissions
                .filter((p) => p.category === category)
                .map((perm) => (
                  <tr key={perm.key}>
                    <td className="px-4 py-2.5 text-navy dark:text-white">{perm.label}</td>
                    {roles.map((r) => {
                      const scope = scopeFor(r.key, perm.key);
                      return (
                        <td key={r.key} className="px-4 py-2.5 text-center">
                          {editable ? (
                            <select
                              value={scope}
                              disabled={pending}
                              onChange={(e) =>
                                handleChange(r.key, perm.key, e.target.value as Enums<"permission_scope">)
                              }
                              className={cn(
                                "rounded-md border border-mist bg-white dark:bg-offwhite px-1.5 py-1 text-xs focus:border-teal focus:outline-none",
                                SCOPE_COLOR[scope]
                              )}
                            >
                              {SCOPES.map((s) => (
                                <option key={s} value={s}>
                                  {SCOPE_LABEL[s]}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className={cn("text-xs", SCOPE_COLOR[scope])}>
                              {SCOPE_LABEL[scope]}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
