import { describe, expect, it } from "vitest";

// @ts-expect-error The static public module has no TypeScript declaration file.
import { installReferenceRuntimeWheelZoomModeToggle } from "../../public/reference-runtime/wheel-zoom-mode-toggle.mjs";

type FakeWheelEvent = {
  readonly type: "wheel";
  readonly target: FakeReferenceRuntimeElement;
  propagationStopped: boolean;
  defaultPrevented: boolean;
  stopPropagation(): void;
  preventDefault(): void;
};

type FakeClickEvent = Readonly<{
  type: "click";
}>;

type RecordedListener = Readonly<{
  eventType: string;
  listener: (event: FakeWheelEvent | FakeClickEvent) => void;
  capture: boolean;
}>;

class FakeReferenceRuntimeElement {
  readonly attributes = new Map<string, string>();
  readonly children: FakeReferenceRuntimeElement[] = [];
  readonly listeners: RecordedListener[] = [];
  readonly selectorResults = new Map<string, FakeReferenceRuntimeElement[]>();
  readonly classNameSet: Set<string>;
  parentElement: FakeReferenceRuntimeElement | null = null;
  innerHTML = "";

  constructor(
    readonly tagName: string,
    readonly classNames: readonly string[] = [],
  ) {
    this.classNameSet = new Set(classNames);
  }

  readonly classList = {
    contains: (className: string) => this.classNameSet.has(className),
    add: (className: string) => this.classNameSet.add(className),
    remove: (className: string) => this.classNameSet.delete(className),
  };

  setAttribute(attributeName: string, attributeValue: string): void {
    this.attributes.set(attributeName, attributeValue);
  }

  getAttribute(attributeName: string): string | null {
    return this.attributes.get(attributeName) ?? null;
  }

  append(...appendedChildren: FakeReferenceRuntimeElement[]): void {
    for (const appendedChild of appendedChildren) {
      appendedChild.parentElement = this;
      this.children.push(appendedChild);
    }
  }

  insertBefore(
    insertedChild: FakeReferenceRuntimeElement,
    referenceChild: FakeReferenceRuntimeElement,
  ): void {
    const referenceIndex = this.children.indexOf(referenceChild);
    if (referenceIndex < 0) {
      throw new Error(`Reference child is missing. Received tag: ${referenceChild.tagName}.`);
    }
    insertedChild.parentElement = this;
    this.children.splice(referenceIndex, 0, insertedChild);
  }

  addEventListener(
    eventType: string,
    listener: RecordedListener["listener"],
    options?: boolean | AddEventListenerOptions,
  ): void {
    this.listeners.push({
      eventType,
      listener,
      capture: typeof options === "boolean" ? options : options?.capture === true,
    });
  }

  querySelectorAll(selector: string): FakeReferenceRuntimeElement[] {
    return this.selectorResults.get(selector) ?? [];
  }

  closest(selector: string): FakeReferenceRuntimeElement | null {
    for (
      let candidate: FakeReferenceRuntimeElement | null = this;
      candidate !== null;
      candidate = candidate.parentElement
    ) {
      if (selector === ".canvas-container" && candidate.classList.contains("canvas-container")) {
        return candidate;
      }
    }
    return null;
  }

  click(): void {
    for (const recordedListener of this.listeners) {
      if (recordedListener.eventType === "click") {
        recordedListener.listener({ type: "click" });
      }
    }
  }
}

class FakeReferenceRuntimeDocument {
  readonly selectorResults = new Map<string, FakeReferenceRuntimeElement[]>();
  readonly listeners: RecordedListener[] = [];

  querySelectorAll(selector: string): FakeReferenceRuntimeElement[] {
    return this.selectorResults.get(selector) ?? [];
  }

  createElement(tagName: string): FakeReferenceRuntimeElement {
    return new FakeReferenceRuntimeElement(tagName.toUpperCase());
  }

  addEventListener(
    eventType: string,
    listener: RecordedListener["listener"],
    options?: boolean | AddEventListenerOptions,
  ): void {
    this.listeners.push({
      eventType,
      listener,
      capture: typeof options === "boolean" ? options : options?.capture === true,
    });
  }

