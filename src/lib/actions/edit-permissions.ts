"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent, notifyUser } from "@/lib/actions/audit";
import type { Enums } from "@/types/database.types";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, role: null as string | null };

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  return { supabase, user, role: userRole?.role ?? null };
}

const SNAPSHOT_FIELDS =
  "full_name, preferred_title, profession, current_position, category_id, organization_id, country, location, nationality, short_bio, email, website, photo_url, cover_url, phone, social_links";

export type EditRequestFormState = { error?: string; success?: boolean };

export async function requestEditPermission(
  profileId: string,
  _prevState: EditRequestFormState,
  formData: FormData
): Promise<EditRequestFormState> {
  const { supabase, user, role } = await requireUser();
  if (!user) return { error: "You must be signed in." };
  if (role !== "editor") return { error: "Only Editors can request edit permission." };

  const reason = String(formData.get("reason") ?? "").trim();
  if (!reason) return { error: "Please explain why you need to edit this profile." };

  const fieldsRequested = formData.getAll("fields_requested").map(String);
  const description = String(formData.get("description") ?? "").trim() || null;
  const supportingDocumentPath =
    String(formData.get("supporting_document_path") ?? "").trim() || null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, workflow_status")
    .eq("id", profileId)
    .maybeSingle();
  if (!profile) return { error: "Profile not found." };
  if (profile.workflow_status !== "published") {
    return { error: "This profile isn't published, so it's already editable." };
  }

  const { data: existing } = await supabase
    .from("edit_permission_requests")
    .select("id")
    .eq("profile_id", profileId)
    .eq("editor_id", user.id)
    .eq("status", "pending")
    .maybeSingle();
  if (existing) return { error: "You already have a pending request for this profile." };

  const { error } = await supabase.from("edit_permission_requests").insert({
    profile_id: profileId,
    editor_id: user.id,
    reason,
    fields_requested: fieldsRequested,
    description,
    supporting_document_path: supportingDocumentPath,
  });
  if (error) return { error: error.message };

  await logAuditEvent(supabase, {
    actorId: user.id,
    actorRole: role,
    action: "request_edit_permission",
    entityType: "profile",
    entityId: profileId,
    newValue: { reason, fields_requested: fieldsRequested },
  });

  const { data: superAdmins } = await supabase
    .from("user_roles")
    .select("user_id")
    .eq("role", "super_admin");
  for (const admin of superAdmins ?? []) {
    await notifyUser(supabase, {
      userId: admin.user_id,
      type: "edit_permission_requested",
      title: `New edit permission request: ${profile.full_name}`,
      message: reason,
      relatedProfileId: profileId,
      actionUrl: "/admin/edit-requests",
    });
  }

  revalidatePath(`/editor/profiles/${profileId}`);
  return { success: true };
}

export async function decideEditPermissionRequest(
  requestId: string,
  decision: "approve" | "reject" | "more_info",
  options: {
    grantType?: Enums<"edit_grant_type">;
    allowedFields?: string[];
    expiresAt?: string | null;
    notes?: string;
  } = {}
) {
  const { supabase, user, role } = await requireUser();
  if (!user) return { error: "You must be signed in." };
  if (role !== "super_admin") {
    return { error: "Only Super Admin can decide edit permission requests." };
  }

  const { data: request } = await supabase
    .from("edit_permission_requests")
    .select("id, profile_id, editor_id, status, profiles ( full_name )")
    .eq("id", requestId)
    .maybeSingle();
  if (!request) return { error: "Request not found." };
  if (request.status !== "pending" && request.status !== "more_info_requested") {
    return { error: "This request has already been decided." };
  }

  const profileName = Array.isArray(request.profiles)
    ? request.profiles[0]?.full_name
    : request.profiles?.full_name;

  if (decision === "more_info") {
    const { error } = await supabase
      .from("edit_permission_requests")
      .update({
        status: "more_info_requested",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        review_notes: options.notes ?? null,
      })
      .eq("id", requestId);
    if (error) return { error: error.message };

    await notifyUser(supabase, {
      userId: request.editor_id,
      type: "edit_permission_more_info",
      title: `Super Admin needs more information: ${profileName ?? "your profile request"}`,
      message: options.notes,
      relatedProfileId: request.profile_id,
      actionUrl: `/editor/profiles/${request.profile_id}`,
    });

    await logAuditEvent(supabase, {
      actorId: user.id,
      actorRole: role,
      action: "request_more_info",
      entityType: "edit_permission_request",
      entityId: requestId,
      newValue: { notes: options.notes },
    });

    revalidatePath("/admin/edit-requests");
    return { success: true };
  }

  if (decision === "reject") {
    const { error } = await supabase
      .from("edit_permission_requests")
      .update({
        status: "rejected",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        review_notes: options.notes ?? null,
      })
      .eq("id", requestId);
    if (error) return { error: error.message };

    await notifyUser(supabase, {
      userId: request.editor_id,
      type: "edit_permission_rejected",
      title: `Edit permission request rejected: ${profileName ?? "profile"}`,
      message: options.notes,
      relatedProfileId: request.profile_id,
      actionUrl: `/editor/profiles/${request.profile_id}`,
    });

    await logAuditEvent(supabase, {
      actorId: user.id,
      actorRole: role,
      action: "reject_edit_permission",
      entityType: "edit_permission_request",
      entityId: requestId,
      newValue: { notes: options.notes },
    });

    revalidatePath("/admin/edit-requests");
    return { success: true };
  }

  // approve
  const grantType = options.grantType ?? "one_time";
  const { data: snapshot } = await supabase
    .from("profiles")
    .select(SNAPSHOT_FIELDS)
    .eq("id", request.profile_id)
    .maybeSingle();

  const { error: grantError } = await supabase.from("edit_permission_grants").insert({
    request_id: requestId,
    profile_id: request.profile_id,
    editor_id: request.editor_id,
    grant_type: grantType,
    allowed_fields: options.allowedFields && options.allowedFields.length > 0
      ? options.allowedFields
      : null,
    expires_at: grantType === "time_limited" ? (options.expiresAt ?? null) : null,
    snapshot_before: snapshot ?? null,
    granted_by: user.id,
  });
  if (grantError) return { error: grantError.message };

  const { error: requestError } = await supabase
    .from("edit_permission_requests")
    .update({
      status: "approved",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      review_notes: options.notes ?? null,
    })
    .eq("id", requestId);
  if (requestError) return { error: requestError.message };

  await notifyUser(supabase, {
    userId: request.editor_id,
    type: "edit_permission_granted",
    title: `Edit permission granted: ${profileName ?? "profile"}`,
    message:
      grantType === "time_limited" && options.expiresAt
        ? `Access expires ${new Date(options.expiresAt).toLocaleString()}.`
        : undefined,
    relatedProfileId: request.profile_id,
    actionUrl: `/editor/profiles/${request.profile_id}`,
  });

  await logAuditEvent(supabase, {
    actorId: user.id,
    actorRole: role,
    action: "approve_edit_permission",
    entityType: "edit_permission_request",
    entityId: requestId,
    newValue: {
      grant_type: grantType,
      allowed_fields: options.allowedFields,
      expires_at: options.expiresAt,
    },
  });

  revalidatePath("/admin/edit-requests");
  revalidatePath(`/editor/profiles/${request.profile_id}`);
  return { success: true };
}

