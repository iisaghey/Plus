import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileBySlug } from "@/lib/data/profiles";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";

export async function generateMetadata(
  props: PageProps<"/profile/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await getProfileBySlug(slug);
  if (!data) return { title: "Profile Not Found" };

  const { profile } = data;
  const title = `${profile.full_name} | AqoonsiPlus`;
  const description =
    profile.short_bio ??
    `${profile.full_name}'s verified digital profile on AqoonsiPlus.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: profile.photo_url ? [profile.photo_url] : undefined,
    },
  };
}

export default async function ProfilePage(
  props: PageProps<"/profile/[slug]">
) {
  const { slug } = await props.params;
  const data = await getProfileBySlug(slug);
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

  return (
    <div className="bg-white">
      <ProfileHeader profile={profile} />
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
