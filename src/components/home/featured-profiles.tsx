import { SectionLabel } from "@/components/ui/section-label";
import { LinkButton } from "@/components/ui/button";
import { ProfileCard } from "@/components/profile/profile-card";
import { getFeaturedProfiles } from "@/lib/data/profiles";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { getServerLocale } from "@/i18n/get-locale";
import homeEn from "@/i18n/dictionaries/sections/home.en";
import homeSo from "@/i18n/dictionaries/sections/home.so";
import homeAr from "@/i18n/dictionaries/sections/home.ar";

const HOME_DICTIONARIES = { en: homeEn, so: homeSo, ar: homeAr };

export async function FeaturedProfiles() {
  const [profiles, locale] = await Promise.all([getFeaturedProfiles(6), getServerLocale()]);
  const t = HOME_DICTIONARIES[locale];
  if (profiles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <SectionLabel>{t.featuredProfiles.label}</SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
            {t.featuredProfiles.heading}
          </h2>
          <p className="mt-3 max-w-xl text-slate">{t.featuredProfiles.description}</p>
        </div>
        <LinkButton href="/profiles" variant="outline" size="md">
          {t.featuredProfiles.viewAllProfiles}
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
