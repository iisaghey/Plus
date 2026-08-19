import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { FeaturedProfiles } from "@/components/home/featured-profiles";
import { WhyAqoonsiPlus } from "@/components/home/why-aqoonsiplus";
import { PlatformFeatures } from "@/components/home/platform-features";
import { LeadershipStories } from "@/components/home/leadership-stories";
import { RecentlyAdded } from "@/components/home/recently-added";
import { VerifiedLeaders } from "@/components/home/verified-leaders";
import { DigitalLegacy } from "@/components/home/digital-legacy";
import { OurValues } from "@/components/home/our-values";
import { FinalCta } from "@/components/home/final-cta";
import { getPlatformStats } from "@/lib/data/profiles";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const stats = await getPlatformStats();

  return (
    <>
      <Hero stats={stats} />
      <FeaturedProfiles />
      <WhyAqoonsiPlus />
      <PlatformFeatures />
      <LeadershipStories />
      <RecentlyAdded />
      <VerifiedLeaders />
      <DigitalLegacy />
      <OurValues />
      <FinalCta />
    </>
  );
}
