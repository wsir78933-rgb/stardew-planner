import type { MetadataRoute } from "next";
import { publicSiteOrigin } from "../src/i18n/public-site-url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: publicSiteOrigin,
    sitemap: `${publicSiteOrigin}/sitemap.xml`,
  };
}
