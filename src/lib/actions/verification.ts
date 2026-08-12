"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitForVerification(profileId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ verification_status: "pending" })
    .eq("id", profileId)
    .eq("user_id", user.id);
  if (profileError) return { error: profileError.message };

  const { error: verificationError } = await supabase
    .from("verifications")
    .insert({ profile_id: profileId, status: "pending" });
  if (verificationError) return { error: verificationError.message };

  revalidatePath("/dashboard");
  return { success: true };
}
