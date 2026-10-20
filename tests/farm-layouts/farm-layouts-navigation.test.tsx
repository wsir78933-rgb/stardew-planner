import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { SiteNavigationDock } from "@/src/components/site-navigation-dock";
import { FarmLayoutsNavigation } from "@/src/farm-layouts/farm-layouts-navigation";
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
  readFarmLayoutsNavigationCategory,
  readFarmLayoutsNavigationPage,
} from "@/src/farm-layouts/farm-layouts-navigation-model";

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

test("provides Beach, Fish, and Meadowlands pages in order with localized hrefs", () => {
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
        href: "/meadowlands-farm-layout",
        id: "meadowlands-farm",
        label: "Meadowlands Farm layout",
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
        href: "/meadowlands-farm-layout",
        id: "meadowlands-farm",
        label: "Meadowlands Farm layout",
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
        href: "/meadowlands-farm-layout",
        id: "meadowlands-farm",
        label: "Meadowlands Farm layout",
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
        label: "河流农场布局",
      },
      {
        href: "/zh/meadowlands-farm-layout",
        id: "meadowlands-farm",
        label: "草原农场布局",
      },
    ],
  } as const;

  for (const locale of ["en", "zh-CN", "ja", "ru"] as const) {
    const model = getFarmLayoutsNavigationModel(locale);
    const farmMaps = readFarmLayoutsNavigationCategory(model, "farm-maps");

    expect(farmMaps.pages).toEqual(expectedFarmMapPagesByLocale[locale]);

    for (const categoryId of FARM_LAYOUTS_NAVIGATION_CATEGORY_IDS.slice(1)) {
      expect(readFarmLayoutsNavigationCategory(model, categoryId).pages).toEqual(
        [],
      );
    }
    expect(model.emptyStateLabel).toBe(
      locale === "zh-CN" ? "暂无布局案例。" : "No layouts yet.",
    );

    const markup = renderFarmLayoutsNavigation(locale);
    expect(markup.match(/<a\b/g) ?? []).toHaveLength(3);
    for (const page of expectedFarmMapPagesByLocale[locale]) {
      expect(markup).toContain(`href="${page.href}"`);
      expect(markup).toContain(`<span>${page.label}</span>`);
    }
    expect(markup).not.toContain('href="#');
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
      "planting-layouts",
    ),
    interaction: {
      focusKey: getFarmLayoutsNavigationCategoryFocusKey("planting-layouts"),
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
  const meadowlandsPage = moveNavigationFocus({
    compact: true,
    currentFocusKey: getFarmLayoutsNavigationPageFocusKey("fish-farm"),
    interaction: fishPage,
    key: "ArrowDown",
  });
  const returnedFromPage = moveNavigationFocus({
    compact: true,
    currentFocusKey: getFarmLayoutsNavigationPageFocusKey("meadowlands-farm"),
    interaction: meadowlandsPage,
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
    openCategoryId: "planting-layouts",
    panel: "category",
  });
  expect(returnedFromEmpty).toMatchObject({
    focusKey: getFarmLayoutsNavigationCategoryFocusKey("planting-layouts"),
    openCategoryId: null,
    panel: "categories",
  });
  expect(meadowlandsPage).toMatchObject({
    focusKey: getFarmLayoutsNavigationPageFocusKey("meadowlands-farm"),
    openCategoryId: "farm-maps",
    panel: "category",
  });
  expect(fishPage).toMatchObject({
    focusKey: getFarmLayoutsNavigationPageFocusKey("fish-farm"),
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

test("moves Up and Down through all Farm Maps pages and wraps at both ends", () => {
  const beachPageFocusKey = getFarmLayoutsNavigationPageFocusKey("beach-farm");
  const fishPageFocusKey = getFarmLayoutsNavigationPageFocusKey("fish-farm");
  const meadowlandsPageFocusKey = getFarmLayoutsNavigationPageFocusKey(
    "meadowlands-farm",
  );
  const beachPageInteraction = {
    focusKey: beachPageFocusKey,
    openCategoryId: "farm-maps",
    panel: "category",
    suppressPointerHover: false,
  } as const;
  const fishPageInteraction = {
    ...beachPageInteraction,
    focusKey: fishPageFocusKey,
  };
  const meadowlandsPageInteraction = {
    ...beachPageInteraction,
    focusKey: meadowlandsPageFocusKey,
  };

  const downFromBeach = moveNavigationFocus({
    compact: false,
    currentFocusKey: beachPageFocusKey,
    interaction: beachPageInteraction,
    key: "ArrowDown",
  });
  const downFromFish = moveNavigationFocus({
    compact: false,
    currentFocusKey: fishPageFocusKey,
    interaction: fishPageInteraction,
    key: "ArrowDown",
  });
  const downAtLastPage = moveNavigationFocus({
    compact: false,
    currentFocusKey: meadowlandsPageFocusKey,
    interaction: meadowlandsPageInteraction,
    key: "ArrowDown",
  });
  const upFromMeadowlands = moveNavigationFocus({
    compact: false,
    currentFocusKey: meadowlandsPageFocusKey,
    interaction: meadowlandsPageInteraction,
    key: "ArrowUp",
  });
  const upFromFish = moveNavigationFocus({
    compact: false,
    currentFocusKey: fishPageFocusKey,
    interaction: fishPageInteraction,
    key: "ArrowUp",
  });
  const upAtFirstPage = moveNavigationFocus({
    compact: false,
    currentFocusKey: beachPageFocusKey,
    interaction: beachPageInteraction,
    key: "ArrowUp",
  });

  expect(downFromBeach.focusKey).toBe(fishPageFocusKey);
  expect(downFromFish.focusKey).toBe(meadowlandsPageFocusKey);
  expect(downAtLastPage.focusKey).toBe(beachPageFocusKey);
  expect(upFromMeadowlands.focusKey).toBe(fishPageFocusKey);
  expect(upFromFish.focusKey).toBe(beachPageFocusKey);
  expect(upAtFirstPage.focusKey).toBe(meadowlandsPageFocusKey);
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
