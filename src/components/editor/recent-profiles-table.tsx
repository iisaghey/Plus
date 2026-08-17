import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WORKFLOW_STATUS_VARIANT, workflowStatusLabel } from "@/lib/workflow";
import type { Enums } from "@/types/database.types";

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

export function RecentProfilesTable({
  profiles,
  title = "Recent Profiles",
}: {
  profiles: RecentProfileRow[];
  title?: string;
}) {
  return (
    <div className="rounded-2xl border border-mist bg-white dark:bg-offwhite p-6">
      <h2 className="font-heading text-base font-bold text-navy dark:text-white">
        {title}
      </h2>

      {profiles.length === 0 ? (
        <p className="mt-6 py-8 text-center text-sm text-slate">
          No profiles yet.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-mist text-left text-[11px] font-semibold uppercase tracking-wide text-slate">
                <th className="pb-2 pr-4 font-semibold">Profile</th>
                <th className="pb-2 pr-4 font-semibold">Organization</th>
                <th className="pb-2 pr-4 font-semibold">Status</th>
                <th className="pb-2 pr-4 font-semibold">Last Updated</th>
                <th className="pb-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-b border-mist last:border-0">
                  <td className="py-3 pr-4">
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
                  <td className="py-3 pr-4 text-xs text-slate">
                    {p.organization_name ?? "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge
                      variant={WORKFLOW_STATUS_VARIANT[p.workflow_status]}
                      size="sm"
                    >
                      {workflowStatusLabel(p.workflow_status)}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate">
                    {new Date(p.updated_at).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/profile/${p.slug}`}
                        target="_blank"
                        aria-label="View public profile"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate hover:bg-offwhite hover:text-navy dark:hover:text-white"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/editor/profiles/${p.id}`}
                        aria-label="Edit profile"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate hover:bg-offwhite hover:text-navy dark:hover:text-white"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
