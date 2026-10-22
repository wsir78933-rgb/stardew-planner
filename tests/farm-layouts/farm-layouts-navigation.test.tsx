import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { SiteNavigationDock } from "@/src/components/site-navigation-dock";
import { FarmLayoutsNavigation } from "@/src/farm-layouts/farm-layouts-navigation";
import { expandedFarmCanonicalPath } from "@/src/farm-layouts/expanded-farm-content";
import { fruitTreeLayoutCanonicalPath } from "@/src/farm-layouts/fruit-tree-layout-content";
import { hilltopFarmCanonicalPath } from "@/src/farm-layouts/hilltop-farm-content";
import { iridiumSprinklerLayoutCanonicalPath } from "@/src/farm-layouts/iridium-sprinkler-layout-content";
import { sprinklerLayoutCanonicalPath } from "@/src/farm-layouts/sprinkler-layout-content";
import {
  activateFarmLayoutsCategory,
  closeFarmLayoutsNavigationOnEscape,
  createClosedFarmLayoutsNavigationInteraction,
  getFarmLayoutsNavigationCategoryFocusKey,
  getFarmLayoutsNavigationPageFocusKey,
  moveFarmLayoutsNavigationFocus,
  openFarmLayoutsCategoryFromPointerHover,
  openFarmLayoutsNavigationFromPointerHover,
  toggleFarmLayoutsNavigation,
} from "@/src/farm-layouts/farm-layouts-navigation-interaction";
import {
  FARM_LAYOUTS_NAVIGATION_CATEGORY_IDS,
  getFarmLayoutsNavigationModel,
  isFarmLayoutsNavigationPageId,
  readFarmLayoutsNavigationCategory,
  readFarmLayoutsNavigationPage,
} from "@/src/farm-layouts/farm-layouts-navigation-model";

const emptyFarmLayoutsCategoryIds = [
  "greenhouse-layouts",
  "buildings-interiors",
  "layout-ideas",
] as const;

const localeHrefByLocale = {
  en: "/",
  ja: "/ja",
  ru: "/ru",
  "zh-CN": "/zh",
} as const;

const categoryLabelsByLocale = {
  en: [
    "Farm Maps",
    "Greenhouse Layouts",
    "Buildings & Interiors",
    "Planting Layouts",
    "Layout Ideas",
  ],
  ja: [
    "Farm Maps",
    "Greenhouse Layouts",
    "Buildings & Interiors",
    "Planting Layouts",
    "Layout Ideas",
  ],
  ru: [
    "Farm Maps",
    "Greenhouse Layouts",
    "Buildings & Interiors",
    "Planting Layouts",
    "Layout Ideas",
  ],
  "zh-CN": [
    "农场地图",
    "温室布局",
    "建筑与室内",
    "种植布局",
    "布局灵感",
  ],
} as const;

function renderFarmLayoutsNavigation(
  locale: "en" | "zh-CN" | "ja" | "ru",
): string {
  return renderToStaticMarkup(<FarmLayoutsNavigation locale={locale} />);
}

function moveNavigationFocus(input: Readonly<{
  compact: boolean;
  currentFocusKey: string;
  interaction: ReturnType<typeof createClosedFarmLayoutsNavigationInteraction>;
  key: "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "Escape";
  locale?: "en" | "zh-CN" | "ja" | "ru";
}>) {
  return moveFarmLayoutsNavigationFocus({
    compact: input.compact,
    currentFocusKey: input.currentFocusKey,
    interaction: input.interaction,
    key: input.key,
    model: getFarmLayoutsNavigationModel(input.locale ?? "en"),
  });
}

test("keeps the five first-level categories ordered and localized with English fallbacks", () => {
  for (const locale of ["en", "zh-CN", "ja", "ru"] as const) {
    const model = getFarmLayoutsNavigationModel(locale);

    expect(model.categories.map((category) => category.id)).toEqual(
      FARM_LAYOUTS_NAVIGATION_CATEGORY_IDS,
    );
    expect(model.categories.map((category) => category.label)).toEqual(
      categoryLabelsByLocale[locale],
    );
  }
});

