"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActivityFormState = {
  error?: string;
  errorCode?: string;
  success?: boolean;
};

const FIELDS = [
  "title",
  "activity_type",
  "organization",
  "location",
  "activity_date",
  "description",
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

export async function createActivity(
  profileId: string,
  _prevState: ActivityFormState,
  formData: FormData
): Promise<ActivityFormState> {
  const supabase = await createClient();
  const values = readFields(formData);
  if (!values.title) return { error: "Title is required.", errorCode: "titleRequired" };

  const { count } = await supabase
    .from("official_activities")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId);

  const { error } = await supabase.from("official_activities").insert({
    profile_id: profileId,
    ...values,
    title: values.title,
    sort_order: count ?? 0,
  });

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function updateActivity(
  entryId: string,
  profileId: string,
  _prevState: ActivityFormState,
  formData: FormData
): Promise<ActivityFormState> {
  const supabase = await createClient();
  const values = readFields(formData);
  if (!values.title) return { error: "Title is required.", errorCode: "titleRequired" };

  const { error } = await supabase
    .from("official_activities")
    .update({ ...values, title: values.title })
    .eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function deleteActivity(entryId: string, profileId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("official_activities")
    .delete()
    .eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}
