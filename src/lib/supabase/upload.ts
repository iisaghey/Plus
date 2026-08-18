import { createClient } from "@/lib/supabase/client";

function randomSuffix() {
  return Math.random().toString(36).slice(2, 8);
}

function buildPath(profileId: string, file: File) {
  const ext = file.name.split(".").pop() || "bin";
  return `${profileId}/${Date.now()}-${randomSuffix()}.${ext}`;
}

export async function uploadPublicFile(
  bucket: string,
  profileId: string,
  file: File
) {
  const supabase = createClient();
  const path = buildPath(profileId, file);
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function uploadPrivateFile(
  bucket: string,
  profileId: string,
  file: File
) {
  const supabase = createClient();
  const path = buildPath(profileId, file);
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
  });
  if (error) throw error;
  return { path, url: null as string | null };
}

export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresInSeconds = 300
) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}
