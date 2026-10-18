import type { ReactNode } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

type PanelEffectSlot = {
  cleanup: (() => void) | undefined;
  committedDeps: readonly unknown[] | undefined;
  pending: {
    create: () => void | (() => void);
    deps: readonly unknown[] | undefined;
  } | null;
};

type PanelMemoSlot = {
  deps: readonly unknown[] | undefined;
  value: unknown;
};

const reactHookHarness = vi.hoisted(() => ({
  stateSlots: [] as unknown[],
  referenceSlots: [] as Array<{ current: unknown }>,
  effectSlots: [] as PanelEffectSlot[],
  layoutEffectSlots: [] as PanelEffectSlot[],
  memoSlots: [] as PanelMemoSlot[],
  callbackSlots: [] as PanelMemoSlot[],
  idSlots: [] as string[],
  stateCursor: 0,
  referenceCursor: 0,
  effectCursor: 0,
  layoutEffectCursor: 0,
  memoCursor: 0,
  callbackCursor: 0,
  idCursor: 0,
  isFlushingEffects: false,
  stateUpdatedDuringFlush: false,
  beginRender() {
    this.stateCursor = 0;
    this.referenceCursor = 0;
    this.effectCursor = 0;
    this.layoutEffectCursor = 0;
    this.memoCursor = 0;
    this.callbackCursor = 0;
    this.idCursor = 0;
  },
  flushEffects() {
    this.isFlushingEffects = true;
    try {
      this.flushEffectSlots(this.layoutEffectSlots);
      this.flushEffectSlots(this.effectSlots);
    } finally {
      this.isFlushingEffects = false;
    }
  },
  unmountEffects() {
    this.cleanupEffectSlots(this.layoutEffectSlots);
    this.cleanupEffectSlots(this.effectSlots);
  },
  recordEffect(
    slots: PanelEffectSlot[],
    effectIndex: number,
    create: () => void | (() => void),
    deps: readonly unknown[] | undefined,
  ) {
    const effectSlot = slots[effectIndex] ?? {
      cleanup: undefined,
      committedDeps: undefined,
      pending: null,
    };
    slots[effectIndex] = effectSlot;
    if (panelEffectDepsMatch(effectSlot.committedDeps, deps)) {
      effectSlot.pending = null;
      return;
    }
    effectSlot.pending = { create, deps };
  },
  flushEffectSlots(slots: PanelEffectSlot[]) {
    for (const effectSlot of slots) {
      if (!effectSlot?.pending) continue;
      if (typeof effectSlot.cleanup === "function") {
        effectSlot.cleanup();
        effectSlot.cleanup = undefined;
      }
      const cleanup = effectSlot.pending.create();
      effectSlot.cleanup = typeof cleanup === "function" ? cleanup : undefined;
      effectSlot.committedDeps = effectSlot.pending.deps;
      effectSlot.pending = null;
    }
  },
  cleanupEffectSlots(slots: PanelEffectSlot[]) {
    for (const effectSlot of slots) {
      if (!effectSlot) continue;
      if (typeof effectSlot.cleanup === "function") {
        effectSlot.cleanup();
      }
      effectSlot.cleanup = undefined;
      effectSlot.pending = null;
      effectSlot.committedDeps = undefined;
    }
  },
  readMemo(
    slots: PanelMemoSlot[],
    memoIndex: number,
    factory: () => unknown,
    deps: readonly unknown[] | undefined,
  ): unknown {
    const memoSlot = slots[memoIndex];
    if (memoSlot && panelEffectDepsMatch(memoSlot.deps, deps)) {
      return memoSlot.value;
    }
    const value = factory();
    slots[memoIndex] = { deps, value };
    return value;
  },
  reset() {
    this.stateSlots = [];
    this.referenceSlots = [];
    this.effectSlots = [];
    this.layoutEffectSlots = [];
    this.memoSlots = [];
    this.callbackSlots = [];
    this.idSlots = [];
    this.stateCursor = 0;
    this.referenceCursor = 0;
    this.effectCursor = 0;
    this.layoutEffectCursor = 0;
    this.memoCursor = 0;
    this.callbackCursor = 0;
    this.idCursor = 0;
    this.isFlushingEffects = false;
    this.stateUpdatedDuringFlush = false;
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
        if (reactHookHarness.isFlushingEffects) {
          reactHookHarness.stateUpdatedDuringFlush = true;
        }
      };

      return [reactHookHarness.stateSlots[stateIndex] as StateValue, setState] as const;
    },
    useId: () => {
      const idIndex = reactHookHarness.idCursor++;
      if (!reactHookHarness.idSlots[idIndex]) {
        reactHookHarness.idSlots[idIndex] = `library-test-id-${idIndex}`;
      }
      return reactHookHarness.idSlots[idIndex];
    },
    useMemo: <MemoValue,>(factory: () => MemoValue, deps?: readonly unknown[]) => {
      return reactHookHarness.readMemo(
        reactHookHarness.memoSlots,
        reactHookHarness.memoCursor++,
        factory,
        deps,
      ) as MemoValue;
    },
    useCallback: <Callback extends (...args: never[]) => unknown>(
      callback: Callback,
      deps?: readonly unknown[],
    ) => {
      return reactHookHarness.readMemo(
        reactHookHarness.callbackSlots,
        reactHookHarness.callbackCursor++,
        () => callback,
        deps,
      ) as Callback;
    },
    useEffect: (
      create: () => void | (() => void),
      deps?: readonly unknown[],
    ) => {
      reactHookHarness.recordEffect(
        reactHookHarness.effectSlots,
        reactHookHarness.effectCursor++,
        create,
        deps,
      );
    },
    useLayoutEffect: (
      create: () => void | (() => void),
      deps?: readonly unknown[],
    ) => {
      reactHookHarness.recordEffect(
        reactHookHarness.layoutEffectSlots,
        reactHookHarness.layoutEffectCursor++,
        create,
        deps,
      );
    },
  };
});

import * as React from "react";
import * as browserFileDownloadModule from "../../src/projects/browser-file-download";
import {
  LocalProjectDeleteAlertDialog,
  restoreLocalProjectDeleteButtonFocus,
} from "../../src/components/local-project-delete-alert-dialog";
import panelStylesModule from "../../src/components/local-project-panel.module.css";
import { closeModalFromBackdropClick } from "../../src/components/modal-backdrop-close";
import {
  LocalProjectPanel,
  readLibraryChromeCopy,
} from "../../src/components/local-project-panel";
import { PlannerSaveModalContent } from "../../src/components/planner-save-modal-content";
import { readLibraryPopoverDomId } from "../../src/components/use-local-project-popover";
import { getSaveModalCopy } from "../../src/i18n/save-modal-copy";
import type { ReferenceProjectSummary } from "../../src/reference-runtime/reference-project-repository";

const panelStyles = panelStylesModule as {
  folderButton: string;
  folderList: string;
  iconActionButton: string;
  moreActions: string;
  moreActionsMenu: string;
  moreActionsSummary: string;
  moveDestinations: string;
  projectGroups: string;
  projectGroupsBody: string;
};
const englishLibraryChromeCopy = readLibraryChromeCopy("en");

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

function mountLocalProjectPanel(
  onCreateProject: () => void | Promise<void> = () => undefined,
  projects: readonly ReferenceProjectSummary[] = [],
  panelOverrides: {
    folders?: ReadonlyArray<{ id: string; name: string }>;
    locale?: "en" | "zh-CN";
    onDuplicateProject?: (projectId: string) => void | Promise<void>;
    onImportProject?: (serializedProject: string) => void | Promise<void>;
    onOpenImportGameSave?: () => void;
    onOpenProject?: (projectId: string) => void | Promise<void>;
    onOpenTools?: () => void;
    onRenameProject?: (projectId: string, requestedName: string) => void;
    workspaceController?: {
      createFolder: (folderName: string) => { id: string; name: string };
      getState: () => { projectSummaries: readonly ReferenceProjectSummary[] };
      moveProjectToFolder: (projectId: string, folderId: string | null) => void;
      renameFolder: (folderId: string, folderName: string) => { id: string; name: string };
    };
  } = {},
) {
  const { locale = "en", ...panelProperties } = panelOverrides;
  const saveModalCopy = getSaveModalCopy(locale);

  function render(): LocalProjectPanelTree {
    return commitPanelTree(() => LocalProjectPanel({
      copy: saveModalCopy.localProjects,
      currentProjectId: projects[0]?.id ?? null,
      currentProjectName: projects[0]?.title ?? null,
      deleteCopy: saveModalCopy.deleteProject,
      projects,
      storageStatus: "ready",
      storageErrorMessage: null,
      onCreateProject,
      onDeleteProject: () => undefined,
      onDuplicateProject: () => undefined,
      onExportProject: () => "{}",
      onImportProject: () => undefined,
      onOpenProject: () => undefined,
      onRenameProject: () => undefined,
      ...panelProperties,
    }));
  }

  reactHookHarness.reset();
  return { copy: saveModalCopy.localProjects, render };
}

function rejectUnstubbedFolderRename(
  folderId: string,
  folderName: string,
): { id: string; name: string } {
  throw new Error(
    `Folder rename was not stubbed. Received folder ${JSON.stringify(folderId)} and name ${JSON.stringify(folderName)}.`,
  );
}

function flushPendingPromiseCallbacks(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

beforeEach(() => {
  installLibraryDomFixture();
});

afterEach(() => {
  reactHookHarness.unmountEffects();
  reactHookHarness.reset();
  vi.restoreAllMocks();
  restoreLibraryDomFixture();
});

it("saves the new project once, then shows the created notice and unlocks", async () => {
  let resolveProjectCreate: (() => void) | undefined;
  const onCreateProject = vi.fn(
    () => new Promise<void>((resolve) => {
      resolveProjectCreate = resolve;
    }),
  );
  const { copy, render } = mountLocalProjectPanel(onCreateProject);
  let tree = render();

  clickNewProjectButton(tree, copy.newProject);
  expect(onCreateProject).toHaveBeenCalledOnce();
  tree = render();
  expect(getNewProjectButton(tree, copy.newProject).props.disabled).toBe(true);
  expect(getNewProjectButton(tree, copy.newProject).props["aria-busy"]).toBe(true);

  clickNewProjectButton(tree, copy.newProject);
  expect(onCreateProject).toHaveBeenCalledOnce();

  if (!resolveProjectCreate) {
    throw new Error("The new project callback did not expose its promise resolver.");
  }
  resolveProjectCreate();
  await flushPendingPromiseCallbacks();
  tree = render();

  expect(getNewProjectButton(tree, copy.newProject).props.disabled).toBe(false);
  expect(getNewProjectButton(tree, copy.newProject).props["aria-busy"]).toBe(false);
  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "status")))
    .toBe(copy.createdProject);
  expect(findElement(tree, "p", (properties) => properties.role === "alert")).toBeUndefined();
});

it("shows the concrete new-project error and unlocks after rejection", async () => {
  const failureMessage =
    'Cannot save the current canvas as the first map because the active project is not empty. Received project ID "project-filled".';
  const onCreateProject = vi.fn().mockRejectedValue(new Error(failureMessage));
  const { copy, render } = mountLocalProjectPanel(onCreateProject);
  let tree = render();

  clickNewProjectButton(tree, copy.newProject);
  await flushPendingPromiseCallbacks();
  tree = render();

  expect(getNewProjectButton(tree, copy.newProject).props.disabled).toBe(false);
  const errorMessage = textContent(
    requireElement(tree, "p", (properties) => properties.role === "alert"),
  );
  expect(errorMessage).toBe(copy.actionFailure(failureMessage));
  expect(errorMessage).not.toContain(copy.createdProject);
});

it("shows the saved map preview instead of the empty preview", () => {
  const savedMapPreviewDataUrl = "data:image/webp;base64,UklGRg==";
  const savedProject: ReferenceProjectSummary = {
    activeMapThumbnailDataUrl: savedMapPreviewDataUrl,
    created_at: "2026-08-12T00:00:01.000Z",
    id: "project-preview",
    mapCount: 1,
    title: "Hilltop layout",
    updated_at: "2026-08-12T00:00:02.000Z",
  };
  const onCreateProject = vi.fn();
  const { copy, render } = mountLocalProjectPanel(
    onCreateProject,
    [savedProject],
  );
  const tree = render();
  const previewImage = requireElement(tree, "img");

  expect(previewImage.props.src).toBe(savedMapPreviewDataUrl);
  expect(previewImage.props.alt).toBe(copy.mapPreviewAlt(savedProject.title));
  expect(textContent(tree)).not.toContain(copy.noMapPreview);
  expect(textContent(tree)).not.toContain(copy.emptyState);
  expect(onCreateProject).not.toHaveBeenCalled();
});

it("shows the empty library and does not create a project by itself", () => {
  const onCreateProject = vi.fn();
  const { copy, render } = mountLocalProjectPanel(onCreateProject);
  const tree = render();

  expect(textContent(tree)).toContain(copy.emptyState);
  expect(findElement(tree, "img")).toBeUndefined();
  expect(onCreateProject).not.toHaveBeenCalled();
});

it("creates a folder, selects it, and shows the empty-folder state", () => {
  const createdFolders: Array<{ id: string; name: string }> = [];
  const workspaceController = {
    createFolder: (folderName: string) => {
      const createdFolder = { id: "folder-crops", name: folderName };
      createdFolders.push(createdFolder);
      return createdFolder;
    },
    getState: () => ({ projectSummaries: [] as ReferenceProjectSummary[] }),
    moveProjectToFolder: vi.fn(),
    renameFolder: rejectUnstubbedFolderRename,
  };
  const forestProject: ReferenceProjectSummary = {
    created_at: "2026-08-12T00:00:00.000Z",
    id: "project-forest",
    mapCount: 1,
    title: "Forest Farm",
    updated_at: "2026-08-12T00:00:01.000Z",
  };
  const { render } = mountLocalProjectPanel(
    () => undefined,
    [forestProject],
    { folders: createdFolders, workspaceController },
  );
  let tree = render();
  openProjectGroups(tree);
  tree = render();

  changeMatchingInput(
    tree,
    (properties) => properties["aria-label"] === "Folder name",
    "Crops",
  );
  tree = render();
  clickMatchingButton(
    tree,
    (properties) => textContent(properties.children as ReactNode) === "New folder",
    "The new folder button has no click handler.",
  );
  tree = render();

  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "status")))
    .toBe("Created the folder.");
  expect(requireElement(
    tree,
    "button",
    (properties) => properties["data-folder-id"] === "folder-crops",
  ).props["aria-pressed"]).toBe(true);
  expect(textContent(tree)).toContain("This folder has no plans.");
  expect(findElement(
    tree,
    "li",
    (properties) => properties["data-project-id"] === "project-forest",
  )).toBeUndefined();
  expect(textContent(tree)).not.toContain("No local projects yet.");
});

