"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database.types";

export async function setRolePermission(
  roleKey: string,
  permissionKey: string,
  scope: Enums<"permission_scope">
) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_role_permission", {
    p_role_key: roleKey,
    p_permission_key: permissionKey,
    p_scope: scope,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/roles");
  return { success: true };
}
