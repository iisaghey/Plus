import type { Metadata } from "next";
import { getPendingVerifications } from "@/lib/data/admin";
import { VerificationRow } from "@/components/admin/verification-row";

export const metadata: Metadata = { title: "Verification Queue" };

export default async function VerificationQueuePage() {
  const items = await getPendingVerifications();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy">
        Verification Queue
      </h1>
      <p className="mt-1 text-sm text-slate">
        Profiles submitted for identity and information verification.
      </p>

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
