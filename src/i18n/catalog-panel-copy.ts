import type { CatalogSidebarCategory } from "../catalog";
import type { HomepageLocale } from "../homepage/homepage-locale";
import { isHomepageLocale } from "../homepage/homepage-locale";

export type CatalogPanelCopy = Readonly<{
  all: string;
  brand: string;
  browseItems: string;
  catalogLabel: string;
  categories: Readonly<Record<CatalogSidebarCategory, string>>;
  clearSearch: string;
  collapseItems: string;
  cancelPlacement: string;
  cycleVariant: (name: string, currentLabel: string) => string;
  filterLabels: Readonly<Record<string, string>>;
  flip: string;
  gridView: string;
  help: string;
  keyboardShortcuts: string;
  listView: string;
  loadFailed: string;
  loading: string;
  noResults: string;
  placeItemHint: string;
  placingItem: (name: string) => string;
  retry: string;
  rotate: string;
  searchAllItems: string;
  searchResults: string;
  selectItem: (name: string, width: number, height: number) => string;
  unflip: string;
  variant: string;
  variantLabels: Readonly<Record<string, string>>;
}>;

const sharedFilterLabels = {
  animal: { en: "Animals", "zh-CN": "动物" },
  production: { en: "Production", "zh-CN": "生产" },
  storage: { en: "Storage", "zh-CN": "储存" },
  utility: { en: "Utility", "zh-CN": "实用设施" },
  luxury: { en: "Luxury", "zh-CN": "豪华" },
  cabins: { en: "Cabins", "zh-CN": "小屋" },
  structures: { en: "Structures", "zh-CN": "建筑结构" },
  spring: { en: "Spring", "zh-CN": "春季" },
  summer: { en: "Summer", "zh-CN": "夏季" },
  fall: { en: "Fall", "zh-CN": "秋季" },
  winter: { en: "Winter", "zh-CN": "冬季" },
  "multi-season": { en: "Multi-season", "zh-CN": "跨季节" },
  "giant-crops": { en: "Giant crops", "zh-CN": "巨型作物" },
  saplings: { en: "Saplings", "zh-CN": "树苗" },
  "wild-trees": { en: "Wild trees", "zh-CN": "野树" },
  "fruit-trees": { en: "Fruit trees", "zh-CN": "果树" },
  machines: { en: "Machines", "zh-CN": "机器" },
  chairs: { en: "Chairs", "zh-CN": "椅子" },
  benches: { en: "Benches", "zh-CN": "长椅" },
  couches: { en: "Couches", "zh-CN": "沙发" },
  armchairs: { en: "Armchairs", "zh-CN": "扶手椅" },
  tables: { en: "Tables", "zh-CN": "桌子" },
  "long-tables": { en: "Long tables", "zh-CN": "长桌" },
  bookcases: { en: "Bookcases", "zh-CN": "书柜" },
  dressers: { en: "Dressers", "zh-CN": "梳妆台" },
  beds: { en: "Beds", "zh-CN": "床" },
  fireplaces: { en: "Fireplaces", "zh-CN": "壁炉" },
  rugs: { en: "Rugs", "zh-CN": "地毯" },
  tvs: { en: "TVs", "zh-CN": "电视" },
  "fish-tanks": { en: "Fish tanks", "zh-CN": "鱼缸" },
  functional: { en: "Functional", "zh-CN": "功能性" },
  plants: { en: "Plants", "zh-CN": "植物" },
  paintings: { en: "Paintings", "zh-CN": "画作" },
  "wall-hangings": { en: "Wall hangings", "zh-CN": "墙面装饰" },
  "windows-doors": { en: "Windows & Doors", "zh-CN": "门窗" },
  "large-decor": { en: "Large decor", "zh-CN": "大型装饰" },
  "small-decor": { en: "Small decor", "zh-CN": "小型装饰" },
  special: { en: "Special", "zh-CN": "特殊物品" },
  flooring: { en: "Flooring", "zh-CN": "地板" },
  wallpaper: { en: "Wallpaper", "zh-CN": "墙纸" },
  other: { en: "Other", "zh-CN": "其他" },
} as const;

