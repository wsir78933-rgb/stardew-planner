import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishIridiumSprinklerLayoutPage, {
  dynamic as englishIridiumSprinklerDynamic,
  metadata as englishIridiumSprinklerMetadata,
} from "../../app/(en)/stardew-valley-iridium-sprinkler-layout/page";
import ChineseIridiumSprinklerLayoutPage, {
  dynamic as chineseIridiumSprinklerDynamic,
  metadata as chineseIridiumSprinklerMetadata,
} from "../../app/zh/stardew-valley-iridium-sprinkler-layout/page";
import sitemap from "../../app/sitemap";
import {
  getIridiumSprinklerLayoutPageCopy,
  iridiumSprinklerLayoutCanonicalPath,
} from "../../src/farm-layouts/iridium-sprinkler-layout-content";
import { createIridiumSprinklerLayoutPageStructuredData } from "../../src/farm-layouts/iridium-sprinkler-layout-structured-data";
import {
  canonicalPublicPaths,
  getLocalizedIndexablePublicRouteEntries,
} from "../../src/i18n/public-route-registry";

type IridiumSprinklerItemList = Readonly<{
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

it("registers paired static routes, canonical metadata, and sitemap entries", () => {
  const englishCopy = getIridiumSprinklerLayoutPageCopy("en");
  const chineseCopy = getIridiumSprinklerLayoutPageCopy("zh-CN");
  const englishCanonicalUrl = `https://stardewvalleyplanner.art${iridiumSprinklerLayoutCanonicalPath}`;
  const chineseCanonicalUrl = `https://stardewvalleyplanner.art/zh${iridiumSprinklerLayoutCanonicalPath}`;
  const englishCoverUrl = `https://stardewvalleyplanner.art${englishCopy.cover.imageSrc}`;
  const chineseCoverUrl = `https://stardewvalleyplanner.art${chineseCopy.cover.imageSrc}`;
  const routeEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) => canonicalPath === iridiumSprinklerLayoutCanonicalPath,
  );
  const sitemapPathnames = sitemap().map(({ url }) => new URL(url).pathname);

  expect(canonicalPublicPaths).toHaveLength(60);
  expect(canonicalPublicPaths).toContain(iridiumSprinklerLayoutCanonicalPath);
  expect(routeEntries).toEqual([
    {
      locale: "en",
      canonicalPath: iridiumSprinklerLayoutCanonicalPath,
      pathname: iridiumSprinklerLayoutCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: iridiumSprinklerLayoutCanonicalPath,
      pathname: `/zh${iridiumSprinklerLayoutCanonicalPath}`,
    },
  ]);
  expect(getLocalizedIndexablePublicRouteEntries()).toHaveLength(118);
  expect(sitemapPathnames).toContain(iridiumSprinklerLayoutCanonicalPath);
  expect(sitemapPathnames).toContain(`/zh${iridiumSprinklerLayoutCanonicalPath}`);
  expect(englishIridiumSprinklerDynamic).toBe("force-static");
  expect(chineseIridiumSprinklerDynamic).toBe("force-static");

  expect(englishIridiumSprinklerMetadata).toMatchObject({
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
          url: englishCoverUrl,
          width: 1600,
          height: 1300,
          alt: englishCopy.cover.imageAlt,
        },
      ],
    },
    twitter: { images: [englishCoverUrl] },
  });
  expect(chineseIridiumSprinklerMetadata).toMatchObject({
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
          url: chineseCoverUrl,
          width: 1600,
          height: 1300,
          alt: chineseCopy.cover.imageAlt,
        },
      ],
    },
    twitter: { images: [chineseCoverUrl] },
  });
  expect(englishIridiumSprinklerMetadata.robots).toBeUndefined();
  expect(chineseIridiumSprinklerMetadata.robots).toBeUndefined();
});

it("publishes seven ordered projects in CollectionPage structured data", () => {
  const englishCopy = getIridiumSprinklerLayoutPageCopy("en");
  const chineseCopy = getIridiumSprinklerLayoutPageCopy("zh-CN");
  const englishCanonicalUrl = `https://stardewvalleyplanner.art${iridiumSprinklerLayoutCanonicalPath}`;
  const chineseCanonicalUrl = `https://stardewvalleyplanner.art/zh${iridiumSprinklerLayoutCanonicalPath}`;
  const englishStructuredData = createIridiumSprinklerLayoutPageStructuredData("en");
  const chineseStructuredData = createIridiumSprinklerLayoutPageStructuredData("zh-CN");
  const englishItemList = englishStructuredData.mainEntity as IridiumSprinklerItemList;
  const chineseItemList = chineseStructuredData.mainEntity as IridiumSprinklerItemList;

  expect(englishStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: englishCopy.title,
    description: englishCopy.description,
    inLanguage: "en",
    url: `https://stardewvalleyplanner.art${iridiumSprinklerLayoutCanonicalPath}`,
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `https://stardewvalleyplanner.art${englishCopy.cover.imageSrc}`,
      width: 1600,
      height: 1300,
    },
  });
  expect(chineseStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: chineseCopy.title,
    description: chineseCopy.description,
    inLanguage: "zh-CN",
    url: `https://stardewvalleyplanner.art/zh${iridiumSprinklerLayoutCanonicalPath}`,
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `https://stardewvalleyplanner.art${chineseCopy.cover.imageSrc}`,
      width: 1600,
      height: 1300,
    },
  });

  for (const [itemList, pageCopy, localizedPageUrl] of [
    [englishItemList, englishCopy, `https://stardewvalleyplanner.art${iridiumSprinklerLayoutCanonicalPath}`],
    [chineseItemList, chineseCopy, `https://stardewvalleyplanner.art/zh${iridiumSprinklerLayoutCanonicalPath}`],
  ] as const) {
    expect(itemList).toMatchObject({ "@type": "ItemList", numberOfItems: 7 });
    expect(itemList.itemListElement).toEqual(
      pageCopy.cases.map((layoutCase, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: layoutCase.title,
        description: layoutCase.summary,
        url: `${localizedPageUrl}#${layoutCase.id}`,
      })),
    );
  }

  expect(englishStructuredData.breadcrumb).toMatchObject({
    "@type": "BreadcrumbList",
  });
  expect(JSON.stringify(englishStructuredData.breadcrumb)).toContain(
    `"name":"Iridium Sprinkler Layouts","item":"${englishCanonicalUrl}"`,
  );
  expect(chineseStructuredData.breadcrumb).toMatchObject({
    "@type": "BreadcrumbList",
  });
  expect(JSON.stringify(chineseStructuredData.breadcrumb)).toContain(
    `"name":"铱金洒水器布局","item":"${chineseCanonicalUrl}"`,
  );
});

it("server-renders the paired page shells and structured data", () => {
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishIridiumSprinklerLayoutPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseIridiumSprinklerLayoutPage),
  );
  const englishStructuredData = createIridiumSprinklerLayoutPageStructuredData("en");
  const chineseStructuredData = createIridiumSprinklerLayoutPageStructuredData("zh-CN");

  expect(englishMarkup).toContain('data-public-page-shell="true"');
  expect(chineseMarkup).toContain('data-public-page-shell="true"');
  expect(englishMarkup).toContain('data-iridium-sprinkler-layout-page="true"');
  expect(chineseMarkup).toContain('data-iridium-sprinkler-layout-page="true"');
  expect(englishMarkup).toContain(JSON.stringify(englishStructuredData["@type"]));
  expect(chineseMarkup).toContain(JSON.stringify(chineseStructuredData["@type"]));
});
