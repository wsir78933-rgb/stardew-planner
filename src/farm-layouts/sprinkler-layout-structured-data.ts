import type { PublicLocale } from "../i18n/public-locale";
import { getPublicPageCopy } from "../i18n/public-page-content";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import { createCollectionPageStructuredData } from "../seo/page-structured-data";
import { createCanonicalUrl } from "../seo/public-site-url";
import {
  getFarmLayoutsNavigationModel,
  readFarmLayoutsNavigationPage,
} from "./farm-layouts-navigation-model";
import {
  getSprinklerLayoutPageCopy,
  sprinklerLayoutCanonicalPath,
  type SprinklerLayoutCase,
  type SprinklerLayoutCover,
  type SprinklerLayoutPageCopy,
} from "./sprinkler-layout-content";

const expectedSprinklerLayoutCaseCount = 6;
const expectedSprinklerPreviewWidth = 1600;
const expectedSprinklerPreviewHeight = 1300;
const sprinklerLayoutCoverStem = "07-iridium-farm-patches-paths-scarecrows";
const expectedSprinklerLayoutCaseIds = [
  "01-basic-knights-move-staggered",
  "02-quality-3x3-grid",
  "03-iridium-5x5-grid",
  "04-scarecrow-radius-quality",
  "05-scarecrow-radius-iridium",
  "06-greenhouse-6-iridium-116",
] as const;

function sprinklerLayoutPreviewSrc(stem: string): string {
  return `/farm-layouts/sprinkler/images/${stem}.webp`;
}

function sprinklerLayoutFullSrc(stem: string): string {
  return `/farm-layouts/sprinkler/images/${stem}-full.webp`;
}

function sprinklerLayoutProjectHref(stem: string): string {
  return `/farm-layouts/sprinkler/projects/${stem}.json`;
}

function requireSprinklerPreviewSize(
  image: Pick<SprinklerLayoutCover, "imageWidth" | "imageHeight">,
  imageLabel: string,
  locale: PublicLocale,
): void {
  if (
    image.imageWidth !== expectedSprinklerPreviewWidth ||
    image.imageHeight !== expectedSprinklerPreviewHeight
  ) {
    throw new Error(
      `Sprinkler layout structured data ${imageLabel} for locale ${JSON.stringify(locale)} must be the ${expectedSprinklerPreviewWidth}x${expectedSprinklerPreviewHeight} preview. Received: ${JSON.stringify({ height: image.imageHeight, width: image.imageWidth })}.`,
    );
  }
}

function requireSprinklerLayoutCases(
  cases: readonly SprinklerLayoutCase[],
  locale: PublicLocale,
): void {
  const caseIds = cases.map((layoutCase) => layoutCase.id);
  if (
    caseIds.length !== expectedSprinklerLayoutCaseIds.length ||
    caseIds.some((caseId, index) => caseId !== expectedSprinklerLayoutCaseIds[index])
  ) {
    throw new Error(
      `Sprinkler layout structured data case IDs for locale ${JSON.stringify(locale)} must be ${JSON.stringify(expectedSprinklerLayoutCaseIds)}. Received: ${JSON.stringify(caseIds)}.`,
    );
  }

  for (const layoutCase of cases) {
    requireSprinklerPreviewSize(layoutCase, `case ${layoutCase.id}`, locale);
    const expectedPreviewSrc = sprinklerLayoutPreviewSrc(layoutCase.id);
    const expectedFullSrc = sprinklerLayoutFullSrc(layoutCase.id);
    const expectedProjectHref = sprinklerLayoutProjectHref(layoutCase.id);
    if (
      layoutCase.imageSrc !== expectedPreviewSrc ||
      layoutCase.imageOriginalSrc !== expectedFullSrc ||
      layoutCase.projectHref !== expectedProjectHref
    ) {
      throw new Error(
        `Sprinkler layout structured data case ${JSON.stringify(layoutCase.id)} for locale ${JSON.stringify(locale)} must use preview ${JSON.stringify(expectedPreviewSrc)}, full image ${JSON.stringify(expectedFullSrc)}, and project ${JSON.stringify(expectedProjectHref)}. Received: ${JSON.stringify({ imageOriginalSrc: layoutCase.imageOriginalSrc, imageSrc: layoutCase.imageSrc, projectHref: layoutCase.projectHref })}.`,
      );
    }
  }
}

