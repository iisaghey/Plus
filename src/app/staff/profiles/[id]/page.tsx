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
import { SubmitReviewButton } from "@/components/dashboard/submit-review-button";
import { Badge } from "@/components/ui/badge";
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
  { id: "review", label: "Review & Submit", icon: <ShieldCheck className={ICON_CLASS} />, sections: ["review"] },
];

export default async function StaffEditProfilePage(
  props: PageProps<"/staff/profiles/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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
    supabase.from("media").select("*").eq("profile_id", id).in("status", ["active", "archived"]).order("sort_order"),
    supabase.from("documents").select("*").eq("profile_id", id).eq("status", "active").order("sort_order"),
    supabase.from("biographies").select("*").eq("profile_id", id).maybeSingle(),
    supabase.from("government_positions").select("*").eq("profile_id", id).eq("status", "active").order("sort_order"),
    supabase.from("education").select("*").eq("profile_id", id).eq("status", "active").order("sort_order"),
    supabase.from("official_activities").select("*").eq("profile_id", id).eq("status", "active").order("sort_order"),
    supabase.from("official_travel").select("*").eq("profile_id", id).eq("status", "active").order("sort_order"),
    supabase.from("speeches").select("*, speech_attachments(*)").eq("profile_id", id).eq("status", "active").order("sort_order"),
  ]);

  if (!profile) notFound();

  const action = updateProfile.bind(null, profile.id, `/staff/profiles/${profile.id}`);

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
    media: (media ?? []).filter((m) => m.status !== "archived"),
    documents: documents ?? [],
  });
  const checklist = sectionStatus.map((s) => ({ label: s.label, done: s.complete }));
  const completionPercent = Math.round(
    (sectionStatus.filter((s) => s.complete).length / sectionStatus.length) * 100
  );

  const canSubmitForReview = ["draft", "in_progress", "changes_required"].includes(
    profile.workflow_status
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
          {profile.full_name}
        </h1>
        <Badge variant="neutral" size="sm">
          {profile.workflow_status.replace(/_/g, " ")}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-slate">
        Edit the profile, then submit it for editorial review when ready.
      </p>

      <div className="mt-8">
        <ProfileWizard
          steps={STEPS}
          completionPercent={completionPercent}
          sectionStatus={sectionStatus}
          previewHref={`/profile/${profile.slug}`}
          reviewSlot={
            canSubmitForReview ? (
              <SubmitReviewButton profileId={profile.id} redirectTo="/staff" />
            ) : undefined
          }
        >
          <ProfileWizardStep id="identity">
            <ProfileForm
              action={action}
              profile={profile}
              categories={categories ?? []}
              organizations={organizations ?? []}
              submitLabel="Save Changes"
            />
          </ProfileWizardStep>

          <ProfileWizardStep id="background">
            <BiographyEditor profileId={profile.id} biography={biography ?? null} />
            <EducationEditor profileId={profile.id} entries={education ?? []} />
          </ProfileWizardStep>

          <ProfileWizardStep id="career">
            <CareerTimelineEditor profileId={profile.id} entries={careerTimeline ?? []} />
            <PositionsEditor profileId={profile.id} entries={positions ?? []} />
          </ProfileWizardStep>

          <ProfileWizardStep id="recognition">
            <AchievementsEditor profileId={profile.id} entries={achievements ?? []} />
            <ActivitiesEditor profileId={profile.id} entries={activities ?? []} />
            <TravelEditor profileId={profile.id} entries={travel ?? []} />
          </ProfileWizardStep>

          <ProfileWizardStep id="speeches">
            <SpeechesEditor profileId={profile.id} entries={speeches ?? []} />
          </ProfileWizardStep>

          <ProfileWizardStep id="media">
            <MediaEditor profileId={profile.id} entries={media ?? []} />
            <DocumentsEditor profileId={profile.id} entries={documents ?? []} />
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
