/** @vitest-environment jsdom */

import { act, createElement, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { localProjectV2StorageKey } from "../../src/projects/local-project-store";
import { referenceLocalProjectStorageKey } from "../../src/projects/reference-local-project-migration";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const workspaceIntegrationDoubles = vi.hoisted(() => ({
  loadBuildingPlacementMetadata: vi.fn(),
}));

vi.mock("../../src/catalog/building-placement-metadata-loader", () => ({
  loadBuildingPlacementMetadata:
    workspaceIntegrationDoubles.loadBuildingPlacementMetadata,
}));

vi.mock("../../src/components/editor-menu-bar", () => ({
  EditorMenuBar: ({ onOpenModal }: Readonly<{
    onOpenModal: (modalId: "save-panel") => void;
  }>) => createElement(
    "button",
    { onClick: () => onOpenModal("save-panel"), type: "button" },
    "Open local projects",
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
  PlannerCanvas: () => null,
}));

vi.mock("../../src/components/project-map-instance-panel", () => ({
  ProjectMapInstancePanel: () => null,
}));

import { PlannerWorkspace } from "../../src/components/planner-workspace";

const mountedRoots: Root[] = [];

afterEach(async () => {
  await act(async () => {
    for (const mountedRoot of mountedRoots.splice(0)) {
      mountedRoot.unmount();
    }
  });
  workspaceIntegrationDoubles.loadBuildingPlacementMetadata.mockReset();
  window.localStorage.clear();
  document.body.replaceChildren();
});

describe("planner workspace frozen-project migration", () => {
  it.each([
    ["zh-CN", "无法迁移现有的本地规划方案"],
    ["en", "Existing local plans could not be migrated"],
  ] as const)("shows the localized %s migration error without changing incompatible frozen storage", async (locale, localizedSummary) => {
    const incompatibleFrozenV1Source = createIncompatibleFrozenV1Source();
    window.localStorage.setItem(
      referenceLocalProjectStorageKey,
      incompatibleFrozenV1Source,
    );
    workspaceIntegrationDoubles.loadBuildingPlacementMetadata.mockResolvedValue({});

    const renderedWorkspace = await renderWorkspace(
      createElement(PlannerWorkspace, { locale }),
    );
    await clickButton(renderedWorkspace, "Open local projects");
    const migrationAlert = renderedWorkspace.querySelector('[role="alert"]');

    expect(migrationAlert?.textContent).toContain(localizedSummary);
    expect(migrationAlert?.textContent).toContain("projects[0].maps[0].decor");
    expect(migrationAlert?.textContent).toContain("MoreWalls:26");
    expect(window.localStorage.getItem(localProjectV2StorageKey)).toBeNull();
    expect(window.localStorage.getItem(referenceLocalProjectStorageKey))
      .toBe(incompatibleFrozenV1Source);
  });
});

async function renderWorkspace(workspaceElement: ReactNode): Promise<HTMLDivElement> {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container, { onCaughtError: () => undefined });

  await act(async () => {
    root.render(workspaceElement);
    await Promise.resolve();
  });

  mountedRoots.push(root);
  return container;
}

async function clickButton(container: HTMLElement, buttonLabel: string): Promise<void> {
  const matchingButton = Array.from(container.querySelectorAll("button")).find(
    (button) => button.textContent === buttonLabel,
  );

  if (matchingButton === undefined) {
    throw new Error(`Could not find integration-test button ${JSON.stringify(buttonLabel)}.`);
  }

  await act(async () => {
    matchingButton.click();
    await Promise.resolve();
  });
}

function createIncompatibleFrozenV1Source(): string {
  return JSON.stringify({
    version: 1,
    projects: [{
      id: "farm-001",
      title: "Spring Farm",
      created_at: "2026-07-27T00:00:00.000Z",
      updated_at: "2026-07-27T00:00:00.000Z",
      project: {
        version: 4,
        gameVersion: "1.6.15",
        projectName: "Spring Farm",
        season: "spring",
        activeMapId: "12",
        maps: [{
          id: "12",
          mapFile: "Farm.tmx",
          label: "Standard Layout",
          season: "spring",
          state: {
            buildings: [],
            crops: [],
            items: [],
            nextBuildingId: 1,
            nextItemId: 1,
          },
          decor: {
            wallpapers: { Bedroom: "MoreWalls:26" },
            floors: {},
          },
          renovations: [],
          thumbnail: "/api/projects/farm-001/maps/12/thumbnail",
        }],
      },
      thumbnailsByMapId: {},
    }],
  });
}
