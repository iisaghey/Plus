import type { Enums } from "@/types/database.types";

type WorkflowStatus = Enums<"profile_workflow_status">;

const OWNER_EDITABLE_STATUSES: WorkflowStatus[] = [
  "draft",
  "in_progress",
  "changes_required",
  "rejected",
];

export function isEditableByOwner(status: WorkflowStatus) {
  return OWNER_EDITABLE_STATUSES.includes(status);
}

export const WORKFLOW_STATUS_VARIANT: Record<
  WorkflowStatus,
  "neutral" | "pending" | "verified" | "navy"
> = {
  draft: "neutral",
  in_progress: "neutral",
  submitted: "pending",
  under_review: "pending",
  changes_required: "pending",
  editor_approved: "navy",
  admin_review: "navy",
  approved: "verified",
  verified: "verified",
  published: "verified",
  suspended: "neutral",
  archived: "neutral",
  rejected: "neutral",
};

export function workflowStatusLabel(
  status: WorkflowStatus,
  labels?: Record<WorkflowStatus, string>
) {
  return labels?.[status] ?? status.replace(/_/g, " ");
}
