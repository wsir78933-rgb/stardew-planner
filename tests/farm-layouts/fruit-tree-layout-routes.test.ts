import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishFruitTreeLayoutPage, {
  dynamic as englishFruitTreeDynamic,
  metadata as englishFruitTreeMetadata,
} from "../../app/(en)/stardew-valley-fruit-tree-layout/page";
import ChineseFruitTreeLayoutPage, {
  dynamic as chineseFruitTreeDynamic,
  metadata as chineseFruitTreeMetadata,
} from "../../app/zh/stardew-valley-fruit-tree-layout/page";
import sitemap from "../../app/sitemap";
import {
  fruitTreeLayoutCanonicalPath,
  getFruitTreeLayoutPageCopy,
} from "../../src/farm-layouts/fruit-tree-layout-content";
import { createFruitTreeLayoutPageStructuredData } from "../../src/farm-layouts/fruit-tree-layout-structured-data";
import {
  canonicalPublicPaths,
  getLocalizedIndexablePublicRouteEntries,
  getLocalizedPublicRouteEntries,
} from "../../src/i18n/public-route-registry";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

type FruitTreeItemList = Readonly<{
  "@type": string;
  numberOfItems: number;
  itemListElement: readonly Readonly<{
    "@type": string;
    position: number;
    name: string;
    description: string;
    url: string;
  }>[];
}>;

it("registers both localized page paths, canonical metadata, and sitemap entries", () => {
  const englishCopy = getFruitTreeLayoutPageCopy("en");
  const chineseCopy = getFruitTreeLayoutPageCopy("zh-CN");
  const englishCanonicalUrl = createCanonicalUrl(fruitTreeLayoutCanonicalPath);
  const chineseCanonicalUrl = createCanonicalUrl(
    `/zh${fruitTreeLayoutCanonicalPath}`,
  );
  const localizedFruitTreeEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) => canonicalPath === fruitTreeLayoutCanonicalPath,
  );
  const indexableEntries = getLocalizedIndexablePublicRouteEntries();
  const sitemapPathnames = sitemap().map(({ url }) => new URL(url).pathname);
  const iridiumLayoutIndex = canonicalPublicPaths.indexOf(
    "/stardew-valley-iridium-sprinkler-layout",
  );
  const fruitTreeLayoutIndex = canonicalPublicPaths.indexOf(
    fruitTreeLayoutCanonicalPath,
  );
  const blogIndex = canonicalPublicPaths.indexOf("/blog");

  expect(canonicalPublicPaths).toHaveLength(60);
  expect(fruitTreeLayoutIndex).toBe(iridiumLayoutIndex + 1);
  expect(blogIndex).toBe(fruitTreeLayoutIndex + 1);
  expect(getLocalizedPublicRouteEntries()).toHaveLength(120);
  expect(indexableEntries).toHaveLength(118);
  expect(localizedFruitTreeEntries).toEqual([
    {
      locale: "en",
      canonicalPath: fruitTreeLayoutCanonicalPath,
      pathname: fruitTreeLayoutCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: fruitTreeLayoutCanonicalPath,
      pathname: `/zh${fruitTreeLayoutCanonicalPath}`,
    },
  ]);
  expect(sitemapPathnames).toContain(fruitTreeLayoutCanonicalPath);
  expect(sitemapPathnames).toContain(`/zh${fruitTreeLayoutCanonicalPath}`);
  expect(sitemapPathnames).toHaveLength(indexableEntries.length + 2);
  expect(englishFruitTreeDynamic).toBe("force-static");
  expect(chineseFruitTreeDynamic).toBe("force-static");

  expect(englishFruitTreeMetadata).toMatchObject({
    title: englishCopy.metaTitle,
    description: englishCopy.description,
    alternates: {
      canonical: englishCanonicalUrl,
      languages: {
        en: englishCanonicalUrl,
        "zh-CN": chineseCanonicalUrl,
        "x-default": englishCanonicalUrl,
      },
    },
    openGraph: {
      images: [
        {
          url: createCanonicalUrl(englishCopy.cover.imageSrc),
          width: englishCopy.cover.imageWidth,
          height: englishCopy.cover.imageHeight,
          alt: englishCopy.cover.imageAlt,
        },
      ],
    },
    twitter: { images: [createCanonicalUrl(englishCopy.cover.imageSrc)] },
  });
  expect(chineseFruitTreeMetadata).toMatchObject({
    title: chineseCopy.metaTitle,
    description: chineseCopy.description,
    alternates: {
      canonical: chineseCanonicalUrl,
      languages: {
        en: englishCanonicalUrl,
        "zh-CN": chineseCanonicalUrl,
        "x-default": englishCanonicalUrl,
      },
    },
    openGraph: {
      images: [
        {
          url: createCanonicalUrl(chineseCopy.cover.imageSrc),
          width: chineseCopy.cover.imageWidth,
          height: chineseCopy.cover.imageHeight,
          alt: chineseCopy.cover.imageAlt,
        },
      ],
    },
    twitter: { images: [createCanonicalUrl(chineseCopy.cover.imageSrc)] },
  });
  expect(englishFruitTreeMetadata.robots).toBeUndefined();
  expect(chineseFruitTreeMetadata.robots).toBeUndefined();
});

