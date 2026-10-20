import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import {
  createCollectionPageStructuredData,
} from "../seo/page-structured-data";
import { createCanonicalUrl } from "../seo/public-site-url";
import {
  beachFarmCanonicalPath,
  getBeachFarmPageCopy,
} from "./beach-farm-content";

export function createBeachFarmPageStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getBeachFarmPageCopy(locale);
  const featuredCase = pageCopy.cases[0];

  if (featuredCase === undefined) {
    throw new Error(
      `Beach Farm page structured data requires at least one visible case for locale ${JSON.stringify(locale)}; received ${pageCopy.cases.length} cases.`,
    );
  }

  const pathname = getLocalizedPublicPath(locale, beachFarmCanonicalPath);
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
