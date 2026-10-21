import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import { createCollectionPageStructuredData } from "../seo/page-structured-data";
import { createCanonicalUrl } from "../seo/public-site-url";
import {
  fourCornersFarmCanonicalPath,
  getFourCornersFarmPageCopy,
} from "./four-corners-farm-content";

const expectedFourCornersCaseCount = 7;
const expectedLeadImageWidth = 1600;
const expectedLeadImageHeight = 1600;

export function createFourCornersFarmStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getFourCornersFarmPageCopy(locale);

  if (pageCopy.cases.length !== expectedFourCornersCaseCount) {
    throw new Error(
      `Four Corners Farm structured data requires exactly ${expectedFourCornersCaseCount} visible cases for locale ${JSON.stringify(locale)}. Received: ${pageCopy.cases.length}.`,
    );
  }

  const featuredCase = pageCopy.cases[0];
  if (featuredCase === undefined) {
    throw new Error(
      `Four Corners Farm structured data requires a visible lead image for locale ${JSON.stringify(locale)}. Received no cases.`,
    );
  }

  if (
    featuredCase.imageWidth !== expectedLeadImageWidth ||
    featuredCase.imageHeight !== expectedLeadImageHeight
  ) {
    throw new Error(
      `Four Corners Farm lead image for locale ${JSON.stringify(locale)} must be ${expectedLeadImageWidth}x${expectedLeadImageHeight}. Received: ${JSON.stringify({ width: featuredCase.imageWidth, height: featuredCase.imageHeight })}.`,
    );
  }

  const pathname = getLocalizedPublicPath(locale, fourCornersFarmCanonicalPath);
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