test("provides all nine Farm Maps pages in order with localized hrefs", () => {
  const expectedFarmMapPagesByLocale = {
    en: [
      {
        href: "/stardew-valley-beach-farm-layout",
        id: "beach-farm",
        label: "Beach Farm Layouts",
      },
      {
        href: "/stardew-valley-fish-farm-layout",
        id: "fish-farm",
        label: "Fish Farm Layouts",
      },
      {
        href: "/stardew-valley-river-farm-layout",
        id: "river-farm",
        label: "River Farm Layouts",
      },
      {
        href: "/meadowlands-farm-layout",
        id: "meadowlands-farm",
        label: "Meadowlands Farm layout",
      },
      {
        href: "/stardew-valley-forest-farm-layout",
        id: "forest-farm",
        label: "Forest Farm Layouts",
      },
      {
        href: "/stardew-valley-four-corners-farm-layout",
        id: "four-corners-farm",
        label: "Four Corners Farm Layouts",
      },
      {
        href: "/stardew-valley-frontier-farm-layout",
        id: "frontier-farm",
        label: "Frontier Farm Layouts",
      },
      {
        href: expandedFarmCanonicalPath,
        id: "expanded-farm",
        label: "Expanded Farm Layouts",
      },
      {
        href: hilltopFarmCanonicalPath,
        id: "hilltop-farm",
        label: "Hilltop Farm Layouts",
      },
    ],
    ja: [
      {
        href: "/stardew-valley-beach-farm-layout",
        id: "beach-farm",
        label: "Beach Farm Layouts",
      },
      {
        href: "/stardew-valley-fish-farm-layout",
        id: "fish-farm",
        label: "Fish Farm Layouts",
      },
      {
        href: "/stardew-valley-river-farm-layout",
        id: "river-farm",
        label: "River Farm Layouts",
      },
      {
        href: "/meadowlands-farm-layout",
        id: "meadowlands-farm",
        label: "Meadowlands Farm layout",
      },
      {
        href: "/stardew-valley-forest-farm-layout",
        id: "forest-farm",
        label: "Forest Farm Layouts",
      },
      {
        href: "/stardew-valley-four-corners-farm-layout",
        id: "four-corners-farm",
        label: "Four Corners Farm Layouts",
      },
      {
        href: "/stardew-valley-frontier-farm-layout",
        id: "frontier-farm",
        label: "Frontier Farm Layouts",
      },
      {
        href: expandedFarmCanonicalPath,
        id: "expanded-farm",
        label: "Expanded Farm Layouts",
      },
      {
        href: hilltopFarmCanonicalPath,
        id: "hilltop-farm",
        label: "Hilltop Farm Layouts",
      },
    ],
    ru: [
      {
        href: "/stardew-valley-beach-farm-layout",
        id: "beach-farm",
        label: "Beach Farm Layouts",
      },
      {
        href: "/stardew-valley-fish-farm-layout",
        id: "fish-farm",
        label: "Fish Farm Layouts",
      },
      {
        href: "/stardew-valley-river-farm-layout",
        id: "river-farm",
        label: "River Farm Layouts",
      },
      {
        href: "/meadowlands-farm-layout",
        id: "meadowlands-farm",
        label: "Meadowlands Farm layout",
      },
      {
        href: "/stardew-valley-forest-farm-layout",
        id: "forest-farm",
        label: "Forest Farm Layouts",
      },
      {
        href: "/stardew-valley-four-corners-farm-layout",
        id: "four-corners-farm",
        label: "Four Corners Farm Layouts",
      },
      {
        href: "/stardew-valley-frontier-farm-layout",
        id: "frontier-farm",
        label: "Frontier Farm Layouts",
      },
      {
        href: expandedFarmCanonicalPath,
        id: "expanded-farm",
        label: "Expanded Farm Layouts",
      },
      {
        href: hilltopFarmCanonicalPath,
        id: "hilltop-farm",
        label: "Hilltop Farm Layouts",
      },
    ],
    "zh-CN": [
      {
        href: "/zh/stardew-valley-beach-farm-layout",
        id: "beach-farm",
        label: "海滩农场布局",
      },
      {
        href: "/zh/stardew-valley-fish-farm-layout",
        id: "fish-farm",
        label: "鱼塘农场布局",
      },
      {
        href: "/zh/stardew-valley-river-farm-layout",
        id: "river-farm",
        label: "河流农场布局",
      },
      {
        href: "/zh/meadowlands-farm-layout",
        id: "meadowlands-farm",
        label: "草原农场布局",
      },
      {
        href: "/zh/stardew-valley-forest-farm-layout",
        id: "forest-farm",
        label: "森林农场布局",
      },
      {
        href: "/zh/stardew-valley-four-corners-farm-layout",
        id: "four-corners-farm",
        label: "四角农场布局",
      },
      {
        href: "/zh/stardew-valley-frontier-farm-layout",
        id: "frontier-farm",
        label: "边境农场布局",
      },
      {
        href: `/zh${expandedFarmCanonicalPath}`,
        id: "expanded-farm",
        label: "扩展农场布局",
      },
      {
        href: `/zh${hilltopFarmCanonicalPath}`,
        id: "hilltop-farm",
        label: "山顶农场布局",
      },
    ],
  } as const;

  for (const locale of ["en", "zh-CN", "ja", "ru"] as const) {
    const model = getFarmLayoutsNavigationModel(locale);
    const farmMaps = readFarmLayoutsNavigationCategory(model, "farm-maps");

    expect(farmMaps.pages).toEqual(expectedFarmMapPagesByLocale[locale]);

    for (const categoryId of emptyFarmLayoutsCategoryIds) {
      expect(readFarmLayoutsNavigationCategory(model, categoryId).pages).toEqual(
        [],
      );
    }
    expect(model.emptyStateLabel).toBe(
      locale === "zh-CN" ? "暂无布局案例。" : "No layouts yet.",
    );

    const markup = renderFarmLayoutsNavigation(locale);
    expect(markup.match(/<a\b/g) ?? []).toHaveLength(9);
    for (const page of expectedFarmMapPagesByLocale[locale]) {
      expect(markup).toContain(`href="${page.href}"`);
      expect(markup).toContain(`<span>${page.label}</span>`);
    }
    expect(markup).not.toContain('href="#');
  }
});

