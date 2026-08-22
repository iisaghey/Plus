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
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = { title: "All Profiles" };

const TAB_KEYS: ProfileLifecycleFilter[] = [
  "all",
  "published",
  "verified",
  "draft",
  "hidden",
  "archived",
  "trash",
];

export default async function AdminAllProfilesPage(
  props: PageProps<"/admin/profiles">
) {
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const { role } = await getStaffContext();
  if (role !== "super_admin" && role !== "admin") redirect("/admin");
  const isSuperAdmin = role === "super_admin";

  const TABS: { key: ProfileLifecycleFilter; label: string }[] = [
    { key: "all", label: t.admin.profiles.tabs.all },
    { key: "published", label: t.admin.profiles.tabs.published },
    { key: "verified", label: t.admin.profiles.tabs.verified },
    { key: "draft", label: t.admin.profiles.tabs.draft },
    { key: "hidden", label: t.admin.profiles.tabs.hidden },
    { key: "archived", label: t.admin.profiles.tabs.archived },
    { key: "trash", label: t.admin.profiles.tabs.trash },
  ];

  const searchParams = await props.searchParams;
  const rawFilter = typeof searchParams.filter === "string" ? searchParams.filter : "all";
  const filter: ProfileLifecycleFilter = TAB_KEYS.includes(rawFilter as ProfileLifecycleFilter)
    ? (rawFilter as ProfileLifecycleFilter)
    : "all";

  const profiles = await getAllProfilesForSuperAdmin(filter);

  return (
    <div>
      <SectionHeader
        title={t.admin.profiles.title}
        subtitle={
          isSuperAdmin
            ? t.admin.profiles.subtitleSuperAdmin
            : t.admin.profiles.subtitleAdmin
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
            <th className="px-4 py-3">{t.admin.profiles.colProfile}</th>
            <th className="px-4 py-3">{t.admin.profiles.colStatus}</th>
            <th className="px-4 py-3">{t.admin.profiles.colLastUpdated}</th>
            <th className="px-4 py-3 text-right">{t.admin.profiles.colActions}</th>
          </DataTableHead>
          <DataTableBody>
            {profiles.length === 0 ? (
              <EmptyRow colSpan={4}>{t.admin.profiles.empty}</EmptyRow>
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
                          {p.current_position ?? t.admin.profiles.noPosition}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant={WORKFLOW_STATUS_VARIANT[p.workflow_status]} size="sm">
                        {workflowStatusLabel(p.workflow_status, t.common.workflowStatus)}
                      </Badge>
                      {p.verification_status === "verified" && (
                        <Badge variant="verified" size="sm">{t.admin.profiles.badgeVerified}</Badge>
                      )}
                      {p.hidden_at && (
                        <Badge variant="pending" size="sm">{t.admin.profiles.badgeHidden}</Badge>
                      )}
                      {p.status === "archived" && (
                        <Badge variant="neutral" size="sm">{t.admin.profiles.badgeArchived}</Badge>
                      )}
                      {p.deleted_at && (
                        <Badge variant="solid-navy" size="sm">{t.admin.profiles.badgeInTrash}</Badge>
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
