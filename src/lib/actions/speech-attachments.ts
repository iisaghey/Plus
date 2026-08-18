"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function revalidateProfilePages(profileId: string) {
  revalidatePath("/dashboard/profile");
  revalidatePath(`/staff/profiles/${profileId}`);
  revalidatePath(`/editor/profiles/${profileId}`);
}

function fileTypeFromMime(mimeType: string) {
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("image/")) return "photo";
  if (mimeType.startsWith("audio/")) return "audio";
  return "document";
}

export async function createSpeechAttachment(
  speechId: string,
  profileId: string,
  file: { path: string; name: string; size: number; mimeType: string }
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("speech_attachments")
    .select("*", { count: "exact", head: true })
    .eq("speech_id", speechId);

  const { data, error } = await supabase
    .from("speech_attachments")
    .insert({
      speech_id: speechId,
      file_type: fileTypeFromMime(file.mimeType),
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
  return { id: data.id };
}

export async function deleteSpeechAttachment(attachmentId: string, profileId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("speech_attachments")
    .delete()
    .eq("id", attachmentId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}