function requireSprinklerLayoutCoverStaysIndependent(
  pageCopy: SprinklerLayoutPageCopy,
  locale: PublicLocale,
): void {
  requireSprinklerPreviewSize(pageCopy.cover, "cover", locale);
  const expectedPreviewSrc = sprinklerLayoutPreviewSrc(sprinklerLayoutCoverStem);
  const expectedFullSrc = sprinklerLayoutFullSrc(sprinklerLayoutCoverStem);
  if (
    pageCopy.cover.imageSrc !== expectedPreviewSrc ||
    pageCopy.cover.imageOriginalSrc !== expectedFullSrc
  ) {
    throw new Error(
      `Sprinkler layout structured data cover for locale ${JSON.stringify(locale)} must use ${JSON.stringify(sprinklerLayoutCoverStem)}. Received: ${JSON.stringify({ imageOriginalSrc: pageCopy.cover.imageOriginalSrc, imageSrc: pageCopy.cover.imageSrc })}.`,
    );
  }

  if (pageCopy.cases.length !== expectedSprinklerLayoutCaseCount) {
    throw new Error(
      `Sprinkler layout structured data requires exactly ${expectedSprinklerLayoutCaseCount} cases for locale ${JSON.stringify(locale)}. Received: ${pageCopy.cases.length}.`,
    );
  }

  for (const layoutCase of pageCopy.cases) {
    if (
      layoutCase.id === sprinklerLayoutCoverStem ||
      layoutCase.imageSrc === pageCopy.cover.imageSrc ||
      layoutCase.imageOriginalSrc === pageCopy.cover.imageOriginalSrc ||
      layoutCase.projectHref.includes(sprinklerLayoutCoverStem)
    ) {
      throw new Error(
        `Sprinkler layout cover ${sprinklerLayoutCoverStem} must stay out of the ItemList for locale ${JSON.stringify(locale)}. Received case: ${JSON.stringify({ id: layoutCase.id, imageOriginalSrc: layoutCase.imageOriginalSrc, imageSrc: layoutCase.imageSrc, projectHref: layoutCase.projectHref })}.`,
      );
    }
  }
}

function createSprinklerLayoutBreadcrumb(
  locale: PublicLocale,
  pathname: string,
): Record<string, unknown> {
  const navigationModel = getFarmLayoutsNavigationModel(locale);
  const plantingCategory = navigationModel.categories.find(
    (category) => category.id === "planting-layouts",
  );
  if (plantingCategory === undefined) {
    throw new Error(
      `Sprinkler layout breadcrumb is missing planting-layouts for locale ${JSON.stringify(locale)}. Received categories: ${JSON.stringify(navigationModel.categories.map((category) => category.id))}.`,
    );
  }

  const sprinklerNavigationPage = readFarmLayoutsNavigationPage(
    navigationModel,
    "planting-layouts",
    "sprinkler-layout",
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
        name: sprinklerNavigationPage.label,
        item: createCanonicalUrl(pathname),
      },
    ],
  };
}

export function createSprinklerLayoutPageStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getSprinklerLayoutPageCopy(locale);
  requireSprinklerLayoutCases(pageCopy.cases, locale);
  requireSprinklerLayoutCoverStaysIndependent(pageCopy, locale);

  const pathname = getLocalizedPublicPath(locale, sprinklerLayoutCanonicalPath);
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
    breadcrumb: createSprinklerLayoutBreadcrumb(locale, pathname),
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
