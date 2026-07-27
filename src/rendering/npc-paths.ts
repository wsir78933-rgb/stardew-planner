import { getBaseTileGid } from "../tmx/decode-tile-layer-data";
import type { TmxMap, TmxProperties, TmxTileLayer, TmxTileset } from "../tmx/tmx-types";

export type NpcPathOverlayTile = Readonly<{
  x: number;
  y: number;
}>;

type NpcRoute = Readonly<{
  mapFile: "BusStop.tmx";
  entry: NpcPathOverlayTile;
  destination: NpcPathOverlayTile;
}>;

type PathSearchNode = Readonly<{
  x: number;
  y: number;
  distanceFromEntry: number;
  parent: PathSearchNode | null;
}>;

type PathPriorityQueue = {
  bucketsByPriority: Map<number, PathSearchNode[]>;
  sortedPriorities: number[];
  size: number;
};

const npcPathSupportedMapFile = "BusStop.tmx";
const maximumNpcPathSearchIterations = 10_000;
const pathDirections: readonly NpcPathOverlayTile[] = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

const busStopNpcRoutes: readonly NpcRoute[] = [
  {
    mapFile: "BusStop.tmx",
    entry: { x: 42, y: 23 },
    destination: { x: 21, y: 10 },
  },
  {
    mapFile: "BusStop.tmx",
    entry: { x: 21, y: 10 },
    destination: { x: 44, y: 22 },
  },
  {
    mapFile: "BusStop.tmx",
    entry: { x: 42, y: 23 },
    destination: { x: 22, y: 5 },
  },
  {
    mapFile: "BusStop.tmx",
    entry: { x: 22, y: 5 },
    destination: { x: 44, y: 22 },
  },
  {
    mapFile: "BusStop.tmx",
    entry: { x: 10, y: 23 },
    destination: { x: 44, y: 22 },
  },
  {
    mapFile: "BusStop.tmx",
    entry: { x: 42, y: 23 },
    destination: { x: 9, y: 23 },
  },
  {
    mapFile: "BusStop.tmx",
    entry: { x: 42, y: 23 },
    destination: { x: 22, y: 8 },
  },
  {
    mapFile: "BusStop.tmx",
    entry: { x: 22, y: 10 },
    destination: { x: 44, y: 22 },
  },
  {
    mapFile: "BusStop.tmx",
    entry: { x: 10, y: 23 },
    destination: { x: 22, y: 8 },
  },
  {
    mapFile: "BusStop.tmx",
    entry: { x: 22, y: 10 },
    destination: { x: 9, y: 23 },
  },
];

export function isNpcPathSupportedMapFile(mapFile: string): boolean {
  if (typeof mapFile !== "string") {
    throw new TypeError(
      `NPC path map file must be a string; received ${describeValue(mapFile)}.`,
    );
  }

  return mapFile === npcPathSupportedMapFile;
}

export function createNpcPathOverlayTiles(
  mapFile: string,
  parsedMap: TmxMap,
): readonly NpcPathOverlayTile[] {
  if (!isNpcPathSupportedMapFile(mapFile)) {
    return [];
  }

  assertNpcPathMap(parsedMap);
  const overlayTileByKey = new Map<string, NpcPathOverlayTile>();

  for (const busStopNpcRoute of busStopNpcRoutes) {
    const routePath = findNpcRoutePath(
      parsedMap,
      busStopNpcRoute.entry,
      busStopNpcRoute.destination,
    );

    if (routePath === null) {
      continue;
    }

    for (const routeTile of routePath) {
      overlayTileByKey.set(createTileKey(routeTile.x, routeTile.y), routeTile);
    }
  }

  return [...overlayTileByKey.values()];
}

