import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishRiverFarmLayoutsPage, {
  dynamic as englishRiverFarmDynamic,
  metadata as englishRiverFarmMetadata,
} from "../../app/(en)/stardew-valley-river-farm-layout/page";
import ChineseRiverFarmLayoutsPage, {
  dynamic as chineseRiverFarmDynamic,
  metadata as chineseRiverFarmMetadata,
} from "../../app/zh/stardew-valley-river-farm-layout/page";
import {
  getRiverFarmPageCopy,
  riverFarmCanonicalPath,
} from "../../src/farm-layouts/river-farm-content";
import { createRiverFarmStructuredData } from "../../src/farm-layouts/river-farm-structured-data";
import {
  canonicalPublicPaths,
  getLocalizedIndexablePublicRouteEntries,
} from "../../src/i18n/public-route-registry";

const expectedRiverPreviewWidth = 1600;
const expectedRiverPreviewHeight = 1300;
const expectedRiverFullWidth = 2560;
const expectedRiverFullHeight = 2080;
const riverFarmAssetStems = [
  "stardew-valley-river-farm-layout-01-namsai-summer-island-specialization",
  "stardew-valley-river-farm-layout-02-spring-perfection-island-zones",
  "stardew-valley-river-farm-layout-03-y6-fall-perfection-pumpkin-hub",
  "stardew-valley-river-farm-layout-04-stardewplan-beauty-trellis",
  "stardew-valley-river-farm-layout-05-y6-fall-rustic-shed-village",
  "stardew-valley-river-farm-layout-06-y12-summer-ranch-center",
  "stardew-valley-river-farm-layout-07-y5-fall-purple-paint-town",
] as const;
const expectedRiverFarmCaseIds = riverFarmAssetStems.map((stem) =>
  stem.slice("stardew-valley-river-farm-layout-".length),
);

type RiverFarmItemList = {
  "@type": string;
  numberOfItems: number;
  itemListElement: readonly Readonly<{
    name: string;
    description: string;
    url: string;
  }>[];
};

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
      `River Farm image is not a lossy VP8 WEBP: ${filePath}. Chunk: ${JSON.stringify(chunkType)}. Start code: ${JSON.stringify(startCode)}.`,
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
    throw new Error(`Missing River Farm public asset: ${relativePath}.`);
  }

  return assetPath;
}

it("registers both localized River Farm paths after Fish Farm", () => {
  const fishFarmIndex = canonicalPublicPaths.indexOf(
    "/stardew-valley-fish-farm-layout",
  );
  const riverFarmIndex = canonicalPublicPaths.indexOf(riverFarmCanonicalPath);
  const meadowlandsFarmIndex = canonicalPublicPaths.indexOf(
    "/meadowlands-farm-layout",
  );
  const riverFarmEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) => canonicalPath === riverFarmCanonicalPath,
  );
  const englishCopy = getRiverFarmPageCopy("en");
  const chineseCopy = getRiverFarmPageCopy("zh-CN");

  expect(riverFarmCanonicalPath).toBe("/stardew-valley-river-farm-layout");
  expect(riverFarmIndex).toBe(fishFarmIndex + 1);
  expect(meadowlandsFarmIndex).toBe(riverFarmIndex + 1);
  expect(riverFarmEntries).toEqual([
    {
      locale: "en",
      canonicalPath: riverFarmCanonicalPath,
      pathname: riverFarmCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: riverFarmCanonicalPath,
      pathname: `/zh${riverFarmCanonicalPath}`,
    },
  ]);
  expect(englishRiverFarmMetadata).toMatchObject({
    title: englishCopy.metaTitle,
    description: englishCopy.description,
    alternates: {
      canonical: `https://stardewvalleyplanner.art${riverFarmCanonicalPath}`,
      languages: {
        en: `https://stardewvalleyplanner.art${riverFarmCanonicalPath}`,
        "zh-CN": `https://stardewvalleyplanner.art/zh${riverFarmCanonicalPath}`,
      },
    },
    openGraph: {
      images: [
        `https://stardewvalleyplanner.art${englishCopy.cover.imageSrc}`,
      ],
    },
    twitter: {
      images: [
        `https://stardewvalleyplanner.art${englishCopy.cover.imageSrc}`,
      ],
    },
  });
  expect(chineseRiverFarmMetadata).toMatchObject({
    title: chineseCopy.metaTitle,
    description: chineseCopy.description,
    alternates: {
      canonical: `https://stardewvalleyplanner.art/zh${riverFarmCanonicalPath}`,
      languages: {
        en: `https://stardewvalleyplanner.art${riverFarmCanonicalPath}`,
        "zh-CN": `https://stardewvalleyplanner.art/zh${riverFarmCanonicalPath}`,
      },
    },
    openGraph: {
      images: [
        `https://stardewvalleyplanner.art${chineseCopy.cover.imageSrc}`,
      ],
    },
    twitter: {
      images: [
        `https://stardewvalleyplanner.art${chineseCopy.cover.imageSrc}`,
      ],
    },
  });
  expect(englishCopy.cover.imageSrc).toBe(englishCopy.cases[0]?.imageSrc);
  expect(chineseCopy.cover.imageSrc).toBe(chineseCopy.cases[0]?.imageSrc);
  expect(englishCopy.cover.imageSrc).toContain(
    "stardew-valley-river-farm-layout-01-namsai-summer-island-specialization.webp",
  );
  expect(englishRiverFarmDynamic).toBe("force-static");
  expect(chineseRiverFarmDynamic).toBe("force-static");
});

