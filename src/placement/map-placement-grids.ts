import { getBaseTileGid } from "../tmx/decode-tile-layer-data";
import type { TmxMap, TmxProperties, TmxTileLayer, TmxTileset } from "../tmx/tmx-types";

export type MapTileCoordinates = Readonly<{
  x: number;
  y: number;
}>;

export type MapPlacementCapabilities = Readonly<{
  buildable: boolean;
  diggable: boolean;
  passable: boolean;
  treePlantable: boolean;
  treePlantableOnDirt: boolean;
  fruitTreePlantable?: boolean;
  fruitTreesRestricted?: boolean;
  objectPlaceable?: boolean;
  noFurniture?: boolean;
  wall: boolean;
  water?: boolean;
  crabPot: boolean;
}>;

export type MapPlacementGrid = Readonly<{
  width: number;
  height: number;
  capabilitiesByTile: readonly MapPlacementCapabilities[];
}>;

const emptyMapPlacementCapabilities: MapPlacementCapabilities = {
  buildable: false,
  diggable: false,
  passable: false,
  treePlantable: false,
  treePlantableOnDirt: false,
  fruitTreePlantable: false,
  fruitTreesRestricted: false,
  objectPlaceable: false,
  noFurniture: false,
  wall: false,
  water: false,
  crabPot: false,
};

type MapTilePlacementFacts = Readonly<{
  tileCoordinates: MapTileCoordinates;
  isBackTilePresent: boolean;
  isBuildingsTilePresent: boolean;
  backTileProperties: TmxProperties;
  buildingsTileProperties: TmxProperties;
  mergedBackProperties: TmxProperties;
  hasTileDataNoSpawn: boolean;
  hasTileDataWallAnchor: boolean;
  isBackTileWater: boolean;
  isBuildingsTilePassable: boolean;
  backTilesetImageSource: string | null;
}>;

export function createMapPlacementGrid(
  tmxMap: TmxMap,
  mapFile?: string,
): MapPlacementGrid {
  assertMapDimensions(tmxMap);
  if (mapFile !== undefined) {
    assertMapFile(mapFile);
  }

  const backLayer = getRequiredTileLayer(tmxMap, "Back");
  const buildingsLayer = getRequiredTileLayer(tmxMap, "Buildings");
  assertTileLayerGeometry(backLayer);
  assertTileLayerGeometry(buildingsLayer);

  const placementFactsByTile: MapTilePlacementFacts[] = [];

  for (let y = 0; y < tmxMap.height; y += 1) {
    for (let x = 0; x < tmxMap.width; x += 1) {
      placementFactsByTile.push(
        createMapTilePlacementFacts(tmxMap, backLayer, buildingsLayer, { x, y }),
      );
    }
  }

  const treePlacementPolicy = createTreePlacementPolicy(tmxMap, mapFile);
  const blockedObjectTileKeys = createBlockedObjectTileKeys(tmxMap, mapFile);
  const islandDiggableRequiresOutdoorsSheet = mapFile === "Island_W.tmx";
  const capabilitiesByTile = placementFactsByTile.map(
    (mapTilePlacementFacts, tileIndex) =>
      createTilePlacementCapabilities(
        mapTilePlacementFacts,
        isCrabPotTile(
          placementFactsByTile,
          tmxMap.width,
          tmxMap.height,
          tileIndex,
        ),
        treePlacementPolicy,
        blockedObjectTileKeys,
        islandDiggableRequiresOutdoorsSheet,
      ),
  );

  return {
    width: tmxMap.width,
    height: tmxMap.height,
    capabilitiesByTile,
  };
}

export function getMapPlacementCapabilities(
  mapPlacementGrid: MapPlacementGrid,
  tileCoordinates: MapTileCoordinates,
): MapPlacementCapabilities {
  assertMapPlacementGrid(mapPlacementGrid);
  assertTileCoordinates(tileCoordinates);

  if (
    tileCoordinates.x >= mapPlacementGrid.width ||
    tileCoordinates.y >= mapPlacementGrid.height
  ) {
    throw new RangeError(
      `Map placement tile coordinate x "${String(tileCoordinates.x)}", y "${String(tileCoordinates.y)}" is outside ${String(mapPlacementGrid.width)}x${String(mapPlacementGrid.height)}.`,
    );
  }

  const tileIndex = tileCoordinates.y * mapPlacementGrid.width + tileCoordinates.x;
  const capabilities = mapPlacementGrid.capabilitiesByTile[tileIndex];

  if (capabilities === undefined) {
    throw new Error(
      `Map placement grid has no capabilities at x "${String(tileCoordinates.x)}", y "${String(tileCoordinates.y)}" (index ${String(tileIndex)}).`,
    );
  }

  return capabilities;
}

