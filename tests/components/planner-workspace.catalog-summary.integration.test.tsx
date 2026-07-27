/** @vitest-environment jsdom */

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Catalog, CatalogItem } from "../../src/catalog";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const workspaceIntegrationDoubles = vi.hoisted(() => ({
  createBrowserLocalProjectStoreV2: vi.fn(),
  loadBuildingPlacementMetadata: vi.fn(),
  loadCatalog: vi.fn(),
  migrateReferenceProjectsIfNeeded: vi.fn(),
  plannerCanvasProperties: [] as Array<Record<string, unknown>>,
}));

vi.mock("../../src/catalog", () => ({
  loadCatalog: workspaceIntegrationDoubles.loadCatalog,
}));

vi.mock("../../src/catalog/building-placement-metadata-loader", () => ({
  loadBuildingPlacementMetadata:
    workspaceIntegrationDoubles.loadBuildingPlacementMetadata,
}));

vi.mock("../../src/projects/local-project-store", () => ({
  createBrowserLocalProjectStoreV2:
    workspaceIntegrationDoubles.createBrowserLocalProjectStoreV2,
}));

vi.mock("../../src/projects/reference-local-project-storage-migration", () => ({
  migrateReferenceProjectsIfNeeded:
    workspaceIntegrationDoubles.migrateReferenceProjectsIfNeeded,
}));

vi.mock("../../src/components/planner-canvas", () => ({
  PlannerCanvas: (plannerCanvasProperties: Record<string, unknown>) => {
    workspaceIntegrationDoubles.plannerCanvasProperties.push(plannerCanvasProperties);
    const onMapPlacementGridReady = plannerCanvasProperties.onMapPlacementGridReady as
      | ((mapId: string, mapPlacementGrid: MapPlacementGrid) => void)
      | undefined;
    const onMapTileClick = plannerCanvasProperties.onMapTileClick as
      | ((mapId: string, mapTile: Readonly<{ x: number; y: number }>) => void)
      | undefined;

    onMapPlacementGridReady?.("standard", createPassablePlacementGrid());

    return createElement(
      "button",
      {
        onClick: () => onMapTileClick?.("standard", { x: 0, y: 0 }),
        type: "button",
      },
      "Place selected catalog item",
    );
  },
}));

import { PlannerWorkspace } from "../../src/components/planner-workspace";

const mountedRoots: Root[] = [];

const stoneCatalogItem: CatalogItem = {
  id: "object:390",
  name: "Stone",
  category: "placeable",
  tileSize: { width: 1, height: 1 },
  textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
  sprite: { kind: "sprite-index", index: 390 },
  allowedTools: ["cursor", "multi-select", "erase"],
};

afterEach(async () => {
  await act(async () => {
    for (const mountedRoot of mountedRoots.splice(0)) {
      mountedRoot.unmount();
    }
  });
  workspaceIntegrationDoubles.createBrowserLocalProjectStoreV2.mockReset();
  workspaceIntegrationDoubles.loadBuildingPlacementMetadata.mockReset();
  workspaceIntegrationDoubles.loadCatalog.mockReset();
  workspaceIntegrationDoubles.migrateReferenceProjectsIfNeeded.mockReset();
  workspaceIntegrationDoubles.plannerCanvasProperties.length = 0;
  document.body.replaceChildren();
});

describe("planner workspace Chinese catalog and summary flow", () => {
  it("keeps a typed Chinese query, selects the original catalog ID, and renders its Chinese summary", async () => {
    const catalog: Catalog = { items: [stoneCatalogItem] };
    workspaceIntegrationDoubles.createBrowserLocalProjectStoreV2.mockReturnValue({
      listProjects: () => [],
    });
    workspaceIntegrationDoubles.loadBuildingPlacementMetadata.mockResolvedValue({});
    workspaceIntegrationDoubles.loadCatalog.mockResolvedValue(catalog);

    const container = await renderPlannerWorkspace();
    await flushReactEffects();
    await clickButton(container, "可摆放物品");
    await changeSearchQuery(container, "石头");

    const searchInput = container.querySelector<HTMLInputElement>('input[type="search"]');
    expect(searchInput?.value).toBe("石头");
    const catalogItemButton = findButton(container, "选择 石头，1 × 1 格");
    await clickElement(catalogItemButton);
    await clickButton(container, "Place selected catalog item");

    const currentPlacementSnapshot = workspaceIntegrationDoubles
      .plannerCanvasProperties
      .at(-1)?.placementSnapshot as Readonly<{ items: readonly Readonly<{ itemId: string }>[] }>;
    expect(currentPlacementSnapshot.items[0]?.itemId).toBe("object:390");

    await clickButton(container, "保存");
    await clickButton(container, "农场汇总");

    expect(container.textContent).toContain("物品 (1)");
    expect(container.textContent).toContain("石头");
  });
});

async function renderPlannerWorkspace(): Promise<HTMLDivElement> {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(createElement(PlannerWorkspace, { initialMapId: "standard", locale: "zh-CN" }));
    await Promise.resolve();
  });

  mountedRoots.push(root);
  return container;
}

async function flushReactEffects(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

async function changeSearchQuery(container: HTMLElement, value: string): Promise<void> {
  const searchInput = container.querySelector<HTMLInputElement>('input[type="search"]');

  if (searchInput === null) {
    throw new Error("Planner workspace catalog search input is unavailable.");
  }

  const valueSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;

  if (valueSetter === undefined) {
    throw new Error("HTMLInputElement value setter is unavailable.");
  }

  await act(async () => {
    valueSetter.call(searchInput, value);
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    await Promise.resolve();
  });
}

async function clickButton(container: HTMLElement, label: string): Promise<void> {
  await clickElement(findButton(container, label));
}

function findButton(container: HTMLElement, label: string): HTMLButtonElement {
  const matchingButton = Array.from(container.querySelectorAll("button")).find(
    (button) => button.textContent === label || button.getAttribute("aria-label") === label,
  );

  if (matchingButton === undefined) {
    throw new Error(`Could not find button ${JSON.stringify(label)}.`);
  }

  return matchingButton;
}

async function clickElement(button: HTMLButtonElement): Promise<void> {
  await act(async () => {
    button.click();
    await Promise.resolve();
  });
}

function createPassablePlacementGrid(): MapPlacementGrid {
  return {
    width: 1,
    height: 1,
    capabilitiesByTile: [{
      buildable: true,
      crabPot: false,
      diggable: true,
      passable: true,
      treePlantable: false,
      treePlantableOnDirt: false,
    }],
  };
}
