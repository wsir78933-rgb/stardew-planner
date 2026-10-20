import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishBeachFarmLayoutsPage, {
  metadata as englishBeachFarmMetadata,
} from "../../app/(en)/stardew-valley-beach-farm-layout/page";
import ChineseBeachFarmLayoutsPage, {
  metadata as chineseBeachFarmMetadata,
} from "../../app/zh/stardew-valley-beach-farm-layout/page";
import { getBeachFarmPageCopy } from "../../src/farm-layouts/beach-farm-content";
import { createBeachFarmPageStructuredData } from "../../src/farm-layouts/beach-farm-structured-data";
import {
  getLocalizedIndexablePublicRouteEntries,
} from "../../src/i18n/public-route-registry";

it("registers both localized Beach Farm paths as the same indexable topic page", () => {
  const beachFarmEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) => canonicalPath === "/stardew-valley-beach-farm-layout",
  );

  expect(beachFarmEntries).toEqual([
    {
      locale: "en",
      canonicalPath: "/stardew-valley-beach-farm-layout",
      pathname: "/stardew-valley-beach-farm-layout",
    },
    {
      locale: "zh-CN",
      canonicalPath: "/stardew-valley-beach-farm-layout",
      pathname: "/zh/stardew-valley-beach-farm-layout",
    },
  ]);
  expect(englishBeachFarmMetadata).toMatchObject({
    title: getBeachFarmPageCopy("en").metaTitle,
    description: getBeachFarmPageCopy("en").description,
    alternates: {
      canonical: "https://stardewvalleyplanner.art/stardew-valley-beach-farm-layout",
      languages: {
        en: "https://stardewvalleyplanner.art/stardew-valley-beach-farm-layout",
        "zh-CN": "https://stardewvalleyplanner.art/zh/stardew-valley-beach-farm-layout",
      },
    },
  });
  expect(chineseBeachFarmMetadata).toMatchObject({
    title: getBeachFarmPageCopy("zh-CN").metaTitle,
    description: getBeachFarmPageCopy("zh-CN").description,
    alternates: {
      canonical: "https://stardewvalleyplanner.art/zh/stardew-valley-beach-farm-layout",
      languages: {
        en: "https://stardewvalleyplanner.art/stardew-valley-beach-farm-layout",
        "zh-CN": "https://stardewvalleyplanner.art/zh/stardew-valley-beach-farm-layout",
      },
    },
  });
});

it("renders the English and Simplified Chinese topic routes from the shared cases", () => {
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishBeachFarmLayoutsPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseBeachFarmLayoutsPage),
  );

  expect(englishMarkup).toContain('data-public-page-shell="true"');
  expect(chineseMarkup).toContain('data-public-page-shell="true"');
  expect((englishMarkup.match(/<h1(?:\s|>)/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1(?:\s|>)/g) ?? [])).toHaveLength(1);

  for (const farmCase of getBeachFarmPageCopy("en").cases) {
    expect(englishMarkup).toContain(farmCase.title);
    expect(englishMarkup).toContain(`id="${farmCase.id}"`);
  }
  for (const farmCase of getBeachFarmPageCopy("zh-CN").cases) {
    expect(chineseMarkup).toContain(farmCase.title);
    expect(chineseMarkup).toContain(`id="${farmCase.id}"`);
  }
});

it("describes the visible collection and its real lead image without invented review or how-to types", () => {
  const englishCopy = getBeachFarmPageCopy("en");
  const englishStructuredData = createBeachFarmPageStructuredData("en");
  const chineseCopy = getBeachFarmPageCopy("zh-CN");
  const chineseStructuredData = createBeachFarmPageStructuredData("zh-CN");
  const mainEntity = englishStructuredData.mainEntity as {
    "@type": string;
    numberOfItems: number;
    itemListElement: readonly Readonly<{ name: string; url: string }>[];
  };
  const chineseMainEntity = chineseStructuredData.mainEntity as {
    "@type": string;
    numberOfItems: number;
    itemListElement: readonly Readonly<{ name: string; url: string }>[];
  };

  expect(englishStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: englishCopy.title,
    description: englishCopy.description,
    inLanguage: "en",
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `https://stardewvalleyplanner.art${englishCopy.cases[0]?.imageSrc}`,
      caption: englishCopy.cases[0]?.imageAlt,
    },
  });
  expect(mainEntity).toMatchObject({
    "@type": "ItemList",
    numberOfItems: 9,
  });
  expect(mainEntity.itemListElement).toHaveLength(9);
  expect(mainEntity.itemListElement[0]?.name).toBe(englishCopy.cases[0]?.title);
  expect(mainEntity.itemListElement[0]?.url).toBe(
    "https://stardewvalleyplanner.art/stardew-valley-beach-farm-layout#dirt-patch-sprinkler-island",
  );
  expect(chineseStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: chineseCopy.title,
    description: chineseCopy.description,
    inLanguage: "zh-CN",
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `https://stardewvalleyplanner.art${chineseCopy.cases[0]?.imageSrc}`,
      caption: chineseCopy.cases[0]?.imageAlt,
    },
  });
  expect(chineseMainEntity.numberOfItems).toBe(9);
  expect(chineseMainEntity.itemListElement).toHaveLength(9);
  expect(chineseMainEntity.itemListElement[0]?.url).toBe(
    "https://stardewvalleyplanner.art/zh/stardew-valley-beach-farm-layout#dirt-patch-sprinkler-island",
  );
  expect(JSON.stringify(englishStructuredData)).not.toMatch(/FAQPage|HowTo|Review|AggregateRating/);
  expect(JSON.stringify(chineseStructuredData)).not.toMatch(/FAQPage|HowTo|Review|AggregateRating/);
});

it("lists both public topic URLs in the source LLM guide", () => {
  const llmsText = readFileSync(join(process.cwd(), "public", "llms.txt"), "utf8");
  const englishCopy = getBeachFarmPageCopy("en");
  const chineseCopy = getBeachFarmPageCopy("zh-CN");

  expect(llmsText).toContain(
    `[${englishCopy.title}](https://stardewvalleyplanner.art/stardew-valley-beach-farm-layout): ${englishCopy.description}`,
  );
  expect(llmsText).toContain(
    `[${chineseCopy.title}](https://stardewvalleyplanner.art/zh/stardew-valley-beach-farm-layout): ${chineseCopy.description}`,
  );
});