it("filters search to the selected folder", () => {
  const projects: readonly ReferenceProjectSummary[] = [
    {
      created_at: "2026-08-12T00:00:00.000Z",
      id: "project-forest",
      mapCount: 1,
      title: "Forest Farm",
      updated_at: "2026-08-12T00:00:01.000Z",
    },
    {
      created_at: "2026-08-11T00:00:00.000Z",
      folderId: "folder-cabin",
      id: "project-beach",
      mapCount: 1,
      title: "Beach Cabin",
      updated_at: "2026-08-11T00:00:01.000Z",
    },
  ];
  const { copy, render } = mountLocalProjectPanel(
    () => undefined,
    projects,
    { folders: [{ id: "folder-cabin", name: "Cabins" }] },
  );
  let tree = render();

  expect(findElement(tree, "li", (properties) => properties["data-project-id"] === "project-forest"))
    .toBeDefined();
  expect(findElement(tree, "li", (properties) => properties["data-project-id"] === "project-beach"))
    .toBeUndefined();
  openProjectGroups(tree);
  tree = render();
  clickMatchingButton(
    tree,
    (properties) => properties["data-folder-id"] === "folder-cabin",
    "The Cabins folder button has no click handler.",
  );
  tree = render();
  expect(findElement(tree, "li", (properties) => properties["data-project-id"] === "project-beach"))
    .toBeDefined();
  expect(findElement(tree, "li", (properties) => properties["data-project-id"] === "project-forest"))
    .toBeUndefined();

  changeMatchingInput(
    tree,
    (properties) => properties["aria-label"] === copy.searchProjects,
    "forest",
  );
  tree = render();
  expect(textContent(tree)).toContain(copy.noSearchResults);
  expect(findElement(tree, "li", (properties) => properties["data-project-id"] === "project-beach"))
    .toBeUndefined();
  expect(findElement(tree, "li", (properties) => properties["data-project-id"] === "project-forest"))
    .toBeUndefined();
});

it("moves a project into the chosen folder and does not move a duplicate", () => {
  const moveProjectToFolder = vi.fn();
  const onDuplicateProject = vi.fn();
  const projects: readonly ReferenceProjectSummary[] = [
    {
      created_at: "2026-08-12T00:00:00.000Z",
      id: "project-forest",
      mapCount: 1,
      title: "Forest Farm",
      updated_at: "2026-08-12T00:00:01.000Z",
    },
  ];
  const { render } = mountLocalProjectPanel(
    () => undefined,
    projects,
    {
      folders: [{ id: "folder-cabin", name: "Cabins" }],
      onDuplicateProject,
      workspaceController: {
        createFolder: () => {
          throw new Error("This move test does not create a folder.");
        },
        getState: () => ({ projectSummaries: projects }),
        moveProjectToFolder,
        renameFolder: rejectUnstubbedFolderRename,
      },
    },
  );
  let tree = render();

  clickProjectAction(tree, "move", "project-forest");
  tree = render();
  clickMatchingButton(
    requireElement(
      tree,
      "div",
      (properties) => properties.role === "group" && properties["aria-label"] === "Move",
    ),
    (properties) => textContent(properties.children as ReactNode) === "Cabins",
    "The Cabins move destination has no click handler.",
  );
  expect(moveProjectToFolder).toHaveBeenCalledWith("project-forest", "folder-cabin");

  tree = render();
  clickProjectAction(tree, "more", "project-forest");
  tree = render();
  clickProjectAction(tree, "duplicate", "project-forest");
  expect(onDuplicateProject).toHaveBeenCalledWith("project-forest");
  expect(moveProjectToFolder).toHaveBeenCalledTimes(1);
});

it("moves a new project into the selected folder and leaves My Plans creates unmoved", async () => {
  const projects: readonly ReferenceProjectSummary[] = [
    {
      created_at: "2026-08-12T00:00:00.000Z",
      id: "project-forest",
      mapCount: 1,
      title: "Forest Farm",
      updated_at: "2026-08-12T00:00:01.000Z",
    },
  ];
  let projectWasCreated = false;
  const createdProject: ReferenceProjectSummary = {
    created_at: "2026-08-12T00:00:02.000Z",
    id: "project-new",
    mapCount: 1,
    title: "Untitled Project",
    updated_at: "2026-08-12T00:00:02.000Z",
  };
  const moveProjectToFolder = vi.fn();
  const workspaceController = {
    createFolder: () => {
      throw new Error("This new-project test does not create a folder.");
    },
    getState: () => ({
      projectSummaries: projectWasCreated ? [...projects, createdProject] : projects,
    }),
    moveProjectToFolder,
    renameFolder: rejectUnstubbedFolderRename,
  };
  const onCreateProject = vi.fn(async () => {
    projectWasCreated = true;
  });
  const { copy, render } = mountLocalProjectPanel(
    onCreateProject,
    projects,
    {
      folders: [{ id: "folder-cabin", name: "Cabins" }],
      workspaceController,
    },
  );
  let tree = render();
  openProjectGroups(tree);
  tree = render();

  clickMatchingButton(
    tree,
    (properties) => properties["data-folder-id"] === "folder-cabin",
    "The Cabins folder button has no click handler.",
  );
  tree = render();
  clickNewProjectButton(tree, copy.newProject);
  await flushPendingPromiseCallbacks();
  expect(moveProjectToFolder).toHaveBeenCalledWith("project-new", "folder-cabin");

  tree = render();
  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "status")))
    .toBe(copy.createdProject);

  clickMatchingButton(
    tree,
    (properties) => properties["data-folder-id"] === "my-plans",
    "The My Plans button has no click handler.",
  );
  tree = render();
  projectWasCreated = false;
  clickNewProjectButton(tree, copy.newProject);
  await flushPendingPromiseCallbacks();
  tree = render();
  expect(moveProjectToFolder).toHaveBeenCalledTimes(1);
  expect(onCreateProject).toHaveBeenCalledTimes(2);
});

it("shows the received folder name when creation is blank or the storage call throws", () => {
  const createFolder = vi.fn(() => {
    throw "storage key missing";
  });
  const { copy, render } = mountLocalProjectPanel(
    () => undefined,
    [],
    {
      workspaceController: {
        createFolder,
        getState: () => ({ projectSummaries: [] }),
        moveProjectToFolder: vi.fn(),
        renameFolder: rejectUnstubbedFolderRename,
      },
    },
  );
  let tree = render();
  openProjectGroups(tree);
  tree = render();

  clickMatchingButton(
    tree,
    (properties) => textContent(properties.children as ReactNode) === "New folder",
    "The new folder button has no click handler.",
  );
  tree = render();
  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "alert")))
    .toBe(copy.actionFailure('Folder name must not be empty. Received: "".'));
  expect(createFolder).not.toHaveBeenCalled();

  changeMatchingInput(
    tree,
    (properties) => properties["aria-label"] === "Folder name",
    "Crops",
  );
  tree = render();
  clickMatchingButton(
    tree,
    (properties) => textContent(properties.children as ReactNode) === "New folder",
    "The new folder button has no click handler.",
  );
  tree = render();
  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "alert")))
    .toBe(copy.actionFailure("storage key missing"));
  expect(createFolder).toHaveBeenCalledWith("Crops");
});

it("keeps project groups closed, then shows My Plans and custom folders inside them", () => {
  const projects: readonly ReferenceProjectSummary[] = [
    createForestProjectSummary(),
    {
      ...createBeachProjectSummary(),
      folderId: "folder-cabin",
    },
  ];
  const { render } = mountLocalProjectPanel(
    () => undefined,
    projects,
    { folders: [{ id: "folder-cabin", name: "Cabins" }] },
  );
  let tree = render();
  expectCollapsedProjectGroups(tree);
  expect(findProjectCard(tree, "project-forest")).toBeDefined();
  expect(findProjectCard(tree, "project-beach")).toBeUndefined();
  expect(readSelectedFolderId(tree)).toBe("my-plans");

  openProjectGroups(tree);
  tree = render();
  const openedProjectGroups = requireElement(tree, "details");
  expect(openedProjectGroups.props.open).toBe(true);
  expectFolderListContainsOnlyProjectGroups(tree, "Project groups");
  const myPlansButton = expectMyPlansLeadsProjectGroups(tree);
  expect(myPlansButton.props.onDoubleClick).toBeUndefined();
  expect(myPlansButton.props["aria-pressed"]).toBe(true);
  expect(myPlansButton.props["data-folder-count"]).toBe(1);
  const folderNameInput = requireElement(
    tree,
    "input",
    (properties) => properties["aria-label"] === "Folder name",
  );
  expect(folderNameInput.props.type).toBe("text");
  expect(folderNameInput.props.placeholder).toBe("Folder name");
  expect(textContent(tree)).toContain("New folder");
  const cabinsFolder = requireElement(
    tree,
    "button",
    (properties) => properties["data-folder-id"] === "folder-cabin",
  );
  expect(cabinsFolder.props["data-folder-count"]).toBe(1);
  expect(textContent(cabinsFolder)).toContain("Cabins");
  expect(textContent(openedProjectGroups)).toContain("My Plans");
  expect(textContent(openedProjectGroups)).toContain("Cabins");
  expect(textContent(openedProjectGroups)).toContain("New folder");

  clickMatchingButton(
    tree,
    (properties) => properties["data-folder-id"] === "folder-cabin",
    "The Cabins folder button has no click handler.",
  );
  tree = render();
  expect(requireFolderButton(tree, "folder-cabin").props["aria-pressed"]).toBe(true);
  expect(requireFolderButton(tree, "folder-cabin").props["data-folder-count"]).toBe(1);
  expect(requireFolderButton(tree, "my-plans").props["aria-pressed"]).toBe(false);
  expect(requireFolderButton(tree, "my-plans").props["data-folder-count"]).toBe(1);
  expect(readSelectedFolderId(tree)).toBe("folder-cabin");
  expect(findProjectCard(tree, "project-beach")).toBeDefined();
  expect(findProjectCard(tree, "project-forest")).toBeUndefined();

  clickMatchingButton(
    tree,
    (properties) => properties["data-folder-id"] === "my-plans",
    "The My Plans button has no click handler.",
  );
  tree = render();
  expect(requireFolderButton(tree, "my-plans").props["aria-pressed"]).toBe(true);
  expect(requireFolderButton(tree, "my-plans").props["data-folder-count"]).toBe(1);
  expect(requireFolderButton(tree, "folder-cabin").props["aria-pressed"]).toBe(false);
  expect(requireFolderButton(tree, "folder-cabin").props["data-folder-count"]).toBe(1);
  expect(readSelectedFolderId(tree)).toBe("my-plans");
  expect(findProjectCard(tree, "project-forest")).toBeDefined();
  expect(findProjectCard(tree, "project-beach")).toBeUndefined();

  closeProjectGroups(tree);
  tree = render();
  expectCollapsedProjectGroups(tree);
  expect(readSelectedFolderId(tree)).toBe("my-plans");
  expect(findProjectCard(tree, "project-forest")).toBeDefined();
  expect(findProjectCard(tree, "project-beach")).toBeUndefined();
});

