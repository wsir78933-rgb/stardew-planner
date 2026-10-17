import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  Children,
  createElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

const workspaceSourcePath = join(
  process.cwd(),
  "src/components/planner-workspace.tsx",
);
const plannerWorkspaceStateSourcePath = join(
  process.cwd(),
  "src/planner/planner-workspace-state.ts",
);
const plannerWorkspacePersistenceSourcePath = join(
  process.cwd(),
  "src/planner/planner-workspace-persistence-runtime.ts",
);
const itemCatalogPanelSourcePath = join(
  process.cwd(),
  "src/components/item-catalog-panel.tsx",
);
const editorPlacementControllerSourcePath = join(
  process.cwd(),
  "src/editor/editor-placement-controller.ts",
);
import {
  createCatalogFromDatasets,
  createDefaultCatalogItemPresentationChoice,
  type CatalogItem,
} from "../../src/catalog";
import { catalogDatasetUrls } from "../../src/catalog/catalog-loader";
import { CatalogPlacementControls } from "../../src/components/catalog-placement-controls";
import { resolveCatalogItemCardSelectionChoice } from "../../src/components/item-catalog-panel";
import { SelectionInspector } from "../../src/components/selection-inspector";
import { getPlacementSelectionDetails } from "../../src/editor/editor-selection-controller";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";
import {
  createPlacementHistory,
  redoPlacementHistory,
  undoPlacementHistory,
  type PlacementHistory,
} from "../../src/placement/placement-history";
import {
  createEmptyPlacementSnapshot,
  type PlacementItem,
  type PlacementSnapshot,
} from "../../src/placement/placement-snapshot";
import {
  applyPlannerWorkspaceMapTileClick,
  applyPlannerWorkspaceMapTileRectangle,
  getPlannerWorkspaceCatalogItemSelectionTool,
  getPlannerWorkspaceToolSelection,
  isPlannerWorkspaceToolAvailable,
  isPlannerWorkspaceToolDisabled,
  setPlannerWorkspaceSelectedNightLightState,
} from "../../src/planner/planner-workspace-editing-controller";