it("renders the case 01 cover and all seven layout anchors", () => {
  const englishCopy = getRiverFarmPageCopy("en");
  const chineseCopy = getRiverFarmPageCopy("zh-CN");
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishRiverFarmLayoutsPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseRiverFarmLayoutsPage),
  );

  expect(englishCopy.cases.map(({ id }) => id)).toEqual(expectedRiverFarmCaseIds);
  expect(chineseCopy.cases.map(({ id }) => id)).toEqual(expectedRiverFarmCaseIds);
  expect(englishMarkup).toContain('data-public-page-shell="true"');
  expect(chineseMarkup).toContain('data-public-page-shell="true"');
  expect((englishMarkup.match(/<h1(?:\s|>)/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1(?:\s|>)/g) ?? [])).toHaveLength(1);
  expect(englishMarkup).toContain(englishCopy.title);
  expect(chineseMarkup).toContain(chineseCopy.title);
  expect(englishMarkup).toContain(englishCopy.cover.imageAlt);
  expect(chineseMarkup).toContain(chineseCopy.cover.imageAlt);
  expect(englishMarkup).toContain(`src="${englishCopy.cover.imageSrc}"`);
  expect(chineseMarkup).toContain(`src="${chineseCopy.cover.imageSrc}"`);
  expect(englishMarkup).toContain(`src="${englishCopy.cover.imageOriginalSrc}"`);
  expect(chineseMarkup).toContain(`src="${chineseCopy.cover.imageOriginalSrc}"`);

  for (const layoutCase of englishCopy.cases) {
    expect(englishMarkup).toContain(`id="${layoutCase.id}"`);
    expect(englishMarkup).toContain(layoutCase.title);
    expect(englishMarkup).toContain(layoutCase.summary);
    expect(englishMarkup).toContain(`src="${layoutCase.imageSrc}"`);
    expect(englishMarkup).toContain(`src="${layoutCase.imageOriginalSrc}"`);
    expect(englishMarkup).toContain(`href="${layoutCase.projectHref}"`);
  }
  for (const layoutCase of chineseCopy.cases) {
    expect(chineseMarkup).toContain(`id="${layoutCase.id}"`);
    expect(chineseMarkup).toContain(layoutCase.title);
    expect(chineseMarkup).toContain(layoutCase.summary);
    expect(chineseMarkup).toContain(`src="${layoutCase.imageSrc}"`);
    expect(chineseMarkup).toContain(`src="${layoutCase.imageOriginalSrc}"`);
    expect(chineseMarkup).toContain(`href="${layoutCase.projectHref}"`);
  }
});

