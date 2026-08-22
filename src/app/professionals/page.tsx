import type { Metadata } from "next";
import { ProfileDirectory } from "@/components/profile/profile-directory";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Professionals",
  description:
    "Verified digital profiles of business leaders, academics, and professionals on AqoonsiPlus.",
};

export default async function ProfessionalsPage(
  props: PageProps<"/professionals">
) {
  const searchParams = await props.searchParams;
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  return (
    <ProfileDirectory
      label={t.profilesPublic.professionals.label}
      title={t.profilesPublic.professionals.title}
      description={t.profilesPublic.professionals.description}
      searchParams={searchParams}
      presetCategory="business-leader,professional,academic-research,civil-society-ngo"
    />
  );
}
