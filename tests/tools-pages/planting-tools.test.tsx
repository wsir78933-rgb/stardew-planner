import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { getToolsPageCopy } from "../../src/i18n/tools-page-copy";
import { PlantingToolsWorkspace } from "../../src/tools-pages/crop-growth-tool-query";
import { CropProfitTool, seasonProfitRankingHasRows } from "../../src/tools-pages/crop-profit-tool";
import { CropGrowthTool } from "../../src/tools-pages/crop-growth-tool";
import { CropSelect } from "../../src/tools-pages/crop-select";
import { createCropGrowthToolHref, createCropProfitHref } from "../../src/tools-pages/planting-tool-href";
import { loadPurchasableFieldCrops } from "../../src/tools-pages/purchasable-field-crops";
import { PlantingToolFrame, type PlantingToolId } from "../../src/tools-pages/planting-tool-frame";
import { ToolsHomePage } from "../../src/tools-pages/tools-home-page";

vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push() {
        return undefined;
      },
    };
  },
}));
import {
  getProcessingToolDefinition,
  PROCESSING_TOOL_IDS,
} from "../../src/tools-pages/processing/processing-tool-definition";

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

function assertLinkWithHrefAndText(
  markup: string,
  href: string,
  label: string,
  isCurrentPage = false,
): void {
  const currentPagePattern = isCurrentPage ? '(?=[^>]*aria-current="page")' : "";
  const linkPattern = new RegExp(
    `<a\\b(?=[^>]*href="${escapeRegExp(href)}")${currentPagePattern}[^>]*>\\s*${escapeRegExp(label)}\\s*</a>`,
  );

  expect(markup).toMatch(linkPattern);
}

it("links the Chinese tools homepage to both planting tools and all processing tools", () => {
  const copy = getToolsPageCopy("zh-CN");
  const markup = renderToStaticMarkup(<ToolsHomePage locale="zh-CN" />);

  expect(markup).toContain('href="/zh/tools/crop-profit"');
  expect(markup).toContain('href="/zh/tools/crop-growth"');
  expect(markup).toMatch(/<a\b[^>]*>\s*季节作物收益\s*<\/a>/);
  expect(markup).toMatch(/<a\b[^>]*>\s*生长与收获日历\s*<\/a>/);
  expect(markup).toContain("进入种植规划");
  expect(markup).toContain("进入加工计算");
  for (const toolId of PROCESSING_TOOL_IDS) {
    const canonicalPath = getProcessingToolDefinition(toolId).canonicalPath;
    expect(markup).toContain(`href="/zh${canonicalPath}"`);
    expect(markup).toContain(copy.categories.processing.tools[toolId]);
  }
  expect(markup).not.toContain('href="/zh/tools/crop-profit?tool=growth"');
  expect(markup).not.toContain('href="/zh/tools/processing"');
});

it.each(["en", "zh-CN"] as const)(
  "keeps both planting tabs and the calculator action without a tools sidebar in %s",
  (locale) => {
    const copy = getToolsPageCopy(locale);
    const tabs = [
      {
        id: "crop-profit",
        href: createCropProfitHref(locale),
        label: copy.frame.profitTab,
        actionLabel: copy.profit.hero.actionLabel,
      },
      {
        id: "crop-growth",
        href: createCropGrowthToolHref(locale),
        label: copy.frame.growthTab,
        actionLabel: copy.growth.hero.actionLabel,
      },
    ] as const;

    for (const currentTab of tabs) {
      const markup = renderToStaticMarkup(
        <PlantingToolFrame
          currentTool={currentTab.id}
          documentHeading
          locale={locale}
          saveStatus="empty"
          title={currentTab.label}
        >
          <div>Planting calculator workspace</div>
        </PlantingToolFrame>,
      );
      const calculatorId = `${currentTab.id}-calculator`;

      expect(markup).not.toMatch(
        new RegExp(`<nav\\b(?=[^>]*aria-label="${escapeRegExp(copy.frame.allTools)}")`),
      );
      for (const tab of tabs) {
        assertLinkWithHrefAndText(
          markup,
          tab.href,
          tab.label,
          tab.id === currentTab.id,
        );
      }
      assertLinkWithHrefAndText(markup, `#${calculatorId}`, currentTab.actionLabel);
      expect(markup).toContain(`id="${calculatorId}"`);
    }
  },
);

it.each([
  {
    locale: "en",
    currentTool: "crop-profit",
    activeTitleId: "crop-profit-hero-title",
    inactiveTitleId: "crop-growth-hero-title",
  },
  {
    locale: "en",
    currentTool: "crop-growth",
    activeTitleId: "crop-growth-hero-title",
    inactiveTitleId: "crop-profit-hero-title",
  },
  {
    locale: "zh-CN",
    currentTool: "crop-profit",
    activeTitleId: "crop-profit-hero-title",
    inactiveTitleId: "crop-growth-hero-title",
  },
  {
    locale: "zh-CN",
    currentTool: "crop-growth",
    activeTitleId: "crop-growth-hero-title",
    inactiveTitleId: "crop-profit-hero-title",
  },
] as const satisfies readonly Readonly<{
  locale: "en" | "zh-CN";
  currentTool: PlantingToolId;
  activeTitleId: string;
  inactiveTitleId: string;
}>[])(
  "server-renders one $currentTool h1 and a paragraph for the hidden hero in $locale",
  ({ locale, currentTool, activeTitleId, inactiveTitleId }) => {
    const markup = renderToStaticMarkup(
      <PlantingToolsWorkspace currentTool={currentTool} locale={locale} />,
    );

    expect(markup.match(/<h1\b/g) ?? []).toHaveLength(1);
    expect(markup).toMatch(new RegExp(`<h1\\b(?=[^>]*\\bid="${activeTitleId}")[^>]*>`));
    expect(markup).not.toMatch(new RegExp(`<h1\\b(?=[^>]*\\bid="${inactiveTitleId}")[^>]*>`));
    expect(markup).toMatch(new RegExp(`<p\\b(?=[^>]*\\bid="${inactiveTitleId}")[^>]*>`));
    expect(markup).toContain(`<section aria-labelledby="${activeTitleId}"`);
    expect(markup).toContain(`<section aria-labelledby="${inactiveTitleId}"`);
    expect(markup).toContain('id="crop-profit-calculator"');
    expect(markup).toContain('id="crop-growth-calculator"');
    expect(markup).toMatch(/<div\b(?=[^>]*\bhidden="")[^>]*>/);
  },
);

it("fails fast when the planting frame document heading flag is not boolean", () => {
  const invalidDocumentHeading = "yes";

  expect(() =>
    renderToStaticMarkup(
      <PlantingToolFrame
        currentTool="crop-profit"
        documentHeading={invalidDocumentHeading as unknown as boolean}
        locale="en"
        saveStatus="empty"
        title="Crop profit"
      >
        <div>Planting calculator workspace</div>
      </PlantingToolFrame>,
    ),
  ).toThrow(`documentHeading=${JSON.stringify(invalidDocumentHeading)}`);
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
