import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishSprinklerLayoutsPage, {
  dynamic as englishSprinklerDynamic,
  metadata as englishSprinklerMetadata,
} from "../../app/(en)/stardew-valley-sprinkler-layout/page";
import ChineseSprinklerLayoutsPage, {
  dynamic as chineseSprinklerDynamic,
  metadata as chineseSprinklerMetadata,
} from "../../app/zh/stardew-valley-sprinkler-layout/page";
import sitemap from "../../app/sitemap";
import { getFarmLayoutsNavigationModel } from "../../src/farm-layouts/farm-layouts-navigation-model";
import {
  iridiumSprinklerLayoutCanonicalPath,
} from "../../src/farm-layouts/iridium-sprinkler-layout-content";
import {
  getSprinklerLayoutPageCopy,
  sprinklerLayoutCanonicalPath,
  type SprinklerLayoutCase,
} from "../../src/farm-layouts/sprinkler-layout-content";
import { createSprinklerLayoutPageStructuredData } from "../../src/farm-layouts/sprinkler-layout-structured-data";
import {
  canonicalPublicPaths,
  getLocalizedIndexablePublicRouteEntries,
} from "../../src/i18n/public-route-registry";
import type { PublicLocale } from "../../src/i18n/public-locale";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

const expectedSprinklerPreviewWidth = 1600;
const expectedSprinklerPreviewHeight = 1300;
const expectedSprinklerFullWidth = 2560;
const expectedSprinklerFullHeight = 2080;
const sprinklerLayoutCoverStem = "07-iridium-farm-patches-paths-scarecrows";
const expectedSprinklerLayoutCaseIds = [
  "01-basic-knights-move-staggered",
  "02-quality-3x3-grid",
  "03-iridium-5x5-grid",
  "04-scarecrow-radius-quality",
  "05-scarecrow-radius-iridium",
  "06-greenhouse-6-iridium-116",
] as const;
const farmMapCanonicalPaths = [
  "/stardew-valley-beach-farm-layout",
  "/stardew-valley-fish-farm-layout",
  "/stardew-valley-river-farm-layout",
  "/meadowlands-farm-layout",
  "/stardew-valley-forest-farm-layout",
  "/stardew-valley-four-corners-farm-layout",
  "/stardew-valley-frontier-farm-layout",
  "/stardew-valley-expanded-farm-layout",
  "/stardew-valley-hilltop-farm-layout",
] as const;
const englishBlogSprinklerEntry =
  "[Stardew Valley sprinklers: unlock the right tier, place it, and know where it fails](https://stardewvalleyplanner.art/sprinkler-stardew): Craft Farming 2, 6, or 9 sprinklers, place them for 6am watering, and check pots, Beach Farm sand, greenhouse rain, and island weather.";
const chineseBlogSprinklerEntry =
  "[星露谷洒水器怎么选、怎么摆：按耕种等级覆盖田地](https://stardewvalleyplanner.art/zh/sprinkler-stardew): 说明三种官方洒水器的早晨浇水格数、耕种解锁，以及花盆、沙地等浇不到的情况。";

type SprinklerLayoutItemList = {
  "@type": string;
  numberOfItems: number;
  itemListElement: readonly Readonly<{
    name: string;
    description: string;
    url: string;
  }>[];
};

type SprinklerLayoutBreadcrumbItem = Readonly<{
  "@type": string;
  position: number;
  name: string;
  item?: string;
}>;

function readLossyWebpSize(filePath: string): { width: number; height: number } {
  const buffer = readFileSync(filePath);
  const chunkType = buffer.toString("ascii", 12, 16);
  const startCode = buffer.subarray(23, 26).toString("hex");
  if (
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WEBP" ||
    chunkType !== "VP8 " ||
    startCode !== "9d012a"
  ) {
    throw new Error(
      `Sprinkler layout image is not a lossy VP8 WEBP: ${filePath}. Chunk: ${JSON.stringify(chunkType)}. Start code: ${JSON.stringify(startCode)}.`,
    );
  }

  return {
    width: buffer.readUInt16LE(26) & 0x3fff,
    height: buffer.readUInt16LE(28) & 0x3fff,
  };
}

