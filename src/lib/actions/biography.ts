"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type BiographyFormState = {
  error?: string;
  success?: boolean;
};

function revalidateProfilePages(profileId: string) {
  revalidatePath("/dashboard/profile");
  revalidatePath(`/staff/profiles/${profileId}`);
}

export async function saveBiography(
  profileId: string,
  _prevState: BiographyFormState,
  formData: FormData
): Promise<BiographyFormState> {
  const supabase = await createClient();

  const summaryRaw = formData.get("summary");
  const contentRaw = formData.get("content");
  const summary = typeof summaryRaw === "string" ? summaryRaw.trim() : "";
  const content = typeof contentRaw === "string" ? contentRaw.trim() : "";

  const { error } = await supabase.from("biographies").upsert(
    {
      profile_id: profileId,
      summary: summary === "" ? null : summary,
      content: content === "" ? null : content,
    },
    { onConflict: "profile_id" }
  );

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}
