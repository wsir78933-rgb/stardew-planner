import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import { createCollectionPageStructuredData } from "../seo/page-structured-data";
import { createCanonicalUrl } from "../seo/public-site-url";
import {
  frontierFarmCanonicalPath,
  getFrontierFarmPageCopy,
} from "./frontier-farm-content";

const expectedFrontierFarmCaseCount = 6;
const expectedFrontierCoverWidth = 1920;
const expectedFrontierCoverHeight = 800;

export function createFrontierFarmStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getFrontierFarmPageCopy(locale);

  if (pageCopy.cases.length !== expectedFrontierFarmCaseCount) {
    throw new Error(
      `Frontier Farm structured data requires exactly ${expectedFrontierFarmCaseCount} visible cases for locale ${JSON.stringify(locale)}. Received: ${pageCopy.cases.length}.`,
    );
  }

  if (
    pageCopy.cover.imageWidth !== expectedFrontierCoverWidth ||
    pageCopy.cover.imageHeight !== expectedFrontierCoverHeight
  ) {
    throw new Error(
      `Frontier Farm structured data cover for locale ${JSON.stringify(locale)} must be ${expectedFrontierCoverWidth}x${expectedFrontierCoverHeight}. Received: ${JSON.stringify({ width: pageCopy.cover.imageWidth, height: pageCopy.cover.imageHeight })}.`,
    );
  }

  const pathname = getLocalizedPublicPath(locale, frontierFarmCanonicalPath);
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
      contentUrl: createCanonicalUrl(pageCopy.cover.imageSrc),
      caption: pageCopy.cover.imageAlt,
      width: pageCopy.cover.imageWidth,
      height: pageCopy.cover.imageHeight,
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
