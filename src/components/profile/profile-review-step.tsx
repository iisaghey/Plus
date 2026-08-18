import { CheckCircle2, Circle, ShieldCheck, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProfileQrCode } from "@/components/profile/profile-qr-code";
import type { Tables } from "@/types/database.types";

const VERIFICATION_VARIANT: Record<string, "verified" | "pending" | "neutral"> = {
  verified: "verified",
  pending: "pending",
  unverified: "neutral",
  rejected: "neutral",
};

export function ProfileReviewStep({
  profile,
  checklist,
  publicUrl,
}: {
  profile: Tables<"profiles">;
  checklist: { label: string; done: boolean }[];
  publicUrl: string;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-mist p-6">
        <h2 className="font-heading text-base font-bold text-navy dark:text-white">
          Section Checklist
        </h2>
        <p className="mt-1 text-xs text-slate">
          A quick look at what&apos;s filled in before you submit for review.
        </p>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {checklist.map(({ label, done }) => (
            <li
              key={label}
              className={`flex items-center gap-2 text-sm ${done ? "text-navy dark:text-white" : "text-slate"}`}
            >
              {done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-mist" />
              )}
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-mist p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-teal" />
            <h3 className="font-heading text-sm font-bold text-navy dark:text-white">
              Verified Profile
            </h3>
          </div>
          <p className="mt-2 text-sm text-slate">
            Your profile&apos;s identity and information are reviewed before a verified badge is
            granted.
          </p>
          <Badge
            variant={VERIFICATION_VARIANT[profile.verification_status] ?? "neutral"}
            size="md"
            className="mt-3"
          >
            {profile.verification_status}
          </Badge>
        </div>

        <div className="rounded-2xl border border-mist p-6">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-teal" />
            <h3 className="font-heading text-sm font-bold text-navy dark:text-white">
              Public Profile Link
            </h3>
          </div>
          <p className="mt-2 truncate text-sm text-teal">{publicUrl}</p>
          <p className="mt-1 text-xs text-slate">
            Live once your profile is reviewed and published.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-mist p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-sm font-bold text-navy dark:text-white">
              Unique QR Code
            </h3>
            <p className="mt-1 text-sm text-slate">
              Share your profile instantly by scanning or sending its QR code.
            </p>
          </div>
          <ProfileQrCode slug={profile.slug} fullName={profile.full_name} isSuperAdmin={false} />
        </div>
      </div>
    </div>
  );
}
