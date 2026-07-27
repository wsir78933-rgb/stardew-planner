export type PlannerMapCategory =
  | "farm"
  | "interior"
  | "exterior"
  | "community-farm"
  | "community-interior";

export type PlannerMap = {
  id: string;
  displayName: string;
  category: PlannerMapCategory;
  mapFile: string;
  modId?: string;
  previewOutputPath: string;
};

export type TileCoordinate = Readonly<{
  x: number;
  y: number;
}>;

export type TileRectangle = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type GingerIslandOverlay = Readonly<{
  id: "restored" | "bin" | "cave" | "obelisk";
  displayName: string;
  mapFile: string;
  sourceCrop: TileRectangle;
  target: TileCoordinate;
}>;

export type FarmhouseRenovationId =
  | "bedroom"
  | "southern-room"
  | "corner-room"
  | "extended-corner-room"
  | "dining-room"
  | "dining-room-wall"
  | "cubby"
  | "far-upper-room"
  | "crib"
  | "cellar";

export type FarmhouseRenovation = Readonly<{
  id: FarmhouseRenovationId;
  displayName: string;
  mapFile: string;
  sourceCrop: TileRectangle;
  target: TileCoordinate;
  dependsOn: readonly FarmhouseRenovationId[];
}>;

export type SpouseRoomLayout = Readonly<{
  spouseId:
    | "abigail"
    | "penny"
    | "leah"
    | "haley"
    | "maru"
    | "sebastian"
    | "alex"
    | "harvey"
    | "elliott"
    | "sam"
    | "shane"
    | "emily"
    | "krobus";
  displayName: string;
  sourceCrop: TileRectangle;
  target: TileCoordinate;
}>;

export type Farmhouse2Composite = Readonly<{
  normalMapFile: "FarmHouse2.tmx";
  marriageMapFile: "FarmHouse2_marriage.tmx";
  spouseRoomMapFile: "spouseRooms.tmx";
  maximumSpouseCount: 1;
  renovationApplicationOrder: readonly FarmhouseRenovationId[];
  renovations: readonly FarmhouseRenovation[];
}>;

export type Farmhouse2RenderingRules = Readonly<{
  frontPreservationRectangle: TileRectangle;
  cornerRoomFrontTile: Readonly<{
    x: number;
    y: number;
    fallbackGid: number;
  }>;
}>;

function createReferencePreviewOutputPath(mapFile: string): string {
  return `maps/previews/${mapFile.replace(".tmx", ".png")}`;
}

function createCommunityPreviewOutputPath(modId: string): string {
  return `mods/${modId}/preview.png`;
}

