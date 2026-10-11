import type { TmxMap } from "../tmx/tmx-types";
import { getPlannerMapById } from "./map-catalog";

export type FarmSpouseId =
  | "Abigail"
  | "Penny"
  | "Leah"
  | "Haley"
  | "Maru"
  | "Sebastian"
  | "Alex"
  | "Harvey"
  | "Elliott"
  | "Sam"
  | "Shane"
  | "Emily";

export type FarmCaveChoice = "none" | "mushrooms" | "bats";

export type FarmSpouseFrame = readonly [frameIndex: number, durationMilliseconds: number];

export type FarmSpouseDefinition = Readonly<{
  id: FarmSpouseId;
  label: FarmSpouseId;
  spriteAssetPath: string;
  sourceCrop: Readonly<{ x: number; y: number; width: number; height: number }>;
  stand: Readonly<{ dx: number; dy: number }>;
  frames: readonly FarmSpouseFrame[];
  offset: Readonly<{ x: number; y: number }>;
}>;

export type FarmCaveObject = Readonly<{
  catalogItemId: string;
  spriteIndex: number;
  x: number;
  y: number;
}>;

export type FarmSpouseDecoration = Readonly<{
  spouseId: FarmSpouseId;
  spriteAssetPath: string;
  x: number;
  y: number;
  offset: Readonly<{ x: number; y: number }>;
  frames: readonly FarmSpouseFrame[];
}>;

export type FarmMapDecorationPlan = Readonly<{
  spouse: FarmSpouseDecoration | null;
  caveObjects: readonly FarmCaveObject[];
}>;

export const farmSpouseDefinitions: readonly FarmSpouseDefinition[] = [
  {
    id: "Abigail",
    label: "Abigail",
    spriteAssetPath: "sprites/Abigail.png",
    sourceCrop: { x: 0, y: 0, width: 4, height: 4 },
    stand: { dx: 2, dy: 2 },
    frames: [[16, 500], [17, 500], [18, 500], [19, 500]],
    offset: { x: 0, y: 0 },
  },
  {
    id: "Penny",
    label: "Penny",
    spriteAssetPath: "sprites/Penny.png",
    sourceCrop: { x: 4, y: 0, width: 4, height: 4 },
    stand: { dx: 2, dy: 2 },
    frames: [[18, 6000], [19, 500]],
    offset: { x: 0, y: 0 },
  },
  {
    id: "Leah",
    label: "Leah",
    spriteAssetPath: "sprites/Leah.png",
    sourceCrop: { x: 8, y: 0, width: 4, height: 4 },
    stand: { dx: 2, dy: 2 },
    frames: [[16, 100], [17, 100], [18, 100], [19, 300], [16, 100], [17, 100], [18, 100], [19, 1000], [16, 100], [17, 100], [18, 100], [19, 300], [16, 100], [17, 100], [18, 100], [19, 300], [16, 100], [17, 100], [18, 100], [19, 2000]],
    offset: { x: 0, y: 0 },
  },
  {
    id: "Haley",
    label: "Haley",
    spriteAssetPath: "sprites/Haley.png",
    sourceCrop: { x: 12, y: 0, width: 4, height: 4 },
    stand: { dx: 1, dy: 2 },
    frames: [[30, 2000], [31, 200], [24, 2000], [25, 1000], [32, 200], [33, 2000], [32, 200], [25, 200], [32, 200], [33, 2000]],
    offset: { x: 0, y: 0 },
  },
  {
    id: "Maru",
    label: "Maru",
    spriteAssetPath: "sprites/Maru.png",
    sourceCrop: { x: 16, y: 0, width: 4, height: 4 },
    stand: { dx: 1, dy: 2 },
    frames: [[16, 4000], [17, 200], [18, 200], [19, 200], [20, 200], [21, 200], [22, 200], [23, 200]],
    offset: { x: 0, y: 0 },
  },
  {
    id: "Sebastian",
    label: "Sebastian",
    spriteAssetPath: "sprites/Sebastian.png",
    sourceCrop: { x: 0, y: 4, width: 4, height: 4 },
    stand: { dx: 2, dy: 3 },
    frames: [[32, 500], [36, 500], [32, 500], [36, 500], [32, 500], [36, 500], [32, 500], [36, 2000], [33, 100], [34, 100], [35, 3000], [34, 100], [33, 100], [32, 1500]],
    offset: { x: 4, y: 10 },
  },
  {
    id: "Alex",
    label: "Alex",
    spriteAssetPath: "sprites/Alex.png",
    sourceCrop: { x: 4, y: 4, width: 4, height: 4 },
    stand: { dx: 2, dy: 2 },
    frames: [[34, 4000], [33, 300], [28, 200], [29, 100], [30, 100], [31, 100], [32, 100], [31, 100], [30, 100], [29, 100], [28, 800], [29, 100], [30, 100], [31, 100], [32, 100], [31, 100], [30, 100], [29, 100], [28, 800], [33, 200]],
    offset: { x: 0, y: 0 },
  },
  {
    id: "Harvey",
    label: "Harvey",
    spriteAssetPath: "sprites/Harvey.png",
    sourceCrop: { x: 8, y: 4, width: 4, height: 4 },
    stand: { dx: 2, dy: 2 },
    frames: [[42, 6000], [43, 1000], [39, 100], [43, 500], [39, 100], [43, 1000], [42, 5000], [43, 3000]],
    offset: { x: 0, y: 0 },
  },
  {
    id: "Elliott",
    label: "Elliott",
    spriteAssetPath: "sprites/Elliott.png",
    sourceCrop: { x: 12, y: 4, width: 4, height: 4 },
    stand: { dx: 2, dy: 2 },
    frames: [[33, 3000], [32, 500], [33, 3000], [32, 500], [33, 2000], [34, 1500]],
    offset: { x: 0, y: 0 },
  },
  {
    id: "Sam",
    label: "Sam",
    spriteAssetPath: "sprites/Sam.png",
    sourceCrop: { x: 16, y: 4, width: 4, height: 4 },
    stand: { dx: 2, dy: 2 },
    frames: [[25, 3000], [27, 500], [26, 100], [28, 100], [27, 500], [25, 2000], [27, 500], [26, 100], [29, 100], [30, 100], [32, 500], [31, 1000], [30, 100], [29, 100]],
    offset: { x: 0, y: 0 },
  },
  {
    id: "Shane",
    label: "Shane",
    spriteAssetPath: "sprites/Shane.png",
    sourceCrop: { x: 0, y: 8, width: 4, height: 4 },
    stand: { dx: 0, dy: 3 },
    frames: [[28, 4000], [29, 800]],
    offset: { x: 0, y: 0 },
  },
  {
    id: "Emily",
    label: "Emily",
    spriteAssetPath: "sprites/Emily.png",
    sourceCrop: { x: 4, y: 8, width: 4, height: 4 },
    stand: { dx: 1, dy: 3 },
    frames: [[54, 4000]],
    offset: { x: 0, y: 0 },
  },
];