function requirePublicAsset(relativePath: string): string {
  const assetPath = join(process.cwd(), "public", relativePath.slice(1));
  if (!existsSync(assetPath)) {
    throw new Error(`Missing sprinkler layout public asset: ${relativePath}.`);
  }

  return assetPath;
}

function requireAbsentPublicAsset(relativePath: string): void {
  const assetPath = join(process.cwd(), "public", relativePath.slice(1));
  if (existsSync(assetPath)) {
    throw new Error(
      `Sprinkler layout cover must not publish a project JSON. Received: ${relativePath}.`,
    );
  }
}

function readSprinklerBreadcrumb(
  structuredData: Record<string, unknown>,
  locale: PublicLocale,
): readonly SprinklerLayoutBreadcrumbItem[] {
  const breadcrumb = structuredData.breadcrumb;
  if (typeof breadcrumb !== "object" || breadcrumb === null) {
    throw new Error(
      `Sprinkler layout structured data for locale ${JSON.stringify(locale)} is missing breadcrumb. Received: ${JSON.stringify(breadcrumb)}.`,
    );
  }

  const breadcrumbRecord = breadcrumb as Record<string, unknown>;
  const itemListElement = breadcrumbRecord.itemListElement;
  if (!Array.isArray(itemListElement)) {
    throw new Error(
      `Sprinkler layout breadcrumb for locale ${JSON.stringify(locale)} is missing itemListElement. Received: ${JSON.stringify(breadcrumb)}.`,
    );
  }

  return itemListElement as readonly SprinklerLayoutBreadcrumbItem[];
}

function expectGreenhouseReferenceCopy(
  layoutCase: SprinklerLayoutCase,
  locale: PublicLocale,
): void {
  const caseText = [layoutCase.title, layoutCase.summary, layoutCase.imageAlt].join(
    "\n",
  );
  if (locale === "en") {
    const statesStandardFarmGreenhouseReference =
      caseText.includes("Standard Farm") &&
      /greenhouse/i.test(caseText) &&
      (/reference/i.test(caseText) ||
        /mock/i.test(caseText) ||
        /not the greenhouse interior/i.test(caseText));
    expect(
      statesStandardFarmGreenhouseReference,
      `Case 06 must say this is a Standard Farm greenhouse reference/mock. Received: ${JSON.stringify(caseText)}.`,
    ).toBe(true);
    return;
  }

  const statesChineseGreenhouseReference =
    caseText.includes("标准农场") &&
    (caseText.includes("温室参考示意") || caseText.includes("不是温室室内"));
  expect(
    statesChineseGreenhouseReference,
    `Case 06 must say 标准农场上的温室参考示意. Received: ${JSON.stringify(caseText)}.`,
  ).toBe(true);
}

