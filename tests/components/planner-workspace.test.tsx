/** @vitest-environment jsdom */

import { act, Component, createElement, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createProjectMapState } from "../../src/projects/local-project-editor-actions";
import type { LocalProjectStoreV2 } from "../../src/projects/local-project-store";
import type { LocalProjectV2 } from "../../src/projects/project-schema";
import { ReferenceProjectMigrationError } from "../../src/projects/reference-local-project-migration";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const workspaceTestDoubles = vi.hoisted(() => ({
  createBrowserLocalProjectStoreV2: vi.fn(),
  loadBuildingPlacementMetadata: vi.fn(),
  migrateReferenceProjectsIfNeeded: vi.fn(),
  plannerCanvasProperties: [] as Array<Record<string, unknown>>,
}));

vi.mock("../../src/catalog/building-placement-metadata-loader", () => ({
  loadBuildingPlacementMetadata: workspaceTestDoubles.loadBuildingPlacementMetadata,
}));

vi.mock("../../src/projects/local-project-store", () => ({
  createBrowserLocalProjectStoreV2:
    workspaceTestDoubles.createBrowserLocalProjectStoreV2,
}));

vi.mock("../../src/projects/reference-local-project-storage-migration", () => ({
  migrateReferenceProjectsIfNeeded:
    workspaceTestDoubles.migrateReferenceProjectsIfNeeded,
}));

vi.mock("../../src/components/editor-menu-bar", () => ({
  EditorMenuBar: ({
    onOpenModal,
  }: Readonly<{
    onOpenModal: (modalId: "save-panel") => void;
  }>) => createElement(
    "button",
    { onClick: () => onOpenModal("save-panel"), type: "button" },
    "Save",
  ),
}));

vi.mock("../../src/components/editor-modal", () => ({
  EditorModal: ({
    modalId,
    savePanelContent,
  }: Readonly<{
    modalId: string | null;
    savePanelContent?: ReactNode;
  }>) => modalId === "save-panel" ? savePanelContent ?? null : null,
}));

vi.mock("../../src/components/editor-toolbar", () => ({
  EditorToolbar: () => null,
}));

vi.mock("../../src/components/interior-decor-panel", () => ({
  InteriorDecorPanel: () => null,
}));

vi.mock("../../src/components/item-catalog-panel", () => ({
  ItemCatalogPanel: () => null,
}));

vi.mock("../../src/components/map-image-export-panel", () => ({
  MapImageExportPanel: () => null,
}));

vi.mock("../../src/components/planner-canvas", () => ({
  PlannerCanvas: (plannerCanvasProperties: Record<string, unknown>) => {
    workspaceTestDoubles.plannerCanvasProperties.push(plannerCanvasProperties);
    return null;
  },
}));

vi.mock("../../src/components/project-map-instance-panel", () => ({
  ProjectMapInstancePanel: () => null,
}));

import { PlannerWorkspace } from "../../src/components/planner-workspace";

type RenderedWorkspace = Readonly<{
  container: HTMLDivElement;
  root: Root;
}>;

type WorkspaceErrorBoundaryProperties = Readonly<{
  children?: ReactNode;
  onCaughtError: (caughtError: Error) => void;
}>;

type WorkspaceErrorBoundaryState = Readonly<{
  error: Error | null;
}>;

const mountedRoots: Root[] = [];

class WorkspaceErrorBoundary extends Component<
  WorkspaceErrorBoundaryProperties,
  WorkspaceErrorBoundaryState
> {
  state: WorkspaceErrorBoundaryState = { error: null };

  static getDerivedStateFromError(caughtError: Error): WorkspaceErrorBoundaryState {
    return { error: caughtError };
  }

  componentDidCatch(caughtError: Error): void {
    this.props.onCaughtError(caughtError);
  }

  render(): ReactNode {
    return this.state.error === null
      ? this.props.children
      : createElement("p", { role: "alert" }, this.state.error.message);
  }
}