test("places the fruit-tree page third under Planting Layouts for each display locale", () => {
  expect(sprinklerLayoutCanonicalPath).toBe("/stardew-valley-sprinkler-layout");
  expect(iridiumSprinklerLayoutCanonicalPath).toBe(
    "/stardew-valley-iridium-sprinkler-layout",
  );
  expect(fruitTreeLayoutCanonicalPath).toBe(
    "/stardew-valley-fruit-tree-layout",
  );
  expect(isFarmLayoutsNavigationPageId("sprinkler-layout")).toBe(true);
  expect(isFarmLayoutsNavigationPageId("iridium-sprinkler-layout")).toBe(true);
  expect(isFarmLayoutsNavigationPageId("fruit-tree-layout")).toBe(true);

  for (const locale of ["en", "zh-CN", "ja", "ru"] as const) {
    const model = getFarmLayoutsNavigationModel(locale);
    const plantingLayouts = readFarmLayoutsNavigationCategory(
      model,
      "planting-layouts",
    );
    const href =
      locale === "zh-CN"
        ? `/zh${sprinklerLayoutCanonicalPath}`
        : sprinklerLayoutCanonicalPath;
    const label = locale === "zh-CN" ? "洒水器布局" : "Sprinkler Layouts";
    const iridiumHref =
      locale === "zh-CN"
        ? `/zh${iridiumSprinklerLayoutCanonicalPath}`
        : iridiumSprinklerLayoutCanonicalPath;
    const iridiumLabel =
      locale === "zh-CN" ? "铱金洒水器布局" : "Iridium Sprinkler Layouts";
    const fruitTreeHref =
      locale === "zh-CN"
        ? `/zh${fruitTreeLayoutCanonicalPath}`
        : fruitTreeLayoutCanonicalPath;
    const fruitTreeLabel = locale === "zh-CN" ? "果树布局" : "Fruit Tree Layouts";
    const sprinklerPage = {
      href,
      id: "sprinkler-layout",
      label,
    } as const;
    const iridiumSprinklerPage = {
      href: iridiumHref,
      id: "iridium-sprinkler-layout",
      label: iridiumLabel,
    } as const;
    const fruitTreePage = {
      href: fruitTreeHref,
      id: "fruit-tree-layout",
      label: fruitTreeLabel,
    } as const;

    expect(plantingLayouts.label).toBe(
      locale === "zh-CN" ? "种植布局" : "Planting Layouts",
    );
    expect(plantingLayouts.pages).toEqual([
      sprinklerPage,
      iridiumSprinklerPage,
      fruitTreePage,
    ]);
    expect(
      readFarmLayoutsNavigationPage(
        model,
        "planting-layouts",
        "sprinkler-layout",
      ),
    ).toEqual(sprinklerPage);
    expect(
      readFarmLayoutsNavigationPage(
        model,
        "planting-layouts",
        "iridium-sprinkler-layout",
      ),
    ).toEqual(iridiumSprinklerPage);
    expect(
      readFarmLayoutsNavigationPage(model, "planting-layouts", "fruit-tree-layout"),
    ).toEqual(fruitTreePage);
    expect(
      readFarmLayoutsNavigationCategory(model, "farm-maps").pages.map(
        (farmMapPage) => farmMapPage.id,
      ),
    ).toEqual([
      "beach-farm",
      "fish-farm",
      "river-farm",
      "meadowlands-farm",
      "forest-farm",
      "four-corners-farm",
      "frontier-farm",
      "expanded-farm",
      "hilltop-farm",
    ]);
  }
});

