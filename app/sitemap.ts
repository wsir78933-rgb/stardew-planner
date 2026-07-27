import type { MetadataRoute } from "next";
import { canonicalPublicPaths } from "../src/i18n/canonical-public-routes";
import { getLocalizedPath } from "../src/i18n/localized-path";
import { siteLocales, type SiteLocale } from "../src/i18n/locales";

const siteOrigin = "https://stardewvalleyplanner.art";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return siteLocales.flatMap((locale) =>
    canonicalPublicPaths.map((canonicalPath) => ({
      url: toAbsoluteUrl(locale, canonicalPath),
      alternates: {
        languages: {
          en: toAbsoluteUrl("en", canonicalPath),
          "zh-CN": toAbsoluteUrl("zh-CN", canonicalPath),
          "x-default": toAbsoluteUrl("en", canonicalPath),
        },
      },
    })),
  );
}

function toAbsoluteUrl(locale: SiteLocale, canonicalPath: string): string {
  return `${siteOrigin}${getLocalizedPath(locale, canonicalPath)}`;
}
