"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/actions/audit";
import type { Enums } from "@/types/database.types";

async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, role: null };

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  return { supabase, user, role: userRole?.role ?? null };
}

export async function setAccountStatus(
  userId: string,
  status: Enums<"account_status">
) {
  const { supabase, user } = await requireStaff();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase.rpc("set_account_status", {
    p_user_id: userId,
    p_status: status,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/approvals");
  return { success: true };
}

export async function decideVerification(
  verificationId: string,
  profileId: string,
  approve: boolean,
  notes?: string
) {
  const { supabase, user, role } = await requireStaff();
  if (!user) return { error: "You must be signed in." };
  if (role !== "admin" && role !== "super_admin") {
    return { error: "Only Admins can verify profiles." };
  }

  const status: Enums<"verification_status"> = approve
    ? "verified"
    : "rejected";
  const now = new Date().toISOString();

  const { error: verificationError } = await supabase
    .from("verifications")
    .update({
      status,
      identity_verified: approve,
      information_reviewed: approve,
      verifier_id: user.id,
      verified_at: approve ? now : null,
      notes: notes ?? null,
    })
    .eq("id", verificationId);
  if (verificationError) return { error: verificationError.message };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      verification_status: status,
      verified_at: approve ? now : null,
      ...(approve ? { workflow_status: "verified" } : {}),
    })
    .eq("id", profileId);
  if (profileError) return { error: profileError.message };

  await logAuditEvent(supabase, {
    actorId: user.id,
    actorRole: role,
    action: approve ? "verify_profile" : "reject_verification",
    entityType: "profile",
    entityId: profileId,
    newValue: { notes },
  });

  revalidatePath("/admin/verification");
  return { success: true };
}
