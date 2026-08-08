import { getPlannerMapById, plannerMaps } from "./map-catalog";
import {
  createPersistentPlacementSnapshot,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";

export type PlannerMapFile = (typeof plannerMaps)[number]["mapFile"];

type InitialBuildingPlacement = Readonly<{
  buildingId: string;
  x: number;
  y: number;
}>;

const standardFarmInitialBuildings = [
  { buildingId: "Farmhouse", x: 59, y: 12 },
  { buildingId: "Greenhouse", x: 25, y: 10 },
  { buildingId: "Shipping Bin", x: 71, y: 14 },
  { buildingId: "Pet Bowl", x: 53, y: 7 },
] as const satisfies readonly InitialBuildingPlacement[];

const initialBuildingsByMapFile: Readonly<
  Partial<Record<PlannerMapFile, readonly InitialBuildingPlacement[]>>
> = {
  "Farm.tmx": standardFarmInitialBuildings,
  "Farm_Fishing.tmx": standardFarmInitialBuildings,
  "Farm_Foraging.tmx": standardFarmInitialBuildings,
  "Farm_Mining.tmx": standardFarmInitialBuildings,
  "Farm_Combat.tmx": standardFarmInitialBuildings,
  "Farm_FourCorners.tmx": [
    { buildingId: "Farmhouse", x: 59, y: 12 },
    { buildingId: "Greenhouse", x: 36, y: 29 },
    { buildingId: "Shipping Bin", x: 71, y: 14 },
    { buildingId: "Pet Bowl", x: 49, y: 40 },
  ],
  "Farm_Island.tmx": [
    { buildingId: "Farmhouse", x: 59, y: 12 },
    { buildingId: "Greenhouse", x: 14, y: 14 },
    { buildingId: "Shipping Bin", x: 71, y: 14 },
    { buildingId: "Pet Bowl", x: 78, y: 21 },
  ],
  "Farm_Ranching.tmx": [
    { buildingId: "Farmhouse", x: 76, y: 16 },
    { buildingId: "Greenhouse", x: 37, y: 19 },
    { buildingId: "Shipping Bin", x: 88, y: 18 },
    { buildingId: "Pet Bowl", x: 91, y: 14 },
  ],
  "Island_W.tmx": [],
  "IF2R.tmx": [
    { buildingId: "Farmhouse", x: 59, y: 12 },
    { buildingId: "Greenhouse", x: 41, y: 45 },
    { buildingId: "Shipping Bin", x: 71, y: 14 },
    { buildingId: "Pet Bowl", x: 53, y: 7 },
  ],
  "FrontierFarm.tmx": [
    { buildingId: "Farmhouse", x: 113, y: 23 },
    { buildingId: "Greenhouse", x: 87, y: 4 },
    { buildingId: "Shipping Bin", x: 130, y: 26 },
    { buildingId: "Pet Bowl", x: 120, y: 15 },
  ],
  "GrandpasFarm.tmx": [
    { buildingId: "Farmhouse", x: 90, y: 46 },
    { buildingId: "Greenhouse", x: 18, y: 52 },
    { buildingId: "Shipping Bin", x: 107, y: 49 },
    { buildingId: "Pet Bowl", x: 102, y: 38 },
  ],
  "capitalist-dream.tmx": standardFarmInitialBuildings,
  "capitalist-dream-2.tmx": standardFarmInitialBuildings,
  "overgrown-garden.tmx": standardFarmInitialBuildings,
  "yet-another.tmx": standardFarmInitialBuildings,
  "solo-four-corners.tmx": [
    { buildingId: "Farmhouse", x: 59, y: 12 },
    { buildingId: "Greenhouse", x: 25, y: 10 },
    { buildingId: "Shipping Bin", x: 71, y: 12 },
    { buildingId: "Pet Bowl", x: 48, y: 40 },
  ],
  "strawberry-fields.tmx": standardFarmInitialBuildings,
  "blackberry-fields.tmx": [
    { buildingId: "Farmhouse", x: 71, y: 8 },
    { buildingId: "Greenhouse", x: 95, y: 16 },
    { buildingId: "Shipping Bin", x: 84, y: 12 },
    { buildingId: "Pet Bowl", x: 82, y: 7 },
  ],
  "zenith.tmx": [
    { buildingId: "Farmhouse", x: 39, y: 14 },
    { buildingId: "Greenhouse", x: 64, y: 26 },
    { buildingId: "Shipping Bin", x: 55, y: 19 },
    { buildingId: "Pet Bowl", x: 51, y: 17 },
  ],
  "everfarm.tmx": [
    { buildingId: "Farmhouse", x: 178, y: 4 },
    { buildingId: "Greenhouse", x: 169, y: 3 },
    { buildingId: "Shipping Bin", x: 193, y: 8 },
    { buildingId: "Pet Bowl", x: 194, y: 17 },
  ],
  "sea-breeze-island.tmx": [
    { buildingId: "Farmhouse", x: 48, y: 15 },
    { buildingId: "Greenhouse", x: 14, y: 46 },
    { buildingId: "Shipping Bin", x: 60, y: 18 },
    { buildingId: "Pet Bowl", x: 54, y: 36 },
  ],
  "aimon-s-small-hilltop.tmx": [
    { buildingId: "Farmhouse", x: 39, y: 6 },
    { buildingId: "Greenhouse", x: 14, y: 13 },
    { buildingId: "Shipping Bin", x: 53, y: 25 },
    { buildingId: "Pet Bowl", x: 32, y: 11 },
  ],
  "aimon-s-small-forest.tmx": [
    { buildingId: "Farmhouse", x: 55, y: 12 },
    { buildingId: "Greenhouse", x: 11, y: 2 },
    { buildingId: "Shipping Bin", x: 66, y: 15 },
    { buildingId: "Pet Bowl", x: 45, y: 5 },
  ],
  "more-lively-meadowlands.tmx": [
    { buildingId: "Farmhouse", x: 76, y: 16 },
    { buildingId: "Greenhouse", x: 37, y: 19 },
    { buildingId: "Shipping Bin", x: 88, y: 18 },
    { buildingId: "Pet Bowl", x: 91, y: 14 },
  ],
  "modest-maps-standard.tmx": [
    { buildingId: "Farmhouse", x: 61, y: 12 },
    { buildingId: "Greenhouse", x: 19, y: 7 },
    { buildingId: "Shipping Bin", x: 73, y: 14 },
    { buildingId: "Pet Bowl", x: 76, y: 19 },
  ],
  "waterfall-forest.tmx": standardFarmInitialBuildings,
};

export function createInitialMapPlacementSnapshot(
  plannerMapId: string,
): PlacementSnapshot {
  return createInitialMapPlacementSnapshotForMapFile(
    getPlannerMapById(plannerMapId).mapFile as PlannerMapFile,
  );
}

export function createInitialMapPlacementSnapshotForMapFile(
  mapFile: PlannerMapFile,
): PlacementSnapshot {
  const initialBuildingPlacements = initialBuildingsByMapFile[mapFile] ?? [];

  return createPersistentPlacementSnapshot({
    buildings: initialBuildingPlacements.map((initialBuildingPlacement, index) => ({
      ...initialBuildingPlacement,
      instanceId: index + 1,
    })),
    crops: [],
    items: [],
    nextBuildingId: initialBuildingPlacements.length + 1,
    nextItemId: 1,
  });
}