it("registers Sprinkler Layouts after the nine Farm Map pages and keeps the blog guide", () => {
  const hilltopIndex = canonicalPublicPaths.indexOf(
    "/stardew-valley-hilltop-farm-layout",
  );
  const sprinklerIndex = canonicalPublicPaths.indexOf(sprinklerLayoutCanonicalPath);
  const iridiumSprinklerIndex = canonicalPublicPaths.indexOf(
    iridiumSprinklerLayoutCanonicalPath,
  );
  const blogIndex = canonicalPublicPaths.indexOf("/blog");
  const sprinklerEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) => canonicalPath === sprinklerLayoutCanonicalPath,
  );
  const sitemapPathnames = sitemap().map(({ url }) => new URL(url).pathname);
  const indexableEntries = getLocalizedIndexablePublicRouteEntries();
  let previousFarmMapIndex = -1;

  expect(sprinklerLayoutCanonicalPath).toBe("/stardew-valley-sprinkler-layout");
  expect(sprinklerLayoutCanonicalPath).not.toBe("/sprinkler-stardew");
  expect(canonicalPublicPaths).toContain("/sprinkler-stardew");
  expect(canonicalPublicPaths).toHaveLength(47);
  expect(indexableEntries).toHaveLength(92);
  expect(sprinklerIndex).toBe(hilltopIndex + 1);
  expect(iridiumSprinklerIndex).toBe(sprinklerIndex + 1);
  expect(blogIndex).toBe(iridiumSprinklerIndex + 1);
  for (const farmMapPath of farmMapCanonicalPaths) {
    const farmMapIndex = canonicalPublicPaths.indexOf(farmMapPath);
    expect(farmMapIndex).toBeGreaterThan(previousFarmMapIndex);
    previousFarmMapIndex = farmMapIndex;
  }
  expect(sprinklerIndex).toBeGreaterThan(previousFarmMapIndex);
  expect(canonicalPublicPaths).toContain(iridiumSprinklerLayoutCanonicalPath);
  expect(sprinklerEntries).toEqual([
    {
      locale: "en",
      canonicalPath: sprinklerLayoutCanonicalPath,
      pathname: sprinklerLayoutCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: sprinklerLayoutCanonicalPath,
      pathname: `/zh${sprinklerLayoutCanonicalPath}`,
    },
  ]);
  expect(sitemapPathnames).toContain(sprinklerLayoutCanonicalPath);
  expect(sitemapPathnames).toContain(`/zh${sprinklerLayoutCanonicalPath}`);
  expect(sitemapPathnames).toContain("/sprinkler-stardew");
  expect(sitemapPathnames).toContain("/zh/sprinkler-stardew");
  expect(sitemapPathnames).toHaveLength(indexableEntries.length + 2);
  expect(englishSprinklerDynamic).toBe("force-static");
  expect(chineseSprinklerDynamic).toBe("force-static");

  const englishNavigation = getFarmLayoutsNavigationModel("en");
  const chineseNavigation = getFarmLayoutsNavigationModel("zh-CN");
  expect(
    englishNavigation.categories.find((category) => category.id === "farm-maps")
      ?.pages.map((page) => page.id),
  ).toEqual([
    "beach-farm",
    "fish-farm",
    "river-farm",
    "meadowlands-farm",
    "forest-farm",
    "four-corners-farm",
    "frontier-farm",
    "expanded-farm",
    "hilltop-farm",
  ]);
  expect(
    englishNavigation.categories.find(
      (category) => category.id === "planting-layouts",
    ),
  ).toMatchObject({
    label: "Planting Layouts",
    pages: [
      {
        id: "sprinkler-layout",
        href: sprinklerLayoutCanonicalPath,
        label: "Sprinkler Layouts",
      },
      {
        id: "iridium-sprinkler-layout",
        href: iridiumSprinklerLayoutCanonicalPath,
        label: "Iridium Sprinkler Layouts",
      },
    ],
  });
  expect(
    chineseNavigation.categories.find(
      (category) => category.id === "planting-layouts",
    ),
  ).toMatchObject({
    label: "种植布局",
    pages: [
      {
        id: "sprinkler-layout",
        href: `/zh${sprinklerLayoutCanonicalPath}`,
        label: "洒水器布局",
      },
      {
        id: "iridium-sprinkler-layout",
        href: `/zh${iridiumSprinklerLayoutCanonicalPath}`,
        label: "铱金洒水器布局",
      },
    ],
  });
  for (const emptyCategoryId of [
    "greenhouse-layouts",
    "buildings-interiors",
    "layout-ideas",
  ] as const) {
    expect(
      englishNavigation.categories.find((category) => category.id === emptyCategoryId)
        ?.pages,
    ).toEqual([]);
    expect(
      chineseNavigation.categories.find((category) => category.id === emptyCategoryId)
        ?.pages,
    ).toEqual([]);
  }
});