export function isTmxPropertyTruthy(propertyValue: string | undefined): boolean {
  if (propertyValue === undefined) {
    return false;
  }

  if (typeof propertyValue !== "string") {
    throw new TypeError(
      `TMX property value must be a string or undefined; received ${describeValue(propertyValue)}.`,
    );
  }

  const normalizedPropertyValue = propertyValue.toLowerCase();

  return normalizedPropertyValue !== "" &&
    normalizedPropertyValue !== "false" &&
    normalizedPropertyValue !== "f";
}

function createMapTilePlacementFacts(
  tmxMap: TmxMap,
  backLayer: TmxTileLayer,
  buildingsLayer: TmxTileLayer,
  tileCoordinates: MapTileCoordinates,
): MapTilePlacementFacts {
  const backTileProperties = getLayerTileProperties(
    tmxMap,
    backLayer,
    tileCoordinates,
  );
  const buildingsTileProperties = getLayerTileProperties(
    tmxMap,
    buildingsLayer,
    tileCoordinates,
  );
  const backTilesetImageSource = getLayerTilesetImageSource(
    tmxMap,
    backLayer,
    tileCoordinates,
  );
  const isBackTilePresent = getLayerBaseGid(backLayer, tileCoordinates) !== 0;
  const isBuildingsTilePresent =
    getLayerBaseGid(buildingsLayer, tileCoordinates) !== 0;
  const tileDataProperties = tmxMap.tileDataProperties.get(
    `${backLayer.name}:${String(tileCoordinates.x)},${String(tileCoordinates.y)}`,
  ) ?? {};
  const mergedBackProperties: TmxProperties = {
    ...backTileProperties,
    ...tileDataProperties,
  };

  return {
    tileCoordinates,
    isBackTilePresent,
    isBuildingsTilePresent,
    backTileProperties,
    buildingsTileProperties,
    mergedBackProperties,
    hasTileDataNoSpawn: Object.hasOwn(tileDataProperties, "NoSpawn"),
    hasTileDataWallAnchor: Object.hasOwn(tileDataProperties, "WallID"),
    isBackTileWater: isTmxPropertyTruthy(backTileProperties.Water),
    isBuildingsTilePassable: isTmxPropertyTruthy(
      buildingsTileProperties.Passable,
    ),
    backTilesetImageSource,
  };
}

type TreePlacementPolicy = Readonly<{
  allowTreesAnywhere: boolean;
  greenhouseTrees: boolean;
  fruitTreesUseFarmRule: boolean;
}>;

const anywhereTreeMapFiles = new Set([
  "Farm.tmx",
  "Farm_Fishing.tmx",
  "Farm_Foraging.tmx",
  "Farm_Mining.tmx",
  "Farm_Combat.tmx",
  "Farm_FourCorners.tmx",
  "Farm_Island.tmx",
  "Farm_Ranching.tmx",
  "Island_W.tmx",
  "Greenhouse.tmx",
  "IF2R.tmx",
  "FrontierFarm.tmx",
  "GrandpasFarm.tmx",
  "capitalist-dream.tmx",
  "capitalist-dream-2.tmx",
  "overgrown-garden.tmx",
  "yet-another.tmx",
  "solo-four-corners.tmx",
  "strawberry-fields.tmx",
  "blackberry-fields.tmx",
  "zenith.tmx",
  "everfarm.tmx",
  "sea-breeze-island.tmx",
  "aimon-s-small-hilltop.tmx",
  "aimon-s-small-forest.tmx",
  "more-lively-meadowlands.tmx",
  "modest-maps-standard.tmx",
  "waterfall-forest.tmx",
]);

const greenhouseTreeMapFiles = new Set([
  "Greenhouse.tmx",
  "grandpas-shed-2.tmx",
]);

const islandWestBlockedObjectTiles = ["96,31", "96,32"] as const;

