import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishFishFarmLayoutsPage, {
  metadata as englishFishFarmMetadata,
} from "../../app/(en)/stardew-valley-fish-farm-layout/page";
import ChineseFishFarmLayoutsPage, {
  metadata as chineseFishFarmMetadata,
} from "../../app/zh/stardew-valley-fish-farm-layout/page";
import {
  fishFarmCanonicalPath,
  getFeaturedFishFarmCase,
  getFishFarmPageCopy,
} from "../../src/farm-layouts/fish-farm-content";
import { createFishFarmPageStructuredData } from "../../src/farm-layouts/fish-farm-structured-data";
import { getLocalizedIndexablePublicRouteEntries } from "../../src/i18n/public-route-registry";
import { createCanonicalUrl } from "../../src/seo/public-site-url";
import sitemap from "../../app/sitemap";

type CollectionStructuredData = Readonly<{
  "@type": string;
  inLanguage: string;
  primaryImageOfPage: Readonly<{ contentUrl: string; caption: string }>;
  mainEntity: Readonly<{
    "@type": string;
    numberOfItems: number;
    itemListElement: readonly Readonly<{ name: string; url: string }>[];
  }>;
}>;

function readCollectionStructuredData(markup: string): CollectionStructuredData {
  const serializedStructuredData = markup.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
  )?.[1];
  if (serializedStructuredData === undefined) {
    throw new Error("Fish Farm route markup is missing its JSON-LD script.");
  }

  const structuredData = JSON.parse(serializedStructuredData) as CollectionStructuredData;
  return structuredData;
}

function expectSocialImageMetadata(
  metadata: typeof englishFishFarmMetadata,
  expectedImageUrl: string,
): void {
  expect(metadata.openGraph?.images).toEqual([expectedImageUrl]);
  expect(metadata.twitter?.images).toEqual([expectedImageUrl]);
}

it("registers both localized Fish Farm topic URLs as indexable routes", () => {
  expect(fishFarmCanonicalPath).toBe("/stardew-valley-fish-farm-layout");
  expect(
    getLocalizedIndexablePublicRouteEntries().filter(
      ({ canonicalPath }) => canonicalPath === fishFarmCanonicalPath,
    ),
  ).toEqual([
    {
      locale: "en",
      canonicalPath: fishFarmCanonicalPath,
      pathname: fishFarmCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: fishFarmCanonicalPath,
      pathname: `/zh${fishFarmCanonicalPath}`,
    },
  ]);

  const sitemapPathnames = sitemap().map(
    ({ url }) => new URL(url).pathname,
  );
  expect(sitemapPathnames).toContain(fishFarmCanonicalPath);
  expect(sitemapPathnames).toContain(`/zh${fishFarmCanonicalPath}`);
});

it("renders all six layouts on both topic routes and features case 02", () => {
  const englishCopy = getFishFarmPageCopy("en");
  const chineseCopy = getFishFarmPageCopy("zh-CN");
  const englishFeaturedCase = getFeaturedFishFarmCase("en");
  const chineseFeaturedCase = getFeaturedFishFarmCase("zh-CN");
  const englishMarkup = renderToStaticMarkup(createElement(EnglishFishFarmLayoutsPage));
  const chineseMarkup = renderToStaticMarkup(createElement(ChineseFishFarmLayoutsPage));

  for (const [markup, localizedCopy, featuredCase] of [
    [englishMarkup, englishCopy, englishFeaturedCase],
    [chineseMarkup, chineseCopy, chineseFeaturedCase],
  ] as const) {
    expect(markup).toContain('data-public-page-shell="true"');
    expect(markup).toContain('data-fish-farm-page="true"');
    expect((markup.match(/<h1(?:\s|>)/g) ?? [])).toHaveLength(1);
    expect(markup).toContain(localizedCopy.title);
    expect(markup).toContain('id="fish-farm-what-is"');
    expect(markup).toContain('id="fish-farm-layouts"');
    expect(markup).toContain(localizedCopy.whatIsHeading);
    expect(markup).toContain(localizedCopy.casesDescription);
    expect(markup).toContain('id="fish-farm-how-to-heading"');
    expect(markup).toContain(localizedCopy.faqHeading);
    expect(markup.match(/data-fish-farm-case=/g)).toHaveLength(6);

    const renderedCaseIds = Array.from(
      markup.matchAll(/data-fish-farm-case="([^"]+)"/g),
      ([, caseId]) => caseId,
    );
    expect(renderedCaseIds).toEqual(localizedCopy.cases.map((farmCase) => farmCase.id));
    expect(markup.indexOf(featuredCase.imageSrc)).toBeLessThan(
      markup.indexOf(localizedCopy.cases[0]?.imageSrc ?? ""),
    );

    for (const farmCase of localizedCopy.cases) {
      expect(markup).toContain(`data-fish-farm-case="${farmCase.id}"`);
      expect(markup).toContain(`id="${farmCase.id}"`);
      expect(markup).toContain(`download="" href="${farmCase.projectHref}"`);
      expect(markup).toContain(`src="${farmCase.imageSrc}"`);
      expect(markup).toContain(`src="${farmCase.imageOriginalSrc}"`);
      expect(markup).toContain(farmCase.title);
      expect(markup).toContain(farmCase.summary);
      expect(markup).toContain(farmCase.imageAlt);
    }

    const renderedStructuredData = readCollectionStructuredData(markup);
    expect(renderedStructuredData).toMatchObject({
      "@type": "CollectionPage",
      inLanguage: localizedCopy === englishCopy ? "en" : "zh-CN",
      primaryImageOfPage: {
        contentUrl: createCanonicalUrl(featuredCase.imageSrc),
        caption: featuredCase.imageAlt,
      },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: 6,
      },
    });
    expect(renderedStructuredData.mainEntity.itemListElement).toHaveLength(6);
    expect(renderedStructuredData.mainEntity.itemListElement[0]?.name).toBe(
      localizedCopy.cases[0]?.title,
    );
    expect(renderedStructuredData.mainEntity.itemListElement[0]?.url).toBe(
      `${createCanonicalUrl(localizedCopy === englishCopy ? fishFarmCanonicalPath : `/zh${fishFarmCanonicalPath}`)}#${localizedCopy.cases[0]?.id}`,
    );
  }
});

