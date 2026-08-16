import { SectionLabel } from "@/components/ui/section-label";
import { LinkButton } from "@/components/ui/button";
import { ProfileCard } from "@/components/profile/profile-card";
import { getFeaturedProfiles } from "@/lib/data/profiles";

export async function FeaturedProfiles() {
  const profiles = await getFeaturedProfiles(6);
  if (profiles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <SectionLabel>Featured Profiles</SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
            Distinguished Digital Profiles
          </h2>
          <p className="mt-3 max-w-xl text-slate">
            A curated selection of verified leaders, professionals, and
            public figures preserving their legacy on AqoonsiPlus.
          </p>
        </div>
        <LinkButton href="/profiles" variant="outline" size="md">
          View All Profiles
        </LinkButton>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </section>
  );
}
