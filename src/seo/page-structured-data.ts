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
    inLanguage: ["en", "zh-CN", "ja", "ru"],
  };
}

export function createJapaneseHomepageWebApplicationStructuredData(
  input: Readonly<{
    name: string;
    description: string;
    pathname: string;
  }>,
): StructuredData {
  if (input.pathname !== "/ja") {
    throw new Error(
      `Japanese homepage structured data pathname must be "/ja". Received: ${JSON.stringify(input.pathname)}.`,
    );
  }
  if (input.name.trim().length === 0) {
    throw new Error(
      `Japanese homepage structured data name must be a non-empty string. Received: ${JSON.stringify(input.name)}.`,
    );
  }
  if (input.description.trim().length === 0) {
    throw new Error(
      `Japanese homepage structured data description must be a non-empty string. Received: ${JSON.stringify(input.description)}.`,
    );
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${createCanonicalUrl(input.pathname)}#webapplication`,
    name: input.name,
    description: input.description,
    url: createCanonicalUrl(input.pathname),
    inLanguage: "ja",
    isPartOf: { "@id": publicWebsiteId },
    isAccessibleForFree: true,
    browserRequirements: "Requires a modern web browser with JavaScript enabled.",
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

export function createRussianHomepageWebApplicationStructuredData(
  input: Readonly<{
    name: string;
    description: string;
  }>,
): StructuredData {
  if (input.name.trim().length === 0) {
    throw new Error(
      `Russian homepage structured data name must be a non-empty string. Received: ${JSON.stringify(input.name)}.`,
    );
  }
  if (input.description.trim().length === 0) {
    throw new Error(
      `Russian homepage structured data description must be a non-empty string. Received: ${JSON.stringify(input.description)}.`,
    );
  }

  const pathname = "/ru";
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${createCanonicalUrl(pathname)}#webapplication`,
    name: input.name,
    description: input.description,
    url: createCanonicalUrl(pathname),
    inLanguage: "ru",
    isPartOf: { "@id": publicWebsiteId },
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

function assertNonEmptyWebPageText(
  fieldName: "name" | "description" | "pathname",
  fieldValue: string,
): void {
  if (fieldValue.trim().length === 0) {
    throw new Error(
      `Web page structured data ${fieldName} must be a non-empty string. Received: ${JSON.stringify(fieldValue)}.`,
    );
  }
}

function assertWebPageStructuredDataInput(input: CollectionPageStructuredDataInput): void {
  assertNonEmptyWebPageText("name", input.name);
  assertNonEmptyWebPageText("description", input.description);
  assertNonEmptyWebPageText("pathname", input.pathname);
}

function buildWebPageStructuredData(input: CollectionPageStructuredDataInput): StructuredData {
  const pageUrl = createCanonicalUrl(input.pathname);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: input.name,
    description: input.description,
    url: pageUrl,
    ...createLocalizedCreativeWorkFields(input.locale),
  };
}

export function createWebPageStructuredData(
  input: CollectionPageStructuredDataInput,
): StructuredData {
  assertWebPageStructuredDataInput(input);
  return buildWebPageStructuredData(input);
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
