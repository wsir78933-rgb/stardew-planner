import type { PublicLocale } from "../i18n/public-locale";
import { createCanonicalUrl, publicSiteUrl } from "./public-site-url";

type StructuredData = Readonly<Record<string, unknown>>;

const publicWebsiteId = `${publicSiteUrl.toString()}#website`;

export type WebApplicationStructuredDataInput = Readonly<{
  locale: PublicLocale;
  name: string;
  description: string;
  pathname: string;
}>;

export type ArticleStructuredDataInput = Readonly<{
  locale: PublicLocale;
  headline: string;
  description: string;
  pathname: string;
  imagePathname?: string;
}>;

export type CollectionPageStructuredDataInput = Readonly<{
  locale: PublicLocale;
  name: string;
  description: string;
  pathname: string;
}>;

export type BreadcrumbListItemInput = Readonly<{
  name: string;
  pathname: string;
}>;

export type BreadcrumbListStructuredDataInput = Readonly<{
  items: readonly BreadcrumbListItemInput[];
}>;

export function serializeJsonLd(structuredData: Record<string, unknown>): string {
  return JSON.stringify(structuredData).replaceAll("<", "\\u003c");
}

function createLocalizedCreativeWorkFields(locale: PublicLocale) {
  return {
    inLanguage: locale,
    isPartOf: { "@id": publicWebsiteId },
  } as const;
}

export function createWebSiteStructuredData(): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": publicWebsiteId,
    name: "Stardew Valley Planner",
    url: createCanonicalUrl("/"),
    inLanguage: ["en", "zh-CN"],
  };
}

export function createWebApplicationStructuredData(
  input: WebApplicationStructuredDataInput,
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${createCanonicalUrl(input.pathname)}#webapplication`,
    name: input.name,
    description: input.description,
    url: createCanonicalUrl(input.pathname),
    ...createLocalizedCreativeWorkFields(input.locale),
    isAccessibleForFree: true,
    browserRequirements: "Requires a modern web browser with JavaScript enabled.",
  };
}

export function createArticleStructuredData(
  input: ArticleStructuredDataInput,
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: createCanonicalUrl(input.pathname),
    ...createLocalizedCreativeWorkFields(input.locale),
    ...(input.imagePathname === undefined
      ? {}
      : { image: createCanonicalUrl(input.imagePathname) }),
  };
}

export function createCollectionPageStructuredData(
  input: CollectionPageStructuredDataInput,
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: createCanonicalUrl(input.pathname),
    ...createLocalizedCreativeWorkFields(input.locale),
  };
}

export function createBreadcrumbListStructuredData(
  input: BreadcrumbListStructuredDataInput,
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: createCanonicalUrl(item.pathname),
    })),
  };
}