describe("planner workspace Task5A feature-parity composition", () => {
  it("wires decor, transient X-ray, ordinary-action cancellation, and recoverable rejection feedback", () => {
    const workspaceSource = readFileSync(workspaceSourcePath, "utf8");

    expect(workspaceSource).toContain("<PlannerCanvas");
    expect(workspaceSource).toContain("activeInteriorDecorPattern={activeInteriorDecorPattern}");
    expect(workspaceSource).toContain("onInteriorDecorApply={handleInteriorDecorApply}");
    expect(workspaceSource).toContain("onInteriorDecorRejected={handleInteriorDecorRejected}");
    expect(workspaceSource).toContain("isXRayActive={isXRayActive}");
    expect(workspaceSource).toContain("handleOrdinaryCatalogItemSelect");
    expect(workspaceSource).toContain("handleOrdinaryToolChange");
    expect(workspaceSource).toContain("handlePlannerMapChange");
    expect(workspaceSource).toContain("handleOpenMapInstance");
    expect(workspaceSource).toContain("onOpenMapInstance={handleOpenMapInstance}");
    expect(workspaceSource).toContain("projectMapActions.onOpenMapInstance(mapInstanceId)");
    expect(workspaceSource).toContain("cancelInteriorDecorBeforeOrdinaryWorkspaceAction");
    expect(workspaceSource).toContain("getUnavailableInteriorDecorMessage");
    expect(workspaceSource).toContain(
      "plannerWorkspaceState.behaviorOptions.showToasts",
    );
    expect(workspaceSource).toContain('className="planner-workspace__toast"');
    expect(workspaceSource).toContain("window.setTimeout");
    expect(workspaceSource).toContain('aria-live="polite" role="status"');
  });

  it("routes unavailable catalog and invalid interior target rejections through one toast-aware notification transition", () => {
    const workspaceSource = readFileSync(workspaceSourcePath, "utf8");
    const rejectionHandlerStart = workspaceSource.indexOf(
      "const handleInteriorDecorRejected",
    );
    const catalogSelectionHandlerStart = workspaceSource.indexOf(
      "const handleOrdinaryCatalogItemSelect",
    );
    const ordinaryToolHandlerStart = workspaceSource.indexOf(
      "const handleOrdinaryToolChange",
    );
    if (
      rejectionHandlerStart < 0 ||
      catalogSelectionHandlerStart < 0 ||
      ordinaryToolHandlerStart < 0
    ) {
      throw new Error("Expected interior decor rejection and catalog selection handlers.");
    }

    const invalidTargetRejectionSource = workspaceSource.slice(
      rejectionHandlerStart,
      catalogSelectionHandlerStart,
    );
    const unavailableCatalogSelectionSource = workspaceSource.slice(
      catalogSelectionHandlerStart,
      ordinaryToolHandlerStart,
    );

    expect(workspaceSource).toContain("getNextInteriorDecorRejectionNotification");
    expect(invalidTargetRejectionSource).toContain(
      "showInteriorDecorRejectionMessage",
    );
    expect(unavailableCatalogSelectionSource).toContain(
      "showInteriorDecorRejectionMessage(unavailableInteriorDecorMessage)",
    );
  });

  it("keeps Task5A transient interaction fields out of reducer and persistence state", () => {
    const plannerWorkspaceStateSource = readFileSync(
      plannerWorkspaceStateSourcePath,
      "utf8",
    );
    const plannerWorkspacePersistenceSource = readFileSync(
      plannerWorkspacePersistenceSourcePath,
      "utf8",
    );

    for (const transientFieldName of [
      "activeInteriorDecorPattern",
      "interiorDecorRejectionMessage",
      "isXRayActive",
    ]) {
      expect(plannerWorkspaceStateSource).not.toContain(transientFieldName);
      expect(plannerWorkspacePersistenceSource).not.toContain(transientFieldName);
    }
  });

  it("wires pending pill choices through workspace, editing, and placement ports", () => {
    const workspaceSource = readFileSync(workspaceSourcePath, "utf8");
    const itemCatalogPanelSource = readFileSync(itemCatalogPanelSourcePath, "utf8");
    const editorPlacementControllerSource = readFileSync(
      editorPlacementControllerSourcePath,
      "utf8",
    );

    expect(itemCatalogPanelSource).toContain("catalogPresentationChoicesByItemId");
    expect(itemCatalogPanelSource).not.toContain("onCatalogItemPresentationChoiceChange");
    expect(itemCatalogPanelSource).not.toContain("item-catalog-panel__item-controls");
    expect(workspaceSource).toContain(
      "catalogPresentationChoicesByItemId={catalogPresentationChoicesByItemId}",
    );
    expect(workspaceSource).toContain(
      "<CatalogPlacementControls",
    );
    expect(workspaceSource).toContain(
      "placementMode={getCatalogPlacementMode(plannerWorkspaceState.tool)}",
    );
    expect(workspaceSource).not.toContain("isFilling=");
    expect(workspaceSource).toContain(
      "onCyclePendingChoice={cyclePendingCatalogChoice}",
    );
    expect(workspaceSource).toContain(
      "onCancel={clearSelectedCatalogItem}",
    );
    expect(workspaceSource).toContain("catalogPresentationChoice:");
    expect(editorPlacementControllerSource).toContain(
      "validateCatalogItemPresentationChoice",
    );
    expect(editorPlacementControllerSource).toContain(
      "rotationCapability.footprints",
    );
    expect(editorPlacementControllerSource).not.toContain(
      "createPersistentPlacementSnapshot({",
    );
    expect(workspaceSource).not.toContain("createPersistentPlacementSnapshot");
  });

  it("cancels a pending duplicate before applying any toolbar tool change", () => {
    const workspaceSource = readFileSync(workspaceSourcePath, "utf8");
    const toolChangeStart = workspaceSource.indexOf(
      "const handleOrdinaryToolChange",
    );
    const nextHandlerStart = workspaceSource.indexOf(
      "const handlePlannerMapChange",
      toolChangeStart,
    );
    if (toolChangeStart < 0 || nextHandlerStart < 0) {
      throw new Error("Expected ordinary tool and map change handlers in workspace source.");
    }
    const toolChangeSource = workspaceSource.slice(
      toolChangeStart,
      nextHandlerStart,
    );
    const cancelDuplicateIndex = toolChangeSource.indexOf(
      "workspaceEditingControls.cancelPendingDuplicateSelection()",
    );
    const applyToolIndex = toolChangeSource.indexOf("handleToolChange(tool)");

    expect(cancelDuplicateIndex).toBeGreaterThanOrEqual(0);
    expect(applyToolIndex).toBeGreaterThan(cancelDuplicateIndex);
    expect(workspaceSource).toContain(
      "pendingDuplicateSelectionKeys === null\n      ? applyPlannerWorkspaceMapTileClick",
    );
  });

  it("retains the grid reported by the current canvas map for subsequent tile clicks", () => {
    const workspaceSource = readFileSync(workspaceSourcePath, "utf8");

    expect(workspaceSource).not.toContain(
      "mapPlacementGridReference.current = null;",
    );
  });

  it("wires toolbar isToolDisabled and controller tool guards to eliminate invalid fill gaps", () => {
    const workspaceSource = readFileSync(workspaceSourcePath, "utf8");

    expect(workspaceSource).toContain("isPlannerWorkspaceToolDisabled");
    expect(workspaceSource).toContain(
      "isToolDisabled={(tool) =>\n          isPlannerWorkspaceToolDisabled(\n            tool,\n            selectedCatalogItem?.catalogItem ?? null,\n          )\n        }",
    );
    expect(workspaceSource).toContain(
      "if (\n        tool !== null &&\n        isPlannerWorkspaceToolDisabled(tool, currentCatalogItem)\n      ) {\n        return;\n      }",
    );
  });

  it("coordinates tool switching, material ordering, capability filtering, and state preservation", () => {
    const torchItem: CatalogItem = {
      allowedTools: ["cursor", "fill"],
      category: "placeable",
      id: "torch",
      name: "Torch",
      nightLight: { color: 0xffffff, radiusInTiles: 3 },
      sprite: { kind: "sprite-index", index: 93 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
      tileSize: { width: 1, height: 1 },
    };
    const wallpaperItem: CatalogItem = {
      allowedTools: ["cursor"],
      category: "decor",
      id: "wallpaper:1",
      name: "Wallpaper 1",
      sprite: { kind: "sprite-index", index: 0 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/walls_and_floors.png",
      tileSize: { width: 1, height: 1 },
    };

    // 1. Tool first: user selects Fill with no material selected
    expect(isPlannerWorkspaceToolDisabled("fill", null)).toBe(false);
    expect(isPlannerWorkspaceToolAvailable("fill", null)).toBe(true);
    const preselectedFill = getPlannerWorkspaceToolSelection("fill", null);
    expect(preselectedFill).toEqual({
      selectedCatalogItem: null,
      selectedCatalogItemId: null,
    });

    // 1a. User picks supported material while Fill is preselected -> keeps Fill
    expect(getPlannerWorkspaceCatalogItemSelectionTool("fill", torchItem)).toBe("fill");

    // 1b. User picks unsupported material while Fill is preselected -> drops to Cursor
    expect(getPlannerWorkspaceCatalogItemSelectionTool("fill", wallpaperItem)).toBe("cursor");

    // 2. Material first: user selects supported material (torch) in Cursor mode
    expect(getPlannerWorkspaceCatalogItemSelectionTool("cursor", torchItem)).toBe("cursor");
    expect(isPlannerWorkspaceToolDisabled("fill", torchItem)).toBe(false);
    expect(isPlannerWorkspaceToolAvailable("fill", torchItem)).toBe(true);
    // User switches to Fill -> keeps torch (preserves lit state / choice)
    const fillWithTorch = getPlannerWorkspaceToolSelection("fill", torchItem);
    expect(fillWithTorch).toEqual({
      selectedCatalogItem: torchItem,
      selectedCatalogItemId: "torch",
    });

    // 3. Material first: user selects unsupported material (wallpaper) in Cursor mode
    expect(getPlannerWorkspaceCatalogItemSelectionTool("cursor", wallpaperItem)).toBe("cursor");
    expect(isPlannerWorkspaceToolDisabled("fill", wallpaperItem)).toBe(true);
    expect(isPlannerWorkspaceToolAvailable("fill", wallpaperItem)).toBe(false);
    // Fill tool is rejected for wallpaper
    const fillWithWallpaper = getPlannerWorkspaceToolSelection("fill", wallpaperItem);
    expect(fillWithWallpaper).toEqual({
      selectedCatalogItem: null,
      selectedCatalogItemId: null,
    });

    // 4. Cursor tool always clears catalog selection for placement-selection mode
    expect(getPlannerWorkspaceToolSelection("cursor", torchItem)).toEqual({
      selectedCatalogItem: null,
      selectedCatalogItemId: null,
    });
  });
});

describe("planner workspace lighting catalog parity", () => {
  const lockedLightingCatalog = createLockedLightingCatalog();

  it("does not add a catalog lit switch to the other seven outdoor lights", async () => {
    const catalogItems = (await lockedLightingCatalog).items;
    const lightsWithoutCatalogLitSwitch = [
      "object:93",
      "big-craftable:152",
      "big-craftable:153",
      "object:746",
      "furniture_2331",
      "furniture_2397",
      "furniture_2398",
    ] as const;

    for (const catalogItemId of lightsWithoutCatalogLitSwitch) {
      const catalogItem = requireLightingCatalogItem(catalogItems, catalogItemId);
      const defaultChoice = createDefaultCatalogItemPresentationChoice(catalogItem);
      if (catalogItem.renderingMetadata?.kind === "lit-big-craftable") {
        throw new Error(
          `Expected ${catalogItem.id} to stay outside the lit big-craftable card switch; received ${catalogItem.renderingMetadata.kind}.`,
        );
      }
      expect(resolveCatalogItemCardSelectionChoice(catalogItem, defaultChoice, true))
        .toEqual(defaultChoice);
      expect(renderToStaticMarkup(createElement(CatalogPlacementControls, {
        catalogItem,
        locale: "en",
        onCancel: () => undefined,
        onCyclePendingChoice: () => false,
        placementMode: "place",
        presentationChoice: defaultChoice,
      }))).not.toContain('data-control="variant"');
    }
  });

  it("keeps furniture torch placement, fill, and inspector extinguish on variant", async () => {
    const catalogItems = (await lockedLightingCatalog).items;
    const furnitureTorchIds = [
      "furniture_2331",
      "furniture_2397",
      "furniture_2398",
    ] as const;
    const mapPlacementGrid = createLightingPlacementGrid(4, 4);

    for (const catalogItemId of furnitureTorchIds) {
      const catalogItem = requireLightingCatalogItem(catalogItems, catalogItemId);
      assertFurnitureTorchCapabilities(catalogItem);
      const defaultChoice = createDefaultCatalogItemPresentationChoice(catalogItem);
      expect(resolveCatalogItemCardSelectionChoice(catalogItem, defaultChoice, true))
        .toEqual(defaultChoice);

      const placed = placeLightingCatalogItem(
        catalogItem,
        defaultChoice,
        { x: 0, y: 0 },
        createPlacementHistory(createEmptyPlacementSnapshot()),
        mapPlacementGrid,
      );
      const placedItem = requireLightingItemAt(
        placed.placementHistory.currentState.items,
        catalogItem.id,
        0,
        0,
      );
      expect(placedItem.variant).toBe(0);
      expectAbsentLightingNightLightState(placedItem);
      const placedBeforeCardSwitch = structuredClone(placed.placementHistory.currentState.items);
      const switchedChoice = resolveCatalogItemCardSelectionChoice(
        catalogItem,
        defaultChoice,
        true,
      );
      expect(switchedChoice).toEqual(defaultChoice);
      expect(placed.placementHistory.currentState.items).toEqual(placedBeforeCardSwitch);

      const selectedPlacementKey = selectLightingPlacementAtTile(
        placed.placementHistory,
        { x: 0, y: 0 },
        mapPlacementGrid,
      );
      const selectionDetails = getPlacementSelectionDetails({
        catalogItems,
        placementSnapshot: placed.placementHistory.currentState,
        selectedPlacementKey,
      });
      if (selectionDetails.kind !== "item") {
        throw new Error(
          `Expected an item inspector for ${catalogItem.id}; received ${selectionDetails.kind}.`,
        );
      }
      expect(selectionDetails.canCycleAppearance).toBe(false);
      expect(selectionDetails.nightLightState).toBeUndefined();

      const extinguishedHistory = extinguishLightingSelection(
        catalogItems,
        placed.placementHistory,
        selectedPlacementKey,
      );
      const extinguishedItem = requireLightingItemForSelectionKey(
        extinguishedHistory.currentState,
        selectedPlacementKey,
      );
      expect(extinguishedItem.variant).toBe(1);
      expectAbsentLightingNightLightState(extinguishedItem);
      const extinguishedDetails = getPlacementSelectionDetails({
        catalogItems,
        placementSnapshot: extinguishedHistory.currentState,
        selectedPlacementKey,
      });
      if (extinguishedDetails.kind !== "item" || extinguishedDetails.nightLightState !== "off") {
        throw new Error(
          `Expected ${catalogItem.id} inspector night light to report off after extinguish; received ${JSON.stringify(extinguishedDetails)}.`,
        );
      }

      const undoneExtinguish = undoPlacementHistory(extinguishedHistory);
      const restoredItem = requireLightingItemForSelectionKey(
        undoneExtinguish.currentState,
        selectedPlacementKey,
      );
      expect(restoredItem.variant).toBe(0);
      expectAbsentLightingNightLightState(restoredItem);
      const redoneItem = requireLightingItemForSelectionKey(
        redoPlacementHistory(undoneExtinguish).currentState,
        selectedPlacementKey,
      );
      expect(redoneItem.variant).toBe(1);
      expectAbsentLightingNightLightState(redoneItem);

      if (catalogItem.id !== "furniture_2331") {
        continue;
      }
      const filled = fillLightingCatalogItem(
        catalogItem,
        defaultChoice,
        createPlacementHistory(createEmptyPlacementSnapshot()),
        mapPlacementGrid,
      );
      expect(filled.placementHistory.currentState.items).toHaveLength(2);
      for (const fillOrigin of [{ x: 0, y: 0 }, { x: 1, y: 0 }] as const) {
        const filledItem = requireLightingItemAt(
          filled.placementHistory.currentState.items,
          catalogItem.id,
          fillOrigin.x,
          fillOrigin.y,
        );
        expect(filledItem.variant).toBe(0);
        expectAbsentLightingNightLightState(filledItem);
      }
      const filledBeforeCardSwitch = structuredClone(filled.placementHistory.currentState.items);
      resolveCatalogItemCardSelectionChoice(catalogItem, defaultChoice, true);
      expect(filled.placementHistory.currentState.items).toEqual(filledBeforeCardSwitch);
    }
  });
});

function assertFurnitureTorchCapabilities(catalogItem: CatalogItem): void {
  if (catalogItem.furnitureFire?.kind !== "torch") {
    throw new Error(
      `Expected furniture fire torch for ${catalogItem.id}; received ${JSON.stringify(catalogItem.furnitureFire ?? null)}.`,
    );
  }
  if (catalogItem.nightLight === undefined) {
    throw new Error(`Expected night-light metadata for ${catalogItem.id}.`);
  }
  if (catalogItem.nightLight.radiusInTiles !== 3) {
    throw new Error(
      `Expected night-light radius 3 for ${catalogItem.id}; received ${String(catalogItem.nightLight.radiusInTiles)}.`,
    );
  }
  if (catalogItem.presentationCapabilities?.variantCycle !== null) {
    throw new Error(
      `Expected no variant cycle for ${catalogItem.id}; received ${JSON.stringify(catalogItem.presentationCapabilities?.variantCycle)}.`,
    );
  }
  if (catalogItem.presentationCapabilities?.rotation?.count !== 1) {
    throw new Error(
      `Expected rotation count 1 for ${catalogItem.id}; received ${JSON.stringify(catalogItem.presentationCapabilities?.rotation ?? null)}.`,
    );
  }
  if (!catalogItem.allowedTools.includes("cursor") || !catalogItem.allowedTools.includes("fill")) {
    throw new Error(
      `Expected ${catalogItem.id} to keep cursor and fill; received ${JSON.stringify(catalogItem.allowedTools)}.`,
    );
  }
}

function placeLightingCatalogItem(
  catalogItem: CatalogItem,
  presentationChoice: ReturnType<typeof createDefaultCatalogItemPresentationChoice>,
  cursorTile: Readonly<{ x: number; y: number }>,
  placementHistory: PlacementHistory<PlacementSnapshot>,
  mapPlacementGrid: MapPlacementGrid,
) {
  return applyPlannerWorkspaceMapTileClick({
    buildingMetadataById: {},
    catalogPresentationChoice: presentationChoice,
    cursorTile,
    freePlacement: true,
    mapPlacementGrid,
    placementHistory,
    selectedCatalogItem: catalogItem,
    selectedPlacementKeys: [],
    tool: "cursor",
  });
}

function fillLightingCatalogItem(
  catalogItem: CatalogItem,
  presentationChoice: ReturnType<typeof createDefaultCatalogItemPresentationChoice>,
  placementHistory: PlacementHistory<PlacementSnapshot>,
  mapPlacementGrid: MapPlacementGrid,
) {
  return applyPlannerWorkspaceMapTileRectangle({
    buildingMetadataById: {},
    catalogPresentationChoice: presentationChoice,
    firstTile: { x: 0, y: 0 },
    freePlacement: true,
    mapPlacementGrid,
    placementHistory,
    secondTile: { x: 1, y: 0 },
    selectedCatalogItem: catalogItem,
    selectedPlacementKeys: [],
    tool: "fill",
  });
}

function selectLightingPlacementAtTile(
  placementHistory: PlacementHistory<PlacementSnapshot>,
  cursorTile: Readonly<{ x: number; y: number }>,
  mapPlacementGrid: MapPlacementGrid,
): string {
  const selection = applyPlannerWorkspaceMapTileClick({
    buildingMetadataById: {},
    catalogPresentationChoice: null,
    cursorTile,
    freePlacement: true,
    mapPlacementGrid,
    placementHistory,
    selectedCatalogItem: null,
    selectedPlacementKeys: [],
    tool: "cursor",
  });
  const selectedPlacementKey = selection.selectedPlacementKeys[0];
  if (selection.selectedPlacementKeys.length !== 1 || selectedPlacementKey === undefined) {
    throw new Error(
      `Expected one selection at ${String(cursorTile.x)},${String(cursorTile.y)}; received ${JSON.stringify(selection.selectedPlacementKeys)}.`,
    );
  }
  return selectedPlacementKey;
}

function extinguishLightingSelection(
  catalogItems: readonly CatalogItem[],
  placementHistory: PlacementHistory<PlacementSnapshot>,
  selectedPlacementKey: string,
): PlacementHistory<PlacementSnapshot> {
  const selectionDetails = getPlacementSelectionDetails({
    catalogItems,
    placementSnapshot: placementHistory.currentState,
    selectedPlacementKey,
  });
  if (selectionDetails.kind !== "item") {
    throw new Error(
      `Expected an item inspector for ${JSON.stringify(selectedPlacementKey)}; received ${selectionDetails.kind}.`,
    );
  }
  const catalogItem = requireLightingCatalogItem(catalogItems, selectionDetails.catalogItemId);
  if (catalogItem.nightLight === undefined) {
    throw new Error(`Expected night-light metadata for placed ${catalogItem.id}.`);
  }
  let requestedNightLightState: "off" | undefined | null = null;
  const inspector = SelectionInspector({
    kind: "single",
    onCopy: () => undefined,
    onCycleAppearance: () => undefined,
    onDelete: () => undefined,
    onDismiss: () => undefined,
    onNightLightStateChange: (nightLightState) => {
      requestedNightLightState = nightLightState;
    },
    onTintChange: () => undefined,
    selection: {
      canCycleAppearance: selectionDetails.canCycleAppearance,
      canPaint: catalogItem.paintableChest !== undefined,
      entityName: catalogItem.name,
      isNightLight: true,
      kind: "item",
      nightLightState: selectionDetails.nightLightState,
      tintColor: selectionDetails.tintColor,
    },
  });
  const extinguishButton = findLightingButtonByAriaLabel(inspector, "Extinguish selected light");
  const clickExtinguish = extinguishButton.props.onClick;
  if (clickExtinguish === undefined) {
    throw new Error(`Extinguish button for ${catalogItem.id} has no click handler.`);
  }
  clickExtinguish();
  if (requestedNightLightState !== "off") {
    throw new Error(
      `Extinguish for ${catalogItem.id} requested ${JSON.stringify(requestedNightLightState)}.`,
    );
  }
  return setPlannerWorkspaceSelectedNightLightState({
    catalogItems,
    nightLightState: requestedNightLightState,
    placementHistory,
    selectedPlacementKeys: [selectedPlacementKey],
  }).placementHistory;
}

function findLightingButtonByAriaLabel(
  node: ReactNode,
  ariaLabel: string,
): ReactElement<Readonly<{ onClick?: () => void }>> {
  const buttons = collectLightingAriaButtons(node);
  const matchedButton = buttons.find((button) => button.props["aria-label"] === ariaLabel);
  if (matchedButton === undefined) {
    throw new Error(
      `Expected a button labeled ${JSON.stringify(ariaLabel)}; received ${JSON.stringify(buttons.map((button) => button.props["aria-label"] ?? ""))}.`,
    );
  }
  return matchedButton;
}

function collectLightingAriaButtons(
  node: ReactNode,
): ReactElement<Readonly<{ "aria-label"?: string; onClick?: () => void }>>[] {
  const buttons: ReactElement<Readonly<{ "aria-label"?: string; onClick?: () => void }>>[] = [];
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) {
      continue;
    }
    const properties = child.props as Readonly<{
      "aria-label"?: string;
      children?: ReactNode;
      onClick?: () => void;
    }>;
    if (typeof properties["aria-label"] === "string" && typeof properties.onClick === "function") {
      buttons.push(child as ReactElement<Readonly<{ "aria-label"?: string; onClick?: () => void }>>);
    }
    if (properties.children !== undefined) {
      buttons.push(...collectLightingAriaButtons(properties.children));
    }
  }
  return buttons;
}

