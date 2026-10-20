export const FARM_LAYOUTS_NAVIGATION_TRIGGER_FOCUS_KEY = "trigger";
export const FARM_LAYOUTS_NAVIGATION_CATEGORY_FOCUS_KEY = "farm-maps";
export const FARM_LAYOUTS_NAVIGATION_PAGE_FOCUS_KEY = "beach-farm";
export const FARM_LAYOUTS_NAVIGATION_BACK_FOCUS_KEY = "back";

export type FarmLayoutsNavigationPanel =
  | "closed"
  | "categories"
  | "beach-farm";

export type FarmLayoutsNavigationInteraction = Readonly<{
  focusKey: string | null;
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
}>;

export function createClosedFarmLayoutsNavigationInteraction(): FarmLayoutsNavigationInteraction {
  return {
    focusKey: null,
    panel: "closed",
    suppressPointerHover: false,
  };
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
    panel: "categories",
    suppressPointerHover: false,
  };
}

export function openFarmLayoutsNavigationFromPointerHover(
  interaction: FarmLayoutsNavigationInteraction,
): FarmLayoutsNavigationInteraction {
  if (interaction.suppressPointerHover) {
    return interaction;
  }

  if (interaction.panel === "categories") {
    return interaction;
  }

  return {
    focusKey: null,
    panel: "categories",
    suppressPointerHover: false,
  };
}

export function openFarmMapsFromPointerHover(
  interaction: FarmLayoutsNavigationInteraction,
): FarmLayoutsNavigationInteraction {
  if (interaction.suppressPointerHover) {
    return interaction;
  }

  return {
    focusKey: null,
    panel: "beach-farm",
    suppressPointerHover: false,
  };
}

export function activateFarmMapsCategory(
  interaction: FarmLayoutsNavigationInteraction,
  compact: boolean,
): FarmLayoutsNavigationInteraction {
  return {
    focusKey: compact ? FARM_LAYOUTS_NAVIGATION_BACK_FOCUS_KEY : null,
    panel: "beach-farm",
    suppressPointerHover: false,
  };
}

export function returnFarmLayoutsNavigationToCategories(): FarmLayoutsNavigationInteraction {
  return {
    focusKey: FARM_LAYOUTS_NAVIGATION_CATEGORY_FOCUS_KEY,
    panel: "categories",
    suppressPointerHover: false,
  };
}

export function closeFarmLayoutsNavigationOnEscape(): FarmLayoutsNavigationInteraction {
  return {
    focusKey: FARM_LAYOUTS_NAVIGATION_TRIGGER_FOCUS_KEY,
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
    return {
      focusKey: FARM_LAYOUTS_NAVIGATION_CATEGORY_FOCUS_KEY,
      panel: "categories",
      suppressPointerHover: false,
    };
  }

  if (input.currentFocusKey === FARM_LAYOUTS_NAVIGATION_CATEGORY_FOCUS_KEY) {
    if (input.key === "ArrowRight" || input.key === "ArrowDown") {
      return {
        focusKey: input.compact
          ? FARM_LAYOUTS_NAVIGATION_BACK_FOCUS_KEY
          : FARM_LAYOUTS_NAVIGATION_PAGE_FOCUS_KEY,
        panel: "beach-farm",
        suppressPointerHover: false,
      };
    }

    return input.interaction;
  }

  if (input.currentFocusKey === FARM_LAYOUTS_NAVIGATION_PAGE_FOCUS_KEY) {
    if (input.key === "ArrowLeft" || input.key === "ArrowUp") {
      return returnFarmLayoutsNavigationToCategories();
    }

    return input.interaction;
  }

  if (input.currentFocusKey === FARM_LAYOUTS_NAVIGATION_BACK_FOCUS_KEY) {
    if (input.key === "ArrowRight" || input.key === "ArrowDown") {
      return {
        focusKey: FARM_LAYOUTS_NAVIGATION_PAGE_FOCUS_KEY,
        panel: "beach-farm",
        suppressPointerHover: false,
      };
    }

    return input.interaction;
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
