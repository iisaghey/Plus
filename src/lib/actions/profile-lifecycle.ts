"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/actions/audit";

const STORAGE_BUCKETS = [
  "profile-photos",
  "profile-media",
  "profile-documents",
  "qr-codes",
] as const;

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

async function snapshot(
  supabase: Awaited<ReturnType<typeof createClient>>,
  profileId: string
) {
  const { data } = await supabase
    .from("profiles")
    .select(
      "full_name, status, workflow_status, verification_status, hidden_at, deleted_at"
    )
    .eq("id", profileId)
    .maybeSingle();
  return data;
}

function revalidateProfilePages() {
  revalidatePath("/admin/profiles");
  revalidatePath("/admin/audit-logs");
  revalidatePath("/profiles");
}

async function logAndRevalidate(
  supabase: Awaited<ReturnType<typeof createClient>>,
  {
    userId,
    role,
    action,
    profileId,
    before,
  }: {
    userId: string;
    role: string | null;
    action: string;
    profileId: string;
    before: NonNullable<Awaited<ReturnType<typeof snapshot>>>;
  }
) {
  const after = await snapshot(supabase, profileId);
  await logAuditEvent(supabase, {
    actorId: userId,
    actorRole: role,
    action,
    entityType: "profile",
    entityId: profileId,
    previousValue: { profile_name: before.full_name, ...before },
    newValue: { profile_name: after?.full_name ?? before.full_name, ...after },
  });
  revalidateProfilePages();
}

export async function hideProfile(profileId: string) {
  const { supabase, user, role } = await requireSuperAdmin();
  if (!user) return { error: "You must be signed in." };
  if (role !== "super_admin") return { error: "Only Super Admin can hide profiles." };
  const before = await snapshot(supabase, profileId);
  if (!before) return { error: "Profile not found." };
  const { error } = await supabase.rpc("super_admin_set_profile_hidden", {
    p_profile_id: profileId,
    p_hidden: true,
  });
  if (error) return { error: error.message };
  await logAndRevalidate(supabase, { userId: user.id, role, action: "hide_profile", profileId, before });
  return { success: true };
}

export async function unhideProfile(profileId: string) {
  const { supabase, user, role } = await requireSuperAdmin();
  if (!user) return { error: "You must be signed in." };
  if (role !== "super_admin") return { error: "Only Super Admin can unhide profiles." };
  const before = await snapshot(supabase, profileId);
  if (!before) return { error: "Profile not found." };
  const { error } = await supabase.rpc("super_admin_set_profile_hidden", {
    p_profile_id: profileId,
    p_hidden: false,
  });
  if (error) return { error: error.message };
  await logAndRevalidate(supabase, { userId: user.id, role, action: "unhide_profile", profileId, before });
  return { success: true };
}

export async function verifyProfile(profileId: string) {
  const { supabase, user, role } = await requireSuperAdmin();
  if (!user) return { error: "You must be signed in." };
  if (role !== "super_admin") return { error: "Only Super Admin can verify profiles." };
  const before = await snapshot(supabase, profileId);
  if (!before) return { error: "Profile not found." };
  const { error } = await supabase.rpc("super_admin_set_profile_verified", {
    p_profile_id: profileId,
    p_verified: true,
  });
  if (error) return { error: error.message };
  await logAndRevalidate(supabase, { userId: user.id, role, action: "verify_profile", profileId, before });
  return { success: true };
}

export async function unverifyProfile(profileId: string) {
  const { supabase, user, role } = await requireSuperAdmin();
  if (!user) return { error: "You must be signed in." };
  if (role !== "super_admin") return { error: "Only Super Admin can unverify profiles." };
  const before = await snapshot(supabase, profileId);
  if (!before) return { error: "Profile not found." };
  const { error } = await supabase.rpc("super_admin_set_profile_verified", {
    p_profile_id: profileId,
    p_verified: false,
  });
  if (error) return { error: error.message };
  await logAndRevalidate(supabase, { userId: user.id, role, action: "unverify_profile", profileId, before });
  return { success: true };
}

