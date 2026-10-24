import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishBedroomDesignPage, {
  dynamic as englishBedroomDesignDynamic,
  metadata as englishBedroomDesignMetadata,
} from "../../app/(en)/stardew-valley-bedroom-design/page";
import ChineseBedroomDesignPage, {
  dynamic as chineseBedroomDesignDynamic,
  metadata as chineseBedroomDesignMetadata,
} from "../../app/zh/stardew-valley-bedroom-design/page";
import sitemap from "../../app/sitemap";
import {
  bedroomDesignCanonicalPath,
  getBedroomDesignPageCopy,
  getFeaturedBedroomDesignCase,
} from "../../src/farm-layouts/bedroom-design-content";
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

const expectedBedroomDesignCaseIds = [
  "02-stardew-valley-bedroom-design-emily-ocean-aquarium",
  "03-stardew-valley-bedroom-design-penny-spouse-suite",
  "04-stardew-valley-bedroom-design-cozy-kids-loft",
  "05-stardew-valley-bedroom-design-attic-cozy",
  "06-stardew-valley-bedroom-design-cottagecore-kids",
  "07-stardew-valley-bedroom-design-wizard-junimo-bedroom",
] as const;

type BedroomDesignStructuredData = Readonly<{
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

function readBedroomDesignStructuredData(
  markup: string,
): BedroomDesignStructuredData {
  const serializedStructuredData = markup.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/u,
  )?.[1];
  if (serializedStructuredData === undefined) {
    throw new Error(
      `Bedroom Design route markup is missing its JSON-LD script. Received markup length: ${markup.length}.`,
    );
  }

  return JSON.parse(serializedStructuredData) as BedroomDesignStructuredData;
}

it("registers paired Bedroom Design routes with canonical metadata, navigation, and sitemap entries", () => {
  const englishCopy = getBedroomDesignPageCopy("en");
  const chineseCopy = getBedroomDesignPageCopy("zh-CN");
  const englishFeaturedCase = getFeaturedBedroomDesignCase("en");
  const chineseFeaturedCase = getFeaturedBedroomDesignCase("zh-CN");
  const englishCanonicalUrl = createCanonicalUrl(bedroomDesignCanonicalPath);
  const chineseCanonicalUrl = createCanonicalUrl(`/zh${bedroomDesignCanonicalPath}`);
  const localizedBedroomDesignEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) => canonicalPath === bedroomDesignCanonicalPath,
  );
  const sitemapPathnames = sitemap().map(({ url }) => new URL(url).pathname);
  const bedroomDesignIndex = canonicalPublicPaths.indexOf(
    bedroomDesignCanonicalPath,
  );

  expect(bedroomDesignCanonicalPath).toBe("/stardew-valley-bedroom-design");
  expect(canonicalPublicPaths).toHaveLength(61);
  expect(bedroomDesignIndex).toBe(canonicalPublicPaths.length - 1);
  expect(getLocalizedPublicRouteEntries()).toHaveLength(122);
  expect(getLocalizedIndexablePublicRouteEntries()).toHaveLength(120);
  expect(localizedBedroomDesignEntries).toEqual([
    {
      locale: "en",
      canonicalPath: bedroomDesignCanonicalPath,
      pathname: bedroomDesignCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: bedroomDesignCanonicalPath,
      pathname: `/zh${bedroomDesignCanonicalPath}`,
    },
  ]);
  expect(sitemapPathnames).toContain(bedroomDesignCanonicalPath);
  expect(sitemapPathnames).toContain(`/zh${bedroomDesignCanonicalPath}`);
  expect(sitemapPathnames).toHaveLength(122);
  expect(englishBedroomDesignDynamic).toBe("force-static");
  expect(chineseBedroomDesignDynamic).toBe("force-static");

  expect(englishBedroomDesignMetadata).toMatchObject({
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
  expect(chineseBedroomDesignMetadata).toMatchObject({
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
  expect(englishBedroomDesignMetadata.robots).toBeUndefined();
  expect(chineseBedroomDesignMetadata.robots).toBeUndefined();

  for (const locale of ["en", "zh-CN"] as const) {
    const buildingsInteriors = readFarmLayoutsNavigationCategory(
      getFarmLayoutsNavigationModel(locale),
      "buildings-interiors",
    );

    expect(buildingsInteriors.pages).toContainEqual({
      href:
        locale === "zh-CN"
          ? `/zh${bedroomDesignCanonicalPath}`
          : bedroomDesignCanonicalPath,
      id: "bedroom-design",
      label: locale === "zh-CN" ? "卧室设计" : "Bedroom Design",
    });
  }
});

it.each([
  {
    locale: "en",
    page: EnglishBedroomDesignPage,
    copy: getBedroomDesignPageCopy("en"),
    featuredCase: getFeaturedBedroomDesignCase("en"),
  },
  {
    locale: "zh-CN",
    page: ChineseBedroomDesignPage,
    copy: getBedroomDesignPageCopy("zh-CN"),
    featuredCase: getFeaturedBedroomDesignCase("zh-CN"),
  },
] as const)(
  "keeps the 01 cover separate from six ordered bedroom layouts for $locale",
  (route) => {
    const markup = renderToStaticMarkup(createElement(route.page));
    const structuredData = readBedroomDesignStructuredData(markup);
    const pagePath = route.locale === "en"
      ? bedroomDesignCanonicalPath
      : `/zh${bedroomDesignCanonicalPath}`;
    const pageUrl = createCanonicalUrl(pagePath);
    const bedroomDesignCaseIds = route.copy.cases.map(({ id }) => id);

    expect(route.featuredCase.id).toBe(
      "01-stardew-valley-bedroom-design-warm-red-classic",
    );
    expect(bedroomDesignCaseIds).toEqual(expectedBedroomDesignCaseIds);
    expect(markup).toContain('data-public-page-shell="true"');
    expect(markup).toContain('data-bedroom-design-page="true"');
    expect(markup).toContain(
      `data-bedroom-design-featured-case="${route.featuredCase.id}"`,
    );
    expect(markup.match(/data-bedroom-design-case=/gu) ?? []).toHaveLength(6);
    expect(bedroomDesignCaseIds).not.toContain(route.featuredCase.id);

    for (const bedroomCase of route.copy.cases) {
      expect(markup).toContain(`href="${bedroomCase.projectHref}"`);
    }

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
        numberOfItems: 6,
      },
    });
    expect(structuredData.mainEntity.itemListElement).toEqual(
      route.copy.cases.map((bedroomCase, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: bedroomCase.title,
        description: bedroomCase.summary,
        url: `${pageUrl}#${bedroomCase.id}`,
      })),
    );
  },
);

it("advertises both Bedroom Design pages in llms.txt", () => {
  const llmsText = readFileSync(join(process.cwd(), "public", "llms.txt"), "utf8");
  const englishCopy = getBedroomDesignPageCopy("en");
  const chineseCopy = getBedroomDesignPageCopy("zh-CN");

  expect(llmsText).toContain(
    `[${englishCopy.title}](${createCanonicalUrl(bedroomDesignCanonicalPath)}): ${englishCopy.description}`,
  );
  expect(llmsText).toContain(
    `[${chineseCopy.title}](${createCanonicalUrl(`/zh${bedroomDesignCanonicalPath}`)}): ${chineseCopy.description}`,
  );
});