it("publishes force-static metadata with hreflang and the measured cover preview", () => {
  const englishCopy = getSprinklerLayoutPageCopy("en");
  const chineseCopy = getSprinklerLayoutPageCopy("zh-CN");
  const englishCoverUrl = createCanonicalUrl(englishCopy.cover.imageSrc);
  const chineseCoverUrl = createCanonicalUrl(chineseCopy.cover.imageSrc);

  expect(englishCopy.cover.imageWidth).toBe(expectedSprinklerPreviewWidth);
  expect(englishCopy.cover.imageHeight).toBe(expectedSprinklerPreviewHeight);
  expect(chineseCopy.cover.imageWidth).toBe(expectedSprinklerPreviewWidth);
  expect(chineseCopy.cover.imageHeight).toBe(expectedSprinklerPreviewHeight);
  expect(englishSprinklerMetadata).toMatchObject({
    title: englishCopy.metaTitle,
    description: englishCopy.description,
    alternates: {
      canonical: `https://stardewvalleyplanner.art${sprinklerLayoutCanonicalPath}`,
      languages: {
        en: `https://stardewvalleyplanner.art${sprinklerLayoutCanonicalPath}`,
        "zh-CN": `https://stardewvalleyplanner.art/zh${sprinklerLayoutCanonicalPath}`,
        "x-default": `https://stardewvalleyplanner.art${sprinklerLayoutCanonicalPath}`,
      },
    },
    openGraph: {
      images: [
        {
          url: englishCoverUrl,
          width: englishCopy.cover.imageWidth,
          height: englishCopy.cover.imageHeight,
          alt: englishCopy.cover.imageAlt,
        },
      ],
    },
    twitter: { images: [englishCoverUrl] },
  });
  expect(chineseSprinklerMetadata).toMatchObject({
    title: chineseCopy.metaTitle,
    description: chineseCopy.description,
    alternates: {
      canonical: `https://stardewvalleyplanner.art/zh${sprinklerLayoutCanonicalPath}`,
      languages: {
        en: `https://stardewvalleyplanner.art${sprinklerLayoutCanonicalPath}`,
        "zh-CN": `https://stardewvalleyplanner.art/zh${sprinklerLayoutCanonicalPath}`,
        "x-default": `https://stardewvalleyplanner.art${sprinklerLayoutCanonicalPath}`,
      },
    },
    openGraph: {
      images: [
        {
          url: chineseCoverUrl,
          width: chineseCopy.cover.imageWidth,
          height: chineseCopy.cover.imageHeight,
          alt: chineseCopy.cover.imageAlt,
        },
      ],
    },
    twitter: { images: [chineseCoverUrl] },
  });
  expect(englishSprinklerMetadata.robots).toBeUndefined();
  expect(chineseSprinklerMetadata.robots).toBeUndefined();
});

