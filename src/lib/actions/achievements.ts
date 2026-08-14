"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AchievementFormState = {
  error?: string;
  success?: boolean;
};

const FIELDS = [
  "title",
  "category",
  "issuing_organization",
  "achievement_date",
  "description",
  "media_url",
] as const;

function readFields(formData: FormData) {
  const values = {} as Record<(typeof FIELDS)[number], string | null>;
  for (const field of FIELDS) {
    const raw = formData.get(field);
    const value = typeof raw === "string" ? raw.trim() : "";
    values[field] = value === "" ? null : value;
  }
  return values;
}

function revalidateProfilePages(profileId: string) {
  revalidatePath("/dashboard/profile");
  revalidatePath(`/staff/profiles/${profileId}`);
}

export async function createAchievement(
  profileId: string,
  _prevState: AchievementFormState,
  formData: FormData
): Promise<AchievementFormState> {
  const supabase = await createClient();
  const values = readFields(formData);
  if (!values.title) return { error: "Title is required." };

  const { count } = await supabase
    .from("achievements")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId);

  const { error } = await supabase.from("achievements").insert({
    profile_id: profileId,
    ...values,
    title: values.title,
    sort_order: count ?? 0,
  });

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function updateAchievement(
  entryId: string,
  profileId: string,
  _prevState: AchievementFormState,
  formData: FormData
): Promise<AchievementFormState> {
  const supabase = await createClient();
  const values = readFields(formData);
  if (!values.title) return { error: "Title is required." };

  const { error } = await supabase
    .from("achievements")
    .update({ ...values, title: values.title })
    .eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function deleteAchievement(entryId: string, profileId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("achievements")
    .delete()
    .eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}
