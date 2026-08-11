import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  importSerializedGameSave,
  loadCompleteGameSaveImportCatalog,
  PlannerGameSaveModalContent,
} from "../../src/components/planner-game-save-modal-content";
import type {
  Catalog,
  CatalogItem,
  CatalogPanelCategory,
} from "../../src/catalog";
import type { ParsedStardewGameSave } from "../../src/game-save/game-save-import";
import {
  openImportedGameSaveAndPreserveResult,
  openUnsavedImportedGameSave,
} from "../../src/planner/planner-workspace-game-save-import";
import {
  createGameSaveResultRetryLabel,
  createNextGameSaveResultLoadGeneration,
  PlannerGameSaveImportResultLoader,
} from "../../src/components/planner-game-save-import-result-loader";

const catalogItems: readonly CatalogItem[] = [
  {
    allowedTools: ["cursor"],
    category: "placeable",
    id: "object:wood",
    name: "Wood",
    sprite: { kind: "sprite-index", index: 0 },
    textureLocalPath: "/wood.png",
    tileSize: { width: 1, height: 1 },
  },
];

const parsedGameSave: ParsedStardewGameSave = {
  buildings: [],
  crops: [],
  farmName: "Mossy",
  floorings: [],
  objects: [],
  resourceClumps: [],
  season: "fall",
  trees: [],
  unmappedEntries: [{ kind: "mod", sourceId: "mod:lantern" }],
  whichFarm: "2",
};

