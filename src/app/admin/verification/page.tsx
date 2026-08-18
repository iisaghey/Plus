import type { Metadata } from "next";
import { getPendingVerifications } from "@/lib/data/admin";
import { VerificationRow } from "@/components/admin/verification-row";
import { SectionHeader } from "@/components/dashboard/section-header";

export const metadata: Metadata = { title: "Verification Queue" };

export default async function VerificationQueuePage() {
  const items = await getPendingVerifications();

  return (
    <div>
      <SectionHeader
        title="Verification Requests"
        subtitle="Profiles submitted for identity and information verification."
      />

      <div className="mt-8 space-y-3">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-mist py-12 text-center text-sm text-slate">
            No verification requests pending.
          </p>
        ) : (
          items.map((item) => {
            const profile = Array.isArray(item.profiles)
              ? item.profiles[0]
              : item.profiles;
            if (!profile) return null;
            return (
              <VerificationRow
                key={item.id}
                verificationId={item.id}
                profileId={item.profile_id}
                slug={profile.slug}
                fullName={profile.full_name}
                position={profile.current_position}
                photoUrl={profile.photo_url}
                submittedAt={item.created_at}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
