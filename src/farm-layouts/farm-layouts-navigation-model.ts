import { beachFarmCanonicalPath } from "./beach-farm-content";
import {
  isHomepageDisplayLocale,
  type HomepageDisplayLocale,
} from "../homepage/homepage-locale";

export type FarmLayoutsNavigationModel = Readonly<{
  backToCategoriesLabel: string;
  beachFarmHref: string;
  beachFarmLabel: string;
  farmMapsLabel: string;
  triggerLabel: "Farm Layouts";
  categoryPanelTitle: string;
}>;

export function getFarmLayoutsNavigationModel(
  locale: string,
): FarmLayoutsNavigationModel {
  if (!isHomepageDisplayLocale(locale)) {
    throw new TypeError(
      `Farm layouts navigation locale must be "en", "zh-CN", "ja", or "ru"; received ${JSON.stringify(locale)}.`,
    );
  }

  if (locale === "zh-CN") {
    return {
      backToCategoriesLabel: "返回布局分类",
      beachFarmHref: `/zh${beachFarmCanonicalPath}`,
      beachFarmLabel: "海滩农场布局",
      farmMapsLabel: "农场地图",
      triggerLabel: "Farm Layouts",
      categoryPanelTitle: "布局分类",
    };
  }

  return {
    backToCategoriesLabel: "Back to layout categories",
    beachFarmHref: beachFarmCanonicalPath,
    beachFarmLabel: "Beach Farm Layouts",
    farmMapsLabel: "Farm maps",
    triggerLabel: "Farm Layouts",
    categoryPanelTitle: "Layout categories",
  };
}
