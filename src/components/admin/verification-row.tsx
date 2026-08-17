"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check, X, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { decideVerification } from "@/lib/actions/admin";

export function VerificationRow({
  verificationId,
  profileId,
  slug,
  fullName,
  position,
  photoUrl,
  submittedAt,
}: {
  verificationId: string;
  profileId: string;
  slug: string;
  fullName: string;
  position: string | null;
  photoUrl: string | null;
  submittedAt: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function decide(approve: boolean) {
    startTransition(async () => {
      const result = await decideVerification(verificationId, profileId, approve);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(approve ? "Profile verified" : "Verification rejected");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-mist p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-mist">
          {photoUrl && (
            <Image src={photoUrl} alt={fullName} width={44} height={44} className="h-full w-full object-contain" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-navy dark:text-white">{fullName}</p>
            <Link
              href={`/profile/${slug}`}
              target="_blank"
              className="text-slate hover:text-teal"
              aria-label="View public profile"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
          <p className="truncate text-xs text-slate">
            {position ?? "No position"} · Submitted {new Date(submittedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => decide(true)}
          disabled={pending}
          className="flex h-9 items-center gap-1.5 rounded-full bg-emerald/10 px-4 text-xs font-semibold text-emerald hover:bg-emerald/20 disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          Verify
        </button>
        <button
          onClick={() => decide(false)}
          disabled={pending}
          className="flex h-9 items-center gap-1.5 rounded-full bg-red-50 px-4 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" />
          Reject
        </button>
      </div>
    </div>
  );
}
