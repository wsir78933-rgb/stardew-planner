import type { MetadataRoute } from "next";
import {
  getHomepageDisplayPath,
  getLocalizedIndexablePublicRouteEntries,
} from "../src/i18n/public-route-registry";
import { createCanonicalUrl } from "../src/seo/public-site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const localizedEntries = getLocalizedIndexablePublicRouteEntries().map(({ pathname }) => ({
    url: createCanonicalUrl(pathname),
  }));
  const russianHomepageUrl = createCanonicalUrl(getHomepageDisplayPath("ru"));
  if (localizedEntries.some((entry) => entry.url === russianHomepageUrl)) {
    throw new Error(
      `Sitemap already contains the Russian homepage URL ${russianHomepageUrl}.`,
    );
  }

  return [...localizedEntries, { url: russianHomepageUrl }];
}