function requireLightingCatalogItem(
  catalogItems: readonly CatalogItem[],
  itemId: string,
): CatalogItem {
  const catalogItem = catalogItems.find((candidateItem) => candidateItem.id === itemId);
  if (catalogItem === undefined) {
    throw new Error(`Expected locked catalog item ${JSON.stringify(itemId)}.`);
  }
  return catalogItem;
}

function requireLightingItemAt(
  placementItems: readonly PlacementItem[],
  itemId: string,
  x: number,
  y: number,
): PlacementItem {
  const matches = placementItems.filter(
    (placementItem) => placementItem.itemId === itemId
      && placementItem.x === x
      && placementItem.y === y,
  );
  const placedItem = matches[0];
  if (matches.length !== 1 || placedItem === undefined) {
    throw new Error(
      `Expected one ${itemId} at ${String(x)},${String(y)}; received ${String(matches.length)} of ${String(placementItems.length)} items.`,
    );
  }
  return placedItem;
}

function requireLightingItemForSelectionKey(
  placementSnapshot: PlacementSnapshot,
  selectedPlacementKey: string,
): PlacementItem {
  const itemKeyPrefix = "item:";
  if (!selectedPlacementKey.startsWith(itemKeyPrefix)) {
    throw new Error(
      `Expected an item selection key; received ${JSON.stringify(selectedPlacementKey)}.`,
    );
  }
  const instanceId = Number(selectedPlacementKey.slice(itemKeyPrefix.length));
  if (!Number.isSafeInteger(instanceId)) {
    throw new Error(
      `Expected an item instance id; received ${JSON.stringify(selectedPlacementKey)}.`,
    );
  }
  const placementItem = placementSnapshot.items.find(
    (candidateItem) => candidateItem.instanceId === instanceId,
  );
  if (placementItem === undefined) {
    throw new Error(
      `Expected placement item for ${JSON.stringify(selectedPlacementKey)}; received instance ids ${JSON.stringify(placementSnapshot.items.map((candidateItem) => candidateItem.instanceId))}.`,
    );
  }
  return placementItem;
}

