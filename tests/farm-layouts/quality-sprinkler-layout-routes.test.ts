import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishQualitySprinklerLayoutsPage, {
  dynamic as englishQualitySprinklerDynamic,
  metadata as englishQualitySprinklerMetadata,
} from "../../app/(en)/stardew-valley-quality-sprinkler-layout/page";
import ChineseQualitySprinklerLayoutsPage, {
  dynamic as chineseQualitySprinklerDynamic,
  metadata as chineseQualitySprinklerMetadata,
} from "../../app/zh/stardew-valley-quality-sprinkler-layout/page";
import sitemap from "../../app/sitemap";
import { getFarmLayoutsNavigationModel } from "../../src/farm-layouts/farm-layouts-navigation-model";
import { fruitTreeLayoutCanonicalPath } from "../../src/farm-layouts/fruit-tree-layout-content";
import { iridiumSprinklerLayoutCanonicalPath } from "../../src/farm-layouts/iridium-sprinkler-layout-content";
import {
  sprinklerLayoutCanonicalPath,
} from "../../src/farm-layouts/sprinkler-layout-content";
import {
  getQualitySprinklerLayoutPageCopy,
  qualitySprinklerLayoutCanonicalPath,
} from "../../src/farm-layouts/quality-sprinkler-layout-content";
import { createQualitySprinklerLayoutPageStructuredData } from "../../src/farm-layouts/quality-sprinkler-layout-structured-data";
import {
  canonicalPublicPaths,
  getLocalizedIndexablePublicRouteEntries,
  getLocalizedPublicPath,
} from "../../src/i18n/public-route-registry";

type QualitySprinklerItemList = Readonly<{
  "@type": string;
  numberOfItems: number;
  itemListElement: readonly Readonly<{
    position: number;
    name: string;
    description: string;
    url: string;
  }>[];
}>;

type QualitySprinklerBreadcrumb = Readonly<{
  "@type": string;
  position: number;
  name: string;
  item?: string;
}>;

function readQualitySprinklerBreadcrumb(
  structuredData: Record<string, unknown>,
): readonly QualitySprinklerBreadcrumb[] {
  const breadcrumb = structuredData.breadcrumb;
  if (typeof breadcrumb !== "object" || breadcrumb === null) {
    throw new Error(
      `Quality sprinkler layout structured data is missing breadcrumb. Received: ${JSON.stringify(breadcrumb)}.`,
    );
  }

  const itemListElement = (breadcrumb as Record<string, unknown>).itemListElement;
  if (!Array.isArray(itemListElement)) {
    throw new Error(
      `Quality sprinkler layout breadcrumb is missing itemListElement. Received: ${JSON.stringify(breadcrumb)}.`,
    );
  }

  return itemListElement as readonly QualitySprinklerBreadcrumb[];
}

it("registers the English and Chinese Quality Sprinkler routes in the index and sitemap", () => {
  const indexableEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) => canonicalPath === qualitySprinklerLayoutCanonicalPath,
  );
  const sitemapPathnames = sitemap().map(({ url }) => new URL(url).pathname);

  expect(qualitySprinklerLayoutCanonicalPath).toBe(
    "/stardew-valley-quality-sprinkler-layout",
  );
  expect(canonicalPublicPaths).toHaveLength(52);
  expect(canonicalPublicPaths.indexOf(qualitySprinklerLayoutCanonicalPath)).toBe(
    canonicalPublicPaths.indexOf("/stardew-valley-sprinkler-layout") + 1,
  );
  expect(indexableEntries).toEqual([
    {
      locale: "en",
      canonicalPath: qualitySprinklerLayoutCanonicalPath,
      pathname: qualitySprinklerLayoutCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: qualitySprinklerLayoutCanonicalPath,
      pathname: `/zh${qualitySprinklerLayoutCanonicalPath}`,
    },
  ]);
  expect(sitemapPathnames).toContain(qualitySprinklerLayoutCanonicalPath);
  expect(sitemapPathnames).toContain(`/zh${qualitySprinklerLayoutCanonicalPath}`);
  expect(englishQualitySprinklerDynamic).toBe("force-static");
  expect(chineseQualitySprinklerDynamic).toBe("force-static");
});

it("keeps Quality Sprinkler Layouts after Sprinkler Layouts in all navigation fallbacks", () => {
  for (const locale of ["en", "zh-CN", "ja", "ru"] as const) {
    const plantingLayouts = getFarmLayoutsNavigationModel(locale).categories.find(
      ({ id }) => id === "planting-layouts",
    );
    const expectedHref =
      locale === "zh-CN"
        ? `/zh${qualitySprinklerLayoutCanonicalPath}`
        : qualitySprinklerLayoutCanonicalPath;
    const expectedLabel =
      locale === "zh-CN" ? "优质洒水器布局" : "Quality Sprinkler Layouts";
    const localizedPath = (canonicalPath: string) =>
      locale === "zh-CN" ? `/zh${canonicalPath}` : canonicalPath;

    expect(plantingLayouts?.pages).toEqual([
      {
        id: "sprinkler-layout",
        href: localizedPath(sprinklerLayoutCanonicalPath),
        label: locale === "zh-CN" ? "洒水器布局" : "Sprinkler Layouts",
      },
      {
        id: "quality-sprinkler-layout",
        href: expectedHref,
        label: expectedLabel,
      },
      {
        id: "iridium-sprinkler-layout",
        href: localizedPath(iridiumSprinklerLayoutCanonicalPath),
        label: locale === "zh-CN" ? "铱金洒水器布局" : "Iridium Sprinkler Layouts",
      },
      {
        id: "fruit-tree-layout",
        href: localizedPath(fruitTreeLayoutCanonicalPath),
        label: locale === "zh-CN" ? "果树布局" : "Fruit Tree Layouts",
      },
    ]);
  }
});

