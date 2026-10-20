import {
  isFarmLayoutsNavigationCategoryId,
  readFarmLayoutsNavigationCategory,
  readFarmLayoutsNavigationPage,
  type FarmLayoutsNavigationCategory,
  type FarmLayoutsNavigationCategoryId,
  type FarmLayoutsNavigationModel,
  type FarmLayoutsNavigationPageId,
} from "./farm-layouts-navigation-model";

export const FARM_LAYOUTS_NAVIGATION_TRIGGER_FOCUS_KEY = "trigger";
export const FARM_LAYOUTS_NAVIGATION_BACK_FOCUS_KEY = "back";

export type FarmLayoutsNavigationPanel = "closed" | "categories" | "category";

export type FarmLayoutsNavigationInteraction = Readonly<{
  focusKey: string | null;
  openCategoryId: FarmLayoutsNavigationCategoryId | null;
  panel: FarmLayoutsNavigationPanel;
  suppressPointerHover: boolean;
}>;

export type FarmLayoutsNavigationKey =
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUp"
  | "Escape";

type FarmLayoutsNavigationFocusMove = Readonly<{
  compact: boolean;
  currentFocusKey: string;
  interaction: FarmLayoutsNavigationInteraction;
  key: FarmLayoutsNavigationKey;
  model: FarmLayoutsNavigationModel;
}>;

export function createClosedFarmLayoutsNavigationInteraction(): FarmLayoutsNavigationInteraction {
  return {
    focusKey: null,
    openCategoryId: null,
    panel: "closed",
    suppressPointerHover: false,
  };
}

export function getFarmLayoutsNavigationCategoryFocusKey(
  categoryId: string,
): string {
  return `category:${readFarmLayoutsNavigationCategoryId(categoryId)}`;
}

export function getFarmLayoutsNavigationPageFocusKey(
  pageId: FarmLayoutsNavigationPageId,
): string {
  if (pageId !== "beach-farm") {
    throw new Error(
      `Unknown Farm Layouts navigation page ${JSON.stringify(pageId)}.`,
    );
  }

  return `page:${pageId}`;
}

export function isFarmLayoutsNavigationKey(
  key: string,
): key is FarmLayoutsNavigationKey {
  return (
    key === "ArrowDown" ||
    key === "ArrowLeft" ||
    key === "ArrowRight" ||
    key === "ArrowUp" ||
    key === "Escape"
  );
}

export function toggleFarmLayoutsNavigation(
  interaction: FarmLayoutsNavigationInteraction,
): FarmLayoutsNavigationInteraction {
  if (interaction.panel !== "closed") {
    return createClosedFarmLayoutsNavigationInteraction();
  }

  return {
    focusKey: null,
    openCategoryId: null,
    panel: "categories",
    suppressPointerHover: false,
  };
}

export function openFarmLayoutsNavigationFromPointerHover(
  interaction: FarmLayoutsNavigationInteraction,
): FarmLayoutsNavigationInteraction {
  if (interaction.suppressPointerHover || interaction.panel === "categories") {
    return interaction;
  }

  return {
    focusKey: null,
    openCategoryId: null,
    panel: "categories",
    suppressPointerHover: false,
  };
}

export function openFarmLayoutsCategoryFromPointerHover(
  interaction: FarmLayoutsNavigationInteraction,
  categoryId: string,
): FarmLayoutsNavigationInteraction {
  const selectedCategoryId = readFarmLayoutsNavigationCategoryId(categoryId);
  if (interaction.suppressPointerHover) {
    return interaction;
  }

  return {
    focusKey: null,
    openCategoryId: selectedCategoryId,
    panel: "category",
    suppressPointerHover: false,
  };
}

export function activateFarmLayoutsCategory(
  interaction: FarmLayoutsNavigationInteraction,
  categoryId: string,
  compact: boolean,
): FarmLayoutsNavigationInteraction {
  const selectedCategoryId = readFarmLayoutsNavigationCategoryId(categoryId);

  return {
    focusKey: compact
      ? FARM_LAYOUTS_NAVIGATION_BACK_FOCUS_KEY
      : interaction.focusKey,
    openCategoryId: selectedCategoryId,
    panel: "category",
    suppressPointerHover: false,
  };
}