it("renames a custom folder once from Enter or blur and keeps its id", () => {
  const folders = [{ id: "folder-cabin", name: "Cabins" }];
  const forestProject = {
    ...createForestProjectSummary(),
    folderId: "folder-cabin",
  };
  const renameFolder = vi.fn((folderId: string, folderName: string) => {
    const currentFolder = folders.find((projectFolder) => projectFolder.id === folderId);
    if (currentFolder === undefined) {
      throw new Error(`Test folder ${JSON.stringify(folderId)} is missing.`);
    }
    currentFolder.name = folderName;
    return { id: folderId, name: folderName };
  });
  const { render } = mountLocalProjectPanel(
    () => undefined,
    [forestProject],
    {
      folders,
      workspaceController: {
        createFolder: () => {
          throw new Error("This rename test does not create a folder.");
        },
        getState: () => ({ projectSummaries: [forestProject] }),
        moveProjectToFolder: vi.fn(),
        renameFolder,
      },
    },
  );
  let tree = render();
  openProjectGroups(tree);
  tree = render();

  doubleClickFolder(tree, "folder-cabin");
  tree = render();
  const unchangedInput = requireFolderRenameInput(tree);
  expect(unchangedInput.props.value).toBe("Cabins");
  expect(unchangedInput.type).toBe("input");
  expect(requireRenderedTarget(unchangedInput).parentElement?.tagName).not.toBe("BUTTON");
  expect(requireRenderedTarget(unchangedInput).focus).toHaveBeenCalledTimes(1);
  expect(requireRenderedTarget(unchangedInput).select).toHaveBeenCalledTimes(1);
  const unchangedKey = dispatchFolderRenameKey(unchangedInput, "Enter");
  expect(unchangedKey.defaultPrevented).toBe(true);
  expect(unchangedKey.propagationStopped).toBe(true);
  blurFolderRenameInput(unchangedInput);
  expect(renameFolder).not.toHaveBeenCalled();
  tree = render();
  expect(findFolderRenameInput(tree)).toBeUndefined();
  expect(textContent(requireFolderButton(tree, "folder-cabin"))).toContain("Cabins");

  doubleClickFolder(tree, "folder-cabin");
  tree = render();
  changeMatchingInput(
    tree,
    (properties) => properties["data-folder-rename"] === "folder-cabin",
    "Greenhouse",
  );
  tree = render();
  const enterInput = requireFolderRenameInput(tree);
  expect(enterInput.props.value).toBe("Greenhouse");
  dispatchFolderRenameKey(enterInput, "Enter");
  blurFolderRenameInput(enterInput);
  expect(renameFolder).toHaveBeenCalledTimes(1);
  expect(renameFolder).toHaveBeenCalledWith("folder-cabin", "Greenhouse");
  tree = render();
  const renamedFolder = requireFolderButton(tree, "folder-cabin");
  expect(renamedFolder.props["data-folder-count"]).toBe(1);
  expect(textContent(renamedFolder)).toContain("Greenhouse");

  clickMatchingButton(
    tree,
    (properties) => properties["data-folder-id"] === "folder-cabin",
    "The renamed folder button has no click handler.",
  );
  tree = render();
  clickProjectAction(tree, "move", forestProject.id);
  tree = render();
  const moveMenu = requireElement(
    tree,
    "div",
    (properties) => properties.role === "group" && properties["aria-label"] === "Move",
  );
  expect(textContent(moveMenu)).toContain("Greenhouse");
  expect(textContent(moveMenu)).not.toContain("Cabins");

  doubleClickFolder(tree, "folder-cabin");
  tree = render();
  changeMatchingInput(
    tree,
    (properties) => properties["data-folder-rename"] === "folder-cabin",
    "Orchard",
  );
  tree = render();
  blurFolderRenameInput(requireFolderRenameInput(tree));
  expect(renameFolder).toHaveBeenCalledTimes(2);
  expect(renameFolder).toHaveBeenLastCalledWith("folder-cabin", "Orchard");
  tree = render();
  expect(textContent(requireFolderButton(tree, "folder-cabin"))).toContain("Orchard");
  expect(requireFolderButton(tree, "folder-cabin").props["data-folder-count"]).toBe(1);

  doubleClickFolder(tree, "folder-cabin");
  tree = render();
  changeMatchingInput(
    tree,
    (properties) => properties["data-folder-rename"] === "folder-cabin",
    "Discarded",
  );
  tree = render();
  const escapeInput = requireFolderRenameInput(tree);
  const escapeKey = dispatchFolderRenameKey(escapeInput, "Escape");
  expect(escapeKey.defaultPrevented).toBe(true);
  expect(escapeKey.propagationStopped).toBe(true);
  blurFolderRenameInput(escapeInput);
  expect(renameFolder).toHaveBeenCalledTimes(2);
  tree = render();
  const keptFolder = requireFolderButton(tree, "folder-cabin");
  expect(keptFolder.props["data-folder-id"]).toBe("folder-cabin");
  expect(keptFolder.props["data-folder-count"]).toBe(1);
  expect(textContent(keptFolder)).toContain("Orchard");
  expect(textContent(keptFolder)).not.toContain("Discarded");
});

it("blocks a blank folder rename and shows the Chinese folder-name message", () => {
  const renameFolder = vi.fn();
  const { render } = mountLocalProjectPanel(
    () => undefined,
    [],
    {
      folders: [{ id: "folder-cabin", name: "木屋" }],
      locale: "zh-CN",
      workspaceController: {
        createFolder: () => {
          throw new Error("This blank rename test does not create a folder.");
        },
        getState: () => ({ projectSummaries: [] }),
        moveProjectToFolder: vi.fn(),
        renameFolder,
      },
    },
  );
  let tree = render();
  openProjectGroups(tree);
  tree = render();
  const folderNameInput = requireElement(
    tree,
    "input",
    (properties) => properties["aria-label"] === "文件夹名称",
  );
  expect(folderNameInput.props.type).toBe("text");
  expect(folderNameInput.props.placeholder).toBe("文件夹名称");
  expect(textContent(tree)).toContain("新建文件夹");
  expectFolderListContainsOnlyProjectGroups(tree, "项目分组");
  expect(expectMyPlansLeadsProjectGroups(tree).props.onDoubleClick).toBeUndefined();

  doubleClickFolder(tree, "folder-cabin");
  tree = render();
  changeMatchingInput(
    tree,
    (properties) => properties["data-folder-rename"] === "folder-cabin",
    "   ",
  );
  tree = render();
  const blankInput = requireFolderRenameInput(tree);
  expect(blankInput.props["aria-label"]).toBe("重命名文件夹");
  dispatchFolderRenameKey(blankInput, "Enter");
  blurFolderRenameInput(blankInput);
  expect(renameFolder).not.toHaveBeenCalled();
  tree = render();
  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "alert")))
    .toBe(readLibraryChromeCopy("zh-CN").blankFolderName("   "));
  expect(requireFolderRenameInput(tree).props.value).toBe("   ");
  expect(requireElement(
    tree,
    "div",
    (properties) => properties["data-folder-id"] === "folder-cabin",
  ).props["data-folder-count"]).toBe(0);
});

it("opens Import Game Save and Tools from the library sidebar", () => {
  const onOpenImportGameSave = vi.fn();
  const onOpenTools = vi.fn();
  const { render } = mountLocalProjectPanel(
    () => undefined,
    [],
    { onOpenImportGameSave, onOpenTools },
  );
  const tree = render();

  clickMatchingButton(
    tree,
    (properties) => textContent(properties.children as ReactNode) === "Import Game Save",
    "The Import Game Save button has no click handler.",
  );
  clickMatchingButton(
    tree,
    (properties) => textContent(properties.children as ReactNode) === "Tools",
    "The Tools button has no click handler.",
  );
  expect(onOpenImportGameSave).toHaveBeenCalledOnce();
  expect(onOpenTools).toHaveBeenCalledOnce();
});

it("shows a duplicated plan in the folder that is already selected", () => {
  const projects: ReferenceProjectSummary[] = [
    {
      created_at: "2026-08-12T00:00:00.000Z",
      folderId: "folder-crops",
      id: "project-source",
      mapCount: 1,
      title: "Crop Plan",
      updated_at: "2026-08-12T00:00:01.000Z",
    },
  ];
  const { render } = mountLocalProjectPanel(
    () => undefined,
    projects,
    { folders: [{ id: "folder-crops", name: "Crops" }] },
  );
  let tree = render();
  openProjectGroups(tree);
  tree = render();

  clickMatchingButton(
    tree,
    (properties) => properties["data-folder-id"] === "folder-crops",
    "The Crops folder button has no click handler.",
  );
  tree = render();
  expect(requireElement(
    tree,
    "button",
    (properties) => properties["data-folder-id"] === "folder-crops",
  ).props["data-folder-count"]).toBe(1);
  expect(findElement(
    tree,
    "li",
    (properties) => properties["data-project-id"] === "project-source",
  )).toBeDefined();

  projects.push({
    created_at: "2026-08-12T00:00:02.000Z",
    folderId: "folder-crops",
    id: "project-copy",
    mapCount: 1,
    title: "Crop Plan copy",
    updated_at: "2026-08-12T00:00:02.000Z",
  });
  tree = render();

  expect(requireElement(
    tree,
    "button",
    (properties) => properties["data-folder-id"] === "folder-crops",
  ).props["data-folder-count"]).toBe(2);
  expect(requireElement(
    tree,
    "button",
    (properties) => properties["data-folder-id"] === "my-plans",
  ).props["data-folder-count"]).toBe(0);
  expect(findElement(
    tree,
    "li",
    (properties) => properties["data-project-id"] === "project-source",
  )).toBeDefined();
  expect(findElement(
    tree,
    "li",
    (properties) => properties["data-project-id"] === "project-copy",
  )).toBeDefined();
  expect(textContent(tree)).not.toContain("This folder has no plans.");
});

it("shows an unknown thumbnail save error in the existing alert", async () => {
  reactHookHarness.reset();
  const onSaveThumbnail = vi.fn(async () => {
    throw new Error("Unexpected Pixi fault.");
  });
  const unhandledRejections = await readUnhandledRejectionsDuring(async () => {
    let saveModal = renderThumbnailSaveModal(onSaveThumbnail);
    openToolsInSaveModal(saveModal);
    saveModal = renderThumbnailSaveModal(onSaveThumbnail);
    clickMatchingButton(
      requireToolsContent(saveModal),
      (properties) => textContent(properties.children as ReactNode) === "Save thumbnail",
      "The save thumbnail button has no click handler.",
    );
  });
  const saveModal = renderThumbnailSaveModal(onSaveThumbnail);
  const alert = requireElement(
    requireToolsContent(saveModal),
    "p",
    (properties) => properties.role === "alert",
  );

  expect(onSaveThumbnail).toHaveBeenCalledOnce();
  expect(alert.props.className).toBe("local-project-panel__error");
  expect(textContent(alert)).toBe("Thumbnail save failed: Unexpected Pixi fault.");
  expect(unhandledRejections).toEqual([]);
});

it("shows a non-Error thumbnail save value in the existing alert", async () => {
  reactHookHarness.reset();
  const onSaveThumbnail = vi.fn(async () => {
    throw "disk-full";
  });
  const unhandledRejections = await readUnhandledRejectionsDuring(async () => {
    let saveModal = renderThumbnailSaveModal(onSaveThumbnail);
    openToolsInSaveModal(saveModal);
    saveModal = renderThumbnailSaveModal(onSaveThumbnail);
    clickMatchingButton(
      requireToolsContent(saveModal),
      (properties) => textContent(properties.children as ReactNode) === "Save thumbnail",
      "The save thumbnail button has no click handler.",
    );
  });
  const saveModal = renderThumbnailSaveModal(onSaveThumbnail);
  const alert = requireElement(
    requireToolsContent(saveModal),
    "p",
    (properties) => properties.role === "alert",
  );

  expect(textContent(alert)).toBe('Thumbnail save failed: received "disk-full"');
  expect(unhandledRejections).toEqual([]);
});

it("shows the existing project alert when Open, Duplicate, or Import cannot save the current map", async () => {
  const saveError = new Error('WebP encoding failed for planner map ID "standard".');
  const forestProject = createForestProjectSummary();
  const onDuplicateProject = vi.fn(() => Promise.reject(saveError));
  const onImportProject = vi.fn(() => Promise.reject(saveError));
  const onOpenProject = vi.fn(() => Promise.reject(saveError));
  const { copy, render } = mountLocalProjectPanel(
    () => undefined,
    [forestProject],
    { onDuplicateProject, onImportProject, onOpenProject },
  );
  let tree = render();

  clickMatchingButton(
    tree,
    (properties) => properties["data-project-action"] === "open",
    "The Open button has no click handler.",
  );
  await flushPendingPromiseCallbacks();
  tree = render();
  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "alert")))
    .toBe(copy.actionFailure(saveError.message));
  expect(textContent(tree)).not.toContain(copy.openedProject(forestProject.title));
  expect(onOpenProject).toHaveBeenCalledWith(forestProject.id);

  clickProjectAction(tree, "more", "project-forest");
  tree = render();
  clickProjectAction(tree, "duplicate", "project-forest");
  await flushPendingPromiseCallbacks();
  tree = render();
  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "alert")))
    .toBe(copy.actionFailure(saveError.message));
  expect(textContent(tree)).not.toContain(copy.duplicatedProject);

  changeImportFile(tree, "farm.json", "{\"projects\":[]}");
  await flushPendingPromiseCallbacks();
  tree = render();
  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "alert")))
    .toBe(copy.actionFailure(saveError.message));
  expect(textContent(tree)).not.toContain(copy.importedProject("farm.json"));
  expect(onDuplicateProject).toHaveBeenCalledWith(forestProject.id);
  expect(onImportProject).toHaveBeenCalledWith("{\"projects\":[]}");
});

it("waits for the current map save before showing Open, Duplicate, and Import notices", async () => {
  const forestProject = createForestProjectSummary();
  let resolveDuplicateProject: (() => void) | null = null;
  let resolveImportProject: (() => void) | null = null;
  let resolveOpenProject: (() => void) | null = null;
  const onDuplicateProject = vi.fn(() => new Promise<void>((resolve) => {
    resolveDuplicateProject = resolve;
  }));
  const onImportProject = vi.fn(() => new Promise<void>((resolve) => {
    resolveImportProject = resolve;
  }));
  const onOpenProject = vi.fn(() => new Promise<void>((resolve) => {
    resolveOpenProject = resolve;
  }));
  const { copy, render } = mountLocalProjectPanel(
    () => undefined,
    [forestProject],
    { onDuplicateProject, onImportProject, onOpenProject },
  );
  let tree = render();

  clickMatchingButton(
    tree,
    (properties) => properties["data-project-action"] === "open",
    "The Open button has no click handler.",
  );
  tree = render();
  expect(findElement(tree, "p", (properties) => properties.role === "status")).toBeUndefined();
  resolveHeldProjectAction(resolveOpenProject, "Open");
  await flushPendingPromiseCallbacks();
  tree = render();
  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "status")))
    .toBe(copy.openedProject(forestProject.title));

  clickProjectAction(tree, "more", "project-forest");
  tree = render();
  clickProjectAction(tree, "duplicate", "project-forest");
  tree = render();
  expect(textContent(tree)).not.toContain(copy.duplicatedProject);
  resolveHeldProjectAction(resolveDuplicateProject, "Duplicate");
  await flushPendingPromiseCallbacks();
  tree = render();
  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "status")))
    .toBe(copy.duplicatedProject);

  changeImportFile(tree, "farm.json", "{\"projects\":[]}");
  await flushPendingPromiseCallbacks();
  tree = render();
  expect(textContent(tree)).not.toContain(copy.importedProject("farm.json"));
  resolveHeldProjectAction(resolveImportProject, "Import");
  await flushPendingPromiseCallbacks();
  tree = render();
  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "status")))
    .toBe(copy.importedProject("farm.json"));
});