it("uses case 02 as the canonical, Open Graph, Twitter, and JSON-LD page image", () => {
  const englishCopy = getFishFarmPageCopy("en");
  const chineseCopy = getFishFarmPageCopy("zh-CN");
  const englishFeaturedCase = getFeaturedFishFarmCase("en");
  const chineseFeaturedCase = getFeaturedFishFarmCase("zh-CN");
  const englishFeaturedImageUrl = createCanonicalUrl(englishFeaturedCase.imageSrc);
  const chineseFeaturedImageUrl = createCanonicalUrl(chineseFeaturedCase.imageSrc);
  const englishStructuredData = createFishFarmPageStructuredData("en");
  const chineseStructuredData = createFishFarmPageStructuredData("zh-CN");

  expect(englishFeaturedCase.id).toBe("island-zones");
  expect(chineseFeaturedCase.id).toBe("island-zones");
  expect(englishFishFarmMetadata).toMatchObject({
    title: englishCopy.metaTitle,
    description: englishCopy.description,
    alternates: {
      canonical: "https://stardewvalleyplanner.art/stardew-valley-fish-farm-layout",
      languages: {
        en: "https://stardewvalleyplanner.art/stardew-valley-fish-farm-layout",
        "zh-CN": "https://stardewvalleyplanner.art/zh/stardew-valley-fish-farm-layout",
      },
    },
  });
  expect(chineseFishFarmMetadata).toMatchObject({
    title: chineseCopy.metaTitle,
    description: chineseCopy.description,
    alternates: {
      canonical: "https://stardewvalleyplanner.art/zh/stardew-valley-fish-farm-layout",
      languages: {
        en: "https://stardewvalleyplanner.art/stardew-valley-fish-farm-layout",
        "zh-CN": "https://stardewvalleyplanner.art/zh/stardew-valley-fish-farm-layout",
      },
    },
  });
  expectSocialImageMetadata(englishFishFarmMetadata, englishFeaturedImageUrl);
  expectSocialImageMetadata(chineseFishFarmMetadata, chineseFeaturedImageUrl);
  expect(englishStructuredData.primaryImageOfPage).toMatchObject({
    contentUrl: englishFeaturedImageUrl,
    caption: englishFeaturedCase.imageAlt,
  });
  expect(chineseStructuredData.primaryImageOfPage).toMatchObject({
    contentUrl: chineseFeaturedImageUrl,
    caption: chineseFeaturedCase.imageAlt,
  });

  const llmsText = readFileSync(join(process.cwd(), "public", "llms.txt"), "utf8");
  expect(llmsText).toContain(
    `[${englishCopy.title}](${createCanonicalUrl(fishFarmCanonicalPath)}): ${englishCopy.description}`,
  );
  expect(llmsText).toContain(
    `[${chineseCopy.title}](${createCanonicalUrl(`/zh${fishFarmCanonicalPath}`)}): ${chineseCopy.description}`,
  );
});
