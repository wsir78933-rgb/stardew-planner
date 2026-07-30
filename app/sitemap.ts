import type { MetadataRoute } from "next";
import { canonicalPublicPaths } from "../src/i18n/canonical-public-routes";
import {
  getAbsoluteLocalizedUrl,
  getAlternateLanguageUrls,
} from "../src/i18n/public-site-url";
import { siteLocales } from "../src/i18n/locales";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return siteLocales.flatMap((locale) =>
    canonicalPublicPaths.map((canonicalPath) => ({
      url: getAbsoluteLocalizedUrl(locale, canonicalPath),
      alternates: {
        languages: getAlternateLanguageUrls(canonicalPath),
      },
    })),
  );
}
