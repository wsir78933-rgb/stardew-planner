import { assertCanonicalPublicPath } from "./canonical-public-routes";
import { assertSiteLocale, type SiteLocale } from "./locales";
import { formatTranslation, translate } from "./messages";
import { getAbsoluteLocalizedUrl } from "./public-site-url";

export type LocalizedPageStructuredDataInput = Readonly<{
  locale: SiteLocale;
  canonicalPath: string;
  titleKey: string;
  descriptionKey: string;
}>;

export type FarmGuideArticleStructuredDataInput = Readonly<{
  locale: SiteLocale;
  canonicalPath: string;
  farmName: string;
}>;

type ResolvedPageStructuredData = Readonly<{
  locale: SiteLocale;
  title: string;
  description: string;
  url: string;
}>;

export function createPlannerWebApplicationStructuredData(
  input: LocalizedPageStructuredDataInput,
): Record<string, string> {
  const resolvedPageStructuredData = resolvePageStructuredData(input);

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: resolvedPageStructuredData.title,
    description: resolvedPageStructuredData.description,
    url: resolvedPageStructuredData.url,
    inLanguage: resolvedPageStructuredData.locale,
  };
}

export function createCollectionPageStructuredData(
  input: LocalizedPageStructuredDataInput,
): Record<string, string> {
  const resolvedPageStructuredData = resolvePageStructuredData(input);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: resolvedPageStructuredData.title,
    description: resolvedPageStructuredData.description,
    url: resolvedPageStructuredData.url,
    inLanguage: resolvedPageStructuredData.locale,
  };
}

export function createFarmGuideArticleStructuredData(
  input: FarmGuideArticleStructuredDataInput,
): Record<string, string> {
  assertSiteLocale(input.locale);
  assertCanonicalPublicPath(input.canonicalPath);

  const titleKey = "seo.farmGuide.title";
  const descriptionKey = "seo.farmGuide.description";
  const headline = formatTranslation(input.locale, titleKey, {
    farmName: input.farmName,
  });
  const description = formatTranslation(input.locale, descriptionKey, {
    farmName: input.farmName,
  });

  assertResolvedStructuredDataValue(headline, titleKey);
  assertResolvedStructuredDataValue(description, descriptionKey);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: getAbsoluteLocalizedUrl(input.locale, input.canonicalPath),
    inLanguage: input.locale,
  };
}

function resolvePageStructuredData(
  input: LocalizedPageStructuredDataInput,
): ResolvedPageStructuredData {
  assertSiteLocale(input.locale);
  assertCanonicalPublicPath(input.canonicalPath);

  const title = translate(input.locale, input.titleKey);
  const description = translate(input.locale, input.descriptionKey);

  return {
    locale: input.locale,
    title,
    description,
    url: getAbsoluteLocalizedUrl(input.locale, input.canonicalPath),
  };
}

function assertResolvedStructuredDataValue(
  resolvedValue: string,
  messageKey: string,
): void {
  if (!resolvedValue.includes("{farmName}")) {
    return;
  }

  throw new Error(
    `structured-data message key "${messageKey}" resolved to "${resolvedValue}" with unresolved "{farmName}" placeholder`,
  );
}
