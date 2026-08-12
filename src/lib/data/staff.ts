import { createClient } from "@/lib/supabase/server";

const PROFILE_CARD_FIELDS =
  "id, slug, full_name, current_position, photo_url, workflow_status, assignment_deadline, editorial_notes, updated_at";

export async function getAssignedProfiles(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(PROFILE_CARD_FIELDS)
    .eq("assigned_staff_id", userId)
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function getStaffStats(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("workflow_status")
    .eq("assigned_staff_id", userId);

  const rows = data ?? [];
  return {
    total: rows.length,
    drafts: rows.filter((r) => r.workflow_status === "draft").length,
    pendingSubmissions: rows.filter((r) => r.workflow_status === "submitted")
      .length,
    returned: rows.filter((r) => r.workflow_status === "changes_required")
      .length,
    completed: rows.filter((r) =>
      ["approved", "verified", "published"].includes(r.workflow_status)
    ).length,
  };
}
