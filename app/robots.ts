import type { MetadataRoute } from "next";

const siteOrigin = "https://stardewvalleyplanner.art";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: siteOrigin,
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}
