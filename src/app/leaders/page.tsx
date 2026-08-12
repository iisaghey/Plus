import type { Metadata } from "next";
import { ProfileDirectory } from "@/components/profile/profile-directory";

export const metadata: Metadata = {
  title: "Leaders",
  description:
    "Verified digital profiles of government officials and political leaders on AqoonsiPlus.",
};

export default async function LeadersPage(props: PageProps<"/leaders">) {
  const searchParams = await props.searchParams;
  return (
    <ProfileDirectory
      label="Leaders"
      title="Government & Political Leaders"
      description="Verified digital profiles of government officials and political leaders preserving their leadership history."
      searchParams={searchParams}
      presetCategory="government-official,political-leader"
    />
  );
}