function createTilePlacementCapabilities(
  mapTilePlacementFacts: MapTilePlacementFacts,
  crabPot: boolean,
  treePlacementPolicy: TreePlacementPolicy,
  blockedObjectTileKeys: ReadonlySet<string>,
  islandDiggableRequiresOutdoorsSheet: boolean,
): MapPlacementCapabilities {
  const { mergedBackProperties } = mapTilePlacementFacts;
  const isBuildabilityWater = isTmxPropertyTruthy(mergedBackProperties.Water);
  const isBuildable = isTmxPropertyTruthy(mergedBackProperties.Buildable);
  const hasExplicitlyBlockedBuildability =
    Object.hasOwn(mergedBackProperties, "Buildable") && !isBuildable;
  const isDiggable = isTmxPropertyTruthy(
    mapTilePlacementFacts.backTileProperties.Diggable,
  );
  const canPlantTrees = isTmxPropertyTruthy(
    mergedBackProperties.CanPlantTrees,
  );
  const isNoSpawnTree = isTreeBlockingNoSpawn(mergedBackProperties.NoSpawn);
  const isTreeBlockedByNoSpawn = mapTilePlacementFacts.hasTileDataNoSpawn
    ? isNoSpawnTree
    : isNoSpawnTree && !canPlantTrees;
  const treePlantableAnywhere = mapTilePlacementFacts.isBackTilePresent &&
    !mapTilePlacementFacts.isBuildingsTilePresent &&
    !isBuildabilityWater &&
    !isTmxPropertyTruthy(mergedBackProperties.AllSpawn) &&
    !isTreeBlockedByNoSpawn;
  const mergedDiggable = isTmxPropertyTruthy(mergedBackProperties.Diggable);
  const diggable = mapTilePlacementFacts.isBackTilePresent &&
    !mapTilePlacementFacts.isBuildingsTilePresent &&
    isDiggable &&
    islandDiggableTilesetAllowed(
      islandDiggableRequiresOutdoorsSheet,
      mapTilePlacementFacts.backTilesetImageSource,
    );
  const treePlantable = treePlacementPolicy.greenhouseTrees
    ? diggable
    : resolveWildTreePlantable(
        treePlantableAnywhere,
        mergedBackProperties,
        mergedDiggable,
        canPlantTrees,
        treePlacementPolicy,
      );
  const treePlantableOnDirt = treePlantableAnywhere &&
    (canPlantTrees ||
      (mergedBackProperties.Type?.toLowerCase() === "dirt" &&
        mergedDiggable));
  const fruitTreePlantable = treePlacementPolicy.fruitTreesUseFarmRule
    ? isFarmFruitTreeTile(mapTilePlacementFacts, mergedBackProperties, isBuildabilityWater)
    : treePlacementPolicy.greenhouseTrees
      ? diggable || isGreenhouseStoneFruitTile(
          treePlantableAnywhere,
          mergedBackProperties,
        )
      : treePlantable;
  const tileKey = `${String(mapTilePlacementFacts.tileCoordinates.x)},${String(mapTilePlacementFacts.tileCoordinates.y)}`;

  return {
    buildable: mapTilePlacementFacts.isBackTilePresent &&
      !mapTilePlacementFacts.isBuildingsTilePresent &&
      !isBuildabilityWater &&
      !hasExplicitlyBlockedBuildability &&
      (isBuildable || isTmxPropertyTruthy(mergedBackProperties.Diggable)),
    diggable,
    passable: mapTilePlacementFacts.isBackTilePresent &&
      !mapTilePlacementFacts.isBackTileWater &&
      (!mapTilePlacementFacts.isBuildingsTilePresent ||
        mapTilePlacementFacts.isBuildingsTilePassable),
    treePlantable,
    treePlantableOnDirt,
    fruitTreePlantable,
    fruitTreesRestricted: treePlacementPolicy.fruitTreesUseFarmRule,
    objectPlaceable: mapTilePlacementFacts.isBackTilePresent &&
      !mapTilePlacementFacts.isBackTileWater &&
      !mapTilePlacementFacts.isBuildingsTilePresent &&
      !blockedObjectTileKeys.has(tileKey),
    noFurniture: Object.hasOwn(mergedBackProperties, "NoFurniture"),
    wall: mapTilePlacementFacts.hasTileDataWallAnchor,
    water: mapTilePlacementFacts.isBackTileWater,
    crabPot,
  };
}

function isGreenhouseStoneFruitTile(
  treePlantableAnywhere: boolean,
  mergedBackProperties: TmxProperties,
): boolean {
  return treePlantableAnywhere &&
    mergedBackProperties.Type?.toLowerCase() === "stone";
}

