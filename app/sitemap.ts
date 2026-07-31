import type { MetadataRoute } from "next";
import { canonicalPublicPaths } from "../src/seo/canonical-public-routes";
import { createCanonicalUrl } from "../src/seo/public-site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return canonicalPublicPaths.map((pathname) => ({
    url: createCanonicalUrl(pathname),
  }));
}
