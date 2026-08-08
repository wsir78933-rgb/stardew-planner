import {
  editorDisplayOptionKeys,
  type EditorDisplayOptions,
} from "../editor/editor-display-options";
import type { MapPlacementGrid } from "../placement/map-placement-grids";
import {
  createPersistentPlacementSnapshot,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";
import { getBaseTileGid } from "../tmx/decode-tile-layer-data";
import type { TmxMap, TmxTileset } from "../tmx/tmx-types";
import {
  createSprinklerCoverageTiles,
  type SprinklerCoverageTile,
} from "./sprinkler-placement-rendering";

export type MapDisplayOverlayTile = Readonly<{
  kind: "blocked-buildings" | "blocked-crops" | "blocked-trees";
  x: number;
  y: number;
}>;

export type PlacementCoverageOverlayRectangle = Readonly<{
  color: number;
  height: number;
  width: number;
  x: number;
  y: number;
}>;

export type ResourceClumpOverlayEntry = Readonly<{
  kind: "large-log" | "large-boulder" | "large-stump";
  parentSheetIndex: number;
  sourceX: number;
  sourceY: number;
  x: number;
  y: number;
}>;

const scarecrowCoverageByItemId: Readonly<
  Record<string, Readonly<{ width: number; height: number }>>
> = {
  "big-craftable:8": { width: 17, height: 17 },
  "big-craftable:167": { width: 33, height: 33 },
};

const beeHouseCoverage = { width: 11, height: 11 } as const;
const junimoHutCoverage = { width: 17, height: 17 } as const;

const resourceClumpByPathsTileLocalId: Readonly<
  Record<number, Readonly<{ kind: ResourceClumpOverlayEntry["kind"]; parentSheetIndex: number }>>
> = {
  19: { kind: "large-log", parentSheetIndex: 602 },
  20: { kind: "large-boulder", parentSheetIndex: 672 },
  21: { kind: "large-stump", parentSheetIndex: 600 },
};

export function createMapDisplayOverlayTiles(
  mapPlacementGrid: MapPlacementGrid,
  editorDisplayOptions: EditorDisplayOptions,
): readonly MapDisplayOverlayTile[] {
  assertMapPlacementGrid(mapPlacementGrid);
  assertEditorDisplayOptions(editorDisplayOptions);
  const overlayTiles: MapDisplayOverlayTile[] = [];

  for (let tileIndex = 0; tileIndex < mapPlacementGrid.capabilitiesByTile.length; tileIndex += 1) {
    const tileCapabilities = mapPlacementGrid.capabilitiesByTile[tileIndex];

    if (tileCapabilities === undefined) {
      throw new Error(
        `Map display overlay has no placement capabilities at tile index ${String(tileIndex)}.`,
      );
    }

    const x = tileIndex % mapPlacementGrid.width;
    const y = Math.floor(tileIndex / mapPlacementGrid.width);

    if (editorDisplayOptions.showBuildableTiles && !tileCapabilities.buildable) {
      overlayTiles.push({ kind: "blocked-buildings", x, y });
    }

    if (editorDisplayOptions.showCropTiles && !tileCapabilities.diggable) {
      overlayTiles.push({ kind: "blocked-crops", x, y });
    }

    if (
      editorDisplayOptions.showTreeTiles &&
      !tileCapabilities.treePlantable &&
      !tileCapabilities.treePlantableOnDirt
    ) {
      overlayTiles.push({ kind: "blocked-trees", x, y });
    }
  }

  return overlayTiles;
}

export function createPlacementCoverageOverlayRectangles(
  placementSnapshot: PlacementSnapshot,
  editorDisplayOptions: EditorDisplayOptions,
): readonly PlacementCoverageOverlayRectangle[] {
  const persistentPlacementSnapshot = createPersistentPlacementSnapshot(
    placementSnapshot,
  );
  assertEditorDisplayOptions(editorDisplayOptions);
  const coverageOverlayRectangles: PlacementCoverageOverlayRectangle[] = [];
  const sprinklerCoverageTileKeys = new Set<string>();

  for (const placementItem of persistentPlacementSnapshot.items) {
    if (editorDisplayOptions.showSprinklerRadius) {
      const sprinklerCoverageTiles = createSprinklerCoverageTiles(placementItem);

      if (sprinklerCoverageTiles !== null) {
        appendUniqueSprinklerCoverageRectangles(
          coverageOverlayRectangles,
          sprinklerCoverageTileKeys,
          sprinklerCoverageTiles,
        );
      }
    }

    if (editorDisplayOptions.showScarecrowRadius) {
      const scarecrowCoverage = scarecrowCoverageByItemId[placementItem.itemId];

      if (scarecrowCoverage !== undefined) {
        coverageOverlayRectangles.push(
          createCenteredCoverageRectangle(
            placementItem.x,
            placementItem.y,
            scarecrowCoverage,
            0xf6cf4a,
          ),
        );
      }
    }

    if (
      editorDisplayOptions.showBeeHouseRadius &&
      placementItem.itemId === "big-craftable:10"
    ) {
      coverageOverlayRectangles.push(
        createCenteredCoverageRectangle(
          placementItem.x,
          placementItem.y,
          beeHouseCoverage,
          0xf078c4,
        ),
      );
    }
  }

  if (editorDisplayOptions.showJunimoHutRadius) {
    for (const placementBuilding of persistentPlacementSnapshot.buildings) {
      if (placementBuilding.buildingId !== "Junimo Hut") {
        continue;
      }

      coverageOverlayRectangles.push(
        createCenteredCoverageRectangle(
          placementBuilding.x + 1,
          placementBuilding.y + 1,
          junimoHutCoverage,
          0x6bcf78,
        ),
      );
    }
  }

  return coverageOverlayRectangles;
}

function appendUniqueSprinklerCoverageRectangles(
  coverageOverlayRectangles: PlacementCoverageOverlayRectangle[],
  sprinklerCoverageTileKeys: Set<string>,
  sprinklerCoverageTiles: readonly SprinklerCoverageTile[],
): void {
  for (const sprinklerCoverageTile of sprinklerCoverageTiles) {
    const coverageTileKey = `${String(sprinklerCoverageTile.x)},${String(sprinklerCoverageTile.y)}`;

    if (sprinklerCoverageTileKeys.has(coverageTileKey)) {
      continue;
    }

    sprinklerCoverageTileKeys.add(coverageTileKey);
    coverageOverlayRectangles.push({
      color: 0x3db4ff,
      height: 1,
      width: 1,
      x: sprinklerCoverageTile.x,
      y: sprinklerCoverageTile.y,
    });
  }
}

export function createResourceClumpOverlayEntries(
  parsedMap: TmxMap,
): readonly ResourceClumpOverlayEntry[] {
  assertParsedMapForResourceClumpOverlay(parsedMap);
  const pathsTileLayer = parsedMap.tileLayers.find(
    (tileLayer) => tileLayer.name === "Paths",
  );

  if (pathsTileLayer === undefined) {
    return [];
  }

  const resourceClumpOverlayEntries: ResourceClumpOverlayEntry[] = [];

  for (const [tileIndex, rawGid] of pathsTileLayer.rawGids.entries()) {
    if (rawGid === undefined) {
      throw new Error(
        `Resource-clump overlay Paths layer has no raw GID at tile index ${String(tileIndex)}.`
      );
    }

    const baseGid = getBaseTileGid(rawGid);

    if (baseGid === 0) {
      continue;
    }

    const tileset = getTilesetForBaseGid(parsedMap.tilesets, baseGid);

    if (tileset === undefined) {
      continue;
    }

    const resourceClump = resourceClumpByPathsTileLocalId[baseGid - tileset.firstGid];

    if (resourceClump === undefined) {
      continue;
    }

    resourceClumpOverlayEntries.push({
      ...resourceClump,
      ...getResourceClumpSourceCoordinates(resourceClump.parentSheetIndex),
      x: tileIndex % pathsTileLayer.width,
      y: Math.floor(tileIndex / pathsTileLayer.width),
    });
  }

  return resourceClumpOverlayEntries;
}

function getResourceClumpSourceCoordinates(
  parentSheetIndex: number,
): Readonly<{ sourceX: number; sourceY: number }> {
  const sourceCellSize = 16;
  const sourceColumnCount = 24;

  return {
    sourceX: (parentSheetIndex % sourceColumnCount) * sourceCellSize,
    sourceY:
      Math.floor(parentSheetIndex / sourceColumnCount) * sourceCellSize,
  };
}

function createCenteredCoverageRectangle(
  centerX: number,
  centerY: number,
  coverageSize: Readonly<{ width: number; height: number }>,
  color: number,
): PlacementCoverageOverlayRectangle {
  return {
    color,
    height: coverageSize.height,
    width: coverageSize.width,
    x: centerX - Math.floor(coverageSize.width / 2),
    y: centerY - Math.floor(coverageSize.height / 2),
  };
}

function assertMapPlacementGrid(mapPlacementGrid: MapPlacementGrid): void {
  if (typeof mapPlacementGrid !== "object" || mapPlacementGrid === null) {
    throw new TypeError(
      `Map display overlay placement grid must be a non-null object; received ${describeValue(mapPlacementGrid)}.`,
    );
  }

  if (
    !Number.isSafeInteger(mapPlacementGrid.width) ||
    !Number.isSafeInteger(mapPlacementGrid.height) ||
    mapPlacementGrid.width <= 0 ||
    mapPlacementGrid.height <= 0
  ) {
    throw new RangeError(
      `Map display overlay placement grid dimensions must be positive safe integers; received width ${describeValue(mapPlacementGrid.width)}, height ${describeValue(mapPlacementGrid.height)}.`,
    );
  }

  const expectedTileCount = mapPlacementGrid.width * mapPlacementGrid.height;

  if (
    !Array.isArray(mapPlacementGrid.capabilitiesByTile) ||
    mapPlacementGrid.capabilitiesByTile.length !== expectedTileCount
  ) {
    throw new RangeError(
      `Map display overlay placement grid must include ${String(expectedTileCount)} tile capabilities; received ${describeValue(mapPlacementGrid.capabilitiesByTile)}.`,
    );
  }
}

function assertParsedMapForResourceClumpOverlay(parsedMap: TmxMap): void {
  if (typeof parsedMap !== "object" || parsedMap === null) {
    throw new TypeError(
      `Resource-clump overlay map must be a non-null object; received ${describeValue(parsedMap)}.`,
    );
  }

  if (!Array.isArray(parsedMap.tilesets) || !Array.isArray(parsedMap.tileLayers)) {
    throw new TypeError(
      `Resource-clump overlay map must provide tilesets and tileLayers arrays; received tilesets ${describeValue(parsedMap.tilesets)}, tileLayers ${describeValue(parsedMap.tileLayers)}.`,
    );
  }
}

function getTilesetForBaseGid(
  tilesets: readonly TmxTileset[],
  baseGid: number,
): TmxTileset | undefined {
  for (let tilesetIndex = tilesets.length - 1; tilesetIndex >= 0; tilesetIndex -= 1) {
    const tileset = tilesets[tilesetIndex];

    if (tileset === undefined || baseGid < tileset.firstGid) {
      continue;
    }

    if (baseGid < tileset.firstGid + tileset.tileCount) {
      return tileset;
    }

    return undefined;
  }

  return undefined;
}

function assertEditorDisplayOptions(
  editorDisplayOptions: EditorDisplayOptions,
): void {
  if (typeof editorDisplayOptions !== "object" || editorDisplayOptions === null) {
    throw new TypeError(
      `Map display overlay options must be a non-null object; received ${describeValue(editorDisplayOptions)}.`,
    );
  }

  for (const editorDisplayOptionKey of editorDisplayOptionKeys) {
    if (typeof editorDisplayOptions[editorDisplayOptionKey] !== "boolean") {
      throw new TypeError(
        `Map display overlay option ${editorDisplayOptionKey} must be a boolean; received ${describeValue(editorDisplayOptions[editorDisplayOptionKey])}.`,
      );
    }
  }
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return `[array length ${String(value.length)}]`;
  }

  return JSON.stringify(value);
}
