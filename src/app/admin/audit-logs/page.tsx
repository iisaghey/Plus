import { createClient } from "@/lib/supabase/server";

export default async function AdminAuditLogsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("id, action, actor_role, entity_type, entity_id, new_value, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const logs = data ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
        Audit Logs
      </h1>
      <p className="mt-1 text-sm text-slate">
        Every important action, traceable to the person who performed it.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-mist">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-offwhite text-xs font-semibold uppercase tracking-wide text-slate">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Actor Role</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Details</th>
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
                  <td className="px-4 py-3 text-xs capitalize text-slate">
                    {log.actor_role?.replace("_", " ") ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-medium text-navy dark:text-white">
                    {log.action.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate">
                    {log.entity_type} · {log.entity_id?.slice(0, 8)}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-xs text-slate">
                    {log.new_value ? JSON.stringify(log.new_value) : "—"}
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