test("moves through all three Planting Layouts pages with desktop and compact keys", () => {
  const plantingFocusKey = getFarmLayoutsNavigationCategoryFocusKey(
    "planting-layouts",
  );
  const sprinklerFocusKey = getFarmLayoutsNavigationPageFocusKey(
    "sprinkler-layout",
  );
  const iridiumSprinklerFocusKey = getFarmLayoutsNavigationPageFocusKey(
    "iridium-sprinkler-layout",
  );
  const fruitTreeFocusKey = getFarmLayoutsNavigationPageFocusKey(
    "fruit-tree-layout",
  );
  const categories = {
    focusKey: plantingFocusKey,
    openCategoryId: null,
    panel: "categories",
    suppressPointerHover: false,
  } as const;

  for (const locale of ["en", "zh-CN"] as const) {
    const opened = moveNavigationFocus({
      compact: false,
      currentFocusKey: plantingFocusKey,
      interaction: categories,
      key: "ArrowRight",
      locale,
    });
    const movedDownFromSprinkler = moveNavigationFocus({
      compact: false,
      currentFocusKey: sprinklerFocusKey,
      interaction: opened,
      key: "ArrowDown",
      locale,
    });
    const movedDownFromIridiumSprinkler = moveNavigationFocus({
      compact: false,
      currentFocusKey: iridiumSprinklerFocusKey,
      interaction: opened,
      key: "ArrowDown",
      locale,
    });
    const movedUpFromFruitTree = moveNavigationFocus({
      compact: false,
      currentFocusKey: fruitTreeFocusKey,
      interaction: opened,
      key: "ArrowUp",
      locale,
    });
    const wrappedUpFromSprinkler = moveNavigationFocus({
      compact: false,
      currentFocusKey: sprinklerFocusKey,
      interaction: opened,
      key: "ArrowUp",
      locale,
    });
    const returned = moveNavigationFocus({
      compact: false,
      currentFocusKey: sprinklerFocusKey,
      interaction: opened,
      key: "ArrowLeft",
      locale,
    });
    const compactCategory = moveNavigationFocus({
      compact: true,
      currentFocusKey: plantingFocusKey,
      interaction: categories,
      key: "ArrowRight",
      locale,
    });
    const compactPage = moveNavigationFocus({
      compact: true,
      currentFocusKey: "back",
      interaction: compactCategory,
      key: "ArrowDown",
      locale,
    });
    const compactIridiumSprinklerPage = moveNavigationFocus({
      compact: true,
      currentFocusKey: sprinklerFocusKey,
      interaction: compactCategory,
      key: "ArrowDown",
      locale,
    });
    const compactFruitTreePage = moveNavigationFocus({
      compact: true,
      currentFocusKey: iridiumSprinklerFocusKey,
      interaction: compactCategory,
      key: "ArrowDown",
      locale,
    });

    expect(opened).toMatchObject({
      focusKey: sprinklerFocusKey,
      openCategoryId: "planting-layouts",
      panel: "category",
    });
    expect(movedDownFromSprinkler.focusKey).toBe(iridiumSprinklerFocusKey);
    expect(movedDownFromIridiumSprinkler.focusKey).toBe(fruitTreeFocusKey);
    expect(movedUpFromFruitTree.focusKey).toBe(iridiumSprinklerFocusKey);
    expect(wrappedUpFromSprinkler.focusKey).toBe(fruitTreeFocusKey);
    expect(returned).toMatchObject({
      focusKey: plantingFocusKey,
      openCategoryId: null,
      panel: "categories",
    });
    expect(compactCategory).toMatchObject({
      focusKey: "back",
      openCategoryId: "planting-layouts",
      panel: "category",
    });
    expect(compactPage).toMatchObject({
      focusKey: sprinklerFocusKey,
      openCategoryId: "planting-layouts",
      panel: "category",
    });
    expect(compactIridiumSprinklerPage).toMatchObject({
      focusKey: iridiumSprinklerFocusKey,
      openCategoryId: "planting-layouts",
      panel: "category",
    });
    expect(compactFruitTreePage).toMatchObject({
      focusKey: fruitTreeFocusKey,
      openCategoryId: "planting-layouts",
      panel: "category",
    });
  }
});

