import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/actions/profile";
import { ProfileForm } from "@/components/profile/profile-form";
import { CareerTimelineEditor } from "@/components/profile/career-timeline-editor";
import { AchievementsEditor } from "@/components/profile/achievements-editor";
import { MediaEditor } from "@/components/profile/media-editor";
import { DocumentsEditor } from "@/components/profile/documents-editor";
import { BiographyEditor } from "@/components/profile/biography-editor";
import { PositionsEditor } from "@/components/profile/positions-editor";
import { EducationEditor } from "@/components/profile/education-editor";
import { ActivitiesEditor } from "@/components/profile/activities-editor";
import { TravelEditor } from "@/components/profile/travel-editor";
import { SpeechesEditor } from "@/components/profile/speeches-editor";
import { ProfileWizard, ProfileWizardStep, type WizardStepDef } from "@/components/profile/profile-wizard";
import { ProfileReviewStep } from "@/components/profile/profile-review-step";
import { EditorDecisionRow } from "@/components/editor/editor-decision-row";
import { EditPermissionGate } from "@/components/editor/edit-permission-gate";
import { Badge } from "@/components/ui/badge";
import { WORKFLOW_STATUS_VARIANT, workflowStatusLabel } from "@/lib/workflow";
import { computeSectionCompleteness } from "@/lib/profile-completeness";
import {
  IdCard,
  BookOpenText,
  Landmark,
  Trophy,
  Mic,
  Images,
  ShieldCheck,
} from "lucide-react";

const ICON_CLASS = "h-4 w-4";

const STEPS: WizardStepDef[] = [
  { id: "identity", label: "Personal & Contact", icon: <IdCard className={ICON_CLASS} />, sections: ["identity", "contact", "social"] },
  { id: "background", label: "Biography & Education", icon: <BookOpenText className={ICON_CLASS} />, sections: ["biography", "education"] },
  { id: "career", label: "Career & Positions", icon: <Landmark className={ICON_CLASS} />, sections: ["career", "positions"] },
  { id: "recognition", label: "Achievements & Activities", icon: <Trophy className={ICON_CLASS} />, sections: ["achievements", "activities", "travel"] },
  { id: "speeches", label: "Speeches", icon: <Mic className={ICON_CLASS} />, sections: ["speeches"] },
  { id: "media", label: "Media & Documents", icon: <Images className={ICON_CLASS} />, sections: ["media", "documents"] },
  { id: "review", label: "Review", icon: <ShieldCheck className={ICON_CLASS} />, sections: ["review"] },
];