it("publishes localized page metadata and a CollectionPage for the separate cover and cases", () => {
  const englishCopy = getQualitySprinklerLayoutPageCopy("en");
  const chineseCopy = getQualitySprinklerLayoutPageCopy("zh-CN");
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishQualitySprinklerLayoutsPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseQualitySprinklerLayoutsPage),
  );
  const englishStructuredData =
    createQualitySprinklerLayoutPageStructuredData("en");
  const chineseStructuredData =
    createQualitySprinklerLayoutPageStructuredData("zh-CN");
  const englishItemList =
    englishStructuredData.mainEntity as QualitySprinklerItemList;
  const chineseItemList =
    chineseStructuredData.mainEntity as QualitySprinklerItemList;
  const englishBreadcrumb = readQualitySprinklerBreadcrumb(englishStructuredData);
  const chineseBreadcrumb = readQualitySprinklerBreadcrumb(chineseStructuredData);
  const englishUrl = `https://stardewvalleyplanner.art${qualitySprinklerLayoutCanonicalPath}`;
  const chineseUrl = `https://stardewvalleyplanner.art/zh${qualitySprinklerLayoutCanonicalPath}`;

  expect(englishQualitySprinklerMetadata).toMatchObject({
    title: englishCopy.metaTitle,
    description: englishCopy.description,
    alternates: {
      canonical: englishUrl,
      languages: {
        en: englishUrl,
        "zh-CN": chineseUrl,
        "x-default": englishUrl,
      },
    },
    openGraph: { images: [`https://stardewvalleyplanner.art${englishCopy.cover.imageSrc}`] },
  });
  expect(chineseQualitySprinklerMetadata).toMatchObject({
    title: chineseCopy.metaTitle,
    description: chineseCopy.description,
    alternates: {
      canonical: chineseUrl,
      languages: {
        en: englishUrl,
        "zh-CN": chineseUrl,
        "x-default": englishUrl,
      },
    },
    openGraph: { images: [`https://stardewvalleyplanner.art${chineseCopy.cover.imageSrc}`] },
  });
  expect(englishMarkup).toContain('data-public-page-shell="true"');
  expect(chineseMarkup).toContain('data-public-page-shell="true"');
  expect(englishMarkup).toContain("CollectionPage");
  expect(chineseMarkup).toContain("CollectionPage");
  expect(englishStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: englishCopy.title,
    description: englishCopy.description,
    inLanguage: "en",
    url: englishUrl,
  });
  expect(chineseStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: chineseCopy.title,
    description: chineseCopy.description,
    inLanguage: "zh-CN",
    url: chineseUrl,
  });
  expect(englishItemList).toMatchObject({
    "@type": "ItemList",
    numberOfItems: englishCopy.cases.length,
    itemListElement: englishCopy.cases.map((layoutCase, index) => ({
      position: index + 1,
      name: layoutCase.title,
      description: layoutCase.summary,
      url: `${englishUrl}#${layoutCase.id}`,
    })),
  });
  expect(chineseItemList).toMatchObject({
    "@type": "ItemList",
    numberOfItems: chineseCopy.cases.length,
    itemListElement: chineseCopy.cases.map((layoutCase, index) => ({
      position: index + 1,
      name: layoutCase.title,
      description: layoutCase.summary,
      url: `${chineseUrl}#${layoutCase.id}`,
    })),
  });
  expect(englishItemList.itemListElement.map(({ name }) => name)).not.toContain(
    englishCopy.cover.caption,
  );
  expect(englishBreadcrumb.map(({ name }) => name)).toEqual([
    "Stardew Valley Farm Planner",
    "Farm Layouts",
    "Planting Layouts",
    "Quality Sprinkler Layouts",
  ]);
  expect(chineseBreadcrumb.map(({ name }) => name)).toEqual([
    "星露谷物语农场规划器",
    "Farm Layouts",
    "种植布局",
    "优质洒水器布局",
  ]);
});

it("lists both localized Quality Sprinkler pages before planning guides in llms.txt", () => {
  const llmsText = readFileSync(join(process.cwd(), "public", "llms.txt"), "utf8");
  const englishCopy = getQualitySprinklerLayoutPageCopy("en");
  const chineseCopy = getQualitySprinklerLayoutPageCopy("zh-CN");
  const englishEntry = `[${englishCopy.title}](https://stardewvalleyplanner.art${qualitySprinklerLayoutCanonicalPath}): ${englishCopy.description}`;
  const chineseEntry = `[${chineseCopy.title}](https://stardewvalleyplanner.art/zh${qualitySprinklerLayoutCanonicalPath}): ${chineseCopy.description}`;
  const englishGeneralEntry =
    "https://stardewvalleyplanner.art/stardew-valley-sprinkler-layout";
  const chineseGeneralEntry =
    "https://stardewvalleyplanner.art/zh/stardew-valley-sprinkler-layout";

  expect(llmsText).toContain(englishEntry);
  expect(llmsText).toContain(chineseEntry);
  expect(llmsText.indexOf(englishEntry)).toBeGreaterThan(
    llmsText.indexOf(englishGeneralEntry),
  );
  expect(llmsText.indexOf(chineseEntry)).toBeGreaterThan(
    llmsText.indexOf(chineseGeneralEntry),
  );
  expect(llmsText.indexOf("### Planning guides")).toBeGreaterThan(
    llmsText.indexOf(englishEntry),
  );
  expect(llmsText.indexOf("### 农场规划指南")).toBeGreaterThan(
    llmsText.indexOf(chineseEntry),
  );
});
