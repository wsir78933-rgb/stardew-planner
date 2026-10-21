import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishFourCornersFarmLayoutsPage, {
  dynamic as englishFourCornersFarmDynamic,
  metadata as englishFourCornersFarmMetadata,
} from "../../app/(en)/stardew-valley-four-corners-farm-layout/page";
import ChineseFourCornersFarmLayoutsPage, {
  dynamic as chineseFourCornersFarmDynamic,
  metadata as chineseFourCornersFarmMetadata,
} from "../../app/zh/stardew-valley-four-corners-farm-layout/page";
import {
  fourCornersFarmCanonicalPath,
  getFourCornersFarmPageCopy,
} from "../../src/farm-layouts/four-corners-farm-content";
import { createFourCornersFarmStructuredData } from "../../src/farm-layouts/four-corners-farm-structured-data";
import {
  canonicalPublicPaths,
  getLocalizedIndexablePublicRouteEntries,
} from "../../src/i18n/public-route-registry";

const expectedFourCornersFarmCaseIds = [
  "01-formal-garden",
  "02-mushroom-village",
  "03-themed-quadrants",
  "04-twelve-fish-ponds",
  "05-bees-and-animals",
  "06-junimo-columns",
  "07-clock-garden",
];

it("registers both localized Four Corners paths as one indexable topic", () => {
  const forestFarmIndex = canonicalPublicPaths.indexOf(
    "/stardew-valley-forest-farm-layout",
  );
  const fourCornersFarmIndex = canonicalPublicPaths.indexOf(
    fourCornersFarmCanonicalPath,
  );
  const fourCornersFarmEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) => canonicalPath === fourCornersFarmCanonicalPath,
  );

  expect(fourCornersFarmIndex).toBe(forestFarmIndex + 1);
  expect(fourCornersFarmEntries).toEqual([
    {
      locale: "en",
      canonicalPath: fourCornersFarmCanonicalPath,
      pathname: fourCornersFarmCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: fourCornersFarmCanonicalPath,
      pathname: `/zh${fourCornersFarmCanonicalPath}`,
    },
  ]);
  expect(englishFourCornersFarmMetadata).toMatchObject({
    title: getFourCornersFarmPageCopy("en").metaTitle,
    description: getFourCornersFarmPageCopy("en").description,
    alternates: {
      canonical: `https://stardewvalleyplanner.art${fourCornersFarmCanonicalPath}`,
      languages: {
        en: `https://stardewvalleyplanner.art${fourCornersFarmCanonicalPath}`,
        "zh-CN": `https://stardewvalleyplanner.art/zh${fourCornersFarmCanonicalPath}`,
      },
    },
    openGraph: {
      images: [
        `https://stardewvalleyplanner.art${getFourCornersFarmPageCopy("en").cases[0]?.imageSrc}`,
      ],
    },
    twitter: {
      images: [
        `https://stardewvalleyplanner.art${getFourCornersFarmPageCopy("en").cases[0]?.imageSrc}`,
      ],
    },
  });
  expect(chineseFourCornersFarmMetadata).toMatchObject({
    title: getFourCornersFarmPageCopy("zh-CN").metaTitle,
    description: getFourCornersFarmPageCopy("zh-CN").description,
    alternates: {
      canonical: `https://stardewvalleyplanner.art/zh${fourCornersFarmCanonicalPath}`,
      languages: {
        en: `https://stardewvalleyplanner.art${fourCornersFarmCanonicalPath}`,
        "zh-CN": `https://stardewvalleyplanner.art/zh${fourCornersFarmCanonicalPath}`,
      },
    },
    openGraph: {
      images: [
        `https://stardewvalleyplanner.art${getFourCornersFarmPageCopy("zh-CN").cases[0]?.imageSrc}`,
      ],
    },
    twitter: {
      images: [
        `https://stardewvalleyplanner.art${getFourCornersFarmPageCopy("zh-CN").cases[0]?.imageSrc}`,
      ],
    },
  });
  expect(englishFourCornersFarmDynamic).toBe("force-static");
  expect(chineseFourCornersFarmDynamic).toBe("force-static");
});

it("renders both locales with the seven visible case IDs used by the planner", () => {
  const englishCopy = getFourCornersFarmPageCopy("en");
  const chineseCopy = getFourCornersFarmPageCopy("zh-CN");
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishFourCornersFarmLayoutsPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseFourCornersFarmLayoutsPage),
  );

  expect(englishCopy.cases).toHaveLength(7);
  expect(chineseCopy.cases).toHaveLength(7);
  expect(englishCopy.cases.map(({ id }) => id)).toEqual(
    expectedFourCornersFarmCaseIds,
  );
  expect(chineseCopy.cases.map(({ id }) => id)).toEqual(
    expectedFourCornersFarmCaseIds,
  );
  expect(englishMarkup).toContain('data-public-page-shell="true"');
  expect(chineseMarkup).toContain('data-public-page-shell="true"');
  expect((englishMarkup.match(/<h1(?:\s|>)/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1(?:\s|>)/g) ?? [])).toHaveLength(1);

  for (const layoutCase of englishCopy.cases) {
    expect(englishMarkup).toContain(layoutCase.title);
    expect(englishMarkup).toContain(`id="${layoutCase.id}"`);
  }
  for (const layoutCase of chineseCopy.cases) {
    expect(chineseMarkup).toContain(layoutCase.title);
    expect(chineseMarkup).toContain(`id="${layoutCase.id}"`);
  }
});

