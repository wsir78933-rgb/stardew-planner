import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishHilltopFarmLayoutsPage, {
  dynamic as englishHilltopFarmDynamic,
  metadata as englishHilltopFarmMetadata,
} from "../../app/(en)/stardew-valley-hilltop-farm-layout/page";
import ChineseHilltopFarmLayoutsPage, {
  dynamic as chineseHilltopFarmDynamic,
  metadata as chineseHilltopFarmMetadata,
} from "../../app/zh/stardew-valley-hilltop-farm-layout/page";
import sitemap from "../../app/sitemap";
import {
  getFeaturedHilltopFarmCase,
  getHilltopFarmPageCopy,
  hilltopFarmCanonicalPath,
} from "../../src/farm-layouts/hilltop-farm-content";
import {
  canonicalPublicPaths,
  getLocalizedIndexablePublicRouteEntries,
  getLocalizedPublicRouteEntries,
} from "../../src/i18n/public-route-registry";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

type HilltopFarmStructuredData = Readonly<{
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

function readHilltopFarmStructuredData(markup: string): HilltopFarmStructuredData {
  const serializedStructuredData = markup.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/u,
  )?.[1];
  if (serializedStructuredData === undefined) {
    throw new Error("Hilltop Farm route markup is missing its JSON-LD script.");
  }

  return JSON.parse(serializedStructuredData) as HilltopFarmStructuredData;
}

it("registers both localized Hilltop Farm URLs as indexable and in the sitemap", () => {
  const indexableEntries = getLocalizedIndexablePublicRouteEntries();
  const sitemapPathnames = sitemap().map(({ url }) => new URL(url).pathname);

  expect(hilltopFarmCanonicalPath).toBe(
    "/stardew-valley-hilltop-farm-layout",
  );
  expect(canonicalPublicPaths).toHaveLength(51);
  expect(getLocalizedPublicRouteEntries()).toHaveLength(102);
  expect(indexableEntries).toHaveLength(100);
  expect(
    indexableEntries.filter(
      ({ canonicalPath }) => canonicalPath === hilltopFarmCanonicalPath,
    ),
  ).toEqual([
    {
      locale: "en",
      canonicalPath: hilltopFarmCanonicalPath,
      pathname: hilltopFarmCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: hilltopFarmCanonicalPath,
      pathname: `/zh${hilltopFarmCanonicalPath}`,
    },
  ]);
  expect(sitemapPathnames).toContain(hilltopFarmCanonicalPath);
  expect(sitemapPathnames).toContain(`/zh${hilltopFarmCanonicalPath}`);
  expect(sitemapPathnames).toHaveLength(indexableEntries.length + 2);
});

