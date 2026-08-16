import Link from "next/link";
import {
  Users,
  FileEdit,
  Clock,
  BadgeCheck,
  Undo2,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  getReviewQueue,
  getEditorRecentActivity,
  getEditorStats,
  getRecentProfiles,
} from "@/lib/data/editor";
import { EditorHeader } from "@/components/editor/editor-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActions } from "@/components/editor/quick-actions";
import { RecentProfilesTable } from "@/components/editor/recent-profiles-table";
import { EditorDecisionRow } from "@/components/editor/editor-decision-row";
import { NotificationList } from "@/components/dashboard/notification-list";
import { Badge } from "@/components/ui/badge";
import { WORKFLOW_STATUS_VARIANT, workflowStatusLabel } from "@/lib/workflow";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";

export default async function EditorDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: ownProfile }, queue, recentActivity, stats, recentProfiles, { data: notifications }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, photo_url")
        .eq("user_id", user.id)
        .maybeSingle(),
      getReviewQueue(),
      getEditorRecentActivity(user.id),
      getEditorStats(),
      getRecentProfiles(8),
      supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const displayName = ownProfile?.full_name ?? user.email?.split("@")[0] ?? "Editor";

  return (
    <div className="space-y-8">
      <EditorHeader
        name={displayName}
        email={user.email ?? ""}
        photoUrl={ownProfile?.photo_url ?? null}
      />

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate">
          Overview
        </h2>
        <StaggerGrid className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StaggerItem hoverLift><StatCard label="Total Profiles" value={stats.totalProfiles} icon={Users} accent="navy" /></StaggerItem>
          <StaggerItem hoverLift><StatCard label="Drafts" value={stats.drafts} icon={FileEdit} accent="sky" /></StaggerItem>
          <StaggerItem hoverLift><StatCard label="Under Review" value={stats.underReview} icon={Clock} accent="gold" /></StaggerItem>
          <StaggerItem hoverLift><StatCard label="Published" value={stats.published} icon={ShieldCheck} accent="emerald" /></StaggerItem>
          <StaggerItem hoverLift><StatCard label="Returned" value={stats.returned} icon={Undo2} accent="gold" /></StaggerItem>
          <StaggerItem hoverLift><StatCard label="Verified" value={stats.verifiedProfiles} icon={BadgeCheck} accent="teal" /></StaggerItem>
        </StaggerGrid>
      </div>

      <QuickActions />

      <RecentProfilesTable profiles={recentProfiles} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-navy dark:text-white">
              Review Queue ({queue.length})
            </h2>
            <Link href="/editor/queue" className="text-xs font-semibold text-teal hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {queue.length === 0 ? (
              <p className="rounded-xl border border-dashed border-mist py-10 text-center text-sm text-slate">
                Nothing waiting for review.
              </p>
            ) : (
              queue
                .slice(0, 3)
                .map((p) => (
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

        <div className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-6">
          <h2 className="font-heading text-base font-bold text-navy dark:text-white">
            Notifications
          </h2>
          <div className="mt-4">
            <NotificationList notifications={notifications ?? []} />
          </div>
        </div>
      </div>

      {recentActivity.length > 0 && (
        <div className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-6">
          <h2 className="font-heading text-base font-bold text-navy dark:text-white">
            Recent Editor Activity
          </h2>
          <div className="mt-4 space-y-2">
            {recentActivity.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-mist px-4 py-3"
              >
                <p className="text-sm font-medium text-navy dark:text-white">{p.full_name}</p>
                <Badge variant={WORKFLOW_STATUS_VARIANT[p.workflow_status]} size="sm">
                  {workflowStatusLabel(p.workflow_status)}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