it("renders six cases, the independent cover, and the greenhouse reference", () => {
  const englishCopy = getSprinklerLayoutPageCopy("en");
  const chineseCopy = getSprinklerLayoutPageCopy("zh-CN");
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishSprinklerLayoutsPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseSprinklerLayoutsPage),
  );
  const englishCase06 = englishCopy.cases[5];
  const chineseCase06 = chineseCopy.cases[5];
  if (englishCase06 === undefined || chineseCase06 === undefined) {
    throw new Error(
      `Sprinkler layout case 06 is missing. Received English ids ${JSON.stringify(englishCopy.cases.map(({ id }) => id))} and Chinese ids ${JSON.stringify(chineseCopy.cases.map(({ id }) => id))}.`,
    );
  }

  expect(englishCopy.cases.map(({ id }) => id)).toEqual([
    ...expectedSprinklerLayoutCaseIds,
  ]);
  expect(chineseCopy.cases.map(({ id }) => id)).toEqual([
    ...expectedSprinklerLayoutCaseIds,
  ]);
  expect(englishCopy.whatIsParagraphs).toHaveLength(2);
  expect(chineseCopy.whatIsParagraphs).toHaveLength(2);
  expect(englishCopy.howToSteps).toHaveLength(3);
  expect(chineseCopy.howToSteps).toHaveLength(3);
  expect(englishCopy.faqs).toHaveLength(5);
  expect(chineseCopy.faqs).toHaveLength(5);
  expectGreenhouseReferenceCopy(englishCase06, "en");
  expectGreenhouseReferenceCopy(chineseCase06, "zh-CN");
  expect(englishMarkup).toContain('data-public-page-shell="true"');
  expect(chineseMarkup).toContain('data-public-page-shell="true"');
  expect(englishMarkup.match(/<h1(?:\s|>)/g) ?? []).toHaveLength(1);
  expect(chineseMarkup.match(/<h1(?:\s|>)/g) ?? []).toHaveLength(1);
  expect(englishMarkup).toContain(`src="${englishCopy.cover.imageSrc}"`);
  expect(chineseMarkup).toContain(`src="${chineseCopy.cover.imageSrc}"`);
  expect(englishMarkup).toContain(`src="${englishCopy.cover.imageOriginalSrc}"`);
  expect(chineseMarkup).toContain(`src="${chineseCopy.cover.imageOriginalSrc}"`);
  expect(englishMarkup).toContain('href="/#planner"');
  expect(chineseMarkup).toContain('href="/zh#planner"');
  expect(englishMarkup).not.toContain(
    `/farm-layouts/sprinkler/projects/${sprinklerLayoutCoverStem}.json`,
  );
  expect(chineseMarkup).not.toContain(
    `/farm-layouts/sprinkler/projects/${sprinklerLayoutCoverStem}.json`,
  );

  for (const layoutCase of englishCopy.cases) {
    expect(englishMarkup).toContain(`id="${layoutCase.id}"`);
    expect(englishMarkup).toContain(`href="${layoutCase.projectHref}"`);
    expect(englishMarkup).not.toContain(`id="${sprinklerLayoutCoverStem}"`);
  }
  for (const layoutCase of chineseCopy.cases) {
    expect(chineseMarkup).toContain(`id="${layoutCase.id}"`);
    expect(chineseMarkup).toContain(`href="${layoutCase.projectHref}"`);
    expect(chineseMarkup).not.toContain(`id="${sprinklerLayoutCoverStem}"`);
  }
});