test("keeps Farm Layouts immediately before the language control in the dock", () => {
  const markup = renderToStaticMarkup(
    <SiteNavigationDock
      blogHref="/blog"
      blogLabel="Blog"
      brandHref="/"
      brandLabel="Stardew Valley Farm Planner"
      currentLocale="en"
      languageLabel="Language"
      languageMode="browser"
      languageSwitcher={<span data-language-control="">Language</span>}
      plannerHref="/#planner"
      plannerLabel="Open planner"
      surface="homepage"
    />,
  );
  const farmLayoutsIndex = markup.indexOf(
    "data-farm-layouts-navigation-trigger",
  );
  const languageControlIndex = markup.indexOf("data-language-control");

  expect(farmLayoutsIndex).toBeGreaterThan(-1);
  expect(languageControlIndex).toBeGreaterThan(farmLayoutsIndex);
});

test("moves keyboard focus through all five categories and wraps at both ends", () => {
  const model = getFarmLayoutsNavigationModel("en");
  let interaction = toggleFarmLayoutsNavigation(
    createClosedFarmLayoutsNavigationInteraction(),
  );

  interaction = moveNavigationFocus({
    compact: false,
    currentFocusKey: "trigger",
    interaction,
    key: "ArrowDown",
  });
  expect(interaction.focusKey).toBe(
    getFarmLayoutsNavigationCategoryFocusKey("farm-maps"),
  );

  for (const category of model.categories.slice(1)) {
    interaction = moveNavigationFocus({
      compact: false,
      currentFocusKey: interaction.focusKey ?? "",
      interaction,
      key: "ArrowDown",
    });
    expect(interaction.focusKey).toBe(
      getFarmLayoutsNavigationCategoryFocusKey(category.id),
    );
  }

  interaction = moveNavigationFocus({
    compact: false,
    currentFocusKey: interaction.focusKey ?? "",
    interaction,
    key: "ArrowDown",
  });
  expect(interaction.focusKey).toBe(
    getFarmLayoutsNavigationCategoryFocusKey("farm-maps"),
  );

  interaction = moveNavigationFocus({
    compact: false,
    currentFocusKey: interaction.focusKey ?? "",
    interaction,
    key: "ArrowUp",
  });
  expect(interaction.focusKey).toBe(
    getFarmLayoutsNavigationCategoryFocusKey("layout-ideas"),
  );
});

