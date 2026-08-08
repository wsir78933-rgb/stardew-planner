import { describe, expect, it } from "vitest";
import {
  attachPlannerWorkspaceHistoryKeyboardListener,
  createPlannerWorkspaceHistoryKeyboardHandler,
  resolvePlannerWorkspaceKeyboardListenerPort,
  type PlannerWorkspaceKeyboardListenerPort,
} from "../../src/planner/use-planner-workspace-state";
import type { PlannerWorkspaceAction } from "../../src/planner/planner-workspace-state";

describe("planner workspace keyboard history handling", () => {
  it("resolves the injected listener before the default browser listener", () => {
    const injectedKeyboardListenerPort = new EventTarget();
    const browserKeyboardListenerPort = new EventTarget();

    expect(
      resolvePlannerWorkspaceKeyboardListenerPort(
        injectedKeyboardListenerPort,
        browserKeyboardListenerPort,
      ),
    ).toBe(injectedKeyboardListenerPort);
    expect(
      resolvePlannerWorkspaceKeyboardListenerPort(
        undefined,
        browserKeyboardListenerPort,
      ),
    ).toBe(browserKeyboardListenerPort);
    expect(
      resolvePlannerWorkspaceKeyboardListenerPort(
        undefined,
        undefined,
      ),
    ).toBeUndefined();
  });

  it("dispatches reducer-owned history actions through an injected EventTarget lifecycle", () => {
    const keyboardListenerPort = new EventTarget();
    const receivedActions: PlannerWorkspaceAction[] = [];
    const detachKeyboardListener = attachPlannerWorkspaceHistoryKeyboardListener(
      keyboardListenerPort,
      (plannerWorkspaceAction) => receivedActions.push(plannerWorkspaceAction),
    );
    const undoKeyboardEvent = createKeyboardEvent("z", { ctrlKey: true });

    const handledDispatchResult = keyboardListenerPort.dispatchEvent(
      undoKeyboardEvent,
    );

    detachKeyboardListener();
    const detachedKeyboardEvent = createKeyboardEvent("y", { ctrlKey: true });
    const detachedDispatchResult = keyboardListenerPort.dispatchEvent(
      detachedKeyboardEvent,
    );

    expect(receivedActions).toEqual([{ type: "undo-placement-history" }]);
    expect(undoKeyboardEvent.defaultPrevented).toBe(true);
    expect(handledDispatchResult).toBe(false);
    expect(detachedKeyboardEvent.defaultPrevented).toBe(false);
    expect(detachedDispatchResult).toBe(true);
  });

  it("ignores editable targets and unrelated keys without preventing defaults", () => {
    const receivedActions: PlannerWorkspaceAction[] = [];
    const handleKeyboardEvent = createPlannerWorkspaceHistoryKeyboardHandler(
      (plannerWorkspaceAction) => receivedActions.push(plannerWorkspaceAction),
    );

    for (const editableTarget of [
      { tagName: "INPUT" },
      { tagName: "TEXTAREA" },
      { tagName: "SELECT" },
      { isContentEditable: true, tagName: "DIV" },
    ]) {
      let wasDefaultPrevented = false;
      handleKeyboardEvent({
        altKey: false,
        ctrlKey: true,
        key: "z",
        metaKey: false,
        preventDefault: () => {
          wasDefaultPrevented = true;
        },
        shiftKey: false,
        target: editableTarget,
      } as unknown as KeyboardEvent);
      expect(wasDefaultPrevented).toBe(false);
    }

    let wasDefaultPrevented = false;
    handleKeyboardEvent({
      altKey: false,
      ctrlKey: true,
      key: "x",
      metaKey: false,
      preventDefault: () => {
        wasDefaultPrevented = true;
      },
      shiftKey: false,
      target: new EventTarget(),
    } as unknown as KeyboardEvent);

    expect(receivedActions).toEqual([]);
    expect(wasDefaultPrevented).toBe(false);
  });

  it("cleans up a registered keyboard listener at most once", () => {
    let removeCallCount = 0;
    const keyboardListenerPort: PlannerWorkspaceKeyboardListenerPort = {
      addEventListener: () => undefined,
      removeEventListener: () => {
        removeCallCount += 1;
      },
    };
    const detachKeyboardListener = attachPlannerWorkspaceHistoryKeyboardListener(
      keyboardListenerPort,
      () => undefined,
    );

    detachKeyboardListener();
    detachKeyboardListener();

    expect(removeCallCount).toBe(1);
  });

  it("rolls back a partially registered keyboard listener before rethrowing", () => {
    const registrationError = new Error("registration failed after insertion");
    const registeredListeners = new Set<EventListener>();
    let removeCallCount = 0;
    const keyboardListenerPort: PlannerWorkspaceKeyboardListenerPort = {
      addEventListener: (_eventName, eventListener) => {
        registeredListeners.add(eventListener);
        throw registrationError;
      },
      removeEventListener: (_eventName, eventListener) => {
        removeCallCount += 1;
        registeredListeners.delete(eventListener);
      },
    };
    let receivedError: unknown;

    try {
      attachPlannerWorkspaceHistoryKeyboardListener(
        keyboardListenerPort,
        () => undefined,
      );
    } catch (error) {
      receivedError = error;
    }

    expect(receivedError).toBe(registrationError);
    expect(removeCallCount).toBe(1);
    expect(registeredListeners.size).toBe(0);
  });

  it("preserves registration and rollback errors when both listener operations fail", () => {
    const registrationError = new Error("registration failed after insertion");
    const rollbackError = new Error("registration rollback failed");
    const keyboardListenerPort: PlannerWorkspaceKeyboardListenerPort = {
      addEventListener: () => {
        throw registrationError;
      },
      removeEventListener: () => {
        throw rollbackError;
      },
    };
    let receivedError: unknown;

    try {
      attachPlannerWorkspaceHistoryKeyboardListener(
        keyboardListenerPort,
        () => undefined,
      );
    } catch (error) {
      receivedError = error;
    }

    expect(receivedError).toBeInstanceOf(AggregateError);
    expect((receivedError as AggregateError).errors).toEqual([
      registrationError,
      rollbackError,
    ]);
  });
});

function createKeyboardEvent(
  key: string,
  keyboardModifiers: Readonly<{ ctrlKey: boolean }>,
): KeyboardEvent {
  const keyboardEvent = new Event("keydown", { cancelable: true });
  Object.defineProperties(keyboardEvent, {
    altKey: { value: false },
    ctrlKey: { value: keyboardModifiers.ctrlKey },
    key: { value: key },
    metaKey: { value: false },
    shiftKey: { value: false },
  });
  return keyboardEvent as KeyboardEvent;
}
