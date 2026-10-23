import { beachFarmCanonicalPath } from "./beach-farm-content";
import { expandedFarmCanonicalPath } from "./expanded-farm-content";
import { fishFarmCanonicalPath } from "./fish-farm-content";
import { forestFarmCanonicalPath } from "./forest-farm-content";
import { fourCornersFarmCanonicalPath } from "./four-corners-farm-content";
import { frontierFarmCanonicalPath } from "./frontier-farm-content";
import { hilltopFarmCanonicalPath } from "./hilltop-farm-content";
import { fruitTreeLayoutCanonicalPath } from "./fruit-tree-layout-content";
import { greenhouseLayoutCanonicalPath } from "./greenhouse-layout-content";
import { greenhouseTreeLayoutCanonicalPath } from "./greenhouse-tree-layout-content";
import { iridiumSprinklerLayoutCanonicalPath } from "./iridium-sprinkler-layout-content";
import { meadowlandsFarmCanonicalPath } from "./meadowlands-farm-content";
import { qualitySprinklerLayoutCanonicalPath } from "./quality-sprinkler-layout-content";
import { riverFarmCanonicalPath } from "./river-farm-content";
import { sprinklerLayoutCanonicalPath } from "./sprinkler-layout-content";
import { wildernessFarmCanonicalPath } from "./wilderness-farm-content";
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

