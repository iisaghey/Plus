import {
  getAdminReviewQueue,
  getPublishableProfiles,
  getPendingPublishedEdits,
} from "@/lib/data/admin";
import { AdminReviewRow } from "@/components/admin/admin-review-row";
import { PublishedEditReviewRow } from "@/components/admin/published-edit-review-row";
import { SectionHeader } from "@/components/dashboard/section-header";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function AdminReviewPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const [reviewQueue, publishable, pendingPublishedEdits] = await Promise.all([
    getAdminReviewQueue(),
    getPublishableProfiles(),
    getPendingPublishedEdits(),
  ]);

  return (
    <div>
      <SectionHeader
        title={t.admin.review.title}
        subtitle={t.admin.review.subtitle}
      />

      <div className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate">
          {t.admin.review.awaitingDecision} ({reviewQueue.length})
        </h2>
        <div className="mt-3 space-y-3">
          {reviewQueue.length === 0 ? (
            <p className="rounded-xl border border-dashed border-mist py-10 text-center text-sm text-slate">
              {t.admin.review.nothingAwaitingDecision}
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
          {t.admin.review.publishedEditsAwaitingReview} ({pendingPublishedEdits.length})
        </h2>
        <p className="mt-1 text-xs text-slate">
          {t.admin.review.publishedEditsDescription}
        </p>
        <div className="mt-3 space-y-3">
          {pendingPublishedEdits.length === 0 ? (
            <p className="rounded-xl border border-dashed border-mist py-10 text-center text-sm text-slate">
              {t.admin.review.noPublishedEdits}
            </p>
          ) : (
            pendingPublishedEdits.map((p) => (
              <PublishedEditReviewRow
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

      <div className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate">
          {t.admin.review.readyToPublish} ({publishable.filter((p) => p.workflow_status !== "published").length})
        </h2>
        <div className="mt-3 space-y-3">
          {publishable.filter((p) => p.workflow_status !== "published").length === 0 ? (
            <p className="rounded-xl border border-dashed border-mist py-10 text-center text-sm text-slate">
              {t.admin.review.nothingReadyToPublish}
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
