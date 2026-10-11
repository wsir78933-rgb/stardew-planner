import type { PlacementSelectionKey } from "../editor/editor-selection-controller";
import type { EditorTool } from "../editor/editor-view-state";

export type PlannerWorkspaceKeyboardOptions = Readonly<{
  isEnabled?: () => boolean;
}>;

export type PlannerWorkspaceKeyboardTool = Extract<
  EditorTool,
  "cursor" | "multi-select" | "fill" | "erase"
>;

export type PlannerWorkspaceEditingKeyboardListenerPort = Readonly<{
  addEventListener: (eventName: "keydown", eventListener: EventListener) => void;
  removeEventListener: (eventName: "keydown", eventListener: EventListener) => void;
}>;

export type PlannerWorkspaceEditingKeyboardActions = Readonly<{
  getSelectedPlacementKeys: () => readonly PlacementSelectionKey[];
  hasDismissableInteraction: () => boolean;
  hasPendingCatalogItem: () => boolean;
  hasSelection: () => boolean;
  onCopy: (selectedPlacementKeys: readonly PlacementSelectionKey[]) => void;
  onDelete: () => void;
  onDismiss: () => void;
  onPendingChoiceCycle: () => boolean;
  onCycleSelectedAppearance: () => void;
  onToolChange: (tool: PlannerWorkspaceKeyboardTool) => void;
}>;

export function createPlannerWorkspaceEditingKeyboardHandler(
  keyboardActions: PlannerWorkspaceEditingKeyboardActions,
  options: PlannerWorkspaceKeyboardOptions = {},
): (keyboardEvent: KeyboardEvent) => void {
  assertEditingKeyboardActions(keyboardActions);
  assertPlannerWorkspaceKeyboardOptions(options);

  return (keyboardEvent) => {
    if (
      !isPlannerWorkspaceKeyboardEnabled(options) ||
      isPlannerWorkspaceKeyboardTargetProtected(keyboardEvent.target) ||
      keyboardEvent.altKey ||
      keyboardEvent.ctrlKey ||
      keyboardEvent.metaKey
    ) {
      return;
    }

    if (keyboardEvent.key === "Escape") {
      if (!keyboardActions.hasDismissableInteraction()) {
        return;
      }
      keyboardEvent.preventDefault();
      keyboardActions.onDismiss();
      return;
    }
    const normalizedKey = keyboardEvent.key.toLowerCase();
    const requestedTool = getPlannerWorkspaceKeyboardTool(normalizedKey);
    if (requestedTool !== null) {
      keyboardEvent.preventDefault();
      keyboardActions.onToolChange(requestedTool);
      return;
    }
    if (!keyboardActions.hasSelection()) {
      if (normalizedKey === "q" && keyboardActions.hasPendingCatalogItem()) {
        keyboardEvent.preventDefault();
        keyboardActions.onPendingChoiceCycle();
      }
      return;
    }
    if (normalizedKey === "c") {
      const selectedPlacementKeys = keyboardActions.getSelectedPlacementKeys();
      if (!Array.isArray(selectedPlacementKeys)) {
        throw new TypeError(
          `Planner workspace selected placement keys callback must return an array; received ${describeValue(selectedPlacementKeys)}.`,
        );
      }
      if (selectedPlacementKeys.length === 0) {
        return;
      }
      keyboardEvent.preventDefault();
      keyboardActions.onCopy(selectedPlacementKeys);
      return;
    }
    if (normalizedKey === "q") {
      keyboardEvent.preventDefault();
      keyboardActions.onCycleSelectedAppearance();
      return;
    }
    if (keyboardEvent.key === "Delete" || keyboardEvent.key === "Backspace") {
      keyboardEvent.preventDefault();
      keyboardActions.onDelete();
      return;
    }
  };
}

export function isPlannerWorkspaceKeyboardTargetProtected(
  eventTarget: EventTarget | null,
): boolean {
  if (typeof eventTarget !== "object" || eventTarget === null) {
    return false;
  }

  const keyboardTarget = eventTarget as Readonly<{
    closest?: (selector: string) => unknown;
    isContentEditable?: unknown;
    tagName?: unknown;
  }>;

  if (
    keyboardTarget.isContentEditable === true ||
    (typeof keyboardTarget.tagName === "string" &&
      ["INPUT", "SELECT", "TEXTAREA"].includes(keyboardTarget.tagName.toUpperCase()))
  ) {
    return true;
  }

  if (typeof keyboardTarget.closest !== "function") {
    return false;
  }

  const dialogTarget = keyboardTarget.closest(
    '[role="dialog"], [role="alertdialog"], [aria-modal="true"]',
  );
  return dialogTarget !== null && dialogTarget !== undefined;
}

