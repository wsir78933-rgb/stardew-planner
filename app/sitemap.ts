import type { MetadataRoute } from "next";
import { getLocalizedIndexablePublicRouteEntries } from "../src/i18n/public-route-registry";
import { japaneseHomepagePathname } from "../src/seo/canonical-public-routes";
import { createCanonicalUrl } from "../src/seo/public-site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const localizedEntries = getLocalizedIndexablePublicRouteEntries().map(({ pathname }) => ({
    url: createCanonicalUrl(pathname),
  }));
  const japaneseHomepageUrl = createCanonicalUrl(japaneseHomepagePathname);
  if (localizedEntries.some((entry) => entry.url === japaneseHomepageUrl)) {
    throw new Error(
      `Sitemap already contains the Japanese homepage URL. Received: ${japaneseHomepageUrl}.`,
    );
  }

  return [...localizedEntries, { url: japaneseHomepageUrl }];
}
