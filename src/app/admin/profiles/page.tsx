import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getStaffContext } from "@/lib/auth/staff";
import {
  getAllProfilesForSuperAdmin,
  type ProfileLifecycleFilter,
} from "@/lib/data/admin";
import { ProfileActionsMenu } from "@/components/admin/profile-actions-menu";
import { SectionHeader } from "@/components/dashboard/section-header";
import { DataTable, DataTableHead, DataTableBody, EmptyRow } from "@/components/dashboard/data-table";
import { Pagination } from "@/components/dashboard/pagination";
import { Badge } from "@/components/ui/badge";
import { WORKFLOW_STATUS_VARIANT, workflowStatusLabel } from "@/lib/workflow";

export const metadata: Metadata = { title: "All Profiles" };

const TABS: { key: ProfileLifecycleFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "verified", label: "Verified" },
  { key: "draft", label: "Draft" },
  { key: "hidden", label: "Hidden" },
  { key: "archived", label: "Archived" },
  { key: "trash", label: "Trash" },
];

export default async function AdminAllProfilesPage(
  props: PageProps<"/admin/profiles">
) {
  const { role } = await getStaffContext();
  if (role !== "super_admin" && role !== "admin") redirect("/admin");
  const isSuperAdmin = role === "super_admin";

  const searchParams = await props.searchParams;
  const rawFilter = typeof searchParams.filter === "string" ? searchParams.filter : "all";
  const filter: ProfileLifecycleFilter = TABS.some((t) => t.key === rawFilter)
    ? (rawFilter as ProfileLifecycleFilter)
    : "all";

  const profiles = await getAllProfilesForSuperAdmin(filter);

  return (
    <div>
      <SectionHeader
        title="All Profiles"
        subtitle={
          isSuperAdmin
            ? "Complete lifecycle control over every profile on the platform."
            : "Complete lifecycle control over every profile on the platform. Permanently deleting a profile requires Super Admin."
        }
        tabs={TABS.map((tab) => ({
          key: tab.key,
          label: tab.label,
          href: tab.key === "all" ? "/admin/profiles" : `/admin/profiles?filter=${tab.key}`,
        }))}
        activeTabKey={filter}
      />

      <div className="mt-6">
        <DataTable
          footer={
            <Pagination
              page={1}
              pageCount={1}
              total={profiles.length}
              buildHref={() =>
                filter === "all" ? "/admin/profiles" : `/admin/profiles?filter=${filter}`
              }
            />
          }
        >
          <DataTableHead>
            <th className="px-4 py-3">Profile</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Last Updated</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </DataTableHead>
          <DataTableBody>
            {profiles.length === 0 ? (
              <EmptyRow colSpan={4}>No profiles in this view.</EmptyRow>
            ) : (
              profiles.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-mist">
                        {p.photo_url && (
                          <Image
                            src={p.photo_url}
                            alt={p.full_name}
                            width={40}
                            height={40}
                            className="h-full w-full object-contain"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-navy dark:text-white">
                          {p.full_name}
                        </p>
                        <p className="truncate text-xs text-slate">
                          {p.current_position ?? "No position"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant={WORKFLOW_STATUS_VARIANT[p.workflow_status]} size="sm">
                        {workflowStatusLabel(p.workflow_status)}
                      </Badge>
                      {p.verification_status === "verified" && (
                        <Badge variant="verified" size="sm">Verified</Badge>
                      )}
                      {p.hidden_at && (
                        <Badge variant="pending" size="sm">Hidden</Badge>
                      )}
                      {p.status === "archived" && (
                        <Badge variant="neutral" size="sm">Archived</Badge>
                      )}
                      {p.deleted_at && (
                        <Badge variant="solid-navy" size="sm">In Trash</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate">
                    {new Date(p.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ProfileActionsMenu
                      profile={{
                        id: p.id,
                        slug: p.slug,
                        status: p.status,
                        workflow_status: p.workflow_status,
                        verification_status: p.verification_status,
                        hidden_at: p.hidden_at,
                        deleted_at: p.deleted_at,
                      }}
                      canPermanentlyDelete={isSuperAdmin}
                    />
                  </td>
                </tr>
              ))
            )}
          </DataTableBody>
        </DataTable>
      </div>
    </div>
  );
}