  dispatchWheel(target: FakeReferenceRuntimeElement): FakeWheelEvent {
    const wheelEvent: FakeWheelEvent = {
      type: "wheel",
      target,
      propagationStopped: false,
      defaultPrevented: false,
      stopPropagation() {
        this.propagationStopped = true;
      },
      preventDefault() {
        this.defaultPrevented = true;
      },
    };

    for (const recordedListener of this.listeners) {
      if (recordedListener.eventType === "wheel" && recordedListener.capture) {
        recordedListener.listener(wheelEvent);
      }
    }

    if (wheelEvent.propagationStopped) {
      return wheelEvent;
    }

    for (const recordedListener of target.listeners) {
      if (recordedListener.eventType === "wheel") {
        recordedListener.listener(wheelEvent);
      }
    }

    return wheelEvent;
  }
}

type ReferenceRuntimeFixture = Readonly<{
  fakeDocument: FakeReferenceRuntimeDocument;
  referenceRuntimeRoot: FakeReferenceRuntimeElement;
  canvasContainer: FakeReferenceRuntimeElement;
  toolbar: FakeReferenceRuntimeElement;
  cursorGroup: FakeReferenceRuntimeElement;
  eraseGroup: FakeReferenceRuntimeElement;
  undoGroup: FakeReferenceRuntimeElement;
  eraseButton: FakeReferenceRuntimeElement;
  undoButton: FakeReferenceRuntimeElement;
  undoSeparator: FakeReferenceRuntimeElement;
}>;

function createReferenceRuntimeFixture(): ReferenceRuntimeFixture {
  const fakeDocument = new FakeReferenceRuntimeDocument();
  const referenceRuntimeRoot = new FakeReferenceRuntimeElement("DIV");
  const canvasContainer = new FakeReferenceRuntimeElement("DIV", ["canvas-container"]);
  const toolbar = new FakeReferenceRuntimeElement("DIV", ["toolbar"]);
  const cursorGroup = new FakeReferenceRuntimeElement("DIV", ["tool-group"]);
  const initialSeparator = new FakeReferenceRuntimeElement("DIV", ["separator"]);
  const eraseGroup = new FakeReferenceRuntimeElement("DIV", ["tool-group"]);
  const undoSeparator = new FakeReferenceRuntimeElement("DIV", ["separator"]);
  const undoGroup = new FakeReferenceRuntimeElement("DIV", ["tool-group"]);
  const eraseButton = new FakeReferenceRuntimeElement("BUTTON");
  const undoButton = new FakeReferenceRuntimeElement("BUTTON");

  eraseButton.setAttribute("title", "Erase (E)");
  undoButton.setAttribute("title", "Undo (Ctrl+Z)");
  eraseGroup.append(eraseButton);
  undoGroup.append(undoButton);
  toolbar.append(cursorGroup, initialSeparator, eraseGroup, undoSeparator, undoGroup);
  referenceRuntimeRoot.append(canvasContainer, toolbar);

  fakeDocument.selectorResults.set("#reference-runtime-root", [referenceRuntimeRoot]);
  fakeDocument.selectorResults.set(".canvas-container", [canvasContainer]);
  fakeDocument.selectorResults.set(".toolbar", [toolbar]);
  toolbar.selectorResults.set("button", [eraseButton, undoButton]);

  return {
    fakeDocument,
    referenceRuntimeRoot,
    canvasContainer,
    toolbar,
    cursorGroup,
    eraseGroup,
    undoGroup,
    eraseButton,
    undoButton,
    undoSeparator,
  };
}

function getWheelZoomGroup(toolbar: FakeReferenceRuntimeElement): FakeReferenceRuntimeElement {
  const wheelZoomGroup = toolbar.children.find((toolbarChild) =>
    toolbarChild.classList.contains("reference-runtime-wheel-zoom-group"),
  );

  if (wheelZoomGroup === undefined) {
    throw new Error("Wheel zoom group was not installed.");
  }

  return wheelZoomGroup;
}

