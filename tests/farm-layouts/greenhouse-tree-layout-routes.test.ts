import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishGreenhouseTreeLayoutPage, {
  dynamic as englishGreenhouseTreeLayoutDynamic,
  metadata as englishGreenhouseTreeLayoutMetadata,
} from "../../app/(en)/stardew-greenhouse-tree-layout/page";
import ChineseGreenhouseTreeLayoutPage, {
  dynamic as chineseGreenhouseTreeLayoutDynamic,
  metadata as chineseGreenhouseTreeLayoutMetadata,
} from "../../app/zh/stardew-greenhouse-tree-layout/page";
import sitemap from "../../app/sitemap";
import {
  getGreenhouseTreeLayoutPageCopy,
  greenhouseTreeLayoutCanonicalPath,
} from "../../src/farm-layouts/greenhouse-tree-layout-content";
import { greenhouseSprinklerLayoutCanonicalPath } from "../../src/farm-layouts/greenhouse-sprinkler-layout-content";
import { createGreenhouseTreeLayoutPageStructuredData } from "../../src/farm-layouts/greenhouse-tree-layout-structured-data";
import {
  canonicalPublicPaths,
  getLocalizedIndexablePublicRouteEntries,
  getLocalizedPublicRouteEntries,
} from "../../src/i18n/public-route-registry";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

type GreenhouseTreeLayoutItemList = Readonly<{
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

type GreenhouseTreeLayoutBreadcrumb = Readonly<{
  "@type": string;
  position: number;
  name: string;
  item?: string;
}>;

function readGreenhouseTreeLayoutBreadcrumb(
  structuredData: Record<string, unknown>,
): readonly GreenhouseTreeLayoutBreadcrumb[] {
  const breadcrumb = structuredData.breadcrumb;
  if (typeof breadcrumb !== "object" || breadcrumb === null) {
    throw new Error(
      `Greenhouse tree layout structured data is missing breadcrumb. Received: ${JSON.stringify(breadcrumb)}.`,
    );
  }

  const itemListElement = (breadcrumb as Record<string, unknown>).itemListElement;
  if (!Array.isArray(itemListElement)) {
    throw new Error(
      `Greenhouse tree layout breadcrumb is missing itemListElement. Received: ${JSON.stringify(breadcrumb)}.`,
    );
  }

  return itemListElement as readonly GreenhouseTreeLayoutBreadcrumb[];
}

it("registers both localized routes after existing farm layout topics and adds them to the sitemap", () => {
  const localizedEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) => canonicalPath === greenhouseTreeLayoutCanonicalPath,
  );
  const sitemapPathnames = sitemap().map(({ url }) => new URL(url).pathname);
  const fruitTreeIndex = canonicalPublicPaths.indexOf(
    "/stardew-valley-fruit-tree-layout",
  );
  const greenhouseTreeIndex = canonicalPublicPaths.indexOf(
    greenhouseTreeLayoutCanonicalPath,
  );
  const greenhouseSprinklerIndex = canonicalPublicPaths.indexOf(
    greenhouseSprinklerLayoutCanonicalPath,
  );

  expect(greenhouseTreeLayoutCanonicalPath).toBe(
    "/stardew-greenhouse-tree-layout",
  );
  expect(canonicalPublicPaths).toHaveLength(52);
  expect(greenhouseTreeIndex).toBe(canonicalPublicPaths.length - 2);
  expect(greenhouseSprinklerIndex).toBe(canonicalPublicPaths.length - 1);
  expect(fruitTreeIndex).toBeLessThan(greenhouseTreeIndex);
  expect(getLocalizedPublicRouteEntries()).toHaveLength(104);
  expect(getLocalizedIndexablePublicRouteEntries()).toHaveLength(102);
  expect(localizedEntries).toEqual([
    {
      locale: "en",
      canonicalPath: greenhouseTreeLayoutCanonicalPath,
      pathname: greenhouseTreeLayoutCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: greenhouseTreeLayoutCanonicalPath,
      pathname: `/zh${greenhouseTreeLayoutCanonicalPath}`,
    },
  ]);
  expect(sitemapPathnames).toContain(greenhouseTreeLayoutCanonicalPath);
  expect(sitemapPathnames).toContain(`/zh${greenhouseTreeLayoutCanonicalPath}`);
  expect(sitemapPathnames).toHaveLength(104);
  expect(englishGreenhouseTreeLayoutDynamic).toBe("force-static");
  expect(chineseGreenhouseTreeLayoutDynamic).toBe("force-static");
});

it("publishes bilingual metadata, Greenhouse breadcrumbs, and a six-case collection", () => {
  const englishCopy = getGreenhouseTreeLayoutPageCopy("en");
  const chineseCopy = getGreenhouseTreeLayoutPageCopy("zh-CN");
  const englishUrl = createCanonicalUrl(greenhouseTreeLayoutCanonicalPath);
  const chineseUrl = createCanonicalUrl(`/zh${greenhouseTreeLayoutCanonicalPath}`);
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishGreenhouseTreeLayoutPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseGreenhouseTreeLayoutPage),
  );
  const englishStructuredData = createGreenhouseTreeLayoutPageStructuredData("en");
  const chineseStructuredData =
    createGreenhouseTreeLayoutPageStructuredData("zh-CN");

  expect(englishGreenhouseTreeLayoutMetadata).toMatchObject({
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
  expect(chineseGreenhouseTreeLayoutMetadata).toMatchObject({
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
  expect(englishGreenhouseTreeLayoutMetadata.robots).toBeUndefined();
  expect(chineseGreenhouseTreeLayoutMetadata.robots).toBeUndefined();
  expect(englishMarkup).toContain('data-greenhouse-tree-layout-page="true"');
  expect(chineseMarkup).toContain('data-greenhouse-tree-layout-page="true"');

  for (const [structuredData, pageCopy, pathname, locale] of [
    [englishStructuredData, englishCopy, greenhouseTreeLayoutCanonicalPath, "en"],
    [chineseStructuredData, chineseCopy, `/zh${greenhouseTreeLayoutCanonicalPath}`, "zh-CN"],
  ] as const) {
    const itemList = structuredData.mainEntity as GreenhouseTreeLayoutItemList;
    const breadcrumb = readGreenhouseTreeLayoutBreadcrumb(structuredData);
    const localizedPageUrl = createCanonicalUrl(pathname);

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
        width: 640,
        height: 768,
      },
    });
    expect(itemList).toMatchObject({ "@type": "ItemList", numberOfItems: 6 });
    expect(itemList.itemListElement).toEqual(
      pageCopy.cases.map((layoutCase, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: layoutCase.title,
        description: layoutCase.summary,
        url: `${localizedPageUrl}#${layoutCase.id}`,
      })),
    );
    expect(breadcrumb).toEqual([
      expect.objectContaining({ position: 1 }),
      expect.objectContaining({ position: 2, name: "Farm Layouts" }),
      expect.objectContaining({
        position: 3,
        name: locale === "zh-CN" ? "温室布局" : "Greenhouse Layouts",
      }),
      expect.objectContaining({
        position: 4,
        name: locale === "zh-CN" ? "温室果树布局" : "Greenhouse Tree Layouts",
        item: localizedPageUrl,
      }),
    ]);
  }

  const llmsText = readFileSync(join(process.cwd(), "public/llms.txt"), "utf8");
  expect(llmsText).toContain(
    `[${englishCopy.title}](${englishUrl}): ${englishCopy.description}`,
  );
  expect(llmsText).toContain(
    `[${chineseCopy.title}](${chineseUrl}): ${chineseCopy.description}`,
  );
});
