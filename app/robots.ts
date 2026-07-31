import type { MetadataRoute } from "next";
import { createCanonicalUrl } from "../src/seo/public-site-url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: createCanonicalUrl("/sitemap.xml"),
  };
}
