import type { CatalogSidebarCategory } from "../catalog";
import type { CatalogItemSceneAvailability } from "../catalog/catalog-scene-availability";
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
    availability: Exclude<CatalogItemSceneAvailability, "available">,
  ) => string;
  unavailableGroup: (count: number, isSearch?: boolean) => string;
  selectItem: (name: string, width: number, height: number) => string;
  unflip: string;
  variant: string;
  variantLabels: Readonly<Record<string, string>>;
}>;

function formatRussianCountedNoun(
  count: number,
  one: string,
  few: string,
  many: string,
): string {
  const absoluteCount = Math.abs(count);
  const lastTwoDigits = absoluteCount % 100;
  const lastDigit = absoluteCount % 10;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${String(count)} ${many}`;
  }
  if (lastDigit === 1) {
    return `${String(count)} ${one}`;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${String(count)} ${few}`;
  }
  return `${String(count)} ${many}`;
}

const catalogPanelLocales = ["en", "zh-CN", "ja", "ru"] as const;

type CatalogPanelLocale = (typeof catalogPanelLocales)[number];

const sharedFilterLabels = {
  animal: { en: "Animals", "zh-CN": "动物", ja: "動物", ru: "Животные"},
  production: { en: "Production", "zh-CN": "生产", ja: "生産", ru: "Производство"},
  storage: { en: "Storage", "zh-CN": "储存", ja: "収納", ru: "Хранение"},
  utility: { en: "Utility", "zh-CN": "实用设施", ja: "実用", ru: "Хозяйственные"},
  luxury: { en: "Luxury", "zh-CN": "豪华", ja: "高級", ru: "Роскошные"},
  cabins: { en: "Cabins", "zh-CN": "小屋", ja: "小屋", ru: "Хижины"},
  structures: { en: "Structures", "zh-CN": "建筑结构", ja: "構造物", ru: "Конструкции"},
  spring: { en: "Spring", "zh-CN": "春季", ja: "春", ru: "Весна"},
  summer: { en: "Summer", "zh-CN": "夏季", ja: "夏", ru: "Лето"},
  fall: { en: "Fall", "zh-CN": "秋季", ja: "秋", ru: "Осень"},
  winter: { en: "Winter", "zh-CN": "冬季", ja: "冬", ru: "Зима"},
  "multi-season": { en: "Multi-season", "zh-CN": "跨季节", ja: "複数の季節", ru: "Несколько сезонов"},
  "giant-crops": { en: "Giant crops", "zh-CN": "巨型作物", ja: "巨大な作物", ru: "Гигантские культуры"},
  saplings: { en: "Saplings", "zh-CN": "树苗", ja: "苗木", ru: "Саженцы"},
  "wild-trees": { en: "Wild trees", "zh-CN": "野树", ja: "野生の木", ru: "Дикие деревья"},
  "fruit-trees": { en: "Fruit trees", "zh-CN": "果树", ja: "果樹", ru: "Фруктовые деревья"},
  machines: { en: "Machines", "zh-CN": "机器", ja: "加工設備", ru: "Машины"},
  chairs: { en: "Chairs", "zh-CN": "椅子", ja: "椅子", ru: "Стулья"},
  benches: { en: "Benches", "zh-CN": "长椅", ja: "ベンチ", ru: "Скамьи"},
  couches: { en: "Couches", "zh-CN": "沙发", ja: "ソファ", ru: "Диваны"},
  cushions: { en: "Cushions", "zh-CN": "垫子", ja: "クッション", ru: "Подушки"},
  armchairs: { en: "Armchairs", "zh-CN": "扶手椅", ja: "アームチェア", ru: "Кресла"},
  tables: { en: "Tables", "zh-CN": "桌子", ja: "テーブル", ru: "Столы"},
  "long-tables": { en: "Long tables", "zh-CN": "长桌", ja: "長いテーブル", ru: "Длинные столы"},
  bookcases: { en: "Bookcases", "zh-CN": "书柜", ja: "本棚", ru: "Книжные шкафы"},
  dressers: { en: "Dressers", "zh-CN": "梳妆台", ja: "ドレッサー", ru: "Комоды"},
  beds: { en: "Beds", "zh-CN": "床", ja: "ベッド", ru: "Кровати"},
  fireplaces: { en: "Fireplaces", "zh-CN": "壁炉", ja: "暖炉", ru: "Камины"},
  rugs: { en: "Rugs", "zh-CN": "地毯", ja: "ラグ", ru: "Ковры"},
  tvs: { en: "TVs", "zh-CN": "电视", ja: "テレビ", ru: "Телевизоры"},
  "fish-tanks": { en: "Fish tanks", "zh-CN": "鱼缸", ja: "水槽", ru: "Аквариумы"},
  functional: { en: "Functional", "zh-CN": "功能性", ja: "機能", ru: "Функциональные"},
  plants: { en: "Plants", "zh-CN": "植物", ja: "植物", ru: "Растения"},
  paintings: { en: "Paintings", "zh-CN": "画作", ja: "絵画", ru: "Картины"},
  "wall-hangings": { en: "Wall hangings", "zh-CN": "墙面装饰", ja: "壁飾り", ru: "Настенные украшения"},
  "windows-doors": { en: "Windows & Doors", "zh-CN": "门窗", ja: "窓とドア", ru: "Окна и двери"},
  "large-decor": { en: "Large decor", "zh-CN": "大型装饰", ja: "大型の装飾", ru: "Крупный декор"},
  "small-decor": { en: "Small decor", "zh-CN": "小型装饰", ja: "小型の装飾", ru: "Мелкий декор"},
  special: { en: "Special", "zh-CN": "特殊物品", ja: "特殊", ru: "Особые"},
  "special-items": { en: "Special items", "zh-CN": "Special items", ja: "特殊", ru: "Особые"},
  flooring: { en: "Flooring", "zh-CN": "地板", ja: "フローリング", ru: "Полы"},
  wallpaper: { en: "Wallpaper", "zh-CN": "墙纸", ja: "壁紙", ru: "Обои"},
  bushes: { en: "Bushes", "zh-CN": "灌木", ja: "低木", ru: "Кусты"},
  other: { en: "Other", "zh-CN": "其他", ja: "その他", ru: "Другое"},
} as const;

