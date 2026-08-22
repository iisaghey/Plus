import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileBySlug } from "@/lib/data/profiles";
import { getStaffContext } from "@/lib/auth/staff";
import { getServerLocale } from "@/i18n/get-locale";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";

export async function generateMetadata(
  props: PageProps<"/profile/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await getProfileBySlug(slug);
  if (!data) return { title: "Profile Not Found", robots: { index: false } };

  const { profile } = data;
  // Plain string here — the root layout's title template already appends
  // " | AqoonsiPlus", so including it again here would double it up.
  const title = profile.preferred_title
    ? `${profile.preferred_title} ${profile.full_name}`
    : profile.full_name;
  const description =
    profile.short_bio ??
    `${profile.full_name}'s verified digital profile on AqoonsiPlus.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/profile/${profile.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "profile",
      url: `/profile/${profile.slug}`,
      images: profile.photo_url ? [profile.photo_url] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: profile.photo_url ? [profile.photo_url] : undefined,
    },
  };
}

export default async function ProfilePage(
  props: PageProps<"/profile/[slug]">
) {
  const { slug } = await props.params;
  const locale = await getServerLocale();
  const [data, { role }] = await Promise.all([
    getProfileBySlug(slug, locale),
    getStaffContext(),
  ]);
  if (!data) notFound();

  const {
    profile,
    biography,
    careerTimeline,
    governmentPositions,
    achievements,
    activities,
    travel,
    speeches,
    media,
    documents,
  } = data;

  const socialLinks = (profile.social_links ?? {}) as Record<string, string>;
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.full_name,
    honorificPrefix: profile.preferred_title || undefined,
    jobTitle: profile.current_position || undefined,
    description: profile.short_bio || biography?.summary || undefined,
    image: profile.photo_url || undefined,
    url: `https://www.aqoonsiplus.com/profile/${profile.slug}`,
    nationality: profile.nationality || undefined,
    affiliation: profile.organizations?.name
      ? { "@type": "Organization", name: profile.organizations.name }
      : undefined,
    sameAs: Object.values(socialLinks).filter(Boolean),
  };

  return (
    <div className="bg-white dark:bg-offwhite">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <ProfileHeader profile={profile} canManageQr={role === "admin" || role === "super_admin"} />
      <ProfileTabs
        bio={biography ?? null}
        shortBio={profile.short_bio}
        careerTimeline={careerTimeline}
        governmentPositions={governmentPositions}
        achievements={achievements}
        activities={activities}
        travel={travel}
        speeches={speeches}
        media={media}
        documents={documents}
      />
    </div>
  );
}