function resolveWildTreePlantable(
  treePlantableAnywhere: boolean,
  mergedBackProperties: TmxProperties,
  mergedDiggable: boolean,
  canPlantTrees: boolean,
  treePlacementPolicy: TreePlacementPolicy,
): boolean {
  if (!treePlacementPolicy.allowTreesAnywhere) {
    return treePlantableAnywhere &&
      mergedBackProperties.Type?.toLowerCase() === "dirt" &&
      (mergedDiggable || canPlantTrees);
  }

  return treePlantableAnywhere;
}

function isFarmFruitTreeTile(
  mapTilePlacementFacts: MapTilePlacementFacts,
  mergedBackProperties: TmxProperties,
  isBuildabilityWater: boolean,
): boolean {
  if (
    !mapTilePlacementFacts.isBackTilePresent ||
    mapTilePlacementFacts.isBuildingsTilePresent ||
    isBuildabilityWater
  ) {
    return false;
  }

  if (
    Object.hasOwn(mergedBackProperties, "Diggable") ||
    mergedBackProperties.Type === "Stone"
  ) {
    return true;
  }

  const canPlantTreesExactly = mergedBackProperties.CanPlantTrees === "T";
  if (
    mergedBackProperties.Type !== "Grass" &&
    mergedBackProperties.Type !== "Dirt" &&
    !canPlantTreesExactly
  ) {
    return false;
  }

  const noSpawn = mergedBackProperties.NoSpawn ??
    (isTmxPropertyTruthy(mergedBackProperties.AllSpawn) ? "All" : undefined);
  const noSpawnBlocksFruitTree = noSpawn !== undefined &&
    noSpawn !== "Grass" &&
    noSpawn.toLowerCase() !== "false";

  return !noSpawnBlocksFruitTree || canPlantTreesExactly;
}

function createTreePlacementPolicy(
  tmxMap: TmxMap,
  mapFile: string | undefined,
): TreePlacementPolicy {
  if (mapFile === undefined) {
    return {
      allowTreesAnywhere: true,
      greenhouseTrees: false,
      fruitTreesUseFarmRule: false,
    };
  }

  const listedFarmMap = anywhereTreeMapFiles.has(mapFile);
  const forceAllowTreePlanting = isTmxPropertyTruthy(
    tmxMap.properties.ForceAllowTreePlanting,
  );

  return {
    allowTreesAnywhere: listedFarmMap || forceAllowTreePlanting,
    greenhouseTrees: greenhouseTreeMapFiles.has(mapFile),
    fruitTreesUseFarmRule: listedFarmMap &&
      !greenhouseTreeMapFiles.has(mapFile) &&
      mapFile !== "Island_W.tmx",
  };
}

function createBlockedObjectTileKeys(
  tmxMap: TmxMap,
  mapFile: string | undefined,
): ReadonlySet<string> {
  const blockedObjectTileKeys = new Set<string>();

  for (const farmCaveTile of readFarmCaveObjectTiles(tmxMap)) {
    blockedObjectTileKeys.add(
      `${String(farmCaveTile.x)},${String(farmCaveTile.y)}`,
    );
  }

  if (mapFile === "Island_W.tmx") {
    for (const islandWestBlockedObjectTile of islandWestBlockedObjectTiles) {
      blockedObjectTileKeys.add(islandWestBlockedObjectTile);
    }
  }

  return blockedObjectTileKeys;
}

function readFarmCaveObjectTiles(
  tmxMap: TmxMap,
): readonly MapTileCoordinates[] {
  const warpProperty = tmxMap.properties.Warp;
  if (warpProperty === undefined) {
    return [];
  }

  const warpTokens = warpProperty.trim().split(/\s+/).filter(
    (warpToken) => warpToken.length > 0,
  );

  for (let tokenIndex = 0; tokenIndex + 4 < warpTokens.length; tokenIndex += 5) {
    const warpTarget = warpTokens[tokenIndex + 2];
    if (warpTarget === undefined || warpTarget.toLowerCase() !== "farmcave") {
      continue;
    }

    const warpX = warpTokens[tokenIndex];
    const warpY = warpTokens[tokenIndex + 1];
    const warpTile = readIntegerCoordinate(warpX, warpY);
    if (warpTile === null) {
      continue;
    }

    const farmCaveEntry = readFarmCaveEntry(tmxMap.properties.FarmCaveEntry);
    return [
      warpTile,
      farmCaveEntry ?? { x: warpTile.x, y: warpTile.y + 1 },
    ];
  }

  return [];
}

