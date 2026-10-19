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

function readPlantingFlyoutMarkup(markup: string): string {
  const panelStart = markup.indexOf('data-tools-tool-panel="planting"');
  if (panelStart === -1) {
    throw new Error(`Planting tool panel was not found. Received: ${markup}`);
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
  const plantingFlyoutMarkup = readPlantingFlyoutMarkup(markup);
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
  expect(plantingFlyoutMarkup).toContain("季节作物收益");
  expect(plantingFlyoutMarkup).toContain("生长与收获日历");
  expect(markup).toContain('aria-disabled="true"');
  expect(markup).not.toContain(">基础加工收益</a>");
  expect(markup).not.toContain("本机保存");
  expect(blogIndex).toBeGreaterThan(-1);
  expect(blogIndex).toBeLessThan(toolsIndex);
  expect(toolsIndex).toBeLessThan(languageIndex);
  expect(languageIndex).toBeLessThan(plannerIndex);
});

test("keeps the tools label in Japanese and prefixes Chinese tool hrefs", () => {
  const japaneseMarkup = renderHomepageDock("ja");
  const chineseMarkup = renderHomepageDock("zh-CN");

  expect(japaneseMarkup).toContain("<span>Stardew Valley tools</span>");
  expect(readToolsNavigationTriggerMarkup(japaneseMarkup)).toContain('href="/tools"');
  expect(japaneseMarkup).not.toContain('href="/ja/tools"');
  expect(readToolsNavigationTriggerMarkup(chineseMarkup)).toContain('href="/zh/tools"');
  expect(readPlantingFlyoutMarkup(chineseMarkup)).toContain(
    'href="/zh/tools/crop-profit"',
  );
  expect(readPlantingFlyoutMarkup(chineseMarkup)).toContain(
    'href="/zh/tools/crop-growth"',
  );
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
  expect(planting.tools.map((tool) => tool.href)).toEqual([
    "/tools/crop-profit",
    "/tools/crop-growth",
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
      (tool) => tool.href === null,
    ),
  ).toBe(true);
  expect(backToCategories.showsMobileToolList).toBe(false);
  expect(backToCategories.isCategoryPanelOpen).toBe(true);
  expect(readToolsNavigationTool(model, "crop-profit").href).toBe(
    "/tools/crop-profit",
  );
  expect(() => getToolsNavigationModel("fr")).toThrow('"fr"');
  expect(() => readToolsNavigationCategory(model, "nope")).toThrow('"nope"');
  expect(() => readToolsNavigationTool(model, "missing-tool")).toThrow(
    '"missing-tool"',
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
  expect(nextPlantingTool.showsMobileToolList).toBe(false);
  expect(nextPlantingTool.focusKey).toBe(
    readToolsNavigationToolFocusKey("crop-growth"),
  );
});