it("renames a project from the more actions menu and can cancel before submitting", () => {
  const forestProject = createForestProjectSummary();
  const onRenameProject = vi.fn();
  const { copy, render } = mountLocalProjectPanel(
    () => undefined,
    [forestProject],
    { onRenameProject },
  );
  let tree = render();
  expectMiniPanelExpanded(tree, forestProject.id, "more", false);
  clickProjectAction(tree, "more", forestProject.id);
  tree = render();
  const renameButton = requireVisibleProjectAction(tree, "rename", forestProject.id);
  const renameTarget = requireRenderedTarget(renameButton);

  expect(textContent(renameButton)).toBe(copy.rename);
  expect(findElement(
    tree,
    "button",
    (properties) => properties["aria-label"] === copy.rename,
  )).toBeUndefined();
  expect(findRenameForm(tree)).toBeUndefined();
  expect(visibleMoreActionNames(tree, forestProject.id)).toEqual([
    "rename",
    "duplicate",
    "export",
    "delete",
  ]);
  expect(textContent(requireVisibleProjectAction(tree, "duplicate", forestProject.id))).toBe(copy.duplicate);
  expect(textContent(requireVisibleProjectAction(tree, "export", forestProject.id))).toBe(copy.exportJson);
  expect(textContent(requireVisibleProjectAction(tree, "delete", forestProject.id))).toBe(copy.delete);

  const pointerOnRename = sendLibraryEvent("pointerdown", renameTarget);
  if (pointerOnRename.propagationStopped || pointerOnRename.defaultPrevented) {
    throw new Error(
      `Pointer down on Rename stopped the original click. propagationStopped is ${String(pointerOnRename.propagationStopped)}. defaultPrevented is ${String(pointerOnRename.defaultPrevented)}.`,
    );
  }
  clickProjectAction(tree, "rename", forestProject.id);
  tree = render();
  const renameForm = requireRenameForm(tree);
  const nameInput = requireElement(
    renameForm,
    "input",
    (properties) => properties.type === "text",
  );
  expect(nameInput.props.value).toBe(forestProject.title);
  expect(onRenameProject).not.toHaveBeenCalled();
  expect(listExpandedMiniPanels(tree)).toEqual([]);

  clickMatchingButton(
    renameForm,
    (properties) => textContent(properties.children as ReactNode) === copy.cancelRename,
    "The cancel rename button has no click handler.",
  );
  tree = render();
  expect(findRenameForm(tree)).toBeUndefined();
  expect(onRenameProject).not.toHaveBeenCalled();
  expect(listExpandedMiniPanels(tree).filter((panelName) => panelName.endsWith(":move"))).toEqual([]);

  tree = reopenMoreActions(render, tree, forestProject.id);
  clickProjectAction(tree, "rename", forestProject.id);
  tree = render();
  changeMatchingInput(
    requireRenameForm(tree),
    (properties) => properties.type === "text",
    "Meadow Farm",
  );
  tree = render();
  clickMatchingButton(
    requireRenameForm(tree),
    (properties) => textContent(properties.children as ReactNode) === copy.applyName,
    "The apply name button has no click handler.",
  );
  expect(onRenameProject).toHaveBeenCalledTimes(1);
  expect(onRenameProject).toHaveBeenCalledWith(forestProject.id, "Meadow Farm");
  tree = render();
  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "status")))
    .toBe(copy.renamedProject);
  expect(findRenameForm(tree)).toBeUndefined();
  expect(listExpandedMiniPanels(tree).filter((panelName) => panelName.endsWith(":move"))).toEqual([]);
  tree = reopenMoreActions(render, tree, forestProject.id);
  expect(textContent(requireVisibleProjectAction(tree, "rename", forestProject.id))).toBe(copy.rename);
});

it("runs an outside library click and still collapses the open mini panel", () => {
  const forestProject = createForestProjectSummary();
  const beachProject = createBeachProjectSummary();
  const onOpenProject = vi.fn();
  const { render } = mountLocalProjectPanel(
    () => undefined,
    [forestProject, beachProject],
    {
      folders: [{ id: "folder-cabin", name: "Cabins" }],
      onOpenProject,
    },
  );
  let tree = render();

  clickProjectAction(tree, "more", forestProject.id);
  tree = render();
  expectMiniPanelExpanded(tree, forestProject.id, "more", true);
  activateRenderedControl(
    requireVisibleProjectAction(tree, "open", forestProject.id),
    `Open for ${forestProject.id}`,
  );
  expect(onOpenProject).toHaveBeenCalledTimes(1);
  expect(onOpenProject).toHaveBeenCalledWith(forestProject.id);
  tree = render();
  expectMiniPanelExpanded(tree, forestProject.id, "more", false);

  clickProjectAction(tree, "more", beachProject.id);
  tree = render();
  openProjectGroups(tree);
  tree = render();
  const cabinsFolder = requireElement(
    tree,
    "button",
    (properties) => properties["data-folder-id"] === "folder-cabin",
  );
  activateRenderedControl(cabinsFolder, "Cabins folder");
  tree = render();
  expect(requireElement(
    tree,
    "button",
    (properties) => properties["data-folder-id"] === "folder-cabin",
  ).props["aria-pressed"]).toBe(true);
  expect(listExpandedMiniPanels(tree)).toEqual([]);

  const myPlansFolder = requireElement(
    tree,
    "button",
    (properties) => properties["data-folder-id"] === "my-plans",
  );
  activateRenderedControl(myPlansFolder, "My Plans folder");
  tree = render();
  expect(requireElement(
    tree,
    "button",
    (properties) => properties["data-folder-id"] === "my-plans",
  ).props["aria-pressed"]).toBe(true);

  clickProjectAction(tree, "move", forestProject.id);
  tree = render();
  expectMiniPanelExpanded(tree, forestProject.id, "move", true);
  const libraryMain = requireElement(
    tree,
    "div",
    (properties) => properties["data-local-project-region"] === "main",
  );
  const outsidePointer = sendLibraryEvent("pointerdown", requireRenderedTarget(libraryMain));
  if (outsidePointer.propagationStopped || outsidePointer.defaultPrevented) {
    throw new Error(
      `Pointer down outside the Move panel stopped the original click. propagationStopped is ${String(outsidePointer.propagationStopped)}. defaultPrevented is ${String(outsidePointer.defaultPrevented)}.`,
    );
  }
  const outsideClick = sendLibraryEvent("click", requireRenderedTarget(libraryMain));
  if (outsideClick.propagationStopped || outsideClick.defaultPrevented) {
    throw new Error(
      `Click outside the Move panel stopped the original click. propagationStopped is ${String(outsideClick.propagationStopped)}. defaultPrevented is ${String(outsideClick.defaultPrevented)}.`,
    );
  }
  tree = render();
  expectMiniPanelExpanded(tree, forestProject.id, "move", false);
  expect(onOpenProject).toHaveBeenCalledTimes(1);
});

it("closes the library from the backdrop and remounts with mini panels collapsed", () => {
  const onClose = vi.fn();
  const backdrop = new EventTarget();
  const libraryButton = new EventTarget();

  closeModalFromBackdropClick({
    currentTarget: backdrop,
    eventTarget: backdrop,
    onClose,
  });
  expect(onClose).toHaveBeenCalledTimes(1);
  closeModalFromBackdropClick({
    currentTarget: backdrop,
    eventTarget: libraryButton,
    onClose,
  });
  expect(onClose).toHaveBeenCalledTimes(1);

  const forestProject = createForestProjectSummary();
  const { render } = mountLocalProjectPanel(() => undefined, [forestProject]);
  let tree = render();
  clickProjectAction(tree, "more", forestProject.id);
  tree = render();
  expectMiniPanelExpanded(tree, forestProject.id, "more", true);

  reactHookHarness.unmountEffects();
  reactHookHarness.reset();
  installLibraryDomFixture();
  tree = render();
  expectMiniPanelExpanded(tree, forestProject.id, "more", false);
  expectMiniPanelExpanded(tree, forestProject.id, "move", false);
});

it("closes only the open mini panel on Escape, focuses its trigger, and leaves the next Escape unstopped", () => {
  const forestProject = createForestProjectSummary();
  const { render } = mountLocalProjectPanel(() => undefined, [forestProject]);

  expectEscapeClosesOnlyMiniPanel(render, forestProject.id, "more");
  expectEscapeClosesOnlyMiniPanel(render, forestProject.id, "move");
});

it("keeps one More or Move panel open on the same card and across cards", () => {
  const forestProject = createForestProjectSummary();
  const beachProject = createBeachProjectSummary();
  const { render } = mountLocalProjectPanel(
    () => undefined,
    [forestProject, beachProject],
  );
  let tree = render();

  clickProjectAction(tree, "more", forestProject.id);
  tree = render();
  expectOnlyExpandedPopover(tree, [`${forestProject.id}:more`]);

  clickProjectAction(tree, "move", forestProject.id);
  tree = render();
  expectOnlyExpandedPopover(tree, [`${forestProject.id}:move`]);

  clickProjectAction(tree, "more", forestProject.id);
  tree = render();
  expectOnlyExpandedPopover(tree, [`${forestProject.id}:more`]);

  clickProjectAction(tree, "more", forestProject.id);
  tree = render();
  expectOnlyExpandedPopover(tree, []);

  clickProjectAction(tree, "more", forestProject.id);
  tree = render();
  clickProjectAction(tree, "more", beachProject.id);
  tree = render();
  expectOnlyExpandedPopover(tree, [`${beachProject.id}:more`]);

  clickProjectAction(tree, "move", forestProject.id);
  tree = render();
  expectOnlyExpandedPopover(tree, [`${forestProject.id}:move`]);

  clickProjectAction(tree, "move", beachProject.id);
  tree = render();
  expectOnlyExpandedPopover(tree, [`${beachProject.id}:move`]);

  clickProjectAction(tree, "move", beachProject.id);
  tree = render();
  expectOnlyExpandedPopover(tree, []);
});

it("keeps the open Move menu scroll position when natural size is measured again", () => {
  const forestProject = createForestProjectSummary();
  const { render } = mountLocalProjectPanel(
    () => undefined,
    [forestProject],
    { folders: [{ id: "folder-cabin", name: "Cabins" }] },
  );
  let tree = render();
  clickProjectAction(tree, "move", forestProject.id);
  tree = render();
  expectMiniPanelExpanded(tree, forestProject.id, "move", true);

  const menuId = readLibraryPopoverDomId("move", forestProject.id);
  const menu = documentListeners?.getElementById(menuId);
  if (!menu || !menu.parentElement || !documentListeners || !windowListeners) {
    throw new Error(
      `Expected the open Move menu ${JSON.stringify(menuId)} to have a parent. Received ${menu ? menu.tagName : "null"}.`,
    );
  }

  const measurementMenu = installMoveMenuMeasurement(menu);
  measurementMenu.isConnected = true;
  measurementMenu.scrollTop = 220;
  measurementMenu.scrollLeft = 18;
  const trigger = requireRenderedTarget(requireProjectAction(tree, "move", forestProject.id));
  trigger.focus();
  const focusCallCount = trigger.focus.mock.calls.length;
  const activeElement = documentListeners.activeElement;
  const viewportSnapshot = installPopoverMeasurementViewport();
  try {
    const libraryMain = requireRenderedTarget(requireElement(
      tree,
      "div",
      (properties) => properties["data-local-project-region"] === "main",
    ));
    if (measurementMenu.contains(libraryMain)) {
      throw new Error("The library main region is inside the Move menu, so it cannot drive an outside scroll.");
    }

    for (let measurementIndex = 0; measurementIndex < 3; measurementIndex += 1) {
      dispatchLibraryPhase(documentListeners, new LibraryDomEvent("scroll", libraryMain), true);
      if (measurementMenu.scrollTop !== 220 || measurementMenu.scrollLeft !== 18) {
        throw new Error(
          `Measurement ${String(measurementIndex)} changed Move scroll to scrollTop=${String(measurementMenu.scrollTop)} scrollLeft=${String(measurementMenu.scrollLeft)}.`,
        );
      }
    }
    if (measurementMenu.id !== menuId) {
      throw new Error(
        `Measurement removed the open menu id ${JSON.stringify(menuId)}. Received ${JSON.stringify(measurementMenu.id)}.`,
      );
    }
    if (measurementMenu.style.width !== "max-content") {
      throw new Error(
        `Expected the placed Move menu width to be max-content. Received ${JSON.stringify(measurementMenu.style.width)}.`,
      );
    }
    if (measurementMenu.style.maxHeight === "none" || measurementMenu.style.maxHeight.length === 0) {
      throw new Error(
        `Expected a constrained Move menu max-height. Received ${JSON.stringify(measurementMenu.style.maxHeight)}.`,
      );
    }
    const attachedMeasurement = measurementMenu.parentElement?.children.find((child) => {
      return child.getAttribute("data-library-popover-measurement") === "true";
    });
    if (attachedMeasurement) {
      throw new Error(
        `The measurement node stayed attached on ${attachedMeasurement.tagName}#${attachedMeasurement.id}.`,
      );
    }
    if (documentListeners.activeElement !== activeElement) {
      throw new Error("Natural-size measurement changed the focused element.");
    }
    if (trigger.focus.mock.calls.length !== focusCallCount) {
      throw new Error(
        `Natural-size measurement moved focus. Focus calls: ${String(trigger.focus.mock.calls.length)}.`,
      );
    }

    measurementMenu.style.width = "sentinel";
    dispatchLibraryPhase(documentListeners, new LibraryDomEvent("scroll", measurementMenu), true);
    if (measurementMenu.style.width !== "sentinel") {
      throw new Error(
        `The Move menu's own scroll repositioned it. width is ${JSON.stringify(measurementMenu.style.width)}.`,
      );
    }
    if (measurementMenu.scrollTop !== 220 || measurementMenu.scrollLeft !== 18) {
      throw new Error(
        `The Move menu's own scroll changed scrollTop=${String(measurementMenu.scrollTop)} scrollLeft=${String(measurementMenu.scrollLeft)}.`,
      );
    }
  } finally {
    restorePopoverMeasurementViewport(viewportSnapshot);
  }
});

