import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishGreenhouseSprinklerLayoutPage, {
  dynamic as englishGreenhouseSprinklerLayoutDynamic,
  metadata as englishGreenhouseSprinklerLayoutMetadata,
} from "../../app/(en)/greenhouse-sprinkler-layout-stardew/page";
import ChineseGreenhouseSprinklerLayoutPage, {
  dynamic as chineseGreenhouseSprinklerLayoutDynamic,
  metadata as chineseGreenhouseSprinklerLayoutMetadata,
} from "../../app/zh/greenhouse-sprinkler-layout-stardew/page";
import sitemap from "../../app/sitemap";
import {
  getGreenhouseSprinklerLayoutPageCopy,
  greenhouseSprinklerLayoutCanonicalPath,
} from "../../src/farm-layouts/greenhouse-sprinkler-layout-content";
import { greenhouseLayoutCanonicalPath } from "../../src/farm-layouts/greenhouse-layout-content";
import { createGreenhouseSprinklerLayoutPageStructuredData } from "../../src/farm-layouts/greenhouse-sprinkler-layout-structured-data";
import {
  getFarmLayoutsNavigationModel,
  readFarmLayoutsNavigationCategory,
} from "../../src/farm-layouts/farm-layouts-navigation-model";
import {
  canonicalPublicPaths,
  getLocalizedIndexablePublicRouteEntries,
  getLocalizedPublicRouteEntries,
} from "../../src/i18n/public-route-registry";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

type GreenhouseSprinklerLayoutItemList = Readonly<{
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

type GreenhouseSprinklerLayoutBreadcrumbItem = Readonly<{
  "@type": string;
  position: number;
  name: string;
  item?: string;
}>;

function readGreenhouseSprinklerLayoutBreadcrumb(
  structuredData: Record<string, unknown>,
): readonly GreenhouseSprinklerLayoutBreadcrumbItem[] {
  const breadcrumb = structuredData.breadcrumb;
  if (typeof breadcrumb !== "object" || breadcrumb === null) {
    throw new Error(
      `Greenhouse sprinkler layout structured data is missing breadcrumb. Received: ${JSON.stringify(breadcrumb)}.`,
    );
  }

  const itemListElement = (breadcrumb as Record<string, unknown>).itemListElement;
  if (!Array.isArray(itemListElement)) {
    throw new Error(
      `Greenhouse sprinkler layout breadcrumb is missing itemListElement. Received: ${JSON.stringify(breadcrumb)}.`,
    );
  }

  return itemListElement as readonly GreenhouseSprinklerLayoutBreadcrumbItem[];
}

function readRenderedGreenhouseSprinklerLayoutIds(
  markup: string,
): ReadonlySet<string> {
  const renderedIds = Array.from(
    markup.matchAll(/\bid="([^"]+)"/g),
    ([, renderedId]) => {
      if (renderedId === undefined) {
        throw new Error(
          `Greenhouse sprinkler layout markup contains an invalid id attribute match: ${JSON.stringify(markup)}.`,
        );
      }
      return renderedId;
    },
  );

  return new Set(renderedIds);
}

it("registers both localized greenhouse routes after the tree layout and in the sitemap", () => {
  const localizedEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) =>
      canonicalPath === greenhouseSprinklerLayoutCanonicalPath,
  );
  const sitemapPathnames = sitemap().map(({ url }) => new URL(url).pathname);
  const greenhouseTreeIndex = canonicalPublicPaths.indexOf(
    "/stardew-greenhouse-tree-layout",
  );
  const greenhouseSprinklerIndex = canonicalPublicPaths.indexOf(
    greenhouseSprinklerLayoutCanonicalPath,
  );

  expect(greenhouseSprinklerLayoutCanonicalPath).toBe(
    "/greenhouse-sprinkler-layout-stardew",
  );
  expect(canonicalPublicPaths).toHaveLength(60);
  expect(greenhouseTreeIndex).toBeLessThan(greenhouseSprinklerIndex);
  expect(greenhouseSprinklerIndex).toBe(canonicalPublicPaths.length - 1);
  expect(getLocalizedPublicRouteEntries()).toHaveLength(120);
  expect(getLocalizedIndexablePublicRouteEntries()).toHaveLength(118);
  expect(localizedEntries).toEqual([
    {
      locale: "en",
      canonicalPath: greenhouseSprinklerLayoutCanonicalPath,
      pathname: greenhouseSprinklerLayoutCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: greenhouseSprinklerLayoutCanonicalPath,
      pathname: `/zh${greenhouseSprinklerLayoutCanonicalPath}`,
    },
  ]);
  expect(sitemapPathnames).toContain(greenhouseSprinklerLayoutCanonicalPath);
  expect(sitemapPathnames).toContain(
    `/zh${greenhouseSprinklerLayoutCanonicalPath}`,
  );
  expect(sitemapPathnames).toHaveLength(120);
  expect(englishGreenhouseSprinklerLayoutDynamic).toBe("force-static");
  expect(chineseGreenhouseSprinklerLayoutDynamic).toBe("force-static");

  for (const locale of ["en", "zh-CN"] as const) {
    const greenhouseCategory = readFarmLayoutsNavigationCategory(
      getFarmLayoutsNavigationModel(locale),
      "greenhouse-layouts",
    );

    expect(greenhouseCategory.pages.map(({ id }) => id)).toEqual([
      "greenhouse-tree-layout",
      "greenhouse-sprinkler-layout",
      "greenhouse-layout",
    ]);
    expect(greenhouseCategory.pages[1]).toEqual({
      href:
        locale === "zh-CN"
          ? `/zh${greenhouseSprinklerLayoutCanonicalPath}`
          : greenhouseSprinklerLayoutCanonicalPath,
      id: "greenhouse-sprinkler-layout",
      label:
        locale === "zh-CN"
          ? "温室洒水器布局"
          : "Greenhouse Sprinkler Layouts",
    });
    expect(greenhouseCategory.pages[2]).toEqual({
      href:
        locale === "zh-CN"
          ? `/zh${greenhouseLayoutCanonicalPath}`
          : greenhouseLayoutCanonicalPath,
      id: "greenhouse-layout",
      label: locale === "zh-CN" ? "温室布局" : "Greenhouse Layouts",
    });
  }
});

