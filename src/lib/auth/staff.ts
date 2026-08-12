import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database.types";

const STAFF_ROLES: Enums<"app_role">[] = [
  "super_admin",
  "admin",
  "editor",
  "verifier",
];

export async function getStaffContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, role: null, isStaff: false };

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role, account_status")
    .eq("user_id", user.id)
    .maybeSingle();

  const isStaff = Boolean(
    userRole && STAFF_ROLES.includes(userRole.role)
  );

  return { user, role: userRole?.role ?? null, isStaff };
}