export const plannerMaps = [
  {
    id: "standard",
    displayName: "Standard Farm",
    category: "farm",
    mapFile: "Farm.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Farm.tmx"),
  },
  {
    id: "riverland",
    displayName: "Riverland Farm",
    category: "farm",
    mapFile: "Farm_Fishing.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Farm_Fishing.tmx"),
  },
  {
    id: "forest",
    displayName: "Forest Farm",
    category: "farm",
    mapFile: "Farm_Foraging.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Farm_Foraging.tmx"),
  },
  {
    id: "hilltop",
    displayName: "Hill-top Farm",
    category: "farm",
    mapFile: "Farm_Mining.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Farm_Mining.tmx"),
  },
  {
    id: "wilderness",
    displayName: "Wilderness Farm",
    category: "farm",
    mapFile: "Farm_Combat.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Farm_Combat.tmx"),
  },
  {
    id: "four-corners",
    displayName: "Four Corners Farm",
    category: "farm",
    mapFile: "Farm_FourCorners.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Farm_FourCorners.tmx"),
  },
  {
    id: "beach",
    displayName: "Beach Farm",
    category: "farm",
    mapFile: "Farm_Island.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Farm_Island.tmx"),
  },
  {
    id: "meadowlands",
    displayName: "Meadowlands Farm",
    category: "farm",
    mapFile: "Farm_Ranching.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Farm_Ranching.tmx"),
  },
  {
    id: "ginger-island",
    displayName: "Ginger Island",
    category: "farm",
    mapFile: "Island_W.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Island_W.tmx"),
  },
  {
    id: "farmhouse-0",
    displayName: "Farmhouse",
    category: "interior",
    mapFile: "FarmHouse.tmx",
    previewOutputPath: createReferencePreviewOutputPath("FarmHouse.tmx"),
  },
  {
    id: "farmhouse-1",
    displayName: "Farmhouse (Upgrade 1)",
    category: "interior",
    mapFile: "FarmHouse1.tmx",
    previewOutputPath: createReferencePreviewOutputPath("FarmHouse1.tmx"),
  },
  {
    id: "farmhouse-2",
    displayName: "Farmhouse (Upgrade 2)",
    category: "interior",
    mapFile: "FarmHouse2.tmx",
    previewOutputPath: createReferencePreviewOutputPath("FarmHouse2.tmx"),
  },
  {
    id: "farmhouse-cellar",
    displayName: "Cellar",
    category: "interior",
    mapFile: "Cellar.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Cellar.tmx"),
  },
  {
    id: "shed",
    displayName: "Shed",
    category: "interior",
    mapFile: "Shed.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Shed.tmx"),
  },
  {
    id: "big-shed",
    displayName: "Big Shed",
    category: "interior",
    mapFile: "Shed2.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Shed2.tmx"),
  },
  {
    id: "barn",
    displayName: "Barn",
    category: "interior",
    mapFile: "Barn.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Barn.tmx"),
  },
  {
    id: "big-barn",
    displayName: "Big Barn",
    category: "interior",
    mapFile: "Barn2.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Barn2.tmx"),
  },
  {
    id: "deluxe-barn",
    displayName: "Deluxe Barn",
    category: "interior",
    mapFile: "Barn3.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Barn3.tmx"),
  },
  {
    id: "coop",
    displayName: "Coop",
    category: "interior",
    mapFile: "Coop.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Coop.tmx"),
  },
  {
    id: "big-coop",
    displayName: "Big Coop",
    category: "interior",
    mapFile: "Coop2.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Coop2.tmx"),
  },
  {
    id: "deluxe-coop",
    displayName: "Deluxe Coop",
    category: "interior",
    mapFile: "Coop3.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Coop3.tmx"),
  },
  {
    id: "slime-hutch",
    displayName: "Slime Hutch",
    category: "interior",
    mapFile: "SlimeHutch.tmx",
    previewOutputPath: createReferencePreviewOutputPath("SlimeHutch.tmx"),
  },
  {
    id: "greenhouse",
    displayName: "Greenhouse",
    category: "interior",
    mapFile: "Greenhouse.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Greenhouse.tmx"),
  },
  {
    id: "farm-cave",
    displayName: "Farm Cave",
    category: "interior",
    mapFile: "FarmCave.tmx",
    previewOutputPath: createReferencePreviewOutputPath("FarmCave.tmx"),
  },
  {
    id: "island-farmhouse",
    displayName: "Island Farmhouse",
    category: "interior",
    mapFile: "IslandFarmHouse.tmx",
    previewOutputPath: createReferencePreviewOutputPath("IslandFarmHouse.tmx"),
  },
  {
    id: "bus-stop",
    displayName: "Bus Stop",
    category: "exterior",
    mapFile: "BusStop.tmx",
    previewOutputPath: createReferencePreviewOutputPath("BusStop.tmx"),
  },
  {
    id: "quarry",
    displayName: "Quarry",
    category: "exterior",
    mapFile: "Quarry.tmx",
    previewOutputPath: createReferencePreviewOutputPath("Quarry.tmx"),
  },
  {
    id: "if2r",
    displayName: "Immersive Farm 2",
    category: "community-farm",
    mapFile: "IF2R.tmx",
    modId: "flashshifter.immersivefarm2remastered",
    previewOutputPath: createCommunityPreviewOutputPath(
      "flashshifter.immersivefarm2remastered",
    ),
  },
  {
    id: "frontier",
    displayName: "Frontier Farm",
    category: "community-farm",
    mapFile: "FrontierFarm.tmx",
    modId: "flashshifter.FrontierFarm",
    previewOutputPath: createCommunityPreviewOutputPath(
      "flashshifter.FrontierFarm",
    ),
  },
  {
    id: "grandpas",
    displayName: "Grandpa's Farm",
    category: "community-farm",
    mapFile: "GrandpasFarm.tmx",
    modId: "flashshifter.GrandpasFarm",
    previewOutputPath: createCommunityPreviewOutputPath(
      "flashshifter.GrandpasFarm",
    ),
  },
  {
    id: "capitalist-dream",
    displayName: "Capitalist Dream Farm",
    category: "community-farm",
    mapFile: "capitalist-dream.tmx",
    modId: "daisyniko.capitalistdreamfarm",
    previewOutputPath: createCommunityPreviewOutputPath(
      "daisyniko.capitalistdreamfarm",
    ),
  },
  {
    id: "capitalist-dream-2",
    displayName: "Capitalist Dream Farm 2",
    category: "community-farm",
    mapFile: "capitalist-dream-2.tmx",
    modId: "daisyniko.capitalistdreamfarm2",
    previewOutputPath: createCommunityPreviewOutputPath(
      "daisyniko.capitalistdreamfarm2",
    ),
  },
  {
    id: "overgrown-garden",
    displayName: "Overgrown Garden Farm",
    category: "community-farm",
    mapFile: "overgrown-garden.tmx",
    modId: "daisyniko.overgrowngardenfarm",
    previewOutputPath: createCommunityPreviewOutputPath(
      "daisyniko.overgrowngardenfarm",
    ),
  },
  {
    id: "yet-another",
    displayName: "Yet Another Farm Map",
    category: "community-farm",
    mapFile: "yet-another.tmx",
    modId: "daisyniko.yetanotherfarmmap",
    previewOutputPath: createCommunityPreviewOutputPath(
      "daisyniko.yetanotherfarmmap",
    ),
  },
  {
    id: "solo-four-corners",
    displayName: "Solo Four Corners Farm",
    category: "community-farm",
    mapFile: "solo-four-corners.tmx",
    modId: "daisyniko.solofourcornersfarm",
    previewOutputPath: createCommunityPreviewOutputPath(
      "daisyniko.solofourcornersfarm",
    ),
  },
  {
    id: "strawberry-fields",
    displayName: "Strawberry Fields Farm",
    category: "community-farm",
    mapFile: "strawberry-fields.tmx",
    modId: "daisyniko.strawberryfieldsfarm",
    previewOutputPath: createCommunityPreviewOutputPath(
      "daisyniko.strawberryfieldsfarm",
    ),
  },
  {
    id: "blackberry-fields",
    displayName: "Blackberry Fields Farm",
    category: "community-farm",
    mapFile: "blackberry-fields.tmx",
    modId: "daisyniko.blackberryfieldsfarm",
    previewOutputPath: createCommunityPreviewOutputPath(
      "daisyniko.blackberryfieldsfarm",
    ),
  },
  {
    id: "zenith",
    displayName: "Zenith Farm",
    category: "community-farm",
    mapFile: "zenith.tmx",
    modId: "daisyniko.zenithfarm",
    previewOutputPath: createCommunityPreviewOutputPath(
      "daisyniko.zenithfarm",
    ),
  },
  {
    id: "everfarm",
    displayName: "Everfarm",
    category: "community-farm",
    mapFile: "everfarm.tmx",
    modId: "draylon.everfarm",
    previewOutputPath: createCommunityPreviewOutputPath("draylon.everfarm"),
  },
  {
    id: "sea-breeze-island",
    displayName: "Sea Breeze Island Farm",
    category: "community-farm",
    mapFile: "sea-breeze-island.tmx",
    modId: "collingbe.seabreezefarmmapislandfarm",
    previewOutputPath: createCommunityPreviewOutputPath(
      "collingbe.seabreezefarmmapislandfarm",
    ),
  },
  {
    id: "aimon-s-small-hilltop",
    displayName: "Aimon's Small Hilltop Farm",
    category: "community-farm",
    mapFile: "aimon-s-small-hilltop.tmx",
    modId: "aimon111.aimonssmallhilltopfarm",
    previewOutputPath: createCommunityPreviewOutputPath(
      "aimon111.aimonssmallhilltopfarm",
    ),
  },
  {
    id: "aimon-s-small-forest",
    displayName: "Aimon's Small Forest Farm",
    category: "community-farm",
    mapFile: "aimon-s-small-forest.tmx",
    modId: "aimon111.aimonssmallforestfarm",
    previewOutputPath: createCommunityPreviewOutputPath(
      "aimon111.aimonssmallforestfarm",
    ),
  },
  {
    id: "more-lively-meadowlands",
    displayName: "More Lively Meadowlands Farm",
    category: "community-farm",
    mapFile: "more-lively-meadowlands.tmx",
    modId: "aimon111.morelivelymeadowlandsfarm",
    previewOutputPath: createCommunityPreviewOutputPath(
      "aimon111.morelivelymeadowlandsfarm",
    ),
  },
  {
    id: "modest-maps-standard",
    displayName: "Modest Maps Standard Farm",
    category: "community-farm",
    mapFile: "modest-maps-standard.tmx",
    modId: "inkubusmods.modestmapsstandardfarm",
    previewOutputPath: createCommunityPreviewOutputPath(
      "inkubusmods.modestmapsstandardfarm",
    ),
  },
  {
    id: "waterfall-forest",
    displayName: "Waterfall Forest Farm (WaFF)",
    category: "community-farm",
    mapFile: "waterfall-forest.tmx",
    modId: "archibaldtk.waterfallforestfarm",
    previewOutputPath: createCommunityPreviewOutputPath(
      "archibaldtk.waterfallforestfarm",
    ),
  },
  {
    id: "sve-winery",
    displayName: "Winery (SVE)",
    category: "community-interior",
    mapFile: "winery.tmx",
    modId: "flashshifter.sve",
    previewOutputPath: createReferencePreviewOutputPath("winery.tmx"),
  },
  {
    id: "sve-grandpas-shed-1",
    displayName: "Grandpa's Shed Floor 1 (SVE)",
    category: "community-interior",
    mapFile: "grandpas-shed-1.tmx",
    modId: "flashshifter.sve",
    previewOutputPath: createReferencePreviewOutputPath("grandpas-shed-1.tmx"),
  },
  {
    id: "sve-grandpas-shed-2",
    displayName: "Grandpa's Shed Floor 2 (SVE)",
    category: "community-interior",
    mapFile: "grandpas-shed-2.tmx",
    modId: "flashshifter.sve",
    previewOutputPath: createReferencePreviewOutputPath("grandpas-shed-2.tmx"),
  },
] as const satisfies readonly PlannerMap[];

