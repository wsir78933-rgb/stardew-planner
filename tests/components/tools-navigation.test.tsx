import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { HomepageLocaleSwitcher } from "@/src/components/homepage-locale-switcher";
import { HomepageNavigationDock } from "@/src/components/homepage-navigation-dock";
import { SiteNavigationDock } from "@/src/components/site-navigation-dock";
import { homepageCopyByLocale } from "@/src/homepage/homepage-copy";
import type { HomepageLocale } from "@/src/homepage/homepage-locale";
import {
  activateToolsNavigationCategory,
  activateToolsNavigationTrigger,
  createClosedToolsNavigationInteraction,
  hoverToolsNavigationCategory,
  moveToolsNavigationFocus,
  openToolsNavigationFromPointerHover,
  readToolsNavigationCategoryFocusKey,
  readToolsNavigationToolFocusKey,
  returnToToolsNavigationCategories,
  TOOLS_NAVIGATION_TRIGGER_FOCUS_KEY,
} from "@/src/tools-navigation/tools-navigation-interaction";
import {
  getToolsNavigationModel,
  readToolsNavigationCategory,
  readToolsNavigationTool,
} from "@/src/tools-navigation/tools-navigation-model";

const localeHrefByLocale = {
  en: "/",
  ja: "/ja",
  ru: "/ru",
  "zh-CN": "/zh",
} as const;

function renderHomepageDock(currentLocale: HomepageLocale): string {
  return renderToStaticMarkup(
    <HomepageNavigationDock
      copy={homepageCopyByLocale[currentLocale]}
      currentLocale={currentLocale}
      localeHrefByLocale={localeHrefByLocale}
      localeSwitcher={
        <HomepageLocaleSwitcher
          label={homepageCopyByLocale[currentLocale].navigation.languageLabel}
          localeHrefByLocale={localeHrefByLocale}
        />
      }
      plannerHref="#planner"
    />,
  );
}

function readToolsNavigationTriggerMarkup(markup: string): string {
  const triggerMarkup = markup.match(
    /<a\b[^>]*data-tools-navigation-trigger[^>]*>/,
  )?.[0];

  if (triggerMarkup === undefined) {
    throw new Error(
      `Tools navigation trigger was not found. Received: ${markup}`,
    );
  }

  return triggerMarkup;
}

function readToolsCategoryFlyoutMarkup(markup: string, categoryId: string): string {
  const panelStart = markup.indexOf(`data-tools-tool-panel="${categoryId}"`);
  if (panelStart === -1) {
    throw new Error(
      `Tools panel ${JSON.stringify(categoryId)} was not found. Received: ${markup}`,
    );
  }

  const nextPanelStart = markup.indexOf(
    'data-tools-tool-panel="',
    panelStart + 'data-tools-tool-panel="'.length,
  );

  return markup.slice(
    panelStart,
    nextPanelStart === -1 ? undefined : nextPanelStart,
  );
}

test("renders Stardew Valley tools and the desktop planting flyout for en", () => {
  const markup = renderHomepageDock("en");
  const plantingFlyoutMarkup = readToolsCategoryFlyoutMarkup(markup, "planting");
  const processingFlyoutMarkup = readToolsCategoryFlyoutMarkup(markup, "processing");
  const blogIndex = markup.indexOf("<span>Blog</span>");
  const toolsIndex = markup.indexOf("<span>Stardew Valley tools</span>");
  const languageIndex = markup.indexOf("<span>Language</span>");
  const plannerIndex = markup.indexOf("<span>Open planner</span>");

  expect(readToolsNavigationTriggerMarkup(markup)).toContain('href="/tools"');
  expect(markup).toContain("工具分类");
  expect(markup).toContain("种植规划");
  expect(markup.indexOf("种植规划")).toBeLessThan(markup.indexOf("加工计算"));
  expect(markup.indexOf("加工计算")).toBeLessThan(markup.indexOf("生产计划"));
  expect(markup.indexOf("生产计划")).toBeLessThan(markup.indexOf("工坊建设"));
  expect(markup.indexOf("工坊建设")).toBeLessThan(markup.indexOf("全部工具"));
  expect(markup.match(/data-tools-navigation-chevron/g)?.length).toBe(4);
  expect(plantingFlyoutMarkup).toContain('href="/tools/crop-profit"');
  expect(plantingFlyoutMarkup).toContain('href="/tools/crop-growth"');
  expect(plantingFlyoutMarkup).toMatch(/<a\b[^>]*>\s*Season profit\s*<\/a>/);
  expect(plantingFlyoutMarkup).toMatch(/<a\b[^>]*>\s*Growth calendar\s*<\/a>/);
  expect(plantingFlyoutMarkup).not.toContain('href="/tools/crop-profit?tool=growth"');
  expect(plantingFlyoutMarkup.match(/<a\b/g)?.length).toBe(2);
  expect(markup).toContain('href="/tools/today-processing-list"');
  expect(markup).toContain('href="/tools/materials-and-resin"');
  for (const [toolPath, toolLabel] of [
    ["basic-processing-profit", "Basic processing profit"],
    ["machine-comparison", "Three-machine comparison"],
    ["keg-processing", "Keg processing"],
    ["preserves-jar-processing", "Preserves jar processing"],
    ["dehydrator-processing", "Dehydrator processing"],
    ["keg-ingredient-ranking", "Keg ingredient ranking"],
    ["cask-aging", "Cask aging"],
  ] as const) {
    expect(processingFlyoutMarkup).toContain(`href="/tools/${toolPath}"`);
    expect(processingFlyoutMarkup).toContain(`>${toolLabel}</a>`);
  }
  expect(processingFlyoutMarkup.match(/<a\b/g)?.length).toBe(7);
  expect(markup).not.toContain("本机保存");
  expect(blogIndex).toBeGreaterThan(-1);
  expect(blogIndex).toBeLessThan(toolsIndex);
  expect(toolsIndex).toBeLessThan(languageIndex);
  expect(languageIndex).toBeLessThan(plannerIndex);
});

