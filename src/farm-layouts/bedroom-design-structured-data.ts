import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import { createCollectionPageStructuredData } from "../seo/page-structured-data";
import { createCanonicalUrl } from "../seo/public-site-url";
import {
  bedroomDesignCanonicalPath,
  getBedroomDesignPageCopy,
  getFeaturedBedroomDesignCase,
} from "./bedroom-design-content";

const expectedBedroomDesignCaseCount = 6;

function requireSixBedroomDesignCases(
  caseCount: number,
  locale: PublicLocale,
): void {
  if (caseCount !== expectedBedroomDesignCaseCount) {
    throw new Error(
      `Bedroom Design structured data requires exactly ${expectedBedroomDesignCaseCount} cases for locale ${JSON.stringify(locale)}. Received: ${caseCount}.`,
    );
  }
}

export function createBedroomDesignPageStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getBedroomDesignPageCopy(locale);
  const featuredCase = getFeaturedBedroomDesignCase(locale);
  requireSixBedroomDesignCases(pageCopy.cases.length, locale);

  const pathname = getLocalizedPublicPath(locale, bedroomDesignCanonicalPath);
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
      itemListElement: pageCopy.cases.map((bedroomCase, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: bedroomCase.title,
        description: bedroomCase.summary,
        url: `${pageUrl}#${bedroomCase.id}`,
      })),
    },
  };
}
