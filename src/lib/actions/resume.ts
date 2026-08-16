"use server";

import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/actions/audit";

async function requireSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, role: null as string | null };

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  return { supabase, user, role: userRole?.role ?? null };
}

export async function getProfileResumeData(profileId: string) {
  const { supabase, user, role } = await requireSuperAdmin();
  if (!user || role !== "super_admin") {
    return { error: "Only Super Admins can export a profile resume." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      `*, organizations ( name ), categories ( name )`
    )
    .eq("id", profileId)
    .maybeSingle();

  if (!profile) return { error: "Profile not found." };

  await logAuditEvent(supabase, {
    actorId: user.id,
    actorRole: role,
    action: "export_resume",
    entityType: "profile",
    entityId: profileId,
    newValue: { full_name: profile.full_name },
  });

  const [
    { data: biography },
    { data: careerTimeline },
    { data: governmentPositions },
    { data: achievements },
    { data: activities },
    { data: travel },
    { data: speeches },
  ] = await Promise.all([
    supabase
      .from("biographies")
      .select("summary, content")
      .eq("profile_id", profileId)
      .maybeSingle(),
    supabase
      .from("career_timeline")
      .select("*")
      .eq("profile_id", profileId)
      .order("sort_order"),
    supabase
      .from("government_positions")
      .select("*")
      .eq("profile_id", profileId)
      .order("sort_order"),
    supabase
      .from("achievements")
      .select("*")
      .eq("profile_id", profileId)
      .order("sort_order"),
    supabase
      .from("official_activities")
      .select("*")
      .eq("profile_id", profileId)
      .order("sort_order"),
    supabase
      .from("official_travel")
      .select("*")
      .eq("profile_id", profileId)
      .order("sort_order"),
    supabase
      .from("speeches")
      .select("*")
      .eq("profile_id", profileId)
      .order("sort_order"),
  ]);

  return {
    profile,
    biography,
    careerTimeline: careerTimeline ?? [],
    governmentPositions: governmentPositions ?? [],
    achievements: achievements ?? [],
    activities: activities ?? [],
    travel: travel ?? [],
    speeches: speeches ?? [],
  };
}

export type ProfileResumeData = Exclude<
  Awaited<ReturnType<typeof getProfileResumeData>>,
  { error: string }
>;