test("connects the tools trigger and every category to a unique controlled panel", () => {
  for (const locale of ["en", "zh-CN"] as const) {
    const markup = renderHomepageDock(locale);
    const categoryButtons = markup.match(/<button\b[^>]*data-tools-category="[^"]+"[^>]*>/g) ?? [];
    expect(categoryButtons).toHaveLength(4);

    for (const control of [readToolsNavigationTriggerMarkup(markup), ...categoryButtons]) {
      const panelId = control.match(/aria-controls="([^"]+)"/)?.[1];
      expect(panelId).toBeDefined();
      expect(markup.split(` id="${panelId}"`)).toHaveLength(2);
    }
  }
});

test("keeps the tools label in Japanese and prefixes Chinese tool hrefs", () => {
  const japaneseMarkup = renderHomepageDock("ja");
  const chineseMarkup = renderHomepageDock("zh-CN");
  const japaneseProcessingFlyoutMarkup = readToolsCategoryFlyoutMarkup(
    japaneseMarkup,
    "processing",
  );
  const chineseProcessingFlyoutMarkup = readToolsCategoryFlyoutMarkup(
    chineseMarkup,
    "processing",
  );

  expect(japaneseMarkup).toContain("<span>Stardew Valley tools</span>");
  expect(readToolsNavigationTriggerMarkup(japaneseMarkup)).toContain('href="/tools"');
  expect(japaneseMarkup).not.toContain('href="/ja/tools"');
  expect(readToolsCategoryFlyoutMarkup(japaneseMarkup, "planting")).toContain('href="/tools/crop-profit"');
  expect(readToolsCategoryFlyoutMarkup(japaneseMarkup, "planting")).toContain(
    'href="/tools/crop-growth"',
  );
  expect(readToolsCategoryFlyoutMarkup(japaneseMarkup, "planting")).toMatch(/<a\b[^>]*>\s*Season profit\s*<\/a>/);
  expect(readToolsCategoryFlyoutMarkup(japaneseMarkup, "planting")).toMatch(
    /<a\b[^>]*>\s*Growth calendar\s*<\/a>/,
  );
  expect(readToolsCategoryFlyoutMarkup(japaneseMarkup, "planting")).not.toContain('href="/tools/crop-profit?tool=growth"');
  expect(japaneseProcessingFlyoutMarkup).toContain('href="/tools/cask-aging"');
  expect(japaneseProcessingFlyoutMarkup).toContain("Cask aging");
  expect(readToolsNavigationTriggerMarkup(chineseMarkup)).toContain('href="/zh/tools"');
  expect(readToolsCategoryFlyoutMarkup(chineseMarkup, "planting")).toContain(
    'href="/zh/tools/crop-profit"',
  );
  expect(readToolsCategoryFlyoutMarkup(chineseMarkup, "planting")).toContain(
    'href="/zh/tools/crop-growth"',
  );
  expect(readToolsCategoryFlyoutMarkup(chineseMarkup, "planting")).toMatch(/<a\b[^>]*>\s*季节作物收益\s*<\/a>/);
  expect(readToolsCategoryFlyoutMarkup(chineseMarkup, "planting")).toMatch(/<a\b[^>]*>\s*生长与收获日历\s*<\/a>/);
  expect(readToolsCategoryFlyoutMarkup(chineseMarkup, "planting")).not.toContain('href="/zh/tools/crop-profit?tool=growth"');
  expect(chineseProcessingFlyoutMarkup).toContain('href="/zh/tools/basic-processing-profit"');
  expect(chineseProcessingFlyoutMarkup).toContain("基础加工收益");
  expect(chineseProcessingFlyoutMarkup).toContain('href="/zh/tools/cask-aging"');
  expect(chineseProcessingFlyoutMarkup).toContain("酒窖陈酿");
});

