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
  fruitTreeLayoutCanonicalPath,
  getFruitTreeLayoutPageCopy,
} from "./fruit-tree-layout-content";

function createFruitTreeLayoutBreadcrumb(
  locale: PublicLocale,
  pathname: string,
): Record<string, unknown> {
  const navigationModel = getFarmLayoutsNavigationModel(locale);
  const plantingCategory = readFarmLayoutsNavigationCategory(
    navigationModel,
    "planting-layouts",
  );
  const fruitTreeNavigationPage = readFarmLayoutsNavigationPage(
    navigationModel,
    "planting-layouts",
    "fruit-tree-layout",
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
        name: fruitTreeNavigationPage.label,
        item: createCanonicalUrl(pathname),
      },
    ],
  };
}

export function createFruitTreeLayoutPageStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getFruitTreeLayoutPageCopy(locale);
  const pathname = getLocalizedPublicPath(locale, fruitTreeLayoutCanonicalPath);
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
    breadcrumb: createFruitTreeLayoutBreadcrumb(locale, pathname),
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