afterEach(async () => {
  await act(async () => {
    for (const mountedRoot of mountedRoots.splice(0)) {
      mountedRoot.unmount();
    }
  });
  workspaceTestDoubles.createBrowserLocalProjectStoreV2.mockReset();
  workspaceTestDoubles.loadBuildingPlacementMetadata.mockReset();
  workspaceTestDoubles.migrateReferenceProjectsIfNeeded.mockReset();
  workspaceTestDoubles.plannerCanvasProperties.length = 0;
  document.body.replaceChildren();
});

describe("planner workspace", () => {
  it("renders the native planner entry point for the requested locale and map", () => {
    const plannerWorkspaceMarkup = renderToStaticMarkup(
      createElement(PlannerWorkspace, { locale: "zh-CN", initialMapId: "standard" }),
    );

    expect(plannerWorkspaceMarkup).toContain('aria-label="地图"');
    expect(plannerWorkspaceMarkup).toContain("标准农场");
  });

  it("uses localized map display names for farm and interior map IDs", () => {
    const riverlandMarkup = renderToStaticMarkup(
      createElement(PlannerWorkspace, { locale: "zh-CN", initialMapId: "riverland" }),
    );
    const barnMarkup = renderToStaticMarkup(
      createElement(PlannerWorkspace, { locale: "zh-CN", initialMapId: "barn" }),
    );

    expect(riverlandMarkup).toContain("河流农场");
    expect(riverlandMarkup).not.toContain(">Riverland Farm<");
    expect(barnMarkup).toContain("畜棚");
    expect(barnMarkup).not.toContain(">Barn<");
  });

  it("migrates browser storage before it opens the V2 store and drives create, save, open, and import through that store", async () => {
    const lifecycleEvents: string[] = [];
    const projectStore = createProjectStoreDouble(lifecycleEvents);
    workspaceTestDoubles.loadBuildingPlacementMetadata.mockResolvedValue({});
    workspaceTestDoubles.migrateReferenceProjectsIfNeeded.mockImplementation(() => {
      lifecycleEvents.push("migrate");
      return { status: "no-source" };
    });
    workspaceTestDoubles.createBrowserLocalProjectStoreV2.mockImplementation(() => {
      lifecycleEvents.push("create-v2-store");
      return projectStore;
    });

    const renderedWorkspace = await renderWorkspace(createElement(PlannerWorkspace, {
      locale: "en",
      initialMapId: "standard",
    }));

    expect(lifecycleEvents.slice(0, 2)).toEqual(["migrate", "create-v2-store"]);
    expect(workspaceTestDoubles.plannerCanvasProperties).toContainEqual(
      expect.objectContaining({
        mapId: "standard",
        placementSnapshot: expect.any(Object),
      }),
    );

    await clickButton(renderedWorkspace.container, "Save");
    await clickButton(renderedWorkspace.container, "New project");
    await clickButton(renderedWorkspace.container, "Save to this device");
    await clickButton(renderedWorkspace.container, "Open");
    await clickButton(renderedWorkspace.container, "Save");
    await importProjectFile(renderedWorkspace.container, "{\"formatVersion\":2}");

    expect(projectStore.createProject).toHaveBeenCalledTimes(1);
    expect(projectStore.saveMapInstanceState).toHaveBeenCalledTimes(2);
    expect(projectStore.openProject).toHaveBeenCalledWith("project-1");
    expect(projectStore.importProject).toHaveBeenCalledWith("{\"formatVersion\":2}");
  });

  it("shows a locale-specific known migration error instead of creating the V2 store", async () => {
    workspaceTestDoubles.loadBuildingPlacementMetadata.mockResolvedValue({});
    workspaceTestDoubles.migrateReferenceProjectsIfNeeded.mockImplementation(() => {
      throw new ReferenceProjectMigrationError("projects[0] is invalid");
    });

    const renderedWorkspace = await renderWorkspace(createElement(PlannerWorkspace, {
      locale: "zh-CN",
    }));

    await clickButton(renderedWorkspace.container, "Save");
    expect(renderedWorkspace.container.querySelector('[role="alert"]')?.textContent)
      .toContain("无法迁移现有的本地规划方案");
    expect(workspaceTestDoubles.createBrowserLocalProjectStoreV2).not.toHaveBeenCalled();
  });

  it("rethrows an unknown migration error from the effect", async () => {
    const unexpectedMigrationError = new Error("unexpected migration failure");
    workspaceTestDoubles.loadBuildingPlacementMetadata.mockResolvedValue({});
    workspaceTestDoubles.migrateReferenceProjectsIfNeeded.mockImplementation(() => {
      throw unexpectedMigrationError;
    });
    const onCaughtError = vi.fn();

    const renderedWorkspace = await renderWorkspace(
      createElement(
        WorkspaceErrorBoundary,
        { onCaughtError },
        createElement(PlannerWorkspace, { locale: "en" }),
      ),
    );

    expect(onCaughtError).toHaveBeenCalledTimes(1);
    expect(onCaughtError.mock.calls[0]?.[0]).toBe(unexpectedMigrationError);
    expect(workspaceTestDoubles.createBrowserLocalProjectStoreV2).not.toHaveBeenCalled();
  });
});

