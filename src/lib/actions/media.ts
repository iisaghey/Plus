"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type MediaFormState = {
  error?: string;
  success?: boolean;
};

const FIELDS = [
  "title",
  "category",
  "media_type",
  "event_date",
  "location",
  "caption",
  "external_url",
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

export async function createMediaItem(
  profileId: string,
  _prevState: MediaFormState,
  formData: FormData
): Promise<MediaFormState> {
  const supabase = await createClient();
  const values = readFields(formData);
  if (!values.media_type) return { error: "Media type is required." };
  if (!values.external_url) return { error: "Please upload a file or add a link." };

  const { count } = await supabase
    .from("media")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId);

  const { error } = await supabase.from("media").insert({
    profile_id: profileId,
    ...values,
    media_type: values.media_type,
    is_featured: formData.get("is_featured") === "on",
    sort_order: count ?? 0,
  });

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function updateMediaItem(
  entryId: string,
  profileId: string,
  _prevState: MediaFormState,
  formData: FormData
): Promise<MediaFormState> {
  const supabase = await createClient();
  const values = readFields(formData);
  if (!values.media_type) return { error: "Media type is required." };
  if (!values.external_url) return { error: "Please upload a file or add a link." };

  const { error } = await supabase
    .from("media")
    .update({
      ...values,
      media_type: values.media_type,
      is_featured: formData.get("is_featured") === "on",
    })
    .eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function deleteMediaItem(entryId: string, profileId: string) {
  const supabase = await createClient();

  const { data: entry } = await supabase
    .from("media")
    .select("storage_path")
    .eq("id", entryId)
    .maybeSingle();

  const { error } = await supabase.from("media").delete().eq("id", entryId);
  if (error) return { error: error.message };

  if (entry?.storage_path) {
    await supabase.storage.from("profile-media").remove([entry.storage_path]);
  }

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function archiveMediaItem(entryId: string, profileId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("media")
    .update({ status: "archived" })
    .eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function restoreMediaItem(entryId: string, profileId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("media")
    .update({ status: "active" })
    .eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

function mediaTypeFromMime(mimeType: string) {
  if (mimeType.startsWith("image/")) return "photo";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "document";
}

export async function createMediaFromUpload(
  profileId: string,
  file: { url: string; path: string; name: string; size: number; mimeType: string }
): Promise<MediaFormState & { id?: string }> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("media")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId);

  const { data, error } = await supabase
    .from("media")
    .insert({
      profile_id: profileId,
      media_type: mediaTypeFromMime(file.mimeType),
      title: file.name.replace(/\.[^.]+$/, ""),
      external_url: file.url,
      storage_path: file.path,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.mimeType,
      sort_order: count ?? 0,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true, id: data.id };
}
