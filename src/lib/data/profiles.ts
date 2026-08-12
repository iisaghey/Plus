import { createClient } from "@/lib/supabase/server";

const CARD_SELECT = `
  id, slug, full_name, preferred_title, current_position, country, location,
  photo_url, short_bio, verification_status, view_count, created_at,
  organizations ( name ),
  categories ( name, slug )
`;

export async function getFeaturedProfiles(limit = 6) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(CARD_SELECT)
    .eq("is_public", true)
    .eq("status", "active")
    .order("view_count", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getRecentProfiles(limit = 8) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(CARD_SELECT)
    .eq("is_public", true)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getVerifiedProfiles(limit = 8) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(CARD_SELECT)
    .eq("is_public", true)
    .eq("status", "active")
    .eq("verification_status", "verified")
    .order("verified_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getPlatformStats() {
  const supabase = await createClient();
  const [{ count: total }, { count: verified }, { count: orgs }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_public", true)
        .eq("status", "active"),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("verification_status", "verified"),
      supabase
        .from("organizations")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
    ]);
  return {
    totalProfiles: total ?? 0,
    verifiedProfiles: verified ?? 0,
    organizations: orgs ?? 0,
  };
}

export async function getProfileBySlug(slug: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      `*, organizations ( id, name, logo_url, website ), categories ( id, name, slug )`
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!profile) return null;

  const [
    { data: biography },
    { data: careerTimeline },
    { data: governmentPositions },
    { data: achievements },
    { data: activities },
    { data: travel },
    { data: speeches },
    { data: media },
    { data: documents },
    { data: qr },
  ] = await Promise.all([
    supabase
      .from("biographies")
      .select("*")
      .eq("profile_id", profile.id)
      .eq("status", "active")
      .maybeSingle(),
    supabase
      .from("career_timeline")
      .select("*")
      .eq("profile_id", profile.id)
      .eq("status", "active")
      .order("sort_order"),
    supabase
      .from("government_positions")
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
    supabase
      .from("qr_profiles")
      .select("*")
      .eq("profile_id", profile.id)
      .maybeSingle(),
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
    media: media ?? [],
    documents: documents ?? [],
    qr,
  };
}

export type ProfileCardData = Awaited<
  ReturnType<typeof getFeaturedProfiles>
>[number];
