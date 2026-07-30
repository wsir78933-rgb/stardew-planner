import type { Metadata } from "next";
import {
  getAbsoluteLocalizedUrl,
  getAlternateLanguageUrls,
  getOpenGraphLocale,
} from "./public-site-url";
import type { SiteLocale } from "./locales";
import { formatTranslation, translate } from "./messages";

export type PageMetadataInput = {
  locale: SiteLocale;
  canonicalPath: string;
  titleKey: string;
  descriptionKey: string;
};

type ResolvedPageMetadataInput = {
  locale: SiteLocale;
  canonicalPath: string;
  title: string;
  description: string;
};

export function createPageMetadata(input: PageMetadataInput): Metadata {
  const title = translate(input.locale, input.titleKey);
  const description = translate(input.locale, input.descriptionKey);

  assertResolvedMetadataValue(title, input.titleKey);
  assertResolvedMetadataValue(description, input.descriptionKey);

  return createResolvedPageMetadata({
    locale: input.locale,
    canonicalPath: input.canonicalPath,
    title,
    description,
  });
}

export function createFarmGuidePageMetadata(
  locale: SiteLocale,
  canonicalPath: string,
  farmName: string,
): Metadata {
  const titleKey = "seo.farmGuide.title";
  const descriptionKey = "seo.farmGuide.description";
  const title = formatTranslation(locale, titleKey, { farmName });
  const description = formatTranslation(locale, descriptionKey, { farmName });

  assertResolvedMetadataValue(title, titleKey);
  assertResolvedMetadataValue(description, descriptionKey);

  return createResolvedPageMetadata({
    locale,
    canonicalPath,
    title,
    description,
  });
}

function createResolvedPageMetadata(
  input: ResolvedPageMetadataInput,
): Metadata {
  assertMetadataCanonicalPath(input.canonicalPath);

  const canonicalUrl = getAbsoluteLocalizedUrl(
    input.locale,
    input.canonicalPath,
  );
  const alternateUrls = getAlternateLanguageUrls(input.canonicalPath);
  const siteTitle = translate("en", "site.title");

  return {
    title: input.title,
    description: input.description,
    applicationName: translate(input.locale, "site.title"),
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: alternateUrls,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: input.title,
      description: input.description,
      siteName: siteTitle,
      locale: getOpenGraphLocale(input.locale),
    },
    twitter: {
      card: "summary",
      title: input.title,
      description: input.description,
    },
  };
}

function assertMetadataCanonicalPath(canonicalPath: string): void {
  if (canonicalPath.includes("?") || canonicalPath.includes("#")) {
    throw new Error(
      `canonical path "${canonicalPath}" must not contain "?" or "#"`,
    );
  }
}

function assertResolvedMetadataValue(
  resolvedValue: string,
  messageKey: string,
): void {
  if (!resolvedValue.includes("{farmName}")) {
    return;
  }

  throw new Error(
    `metadata message key "${messageKey}" resolved to "${resolvedValue}" with unresolved "{farmName}" placeholder`,
  );
}
