"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { logAuditEvent, notifyUser } from "@/lib/actions/audit";

export type ProfileFormState = {
  error?: string;
  /** Stable machine-readable code for `error`, when it originates from our own validation
   *  (not a raw Supabase error) — lets the UI look up a translated message. */
  errorCode?: string;
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
  "phone",
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

const SOCIAL_PLATFORMS = ["linkedin", "twitter", "facebook", "instagram", "youtube"] as const;

function readSocialLinks(formData: FormData) {
  const links: Record<string, string> = {};
  for (const platform of SOCIAL_PLATFORMS) {
    const raw = formData.get(`social_${platform}`);
    const value = typeof raw === "string" ? raw.trim() : "";
    if (value) links[platform] = value;
  }
  return links;
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
  if (!user) return { error: "You must be signed in.", errorCode: "mustBeSignedIn" };

  const values = readFields(formData);
  if (!values.full_name)
    return { error: "Full name is required.", errorCode: "fullNameRequired" };

  const slug = await uniqueSlug(supabase, values.full_name);

  const { error } = await supabase.from("profiles").insert({
    ...values,
    full_name: values.full_name,
    slug,
    user_id: user.id,
    created_by: user.id,
    email: values.email ?? user.email ?? null,
    social_links: readSocialLinks(formData),
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
  if (!user) return { error: "You must be signed in.", errorCode: "mustBeSignedIn" };

  const values = readFields(formData);
  if (!values.full_name)
    return { error: "Full name is required.", errorCode: "fullNameRequired" };

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  // Fetch a before-snapshot so an Editor's edit to an already-published
  // profile can be audit-logged field-by-field -- can_edit_profile() and
  // the enforce_editor_published_edit trigger are what actually gate/route
  // this (blocking it without a grant, forcing workflow_status to
  // admin_review on success); this is purely for the richer audit trail.
  const wasPublishedEditByEditor = userRole?.role === "editor";
  const { data: before } = wasPublishedEditByEditor
    ? await supabase.from("profiles").select("*").eq("id", profileId).maybeSingle()
    : { data: null };

  // No user_id filter here: RLS (can_edit_profile) is the source of truth for
  // who may edit this row -- the owner, or Editor/Admin/Super Admin, or Staff
  // assigned to it. Adding an owner-only filter here would silently no-op
  // for staff editing someone else's assigned profile.
  const { error } = await supabase
    .from("profiles")
    .update({
      ...values,
      full_name: values.full_name,
      social_links: readSocialLinks(formData),
    })
    .eq("id", profileId);

  if (error) return { error: error.message };

  if (wasPublishedEditByEditor && before?.workflow_status === "published") {
    const changed: Record<string, string | null> = {};
    const previous: Record<string, string | null> = {};
    for (const field of FIELDS) {
      const beforeValue = (before as Record<string, unknown>)[field] as
        | string
        | null;
      if (beforeValue !== values[field]) {
        previous[field] = beforeValue ?? null;
        changed[field] = values[field];
      }
    }

    await logAuditEvent(supabase, {
      actorId: user.id,
      actorRole: userRole?.role ?? null,
      action: "edit_published_profile",
      entityType: "profile",
      entityId: profileId,
      previousValue: { workflow_status: "published", ...previous },
      newValue: { workflow_status: "admin_review", ...changed },
    });

    const { data: reviewers } = await supabase
      .from("user_roles")
      .select("user_id")
      .in("role", ["admin", "super_admin"]);
    for (const reviewer of reviewers ?? []) {
      await notifyUser(supabase, {
        userId: reviewer.user_id,
        type: "published_edit_pending_review",
        title: `Edits to a published profile are awaiting your review: ${before.full_name}`,
        relatedProfileId: profileId,
        actionUrl: "/admin/review",
      });
    }
  }

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
  if (!user) return { error: "You must be signed in.", errorCode: "mustBeSignedIn" };

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!userRole || !["staff", "editor", "admin", "super_admin"].includes(userRole.role)) {
    return { error: "Only staff can create profile drafts.", errorCode: "staffOnly" };
  }

  const values = readFields(formData);
  if (!values.full_name)
    return { error: "Full name is required.", errorCode: "fullNameRequired" };
  if (!values.photo_url)
    return { error: "A profile photo is required.", errorCode: "photoRequired" };

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
      social_links: readSocialLinks(formData),
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  const base = userRole.role === "editor" ? "/editor/profiles" : "/staff/profiles";
  redirect(`${base}/${created.id}`);
}
