import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileBySlug } from "@/lib/data/profiles";
import { getStaffContext } from "@/lib/auth/staff";
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
  const [data, { role }] = await Promise.all([
    getProfileBySlug(slug),
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

  return (
    <div className="bg-white dark:bg-offwhite">
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