async function renderWorkspace(workspaceElement: ReactNode): Promise<RenderedWorkspace> {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container, {
    onCaughtError: () => undefined,
  });

  await act(async () => {
    root.render(workspaceElement);
    await Promise.resolve();
  });

  mountedRoots.push(root);

  return { container, root };
}

async function clickButton(container: HTMLElement, buttonLabel: string): Promise<void> {
  const matchingButton = Array.from(container.querySelectorAll("button")).find(
    (button) => button.textContent === buttonLabel,
  );

  if (matchingButton === undefined) {
    throw new Error(`Could not find planner workspace button ${JSON.stringify(buttonLabel)}.`);
  }

  await act(async () => {
    matchingButton.click();
    await Promise.resolve();
  });
}

async function importProjectFile(
  container: HTMLElement,
  serializedProject: string,
): Promise<void> {
  const importFileInput = container.querySelector<HTMLInputElement>(
    'input[type="file"][accept="application/json,.json"]',
  );

  if (importFileInput === null) {
    throw new Error("Could not find the planner workspace local-project import input.");
  }

  Object.defineProperty(importFileInput, "files", {
    configurable: true,
    value: [{ name: "imported-project.json", text: async () => serializedProject }],
  });

  await act(async () => {
    importFileInput.dispatchEvent(new Event("change", { bubbles: true }));
    await Promise.resolve();
  });
}

function createProjectStoreDouble(lifecycleEvents: string[]): LocalProjectStoreV2 {
  const project = createLocalProjectFixture();
  const projectSummary = {
    activeBaseMapId: "standard",
    activeMapInstanceId: "map-1",
    activeMapInstanceName: "Standard Farm",
    createdAt: project.createdAt,
    id: project.id,
    mapInstanceCount: 1,
    name: project.name,
    updatedAt: project.updatedAt,
  };

  return {
    copyMapInstance: vi.fn(),
    createMapInstance: vi.fn(),
    createProject: vi.fn(() => {
      lifecycleEvents.push("create-project");
      return project;
    }),
    deleteMapInstance: vi.fn(),
    deleteProject: vi.fn(),
    duplicateMapInstance: vi.fn(),
    duplicateProject: vi.fn(),
    exportProject: vi.fn(() => "{}"),
    importProject: vi.fn(() => {
      lifecycleEvents.push("import-project");
      return project;
    }),
    listProjects: vi.fn(() => [projectSummary]),
    moveMapInstance: vi.fn(),
    openProject: vi.fn(() => {
      lifecycleEvents.push("open-project");
      return project;
    }),
    renameMapInstance: vi.fn(),
    renameProject: vi.fn(),
    saveMapInstanceState: vi.fn(() => {
      lifecycleEvents.push("save-map");
      return project;
    }),
    switchActiveMapInstance: vi.fn(),
  } as unknown as LocalProjectStoreV2;
}

function createLocalProjectFixture(): LocalProjectV2 {
  return {
    activeMapInstanceId: "map-1",
    createdAt: "2026-07-27T00:00:00.000Z",
    formatVersion: 2,
    id: "project-1",
    mapInstances: {
      "map-1": {
        baseMapId: "standard",
        name: "Standard Farm",
        state: createProjectMapState("spring"),
      },
    },
    name: "Project One",
    updatedAt: "2026-07-27T00:00:00.000Z",
  };
}