export type FarmLayoutsNavigationPageId =
  | "beach-farm"
  | "fish-farm"
  | "river-farm"
  | "meadowlands-farm"
  | "forest-farm"
  | "four-corners-farm"
  | "frontier-farm"
  | "expanded-farm"
  | "hilltop-farm"
  | "wilderness-farm"
  | "greenhouse-layout"
  | "sprinkler-layout"
  | "quality-sprinkler-layout"
  | "iridium-sprinkler-layout"
  | "fruit-tree-layout"
  | "greenhouse-tree-layout";

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
  return (
    pageId === "beach-farm" ||
    pageId === "fish-farm" ||
    pageId === "river-farm" ||
    pageId === "meadowlands-farm" ||
    pageId === "forest-farm" ||
    pageId === "four-corners-farm" ||
    pageId === "frontier-farm" ||
    pageId === "expanded-farm" ||
    pageId === "hilltop-farm" ||
    pageId === "wilderness-farm" ||
    pageId === "greenhouse-layout" ||
    pageId === "sprinkler-layout" ||
    pageId === "quality-sprinkler-layout" ||
    pageId === "iridium-sprinkler-layout" ||
    pageId === "fruit-tree-layout" ||
    pageId === "greenhouse-tree-layout"
  );
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
        ? `/zh${fishFarmCanonicalPath}`
        : fishFarmCanonicalPath,
      id: "fish-farm",
      label: locale === "zh-CN" ? "鱼塘农场布局" : "Fish Farm Layouts",
    },
    {
      href: locale === "zh-CN"
        ? `/zh${riverFarmCanonicalPath}`
        : riverFarmCanonicalPath,
      id: "river-farm",
      label: locale === "zh-CN" ? "河流农场布局" : "River Farm Layouts",
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
    {
      href: locale === "zh-CN"
        ? `/zh${forestFarmCanonicalPath}`
        : forestFarmCanonicalPath,
      id: "forest-farm",
      label: locale === "zh-CN" ? "森林农场布局" : "Forest Farm Layouts",
    },
    {
      href: locale === "zh-CN"
        ? `/zh${fourCornersFarmCanonicalPath}`
        : fourCornersFarmCanonicalPath,
      id: "four-corners-farm",
      label: locale === "zh-CN" ? "四角农场布局" : "Four Corners Farm Layouts",
    },
    {
      href: locale === "zh-CN"
        ? `/zh${frontierFarmCanonicalPath}`
        : frontierFarmCanonicalPath,
      id: "frontier-farm",
      label: locale === "zh-CN" ? "边境农场布局" : "Frontier Farm Layouts",
    },
    {
      href: locale === "zh-CN"
        ? `/zh${expandedFarmCanonicalPath}`
        : expandedFarmCanonicalPath,
      id: "expanded-farm",
      label: locale === "zh-CN" ? "扩展农场布局" : "Expanded Farm Layouts",
    },
    {
      href: locale === "zh-CN"
        ? `/zh${hilltopFarmCanonicalPath}`
        : hilltopFarmCanonicalPath,
      id: "hilltop-farm",
      label: locale === "zh-CN" ? "山顶农场布局" : "Hilltop Farm Layouts",
    },
    {
      href: locale === "zh-CN"
        ? `/zh${wildernessFarmCanonicalPath}`
        : wildernessFarmCanonicalPath,
      id: "wilderness-farm",
      label: locale === "zh-CN" ? "荒野农场布局" : "Wilderness Farm Layouts",
    },
  ];
  const plantingLayoutPages: readonly FarmLayoutsNavigationPage[] = [
    {
      href:
        locale === "zh-CN"
          ? `/zh${sprinklerLayoutCanonicalPath}`
          : sprinklerLayoutCanonicalPath,
      id: "sprinkler-layout",
      label: locale === "zh-CN" ? "洒水器布局" : "Sprinkler Layouts",
    },
    {
      href:
        locale === "zh-CN"
          ? `/zh${qualitySprinklerLayoutCanonicalPath}`
          : qualitySprinklerLayoutCanonicalPath,
      id: "quality-sprinkler-layout",
      label: locale === "zh-CN" ? "优质洒水器布局" : "Quality Sprinkler Layouts",
    },
    {
      href:
        locale === "zh-CN"
          ? `/zh${iridiumSprinklerLayoutCanonicalPath}`
          : iridiumSprinklerLayoutCanonicalPath,
      id: "iridium-sprinkler-layout",
      label: locale === "zh-CN"
        ? "铱金洒水器布局"
        : "Iridium Sprinkler Layouts",
    },
    {
      href:
        locale === "zh-CN"
          ? `/zh${fruitTreeLayoutCanonicalPath}`
          : fruitTreeLayoutCanonicalPath,
      id: "fruit-tree-layout",
      label: locale === "zh-CN" ? "果树布局" : "Fruit Tree Layouts",
    },
  ];
  const greenhouseLayoutPages: readonly FarmLayoutsNavigationPage[] = [
    {
      href:
        locale === "zh-CN"
          ? `/zh${greenhouseTreeLayoutCanonicalPath}`
          : greenhouseTreeLayoutCanonicalPath,
      id: "greenhouse-tree-layout",
      label: locale === "zh-CN" ? "温室果树布局" : "Greenhouse Tree Layouts",
    },
    {
      href:
        locale === "zh-CN"
          ? `/zh${greenhouseLayoutCanonicalPath}`
          : greenhouseLayoutCanonicalPath,
      id: "greenhouse-layout",
      label: locale === "zh-CN" ? "温室布局" : "Greenhouse Layouts",
    },
  ];

  return FARM_LAYOUTS_NAVIGATION_CATEGORY_IDS.map((categoryId) => ({
    id: categoryId,
    label: categoryLabels[categoryId],
    pages: pagesForFarmLayoutsNavigationCategory(
      categoryId,
      farmMapPages,
      greenhouseLayoutPages,
      plantingLayoutPages,
    ),
  }));
}

function pagesForFarmLayoutsNavigationCategory(
  categoryId: FarmLayoutsNavigationCategoryId,
  farmMapPages: readonly FarmLayoutsNavigationPage[],
  greenhouseLayoutPages: readonly FarmLayoutsNavigationPage[],
  plantingLayoutPages: readonly FarmLayoutsNavigationPage[],
): readonly FarmLayoutsNavigationPage[] {
  if (categoryId === "farm-maps") {
    return farmMapPages;
  }
  if (categoryId === "greenhouse-layouts") {
    return greenhouseLayoutPages;
  }
  if (categoryId === "planting-layouts") {
    return plantingLayoutPages;
  }
  if (
    categoryId === "buildings-interiors" ||
    categoryId === "layout-ideas"
  ) {
    return [];
  }

  throw new Error(
    `Unknown Farm Layouts navigation category ${JSON.stringify(categoryId)}.`,
  );
}
