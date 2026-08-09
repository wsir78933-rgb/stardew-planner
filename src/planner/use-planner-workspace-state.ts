import { useCallback, useEffect, useReducer, type Dispatch } from "react";
import { getEditorHistoryKeyboardShortcut } from "../editor/editor-history-keyboard-shortcut";
import type { PlacementHistory } from "../placement/placement-history";
import type { PlacementSnapshot } from "../placement/placement-snapshot";
import type { PlacementSelectionKey } from "../editor/editor-selection-controller";
import {
  createInitialPlannerWorkspaceState,
  reducePlannerWorkspaceState,
  type PlannerWorkspaceAction,
  type PlannerWorkspaceState,
} from "./planner-workspace-state";

export type PlannerWorkspaceKeyboardListenerPort = Readonly<{
  addEventListener: (
    eventName: "keydown",
    eventListener: EventListener,
  ) => void;
  removeEventListener: (
    eventName: "keydown",
    eventListener: EventListener,
  ) => void;
}>;

export type UsePlannerWorkspaceStateInput = Readonly<{
  initialPlannerMapId?: string;
  initialPlannerWorkspaceState?: PlannerWorkspaceState;
  keyboardListenerPort?: PlannerWorkspaceKeyboardListenerPort;
}>;

export type PlannerWorkspaceStateController = Readonly<{
  applyPlacementEditResult: (
    placementHistory: PlacementHistory<PlacementSnapshot>,
    selectedPlacementKeys: readonly PlacementSelectionKey[],
  ) => void;
  dispatchPlannerWorkspaceAction: Dispatch<PlannerWorkspaceAction>;
  plannerWorkspaceState: PlannerWorkspaceState;
  resetPlacementHistory: (placementSnapshot: PlacementSnapshot) => void;
  setSelectedPlacementKeys: (
    selectedPlacementKeys: readonly PlacementSelectionKey[],
  ) => void;
}>;

export function usePlannerWorkspaceState(
  usePlannerWorkspaceStateInput: UsePlannerWorkspaceStateInput = {},
): PlannerWorkspaceStateController {
  const [plannerWorkspaceState, dispatchPlannerWorkspaceAction] = useReducer(
    reducePlannerWorkspaceState,
    usePlannerWorkspaceStateInput,
    ({ initialPlannerMapId, initialPlannerWorkspaceState }) =>
      initialPlannerWorkspaceState ??
      createInitialPlannerWorkspaceState(
        initialPlannerMapId,
        typeof window === "undefined" ? undefined : window.innerWidth,
      ),
  );

  useEffect(() => {
    const browserKeyboardListenerPort =
      typeof window === "undefined" ? undefined : window;
    const keyboardListenerPort = resolvePlannerWorkspaceKeyboardListenerPort(
      usePlannerWorkspaceStateInput.keyboardListenerPort,
      browserKeyboardListenerPort,
    );

    if (keyboardListenerPort === undefined) {
      return;
    }

    return attachPlannerWorkspaceHistoryKeyboardListener(
      keyboardListenerPort,
      dispatchPlannerWorkspaceAction,
    );
  }, [usePlannerWorkspaceStateInput.keyboardListenerPort]);

  const applyPlacementEditResult = useCallback(
    (
      placementHistory: PlacementHistory<PlacementSnapshot>,
      selectedPlacementKeys: readonly PlacementSelectionKey[],
    ) => {
      dispatchPlannerWorkspaceAction({
        placementHistory,
        selectedPlacementKeys,
        type: "apply-placement-edit-result",
      });
    },
    [],
  );
  const resetPlacementHistory = useCallback(
    (placementSnapshot: PlacementSnapshot) => {
      dispatchPlannerWorkspaceAction({
        placementSnapshot,
        type: "reset-placement-history",
      });
    },
    [],
  );
  const setSelectedPlacementKeys = useCallback(
    (selectedPlacementKeys: readonly PlacementSelectionKey[]) => {
      dispatchPlannerWorkspaceAction({
        selectedPlacementKeys,
        type: "set-selected-placement-keys",
      });
    },
    [],
  );

  return {
    applyPlacementEditResult,
    dispatchPlannerWorkspaceAction,
    plannerWorkspaceState,
    resetPlacementHistory,
    setSelectedPlacementKeys,
  };
}

export function resolvePlannerWorkspaceKeyboardListenerPort(
  injectedKeyboardListenerPort:
    | PlannerWorkspaceKeyboardListenerPort
    | undefined,
  browserKeyboardListenerPort:
    | PlannerWorkspaceKeyboardListenerPort
    | undefined,
): PlannerWorkspaceKeyboardListenerPort | undefined {
  return injectedKeyboardListenerPort ?? browserKeyboardListenerPort;
}

export function attachPlannerWorkspaceHistoryKeyboardListener(
  keyboardListenerPort: PlannerWorkspaceKeyboardListenerPort,
  dispatchPlannerWorkspaceAction: Dispatch<PlannerWorkspaceAction>,
): () => void {
  assertKeyboardListenerPort(keyboardListenerPort);
  assertPlannerWorkspaceActionDispatch(dispatchPlannerWorkspaceAction);
  const handleKeyboardEvent = createPlannerWorkspaceHistoryKeyboardHandler(
    dispatchPlannerWorkspaceAction,
  );
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
        "Planner workspace keyboard listener registration and rollback both failed.",
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

export function createPlannerWorkspaceHistoryKeyboardHandler(
  dispatchPlannerWorkspaceAction: Dispatch<PlannerWorkspaceAction>,
): (keyboardEvent: KeyboardEvent) => void {
  assertPlannerWorkspaceActionDispatch(dispatchPlannerWorkspaceAction);

  return (keyboardEvent) => {
    if (isEditableKeyboardTarget(keyboardEvent.target)) {
      return;
    }

    const keyboardShortcut = getEditorHistoryKeyboardShortcut(keyboardEvent);

    if (keyboardShortcut === null) {
      return;
    }

    keyboardEvent.preventDefault();
    dispatchPlannerWorkspaceAction({
      type:
        keyboardShortcut === "undo"
          ? "undo-placement-history"
          : "redo-placement-history",
    });
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

  return typeof editableTarget.tagName === "string" &&
    ["INPUT", "TEXTAREA", "SELECT"].includes(
      editableTarget.tagName.toUpperCase(),
    );
}

function assertKeyboardListenerPort(
  keyboardListenerPort: PlannerWorkspaceKeyboardListenerPort,
): void {
  if (
    typeof keyboardListenerPort !== "object" ||
    keyboardListenerPort === null ||
    typeof keyboardListenerPort.addEventListener !== "function" ||
    typeof keyboardListenerPort.removeEventListener !== "function"
  ) {
    throw new TypeError(
      `Planner workspace keyboard listener port must provide addEventListener and removeEventListener functions; received ${JSON.stringify(keyboardListenerPort)}.`,
    );
  }
}

function assertPlannerWorkspaceActionDispatch(
  dispatchPlannerWorkspaceAction: Dispatch<PlannerWorkspaceAction>,
): void {
  if (typeof dispatchPlannerWorkspaceAction !== "function") {
    throw new TypeError(
      `Planner workspace action dispatch must be a function; received ${JSON.stringify(dispatchPlannerWorkspaceAction)}.`,
    );
  }
}