export default async function EditorProfileEditPage(
  props: PageProps<"/editor/profiles/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  const role = userRole?.role ?? null;

  const [
    { data: profile },
    { data: categories },
    { data: organizations },
    { data: careerTimeline },
    { data: achievements },
    { data: media },
    { data: documents },
    { data: biography },
    { data: positions },
    { data: education },
    { data: activities },
    { data: travel },
    { data: speeches },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id, name").eq("status", "active").order("name"),
    supabase.from("organizations").select("id, name").eq("status", "active").order("name"),
    supabase.from("career_timeline").select("*").eq("profile_id", id).eq("status", "active").order("sort_order"),
    supabase.from("achievements").select("*").eq("profile_id", id).eq("status", "active").order("sort_order"),
    supabase.from("media").select("*").eq("profile_id", id).eq("status", "active").order("sort_order"),
    supabase.from("documents").select("*").eq("profile_id", id).eq("status", "active").order("sort_order"),
    supabase.from("biographies").select("*").eq("profile_id", id).maybeSingle(),
    supabase.from("government_positions").select("*").eq("profile_id", id).eq("status", "active").order("sort_order"),
    supabase.from("education").select("*").eq("profile_id", id).eq("status", "active").order("sort_order"),
    supabase.from("official_activities").select("*").eq("profile_id", id).eq("status", "active").order("sort_order"),
    supabase.from("official_travel").select("*").eq("profile_id", id).eq("status", "active").order("sort_order"),
    supabase.from("speeches").select("*, speech_attachments(*)").eq("profile_id", id).eq("status", "active").order("sort_order"),
  ]);

  if (!profile) notFound();

  const isPublished = profile.workflow_status === "published";
  const isEditorRole = role === "editor";

  const [{ data: activeGrant }, { data: openRequest }] = isEditorRole && isPublished
    ? await Promise.all([
        supabase
          .from("edit_permission_grants")
          .select("grant_type, allowed_fields, expires_at, used_at, revoked_at")
          .eq("profile_id", id)
          .eq("editor_id", user.id)
          .is("revoked_at", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("edit_permission_requests")
          .select("status, review_notes")
          .eq("profile_id", id)
          .eq("editor_id", user.id)
          .in("status", ["pending", "more_info_requested"])
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])
    : [{ data: null }, { data: null }];

  const now = Date.now();
  const grantIsActive =
    activeGrant &&
    (!activeGrant.expires_at || new Date(activeGrant.expires_at).getTime() > now) &&
    (activeGrant.grant_type !== "one_time" || !activeGrant.used_at);

  const locked = isEditorRole && isPublished && !grantIsActive;

  const action = updateProfile.bind(null, profile.id, `/editor/profiles/${profile.id}`);

  const sectionStatus = computeSectionCompleteness({
    profile,
    biography: biography ?? null,
    education: education ?? [],
    careerTimeline: careerTimeline ?? [],
    positions: positions ?? [],
    achievements: achievements ?? [],
    activities: activities ?? [],
    travel: travel ?? [],
    speeches: speeches ?? [],
    media: media ?? [],
    documents: documents ?? [],
  });
  const checklist = sectionStatus.map((s) => ({ label: s.label, done: s.complete }));
  const completionPercent = Math.round(
    (sectionStatus.filter((s) => s.complete).length / sectionStatus.length) * 100
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
          {profile.full_name}
        </h1>
        <Badge variant={WORKFLOW_STATUS_VARIANT[profile.workflow_status]} size="sm">
          {workflowStatusLabel(profile.workflow_status)}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-slate">
        {isPublished
          ? "This profile is live. Editors need Super Admin permission to change a published profile."
          : "As an editor you can edit this profile directly at this stage."}
      </p>

      {isEditorRole && isPublished && (
        <EditPermissionGate
          profileId={profile.id}
          profileName={profile.full_name}
          locked={locked}
          grant={
            grantIsActive
              ? {
                  grantType: activeGrant!.grant_type,
                  expiresAt: activeGrant!.expires_at,
                  allowedFields: activeGrant!.allowed_fields,
                }
              : null
          }
          pendingRequest={
            openRequest
              ? { status: openRequest.status as "pending" | "more_info_requested", reviewNotes: openRequest.review_notes }
              : null
          }
        />
      )}

      {profile.workflow_status === "submitted" && (
        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate">
            Editorial Decision
          </h2>
          <div className="mt-3">
            <EditorDecisionRow
              profileId={profile.id}
              slug={profile.slug}
              fullName={profile.full_name}
              position={profile.current_position}
              photoUrl={profile.photo_url}
            />
          </div>
        </div>
      )}

      <div className="mt-8">
        <ProfileWizard
          steps={STEPS}
          completionPercent={completionPercent}
          sectionStatus={sectionStatus}
          previewHref={`/profile/${profile.slug}`}
        >
          <ProfileWizardStep id="identity">
            <ProfileForm
              action={action}
              profile={profile}
              categories={categories ?? []}
              organizations={organizations ?? []}
              submitLabel="Save Changes"
              locked={locked}
            />
          </ProfileWizardStep>

          <ProfileWizardStep id="background">
            <BiographyEditor profileId={profile.id} biography={biography ?? null} locked={locked} />
            <EducationEditor profileId={profile.id} entries={education ?? []} locked={locked} />
          </ProfileWizardStep>

          <ProfileWizardStep id="career">
            <CareerTimelineEditor profileId={profile.id} entries={careerTimeline ?? []} locked={locked} />
            <PositionsEditor profileId={profile.id} entries={positions ?? []} locked={locked} />
          </ProfileWizardStep>

          <ProfileWizardStep id="recognition">
            <AchievementsEditor profileId={profile.id} entries={achievements ?? []} locked={locked} />
            <ActivitiesEditor profileId={profile.id} entries={activities ?? []} locked={locked} />
            <TravelEditor profileId={profile.id} entries={travel ?? []} locked={locked} />
          </ProfileWizardStep>

          <ProfileWizardStep id="speeches">
            <SpeechesEditor profileId={profile.id} entries={speeches ?? []} locked={locked} />
          </ProfileWizardStep>

          <ProfileWizardStep id="media">
            <MediaEditor profileId={profile.id} entries={media ?? []} locked={locked} />
            <DocumentsEditor profileId={profile.id} entries={documents ?? []} locked={locked} />
          </ProfileWizardStep>

          <ProfileWizardStep id="review">
            <ProfileReviewStep
              profile={profile}
              checklist={checklist}
              publicUrl={`/profile/${profile.slug}`}
            />
          </ProfileWizardStep>
        </ProfileWizard>
      </div>
    </div>
  );
}
