import {
  getUsersByRole,
  getAllProfilesForAssignment,
} from "@/lib/data/admin";
import { TeamMemberRow } from "@/components/admin/team-member-row";
import { AssignmentRow } from "@/components/admin/assignment-row";

export default async function AdminTeamPage() {
  const [staff, editors, profiles] = await Promise.all([
    getUsersByRole(["staff"]),
    getUsersByRole(["editor"]),
    getAllProfilesForAssignment(),
  ]);

  const team = [...staff, ...editors];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy">
        Staff, Editors & Task Assignment
      </h1>
      <p className="mt-1 text-sm text-slate">
        Manage your team's roles and assign profiles to work on.
      </p>

      <div className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate">
          Team Members ({team.length})
        </h2>
        <div className="mt-3 space-y-2">
          {team.length === 0 ? (
            <p className="rounded-xl border border-dashed border-mist py-8 text-center text-sm text-slate">
              No Staff or Editor accounts yet. Promote an approved user below,
              or from Account Approvals once they sign up.
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
