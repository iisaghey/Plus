import Link from "next/link";
import Image from "next/image";
import { PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAssignedProfiles, getStaffStats } from "@/lib/data/staff";
import { Badge } from "@/components/ui/badge";
import { createStaffDraft } from "@/lib/actions/profile";
import { StaffDraftForm } from "@/components/dashboard/staff-draft-form";

const STATUS_VARIANT: Record<string, "neutral" | "pending" | "verified" | "navy"> = {
  draft: "neutral",
  in_progress: "neutral",
  submitted: "pending",
  changes_required: "pending",
  editor_approved: "navy",
  admin_review: "navy",
  approved: "verified",
  verified: "verified",
  published: "verified",
  rejected: "neutral",
};

export default async function StaffDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profiles, stats] = await Promise.all([
    getAssignedProfiles(user.id),
    getStaffStats(user.id),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">
            Staff Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate">
            Profiles assigned to you, and drafts you're building.
          </p>
        </div>
        <StaffDraftForm action={createStaffDraft} />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: "Assigned", value: stats.total },
          { label: "Drafts", value: stats.drafts },
          { label: "Pending Review", value: stats.pendingSubmissions },
          { label: "Returned", value: stats.returned },
          { label: "Completed", value: stats.completed },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-mist p-4">
            <p className="font-heading text-xl font-bold text-navy">{s.value}</p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {profiles.length === 0 ? (
          <p className="rounded-xl border border-dashed border-mist py-12 text-center text-sm text-slate">
            No profiles assigned to you yet.
          </p>
        ) : (
          profiles.map((p) => (
            <Link
              key={p.id}
              href={`/staff/profiles/${p.id}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-mist p-4 hover:border-teal/30 hover:bg-offwhite"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-mist">
                  {p.photo_url && (
                    <Image src={p.photo_url} alt={p.full_name} width={44} height={44} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy">{p.full_name}</p>
                  <p className="truncate text-xs text-slate">
                    {p.current_position ?? "No position"}
                    {p.assignment_deadline ? ` · Due ${p.assignment_deadline}` : ""}
                  </p>
                </div>
              </div>
              <Badge variant={STATUS_VARIANT[p.workflow_status] ?? "neutral"} size="sm">
                {p.workflow_status.replace(/_/g, " ")}
              </Badge>
            </Link>
          ))
        )}
      </div>

      <div className="mt-10 flex items-center gap-2 rounded-xl bg-offwhite p-4 text-xs text-slate">
        <PlusCircle className="h-4 w-4 shrink-0 text-teal" />
        Use &ldquo;New Draft&rdquo; above to start a profile for someone who
        hasn&apos;t signed up themselves &mdash; it stays assigned to you
        until you submit it for review.
      </div>
    </div>
  );
}
