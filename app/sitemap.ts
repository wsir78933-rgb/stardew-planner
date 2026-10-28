import type { MetadataRoute } from "next";
import { getLocalizedIndexablePublicRouteEntries } from "../src/i18n/public-route-registry";
import { japaneseHomepagePathname } from "../src/seo/canonical-public-routes";
import { createCanonicalUrl } from "../src/seo/public-site-url";

export const dynamic = "force-static";

const localizedHomepagePathnames = [japaneseHomepagePathname, "/ru"] as const;

export function getSitemapLastModifiedTime(): Date {
  return new Date();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = getSitemapLastModifiedTime();
  const localizedEntries = getLocalizedIndexablePublicRouteEntries().map(({ pathname }) => ({
    url: createCanonicalUrl(pathname),
    lastModified,
  }));
  const homepageEntries = localizedHomepagePathnames.map((pathname) => {
    const homepageUrl = createCanonicalUrl(pathname);
    if (localizedEntries.some((entry) => entry.url === homepageUrl)) {
      throw new Error(
        `Sitemap already contains the localized homepage URL. Received: ${homepageUrl}.`,
      );
    }
    return { url: homepageUrl, lastModified };
  });

  return [...localizedEntries, ...homepageEntries];
}