it("keeps More mounted for the original Delete button while the delete dialog is open", () => {
  const forestProject = createForestProjectSummary();
  const { render } = mountLocalProjectPanel(() => undefined, [forestProject]);
  let tree = render();
  clickProjectAction(tree, "more", forestProject.id);
  tree = render();
  const deleteButton = requireVisibleProjectAction(tree, "delete", forestProject.id);
  const deleteTarget = requireRenderedTarget(deleteButton);
  clickProjectAction(tree, "delete", forestProject.id);
  tree = render();

  expectMiniPanelExpanded(tree, forestProject.id, "more", true);
  const deleteDialog = findAnyElement(
    tree,
    (element) => element.type === LocalProjectDeleteAlertDialog,
  );
  if (!deleteDialog) {
    throw new Error(
      `Expected the delete dialog while More for ${JSON.stringify(forestProject.id)} stays open.`,
    );
  }
  if (deleteDialog.props.projectTitle !== forestProject.title) {
    throw new Error(
      `Expected the delete dialog title ${JSON.stringify(forestProject.title)}. Received ${JSON.stringify(deleteDialog.props.projectTitle)}.`,
    );
  }
  if (deleteDialog.props.deleteButtonFocusTarget !== deleteTarget) {
    throw new Error(
      "Expected the delete dialog to keep the Delete button that was clicked.",
    );
  }

  const closeAutoFocusEvent = { preventDefault: vi.fn() };
  restoreLocalProjectDeleteButtonFocus(closeAutoFocusEvent, deleteTarget);
  expect(closeAutoFocusEvent.preventDefault).toHaveBeenCalledTimes(1);
  expect(deleteTarget.focus).toHaveBeenCalledTimes(1);
  expect(() => restoreLocalProjectDeleteButtonFocus(closeAutoFocusEvent, null)).toThrow(
    /original Delete button focus target is missing/,
  );
  expect(() => restoreLocalProjectDeleteButtonFocus(closeAutoFocusEvent, {
    focus() {
      throw new Error("Disconnected delete button focus must not be called.");
    },
    isConnected: false,
  })).toThrow(/original Delete button focus target is disconnected/);
});

it("downloads the project WebP preview with sanitized filename without mutating the project", async () => {
  const forestProject: ReferenceProjectSummary = {
    ...createForestProjectSummary(),
    activeMapThumbnailDataUrl: "data:image/webp;base64,UklGRg4AAABXRUJQVlA4IAEAAAAAAA==",
  };
  const onOpenProject = vi.fn();
  const onRenameProject = vi.fn();
  const onDuplicateProject = vi.fn();
  const downloadSpy = vi.spyOn(browserFileDownloadModule, "downloadBrowserFile").mockImplementation(() => {});
  const { copy, render } = mountLocalProjectPanel(
    () => undefined,
    [forestProject],
    { onDuplicateProject, onOpenProject, onRenameProject },
  );
  let tree = render();

  const downloadButton = requireVisibleProjectAction(tree, "download-image", forestProject.id);
  expect(downloadButton.props.disabled).toBe(false);
  expect(downloadButton.props["aria-label"]).toBe(copy.downloadImage(forestProject.title));
  expect(downloadButton.props.title).toBe(copy.downloadImage(forestProject.title));

  clickProjectAction(tree, "download-image", forestProject.id);

  expect(downloadSpy).toHaveBeenCalledOnce();
  const downloadCall = downloadSpy.mock.calls[0]![0];
  expect(downloadCall.filename).toBe("Forest Farm.webp");
  expect(downloadCall.blob).toBeInstanceOf(Blob);
  expect(downloadCall.blob.type).toBe("image/webp");

  tree = render();
  expect(textContent(requireElement(tree, "p", (properties) => properties.role === "status")))
    .toBe(copy.downloadedImage(forestProject.title));
  expect(findElement(tree, "p", (properties) => properties.role === "alert")).toBeUndefined();
  expect(onOpenProject).not.toHaveBeenCalled();
  expect(onRenameProject).not.toHaveBeenCalled();
  expect(onDuplicateProject).not.toHaveBeenCalled();
  expect(listExpandedMiniPanels(tree)).toEqual([]);
});

it("disables the download button when a project has no saved preview", () => {
  const beachProject: ReferenceProjectSummary = {
    ...createBeachProjectSummary(),
    activeMapThumbnailDataUrl: null,
  };
  const { copy, render } = mountLocalProjectPanel(() => undefined, [beachProject]);
  const tree = render();

  const downloadButton = requireProjectAction(tree, "download-image", beachProject.id);
  expect(downloadButton.props.disabled).toBe(true);
  expect(downloadButton.props["aria-label"]).toBe(copy.noDownloadablePreview);
  expect(downloadButton.props.title).toBe(copy.noDownloadablePreview);
});

it("reports a concrete error through runProjectAction when download fails without silent failure", () => {
  const forestProject: ReferenceProjectSummary = {
    ...createForestProjectSummary(),
    activeMapThumbnailDataUrl: "data:image/webp;base64,UklGRg4AAABXRUJQVlA4IAEAAAAAAA==",
  };
  const downloadError = new Error("Disk permission denied");
  vi.spyOn(browserFileDownloadModule, "downloadBrowserFile").mockImplementation(() => {
    throw downloadError;
  });
  const { copy, render } = mountLocalProjectPanel(() => undefined, [forestProject]);
  let tree = render();

  clickProjectAction(tree, "download-image", forestProject.id);
  tree = render();

  const alert = requireElement(tree, "p", (properties) => properties.role === "alert");
  expect(textContent(alert)).toBe(copy.actionFailure(downloadError.message));
  expect(findElement(tree, "p", (properties) => properties.role === "status")).toBeUndefined();
});

function createForestProjectSummary(): ReferenceProjectSummary {
  return {
    created_at: "2026-08-12T00:00:00.000Z",
    id: "project-forest",
    mapCount: 1,
    title: "Forest Farm",
    updated_at: "2026-08-12T00:00:01.000Z",
  };
}

function createBeachProjectSummary(): ReferenceProjectSummary {
  return {
    created_at: "2026-08-11T00:00:00.000Z",
    id: "project-beach",
    mapCount: 1,
    title: "Beach Cabin",
    updated_at: "2026-08-11T00:00:01.000Z",
  };
}

function resolveHeldProjectAction(
  resolveProjectAction: (() => void) | null,
  projectActionName: string,
): void {
  if (resolveProjectAction === null) {
    throw new Error(
      `Expected the ${projectActionName} project action to be waiting. Received no resolve function.`,
    );
  }
  resolveProjectAction();
}

function changeImportFile(
  tree: ReactNode,
  fileName: string,
  serializedProject: string,
): void {
  const fileInput = requireElement(
    tree,
    "input",
    (properties) => properties.type === "file",
  );
  const onChange = fileInput.props.onChange;
  if (typeof onChange !== "function") {
    throw new Error(
      `The import file input has no change handler for ${JSON.stringify(fileName)}.`,
    );
  }
  onChange({
    currentTarget: {
      files: [{
        name: fileName,
        text: () => Promise.resolve(serializedProject),
      }],
      value: fileName,
    },
  });
}

function renderThumbnailSaveModal(
  onSaveThumbnail: () => Promise<void>,
): ReturnType<typeof PlannerSaveModalContent> {
  return commitPanelTree(() => PlannerSaveModalContent({
    copy: getSaveModalCopy("en"),
    currentProjectId: null,
    currentProjectMapInstanceCount: null,
    currentProjectMapInstanceName: null,
    currentProjectName: null,
    mapFile: "Farm.tmx",
    onCaptureScreenshot: async () => new Blob(["png"], { type: "image/png" }),
    onCreateProject: () => undefined,
    onDeleteProject: () => undefined,
    onDuplicateProject: () => undefined,
    onExportProject: () => "{}",
    onImportProject: () => undefined,
    onOpenProject: () => undefined,
    onRenameProject: () => undefined,
    onSaveThumbnail,
    projects: [],
    season: "spring",
    storageErrorMessage: null,
    storageStatus: "ready",
  }));
}

function openToolsInSaveModal(saveModal: ReactNode): void {
  const panel = findElement(saveModal, LocalProjectPanel as unknown as string);
  if (!panel) {
    throw new Error("Expected the save modal to render LocalProjectPanel.");
  }
  const onOpenTools = panel.props.onOpenTools;
  if (typeof onOpenTools !== "function") {
    throw new Error("The Tools button callback is missing from LocalProjectPanel.");
  }
  onOpenTools();
}

function requireToolsContent(saveModal: ReactNode): ReactNode {
  const panel = findElement(saveModal, LocalProjectPanel as unknown as string);
  if (!panel) {
    throw new Error("Expected the save modal to render LocalProjectPanel.");
  }
  const toolsContent = panel.props.toolsContent;
  if (!React.isValidElement(toolsContent)) {
    throw new Error(
      `Expected Tools content after opening Tools. Received ${JSON.stringify(toolsContent)}.`,
    );
  }
  return toolsContent;
}

async function readUnhandledRejectionsDuring(
  action: () => Promise<void>,
): Promise<unknown[]> {
  const unhandledRejections: unknown[] = [];
  function rememberUnhandledRejection(reason: unknown): void {
    unhandledRejections.push(reason);
  }
  process.on("unhandledRejection", rememberUnhandledRejection);
  try {
    await action();
    await flushPendingPromiseCallbacks();
    return unhandledRejections;
  } finally {
    process.off("unhandledRejection", rememberUnhandledRejection);
  }
}

function getNewProjectButton(
  tree: LocalProjectPanelTree,
  newProjectLabel: string,
): RenderedElement {
  return requireElement(
    tree,
    "button",
    (properties) => textContent(properties.children as ReactNode) === newProjectLabel,
  );
}

function setProjectGroupsOpen(tree: ReactNode, nextOpen: boolean): void {
  const projectGroups = requireElement(tree, "details");
  if (projectGroups.props.open === nextOpen) return;
  const onToggle = projectGroups.props.onToggle;
  if (typeof onToggle !== "function") {
    throw new Error(
      `Project groups has no toggle handler. Received ${JSON.stringify(onToggle)}.`,
    );
  }
  onToggle({ currentTarget: { open: nextOpen } });
}

function openProjectGroups(tree: ReactNode): void {
  setProjectGroupsOpen(tree, true);
}

function closeProjectGroups(tree: ReactNode): void {
  setProjectGroupsOpen(tree, false);
}

function expectCollapsedProjectGroups(tree: ReactNode): void {
  expectFolderListContainsOnlyProjectGroups(tree, "Project groups");
  const projectGroups = requireElement(tree, "details");
  expect(projectGroups.props.open).toBe(false);
  expect(textContent(projectGroups)).toContain("Project groups");
  expect(textContent(projectGroups)).not.toContain("My Plans");
  expect(textContent(projectGroups)).not.toContain("Cabins");
  expect(textContent(projectGroups)).not.toContain("New folder");
  if (findProjectGroupsBody(tree) !== undefined) {
    throw new Error("Expected collapsed project groups to omit the group body.");
  }
  expect(findFolderButton(tree, "my-plans")).toBeUndefined();
  expect(findFolderButton(tree, "folder-cabin")).toBeUndefined();
  expect(findElement(
    tree,
    "input",
    (properties) => properties["aria-label"] === "Folder name",
  )).toBeUndefined();
}

function expectFolderListContainsOnlyProjectGroups(
  tree: ReactNode,
  projectGroupsLabel: string,
): void {
  const folderList = requireElement(
    tree,
    "nav",
    (properties) => properties.className === panelStyles.folderList,
  );
  if (folderList.props["aria-label"] !== projectGroupsLabel) {
    throw new Error(
      `Expected the folder list label ${JSON.stringify(projectGroupsLabel)}. Received ${JSON.stringify(folderList.props["aria-label"])}.`,
    );
  }
  const folderListChildNodes = folderList.props.children as ReactNode;
  const folderListChildren = React.Children.toArray(folderListChildNodes).filter(
    (child) => React.isValidElement(child),
  );
  if (folderListChildren.length !== 1) {
    throw new Error(
      `Expected the folder list to contain only project groups. Received ${String(folderListChildren.length)} items.`,
    );
  }
  const projectGroups = folderListChildren[0] as RenderedElement;
  if (
    projectGroups.type !== "details"
    || projectGroups.props.className !== panelStyles.projectGroups
  ) {
    throw new Error(
      `Expected the folder list child to be project groups. Received type ${String(projectGroups.type)} and class ${JSON.stringify(projectGroups.props.className)}.`,
    );
  }
}

function findProjectGroupsBody(tree: ReactNode): RenderedElement | undefined {
  return findElement(
    tree,
    "div",
    (properties) => properties.className === panelStyles.projectGroupsBody,
  );
}

function expectMyPlansLeadsProjectGroups(tree: ReactNode): RenderedElement {
  const projectGroupsBody = findProjectGroupsBody(tree);
  if (projectGroupsBody === undefined) {
    throw new Error("Expected open project groups to render the group body.");
  }
  const firstChild = requireRenderedTarget(projectGroupsBody).children[0];
  if (firstChild === undefined) {
    throw new Error("Expected project groups body to render My Plans first. Received no children.");
  }
  if (firstChild.tagName !== "BUTTON" || firstChild.getAttribute("data-folder-id") !== "my-plans") {
    throw new Error(
      `Expected My Plans to be the first project group item. Received ${firstChild.tagName} ${JSON.stringify(firstChild.getAttribute("data-folder-id"))}.`,
    );
  }
  if (!firstChild.classList.contains(panelStyles.folderButton)) {
    throw new Error(
      `Expected My Plans to keep the folder button class. Received ${JSON.stringify(firstChild.className)}.`,
    );
  }
  const myPlansButton = requireFolderButton(tree, "my-plans");
  let parent = requireRenderedTarget(myPlansButton).parentElement;
  let sawProjectGroupsBody = false;
  let sawProjectGroups = false;
  while (parent) {
    if (parent.classList.contains(panelStyles.projectGroupsBody)) {
      sawProjectGroupsBody = true;
    }
    if (parent.tagName === "DETAILS" && parent.classList.contains(panelStyles.projectGroups)) {
      sawProjectGroups = true;
      break;
    }
    parent = parent.parentElement;
  }
  if (!sawProjectGroupsBody || !sawProjectGroups) {
    throw new Error(
      `Expected My Plans to stay inside project groups. Body is ${String(sawProjectGroupsBody)}. Details is ${String(sawProjectGroups)}.`,
    );
  }
  return myPlansButton;
}