function findNpcRoutePath(
  parsedMap: TmxMap,
  entryTile: NpcPathOverlayTile,
  destinationTile: NpcPathOverlayTile,
): readonly NpcPathOverlayTile[] | null {
  const warpTileIndexes = createWarpTileIndexes(parsedMap);
  const openPathNodes = createPathPriorityQueue();
  const initialNode: PathSearchNode = {
    x: entryTile.x,
    y: entryTile.y,
    distanceFromEntry: 0,
    parent: null,
  };
  enqueuePathNode(
    openPathNodes,
    initialNode,
    getManhattanDistance(entryTile, destinationTile),
  );
  const closedTileKeys = new Set<string>();
  let previousExpandedNode = initialNode;
  let searchIterationCount = 0;

  while (openPathNodes.size > 0) {
    const activeNode = dequeuePathNode(openPathNodes);

    if (activeNode === null) {
      return null;
    }

    if (
      activeNode.x === destinationTile.x &&
      activeNode.y === destinationTile.y
    ) {
      return createPathFromDestination(activeNode);
    }

    closedTileKeys.add(createTileKey(activeNode.x, activeNode.y));

    for (const pathDirection of pathDirections) {
      const neighborX = activeNode.x + pathDirection.x;
      const neighborY = activeNode.y + pathDirection.y;
      const neighborTileKey = createTileKey(neighborX, neighborY);
      const isDestinationTile =
        neighborX === destinationTile.x && neighborY === destinationTile.y;

      if (
        closedTileKeys.has(neighborTileKey) ||
        (!isDestinationTile &&
          (isOutsideMap(parsedMap, neighborX, neighborY) ||
            isNpcPathBlocked(parsedMap, neighborX, neighborY, warpTileIndexes)))
      ) {
        continue;
      }

      const nextDistanceFromEntry = activeNode.distanceFromEntry + 1;
      const continuesPreviousDirection =
        (neighborX === activeNode.x && neighborX === previousExpandedNode.x) ||
        (neighborY === activeNode.y && neighborY === previousExpandedNode.y);
      const priority =
        nextDistanceFromEntry +
        getNpcPathSurfaceCost(parsedMap, neighborX, neighborY) +
        getManhattanDistance({ x: neighborX, y: neighborY }, destinationTile) +
        (continuesPreviousDirection ? -2 : 0);

      if (
        !containsPathNodeAtPriority(
          openPathNodes,
          neighborX,
          neighborY,
          priority,
        )
      ) {
        enqueuePathNode(
          openPathNodes,
          {
            x: neighborX,
            y: neighborY,
            distanceFromEntry: nextDistanceFromEntry,
            parent: activeNode,
          },
          priority,
        );
      }
    }

    previousExpandedNode = activeNode;
    searchIterationCount += 1;

    if (searchIterationCount >= maximumNpcPathSearchIterations) {
      return null;
    }
  }

  return null;
}

function createWarpTileIndexes(parsedMap: TmxMap): ReadonlySet<number> {
  const warpPropertyValue = parsedMap.properties.Warp;

  if (warpPropertyValue === undefined || warpPropertyValue.length === 0) {
    return new Set();
  }

  const warpTokens = warpPropertyValue.split(/\s+/);
  const warpTileIndexes = new Set<number>();

  for (let tokenIndex = 0; tokenIndex + 4 < warpTokens.length; tokenIndex += 5) {
    const x = Number.parseInt(warpTokens[tokenIndex] ?? "", 10);
    const y = Number.parseInt(warpTokens[tokenIndex + 1] ?? "", 10);

    if (Number.isFinite(x) && Number.isFinite(y)) {
      warpTileIndexes.add(y * parsedMap.width + x);
    }
  }

  return warpTileIndexes;
}

function isNpcPathBlocked(
  parsedMap: TmxMap,
  tileX: number,
  tileY: number,
  warpTileIndexes: ReadonlySet<number>,
): boolean {
  const buildingTileProperties = getLayerTileProperties(
    parsedMap,
    "Buildings",
    tileX,
    tileY,
  );

  if (buildingTileProperties !== null) {
    const buildingAction = buildingTileProperties.Action;

    if (buildingAction !== undefined) {
      if (
        buildingAction.startsWith("LockedDoorWarp") ||
        (!buildingAction.includes("Door") && !buildingAction.includes("Passable"))
      ) {
        return true;
      }
    } else if (
      !("Passable" in buildingTileProperties) &&
      !("NPCPassable" in buildingTileProperties)
    ) {
      return true;
    }
  }

  const backTileProperties = getLayerTileProperties(parsedMap, "Back", tileX, tileY);

  if (backTileProperties !== null && "NoPath" in backTileProperties) {
    return true;
  }

  return warpTileIndexes.has(tileY * parsedMap.width + tileX);
}

function getNpcPathSurfaceCost(
  parsedMap: TmxMap,
  tileX: number,
  tileY: number,
): number {
  const tileType = getLayerTileProperties(parsedMap, "Back", tileX, tileY)?.Type;

  switch (tileType?.toLowerCase()) {
    case "stone":
      return -7;
    case "wood":
      return -4;
    case "dirt":
      return -2;
    case "grass":
      return -1;
    default:
      return 0;
  }
}

function getLayerTileProperties(
  parsedMap: TmxMap,
  layerName: string,
  tileX: number,
  tileY: number,
): TmxProperties | null {
  const tileLayer = parsedMap.tileLayers.find(
    (candidateTileLayer) => candidateTileLayer.name === layerName,
  );

  if (tileLayer === undefined) {
    return null;
  }

  const rawGid = getLayerRawGid(tileLayer, tileX, tileY);

  if (rawGid === 0) {
    return null;
  }

  const baseGid = getBaseTileGid(rawGid);
  const tileset = getTilesetForBaseGid(parsedMap.tilesets, baseGid);

  if (tileset === null) {
    return null;
  }

  const tilesetTileProperties =
    tileset.tileProperties.get(baseGid - tileset.firstGid) ?? {};
  const tileDataProperties =
    parsedMap.tileDataProperties.get(`${layerName}:${String(tileX)},${String(tileY)}`) ??
    {};
  const mergedTileProperties = { ...tilesetTileProperties, ...tileDataProperties };

  return Object.keys(mergedTileProperties).length === 0
    ? null
    : mergedTileProperties;
}

