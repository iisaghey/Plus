"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type ProfileFormState = {
  error?: string;
};

const FIELDS = [
  "full_name",
  "preferred_title",
  "profession",
  "current_position",
  "category_id",
  "organization_id",
  "country",
  "location",
  "nationality",
  "short_bio",
  "email",
  "website",
  "photo_url",
  "cover_url",
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

async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
  excludeProfileId?: string
) {
  let candidate = slugify(base) || "profile";
  let suffix = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let query = supabase
      .from("profiles")
      .select("id")
      .eq("slug", candidate)
      .limit(1);
    if (excludeProfileId) query = query.neq("id", excludeProfileId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
    suffix += 1;
    candidate = `${slugify(base)}-${suffix}`;
  }
}

export async function createProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const values = readFields(formData);
  if (!values.full_name) return { error: "Full name is required." };

  const slug = await uniqueSlug(supabase, values.full_name);

  const { error } = await supabase.from("profiles").insert({
    ...values,
    full_name: values.full_name,
    slug,
    user_id: user.id,
    created_by: user.id,
    email: values.email ?? user.email ?? null,
  });

  if (error) return { error: error.message };

  redirect("/dashboard");
}

export async function updateProfile(
  profileId: string,
  redirectTo: string,
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const values = readFields(formData);
  if (!values.full_name) return { error: "Full name is required." };

  // No user_id filter here: RLS (can_edit_profile) is the source of truth for
  // who may edit this row -- the owner, or Editor/Admin/Super Admin, or Staff
  // assigned to it. Adding an owner-only filter here would silently no-op
  // for staff editing someone else's assigned profile.
  const { error } = await supabase
    .from("profiles")
    .update({ ...values, full_name: values.full_name })
    .eq("id", profileId);

  if (error) return { error: error.message };

  redirect(redirectTo);
}

export async function createStaffDraft(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!userRole || !["staff", "editor", "admin", "super_admin"].includes(userRole.role)) {
    return { error: "Only staff can create profile drafts." };
  }

  const values = readFields(formData);
  if (!values.full_name) return { error: "Full name is required." };

  const slug = await uniqueSlug(supabase, values.full_name);

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({
      ...values,
      full_name: values.full_name,
      slug,
      user_id: null,
      created_by: user.id,
      assigned_staff_id: userRole.role === "staff" ? user.id : null,
      workflow_status: "draft",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  redirect(`/staff/profiles/${created.id}`);
}
