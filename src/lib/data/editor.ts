import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database.types";

const PROFILE_CARD_FIELDS =
  "id, slug, full_name, current_position, photo_url, workflow_status, editorial_notes, assigned_staff_id, updated_at";

export async function getReviewQueue() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(PROFILE_CARD_FIELDS)
    .eq("workflow_status", "submitted")
    .order("updated_at", { ascending: true });
  return data ?? [];
}

export async function getEditorRecentActivity(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(PROFILE_CARD_FIELDS)
    .eq("assigned_editor_id", userId)
    .order("updated_at", { ascending: false })
    .limit(10);
  return data ?? [];
}

export async function getEditorStats() {
  const supabase = await createClient();
  const [
    { count: totalProfiles },
    { count: drafts },
    { count: underReview },
    { count: published },
    { count: returned },
    { count: verifiedProfiles },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .in("workflow_status", ["draft", "in_progress"]),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .in("workflow_status", ["submitted", "under_review"]),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("workflow_status", "published"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .in("workflow_status", ["changes_required", "rejected"]),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "verified"),
  ]);

  return {
    totalProfiles: totalProfiles ?? 0,
    drafts: drafts ?? 0,
    underReview: underReview ?? 0,
    published: published ?? 0,
    returned: returned ?? 0,
    verifiedProfiles: verifiedProfiles ?? 0,
  };
}

const LISTING_FIELDS =
  "id, slug, full_name, current_position, photo_url, workflow_status, verification_status, organization_id, updated_at";

async function withOrganizationNames<
  T extends { organization_id: string | null },
>(supabase: Awaited<ReturnType<typeof createClient>>, rows: T[]) {
  const { data: organizations } = await supabase
    .from("organizations")
    .select("id, name");
  const orgMap = new Map((organizations ?? []).map((o) => [o.id, o.name]));
  return rows.map((row) => ({
    ...row,
    organization_name: row.organization_id
      ? (orgMap.get(row.organization_id) ?? null)
      : null,
  }));
}

export async function getRecentProfiles(limit = 8) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(LISTING_FIELDS)
    .order("updated_at", { ascending: false })
    .limit(limit);
  return withOrganizationNames(supabase, data ?? []);
}

export async function searchEditorProfiles({
  q,
  status,
}: {
  q?: string;
  status?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("profiles")
    .select(LISTING_FIELDS)
    .order("updated_at", { ascending: false })
    .limit(60);

  if (q) {
    const safe = q.replace(/[%_]/g, "");
    query = query.or(
      `full_name.ilike.%${safe}%,current_position.ilike.%${safe}%`
    );
  }
  if (status) {
    query = query.eq(
      "workflow_status",
      status as Enums<"profile_workflow_status">
    );
  }

  const { data } = await query;
  return withOrganizationNames(supabase, data ?? []);
}
