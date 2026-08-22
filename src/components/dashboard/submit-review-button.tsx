"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitProfileForReview } from "@/lib/actions/workflow";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/language-provider";

export function SubmitReviewButton({
  profileId,
  redirectTo,
}: {
  profileId: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { t } = useTranslation();

  function handleClick() {
    startTransition(async () => {
      const result = await submitProfileForReview(profileId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(t("dashboard.submitReviewButton.successToast"));
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <Button variant="primary" size="sm" onClick={handleClick} disabled={pending}>
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
      {t("dashboard.submitReviewButton.buttonLabel")}
    </Button>
  );
}
