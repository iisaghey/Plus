import { createClient } from "@/lib/supabase/server";
import { getReviewQueue, getEditorRecentActivity } from "@/lib/data/editor";
import { EditorDecisionRow } from "@/components/editor/editor-decision-row";
import { Badge } from "@/components/ui/badge";

export default async function EditorDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [queue, recent] = await Promise.all([
    getReviewQueue(),
    getEditorRecentActivity(user.id),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
        Editor Dashboard
      </h1>
      <p className="mt-1 text-sm text-slate">
        Profiles submitted by Staff, waiting for your review.
      </p>

      <div className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate">
          Review Queue ({queue.length})
        </h2>
        <div className="mt-3 space-y-3">
          {queue.length === 0 ? (
            <p className="rounded-xl border border-dashed border-mist py-10 text-center text-sm text-slate">
              Nothing waiting for review.
            </p>
          ) : (
            queue.map((p) => (
              <EditorDecisionRow
                key={p.id}
                profileId={p.id}
                slug={p.slug}
                fullName={p.full_name}
                position={p.current_position}
                photoUrl={p.photo_url}
              />
            ))
          )}
        </div>
      </div>

      {recent.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate">
            Recently Edited
          </h2>
          <div className="mt-3 space-y-2">
            {recent.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-mist px-4 py-3"
              >
                <p className="text-sm font-medium text-navy dark:text-white">{p.full_name}</p>
                <Badge variant="neutral" size="sm">
                  {p.workflow_status.replace(/_/g, " ")}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