export function returnFarmLayoutsNavigationToCategories(
  interaction: FarmLayoutsNavigationInteraction,
): FarmLayoutsNavigationInteraction {
  if (interaction.openCategoryId === null) {
    throw new Error(
      `Cannot return to Farm Layouts categories without an open category; received ${JSON.stringify(interaction.openCategoryId)}.`,
    );
  }

  return {
    focusKey: getFarmLayoutsNavigationCategoryFocusKey(
      interaction.openCategoryId,
    ),
    openCategoryId: null,
    panel: "categories",
    suppressPointerHover: false,
  };
}

export function closeFarmLayoutsNavigationOnEscape(): FarmLayoutsNavigationInteraction {
  return {
    focusKey: FARM_LAYOUTS_NAVIGATION_TRIGGER_FOCUS_KEY,
    openCategoryId: null,
    panel: "closed",
    suppressPointerHover: true,
  };
}

export function moveFarmLayoutsNavigationFocus(
  input: FarmLayoutsNavigationFocusMove,
): FarmLayoutsNavigationInteraction {
  if (input.key === "Escape") {
    return closeFarmLayoutsNavigationOnEscape();
  }

  if (input.currentFocusKey === FARM_LAYOUTS_NAVIGATION_TRIGGER_FOCUS_KEY) {
    return moveFocusFromTrigger(input);
  }

  const categoryId = readCategoryIdFromFocusKey(input.currentFocusKey);
  if (categoryId !== null) {
    return moveFocusFromCategory(input, categoryId);
  }

  if (input.currentFocusKey === FARM_LAYOUTS_NAVIGATION_BACK_FOCUS_KEY) {
    return moveFocusFromBackButton(input);
  }

  const pageId = readPageIdFromFocusKey(input.currentFocusKey);
  if (pageId !== null) {
    return moveFocusFromPage(input, pageId);
  }

  throw new Error(
    `Unknown Farm Layouts navigation focus key ${JSON.stringify(input.currentFocusKey)}.`,
  );
}