function getWheelZoomButton(toolbar: FakeReferenceRuntimeElement): FakeReferenceRuntimeElement {
  const wheelZoomButton = getWheelZoomGroup(toolbar).children[0];

  if (wheelZoomButton === undefined) {
    throw new Error("Wheel zoom button was not installed.");
  }

  return wheelZoomButton;
}

function getToolbarChildKinds(toolbar: FakeReferenceRuntimeElement): string[] {
  return toolbar.children.map((toolbarChild) => {
    if (toolbarChild.classList.contains("reference-runtime-wheel-zoom-group")) {
      return "wheel-zoom-group";
    }

    if (toolbarChild.classList.contains("reference-runtime-wheel-zoom-separator")) {
      return "wheel-zoom-separator";
    }

    if (toolbarChild.classList.contains("separator")) {
      return "separator";
    }

    if (toolbarChild.children.some((child) => child.getAttribute("title") === "Erase (E)")) {
      return "erase-group";
    }

    if (toolbarChild.children.some((child) => child.getAttribute("title") === "Undo (Ctrl+Z)")) {
      return "undo-group";
    }

    return "cursor-group";
  });
}

const compatibleWheelZoomButtonText = "Zoom";

type ExistingWheelZoomToolbarControl = Readonly<{
  separator: FakeReferenceRuntimeElement;
  group: FakeReferenceRuntimeElement;
  button: FakeReferenceRuntimeElement;
}>;

function createCompatibleExistingWheelZoomToolbarControl(
  fixture: ReferenceRuntimeFixture,
): ExistingWheelZoomToolbarControl {
  const separator = new FakeReferenceRuntimeElement("DIV", [
    "separator",
    "reference-runtime-wheel-zoom-separator",
  ]);
  const group = new FakeReferenceRuntimeElement("DIV", [
    "tool-group",
    "reference-runtime-wheel-zoom-group",
  ]);
  const button = new FakeReferenceRuntimeElement("BUTTON");

  separator.setAttribute("data-reference-runtime-wheel-zoom-separator", "true");
  group.setAttribute("data-reference-runtime-wheel-zoom-group", "true");
  button.setAttribute("data-reference-runtime-wheel-zoom-button", "true");
  button.setAttribute("type", "button");
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-label", "Enable wheel zoom");
  button.setAttribute("title", "Enable wheel zoom");
  button.innerHTML = compatibleWheelZoomButtonText;
  group.append(button);
  fixture.toolbar.insertBefore(separator, fixture.undoSeparator);
  fixture.toolbar.insertBefore(group, fixture.undoSeparator);

  return { separator, group, button };
}

