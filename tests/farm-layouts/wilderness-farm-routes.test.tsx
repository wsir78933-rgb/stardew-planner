import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishWildernessFarmPage, {
  dynamic as englishWildernessFarmDynamic,
  metadata as englishWildernessFarmMetadata,
} from "../../app/(en)/stardew-valley-wilderness-farm-layout/page";
import ChineseWildernessFarmPage, {
  dynamic as chineseWildernessFarmDynamic,
  metadata as chineseWildernessFarmMetadata,
} from "../../app/zh/stardew-valley-wilderness-farm-layout/page";
import sitemap from "../../app/sitemap";
import {
  getFeaturedWildernessFarmCase,
  getWildernessFarmPageCopy,
  wildernessFarmCanonicalPath,
} from "../../src/farm-layouts/wilderness-farm-content";
import {
  canonicalPublicPaths,
  getLocalizedIndexablePublicRouteEntries,
  getLocalizedPublicRouteEntries,
} from "../../src/i18n/public-route-registry";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

type WildernessFarmStructuredData = Readonly<{
  "@type": string;
  name: string;
  description: string;
  inLanguage: string;
  url: string;
  primaryImageOfPage: Readonly<{
    contentUrl: string;
    caption: string;
    width: number;
    height: number;
  }>;
  mainEntity: Readonly<{
    "@type": string;
    numberOfItems: number;
    itemListElement: readonly Readonly<{
      position: number;
      name: string;
      description: string;
      url: string;
    }>[];
  }>;
}>;

function readWildernessFarmStructuredData(markup: string): WildernessFarmStructuredData {
  const serializedStructuredData = markup.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/u,
  )?.[1];
  if (serializedStructuredData === undefined) {
    throw new Error("Wilderness Farm route markup is missing its JSON-LD script.");
  }
  return JSON.parse(serializedStructuredData) as WildernessFarmStructuredData;
}

it("registers both Wilderness Farm routes as indexable with canonical metadata and sitemap entries", () => {
  const englishCopy = getWildernessFarmPageCopy("en");
  const chineseCopy = getWildernessFarmPageCopy("zh-CN");
  const englishFeaturedCase = getFeaturedWildernessFarmCase("en");
  const chineseFeaturedCase = getFeaturedWildernessFarmCase("zh-CN");
  const englishCanonicalUrl = createCanonicalUrl(wildernessFarmCanonicalPath);
  const chineseCanonicalUrl = createCanonicalUrl(`/zh${wildernessFarmCanonicalPath}`);
  const localizedWildernessEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) => canonicalPath === wildernessFarmCanonicalPath,
  );
  const indexableEntries = getLocalizedIndexablePublicRouteEntries();
  const sitemapPathnames = sitemap().map(({ url }) => new URL(url).pathname);
  const hilltopPathIndex = canonicalPublicPaths.indexOf(
    "/stardew-valley-hilltop-farm-layout",
  );
  const wildernessPathIndex = canonicalPublicPaths.indexOf(wildernessFarmCanonicalPath);
  const sprinklerPathIndex = canonicalPublicPaths.indexOf(
    "/stardew-valley-sprinkler-layout",
  );

  expect(wildernessFarmCanonicalPath).toBe(
    "/stardew-valley-wilderness-farm-layout",
  );
  expect(canonicalPublicPaths).toHaveLength(52);
  expect(wildernessPathIndex).toBe(hilltopPathIndex + 1);
  expect(sprinklerPathIndex).toBe(wildernessPathIndex + 1);
  expect(getLocalizedPublicRouteEntries()).toHaveLength(104);
  expect(indexableEntries).toHaveLength(102);
  expect(localizedWildernessEntries).toEqual([
    {
      locale: "en",
      canonicalPath: wildernessFarmCanonicalPath,
      pathname: wildernessFarmCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: wildernessFarmCanonicalPath,
      pathname: `/zh${wildernessFarmCanonicalPath}`,
    },
  ]);
  expect(sitemapPathnames).toContain(wildernessFarmCanonicalPath);
  expect(sitemapPathnames).toContain(`/zh${wildernessFarmCanonicalPath}`);
  expect(sitemapPathnames).toHaveLength(indexableEntries.length + 2);
  expect(englishWildernessFarmDynamic).toBe("force-static");
  expect(chineseWildernessFarmDynamic).toBe("force-static");

  expect(englishWildernessFarmMetadata).toMatchObject({
    title: englishCopy.metaTitle,
    description: englishCopy.description,
    alternates: {
      canonical: englishCanonicalUrl,
      languages: {
        en: englishCanonicalUrl,
        "zh-CN": chineseCanonicalUrl,
      },
    },
    openGraph: { images: [createCanonicalUrl(englishFeaturedCase.imageSrc)] },
    twitter: { images: [createCanonicalUrl(englishFeaturedCase.imageSrc)] },
  });
  expect(chineseWildernessFarmMetadata).toMatchObject({
    title: chineseCopy.metaTitle,
    description: chineseCopy.description,
    alternates: {
      canonical: chineseCanonicalUrl,
      languages: {
        en: englishCanonicalUrl,
        "zh-CN": chineseCanonicalUrl,
      },
    },
    openGraph: { images: [createCanonicalUrl(chineseFeaturedCase.imageSrc)] },
    twitter: { images: [createCanonicalUrl(chineseFeaturedCase.imageSrc)] },
  });
  expect(englishWildernessFarmMetadata.robots).toBeUndefined();
  expect(chineseWildernessFarmMetadata.robots).toBeUndefined();
});