function readFarmCaveEntry(
  farmCaveEntryProperty: string | undefined,
): MapTileCoordinates | null {
  if (farmCaveEntryProperty === undefined) {
    return null;
  }

  const entryTokens = farmCaveEntryProperty.trim().split(/\s+/).filter(
    (entryToken) => entryToken.length > 0,
  );

  return readIntegerCoordinate(entryTokens[0], entryTokens[1]);
}

function readIntegerCoordinate(
  rawX: string | undefined,
  rawY: string | undefined,
): MapTileCoordinates | null {
  if (rawX === undefined || rawY === undefined) {
    return null;
  }

  if (!/^-?\d+$/.test(rawX) || !/^-?\d+$/.test(rawY)) {
    return null;
  }

  const x = Number(rawX);
  const y = Number(rawY);
  if (!Number.isSafeInteger(x) || !Number.isSafeInteger(y)) {
    return null;
  }

  return { x, y };
}

function assertMapFile(mapFile: string): void {
  if (typeof mapFile !== "string" || !mapFile.endsWith(".tmx") || mapFile.length <= ".tmx".length) {
    throw new TypeError(
      `Map placement map file must be a non-empty .tmx name; received ${describeValue(mapFile)}.`,
    );
  }
}

function isTreeBlockingNoSpawn(noSpawnPropertyValue: string | undefined): boolean {
  if (noSpawnPropertyValue === undefined) {
    return false;
  }

  const normalizedNoSpawnPropertyValue = noSpawnPropertyValue.toLowerCase();

  return normalizedNoSpawnPropertyValue === "tree" ||
    normalizedNoSpawnPropertyValue === "trees" ||
    normalizedNoSpawnPropertyValue === "all" ||
    normalizedNoSpawnPropertyValue === "true" ||
    normalizedNoSpawnPropertyValue === "t";
}

function isCrabPotTile(
  placementFactsByTile: readonly MapTilePlacementFacts[],
  mapWidth: number,
  mapHeight: number,
  tileIndex: number,
): boolean {
  const mapTilePlacementFacts = placementFactsByTile[tileIndex];

  if (mapTilePlacementFacts === undefined) {
    throw new Error(
      `Map placement facts are missing tile index ${String(tileIndex)} while calculating crab-pot placement.`,
    );
  }

  if (
    !mapTilePlacementFacts.isBackTileWater ||
    mapTilePlacementFacts.isBuildingsTilePassable
  ) {
    return false;
  }

  const { x, y } = mapTilePlacementFacts.tileCoordinates;
  const leftTile = getPlacementFactsAtCoordinate(
    placementFactsByTile,
    mapWidth,
    mapHeight,
    x - 1,
    y,
  );
  const rightTile = getPlacementFactsAtCoordinate(
    placementFactsByTile,
    mapWidth,
    mapHeight,
    x + 1,
    y,
  );
  const upperTile = getPlacementFactsAtCoordinate(
    placementFactsByTile,
    mapWidth,
    mapHeight,
    x,
    y - 1,
  );
  const lowerTile = getPlacementFactsAtCoordinate(
    placementFactsByTile,
    mapWidth,
    mapHeight,
    x,
    y + 1,
  );
  const isWaterCorridor =
    (leftTile?.isBackTileWater === true && rightTile?.isBackTileWater === true) ||
    (upperTile?.isBackTileWater === true && lowerTile?.isBackTileWater === true);

  if (!isWaterCorridor) {
    return false;
  }

  return getAdjacentPlacementFacts(
    placementFactsByTile,
    mapWidth,
    mapHeight,
    x,
    y,
  ).some((adjacentTile) => isCrabPotAdjacentTilePassable(adjacentTile));
}

function getPlacementFactsAtCoordinate(
  placementFactsByTile: readonly MapTilePlacementFacts[],
  mapWidth: number,
  mapHeight: number,
  x: number,
  y: number,
): MapTilePlacementFacts | undefined {
  if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) {
    return undefined;
  }

  return placementFactsByTile[y * mapWidth + x];
}