export function readFineFarmLayoutsPointer(
  matchMedia: ((query: string) => { matches: boolean }) | undefined,
): boolean {
  if (matchMedia === undefined) {
    return false;
  }

  return matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function readCompactFarmLayoutsNavigation(
  matchMedia: ((query: string) => { matches: boolean }) | undefined,
): boolean {
  if (matchMedia === undefined) {
    return false;
  }

  return matchMedia(
    "(max-width: 1119px), (hover: none) and (pointer: coarse)",
  ).matches;
}

function moveFocusFromTrigger(
  input: FarmLayoutsNavigationFocusMove,
): FarmLayoutsNavigationInteraction {
  const categories = input.model.categories;
  if (categories.length === 0) {
    throw new Error(
      `Farm Layouts navigation requires at least one category; received ${JSON.stringify(categories)}.`,
    );
  }

  if (input.key === "ArrowDown" || input.key === "ArrowRight") {
    const firstCategory = categories[0];
    if (firstCategory === undefined) {
      throw new Error(
        `Farm Layouts navigation first category is missing from ${JSON.stringify(categories)}.`,
      );
    }

    return focusFarmLayoutsCategory(firstCategory.id);
  }

  if (input.key === "ArrowUp") {
    const lastCategory = categories[categories.length - 1];
    if (lastCategory === undefined) {
      throw new Error(
        `Farm Layouts navigation last category is missing from ${JSON.stringify(categories)}.`,
      );
    }

    return focusFarmLayoutsCategory(lastCategory.id);
  }

  return input.interaction;
}

function moveFocusFromCategory(
  input: FarmLayoutsNavigationFocusMove,
  categoryId: FarmLayoutsNavigationCategoryId,
): FarmLayoutsNavigationInteraction {
  const category = readFarmLayoutsNavigationCategory(input.model, categoryId);

  if (input.key === "ArrowDown" || input.key === "ArrowUp") {
    const currentCategoryIndex = input.model.categories.findIndex(
      (farmLayoutsCategory) => farmLayoutsCategory.id === categoryId,
    );
    if (currentCategoryIndex === -1 || input.model.categories.length === 0) {
      throw new Error(
        `Farm Layouts navigation category ${JSON.stringify(categoryId)} is missing from ordered categories ${JSON.stringify(input.model.categories.map((farmLayoutsCategory) => farmLayoutsCategory.id))}.`,
      );
    }

    const categoryCount = input.model.categories.length;
    const direction = input.key === "ArrowDown" ? 1 : -1;
    const nextCategoryIndex =
      (currentCategoryIndex + direction + categoryCount) % categoryCount;
    const nextCategory = input.model.categories[nextCategoryIndex];
    if (nextCategory === undefined) {
      throw new Error(
        `Farm Layouts navigation category index ${JSON.stringify(nextCategoryIndex)} is missing from ${JSON.stringify(input.model.categories)}.`,
      );
    }

    return focusFarmLayoutsCategory(nextCategory.id);
  }

  if (input.key === "ArrowRight") {
    return openFarmLayoutsCategoryFromKeyboard(
      category,
      input.compact,
    );
  }

  if (
    input.key === "ArrowLeft" &&
    input.interaction.panel === "category" &&
    input.interaction.openCategoryId === categoryId
  ) {
    return returnFarmLayoutsNavigationToCategories(input.interaction);
  }

  return input.interaction;
}

function moveFocusFromBackButton(
  input: FarmLayoutsNavigationFocusMove,
): FarmLayoutsNavigationInteraction {
  if (input.key === "ArrowLeft") {
    return returnFarmLayoutsNavigationToCategories(input.interaction);
  }

  if (input.key !== "ArrowRight" && input.key !== "ArrowDown") {
    return input.interaction;
  }

  const category = readOpenFarmLayoutsCategory(input.interaction, input.model);
  const firstPage = category.pages[0];
  if (firstPage === undefined) {
    return input.interaction;
  }

  return {
    focusKey: getFarmLayoutsNavigationPageFocusKey(firstPage.id),
    openCategoryId: category.id,
    panel: "category",
    suppressPointerHover: false,
  };
}

function moveFocusFromPage(
  input: FarmLayoutsNavigationFocusMove,
  pageId: string,
): FarmLayoutsNavigationInteraction {
  const category = readOpenFarmLayoutsCategory(input.interaction, input.model);
  readFarmLayoutsNavigationPage(input.model, category.id, pageId);

  if (input.key === "ArrowLeft" || input.key === "ArrowUp") {
    return returnFarmLayoutsNavigationToCategories(input.interaction);
  }

  return input.interaction;
}

function openFarmLayoutsCategoryFromKeyboard(
  category: FarmLayoutsNavigationCategory,
  compact: boolean,
): FarmLayoutsNavigationInteraction {
  const firstPage = category.pages[0];
  const focusKey = compact
    ? FARM_LAYOUTS_NAVIGATION_BACK_FOCUS_KEY
    : firstPage === undefined
      ? getFarmLayoutsNavigationCategoryFocusKey(category.id)
      : getFarmLayoutsNavigationPageFocusKey(firstPage.id);

  return {
    focusKey,
    openCategoryId: category.id,
    panel: "category",
    suppressPointerHover: false,
  };
}

function focusFarmLayoutsCategory(
  categoryId: FarmLayoutsNavigationCategoryId,
): FarmLayoutsNavigationInteraction {
  return {
    focusKey: getFarmLayoutsNavigationCategoryFocusKey(categoryId),
    openCategoryId: null,
    panel: "categories",
    suppressPointerHover: false,
  };
}

function readOpenFarmLayoutsCategory(
  interaction: FarmLayoutsNavigationInteraction,
  model: FarmLayoutsNavigationModel,
): FarmLayoutsNavigationCategory {
  if (interaction.openCategoryId === null) {
    throw new Error(
      `Farm Layouts navigation panel has no open category; received ${JSON.stringify(interaction.openCategoryId)}.`,
    );
  }

  return readFarmLayoutsNavigationCategory(model, interaction.openCategoryId);
}

function readCategoryIdFromFocusKey(
  focusKey: string,
): FarmLayoutsNavigationCategoryId | null {
  if (!focusKey.startsWith("category:")) {
    return null;
  }

  const categoryId = focusKey.slice("category:".length);
  if (!isFarmLayoutsNavigationCategoryId(categoryId)) {
    throw new Error(
      `Unknown Farm Layouts navigation category ${JSON.stringify(categoryId)} in focus key ${JSON.stringify(focusKey)}.`,
    );
  }

  return categoryId;
}

function readPageIdFromFocusKey(focusKey: string): string | null {
  if (!focusKey.startsWith("page:")) {
    return null;
  }

  return focusKey.slice("page:".length);
}

function readFarmLayoutsNavigationCategoryId(
  categoryId: string,
): FarmLayoutsNavigationCategoryId {
  if (!isFarmLayoutsNavigationCategoryId(categoryId)) {
    throw new Error(
      `Unknown Farm Layouts navigation category ${JSON.stringify(categoryId)}.`,
    );
  }

  return categoryId;
}
