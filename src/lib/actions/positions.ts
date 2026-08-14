"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type PositionFormState = {
  error?: string;
  success?: boolean;
};

const FIELDS = [
  "position_title",
  "institution",
  "government_level",
  "country",
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

export async function createPosition(
  profileId: string,
  _prevState: PositionFormState,
  formData: FormData
): Promise<PositionFormState> {
  const supabase = await createClient();
  const values = readFields(formData);
  if (!values.position_title) return { error: "Position title is required." };

  const isCurrent = formData.get("is_current") === "on";

  const { count } = await supabase
    .from("government_positions")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId);

  const { error } = await supabase.from("government_positions").insert({
    profile_id: profileId,
    ...values,
    position_title: values.position_title,
    end_date: isCurrent ? null : values.end_date,
    is_current: isCurrent,
    sort_order: count ?? 0,
  });

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function updatePosition(
  entryId: string,
  profileId: string,
  _prevState: PositionFormState,
  formData: FormData
): Promise<PositionFormState> {
  const supabase = await createClient();
  const values = readFields(formData);
  if (!values.position_title) return { error: "Position title is required." };

  const isCurrent = formData.get("is_current") === "on";

  const { error } = await supabase
    .from("government_positions")
    .update({
      ...values,
      position_title: values.position_title,
      end_date: isCurrent ? null : values.end_date,
      is_current: isCurrent,
    })
    .eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function deletePosition(entryId: string, profileId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("government_positions")
    .delete()
    .eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}
