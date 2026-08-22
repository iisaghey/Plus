"use server";

import { revalidatePath } from "next/cache";
import DOMPurify from "isomorphic-dompurify";
import { createClient } from "@/lib/supabase/server";

export type BiographyFormState = {
  error?: string;
  success?: boolean;
};

function revalidateProfilePages(profileId: string) {
  revalidatePath("/dashboard/profile");
  revalidatePath(`/staff/profiles/${profileId}`);
}

const SANITIZE_OPTIONS = {
  ALLOWED_TAGS: ["p", "strong", "em", "u", "h2", "h3", "ul", "ol", "li", "blockquote", "br"],
  ALLOWED_ATTR: ["style"],
};

/** Strips all tags to check whether rich-text HTML has any real text left. */
function isBlank(html: string) {
  return html.replace(/<[^>]*>/g, "").trim() === "";
}

function sanitizeRichText(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed === "" || isBlank(trimmed)) return null;
  return DOMPurify.sanitize(trimmed, SANITIZE_OPTIONS);
}

export async function saveBiography(
  profileId: string,
  _prevState: BiographyFormState,
  formData: FormData
): Promise<BiographyFormState> {
  const supabase = await createClient();

  const summaryRaw = formData.get("summary");
  const contentRaw = formData.get("content");
  const summary = sanitizeRichText(typeof summaryRaw === "string" ? summaryRaw : "");
  const content = sanitizeRichText(typeof contentRaw === "string" ? contentRaw : "");

  const { error } = await supabase.from("biographies").upsert(
    {
      profile_id: profileId,
      summary,
      content,
    },
    { onConflict: "profile_id" }
  );

  if (error) return { error: error.message };

  revalidateProfilePages(profileId);
  return { success: true };
}
