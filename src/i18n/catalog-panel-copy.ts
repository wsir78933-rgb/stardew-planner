import type { CatalogSidebarCategory } from "../catalog";
import type { HomepageLocale } from "../homepage/homepage-locale";

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
  filterItems: string;
  flip: string;
  fillItemHint: string;
  fillingItem: (name: string) => string;
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
  sceneAvailabilityReason: (
    availability: "indoor-only" | "outdoor-only",
  ) => string;
  unavailableGroup: (count: number, isSearch?: boolean) => string;
  selectItem: (name: string, width: number, height: number) => string;
  unflip: string;
  variant: string;
  variantLabels: Readonly<Record<string, string>>;
}>;

const catalogPanelLocales = ["en", "zh-CN", "ja"] as const;

type CatalogPanelLocale = (typeof catalogPanelLocales)[number];

const sharedFilterLabels = {
  animal: { en: "Animals", "zh-CN": "动物", ja: "動物" },
  production: { en: "Production", "zh-CN": "生产", ja: "生産" },
  storage: { en: "Storage", "zh-CN": "储存", ja: "収納" },
  utility: { en: "Utility", "zh-CN": "实用设施", ja: "実用" },
  luxury: { en: "Luxury", "zh-CN": "豪华", ja: "高級" },
  cabins: { en: "Cabins", "zh-CN": "小屋", ja: "小屋" },
  structures: { en: "Structures", "zh-CN": "建筑结构", ja: "構造物" },
  spring: { en: "Spring", "zh-CN": "春季", ja: "春" },
  summer: { en: "Summer", "zh-CN": "夏季", ja: "夏" },
  fall: { en: "Fall", "zh-CN": "秋季", ja: "秋" },
  winter: { en: "Winter", "zh-CN": "冬季", ja: "冬" },
  "multi-season": { en: "Multi-season", "zh-CN": "跨季节", ja: "複数の季節" },
  "giant-crops": { en: "Giant crops", "zh-CN": "巨型作物", ja: "巨大な作物" },
  saplings: { en: "Saplings", "zh-CN": "树苗", ja: "苗木" },
  "wild-trees": { en: "Wild trees", "zh-CN": "野树", ja: "野生の木" },
  "fruit-trees": { en: "Fruit trees", "zh-CN": "果树", ja: "果樹" },
  machines: { en: "Machines", "zh-CN": "机器", ja: "加工設備" },
  chairs: { en: "Chairs", "zh-CN": "椅子", ja: "椅子" },
  benches: { en: "Benches", "zh-CN": "长椅", ja: "ベンチ" },
  couches: { en: "Couches", "zh-CN": "沙发", ja: "ソファ" },
  cushions: { en: "Cushions", "zh-CN": "垫子", ja: "クッション" },
  armchairs: { en: "Armchairs", "zh-CN": "扶手椅", ja: "アームチェア" },
  tables: { en: "Tables", "zh-CN": "桌子", ja: "テーブル" },
  "long-tables": { en: "Long tables", "zh-CN": "长桌", ja: "長いテーブル" },
  bookcases: { en: "Bookcases", "zh-CN": "书柜", ja: "本棚" },
  dressers: { en: "Dressers", "zh-CN": "梳妆台", ja: "ドレッサー" },
  beds: { en: "Beds", "zh-CN": "床", ja: "ベッド" },
  fireplaces: { en: "Fireplaces", "zh-CN": "壁炉", ja: "暖炉" },
  rugs: { en: "Rugs", "zh-CN": "地毯", ja: "ラグ" },
  tvs: { en: "TVs", "zh-CN": "电视", ja: "テレビ" },
  "fish-tanks": { en: "Fish tanks", "zh-CN": "鱼缸", ja: "水槽" },
  functional: { en: "Functional", "zh-CN": "功能性", ja: "機能" },
  plants: { en: "Plants", "zh-CN": "植物", ja: "植物" },
  paintings: { en: "Paintings", "zh-CN": "画作", ja: "絵画" },
  "wall-hangings": { en: "Wall hangings", "zh-CN": "墙面装饰", ja: "壁飾り" },
  "windows-doors": { en: "Windows & Doors", "zh-CN": "门窗", ja: "窓とドア" },
  "large-decor": { en: "Large decor", "zh-CN": "大型装饰", ja: "大型の装飾" },
  "small-decor": { en: "Small decor", "zh-CN": "小型装饰", ja: "小型の装飾" },
  special: { en: "Special", "zh-CN": "特殊物品", ja: "特殊" },
  flooring: { en: "Flooring", "zh-CN": "地板", ja: "フローリング" },
  wallpaper: { en: "Wallpaper", "zh-CN": "墙纸", ja: "壁紙" },
  bushes: { en: "Bushes", "zh-CN": "灌木", ja: "低木" },
  other: { en: "Other", "zh-CN": "其他", ja: "その他" },
} as const;

