import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import { createCollectionPageStructuredData } from "../seo/page-structured-data";
import { createCanonicalUrl } from "../seo/public-site-url";
import {
  fishFarmCanonicalPath,
  getFeaturedFishFarmCase,
  getFishFarmPageCopy,
} from "./fish-farm-content";

const expectedFishFarmCaseCount = 6;

function requireSixFishFarmCases(caseCount: number, locale: PublicLocale): void {
  if (caseCount !== expectedFishFarmCaseCount) {
    throw new Error(
      `Fish Farm page structured data requires exactly ${expectedFishFarmCaseCount} cases for locale ${JSON.stringify(locale)}. Received: ${caseCount}.`,
    );
  }
}

export function createFishFarmPageStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getFishFarmPageCopy(locale);
  const featuredCase = getFeaturedFishFarmCase(locale);
  requireSixFishFarmCases(pageCopy.cases.length, locale);

  const pathname = getLocalizedPublicPath(locale, fishFarmCanonicalPath);
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