const sharedVariantLabels = {
  "Normal": { en: "Normal", "zh-CN": "普通" },
  "Moss": { en: "Moss", "zh-CN": "苔藓" },
  "No Fruit": { en: "No Fruit", "zh-CN": "无果" },
  "Fruit": { en: "Fruit", "zh-CN": "有果" },
  "Net 1": { en: "Net 1", "zh-CN": "网 1" },
  "Net 2": { en: "Net 2", "zh-CN": "网 2" },
  "Net 3": { en: "Net 3", "zh-CN": "网 3" },
  "None": { en: "None", "zh-CN": "无网" },
  "Dry": { en: "Dry", "zh-CN": "未浇水" },
  "Watered": { en: "Watered", "zh-CN": "已浇水" },
  "Base": { en: "Base", "zh-CN": "基础" },
  "Pressure": { en: "Pressure", "zh-CN": "加压喷头" },
  "Enricher": { en: "Enricher", "zh-CN": "施肥器" },
  "Lit": { en: "Lit", "zh-CN": "已点燃" },
  "Unlit": { en: "Unlit", "zh-CN": "未点燃" },
} as const;

function createFilterLabels(
  locale: HomepageLocale,
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    Object.entries(sharedFilterLabels).map(([filterLabelId, copyByLocale]) => [
      filterLabelId,
      copyByLocale[locale],
    ]),
  );
}

function createVariantLabels(
  locale: HomepageLocale,
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    Object.entries(sharedVariantLabels).map(([variantLabel, copyByLocale]) => [
      variantLabel,
      copyByLocale[locale],
    ]),
  );
}

const catalogPanelCopyByLocale = {
  en: {
    all: "All",
    brand: "Stardew Planner",
    browseItems: "Browse items",
    cancelPlacement: "Cancel placement (Esc)",
    catalogLabel: "Item catalog",
    categories: {
      buildings: "Buildings",
      crops: "Crops",
      trees: "Trees",
      equipment: "Equipment",
      paths: "Fences & Paths",
      lighting: "Lighting",
      furniture: "Furniture",
      decor: "Decor",
    },
    clearSearch: "Clear search",
    collapseItems: "Collapse item browser",
    cycleVariant: (name: string, currentLabel: string) =>
      `Cycle ${name} variant, current ${currentLabel}`,
    filterLabels: createFilterLabels("en"),
    flip: "Flip",
    gridView: "Grid view",
    help: "Help & Info",
    keyboardShortcuts: "Keyboard shortcuts",
    listView: "List view",
    loadFailed: "Items could not be loaded.",
    loading: "Loading items…",
    noResults: "No items found.",
    placeItemHint: "Click to place · Esc to cancel",
    placingItem: (name: string) => `Placing ${name}`,
    retry: "Retry",
    rotate: "Rotate",
    searchAllItems: "Search all items",
    searchResults: "Search results",
    selectItem: (name: string, width: number, height: number) =>
      `Select ${name}, ${width} by ${height} tiles`,
    unflip: "Unflip",
    variant: "Variant",
    variantLabels: createVariantLabels("en"),
  },
  "zh-CN": {
    all: "全部",
    brand: "Stardew Planner",
    browseItems: "浏览物品",
    cancelPlacement: "取消放置（Esc）",
    catalogLabel: "物品目录",
    categories: {
      buildings: "建筑",
      crops: "作物",
      trees: "树木",
      equipment: "设备",
      paths: "围栏与道路",
      lighting: "照明",
      furniture: "家具",
      decor: "装饰",
    },
    clearSearch: "清除搜索",
    collapseItems: "收起物品目录",
    cycleVariant: (name: string, currentLabel: string) =>
      `切换${name}外观，当前为${currentLabel}`,
    filterLabels: createFilterLabels("zh-CN"),
    flip: "翻转",
    gridView: "网格视图",
    help: "帮助与说明",
    keyboardShortcuts: "键盘快捷键",
    listView: "列表视图",
    loadFailed: "物品加载失败。",
    loading: "正在加载物品…",
    noResults: "没有找到物品。",
    placeItemHint: "点击放置 · 按 Esc 取消",
    placingItem: (name: string) => `正在放置${name}`,
    retry: "重试",
    rotate: "旋转",
    searchAllItems: "搜索全部物品",
    searchResults: "搜索结果",
    selectItem: (name: string, width: number, height: number) =>
      `选择${name}，占地 ${width} × ${height} 格`,
    unflip: "取消翻转",
    variant: "变体",
    variantLabels: createVariantLabels("zh-CN"),
  },
} satisfies Readonly<Record<HomepageLocale, CatalogPanelCopy>>;

export function getCatalogPanelCopy(locale: HomepageLocale): CatalogPanelCopy {
  if (!isHomepageLocale(locale)) {
    throw new TypeError(
      `Unsupported catalog-panel locale. Received: ${JSON.stringify(locale)}.`,
    );
  }

  return catalogPanelCopyByLocale[locale];
}
