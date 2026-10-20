import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishMeadowlandsFarmLayoutsPage, {
  dynamic as englishMeadowlandsFarmDynamic,
  metadata as englishMeadowlandsFarmMetadata,
} from "../../app/(en)/meadowlands-farm-layout/page";
import ChineseMeadowlandsFarmLayoutsPage, {
  dynamic as chineseMeadowlandsFarmDynamic,
  metadata as chineseMeadowlandsFarmMetadata,
} from "../../app/zh/meadowlands-farm-layout/page";
import { getMeadowlandsFarmPageCopy } from "../../src/farm-layouts/meadowlands-farm-content";
import { createMeadowlandsFarmStructuredData } from "../../src/farm-layouts/meadowlands-farm-structured-data";
import { getLocalizedIndexablePublicRouteEntries } from "../../src/i18n/public-route-registry";

it("registers both localized Meadowlands Farm paths as one indexable topic", () => {
  const meadowlandsEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) => canonicalPath === "/meadowlands-farm-layout",
  );

  expect(meadowlandsEntries).toEqual([
    {
      locale: "en",
      canonicalPath: "/meadowlands-farm-layout",
      pathname: "/meadowlands-farm-layout",
    },
    {
      locale: "zh-CN",
      canonicalPath: "/meadowlands-farm-layout",
      pathname: "/zh/meadowlands-farm-layout",
    },
  ]);
  expect(englishMeadowlandsFarmMetadata).toMatchObject({
    title: getMeadowlandsFarmPageCopy("en").metaTitle,
    description: getMeadowlandsFarmPageCopy("en").description,
    alternates: {
      canonical: "https://stardewvalleyplanner.art/meadowlands-farm-layout",
      languages: {
        en: "https://stardewvalleyplanner.art/meadowlands-farm-layout",
        "zh-CN": "https://stardewvalleyplanner.art/zh/meadowlands-farm-layout",
      },
    },
    openGraph: {
      images: [
        `https://stardewvalleyplanner.art${getMeadowlandsFarmPageCopy("en").cases[0]?.imageSrc}`,
      ],
    },
    twitter: {
      images: [
        `https://stardewvalleyplanner.art${getMeadowlandsFarmPageCopy("en").cases[0]?.imageSrc}`,
      ],
    },
  });
  expect(chineseMeadowlandsFarmMetadata).toMatchObject({
    title: getMeadowlandsFarmPageCopy("zh-CN").metaTitle,
    description: getMeadowlandsFarmPageCopy("zh-CN").description,
    alternates: {
      canonical: "https://stardewvalleyplanner.art/zh/meadowlands-farm-layout",
      languages: {
        en: "https://stardewvalleyplanner.art/meadowlands-farm-layout",
        "zh-CN": "https://stardewvalleyplanner.art/zh/meadowlands-farm-layout",
      },
    },
    openGraph: {
      images: [
        `https://stardewvalleyplanner.art${getMeadowlandsFarmPageCopy("zh-CN").cases[0]?.imageSrc}`,
      ],
    },
    twitter: {
      images: [
        `https://stardewvalleyplanner.art${getMeadowlandsFarmPageCopy("zh-CN").cases[0]?.imageSrc}`,
      ],
    },
  });
  expect(englishMeadowlandsFarmDynamic).toBe("force-static");
  expect(chineseMeadowlandsFarmDynamic).toBe("force-static");
});

it("renders the two static routes from their shared ten-case content", () => {
  const englishCopy = getMeadowlandsFarmPageCopy("en");
  const chineseCopy = getMeadowlandsFarmPageCopy("zh-CN");
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishMeadowlandsFarmLayoutsPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseMeadowlandsFarmLayoutsPage),
  );

  expect(englishCopy.cases).toHaveLength(10);
  expect(chineseCopy.cases).toHaveLength(10);
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

it("describes only the visible collection and its real lead image", () => {
  const englishCopy = getMeadowlandsFarmPageCopy("en");
  const chineseCopy = getMeadowlandsFarmPageCopy("zh-CN");
  const englishStructuredData = createMeadowlandsFarmStructuredData("en");
  const chineseStructuredData = createMeadowlandsFarmStructuredData("zh-CN");
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
    url: "https://stardewvalleyplanner.art/meadowlands-farm-layout",
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `https://stardewvalleyplanner.art${englishCopy.cases[0]?.imageSrc}`,
      caption: englishCopy.cases[0]?.imageAlt,
      width: englishCopy.cases[0]?.imageWidth,
      height: englishCopy.cases[0]?.imageHeight,
    },
  });
  expect(englishMainEntity).toMatchObject({ "@type": "ItemList", numberOfItems: 10 });
  expect(englishMainEntity.itemListElement).toHaveLength(10);
  expect(englishMainEntity.itemListElement.map(({ name }) => name)).toEqual(
    englishCopy.cases.map(({ title }) => title),
  );
  expect(
    englishMainEntity.itemListElement.map(({ description }) => description),
  ).toEqual(englishCopy.cases.map(({ summary }) => summary));
  expect(englishMainEntity.itemListElement.map(({ url }) => url)).toEqual(
    englishCopy.cases.map(
      ({ id }) => `https://stardewvalleyplanner.art/meadowlands-farm-layout#${id}`,
    ),
  );
  expect(chineseStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: chineseCopy.title,
    description: chineseCopy.description,
    inLanguage: "zh-CN",
    url: "https://stardewvalleyplanner.art/zh/meadowlands-farm-layout",
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `https://stardewvalleyplanner.art${chineseCopy.cases[0]?.imageSrc}`,
      caption: chineseCopy.cases[0]?.imageAlt,
      width: chineseCopy.cases[0]?.imageWidth,
      height: chineseCopy.cases[0]?.imageHeight,
    },
  });
  expect(chineseMainEntity.numberOfItems).toBe(10);
  expect(chineseMainEntity.itemListElement).toHaveLength(10);
  expect(chineseMainEntity.itemListElement.map(({ name }) => name)).toEqual(
    chineseCopy.cases.map(({ title }) => title),
  );
  expect(
    chineseMainEntity.itemListElement.map(({ description }) => description),
  ).toEqual(chineseCopy.cases.map(({ summary }) => summary));
  expect(chineseMainEntity.itemListElement.map(({ url }) => url)).toEqual(
    chineseCopy.cases.map(
      ({ id }) => `https://stardewvalleyplanner.art/zh/meadowlands-farm-layout#${id}`,
    ),
  );
  expect(JSON.stringify(englishStructuredData)).not.toMatch(/FAQPage|HowTo|Review|AggregateRating/);
  expect(JSON.stringify(chineseStructuredData)).not.toMatch(/FAQPage|HowTo|Review|AggregateRating/);
});

it("advertises both localized topic pages with the exact visible copy", () => {
  const llmsText = readFileSync(join(process.cwd(), "public", "llms.txt"), "utf8");
  const englishCopy = getMeadowlandsFarmPageCopy("en");
  const chineseCopy = getMeadowlandsFarmPageCopy("zh-CN");

  expect(llmsText).toContain(
    `[${englishCopy.title}](https://stardewvalleyplanner.art/meadowlands-farm-layout): ${englishCopy.description}`,
  );
  expect(llmsText).toContain(
    `[${chineseCopy.title}](https://stardewvalleyplanner.art/zh/meadowlands-farm-layout): ${chineseCopy.description}`,
  );
});
