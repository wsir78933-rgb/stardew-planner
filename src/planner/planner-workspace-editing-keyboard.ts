import type { PlacementSelectionKey } from "../editor/editor-selection-controller";

export type PlannerWorkspaceEditingKeyboardListenerPort = Readonly<{
  addEventListener: (eventName: "keydown", eventListener: EventListener) => void;
  removeEventListener: (eventName: "keydown", eventListener: EventListener) => void;
}>;

export type PlannerWorkspaceEditingKeyboardActions = Readonly<{
  getSelectedPlacementKey: () => PlacementSelectionKey | null;
  hasDismissableInteraction: () => boolean;
  hasPendingCatalogItem: () => boolean;
  hasSelection: () => boolean;
  onCopy: (selectedPlacementKey: PlacementSelectionKey) => void;
  onDelete: () => void;
  onDismiss: () => void;
  onPendingChoiceCycle: () => boolean;
  onCycleSelectedAppearance: () => void;
}>;

export function createPlannerWorkspaceEditingKeyboardHandler(
  keyboardActions: PlannerWorkspaceEditingKeyboardActions,
): (keyboardEvent: KeyboardEvent) => void {
  assertEditingKeyboardActions(keyboardActions);

  return (keyboardEvent) => {
    if (
      isEditableKeyboardTarget(keyboardEvent.target) ||
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
    if (!keyboardActions.hasSelection()) {
      if (normalizedKey === "q" && keyboardActions.hasPendingCatalogItem()) {
        keyboardEvent.preventDefault();
        keyboardActions.onPendingChoiceCycle();
      }
      return;
    }
    if (normalizedKey === "c") {
      const selectedPlacementKey = keyboardActions.getSelectedPlacementKey();
      if (selectedPlacementKey === null) {
        return;
      }
      keyboardEvent.preventDefault();
      keyboardActions.onCopy(selectedPlacementKey);
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

function isEditableKeyboardTarget(eventTarget: EventTarget | null): boolean {
  if (typeof eventTarget !== "object" || eventTarget === null) {
    return false;
  }
  const editableTarget = eventTarget as Readonly<{
    isContentEditable?: unknown;
    tagName?: unknown;
  }>;
  if (editableTarget.isContentEditable === true) {
    return true;
  }
  return (
    typeof editableTarget.tagName === "string" &&
    ["INPUT", "TEXTAREA", "SELECT"].includes(editableTarget.tagName.toUpperCase())
  );
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
    "getSelectedPlacementKey",
    "hasDismissableInteraction",
    "hasPendingCatalogItem",
    "hasSelection",
    "onCopy",
    "onDelete",
    "onDismiss",
    "onPendingChoiceCycle",
    "onCycleSelectedAppearance",
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