const sharedVariantLabels = {
  "Normal": { en: "Normal", "zh-CN": "普通", ja: "通常", ru: "Обычный"},
  "Moss": { en: "Moss", "zh-CN": "苔藓", ja: "コケ", ru: "Мох"},
  "No Fruit": { en: "No Fruit", "zh-CN": "无果", ja: "実なし", ru: "Без плодов"},
  "Fruit": { en: "Fruit", "zh-CN": "有果", ja: "実あり", ru: "С плодами"},
  "Net 1": { en: "Net 1", "zh-CN": "网 1", ja: "網 1", ru: "Сеть 1"},
  "Net 2": { en: "Net 2", "zh-CN": "网 2", ja: "網 2", ru: "Сеть 2"},
  "Net 3": { en: "Net 3", "zh-CN": "网 3", ja: "網 3", ru: "Сеть 3"},
  "None": { en: "None", "zh-CN": "无网", ja: "網なし", ru: "Без сети"},
  "Dry": { en: "Dry", "zh-CN": "未浇水", ja: "未水やり", ru: "Не полито"},
  "Watered": { en: "Watered", "zh-CN": "已浇水", ja: "水やり済み", ru: "Полито"},
  "Base": { en: "Base", "zh-CN": "基础", ja: "基本", ru: "Основа"},
  "Pressure": { en: "Pressure", "zh-CN": "加压喷头", ja: "圧力ノズル", ru: "Нагнетательное сопло"},
  "Enricher": { en: "Enricher", "zh-CN": "施肥器", ja: "エンリッチ施肥装置", ru: "Обогатитель"},
  "Lit": { en: "Lit", "zh-CN": "已点燃", ja: "点灯", ru: "Зажжено"},
  "Unlit": { en: "Unlit", "zh-CN": "未点燃", ja: "消灯", ru: "Не зажжено"},
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

  if (locale === "ru") {
    if (isSearch) {
      return `${formatRussianCountedNoun(count, "результат", "результата", "результатов")} нельзя разместить здесь`;
    }
    return `${formatRussianCountedNoun(count, "предмет", "предмета", "предметов")} нельзя разместить здесь`;
  }

  const unsupportedLocale: never = locale;
  throw new TypeError(
    `Unsupported catalog-panel locale. Received: ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function createSceneAvailabilityReason(
  locale: CatalogPanelLocale,
  availability: Exclude<CatalogItemSceneAvailability, "available">,
): string {
  switch (availability) {
    case "indoor-only":
      return readSceneAvailabilityText(locale, "indoor-only");
    case "outdoor-only":
      return readSceneAvailabilityText(locale, "outdoor-only");
    case "not-buildable-here":
      return readSceneAvailabilityText(locale, "not-buildable-here");
    case "not-plantable-here":
      return readSceneAvailabilityText(locale, "not-plantable-here");
    case "not-placeable-here":
      return readSceneAvailabilityText(locale, "not-placeable-here");
    default: {
      const unexpectedAvailability: never = availability;
      throw new TypeError(
        `Unsupported catalog scene availability. Received: ${JSON.stringify(unexpectedAvailability)}.`,
      );
    }
  }
}

function readSceneAvailabilityText(
  locale: CatalogPanelLocale,
  availability: Exclude<CatalogItemSceneAvailability, "available">,
): string {
  if (locale === "en") {
    switch (availability) {
      case "indoor-only":
        return "This item can only be placed indoors.";
      case "outdoor-only":
        return "This item can only be placed outdoors.";
      case "not-buildable-here":
        return "Buildings cannot be placed on this map.";
      case "not-plantable-here":
        return "Crops cannot be planted on this map.";
      case "not-placeable-here":
        return "This item can't be placed here.";
    }
  }
  if (locale === "zh-CN") {
    switch (availability) {
      case "indoor-only":
        return "该物品只能放置在室内。";
      case "outdoor-only":
        return "该物品只能放置在室外。";
      case "not-buildable-here":
        return "此地图不允许放置建筑。";
      case "not-plantable-here":
        return "此地图不能种植作物。";
      case "not-placeable-here":
        return "此处无法放置该物品。";
    }
  }
  if (locale === "ja") {
    switch (availability) {
      case "indoor-only":
        return "このアイテムは屋内にのみ配置できます。";
      case "outdoor-only":
        return "このアイテムは屋外にのみ配置できます。";
      case "not-buildable-here":
        return "このマップでは建物を配置できません。";
      case "not-plantable-here":
        return "このマップでは作物を植えられません。";
      case "not-placeable-here":
        return "ここにはこのアイテムを配置できません。";
    }
  }
  if (locale === "ru") {
    switch (availability) {
      case "indoor-only":
        return "Этот предмет можно разместить только в помещении.";
      case "outdoor-only":
        return "Этот предмет можно разместить только на улице.";
      case "not-buildable-here":
        return "На этой карте нельзя размещать постройки.";
      case "not-plantable-here":
        return "На этой карте нельзя сажать культуры.";
      case "not-placeable-here":
        return "Этот предмет нельзя разместить здесь.";
    }
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
  ru: {
    all: "Все",
    brand: "Stardew Planner",
    browseItems: "Обзор предметов",
    cancelPlacement: "Отменить размещение (Esc)",
    catalogLabel: "Каталог предметов",
    categories: {
      buildings: "Постройки",
      crops: "Культуры",
      trees: "Деревья",
      equipment: "Оборудование",
      paths: "Заборы и дорожки",
      lighting: "Освещение",
      furniture: "Мебель",
      decor: "Декор",
    },
    clearSearch: "Очистить поиск",
    collapseItems: "Свернуть каталог предметов",
    cycleVariant: (name: string, currentLabel: string) =>
      `Сменить вариант «${name}», сейчас: ${currentLabel}`,
    filterLabels: createFilterLabels("ru"),
    filterItems: "Фильтр предметов",
    flip: "Отразить",
    fillItemHint: "Перетащите, чтобы заполнить · Esc — отмена",
    fillingItem: (name: string) => `Заполнение: ${name}`,
    gridView: "Вид плиткой",
    help: "Справка и информация",
    keyboardShortcuts: "Горячие клавиши",
    listView: "Вид списком",
    loadFailed: "Не удалось загрузить предметы.",
    loading: "Загрузка предметов…",
    noResults: "Предметы не найдены.",
    placeItemHint: "Нажмите, чтобы разместить · Esc — отмена",
    placingItem: (name: string) => `Размещение: ${name}`,
    retry: "Повторить",
    rotate: "Повернуть",
    searchAllItems: "Искать среди всех предметов",
    searchResults: "Результаты поиска",
    sceneAvailabilityReason: (availability) =>
      createSceneAvailabilityReason("ru", availability),
    unavailableGroup: (count, isSearch) =>
      createUnavailableGroupLabel("ru", count, isSearch),
    selectItem: (name: string, width: number, height: number) =>
      `Выбрать ${name}, ${width} × ${height} клеток`,
    unflip: "Отменить отражение",
    variant: "Вариант",
    variantLabels: createVariantLabels("ru"),
  },

} satisfies Readonly<Record<CatalogPanelLocale, CatalogPanelCopy>>;

export function getCatalogPanelCopy(locale: HomepageLocale): CatalogPanelCopy {
  const catalogPanelLocale = readCatalogPanelLocale(locale);
  return catalogPanelCopyByLocale[catalogPanelLocale];
}
