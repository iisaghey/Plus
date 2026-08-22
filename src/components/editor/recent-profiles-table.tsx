import Image from "next/image";
import { Eye, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ActionIconButton } from "@/components/dashboard/action-icon-button";
import { DataTable, DataTableHead, DataTableBody, EmptyRow } from "@/components/dashboard/data-table";
import { WORKFLOW_STATUS_VARIANT, workflowStatusLabel } from "@/lib/workflow";
import type { Enums } from "@/types/database.types";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export type RecentProfileRow = {
  id: string;
  slug: string;
  full_name: string;
  current_position: string | null;
  photo_url: string | null;
  workflow_status: Enums<"profile_workflow_status">;
  organization_name: string | null;
  updated_at: string;
};

export async function RecentProfilesTable({
  profiles,
  title,
}: {
  profiles: RecentProfileRow[];
  title?: string;
}) {
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const resolvedTitle = title ?? t.editorWorkspace.recentProfilesTable.defaultTitle;

  return (
    <div className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-6">
      <h2 className="font-heading text-base font-bold text-navy dark:text-white">
        {resolvedTitle}
      </h2>

      <div className="mt-4">
        <DataTable minWidth={720}>
          <DataTableHead>
            <th className="px-4 py-3">{t.editorWorkspace.recentProfilesTable.colProfile}</th>
            <th className="px-4 py-3">{t.editorWorkspace.recentProfilesTable.colOrganization}</th>
            <th className="px-4 py-3">{t.editorWorkspace.recentProfilesTable.colStatus}</th>
            <th className="px-4 py-3">{t.editorWorkspace.recentProfilesTable.colLastUpdated}</th>
            <th className="px-4 py-3 text-right">{t.editorWorkspace.recentProfilesTable.colActions}</th>
          </DataTableHead>
          <DataTableBody>
            {profiles.length === 0 ? (
              <EmptyRow colSpan={5}>{t.editorWorkspace.recentProfilesTable.noProfilesYet}</EmptyRow>
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
                          {p.current_position ?? t.editorWorkspace.recentProfilesTable.noPosition}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate">
                    {p.organization_name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={WORKFLOW_STATUS_VARIANT[p.workflow_status]} size="sm">
                      {workflowStatusLabel(p.workflow_status, t.common.workflowStatus)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate">
                    {new Date(p.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <ActionIconButton
                        icon={Eye}
                        label={t.editorWorkspace.recentProfilesTable.viewPublicProfile}
                        tone="sky"
                        href={`/profile/${p.slug}`}
                        newTab
                      />
                      <ActionIconButton
                        icon={Pencil}
                        label={t.editorWorkspace.recentProfilesTable.editProfile}
                        tone="teal"
                        href={`/editor/profiles/${p.id}`}
                      />
                    </div>
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