it("describes only the visible collection and its real square lead image", () => {
  const englishCopy = getFourCornersFarmPageCopy("en");
  const chineseCopy = getFourCornersFarmPageCopy("zh-CN");
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishFourCornersFarmLayoutsPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseFourCornersFarmLayoutsPage),
  );
  const englishStructuredData = createFourCornersFarmStructuredData("en");
  const chineseStructuredData = createFourCornersFarmStructuredData("zh-CN");
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
    url: `https://stardewvalleyplanner.art${fourCornersFarmCanonicalPath}`,
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `https://stardewvalleyplanner.art${englishCopy.cases[0]?.imageSrc}`,
      caption: englishCopy.cases[0]?.imageAlt,
      width: 1600,
      height: 1600,
    },
  });
  expect(chineseStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: chineseCopy.title,
    description: chineseCopy.description,
    inLanguage: "zh-CN",
    url: `https://stardewvalleyplanner.art/zh${fourCornersFarmCanonicalPath}`,
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `https://stardewvalleyplanner.art${chineseCopy.cases[0]?.imageSrc}`,
      caption: chineseCopy.cases[0]?.imageAlt,
      width: 1600,
      height: 1600,
    },
  });

  for (const [localePath, mainEntity, pageMarkup, pageCopy] of [
    [fourCornersFarmCanonicalPath, englishMainEntity, englishMarkup, englishCopy],
    [`/zh${fourCornersFarmCanonicalPath}`, chineseMainEntity, chineseMarkup, chineseCopy],
  ] as const) {
    expect(mainEntity).toMatchObject({
      "@type": "ItemList",
      numberOfItems: 7,
    });
    expect(mainEntity.itemListElement).toHaveLength(7);
    expect(mainEntity.itemListElement.map(({ name }) => name)).toEqual(
      pageCopy.cases.map(({ title }) => title),
    );
    expect(mainEntity.itemListElement.map(({ description }) => description)).toEqual(
      pageCopy.cases.map(({ summary }) => summary),
    );
    expect(mainEntity.itemListElement.map(({ url }) => url)).toEqual(
      pageCopy.cases.map(({ id }) =>
        `https://stardewvalleyplanner.art${localePath}#${id}`,
      ),
    );

    for (const listItem of mainEntity.itemListElement) {
      const itemAnchor = new URL(listItem.url).hash.slice(1);
      expect(pageMarkup).toContain(`id="${itemAnchor}"`);
    }
  }

  expect(JSON.stringify(englishStructuredData)).not.toMatch(
    /FAQPage|HowTo|Review|AggregateRating/,
  );
  expect(JSON.stringify(chineseStructuredData)).not.toMatch(
    /FAQPage|HowTo|Review|AggregateRating/,
  );
});

it("lists both Four Corners pages after Forest with exact visible copy", () => {
  const llmsText = readFileSync(
    join(process.cwd(), "public", "llms.txt"),
    "utf8",
  );
  const englishCopy = getFourCornersFarmPageCopy("en");
  const chineseCopy = getFourCornersFarmPageCopy("zh-CN");
  const englishForestFarmEntry =
    "[Stardew Valley Forest Farm Layout](https://stardewvalleyplanner.art/stardew-valley-forest-farm-layout)";
  const chineseForestFarmEntry =
    "[星露谷物语森林农场布局](https://stardewvalleyplanner.art/zh/stardew-valley-forest-farm-layout)";
  const englishFourCornersFarmEntry =
    `[${englishCopy.title}](https://stardewvalleyplanner.art${fourCornersFarmCanonicalPath}): ${englishCopy.description}`;
  const chineseFourCornersFarmEntry =
    `[${chineseCopy.title}](https://stardewvalleyplanner.art/zh${fourCornersFarmCanonicalPath}): ${chineseCopy.description}`;

  expect(llmsText.indexOf(englishForestFarmEntry)).toBeGreaterThanOrEqual(0);
  expect(llmsText.indexOf(chineseForestFarmEntry)).toBeGreaterThanOrEqual(0);
  expect(llmsText.indexOf(englishFourCornersFarmEntry)).toBeGreaterThan(
    llmsText.indexOf(englishForestFarmEntry),
  );
  expect(llmsText.indexOf(chineseFourCornersFarmEntry)).toBeGreaterThan(
    llmsText.indexOf(chineseForestFarmEntry),
  );
});