test("uses English labels and unprefixed tool paths for Russian", () => {
  const russianModel = getToolsNavigationModel("ru");
  const russianMarkup = renderHomepageDock("ru");
  const russianPlantingFlyoutMarkup = readToolsCategoryFlyoutMarkup(russianMarkup, "planting");
  const russianProcessingFlyoutMarkup = readToolsCategoryFlyoutMarkup(russianMarkup, "processing");

  expect(russianModel.locale).toBe("ru");
  expect(russianModel.allToolsHref).toBe("/tools");
  expect(russianModel.toolsHomeHref).toBe("/tools");
  expect(readToolsNavigationTool(russianModel, "crop-profit")).toEqual({
    href: "/tools/crop-profit",
    id: "crop-profit",
    label: "Season profit",
  });
  expect(readToolsNavigationTool(russianModel, "crop-growth")).toEqual({
    href: "/tools/crop-growth",
    id: "crop-growth",
    label: "Growth calendar",
  });
  expect(readToolsNavigationTool(russianModel, "machine-comparison")).toEqual({
    href: "/tools/machine-comparison",
    id: "machine-comparison",
    label: "Three-machine comparison",
  });
  expect(russianMarkup).toContain("<span>Stardew Valley tools</span>");
  expect(readToolsNavigationTriggerMarkup(russianMarkup)).toContain(
    'href="/tools"',
  );
  expect(russianMarkup).not.toContain('href="/ru/tools');
  expect(russianPlantingFlyoutMarkup).toContain('href="/tools/crop-profit"');
  expect(russianPlantingFlyoutMarkup).toContain(
    'href="/tools/crop-growth"',
  );
  expect(russianPlantingFlyoutMarkup).toContain("Season profit");
  expect(russianPlantingFlyoutMarkup).toContain("Growth calendar");
  expect(russianProcessingFlyoutMarkup).toContain('href="/tools/keg-ingredient-ranking"');
  expect(russianProcessingFlyoutMarkup).toContain("Keg ingredient ranking");
});

test("shows an optional dock trailing slot only when a page passes one", () => {
  const markup = renderToStaticMarkup(
    <SiteNavigationDock
      blogHref="/blog"
      blogLabel="Blog"
      brandHref="/"
      brandLabel="Stardew Valley Farm Planner"
      currentLocale="en"
      headerTrailing={<span>本机保存</span>}
      languageLabel="Language"
      languageMode="static"
      localeHrefByLocale={localeHrefByLocale}
      plannerHref="/#planner"
      plannerLabel="Open planner"
      surface="public"
    />,
  );
  const plannerIndex = markup.indexOf("<span>Open planner</span>");
  const trailingIndex = markup.indexOf("<span>本机保存</span>");

  expect(plannerIndex).toBeGreaterThan(-1);
  expect(plannerIndex).toBeLessThan(trailingIndex);
});