export async function approvePublishedProfileEdits(profileId: string) {
  const { supabase, user, role } = await requireUser();
  if (!user) return { error: "You must be signed in." };
  if (role !== "admin" && role !== "super_admin") {
    return { error: "Only Admin or Super Admin can approve published edits." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, workflow_status")
    .eq("id", profileId)
    .maybeSingle();
  if (!profile) return { error: "Profile not found." };
  if (profile.workflow_status !== "admin_review") {
    return { error: "This profile has no pending published edits to approve." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ workflow_status: "published" })
    .eq("id", profileId);
  if (error) return { error: error.message };

  await logAuditEvent(supabase, {
    actorId: user.id,
    actorRole: role,
    action: "approve_published_edits",
    entityType: "profile",
    entityId: profileId,
    previousValue: { workflow_status: "admin_review" },
    newValue: { workflow_status: "published" },
  });

  const { data: grant } = await supabase
    .from("edit_permission_grants")
    .select("editor_id")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (grant) {
    await notifyUser(supabase, {
      userId: grant.editor_id,
      type: "published_edits_approved",
      title: `Your changes were approved and published: ${profile.full_name}`,
      relatedProfileId: profileId,
      actionUrl: `/profile/${profileId}`,
    });
  }

  revalidatePath("/admin/review");
  revalidatePath(`/profile/${profileId}`);
  return { success: true };
}

export async function rejectPublishedProfileEdits(profileId: string, notes?: string) {
  const { supabase, user, role } = await requireUser();
  if (!user) return { error: "You must be signed in." };
  if (role !== "admin" && role !== "super_admin") {
    return { error: "Only Admin or Super Admin can reject published edits." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, workflow_status")
    .eq("id", profileId)
    .maybeSingle();
  if (!profile) return { error: "Profile not found." };
  if (profile.workflow_status !== "admin_review") {
    return { error: "This profile has no pending published edits to reject." };
  }

  const { data: grant } = await supabase
    .from("edit_permission_grants")
    .select("id, editor_id, snapshot_before")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const restore = (grant?.snapshot_before ?? {}) as Record<string, unknown>;

  const { error } = await supabase
    .from("profiles")
    .update({ ...restore, workflow_status: "published" })
    .eq("id", profileId);
  if (error) return { error: error.message };

  await logAuditEvent(supabase, {
    actorId: user.id,
    actorRole: role,
    action: "reject_published_edits",
    entityType: "profile",
    entityId: profileId,
    previousValue: { workflow_status: "admin_review" },
    newValue: { workflow_status: "published", restored: true, notes },
  });

  if (grant) {
    await notifyUser(supabase, {
      userId: grant.editor_id,
      type: "published_edits_rejected",
      title: `Your changes were rejected: ${profile.full_name}`,
      message: notes,
      relatedProfileId: profileId,
      actionUrl: `/editor/profiles/${profileId}`,
    });
  }

  revalidatePath("/admin/review");
  revalidatePath(`/profile/${profileId}`);
  return { success: true };
}
