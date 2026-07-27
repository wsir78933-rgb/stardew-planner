import type { BuildingPlacementMetadataById } from "../catalog";
import type { MapTileCoordinates } from "../placement/map-placement-grids";
import {
  commitPlacementHistory,
  type PlacementHistory,
} from "../placement/placement-history";
import {
  applyPlacementSnapshotAction,
  createPersistentPlacementSnapshot,
  type PlacementItem,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";

export type EditorEraseInput = Readonly<{
  cursorTile: MapTileCoordinates;
  buildingMetadataById: BuildingPlacementMetadataById;
  placementHistory: PlacementHistory<PlacementSnapshot>;
}>;

export type EditorEraseResult =
  | Readonly<{
      applied: true;
      erased: "item" | "crop" | "building" | "path";
      placementHistory: PlacementHistory<PlacementSnapshot>;
    }>
  | Readonly<{
      applied: false;
      reason: "no-placement-at-cursor";
      placementHistory: PlacementHistory<PlacementSnapshot>;
    }>;

export type EditorEraseRectangleInput = Readonly<{
  firstTile: MapTileCoordinates;
  secondTile: MapTileCoordinates;
  buildingMetadataById: BuildingPlacementMetadataById;
  placementHistory: PlacementHistory<PlacementSnapshot>;
}>;

export type EditorEraseRectangleResult =
  | Readonly<{
      applied: true;
      erasedBuildingCount: number;
      erasedCropCount: number;
      erasedItemCount: number;
      placementHistory: PlacementHistory<PlacementSnapshot>;
    }>
  | Readonly<{
      applied: false;
      reason: "no-placement-in-rectangle";
      placementHistory: PlacementHistory<PlacementSnapshot>;
    }>;

export function applyEditorErase(
  editorEraseInput: EditorEraseInput,
): EditorEraseResult {
  assertEditorEraseInput(editorEraseInput);
  const placementSnapshot = createPersistentPlacementSnapshot(
    editorEraseInput.placementHistory.currentState,
  );
  const eraseAction = findEraseAction(
    placementSnapshot,
    editorEraseInput.cursorTile,
    editorEraseInput.buildingMetadataById,
  );

  if (eraseAction === null) {
    return {
      applied: false,
      reason: "no-placement-at-cursor",
      placementHistory: editorEraseInput.placementHistory,
    };
  }

  const nextPlacementSnapshot = applyPlacementSnapshotAction(
    placementSnapshot,
    eraseAction.action,
  );

  return {
    applied: true,
    erased: eraseAction.erased,
    placementHistory: commitPlacementHistory(
      editorEraseInput.placementHistory,
      nextPlacementSnapshot,
    ),
  };
}

export function applyEditorEraseRectangle(
  editorEraseRectangleInput: EditorEraseRectangleInput,
): EditorEraseRectangleResult {
  assertEditorEraseRectangleInput(editorEraseRectangleInput);
  const placementSnapshot = createPersistentPlacementSnapshot(
    editorEraseRectangleInput.placementHistory.currentState,
  );
  const eraseRectangle = createEraseRectangle(
    editorEraseRectangleInput.firstTile,
    editorEraseRectangleInput.secondTile,
  );
  const rectangleEraseTargets = findRectangleEraseTargets(
    placementSnapshot,
    eraseRectangle,
    editorEraseRectangleInput.buildingMetadataById,
  );

  if (
    rectangleEraseTargets.buildingInstanceIds.length === 0 &&
    rectangleEraseTargets.cropCoordinates.length === 0 &&
    rectangleEraseTargets.itemInstanceIds.length === 0
  ) {
    return {
      applied: false,
      reason: "no-placement-in-rectangle",
      placementHistory: editorEraseRectangleInput.placementHistory,
    };
  }

  const nextPlacementSnapshot = deleteRectangleEraseTargets(
    placementSnapshot,
    rectangleEraseTargets,
  );

  return {
    applied: true,
    erasedBuildingCount: rectangleEraseTargets.buildingInstanceIds.length,
    erasedCropCount: rectangleEraseTargets.cropCoordinates.length,
    erasedItemCount: rectangleEraseTargets.itemInstanceIds.length,
    placementHistory: commitPlacementHistory(
      editorEraseRectangleInput.placementHistory,
      nextPlacementSnapshot,
    ),
  };
}

type EraseRectangle = Readonly<{
  maximumX: number;
  maximumY: number;
  minimumX: number;
  minimumY: number;
}>;

type RectangleEraseTargets = Readonly<{
  buildingInstanceIds: readonly number[];
  cropCoordinates: readonly MapTileCoordinates[];
  itemInstanceIds: readonly number[];
}>;

type EraseAction = Readonly<{
  erased: "item" | "crop" | "building" | "path";
  action:
    | Readonly<{ type: "delete-building"; instanceId: number }>
    | Readonly<{ type: "delete-crop"; coordinate: MapTileCoordinates }>
    | Readonly<{ type: "delete-item"; instanceId: number }>;
}>;

function findEraseAction(
  placementSnapshot: PlacementSnapshot,
  cursorTile: MapTileCoordinates,
  buildingMetadataById: BuildingPlacementMetadataById,
): EraseAction | null {
  const ordinaryItem = findTopmostPlacementItem(
    placementSnapshot.items,
    cursorTile,
    (placementItem) => placementItem.layer !== "path" && !placementItem.locked,
  );

  if (ordinaryItem !== null) {
    return {
      erased: "item",
      action: { type: "delete-item", instanceId: ordinaryItem.instanceId },
    };
  }

  const crop = placementSnapshot.crops.find(
    (placementCrop) =>
      placementCrop.x === cursorTile.x && placementCrop.y === cursorTile.y,
  );

  if (crop !== undefined) {
    return {
      erased: "crop",
      action: {
        type: "delete-crop",
        coordinate: { x: crop.x, y: crop.y },
      },
    };
  }

  const building = placementSnapshot.buildings.find((placementBuilding) => {
    const buildingMetadata = buildingMetadataById[placementBuilding.buildingId];

    if (buildingMetadata === undefined) {
      throw new Error(
        `Editor erase received unknown building metadata ID ${describeValue(placementBuilding.buildingId)}.`,
      );
    }

    return isTileInsideRectangle(
      cursorTile,
      placementBuilding.x,
      placementBuilding.y,
      buildingMetadata.size.width,
      buildingMetadata.size.height,
    );
  });

  if (building !== undefined) {
    return {
      erased: "building",
      action: { type: "delete-building", instanceId: building.instanceId },
    };
  }

  const path = findTopmostPlacementItem(
    placementSnapshot.items,
    cursorTile,
    (placementItem) => placementItem.layer === "path" && !placementItem.locked,
  );

  if (path === null) {
    return null;
  }

  return {
    erased: "path",
    action: { type: "delete-item", instanceId: path.instanceId },
  };
}

function createEraseRectangle(
  firstTile: MapTileCoordinates,
  secondTile: MapTileCoordinates,
): EraseRectangle {
  return {
    maximumX: Math.max(firstTile.x, secondTile.x),
    maximumY: Math.max(firstTile.y, secondTile.y),
    minimumX: Math.min(firstTile.x, secondTile.x),
    minimumY: Math.min(firstTile.y, secondTile.y),
  };
}

function findRectangleEraseTargets(
  placementSnapshot: PlacementSnapshot,
  eraseRectangle: EraseRectangle,
  buildingMetadataById: BuildingPlacementMetadataById,
): RectangleEraseTargets {
  const buildingInstanceIds = placementSnapshot.buildings.flatMap(
    (placementBuilding) => {
      const buildingMetadata = buildingMetadataById[placementBuilding.buildingId];

      if (buildingMetadata === undefined) {
        throw new Error(
          `Editor rectangle erase received unknown building metadata ID ${describeValue(placementBuilding.buildingId)}.`,
        );
      }

      return doesRectangleIntersect(
        eraseRectangle,
        placementBuilding.x,
        placementBuilding.y,
        buildingMetadata.size.width,
        buildingMetadata.size.height,
      )
        ? [placementBuilding.instanceId]
        : [];
    },
  );
  const cropCoordinates = placementSnapshot.crops.flatMap((placementCrop) =>
    isTileInsideEraseRectangle(eraseRectangle, placementCrop)
      ? [{ x: placementCrop.x, y: placementCrop.y }]
      : [],
  );
  const itemInstanceIds = placementSnapshot.items.flatMap((placementItem) =>
    !placementItem.locked &&
    doesRectangleIntersect(
      eraseRectangle,
      placementItem.x,
      placementItem.y,
      placementItem.footprint.width,
      placementItem.footprint.height,
    )
      ? [placementItem.instanceId]
      : [],
  );

  return { buildingInstanceIds, cropCoordinates, itemInstanceIds };
}

function doesRectangleIntersect(
  eraseRectangle: EraseRectangle,
  placementX: number,
  placementY: number,
  placementWidth: number,
  placementHeight: number,
): boolean {
  return (
    placementX <= eraseRectangle.maximumX &&
    placementX + placementWidth > eraseRectangle.minimumX &&
    placementY <= eraseRectangle.maximumY &&
    placementY + placementHeight > eraseRectangle.minimumY
  );
}

function isTileInsideEraseRectangle(
  eraseRectangle: EraseRectangle,
  placementCoordinate: MapTileCoordinates,
): boolean {
  return (
    placementCoordinate.x >= eraseRectangle.minimumX &&
    placementCoordinate.x <= eraseRectangle.maximumX &&
    placementCoordinate.y >= eraseRectangle.minimumY &&
    placementCoordinate.y <= eraseRectangle.maximumY
  );
}

function deleteRectangleEraseTargets(
  placementSnapshot: PlacementSnapshot,
  rectangleEraseTargets: RectangleEraseTargets,
): PlacementSnapshot {
  let nextPlacementSnapshot = placementSnapshot;

  for (const buildingInstanceId of rectangleEraseTargets.buildingInstanceIds) {
    nextPlacementSnapshot = applyPlacementSnapshotAction(nextPlacementSnapshot, {
      type: "delete-building",
      instanceId: buildingInstanceId,
    });
  }

  for (const itemInstanceId of rectangleEraseTargets.itemInstanceIds) {
    nextPlacementSnapshot = applyPlacementSnapshotAction(nextPlacementSnapshot, {
      type: "delete-item",
      instanceId: itemInstanceId,
    });
  }

  for (const cropCoordinate of rectangleEraseTargets.cropCoordinates) {
    nextPlacementSnapshot = applyPlacementSnapshotAction(nextPlacementSnapshot, {
      type: "delete-crop",
      coordinate: cropCoordinate,
    });
  }

  return nextPlacementSnapshot;
}

function findTopmostPlacementItem(
  placementItems: readonly PlacementItem[],
  cursorTile: MapTileCoordinates,
  acceptsPlacementItem: (placementItem: PlacementItem) => boolean,
): PlacementItem | null {
  for (let itemIndex = placementItems.length - 1; itemIndex >= 0; itemIndex -= 1) {
    const placementItem = placementItems[itemIndex];

    if (
      placementItem !== undefined &&
      acceptsPlacementItem(placementItem) &&
      isTileInsideRectangle(
        cursorTile,
        placementItem.x,
        placementItem.y,
        placementItem.footprint.width,
        placementItem.footprint.height,
      )
    ) {
      return placementItem;
    }
  }

  return null;
}

function isTileInsideRectangle(
  cursorTile: MapTileCoordinates,
  rectangleX: number,
  rectangleY: number,
  rectangleWidth: number,
  rectangleHeight: number,
): boolean {
  return (
    cursorTile.x >= rectangleX &&
    cursorTile.x < rectangleX + rectangleWidth &&
    cursorTile.y >= rectangleY &&
    cursorTile.y < rectangleY + rectangleHeight
  );
}

function assertEditorEraseInput(editorEraseInput: EditorEraseInput): void {
  assertNonNullObject(editorEraseInput, "input");
  assertNonNullObject(editorEraseInput.cursorTile, "cursorTile");
  assertMapTile(editorEraseInput.cursorTile, "cursorTile");
  assertSharedEditorEraseInput(
    editorEraseInput.placementHistory,
    editorEraseInput.buildingMetadataById,
  );
}

function assertEditorEraseRectangleInput(
  editorEraseRectangleInput: EditorEraseRectangleInput,
): void {
  assertNonNullObject(editorEraseRectangleInput, "rectangle input");
  assertNonNullObject(editorEraseRectangleInput.firstTile, "firstTile");
  assertNonNullObject(editorEraseRectangleInput.secondTile, "secondTile");
  assertMapTile(editorEraseRectangleInput.firstTile, "firstTile");
  assertMapTile(editorEraseRectangleInput.secondTile, "secondTile");
  assertSharedEditorEraseInput(
    editorEraseRectangleInput.placementHistory,
    editorEraseRectangleInput.buildingMetadataById,
  );
}

function assertSharedEditorEraseInput(
  placementHistory: PlacementHistory<PlacementSnapshot>,
  buildingMetadataById: BuildingPlacementMetadataById,
): void {
  assertNonNullObject(placementHistory, "placementHistory");
  createPersistentPlacementSnapshot(placementHistory.currentState);
  assertNonNullObject(buildingMetadataById, "buildingMetadataById");
}

function assertMapTile(
  mapTile: MapTileCoordinates,
  fieldName: string,
): void {
  assertNonNegativeSafeInteger(mapTile.x, `${fieldName}.x`);
  assertNonNegativeSafeInteger(mapTile.y, `${fieldName}.y`);
}

function assertNonNegativeSafeInteger(value: unknown, fieldName: string): void {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < 0
  ) {
    throw new RangeError(
      `Editor erase ${fieldName} must be a non-negative safe integer; received ${describeValue(value)}.`,
    );
  }
}

function assertNonNullObject(value: unknown, fieldName: string): void {
  if (typeof value !== "object" || value === null) {
    throw new TypeError(
      `Editor erase ${fieldName} must be a non-null object; received ${describeValue(value)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  return String(value);
}