export const gingerIslandOverlays = [
  {
    id: "restored",
    displayName: "Restored",
    mapFile: "Island_House_Restored.tmx",
    sourceCrop: { x: 0, y: 0, width: 7, height: 9 },
    target: { x: 74, y: 33 },
  },
  {
    id: "bin",
    displayName: "Bin",
    mapFile: "Island_House_Bin.tmx",
    sourceCrop: { x: 0, y: 0, width: 2, height: 2 },
    target: { x: 90, y: 38 },
  },
  {
    id: "cave",
    displayName: "Cave",
    mapFile: "Island_House_Cave.tmx",
    sourceCrop: { x: 0, y: 0, width: 3, height: 4 },
    target: { x: 95, y: 30 },
  },
  {
    id: "obelisk",
    displayName: "Obelisk",
    mapFile: "Island_W_Obelisk.tmx",
    sourceCrop: { x: 0, y: 0, width: 3, height: 9 },
    target: { x: 71, y: 29 },
  },
] as const satisfies readonly GingerIslandOverlay[];

export const farmhouse2Composite = {
  normalMapFile: "FarmHouse2.tmx",
  marriageMapFile: "FarmHouse2_marriage.tmx",
  spouseRoomMapFile: "spouseRooms.tmx",
  maximumSpouseCount: 1,
  renovationApplicationOrder: [
    "bedroom",
    "southern-room",
    "corner-room",
    "extended-corner-room",
    "dining-room",
    "dining-room-wall",
    "cubby",
    "far-upper-room",
    "crib",
    "cellar",
  ],
  renovations: [
    {
      id: "bedroom",
      displayName: "Open Bedroom",
      mapFile: "FarmHouse_Bedroom_Open.tmx",
      sourceCrop: { x: 0, y: 0, width: 51, height: 36 },
      target: { x: 0, y: 0 },
      dependsOn: [],
    },
    {
      id: "southern-room",
      displayName: "Southern Room",
      mapFile: "FarmHouse_SouthernRoom_Add.tmx",
      sourceCrop: { x: 0, y: 0, width: 51, height: 51 },
      target: { x: 0, y: 0 },
      dependsOn: [],
    },
    {
      id: "corner-room",
      displayName: "Corner Room",
      mapFile: "FarmHouse_CornerRoom_Add.tmx",
      sourceCrop: { x: 0, y: 0, width: 55, height: 46 },
      target: { x: 0, y: 0 },
      dependsOn: [],
    },
    {
      id: "extended-corner-room",
      displayName: "Extended Corner Room",
      mapFile: "FarmHouse_ExtendedCornerRoom_Add.tmx",
      sourceCrop: { x: 0, y: 0, width: 70, height: 46 },
      target: { x: 0, y: 0 },
      dependsOn: ["corner-room"],
    },
    {
      id: "dining-room",
      displayName: "Dining Room",
      mapFile: "FarmHouse_DiningRoom_Add.tmx",
      sourceCrop: { x: 0, y: 0, width: 70, height: 46 },
      target: { x: 0, y: 0 },
      dependsOn: [],
    },
    {
      id: "dining-room-wall",
      displayName: "Dining Room Wall",
      mapFile: "FarmHouse_DiningRoomWall_Remove.tmx",
      sourceCrop: { x: 0, y: 0, width: 70, height: 46 },
      target: { x: 0, y: 0 },
      dependsOn: ["dining-room"],
    },
    {
      id: "cubby",
      displayName: "Cubby",
      mapFile: "FarmHouse_Cubby_Add.tmx",
      sourceCrop: { x: 0, y: 0, width: 70, height: 46 },
      target: { x: 0, y: 0 },
      dependsOn: [],
    },
    {
      id: "far-upper-room",
      displayName: "Far Upper Room",
      mapFile: "FarmHouse_FarUpperRoom_Add.tmx",
      sourceCrop: { x: 0, y: 0, width: 70, height: 46 },
      target: { x: 0, y: 0 },
      dependsOn: [],
    },
    {
      id: "crib",
      displayName: "Crib",
      mapFile: "FarmHouse_Crib_0.tmx",
      sourceCrop: { x: 0, y: 0, width: 3, height: 4 },
      target: { x: 30, y: 12 },
      dependsOn: [],
    },
    {
      id: "cellar",
      displayName: "Cellar",
      mapFile: "FarmHouse_Cellar.tmx",
      sourceCrop: { x: 0, y: 0, width: 36, height: 36 },
      target: { x: 0, y: 0 },
      dependsOn: [],
    },
  ],
} as const satisfies Farmhouse2Composite;

