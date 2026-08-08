import { describe, expect, it } from "vitest";
import {
  attachPlannerWorkspaceXRayKeyboardListener,
  createPlannerWorkspaceXRayKeyboardHandler,
} from "../../src/planner/planner-workspace-xray-keyboard";

function createKeyboardEvent(
  key: string,
  options: Readonly<{
    altKey?: boolean;
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    target?: EventTarget | Readonly<{ isContentEditable?: boolean; tagName?: string }>;
  }> = {},
): KeyboardEvent {
  let wasDefaultPrevented = false;
  return {
    altKey: options.altKey ?? false,
    ctrlKey: options.ctrlKey ?? false,
    get defaultPrevented() {
      return wasDefaultPrevented;
    },
    key,
    metaKey: options.metaKey ?? false,
    preventDefault: () => {
      wasDefaultPrevented = true;
    },
    shiftKey: options.shiftKey ?? false,
    target: options.target ?? new EventTarget(),
  } as KeyboardEvent;
}

describe("planner workspace X-ray keyboard", () => {
  it("activates only for unmodified non-editable Space and prevents its default", () => {
    const receivedStates: boolean[] = [];
    const handleKeyboardEvent = createPlannerWorkspaceXRayKeyboardHandler({
      onXRayActiveChange: (isXRayActive) => receivedStates.push(isXRayActive),
    });

    const handledSpaceEvent = createKeyboardEvent(" ");
    const modifiedSpaceEvents = [
      createKeyboardEvent(" ", { altKey: true }),
      createKeyboardEvent(" ", { ctrlKey: true }),
      createKeyboardEvent(" ", { metaKey: true }),
      createKeyboardEvent(" ", { shiftKey: true }),
      createKeyboardEvent(" ", { target: { tagName: "INPUT" } }),
    ];

    handleKeyboardEvent.keydown(handledSpaceEvent);
    for (const modifiedSpaceEvent of modifiedSpaceEvents) {
      handleKeyboardEvent.keydown(modifiedSpaceEvent);
    }

    expect(receivedStates).toEqual([true]);
    expect(handledSpaceEvent.defaultPrevented).toBe(true);
    expect(modifiedSpaceEvents.every((event) => !event.defaultPrevented)).toBe(true);
  });

  it("deactivates active X-ray on Space keyup after focus or modifiers change", () => {
    const receivedStates: boolean[] = [];
    const handleKeyboardEvent = createPlannerWorkspaceXRayKeyboardHandler({
      onXRayActiveChange: (isXRayActive) => receivedStates.push(isXRayActive),
    });

    const keydownEvent = createKeyboardEvent(" ");
    const editableKeyupEvent = createKeyboardEvent(" ", {
      target: { isContentEditable: true },
    });
    const modifiedKeyupEvent = createKeyboardEvent(" ", { ctrlKey: true });

    handleKeyboardEvent.keydown(keydownEvent);
    handleKeyboardEvent.keyup(editableKeyupEvent);
    handleKeyboardEvent.keydown(createKeyboardEvent("Spacebar"));
    handleKeyboardEvent.keyup(modifiedKeyupEvent);
    handleKeyboardEvent.blur();

    expect(receivedStates).toEqual([true, false, true, false]);
    expect(editableKeyupEvent.defaultPrevented).toBe(false);
    expect(modifiedKeyupEvent.defaultPrevented).toBe(true);
  });

  it("registers and detaches keydown, keyup, and blur listeners exactly once", () => {
    const listenersByEventName = new Map<string, EventListener>();
    const removedEventNames: string[] = [];
    const detachXRayKeyboardListener = attachPlannerWorkspaceXRayKeyboardListener(
      {
        addEventListener: (eventName, eventListener) => {
          listenersByEventName.set(eventName, eventListener);
        },
        removeEventListener: (eventName, eventListener) => {
          removedEventNames.push(eventName);
          expect(listenersByEventName.get(eventName)).toBe(eventListener);
          listenersByEventName.delete(eventName);
        },
      },
      createPlannerWorkspaceXRayKeyboardHandler({
        onXRayActiveChange: () => undefined,
      }),
    );

    detachXRayKeyboardListener();
    detachXRayKeyboardListener();

    expect(removedEventNames).toEqual(["keydown", "keyup", "blur"]);
    expect(listenersByEventName.size).toBe(0);
  });

  it("rolls back the listener that registered before its add operation threw", () => {
    const registeredEventNames: string[] = [];
    const removedEventNames: string[] = [];

    expect(() =>
      attachPlannerWorkspaceXRayKeyboardListener(
        {
          addEventListener: (eventName) => {
            registeredEventNames.push(eventName);
            if (eventName === "keyup") {
              throw new Error("keyup registration failed");
            }
          },
          removeEventListener: (eventName) => {
            removedEventNames.push(eventName);
          },
        },
        createPlannerWorkspaceXRayKeyboardHandler({
          onXRayActiveChange: () => undefined,
        }),
      ),
    ).toThrow("keyup registration failed");

    expect(registeredEventNames).toEqual(["keydown", "keyup"]);
    expect(removedEventNames).toEqual(["keyup", "keydown"]);
  });

  it("throws both registration and rollback failures", () => {
    const registrationError = new Error("keyup registration failed");
    const rollbackError = new Error("keyup rollback failed");

    expect(() =>
      attachPlannerWorkspaceXRayKeyboardListener(
        {
          addEventListener: (eventName) => {
            if (eventName === "keyup") {
              throw registrationError;
            }
          },
          removeEventListener: (eventName) => {
            if (eventName === "keyup") {
              throw rollbackError;
            }
          },
        },
        createPlannerWorkspaceXRayKeyboardHandler({
          onXRayActiveChange: () => undefined,
        }),
      ),
    ).toThrow(AggregateError);

    try {
      attachPlannerWorkspaceXRayKeyboardListener(
        {
          addEventListener: (eventName) => {
            if (eventName === "keyup") {
              throw registrationError;
            }
          },
          removeEventListener: (eventName) => {
            if (eventName === "keyup") {
              throw rollbackError;
            }
          },
        },
        createPlannerWorkspaceXRayKeyboardHandler({
          onXRayActiveChange: () => undefined,
        }),
      );
    } catch (caughtError) {
      expect(caughtError).toBeInstanceOf(AggregateError);
      expect((caughtError as AggregateError).errors).toEqual([
        registrationError,
        rollbackError,
      ]);
    }
  });
});
