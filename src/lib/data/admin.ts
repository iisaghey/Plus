import { createClient } from "@/lib/supabase/server";

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
