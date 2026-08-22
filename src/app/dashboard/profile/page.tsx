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
import { computeSectionCompleteness } from "@/lib/profile-completeness";
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
import type { Metadata } from "next";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const STAFF_ROLES = ["super_admin", "admin", "editor", "staff"];
const UNRESTRICTED_ROLES = ["super_admin", "admin", "editor"];

const ICON_CLASS = "h-4 w-4";

export default async function DashboardProfilePage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);

  const LOCKED_MESSAGES: Record<string, string> = {
    submitted: t.dashboard.profile.lockedMessages.submitted,
    under_review: t.dashboard.profile.lockedMessages.underReview,
    editor_approved: t.dashboard.profile.lockedMessages.editorApproved,
    admin_review: t.dashboard.profile.lockedMessages.adminReview,
    approved: t.dashboard.profile.lockedMessages.approved,
    verified: t.dashboard.profile.lockedMessages.verified,
    published: t.dashboard.profile.lockedMessages.published,
    suspended: t.dashboard.profile.lockedMessages.suspended,
    archived: t.dashboard.profile.lockedMessages.archived,
  };

  const STEPS: WizardStepDef[] = [
    { id: "identity", label: t.dashboard.profile.steps.identity, icon: <IdCard className={ICON_CLASS} />, sections: ["identity", "contact", "social"] },
    { id: "background", label: t.dashboard.profile.steps.background, icon: <BookOpenText className={ICON_CLASS} />, sections: ["biography", "education"] },
    { id: "career", label: t.dashboard.profile.steps.career, icon: <Landmark className={ICON_CLASS} />, sections: ["career", "positions"] },
    { id: "recognition", label: t.dashboard.profile.steps.recognition, icon: <Trophy className={ICON_CLASS} />, sections: ["achievements", "activities", "travel"] },
    { id: "speeches", label: t.dashboard.profile.steps.speeches, icon: <Mic className={ICON_CLASS} />, sections: ["speeches"] },
    { id: "media", label: t.dashboard.profile.steps.media, icon: <Images className={ICON_CLASS} />, sections: ["media", "documents"] },
    { id: "review", label: t.dashboard.profile.steps.review, icon: <ShieldCheck className={ICON_CLASS} />, sections: ["review"] },
  ];

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
          .in("status", ["active", "archived"])
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
          {t.dashboard.profile.backToDashboard}
        </Link>
        <h1 className="mt-4 font-heading text-2xl font-bold text-navy dark:text-white">
          {t.dashboard.profile.createHeading}
        </h1>
        <p className="mt-2 text-sm text-slate">
          {t.dashboard.profile.createSubheading}
        </p>
        <div className="mt-8">
          <ProfileForm
            action={action}
            profile={profile}
            categories={categories ?? []}
            organizations={organizations ?? []}
            submitLabel={t.dashboard.profile.createSubmitLabel}
          />
        </div>
      </div>
    );
  }

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

  const publicUrl = `/profile/${profile.slug}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate transition-colors hover:text-teal"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.dashboard.profile.backToDashboard}
      </Link>
      <h1 className="mt-4 font-heading text-2xl font-bold text-navy dark:text-white">
        {t.dashboard.profile.editHeading}
      </h1>
      <p className="mt-2 text-sm text-slate">
        {t.dashboard.profile.editSubheading}
      </p>

      {locked && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-navy dark:text-white">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <p>
            {LOCKED_MESSAGES[profile.workflow_status] ??
              t.dashboard.profile.lockedFallback}
          </p>
        </div>
      )}

      <div className="mt-8">
        <ProfileWizard
          steps={STEPS}
          completionPercent={completionPercent}
          sectionStatus={sectionStatus}
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
              submitLabel={t.dashboard.profile.saveChangesLabel}
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
