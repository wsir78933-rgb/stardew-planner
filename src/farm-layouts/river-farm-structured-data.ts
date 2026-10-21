import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import { createCollectionPageStructuredData } from "../seo/page-structured-data";
import { createCanonicalUrl } from "../seo/public-site-url";
import {
  riverFarmCanonicalPath,
  getRiverFarmPageCopy,
  type RiverFarmCase,
  type RiverFarmCover,
  type RiverFarmPageCopy,
} from "./river-farm-content";

const expectedRiverFarmCaseCount = 7;
const expectedRiverPreviewWidth = 1600;
const expectedRiverPreviewHeight = 1300;
const riverFarmCoverPreviewSrc =
  "/farm-layouts/river/images/stardew-valley-river-farm-layout-01-namsai-summer-island-specialization.webp";
const riverFarmCoverFullSrc =
  "/farm-layouts/river/images/stardew-valley-river-farm-layout-01-namsai-summer-island-specialization-full.webp";
const expectedRiverFarmCaseIds = [
  "01-namsai-summer-island-specialization",
  "02-spring-perfection-island-zones",
  "03-y6-fall-perfection-pumpkin-hub",
  "04-stardewplan-beauty-trellis",
  "05-y6-fall-rustic-shed-village",
  "06-y12-summer-ranch-center",
  "07-y5-fall-purple-paint-town",
] as const;

function requireSevenRiverFarmCases(
  cases: readonly RiverFarmCase[],
  locale: PublicLocale,
): void {
  if (cases.length !== expectedRiverFarmCaseCount) {
    throw new Error(
      `River Farm structured data requires exactly ${expectedRiverFarmCaseCount} cases for locale ${JSON.stringify(locale)}. Received: ${cases.length}.`,
    );
  }
}

function requireRiverFarmPreviewSize(
  image: Pick<RiverFarmCover, "imageWidth" | "imageHeight">,
  imageLabel: string,
  locale: PublicLocale,
): void {
  if (
    image.imageWidth !== expectedRiverPreviewWidth ||
    image.imageHeight !== expectedRiverPreviewHeight
  ) {
    throw new Error(
      `River Farm structured data ${imageLabel} for locale ${JSON.stringify(locale)} must be ${expectedRiverPreviewWidth}x${expectedRiverPreviewHeight}. Received: ${JSON.stringify({ width: image.imageWidth, height: image.imageHeight })}.`,
    );
  }
}

function requireRiverFarmCoverIncludesCase01(
  pageCopy: RiverFarmPageCopy,
  locale: PublicLocale,
): void {
  if (
    pageCopy.cover.imageSrc !== riverFarmCoverPreviewSrc ||
    pageCopy.cover.imageOriginalSrc !== riverFarmCoverFullSrc
  ) {
    throw new Error(
      `River Farm structured data cover for locale ${JSON.stringify(locale)} must reuse case 01. Received: ${JSON.stringify({ imageSrc: pageCopy.cover.imageSrc, imageOriginalSrc: pageCopy.cover.imageOriginalSrc })}.`,
    );
  }

  const includedCase = pageCopy.cases.find(
    (farmCase) => farmCase.imageSrc === pageCopy.cover.imageSrc,
  );
  if (includedCase === undefined) {
    throw new Error(
      `River Farm structured data must keep case 01 in the visible cases for locale ${JSON.stringify(locale)}. Cover image: ${JSON.stringify(pageCopy.cover.imageSrc)}. Case images: ${JSON.stringify(pageCopy.cases.map((farmCase) => farmCase.imageSrc))}.`,
    );
  }
}

function requireRiverFarmCaseIds(
  cases: readonly RiverFarmCase[],
  locale: PublicLocale,
): void {
  const caseIds = cases.map((farmCase) => farmCase.id);
  if (
    caseIds.length !== expectedRiverFarmCaseIds.length ||
    caseIds.some((caseId, index) => caseId !== expectedRiverFarmCaseIds[index])
  ) {
    throw new Error(
      `River Farm structured data case IDs for locale ${JSON.stringify(locale)} must be ${JSON.stringify(expectedRiverFarmCaseIds)}. Received: ${JSON.stringify(caseIds)}.`,
    );
  }
}

export function createRiverFarmStructuredData(
  locale: PublicLocale,
): Record<string, unknown> {
  const pageCopy = getRiverFarmPageCopy(locale);
  requireSevenRiverFarmCases(pageCopy.cases, locale);
  requireRiverFarmPreviewSize(pageCopy.cover, "cover", locale);
  for (const farmCase of pageCopy.cases) {
    requireRiverFarmPreviewSize(farmCase, `case ${farmCase.id}`, locale);
  }
  requireRiverFarmCoverIncludesCase01(pageCopy, locale);
  requireRiverFarmCaseIds(pageCopy.cases, locale);

  const pathname = getLocalizedPublicPath(locale, riverFarmCanonicalPath);
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
      contentUrl: createCanonicalUrl(pageCopy.cover.imageSrc),
      caption: pageCopy.cover.imageAlt,
      width: pageCopy.cover.imageWidth,
      height: pageCopy.cover.imageHeight,
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