it("describes a six-item CollectionPage whose cover image is case 07", () => {
  const englishCopy = getSprinklerLayoutPageCopy("en");
  const chineseCopy = getSprinklerLayoutPageCopy("zh-CN");
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishSprinklerLayoutsPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseSprinklerLayoutsPage),
  );
  const englishStructuredData = createSprinklerLayoutPageStructuredData("en");
  const chineseStructuredData = createSprinklerLayoutPageStructuredData("zh-CN");
  const englishMainEntity = englishStructuredData.mainEntity as SprinklerLayoutItemList;
  const chineseMainEntity = chineseStructuredData.mainEntity as SprinklerLayoutItemList;
  const englishBreadcrumb = readSprinklerBreadcrumb(englishStructuredData, "en");
  const chineseBreadcrumb = readSprinklerBreadcrumb(chineseStructuredData, "zh-CN");

  expect(englishMarkup).toContain(JSON.stringify(englishStructuredData["@type"]));
  expect(chineseMarkup).toContain("CollectionPage");
  expect(englishStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: englishCopy.title,
    description: englishCopy.description,
    inLanguage: "en",
    url: `https://stardewvalleyplanner.art${sprinklerLayoutCanonicalPath}`,
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `https://stardewvalleyplanner.art${englishCopy.cover.imageSrc}`,
      caption: englishCopy.cover.imageAlt,
      width: expectedSprinklerPreviewWidth,
      height: expectedSprinklerPreviewHeight,
    },
  });
  expect(chineseStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: chineseCopy.title,
    description: chineseCopy.description,
    inLanguage: "zh-CN",
    url: `https://stardewvalleyplanner.art/zh${sprinklerLayoutCanonicalPath}`,
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `https://stardewvalleyplanner.art${chineseCopy.cover.imageSrc}`,
      caption: chineseCopy.cover.imageAlt,
      width: expectedSprinklerPreviewWidth,
      height: expectedSprinklerPreviewHeight,
    },
  });
  expect(englishBreadcrumb).toEqual([
    {
      "@type": "ListItem",
      position: 1,
      name: "Stardew Valley Farm Planner",
      item: "https://stardewvalleyplanner.art",
    },
    { "@type": "ListItem", position: 2, name: "Farm Layouts" },
    { "@type": "ListItem", position: 3, name: "Planting Layouts" },
    {
      "@type": "ListItem",
      position: 4,
      name: "Sprinkler Layouts",
      item: `https://stardewvalleyplanner.art${sprinklerLayoutCanonicalPath}`,
    },
  ]);
  expect(chineseBreadcrumb).toEqual([
    {
      "@type": "ListItem",
      position: 1,
      name: "星露谷物语农场规划器",
      item: "https://stardewvalleyplanner.art/zh",
    },
    { "@type": "ListItem", position: 2, name: "Farm Layouts" },
    { "@type": "ListItem", position: 3, name: "种植布局" },
    {
      "@type": "ListItem",
      position: 4,
      name: "洒水器布局",
      item: `https://stardewvalleyplanner.art/zh${sprinklerLayoutCanonicalPath}`,
    },
  ]);
  expect(englishBreadcrumb[1]).not.toHaveProperty("item");
  expect(englishBreadcrumb[2]).not.toHaveProperty("item");
  expect(englishBreadcrumb.map(({ name }) => name)).not.toContain("Farm Maps");
  expect(chineseBreadcrumb.map(({ name }) => name)).not.toContain("农场地图");

  const localizedPageChecks = [
    {
      localizedPath: sprinklerLayoutCanonicalPath,
      mainEntity: englishMainEntity,
      pageMarkup: englishMarkup,
      pageCopy: englishCopy,
    },
    {
      localizedPath: `/zh${sprinklerLayoutCanonicalPath}`,
      mainEntity: chineseMainEntity,
      pageMarkup: chineseMarkup,
      pageCopy: chineseCopy,
    },
  ] as const;

  for (const pageCheck of localizedPageChecks) {
    expect(pageCheck.mainEntity).toMatchObject({
      "@type": "ItemList",
      numberOfItems: 6,
    });
    expect(pageCheck.mainEntity.itemListElement).toHaveLength(6);
    expect(pageCheck.mainEntity.itemListElement.map(({ url }) => url)).toEqual(
      pageCheck.pageCopy.cases.map(
        ({ id }) =>
          `https://stardewvalleyplanner.art${pageCheck.localizedPath}#${id}`,
      ),
    );
    expect(
      pageCheck.mainEntity.itemListElement.map(({ url }) => url).join("\n"),
    ).not.toContain(sprinklerLayoutCoverStem);
    expect(pageCheck.pageCopy.cover.imageSrc).toContain(sprinklerLayoutCoverStem);
    expect(readLossyWebpSize(requirePublicAsset(pageCheck.pageCopy.cover.imageSrc))).toEqual({
      width: expectedSprinklerPreviewWidth,
      height: expectedSprinklerPreviewHeight,
    });
    expect(
      readLossyWebpSize(requirePublicAsset(pageCheck.pageCopy.cover.imageOriginalSrc)),
    ).toEqual({
      width: expectedSprinklerFullWidth,
      height: expectedSprinklerFullHeight,
    });
    requirePublicAsset(pageCheck.pageCopy.cover.imageSrc.replace(/\.webp$/, ".avif"));

    for (const layoutCase of pageCheck.pageCopy.cases) {
      expect(layoutCase.imageWidth).toBe(expectedSprinklerPreviewWidth);
      expect(layoutCase.imageHeight).toBe(expectedSprinklerPreviewHeight);
      const itemAnchor = layoutCase.id;
      expect(pageCheck.pageMarkup).toContain(`id="${itemAnchor}"`);
      expect(readLossyWebpSize(requirePublicAsset(layoutCase.imageSrc))).toEqual({
        width: expectedSprinklerPreviewWidth,
        height: expectedSprinklerPreviewHeight,
      });
      expect(readLossyWebpSize(requirePublicAsset(layoutCase.imageOriginalSrc))).toEqual({
        width: expectedSprinklerFullWidth,
        height: expectedSprinklerFullHeight,
      });
      requirePublicAsset(layoutCase.imageSrc.replace(/\.webp$/, ".avif"));
      requirePublicAsset(layoutCase.projectHref);
    }
  }

  requireAbsentPublicAsset(
    `/farm-layouts/sprinkler/projects/${sprinklerLayoutCoverStem}.json`,
  );
  expect(JSON.stringify(englishStructuredData)).not.toMatch(
    /FAQPage|HowTo|Review|AggregateRating/,
  );
  expect(JSON.stringify(chineseStructuredData)).not.toMatch(
    /FAQPage|HowTo|Review|AggregateRating/,
  );
});

