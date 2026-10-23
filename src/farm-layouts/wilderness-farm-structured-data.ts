import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import { createCollectionPageStructuredData } from "../seo/page-structured-data";
import { createCanonicalUrl } from "../seo/public-site-url";
import {
  getFeaturedWildernessFarmCase,
  getWildernessFarmPageCopy,
  wildernessFarmCanonicalPath,
} from "./wilderness-farm-content";

const expectedWildernessFarmCaseCount = 7;

function requireSevenWildernessFarmCases(
  caseCount: number,
  locale: PublicLocale,
): void {
  if (caseCount !== expectedWildernessFarmCaseCount) {
    throw new Error(
      `Wilderness Farm structured data requires exactly ${expectedWildernessFarmCaseCount} cases for locale ${JSON.stringify(locale)}. Received: ${caseCount}.`,
    );
  }
}

export function createWildernessFarmPageStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getWildernessFarmPageCopy(locale);
  const featuredCase = getFeaturedWildernessFarmCase(locale);
  requireSevenWildernessFarmCases(pageCopy.cases.length, locale);

  const pathname = getLocalizedPublicPath(locale, wildernessFarmCanonicalPath);
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
