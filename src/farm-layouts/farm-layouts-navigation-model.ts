import { beachFarmCanonicalPath } from "./beach-farm-content";
import { meadowlandsFarmCanonicalPath } from "./meadowlands-farm-content";
import {
  isHomepageDisplayLocale,
  type HomepageDisplayLocale,
} from "../homepage/homepage-locale";

export const FARM_LAYOUTS_NAVIGATION_CATEGORY_IDS = [
  "farm-maps",
  "greenhouse-layouts",
  "buildings-interiors",
  "planting-layouts",
  "layout-ideas",
] as const;

export type FarmLayoutsNavigationCategoryId =
  (typeof FARM_LAYOUTS_NAVIGATION_CATEGORY_IDS)[number];

export type FarmLayoutsNavigationPageId = "beach-farm" | "meadowlands-farm";

export type FarmLayoutsNavigationPage = Readonly<{
  href: string;
  id: FarmLayoutsNavigationPageId;
  label: string;
}>;

export type FarmLayoutsNavigationCategory = Readonly<{
  id: FarmLayoutsNavigationCategoryId;
  label: string;
  pages: readonly FarmLayoutsNavigationPage[];
}>;

export type FarmLayoutsNavigationModel = Readonly<{
  backToCategoriesLabel: string;
  categories: readonly FarmLayoutsNavigationCategory[];
  categoryPanelTitle: string;
  emptyStateLabel: string;
  triggerLabel: "Farm Layouts";
}>;

export function getFarmLayoutsNavigationModel(
  locale: string,
): FarmLayoutsNavigationModel {
  if (!isHomepageDisplayLocale(locale)) {
    throw new TypeError(
      `Farm layouts navigation locale must be "en", "zh-CN", "ja", or "ru"; received ${JSON.stringify(locale)}.`,
    );
  }

  const usesChineseCopy = locale === "zh-CN";

  return {
    backToCategoriesLabel: usesChineseCopy
      ? "返回布局分类"
      : "Back to layout categories",
    categories: createFarmLayoutsNavigationCategories(locale),
    categoryPanelTitle: usesChineseCopy ? "布局分类" : "Layout categories",
    emptyStateLabel: usesChineseCopy
      ? "暂无布局案例。"
      : "No layouts yet.",
    triggerLabel: "Farm Layouts",
  };
}

export function isFarmLayoutsNavigationCategoryId(
  categoryId: string,
): categoryId is FarmLayoutsNavigationCategoryId {
  return FARM_LAYOUTS_NAVIGATION_CATEGORY_IDS.some(
    (supportedCategoryId) => supportedCategoryId === categoryId,
  );
}

export function isFarmLayoutsNavigationPageId(
  pageId: string,
): pageId is FarmLayoutsNavigationPageId {
  return pageId === "beach-farm" || pageId === "meadowlands-farm";
}

export function readFarmLayoutsNavigationCategory(
  model: FarmLayoutsNavigationModel,
  categoryId: string,
): FarmLayoutsNavigationCategory {
  if (!isFarmLayoutsNavigationCategoryId(categoryId)) {
    throw new Error(
      `Unknown Farm Layouts navigation category ${JSON.stringify(categoryId)}.`,
    );
  }

  const category = model.categories.find(
    (farmLayoutsCategory) => farmLayoutsCategory.id === categoryId,
  );
  if (category === undefined) {
    throw new Error(
      `Missing Farm Layouts navigation category ${JSON.stringify(categoryId)} from the model.`,
    );
  }

  return category;
}

export function readFarmLayoutsNavigationPage(
  model: FarmLayoutsNavigationModel,
  categoryId: string,
  pageId: string,
): FarmLayoutsNavigationPage {
  const category = readFarmLayoutsNavigationCategory(model, categoryId);
  const page = category.pages.find(
    (farmLayoutsPage) => farmLayoutsPage.id === pageId,
  );
  if (page === undefined) {
    throw new Error(
      `Unknown Farm Layouts navigation page ${JSON.stringify(pageId)} in category ${JSON.stringify(categoryId)}.`,
    );
  }

  return page;
}

function createFarmLayoutsNavigationCategories(
  locale: HomepageDisplayLocale,
): readonly FarmLayoutsNavigationCategory[] {
  const categoryLabels: Readonly<
    Record<FarmLayoutsNavigationCategoryId, string>
  > =
    locale === "zh-CN"
      ? {
          "farm-maps": "农场地图",
          "greenhouse-layouts": "温室布局",
          "buildings-interiors": "建筑与室内",
          "planting-layouts": "种植布局",
          "layout-ideas": "布局灵感",
        }
      : {
          "farm-maps": "Farm Maps",
          "greenhouse-layouts": "Greenhouse Layouts",
          "buildings-interiors": "Buildings & Interiors",
          "planting-layouts": "Planting Layouts",
          "layout-ideas": "Layout Ideas",
        };
  const farmMapPages: readonly FarmLayoutsNavigationPage[] = [
    {
      href: locale === "zh-CN"
        ? `/zh${beachFarmCanonicalPath}`
        : beachFarmCanonicalPath,
      id: "beach-farm",
      label: locale === "zh-CN" ? "海滩农场布局" : "Beach Farm Layouts",
    },
    {
      href: locale === "zh-CN"
        ? `/zh${meadowlandsFarmCanonicalPath}`
        : meadowlandsFarmCanonicalPath,
      id: "meadowlands-farm",
      label: locale === "zh-CN"
        ? "草原农场布局"
        : "Meadowlands Farm layout",
    },
  ];

  return FARM_LAYOUTS_NAVIGATION_CATEGORY_IDS.map((categoryId) => ({
    id: categoryId,
    label: categoryLabels[categoryId],
    pages: categoryId === "farm-maps" ? farmMapPages : [],
  }));
}