it("lists the layout topic under Farm Layouts without replacing the sprinkler guide", () => {
  const llmsText = readFileSync(join(process.cwd(), "public", "llms.txt"), "utf8");
  const englishCopy = getSprinklerLayoutPageCopy("en");
  const chineseCopy = getSprinklerLayoutPageCopy("zh-CN");
  const englishLayoutEntry = `[${englishCopy.title}](https://stardewvalleyplanner.art${sprinklerLayoutCanonicalPath}): ${englishCopy.description}`;
  const chineseLayoutEntry = `[${chineseCopy.title}](https://stardewvalleyplanner.art/zh${sprinklerLayoutCanonicalPath}): ${chineseCopy.description}`;
  const englishHilltopUrl =
    "https://stardewvalleyplanner.art/stardew-valley-hilltop-farm-layout";
  const chineseHilltopUrl =
    "https://stardewvalleyplanner.art/zh/stardew-valley-hilltop-farm-layout";

  expect(llmsText.indexOf(englishLayoutEntry)).toBeGreaterThan(
    llmsText.indexOf(englishHilltopUrl),
  );
  expect(llmsText.indexOf("### Planning guides")).toBeGreaterThan(
    llmsText.indexOf(englishLayoutEntry),
  );
  expect(llmsText.indexOf(chineseLayoutEntry)).toBeGreaterThan(
    llmsText.indexOf(chineseHilltopUrl),
  );
  expect(llmsText.indexOf("### 农场规划指南")).toBeGreaterThan(
    llmsText.indexOf(chineseLayoutEntry),
  );
  expect(llmsText).toContain(englishBlogSprinklerEntry);
  expect(llmsText).toContain(chineseBlogSprinklerEntry);
  expect(llmsText.indexOf(englishBlogSprinklerEntry)).toBeGreaterThan(
    llmsText.indexOf("### Planning guides"),
  );
  expect(llmsText.indexOf(chineseBlogSprinklerEntry)).toBeGreaterThan(
    llmsText.indexOf("### 农场规划指南"),
  );
  if (englishCopy.metaTitle !== englishCopy.title) {
    expect(llmsText).not.toContain(
      `[${englishCopy.metaTitle}](https://stardewvalleyplanner.art${sprinklerLayoutCanonicalPath}): ${englishCopy.description}`,
    );
  }
  if (chineseCopy.metaTitle !== chineseCopy.title) {
    expect(llmsText).not.toContain(
      `[${chineseCopy.metaTitle}](https://stardewvalleyplanner.art/zh${sprinklerLayoutCanonicalPath}): ${chineseCopy.description}`,
    );
  }
});
