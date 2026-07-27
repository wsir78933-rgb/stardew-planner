import type { Metadata } from "next";
import { assertCanonicalPublicPath } from "./canonical-public-routes";
import { getLocalizedPath } from "./localized-path";
import type { SiteLocale } from "./locales";
import { formatTranslation, translate } from "./messages";

const siteOrigin = "https://stardewvalleyplanner.art";

export type PageMetadataInput = {
  locale: SiteLocale;
  canonicalPath: string;
  titleKey: string;
  descriptionKey: string;
};

export function createPageMetadata(input: PageMetadataInput): Metadata {
  assertMetadataCanonicalPath(input.canonicalPath);

  const canonicalUrl = toAbsoluteSiteUrl(
    getLocalizedPath(input.locale, input.canonicalPath),
  );
  const title = translate(input.locale, input.titleKey);
  const description = translate(input.locale, input.descriptionKey);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: getAlternateUrls(input.canonicalPath),
    },
    openGraph: {
      url: canonicalUrl,
      title,
    },
  };
}

export function createFarmGuidePageMetadata(
  locale: SiteLocale,
  canonicalPath: string,
  farmName: string,
): Metadata {
  const baseMetadata = createPageMetadata({
    locale,
    canonicalPath,
    titleKey: "seo.farmGuide.title",
    descriptionKey: "seo.farmGuide.description",
  });
  const title = formatTranslation(locale, "seo.farmGuide.title", { farmName });
  const description = formatTranslation(locale, "seo.farmGuide.description", {
    farmName,
  });

  return {
    ...baseMetadata,
    title,
    description,
    openGraph: {
      title,
      url: baseMetadata.openGraph?.url,
    },
  };
}

function assertMetadataCanonicalPath(canonicalPath: string): void {
  if (canonicalPath.includes("?") || canonicalPath.includes("#")) {
    throw new Error(
      `canonical path "${canonicalPath}" must not contain "?" or "#"`,
    );
  }

  assertCanonicalPublicPath(canonicalPath);
}

function getAlternateUrls(canonicalPath: string) {
  const englishUrl = toAbsoluteSiteUrl(getLocalizedPath("en", canonicalPath));
  const chineseUrl = toAbsoluteSiteUrl(
    getLocalizedPath("zh-CN", canonicalPath),
  );

  return {
    en: englishUrl,
    "zh-CN": chineseUrl,
    "x-default": englishUrl,
  };
}

function toAbsoluteSiteUrl(path: string): string {
  return `${siteOrigin}${path}`;
}
