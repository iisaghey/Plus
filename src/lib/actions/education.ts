"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type EducationFormState = {
  error?: string;
  success?: boolean;
};

const FIELDS = [
  "institution",
  "degree",
  "field_of_study",
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
  revalidatePath(`/editor/profiles/${profileId}`);
}

export async function createEducation(
  profileId: string,
  _prevState: EducationFormState,
  formData: FormData
): Promise<EducationFormState> {
  const supabase = await createClient();
  const values = readFields(formData);
  if (!values.institution) return { error: "Institution is required." };

  const isCurrent = formData.get("is_current") === "on";

  const { count } = await supabase
    .from("education")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId);

  const { error } = await supabase.from("education").insert({
    profile_id: profileId,
    ...values,
    institution: values.institution,
    end_date: isCurrent ? null : values.end_date,
    is_current: isCurrent,
    sort_order: count ?? 0,
  });

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function updateEducation(
  entryId: string,
  profileId: string,
  _prevState: EducationFormState,
  formData: FormData
): Promise<EducationFormState> {
  const supabase = await createClient();
  const values = readFields(formData);
  if (!values.institution) return { error: "Institution is required." };

  const isCurrent = formData.get("is_current") === "on";

  const { error } = await supabase
    .from("education")
    .update({
      ...values,
      institution: values.institution,
      end_date: isCurrent ? null : values.end_date,
      is_current: isCurrent,
    })
    .eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function deleteEducation(entryId: string, profileId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("education").delete().eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}
