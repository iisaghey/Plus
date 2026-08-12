import { SectionLabel } from "@/components/ui/section-label";
import { ProfileCard } from "@/components/profile/profile-card";
import { getRecentProfiles } from "@/lib/data/profiles";

export async function RecentlyAdded() {
  const profiles = await getRecentProfiles(4);
  if (profiles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <SectionLabel>Recently Added</SectionLabel>
      <h2 className="mt-3 font-heading text-3xl font-bold text-navy sm:text-4xl">
        Newest Digital Profiles
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </section>
  );
}
