import type { MetadataRoute } from "next";
import { getLocalizedPublicRouteEntries } from "../src/i18n/public-route-registry";
import { createCanonicalUrl } from "../src/seo/public-site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return getLocalizedPublicRouteEntries().map(({ pathname }) => ({
    url: createCanonicalUrl(pathname),
  }));
}
