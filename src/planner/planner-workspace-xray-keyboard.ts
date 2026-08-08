export type PlannerWorkspaceXRayKeyboardListenerPort = Readonly<{
  addEventListener: (
    eventName: "blur" | "keydown" | "keyup",
    eventListener: EventListener,
  ) => void;
  removeEventListener: (
    eventName: "blur" | "keydown" | "keyup",
    eventListener: EventListener,
  ) => void;
}>;

export type PlannerWorkspaceXRayKeyboardHandler = Readonly<{
  blur: () => void;
  keydown: (keyboardEvent: KeyboardEvent) => void;
  keyup: (keyboardEvent: KeyboardEvent) => void;
}>;

export function createPlannerWorkspaceXRayKeyboardHandler(
  actions: Readonly<{ onXRayActiveChange: (isXRayActive: boolean) => void }>,
): PlannerWorkspaceXRayKeyboardHandler {
  if (typeof actions !== "object" || actions === null) {
    throw new TypeError(
      `Planner workspace X-ray keyboard actions must be an object; received ${describeValue(actions)}.`,
    );
  }
  if (typeof actions.onXRayActiveChange !== "function") {
    throw new TypeError(
      `Planner workspace X-ray active-change action must be a function; received ${describeValue(actions.onXRayActiveChange)}.`,
    );
  }

  let isXRayActive = false;

  function activateXRay(keyboardEvent: KeyboardEvent): void {
    if (
      !isSpaceKeyboardEvent(keyboardEvent) ||
      isEditableKeyboardTarget(keyboardEvent.target) ||
      keyboardEvent.altKey ||
      keyboardEvent.ctrlKey ||
      keyboardEvent.metaKey ||
      keyboardEvent.shiftKey
    ) {
      return;
    }
    keyboardEvent.preventDefault();
    if (isXRayActive) {
      return;
    }
    isXRayActive = true;
    actions.onXRayActiveChange(true);
  }

  function deactivateXRay(keyboardEvent: KeyboardEvent): void {
    if (!isSpaceKeyboardEvent(keyboardEvent) || !isXRayActive) {
      return;
    }
    if (!isEditableKeyboardTarget(keyboardEvent.target)) {
      keyboardEvent.preventDefault();
    }
    isXRayActive = false;
    actions.onXRayActiveChange(false);
  }

  function resetXRay(): void {
    if (!isXRayActive) {
      return;
    }
    isXRayActive = false;
    actions.onXRayActiveChange(false);
  }

  return {
    blur: resetXRay,
    keydown: activateXRay,
    keyup: deactivateXRay,
  };
}

export function attachPlannerWorkspaceXRayKeyboardListener(
  keyboardListenerPort: PlannerWorkspaceXRayKeyboardListenerPort,
  keyboardHandler: PlannerWorkspaceXRayKeyboardHandler,
): () => void {
  assertKeyboardListenerPort(keyboardListenerPort);
  assertKeyboardHandler(keyboardHandler);
  const eventListeners = {
    blur: () => keyboardHandler.blur(),
    keydown: (event: Event) => keyboardHandler.keydown(event as KeyboardEvent),
    keyup: (event: Event) => keyboardHandler.keyup(event as KeyboardEvent),
  } as const satisfies Record<"blur" | "keydown" | "keyup", EventListener>;

  const registeredEventNames: Array<"blur" | "keydown" | "keyup"> = [];
  try {
    for (const eventName of ["keydown", "keyup", "blur"] as const) {
      registeredEventNames.push(eventName);
      keyboardListenerPort.addEventListener(eventName, eventListeners[eventName]);
    }
  } catch (registrationError) {
    const rollbackErrors = removeRegisteredEventListeners(
      keyboardListenerPort,
      eventListeners,
      registeredEventNames,
    );
    if (rollbackErrors.length > 0) {
      throw new AggregateError(
        [registrationError, ...rollbackErrors],
        "Planner workspace X-ray keyboard listener registration and rollback both failed.",
      );
    }
    throw registrationError;
  }

  let isListenerAttached = true;
  return () => {
    if (!isListenerAttached) {
      return;
    }
    for (const eventName of ["keydown", "keyup", "blur"] as const) {
      keyboardListenerPort.removeEventListener(eventName, eventListeners[eventName]);
    }
    isListenerAttached = false;
  };
}

function removeRegisteredEventListeners(
  keyboardListenerPort: PlannerWorkspaceXRayKeyboardListenerPort,
  eventListeners: Record<"blur" | "keydown" | "keyup", EventListener>,
  registeredEventNames: readonly ("blur" | "keydown" | "keyup")[],
): readonly unknown[] {
  const rollbackErrors: unknown[] = [];
  for (const eventName of [...registeredEventNames].reverse()) {
    try {
      keyboardListenerPort.removeEventListener(eventName, eventListeners[eventName]);
    } catch (rollbackError) {
      rollbackErrors.push(rollbackError);
    }
  }
  return rollbackErrors;
}

function isSpaceKeyboardEvent(keyboardEvent: KeyboardEvent): boolean {
  return keyboardEvent.key === " " || keyboardEvent.key === "Spacebar";
}

function isEditableKeyboardTarget(eventTarget: EventTarget | null): boolean {
  if (typeof eventTarget !== "object" || eventTarget === null) {
    return false;
  }
  const editableTarget = eventTarget as Readonly<{
    isContentEditable?: unknown;
    tagName?: unknown;
  }>;
  return editableTarget.isContentEditable === true ||
    (typeof editableTarget.tagName === "string" &&
      ["INPUT", "SELECT", "TEXTAREA"].includes(editableTarget.tagName.toUpperCase()));
}

function assertKeyboardListenerPort(
  keyboardListenerPort: unknown,
): asserts keyboardListenerPort is PlannerWorkspaceXRayKeyboardListenerPort {
  if (
    typeof keyboardListenerPort !== "object" ||
    keyboardListenerPort === null ||
    typeof (keyboardListenerPort as PlannerWorkspaceXRayKeyboardListenerPort).addEventListener !== "function" ||
    typeof (keyboardListenerPort as PlannerWorkspaceXRayKeyboardListenerPort).removeEventListener !== "function"
  ) {
    throw new TypeError(
      `Planner workspace X-ray keyboard listener port must provide addEventListener and removeEventListener functions; received ${describeValue(keyboardListenerPort)}.`,
    );
  }
}

function assertKeyboardHandler(
  keyboardHandler: unknown,
): asserts keyboardHandler is PlannerWorkspaceXRayKeyboardHandler {
  if (
    typeof keyboardHandler !== "object" ||
    keyboardHandler === null ||
    typeof (keyboardHandler as PlannerWorkspaceXRayKeyboardHandler).keydown !== "function" ||
    typeof (keyboardHandler as PlannerWorkspaceXRayKeyboardHandler).keyup !== "function" ||
    typeof (keyboardHandler as PlannerWorkspaceXRayKeyboardHandler).blur !== "function"
  ) {
    throw new TypeError(
      `Planner workspace X-ray keyboard handler must provide keydown, keyup, and blur functions; received ${describeValue(keyboardHandler)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  const serializedValue = JSON.stringify(value);
  return serializedValue === undefined ? String(value) : serializedValue;
}
