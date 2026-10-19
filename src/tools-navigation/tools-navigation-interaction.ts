export const TOOLS_NAVIGATION_ALL_TOOLS_FOCUS_KEY = "all-tools";
export const TOOLS_NAVIGATION_BACK_FOCUS_KEY = "back";
export const TOOLS_NAVIGATION_TRIGGER_FOCUS_KEY = "trigger";

export type ToolsNavigationMenuKey =
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUp"
  | "Escape";

export type ToolsNavigationInteraction = Readonly<{
  focusKey: string | null;
  isCategoryPanelOpen: boolean;
  openCategoryId: string | null;
  showsMobileToolList: boolean;
  suppressHover: boolean;
}>;

type ToolsNavigationFocusMove = Readonly<{
  canHoverFinePointer: boolean;
  categoryIds: readonly string[];
  currentFocusKey: string;
  interaction: ToolsNavigationInteraction;
  key: string;
  toolIds: readonly string[];
}>;

export function readToolsNavigationCategoryFocusKey(categoryId: string): string {
  return `category:${categoryId}`;
}

export function readToolsNavigationToolFocusKey(toolId: string): string {
  return `tool:${toolId}`;
}

export function readToolsNavigationCategoryIdFromFocusKey(
  focusKey: string,
): string | null {
  const prefix = "category:";
  if (!focusKey.startsWith(prefix)) {
    return null;
  }

  const categoryId = focusKey.slice(prefix.length);
  if (categoryId.length === 0) {
    throw new Error(
      `Unknown tools navigation category ${JSON.stringify(focusKey)}.`,
    );
  }

  return categoryId;
}

export function readToolsNavigationToolIdFromFocusKey(
  focusKey: string,
): string | null {
  const prefix = "tool:";
  if (!focusKey.startsWith(prefix)) {
    return null;
  }

  const toolId = focusKey.slice(prefix.length);
  if (toolId.length === 0) {
    throw new Error(`Unknown tools navigation tool ${JSON.stringify(focusKey)}.`);
  }

  return toolId;
}

