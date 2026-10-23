import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import { createCollectionPageStructuredData } from "../seo/page-structured-data";
import { createCanonicalUrl } from "../seo/public-site-url";
import {
  getFeaturedGreenhouseLayoutCase,
  getGreenhouseLayoutPageCopy,
  greenhouseLayoutCanonicalPath,
} from "./greenhouse-layout-content";

const expectedGreenhouseLayoutCaseCount = 7;

function requireSevenGreenhouseLayoutCases(
  caseCount: number,
  locale: PublicLocale,
): void {
  if (caseCount !== expectedGreenhouseLayoutCaseCount) {
    throw new Error(
      `Greenhouse Layout structured data requires exactly ${expectedGreenhouseLayoutCaseCount} cases for locale ${JSON.stringify(locale)}. Received: ${caseCount}.`,
    );
  }
}

export function createGreenhouseLayoutPageStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getGreenhouseLayoutPageCopy(locale);
  const featuredCase = getFeaturedGreenhouseLayoutCase(locale);
  requireSevenGreenhouseLayoutCases(pageCopy.cases.length, locale);

  const pathname = getLocalizedPublicPath(locale, greenhouseLayoutCanonicalPath);
  const pageUrl = createCanonicalUrl(pathname);
  const collectionPage = createCollectionPageStructuredData({
    locale,
    name: pageCopy.title,
    description: pageCopy.description,
    pathname,
  });

  return {
    ...collectionPage,
    "@id": `${pageUrl}#collection`,
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: createCanonicalUrl(featuredCase.imageSrc),
      caption: featuredCase.imageAlt,
      width: featuredCase.imageWidth,
      height: featuredCase.imageHeight,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: pageCopy.cases.length,
      itemListElement: pageCopy.cases.map((layoutCase, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: layoutCase.title,
        description: layoutCase.summary,
        url: `${pageUrl}#${layoutCase.id}`,
      })),
    },
  };
}
