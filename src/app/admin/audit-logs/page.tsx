import { createClient } from "@/lib/supabase/server";

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
      <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
        Audit Logs
      </h1>
      <p className="mt-1 text-sm text-slate">
        Every important action, traceable to the person who performed it.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-mist">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-offwhite text-xs font-semibold uppercase tracking-wide text-slate">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Profile Affected</th>
              <th className="px-4 py-3">Status Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate">
                  No audit events yet.
                </td>
              </tr>
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
                      ({log.actor_role?.replace(/_/g, " ") ?? "unknown"})
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
