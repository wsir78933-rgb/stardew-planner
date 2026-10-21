import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishFrontierFarmLayoutsPage, {
  dynamic as englishFrontierFarmDynamic,
  metadata as englishFrontierFarmMetadata,
} from "../../app/(en)/stardew-valley-frontier-farm-layout/page";
import ChineseFrontierFarmLayoutsPage, {
  dynamic as chineseFrontierFarmDynamic,
  metadata as chineseFrontierFarmMetadata,
} from "../../app/zh/stardew-valley-frontier-farm-layout/page";
import {
  frontierFarmCanonicalPath,
  getFrontierFarmPageCopy,
} from "../../src/farm-layouts/frontier-farm-content";
import { createFrontierFarmStructuredData } from "../../src/farm-layouts/frontier-farm-structured-data";
import {
  canonicalPublicPaths,
  getLocalizedIndexablePublicRouteEntries,
} from "../../src/i18n/public-route-registry";

const expectedFrontierFarmCaseIds = [
  "02-cottagecore-terraces",
  "03-west-animals-east-crops",
  "04-tapper-honey-barn",
  "05-junimo-village",
  "06-ranch-ancient-fruit",
  "07-nine-fish-ponds",
];

type FrontierFarmItemList = {
  "@type": string;
  numberOfItems: number;
  itemListElement: readonly Readonly<{
    name: string;
    description: string;
    url: string;
  }>[];
};

it("registers both localized Frontier Farm paths after Four Corners", () => {
  const fourCornersFarmIndex = canonicalPublicPaths.indexOf(
    "/stardew-valley-four-corners-farm-layout",
  );
  const frontierFarmIndex = canonicalPublicPaths.indexOf(
    frontierFarmCanonicalPath,
  );
  const frontierFarmEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) => canonicalPath === frontierFarmCanonicalPath,
  );
  const englishCopy = getFrontierFarmPageCopy("en");
  const chineseCopy = getFrontierFarmPageCopy("zh-CN");

  expect(frontierFarmIndex).toBe(fourCornersFarmIndex + 1);
  expect(frontierFarmEntries).toEqual([
    {
      locale: "en",
      canonicalPath: frontierFarmCanonicalPath,
      pathname: frontierFarmCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: frontierFarmCanonicalPath,
      pathname: `/zh${frontierFarmCanonicalPath}`,
    },
  ]);
  expect(englishFrontierFarmMetadata).toMatchObject({
    title: englishCopy.metaTitle,
    description: englishCopy.description,
    alternates: {
      canonical: `https://stardewvalleyplanner.art${frontierFarmCanonicalPath}`,
      languages: {
        en: `https://stardewvalleyplanner.art${frontierFarmCanonicalPath}`,
        "zh-CN": `https://stardewvalleyplanner.art/zh${frontierFarmCanonicalPath}`,
      },
    },
    openGraph: {
      images: [
        `https://stardewvalleyplanner.art${englishCopy.cover.imageSrc}`,
      ],
    },
    twitter: {
      images: [
        `https://stardewvalleyplanner.art${englishCopy.cover.imageSrc}`,
      ],
    },
  });
  expect(chineseFrontierFarmMetadata).toMatchObject({
    title: chineseCopy.metaTitle,
    description: chineseCopy.description,
    alternates: {
      canonical: `https://stardewvalleyplanner.art/zh${frontierFarmCanonicalPath}`,
      languages: {
        en: `https://stardewvalleyplanner.art${frontierFarmCanonicalPath}`,
        "zh-CN": `https://stardewvalleyplanner.art/zh${frontierFarmCanonicalPath}`,
      },
    },
    openGraph: {
      images: [
        `https://stardewvalleyplanner.art${chineseCopy.cover.imageSrc}`,
      ],
    },
    twitter: {
      images: [
        `https://stardewvalleyplanner.art${chineseCopy.cover.imageSrc}`,
      ],
    },
  });
  expect(englishCopy.cover.imageSrc).not.toBe(englishCopy.cases[0]?.imageSrc);
  expect(chineseCopy.cover.imageSrc).not.toBe(chineseCopy.cases[0]?.imageSrc);
  expect(englishFrontierFarmDynamic).toBe("force-static");
  expect(chineseFrontierFarmDynamic).toBe("force-static");
});

it("renders the independent cover and exactly six visible layout cases", () => {
  const englishCopy = getFrontierFarmPageCopy("en");
  const chineseCopy = getFrontierFarmPageCopy("zh-CN");
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishFrontierFarmLayoutsPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseFrontierFarmLayoutsPage),
  );

  expect(englishCopy.cases.map(({ id }) => id)).toEqual(
    expectedFrontierFarmCaseIds,
  );
  expect(chineseCopy.cases.map(({ id }) => id)).toEqual(
    expectedFrontierFarmCaseIds,
  );
  expect(englishMarkup).toContain('data-public-page-shell="true"');
  expect(chineseMarkup).toContain('data-public-page-shell="true"');
  expect(englishMarkup).toContain('data-frontier-farm-cover="true"');
  expect(chineseMarkup).toContain('data-frontier-farm-cover="true"');
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

  expect(englishMarkup).toContain(englishCopy.cover.imageAlt);
  expect(chineseMarkup).toContain(chineseCopy.cover.imageAlt);
  expect(englishMarkup).toContain(`src="${englishCopy.cover.imageSrc}"`);
  expect(chineseMarkup).toContain(`src="${chineseCopy.cover.imageSrc}"`);
});

