import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import { createCollectionPageStructuredData } from "../seo/page-structured-data";
import { createCanonicalUrl } from "../seo/public-site-url";
import {
  getMeadowlandsFarmPageCopy,
  meadowlandsFarmCanonicalPath,
} from "./meadowlands-farm-content";

export function createMeadowlandsFarmStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getMeadowlandsFarmPageCopy(locale);

  if (pageCopy.cases.length !== 10) {
    throw new Error(
      `Meadowlands Farm structured data requires exactly 10 visible cases for locale ${JSON.stringify(locale)}. Received ${pageCopy.cases.length}.`,
    );
  }

  const featuredCase = pageCopy.cases[0];
  if (featuredCase === undefined) {
    throw new Error(
      `Meadowlands Farm structured data requires a visible lead image for locale ${JSON.stringify(locale)}. Received no cases.`,
    );
  }

  const pathname = getLocalizedPublicPath(locale, meadowlandsFarmCanonicalPath);
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
