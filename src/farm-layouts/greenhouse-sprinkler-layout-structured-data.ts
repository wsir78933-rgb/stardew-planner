import type { PublicLocale } from "../i18n/public-locale";
import { getPublicPageCopy } from "../i18n/public-page-content";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import { createCollectionPageStructuredData } from "../seo/page-structured-data";
import { createCanonicalUrl } from "../seo/public-site-url";
import {
  getFarmLayoutsNavigationModel,
  readFarmLayoutsNavigationCategory,
  readFarmLayoutsNavigationPage,
} from "./farm-layouts-navigation-model";
import {
  getGreenhouseSprinklerLayoutPageCopy,
  greenhouseSprinklerLayoutCanonicalPath,
  type GreenhouseSprinklerLayoutCase,
} from "./greenhouse-sprinkler-layout-content";

const expectedGreenhouseSprinklerLayoutCaseCount = 6;

function requireGreenhouseSprinklerLayoutCases(
  cases: readonly GreenhouseSprinklerLayoutCase[],
  locale: PublicLocale,
): void {
  if (cases.length !== expectedGreenhouseSprinklerLayoutCaseCount) {
    throw new Error(
      `Greenhouse sprinkler layout requires exactly ${expectedGreenhouseSprinklerLayoutCaseCount} cases for locale ${JSON.stringify(locale)}. Received ${JSON.stringify(cases.map(({ id }) => id))}.`,
    );
  }

  const seenCaseIds = new Set<string>();
  for (const layoutCase of cases) {
    if (seenCaseIds.has(layoutCase.id)) {
      throw new Error(
        `Greenhouse sprinkler layout contains duplicate case ID ${JSON.stringify(layoutCase.id)} for locale ${JSON.stringify(locale)}.`,
      );
    }
    seenCaseIds.add(layoutCase.id);
  }
}

function createGreenhouseSprinklerLayoutBreadcrumb(
  locale: PublicLocale,
  pathname: string,
): Record<string, unknown> {
  const navigationModel = getFarmLayoutsNavigationModel(locale);
  const greenhouseCategory = readFarmLayoutsNavigationCategory(
    navigationModel,
    "greenhouse-layouts",
  );
  const greenhouseSprinklerPage = readFarmLayoutsNavigationPage(
    navigationModel,
    "greenhouse-layouts",
    "greenhouse-sprinkler-layout",
  );
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
        name: navigationModel.triggerLabel,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: greenhouseCategory.label,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: greenhouseSprinklerPage.label,
        item: createCanonicalUrl(pathname),
      },
    ],
  };
}

export function createGreenhouseSprinklerLayoutPageStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getGreenhouseSprinklerLayoutPageCopy(locale);
  requireGreenhouseSprinklerLayoutCases(pageCopy.cases, locale);

  const pathname = getLocalizedPublicPath(
    locale,
    greenhouseSprinklerLayoutCanonicalPath,
  );
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
    breadcrumb: createGreenhouseSprinklerLayoutBreadcrumb(locale, pathname),
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
      itemListElement: pageCopy.cases.map((layoutCase, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: layoutCase.title,
        description: layoutCase.summary,
        url: `${pageUrl}#greenhouse-sprinkler-layout-${layoutCase.id}`,
      })),
    },
  };
}
