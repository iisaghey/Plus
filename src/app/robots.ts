import type { MetadataRoute } from "next";

const SITE_URL = "https://www.aqoonsiplus.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/editor",
        "/editor/",
        "/staff",
        "/staff/",
        "/dashboard",
        "/dashboard/",
        "/login",
        "/notifications",
        "/api/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
