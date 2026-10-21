import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishForestFarmLayoutsPage, {
  dynamic as englishForestFarmDynamic,
  metadata as englishForestFarmMetadata,
} from "../../app/(en)/stardew-valley-forest-farm-layout/page";
import ChineseForestFarmLayoutsPage, {
  dynamic as chineseForestFarmDynamic,
  metadata as chineseForestFarmMetadata,
} from "../../app/zh/stardew-valley-forest-farm-layout/page";
import { getForestFarmPageCopy } from "../../src/farm-layouts/forest-farm-content";
import { createForestFarmStructuredData } from "../../src/farm-layouts/forest-farm-structured-data";
import { getLocalizedIndexablePublicRouteEntries } from "../../src/i18n/public-route-registry";

const forestFarmCanonicalPath = "/stardew-valley-forest-farm-layout";

it("registers both localized Forest Farm paths as one indexable topic", () => {
  const forestFarmEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) => canonicalPath === forestFarmCanonicalPath,
  );

  expect(forestFarmEntries).toEqual([
    {
      locale: "en",
      canonicalPath: forestFarmCanonicalPath,
      pathname: forestFarmCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: forestFarmCanonicalPath,
      pathname: `/zh${forestFarmCanonicalPath}`,
    },
  ]);
  expect(englishForestFarmMetadata).toMatchObject({
    title: getForestFarmPageCopy("en").metaTitle,
    description: getForestFarmPageCopy("en").description,
    alternates: {
      canonical: `https://stardewvalleyplanner.art${forestFarmCanonicalPath}`,
      languages: {
        en: `https://stardewvalleyplanner.art${forestFarmCanonicalPath}`,
        "zh-CN": `https://stardewvalleyplanner.art/zh${forestFarmCanonicalPath}`,
      },
    },
    openGraph: {
      images: [
        `https://stardewvalleyplanner.art${getForestFarmPageCopy("en").cases[0]?.imageSrc}`,
      ],
    },
    twitter: {
      images: [
        `https://stardewvalleyplanner.art${getForestFarmPageCopy("en").cases[0]?.imageSrc}`,
      ],
    },
  });
  expect(chineseForestFarmMetadata).toMatchObject({
    title: getForestFarmPageCopy("zh-CN").metaTitle,
    description: getForestFarmPageCopy("zh-CN").description,
    alternates: {
      canonical: `https://stardewvalleyplanner.art/zh${forestFarmCanonicalPath}`,
      languages: {
        en: `https://stardewvalleyplanner.art${forestFarmCanonicalPath}`,
        "zh-CN": `https://stardewvalleyplanner.art/zh${forestFarmCanonicalPath}`,
      },
    },
    openGraph: {
      images: [
        `https://stardewvalleyplanner.art${getForestFarmPageCopy("zh-CN").cases[0]?.imageSrc}`,
      ],
    },
    twitter: {
      images: [
        `https://stardewvalleyplanner.art${getForestFarmPageCopy("zh-CN").cases[0]?.imageSrc}`,
      ],
    },
  });
  expect(englishForestFarmDynamic).toBe("force-static");
  expect(chineseForestFarmDynamic).toBe("force-static");
});

it("renders the English and Simplified Chinese routes from six visible cases", () => {
  const englishCopy = getForestFarmPageCopy("en");
  const chineseCopy = getForestFarmPageCopy("zh-CN");
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishForestFarmLayoutsPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseForestFarmLayoutsPage),
  );

  expect(englishCopy.cases).toHaveLength(6);
  expect(chineseCopy.cases).toHaveLength(6);
  expect(englishMarkup).toContain('data-public-page-shell="true"');
  expect(chineseMarkup).toContain('data-public-page-shell="true"');
  expect((englishMarkup.match(/<h1(?:\s|>)/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1(?:\s|>)/g) ?? [])).toHaveLength(1);

  for (const farmCase of englishCopy.cases) {
    expect(englishMarkup).toContain(farmCase.title);
    expect(englishMarkup).toContain(`id="${farmCase.id}"`);
  }
  for (const farmCase of chineseCopy.cases) {
    expect(chineseMarkup).toContain(farmCase.title);
    expect(chineseMarkup).toContain(`id="${farmCase.id}"`);
  }
});