function getAdjacentPlacementFacts(
  placementFactsByTile: readonly MapTilePlacementFacts[],
  mapWidth: number,
  mapHeight: number,
  centerX: number,
  centerY: number,
): readonly MapTilePlacementFacts[] {
  const adjacentPlacementFacts: MapTilePlacementFacts[] = [];

  for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
    for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
      if (xOffset === 0 && yOffset === 0) {
        continue;
      }

      const adjacentTile = getPlacementFactsAtCoordinate(
        placementFactsByTile,
        mapWidth,
        mapHeight,
        centerX + xOffset,
        centerY + yOffset,
      );

      if (adjacentTile !== undefined) {
        adjacentPlacementFacts.push(adjacentTile);
      }
    }
  }

  return adjacentPlacementFacts;
}

function isMapTilePassable(
  mapTilePlacementFacts: MapTilePlacementFacts,
): boolean {
  return mapTilePlacementFacts.isBackTilePresent &&
    !mapTilePlacementFacts.isBackTileWater &&
    (!mapTilePlacementFacts.isBuildingsTilePresent ||
      mapTilePlacementFacts.isBuildingsTilePassable);
}

function isCrabPotAdjacentTilePassable(
  mapTilePlacementFacts: MapTilePlacementFacts,
): boolean {
  return isMapTilePassable(mapTilePlacementFacts) ||
    mapTilePlacementFacts.isBuildingsTilePassable;
}

function getRequiredTileLayer(tmxMap: TmxMap, layerName: string): TmxTileLayer {
  const matchingLayers = tmxMap.tileLayers.filter(
    (tileLayer) => tileLayer.name === layerName,
  );

  if (matchingLayers.length !== 1) {
    throw new Error(
      `TMX placement grid requires exactly one ${JSON.stringify(layerName)} tile layer; received ${String(matchingLayers.length)}.`,
    );
  }

  const matchingLayer = matchingLayers[0];

  if (matchingLayer === undefined) {
    throw new Error(
      `TMX placement grid could not read required tile layer ${JSON.stringify(layerName)}.`,
    );
  }

  return matchingLayer;
}

function islandDiggableTilesetAllowed(
  islandDiggableRequiresOutdoorsSheet: boolean,
  backTilesetImageSource: string | null,
): boolean {
  if (!islandDiggableRequiresOutdoorsSheet) {
    return true;
  }

  return backTilesetImageSource !== null &&
    backTilesetImageSource.includes("outdoorsTileSheet");
}

function getLayerTileProperties(
  tmxMap: TmxMap,
  tileLayer: TmxTileLayer,
  tileCoordinates: MapTileCoordinates,
): TmxProperties {
  const tileset = getLayerTileset(tmxMap, tileLayer, tileCoordinates);
  if (tileset === null) {
    return {};
  }

  const baseGid = getLayerBaseGid(tileLayer, tileCoordinates);
  return tileset.tileProperties.get(baseGid - tileset.firstGid) ?? {};
}

function getLayerTilesetImageSource(
  tmxMap: TmxMap,
  tileLayer: TmxTileLayer,
  tileCoordinates: MapTileCoordinates,
): string | null {
  return getLayerTileset(tmxMap, tileLayer, tileCoordinates)?.imageSource ?? null;
}

function getLayerTileset(
  tmxMap: TmxMap,
  tileLayer: TmxTileLayer,
  tileCoordinates: MapTileCoordinates,
): TmxTileset | null {
  const baseGid = getLayerBaseGid(tileLayer, tileCoordinates);
  if (baseGid === 0) {
    return null;
  }

  return getTilesetForBaseGid(tmxMap.tilesets, baseGid, tileLayer.name);
}

function getLayerBaseGid(
  tileLayer: TmxTileLayer,
  tileCoordinates: MapTileCoordinates,
): number {
  if (
    tileCoordinates.x < 0 ||
    tileCoordinates.y < 0 ||
    tileCoordinates.x >= tileLayer.width ||
    tileCoordinates.y >= tileLayer.height
  ) {
    return 0;
  }

  const tileIndex = tileCoordinates.y * tileLayer.width + tileCoordinates.x;
  const rawGid = tileLayer.rawGids[tileIndex];

  if (rawGid === undefined) {
    throw new Error(
      `TMX layer ${JSON.stringify(tileLayer.name)} has no raw GID at x "${String(tileCoordinates.x)}", y "${String(tileCoordinates.y)}" (index ${String(tileIndex)}).`,
    );
  }

  return getBaseTileGid(rawGid);
}

