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
