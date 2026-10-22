import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { getToolsPageCopy } from "../../src/i18n/tools-page-copy";
import { CropProfitTool, seasonProfitRankingHasRows } from "../../src/tools-pages/crop-profit-tool";
import { CropGrowthTool } from "../../src/tools-pages/crop-growth-tool";
import { CropSelect } from "../../src/tools-pages/crop-select";
import { loadPurchasableFieldCrops } from "../../src/tools-pages/purchasable-field-crops";
import { ToolsHomePage } from "../../src/tools-pages/tools-home-page";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertLocalizedFormGroup(markup: string, dataAttribute: string, label: string): void {
  const groupPattern = new RegExp(
    `<div\\b(?=[^>]*${dataAttribute}="true")(?=[^>]*role="group")(?=[^>]*aria-label="${escapeRegExp(label)}")[^>]*>`,
  );
  expect(markup).toMatch(groupPattern);
}

function assertLabelledCombobox(markup: string, inputId: string, label: string): void {
  const escapedInputId = escapeRegExp(inputId);
  const labelPattern = new RegExp(
    `<label\\b(?=[^>]*\\bfor="${escapedInputId}")(?=[^>]*\\bid="${escapedInputId}-label")[^>]*>\\s*${escapeRegExp(label)}\\s*</label>`,
  );
  const triggerPattern = new RegExp(
    `<button\\b(?=[^>]*\\bid="${escapedInputId}")(?=[^>]*\\brole="combobox")(?=[^>]*\\baria-labelledby="${escapedInputId}-label")[^>]*>`,
  );

  expect(markup).toMatch(labelPattern);
  expect(markup).toMatch(triggerPattern);
}

it("links the Chinese tools homepage planting card to both planting tools", () => {
  const markup = renderToStaticMarkup(<ToolsHomePage locale="zh-CN" />);

  expect(markup).toContain('href="/zh/tools/crop-profit"');
  expect(markup).toContain('href="/zh/tools/crop-growth"');
  expect(markup).toMatch(/<a\b[^>]*>\s*季节作物收益\s*<\/a>/);
  expect(markup).toMatch(/<a\b[^>]*>\s*生长与收获日历\s*<\/a>/);
  expect(markup).toContain("进入种植规划");
  expect(markup).not.toContain('href="/zh/tools/crop-profit?tool=growth"');
  expect(markup).not.toContain('href="/zh/tools/processing"');
});

it("renders the Chinese season-profit form labels", () => {
  const copy = getToolsPageCopy("zh-CN");
  const markup = renderToStaticMarkup(<CropProfitTool locale="zh-CN" />);

  expect(markup).toContain(copy.profit.plantingDay);
  expect(markup).toContain(copy.profit.farmYear);
  expect(markup).toContain(copy.profit.tileCount);
  expect(markup).toContain(copy.profit.seedSource);
  expect(markup).toContain(copy.profit.profession);
  expect(markup).toContain(copy.profit.speedGro);
  expect(markup).toContain(copy.profit.fertilizerCost);
  expect(markup).toContain(copy.profit.kegCount);
  expect(markup).toContain(copy.profit.jarCount);
  expect(markup).toContain(copy.profit.dehydratorCount);
  expect(markup).toContain(copy.profit.deadline);
  expect(markup).toContain("春");
  expect(markup).toContain("夏");
  expect(markup).toContain("秋");
  expect(markup).toContain("冬");
});

it.each(["en", "zh-CN"] as const)(
  "renders every planting dropdown as a localized, labelled combobox in %s",
  (locale) => {
    const copy = getToolsPageCopy(locale);
    const profitMarkup = renderToStaticMarkup(<CropProfitTool locale={locale} />);
    const growthMarkup = renderToStaticMarkup(
      <CropGrowthTool locale={locale} requestedCropId={null} />,
    );

    assertLocalizedFormGroup(profitMarkup, "data-crop-profit-form", copy.profit.settingsHeading);
    assertLocalizedFormGroup(growthMarkup, "data-crop-growth-form", copy.growth.title);

    for (const [inputId, label] of [
      ["crop-profit-seed-source", copy.profit.seedSource],
      ["crop-profit-profession", copy.profit.profession],
      ["crop-profit-speed-gro", copy.profit.speedGro],
      ["crop-profit-deadline", copy.profit.deadline],
    ] as const) {
      assertLabelledCombobox(profitMarkup, inputId, label);
    }

    for (const [inputId, label] of [
      ["crop-growth-crop", copy.growth.crop],
      ["crop-growth-season", copy.growth.season],
      ["crop-growth-speed", copy.growth.speedGro],
      ["crop-growth-profession", copy.growth.profession],
      ["crop-growth-location", copy.growth.location],
      ["crop-growth-after-harvest", copy.growth.afterHarvest],
    ] as const) {
      assertLabelledCombobox(growthMarkup, inputId, label);
    }
  },
);

it("treats a season-profit row count of zero as no ranking rows", () => {
  expect(seasonProfitRankingHasRows(0)).toBe(false);
  expect(seasonProfitRankingHasRows(1)).toBe(true);
  expect(() => seasonProfitRankingHasRows(-1)).toThrow("Received: -1");
});

it("renders compact calendar marks with full localized accessible names", () => {
  const englishMarkup = renderToStaticMarkup(
    <CropGrowthTool locale="en" requestedCropId={null} />,
  );
  const chineseMarkup = renderToStaticMarkup(
    <CropGrowthTool locale="zh-CN" requestedCropId={null} />,
  );
  const englishCopy = getToolsPageCopy("en");
  const chineseCopy = getToolsPageCopy("zh-CN");

  expect(englishMarkup).toMatch(
    /<div\b(?=[^>]*data-crop-growth-form="true")(?=[^>]*role="group")(?=[^>]*aria-label="[^"]*")[^>]*>/,
  );
  expect(englishMarkup).not.toContain("<form");
  expect(englishMarkup).toContain('aria-label="Spring 1: Planting"');
  expect(englishMarkup).toContain('for="crop-growth-crop"');
  expect(englishMarkup).toContain('aria-labelledby="crop-growth-crop-label"');
  expect(englishMarkup).toContain('role="combobox"');
  expect(englishMarkup).toContain('title="Spring 1: Planting"');
  expect(englishMarkup).toContain("<div>P</div>");
  expect(chineseMarkup).toContain('aria-label="春 1：播种"');
  expect(chineseMarkup).toContain('title="春 1：播种"');
  expect(chineseMarkup).toContain("<div>种</div>");
  expect(englishCopy.growth.shortMarks["plant-and-harvest"]).toBe("P+H");
  expect(chineseCopy.growth.shortMarks["plant-and-harvest"]).toBe("种收");
  expect(englishCopy.growth.legend).toContain("P+H");
  expect(chineseCopy.growth.legend).toContain("种补 = 同日播种、收获并补种");
});

it("associates crop-selection errors with the crop control", () => {
  const markup = renderToStaticMarkup(
    <CropSelect
      crops={loadPurchasableFieldCrops()}
      errorMessage='Unknown crop id. Received: "missing-crop".'
      label="Crop"
      locale="en"
      onCropChange={(cropId) => {
        throw new Error(`Unexpected crop selection during server render. Received: ${JSON.stringify(cropId)}.`);
      }}
      selectedCropId="parsnip"
    />,
  );

  expect(markup).toContain('aria-describedby="crop-growth-crop-error"');
  expect(markup).toContain('aria-invalid="true"');
  expect(markup).toContain('id="crop-growth-crop-error"');
});