it("describes only the visible collection and its real 1600x1300 lead image", () => {
  const englishCopy = getForestFarmPageCopy("en");
  const chineseCopy = getForestFarmPageCopy("zh-CN");
  const englishStructuredData = createForestFarmStructuredData("en");
  const chineseStructuredData = createForestFarmStructuredData("zh-CN");
  const englishMainEntity = englishStructuredData.mainEntity as {
    "@type": string;
    numberOfItems: number;
    itemListElement: readonly Readonly<{
      name: string;
      description: string;
      url: string;
    }>[];
  };
  const chineseMainEntity = chineseStructuredData.mainEntity as {
    "@type": string;
    numberOfItems: number;
    itemListElement: readonly Readonly<{
      name: string;
      description: string;
      url: string;
    }>[];
  };

  expect(englishStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: englishCopy.title,
    description: englishCopy.description,
    inLanguage: "en",
    url: `https://stardewvalleyplanner.art${forestFarmCanonicalPath}`,
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `https://stardewvalleyplanner.art${englishCopy.cases[0]?.imageSrc}`,
      caption: englishCopy.cases[0]?.imageAlt,
      width: 1600,
      height: 1300,
    },
  });
  expect(englishMainEntity).toMatchObject({
    "@type": "ItemList",
    numberOfItems: 6,
  });
  expect(englishMainEntity.itemListElement).toHaveLength(6);
  expect(englishMainEntity.itemListElement.map(({ name }) => name)).toEqual(
    englishCopy.cases.map(({ title }) => title),
  );
  expect(
    englishMainEntity.itemListElement.map(({ description }) => description),
  ).toEqual(englishCopy.cases.map(({ summary }) => summary));
  expect(englishMainEntity.itemListElement.map(({ url }) => url)).toEqual(
    englishCopy.cases.map(
      ({ id }) =>
        `https://stardewvalleyplanner.art${forestFarmCanonicalPath}#${id}`,
    ),
  );
  expect(chineseStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: chineseCopy.title,
    description: chineseCopy.description,
    inLanguage: "zh-CN",
    url: `https://stardewvalleyplanner.art/zh${forestFarmCanonicalPath}`,
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `https://stardewvalleyplanner.art${chineseCopy.cases[0]?.imageSrc}`,
      caption: chineseCopy.cases[0]?.imageAlt,
      width: 1600,
      height: 1300,
    },
  });
  expect(chineseMainEntity.numberOfItems).toBe(6);
  expect(chineseMainEntity.itemListElement).toHaveLength(6);
  expect(chineseMainEntity.itemListElement.map(({ name }) => name)).toEqual(
    chineseCopy.cases.map(({ title }) => title),
  );
  expect(
    chineseMainEntity.itemListElement.map(({ description }) => description),
  ).toEqual(chineseCopy.cases.map(({ summary }) => summary));
  expect(chineseMainEntity.itemListElement.map(({ url }) => url)).toEqual(
    chineseCopy.cases.map(
      ({ id }) =>
        `https://stardewvalleyplanner.art/zh${forestFarmCanonicalPath}#${id}`,
    ),
  );
  expect(JSON.stringify(englishStructuredData)).not.toMatch(
    /FAQPage|HowTo|Review|AggregateRating/,
  );
  expect(JSON.stringify(chineseStructuredData)).not.toMatch(
    /FAQPage|HowTo|Review|AggregateRating/,
  );
});

it("lists both Forest Farm pages after Meadowlands with exact visible copy", () => {
  const llmsText = readFileSync(
    join(process.cwd(), "public", "llms.txt"),
    "utf8",
  );
  const englishCopy = getForestFarmPageCopy("en");
  const chineseCopy = getForestFarmPageCopy("zh-CN");
  const englishMeadowlandsLink = "[Stardew Valley Meadowlands Farm Layout]";
  const chineseMeadowlandsLink = "[星露谷物语草原农场布局]";

  const englishMeadowlandsIndex = llmsText.indexOf(englishMeadowlandsLink);
  const chineseMeadowlandsIndex = llmsText.indexOf(chineseMeadowlandsLink);
  const englishForestFarmEntry =
    `[${englishCopy.title}](https://stardewvalleyplanner.art${forestFarmCanonicalPath}): ${englishCopy.description}`;
  const chineseForestFarmEntry =
    `[${chineseCopy.title}](https://stardewvalleyplanner.art/zh${forestFarmCanonicalPath}): ${chineseCopy.description}`;

  expect(englishMeadowlandsIndex).toBeGreaterThanOrEqual(0);
  expect(chineseMeadowlandsIndex).toBeGreaterThanOrEqual(0);
  expect(llmsText.indexOf(englishForestFarmEntry)).toBeGreaterThan(
    englishMeadowlandsIndex,
  );
  expect(llmsText.indexOf(chineseForestFarmEntry)).toBeGreaterThan(
    chineseMeadowlandsIndex,
  );
});
