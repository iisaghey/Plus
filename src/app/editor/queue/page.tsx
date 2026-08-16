import { getReviewQueue } from "@/lib/data/editor";
import { EditorDecisionRow } from "@/components/editor/editor-decision-row";

export default async function EditorQueuePage() {
  const queue = await getReviewQueue();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
        Review Queue
      </h1>
      <p className="mt-1 text-sm text-slate">
        Profiles submitted by Staff, waiting for your decision, oldest first.
      </p>

      <div className="mt-8 space-y-3">
        {queue.length === 0 ? (
          <p className="rounded-xl border border-dashed border-mist py-16 text-center text-sm text-slate">
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
  );
}