describe("installReferenceRuntimeWheelZoomModeToggle", () => {
  it("installs disabled page-local state and the accessible enable control", () => {
    const { fakeDocument, toolbar } = createReferenceRuntimeFixture();

    const installation = installReferenceRuntimeWheelZoomModeToggle(fakeDocument);
    const wheelZoomButton = getWheelZoomButton(toolbar);

    expect(Object.isFrozen(installation)).toBe(true);
    expect(installation.isWheelZoomEnabled()).toBe(false);
    expect(wheelZoomButton.getAttribute("aria-pressed")).toBe("false");
    expect(wheelZoomButton.getAttribute("aria-label")).toBe("Enable wheel zoom");
    expect(wheelZoomButton.getAttribute("title")).toBe("Enable wheel zoom");
  });

  it("keeps same-document capture listeners running while blocking the frozen canvas listener", () => {
    const { canvasContainer, fakeDocument, toolbar } = createReferenceRuntimeFixture();
    const installation = installReferenceRuntimeWheelZoomModeToggle(fakeDocument);
    const wheelZoomButton = getWheelZoomButton(toolbar);
    let sameDocumentCaptureListenerCallCount = 0;
    let frozenCanvasWheelListenerCallCount = 0;

    fakeDocument.addEventListener(
      "wheel",
      () => {
        sameDocumentCaptureListenerCallCount += 1;
      },
      true,
    );
    canvasContainer.addEventListener("wheel", () => {
      frozenCanvasWheelListenerCallCount += 1;
    });

    const defaultCanvasWheelEvent = fakeDocument.dispatchWheel(canvasContainer);

    expect(defaultCanvasWheelEvent.propagationStopped).toBe(true);
    expect(defaultCanvasWheelEvent.defaultPrevented).toBe(false);
    expect(sameDocumentCaptureListenerCallCount).toBe(1);
    expect(frozenCanvasWheelListenerCallCount).toBe(0);

    installation.setWheelZoomEnabled(true);
    const enabledCanvasWheelEvent = fakeDocument.dispatchWheel(canvasContainer);

    expect(enabledCanvasWheelEvent.propagationStopped).toBe(false);
    expect(enabledCanvasWheelEvent.defaultPrevented).toBe(false);
    expect(sameDocumentCaptureListenerCallCount).toBe(2);
    expect(frozenCanvasWheelListenerCallCount).toBe(1);

    installation.setWheelZoomEnabled(false);
    const disabledAgainWheelEvent = fakeDocument.dispatchWheel(canvasContainer);

    expect(disabledAgainWheelEvent.propagationStopped).toBe(true);
    expect(disabledAgainWheelEvent.defaultPrevented).toBe(false);
    expect(sameDocumentCaptureListenerCallCount).toBe(3);
    expect(frozenCanvasWheelListenerCallCount).toBe(1);

    const outsideCanvasTarget = new FakeReferenceRuntimeElement("DIV");
    const outsideCanvasWheelEvent = fakeDocument.dispatchWheel(outsideCanvasTarget);

    expect(outsideCanvasWheelEvent.propagationStopped).toBe(false);
    expect(outsideCanvasWheelEvent.defaultPrevented).toBe(false);
    expect(sameDocumentCaptureListenerCallCount).toBe(4);
    expect(frozenCanvasWheelListenerCallCount).toBe(1);
    expect(() => installation.setWheelZoomEnabled("true")).toThrow(
      'Received: "true"',
    );
    expect(wheelZoomButton.getAttribute("aria-pressed")).toBe("false");
  });

  it("places one marker control between erase and undo and toggles its state", () => {
    const { fakeDocument, toolbar } = createReferenceRuntimeFixture();
    const installation = installReferenceRuntimeWheelZoomModeToggle(fakeDocument);
    const wheelZoomButton = getWheelZoomButton(toolbar);
    const wheelZoomGroup = getWheelZoomGroup(toolbar);
    const wheelZoomSeparator = toolbar.children.find((toolbarChild) =>
      toolbarChild.classList.contains("reference-runtime-wheel-zoom-separator"),
    );

    if (wheelZoomSeparator === undefined) {
      throw new Error("Wheel zoom separator was not installed.");
    }

    expect(getToolbarChildKinds(toolbar)).toEqual([
      "cursor-group",
      "separator",
      "erase-group",
      "wheel-zoom-separator",
      "wheel-zoom-group",
      "separator",
      "undo-group",
    ]);
    expect(wheelZoomButton.getAttribute("type")).toBe("button");
    expect(wheelZoomSeparator.getAttribute("data-reference-runtime-wheel-zoom-separator")).toBe(
      "true",
    );
    expect(wheelZoomGroup.getAttribute("data-reference-runtime-wheel-zoom-group")).toBe(
      "true",
    );
    expect(wheelZoomButton.getAttribute("data-reference-runtime-wheel-zoom-button")).toBe(
      "true",
    );
    expect(wheelZoomButton.innerHTML).toBe(compatibleWheelZoomButtonText);

    wheelZoomButton.click();
    expect(installation.isWheelZoomEnabled()).toBe(true);
    expect(wheelZoomButton.getAttribute("aria-pressed")).toBe("true");
    expect(wheelZoomButton.getAttribute("aria-label")).toBe("Disable wheel zoom");
    expect(wheelZoomButton.getAttribute("title")).toBe("Disable wheel zoom");

    wheelZoomButton.click();
    expect(installation.isWheelZoomEnabled()).toBe(false);
    expect(wheelZoomButton.getAttribute("aria-pressed")).toBe("false");
    expect(wheelZoomButton.getAttribute("aria-label")).toBe("Enable wheel zoom");
    expect(wheelZoomButton.getAttribute("title")).toBe("Enable wheel zoom");

    const repeatedInstallation = installReferenceRuntimeWheelZoomModeToggle(fakeDocument);

    expect(repeatedInstallation).toBe(installation);
    expect(toolbar.children).toHaveLength(7);
  });

  it("creates a control only when all stable toolbar markers are absent", () => {
    const { fakeDocument, toolbar } = createReferenceRuntimeFixture();

    installReferenceRuntimeWheelZoomModeToggle(fakeDocument);

    expect(toolbar.children).toHaveLength(7);
    expect(getToolbarChildKinds(toolbar)).toEqual([
      "cursor-group",
      "separator",
      "erase-group",
      "wheel-zoom-separator",
      "wheel-zoom-group",
      "separator",
      "undo-group",
    ]);
  });

  it("reuses one compatible stable toolbar control without adding a duplicate", () => {
    const fixture = createReferenceRuntimeFixture();
    const existingControl = createCompatibleExistingWheelZoomToolbarControl(fixture);

    const installation = installReferenceRuntimeWheelZoomModeToggle(fixture.fakeDocument);

    expect(fixture.toolbar.children).toHaveLength(7);
    expect(getWheelZoomGroup(fixture.toolbar)).toBe(existingControl.group);
    expect(getWheelZoomButton(fixture.toolbar)).toBe(existingControl.button);
    existingControl.button.click();
    expect(installation.isWheelZoomEnabled()).toBe(true);
    expect(existingControl.button.getAttribute("aria-pressed")).toBe("true");
  });

  it.each([
    {
      name: "a partial separator marker",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        const control = createCompatibleExistingWheelZoomToolbarControl(fixture);
        const groupIndex = fixture.toolbar.children.indexOf(control.group);
        fixture.toolbar.children.splice(groupIndex, 1);
        control.group.parentElement = null;
      },
      expectedError: "Received stable marker counts: separator=1, group=0, button=0",
    },
    {
      name: "duplicated button markers",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        const control = createCompatibleExistingWheelZoomToolbarControl(fixture);
        const duplicateButton = new FakeReferenceRuntimeElement("BUTTON");
        duplicateButton.setAttribute("data-reference-runtime-wheel-zoom-button", "true");
        control.group.append(duplicateButton);
      },
      expectedError: "Received stable marker counts: separator=1, group=1, button=2",
    },
    {
      name: "a misplaced compatible marker structure",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        const control = createCompatibleExistingWheelZoomToolbarControl(fixture);
        const groupIndex = fixture.toolbar.children.indexOf(control.group);
        fixture.toolbar.children.splice(groupIndex, 1);
        fixture.toolbar.children.push(control.group);
      },
      expectedError: "Received wheel zoom group index: 6",
    },
    {
      name: "an incompatible stable button type",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        const control = createCompatibleExistingWheelZoomToolbarControl(fixture);
        control.button.setAttribute("type", "submit");
      },
      expectedError: 'Received button type: "submit"',
    },
  ])("fails fast for $name", ({ arrange, expectedError }) => {
    const fixture = createReferenceRuntimeFixture();
    arrange(fixture);

    expect(() => installReferenceRuntimeWheelZoomModeToggle(fixture.fakeDocument)).toThrow(
      expectedError,
    );
  });

  it("rejects direct tool groups whose Undo group precedes Erase", () => {
    const fixture = createReferenceRuntimeFixture();

    fixture.toolbar.children.splice(
      0,
      fixture.toolbar.children.length,
      fixture.cursorGroup,
      fixture.toolbar.children[1]!,
      fixture.undoGroup,
      fixture.eraseGroup,
      fixture.undoSeparator,
    );

    expect(() => installReferenceRuntimeWheelZoomModeToggle(fixture.fakeDocument)).toThrow(
      /Received erase tool group index: 3\.[\s\S]*Received erase tool group tag: "DIV"\.[\s\S]*Received erase tool group class: "tool-group"\.[\s\S]*Received erase tool group title: null\.[\s\S]*Received retained undo separator index: 1\.[\s\S]*Received retained undo separator tag: "DIV"\.[\s\S]*Received retained undo separator class: "separator"\.[\s\S]*Received retained undo separator title: null\.[\s\S]*Received undo tool group index: 2\.[\s\S]*Received undo tool group tag: "DIV"\.[\s\S]*Received undo tool group class: "tool-group"\.[\s\S]*Received undo tool group title: null\./,
    );
  });

  it("rejects an intervening tool group before the retained Undo separator", () => {
    const fixture = createReferenceRuntimeFixture();
    const interveningToolGroup = new FakeReferenceRuntimeElement("DIV", [
      "tool-group",
    ]);

    fixture.toolbar.children.splice(3, 0, interveningToolGroup);
    interveningToolGroup.parentElement = fixture.toolbar;

    expect(() => installReferenceRuntimeWheelZoomModeToggle(fixture.fakeDocument)).toThrow(
      /Received erase tool group index: 2\.[\s\S]*Received erase tool group tag: "DIV"\.[\s\S]*Received erase tool group class: "tool-group"\.[\s\S]*Received erase tool group title: null\.[\s\S]*Received child after erase tool group index: 3\.[\s\S]*Received child after erase tool group tag: "DIV"\.[\s\S]*Received child after erase tool group class: "tool-group"\.[\s\S]*Received child after erase tool group title: null\.[\s\S]*Received retained undo separator index: 4\.[\s\S]*Received retained undo separator tag: "DIV"\.[\s\S]*Received retained undo separator class: "separator"\.[\s\S]*Received retained undo separator title: null\.[\s\S]*Received undo tool group index: 5\.[\s\S]*Received undo tool group tag: "DIV"\.[\s\S]*Received undo tool group class: "tool-group"\.[\s\S]*Received undo tool group title: null\./,
    );
  });

  it.each([
    {
      name: "zero runtime roots",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        fixture.fakeDocument.selectorResults.set("#reference-runtime-root", []);
      },
      expectedError: "Received count: 0",
    },
    {
      name: "two runtime roots",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        fixture.fakeDocument.selectorResults.set("#reference-runtime-root", [
          fixture.referenceRuntimeRoot,
          new FakeReferenceRuntimeElement("DIV"),
        ]);
      },
      expectedError: "Received count: 2",
    },
    {
      name: "zero canvas containers",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        fixture.fakeDocument.selectorResults.set(".canvas-container", []);
      },
      expectedError: "Received count: 0",
    },
    {
      name: "two canvas containers",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        fixture.fakeDocument.selectorResults.set(".canvas-container", [
          fixture.canvasContainer,
          new FakeReferenceRuntimeElement("DIV", ["canvas-container"]),
        ]);
      },
      expectedError: "Received count: 2",
    },
    {
      name: "zero toolbars",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        fixture.fakeDocument.selectorResults.set(".toolbar", []);
      },
      expectedError: "Received count: 0",
    },
    {
      name: "two toolbars",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        fixture.fakeDocument.selectorResults.set(".toolbar", [
          fixture.toolbar,
          new FakeReferenceRuntimeElement("DIV", ["toolbar"]),
        ]);
      },
      expectedError: "Received count: 2",
    },
    {
      name: "a canvas container outside the runtime root",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        new FakeReferenceRuntimeElement("DIV").append(fixture.canvasContainer);
      },
      expectedError: 'Received canvas container tag: "DIV". Received canvas container class: "canvas-container"',
    },
    {
      name: "a toolbar outside the runtime root",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        new FakeReferenceRuntimeElement("DIV").append(fixture.toolbar);
      },
      expectedError: 'Received toolbar tag: "DIV". Received toolbar class: "toolbar"',
    },
    {
      name: "a missing erase anchor",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        fixture.toolbar.selectorResults.set("button", [fixture.undoButton]);
      },
      expectedError: 'title "Erase (E)". Received count: 0',
    },
    {
      name: "a duplicated erase anchor",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        const duplicateEraseButton = new FakeReferenceRuntimeElement("BUTTON");
        duplicateEraseButton.setAttribute("title", "Erase (E)");
        fixture.eraseGroup.append(duplicateEraseButton);
        fixture.toolbar.selectorResults.set("button", [
          fixture.eraseButton,
          duplicateEraseButton,
          fixture.undoButton,
        ]);
      },
      expectedError: 'title "Erase (E)". Received count: 2',
    },
    {
      name: "a missing undo anchor",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        fixture.toolbar.selectorResults.set("button", [fixture.eraseButton]);
      },
      expectedError: 'title "Undo (Ctrl+Z)". Received count: 0',
    },
    {
      name: "a duplicated undo anchor",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        const duplicateUndoButton = new FakeReferenceRuntimeElement("BUTTON");
        duplicateUndoButton.setAttribute("title", "Undo (Ctrl+Z)");
        fixture.undoGroup.append(duplicateUndoButton);
        fixture.toolbar.selectorResults.set("button", [
          fixture.eraseButton,
          fixture.undoButton,
          duplicateUndoButton,
        ]);
      },
      expectedError: 'title "Undo (Ctrl+Z)". Received count: 2',
    },
    {
      name: "an erase anchor outside a direct tool group",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        const eraseGroupIndex = fixture.toolbar.children.indexOf(fixture.eraseGroup);
        fixture.toolbar.children.splice(eraseGroupIndex, 1, fixture.eraseButton);
        fixture.eraseButton.parentElement = fixture.toolbar;
      },
      expectedError: 'Received action title: "Erase (E)". Received action parent tag: "DIV"',
    },
    {
      name: "an undo anchor outside the same toolbar",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        const detachedToolbar = new FakeReferenceRuntimeElement("DIV", ["toolbar"]);
        detachedToolbar.append(fixture.undoGroup);
      },
      expectedError: 'Received action title: "Undo (Ctrl+Z)". Received toolbar tag: "DIV"',
    },
    {
      name: "a missing undo separator",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        const separatorIndex = fixture.toolbar.children.indexOf(fixture.undoSeparator);
        fixture.toolbar.children.splice(separatorIndex, 1);
        fixture.undoSeparator.parentElement = null;
      },
      expectedError:
        'Received retained undo separator index: 2. Received retained undo separator tag: "DIV". Received retained undo separator class: "tool-group". Received retained undo separator title: null.',
    },
    {
      name: "an undo group without a directly preceding separator",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        const undoGroupIndex = fixture.toolbar.children.indexOf(fixture.undoGroup);
        fixture.toolbar.children.splice(undoGroupIndex, 1);
        fixture.toolbar.children.splice(3, 0, fixture.undoGroup);
      },
      expectedError:
        'Received retained undo separator index: 2. Received retained undo separator tag: "DIV". Received retained undo separator class: "tool-group". Received retained undo separator title: null.',
    },
    {
      name: "a pre-existing installation marker without an installation record",
      arrange: (fixture: ReferenceRuntimeFixture) => {
        fixture.referenceRuntimeRoot.setAttribute(
          "data-reference-runtime-wheel-zoom-mode-toggle",
          "installed",
        );
      },
      expectedError: 'Received marker: "installed"',
    },
  ])("fails fast for $name", ({ arrange, expectedError }) => {
    const fixture = createReferenceRuntimeFixture();
    arrange(fixture);

    expect(() => installReferenceRuntimeWheelZoomModeToggle(fixture.fakeDocument)).toThrow(
      expectedError,
    );
  });

  it("rejects an incompatible document boundary with the received value", () => {
    expect(() => installReferenceRuntimeWheelZoomModeToggle({})).toThrow(
      "Received: {}",
    );
  });

  it("preserves an unexpected diagnostic serialization exception", () => {
    const serializationError = new Error("Unexpected diagnostic serialization error.");
    const structurallyInvalidDocumentBoundary = new Proxy(
      {
        querySelectorAll() {},
        createElement() {},
        addEventListener: null,
      },
      {
        get(target, propertyName, receiver) {
          if (propertyName === "toJSON") {
            throw serializationError;
          }

          return Reflect.get(target, propertyName, receiver);
        },
      },
    );

    expect(() =>
      installReferenceRuntimeWheelZoomModeToggle(structurallyInvalidDocumentBoundary),
    ).toThrow(serializationError);
  });
});
