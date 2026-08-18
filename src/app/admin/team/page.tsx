import Link from "next/link";
import {
  getUsersByRole,
  getAllProfilesForAssignment,
} from "@/lib/data/admin";
import { TeamMemberRow } from "@/components/admin/team-member-row";
import { AssignmentRow } from "@/components/admin/assignment-row";
import { SectionHeader } from "@/components/dashboard/section-header";

const TABS = [
  { key: "all", label: "All" },
  { key: "staff", label: "Staff" },
  { key: "editor", label: "Editors" },
] as const;

export default async function AdminTeamPage(
  props: PageProps<"/admin/team">
) {
  const searchParams = await props.searchParams;
  const rawRole = typeof searchParams.role === "string" ? searchParams.role : "all";
  const roleFilter: (typeof TABS)[number]["key"] = TABS.some((t) => t.key === rawRole)
    ? (rawRole as (typeof TABS)[number]["key"])
    : "all";

  const [staff, editors, profiles] = await Promise.all([
    getUsersByRole(["staff"]),
    getUsersByRole(["editor"]),
    getAllProfilesForAssignment(),
  ]);

  const team =
    roleFilter === "staff" ? staff : roleFilter === "editor" ? editors : [...staff, ...editors];

  return (
    <div>
      <SectionHeader
        title="Staff & Editors"
        subtitle="Manage your team's roles and assign profiles to work on."
        tabs={TABS.map((tab) => ({
          key: tab.key,
          label: tab.label,
          href: tab.key === "all" ? "/admin/team" : `/admin/team?role=${tab.key}`,
        }))}
        activeTabKey={roleFilter}
      />

      <div className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate">
          Team Members ({team.length})
        </h2>
        <div className="mt-3 space-y-2">
          {team.length === 0 ? (
            <p className="rounded-xl border border-dashed border-mist py-8 text-center text-sm text-slate">
              No Staff or Editor accounts yet. Promote an approved user&apos;s
              role from{" "}
              <Link href="/admin/users" className="font-semibold text-teal hover:underline">
                Users
              </Link>
              {" "}— they&apos;ll appear here once promoted.
            </p>
          ) : (
            team.map((t) => (
              <TeamMemberRow key={t.user_id} userId={t.user_id} email={t.email} role={t.role} />
            ))
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate">
          Profile Assignments
        </h2>
        <div className="mt-3 space-y-3">
          {profiles.length === 0 ? (
            <p className="rounded-xl border border-dashed border-mist py-8 text-center text-sm text-slate">
              No profiles yet.
            </p>
          ) : (
            profiles.map((p) => (
              <AssignmentRow
                key={p.id}
                profileId={p.id}
                slug={p.slug}
                fullName={p.full_name}
                workflowStatus={p.workflow_status}
                initialStaffId={p.assigned_staff_id}
                initialEditorId={p.assigned_editor_id}
                initialDeadline={p.assignment_deadline}
                staffOptions={staff}
                editorOptions={editors}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
