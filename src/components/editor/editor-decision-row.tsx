"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check, Undo2, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { editorDecision } from "@/lib/actions/workflow";

export function EditorDecisionRow({
  profileId,
  slug,
  fullName,
  position,
  photoUrl,
}: {
  profileId: string;
  slug: string;
  fullName: string;
  position: string | null;
  photoUrl: string | null;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [pending, startTransition] = useTransition();

  function decide(decision: "approve" | "return") {
    startTransition(async () => {
      const result = await editorDecision(profileId, decision, notes || undefined);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(decision === "approve" ? "Sent to Admin" : "Returned to Staff");
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-mist p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-mist p-1">
            {photoUrl && (
              <Image src={photoUrl} alt={fullName} width={44} height={44} className="h-full w-full object-contain" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-navy dark:text-white">{fullName}</p>
              <Link href={`/profile/${slug}`} target="_blank" className="text-slate hover:text-teal">
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="truncate text-xs text-slate">{position ?? "No position"}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => decide("approve")}
            disabled={pending}
            className="flex h-9 items-center gap-1.5 rounded-full bg-emerald/10 px-4 text-xs font-semibold text-emerald hover:bg-emerald/20 disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Send to Admin
          </button>
          <button
            onClick={() => decide("return")}
            disabled={pending}
            className="flex h-9 items-center gap-1.5 rounded-full bg-gold/10 px-4 text-xs font-semibold text-gold hover:bg-gold/20 disabled:opacity-50"
          >
            <Undo2 className="h-3.5 w-3.5" />
            Return to Staff
          </button>
        </div>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Editorial notes (optional, sent with either decision)…"
        rows={2}
        className="mt-3 w-full rounded-lg border border-mist px-3 py-2 text-xs text-ink placeholder:text-slate focus:border-teal focus:outline-none"
      />
    </div>
  );
}