export async function archiveProfile(profileId: string) {
  const { supabase, user, role } = await requireSuperAdmin();
  if (!user) return { error: "You must be signed in." };
  if (role !== "super_admin") return { error: "Only Super Admin can archive profiles." };
  const before = await snapshot(supabase, profileId);
  if (!before) return { error: "Profile not found." };
  const { error } = await supabase.rpc("super_admin_set_profile_archived", {
    p_profile_id: profileId,
    p_archived: true,
  });
  if (error) return { error: error.message };
  await logAndRevalidate(supabase, { userId: user.id, role, action: "archive_profile", profileId, before });
  return { success: true };
}

export async function restoreArchivedProfile(profileId: string) {
  const { supabase, user, role } = await requireSuperAdmin();
  if (!user) return { error: "You must be signed in." };
  if (role !== "super_admin") return { error: "Only Super Admin can restore profiles." };
  const before = await snapshot(supabase, profileId);
  if (!before) return { error: "Profile not found." };
  const { error } = await supabase.rpc("super_admin_set_profile_archived", {
    p_profile_id: profileId,
    p_archived: false,
  });
  if (error) return { error: error.message };
  await logAndRevalidate(supabase, { userId: user.id, role, action: "restore_profile", profileId, before });
  return { success: true };
}

export async function deleteProfile(profileId: string) {
  const { supabase, user, role } = await requireSuperAdmin();
  if (!user) return { error: "You must be signed in." };
  if (role !== "super_admin") return { error: "Only Super Admin can delete profiles." };
  const before = await snapshot(supabase, profileId);
  if (!before) return { error: "Profile not found." };
  const { error } = await supabase.rpc("super_admin_set_profile_deleted", {
    p_profile_id: profileId,
    p_deleted: true,
  });
  if (error) return { error: error.message };
  await logAndRevalidate(supabase, { userId: user.id, role, action: "delete_profile", profileId, before });
  return { success: true };
}

export async function restoreDeletedProfile(profileId: string) {
  const { supabase, user, role } = await requireSuperAdmin();
  if (!user) return { error: "You must be signed in." };
  if (role !== "super_admin") return { error: "Only Super Admin can restore profiles." };
  const before = await snapshot(supabase, profileId);
  if (!before) return { error: "Profile not found." };
  const { error } = await supabase.rpc("super_admin_set_profile_deleted", {
    p_profile_id: profileId,
    p_deleted: false,
  });
  if (error) return { error: error.message };
  await logAndRevalidate(supabase, { userId: user.id, role, action: "restore_profile", profileId, before });
  return { success: true };
}

export async function permanentlyDeleteProfile(profileId: string) {
  const { supabase, user, role } = await requireSuperAdmin();
  if (!user) return { error: "You must be signed in." };
  if (role !== "super_admin") {
    return { error: "Only Super Admin can permanently delete profiles." };
  }

  const before = await snapshot(supabase, profileId);
  if (!before) return { error: "Profile not found." };

  // Best-effort storage cleanup -- object metadata isn't covered by the
  // profiles row's cascading delete, since Storage objects live outside
  // the public schema. Failures here don't block the actual data deletion.
  for (const bucket of STORAGE_BUCKETS) {
    try {
      const { data: files } = await supabase.storage.from(bucket).list(profileId);
      if (files && files.length > 0) {
        await supabase.storage
          .from(bucket)
          .remove(files.map((f) => `${profileId}/${f.name}`));
      }
    } catch {
      // ignore storage cleanup failures
    }
  }

  const { error } = await supabase.rpc("super_admin_permanently_delete_profile", {
    p_profile_id: profileId,
  });
  if (error) return { error: error.message };

  await logAuditEvent(supabase, {
    actorId: user.id,
    actorRole: role,
    action: "permanently_delete_profile",
    entityType: "profile",
    entityId: profileId,
    previousValue: { profile_name: before.full_name, ...before },
    newValue: { profile_name: before.full_name, deleted: true },
  });

  revalidateProfilePages();
  return { success: true };
}
