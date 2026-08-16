import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database.types";

export async function getAdminStats() {
  const supabase = await createClient();
  const [
    { count: totalProfiles },
    { count: verifiedProfiles },
    { count: pendingVerification },
    { count: pendingAccounts },
    { count: totalUsers },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "verified"),
    supabase
      .from("verifications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("account_status", "pending"),
    supabase.from("user_roles").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalProfiles: totalProfiles ?? 0,
    verifiedProfiles: verifiedProfiles ?? 0,
    pendingVerification: pendingVerification ?? 0,
    pendingAccounts: pendingAccounts ?? 0,
    totalUsers: totalUsers ?? 0,
  };
}

export async function getPendingAccounts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_roles")
    .select("user_id, email, role, account_status, created_at")
    .eq("account_status", "pending")
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getPendingVerifications() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("verifications")
    .select(
      `id, profile_id, status, created_at, profiles ( full_name, slug, current_position, photo_url )`
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getUsersByRole(roles: Enums<"app_role">[]) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_roles")
    .select("user_id, email, role, account_status, created_at")
    .in("role", roles)
    .order("email");
  return data ?? [];
}

export async function getAllUsers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_roles")
    .select("user_id, email, role, account_status, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminReviewQueue() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(
      "id, slug, full_name, current_position, photo_url, workflow_status, editorial_notes, updated_at"
    )
    .eq("workflow_status", "editor_approved")
    .order("updated_at", { ascending: true });
  return data ?? [];
}

export async function getPendingPublishedEdits() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, slug, full_name, current_position, photo_url, workflow_status")
    .eq("workflow_status", "admin_review")
    .order("updated_at", { ascending: true });
  return data ?? [];
}

export async function getEditPermissionRequests() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edit_permission_requests")
    .select(
      "id, profile_id, editor_id, reason, fields_requested, description, supporting_document_path, status, review_notes, created_at, profiles ( full_name, slug, photo_url )"
    )
    .in("status", ["pending", "more_info_requested"])
    .order("created_at", { ascending: true });

  const requests = data ?? [];
  const editorIds = Array.from(new Set(requests.map((r) => r.editor_id)));
  const { data: editors } =
    editorIds.length > 0
      ? await supabase.from("user_roles").select("user_id, email").in("user_id", editorIds)
      : { data: [] as { user_id: string; email: string | null }[] };
  const editorMap = new Map((editors ?? []).map((e) => [e.user_id, e.email]));

  return requests.map((r) => ({
    ...r,
    editor_email: editorMap.get(r.editor_id) ?? null,
  }));
}

export async function getPublishableProfiles() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, slug, full_name, current_position, photo_url, workflow_status")
    .in("workflow_status", ["approved", "verified", "published"])
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function getAllProfilesForAssignment() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(
      "id, slug, full_name, workflow_status, assigned_staff_id, assigned_editor_id, assignment_deadline"
    )
    .order("created_at", { ascending: false });
  return data ?? [];
}

export type ProfileLifecycleFilter =
  | "all"
  | "published"
  | "draft"
  | "hidden"
  | "archived"
  | "trash";

const ALL_PROFILES_FIELDS =
  "id, slug, full_name, current_position, photo_url, status, workflow_status, verification_status, hidden_at, deleted_at, updated_at";

export async function getAllProfilesForSuperAdmin(
  filter: ProfileLifecycleFilter = "all"
) {
  const supabase = await createClient();
  let query = supabase
    .from("profiles")
    .select(ALL_PROFILES_FIELDS)
    .order("updated_at", { ascending: false })
    .limit(100);

  switch (filter) {
    case "published":
      query = query.eq("workflow_status", "published").is("deleted_at", null);
      break;
    case "draft":
      query = query
        .in("workflow_status", ["draft", "in_progress"])
        .is("deleted_at", null);
      break;
    case "hidden":
      query = query.not("hidden_at", "is", null).is("deleted_at", null);
      break;
    case "archived":
      query = query.eq("status", "archived").is("deleted_at", null);
      break;
    case "trash":
      query = query.not("deleted_at", "is", null);
      break;
    default:
      query = query.is("deleted_at", null);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getRolesMatrix() {
  const supabase = await createClient();
  const [{ data: roles }, { data: permissions }, { data: rolePermissions }] =
    await Promise.all([
      supabase.from("roles").select("*").order("level"),
      supabase.from("permissions").select("*").order("category"),
      supabase.from("role_permissions").select("*"),
    ]);
  return {
    roles: roles ?? [],
    permissions: permissions ?? [],
    rolePermissions: rolePermissions ?? [],
  };
}