it("describes the 1600x1300 cover and the seven real case anchors", () => {
  const englishCopy = getRiverFarmPageCopy("en");
  const chineseCopy = getRiverFarmPageCopy("zh-CN");
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishRiverFarmLayoutsPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseRiverFarmLayoutsPage),
  );
  const englishStructuredData = createRiverFarmStructuredData("en");
  const chineseStructuredData = createRiverFarmStructuredData("zh-CN");
  const englishMainEntity = englishStructuredData.mainEntity as RiverFarmItemList;
  const chineseMainEntity = chineseStructuredData.mainEntity as RiverFarmItemList;

  expect(englishStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: englishCopy.title,
    description: englishCopy.description,
    inLanguage: "en",
    url: `https://stardewvalleyplanner.art${riverFarmCanonicalPath}`,
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `https://stardewvalleyplanner.art${englishCopy.cover.imageSrc}`,
      caption: englishCopy.cover.imageAlt,
      width: expectedRiverPreviewWidth,
      height: expectedRiverPreviewHeight,
    },
  });
  expect(chineseStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: chineseCopy.title,
    description: chineseCopy.description,
    inLanguage: "zh-CN",
    url: `https://stardewvalleyplanner.art/zh${riverFarmCanonicalPath}`,
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `https://stardewvalleyplanner.art${chineseCopy.cover.imageSrc}`,
      caption: chineseCopy.cover.imageAlt,
      width: expectedRiverPreviewWidth,
      height: expectedRiverPreviewHeight,
    },
  });

  const localizedPageChecks = [
    {
      localizedPath: riverFarmCanonicalPath,
      mainEntity: englishMainEntity,
      pageMarkup: englishMarkup,
      pageCopy: englishCopy,
    },
    {
      localizedPath: `/zh${riverFarmCanonicalPath}`,
      mainEntity: chineseMainEntity,
      pageMarkup: chineseMarkup,
      pageCopy: chineseCopy,
    },
  ] as const;

  for (const pageCheck of localizedPageChecks) {
    expect(pageCheck.mainEntity).toMatchObject({
      "@type": "ItemList",
      numberOfItems: 7,
    });
    expect(pageCheck.mainEntity.itemListElement).toHaveLength(7);
    expect(pageCheck.mainEntity.itemListElement.map(({ name }) => name)).toEqual(
      pageCheck.pageCopy.cases.map(({ title }) => title),
    );
    expect(
      pageCheck.mainEntity.itemListElement.map(({ description }) => description),
    ).toEqual(pageCheck.pageCopy.cases.map(({ summary }) => summary));
    expect(pageCheck.mainEntity.itemListElement.map(({ url }) => url)).toEqual(
      pageCheck.pageCopy.cases.map(
        ({ id }) =>
          `https://stardewvalleyplanner.art${pageCheck.localizedPath}#${id}`,
      ),
    );

    for (const listItem of pageCheck.mainEntity.itemListElement) {
      const itemAnchor = new URL(listItem.url).hash.slice(1);
      expect(pageCheck.pageMarkup).toContain(`id="${itemAnchor}"`);
    }

    for (const farmCase of pageCheck.pageCopy.cases) {
      expect(farmCase.imageWidth).toBe(expectedRiverPreviewWidth);
      expect(farmCase.imageHeight).toBe(expectedRiverPreviewHeight);
      const previewPath = requirePublicAsset(farmCase.imageSrc);
      const fullPath = requirePublicAsset(farmCase.imageOriginalSrc);
      const avifPath = farmCase.imageSrc.replace(/\.webp$/, ".avif");
      requirePublicAsset(avifPath);
      requirePublicAsset(farmCase.projectHref);
      expect(readLossyWebpSize(previewPath)).toEqual({
        width: expectedRiverPreviewWidth,
        height: expectedRiverPreviewHeight,
      });
      expect(readLossyWebpSize(fullPath)).toEqual({
        width: expectedRiverFullWidth,
        height: expectedRiverFullHeight,
      });
    }
  }

  expect(JSON.stringify(englishStructuredData)).not.toMatch(
    /FAQPage|HowTo|Review|AggregateRating/,
  );
  expect(JSON.stringify(chineseStructuredData)).not.toMatch(
    /FAQPage|HowTo|Review|AggregateRating/,
  );
});

it("lists both River Farm pages between Fish Farm and Meadowlands", () => {
  const llmsText = readFileSync(join(process.cwd(), "public", "llms.txt"), "utf8");
  const englishCopy = getRiverFarmPageCopy("en");
  const chineseCopy = getRiverFarmPageCopy("zh-CN");
  const englishFishFarmEntry =
    "[Stardew Valley Fish Farm Layout](https://stardewvalleyplanner.art/stardew-valley-fish-farm-layout)";
  const englishMeadowlandsFarmEntry =
    "[Stardew Valley Meadowlands Farm Layout](https://stardewvalleyplanner.art/meadowlands-farm-layout)";
  const chineseFishFarmEntry =
    "[星露谷物语鱼塘农场布局](https://stardewvalleyplanner.art/zh/stardew-valley-fish-farm-layout)";
  const chineseMeadowlandsFarmEntry =
    "[星露谷物语草原农场布局](https://stardewvalleyplanner.art/zh/meadowlands-farm-layout)";
  const englishRiverFarmEntry =
    `[${englishCopy.title}](https://stardewvalleyplanner.art${riverFarmCanonicalPath}): ${englishCopy.description}`;
  const chineseRiverFarmEntry =
    `[${chineseCopy.title}](https://stardewvalleyplanner.art/zh${riverFarmCanonicalPath}): ${chineseCopy.description}`;

  expect(llmsText.indexOf(englishRiverFarmEntry)).toBeGreaterThan(
    llmsText.indexOf(englishFishFarmEntry),
  );
  expect(llmsText.indexOf(englishMeadowlandsFarmEntry)).toBeGreaterThan(
    llmsText.indexOf(englishRiverFarmEntry),
  );
  expect(llmsText.indexOf(chineseRiverFarmEntry)).toBeGreaterThan(
    llmsText.indexOf(chineseFishFarmEntry),
  );
  expect(llmsText.indexOf(chineseMeadowlandsFarmEntry)).toBeGreaterThan(
    llmsText.indexOf(chineseRiverFarmEntry),
  );
});
