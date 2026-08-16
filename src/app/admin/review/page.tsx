import { getAdminReviewQueue, getPublishableProfiles } from "@/lib/data/admin";
import { AdminReviewRow } from "@/components/admin/admin-review-row";

export default async function AdminReviewPage() {
  const [reviewQueue, publishable] = await Promise.all([
    getAdminReviewQueue(),
    getPublishableProfiles(),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
        Content Review
      </h1>
      <p className="mt-1 text-sm text-slate">
        Editor-approved profiles awaiting your final decision, and
        approved/verified profiles ready to publish.
      </p>

      <div className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate">
          Awaiting Admin Decision ({reviewQueue.length})
        </h2>
        <div className="mt-3 space-y-3">
          {reviewQueue.length === 0 ? (
            <p className="rounded-xl border border-dashed border-mist py-10 text-center text-sm text-slate">
              Nothing awaiting your decision.
            </p>
          ) : (
            reviewQueue.map((p) => (
              <AdminReviewRow
                key={p.id}
                profileId={p.id}
                slug={p.slug}
                fullName={p.full_name}
                position={p.current_position}
                photoUrl={p.photo_url}
                editorialNotes={p.editorial_notes}
                workflowStatus={p.workflow_status}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate">
          Ready to Publish ({publishable.filter((p) => p.workflow_status !== "published").length})
        </h2>
        <div className="mt-3 space-y-3">
          {publishable.filter((p) => p.workflow_status !== "published").length === 0 ? (
            <p className="rounded-xl border border-dashed border-mist py-10 text-center text-sm text-slate">
              Nothing ready to publish.
            </p>
          ) : (
            publishable
              .filter((p) => p.workflow_status !== "published")
              .map((p) => (
                <AdminReviewRow
                  key={p.id}
                  profileId={p.id}
                  slug={p.slug}
                  fullName={p.full_name}
                  position={p.current_position}
                  photoUrl={p.photo_url}
                  editorialNotes={null}
                  workflowStatus={p.workflow_status}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}
