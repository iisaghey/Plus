import Link from "next/link";
import Image from "next/image";
import { PlusCircle, IdCard, FileEdit, Clock, Undo2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAssignedProfiles, getStaffStats } from "@/lib/data/staff";
import { Badge } from "@/components/ui/badge";
import { createStaffDraft } from "@/lib/actions/profile";
import { StaffDraftForm } from "@/components/dashboard/staff-draft-form";
import { StatCard } from "@/components/dashboard/stat-card";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

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
  const locale = await getServerLocale();
  const t = getDictionary(locale);
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
          <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
            {t.admin.staff.title}
          </h1>
          <p className="mt-1 text-sm text-slate">
            {t.admin.staff.subtitle}
          </p>
        </div>
        <StaffDraftForm action={createStaffDraft} />
      </div>

      <StaggerGrid className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: t.admin.staff.statAssigned, value: stats.total, icon: IdCard, accent: "navy" as const },
          { label: t.admin.staff.statDrafts, value: stats.drafts, icon: FileEdit, accent: "sky" as const },
          { label: t.admin.staff.statPendingReview, value: stats.pendingSubmissions, icon: Clock, accent: "gold" as const },
          { label: t.admin.staff.statReturned, value: stats.returned, icon: Undo2, accent: "gold" as const },
          { label: t.admin.staff.statCompleted, value: stats.completed, icon: CheckCircle2, accent: "emerald" as const },
        ].map((s) => (
          <StaggerItem key={s.label} hoverLift>
            <StatCard label={s.label} value={s.value} icon={s.icon} accent={s.accent} />
          </StaggerItem>
        ))}
      </StaggerGrid>

      <div className="mt-8 space-y-3">
        {profiles.length === 0 ? (
          <p className="rounded-xl border border-dashed border-mist py-12 text-center text-sm text-slate">
            {t.admin.staff.empty}
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
                    <Image src={p.photo_url} alt={p.full_name} width={44} height={44} className="h-full w-full object-contain" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy dark:text-white">{p.full_name}</p>
                  <p className="truncate text-xs text-slate">
                    {p.current_position ?? t.admin.staff.noPosition}
                    {p.assignment_deadline ? ` · ${t.admin.staff.due} ${p.assignment_deadline}` : ""}
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
        {t.admin.staff.newDraftHint}
      </div>
    </div>
  );
}