export function isPlannerWorkspaceKeyboardEnabled(
  options: PlannerWorkspaceKeyboardOptions,
): boolean {
  if (typeof options !== "object" || options === null) {
    throw new TypeError(
      `Planner workspace keyboard options must be an object; received ${describeValue(options)}.`,
    );
  }

  const isEnabledCallback = options.isEnabled;
  if (isEnabledCallback === undefined) {
    return true;
  }
  if (typeof isEnabledCallback !== "function") {
    throw new TypeError(
      `Planner workspace keyboard isEnabled must be a function; received ${describeValue(isEnabledCallback)}.`,
    );
  }

  const isEnabled = isEnabledCallback();
  if (typeof isEnabled !== "boolean") {
    throw new TypeError(
      `Planner workspace keyboard isEnabled callback must return a boolean; received ${describeValue(isEnabled)}.`,
    );
  }

  return isEnabled;
}

function getPlannerWorkspaceKeyboardTool(
  normalizedKey: string,
): PlannerWorkspaceKeyboardTool | null {
  if (normalizedKey === "v") return "cursor";
  if (normalizedKey === "m") return "multi-select";
  if (normalizedKey === "f") return "fill";
  if (normalizedKey === "e") return "erase";
  return null;
}

export function assertPlannerWorkspaceKeyboardOptions(
  options: unknown,
): asserts options is PlannerWorkspaceKeyboardOptions {
  if (typeof options !== "object" || options === null) {
    throw new TypeError(
      `Planner workspace keyboard options must be an object; received ${describeValue(options)}.`,
    );
  }
  const isEnabled = (options as PlannerWorkspaceKeyboardOptions).isEnabled;
  if (isEnabled !== undefined && typeof isEnabled !== "function") {
    throw new TypeError(
      `Planner workspace keyboard isEnabled must be a function; received ${describeValue(isEnabled)}.`,
    );
  }
}

export function attachPlannerWorkspaceEditingKeyboardListener(
  keyboardListenerPort: PlannerWorkspaceEditingKeyboardListenerPort,
  handleKeyboardEvent: (keyboardEvent: KeyboardEvent) => void,
): () => void {
  assertKeyboardListenerPort(keyboardListenerPort);
  if (typeof handleKeyboardEvent !== "function") {
    throw new TypeError(
      `Planner workspace editing keyboard handler must be a function; received ${describeValue(handleKeyboardEvent)}.`,
    );
  }
  const eventListener: EventListener = (event) => {
    handleKeyboardEvent(event as KeyboardEvent);
  };

  try {
    keyboardListenerPort.addEventListener("keydown", eventListener);
  } catch (registrationError) {
    try {
      keyboardListenerPort.removeEventListener("keydown", eventListener);
    } catch (rollbackError) {
      throw new AggregateError(
        [registrationError, rollbackError],
        "Planner workspace editing keyboard listener registration and rollback both failed.",
      );
    }
    throw registrationError;
  }

  let isKeyboardListenerAttached = true;
  return () => {
    if (!isKeyboardListenerAttached) {
      return;
    }
    keyboardListenerPort.removeEventListener("keydown", eventListener);
    isKeyboardListenerAttached = false;
  };
}

function assertEditingKeyboardActions(
  keyboardActions: PlannerWorkspaceEditingKeyboardActions,
): void {
  if (typeof keyboardActions !== "object" || keyboardActions === null) {
    throw new TypeError(
      `Planner workspace editing keyboard actions must be an object; received ${describeValue(keyboardActions)}.`,
    );
  }
  for (const actionName of [
    "getSelectedPlacementKeys",
    "hasDismissableInteraction",
    "hasPendingCatalogItem",
    "hasSelection",
    "onCopy",
    "onDelete",
    "onDismiss",
    "onPendingChoiceCycle",
    "onCycleSelectedAppearance",
    "onToolChange",
  ] as const) {
    if (typeof keyboardActions[actionName] !== "function") {
      throw new TypeError(
        `Planner workspace editing keyboard action ${JSON.stringify(actionName)} ` +
          `must be a function; received ${describeValue(keyboardActions[actionName])}.`,
      );
    }
  }
}

function assertKeyboardListenerPort(
  keyboardListenerPort: PlannerWorkspaceEditingKeyboardListenerPort,
): void {
  if (
    typeof keyboardListenerPort !== "object" ||
    keyboardListenerPort === null ||
    typeof keyboardListenerPort.addEventListener !== "function" ||
    typeof keyboardListenerPort.removeEventListener !== "function"
  ) {
    throw new TypeError(
      "Planner workspace editing keyboard listener port must provide " +
        "addEventListener and removeEventListener functions; received " +
        `${describeValue(keyboardListenerPort)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  const serializedValue = JSON.stringify(value);
  return serializedValue === undefined ? String(value) : serializedValue;
}
