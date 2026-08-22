"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/i18n/language-provider";

export function ShareButton({
  slug,
  fullName,
}: {
  slug: string;
  fullName: string;
}) {
  const { t } = useTranslation();

  async function handleShare() {
    const url = `${window.location.origin}/profile/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${fullName} | AqoonsiPlus`, url });
      } catch {
        // user cancelled the native share sheet
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success(t("profilesPublic.shareButton.linkCopied"));
  }

  return (
    <button
      onClick={handleShare}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-mist text-slate hover:border-teal hover:text-teal"
      aria-label={t("profilesPublic.shareButton.ariaLabel")}
    >
      <Share2 className="h-4 w-4" />
    </button>
  );
}
