"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CareerEntryFormState = {
  error?: string;
  success?: boolean;
};

const FIELDS = [
  "title",
  "organization",
  "location",
  "start_date",
  "end_date",
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

export async function createCareerEntry(
  profileId: string,
  _prevState: CareerEntryFormState,
  formData: FormData
): Promise<CareerEntryFormState> {
  const supabase = await createClient();
  const values = readFields(formData);
  if (!values.title) return { error: "Title is required." };

  const isCurrent = formData.get("is_current") === "on";

  const { count } = await supabase
    .from("career_timeline")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId);

  const { error } = await supabase.from("career_timeline").insert({
    profile_id: profileId,
    title: values.title,
    organization: values.organization,
    location: values.location,
    start_date: values.start_date,
    end_date: isCurrent ? null : values.end_date,
    is_current: isCurrent,
    description: values.description,
    sort_order: count ?? 0,
  });

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function updateCareerEntry(
  entryId: string,
  profileId: string,
  _prevState: CareerEntryFormState,
  formData: FormData
): Promise<CareerEntryFormState> {
  const supabase = await createClient();
  const values = readFields(formData);
  if (!values.title) return { error: "Title is required." };

  const isCurrent = formData.get("is_current") === "on";

  const { error } = await supabase
    .from("career_timeline")
    .update({
      title: values.title,
      organization: values.organization,
      location: values.location,
      start_date: values.start_date,
      end_date: isCurrent ? null : values.end_date,
      is_current: isCurrent,
      description: values.description,
    })
    .eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function deleteCareerEntry(entryId: string, profileId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("career_timeline")
    .delete()
    .eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}
