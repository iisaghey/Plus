import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/dashboard/section-header";
import { DataTable, DataTableHead, DataTableBody, EmptyRow } from "@/components/dashboard/data-table";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

const STATUS_KEYS = ["status", "workflow_status", "verification_status"] as const;

function describeChange(previous: unknown, next: unknown): string {
  const before = (previous ?? {}) as Record<string, unknown>;
  const after = (next ?? {}) as Record<string, unknown>;

  const changes: string[] = [];
  for (const key of STATUS_KEYS) {
    if (key in before || key in after) {
      const from = before[key];
      const to = after[key];
      if (from !== to) {
        changes.push(`${key.replace(/_/g, " ")}: ${from ?? "—"} → ${to ?? "—"}`);
      }
    }
  }

  if (changes.length > 0) return changes.join(", ");
  if (next) return JSON.stringify(next);
  return "—";
}

export default async function AdminAuditLogsPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_logs")
    .select(
      "id, actor_id, action, actor_role, entity_type, entity_id, previous_value, new_value, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  const logs = data ?? [];

  const actorIds = Array.from(
    new Set(logs.map((l) => l.actor_id).filter((id): id is string => Boolean(id)))
  );
  const profileIds = Array.from(
    new Set(
      logs
        .filter((l) => l.entity_type === "profile")
        .map((l) => l.entity_id)
        .filter((id): id is string => Boolean(id))
    )
  );

  const [{ data: actors }, { data: profiles }] = await Promise.all([
    actorIds.length > 0
      ? supabase.from("user_roles").select("user_id, email").in("user_id", actorIds)
      : Promise.resolve({ data: [] as { user_id: string; email: string | null }[] }),
    profileIds.length > 0
      ? supabase.from("profiles").select("id, full_name").in("id", profileIds)
      : Promise.resolve({ data: [] as { id: string; full_name: string }[] }),
  ]);

  const actorMap = new Map((actors ?? []).map((a) => [a.user_id, a.email]));
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));

  return (
    <div>
      <SectionHeader
        title={t.admin.auditLogs.title}
        subtitle={t.admin.auditLogs.subtitle}
      />

      <div className="mt-8">
        <DataTable minWidth={920}>
          <DataTableHead>
            <th className="px-4 py-3">{t.admin.auditLogs.colWhen}</th>
            <th className="px-4 py-3">{t.admin.auditLogs.colActor}</th>
            <th className="px-4 py-3">{t.admin.auditLogs.colAction}</th>
            <th className="px-4 py-3">{t.admin.auditLogs.colProfileAffected}</th>
            <th className="px-4 py-3">{t.admin.auditLogs.colStatusChange}</th>
          </DataTableHead>
          <DataTableBody>
            {logs.length === 0 ? (
              <EmptyRow colSpan={5}>{t.admin.auditLogs.empty}</EmptyRow>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3 text-xs text-slate">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate">
                    <span className="font-medium text-navy dark:text-white">
                      {(log.actor_id && actorMap.get(log.actor_id)) ?? "—"}
                    </span>
                    <span className="ml-1 capitalize text-slate/70">
                      ({log.actor_role?.replace(/_/g, " ") ?? t.admin.auditLogs.unknownRole})
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-navy dark:text-white">
                    {log.action.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate">
                    {log.entity_type === "profile"
                      ? ((log.entity_id && profileMap.get(log.entity_id)) ??
                        log.entity_id?.slice(0, 8) ??
                        "—")
                      : `${log.entity_type} · ${log.entity_id?.slice(0, 8) ?? "—"}`}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-xs text-slate">
                    {describeChange(log.previous_value, log.new_value)}
                  </td>
                </tr>
              ))
            )}
          </DataTableBody>
        </DataTable>
      </div>
    </div>
  );
}
