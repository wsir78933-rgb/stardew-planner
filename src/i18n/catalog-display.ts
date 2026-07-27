import { plannerMaps } from "../maps/map-catalog";
import type { Catalog } from "../catalog/catalog-types";
import type { SiteLocale } from "./locales";
import { getLocalizedPlannerMapName } from "./public-content";
import { chineseCatalogLabelsById } from "./zh-cn-catalog-labels";

const sourceCompatibleChineseCatalogPlaceholderLabelsById: Readonly<
  Record<string, string>
> = {
  "big-craftable:161": "??粉色柠檬??",
  "big-craftable:162": "??碎屑雕像??",
};

const chineseMapConfigurationNamesById: Readonly<Record<string, string>> = {
  restored: "已修复区域",
  bin: "岛屿农场垃圾桶",
  cave: "海盗湾洞穴",
  obelisk: "传送柱",
  bedroom: "卧室",
  "southern-room": "南侧房间",
  "corner-room": "角落房间",
  "extended-corner-room": "扩展角落房间",
  "dining-room": "餐厅",
  "dining-room-wall": "餐厅墙面",
  cubby: "小隔间",
  "far-upper-room": "远端上层房间",
  crib: "婴儿床",
  cellar: "地窖",
  abigail: "阿比盖尔",
  penny: "潘妮",
  leah: "莉亚",
  haley: "海莉",
  maru: "玛鲁",
  sebastian: "塞巴斯蒂安",
  alex: "亚历克斯",
  harvey: "哈维",
  elliott: "艾利欧特",
  sam: "山姆",
  shane: "谢恩",
  emily: "艾米丽",
  krobus: "科罗布斯",
};

/**
 * Returns a Chinese label only for an explicitly version-locked native catalog ID.
 * Source names are retained for English and rows that have no catalog identity.
 */
export function getCatalogDisplayName(
  locale: SiteLocale,
  catalogId: string | undefined,
  sourceName: string,
): string {
  if (locale !== "zh-CN" || catalogId === undefined) {
    return sourceName;
  }

  const chineseCatalogLabel = chineseCatalogLabelsById[catalogId];

  if (chineseCatalogLabel === undefined) {
    throw new Error(
      `Chinese catalog display label is missing for ID ${JSON.stringify(catalogId)}.`,
    );
  }

  return chineseCatalogLabel;
}

/**
 * Rejects catalog/translation drift before Chinese catalog UI is shown.
 */
export function assertChineseCatalogDisplayManifest(catalog: Catalog): void {
  const nativeCatalogIds = new Set<string>();

  for (const catalogItem of catalog.items) {
    if (nativeCatalogIds.has(catalogItem.id)) {
      throw new Error(
        `Chinese catalog display manifest received duplicate native catalog ID ${JSON.stringify(catalogItem.id)}.`,
      );
    }

    nativeCatalogIds.add(catalogItem.id);

    const chineseCatalogLabel = chineseCatalogLabelsById[catalogItem.id];

    if (chineseCatalogLabel === undefined) {
      throw new Error(
        `Chinese catalog display manifest is missing native catalog ID ${JSON.stringify(catalogItem.id)}.`,
      );
    }

    assertChineseCatalogLabelQuality(catalogItem.id, chineseCatalogLabel);
  }

  for (const catalogId of Object.keys(chineseCatalogLabelsById)) {
    if (!nativeCatalogIds.has(catalogId)) {
      throw new Error(
        `Chinese catalog display manifest contains unknown native catalog ID ${JSON.stringify(catalogId)}.`,
      );
    }
  }
}

function assertChineseCatalogLabelQuality(
  catalogId: string,
  chineseCatalogLabel: string,
): void {
  if (chineseCatalogLabel.trim().length === 0) {
    throw new Error(
      `Chinese catalog display label for native ID ${JSON.stringify(catalogId)} must not be blank.`,
    );
  }

  if (chineseCatalogLabel.trim() !== chineseCatalogLabel) {
    throw new Error(
      `Chinese catalog display label for native ID ${JSON.stringify(catalogId)} must not have outer whitespace.`,
    );
  }

  if (!containsCatalogLabelPlaceholder(chineseCatalogLabel)) {
    return;
  }

  if (
    sourceCompatibleChineseCatalogPlaceholderLabelsById[catalogId] ===
    chineseCatalogLabel
  ) {
    return;
  }

  throw new Error(
    `Chinese catalog display label for native ID ${JSON.stringify(catalogId)} has disallowed placeholder ${JSON.stringify(chineseCatalogLabel)}.`,
  );
}

function containsCatalogLabelPlaceholder(chineseCatalogLabel: string): boolean {
  const normalizedChineseCatalogLabel = chineseCatalogLabel.trim().toUpperCase();

  return chineseCatalogLabel.includes("??") ||
    /TODO|TBD|FIXME|PLACEHOLDER/i.test(chineseCatalogLabel) ||
    normalizedChineseCatalogLabel === "N/A" ||
    normalizedChineseCatalogLabel === "NA";
}

/**
 * Keeps map IDs as controller values while using a localized visible name.
 */
export function getPlannerMapDisplayName(
  locale: SiteLocale,
  mapId: string,
  sourceName: string,
): string {
  if (
    locale === "zh-CN" &&
    plannerMaps.some((plannerMap) => plannerMap.id === mapId)
  ) {
    return getLocalizedPlannerMapName(locale, mapId);
  }

  return sourceName;
}

export function getMapConfigurationDisplayName(
  locale: SiteLocale,
  configurationId: string,
  sourceName: string,
): string {
  if (locale === "zh-CN") {
    return chineseMapConfigurationNamesById[configurationId] ?? sourceName;
  }

  return sourceName;
}

export function getInteriorDecorDisplayName(
  locale: SiteLocale,
  patternKind: "wallpaper" | "flooring",
  patternId: string,
  sourceName: string,
): string {
  if (locale !== "zh-CN" || !isKnownInteriorDecorPatternId(patternKind, patternId)) {
    return sourceName;
  }

  const patternKindLabel = patternKind === "wallpaper" ? "壁纸" : "地板";
  return `${patternKindLabel} ${patternId}`;
}

function isKnownInteriorDecorPatternId(
  patternKind: "wallpaper" | "flooring",
  patternId: string,
): boolean {
  return patternKind === "wallpaper"
    ? /^(?:MoreWalls:)?\d+$/.test(patternId)
    : /^(?:MoreFloors:)?\d+$/.test(patternId);
}