it("describes the real 1920x800 cover and only the six visible case IDs", () => {
  const englishCopy = getFrontierFarmPageCopy("en");
  const chineseCopy = getFrontierFarmPageCopy("zh-CN");
  const englishMarkup = renderToStaticMarkup(
    createElement(EnglishFrontierFarmLayoutsPage),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ChineseFrontierFarmLayoutsPage),
  );
  const englishStructuredData = createFrontierFarmStructuredData("en");
  const chineseStructuredData = createFrontierFarmStructuredData("zh-CN");
  const englishMainEntity =
    englishStructuredData.mainEntity as FrontierFarmItemList;
  const chineseMainEntity =
    chineseStructuredData.mainEntity as FrontierFarmItemList;

  expect(englishStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: englishCopy.title,
    description: englishCopy.description,
    inLanguage: "en",
    url: `https://stardewvalleyplanner.art${frontierFarmCanonicalPath}`,
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `https://stardewvalleyplanner.art${englishCopy.cover.imageSrc}`,
      caption: englishCopy.cover.imageAlt,
      width: 1920,
      height: 800,
    },
  });
  expect(chineseStructuredData).toMatchObject({
    "@type": "CollectionPage",
    name: chineseCopy.title,
    description: chineseCopy.description,
    inLanguage: "zh-CN",
    url: `https://stardewvalleyplanner.art/zh${frontierFarmCanonicalPath}`,
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: `https://stardewvalleyplanner.art${chineseCopy.cover.imageSrc}`,
      caption: chineseCopy.cover.imageAlt,
      width: 1920,
      height: 800,
    },
  });

  const localizedPageChecks = [
    {
      localizedPath: frontierFarmCanonicalPath,
      mainEntity: englishMainEntity,
      pageMarkup: englishMarkup,
      pageCopy: englishCopy,
    },
    {
      localizedPath: `/zh${frontierFarmCanonicalPath}`,
      mainEntity: chineseMainEntity,
      pageMarkup: chineseMarkup,
      pageCopy: chineseCopy,
    },
  ] as const;

  for (const pageCheck of localizedPageChecks) {
    expect(pageCheck.mainEntity).toMatchObject({
      "@type": "ItemList",
      numberOfItems: 6,
    });
    expect(pageCheck.mainEntity.itemListElement).toHaveLength(6);
    expect(pageCheck.mainEntity.itemListElement.map(({ name }) => name)).toEqual(
      pageCheck.pageCopy.cases.map(({ title }) => title),
    );
    expect(
      pageCheck.mainEntity.itemListElement.map(({ description }) => description),
    ).toEqual(pageCheck.pageCopy.cases.map(({ summary }) => summary));
    expect(pageCheck.mainEntity.itemListElement.map(({ url }) => url)).toEqual(
      pageCheck.pageCopy.cases.map(
        ({ id }) =>
          `https://stardewvalleyplanner.art${pageCheck.localizedPath}#${id}`,
      ),
    );

    for (const listItem of pageCheck.mainEntity.itemListElement) {
      const itemAnchor = new URL(listItem.url).hash.slice(1);
      expect(pageCheck.pageMarkup).toContain(`id="${itemAnchor}"`);
    }
  }

  expect(JSON.stringify(englishStructuredData)).not.toMatch(
    /FAQPage|HowTo|Review|AggregateRating/,
  );
  expect(JSON.stringify(chineseStructuredData)).not.toMatch(
    /FAQPage|HowTo|Review|AggregateRating/,
  );
});

it("lists both Frontier Farm pages after Four Corners with exact visible copy", () => {
  const llmsText = readFileSync(
    join(process.cwd(), "public", "llms.txt"),
    "utf8",
  );
  const englishCopy = getFrontierFarmPageCopy("en");
  const chineseCopy = getFrontierFarmPageCopy("zh-CN");
  const englishFourCornersFarmEntry =
    "[Stardew Valley Four Corners Farm Layout](https://stardewvalleyplanner.art/stardew-valley-four-corners-farm-layout)";
  const chineseFourCornersFarmEntry =
    "[星露谷物语四角农场布局](https://stardewvalleyplanner.art/zh/stardew-valley-four-corners-farm-layout)";
  const englishFrontierFarmEntry =
    `[${englishCopy.title}](https://stardewvalleyplanner.art${frontierFarmCanonicalPath}): ${englishCopy.description}`;
  const chineseFrontierFarmEntry =
    `[${chineseCopy.title}](https://stardewvalleyplanner.art/zh${frontierFarmCanonicalPath}): ${chineseCopy.description}`;

  expect(llmsText.indexOf(englishFourCornersFarmEntry)).toBeGreaterThanOrEqual(0);
  expect(llmsText.indexOf(chineseFourCornersFarmEntry)).toBeGreaterThanOrEqual(0);
  expect(llmsText.indexOf(englishFrontierFarmEntry)).toBeGreaterThan(
    llmsText.indexOf(englishFourCornersFarmEntry),
  );
  expect(llmsText.indexOf(chineseFrontierFarmEntry)).toBeGreaterThan(
    llmsText.indexOf(chineseFourCornersFarmEntry),
  );
});