it("uses the featured case for route metadata and as each page's primary image", () => {
  const englishCopy = getHilltopFarmPageCopy("en");
  const chineseCopy = getHilltopFarmPageCopy("zh-CN");
  const englishFeaturedCase = getFeaturedHilltopFarmCase("en");
  const chineseFeaturedCase = getFeaturedHilltopFarmCase("zh-CN");
  const englishImageUrl = createCanonicalUrl(englishFeaturedCase.imageSrc);
  const chineseImageUrl = createCanonicalUrl(chineseFeaturedCase.imageSrc);

  expect(englishCopy.metaTitle).not.toBe(englishCopy.title);
  expect(chineseCopy.metaTitle).not.toBe(chineseCopy.title);
  expect(englishFeaturedCase).toMatchObject(englishCopy.cases[0]!);
  expect(chineseFeaturedCase).toMatchObject(chineseCopy.cases[0]!);
  expect(englishHilltopFarmMetadata).toMatchObject({
    title: englishCopy.metaTitle,
    description: englishCopy.description,
    alternates: {
      canonical: `https://stardewvalleyplanner.art${hilltopFarmCanonicalPath}`,
      languages: {
        en: `https://stardewvalleyplanner.art${hilltopFarmCanonicalPath}`,
        "zh-CN": `https://stardewvalleyplanner.art/zh${hilltopFarmCanonicalPath}`,
      },
    },
    openGraph: { images: [englishImageUrl] },
    twitter: { images: [englishImageUrl] },
  });
  expect(chineseHilltopFarmMetadata).toMatchObject({
    title: chineseCopy.metaTitle,
    description: chineseCopy.description,
    alternates: {
      canonical: `https://stardewvalleyplanner.art/zh${hilltopFarmCanonicalPath}`,
      languages: {
        en: `https://stardewvalleyplanner.art${hilltopFarmCanonicalPath}`,
        "zh-CN": `https://stardewvalleyplanner.art/zh${hilltopFarmCanonicalPath}`,
      },
    },
    openGraph: { images: [chineseImageUrl] },
    twitter: { images: [chineseImageUrl] },
  });
  expect(englishHilltopFarmDynamic).toBe("force-static");
  expect(chineseHilltopFarmDynamic).toBe("force-static");

  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishHilltopFarmLayoutsPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseHilltopFarmLayoutsPage),
  );

  for (const [locale, markup, localizedCopy, featuredCase] of [
    ["en", englishMarkup, englishCopy, englishFeaturedCase],
    ["zh-CN", chineseMarkup, chineseCopy, chineseFeaturedCase],
  ] as const) {
    expect(markup).toContain('data-public-page-shell="true"');
    expect(markup).toContain('data-hilltop-farm-page="true"');
    expect(markup.match(/<h1(?:\s|>)/gu) ?? []).toHaveLength(1);
    expect(markup.match(/data-hilltop-farm-case=/gu) ?? []).toHaveLength(7);

    const structuredData = readHilltopFarmStructuredData(markup);
    const expectedPagePath = locale === "en"
      ? hilltopFarmCanonicalPath
      : `/zh${hilltopFarmCanonicalPath}`;
    const expectedPageUrl = createCanonicalUrl(expectedPagePath);

    expect(structuredData).toMatchObject({
      "@type": "CollectionPage",
      name: localizedCopy.title,
      description: localizedCopy.description,
      inLanguage: locale,
      url: expectedPageUrl,
      primaryImageOfPage: {
        contentUrl: createCanonicalUrl(featuredCase.imageSrc),
        caption: featuredCase.imageAlt,
        width: featuredCase.imageWidth,
        height: featuredCase.imageHeight,
      },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: 7,
      },
    });
    expect(structuredData.mainEntity.itemListElement).toHaveLength(7);
    expect(
      structuredData.mainEntity.itemListElement.map(({ position }) => position),
    ).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(
      structuredData.mainEntity.itemListElement.map(({ name }) => name),
    ).toEqual(localizedCopy.cases.map(({ title }) => title));
    expect(
      structuredData.mainEntity.itemListElement.map(({ description }) => description),
    ).toEqual(localizedCopy.cases.map(({ summary }) => summary));
    expect(
      structuredData.mainEntity.itemListElement.map(({ url }) => url),
    ).toEqual(
      localizedCopy.cases.map(({ id }) => `${expectedPageUrl}#${id}`),
    );
  }
});

it("lists each language in llms.txt using visible titles instead of metadata titles", () => {
  const llmsText = readFileSync(join(process.cwd(), "public", "llms.txt"), "utf8");
  const englishCopy = getHilltopFarmPageCopy("en");
  const chineseCopy = getHilltopFarmPageCopy("zh-CN");
  const englishPageUrl = createCanonicalUrl(hilltopFarmCanonicalPath);
  const chinesePageUrl = createCanonicalUrl(`/zh${hilltopFarmCanonicalPath}`);

  expect(llmsText).toContain(
    `[${englishCopy.title}](${englishPageUrl}): ${englishCopy.description}`,
  );
  expect(llmsText).toContain(
    `[${chineseCopy.title}](${chinesePageUrl}): ${chineseCopy.description}`,
  );
  if (englishCopy.metaTitle !== englishCopy.title) {
    expect(llmsText).not.toContain(
      `[${englishCopy.metaTitle}](${englishPageUrl}): ${englishCopy.description}`,
    );
  }
  if (chineseCopy.metaTitle !== chineseCopy.title) {
    expect(llmsText).not.toContain(
      `[${chineseCopy.metaTitle}](${chinesePageUrl}): ${chineseCopy.description}`,
    );
  }
});
