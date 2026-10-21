import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import { createCollectionPageStructuredData } from "../seo/page-structured-data";
import { createCanonicalUrl } from "../seo/public-site-url";
import {
  getFeaturedHilltopFarmCase,
  getHilltopFarmPageCopy,
  hilltopFarmCanonicalPath,
} from "./hilltop-farm-content";

const expectedHilltopFarmCaseCount = 7;

function requireSevenHilltopFarmCases(
  caseCount: number,
  locale: PublicLocale,
): void {
  if (caseCount !== expectedHilltopFarmCaseCount) {
    throw new Error(
      `Hilltop Farm structured data requires exactly ${expectedHilltopFarmCaseCount} cases for locale ${JSON.stringify(locale)}. Received: ${caseCount}.`,
    );
  }
}

export function createHilltopFarmPageStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getHilltopFarmPageCopy(locale);
  const featuredCase = getFeaturedHilltopFarmCase(locale);
  requireSevenHilltopFarmCases(pageCopy.cases.length, locale);

  const pathname = getLocalizedPublicPath(locale, hilltopFarmCanonicalPath);
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
      itemListElement: pageCopy.cases.map((farmCase, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: farmCase.title,
        description: farmCase.summary,
        url: `${pageUrl}#${farmCase.id}`,
      })),
    },
  };
}
