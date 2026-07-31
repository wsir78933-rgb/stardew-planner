import { createCanonicalUrl } from "./public-site-url";

type StructuredData = Readonly<Record<string, unknown>>;

export type WebApplicationStructuredDataInput = Readonly<{
  name: string;
  description: string;
  pathname: string;
}>;

export type ArticleStructuredDataInput = Readonly<{
  headline: string;
  description: string;
  pathname: string;
}>;

export type CollectionPageStructuredDataInput = Readonly<{
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

export function createWebApplicationStructuredData(
  input: WebApplicationStructuredDataInput,
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    description: input.description,
    url: createCanonicalUrl(input.pathname),
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
