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
  getQualitySprinklerLayoutPageCopy,
  qualitySprinklerLayoutCanonicalPath,
  type QualitySprinklerLayoutCase,
  type QualitySprinklerLayoutCover,
  type QualitySprinklerLayoutPageCopy,
} from "./quality-sprinkler-layout-content";

const expectedQualitySprinklerPreviewWidth = 1600;
const expectedQualitySprinklerPreviewHeight = 1300;
const qualitySprinklerLayoutImageDirectory =
  "/farm-layouts/quality-sprinkler/images/";

function requireQualitySprinklerPreviewSize(
  image: Pick<QualitySprinklerLayoutCover, "imageWidth" | "imageHeight">,
  imageLabel: string,
  locale: PublicLocale,
): void {
  if (
    image.imageWidth !== expectedQualitySprinklerPreviewWidth ||
    image.imageHeight !== expectedQualitySprinklerPreviewHeight
  ) {
    throw new Error(
      `Quality sprinkler layout structured data ${imageLabel} for locale ${JSON.stringify(locale)} must use a ${expectedQualitySprinklerPreviewWidth}x${expectedQualitySprinklerPreviewHeight} preview. Received: ${JSON.stringify({ width: image.imageWidth, height: image.imageHeight })}.`,
    );
  }
}

function requireQualitySprinklerImagePath(
  imagePath: string,
  imageLabel: string,
  locale: PublicLocale,
): void {
  if (
    !imagePath.startsWith(qualitySprinklerLayoutImageDirectory) ||
    !imagePath.endsWith(".webp")
  ) {
    throw new Error(
      `Quality sprinkler layout structured data ${imageLabel} for locale ${JSON.stringify(locale)} must use a WebP image under ${JSON.stringify(qualitySprinklerLayoutImageDirectory)}. Received: ${JSON.stringify(imagePath)}.`,
    );
  }
}

function requireQualitySprinklerCases(
  cases: readonly QualitySprinklerLayoutCase[],
  locale: PublicLocale,
): void {
  if (cases.length === 0) {
    throw new Error(
      `Quality sprinkler layout structured data requires at least one case for locale ${JSON.stringify(locale)}. Received: ${JSON.stringify(cases)}.`,
    );
  }

  const seenCaseIds = new Set<string>();
  for (const layoutCase of cases) {
    if (seenCaseIds.has(layoutCase.id)) {
      throw new Error(
        `Quality sprinkler layout structured data contains duplicate case ID ${JSON.stringify(layoutCase.id)} for locale ${JSON.stringify(locale)}.`,
      );
    }
    seenCaseIds.add(layoutCase.id);

    requireQualitySprinklerPreviewSize(
      layoutCase,
      `case ${layoutCase.id}`,
      locale,
    );
    requireQualitySprinklerImagePath(
      layoutCase.imageSrc,
      `case ${layoutCase.id} preview`,
      locale,
    );
    requireQualitySprinklerImagePath(
      layoutCase.imageOriginalSrc,
      `case ${layoutCase.id} full image`,
      locale,
    );
    if (
      layoutCase.imageSrc === layoutCase.imageOriginalSrc ||
      !layoutCase.imageOriginalSrc.endsWith("-full.webp")
    ) {
      throw new Error(
        `Quality sprinkler layout case ${JSON.stringify(layoutCase.id)} for locale ${JSON.stringify(locale)} must use separate preview and full WebP images. Received: ${JSON.stringify({ imageSrc: layoutCase.imageSrc, imageOriginalSrc: layoutCase.imageOriginalSrc })}.`,
      );
    }
  }
}

function requireQualitySprinklerCoverStaysIndependent(
  pageCopy: QualitySprinklerLayoutPageCopy,
  locale: PublicLocale,
): void {
  requireQualitySprinklerPreviewSize(pageCopy.cover, "cover", locale);
  requireQualitySprinklerImagePath(
    pageCopy.cover.imageSrc,
    "cover preview",
    locale,
  );
  requireQualitySprinklerImagePath(
    pageCopy.cover.imageOriginalSrc,
    "cover full image",
    locale,
  );
  if (
    pageCopy.cover.imageSrc === pageCopy.cover.imageOriginalSrc ||
    !pageCopy.cover.imageOriginalSrc.endsWith("-full.webp")
  ) {
    throw new Error(
      `Quality sprinkler layout cover for locale ${JSON.stringify(locale)} must use separate preview and full WebP images. Received: ${JSON.stringify({ imageSrc: pageCopy.cover.imageSrc, imageOriginalSrc: pageCopy.cover.imageOriginalSrc })}.`,
    );
  }

  for (const layoutCase of pageCopy.cases) {
    if (
      layoutCase.id === "01-quality-3x3-grid" ||
      layoutCase.imageSrc === pageCopy.cover.imageSrc ||
      layoutCase.imageOriginalSrc === pageCopy.cover.imageOriginalSrc
    ) {
      throw new Error(
        `Quality sprinkler layout cover must remain separate from the case list for locale ${JSON.stringify(locale)}. Received: ${JSON.stringify({ coverImageSrc: pageCopy.cover.imageSrc, caseId: layoutCase.id, caseImageSrc: layoutCase.imageSrc })}.`,
      );
    }
  }
}

function createQualitySprinklerLayoutBreadcrumb(
  locale: PublicLocale,
  pathname: string,
): Record<string, unknown> {
  const navigationModel = getFarmLayoutsNavigationModel(locale);
  const plantingCategory = readFarmLayoutsNavigationCategory(
    navigationModel,
    "planting-layouts",
  );
  const qualitySprinklerPage = readFarmLayoutsNavigationPage(
    navigationModel,
    "planting-layouts",
    "quality-sprinkler-layout",
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
        name: qualitySprinklerPage.label,
        item: createCanonicalUrl(pathname),
      },
    ],
  };
}

export function createQualitySprinklerLayoutPageStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getQualitySprinklerLayoutPageCopy(locale);
  requireQualitySprinklerCases(pageCopy.cases, locale);
  requireQualitySprinklerCoverStaysIndependent(pageCopy, locale);

  const pathname = getLocalizedPublicPath(
    locale,
    qualitySprinklerLayoutCanonicalPath,
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
    breadcrumb: createQualitySprinklerLayoutBreadcrumb(locale, pathname),
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
