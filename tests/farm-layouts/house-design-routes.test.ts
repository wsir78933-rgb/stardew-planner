import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishHouseDesignPage, {
  dynamic as englishHouseDesignDynamic,
  metadata as englishHouseDesignMetadata,
} from "../../app/(en)/stardew-valley-house-design/page";
import ChineseHouseDesignPage, {
  dynamic as chineseHouseDesignDynamic,
  metadata as chineseHouseDesignMetadata,
} from "../../app/zh/stardew-valley-house-design/page";
import sitemap from "../../app/sitemap";
import {
  getHouseDesignPageCopy,
  houseDesignCanonicalPath,
} from "../../src/farm-layouts/house-design-content";
import { createHouseDesignPageStructuredData } from "../../src/farm-layouts/house-design-structured-data";
import {
  getFarmLayoutsNavigationModel,
  readFarmLayoutsNavigationCategory,
} from "../../src/farm-layouts/farm-layouts-navigation-model";
import {
  canonicalPublicPaths,
  getLocalizedIndexablePublicRouteEntries,
  getLocalizedPublicRouteEntries,
} from "../../src/i18n/public-route-registry";
import { getPublicPageCopy } from "../../src/i18n/public-page-content";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

type HouseDesignItemList = Readonly<{
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

type HouseDesignBreadcrumbItem = Readonly<{
  "@type": string;
  position: number;
  name: string;
  item?: string;
}>;

function readHouseDesignBreadcrumb(
  structuredData: Record<string, unknown>,
): readonly HouseDesignBreadcrumbItem[] {
  const breadcrumb = structuredData.breadcrumb;
  if (typeof breadcrumb !== "object" || breadcrumb === null) {
    throw new Error(
      `House Design structured data is missing breadcrumb. Received: ${JSON.stringify(breadcrumb)}.`,
    );
  }

  const itemListElement = (breadcrumb as Record<string, unknown>).itemListElement;
  if (!Array.isArray(itemListElement)) {
    throw new Error(
      `House Design breadcrumb is missing itemListElement. Received: ${JSON.stringify(breadcrumb)}.`,
    );
  }

  return itemListElement as readonly HouseDesignBreadcrumbItem[];
}

function readRenderedHouseDesignIds(markup: string): ReadonlySet<string> {
  const renderedIds = Array.from(
    markup.matchAll(/\bid="([^"]+)"/g),
    ([, renderedId]) => {
      if (renderedId === undefined) {
        throw new Error(
          `House Design markup contains an invalid id attribute match. Received: ${JSON.stringify(markup)}.`,
        );
      }
      return renderedId;
    },
  );

  return new Set(renderedIds);
}

it("registers House Design in both locales, Buildings & Interiors, and the sitemap", () => {
  const localizedEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) => canonicalPath === houseDesignCanonicalPath,
  );
  const sitemapPathnames = sitemap().map(({ url }) => new URL(url).pathname);
  const houseDesignIndex = canonicalPublicPaths.indexOf(houseDesignCanonicalPath);

  expect(houseDesignCanonicalPath).toBe("/stardew-valley-house-design");
  expect(canonicalPublicPaths).toHaveLength(61);
  expect(houseDesignIndex).toBe(canonicalPublicPaths.length - 1);
  expect(getLocalizedPublicRouteEntries()).toHaveLength(122);
  expect(getLocalizedIndexablePublicRouteEntries()).toHaveLength(120);
  expect(localizedEntries).toEqual([
    {
      locale: "en",
      canonicalPath: houseDesignCanonicalPath,
      pathname: houseDesignCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: houseDesignCanonicalPath,
      pathname: `/zh${houseDesignCanonicalPath}`,
    },
  ]);
  expect(sitemapPathnames).toContain(houseDesignCanonicalPath);
  expect(sitemapPathnames).toContain(`/zh${houseDesignCanonicalPath}`);
  expect(sitemapPathnames).toHaveLength(122);
  expect(englishHouseDesignDynamic).toBe("force-static");
  expect(chineseHouseDesignDynamic).toBe("force-static");

  for (const locale of ["en", "zh-CN"] as const) {
    const buildingsCategory = readFarmLayoutsNavigationCategory(
      getFarmLayoutsNavigationModel(locale),
      "buildings-interiors",
    );

    expect(buildingsCategory.pages).toContainEqual({
      href:
        locale === "zh-CN"
          ? `/zh${houseDesignCanonicalPath}`
          : houseDesignCanonicalPath,
      id: "house-design",
      label: locale === "zh-CN" ? "房屋设计" : "House Design",
    });
  }
});

