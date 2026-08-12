import type { Metadata } from "next";
import { ProfileDirectory } from "@/components/profile/profile-directory";

export const metadata: Metadata = {
  title: "Browse Profiles",
  description:
    "Search and browse verified digital profiles of leaders, professionals, and public figures on AqoonsiPlus.",
};

export default async function ProfilesPage(props: PageProps<"/profiles">) {
  const searchParams = await props.searchParams;
  return (
    <ProfileDirectory
      label="Browse Profiles"
      title="All Digital Profiles"
      description="Search and filter verified profiles of leaders, professionals, and public figures across every category."
      searchParams={searchParams}
    />
  );
}