it("publishes seven ordered Wilderness Farm cases with the selected cover in JSON-LD", () => {
  const localizedRoutes = [
    {
      locale: "en",
      page: EnglishWildernessFarmPage,
      copy: getWildernessFarmPageCopy("en"),
      featuredCase: getFeaturedWildernessFarmCase("en"),
    },
    {
      locale: "zh-CN",
      page: ChineseWildernessFarmPage,
      copy: getWildernessFarmPageCopy("zh-CN"),
      featuredCase: getFeaturedWildernessFarmCase("zh-CN"),
    },
  ] as const;

  for (const route of localizedRoutes) {
    const markup = renderToStaticMarkup(createElement(route.page));
    const structuredData = readWildernessFarmStructuredData(markup);
    const pagePath = route.locale === "en"
      ? wildernessFarmCanonicalPath
      : `/zh${wildernessFarmCanonicalPath}`;
    const pageUrl = createCanonicalUrl(pagePath);
    const expectedItemUrls = route.copy.cases.map(
      (farmCase) => `${pageUrl}#${farmCase.id}`,
    );

    expect(markup).toContain('data-public-page-shell="true"');
    expect(markup).toContain('data-wilderness-farm-page="true"');
    expect(markup.match(/data-wilderness-farm-case=/gu) ?? []).toHaveLength(7);
    expect(structuredData).toMatchObject({
      "@type": "CollectionPage",
      name: route.copy.title,
      description: route.copy.description,
      inLanguage: route.locale,
      url: pageUrl,
      primaryImageOfPage: {
        contentUrl: createCanonicalUrl(route.featuredCase.imageSrc),
        caption: route.featuredCase.imageAlt,
        width: route.featuredCase.imageWidth,
        height: route.featuredCase.imageHeight,
      },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: 7,
      },
    });
    expect(structuredData.mainEntity.itemListElement).toHaveLength(7);
    expect(structuredData.mainEntity.itemListElement.map(({ position }) => position))
      .toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(structuredData.mainEntity.itemListElement.map(({ name }) => name))
      .toEqual(route.copy.cases.map(({ title }) => title));
    expect(structuredData.mainEntity.itemListElement.map(({ description }) => description))
      .toEqual(route.copy.cases.map(({ summary }) => summary));
    expect(structuredData.mainEntity.itemListElement.map(({ url }) => url))
      .toEqual(expectedItemUrls);
  }
});

it("advertises both visible Wilderness Farm titles in llms.txt", () => {
  const llmsText = readFileSync(join(process.cwd(), "public", "llms.txt"), "utf8");
  const englishCopy = getWildernessFarmPageCopy("en");
  const chineseCopy = getWildernessFarmPageCopy("zh-CN");
  const englishPageUrl = createCanonicalUrl(wildernessFarmCanonicalPath);
  const chinesePageUrl = createCanonicalUrl(`/zh${wildernessFarmCanonicalPath}`);

  expect(llmsText).toContain(
    `[${englishCopy.title}](${englishPageUrl}): ${englishCopy.description}`,
  );
  expect(llmsText).toContain(
    `[${chineseCopy.title}](${chinesePageUrl}): ${chineseCopy.description}`,
  );
});
