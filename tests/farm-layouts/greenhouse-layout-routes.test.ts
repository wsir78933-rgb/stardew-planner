import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishGreenhouseLayoutPage, {
  dynamic as englishGreenhouseLayoutDynamic,
  metadata as englishGreenhouseLayoutMetadata,
} from "../../app/(en)/stardew-greenhouse-layout/page";
import ChineseGreenhouseLayoutPage, {
  dynamic as chineseGreenhouseLayoutDynamic,
  metadata as chineseGreenhouseLayoutMetadata,
} from "../../app/zh/stardew-greenhouse-layout/page";
import sitemap from "../../app/sitemap";
import {
  getFeaturedGreenhouseLayoutCase,
  getGreenhouseLayoutPageCopy,
  greenhouseLayoutCanonicalPath,
} from "../../src/farm-layouts/greenhouse-layout-content";
import {
  canonicalPublicPaths,
  getLocalizedIndexablePublicRouteEntries,
  getLocalizedPublicRouteEntries,
} from "../../src/i18n/public-route-registry";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

type GreenhouseLayoutStructuredData = Readonly<{
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

function readGreenhouseLayoutStructuredData(
  markup: string,
): GreenhouseLayoutStructuredData {
  const serializedStructuredData = markup.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/u,
  )?.[1];
  if (serializedStructuredData === undefined) {
    throw new Error(
      `Greenhouse Layout route markup is missing its JSON-LD script. Received markup length: ${markup.length}.`,
    );
  }

  return JSON.parse(serializedStructuredData) as GreenhouseLayoutStructuredData;
}

it("registers paired static Greenhouse Layout routes with canonical metadata and sitemap entries", () => {
  const englishCopy = getGreenhouseLayoutPageCopy("en");
  const chineseCopy = getGreenhouseLayoutPageCopy("zh-CN");
  const englishFeaturedCase = getFeaturedGreenhouseLayoutCase("en");
  const chineseFeaturedCase = getFeaturedGreenhouseLayoutCase("zh-CN");
  const englishCanonicalUrl = createCanonicalUrl(greenhouseLayoutCanonicalPath);
  const chineseCanonicalUrl = createCanonicalUrl(`/zh${greenhouseLayoutCanonicalPath}`);
  const localizedGreenhouseEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) => canonicalPath === greenhouseLayoutCanonicalPath,
  );
  const indexableEntries = getLocalizedIndexablePublicRouteEntries();
  const sitemapPathnames = sitemap().map(({ url }) => new URL(url).pathname);
  const wildernessIndex = canonicalPublicPaths.indexOf(
    "/stardew-valley-wilderness-farm-layout",
  );
  const greenhouseIndex = canonicalPublicPaths.indexOf(greenhouseLayoutCanonicalPath);
  const sprinklerIndex = canonicalPublicPaths.indexOf(
    "/stardew-valley-sprinkler-layout",
  );

  expect(greenhouseLayoutCanonicalPath).toBe("/stardew-greenhouse-layout");
  expect(canonicalPublicPaths).toHaveLength(60);
  expect(greenhouseIndex).toBe(wildernessIndex + 1);
  expect(sprinklerIndex).toBe(greenhouseIndex + 1);
  expect(getLocalizedPublicRouteEntries()).toHaveLength(120);
  expect(indexableEntries).toHaveLength(118);
  expect(localizedGreenhouseEntries).toEqual([
    {
      locale: "en",
      canonicalPath: greenhouseLayoutCanonicalPath,
      pathname: greenhouseLayoutCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: greenhouseLayoutCanonicalPath,
      pathname: `/zh${greenhouseLayoutCanonicalPath}`,
    },
  ]);
  expect(sitemapPathnames).toContain(greenhouseLayoutCanonicalPath);
  expect(sitemapPathnames).toContain(`/zh${greenhouseLayoutCanonicalPath}`);
  expect(sitemapPathnames).toHaveLength(indexableEntries.length + 2);
  expect(englishGreenhouseLayoutDynamic).toBe("force-static");
  expect(chineseGreenhouseLayoutDynamic).toBe("force-static");

  expect(englishGreenhouseLayoutMetadata).toMatchObject({
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
      images: [createCanonicalUrl(englishFeaturedCase.imageSrc)],
    },
    twitter: { images: [createCanonicalUrl(englishFeaturedCase.imageSrc)] },
  });
  expect(chineseGreenhouseLayoutMetadata).toMatchObject({
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
      images: [createCanonicalUrl(chineseFeaturedCase.imageSrc)],
    },
    twitter: { images: [createCanonicalUrl(chineseFeaturedCase.imageSrc)] },
  });
  expect(englishGreenhouseLayoutMetadata.robots).toBeUndefined();
  expect(chineseGreenhouseLayoutMetadata.robots).toBeUndefined();
});

it.each([
  {
    locale: "en",
    page: EnglishGreenhouseLayoutPage,
    copy: getGreenhouseLayoutPageCopy("en"),
    featuredCase: getFeaturedGreenhouseLayoutCase("en"),
  },
  {
    locale: "zh-CN",
    page: ChineseGreenhouseLayoutPage,
    copy: getGreenhouseLayoutPageCopy("zh-CN"),
    featuredCase: getFeaturedGreenhouseLayoutCase("zh-CN"),
  },
] as const)(
  "publishes seven ordered Greenhouse Layout cases in JSON-LD for $locale",
  (route) => {
    const markup = renderToStaticMarkup(createElement(route.page));
    const structuredData = readGreenhouseLayoutStructuredData(markup);
    const pagePath = route.locale === "en"
      ? greenhouseLayoutCanonicalPath
      : `/zh${greenhouseLayoutCanonicalPath}`;
    const pageUrl = createCanonicalUrl(pagePath);

    expect(markup).toContain('data-public-page-shell="true"');
    expect(markup).toContain('data-greenhouse-layout-page="true"');
    expect(markup.match(/data-greenhouse-layout-case=/gu) ?? []).toHaveLength(7);
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
    expect(structuredData.mainEntity.itemListElement).toEqual(
      route.copy.cases.map((layoutCase, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: layoutCase.title,
        description: layoutCase.summary,
        url: `${pageUrl}#${layoutCase.id}`,
      })),
    );
  },
);

it("advertises both Greenhouse Layout pages in llms.txt", () => {
  const llmsText = readFileSync(join(process.cwd(), "public", "llms.txt"), "utf8");
  const englishCopy = getGreenhouseLayoutPageCopy("en");
  const chineseCopy = getGreenhouseLayoutPageCopy("zh-CN");

  expect(llmsText).toContain(
    `[${englishCopy.title}](${createCanonicalUrl(greenhouseLayoutCanonicalPath)}): ${englishCopy.description}`,
  );
  expect(llmsText).toContain(
    `[${chineseCopy.title}](${createCanonicalUrl(`/zh${greenhouseLayoutCanonicalPath}`)}): ${chineseCopy.description}`,
  );
});