function findProjectCard(tree: ReactNode, projectId: string): RenderedElement | undefined {
  return findElement(
    tree,
    "li",
    (properties) => properties["data-project-id"] === projectId,
  );
}

function readSelectedFolderId(tree: ReactNode): unknown {
  return requireElement(
    tree,
    "div",
    (properties) => properties["data-local-project-region"] === "main",
  ).props["data-selected-folder-id"];
}

function findFolderButton(tree: ReactNode, folderId: string): RenderedElement | undefined {
  return findElement(
    tree,
    "button",
    (properties) => properties["data-folder-id"] === folderId,
  );
}

function requireFolderButton(tree: ReactNode, folderId: string): RenderedElement {
  return requireElement(
    tree,
    "button",
    (properties) => properties["data-folder-id"] === folderId,
  );
}

function findFolderRenameInput(tree: ReactNode): RenderedElement | undefined {
  return findElement(
    tree,
    "input",
    (properties) => properties["data-folder-rename"] !== undefined,
  );
}

function requireFolderRenameInput(tree: ReactNode): RenderedElement {
  const folderRenameInput = findFolderRenameInput(tree);
  if (folderRenameInput === undefined) {
    throw new Error("Expected the custom folder rename field.");
  }
  return folderRenameInput;
}

function doubleClickFolder(tree: ReactNode, folderId: string): void {
  const folderButton = requireFolderButton(tree, folderId);
  const onDoubleClick = folderButton.props.onDoubleClick;
  if (typeof onDoubleClick !== "function") {
    throw new Error(
      `Folder ${JSON.stringify(folderId)} has no double-click handler. Received ${JSON.stringify(onDoubleClick)}.`,
    );
  }
  onDoubleClick({
    currentTarget: folderButton,
    preventDefault() {},
    stopPropagation() {},
    target: folderButton,
  });
}

function dispatchFolderRenameKey(
  folderRenameInput: RenderedElement,
  key: "Enter" | "Escape",
): { defaultPrevented: boolean; propagationStopped: boolean } {
  const onKeyDown = folderRenameInput.props.onKeyDown;
  if (typeof onKeyDown !== "function") {
    throw new Error(
      `Folder rename input has no key handler. Received ${JSON.stringify(onKeyDown)}.`,
    );
  }
  let defaultPrevented = false;
  let propagationStopped = false;
  onKeyDown({
    currentTarget: {
      blur: vi.fn(),
      value: folderRenameInput.props.value,
    },
    key,
    preventDefault() {
      defaultPrevented = true;
    },
    repeat: false,
    stopPropagation() {
      propagationStopped = true;
    },
  });
  return { defaultPrevented, propagationStopped };
}

function blurFolderRenameInput(folderRenameInput: RenderedElement): void {
  const onBlur = folderRenameInput.props.onBlur;
  if (typeof onBlur !== "function") {
    throw new Error(
      `Folder rename input has no blur handler. Received ${JSON.stringify(onBlur)}.`,
    );
  }
  onBlur({
    currentTarget: { value: folderRenameInput.props.value },
  });
}

function changeMatchingInput(
  tree: ReactNode,
  matches: (properties: Record<string, unknown>) => boolean,
  nextValue: string,
): void {
  const input = requireElement(tree, "input", matches);
  const onChange = input.props.onChange;
  if (typeof onChange !== "function") {
    throw new Error("The matching local project input has no change handler.");
  }
  onChange({ currentTarget: { value: nextValue } });
}

function findRenameForm(tree: ReactNode): RenderedElement | undefined {
  return findElement(
    tree,
    "div",
    (properties) => String(properties.className ?? "").includes("local-project-panel__rename-form"),
  );
}

function requireRenameForm(tree: ReactNode): RenderedElement {
  const renameForm = findRenameForm(tree);
  if (renameForm === undefined) {
    throw new Error("Expected the project card to show the rename form.");
  }
  return renameForm;
}

function clickMatchingButton(
  tree: ReactNode,
  matches: (properties: Record<string, unknown>) => boolean,
  missingMessage: string,
): void {
  const button = requireElement(tree, "button", matches);
  const onClick = button.props.onClick;
  if (typeof onClick !== "function") {
    throw new Error(missingMessage);
  }
  onClick({
    preventDefault() {},
    stopPropagation() {},
    currentTarget: button,
    target: button,
  });
}

function clickNewProjectButton(
  tree: LocalProjectPanelTree,
  newProjectLabel: string,
): void {
  const onClick = getNewProjectButton(tree, newProjectLabel).props.onClick;
  if (typeof onClick !== "function") {
    throw new Error("The new project button has no click handler.");
  }
  onClick({
    preventDefault() {},
    stopPropagation() {},
    currentTarget: getNewProjectButton(tree, newProjectLabel),
    target: getNewProjectButton(tree, newProjectLabel),
  });
}

function panelEffectDepsMatch(
  previousDeps: readonly unknown[] | undefined,
  nextDeps: readonly unknown[] | undefined,
): boolean {
  if (!previousDeps || !nextDeps) return false;
  if (previousDeps.length !== nextDeps.length) return false;
  return previousDeps.every((previousDep, index) => Object.is(previousDep, nextDeps[index]));
}

function commitPanelTree<Tree>(createTree: () => Tree): Tree {
  let renderedTree: Tree | undefined;
  for (let commitAttempt = 0; commitAttempt < 4; commitAttempt += 1) {
    reactHookHarness.beginRender();
    renderedTree = createTree();
    renderedTargets.clear();
    attachRenderedNode(renderedTree as ReactNode, null);
    reactHookHarness.stateUpdatedDuringFlush = false;
    reactHookHarness.flushEffects();
    if (!reactHookHarness.stateUpdatedDuringFlush) return renderedTree;
  }
  throw new Error(
    "Panel effects updated state on 4 commits. The last commit still requested another render.",
  );
}

const renderedTargets = new Map<RenderedElement, LibraryPointerTarget>();
let documentListeners: LibraryListenerTarget | null = null;
let windowListeners: LibraryListenerTarget | null = null;
let domGlobalsSnapshot: {
  document: unknown;
  element: unknown;
  htmlButtonElement: unknown;
  htmlElement: unknown;
  node: unknown;
  window: unknown;
} | null = null;

function installLibraryDomFixture(): void {
  if (domGlobalsSnapshot) return;
  domGlobalsSnapshot = {
    document: globalThis.document,
    element: globalThis.Element,
    htmlButtonElement: globalThis.HTMLButtonElement,
    htmlElement: globalThis.HTMLElement,
    node: globalThis.Node,
    window: globalThis.window,
  };
  documentListeners = new LibraryListenerTarget();
  windowListeners = new LibraryListenerTarget();
  const globalRecord = globalThis as unknown as Record<string, unknown>;
  globalRecord.HTMLButtonElement = LibraryPointerTarget;
  globalRecord.HTMLElement = LibraryPointerTarget;
  globalRecord.Element = LibraryPointerTarget;
  globalRecord.Node = LibraryPointerTarget;
  globalRecord.document = documentListeners;
  globalRecord.window = windowListeners;
}

function restoreLibraryDomFixture(): void {
  if (!domGlobalsSnapshot) return;
  const globalRecord = globalThis as unknown as Record<string, unknown>;
  globalRecord.document = domGlobalsSnapshot.document;
  globalRecord.Element = domGlobalsSnapshot.element;
  globalRecord.HTMLButtonElement = domGlobalsSnapshot.htmlButtonElement;
  globalRecord.HTMLElement = domGlobalsSnapshot.htmlElement;
  globalRecord.Node = domGlobalsSnapshot.node;
  globalRecord.window = domGlobalsSnapshot.window;
  domGlobalsSnapshot = null;
  documentListeners = null;
  windowListeners = null;
  renderedTargets.clear();
}

type MoveMenuMeasurement = LibraryPointerTarget & {
  isConnected: boolean;
  removeAttribute: (name: string) => void;
  scrollLeft: number;
  scrollTop: number;
  style: Record<string, string>;
  cloneNode: (deep?: boolean) => MoveMenuMeasurement;
  remove: () => void;
};

type PopoverMeasurementViewport = {
  getComputedStyle: unknown;
  innerHeight: unknown;
  innerWidth: unknown;
  visualViewport: unknown;
};

function installMoveMenuMeasurement(menu: LibraryPointerTarget): MoveMenuMeasurement {
  const measurementMenu = menu as MoveMenuMeasurement;
  measurementMenu.style = createMeasurementStyle();
  const measuredWidth = measurementMenu.offsetWidth;
  const measuredHeight = measurementMenu.offsetHeight;
  Object.defineProperty(measurementMenu, "offsetWidth", {
    configurable: true,
    get() {
      if (measurementMenu.style.maxHeight === "none") measurementMenu.scrollTop = 0;
      return measuredWidth;
    },
  });
  Object.defineProperty(measurementMenu, "offsetHeight", {
    configurable: true,
    get() {
      if (measurementMenu.style.maxHeight === "none") measurementMenu.scrollTop = 0;
      return measuredHeight;
    },
  });
  Object.defineProperty(measurementMenu, "nextSibling", {
    configurable: true,
    get() {
      const parent = measurementMenu.parentElement;
      if (!parent) return null;
      const childIndex = parent.children.indexOf(measurementMenu);
      if (childIndex < 0) return null;
      return parent.children[childIndex + 1] ?? null;
    },
  });
  measurementMenu.cloneNode = () => createMoveMenuMeasurementClone(measurementMenu, measuredWidth, measuredHeight);
  const parent = measurementMenu.parentElement;
  if (!parent) {
    throw new Error(
      `Cannot measure Move menu ${JSON.stringify(measurementMenu.id)} because its parent is null.`,
    );
  }
  const measurementParent = parent as LibraryPointerTarget & {
    insertBefore: (
      node: LibraryPointerTarget,
      referenceNode: LibraryPointerTarget | null,
    ) => LibraryPointerTarget;
  };
  measurementParent.insertBefore = (node, referenceNode) => {
    const insertionIndex = referenceNode === null
      ? parent.children.length
      : parent.children.indexOf(referenceNode);
    if (referenceNode !== null && insertionIndex < 0) {
      throw new Error(
        `Cannot insert a measurement node before ${referenceNode.tagName}#${referenceNode.id}.`,
      );
    }
    parent.children.splice(insertionIndex, 0, node);
    node.parentElement = parent;
    return node;
  };
  return measurementMenu;
}

function createMeasurementStyle(): Record<string, string> {
  const styleValues = new Map<string, string>();
  return new Proxy({} as Record<string, string>, {
    get(_target, property) {
      if (typeof property !== "string") return "";
      return styleValues.get(property) ?? "";
    },
    set(_target, property, value) {
      if (typeof property !== "string") return false;
      styleValues.set(property, String(value));
      return true;
    },
  });
}

function createMoveMenuMeasurementClone(
  menu: MoveMenuMeasurement,
  measuredWidth: number,
  measuredHeight: number,
): MoveMenuMeasurement {
  const clonedMenu = new LibraryPointerTarget(menu.tagName, menu.owner) as MoveMenuMeasurement;
  clonedMenu.id = menu.id;
  clonedMenu.className = menu.className;
  if (menu.id.length > 0) clonedMenu.setAttribute("id", menu.id);
  clonedMenu.removeAttribute = (name: string) => {
    if (name === "id") clonedMenu.id = "";
  };
  clonedMenu.style = createMeasurementStyle();
  clonedMenu.scrollTop = 0;
  clonedMenu.scrollLeft = 0;
  Object.defineProperty(clonedMenu, "offsetWidth", {
    configurable: true,
    get() {
      if (clonedMenu.style.maxHeight === "none") clonedMenu.scrollTop = 0;
      return measuredWidth;
    },
  });
  Object.defineProperty(clonedMenu, "offsetHeight", {
    configurable: true,
    get() {
      if (clonedMenu.style.maxHeight === "none") clonedMenu.scrollTop = 0;
      return measuredHeight;
    },
  });
  clonedMenu.remove = () => {
    const parent = clonedMenu.parentElement;
    if (!parent) return;
    const childIndex = parent.children.indexOf(clonedMenu);
    if (childIndex < 0) {
      throw new Error(
        `Cannot remove the measurement clone ${clonedMenu.tagName}#${clonedMenu.id} because its parent does not list it.`,
      );
    }
    parent.children.splice(childIndex, 1);
    clonedMenu.parentElement = null;
  };
  return clonedMenu;
}

function installPopoverMeasurementViewport(): PopoverMeasurementViewport {
  if (!windowListeners) {
    throw new Error("Cannot measure a popover because the library window fixture is not installed.");
  }
  const windowRecord = windowListeners as unknown as Record<string, unknown>;
  const snapshot = {
    getComputedStyle: windowRecord.getComputedStyle,
    innerHeight: windowRecord.innerHeight,
    innerWidth: windowRecord.innerWidth,
    visualViewport: windowRecord.visualViewport,
  };
  windowRecord.innerWidth = 800;
  windowRecord.innerHeight = 600;
  windowRecord.visualViewport = null;
  windowRecord.getComputedStyle = () => ({
    contain: "none",
    contentVisibility: "visible",
    filter: "none",
    perspective: "none",
    transform: "none",
    willChange: "auto",
  });
  return snapshot;
}

