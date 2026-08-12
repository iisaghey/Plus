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
