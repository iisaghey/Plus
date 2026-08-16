import { SectionLabel } from "@/components/ui/section-label";
import { LinkButton } from "@/components/ui/button";
import { ProfileCard } from "@/components/profile/profile-card";
import { getFeaturedProfiles } from "@/lib/data/profiles";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";

export async function FeaturedProfiles() {
  const profiles = await getFeaturedProfiles(6);
  if (profiles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <SectionLabel>Featured Leaders</SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
            Leadership Profiles on AqoonsiPlus
          </h2>
          <p className="mt-3 max-w-xl text-slate">
            Discover organized digital profiles of political leaders and
            public officials, bringing their identity, career history,
            leadership journey, achievements, and official activities
            together in one place.
          </p>
        </div>
        <LinkButton href="/profiles" variant="outline" size="md">
          View All Profiles
        </LinkButton>
      </Reveal>

      <StaggerGrid className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <StaggerItem key={profile.id}>
            <ProfileCard profile={profile} />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  );
}
