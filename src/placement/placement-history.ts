export type PlacementHistory<PlacementState> = Readonly<{
  currentState: PlacementState;
  undoStates: readonly PlacementState[];
  redoStates: readonly PlacementState[];
}>;

const maximumPlacementHistorySnapshots = 50;

export function createPlacementHistory<PlacementState>(
  initialState: PlacementState,
): PlacementHistory<PlacementState> {
  assertPlacementState(initialState, "initial state");

  return {
    currentState: initialState,
    undoStates: [],
    redoStates: [],
  };
}

export function clonePlacementHistory<PlacementState>(
  placementHistory: PlacementHistory<PlacementState>,
  clonePlacementState: (placementState: PlacementState) => PlacementState,
): PlacementHistory<PlacementState> {
  assertPlacementHistory(placementHistory);

  if (typeof clonePlacementState !== "function") {
    throw new TypeError(
      `Placement history clonePlacementState must be a function; received ${describeValue(clonePlacementState)}.`,
    );
  }

  return {
    currentState: clonePlacementState(placementHistory.currentState),
    undoStates: placementHistory.undoStates.map(clonePlacementState),
    redoStates: placementHistory.redoStates.map(clonePlacementState),
  };
}

export function clearPlacementHistoryRedo<PlacementState>(
  placementHistory: PlacementHistory<PlacementState>,
): PlacementHistory<PlacementState> {
  assertPlacementHistory(placementHistory);

  if (placementHistory.redoStates.length === 0) {
    return placementHistory;
  }

  return {
    currentState: placementHistory.currentState,
    undoStates: placementHistory.undoStates,
    redoStates: [],
  };
}

export function commitPlacementHistory<PlacementState>(
  placementHistory: PlacementHistory<PlacementState>,
  nextState: PlacementState,
): PlacementHistory<PlacementState> {
  assertPlacementHistory(placementHistory);
  assertPlacementState(nextState, "next state");

  return {
    currentState: nextState,
    undoStates: retainLatestPlacementStates([
      ...placementHistory.undoStates,
      placementHistory.currentState,
    ]),
    redoStates: [],
  };
}

export function undoPlacementHistory<PlacementState>(
  placementHistory: PlacementHistory<PlacementState>,
): PlacementHistory<PlacementState> {
  assertPlacementHistory(placementHistory);

  if (placementHistory.undoStates.length === 0) {
    return placementHistory;
  }

  const previousState = placementHistory.undoStates.at(-1);

  if (previousState === undefined) {
    throw new Error("Placement history has an empty undo state at its final index.");
  }

  return {
    currentState: previousState,
    undoStates: placementHistory.undoStates.slice(0, -1),
    redoStates: [placementHistory.currentState, ...placementHistory.redoStates],
  };
}

export function redoPlacementHistory<PlacementState>(
  placementHistory: PlacementHistory<PlacementState>,
): PlacementHistory<PlacementState> {
  assertPlacementHistory(placementHistory);

  const nextState = placementHistory.redoStates[0];

  if (nextState === undefined) {
    return placementHistory;
  }

  return {
    currentState: nextState,
    undoStates: retainLatestPlacementStates([
      ...placementHistory.undoStates,
      placementHistory.currentState,
    ]),
    redoStates: placementHistory.redoStates.slice(1),
  };
}

function assertPlacementHistory<PlacementState>(
  placementHistory: PlacementHistory<PlacementState>,
): void {
  if (typeof placementHistory !== "object" || placementHistory === null) {
    throw new TypeError(
      `Placement history must be a non-null object; received ${describeValue(placementHistory)}.`,
    );
  }

  if (!Array.isArray(placementHistory.undoStates)) {
    throw new TypeError(
      `Placement history undoStates must be an array; received ${describeValue(placementHistory.undoStates)}.`,
    );
  }

  if (!Array.isArray(placementHistory.redoStates)) {
    throw new TypeError(
      `Placement history redoStates must be an array; received ${describeValue(placementHistory.redoStates)}.`,
    );
  }

  assertPlacementState(placementHistory.currentState, "current state");
  placementHistory.undoStates.forEach((undoState, index) => {
    assertPlacementState(undoState, `undo state at index ${String(index)}`);
  });
  placementHistory.redoStates.forEach((redoState, index) => {
    assertPlacementState(redoState, `redo state at index ${String(index)}`);
  });
}

function assertPlacementState(
  placementState: unknown,
  stateLabel: string,
): void {
  if (placementState === undefined) {
    throw new TypeError(
      `Placement history ${stateLabel} must not be undefined; received undefined.`,
    );
  }
}

function retainLatestPlacementStates<PlacementState>(
  placementStates: readonly PlacementState[],
): readonly PlacementState[] {
  return placementStates.slice(-maximumPlacementHistorySnapshots);
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  return String(value);
}
