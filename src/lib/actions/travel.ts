"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type TravelFormState = {
  error?: string;
  errorCode?: string;
  success?: boolean;
};

const FIELDS = [
  "destination_country",
  "destination_city",
  "purpose",
  "delegation",
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

export async function createTravelEntry(
  profileId: string,
  _prevState: TravelFormState,
  formData: FormData
): Promise<TravelFormState> {
  const supabase = await createClient();
  const values = readFields(formData);
  if (!values.destination_country) return { error: "Destination country is required.", errorCode: "destinationCountryRequired" };

  const { count } = await supabase
    .from("official_travel")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId);

  const { error } = await supabase.from("official_travel").insert({
    profile_id: profileId,
    ...values,
    destination_country: values.destination_country,
    sort_order: count ?? 0,
  });

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function updateTravelEntry(
  entryId: string,
  profileId: string,
  _prevState: TravelFormState,
  formData: FormData
): Promise<TravelFormState> {
  const supabase = await createClient();
  const values = readFields(formData);
  if (!values.destination_country) return { error: "Destination country is required.", errorCode: "destinationCountryRequired" };

  const { error } = await supabase
    .from("official_travel")
    .update({ ...values, destination_country: values.destination_country })
    .eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function deleteTravelEntry(entryId: string, profileId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("official_travel")
    .delete()
    .eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}
