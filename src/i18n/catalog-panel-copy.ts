import type { CatalogSidebarCategory } from "../catalog";
import type { HomepageLocale } from "../homepage/homepage-locale";
import { isHomepageLocale } from "../homepage/homepage-locale";

type CatalogPanelLocale = HomepageLocale | "ru";

function isCatalogPanelLocale(locale: string): locale is CatalogPanelLocale {
  return locale === "ru" || isHomepageLocale(locale);
}

function throwUnsupportedCatalogPanelLocale(locale: never): never {
  throw new TypeError(
    `Unsupported catalog-panel locale. Received: ${JSON.stringify(locale)}.`,
  );
}

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

const sharedFilterLabels = {
  animal: { en: "Animals", "zh-CN": "动物", ru: "Животные" },
  production: { en: "Production", "zh-CN": "生产", ru: "Производство" },
  storage: { en: "Storage", "zh-CN": "储存", ru: "Хранение" },
  utility: { en: "Utility", "zh-CN": "实用设施", ru: "Хозяйственные" },
  luxury: { en: "Luxury", "zh-CN": "豪华", ru: "Роскошные" },
  cabins: { en: "Cabins", "zh-CN": "小屋", ru: "Хижины" },
  structures: { en: "Structures", "zh-CN": "建筑结构", ru: "Конструкции" },
  spring: { en: "Spring", "zh-CN": "春季", ru: "Весна" },
  summer: { en: "Summer", "zh-CN": "夏季", ru: "Лето" },
  fall: { en: "Fall", "zh-CN": "秋季", ru: "Осень" },
  winter: { en: "Winter", "zh-CN": "冬季", ru: "Зима" },
  "multi-season": { en: "Multi-season", "zh-CN": "跨季节", ru: "Несколько сезонов" },
  "giant-crops": { en: "Giant crops", "zh-CN": "巨型作物", ru: "Гигантские культуры" },
  saplings: { en: "Saplings", "zh-CN": "树苗", ru: "Саженцы" },
  "wild-trees": { en: "Wild trees", "zh-CN": "野树", ru: "Дикие деревья" },
  "fruit-trees": { en: "Fruit trees", "zh-CN": "果树", ru: "Фруктовые деревья" },
  machines: { en: "Machines", "zh-CN": "机器", ru: "Машины" },
  chairs: { en: "Chairs", "zh-CN": "椅子", ru: "Стулья" },
  benches: { en: "Benches", "zh-CN": "长椅", ru: "Скамьи" },
  couches: { en: "Couches", "zh-CN": "沙发", ru: "Диваны" },
  cushions: { en: "Cushions", "zh-CN": "垫子", ru: "Подушки" },
  armchairs: { en: "Armchairs", "zh-CN": "扶手椅", ru: "Кресла" },
  tables: { en: "Tables", "zh-CN": "桌子", ru: "Столы" },
  "long-tables": { en: "Long tables", "zh-CN": "长桌", ru: "Длинные столы" },
  bookcases: { en: "Bookcases", "zh-CN": "书柜", ru: "Книжные шкафы" },
  dressers: { en: "Dressers", "zh-CN": "梳妆台", ru: "Комоды" },
  beds: { en: "Beds", "zh-CN": "床", ru: "Кровати" },
  fireplaces: { en: "Fireplaces", "zh-CN": "壁炉", ru: "Камины" },
  rugs: { en: "Rugs", "zh-CN": "地毯", ru: "Ковры" },
  tvs: { en: "TVs", "zh-CN": "电视", ru: "Телевизоры" },
  "fish-tanks": { en: "Fish tanks", "zh-CN": "鱼缸", ru: "Аквариумы" },
  functional: { en: "Functional", "zh-CN": "功能性", ru: "Функциональные" },
  plants: { en: "Plants", "zh-CN": "植物", ru: "Растения" },
  paintings: { en: "Paintings", "zh-CN": "画作", ru: "Картины" },
  "wall-hangings": { en: "Wall hangings", "zh-CN": "墙面装饰", ru: "Настенные украшения" },
  "windows-doors": { en: "Windows & Doors", "zh-CN": "门窗", ru: "Окна и двери" },
  "large-decor": { en: "Large decor", "zh-CN": "大型装饰", ru: "Крупный декор" },
  "small-decor": { en: "Small decor", "zh-CN": "小型装饰", ru: "Мелкий декор" },
  special: { en: "Special", "zh-CN": "特殊物品", ru: "Особые" },
  "special-items": { en: "Special items", "zh-CN": "Special items", ru: "Особые" },
  flooring: { en: "Flooring", "zh-CN": "地板", ru: "Полы" },
  wallpaper: { en: "Wallpaper", "zh-CN": "墙纸", ru: "Обои" },
  bushes: { en: "Bushes", "zh-CN": "灌木", ru: "Кусты" },
  other: { en: "Other", "zh-CN": "其他", ru: "Другое" },
} as const;

