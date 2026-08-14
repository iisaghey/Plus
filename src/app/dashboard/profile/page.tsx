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
import { ActivitiesEditor } from "@/components/profile/activities-editor";
import { TravelEditor } from "@/components/profile/travel-editor";
import { SpeechesEditor } from "@/components/profile/speeches-editor";

const STAFF_ROLES = ["super_admin", "admin", "editor", "staff"];

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
          .select("*")
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
      ];

  const action = profile
    ? updateProfile.bind(null, profile.id, "/dashboard")
    : createProfile;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-bold text-navy">
        {profile ? "Edit Your Profile" : "Create Your Profile"}
      </h1>
      <p className="mt-2 text-sm text-slate">
        {profile
          ? "Update your core identity details."
          : "Start with the essentials — you can add your career timeline, achievements, media, and documents from your dashboard afterward."}
      </p>

      <div className="mt-8">
        <ProfileForm
          action={action}
          profile={profile}
          categories={categories ?? []}
          organizations={organizations ?? []}
          submitLabel={profile ? "Save Changes" : "Create Profile"}
        />
      </div>

      {profile && (
        <div className="mt-8 space-y-8">
          <BiographyEditor profileId={profile.id} biography={biography ?? null} />
          <CareerTimelineEditor
            profileId={profile.id}
            entries={careerTimeline ?? []}
          />
          <PositionsEditor profileId={profile.id} entries={positions ?? []} />
          <AchievementsEditor profileId={profile.id} entries={achievements ?? []} />
          <ActivitiesEditor profileId={profile.id} entries={activities ?? []} />
          <TravelEditor profileId={profile.id} entries={travel ?? []} />
          <SpeechesEditor profileId={profile.id} entries={speeches ?? []} />
          <MediaEditor profileId={profile.id} entries={media ?? []} />
          <DocumentsEditor profileId={profile.id} entries={documents ?? []} />
        </div>
      )}
    </div>
  );
}
