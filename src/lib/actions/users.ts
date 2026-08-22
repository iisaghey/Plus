"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/actions/audit";
import type { Enums } from "@/types/database.types";

export async function setUserRole(userId: string, role: Enums<"app_role">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in.", errorCode: "notSignedIn" as const };

  const { error } = await supabase.rpc("set_user_role", {
    p_user_id: userId,
    p_role: role,
  });
  if (error) return { error: error.message };

  await logAuditEvent(supabase, {
    actorId: user.id,
    actorRole: "super_admin",
    action: "change_user_role",
    entityType: "user",
    entityId: userId,
    newValue: { role },
  });

  revalidatePath("/admin/users");
  return { success: true };
}