test("opens planting from the desktop hover path and rejects unknown ids", () => {
  const model = getToolsNavigationModel("en");
  const hovered = hoverToolsNavigationCategory(
    openToolsNavigationFromPointerHover(createClosedToolsNavigationInteraction()),
    "planting",
  );
  const planting = readToolsNavigationCategory(model, hovered.openCategoryId ?? "");
  const openedFromKeyboard = moveToolsNavigationFocus({
    canHoverFinePointer: true,
    categoryIds: model.categories.map((category) => category.id),
    currentFocusKey: TOOLS_NAVIGATION_TRIGGER_FOCUS_KEY,
    interaction: createClosedToolsNavigationInteraction(),
    key: "ArrowDown",
    toolIds: [],
  });
  const closed = moveToolsNavigationFocus({
    canHoverFinePointer: true,
    categoryIds: model.categories.map((category) => category.id),
    currentFocusKey: openedFromKeyboard.focusKey ?? TOOLS_NAVIGATION_TRIGGER_FOCUS_KEY,
    interaction: openedFromKeyboard,
    key: "Escape",
    toolIds: [],
  });
  const mobileTools = activateToolsNavigationCategory(
    activateToolsNavigationTrigger(createClosedToolsNavigationInteraction()),
    "processing",
    false,
  );
  const backToCategories = returnToToolsNavigationCategories("processing");

  expect(hovered.isCategoryPanelOpen).toBe(true);
  expect(hovered.openCategoryId).toBe("planting");
  expect(planting.label).toBe("种植规划");
  expect(planting.tools).toEqual([
    {
      href: "/tools/crop-profit",
      id: "crop-profit",
      label: "Season profit",
    },
    {
      href: "/tools/crop-growth",
      id: "crop-growth",
      label: "Growth calendar",
    },
  ]);
  expect(openedFromKeyboard.focusKey).toBe(
    readToolsNavigationCategoryFocusKey("planting"),
  );
  expect(closed.isCategoryPanelOpen).toBe(false);
  expect(closed.focusKey).toBe(TOOLS_NAVIGATION_TRIGGER_FOCUS_KEY);
  expect(closed.suppressHover).toBe(true);
  expect(mobileTools.showsMobileToolList).toBe(true);
  expect(
    readToolsNavigationCategory(model, "processing").tools.every(
      (tool) => tool.href !== null,
    ),
  ).toBe(true);
  expect(
    readToolsNavigationCategory(model, "production").tools.every(
      (tool) => tool.href === `/tools/${tool.id}`,
    ),
  ).toBe(true);
  expect(
    readToolsNavigationCategory(model, "workshop").tools.every(
      (tool) => tool.href === `/tools/${tool.id}`,
    ),
  ).toBe(true);
  expect(backToCategories.showsMobileToolList).toBe(false);
  expect(backToCategories.isCategoryPanelOpen).toBe(true);
  expect(readToolsNavigationTool(model, "crop-profit").href).toBe(
    "/tools/crop-profit",
  );
  expect(() => getToolsNavigationModel("fr")).toThrow('"fr"');
  expect(() => getToolsNavigationModel("ru-RU")).toThrow('"ru-RU"');
  expect(() => readToolsNavigationCategory(model, "nope")).toThrow('"nope"');
  expect(() => readToolsNavigationTool(model, "missing-tool")).toThrow(
    '"missing-tool"',
  );
  expect(readToolsNavigationTool(model, "crop-growth").href).toBe(
    "/tools/crop-growth",
  );
});

test("moves the keyboard into the first planting tool without trapping on Escape", () => {
  const model = getToolsNavigationModel("zh-CN");
  const categoryIds = model.categories.map((category) => category.id);
  const planting = readToolsNavigationCategory(model, "planting");
  const categoryFocus = moveToolsNavigationFocus({
    canHoverFinePointer: false,
    categoryIds,
    currentFocusKey: TOOLS_NAVIGATION_TRIGGER_FOCUS_KEY,
    interaction: createClosedToolsNavigationInteraction(),
    key: "ArrowDown",
    toolIds: planting.tools.map((tool) => tool.id),
  });
  const toolFocus = moveToolsNavigationFocus({
    canHoverFinePointer: false,
    categoryIds,
    currentFocusKey: categoryFocus.focusKey ?? "",
    interaction: categoryFocus,
    key: "ArrowRight",
    toolIds: planting.tools.map((tool) => tool.id),
  });

  const nextPlantingTool = moveToolsNavigationFocus({
    canHoverFinePointer: true,
    categoryIds,
    currentFocusKey: readToolsNavigationToolFocusKey("crop-profit"),
    interaction: {
      ...toolFocus,
      showsMobileToolList: false,
    },
    key: "ArrowDown",
    toolIds: planting.tools.map((tool) => tool.id),
  });

  expect(categoryFocus.showsMobileToolList).toBe(false);
  expect(toolFocus.showsMobileToolList).toBe(true);
  expect(toolFocus.focusKey).toBe(readToolsNavigationToolFocusKey("crop-profit"));
  expect(readToolsNavigationTool(model, "crop-profit").href).toBe(
    "/zh/tools/crop-profit",
  );
  expect(readToolsNavigationTool(model, "crop-profit").label).toBe("季节作物收益");
  expect(readToolsNavigationTool(model, "crop-growth").href).toBe(
    "/zh/tools/crop-growth",
  );
  expect(readToolsNavigationTool(model, "crop-growth").label).toBe("生长与收获日历");
  expect(nextPlantingTool.showsMobileToolList).toBe(false);
  expect(nextPlantingTool.focusKey).toBe(
    readToolsNavigationToolFocusKey("crop-growth"),
  );
});
