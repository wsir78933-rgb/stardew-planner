import type {
  Catalog,
  CatalogItem,
  CatalogPanelCategory,
} from "../catalog";
import { isGiantCropCatalogItemId } from "../catalog";
import {
  createPersistentPlacementSnapshot,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";
import type { ReferenceOpenMapSession } from "../reference-runtime/reference-project-editor-adapter";
import {
  getCurrentCanonicalSession,
  type PlannerWorkspaceCanonicalIdentity,
} from "./planner-workspace-canonical-session";

export type RequiredPlacementCatalogItem = Readonly<{
  category: CatalogPanelCategory;
  itemId: string;
}>;

export type RequiredPlacementCatalogAnalysis =
  | Readonly<{ kind: "ready" }>
  | Readonly<{
      kind: "missing";
      missingCatalogItems: readonly RequiredPlacementCatalogItem[];
    }>
  | Readonly<{ kind: "error"; message: string }>;

export type RequiredPlacementCatalogLoad = Readonly<{
  cancel: () => void;
  completion: Promise<void>;
}>;

type StartRequiredPlacementCatalogLoadInput = Readonly<{
  loadCategory: (category: CatalogPanelCategory) => Promise<Catalog>;
  missingCatalogItems: readonly RequiredPlacementCatalogItem[];
  onCatalogItemsLoaded: (catalogItems: readonly CatalogItem[]) => void;
  onError: (catalogError: Error, canRetry: boolean) => void;
}>;

type LoadedRequiredCatalogCategory = Readonly<{
  catalog: Catalog;
  category: CatalogPanelCategory;
  requiredItemIds: readonly string[];
}>;

type ResolveRequiredPlacementCatalogSnapshotInput = Readonly<{
  activeSession: ReferenceOpenMapSession | null;
  currentPlacementSnapshot: PlacementSnapshot;
  getPlannerMapIdForMapFile: (mapFile: string) => string;
  plannerWorkspaceCanonicalIdentity: PlannerWorkspaceCanonicalIdentity;
}>;

export function resolveRequiredPlacementCatalogSnapshot({
  activeSession,
  currentPlacementSnapshot,
  getPlannerMapIdForMapFile,
  plannerWorkspaceCanonicalIdentity,
}: ResolveRequiredPlacementCatalogSnapshotInput): PlacementSnapshot {
  if (activeSession === null) return currentPlacementSnapshot;

  const currentCanonicalSession = getCurrentCanonicalSession(
    activeSession,
    plannerWorkspaceCanonicalIdentity,
    { getPlannerMapIdForMapFile },
  );

  return currentCanonicalSession === null
    ? activeSession.placementSnapshot
    : currentPlacementSnapshot;
}

export function getRequiredPlacementCatalogCategories(
  placementSnapshot: PlacementSnapshot,
): readonly CatalogPanelCategory[] {
  const persistentPlacementSnapshot = createPersistentPlacementSnapshot(
    placementSnapshot,
  );
  const requiredCategories: CatalogPanelCategory[] = [];

  if (persistentPlacementSnapshot.buildings.length > 0) {
    requiredCategories.push("buildings");
  }
  if (
    persistentPlacementSnapshot.crops.length > 0
    || persistentPlacementSnapshot.items.some((placementItem) =>
      isGiantCropCatalogItemId(placementItem.itemId)
    )
  ) {
    requiredCategories.push("crops");
  }
  if (persistentPlacementSnapshot.items.some((placementItem) =>
    !isGiantCropCatalogItemId(placementItem.itemId)
  )) {
    requiredCategories.push("placeables");
  }

  return requiredCategories;
}

export function performSelectedAppearanceCycleWhenCatalogReady(
  isRequiredPlacementCatalogReady: boolean,
  cycleSelectedAppearance: () => void,
): boolean {
  if (typeof isRequiredPlacementCatalogReady !== "boolean") {
    throw new TypeError(
      `Required planner catalog readiness must be a boolean; received ${describeValue(isRequiredPlacementCatalogReady)}.`,
    );
  }
  if (typeof cycleSelectedAppearance !== "function") {
    throw new TypeError(
      `Selected appearance cycle callback must be a function; received ${describeValue(cycleSelectedAppearance)}.`,
    );
  }
  if (!isRequiredPlacementCatalogReady) return false;

  cycleSelectedAppearance();
  return true;
}

export function getNextRequiredPlacementCatalogRetryAttempt(
  currentRetryAttempt: number,
): number {
  if (!Number.isSafeInteger(currentRetryAttempt) || currentRetryAttempt < 0) {
    throw new TypeError(
      `Required planner catalog retry attempt must be a non-negative safe integer; received ${describeValue(currentRetryAttempt)}.`,
    );
  }
  if (currentRetryAttempt === Number.MAX_SAFE_INTEGER) {
    throw new RangeError(
      `Required planner catalog retry attempt cannot exceed ${String(Number.MAX_SAFE_INTEGER)}; received ${String(currentRetryAttempt)}.`,
    );
  }

  return currentRetryAttempt + 1;
}

export function analyzeRequiredPlacementCatalog(
  placementSnapshot: PlacementSnapshot,
  catalogItems: readonly CatalogItem[],
): RequiredPlacementCatalogAnalysis {
  assertCatalogItemsArray(catalogItems);
  const requiredCatalogItems = getRequiredPlacementCatalogItems(
    placementSnapshot,
  );
  const missingCatalogItems: RequiredPlacementCatalogItem[] = [];

  for (const requiredCatalogItem of requiredCatalogItems) {
    const matchingCatalogItemCount = catalogItems.filter(
      (catalogItem) => catalogItem.id === requiredCatalogItem.itemId,
    ).length;
    if (matchingCatalogItemCount > 1) {
      return {
        kind: "error",
        message: createExactCatalogItemCountError(
          requiredCatalogItem,
          matchingCatalogItemCount,
        ).message,
      };
    }
    if (matchingCatalogItemCount === 0) {
      missingCatalogItems.push(requiredCatalogItem);
    }
  }

  return missingCatalogItems.length === 0
    ? { kind: "ready" }
    : { kind: "missing", missingCatalogItems };
}

export function startRequiredPlacementCatalogLoad(
  startInput: StartRequiredPlacementCatalogLoadInput,
): RequiredPlacementCatalogLoad {
  assertStartRequiredPlacementCatalogLoadInput(startInput);
  let isCancelled = false;
  const missingCatalogItemsByCategory = groupRequiredCatalogItemsByCategory(
    startInput.missingCatalogItems,
  );

  const completion = loadRequiredCatalogCategories(
    missingCatalogItemsByCategory,
    startInput.loadCategory,
  ).then(
    (loadedCatalogCategories) => {
      if (isCancelled) return;

      let loadedCatalogItems: readonly CatalogItem[];
      try {
        loadedCatalogItems = validateAndFlattenLoadedCatalogCategories(
          loadedCatalogCategories,
        );
      } catch (caughtError) {
        startInput.onError(getRequiredCatalogError(caughtError), false);
        return;
      }

      if (isCancelled) return;
      startInput.onCatalogItemsLoaded(loadedCatalogItems);
    },
    (caughtError) => {
      if (isCancelled) return;
      startInput.onError(getRequiredCatalogError(caughtError), true);
    },
  );

  return {
    cancel: () => {
      isCancelled = true;
    },
    completion,
  };
}

function getRequiredPlacementCatalogItems(
  placementSnapshot: PlacementSnapshot,
): readonly RequiredPlacementCatalogItem[] {
  const persistentPlacementSnapshot = createPersistentPlacementSnapshot(
    placementSnapshot,
  );
  const requiredCatalogItems: RequiredPlacementCatalogItem[] = [];
  const requiredCatalogItemIds = new Set<string>();

  for (const placementBuilding of persistentPlacementSnapshot.buildings) {
    addRequiredCatalogItem(
      requiredCatalogItems,
      requiredCatalogItemIds,
      "buildings",
      `building:${placementBuilding.buildingId}`,
    );
  }
  for (const placementCrop of persistentPlacementSnapshot.crops) {
    addRequiredCatalogItem(
      requiredCatalogItems,
      requiredCatalogItemIds,
      "crops",
      placementCrop.cropId,
    );
  }
  for (const placementItem of persistentPlacementSnapshot.items) {
    addRequiredCatalogItem(
      requiredCatalogItems,
      requiredCatalogItemIds,
      isGiantCropCatalogItemId(placementItem.itemId)
        ? "crops"
        : "placeables",
      placementItem.itemId,
    );
  }

  return requiredCatalogItems;
}

function addRequiredCatalogItem(
  requiredCatalogItems: RequiredPlacementCatalogItem[],
  requiredCatalogItemIds: Set<string>,
  category: CatalogPanelCategory,
  itemId: string,
): void {
  if (requiredCatalogItemIds.has(itemId)) return;
  requiredCatalogItemIds.add(itemId);
  requiredCatalogItems.push({ category, itemId });
}

function groupRequiredCatalogItemsByCategory(
  requiredCatalogItems: readonly RequiredPlacementCatalogItem[],
): ReadonlyMap<CatalogPanelCategory, readonly string[]> {
  const requiredItemIdsByCategory = new Map<
    CatalogPanelCategory,
    string[]
  >();

  for (const requiredCatalogItem of requiredCatalogItems) {
    const categoryItemIds = requiredItemIdsByCategory.get(
      requiredCatalogItem.category,
    );
    if (categoryItemIds === undefined) {
      requiredItemIdsByCategory.set(requiredCatalogItem.category, [
        requiredCatalogItem.itemId,
      ]);
      continue;
    }
    if (!categoryItemIds.includes(requiredCatalogItem.itemId)) {
      categoryItemIds.push(requiredCatalogItem.itemId);
    }
  }

  return requiredItemIdsByCategory;
}

function loadRequiredCatalogCategories(
  requiredItemIdsByCategory: ReadonlyMap<
    CatalogPanelCategory,
    readonly string[]
  >,
  loadCategory: (category: CatalogPanelCategory) => Promise<Catalog>,
): Promise<readonly LoadedRequiredCatalogCategory[]> {
  return Promise.all(
    [...requiredItemIdsByCategory].map(async ([category, requiredItemIds]) => {
      try {
        return {
          catalog: await loadCategory(category),
          category,
          requiredItemIds,
        };
      } catch (caughtError) {
        const failureMessage =
          caughtError instanceof Error ? caughtError.message : describeValue(caughtError);
        throw new Error(
          `Required planner catalog category ${JSON.stringify(category)} failed to load: ${failureMessage}`,
          { cause: caughtError },
        );
      }
    }),
  );
}

function validateAndFlattenLoadedCatalogCategories(
  loadedCatalogCategories: readonly LoadedRequiredCatalogCategory[],
): readonly CatalogItem[] {
  const loadedCatalogItems: CatalogItem[] = [];

  for (const loadedCatalogCategory of loadedCatalogCategories) {
    const categoryCatalogItems = getCatalogItems(
      loadedCatalogCategory.category,
      loadedCatalogCategory.catalog,
    );
    for (const requiredItemId of loadedCatalogCategory.requiredItemIds) {
      const matchingCatalogItemCount = categoryCatalogItems.filter(
        (catalogItem) => catalogItem.id === requiredItemId,
      ).length;
      if (matchingCatalogItemCount !== 1) {
        throw createExactCatalogItemCountError(
          {
            category: loadedCatalogCategory.category,
            itemId: requiredItemId,
          },
          matchingCatalogItemCount,
        );
      }
    }
    loadedCatalogItems.push(...categoryCatalogItems);
  }

  return loadedCatalogItems;
}

function getCatalogItems(
  category: CatalogPanelCategory,
  catalog: Catalog,
): readonly CatalogItem[] {
  if (
    typeof catalog !== "object" ||
    catalog === null ||
    !Array.isArray(catalog.items)
  ) {
    throw new TypeError(
      `Required planner catalog category ${JSON.stringify(category)} must return a catalog with an items array; received ${describeValue(catalog)}.`,
    );
  }
  assertCatalogItemsArray(catalog.items);
  return catalog.items;
}

function createExactCatalogItemCountError(
  requiredCatalogItem: RequiredPlacementCatalogItem,
  matchingCatalogItemCount: number,
): Error {
  return new Error(
    `Required planner catalog category ${JSON.stringify(requiredCatalogItem.category)} item ID ${JSON.stringify(requiredCatalogItem.itemId)} must have exactly one match; received ${String(matchingCatalogItemCount)} matches.`,
  );
}

function getRequiredCatalogError(caughtError: unknown): Error {
  if (caughtError instanceof Error) return caughtError;
  return new Error(
    `Required planner catalog load failed with a non-Error value; received ${describeValue(caughtError)}.`,
  );
}

function assertStartRequiredPlacementCatalogLoadInput(
  startInput: StartRequiredPlacementCatalogLoadInput,
): void {
  if (typeof startInput !== "object" || startInput === null) {
    throw new TypeError(
      `Required planner catalog load input must be an object; received ${describeValue(startInput)}.`,
    );
  }
  if (!Array.isArray(startInput.missingCatalogItems)) {
    throw new TypeError(
      `Required planner catalog missingCatalogItems must be an array; received ${describeValue(startInput.missingCatalogItems)}.`,
    );
  }
  if (
    typeof startInput.loadCategory !== "function" ||
    typeof startInput.onCatalogItemsLoaded !== "function" ||
    typeof startInput.onError !== "function"
  ) {
    throw new TypeError(
      `Required planner catalog load callbacks must be functions; received loadCategory ${describeValue(startInput.loadCategory)}, onCatalogItemsLoaded ${describeValue(startInput.onCatalogItemsLoaded)}, and onError ${describeValue(startInput.onError)}.`,
    );
  }
}

function assertCatalogItemsArray(
  catalogItems: readonly CatalogItem[],
): void {
  if (!Array.isArray(catalogItems)) {
    throw new TypeError(
      `Required planner catalog items must be an array; received ${describeValue(catalogItems)}.`,
    );
  }
  for (const catalogItem of catalogItems) {
    if (
      typeof catalogItem !== "object" ||
      catalogItem === null ||
      typeof catalogItem.id !== "string" ||
      catalogItem.id.length === 0
    ) {
      throw new TypeError(
        `Required planner catalog item must have a non-empty string ID; received ${describeValue(catalogItem)}.`,
      );
    }
  }
}

function describeValue(value: unknown): string {
  const serializedValue = JSON.stringify(value);
  return serializedValue === undefined ? String(value) : serializedValue;
}
