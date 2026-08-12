"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitForVerification } from "@/lib/actions/verification";
import { Button } from "@/components/ui/button";

export function SubmitVerificationButton({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await submitForVerification(profileId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Submitted for verification");
      router.refresh();
    });
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={pending}>
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <BadgeCheck className="h-3.5 w-3.5" />}
      Submit for Verification
    </Button>
  );
}
