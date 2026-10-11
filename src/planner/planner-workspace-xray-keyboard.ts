import {
  assertPlannerWorkspaceKeyboardOptions,
  isPlannerWorkspaceKeyboardEnabled,
  isPlannerWorkspaceKeyboardTargetProtected,
  type PlannerWorkspaceKeyboardOptions,
} from "./planner-workspace-editing-keyboard";

type PlannerWorkspaceXRayTrigger = "control" | "meta" | "space";

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
  options: PlannerWorkspaceKeyboardOptions = {},
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
  assertPlannerWorkspaceKeyboardOptions(options);

  let activeXRayTrigger: PlannerWorkspaceXRayTrigger | null = null;

  function handleXRayKeyDown(keyboardEvent: KeyboardEvent): void {
    const requestedTrigger = getPlannerWorkspaceXRayTrigger(keyboardEvent.key);
    if (requestedTrigger === null) {
      return;
    }

    if (keyboardEvent.repeat) {
      if (
        activeXRayTrigger === requestedTrigger &&
        isPlannerWorkspaceKeyboardEnabled(options) &&
        !isPlannerWorkspaceKeyboardTargetProtected(keyboardEvent.target) &&
        isValidPlannerWorkspaceXRayTrigger(keyboardEvent, requestedTrigger)
      ) {
        keyboardEvent.preventDefault();
      }
      return;
    }

    if (
      activeXRayTrigger !== null ||
      !isPlannerWorkspaceKeyboardEnabled(options) ||
      isPlannerWorkspaceKeyboardTargetProtected(keyboardEvent.target) ||
      !isValidPlannerWorkspaceXRayTrigger(keyboardEvent, requestedTrigger)
    ) {
      return;
    }

    keyboardEvent.preventDefault();
    actions.onXRayActiveChange(true);
    activeXRayTrigger = requestedTrigger;
  }

  function handleXRayKeyUp(keyboardEvent: KeyboardEvent): void {
    const releasedTrigger = getPlannerWorkspaceXRayTrigger(keyboardEvent.key);
    if (releasedTrigger === null || releasedTrigger !== activeXRayTrigger) {
      return;
    }

    if (
      releasedTrigger === "space" &&
      !isPlannerWorkspaceKeyboardTargetProtected(keyboardEvent.target)
    ) {
      keyboardEvent.preventDefault();
    }
    activeXRayTrigger = null;
    actions.onXRayActiveChange(false);
  }

  function resetXRay(): void {
    if (activeXRayTrigger === null) {
      return;
    }
    activeXRayTrigger = null;
    actions.onXRayActiveChange(false);
  }

  return {
    blur: resetXRay,
    keydown: handleXRayKeyDown,
    keyup: handleXRayKeyUp,
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
    keyboardHandler.blur();
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

function getPlannerWorkspaceXRayTrigger(
  key: string,
): PlannerWorkspaceXRayTrigger | null {
  if (isSpaceKey(key)) return "space";
  if (key === "Control") return "control";
  if (key === "Meta") return "meta";
  return null;
}

function isValidPlannerWorkspaceXRayTrigger(
  keyboardEvent: KeyboardEvent,
  trigger: PlannerWorkspaceXRayTrigger,
): boolean {
  if (keyboardEvent.altKey || keyboardEvent.shiftKey) {
    return false;
  }

  if (trigger === "space") {
    return !keyboardEvent.ctrlKey && !keyboardEvent.metaKey;
  }

  if (trigger === "control") {
    return keyboardEvent.ctrlKey && !keyboardEvent.metaKey;
  }

  return keyboardEvent.metaKey && !keyboardEvent.ctrlKey;
}

function isSpaceKey(key: string): boolean {
  return key === " " || key === "Spacebar";
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