test("opens an empty desktop category without page focus and returns to that category on Left", () => {
  const selectedCategory = getFarmLayoutsNavigationCategoryFocusKey(
    "buildings-interiors",
  );
  const categories = {
    focusKey: selectedCategory,
    openCategoryId: null,
    panel: "categories",
    suppressPointerHover: false,
  } as const;
  const emptyCategoryPanel = moveNavigationFocus({
    compact: false,
    currentFocusKey: selectedCategory,
    interaction: categories,
    key: "ArrowRight",
  });
  const returnedToCategories = moveNavigationFocus({
    compact: false,
    currentFocusKey: emptyCategoryPanel.focusKey ?? "",
    interaction: emptyCategoryPanel,
    key: "ArrowLeft",
  });

  expect(emptyCategoryPanel).toMatchObject({
    focusKey: selectedCategory,
    openCategoryId: "buildings-interiors",
    panel: "category",
  });
  expect(returnedToCategories).toMatchObject({
    focusKey: selectedCategory,
    openCategoryId: null,
    panel: "categories",
  });
});

test("uses a compact back step for empty and populated categories, then restores trigger focus on Escape", () => {
  const emptyCategory = moveNavigationFocus({
    compact: true,
    currentFocusKey: getFarmLayoutsNavigationCategoryFocusKey(
      "greenhouse-layouts",
    ),
    interaction: {
      focusKey: getFarmLayoutsNavigationCategoryFocusKey("greenhouse-layouts"),
      openCategoryId: null,
      panel: "categories",
      suppressPointerHover: false,
    },
    key: "ArrowRight",
  });
  const returnedFromEmpty = moveNavigationFocus({
    compact: true,
    currentFocusKey: "back",
    interaction: emptyCategory,
    key: "ArrowLeft",
  });
  const beachCategory = activateFarmLayoutsCategory(
    returnedFromEmpty,
    "farm-maps",
    true,
  );
  const beachPage = moveNavigationFocus({
    compact: true,
    currentFocusKey: "back",
    interaction: beachCategory,
    key: "ArrowRight",
  });
  const fishPage = moveNavigationFocus({
    compact: true,
    currentFocusKey: getFarmLayoutsNavigationPageFocusKey("beach-farm"),
    interaction: beachPage,
    key: "ArrowDown",
  });
  const riverPage = moveNavigationFocus({
    compact: true,
    currentFocusKey: getFarmLayoutsNavigationPageFocusKey("fish-farm"),
    interaction: fishPage,
    key: "ArrowDown",
  });
  const meadowlandsPage = moveNavigationFocus({
    compact: true,
    currentFocusKey: getFarmLayoutsNavigationPageFocusKey("river-farm"),
    interaction: riverPage,
    key: "ArrowDown",
  });
  const forestPage = moveNavigationFocus({
    compact: true,
    currentFocusKey: getFarmLayoutsNavigationPageFocusKey("meadowlands-farm"),
    interaction: meadowlandsPage,
    key: "ArrowDown",
  });
  const fourCornersPage = moveNavigationFocus({
    compact: true,
    currentFocusKey: getFarmLayoutsNavigationPageFocusKey("forest-farm"),
    interaction: forestPage,
    key: "ArrowDown",
  });
  const frontierPage = moveNavigationFocus({
    compact: true,
    currentFocusKey: getFarmLayoutsNavigationPageFocusKey("four-corners-farm"),
    interaction: fourCornersPage,
    key: "ArrowDown",
  });
  const expandedPage = moveNavigationFocus({
    compact: true,
    currentFocusKey: getFarmLayoutsNavigationPageFocusKey("frontier-farm"),
    interaction: frontierPage,
    key: "ArrowDown",
  });
  const hilltopPage = moveNavigationFocus({
    compact: true,
    currentFocusKey: getFarmLayoutsNavigationPageFocusKey("expanded-farm"),
    interaction: expandedPage,
    key: "ArrowDown",
  });
  const returnedFromPage = moveNavigationFocus({
    compact: true,
    currentFocusKey: getFarmLayoutsNavigationPageFocusKey("hilltop-farm"),
    interaction: hilltopPage,
    key: "ArrowLeft",
  });
  const escaped = moveNavigationFocus({
    compact: true,
    currentFocusKey: getFarmLayoutsNavigationCategoryFocusKey("farm-maps"),
    interaction: returnedFromPage,
    key: "Escape",
  });

  expect(emptyCategory).toMatchObject({
    focusKey: "back",
    openCategoryId: "greenhouse-layouts",
    panel: "category",
  });
  expect(returnedFromEmpty).toMatchObject({
    focusKey: getFarmLayoutsNavigationCategoryFocusKey("greenhouse-layouts"),
    openCategoryId: null,
    panel: "categories",
  });
  expect(beachPage).toMatchObject({
    focusKey: getFarmLayoutsNavigationPageFocusKey("beach-farm"),
    openCategoryId: "farm-maps",
    panel: "category",
  });
  expect(fishPage).toMatchObject({
    focusKey: getFarmLayoutsNavigationPageFocusKey("fish-farm"),
    openCategoryId: "farm-maps",
    panel: "category",
  });
  expect(riverPage).toMatchObject({
    focusKey: getFarmLayoutsNavigationPageFocusKey("river-farm"),
    openCategoryId: "farm-maps",
    panel: "category",
  });
  expect(meadowlandsPage).toMatchObject({
    focusKey: getFarmLayoutsNavigationPageFocusKey("meadowlands-farm"),
    openCategoryId: "farm-maps",
    panel: "category",
  });
  expect(forestPage).toMatchObject({
    focusKey: getFarmLayoutsNavigationPageFocusKey("forest-farm"),
    openCategoryId: "farm-maps",
    panel: "category",
  });
  expect(fourCornersPage).toMatchObject({
    focusKey: getFarmLayoutsNavigationPageFocusKey("four-corners-farm"),
    openCategoryId: "farm-maps",
    panel: "category",
  });
  expect(frontierPage).toMatchObject({
    focusKey: getFarmLayoutsNavigationPageFocusKey("frontier-farm"),
    openCategoryId: "farm-maps",
    panel: "category",
  });
  expect(expandedPage).toMatchObject({
    focusKey: getFarmLayoutsNavigationPageFocusKey("expanded-farm"),
    openCategoryId: "farm-maps",
    panel: "category",
  });
  expect(hilltopPage).toMatchObject({
    focusKey: getFarmLayoutsNavigationPageFocusKey("hilltop-farm"),
    openCategoryId: "farm-maps",
    panel: "category",
  });
  expect(returnedFromPage).toMatchObject({
    focusKey: getFarmLayoutsNavigationCategoryFocusKey("farm-maps"),
    panel: "categories",
  });
  expect(escaped).toMatchObject({ panel: "closed", focusKey: "trigger" });
  expect(closeFarmLayoutsNavigationOnEscape()).toMatchObject({
    panel: "closed",
    focusKey: "trigger",
  });
});

