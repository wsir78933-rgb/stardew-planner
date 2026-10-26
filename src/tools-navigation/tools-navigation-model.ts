import {
  getProcessingToolDefinition,
  isProcessingToolId,
  type ProcessingToolId,
} from "../tools-pages/processing/processing-tool-definition";
import { getPlanningToolPath, isPlanningToolId } from "../tools-pages/planning-tool-definition";

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
  allToolsLabel: string;
  backToCategoriesLabel: string;
  categories: readonly ToolsNavigationCategory[];
  categoryPanelTitle: string;
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
  tools: readonly ToolsNavigationCatalogTool[];
}>;

type ToolsNavigationChromeLabels = Readonly<{
  allToolsLabel: string;
  backToCategoriesLabel: string;
  categoryPanelTitle: string;
}>;

const TOOLS_NAVIGATION_CATALOG: readonly ToolsNavigationCatalogCategory[] = [
  {
    id: "planting",
    tools: [
      {
        id: "crop-profit",
        label: "季节作物收益",
        path: "/tools/crop-profit",
      },
      {
        id: "crop-growth",
        label: "生长与收获日历",
        path: "/tools/crop-growth",
      },
    ],
  },
  {
    id: "processing",
    tools: [
      {
        id: "basic-processing-profit",
        label: "基础加工收益",
        path: getProcessingToolDefinition("basic-processing-profit").canonicalPath,
      },
      {
        id: "machine-comparison",
        label: "三种机器比较",
        path: getProcessingToolDefinition("machine-comparison").canonicalPath,
      },
      {
        id: "keg-processing",
        label: "Keg 加工",
        path: getProcessingToolDefinition("keg-processing").canonicalPath,
      },
      {
        id: "preserves-jar-processing",
        label: "罐头瓶加工",
        path: getProcessingToolDefinition("preserves-jar-processing").canonicalPath,
      },
      {
        id: "dehydrator-processing",
        label: "烘干机加工",
        path: getProcessingToolDefinition("dehydrator-processing").canonicalPath,
      },
      {
        id: "keg-ingredient-ranking",
        label: "Keg 原料排行",
        path: getProcessingToolDefinition("keg-ingredient-ranking").canonicalPath,
      },
      {
        id: "cask-aging",
        label: "酒窖陈酿",
        path: getProcessingToolDefinition("cask-aging").canonicalPath,
      },
    ],
  },
  {
    id: "production",
    tools: [
      { id: "today-processing-list", label: "今日加工清单", path: getPlanningToolPath("today-processing-list") },
      { id: "production-schedule", label: "综合生产排程", path: getPlanningToolPath("production-schedule") },
    ],
  },
  {
    id: "workshop",
    tools: [
      { id: "keg-count", label: "需要多少 Keg", path: getPlanningToolPath("keg-count") },
      { id: "materials-and-resin", label: "材料与树脂时间", path: getPlanningToolPath("materials-and-resin") },
    ],
  },
];

export function getToolsNavigationModel(locale: string): ToolsNavigationModel {
  const toolsNavigationLocale = readToolsNavigationLocale(locale);
  const pathPrefix = readToolsNavigationPathPrefix(toolsNavigationLocale);

  const toolsNavigationChromeLabels = readToolsNavigationChromeLabels(
    toolsNavigationLocale,
  );

  return {
    allToolsHref: `${pathPrefix}/tools`,
    allToolsLabel: toolsNavigationChromeLabels.allToolsLabel,
    backToCategoriesLabel: toolsNavigationChromeLabels.backToCategoriesLabel,
    categories: createToolsNavigationCategories(toolsNavigationLocale, pathPrefix),
    categoryPanelTitle: toolsNavigationChromeLabels.categoryPanelTitle,
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
    label: readToolsNavigationCategoryLabel(locale, category.id),
    tools: category.tools.map((tool) => ({
      href: readToolsNavigationToolHref(pathPrefix, tool),
      id: tool.id,
      label: readToolsNavigationToolLabel(locale, tool),
    })),
  }));
}

function readToolsNavigationChromeLabels(
  locale: ToolsNavigationLocale,
): ToolsNavigationChromeLabels {
  if (locale === "zh-CN") {
    return readChineseToolsNavigationChromeLabels();
  }

  if (locale === "en" || locale === "ja" || locale === "ru") {
    return readEnglishToolsNavigationChromeLabels();
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Unknown tools navigation locale ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function readChineseToolsNavigationChromeLabels(): ToolsNavigationChromeLabels {
  return {
    allToolsLabel: "全部工具",
    backToCategoriesLabel: "返回工具分类",
    categoryPanelTitle: "工具分类",
  };
}

function readEnglishToolsNavigationChromeLabels(): ToolsNavigationChromeLabels {
  return {
    allToolsLabel: "All tools",
    backToCategoriesLabel: "Back to tool categories",
    categoryPanelTitle: "Tool categories",
  };
}

function readToolsNavigationCategoryLabel(
  locale: ToolsNavigationLocale,
  categoryId: string,
): string {
  if (locale === "zh-CN") {
    return readChineseToolsNavigationCategoryLabel(categoryId);
  }

  if (locale === "en" || locale === "ja" || locale === "ru") {
    return readEnglishToolsNavigationCategoryLabel(categoryId);
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Unknown tools navigation locale ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function readChineseToolsNavigationCategoryLabel(categoryId: string): string {
  if (categoryId === "planting") {
    return "种植规划";
  }

  if (categoryId === "processing") {
    return "加工计算";
  }

  if (categoryId === "production") {
    return "生产计划";
  }

  if (categoryId === "workshop") {
    return "工坊建设";
  }

  throw new Error(
    `Unknown tools navigation category ${JSON.stringify(categoryId)}.`,
  );
}

function readEnglishToolsNavigationCategoryLabel(categoryId: string): string {
  if (categoryId === "planting") {
    return "Crops";
  }

  if (categoryId === "processing") {
    return "Processing";
  }

  if (categoryId === "production") {
    return "Daily tasks";
  }

  if (categoryId === "workshop") {
    return "Shed";
  }

  throw new Error(
    `Unknown tools navigation category ${JSON.stringify(categoryId)}.`,
  );
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

  if (isProcessingToolId(tool.id)) {
    return PROCESSING_TOOL_ENGLISH_LABELS[tool.id];
  }

  if (isPlanningToolId(tool.id)) {
    return {
      "today-processing-list": "Today's processing list",
      "production-schedule": "Production schedule",
      "keg-count": "How many Kegs?",
      "materials-and-resin": "Materials and resin timing",
    }[tool.id];
  }

  return tool.label;
}

const PROCESSING_TOOL_ENGLISH_LABELS: Readonly<Record<ProcessingToolId, string>> = {
  "basic-processing-profit": "Basic processing profit",
  "machine-comparison": "Three-machine comparison",
  "keg-processing": "Keg processing",
  "preserves-jar-processing": "Preserves jar processing",
  "dehydrator-processing": "Dehydrator processing",
  "keg-ingredient-ranking": "Keg ingredient ranking",
  "cask-aging": "Cask aging",
};

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
  return href;
}