function getTilesetForBaseGid(
  tilesets: readonly TmxTileset[],
  baseGid: number,
  layerName: string,
): TmxTileset {
  const matchingTileset = tilesets.find(
    (tileset) =>
      baseGid >= tileset.firstGid &&
      baseGid < tileset.firstGid + tileset.tileCount,
  );

  if (matchingTileset === undefined) {
    throw new Error(
      `TMX layer ${JSON.stringify(layerName)} has base GID "${String(baseGid)}" outside every declared tileset range.`,
    );
  }

  return matchingTileset;
}

function assertMapDimensions(tmxMap: TmxMap): void {
  if (
    !Number.isSafeInteger(tmxMap.width) ||
    !Number.isSafeInteger(tmxMap.height) ||
    tmxMap.width <= 0 ||
    tmxMap.height <= 0
  ) {
    throw new TypeError(
      `TMX map dimensions must be positive safe integers; received width ${describeValue(tmxMap.width)}, height ${describeValue(tmxMap.height)}.`,
    );
  }
}

function assertTileLayerGeometry(tileLayer: TmxTileLayer): void {
  if (
    !Number.isSafeInteger(tileLayer.width) ||
    !Number.isSafeInteger(tileLayer.height) ||
    tileLayer.width <= 0 ||
    tileLayer.height <= 0
  ) {
    throw new TypeError(
      `TMX layer ${JSON.stringify(tileLayer.name)} dimensions must be positive safe integers; received width ${describeValue(tileLayer.width)}, height ${describeValue(tileLayer.height)}.`,
    );
  }

  const expectedGidCount = tileLayer.width * tileLayer.height;

  if (tileLayer.rawGids.length !== expectedGidCount) {
    throw new Error(
      `TMX layer ${JSON.stringify(tileLayer.name)} has raw GID length ${String(tileLayer.rawGids.length)} for dimensions ${String(tileLayer.width)}x${String(tileLayer.height)}; expected ${String(expectedGidCount)}.`,
    );
  }
}

function assertMapPlacementGrid(mapPlacementGrid: MapPlacementGrid): void {
  if (typeof mapPlacementGrid !== "object" || mapPlacementGrid === null) {
    throw new TypeError(
      `Map placement grid must be a non-null object; received ${describeValue(mapPlacementGrid)}.`,
    );
  }

  if (
    !Number.isSafeInteger(mapPlacementGrid.width) ||
    !Number.isSafeInteger(mapPlacementGrid.height) ||
    mapPlacementGrid.width <= 0 ||
    mapPlacementGrid.height <= 0
  ) {
    throw new TypeError(
      `Map placement grid dimensions must be positive safe integers; received width ${describeValue(mapPlacementGrid.width)}, height ${describeValue(mapPlacementGrid.height)}.`,
    );
  }

  const expectedCapabilityCount = mapPlacementGrid.width * mapPlacementGrid.height;

  if (mapPlacementGrid.capabilitiesByTile.length !== expectedCapabilityCount) {
    throw new Error(
      `Map placement grid has ${String(mapPlacementGrid.capabilitiesByTile.length)} capabilities for dimensions ${String(mapPlacementGrid.width)}x${String(mapPlacementGrid.height)}; expected ${String(expectedCapabilityCount)}.`,
    );
  }

  for (let tileIndex = 0; tileIndex < mapPlacementGrid.capabilitiesByTile.length; tileIndex += 1) {
    const tileCapabilities = mapPlacementGrid.capabilitiesByTile[tileIndex];

    if (tileCapabilities === undefined || typeof tileCapabilities.wall !== "boolean") {
      throw new TypeError(
        `Map placement grid capability at index ${String(tileIndex)} must include boolean wall; received ${describeValue(tileCapabilities?.wall)}.`,
      );
    }
  }
}

function assertTileCoordinates(tileCoordinates: MapTileCoordinates): void {
  if (typeof tileCoordinates !== "object" || tileCoordinates === null) {
    throw new TypeError(
      `Map tile coordinates must be a non-null object; received ${describeValue(tileCoordinates)}.`,
    );
  }

  if (
    !Number.isSafeInteger(tileCoordinates.x) ||
    !Number.isSafeInteger(tileCoordinates.y) ||
    tileCoordinates.x < 0 ||
    tileCoordinates.y < 0
  ) {
    throw new TypeError(
      `Map tile coordinates must be non-negative safe integers; received x ${describeValue(tileCoordinates.x)}, y ${describeValue(tileCoordinates.y)}.`,
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