test("moves Up and Down through all nine Farm Maps pages and wraps at both ends", () => {
  const farmMapPageIds = [
    "beach-farm",
    "fish-farm",
    "river-farm",
    "meadowlands-farm",
    "forest-farm",
    "four-corners-farm",
    "frontier-farm",
    "expanded-farm",
    "hilltop-farm",
  ] as const;
  const expectedDownPageIds = [
    "fish-farm",
    "river-farm",
    "meadowlands-farm",
    "forest-farm",
    "four-corners-farm",
    "frontier-farm",
    "expanded-farm",
    "hilltop-farm",
    "beach-farm",
  ] as const;
  const expectedUpPageIds = [
    "hilltop-farm",
    "beach-farm",
    "fish-farm",
    "river-farm",
    "meadowlands-farm",
    "forest-farm",
    "four-corners-farm",
    "frontier-farm",
    "expanded-farm",
  ] as const;
  const moveFromFarmMapPage = (
    pageId: (typeof farmMapPageIds)[number],
    key: "ArrowDown" | "ArrowUp",
  ) => {
    const focusKey = getFarmLayoutsNavigationPageFocusKey(pageId);

    return moveNavigationFocus({
      compact: false,
      currentFocusKey: focusKey,
      interaction: {
        focusKey,
        openCategoryId: "farm-maps",
        panel: "category",
        suppressPointerHover: false,
      },
      key,
    });
  };
  const movedDownFocusKeys = farmMapPageIds.map((pageId) =>
    moveFromFarmMapPage(pageId, "ArrowDown").focusKey,
  );
  const movedUpFocusKeys = farmMapPageIds.map((pageId) =>
    moveFromFarmMapPage(pageId, "ArrowUp").focusKey,
  );

  expect(movedDownFocusKeys).toEqual(
    expectedDownPageIds.map(getFarmLayoutsNavigationPageFocusKey),
  );
  expect(movedUpFocusKeys).toEqual(
    expectedUpPageIds.map(getFarmLayoutsNavigationPageFocusKey),
  );
});

