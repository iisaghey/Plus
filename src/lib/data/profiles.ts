import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database.types";

const VERIFICATION_STATUSES: Enums<"verification_status">[] = [
  "unverified",
  "pending",
  "verified",
  "rejected",
];

function isVerificationStatus(
  value: string
): value is Enums<"verification_status"> {
  return (VERIFICATION_STATUSES as string[]).includes(value);
}

const CARD_SELECT = `
  id, slug, full_name, preferred_title, current_position, country, location,
  photo_url, cover_url, short_bio, verification_status, view_count, created_at,
  organizations ( name ),
  categories ( name, slug )
`;

function publicProfilesQuery(supabase: Awaited<ReturnType<typeof createClient>>) {
  return supabase
    .from("profiles")
    .select(CARD_SELECT)
    .eq("is_public", true)
    .eq("status", "active")
    .eq("workflow_status", "published")
    .is("hidden_at", null)
    .is("deleted_at", null);
}

export async function getFeaturedProfiles(limit = 6) {
  const supabase = await createClient();
  const { data } = await publicProfilesQuery(supabase)
    .order("view_count", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getRecentProfiles(limit = 8) {
  const supabase = await createClient();
  const { data } = await publicProfilesQuery(supabase)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getVerifiedProfiles(limit = 8) {
  const supabase = await createClient();
  const { data } = await publicProfilesQuery(supabase)
    .eq("verification_status", "verified")
    .order("verified_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getPlatformStats() {
  const supabase = await createClient();
  const publicScope = () =>
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_public", true)
      .eq("status", "active")
      .eq("workflow_status", "published")
      .is("hidden_at", null)
      .is("deleted_at", null);

  const [{ count: total }, { count: verified }, { count: orgs }] =
    await Promise.all([
      publicScope(),
      publicScope().eq("verification_status", "verified"),
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

export type ProfileSearchParams = {
  q?: string;
  category?: string;
  country?: string;
  verification?: string;
  sort?: string;
};

export async function searchProfiles(params: ProfileSearchParams) {
  const supabase = await createClient();

  let categoryIds: string[] = [];
  if (params.category) {
    const slugs = params.category.split(",").map((s) => s.trim()).filter(Boolean);
    const { data: categories } = await supabase
      .from("categories")
      .select("id")
      .in("slug", slugs);
    categoryIds = (categories ?? []).map((c) => c.id);
    if (categoryIds.length === 0) return [];
  }

  let query = supabase
    .from("profiles")
    .select(CARD_SELECT, { count: "exact" })
    .eq("is_public", true)
    .eq("status", "active")
    .eq("workflow_status", "published")
    .is("hidden_at", null)
    .is("deleted_at", null);

  if (params.q) {
    const term = params.q.replace(/[%_]/g, "");
    query = query.or(
      `full_name.ilike.%${term}%,current_position.ilike.%${term}%,profession.ilike.%${term}%`
    );
  }
  if (categoryIds.length > 0) {
    query = query.in("category_id", categoryIds);
  }
  if (params.country) {
    query = query.eq("country", params.country);
  }
  if (params.verification && isVerificationStatus(params.verification)) {
    query = query.eq("verification_status", params.verification);
  }

  switch (params.sort) {
    case "name":
      query = query.order("full_name", { ascending: true });
      break;
    case "recent":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("view_count", { ascending: false });
  }

  const { data } = await query.limit(60);
  return data ?? [];
}

export async function getFilterOptions() {
  const supabase = await createClient();
  const [{ data: categories }, { data: countries }] = await Promise.all([
    supabase.from("categories").select("name, slug").eq("status", "active").order("name"),
    supabase
      .from("profiles")
      .select("country")
      .eq("is_public", true)
      .eq("status", "active")
      .eq("workflow_status", "published")
      .is("hidden_at", null)
      .is("deleted_at", null)
      .not("country", "is", null),
  ]);

  const uniqueCountries = Array.from(
    new Set((countries ?? []).map((c) => c.country).filter(Boolean))
  ).sort() as string[];

  return { categories: categories ?? [], countries: uniqueCountries };
}

export async function getOrganizations() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("organizations")
    .select("id, name, type, country, description, logo_url")
    .eq("status", "active")
    .order("name");
  return data ?? [];
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
