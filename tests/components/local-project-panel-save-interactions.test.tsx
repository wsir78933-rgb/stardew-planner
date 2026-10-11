import type { ReactNode } from "react";
import { afterEach, expect, it, vi } from "vitest";

const reactHookHarness = vi.hoisted(() => ({
  stateSlots: [] as unknown[],
  referenceSlots: [] as Array<{ current: unknown }>,
  stateCursor: 0,
  referenceCursor: 0,
  beginRender() {
    this.stateCursor = 0;
    this.referenceCursor = 0;
  },
  reset() {
    this.stateSlots = [];
    this.referenceSlots = [];
    this.stateCursor = 0;
    this.referenceCursor = 0;
  },
}));

vi.mock("react", async (importOriginal) => {
  const reactExports = await importOriginal<typeof import("react")>();

  return {
    ...reactExports,
    useRef: <ReferenceValue,>(initialValue: ReferenceValue) => {
      const referenceIndex = reactHookHarness.referenceCursor++;
      if (!reactHookHarness.referenceSlots[referenceIndex]) {
        reactHookHarness.referenceSlots[referenceIndex] = { current: initialValue };
      }
      return reactHookHarness.referenceSlots[referenceIndex] as {
        current: ReferenceValue;
      };
    },
    useState: <StateValue,>(initialValue: StateValue | (() => StateValue)) => {
      const stateIndex = reactHookHarness.stateCursor++;
      if (reactHookHarness.stateSlots[stateIndex] === undefined) {
        reactHookHarness.stateSlots[stateIndex] =
          typeof initialValue === "function"
            ? (initialValue as () => StateValue)()
            : initialValue;
      }

      const setState = (
        nextValue: StateValue | ((currentValue: StateValue) => StateValue),
      ) => {
        const currentValue = reactHookHarness.stateSlots[stateIndex] as StateValue;
        reactHookHarness.stateSlots[stateIndex] =
          typeof nextValue === "function"
            ? (nextValue as (currentValue: StateValue) => StateValue)(currentValue)
            : nextValue;
      };

      return [reactHookHarness.stateSlots[stateIndex] as StateValue, setState] as const;
    },
  };
});

import * as React from "react";
import { LocalProjectPanel } from "../../src/components/local-project-panel";
import { getSaveModalCopy } from "../../src/i18n/save-modal-copy";

type RenderedElement = React.ReactElement<Record<string, unknown>>;
type LocalProjectPanelTree = ReturnType<typeof LocalProjectPanel>;

function findElement(
  node: ReactNode,
  elementType: string,
  matches: (properties: Record<string, unknown>) => boolean = () => true,
): RenderedElement | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const foundElement = findElement(child, elementType, matches);
      if (foundElement) return foundElement;
    }
    return undefined;
  }

  if (!React.isValidElement(node)) return undefined;

  const renderedElement = node as RenderedElement;
  if (
    renderedElement.type === elementType
    && matches(renderedElement.props)
  ) {
    return renderedElement;
  }

  return findElement(renderedElement.props.children as ReactNode, elementType, matches);
}

function requireElement(
  tree: ReactNode,
  elementType: string,
  matches?: (properties: Record<string, unknown>) => boolean,
): RenderedElement {
  const foundElement = findElement(tree, elementType, matches);
  if (!foundElement) {
    throw new Error(`Expected to find a ${elementType} element in the local project panel.`);
  }
  return foundElement;
}

function textContent(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textContent).join("");
  if (React.isValidElement(node)) {
    return textContent((node as RenderedElement).props.children as ReactNode);
  }
  return "";
}

function mountLocalProjectPanel(onSaveCurrentMap: () => Promise<void>) {
  const localProjectsCopy = getSaveModalCopy("en").localProjects;

  function render(): LocalProjectPanelTree {
    reactHookHarness.beginRender();
    return LocalProjectPanel({
      copy: localProjectsCopy,
      currentProjectId: null,
      currentProjectName: null,
      deleteCopy: getSaveModalCopy("en").deleteProject,
      projects: [],
      storageStatus: "ready",
      storageErrorMessage: null,
      onCreateProject: () => undefined,
      onDeleteProject: () => undefined,
      onDuplicateProject: () => undefined,
      onExportProject: () => "{}",
      onImportProject: () => undefined,
      onOpenProject: () => undefined,
      onRenameProject: () => undefined,
      onSaveCurrentMap,
    });
  }

  reactHookHarness.reset();
  return { copy: localProjectsCopy, render };
}

function getSaveButton(tree: LocalProjectPanelTree): RenderedElement {
  return requireElement(
    tree,
    "button",
    (properties) => "aria-busy" in properties,
  );
}

function clickSaveButton(tree: LocalProjectPanelTree): void {
  const onClick = getSaveButton(tree).props.onClick;
  if (typeof onClick !== "function") {
    throw new Error("The local map save button has no click handler.");
  }
  onClick();
}

function flushPendingPromiseCallbacks(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

afterEach(() => {
  reactHookHarness.reset();
  vi.restoreAllMocks();
});

it("waits for preview save, disables duplicates, then reports success and unlocks", async () => {
  let resolveMapSave: (() => void) | undefined;
  const onSaveCurrentMap = vi.fn(
    () => new Promise<void>((resolve) => {
      resolveMapSave = resolve;
    }),
  );
  const { copy, render } = mountLocalProjectPanel(onSaveCurrentMap);
  let tree = render();

  clickSaveButton(tree);
  expect(onSaveCurrentMap).toHaveBeenCalledOnce();
  tree = render();
  expect(getSaveButton(tree).props.disabled).toBe(true);
  expect(getSaveButton(tree).props["aria-busy"]).toBe(true);

  clickSaveButton(tree);
  expect(onSaveCurrentMap).toHaveBeenCalledOnce();

  if (!resolveMapSave) {
    throw new Error("The map save callback did not expose its promise resolver.");
  }
  resolveMapSave();
  await flushPendingPromiseCallbacks();
  tree = render();

  expect(getSaveButton(tree).props.disabled).toBe(false);
  expect(getSaveButton(tree).props["aria-busy"]).toBe(false);
  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "status")))
    .toBe(copy.savedToBrowser);
  expect(findElement(tree, "p", (properties) => properties.role === "alert")).toBeUndefined();
});

it("shows the concrete save error without success and unlocks after rejection", async () => {
  const failureMessage =
    'Cannot save a map preview because the exporter is unavailable for project ID "project-alpha" and map ID "map-standard".';
  const onSaveCurrentMap = vi.fn().mockRejectedValue(new Error(failureMessage));
  const { copy, render } = mountLocalProjectPanel(onSaveCurrentMap);
  let tree = render();

  clickSaveButton(tree);
  tree = render();
  expect(getSaveButton(tree).props.disabled).toBe(true);
  await flushPendingPromiseCallbacks();
  tree = render();

  expect(getSaveButton(tree).props.disabled).toBe(false);
  const errorMessage = textContent(
    requireElement(tree, "p", (properties) => properties.role === "alert"),
  );
  expect(errorMessage).toContain(failureMessage);
  expect(errorMessage).not.toContain(copy.savedToBrowser);
  expect(
    findElement(
      tree,
      "p",
      (properties) => properties.role === "status" && textContent(properties.children as ReactNode).includes(copy.savedToBrowser),
    ),
  ).toBeUndefined();
});
