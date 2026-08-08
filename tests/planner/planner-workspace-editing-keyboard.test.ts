import { describe, expect, it } from "vitest";
import {
  attachPlannerWorkspaceEditingKeyboardListener,
  createPlannerWorkspaceEditingKeyboardHandler,
} from "../../src/planner/planner-workspace-editing-keyboard";

function createKeyboardEvent(
  key: string,
  options: Readonly<{
    ctrlKey?: boolean;
    metaKey?: boolean;
    target?: EventTarget | Readonly<{ isContentEditable?: boolean; tagName?: string }>;
  }> = {},
): KeyboardEvent {
  let wasDefaultPrevented = false;
  return {
    altKey: false,
    ctrlKey: options.ctrlKey ?? false,
    get defaultPrevented() {
      return wasDefaultPrevented;
    },
    key,
    metaKey: options.metaKey ?? false,
    preventDefault: () => {
      wasDefaultPrevented = true;
    },
    shiftKey: false,
    target: options.target ?? new EventTarget(),
  } as KeyboardEvent;
}

function createEditingKeyboardHandler(
  selectedPlacementKeys: readonly string[],
  receivedCommands: string[],
  hasDismissableInteraction = selectedPlacementKeys.length > 0,
  pendingChoiceChanged = false,
  hasPendingCatalogItem = false,
) {
  return createPlannerWorkspaceEditingKeyboardHandler({
    getSelectedPlacementKey: () =>
      selectedPlacementKeys.length === 1 ? selectedPlacementKeys[0] ?? null : null,
    hasSelection: () => selectedPlacementKeys.length > 0,
    hasPendingCatalogItem: () => hasPendingCatalogItem,
    hasDismissableInteraction: () => hasDismissableInteraction,
    onCopy: (selectedPlacementKey) =>
      receivedCommands.push(`copy:${selectedPlacementKey}`),
    onDelete: () => receivedCommands.push("delete"),
    onDismiss: () => receivedCommands.push("dismiss"),
    onPendingChoiceCycle: () => {
      receivedCommands.push("cycle-pending");
      return pendingChoiceChanged;
    },
    onCycleSelectedAppearance: () =>
      receivedCommands.push("cycle-selected-appearance"),
  });
}

