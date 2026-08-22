"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setUserRole } from "@/lib/actions/users";
import { Badge } from "@/components/ui/badge";
import type { Enums } from "@/types/database.types";
import { useTranslation } from "@/i18n/language-provider";

const DEFAULT_ASSIGNABLE_ROLES: Enums<"app_role">[] = [
  "profile_owner",
  "staff",
  "editor",
];

export function TeamMemberRow({
  userId,
  email,
  role,
  accountStatus,
  assignableRoles = DEFAULT_ASSIGNABLE_ROLES,
}: {
  userId: string;
  email: string | null;
  role: Enums<"app_role">;
  accountStatus?: Enums<"account_status">;
  assignableRoles?: Enums<"app_role">[];
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [pending, startTransition] = useTransition();

  function handleChange(newRole: Enums<"app_role">) {
    startTransition(async () => {
      const result = await setUserRole(userId, newRole);
      if (result.error) {
        toast.error(result.errorCode ? t(`admin.errors.${result.errorCode}`) : result.error);
        return;
      }
      toast.success(`${t("admin.teamMemberRow.roleUpdatedTo")} ${newRole.replace("_", " ")}`);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-mist p-4">
      <div className="flex min-w-0 items-center gap-2">
        <p className="truncate text-sm font-medium text-navy dark:text-white">{email ?? t("admin.teamMemberRow.unknown")}</p>
        {accountStatus && accountStatus !== "approved" && (
          <Badge variant={accountStatus === "pending" ? "pending" : "neutral"} size="sm">
            {accountStatus}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate" />}
        {assignableRoles.includes(role) ? (
          <select
            value={role}
            disabled={pending}
            onChange={(e) => handleChange(e.target.value as Enums<"app_role">)}
            className="rounded-lg border border-mist bg-white dark:bg-offwhite px-2 py-1.5 text-xs text-navy dark:text-white focus:border-teal focus:outline-none"
          >
            {assignableRoles.map((r) => (
              <option key={r} value={r}>
                {r.replace("_", " ")}
              </option>
            ))}
          </select>
        ) : (
          <Badge variant="neutral" size="sm" title={t("admin.teamMemberRow.noPermissionTitle")}>
            {role.replace("_", " ")}
          </Badge>
        )}
      </div>
    </div>
  );
}