function restorePopoverMeasurementViewport(snapshot: PopoverMeasurementViewport): void {
  if (!windowListeners) return;
  const windowRecord = windowListeners as unknown as Record<string, unknown>;
  windowRecord.getComputedStyle = snapshot.getComputedStyle;
  windowRecord.innerHeight = snapshot.innerHeight;
  windowRecord.innerWidth = snapshot.innerWidth;
  windowRecord.visualViewport = snapshot.visualViewport;
}

function attachRenderedNode(node: ReactNode, parent: LibraryPointerTarget | null): void {
  if (Array.isArray(node)) {
    for (const child of node) attachRenderedNode(child, parent);
    return;
  }
  if (!React.isValidElement(node)) return;
  const rendered = node as RenderedElement;
  if (typeof rendered.type !== "string") {
    attachRenderedNode(rendered.props.children as ReactNode, parent);
    return;
  }

  const target = new LibraryPointerTarget(rendered.type.toUpperCase(), rendered);
  target.parentElement = parent;
  parent?.children.push(target);
  renderedTargets.set(rendered, target);
  assignRenderedRef(rendered.props.ref, target);
  const legacyRef = (rendered as { ref?: unknown }).ref;
  if (legacyRef && legacyRef !== rendered.props.ref) {
    assignRenderedRef(legacyRef, target);
  }
  copyRenderedAttributes(rendered, target);
  attachRenderedNode(rendered.props.children as ReactNode, target);
}

function assignRenderedRef(ref: unknown, target: LibraryPointerTarget): void {
  if (typeof ref === "function") {
    ref(target);
    return;
  }
  if (ref && typeof ref === "object" && "current" in ref) {
    (ref as { current: unknown }).current = target;
  }
}

function copyRenderedAttributes(rendered: RenderedElement, target: LibraryPointerTarget): void {
  for (const [key, value] of Object.entries(rendered.props)) {
    if (key === "className" && typeof value === "string") {
      target.className = value;
      continue;
    }
    if (key === "id" && (typeof value === "string" || typeof value === "number")) {
      target.id = String(value);
      continue;
    }
    if (key === "role" && typeof value === "string") {
      target.setAttribute("role", value);
      continue;
    }
    if (!key.startsWith("aria-") && !key.startsWith("data-")) continue;
    if (typeof value === "string" || typeof value === "number") {
      target.setAttribute(key, String(value));
    } else if (typeof value === "boolean") {
      target.setAttribute(key, value ? "true" : "false");
    }
  }
}

function requireRenderedTarget(element: RenderedElement): LibraryPointerTarget {
  const target = renderedTargets.get(element);
  if (!target) {
    throw new Error(
      `Expected a rendered target for ${JSON.stringify(element.props["data-project-action"] ?? element.type)}.`,
    );
  }
  return target;
}

function findAnyElement(
  node: ReactNode,
  matches: (element: RenderedElement) => boolean,
): RenderedElement | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findAnyElement(child, matches);
      if (found) return found;
    }
    return undefined;
  }
  if (!React.isValidElement(node)) return undefined;
  const rendered = node as RenderedElement;
  if (matches(rendered)) return rendered;
  return findAnyElement(rendered.props.children as ReactNode, matches);
}

function requireProjectCard(tree: ReactNode, projectId: string): RenderedElement {
  const card = findAnyElement(tree, (element) => element.props["data-project-id"] === projectId);
  if (!card) {
    throw new Error(`Expected a local project card for ${JSON.stringify(projectId)}.`);
  }
  return card;
}

function requireProjectAction(
  tree: ReactNode,
  action: string,
  projectId: string,
): RenderedElement {
  const control = findAnyElement(
    requireProjectCard(tree, projectId),
    (element) => element.props["data-project-action"] === action,
  );
  if (!control) {
    throw new Error(
      `Expected project ${JSON.stringify(projectId)} to render ${JSON.stringify(action)}.`,
    );
  }
  return control;
}

function isHiddenProps(props: Record<string, unknown>): boolean {
  if (props.hidden === true || props.hidden === "") return true;
  const ariaHidden = props["aria-hidden"];
  if (ariaHidden === true || ariaHidden === "true") return true;
  const style = props.style;
  if (
    style
    && typeof style === "object"
    && "display" in style
    && (style as { display?: unknown }).display === "none"
  ) {
    return true;
  }
  return false;
}

function isReactElementVisible(element: RenderedElement): boolean {
  let current: LibraryPointerTarget | null = requireRenderedTarget(element);
  while (current) {
    if (current.owner && isHiddenProps(current.owner.props)) return false;
    current = current.parentElement;
  }
  return true;
}

function requireVisibleProjectAction(
  tree: ReactNode,
  action: string,
  projectId: string,
): RenderedElement {
  const control = requireProjectAction(tree, action, projectId);
  if (!isReactElementVisible(control)) {
    throw new Error(
      `Expected ${JSON.stringify(action)} on ${JSON.stringify(projectId)} to be visible. aria-expanded is ${JSON.stringify(control.props["aria-expanded"])}.`,
    );
  }
  return control;
}

const moreActionNames = ["rename", "duplicate", "export", "delete"] as const;

function visibleMoreActionNames(tree: ReactNode, projectId: string): string[] {
  const card = requireProjectCard(tree, projectId);
  return moreActionNames.filter((action) => {
    const control = findAnyElement(card, (element) => element.props["data-project-action"] === action);
    return control !== undefined && isReactElementVisible(control);
  });
}

function readAriaExpanded(element: RenderedElement, label: string): boolean {
  const ariaExpanded = element.props["aria-expanded"];
  if (ariaExpanded === true || ariaExpanded === "true") return true;
  if (ariaExpanded === false || ariaExpanded === "false") return false;
  throw new Error(
    `Expected ${label} aria-expanded to be true or false. Received ${JSON.stringify(ariaExpanded)}.`,
  );
}

function expectMiniPanelExpanded(
  tree: ReactNode,
  projectId: string,
  action: "more" | "move",
  expanded: boolean,
): void {
  const trigger = requireProjectAction(tree, action, projectId);
  expectPopoverTrigger(trigger, action);
  const actualExpanded = readAriaExpanded(trigger, `${projectId} ${action}`);
  if (actualExpanded !== expanded) {
    throw new Error(
      `Expected ${projectId} ${action} aria-expanded to be ${String(expanded)}. Received ${JSON.stringify(trigger.props["aria-expanded"])}.`,
    );
  }
  expectPopoverMenu(tree, projectId, action, expanded);
  if (action === "move") return;

  const visibleActions = visibleMoreActionNames(tree, projectId);
  const expectedActions = expanded ? [...moreActionNames] : [];
  if (visibleActions.join(",") !== expectedActions.join(",")) {
    throw new Error(
      `Expected ${projectId} More actions ${JSON.stringify(expectedActions)}. Received ${JSON.stringify(visibleActions)}.`,
    );
  }
}

function expectPopoverTrigger(
  trigger: RenderedElement,
  action: "more" | "move",
): void {
  if (trigger.type !== "button" || trigger.props.type !== "button") {
    throw new Error(
      `Expected the ${action} trigger to be a button. Received type ${JSON.stringify(trigger.type)} and button type ${JSON.stringify(trigger.props.type)}.`,
    );
  }
  const triggerTarget = requireRenderedTarget(trigger);
  if (action === "more") {
    expectClassName(trigger.props.className, panelStyles.moreActionsSummary, "More trigger");
    expectClassName(triggerTarget.parentElement?.className, panelStyles.moreActions, "More trigger parent");
    if (triggerTarget.parentElement?.tagName !== "DIV") {
      throw new Error(
        `Expected the More trigger parent to be a div. Received ${JSON.stringify(triggerTarget.parentElement?.tagName)}.`,
      );
    }
    if (trigger.props["aria-label"] !== englishLibraryChromeCopy.moreActions) {
      throw new Error(
        `Expected the More trigger aria-label ${JSON.stringify(englishLibraryChromeCopy.moreActions)}. Received ${JSON.stringify(trigger.props["aria-label"])}.`,
      );
    }
    return;
  }

  expectClassName(trigger.props.className, panelStyles.iconActionButton, "Move trigger");
  if (trigger.props["aria-label"] !== englishLibraryChromeCopy.move) {
    throw new Error(
      `Expected the Move trigger aria-label ${JSON.stringify(englishLibraryChromeCopy.move)}. Received ${JSON.stringify(trigger.props["aria-label"])}.`,
    );
  }
}

function expectPopoverMenu(
  tree: ReactNode,
  projectId: string,
  action: "more" | "move",
  expanded: boolean,
): void {
  const menuId = readLibraryPopoverDomId(action, projectId);
  const trigger = requireProjectAction(tree, action, projectId);
  const menu = findAnyElement(
    requireProjectCard(tree, projectId),
    (element) => element.props.id === menuId,
  );
  if (!expanded) {
    if (trigger.props["aria-controls"] !== undefined) {
      throw new Error(
        `Expected closed ${projectId} ${action} to omit aria-controls. Received ${JSON.stringify(trigger.props["aria-controls"])}.`,
      );
    }
    if (menu) {
      throw new Error(`Expected closed ${projectId} ${action} menu ${JSON.stringify(menuId)} to be unmounted.`);
    }
    return;
  }

  if (trigger.props["aria-controls"] !== menuId) {
    throw new Error(
      `Expected open ${projectId} ${action} aria-controls to be ${JSON.stringify(menuId)}. Received ${JSON.stringify(trigger.props["aria-controls"])}.`,
    );
  }
  if (!menu || !isReactElementVisible(menu)) {
    throw new Error(`Expected open ${projectId} ${action} menu ${JSON.stringify(menuId)} to be mounted.`);
  }
  if (action === "more") {
    if (menu.type !== "div") {
      throw new Error(
        `Expected the More menu to be a div. Received ${JSON.stringify(menu.type)}.`,
      );
    }
    expectClassName(menu.props.className, panelStyles.moreActionsMenu, "More menu");
    return;
  }

  if (menu.type !== "div" || menu.props.role !== "group") {
    throw new Error(
      `Expected the Move menu to be a div group. Received type ${JSON.stringify(menu.type)} and role ${JSON.stringify(menu.props.role)}.`,
    );
  }
  expectClassName(menu.props.className, panelStyles.moveDestinations, "Move menu");
  if (menu.props["aria-label"] !== englishLibraryChromeCopy.move) {
    throw new Error(
      `Expected the Move menu aria-label ${JSON.stringify(englishLibraryChromeCopy.move)}. Received ${JSON.stringify(menu.props["aria-label"])}.`,
    );
  }
}

function expectClassName(
  className: unknown,
  expectedClassName: string,
  controlLabel: string,
): void {
  if (typeof expectedClassName !== "string" || expectedClassName.length === 0) {
    throw new Error(
      `Expected a public class for ${controlLabel}. Received ${JSON.stringify(expectedClassName)}.`,
    );
  }
  if (className !== expectedClassName) {
    throw new Error(
      `Expected ${controlLabel} class ${JSON.stringify(expectedClassName)}. Received ${JSON.stringify(className)}.`,
    );
  }
}

function expectOnlyExpandedPopover(tree: ReactNode, expectedPanels: readonly string[]): void {
  const expandedPanels = listExpandedMiniPanels(tree);
  if (expandedPanels.join(",") !== expectedPanels.join(",")) {
    throw new Error(
      `Expected expanded panels ${JSON.stringify(expectedPanels)}. Received ${JSON.stringify(expandedPanels)}.`,
    );
  }
  const mountedMenuIds = listMountedPopoverMenuIds(tree);
  if (mountedMenuIds.length !== expectedPanels.length) {
    throw new Error(
      `Expected ${String(expectedPanels.length)} mounted popover menu. Received ${JSON.stringify(mountedMenuIds)}.`,
    );
  }
  for (const panelName of expectedPanels) {
    const separatorIndex = panelName.lastIndexOf(":");
    const projectId = panelName.slice(0, separatorIndex);
    const action = panelName.slice(separatorIndex + 1);
    if (action !== "more" && action !== "move") {
      throw new Error(`Expected a more or move panel. Received ${JSON.stringify(panelName)}.`);
    }
    const menuId = readLibraryPopoverDomId(action, projectId);
    if (!mountedMenuIds.includes(menuId)) {
      throw new Error(
        `Expected mounted menu ${JSON.stringify(menuId)}. Received ${JSON.stringify(mountedMenuIds)}.`,
      );
    }
  }
}

function listMountedPopoverMenuIds(tree: ReactNode): string[] {
  const menuIds: string[] = [];
  visitRenderedElements(tree, (element) => {
    const menuId = element.props.id;
    if (typeof menuId !== "string") return;
    if (!/^local-project-(?:more|move)-menu-\S+$/.test(menuId)) return;
    menuIds.push(menuId);
  });
  return menuIds;
}

function listExpandedMiniPanels(tree: ReactNode): string[] {
  const expandedPanels: string[] = [];
  visitRenderedElements(tree, (element) => {
    const action = element.props["data-project-action"];
    if (action !== "more" && action !== "move") return;
    if (!readAriaExpanded(element, String(action))) return;
    const projectId = readOwnerProjectId(element);
    expandedPanels.push(`${projectId}:${action}`);
  });
  return expandedPanels;
}

function visitRenderedElements(
  node: ReactNode,
  visit: (element: RenderedElement) => void,
): void {
  if (Array.isArray(node)) {
    for (const child of node) visitRenderedElements(child, visit);
    return;
  }
  if (!React.isValidElement(node)) return;
  const rendered = node as RenderedElement;
  visit(rendered);
  visitRenderedElements(rendered.props.children as ReactNode, visit);
}

function readOwnerProjectId(element: RenderedElement): string {
  let current: LibraryPointerTarget | null = requireRenderedTarget(element);
  while (current) {
    const projectId = current.owner?.props["data-project-id"];
    if (typeof projectId === "string") return projectId;
    current = current.parentElement;
  }
  throw new Error(
    `Cannot find data-project-id for ${JSON.stringify(element.props["data-project-action"])}.`,
  );
}

