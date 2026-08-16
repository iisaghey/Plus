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
import { ActivitiesEditor } from "@/components/profile/activities-editor";
import { TravelEditor } from "@/components/profile/travel-editor";
import { SpeechesEditor } from "@/components/profile/speeches-editor";
import { EditorDecisionRow } from "@/components/editor/editor-decision-row";
import { Badge } from "@/components/ui/badge";
import { WORKFLOW_STATUS_VARIANT, workflowStatusLabel } from "@/lib/workflow";

export default async function EditorProfileEditPage(
  props: PageProps<"/editor/profiles/[id]">
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
    supabase.from("official_activities").select("*").eq("profile_id", id).eq("status", "active").order("sort_order"),
    supabase.from("official_travel").select("*").eq("profile_id", id).eq("status", "active").order("sort_order"),
    supabase.from("speeches").select("*").eq("profile_id", id).eq("status", "active").order("sort_order"),
  ]);

  if (!profile) notFound();

  const action = updateProfile.bind(null, profile.id, `/editor/profiles/${profile.id}`);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
          {profile.full_name}
        </h1>
        <Badge variant={WORKFLOW_STATUS_VARIANT[profile.workflow_status]} size="sm">
          {workflowStatusLabel(profile.workflow_status)}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-slate">
        As an editor you can edit this profile directly at any stage.
      </p>

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
        <ProfileForm
          action={action}
          profile={profile}
          categories={categories ?? []}
          organizations={organizations ?? []}
          submitLabel="Save Changes"
        />
      </div>

      <div className="mt-8 space-y-8">
        <BiographyEditor profileId={profile.id} biography={biography ?? null} />
        <CareerTimelineEditor profileId={profile.id} entries={careerTimeline ?? []} />
        <PositionsEditor profileId={profile.id} entries={positions ?? []} />
        <AchievementsEditor profileId={profile.id} entries={achievements ?? []} />
        <ActivitiesEditor profileId={profile.id} entries={activities ?? []} />
        <TravelEditor profileId={profile.id} entries={travel ?? []} />
        <SpeechesEditor profileId={profile.id} entries={speeches ?? []} />
        <MediaEditor profileId={profile.id} entries={media ?? []} />
        <DocumentsEditor profileId={profile.id} entries={documents ?? []} />
      </div>
    </div>
  );
}
