import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import {
  getPlantingToolGuideCopy,
  type PlantingToolGuideCopy,
  type PlantingToolGuideId,
} from "../../src/i18n/planting-tool-guide-copy";
import type { PublicLocale } from "../../src/i18n/public-locale";
import {
  createCropGrowthToolHref,
  createCropProfitHref,
} from "../../src/tools-pages/planting-tool-href";

const approvedProjectionSha256 = {
  "en": {
    "crop-profit": "eb2341543ecdfb603020595d0886e2d961ece1d83123bc56adab93b4e2e33915",
    "crop-growth": "f202c7cc96de472c5d323c0a3a105511a1f4fc2af2c3e16f52a8a32f03e715ce"
  },
  "zh-CN": {
    "crop-profit": "1c54d461a41b697ab56f8a1050b694d991dfe60cb4a21e3765374ed07ed7a0e2",
    "crop-growth": "cf09c876e856fd49e370e03ac9998a3f9ea8201e7059c3a1252fbb90ac00ac00"
  }
} as const;

const approvedOverviewTitles = {
  "en": {
    "crop-profit": "What should you plant to make this season count?",
    "crop-growth": "Can you still plant it and harvest in time?"
  },
  "zh-CN": {
    "crop-profit": "种什么，能让这一季的收获更值？",
    "crop-growth": "现在下种，还能收几次？"
  }
} as const;

function approvedProjection(copy: PlantingToolGuideCopy): string {
  const lines = [
    copy.overview.eyebrow,
    copy.overview.title,
    ...copy.overview.paragraphs,
    copy.overview.aside,
  ];

  for (const feature of copy.features.items) {
    lines.push(feature.eyebrow, feature.number, feature.title, feature.body);
  }

  lines.push(
    copy.featureIntro.eyebrow,
    copy.featureIntro.title,
    copy.featureIntro.description,
  );
  for (const card of copy.featureIntro.items) {
    lines.push(card.title, card.body);
  }

  lines.push(copy.howToUse.eyebrow, copy.howToUse.title);
  for (const step of copy.howToUse.steps) {
    lines.push(step.number, step.title, step.body);
  }
  lines.push(copy.howToUse.actionLabel);

  lines.push(copy.whyChoose.eyebrow, copy.whyChoose.title, copy.whyChoose.description);
  for (const reason of copy.whyChoose.items) {
    lines.push(reason.number, reason.title, reason.body);
  }

  lines.push(
    copy.comparison.eyebrow,
    copy.comparison.title,
    copy.comparison.description,
    copy.comparison.cornerLabel,
  );
  for (const product of copy.comparison.products) {
    lines.push(product.name);
  }
  for (const row of copy.comparison.rows) {
    lines.push(row.label, ...row.values);
  }

  lines.push(copy.faq.eyebrow, copy.faq.title, copy.faq.description);
  for (const item of copy.faq.items) {
    lines.push(item.question, item.answer);
  }

  return lines.join("\n");
}