const sharedVariantLabels = {
  "Normal": { en: "Normal", "zh-CN": "普通", ja: "通常" },
  "Moss": { en: "Moss", "zh-CN": "苔藓", ja: "コケ" },
  "No Fruit": { en: "No Fruit", "zh-CN": "无果", ja: "実なし" },
  "Fruit": { en: "Fruit", "zh-CN": "有果", ja: "実あり" },
  "Net 1": { en: "Net 1", "zh-CN": "网 1", ja: "網 1" },
  "Net 2": { en: "Net 2", "zh-CN": "网 2", ja: "網 2" },
  "Net 3": { en: "Net 3", "zh-CN": "网 3", ja: "網 3" },
  "None": { en: "None", "zh-CN": "无网", ja: "網なし" },
  "Dry": { en: "Dry", "zh-CN": "未浇水", ja: "未水やり" },
  "Watered": { en: "Watered", "zh-CN": "已浇水", ja: "水やり済み" },
  "Base": { en: "Base", "zh-CN": "基础", ja: "基本" },
  "Pressure": { en: "Pressure", "zh-CN": "加压喷头", ja: "圧力ノズル" },
  "Enricher": { en: "Enricher", "zh-CN": "施肥器", ja: "エンリッチ施肥装置" },
  "Lit": { en: "Lit", "zh-CN": "已点燃", ja: "点灯" },
  "Unlit": { en: "Unlit", "zh-CN": "未点燃", ja: "消灯" },
} as const;

function createFilterLabels(
  locale: CatalogPanelLocale,
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    Object.entries(sharedFilterLabels).map(([filterLabelId, copyByLocale]) => {
      const label = copyByLocale[locale];
      if (label.length === 0) {
        throw new TypeError(
          `Catalog filter label ${JSON.stringify(filterLabelId)} for locale ${JSON.stringify(locale)} is empty.`,
        );
      }
      return [filterLabelId, label];
    }),
  );
}

function createVariantLabels(
  locale: CatalogPanelLocale,
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    Object.entries(sharedVariantLabels).map(([variantLabel, copyByLocale]) => {
      const label = copyByLocale[locale];
      if (label.length === 0) {
        throw new TypeError(
          `Catalog variant label ${JSON.stringify(variantLabel)} for locale ${JSON.stringify(locale)} is empty.`,
        );
      }
      return [variantLabel, label];
    }),
  );
}