test("changes the selected category on desktop hover", () => {
  const categories = openFarmLayoutsNavigationFromPointerHover(
    createClosedFarmLayoutsNavigationInteraction(),
  );
  const selectedCategory = openFarmLayoutsCategoryFromPointerHover(
    categories,
    "layout-ideas",
  );

  expect(selectedCategory).toMatchObject({
    openCategoryId: "layout-ideas",
    panel: "category",
  });
});

test("fails fast with unsupported locale, category, page, and focus values", () => {
  const model = getFarmLayoutsNavigationModel("en");

  expect(() => getFarmLayoutsNavigationModel("fr")).toThrow(
    'received "fr".',
  );
  expect(() => readFarmLayoutsNavigationCategory(model, "nope")).toThrow(
    '"nope"',
  );
  expect(() =>
    readFarmLayoutsNavigationPage(model, "farm-maps", "missing-page"),
  ).toThrow('"missing-page"');
  expect(() => getFarmLayoutsNavigationPageFocusKey("missing-page")).toThrow(
    '"missing-page"',
  );
  expect(() =>
    moveFarmLayoutsNavigationFocus({
      compact: false,
      currentFocusKey: "category:nope",
      interaction: createClosedFarmLayoutsNavigationInteraction(),
      key: "ArrowDown",
      model,
    }),
  ).toThrow('"nope"');
  expect(() =>
    moveFarmLayoutsNavigationFocus({
      compact: false,
      currentFocusKey: "invalid-focus",
      interaction: createClosedFarmLayoutsNavigationInteraction(),
      key: "ArrowDown",
      model,
    }),
  ).toThrow('"invalid-focus"');
});
