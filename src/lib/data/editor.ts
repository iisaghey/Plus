import { createClient } from "@/lib/supabase/server";

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
