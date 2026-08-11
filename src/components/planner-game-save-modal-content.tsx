"use client";

import {
  loadCatalogCategory,
  type Catalog,
  type CatalogItem,
  type CatalogPanelCategory,
} from "../catalog";
import {
  createImportedGameSaveState,
  type ImportedGameSaveState,
  type ParsedStardewGameSave,
} from "../game-save/game-save-import";
import { parseStardewGameSaveXml } from "../game-save/stardew-save-xml";
import {
  GameSaveImportControl,
  GameSaveImportResultModal,
} from "./game-save-import-panel";

type PlannerGameSaveModalContentProperties = Readonly<{
  catalogItems: readonly CatalogItem[];
  onOpenImportedGameSave: (importedGameSaveState: ImportedGameSaveState) => void;
}>;

type ImportSerializedGameSaveInput = PlannerGameSaveModalContentProperties &
  Readonly<{
    parseGameSave: (serializedGameSave: string) => ParsedStardewGameSave;
    serializedGameSave: string;
  }>;

const gameSaveImportCatalogCategories = [
  "buildings",
  "crops",
  "placeables",
] as const satisfies readonly CatalogPanelCategory[];

type GameSaveImportCatalogCategoryLoader = (
  category: CatalogPanelCategory,
) => Promise<Catalog>;

export async function loadCompleteGameSaveImportCatalog(
  loadCategory: GameSaveImportCatalogCategoryLoader = loadCatalogCategory,
): Promise<readonly CatalogItem[]> {
  const categoryCatalogs = await Promise.all(
    gameSaveImportCatalogCategories.map((category) =>
      loadGameSaveImportCatalogCategory(category, loadCategory),
    ),
  );

  return mergeGameSaveImportCatalogs(categoryCatalogs);
}

async function loadGameSaveImportCatalogCategory(
  category: CatalogPanelCategory,
  loadCategory: GameSaveImportCatalogCategoryLoader,
): Promise<Catalog> {
  try {
    return await loadCategory(category);
  } catch (caughtError) {
    const errorMessage = caughtError instanceof Error
      ? caughtError.message
      : String(caughtError);
    throw new Error(
      `Game-save import catalog category ${JSON.stringify(category)} failed: ${errorMessage}`,
      { cause: caughtError },
    );
  }
}

function mergeGameSaveImportCatalogs(
  categoryCatalogs: readonly Catalog[],
): readonly CatalogItem[] {
  const mergedCatalogItems: CatalogItem[] = [];
  const mergedCatalogItemIds = new Set<string>();

  for (const categoryCatalog of categoryCatalogs) {
    for (const catalogItem of categoryCatalog.items) {
      if (mergedCatalogItemIds.has(catalogItem.id)) {
        throw new Error(
          `Game-save import catalog has duplicate item ID ${JSON.stringify(catalogItem.id)}.`,
        );
      }
      mergedCatalogItemIds.add(catalogItem.id);
      mergedCatalogItems.push(catalogItem);
    }
  }

  return mergedCatalogItems;
}

export function PlannerGameSaveModalContent({
  catalogItems,
  onOpenImportedGameSave,
}: PlannerGameSaveModalContentProperties) {
  function handleImportGameSave(serializedGameSave: string): void {
    importSerializedGameSave({
      catalogItems,
      onOpenImportedGameSave,
      parseGameSave: parseStardewGameSaveXml,
      serializedGameSave,
    });
  }

  return (
    <div className="planner-save-modal-content planner-save-modal-content--game-save">
      <GameSaveImportControl onImportGameSave={handleImportGameSave} />
    </div>
  );
}

export function PlannerGameSaveImportResultContent({
  importedGameSaveState,
  onClose,
}: Readonly<{
  importedGameSaveState: ImportedGameSaveState;
  onClose: () => void;
}>) {
  return (
    <GameSaveImportResultModal
      importedGameSaveState={importedGameSaveState}
      onClose={onClose}
    />
  );
}

export function importSerializedGameSave({
  catalogItems,
  onOpenImportedGameSave,
  parseGameSave,
  serializedGameSave,
}: ImportSerializedGameSaveInput): ImportedGameSaveState {
  const parsedGameSave = parseGameSave(serializedGameSave);
  const importedGameSaveState = createImportedGameSaveState(
    parsedGameSave,
    catalogItems,
  );
  onOpenImportedGameSave(importedGameSaveState);
  return importedGameSaveState;
}