const defaultSpousePatioPosition = { x: 69, y: 6 } as const;
const defaultFarmCaveObjects: readonly FarmCaveObject[] = [
  { catalogItemId: "big-craftable:128", spriteIndex: 128, x: 4, y: 5 },
  { catalogItemId: "big-craftable:128", spriteIndex: 128, x: 6, y: 5 },
  { catalogItemId: "big-craftable:128", spriteIndex: 128, x: 8, y: 5 },
  { catalogItemId: "big-craftable:128", spriteIndex: 128, x: 4, y: 7 },
  { catalogItemId: "big-craftable:128", spriteIndex: 128, x: 6, y: 7 },
  { catalogItemId: "big-craftable:128", spriteIndex: 128, x: 8, y: 7 },
  { catalogItemId: "big-craftable:Dehydrator", spriteIndex: 286, x: 10, y: 5 },
];

export function isFarmSpouseId(value: unknown): value is FarmSpouseId {
  return farmSpouseDefinitions.some((spouseDefinition) => spouseDefinition.id === value);
}

export function readFarmSpouseId(value: unknown): FarmSpouseId {
  if (!isFarmSpouseId(value)) {
    throw new TypeError(
      `Farm spouse ID must be one of ${farmSpouseDefinitions.map((spouseDefinition) => spouseDefinition.id).join(", ")}; received ${describeValue(value)}.`,
    );
  }

  return value;
}

export function readFarmCaveChoice(value: unknown): FarmCaveChoice {
  if (value !== "none" && value !== "mushrooms" && value !== "bats") {
    throw new TypeError(
      `Farm cave choice must be "none", "mushrooms", or "bats"; received ${describeValue(value)}.`,
    );
  }

  return value;
}