describe("planner game-save modal content", () => {
  it("loads only the three required import categories in parallel and merges them once", async () => {
    const requestedCategories: CatalogPanelCategory[] = [];
    const categoryResolvers = new Map<
      CatalogPanelCategory,
      (catalog: Catalog) => void
    >();
    const catalogPromise = loadCompleteGameSaveImportCatalog((category) => {
      requestedCategories.push(category);
      return new Promise<Catalog>((resolveCatalog) => {
        categoryResolvers.set(category, resolveCatalog);
      });
    });

    expect(requestedCategories).toEqual([
      "buildings",
      "crops",
      "placeables",
    ]);
    expect(categoryResolvers.size).toBe(3);
    categoryResolvers.get("placeables")?.({ items: [catalogItems[0]!] });
    categoryResolvers.get("buildings")?.({
      items: [{ ...catalogItems[0]!, id: "building:Barn", category: "building" }],
    });
    categoryResolvers.get("crops")?.({
      items: [{ ...catalogItems[0]!, id: "crop:24", category: "crop" }],
    });

    await expect(catalogPromise).resolves.toEqual([
      expect.objectContaining({ id: "building:Barn" }),
      expect.objectContaining({ id: "crop:24" }),
      expect.objectContaining({ id: "object:wood" }),
    ]);
    expect(requestedCategories).not.toContain("decor");
  });

  it("fails fast for duplicate merged IDs and preserves the failing category", async () => {
    const duplicateCatalogItem = catalogItems[0]!;
    await expect(
      loadCompleteGameSaveImportCatalog(async () => ({
        items: [duplicateCatalogItem],
      })),
    ).rejects.toThrow('duplicate item ID "object:wood"');

    const categoryFailure = new Error("crops unavailable");
    const caughtCategoryFailure = await loadCompleteGameSaveImportCatalog(
      async (category) => {
        if (category === "crops") throw categoryFailure;
        return { items: [] };
      },
    ).catch((caughtError: unknown) => caughtError);

    expect(caughtCategoryFailure).toBeInstanceOf(Error);
    expect((caughtCategoryFailure as Error).message).toContain(
      'category "crops" failed: crops unavailable',
    );
    expect((caughtCategoryFailure as Error).cause).toBe(categoryFailure);
  });

  it("parses a game save, maps it with the ready catalog, and exposes the full import result", () => {
    const parseGameSave = vi.fn(() => parsedGameSave);
    const openImportedGameSave = vi.fn();

    const importedGameSaveState = importSerializedGameSave({
      catalogItems,
      onOpenImportedGameSave: openImportedGameSave,
      parseGameSave,
      serializedGameSave: "<SaveGame />",
    });

    expect(parseGameSave).toHaveBeenCalledWith("<SaveGame />");
    expect(importedGameSaveState).toMatchObject({
      farmName: "Mossy",
      mapId: "forest",
      season: "fall",
      unmappedEntries: [{ kind: "mod", sourceId: "mod:lantern" }],
    });
    expect(openImportedGameSave).toHaveBeenCalledWith(importedGameSaveState);
  });

  it("wraps the game-save controls in the Save branch with the upload copy", () => {
    const markup = renderToStaticMarkup(
      createElement(PlannerGameSaveModalContent, {
        catalogItems,
        onOpenImportedGameSave: () => undefined,
      }),
    );

    expect(markup).toContain(
      'class="planner-save-modal-content planner-save-modal-content--game-save"',
    );
    expect(markup).toContain(
      "Choose a Stardew Valley save file to preview the farm in this planner.",
    );
    expect(markup).toContain("Choose save file");
    expect(markup).toContain("game-save-import-control");
    expect(markup).toContain('type="file"');
  });

  it("clears the canonical project before opening the imported map as unsaved", () => {
    const operationOrder: string[] = [];
    const importedGameSaveState = importSerializedGameSave({
      catalogItems,
      onOpenImportedGameSave: () => undefined,
      parseGameSave: () => parsedGameSave,
      serializedGameSave: "<SaveGame />",
    });

    openUnsavedImportedGameSave({
      dispatchPlannerWorkspaceAction: (plannerWorkspaceAction) => {
        operationOrder.push("open-unsaved-imported-map");
        expect(plannerWorkspaceAction).toMatchObject({
          plannerMapId: "forest",
          season: "fall",
          type: "open-unsaved-imported-map",
        });
      },
      importedGameSaveState,
      workspaceController: {
        clearActiveProject: () => operationOrder.push("clear-active-project"),
      },
    });

    expect(operationOrder).toEqual([
      "clear-active-project",
      "open-unsaved-imported-map",
    ]);
  });

  it("keeps the complete import result only after the unsaved-map transition succeeds", () => {
    const operationOrder: string[] = [];
    const importedGameSaveState = importSerializedGameSave({
      catalogItems,
      onOpenImportedGameSave: () => undefined,
      parseGameSave: () => parsedGameSave,
      serializedGameSave: "<SaveGame />",
    });

    openImportedGameSaveAndPreserveResult({
      dispatchPlannerWorkspaceAction: () => operationOrder.push("open-unsaved-imported-map"),
      importedGameSaveState,
      onImportedGameSaveResult: (receivedImportedGameSaveState) => {
        operationOrder.push("preserve-import-result");
        expect(receivedImportedGameSaveState.unmappedEntries).toEqual([
          { kind: "mod", sourceId: "mod:lantern" },
        ]);
      },
      workspaceController: {
        clearActiveProject: () => operationOrder.push("clear-active-project"),
      },
    });

    expect(operationOrder).toEqual([
      "clear-active-project",
      "open-unsaved-imported-map",
      "preserve-import-result",
    ]);
  });

  it("keeps result delivery behind a dedicated lazy loader", () => {
    const markup = renderToStaticMarkup(
      createElement(PlannerGameSaveImportResultLoader, {
        importedGameSaveState: null,
        onClose: () => undefined,
      }),
    );

    expect(markup).toBe("");
  });

  it("creates an explicit retry label and advances the result-load generation", () => {
    expect(createGameSaveResultRetryLabel()).toBe("Retry result loading");
    expect(createNextGameSaveResultLoadGeneration(4)).toBe(5);
    expect(() =>
      createNextGameSaveResultLoadGeneration(Number.MAX_SAFE_INTEGER),
    ).toThrow(`received ${String(Number.MAX_SAFE_INTEGER)}`);
  });

  it("keeps result-loader recovery controls and new-result clearing in source", () => {
    const resultLoaderSource = readFileSync(
      resolve(process.cwd(), "src/components/planner-game-save-import-result-loader.tsx"),
      "utf8",
    );

    expect(resultLoaderSource).toContain("setResultLoadErrorMessage(null);");
    expect(resultLoaderSource).toContain("Retry result loading");
    expect(resultLoaderSource).toContain(">Close<");
    expect(resultLoaderSource).toContain("resultLoadGeneration");
  });

  it("stores the imported result above prepared-workspace resource reloads", () => {
    const workspaceSource = readFileSync(
      resolve(process.cwd(), "src/components/planner-workspace.tsx"),
      "utf8",
    );

    expect(workspaceSource).toContain("setImportedGameSaveResult");
    expect(workspaceSource).toContain("<PlannerGameSaveImportResultLoader");
    expect(workspaceSource).toContain("onImportedGameSaveResult={setImportedGameSaveResult}");
    expect(workspaceSource).toContain("openImportedGameSaveAndPreserveResult");
  });
});
