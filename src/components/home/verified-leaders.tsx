import { ShieldCheck } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { LinkButton } from "@/components/ui/button";
import { ProfileCard } from "@/components/profile/profile-card";
import { getVerifiedProfiles } from "@/lib/data/profiles";

export async function VerifiedLeaders() {
  const profiles = await getVerifiedProfiles(4);
  if (profiles.length === 0) return null;

  return (
    <section className="bg-offwhite">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Leaders
            </SectionLabel>
            <h2 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
              Identity-Verified Profiles
            </h2>
            <p className="mt-3 max-w-xl text-slate">
              Profiles that have completed AqoonsiPlus&apos;s identity and
              information verification process.
            </p>
          </div>
          <LinkButton href="/verification" variant="outline" size="md">
            How Verification Works
          </LinkButton>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>
    </section>
  );
}