const sharedVariantLabels = {
  "Normal": { en: "Normal", "zh-CN": "普通", ru: "Обычный" },
  "Moss": { en: "Moss", "zh-CN": "苔藓", ru: "Мох" },
  "No Fruit": { en: "No Fruit", "zh-CN": "无果", ru: "Без плодов" },
  "Fruit": { en: "Fruit", "zh-CN": "有果", ru: "С плодами" },
  "Net 1": { en: "Net 1", "zh-CN": "网 1", ru: "Сеть 1" },
  "Net 2": { en: "Net 2", "zh-CN": "网 2", ru: "Сеть 2" },
  "Net 3": { en: "Net 3", "zh-CN": "网 3", ru: "Сеть 3" },
  "None": { en: "None", "zh-CN": "无网", ru: "Без сети" },
  "Dry": { en: "Dry", "zh-CN": "未浇水", ru: "Не полито" },
  "Watered": { en: "Watered", "zh-CN": "已浇水", ru: "Полито" },
  "Base": { en: "Base", "zh-CN": "基础", ru: "Основа" },
  "Pressure": { en: "Pressure", "zh-CN": "加压喷头", ru: "Нагнетательное сопло" },
  "Enricher": { en: "Enricher", "zh-CN": "施肥器", ru: "Обогатитель" },
  "Lit": { en: "Lit", "zh-CN": "已点燃", ru: "Зажжено" },
  "Unlit": { en: "Unlit", "zh-CN": "未点燃", ru: "Не зажжено" },
} as const;

function createFilterLabels(
  locale: CatalogPanelLocale,
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    Object.entries(sharedFilterLabels).map(([filterLabelId, copyByLocale]) => [
      filterLabelId,
      copyByLocale[locale],
    ]),
  );
}

function createVariantLabels(
  locale: CatalogPanelLocale,
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    Object.entries(sharedVariantLabels).map(([variantLabel, copyByLocale]) => [
      variantLabel,
      copyByLocale[locale],
    ]),
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

  if (locale === "ru") {
    if (isSearch) {
      return `${formatRussianCountedNoun(count, "результат", "результата", "результатов")} нельзя разместить здесь`;
    }
    return `${formatRussianCountedNoun(count, "предмет", "предмета", "предметов")} нельзя разместить здесь`;
  }

  return throwUnsupportedCatalogPanelLocale(locale);
}

function createSceneAvailabilityReason(
  locale: CatalogPanelLocale,
  availability: "indoor-only" | "outdoor-only",
): string {
  if (availability === "indoor-only") {
    if (locale === "en") {
      return "This item can only be placed indoors.";
    }
    if (locale === "zh-CN") {
      return "该物品只能放置在室内。";
    }
    if (locale === "ru") {
      return "Этот предмет можно разместить только в помещении.";
    }
    return throwUnsupportedCatalogPanelLocale(locale);
  }

  if (availability === "outdoor-only") {
    if (locale === "en") {
      return "This item can only be placed outdoors.";
    }
    if (locale === "zh-CN") {
      return "该物品只能放置在室外。";
    }
    if (locale === "ru") {
      return "Этот предмет можно разместить только на улице.";
    }
    return throwUnsupportedCatalogPanelLocale(locale);
  }

  throw new TypeError(
    `Unsupported catalog scene availability. Received: ${JSON.stringify(availability)}.`,
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

export function getCatalogPanelCopy(locale: CatalogPanelLocale): CatalogPanelCopy {
  if (!isCatalogPanelLocale(locale)) {
    throw new TypeError(
      `Unsupported catalog-panel locale. Received: ${JSON.stringify(locale)}.`,
    );
  }

  return catalogPanelCopyByLocale[locale];
}