function expectAbsentLightingNightLightState(placementItem: PlacementItem): void {
  if (Object.hasOwn(placementItem, "nightLightState")) {
    throw new Error(
      `Placed ${placementItem.itemId} at ${String(placementItem.x)},${String(placementItem.y)} has nightLightState ${JSON.stringify(placementItem.nightLightState)}.`,
    );
  }
}

function createLightingPlacementGrid(width: number, height: number): MapPlacementGrid {
  return {
    width,
    height,
    capabilitiesByTile: Array.from({ length: width * height }, () => ({
      buildable: true,
      crabPot: false,
      diggable: true,
      passable: true,
      treePlantable: true,
      treePlantableOnDirt: true,
      wall: false,
    })),
  };
}

async function createLockedLightingCatalog() {
  const datasetDirectory = join(process.cwd(), "public/game-assets/1.6.15/data");
  const readDataset = async (filename: string) =>
    JSON.parse(await readFile(join(datasetDirectory, filename), "utf8")) as unknown;

  return createCatalogFromDatasets({
    bigCraftables: await readDataset("BigCraftables.json"),
    buildings: await readDataset("Buildings.json"),
    crops: await readDataset("Crops.json"),
    fences: await readDataset("Fences.json"),
    floorsAndPaths: await readDataset("FloorsAndPaths.json"),
    fruitTrees: await readDataset("FruitTrees.json"),
    furniture: await readDataset("Furniture.json"),
    objects: await readDataset("Objects.json"),
  }, catalogDatasetUrls);
}