it("publishes bilingual metadata, breadcrumbs, six anchored cases, and llms links", () => {
  const englishCopy = getHouseDesignPageCopy("en");
  const chineseCopy = getHouseDesignPageCopy("zh-CN");
  const englishUrl = createCanonicalUrl(houseDesignCanonicalPath);
  const chineseUrl = createCanonicalUrl(`/zh${houseDesignCanonicalPath}`);
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishHouseDesignPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseHouseDesignPage),
  );
  const englishStructuredData = createHouseDesignPageStructuredData("en");
  const chineseStructuredData = createHouseDesignPageStructuredData("zh-CN");
  const llmsText = readFileSync(join(process.cwd(), "public/llms.txt"), "utf8");

  expect(englishHouseDesignMetadata).toMatchObject({
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
  expect(chineseHouseDesignMetadata).toMatchObject({
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
  expect(englishHouseDesignMetadata.robots).toBeUndefined();
  expect(chineseHouseDesignMetadata.robots).toBeUndefined();
  expect(englishMarkup).toContain('data-house-design-page="true"');
  expect(chineseMarkup).toContain('data-house-design-page="true"');

  for (const [structuredData, pageCopy, pathname, locale] of [
    [englishStructuredData, englishCopy, houseDesignCanonicalPath, "en"],
    [chineseStructuredData, chineseCopy, `/zh${houseDesignCanonicalPath}`, "zh-CN"],
  ] as const) {
    const itemList = structuredData.mainEntity as HouseDesignItemList;
    const breadcrumb = readHouseDesignBreadcrumb(structuredData);
    const localizedPageUrl = createCanonicalUrl(pathname);
    const localizedMarkup = locale === "en" ? englishMarkup : chineseMarkup;
    const renderedElementIds = readRenderedHouseDesignIds(localizedMarkup);

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
    expect(breadcrumb).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: getPublicPageCopy(locale).footer.brandName,
        item: createCanonicalUrl(locale === "en" ? "/" : "/zh"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "en" ? "House Design" : "房屋设计",
        item: localizedPageUrl,
      },
    ]);
    expect(itemList).toMatchObject({ "@type": "ItemList", numberOfItems: 6 });
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
      pageCopy.cases.map((houseDesignCase, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: houseDesignCase.title,
        description: houseDesignCase.summary,
      })),
    );

    for (const itemListEntry of itemList.itemListElement) {
      const itemUrl = new URL(itemListEntry.url);
      if (itemUrl.hash.length < 2) {
        throw new Error(
          `House Design ItemList entry is missing a case fragment. Received: ${JSON.stringify(itemListEntry.url)}.`,
        );
      }

      expect(itemUrl.origin).toBe(new URL(localizedPageUrl).origin);
      expect(itemUrl.pathname).toBe(new URL(localizedPageUrl).pathname);
      expect(renderedElementIds).toContain(
        decodeURIComponent(itemUrl.hash.slice(1)),
      );
    }
  }

  expect(llmsText).toContain(
    `[${englishCopy.title}](${englishUrl}): ${englishCopy.description}`,
  );
  expect(llmsText).toContain(
    `[${chineseCopy.title}](${chineseUrl}): ${chineseCopy.description}`,
  );
});
