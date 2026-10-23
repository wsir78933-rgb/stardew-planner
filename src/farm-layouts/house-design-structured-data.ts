import type { PublicLocale } from "../i18n/public-locale";
import { getPublicPageCopy } from "../i18n/public-page-content";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import { createCollectionPageStructuredData } from "../seo/page-structured-data";
import { createCanonicalUrl } from "../seo/public-site-url";
import {
  getHouseDesignPageCopy,
  houseDesignCanonicalPath,
  type HouseDesignCase,
} from "./house-design-content";

const expectedHouseDesignCaseCount = 6;

function requireHouseDesignCases(
  cases: readonly HouseDesignCase[],
  locale: PublicLocale,
): void {
  if (cases.length !== expectedHouseDesignCaseCount) {
    throw new Error(
      `House Design requires exactly ${expectedHouseDesignCaseCount} cases for locale ${JSON.stringify(locale)}. Received ${JSON.stringify(cases.map(({ id }) => id))}.`,
    );
  }

  const seenCaseIds = new Set<string>();
  for (const houseDesignCase of cases) {
    if (seenCaseIds.has(houseDesignCase.id)) {
      throw new Error(
        `House Design contains duplicate case ID ${JSON.stringify(houseDesignCase.id)} for locale ${JSON.stringify(locale)}.`,
      );
    }
    seenCaseIds.add(houseDesignCase.id);
  }
}

function createHouseDesignBreadcrumb(
  locale: PublicLocale,
  pathname: string,
): Record<string, unknown> {
  const homePathname = getLocalizedPublicPath(locale, "/");

  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: getPublicPageCopy(locale).footer.brandName,
        item: createCanonicalUrl(homePathname),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "zh-CN" ? "房屋设计" : "House Design",
        item: createCanonicalUrl(pathname),
      },
    ],
  };
}

export function createHouseDesignPageStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getHouseDesignPageCopy(locale);
  requireHouseDesignCases(pageCopy.cases, locale);

  const pathname = getLocalizedPublicPath(locale, houseDesignCanonicalPath);
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
    breadcrumb: createHouseDesignBreadcrumb(locale, pathname),
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
      itemListElement: pageCopy.cases.map((houseDesignCase, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: houseDesignCase.title,
        description: houseDesignCase.summary,
        url: `${pageUrl}#house-design-${houseDesignCase.id}`,
      })),
    },
  };
}
