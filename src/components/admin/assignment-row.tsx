"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { assignProfileTask } from "@/lib/actions/workflow";
import { Badge } from "@/components/ui/badge";

export function AssignmentRow({
  profileId,
  slug,
  fullName,
  workflowStatus,
  initialStaffId,
  initialEditorId,
  initialDeadline,
  staffOptions,
  editorOptions,
}: {
  profileId: string;
  slug: string;
  fullName: string;
  workflowStatus: string;
  initialStaffId: string | null;
  initialEditorId: string | null;
  initialDeadline: string | null;
  staffOptions: { user_id: string; email: string | null }[];
  editorOptions: { user_id: string; email: string | null }[];
}) {
  const router = useRouter();
  const [staffId, setStaffId] = useState(initialStaffId ?? "");
  const [editorId, setEditorId] = useState(initialEditorId ?? "");
  const [deadline, setDeadline] = useState(initialDeadline ?? "");
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const result = await assignProfileTask(
        profileId,
        staffId || null,
        editorId || null,
        deadline || null
      );
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Assignment saved");
      router.refresh();
    });
  }

  return (
    <div className="grid grid-cols-1 items-center gap-3 rounded-xl border border-mist p-4 sm:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
      <div className="min-w-0">
        <Link href={`/profile/${slug}`} target="_blank" className="truncate text-sm font-semibold text-navy dark:text-white hover:text-teal">
          {fullName}
        </Link>
        <div className="mt-1">
          <Badge variant="neutral" size="sm">
            {workflowStatus.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>
      <select
        value={staffId}
        onChange={(e) => setStaffId(e.target.value)}
        className="rounded-lg border border-mist bg-white dark:bg-offwhite px-2 py-1.5 text-xs text-navy dark:text-white focus:border-teal focus:outline-none"
      >
        <option value="">No staff</option>
        {staffOptions.map((s) => (
          <option key={s.user_id} value={s.user_id}>
            {s.email}
          </option>
        ))}
      </select>
      <select
        value={editorId}
        onChange={(e) => setEditorId(e.target.value)}
        className="rounded-lg border border-mist bg-white dark:bg-offwhite px-2 py-1.5 text-xs text-navy dark:text-white focus:border-teal focus:outline-none"
      >
        <option value="">No editor</option>
        {editorOptions.map((ed) => (
          <option key={ed.user_id} value={ed.user_id}>
            {ed.email}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="rounded-lg border border-mist bg-white dark:bg-offwhite px-2 py-1.5 text-xs text-navy dark:text-white focus:border-teal focus:outline-none"
      />
      <button
        onClick={save}
        disabled={pending}
        className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-navy px-3 text-xs font-semibold text-white hover:bg-royal disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
        Save
      </button>
    </div>
  );
}
