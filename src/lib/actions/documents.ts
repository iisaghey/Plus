"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type DocumentFormState = {
  error?: string;
  success?: boolean;
};

const FIELDS = [
  "title",
  "category",
  "issuing_organization",
  "document_date",
  "storage_path",
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

export async function createDocument(
  profileId: string,
  _prevState: DocumentFormState,
  formData: FormData
): Promise<DocumentFormState> {
  const supabase = await createClient();
  const values = readFields(formData);
  if (!values.title) return { error: "Title is required." };
  if (!values.storage_path) return { error: "Please upload a file." };

  const { count } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId);

  const { error } = await supabase.from("documents").insert({
    profile_id: profileId,
    ...values,
    title: values.title,
    is_private: formData.get("is_private") === "true",
    sort_order: count ?? 0,
  });

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function updateDocument(
  entryId: string,
  profileId: string,
  _prevState: DocumentFormState,
  formData: FormData
): Promise<DocumentFormState> {
  const supabase = await createClient();
  const values = readFields(formData);
  if (!values.title) return { error: "Title is required." };
  if (!values.storage_path) return { error: "Please upload a file." };

  const { error } = await supabase
    .from("documents")
    .update({
      ...values,
      title: values.title,
      is_private: formData.get("is_private") === "true",
    })
    .eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function deleteDocument(entryId: string, profileId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("documents").delete().eq("id", entryId);

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}

export async function createDocumentFromUpload(
  profileId: string,
  file: { url: string; path: string; name: string; size: number; mimeType: string }
): Promise<DocumentFormState & { id?: string }> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profileId);

  const { data, error } = await supabase
    .from("documents")
    .insert({
      profile_id: profileId,
      title: file.name.replace(/\.[^.]+$/, ""),
      storage_path: file.path,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.mimeType,
      is_private: true,
      sort_order: count ?? 0,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true, id: data.id };
}
