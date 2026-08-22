import Link from "next/link";
import {
  getUsersByRole,
  getAllProfilesForAssignment,
} from "@/lib/data/admin";
import { TeamMemberRow } from "@/components/admin/team-member-row";
import { AssignmentRow } from "@/components/admin/assignment-row";
import { SectionHeader } from "@/components/dashboard/section-header";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

const TAB_KEYS = ["all", "staff", "editor"] as const;

export default async function AdminTeamPage(
  props: PageProps<"/admin/team">
) {
  const locale = await getServerLocale();
  const t = getDictionary(locale);

  const TABS = [
    { key: "all", label: t.admin.team.tabs.all },
    { key: "staff", label: t.admin.team.tabs.staff },
    { key: "editor", label: t.admin.team.tabs.editors },
  ] as const;

  const searchParams = await props.searchParams;
  const rawRole = typeof searchParams.role === "string" ? searchParams.role : "all";
  const roleFilter: (typeof TAB_KEYS)[number] = TAB_KEYS.includes(rawRole as (typeof TAB_KEYS)[number])
    ? (rawRole as (typeof TAB_KEYS)[number])
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
        title={t.admin.team.title}
        subtitle={t.admin.team.subtitle}
        tabs={TABS.map((tab) => ({
          key: tab.key,
          label: tab.label,
          href: tab.key === "all" ? "/admin/team" : `/admin/team?role=${tab.key}`,
        }))}
        activeTabKey={roleFilter}
      />

      <div className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate">
          {t.admin.team.teamMembers} ({team.length})
        </h2>
        <div className="mt-3 space-y-2">
          {team.length === 0 ? (
            <p className="rounded-xl border border-dashed border-mist py-8 text-center text-sm text-slate">
              {t.admin.team.noTeamPrefix}{" "}
              <Link href="/admin/users" className="font-semibold text-teal hover:underline">
                {t.admin.team.usersLink}
              </Link>
              {" "}{t.admin.team.noTeamSuffix}
            </p>
          ) : (
            team.map((member) => (
              <TeamMemberRow key={member.user_id} userId={member.user_id} email={member.email} role={member.role} />
            ))
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate">
          {t.admin.team.profileAssignments}
        </h2>
        <div className="mt-3 space-y-3">
          {profiles.length === 0 ? (
            <p className="rounded-xl border border-dashed border-mist py-8 text-center text-sm text-slate">
              {t.admin.team.noProfiles}
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