export const spouseRoomLayouts = [
  { spouseId: "abigail", displayName: "Abigail", sourceCrop: { x: 0, y: 0, width: 6, height: 9 }, target: { x: 50, y: 20 } },
  { spouseId: "penny", displayName: "Penny", sourceCrop: { x: 6, y: 0, width: 6, height: 9 }, target: { x: 50, y: 20 } },
  { spouseId: "leah", displayName: "Leah", sourceCrop: { x: 12, y: 0, width: 6, height: 9 }, target: { x: 50, y: 20 } },
  { spouseId: "haley", displayName: "Haley", sourceCrop: { x: 18, y: 0, width: 6, height: 9 }, target: { x: 50, y: 20 } },
  { spouseId: "maru", displayName: "Maru", sourceCrop: { x: 24, y: 0, width: 6, height: 9 }, target: { x: 50, y: 20 } },
  { spouseId: "sebastian", displayName: "Sebastian", sourceCrop: { x: 0, y: 9, width: 6, height: 9 }, target: { x: 50, y: 20 } },
  { spouseId: "alex", displayName: "Alex", sourceCrop: { x: 6, y: 9, width: 6, height: 9 }, target: { x: 50, y: 20 } },
  { spouseId: "harvey", displayName: "Harvey", sourceCrop: { x: 12, y: 9, width: 6, height: 9 }, target: { x: 50, y: 20 } },
  { spouseId: "elliott", displayName: "Elliott", sourceCrop: { x: 18, y: 9, width: 6, height: 9 }, target: { x: 50, y: 20 } },
  { spouseId: "sam", displayName: "Sam", sourceCrop: { x: 24, y: 9, width: 6, height: 9 }, target: { x: 50, y: 20 } },
  { spouseId: "shane", displayName: "Shane", sourceCrop: { x: 0, y: 18, width: 6, height: 9 }, target: { x: 50, y: 20 } },
  { spouseId: "emily", displayName: "Emily", sourceCrop: { x: 6, y: 18, width: 6, height: 9 }, target: { x: 50, y: 20 } },
  { spouseId: "krobus", displayName: "Krobus", sourceCrop: { x: 12, y: 18, width: 6, height: 9 }, target: { x: 50, y: 20 } },
] as const satisfies readonly SpouseRoomLayout[];

export const farmhouse2RenderingRules = {
  frontPreservationRectangle: { x: 50, y: 28, width: 6, height: 1 },
  cornerRoomFrontTile: { x: 49, y: 19, fallbackGid: 2177 + 229 },
} as const satisfies Farmhouse2RenderingRules;

export const gingerIslandOverlayMapFiles = gingerIslandOverlays.map(
  (gingerIslandOverlay) => gingerIslandOverlay.mapFile,
);

export const farmhouseRenovationMapFiles = farmhouse2Composite.renovations.map(
  (farmhouseRenovation) => farmhouseRenovation.mapFile,
);

export const spouseRoomMapFiles = [
  farmhouse2Composite.marriageMapFile,
  farmhouse2Composite.spouseRoomMapFile,
] as const;

export function getPlannerMapById(mapId: string): PlannerMap {
  const plannerMap = plannerMaps.find(
    (catalogMap) => catalogMap.id === mapId,
  );

  if (!plannerMap) {
    throw new Error(`Unknown planner map id: ${mapId}`);
  }

  return { ...plannerMap };
}