export function readFineHoverPointer(
  matchMedia: ((query: string) => { matches: boolean }) | undefined,
): boolean {
  if (typeof matchMedia !== "function") {
    return false;
  }

  return matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function isToolsNavigationMenuKey(
  key: string,
): key is ToolsNavigationMenuKey {
  return (
    key === "ArrowDown" ||
    key === "ArrowLeft" ||
    key === "ArrowRight" ||
    key === "ArrowUp" ||
    key === "Escape"
  );
}

export function createClosedToolsNavigationInteraction(): ToolsNavigationInteraction {
  return {
    focusKey: null,
    isCategoryPanelOpen: false,
    openCategoryId: null,
    showsMobileToolList: false,
    suppressHover: false,
  };
}

export function openToolsNavigationFromPointerHover(
  interaction: ToolsNavigationInteraction,
): ToolsNavigationInteraction {
  if (interaction.suppressHover) {
    return interaction;
  }

  if (
    interaction.isCategoryPanelOpen &&
    !interaction.showsMobileToolList &&
    interaction.focusKey === null
  ) {
    return interaction;
  }

  return {
    focusKey: null,
    isCategoryPanelOpen: true,
    openCategoryId: interaction.showsMobileToolList
      ? null
      : interaction.openCategoryId,
    showsMobileToolList: false,
    suppressHover: false,
  };
}

export function closeToolsNavigationOnPointerLeave(): ToolsNavigationInteraction {
  return createClosedToolsNavigationInteraction();
}

export function closeToolsNavigationOnEscape(): ToolsNavigationInteraction {
  return {
    focusKey: TOOLS_NAVIGATION_TRIGGER_FOCUS_KEY,
    isCategoryPanelOpen: false,
    openCategoryId: null,
    showsMobileToolList: false,
    suppressHover: true,
  };
}

export function hoverToolsNavigationCategory(
  interaction: ToolsNavigationInteraction,
  categoryId: string,
): ToolsNavigationInteraction {
  if (
    interaction.isCategoryPanelOpen &&
    interaction.openCategoryId === categoryId &&
    !interaction.showsMobileToolList &&
    interaction.focusKey === null &&
    !interaction.suppressHover
  ) {
    return interaction;
  }

  return {
    focusKey: null,
    isCategoryPanelOpen: true,
    openCategoryId: categoryId,
    showsMobileToolList: false,
    suppressHover: false,
  };
}

export function hoverToolsNavigationAllTools(
  interaction: ToolsNavigationInteraction,
): ToolsNavigationInteraction {
  if (
    interaction.isCategoryPanelOpen &&
    interaction.openCategoryId === null &&
    !interaction.showsMobileToolList &&
    interaction.focusKey === null &&
    !interaction.suppressHover
  ) {
    return interaction;
  }

  return {
    focusKey: null,
    isCategoryPanelOpen: true,
    openCategoryId: null,
    showsMobileToolList: false,
    suppressHover: false,
  };
}

export function activateToolsNavigationTrigger(
  interaction: ToolsNavigationInteraction,
): ToolsNavigationInteraction {
  if (interaction.isCategoryPanelOpen || interaction.showsMobileToolList) {
    return createClosedToolsNavigationInteraction();
  }

  return {
    focusKey: null,
    isCategoryPanelOpen: true,
    openCategoryId: null,
    showsMobileToolList: false,
    suppressHover: false,
  };
}

export function activateToolsNavigationCategory(
  interaction: ToolsNavigationInteraction,
  categoryId: string,
  canHoverFinePointer: boolean,
): ToolsNavigationInteraction {
  if (canHoverFinePointer) {
    return hoverToolsNavigationCategory(interaction, categoryId);
  }

  return {
    focusKey: null,
    isCategoryPanelOpen: true,
    openCategoryId: categoryId,
    showsMobileToolList: true,
    suppressHover: false,
  };
}

export function returnToToolsNavigationCategories(
  categoryId: string,
): ToolsNavigationInteraction {
  return {
    focusKey: readToolsNavigationCategoryFocusKey(categoryId),
    isCategoryPanelOpen: true,
    openCategoryId: null,
    showsMobileToolList: false,
    suppressHover: false,
  };
}

export function moveToolsNavigationFocus(
  input: ToolsNavigationFocusMove,
): ToolsNavigationInteraction {
  if (input.key === "Escape") {
    return closeToolsNavigationOnEscape();
  }

  if (input.key === "ArrowDown" || input.key === "ArrowUp") {
    return moveToolsNavigationVerticalFocus(input, input.key);
  }

  if (input.key === "ArrowRight") {
    return moveToolsNavigationToToolList(input);
  }

  if (input.key === "ArrowLeft") {
    return moveToolsNavigationToCategoryList(input);
  }

  return input.interaction;
}

function moveToolsNavigationVerticalFocus(
  input: ToolsNavigationFocusMove,
  key: "ArrowDown" | "ArrowUp",
): ToolsNavigationInteraction {
  const toolId = readToolsNavigationToolIdFromFocusKey(input.currentFocusKey);
  const isToolListFocus =
    input.interaction.showsMobileToolList ||
    toolId !== null ||
    input.currentFocusKey === TOOLS_NAVIGATION_BACK_FOCUS_KEY;

  if (isToolListFocus) {
    return focusToolsNavigationToolList(
      input,
      readSteppedToolsNavigationFocusKey(
        readToolsNavigationToolFocusKeys(
          input.toolIds,
          input.interaction.showsMobileToolList,
        ),
        input.currentFocusKey,
        key,
      ),
    );
  }

  return focusToolsNavigationCategoryList(
    input,
    readSteppedToolsNavigationFocusKey(
      readToolsNavigationCategoryFocusKeys(input.categoryIds),
      input.currentFocusKey,
      key,
    ),
  );
}

function moveToolsNavigationToToolList(
  input: ToolsNavigationFocusMove,
): ToolsNavigationInteraction {
  const categoryId = readToolsNavigationCategoryIdFromFocusKey(
    input.currentFocusKey,
  );
  if (categoryId === null) {
    return input.interaction;
  }

  if (!input.categoryIds.includes(categoryId)) {
    throw new Error(
      `Unknown tools navigation category ${JSON.stringify(categoryId)}.`,
    );
  }

  const firstToolId = input.toolIds[0];
  if (firstToolId === undefined || !input.toolIds.includes(firstToolId)) {
    throw new Error(
      `Unknown tools navigation category ${JSON.stringify(categoryId)}.`,
    );
  }

  return {
    focusKey: readToolsNavigationToolFocusKey(firstToolId),
    isCategoryPanelOpen: true,
    openCategoryId: categoryId,
    showsMobileToolList: !input.canHoverFinePointer,
    suppressHover: false,
  };
}

function moveToolsNavigationToCategoryList(
  input: ToolsNavigationFocusMove,
): ToolsNavigationInteraction {
  const toolId = readToolsNavigationToolIdFromFocusKey(input.currentFocusKey);
  const isBackFocus = input.currentFocusKey === TOOLS_NAVIGATION_BACK_FOCUS_KEY;
  if (toolId === null && !isBackFocus) {
    return input.interaction;
  }

  if (toolId !== null && !input.toolIds.includes(toolId)) {
    throw new Error(`Unknown tools navigation tool ${JSON.stringify(toolId)}.`);
  }

  const categoryId = input.interaction.openCategoryId;
  if (categoryId === null || !input.categoryIds.includes(categoryId)) {
    throw new Error(
      `Unknown tools navigation category ${JSON.stringify(categoryId)}.`,
    );
  }

  return {
    focusKey: readToolsNavigationCategoryFocusKey(categoryId),
    isCategoryPanelOpen: true,
    openCategoryId: input.canHoverFinePointer ? categoryId : null,
    showsMobileToolList: false,
    suppressHover: false,
  };
}

function focusToolsNavigationCategoryList(
  input: ToolsNavigationFocusMove,
  focusKey: string,
): ToolsNavigationInteraction {
  if (focusKey === TOOLS_NAVIGATION_ALL_TOOLS_FOCUS_KEY) {
    return {
      focusKey,
      isCategoryPanelOpen: true,
      openCategoryId: null,
      showsMobileToolList: false,
      suppressHover: false,
    };
  }

  const categoryId = readToolsNavigationCategoryIdFromFocusKey(focusKey);
  if (categoryId === null || !input.categoryIds.includes(categoryId)) {
    throw new Error(
      `Unknown tools navigation category ${JSON.stringify(categoryId)}.`,
    );
  }

  return {
    focusKey,
    isCategoryPanelOpen: true,
    openCategoryId: input.canHoverFinePointer ? categoryId : null,
    showsMobileToolList: false,
    suppressHover: false,
  };
}

function focusToolsNavigationToolList(
  input: ToolsNavigationFocusMove,
  focusKey: string,
): ToolsNavigationInteraction {
  const categoryId = input.interaction.openCategoryId;
  if (categoryId === null || !input.categoryIds.includes(categoryId)) {
    throw new Error(
      `Unknown tools navigation category ${JSON.stringify(categoryId)}.`,
    );
  }

  if (focusKey !== TOOLS_NAVIGATION_BACK_FOCUS_KEY) {
    const toolId = readToolsNavigationToolIdFromFocusKey(focusKey);
    if (toolId === null || !input.toolIds.includes(toolId)) {
      throw new Error(`Unknown tools navigation tool ${JSON.stringify(toolId)}.`);
    }
  }

  return {
    focusKey,
    isCategoryPanelOpen: true,
    openCategoryId: categoryId,
    showsMobileToolList: input.interaction.showsMobileToolList,
    suppressHover: false,
  };
}

function readToolsNavigationCategoryFocusKeys(
  categoryIds: readonly string[],
): readonly string[] {
  if (categoryIds.length === 0) {
    throw new Error(
      `Unknown tools navigation category ${JSON.stringify(categoryIds)}.`,
    );
  }

  return [
    ...categoryIds.map((categoryId) =>
      readToolsNavigationCategoryFocusKey(categoryId),
    ),
    TOOLS_NAVIGATION_ALL_TOOLS_FOCUS_KEY,
  ];
}

function readToolsNavigationToolFocusKeys(
  toolIds: readonly string[],
  includeBack: boolean,
): readonly string[] {
  if (toolIds.length === 0) {
    throw new Error(`Unknown tools navigation tool ${JSON.stringify(toolIds)}.`);
  }

  const toolFocusKeys = toolIds.map((toolId) =>
    readToolsNavigationToolFocusKey(toolId),
  );

  if (!includeBack) {
    return toolFocusKeys;
  }

  return [TOOLS_NAVIGATION_BACK_FOCUS_KEY, ...toolFocusKeys];
}

function readSteppedToolsNavigationFocusKey(
  focusKeys: readonly string[],
  currentFocusKey: string,
  key: "ArrowDown" | "ArrowUp",
): string {
  if (currentFocusKey === TOOLS_NAVIGATION_TRIGGER_FOCUS_KEY) {
    const edgeIndex = key === "ArrowUp" ? focusKeys.length - 1 : 0;
    return readToolsNavigationFocusKeyAt(focusKeys, edgeIndex);
  }

  return readNextToolsNavigationFocusKey(focusKeys, currentFocusKey, key);
}

function readNextToolsNavigationFocusKey(
  focusKeys: readonly string[],
  currentFocusKey: string,
  key: "ArrowDown" | "ArrowUp",
): string {
  if (focusKeys.length === 0) {
    throw new Error(
      `Unknown tools navigation focus key ${JSON.stringify(currentFocusKey)}.`,
    );
  }

  const currentIndex = focusKeys.indexOf(currentFocusKey);
  if (currentIndex === -1) {
    throw new Error(
      `Unknown tools navigation focus key ${JSON.stringify(currentFocusKey)}.`,
    );
  }

  const offset = key === "ArrowDown" ? 1 : -1;
  const nextIndex = (currentIndex + offset + focusKeys.length) % focusKeys.length;
  return readToolsNavigationFocusKeyAt(focusKeys, nextIndex);
}

function readToolsNavigationFocusKeyAt(
  focusKeys: readonly string[],
  index: number,
): string {
  const focusKey = focusKeys[index];
  if (focusKey === undefined) {
    throw new Error(
      `Unknown tools navigation focus key ${JSON.stringify(index)}.`,
    );
  }

  return focusKey;
}
