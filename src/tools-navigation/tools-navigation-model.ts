export type ToolsNavigationLocale = "en" | "zh-CN" | "ja" | "ru";

export type ToolsNavigationTool = Readonly<{
  href: string | null;
  id: string;
  label: string;
}>;

export type ToolsNavigationCategory = Readonly<{
  id: string;
  label: string;
  tools: readonly ToolsNavigationTool[];
}>;

export type ToolsNavigationModel = Readonly<{
  allToolsHref: string;
  allToolsLabel: "全部工具";
  backToCategoriesLabel: "返回工具分类";
  categories: readonly ToolsNavigationCategory[];
  categoryPanelTitle: "工具分类";
  locale: ToolsNavigationLocale;
  toolsHomeHref: string;
  triggerLabel: "Stardew Valley tools";
}>;

type ToolsNavigationCatalogTool = Readonly<{
  id: string;
  label: string;
  path: string | null;
}>;

type ToolsNavigationCatalogCategory = Readonly<{
  id: string;
  label: string;
  tools: readonly ToolsNavigationCatalogTool[];
}>;

const TOOLS_NAVIGATION_CATALOG: readonly ToolsNavigationCatalogCategory[] = [
  {
    id: "planting",
    label: "种植规划",
    tools: [
      {
        id: "crop-profit",
        label: "季节作物收益",
        path: "/tools/crop-profit",
      },
      {
        id: "crop-growth",
        label: "生长与收获日历",
        path: "/tools/crop-profit",
      },
    ],
  },
  {
    id: "processing",
    label: "加工计算",
    tools: [
      { id: "basic-processing-profit", label: "基础加工收益", path: null },
      { id: "machine-comparison", label: "三种机器比较", path: null },
      { id: "keg-processing", label: "Keg 加工", path: null },
      { id: "preserves-jar-processing", label: "罐头瓶加工", path: null },
      { id: "dehydrator-processing", label: "烘干机加工", path: null },
      { id: "keg-ingredient-ranking", label: "Keg 原料排行", path: null },
      { id: "cask-aging", label: "酒窖陈酿", path: null },
    ],
  },
  {
    id: "production",
    label: "生产计划",
    tools: [
      { id: "today-processing-list", label: "今日加工清单", path: null },
      { id: "production-schedule", label: "综合生产排程", path: null },
    ],
  },
  {
    id: "workshop",
    label: "工坊建设",
    tools: [
      { id: "keg-count", label: "需要多少 Keg", path: null },
      { id: "materials-and-resin", label: "材料与树脂时间", path: null },
    ],
  },
];

export function getToolsNavigationModel(locale: string): ToolsNavigationModel {
  const toolsNavigationLocale = readToolsNavigationLocale(locale);
  const pathPrefix = readToolsNavigationPathPrefix(toolsNavigationLocale);

  return {
    allToolsHref: `${pathPrefix}/tools`,
    allToolsLabel: "全部工具",
    backToCategoriesLabel: "返回工具分类",
    categories: createToolsNavigationCategories(toolsNavigationLocale, pathPrefix),
    categoryPanelTitle: "工具分类",
    locale: toolsNavigationLocale,
    toolsHomeHref: `${pathPrefix}/tools`,
    triggerLabel: "Stardew Valley tools",
  };
}

export function readToolsNavigationCategory(
  model: ToolsNavigationModel,
  categoryId: string,
): ToolsNavigationCategory {
  const category = model.categories.find(
    (toolsNavigationCategory) => toolsNavigationCategory.id === categoryId,
  );

  if (category === undefined) {
    throw new Error(
      `Unknown tools navigation category ${JSON.stringify(categoryId)}.`,
    );
  }

  return category;
}

export function readToolsNavigationTool(
  model: ToolsNavigationModel,
  toolId: string,
): ToolsNavigationTool {
  for (const category of model.categories) {
    const tool = category.tools.find(
      (toolsNavigationTool) => toolsNavigationTool.id === toolId,
    );

    if (tool !== undefined) {
      return tool;
    }
  }

  throw new Error(`Unknown tools navigation tool ${JSON.stringify(toolId)}.`);
}

function readToolsNavigationLocale(locale: string): ToolsNavigationLocale {
  if (
    locale === "en" ||
    locale === "zh-CN" ||
    locale === "ja" ||
    locale === "ru"
  ) {
    return locale;
  }

  throw new Error(
    `Unknown tools navigation locale ${JSON.stringify(locale)}.`,
  );
}

function readToolsNavigationPathPrefix(
  locale: ToolsNavigationLocale,
): "" | "/zh" {
  if (locale === "en" || locale === "ja" || locale === "ru") {
    return "";
  }

  if (locale === "zh-CN") {
    return "/zh";
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Unknown tools navigation locale ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function createToolsNavigationCategories(
  locale: ToolsNavigationLocale,
  pathPrefix: "" | "/zh",
): readonly ToolsNavigationCategory[] {
  return TOOLS_NAVIGATION_CATALOG.map((category) => ({
    id: category.id,
    label: category.label,
    tools: category.tools.map((tool) => ({
      href: readToolsNavigationToolHref(pathPrefix, tool),
      id: tool.id,
      label: readToolsNavigationToolLabel(locale, tool),
    })),
  }));
}

function readToolsNavigationToolLabel(
  locale: ToolsNavigationLocale,
  tool: ToolsNavigationCatalogTool,
): string {
  if (locale === "zh-CN") {
    return tool.label;
  }

  if (locale === "en" || locale === "ja" || locale === "ru") {
    return readEnglishToolsNavigationToolLabel(tool);
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Unknown tools navigation locale ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function readEnglishToolsNavigationToolLabel(
  tool: ToolsNavigationCatalogTool,
): string {
  if (tool.id === "crop-profit") {
    return "Season profit";
  }

  if (tool.id === "crop-growth") {
    return "Growth calendar";
  }

  return tool.label;
}

function readToolsNavigationToolHref(
  pathPrefix: "" | "/zh",
  tool: ToolsNavigationCatalogTool,
): string | null {
  if (tool.path === null) {
    return null;
  }

  if (!tool.path.startsWith("/tools/")) {
    throw new Error(`Unknown tools navigation tool ${JSON.stringify(tool.id)}.`);
  }

  const href = `${pathPrefix}${tool.path}`;
  if (tool.id === "crop-growth") {
    return `${href}?tool=growth`;
  }

  return href;
}