function clickProjectAction(
  tree: ReactNode,
  action: string,
  projectId: string,
): LibraryPointerTarget {
  const control = requireVisibleProjectAction(tree, action, projectId);
  const onClick = control.props.onClick;
  if (typeof onClick !== "function") {
    throw new Error(
      `${projectId} ${action} has no click handler. Received ${JSON.stringify(onClick)}.`,
    );
  }
  const triggerTarget = requireRenderedTarget(control);
  const clickEvent = new LibraryDomEvent("click", triggerTarget);
  clickEvent.currentTarget = triggerTarget;
  onClick(clickEvent);
  return triggerTarget;
}

function activateRenderedControl(control: RenderedElement, actionLabel: string): void {
  const target = requireRenderedTarget(control);
  const pointerEvent = sendLibraryEvent("pointerdown", target);
  if (pointerEvent.propagationStopped || pointerEvent.defaultPrevented) {
    throw new Error(
      `Pointer down on ${actionLabel} stopped the original click. propagationStopped is ${String(pointerEvent.propagationStopped)}. defaultPrevented is ${String(pointerEvent.defaultPrevented)}.`,
    );
  }
  const mouseEvent = sendLibraryEvent("mousedown", target);
  if (mouseEvent.propagationStopped || mouseEvent.defaultPrevented) {
    throw new Error(
      `Mouse down on ${actionLabel} stopped the original click. propagationStopped is ${String(mouseEvent.propagationStopped)}. defaultPrevented is ${String(mouseEvent.defaultPrevented)}.`,
    );
  }
  const onClick = control.props.onClick;
  if (typeof onClick !== "function") {
    throw new Error(`${actionLabel} has no click handler. Received ${JSON.stringify(onClick)}.`);
  }
  const clickEvent = new LibraryDomEvent("click", target);
  clickEvent.currentTarget = target;
  onClick(clickEvent);
  if (clickEvent.propagationStopped) return;
  invokeReactHandlerChain(target.parentElement, "onClick", clickEvent);
  if (clickEvent.propagationStopped) return;
  dispatchLibraryPhase(documentListeners, clickEvent, false);
  if (!clickEvent.propagationStopped) dispatchLibraryPhase(windowListeners, clickEvent, false);
}

function reopenMoreActions(
  render: () => LocalProjectPanelTree,
  tree: LocalProjectPanelTree,
  projectId: string,
): LocalProjectPanelTree {
  if (visibleMoreActionNames(tree, projectId).includes("rename")) return tree;
  clickProjectAction(tree, "more", projectId);
  const openedTree = render();
  const visibleActions = visibleMoreActionNames(openedTree, projectId);
  if (!visibleActions.includes("rename")) {
    throw new Error(
      `Opening More for ${JSON.stringify(projectId)} did not show Rename. Visible actions: ${JSON.stringify(visibleActions)}.`,
    );
  }
  return openedTree;
}

function expectEscapeClosesOnlyMiniPanel(
  render: () => LocalProjectPanelTree,
  projectId: string,
  action: "more" | "move",
): void {
  let tree = render();
  const triggerTarget = clickProjectAction(tree, action, projectId);
  triggerTarget.focus.mockClear();
  tree = render();
  expectMiniPanelExpanded(tree, projectId, action, true);
  const firstEscape = sendLibraryEvent("keydown", triggerTarget, "Escape");
  if (!firstEscape.propagationStopped || !firstEscape.defaultPrevented) {
    throw new Error(
      `Escape on open ${action} for ${JSON.stringify(projectId)} did not stay inside the mini panel. propagationStopped is ${String(firstEscape.propagationStopped)}. defaultPrevented is ${String(firstEscape.defaultPrevented)}.`,
    );
  }
  if (triggerTarget.focus.mock.calls.length !== 1) {
    throw new Error(
      `Expected Escape to focus the ${action} trigger for ${JSON.stringify(projectId)} once. Focus calls: ${String(triggerTarget.focus.mock.calls.length)}.`,
    );
  }
  const activeElement = (globalThis.document as { activeElement?: unknown } | undefined)?.activeElement;
  if (activeElement !== triggerTarget) {
    throw new Error(
      `Expected Escape to leave focus on the ${action} trigger for ${JSON.stringify(projectId)}.`,
    );
  }
  tree = render();
  expectMiniPanelExpanded(tree, projectId, action, false);
  const secondEscape = sendLibraryEvent(
    "keydown",
    requireRenderedTarget(requireProjectAction(tree, action, projectId)),
    "Escape",
  );
  if (secondEscape.propagationStopped || secondEscape.defaultPrevented) {
    throw new Error(
      `The second Escape still stopped the outer Library after ${action} for ${JSON.stringify(projectId)} closed. propagationStopped is ${String(secondEscape.propagationStopped)}. defaultPrevented is ${String(secondEscape.defaultPrevented)}.`,
    );
  }
}

function sendLibraryEvent(
  eventType: "click" | "keydown" | "mousedown" | "pointerdown",
  target: LibraryPointerTarget,
  key?: string,
): LibraryDomEvent {
  const event = new LibraryDomEvent(eventType, target, key);
  dispatchLibraryPhase(windowListeners, event, true);
  dispatchLibraryPhase(documentListeners, event, true);
  if (!event.propagationStopped) {
    invokeReactHandlerChain(target, reactHandlerName(eventType), event);
  }
  if (!event.propagationStopped) dispatchLibraryPhase(documentListeners, event, false);
  if (!event.propagationStopped) dispatchLibraryPhase(windowListeners, event, false);
  return event;
}

function reactHandlerName(
  eventType: "click" | "keydown" | "mousedown" | "pointerdown",
): "onClick" | "onKeyDown" | "onMouseDown" | "onPointerDown" {
  if (eventType === "keydown") return "onKeyDown";
  if (eventType === "pointerdown") return "onPointerDown";
  if (eventType === "mousedown") return "onMouseDown";
  return "onClick";
}

function invokeReactHandlerChain(
  start: LibraryPointerTarget | null,
  handlerName: "onClick" | "onKeyDown" | "onMouseDown" | "onPointerDown",
  event: LibraryDomEvent,
): void {
  let current = start;
  while (current && !event.propagationStopped) {
    const handler = current.owner?.props[handlerName];
    if (typeof handler === "function") {
      event.currentTarget = current;
      handler(event);
    }
    current = current.parentElement;
  }
}

function dispatchLibraryPhase(
  listenerTarget: LibraryListenerTarget | null,
  event: LibraryDomEvent,
  capture: boolean,
): void {
  if (!listenerTarget) {
    throw new Error("Library DOM fixture is not installed.");
  }
  listenerTarget.dispatch(event, capture);
}

class LibraryDomEvent {
  currentTarget: LibraryPointerTarget | LibraryListenerTarget | null;
  defaultPrevented = false;
  immediateStopped = false;
  propagationStopped = false;
  readonly nativeEvent: LibraryDomEvent;
  readonly target: LibraryPointerTarget;

  constructor(
    readonly type: string,
    target: LibraryPointerTarget,
    readonly key?: string,
    readonly button = 0,
  ) {
    this.target = target;
    this.currentTarget = target;
    this.nativeEvent = this;
  }

  preventDefault(): void {
    this.defaultPrevented = true;
  }

  stopImmediatePropagation(): void {
    this.immediateStopped = true;
    this.propagationStopped = true;
  }

  stopPropagation(): void {
    this.propagationStopped = true;
  }
}

class LibraryListenerTarget {
  activeElement: LibraryPointerTarget | null = null;
  private listeners = new Map<string, Array<{
    capture: boolean;
    listener: (event: LibraryDomEvent) => void;
  }>>();

  addEventListener(
    type: string,
    listener: (event: LibraryDomEvent) => void,
    options?: boolean | { capture?: boolean },
  ): void {
    const capture = options === true || (typeof options === "object" && options.capture === true);
    const group = this.listeners.get(type) ?? [];
    group.push({ capture, listener });
    this.listeners.set(type, group);
  }

  removeEventListener(
    type: string,
    listener: (event: LibraryDomEvent) => void,
    options?: boolean | { capture?: boolean },
  ): void {
    const capture = options === true || (typeof options === "object" && options.capture === true);
    const group = this.listeners.get(type) ?? [];
    this.listeners.set(
      type,
      group.filter((entry) => entry.listener !== listener || entry.capture !== capture),
    );
  }

  dispatch(event: LibraryDomEvent, capture: boolean): void {
    const group = [...(this.listeners.get(event.type) ?? [])];
    for (const entry of group) {
      if (entry.capture !== capture || event.propagationStopped) continue;
      event.currentTarget = this;
      entry.listener(event);
      if (event.immediateStopped) return;
    }
  }

  getElementById(id: string): LibraryPointerTarget | null {
    for (const target of renderedTargets.values()) {
      if (target.id === id) return target;
    }
    return null;
  }

  querySelector(selector: string): LibraryPointerTarget | null {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector: string): LibraryPointerTarget[] {
    return [...renderedTargets.values()].filter((target) => matchesSelector(target, selector));
  }
}

class LibraryPointerTarget {
  children: LibraryPointerTarget[] = [];
  className = "";
  id = "";
  clientHeight = 600;
  clientWidth = 800;
  readonly focus = vi.fn(() => {
    if (!documentListeners) {
      throw new Error("Cannot focus a library control because the DOM fixture is not installed.");
    }
    documentListeners.activeElement = this;
  });
  readonly select = vi.fn();
  readonly isConnected: boolean;
  offsetHeight = 80;
  offsetWidth = 160;
  owner: RenderedElement;
  parentElement: LibraryPointerTarget | null = null;
  private attributes = new Map<string, string>();

  constructor(
    readonly tagName: string,
    owner: RenderedElement,
  ) {
    this.owner = owner;
    this.isConnected = tagName === "BUTTON";
  }

  get classList(): { contains: (className: string) => boolean } {
    const classNames = this.className.split(/\s+/).filter((className) => className.length > 0);
    return {
      contains: (className: string) => classNames.includes(className),
    };
  }

  closest(selector: string): LibraryPointerTarget | null {
    let current: LibraryPointerTarget | null = this;
    while (current) {
      if (matchesSelector(current, selector)) return current;
      current = current.parentElement;
    }
    return null;
  }

  contains(node: LibraryPointerTarget | null): boolean {
    let current = node;
    while (current) {
      if (current === this) return true;
      current = current.parentElement;
    }
    return false;
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  getBoundingClientRect(): {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
    x: number;
    y: number;
  } {
    return {
      bottom: 600,
      height: 600,
      left: 0,
      right: 800,
      top: 0,
      width: 800,
      x: 0,
      y: 0,
    };
  }

  hasAttribute(name: string): boolean {
    return this.attributes.has(name);
  }

  querySelector(selector: string): LibraryPointerTarget | null {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector: string): LibraryPointerTarget[] {
    const found: LibraryPointerTarget[] = [];
    const visit = (node: LibraryPointerTarget) => {
      for (const child of node.children) {
        if (matchesSelector(child, selector)) found.push(child);
        visit(child);
      }
    };
    visit(this);
    return found;
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }
}

function matchesSelector(element: LibraryPointerTarget, selector: string): boolean {
  return splitSelectors(selector).some((part) => matchesSimpleSelector(element, part));
}

function splitSelectors(selector: string): string[] {
  const parts: string[] = [];
  let current = "";
  let bracketDepth = 0;
  for (const character of selector) {
    if (character === "[") bracketDepth += 1;
    if (character === "]" && bracketDepth > 0) bracketDepth -= 1;
    if (character === "," && bracketDepth === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }
    current += character;
  }
  const lastPart = current.trim();
  if (lastPart.length > 0) parts.push(lastPart);
  if (parts.length === 0) {
    throw new Error(`Cannot match empty selector ${JSON.stringify(selector)}.`);
  }
  return parts;
}

function matchesSimpleSelector(element: LibraryPointerTarget, selector: string): boolean {
  if (selector.length === 0) {
    throw new Error("Cannot match an empty selector.");
  }
  let index = 0;
  let sawToken = false;
  while (index < selector.length) {
    const rest = selector.slice(index);
    if (rest.startsWith("[")) {
      const end = rest.indexOf("]");
      if (end < 1) {
        throw new Error(`Selector ${JSON.stringify(selector)} is missing ].`);
      }
      if (!attributeMatches(element, rest.slice(1, end))) return false;
      index += end + 1;
      sawToken = true;
      continue;
    }
    if (rest.startsWith(".")) {
      const classMatch = /^\.([_a-zA-Z0-9-]+)/.exec(rest);
      if (!classMatch) {
        throw new Error(`Cannot read a class in selector ${JSON.stringify(selector)}.`);
      }
      if (!element.classList.contains(classMatch[1])) return false;
      index += classMatch[0].length;
      sawToken = true;
      continue;
    }
    if (rest.startsWith("#")) {
      const idMatch = /^#([_a-zA-Z0-9-]+)/.exec(rest);
      if (!idMatch) {
        throw new Error(`Cannot read an id in selector ${JSON.stringify(selector)}.`);
      }
      if (element.id !== idMatch[1]) return false;
      index += idMatch[0].length;
      sawToken = true;
      continue;
    }
    const tagMatch = /^([a-zA-Z*][\w-]*)/.exec(rest);
    if (!tagMatch || sawToken) {
      throw new Error(
        `Cannot match selector ${JSON.stringify(selector)} at ${JSON.stringify(rest)}.`,
      );
    }
    if (tagMatch[1] !== "*" && element.tagName !== tagMatch[1].toUpperCase()) return false;
    index += tagMatch[1].length;
    sawToken = true;
  }
  return sawToken;
}

function attributeMatches(element: LibraryPointerTarget, attributeBody: string): boolean {
  const equalsIndex = attributeBody.indexOf("=");
  if (equalsIndex === -1) return element.hasAttribute(attributeBody.trim());
  const name = attributeBody.slice(0, equalsIndex).trim();
  let value = attributeBody.slice(equalsIndex + 1).trim();
  if (
    (value.startsWith("\"") && value.endsWith("\""))
    || (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  return element.getAttribute(name) === value;
}
