import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import { createCollectionPageStructuredData } from "../seo/page-structured-data";
import { createCanonicalUrl } from "../seo/public-site-url";
import {
  expandedFarmCanonicalPath,
  getExpandedFarmPageCopy,
  getFeaturedExpandedFarmCase,
} from "./expanded-farm-content";

const expectedExpandedFarmCaseCount = 7;

function requireSevenExpandedFarmCases(
  caseCount: number,
  locale: PublicLocale,
): void {
  if (caseCount !== expectedExpandedFarmCaseCount) {
    throw new Error(
      `Expanded Farm structured data requires exactly ${expectedExpandedFarmCaseCount} cases for locale ${JSON.stringify(locale)}. Received: ${caseCount}.`,
    );
  }
}

export function createExpandedFarmPageStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getExpandedFarmPageCopy(locale);
  const featuredCase = getFeaturedExpandedFarmCase(locale);
  requireSevenExpandedFarmCases(pageCopy.cases.length, locale);

  const pathname = getLocalizedPublicPath(locale, expandedFarmCanonicalPath);
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