function getLayerRawGid(
  tileLayer: TmxTileLayer,
  tileX: number,
  tileY: number,
): number {
  if (
    tileX < 0 ||
    tileY < 0 ||
    tileX >= tileLayer.width ||
    tileY >= tileLayer.height
  ) {
    return 0;
  }

  return tileLayer.rawGids[tileY * tileLayer.width + tileX] ?? 0;
}

function getTilesetForBaseGid(
  tilesets: readonly TmxTileset[],
  baseGid: number,
): TmxTileset | null {
  for (let tilesetIndex = tilesets.length - 1; tilesetIndex >= 0; tilesetIndex -= 1) {
    const tileset = tilesets[tilesetIndex];

    if (tileset === undefined || baseGid < tileset.firstGid) {
      continue;
    }

    return baseGid < tileset.firstGid + tileset.tileCount ? tileset : null;
  }

  return null;
}

function createPathFromDestination(
  destinationNode: PathSearchNode,
): readonly NpcPathOverlayTile[] {
  const routeTiles: NpcPathOverlayTile[] = [];

  for (
    let currentPathNode: PathSearchNode | null = destinationNode;
    currentPathNode !== null;
    currentPathNode = currentPathNode.parent
  ) {
    routeTiles.unshift({ x: currentPathNode.x, y: currentPathNode.y });
  }

  return routeTiles;
}

function createPathPriorityQueue(): PathPriorityQueue {
  return { bucketsByPriority: new Map(), sortedPriorities: [], size: 0 };
}

function enqueuePathNode(
  pathPriorityQueue: PathPriorityQueue,
  pathNode: PathSearchNode,
  priority: number,
): void {
  const bucket = pathPriorityQueue.bucketsByPriority.get(priority);

  if (bucket !== undefined) {
    bucket.push(pathNode);
    pathPriorityQueue.size += 1;
    return;
  }

  const nextBucket = [pathNode];
  pathPriorityQueue.bucketsByPriority.set(priority, nextBucket);
  const insertionIndex = findPriorityInsertionIndex(
    pathPriorityQueue.sortedPriorities,
    priority,
  );
  pathPriorityQueue.sortedPriorities.splice(insertionIndex, 0, priority);
  pathPriorityQueue.size += 1;
}

function findPriorityInsertionIndex(
  sortedPriorities: readonly number[],
  priority: number,
): number {
  let lowerBound = 0;
  let upperBound = sortedPriorities.length;

  while (lowerBound < upperBound) {
    const midpoint = (lowerBound + upperBound) >> 1;
    const midpointPriority = sortedPriorities[midpoint];

    if (midpointPriority !== undefined && midpointPriority < priority) {
      lowerBound = midpoint + 1;
    } else {
      upperBound = midpoint;
    }
  }

  return lowerBound;
}

function dequeuePathNode(
  pathPriorityQueue: PathPriorityQueue,
): PathSearchNode | null {
  for (const priority of pathPriorityQueue.sortedPriorities) {
    const bucket = pathPriorityQueue.bucketsByPriority.get(priority);

    if (bucket === undefined || bucket.length === 0) {
      continue;
    }

    const pathNode = bucket.shift();

    if (pathNode === undefined) {
      throw new Error(
        `NPC path priority bucket at priority ${String(priority)} unexpectedly returned undefined.`,
      );
    }

    pathPriorityQueue.size -= 1;
    return pathNode;
  }

  return null;
}

function containsPathNodeAtPriority(
  pathPriorityQueue: PathPriorityQueue,
  tileX: number,
  tileY: number,
  priority: number,
): boolean {
  const bucket = pathPriorityQueue.bucketsByPriority.get(priority);

  return bucket?.some(
    (pathNode) => pathNode.x === tileX && pathNode.y === tileY,
  ) ?? false;
}

function getManhattanDistance(
  firstTile: NpcPathOverlayTile,
  secondTile: NpcPathOverlayTile,
): number {
  return (
    Math.abs(secondTile.x - firstTile.x) +
    Math.abs(secondTile.y - firstTile.y)
  );
}

function isOutsideMap(parsedMap: TmxMap, tileX: number, tileY: number): boolean {
  return tileX < 0 || tileY < 0 || tileX >= parsedMap.width || tileY >= parsedMap.height;
}

function createTileKey(tileX: number, tileY: number): string {
  return `${String(tileX)},${String(tileY)}`;
}

function assertNpcPathMap(parsedMap: TmxMap): void {
  if (typeof parsedMap !== "object" || parsedMap === null) {
    throw new TypeError(
      `NPC path map must be a non-null object; received ${describeValue(parsedMap)}.`,
    );
  }

  if (
    !Number.isSafeInteger(parsedMap.width) ||
    !Number.isSafeInteger(parsedMap.height) ||
    parsedMap.width <= 0 ||
    parsedMap.height <= 0 ||
    !Array.isArray(parsedMap.tileLayers) ||
    !Array.isArray(parsedMap.tilesets)
  ) {
    throw new TypeError(
      `NPC path map must have positive integer dimensions and tileset/layer arrays; received width ${describeValue(parsedMap.width)}, height ${describeValue(parsedMap.height)}, tilesets ${describeValue(parsedMap.tilesets)}, tileLayers ${describeValue(parsedMap.tileLayers)}.`,
    );
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
