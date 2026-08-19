import type { MetadataRoute } from "next";
import { getPublishedProfileSlugs } from "@/lib/data/profiles";

const SITE_URL = "https://www.aqoonsiplus.com";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/leaders", priority: 0.9, changeFrequency: "daily" },
  { path: "/professionals", priority: 0.9, changeFrequency: "daily" },
  { path: "/profiles", priority: 0.9, changeFrequency: "daily" },
  { path: "/organizations", priority: 0.7, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/verification", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/help", priority: 0.4, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const profiles = await getPublishedProfileSlugs();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const profileEntries: MetadataRoute.Sitemap = profiles.map((profile) => ({
    url: `${SITE_URL}/profile/${profile.slug}`,
    lastModified: profile.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...profileEntries];
}
