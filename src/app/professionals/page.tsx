import type { Metadata } from "next";
import { ProfileDirectory } from "@/components/profile/profile-directory";

export const metadata: Metadata = {
  title: "Professionals",
  description:
    "Verified digital profiles of business leaders, academics, and professionals on AqoonsiPlus.",
};

export default async function ProfessionalsPage(
  props: PageProps<"/professionals">
) {
  const searchParams = await props.searchParams;
  return (
    <ProfileDirectory
      label="Professionals"
      title="Business, Academic & Civil Society Leaders"
      description="Verified digital profiles of professionals building their digital legacy on AqoonsiPlus."
      searchParams={searchParams}
      presetCategory="business-leader,professional,academic-research,civil-society-ngo"
    />
  );
}
