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
  getIridiumSprinklerLayoutPageCopy,
  iridiumSprinklerLayoutCanonicalPath,
} from "./iridium-sprinkler-layout-content";

function createIridiumSprinklerLayoutBreadcrumb(
  locale: PublicLocale,
  pathname: string,
): Record<string, unknown> {
  const navigationModel = getFarmLayoutsNavigationModel(locale);
  const plantingCategory = readFarmLayoutsNavigationCategory(
    navigationModel,
    "planting-layouts",
  );
  const iridiumSprinklerNavigationPage = readFarmLayoutsNavigationPage(
    navigationModel,
    "planting-layouts",
    "iridium-sprinkler-layout",
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
        name: plantingCategory.label,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: iridiumSprinklerNavigationPage.label,
        item: createCanonicalUrl(pathname),
      },
    ],
  };
}

export function createIridiumSprinklerLayoutPageStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getIridiumSprinklerLayoutPageCopy(locale);
  const pathname = getLocalizedPublicPath(
    locale,
    iridiumSprinklerLayoutCanonicalPath,
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
    breadcrumb: createIridiumSprinklerLayoutBreadcrumb(locale, pathname),
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
        url: `${pageUrl}#${layoutCase.id}`,
      })),
    },
  };
}