export function getFarmSpouseDefinition(
  spouseId: FarmSpouseId,
): FarmSpouseDefinition {
  const restoredSpouseId = readFarmSpouseId(spouseId);
  const spouseDefinition = farmSpouseDefinitions.find(
    (candidate) => candidate.id === restoredSpouseId,
  );
  if (spouseDefinition === undefined) {
    throw new Error(
      `Farm spouse definition ${JSON.stringify(restoredSpouseId)} is missing from the local spouse catalog.`,
    );
  }

  return spouseDefinition;
}

export function createFarmCaveObjects(
  caveChoice: FarmCaveChoice,
): readonly FarmCaveObject[] {
  const restoredCaveChoice = readFarmCaveChoice(caveChoice);
  return restoredCaveChoice === "mushrooms"
    ? defaultFarmCaveObjects.map((farmCaveObject) => ({ ...farmCaveObject }))
    : [];
}

export function createFarmMapDecorationPlan(input: Readonly<{
  mapId: string;
  parsedMap: TmxMap;
  spouseId: FarmSpouseId | null;
  caveChoice: FarmCaveChoice;
}>): FarmMapDecorationPlan {
  const caveChoice = readFarmCaveChoice(input.caveChoice);
  const spouseId = input.spouseId === null ? null : readFarmSpouseId(input.spouseId);
  if (typeof input.mapId !== "string" || input.mapId.length === 0) {
    throw new TypeError(
      `Farm map decoration mapId must be a non-empty string; received ${describeValue(input.mapId)}.`,
    );
  }
  if (typeof input.parsedMap !== "object" || input.parsedMap === null) {
    throw new TypeError(
      `Farm map decoration parsedMap must be a TmxMap object; received ${describeValue(input.parsedMap)}.`,
    );
  }

  const plannerMap = getPlannerMapById(input.mapId);
  const spouse =
    spouseId !== null &&
    plannerMap.category === "farm" &&
    plannerMap.mapFile !== "Island_W.tmx"
    ? createFarmSpouseDecoration(input.parsedMap, spouseId)
    : null;
  const caveObjects = plannerMap.mapFile === "FarmCave.tmx"
    ? createFarmCaveObjects(caveChoice)
    : [];

  return { spouse, caveObjects };
}

export function supportsFarmSpousePatio(mapId: string): boolean {
  const plannerMap = getPlannerMapById(mapId);
  return plannerMap.category === "farm" && plannerMap.mapFile !== "Island_W.tmx";
}

export function supportsFarmCaveChoice(mapId: string): boolean {
  const plannerMap = getPlannerMapById(mapId);
  return (
    plannerMap.mapFile === "FarmCave.tmx" ||
    (plannerMap.category === "farm" && plannerMap.mapFile !== "Island_W.tmx")
  );
}

export function getFarmSpousePatioTarget(parsedMap: TmxMap): Readonly<{ x: number; y: number }> {
  const spouseAreaLocation = parsedMap.properties.SpouseAreaLocation;
  let x: number = defaultSpousePatioPosition.x;
  let y: number = defaultSpousePatioPosition.y;
  if (spouseAreaLocation !== undefined && spouseAreaLocation.trim().length > 0) {
    const coordinates = spouseAreaLocation.trim().split(/\s+/);
    if (coordinates.length !== 2 || coordinates.some((coordinate) => !/^\d+$/.test(coordinate))) {
      throw new TypeError(
        `Farm SpouseAreaLocation must contain two non-negative integer coordinates; received ${JSON.stringify(spouseAreaLocation)}.`,
      );
    }
    [x, y] = coordinates.map(Number);
  }

  if (
    !Number.isSafeInteger(x) ||
    !Number.isSafeInteger(y) ||
    x + 4 > parsedMap.width ||
    y + 4 > parsedMap.height
  ) {
    throw new RangeError(
      `Farm SpouseAreaLocation ${JSON.stringify(spouseAreaLocation)} does not fit a 4x4 patio in map dimensions ${String(parsedMap.width)}x${String(parsedMap.height)}.`,
    );
  }

  return { x, y };
}

function createFarmSpouseDecoration(
  parsedMap: TmxMap,
  spouseId: FarmSpouseId,
): FarmSpouseDecoration {
  const spouseDefinition = getFarmSpouseDefinition(spouseId);
  const patioPosition = getFarmSpousePatioTarget(parsedMap);
  return {
    spouseId,
    spriteAssetPath: spouseDefinition.spriteAssetPath,
    x: patioPosition.x + spouseDefinition.stand.dx,
    y: patioPosition.y + spouseDefinition.stand.dy,
    offset: spouseDefinition.offset,
    frames: spouseDefinition.frames,
  };
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  return String(value);
}