it("publishes bilingual metadata, Greenhouse breadcrumbs, six case items, and llms links", () => {
  const englishCopy = getGreenhouseSprinklerLayoutPageCopy("en");
  const chineseCopy = getGreenhouseSprinklerLayoutPageCopy("zh-CN");
  const englishUrl = createCanonicalUrl(greenhouseSprinklerLayoutCanonicalPath);
  const chineseUrl = createCanonicalUrl(
    `/zh${greenhouseSprinklerLayoutCanonicalPath}`,
  );
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishGreenhouseSprinklerLayoutPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseGreenhouseSprinklerLayoutPage),
  );
  const englishStructuredData =
    createGreenhouseSprinklerLayoutPageStructuredData("en");
  const chineseStructuredData =
    createGreenhouseSprinklerLayoutPageStructuredData("zh-CN");
  const llmsText = readFileSync(join(process.cwd(), "public/llms.txt"), "utf8");

  expect(englishGreenhouseSprinklerLayoutMetadata).toMatchObject({
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
  });
  expect(chineseGreenhouseSprinklerLayoutMetadata).toMatchObject({
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
  });
  expect(englishGreenhouseSprinklerLayoutMetadata.robots).toBeUndefined();
  expect(chineseGreenhouseSprinklerLayoutMetadata.robots).toBeUndefined();
  expect(englishMarkup).toContain(
    'data-greenhouse-sprinkler-layout-page="true"',
  );
  expect(chineseMarkup).toContain(
    'data-greenhouse-sprinkler-layout-page="true"',
  );

  for (const [structuredData, pageCopy, pathname, locale] of [
    [
      englishStructuredData,
      englishCopy,
      greenhouseSprinklerLayoutCanonicalPath,
      "en",
    ],
    [
      chineseStructuredData,
      chineseCopy,
      `/zh${greenhouseSprinklerLayoutCanonicalPath}`,
      "zh-CN",
    ],
  ] as const) {
    const itemList = structuredData.mainEntity as GreenhouseSprinklerLayoutItemList;
    const breadcrumb = readGreenhouseSprinklerLayoutBreadcrumb(structuredData);
    const localizedPageUrl = createCanonicalUrl(pathname);
    const localizedMarkup = locale === "en" ? englishMarkup : chineseMarkup;
    const renderedElementIds = readRenderedGreenhouseSprinklerLayoutIds(
      localizedMarkup,
    );

    expect(structuredData).toMatchObject({
      "@type": "CollectionPage",
      name: pageCopy.title,
      description: pageCopy.description,
      inLanguage: locale,
      url: localizedPageUrl,
      primaryImageOfPage: {
        "@type": "ImageObject",
        contentUrl: createCanonicalUrl(pageCopy.cover.imageSrc),
        caption: pageCopy.cover.imageAlt,
        width: pageCopy.cover.imageWidth,
        height: pageCopy.cover.imageHeight,
      },
    });
    expect(breadcrumb).toMatchObject([
      {
        "@type": "ListItem",
        position: 1,
        item: createCanonicalUrl(locale === "en" ? "/" : "/zh"),
      },
      { "@type": "ListItem", position: 2, name: "Farm Layouts" },
      {
        "@type": "ListItem",
        position: 3,
        name: locale === "en" ? "Greenhouse Layouts" : "温室布局",
      },
      {
        "@type": "ListItem",
        position: 4,
        name:
          locale === "en"
            ? "Greenhouse Sprinkler Layouts"
            : "温室洒水器布局",
        item: localizedPageUrl,
      },
    ]);
    expect(itemList).toMatchObject({
      "@type": "ItemList",
      numberOfItems: 6,
    });
    expect(itemList.itemListElement).toHaveLength(6);
    expect(
      itemList.itemListElement.map(
        ({ "@type": itemType, position, name, description }) => ({
          "@type": itemType,
          position,
          name,
          description,
        }),
      ),
    ).toEqual(
      pageCopy.cases.map((layoutCase, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: layoutCase.title,
        description: layoutCase.summary,
      })),
    );

    for (const itemListEntry of itemList.itemListElement) {
      const itemUrl = new URL(itemListEntry.url);
      if (itemUrl.hash.length < 2) {
        throw new Error(
          `Greenhouse sprinkler layout ItemList entry is missing a case fragment: ${JSON.stringify(itemListEntry.url)}.`,
        );
      }

      expect(itemUrl.origin).toBe(new URL(localizedPageUrl).origin);
      expect(itemUrl.pathname).toBe(new URL(localizedPageUrl).pathname);
      expect(renderedElementIds).toContain(decodeURIComponent(itemUrl.hash.slice(1)));
    }
  }

  expect(llmsText).toContain(
    `[${englishCopy.title}](${englishUrl}): ${englishCopy.description}`,
  );
  expect(llmsText).toContain(
    `[${chineseCopy.title}](${chineseUrl}): ${chineseCopy.description}`,
  );
});