describe("planner workspace editing keyboard", () => {
  it("lets Escape exit a catalog placement mode without a placement selection", () => {
    const receivedCommands: string[] = [];
    const handleKeyboardEvent = createEditingKeyboardHandler(
      [],
      receivedCommands,
      true,
    );
    const escapeKeyboardEvent = createKeyboardEvent("Escape");

    handleKeyboardEvent(escapeKeyboardEvent);

    expect(receivedCommands).toEqual(["dismiss"]);
    expect(escapeKeyboardEvent.defaultPrevented).toBe(true);
  });

  it("handles Q, C, Delete, and Escape for the current selection", () => {
    const receivedCommands: string[] = [];
    const handleKeyboardEvent = createEditingKeyboardHandler(
      ["item:7"],
      receivedCommands,
    );

    const keyboardEvents = [
      createKeyboardEvent("q"),
      createKeyboardEvent("C"),
      createKeyboardEvent("Delete"),
      createKeyboardEvent("Escape"),
    ];
    for (const keyboardEvent of keyboardEvents) {
      handleKeyboardEvent(keyboardEvent);
    }

    expect(receivedCommands).toEqual([
      "cycle-selected-appearance",
      "copy:item:7",
      "delete",
      "dismiss",
    ]);
    expect(keyboardEvents.every((keyboardEvent) => keyboardEvent.defaultPrevented)).toBe(
      true,
    );
  });

  it("ignores missing selections, editable targets, and modified history shortcuts", () => {
    const receivedCommands: string[] = [];
    const noSelectionHandler = createEditingKeyboardHandler([], receivedCommands);
    const editableSelectionHandler = createEditingKeyboardHandler(
      ["item:7"],
      receivedCommands,
    );
    const ignoredKeyboardEvents = [
      createKeyboardEvent("Delete"),
      createKeyboardEvent("q", { target: { tagName: "INPUT" } }),
      createKeyboardEvent("c", { target: { isContentEditable: true, tagName: "DIV" } }),
      createKeyboardEvent("z", { ctrlKey: true }),
      createKeyboardEvent("z", { metaKey: true }),
    ];

    noSelectionHandler(ignoredKeyboardEvents[0]!);
    for (const keyboardEvent of ignoredKeyboardEvents.slice(1)) {
      editableSelectionHandler(keyboardEvent);
    }

    expect(receivedCommands).toEqual([]);
    expect(ignoredKeyboardEvents.some((keyboardEvent) => keyboardEvent.defaultPrevented)).toBe(
      false,
    );
  });

  it("cycles a pending catalog choice only when it changes and preserves placed-selection priority", () => {
    const receivedPendingCommands: string[] = [];
    const pendingHandler = createEditingKeyboardHandler(
      [],
      receivedPendingCommands,
      true,
      true,
      true,
    );
    const pendingKeyboardEvent = createKeyboardEvent("q");
    pendingHandler(pendingKeyboardEvent);
    expect(receivedPendingCommands).toEqual(["cycle-pending"]);
    expect(pendingKeyboardEvent.defaultPrevented).toBe(true);

    const receivedNoOpCommands: string[] = [];
    const noOpHandler = createEditingKeyboardHandler(
      [],
      receivedNoOpCommands,
      true,
      false,
      true,
    );
    const noOpKeyboardEvent = createKeyboardEvent("q");
    noOpHandler(noOpKeyboardEvent);
    expect(receivedNoOpCommands).toEqual(["cycle-pending"]);
    expect(noOpKeyboardEvent.defaultPrevented).toBe(true);

    const receivedNoPendingCommands: string[] = [];
    const noPendingHandler = createEditingKeyboardHandler(
      [],
      receivedNoPendingCommands,
      false,
      true,
      false,
    );
    const noPendingKeyboardEvent = createKeyboardEvent("q");
    noPendingHandler(noPendingKeyboardEvent);
    expect(receivedNoPendingCommands).toEqual([]);
    expect(noPendingKeyboardEvent.defaultPrevented).toBe(false);

    const receivedSelectionCommands: string[] = [];
    const selectedPlacementHandler = createEditingKeyboardHandler(
      ["item:7"],
      receivedSelectionCommands,
      true,
      true,
      true,
    );
    const selectedPlacementKeyboardEvent = createKeyboardEvent("q");
    selectedPlacementHandler(selectedPlacementKeyboardEvent);
    expect(receivedSelectionCommands).toEqual(["cycle-selected-appearance"]);
    expect(selectedPlacementKeyboardEvent.defaultPrevented).toBe(true);
  });

  it("keeps C and Delete limited to placed selections", () => {
    const receivedCommands: string[] = [];
    const pendingHandler = createEditingKeyboardHandler(
      [],
      receivedCommands,
      true,
      true,
      true,
    );
    const copyKeyboardEvent = createKeyboardEvent("c");
    const deleteKeyboardEvent = createKeyboardEvent("Delete");

    pendingHandler(copyKeyboardEvent);
    pendingHandler(deleteKeyboardEvent);

    expect(receivedCommands).toEqual([]);
    expect(copyKeyboardEvent.defaultPrevented).toBe(false);
    expect(deleteKeyboardEvent.defaultPrevented).toBe(false);
  });

  it("detaches its listener exactly once", () => {
    const registeredListeners = new Set<EventListener>();
    let removeCallCount = 0;
    const keyboardListenerPort = {
      addEventListener: (_eventName: "keydown", eventListener: EventListener) => {
        registeredListeners.add(eventListener);
      },
      removeEventListener: (_eventName: "keydown", eventListener: EventListener) => {
        removeCallCount += 1;
        registeredListeners.delete(eventListener);
      },
    };
    const detachKeyboardListener = attachPlannerWorkspaceEditingKeyboardListener(
      keyboardListenerPort,
      createEditingKeyboardHandler(["item:7"], []),
    );

    detachKeyboardListener();
    detachKeyboardListener();

    expect(removeCallCount).toBe(1);
    expect(registeredListeners.size).toBe(0);
  });
});