function createUnavailableGroupLabel(
  locale: CatalogPanelLocale,
  count: number,
  isSearch = false,
): string {
  if (!Number.isInteger(count) || count < 0) {
    throw new TypeError(
      `Unavailable catalog item count must be a non-negative integer; received ${String(count)}.`,
    );
  }

  if (typeof isSearch !== "boolean") {
    throw new TypeError(
      `Unavailable catalog search flag must be a boolean; received ${JSON.stringify(isSearch)}.`,
    );
  }

  if (locale === "en") {
    let unavailableEntryNoun: string;
    if (isSearch) {
      unavailableEntryNoun = count === 1 ? "result" : "results";
    } else {
      unavailableEntryNoun = count === 1 ? "item" : "items";
    }
    return `${String(count)} ${unavailableEntryNoun} can't be placed here`;
  }

  if (locale === "zh-CN") {
    return isSearch
      ? `${String(count)} 个搜索结果不能放置在这里`
      : `${String(count)} 件物品不能放置在这里`;
  }

  if (locale === "ja") {
    return isSearch
      ? `ここには置けない検索結果が${String(count)}件あります`
      : `ここには置けないアイテムが${String(count)}件あります`;
  }

  const unsupportedLocale: never = locale;
  throw new TypeError(
    `Unsupported catalog-panel locale. Received: ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function createSceneAvailabilityReason(
  locale: CatalogPanelLocale,
  availability: "indoor-only" | "outdoor-only",
): string {
  if (availability !== "indoor-only" && availability !== "outdoor-only") {
    throw new TypeError(
      `Unsupported catalog scene availability. Received: ${JSON.stringify(availability)}.`,
    );
  }

  if (locale === "en") {
    return availability === "indoor-only"
      ? "This item can only be placed indoors."
      : "This item can only be placed outdoors.";
  }
  if (locale === "zh-CN") {
    return availability === "indoor-only"
      ? "该物品只能放置在室内。"
      : "该物品只能放置在室外。";
  }
  if (locale === "ja") {
    return availability === "indoor-only"
      ? "このアイテムは屋内にのみ配置できます。"
      : "このアイテムは屋外にのみ配置できます。";
  }

  const unsupportedLocale: never = locale;
  throw new TypeError(
    `Unsupported catalog-panel locale. Received: ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function readCatalogPanelLocale(locale: HomepageLocale): CatalogPanelLocale {
  const localeValue: string = locale;
  for (const catalogPanelLocale of catalogPanelLocales) {
    if (localeValue === catalogPanelLocale) {
      return catalogPanelLocale;
    }
  }

  throw new TypeError(
    `Unsupported catalog-panel locale. Received: ${JSON.stringify(localeValue)}.`,
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
    filterItems: "Filter items",
    flip: "Flip",
    fillItemHint: "Drag to fill · Esc to cancel",
    fillingItem: (name: string) => `Filling ${name}`,
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
    sceneAvailabilityReason: (availability) =>
      createSceneAvailabilityReason("en", availability),
    unavailableGroup: (count, isSearch) =>
      createUnavailableGroupLabel("en", count, isSearch),
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
    filterItems: "筛选物品",
    flip: "翻转",
    fillItemHint: "拖动填充 · 按 Esc 取消",
    fillingItem: (name: string) => `正在填充${name}`,
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
    sceneAvailabilityReason: (availability) =>
      createSceneAvailabilityReason("zh-CN", availability),
    unavailableGroup: (count, isSearch) =>
      createUnavailableGroupLabel("zh-CN", count, isSearch),
    selectItem: (name: string, width: number, height: number) =>
      `选择${name}，占地 ${width} × ${height} 格`,
    unflip: "取消翻转",
    variant: "变体",
    variantLabels: createVariantLabels("zh-CN"),
  },
  ja: {
    all: "すべて",
    brand: "Stardew Planner",
    browseItems: "アイテムを見る",
    cancelPlacement: "配置をキャンセル（Esc）",
    catalogLabel: "アイテムカタログ",
    categories: {
      buildings: "建物",
      crops: "作物",
      trees: "樹木",
      equipment: "設備",
      paths: "柵と小道",
      lighting: "照明",
      furniture: "家具",
      decor: "装飾",
    },
    clearSearch: "検索をクリア",
    collapseItems: "アイテム一覧を折りたたむ",
    cycleVariant: (name: string, currentLabel: string) =>
      `「${name}」のバリエーションを切り替えます。現在は${currentLabel}です`,
    filterLabels: createFilterLabels("ja"),
    filterItems: "アイテムを絞り込む",
    flip: "反転",
    fillItemHint: "ドラッグして塗りつぶす · Escでキャンセル",
    fillingItem: (name: string) => `「${name}」を塗りつぶしています`,
    gridView: "グリッド表示",
    help: "ヘルプと情報",
    keyboardShortcuts: "キーボードショートカット",
    listView: "リスト表示",
    loadFailed: "アイテムを読み込めませんでした。",
    loading: "アイテムを読み込んでいます…",
    noResults: "アイテムが見つかりません。",
    placeItemHint: "クリックして配置 · Escでキャンセル",
    placingItem: (name: string) => `「${name}」を配置しています`,
    retry: "再試行",
    rotate: "回転",
    searchAllItems: "すべてのアイテムを検索",
    searchResults: "検索結果",
    sceneAvailabilityReason: (availability) =>
      createSceneAvailabilityReason("ja", availability),
    unavailableGroup: (count, isSearch) =>
      createUnavailableGroupLabel("ja", count, isSearch),
    selectItem: (name: string, width: number, height: number) =>
      `「${name}」を選択します。${String(width)}×${String(height)}マス`,
    unflip: "反転を戻す",
    variant: "バリエーション",
    variantLabels: createVariantLabels("ja"),
  },
} satisfies Readonly<Record<CatalogPanelLocale, CatalogPanelCopy>>;

export function getCatalogPanelCopy(locale: HomepageLocale): CatalogPanelCopy {
  const catalogPanelLocale = readCatalogPanelLocale(locale);
  return catalogPanelCopyByLocale[catalogPanelLocale];
}