function countEnglishWords(text: string): number {
  return text.match(/[A-Za-z0-9]+(?:[-'’][A-Za-z0-9]+)*/g)?.length ?? 0;
}

const plantingGuideCases = [
  { locale: "en", tool: "crop-profit" },
  { locale: "en", tool: "crop-growth" },
  { locale: "zh-CN", tool: "crop-profit" },
  { locale: "zh-CN", tool: "crop-growth" },
] as const satisfies readonly Readonly<{
  locale: PublicLocale;
  tool: PlantingToolGuideId;
}>[];

it.each(plantingGuideCases)(
  "matches the approved guide projection for $tool in $locale",
  ({ locale, tool }) => {
    const copy = getPlantingToolGuideCopy(locale, tool);
    const projection = approvedProjection(copy);

    expect(copy.overview.paragraphs).toHaveLength(3);
    expect(copy.overview.aside.length).toBeGreaterThan(0);
    expect(copy.overview.title).toBe(approvedOverviewTitles[locale][tool]);
    expect(copy.features.items).toHaveLength(5);
    expect(copy.features.items.map((feature) => feature.number)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
    ]);
    expect(copy.features.eyebrow.length).toBeGreaterThan(0);
    expect(copy.features.title.length).toBeGreaterThan(0);
    expect(projection.includes(copy.features.eyebrow)).toBe(false);
    expect(projection.includes(copy.features.title)).toBe(false);
    expect(copy.featureIntro.items).toHaveLength(4);
    expect(copy.featureIntro.description.length).toBeGreaterThan(0);
    expect(copy.howToUse.steps).toHaveLength(3);
    expect(copy.howToUse.steps.map((step) => step.number)).toEqual(["01", "02", "03"]);
    expect(copy.howToUse.actionLabel.length).toBeGreaterThan(0);
    expect(copy.whyChoose.items).toHaveLength(5);
    expect(copy.whyChoose.description.length).toBeGreaterThan(0);
    expect(copy.whyChoose.items.map((reason) => reason.number)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
    ]);
    expect(copy.comparison.products).toHaveLength(3);
    expect(copy.comparison.rows).toHaveLength(6);
    expect(copy.comparison.cornerLabel.length).toBeGreaterThan(0);
    expect(copy.comparison.checkedOn).toBe("2026-10-20");
    expect(copy.comparison.sources).toHaveLength(3);
    expect(projection.includes(copy.comparison.affiliation)).toBe(false);
    expect(projection.includes(copy.comparison.checkedOn)).toBe(false);
    for (const row of copy.comparison.rows) {
      expect(row.values).toHaveLength(3);
    }
    expect(copy.faq.items).toHaveLength(7);
    expect(createHash("sha256").update(projection).digest("hex")).toBe(
      approvedProjectionSha256[locale][tool],
    );
    expect(projection).not.toContain("October 20, 2026");
    expect(projection).not.toContain("2026年10月20日");
    expect(projection).not.toContain("Checked against the linked public pages");
    expect(projection).not.toContain("Crop Planner V3 is designed for");
    expect(projection).not.toContain("本站由我们维护");
  },
);

it("counts each full English product name once toward desktop density", () => {
  const profitProjection = approvedProjection(getPlantingToolGuideCopy("en", "crop-profit"));
  const growthProjection = approvedProjection(getPlantingToolGuideCopy("en", "crop-growth"));
  const profitPhrase = "Stardew Valley Crop Profit Calculator";
  const growthPhrase = "Stardew Valley Crop Growth Calculator";

  expect(profitProjection.split(profitPhrase).length - 1).toBe(23);
  expect(countEnglishWords(profitProjection)).toBe(1035);
  expect(growthProjection.split(growthPhrase).length - 1).toBe(21);
  expect(countEnglishWords(growthProjection)).toBe(1014);
  expect(growthProjection).toContain("planting\u2019s");
  expect(
    getPlantingToolGuideCopy("en", "crop-growth").comparison.rows.some((row) =>
      row.values.includes("'Regrows' crop option"),
    ),
  ).toBe(true);
  expect(
    getPlantingToolGuideCopy("en", "crop-profit").comparison.rows.some((row) =>
      row.values.includes("Per-harvest cap; ignores processing duration"),
    ),
  ).toBe(true);
});

it("keeps the existing calculator and competitor hrefs on comparison products", () => {
  expect(getPlantingToolGuideCopy("en", "crop-profit").comparison.products.map((product) => product.href)).toEqual([
    createCropProfitHref("en"),
    "https://thorinair.github.io/Stardew-Profits/",
    "https://www.stardewprofit.com/calculator",
  ]);
  expect(getPlantingToolGuideCopy("zh-CN", "crop-profit").comparison.products.map((product) => product.href)).toEqual([
    createCropProfitHref("zh-CN"),
    "https://thorinair.github.io/Stardew-Profits/",
    "https://www.stardewprofit.com/calculator",
  ]);
  expect(getPlantingToolGuideCopy("en", "crop-growth").comparison.products.map((product) => product.href)).toEqual([
    createCropGrowthToolHref("en"),
    "https://themonstrousdev.github.io/sdv_crop_planner/v3/",
    "https://stardewvalleywiki.com/Crop_Growth_Calendars",
  ]);
  expect(getPlantingToolGuideCopy("zh-CN", "crop-growth").comparison.products.map((product) => product.href)).toEqual([
    createCropGrowthToolHref("zh-CN"),
    "https://themonstrousdev.github.io/sdv_crop_planner/v3/",
    "https://stardewvalleywiki.com/Crop_Growth_Calendars",
  ]);
});

it("fails fast with the received unsupported locale", () => {
  const unsupportedLocale = "ru" as PublicLocale;

  expect(() => getPlantingToolGuideCopy(unsupportedLocale, "crop-profit")).toThrow(
    JSON.stringify(unsupportedLocale),
  );
});

it("fails fast with the received unsupported tool", () => {
  const unsupportedTool = "processing" as PlantingToolGuideId;

  expect(() => getPlantingToolGuideCopy("en", unsupportedTool)).toThrow(
    JSON.stringify(unsupportedTool),
  );
});
