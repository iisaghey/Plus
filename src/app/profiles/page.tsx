import type { Metadata } from "next";
import { ProfileDirectory } from "@/components/profile/profile-directory";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Browse Profiles",
  description:
    "Search and browse verified digital profiles of leaders, professionals, and public figures on AqoonsiPlus.",
};

export default async function ProfilesPage(props: PageProps<"/profiles">) {
  const searchParams = await props.searchParams;
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  return (
    <ProfileDirectory
      label={t.profilesPublic.profilesList.label}
      title={t.profilesPublic.profilesList.title}
      description={t.profilesPublic.profilesList.description}
      searchParams={searchParams}
    />
  );
}
