import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishExpandedFarmLayoutsPage, {
  dynamic as englishExpandedFarmDynamic,
  metadata as englishExpandedFarmMetadata,
} from "../../app/(en)/stardew-valley-expanded-farm-layout/page";
import ChineseExpandedFarmLayoutsPage, {
  dynamic as chineseExpandedFarmDynamic,
  metadata as chineseExpandedFarmMetadata,
} from "../../app/zh/stardew-valley-expanded-farm-layout/page";
import {
  expandedFarmCanonicalPath,
  getExpandedFarmPageCopy,
  getFeaturedExpandedFarmCase,
} from "../../src/farm-layouts/expanded-farm-content";
import { getLocalizedIndexablePublicRouteEntries } from "../../src/i18n/public-route-registry";
import { createCanonicalUrl } from "../../src/seo/public-site-url";
import sitemap from "../../app/sitemap";

type ExpandedFarmStructuredData = Readonly<{
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

function readExpandedFarmStructuredData(markup: string): ExpandedFarmStructuredData {
  const serializedStructuredData = markup.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/u,
  )?.[1];
  if (serializedStructuredData === undefined) {
    throw new Error("Expanded Farm route markup is missing its JSON-LD script.");
  }

  return JSON.parse(serializedStructuredData) as ExpandedFarmStructuredData;
}

it("registers both localized Expanded Farm URLs as indexable and in the sitemap", () => {
  expect(expandedFarmCanonicalPath).toBe(
    "/stardew-valley-expanded-farm-layout",
  );
  expect(
    getLocalizedIndexablePublicRouteEntries().filter(
      ({ canonicalPath }) => canonicalPath === expandedFarmCanonicalPath,
    ),
  ).toEqual([
    {
      locale: "en",
      canonicalPath: expandedFarmCanonicalPath,
      pathname: expandedFarmCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: expandedFarmCanonicalPath,
      pathname: `/zh${expandedFarmCanonicalPath}`,
    },
  ]);

  const sitemapPathnames = sitemap().map(({ url }) => new URL(url).pathname);
  expect(sitemapPathnames).toContain(expandedFarmCanonicalPath);
  expect(sitemapPathnames).toContain(`/zh${expandedFarmCanonicalPath}`);
});

it("uses case 01 for route metadata and as each page's primary image", () => {
  const englishCopy = getExpandedFarmPageCopy("en");
  const chineseCopy = getExpandedFarmPageCopy("zh-CN");
  const englishFeaturedCase = getFeaturedExpandedFarmCase("en");
  const chineseFeaturedCase = getFeaturedExpandedFarmCase("zh-CN");
  const englishImageUrl = createCanonicalUrl(englishFeaturedCase.imageSrc);
  const chineseImageUrl = createCanonicalUrl(chineseFeaturedCase.imageSrc);

  expect(englishCopy.metaTitle).not.toBe(englishCopy.title);
  expect(chineseCopy.metaTitle).not.toBe(chineseCopy.title);
  expect(englishFeaturedCase.id).toBe("if2r-clover-crop-hub");
  expect(chineseFeaturedCase.id).toBe("if2r-clover-crop-hub");
  expect(englishExpandedFarmMetadata).toMatchObject({
    title: englishCopy.metaTitle,
    description: englishCopy.description,
    alternates: {
      canonical: `https://stardewvalleyplanner.art${expandedFarmCanonicalPath}`,
      languages: {
        en: `https://stardewvalleyplanner.art${expandedFarmCanonicalPath}`,
        "zh-CN": `https://stardewvalleyplanner.art/zh${expandedFarmCanonicalPath}`,
      },
    },
    openGraph: { images: [englishImageUrl] },
    twitter: { images: [englishImageUrl] },
  });
  expect(chineseExpandedFarmMetadata).toMatchObject({
    title: chineseCopy.metaTitle,
    description: chineseCopy.description,
    alternates: {
      canonical: `https://stardewvalleyplanner.art/zh${expandedFarmCanonicalPath}`,
      languages: {
        en: `https://stardewvalleyplanner.art${expandedFarmCanonicalPath}`,
        "zh-CN": `https://stardewvalleyplanner.art/zh${expandedFarmCanonicalPath}`,
      },
    },
    openGraph: { images: [chineseImageUrl] },
    twitter: { images: [chineseImageUrl] },
  });
  expect(englishExpandedFarmDynamic).toBe("force-static");
  expect(chineseExpandedFarmDynamic).toBe("force-static");

  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishExpandedFarmLayoutsPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseExpandedFarmLayoutsPage),
  );

  for (const [locale, markup, localizedCopy, featuredCase] of [
    ["en", englishMarkup, englishCopy, englishFeaturedCase],
    ["zh-CN", chineseMarkup, chineseCopy, chineseFeaturedCase],
  ] as const) {
    expect(markup).toContain('data-public-page-shell="true"');
    expect(markup).toContain('data-expanded-farm-page="true"');
    expect(markup.match(/<h1(?:\s|>)/gu) ?? []).toHaveLength(1);
    expect(markup.match(/data-expanded-farm-case=/gu) ?? []).toHaveLength(7);

    const structuredData = readExpandedFarmStructuredData(markup);
    const expectedPagePath = locale === "en"
      ? expandedFarmCanonicalPath
      : `/zh${expandedFarmCanonicalPath}`;
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
  const englishCopy = getExpandedFarmPageCopy("en");
  const chineseCopy = getExpandedFarmPageCopy("zh-CN");
  const englishPageUrl = createCanonicalUrl(expandedFarmCanonicalPath);
  const chinesePageUrl = createCanonicalUrl(`/zh${expandedFarmCanonicalPath}`);

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
