"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setAccountStatus } from "@/lib/actions/admin";
import { useTranslation } from "@/i18n/language-provider";

export function ApprovalRow({
  userId,
  email,
  createdAt,
}: {
  userId: string;
  email: string | null;
  createdAt: string;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [pending, startTransition] = useTransition();

  function decide(approve: boolean) {
    startTransition(async () => {
      const result = await setAccountStatus(
        userId,
        approve ? "approved" : "rejected"
      );
      if (result.error) {
        toast.error(result.errorCode ? t(`admin.errors.${result.errorCode}`) : result.error);
        return;
      }
      toast.success(approve ? t("admin.approvalRow.approved") : t("admin.approvalRow.rejected"));
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-mist p-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-navy dark:text-white">
          {email ?? t("admin.approvalRow.unknownEmail")}
        </p>
        <p className="text-xs text-slate">
          {t("admin.approvalRow.signedUp")} {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => decide(true)}
          disabled={pending}
          className="flex h-9 items-center gap-1.5 rounded-full bg-emerald/10 px-4 text-xs font-semibold text-emerald hover:bg-emerald/20 disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          {t("admin.approvalRow.approve")}
        </button>
        <button
          onClick={() => decide(false)}
          disabled={pending}
          className="flex h-9 items-center gap-1.5 rounded-full bg-red-50 px-4 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" />
          {t("admin.approvalRow.reject")}
        </button>
      </div>
    </div>
  );
}
