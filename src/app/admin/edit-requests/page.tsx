import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getStaffContext } from "@/lib/auth/staff";
import { getEditPermissionRequests } from "@/lib/data/admin";
import {
  EditPermissionRequestRow,
  type EditRequestRowData,
} from "@/components/admin/edit-permission-request-row";

export const metadata: Metadata = { title: "Edit Permission Requests" };

export default async function AdminEditRequestsPage() {
  const { role } = await getStaffContext();
  if (role !== "super_admin") redirect("/admin");

  const requests = await getEditPermissionRequests();

  const rows: EditRequestRowData[] = requests.map((r) => {
    const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    return {
      id: r.id,
      profile_id: r.profile_id,
      editor_id: r.editor_id,
      editor_email: r.editor_email,
      reason: r.reason,
      fields_requested: r.fields_requested,
      description: r.description,
      supporting_document_path: r.supporting_document_path,
      status: r.status,
      review_notes: r.review_notes,
      created_at: r.created_at,
      profile_name: profile?.full_name ?? "Unknown profile",
      profile_slug: profile?.slug ?? "",
      profile_photo: profile?.photo_url ?? null,
    };
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
        Edit Permission Requests
      </h1>
      <p className="mt-1 text-sm text-slate">
        Editors requesting permission to change an already-published profile.
      </p>

      <div className="mt-8 space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-mist py-12 text-center text-sm text-slate">
            No pending edit permission requests.
          </p>
        ) : (
          rows.map((r) => <EditPermissionRequestRow key={r.id} request={r} />)
        )}
      </div>
    </div>
  );
}