it("publishes an ordered seven-project CollectionPage with case 01 as its primary image", () => {
  const englishCopy = getFruitTreeLayoutPageCopy("en");
  const chineseCopy = getFruitTreeLayoutPageCopy("zh-CN");
  const englishStructuredData = createFruitTreeLayoutPageStructuredData("en");
  const chineseStructuredData = createFruitTreeLayoutPageStructuredData("zh-CN");
  const englishItemList = englishStructuredData.mainEntity as FruitTreeItemList;
  const chineseItemList = chineseStructuredData.mainEntity as FruitTreeItemList;

  expect(englishStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: englishCopy.title,
    description: englishCopy.description,
    inLanguage: "en",
    url: createCanonicalUrl(fruitTreeLayoutCanonicalPath),
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: createCanonicalUrl(englishCopy.cover.imageSrc),
      caption: englishCopy.cover.imageAlt,
      width: englishCopy.cover.imageWidth,
      height: englishCopy.cover.imageHeight,
    },
  });
  expect(chineseStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: chineseCopy.title,
    description: chineseCopy.description,
    inLanguage: "zh-CN",
    url: createCanonicalUrl(`/zh${fruitTreeLayoutCanonicalPath}`),
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: createCanonicalUrl(chineseCopy.cover.imageSrc),
      caption: chineseCopy.cover.imageAlt,
      width: chineseCopy.cover.imageWidth,
      height: chineseCopy.cover.imageHeight,
    },
  });

  for (const [itemList, pageCopy, localizedPathname] of [
    [englishItemList, englishCopy, fruitTreeLayoutCanonicalPath],
    [chineseItemList, chineseCopy, `/zh${fruitTreeLayoutCanonicalPath}`],
  ] as const) {
    expect(itemList).toMatchObject({ "@type": "ItemList", numberOfItems: 7 });
    expect(itemList.itemListElement).toEqual(
      pageCopy.cases.map((layoutCase, caseIndex) => ({
        "@type": "ListItem",
        position: caseIndex + 1,
        name: layoutCase.title,
        description: layoutCase.summary,
        url: `${createCanonicalUrl(localizedPathname)}#${layoutCase.id}`,
      })),
    );
  }

  expect(JSON.stringify(englishStructuredData.breadcrumb)).toContain(
    `"name":"Fruit Tree Layouts","item":"${createCanonicalUrl(fruitTreeLayoutCanonicalPath)}"`,
  );
  expect(JSON.stringify(chineseStructuredData.breadcrumb)).toContain(
    `"name":"果树布局","item":"${createCanonicalUrl(`/zh${fruitTreeLayoutCanonicalPath}`)}"`,
  );
});

it("renders the localized route shells and advertises the visible page titles in llms.txt", () => {
  const englishCopy = getFruitTreeLayoutPageCopy("en");
  const chineseCopy = getFruitTreeLayoutPageCopy("zh-CN");
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishFruitTreeLayoutPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseFruitTreeLayoutPage),
  );
  const llmsText = readFileSync(join(process.cwd(), "public", "llms.txt"), "utf8");
  const englishFruitTreeEntry =
    `[${englishCopy.title}](${createCanonicalUrl(fruitTreeLayoutCanonicalPath)}): ` +
    englishCopy.description;
  const chineseFruitTreeEntry =
    `[${chineseCopy.title}](${createCanonicalUrl(`/zh${fruitTreeLayoutCanonicalPath}`)}): ` +
    chineseCopy.description;
  const englishHilltopEntryIndex = llmsText.indexOf(
    "https://stardewvalleyplanner.art/stardew-valley-hilltop-farm-layout",
  );
  const chineseHilltopEntryIndex = llmsText.indexOf(
    "https://stardewvalleyplanner.art/zh/stardew-valley-hilltop-farm-layout",
  );

  expect(englishMarkup).toContain('data-public-page-shell="true"');
  expect(chineseMarkup).toContain('data-public-page-shell="true"');
  expect(englishMarkup).toContain('data-fruit-tree-layout-page="true"');
  expect(chineseMarkup).toContain('data-fruit-tree-layout-page="true"');
  expect(englishMarkup).toContain("CollectionPage");
  expect(chineseMarkup).toContain("CollectionPage");
  expect(llmsText).toContain(englishFruitTreeEntry);
  expect(llmsText).toContain(chineseFruitTreeEntry);
  expect(llmsText.indexOf(englishFruitTreeEntry)).toBeGreaterThan(
    englishHilltopEntryIndex,
  );
  expect(llmsText.indexOf(englishFruitTreeEntry)).toBeLessThan(
    llmsText.indexOf("### Planning guides"),
  );
  expect(llmsText.indexOf(chineseFruitTreeEntry)).toBeGreaterThan(
    chineseHilltopEntryIndex,
  );
  expect(llmsText.indexOf(chineseFruitTreeEntry)).toBeLessThan(
    llmsText.indexOf("### 农场规划指南"),
  );
  if (englishCopy.metaTitle !== englishCopy.title) {
    expect(llmsText).not.toContain(
      `[${englishCopy.metaTitle}](${createCanonicalUrl(fruitTreeLayoutCanonicalPath)}): ${englishCopy.description}`,
    );
  }
  if (chineseCopy.metaTitle !== chineseCopy.title) {
    expect(llmsText).not.toContain(
      `[${chineseCopy.metaTitle}](${createCanonicalUrl(`/zh${fruitTreeLayoutCanonicalPath}`)}): ${chineseCopy.description}`,
    );
  }
});
