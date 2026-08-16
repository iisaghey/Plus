import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getStaffContext } from "@/lib/auth/staff";
import {
  getAllProfilesForSuperAdmin,
  type ProfileLifecycleFilter,
} from "@/lib/data/admin";
import { ProfileActionsMenu } from "@/components/admin/profile-actions-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WORKFLOW_STATUS_VARIANT, workflowStatusLabel } from "@/lib/workflow";

export const metadata: Metadata = { title: "All Profiles" };

const TABS: { key: ProfileLifecycleFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "hidden", label: "Hidden" },
  { key: "archived", label: "Archived" },
  { key: "trash", label: "Trash" },
];

export default async function AdminAllProfilesPage(
  props: PageProps<"/admin/profiles">
) {
  const { role } = await getStaffContext();
  if (role !== "super_admin") redirect("/admin");

  const searchParams = await props.searchParams;
  const rawFilter = typeof searchParams.filter === "string" ? searchParams.filter : "all";
  const filter: ProfileLifecycleFilter = TABS.some((t) => t.key === rawFilter)
    ? (rawFilter as ProfileLifecycleFilter)
    : "all";

  const profiles = await getAllProfilesForSuperAdmin(filter);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
        All Profiles
      </h1>
      <p className="mt-1 text-sm text-slate">
        Complete lifecycle control over every profile on the platform — Super Admin
        only.
      </p>

      <div className="mt-6 flex flex-wrap gap-1 border-b border-mist">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key === "all" ? "/admin/profiles" : `/admin/profiles?filter=${tab.key}`}
            className={cn(
              "rounded-t-lg px-4 py-2 text-sm font-medium transition-colors",
              filter === tab.key
                ? "border-b-2 border-teal text-teal"
                : "text-slate hover:text-navy dark:hover:text-white"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-mist">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-offwhite text-xs font-semibold uppercase tracking-wide text-slate">
            <tr>
              <th className="px-4 py-3">Profile</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {profiles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-slate">
                  No profiles in this view.
                </td>
              </tr>
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
                            className="h-full w-full object-cover"
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
                        <Badge variant="pending" size="sm">Hidden by Super Admin</Badge>
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
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
