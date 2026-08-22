import type { Metadata } from "next";
import { ProfileDirectory } from "@/components/profile/profile-directory";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Leaders",
  description:
    "Verified digital profiles of government officials and political leaders on AqoonsiPlus.",
};

export default async function LeadersPage(props: PageProps<"/leaders">) {
  const searchParams = await props.searchParams;
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  return (
    <ProfileDirectory
      label={t.profilesPublic.leaders.label}
      title={t.profilesPublic.leaders.title}
      description={t.profilesPublic.leaders.description}
      searchParams={searchParams}
      presetCategory="government-official,political-leader"
    />
  );
}
