"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent, notifyUser } from "@/lib/actions/audit";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, role: null };

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  return { supabase, user, role: userRole?.role ?? null };
}

export async function assignProfileTask(
  profileId: string,
  staffId: string | null,
  editorId: string | null,
  deadline: string | null
) {
  const { supabase, user, role } = await requireUser();
  if (!user) return { error: "You must be signed in." };
  if (role !== "admin" && role !== "super_admin") {
    return { error: "Only Admins can assign tasks." };
  }

  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("workflow_status, full_name")
    .eq("id", profileId)
    .maybeSingle();
  if (fetchError || !profile) return { error: "Profile not found." };

  const nextStatus = profile.workflow_status === "draft" ? "in_progress" : undefined;

  const { error } = await supabase
    .from("profiles")
    .update({
      assigned_staff_id: staffId,
      assigned_editor_id: editorId,
      assignment_deadline: deadline,
      ...(nextStatus ? { workflow_status: nextStatus } : {}),
    })
    .eq("id", profileId);
  if (error) return { error: error.message };

  await logAuditEvent(supabase, {
    actorId: user.id,
    actorRole: role,
    action: "assign_task",
    entityType: "profile",
    entityId: profileId,
    newValue: { staffId, editorId, deadline },
  });

  if (staffId) {
    await notifyUser(supabase, {
      userId: staffId,
      type: "task_assigned",
      title: `You've been assigned: ${profile.full_name}`,
      message: deadline ? `Deadline: ${deadline}` : undefined,
      relatedProfileId: profileId,
      actionUrl: "/staff",
    });
  }
  if (editorId) {
    await notifyUser(supabase, {
      userId: editorId,
      type: "task_assigned",
      title: `You've been assigned to review: ${profile.full_name}`,
      relatedProfileId: profileId,
      actionUrl: "/editor",
    });
  }

  revalidatePath("/admin");
  revalidatePath("/staff");
  revalidatePath("/editor");
  return { success: true };
}

export async function submitProfileForReview(profileId: string) {
  const { supabase, user, role } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, assigned_editor_id")
    .eq("id", profileId)
    .maybeSingle();
  if (!profile) return { error: "Profile not found." };

  const { error } = await supabase
    .from("profiles")
    .update({ workflow_status: "submitted" })
    .eq("id", profileId);
  if (error) return { error: error.message };

  await logAuditEvent(supabase, {
    actorId: user.id,
    actorRole: role,
    action: "submit_for_review",
    entityType: "profile",
    entityId: profileId,
  });

  if (profile.assigned_editor_id) {
    await notifyUser(supabase, {
      userId: profile.assigned_editor_id,
      type: "review_requested",
      title: `A new profile is waiting for your review: ${profile.full_name}`,
      relatedProfileId: profileId,
      actionUrl: "/editor",
    });
  }

  revalidatePath("/staff");
  revalidatePath("/editor");
  return { success: true };
}

export async function editorDecision(
  profileId: string,
  decision: "approve" | "return",
  notes?: string
) {
  const { supabase, user, role } = await requireUser();
  if (!user) return { error: "You must be signed in." };
  if (!["editor", "admin", "super_admin"].includes(role ?? "")) {
    return { error: "Only Editors can make this decision." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, assigned_staff_id")
    .eq("id", profileId)
    .maybeSingle();
  if (!profile) return { error: "Profile not found." };

  const nextStatus = decision === "approve" ? "editor_approved" : "changes_required";

  const { error } = await supabase
    .from("profiles")
    .update({ workflow_status: nextStatus, editorial_notes: notes ?? null })
    .eq("id", profileId);
  if (error) return { error: error.message };

  await logAuditEvent(supabase, {
    actorId: user.id,
    actorRole: role,
    action: `editor_${decision}`,
    entityType: "profile",
    entityId: profileId,
    newValue: { notes },
  });

  if (decision === "return" && profile.assigned_staff_id) {
    await notifyUser(supabase, {
      userId: profile.assigned_staff_id,
      type: "returned_for_correction",
      title: `Your profile submission has been returned for correction: ${profile.full_name}`,
      message: notes,
      relatedProfileId: profileId,
      actionUrl: "/staff",
    });
  }

  revalidatePath("/editor");
  revalidatePath("/admin");
  return { success: true };
}

export async function adminReviewDecision(
  profileId: string,
  decision: "approve" | "reject",
  notes?: string
) {
  const { supabase, user, role } = await requireUser();
  if (!user) return { error: "You must be signed in." };
  if (role !== "admin" && role !== "super_admin") {
    return { error: "Only Admins can make this decision." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, assigned_staff_id, assigned_editor_id")
    .eq("id", profileId)
    .maybeSingle();
  if (!profile) return { error: "Profile not found." };

  const nextStatus = decision === "approve" ? "approved" : "rejected";

  const { error } = await supabase
    .from("profiles")
    .update({ workflow_status: nextStatus, editorial_notes: notes ?? null })
    .eq("id", profileId);
  if (error) return { error: error.message };

  await logAuditEvent(supabase, {
    actorId: user.id,
    actorRole: role,
    action: `admin_${decision}`,
    entityType: "profile",
    entityId: profileId,
    newValue: { notes },
  });

  const notifyTarget = profile.assigned_editor_id ?? profile.assigned_staff_id;
  if (notifyTarget) {
    await notifyUser(supabase, {
      userId: notifyTarget,
      type: decision === "approve" ? "admin_approved" : "admin_rejected",
      title:
        decision === "approve"
          ? `A profile you worked on was approved: ${profile.full_name}`
          : `A profile you worked on was rejected: ${profile.full_name}`,
      message: notes,
      relatedProfileId: profileId,
      actionUrl: "/admin",
    });
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function publishProfile(profileId: string, publish: boolean) {
  const { supabase, user, role } = await requireUser();
  if (!user) return { error: "You must be signed in." };
  if (role !== "admin" && role !== "super_admin") {
    return { error: "Only Admins can publish profiles." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ workflow_status: publish ? "published" : "approved" })
    .eq("id", profileId);
  if (error) return { error: error.message };

  await logAuditEvent(supabase, {
    actorId: user.id,
    actorRole: role,
    action: publish ? "publish_profile" : "unpublish_profile",
    entityType: "profile",
    entityId: profileId,
  });

  revalidatePath("/admin");
  revalidatePath("/profiles");
  return { success: true };
}
