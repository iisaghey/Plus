import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createProfile, updateProfile } from "@/lib/actions/profile";
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
import { isEditableByOwner } from "@/lib/workflow";
import {
  Lock,
  ArrowLeft,
  IdCard,
  BookOpenText,
  Landmark,
  Trophy,
  Mic,
  Images,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const STAFF_ROLES = ["super_admin", "admin", "editor", "staff"];
const UNRESTRICTED_ROLES = ["super_admin", "admin", "editor"];

const LOCKED_MESSAGES: Record<string, string> = {
  submitted: "Your profile has been submitted and is waiting to be picked up for review.",
  under_review: "An editor is currently reviewing your profile.",
  editor_approved: "Your profile has passed editorial review and is awaiting admin sign-off.",
  admin_review: "An admin is currently reviewing your profile.",
  approved: "Your profile has been approved and is queued for publishing.",
  verified: "Your profile has been verified and is queued for publishing.",
  published: "Your profile is live. Contact support if you need to make changes.",
  suspended: "Your profile has been suspended. Contact support for details.",
  archived: "Your profile has been archived and can no longer be edited here.",
};

const STEPS: WizardStepDef[] = [
  { id: "identity", label: "Personal & Contact", icon: IdCard, sections: ["identity", "contact", "social"] },
  { id: "background", label: "Biography & Education", icon: BookOpenText, sections: ["biography", "education"] },
  { id: "career", label: "Career & Positions", icon: Landmark, sections: ["career", "positions"] },
  { id: "recognition", label: "Achievements & Activities", icon: Trophy, sections: ["achievements", "activities", "travel"] },
  { id: "speeches", label: "Speeches", icon: Mic, sections: ["speeches"] },
  { id: "media", label: "Media & Documents", icon: Images, sections: ["media", "documents"] },
  { id: "review", label: "Review & Submit", icon: ShieldCheck, sections: ["review"] },
];

export default async function DashboardProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: userRole }, { data: profile }, { data: categories }, { data: organizations }] =
    await Promise.all([
      supabase.from("user_roles").select("role, account_status").eq("user_id", user.id).maybeSingle(),
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("categories").select("id, name").eq("status", "active").order("name"),
      supabase.from("organizations").select("id, name").eq("status", "active").order("name"),
    ]);

  const isStaff = Boolean(userRole && STAFF_ROLES.includes(userRole.role));
  if (!isStaff && userRole?.account_status !== "approved") redirect("/dashboard");

  const [
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
  ] = profile
    ? await Promise.all([
        supabase
          .from("career_timeline")
          .select("*")
          .eq("profile_id", profile.id)
          .eq("status", "active")
          .order("sort_order"),
        supabase
          .from("achievements")
          .select("*")
          .eq("profile_id", profile.id)
          .eq("status", "active")
          .order("sort_order"),
        supabase
          .from("media")
          .select("*")
          .eq("profile_id", profile.id)
          .eq("status", "active")
          .order("sort_order"),
        supabase
          .from("documents")
          .select("*")
          .eq("profile_id", profile.id)
          .eq("status", "active")
          .order("sort_order"),
        supabase.from("biographies").select("*").eq("profile_id", profile.id).maybeSingle(),
        supabase
          .from("government_positions")
          .select("*")
          .eq("profile_id", profile.id)
          .eq("status", "active")
          .order("sort_order"),
        supabase
          .from("education")
          .select("*")
          .eq("profile_id", profile.id)
          .eq("status", "active")
          .order("sort_order"),
        supabase
          .from("official_activities")
          .select("*")
          .eq("profile_id", profile.id)
          .eq("status", "active")
          .order("sort_order"),
        supabase
          .from("official_travel")
          .select("*")
          .eq("profile_id", profile.id)
          .eq("status", "active")
          .order("sort_order"),
        supabase
          .from("speeches")
          .select("*, speech_attachments(*)")
          .eq("profile_id", profile.id)
          .eq("status", "active")
          .order("sort_order"),
      ])
    : [
        { data: null },
        { data: null },
        { data: null },
        { data: null },
        { data: null },
        { data: null },
        { data: null },
        { data: null },
        { data: null },
        { data: null },
      ];

  const action = profile
    ? updateProfile.bind(null, profile.id, "/dashboard")
    : createProfile;

  const isUnrestrictedRole = Boolean(userRole && UNRESTRICTED_ROLES.includes(userRole.role));
  const locked =
    Boolean(profile) && !isUnrestrictedRole && !isEditableByOwner(profile!.workflow_status);

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate transition-colors hover:text-teal"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="mt-4 font-heading text-2xl font-bold text-navy dark:text-white">
          Create Your Profile
        </h1>
        <p className="mt-2 text-sm text-slate">
          Start with the essentials — you can add your career timeline, achievements, media, and
          documents from your dashboard afterward.
        </p>
        <div className="mt-8">
          <ProfileForm
            action={action}
            profile={profile}
            categories={categories ?? []}
            organizations={organizations ?? []}
            submitLabel="Create Profile"
          />
        </div>
      </div>
    );
  }

  const checklist = [
    { label: "Full name & photo", done: Boolean(profile.full_name && profile.photo_url) },
    { label: "Current position & category", done: Boolean(profile.current_position && profile.category_id) },
    { label: "Contact info (email or phone)", done: Boolean(profile.email || profile.phone) },
    {
      label: "Social media",
      done: Boolean(profile.social_links && Object.keys(profile.social_links as object).length > 0),
    },
    { label: "Biography", done: Boolean(biography?.summary) },
    { label: "Education", done: (education ?? []).length > 0 },
    { label: "Career or government positions", done: (careerTimeline ?? []).length > 0 || (positions ?? []).length > 0 },
    { label: "Achievements", done: (achievements ?? []).length > 0 },
    { label: "Official activities", done: (activities ?? []).length > 0 },
    { label: "Official travel", done: (travel ?? []).length > 0 },
    { label: "Speeches", done: (speeches ?? []).length > 0 },
    { label: "Media & gallery", done: (media ?? []).length > 0 },
    { label: "Documents & records", done: (documents ?? []).length > 0 },
  ];
  const completionPercent = Math.round(
    (checklist.filter((c) => c.done).length / checklist.length) * 100
  );

  const publicUrl = `/profile/${profile.slug}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate transition-colors hover:text-teal"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>
      <h1 className="mt-4 font-heading text-2xl font-bold text-navy dark:text-white">
        Edit Your Profile
      </h1>
      <p className="mt-2 text-sm text-slate">
        Work through each section at your own pace — everything saves as you go.
      </p>

      {locked && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-navy dark:text-white">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <p>
            {LOCKED_MESSAGES[profile.workflow_status] ??
              "Your profile can't be edited right now."}
          </p>
        </div>
      )}

      <div className="mt-8">
        <ProfileWizard
          steps={STEPS}
          completionPercent={completionPercent}
          previewHref={`/profile/${profile.slug}`}
          reviewSlot={
            isEditableByOwner(profile.workflow_status) && !locked ? (
              <SubmitReviewButton profileId={profile.id} redirectTo="/dashboard" />
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
            <ProfileReviewStep profile={profile} checklist={checklist} publicUrl={publicUrl} />
          </ProfileWizardStep>
        </ProfileWizard>
      </div>
    </div>
  );
}
