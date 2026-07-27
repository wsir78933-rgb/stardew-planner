const seasons = ["spring", "summer", "fall", "winter"] as const;

const officialSeasonalTilesheetBasenames = [
  "outdoorsTileSheet",
  "outdoorsTileSheet2",
  "outdoorTileSheet_extra",
  "Waterfalls",
  "town",
  "Shadows",
  "beach",
  "island_tilesheet_1",
] as const;

const springDaisyextrasModIds = [
  "aimon111.aimonssmallhilltopfarm",
  "archibaldtk.waterfallforestfarm",
  "collingbe.seabreezefarmmapislandfarm",
  "daisyniko.blackberryfieldsfarm",
  "daisyniko.capitalistdreamfarm2",
  "daisyniko.overgrowngardenfarm",
  "daisyniko.solofourcornersfarm",
  "daisyniko.strawberryfieldsfarm",
  "daisyniko.yetanotherfarmmap",
  "daisyniko.zenithfarm",
] as const;

const seasonalSVEExtraModIds = [
  "flashshifter.FrontierFarm",
  "flashshifter.GrandpasFarm",
  "flashshifter.immersivefarm2remastered",
  "flashshifter.sve",
] as const;

const seasonalSVETilesheetTwoModIds = [
  "flashshifter.FrontierFarm",
  "flashshifter.GrandpasFarm",
  "flashshifter.immersivefarm2remastered",
] as const;

export const officialTilesheetOutputPaths = [
  "tilesheets/paths.png",
  "tilesheets/townInterior.png",
  "tilesheets/townInterior_2.png",
  "tilesheets/farmhouse_tiles.png",
  "tilesheets/walls_and_floors.png",
  "tilesheets/coopTiles.png",
  "tilesheets/SewerTiles.png",
  "tilesheets/mine.png",
  "tilesheets/island_tilesheet_1.png",
  "tilesheets/Farm Obelisk.png",
  ...createSeasonalTilesheetOutputPaths(
    "tilesheets",
    officialSeasonalTilesheetBasenames,
  ),
] as const;

export const modNonSeasonalTilesheetOutputPaths = [
  "mods/aimon111.aimonssmallforestfarm/z_aimon_minefix.png",
  "mods/aimon111.aimonssmallhilltopfarm/panorama.png",
  "mods/aimon111.aimonssmallhilltopfarm/zzz_aimon_hillfarm.png",
  "mods/aimon111.morelivelymeadowlandsfarm/z_aimon_minefix_spring.png",
  "mods/archibaldtk.waterfallforestfarm/ALL_Waterfall_Shed.png",
  "mods/archibaldtk.waterfallforestfarm/ATK_AToMS_UWaqua.png",
  "mods/collingbe.seabreezefarmmapislandfarm/Cloudy_Ocean_BG.png",
  "mods/collingbe.seabreezefarmmapislandfarm/seabreeze_spring.png",
  "mods/daisyniko.zenithfarm/panorama.png",
  "mods/draylon.everfarm/z_Warps.png",
  "mods/flashshifter.FrontierFarm/z_SVEbuildingShadow.png",
  "mods/flashshifter.GrandpasFarm/zGrandpasFarm_CanopyShadow.png",
  "mods/flashshifter.GrandpasFarm/zGrandpasFarm_UnderCanopyShadow.png",
  "mods/flashshifter.GrandpasFarm/z_SVEbuildingShadow.png",
  "mods/flashshifter.immersivefarm2remastered/Farm_Shadow.png",
  "mods/flashshifter.immersivefarm2remastered/z_SVEbuildingShadow.png",
  "mods/flashshifter.sve/VanillaCraftables.png",
  "mods/flashshifter.sve/VanillaFloors.png",
  "mods/flashshifter.sve/VanillaFurniture.png",
  "mods/flashshifter.sve/VanillaWallsAndFloors.png",
  "mods/flashshifter.sve/z_SVEbuildingShadow.png",
  "mods/inkubusmods.modestmapsstandardfarm/.paths.png",
  "mods/inkubusmods.modestmapsstandardfarm/.spring_outdoorsTileSheet.png",
] as const;

export const modSeasonalTilesheetOutputPaths = [
  ...springDaisyextrasModIds.map(
    (modId) => `mods/${modId}/spring_daisyextras.png`,
  ),
  "mods/archibaldtk.waterfallforestfarm/spring_ATK_AToMS_EXground.png",
  "mods/archibaldtk.waterfallforestfarm/spring_ATK_AToMS_EXaqua.png",
  "mods/archibaldtk.waterfallforestfarm/spring_ATK_AToMS_foliage.png",
  "mods/archibaldtk.waterfallforestfarm/spring_ATK_AToMS_EXmisc.png",
  "mods/draylon.everfarm/spring_Blend.png",
  ...createModSeasonalTilesheetOutputPaths(
    seasonalSVEExtraModIds,
    "z_extras",
  ),
  ...createModSeasonalTilesheetOutputPaths(
    seasonalSVETilesheetTwoModIds,
    "SVE_Tilesheet2",
  ),
];

export const renderingDataOutputPaths = [
  "data/BigCraftables.json",
  "data/Buildings.json",
  "data/Fences.json",
  "data/FloorsAndPaths.json",
  "data/FruitTrees.json",
  "data/Furniture.json",
  "data/GiantCrops.json",
  "data/Objects.json",
  "data/PaintData.json",
] as const;

export const buildingSpriteOutputPaths = [
  "buildings/Barn.png",
  "buildings/Big Barn.png",
  "buildings/Big Coop.png",
  "buildings/Big Shed.png",
  "buildings/Coop.png",
  "buildings/Deluxe Barn.png",
  "buildings/Deluxe Coop.png",
  "buildings/Desert Obelisk.png",
  "buildings/Earth Obelisk.png",
  "buildings/Fish Pond.png",
  "buildings/Gold Clock.png",
  "buildings/Greenhouse.png",
  "buildings/Island Obelisk.png",
  "buildings/Junimo Hut.png",
  "buildings/Mill.png",
  "buildings/Pet Bowl.png",
  "buildings/Shed.png",
  "buildings/Shipping Bin.png",
  "buildings/Silo.png",
  "buildings/Slime Hutch.png",
  "buildings/Stable.png",
  "buildings/Stone Cabin.png",
  "buildings/Water Obelisk.png",
  "buildings/Well.png",
  "buildings/houses.png",
  "buildings/Beach Cabin.png",
  "buildings/Hay Pet Bowl.png",
  "buildings/Log Cabin.png",
  "buildings/Mailbox.png",
  "buildings/Neighbor Cabin.png",
  "buildings/Plank Cabin.png",
  "buildings/Rustic Cabin.png",
  "buildings/Stone Pet Bowl.png",
  "buildings/Trailer Cabin.png",
] as const;

export const buildingPaintMaskOutputPaths = [
  "houses",
  "Log Cabin",
  "Stone Cabin",
  "Plank Cabin",
  "Beach Cabin",
  "Neighbor Cabin",
  "Rustic Cabin",
  "Trailer Cabin",
  "Stable",
  "Big Shed",
  "Deluxe Coop",
  "Deluxe Barn",
].map((buildingName) => `buildings/${buildingName}_PaintMask.png`);

export const spriteOutputPaths = [
  "sprites/Cursors.png",
  "sprites/Pam.png",
  "sprites/shadow.png",
  "sprites/springobjects.png",
] as const;

export const terrainOutputPaths = [
  "terrain/grass.png",
  "terrain/hoeDirt.png",
  "terrain/hoeDirtSnow.png",
  "terrain/bush_shadow.png",
  "terrain/shadow.png",
  "terrain/tree_shadow.png",
  "terrain/tree_shadow_nonleafy.png",
  "terrain/mushroom_tree.png",
  "terrain/mystic_tree.png",
  "terrain/tree_palm.png",
  "terrain/tree_palm2.png",
  ...createTerrainTreeOutputPaths("tree1", [
    "spring",
    "summer",
    "fall",
    "winter",
    "greenRain",
    "greenRain_fall",
    "greenRain_winter",
  ]),
  ...createTerrainTreeOutputPaths("tree2", [
    "spring",
    "summer",
    "fall",
    "winter",
    "greenRain",
    "greenRain_fall",
    "greenRain_winter",
  ]),
  ...createTerrainTreeOutputPaths("tree3", [
    "spring",
    "fall",
    "winter",
    "greenRain",
    "greenRain_fall",
    "greenRain_winter",
  ]),
  ...createTerrainTreeOutputPaths("tree8", [
    "spring",
    "summer",
    "fall",
    "winter",
  ]),
];

export const regularTilesheetOutputPaths = [
  "tilesheets/Cursors_1_6.png",
  "tilesheets/Fence1.png",
  "tilesheets/Fence2.png",
  "tilesheets/Fence3.png",
  "tilesheets/Fence5.png",
  "tilesheets/Mannequins.png",
  "tilesheets/bushes.png",
  "tilesheets/craftables.png",
  "tilesheets/crops.png",
  "tilesheets/flooring.png",
  "tilesheets/floors_2.png",
  "tilesheets/fruitTrees.png",
  "tilesheets/furniture.png",
  "tilesheets/springobjects.png",
  "tilesheets/wallpapers_2.png",
] as const;

export const additionalFurnitureTilesheetOutputPaths = [
  "tilesheets/FreeCactuses.png",
  "tilesheets/furniture_2.png",
  "tilesheets/furniture_3.png",
  "tilesheets/joja_furniture.png",
  "tilesheets/junimo_furniture.png",
  "tilesheets/retro_furniture.png",
  "tilesheets/wizard_furniture.png",
] as const;

export type RenderingRuntimeAssetEntry = Readonly<{
  outputPath: string;
}>;

export const renderingRuntimeAssetEntries = createRenderingRuntimeAssetEntries();

export const renderingRuntimeAssetOutputPaths = renderingRuntimeAssetEntries.map(
  (renderingRuntimeAssetEntry) => renderingRuntimeAssetEntry.outputPath,
);

function createRenderingRuntimeAssetEntries(): readonly RenderingRuntimeAssetEntry[] {
  return validateDistinctOutputPaths([
    ...officialTilesheetOutputPaths,
    ...modNonSeasonalTilesheetOutputPaths,
    ...modSeasonalTilesheetOutputPaths,
    ...renderingDataOutputPaths,
    ...buildingSpriteOutputPaths,
    ...buildingPaintMaskOutputPaths,
    ...spriteOutputPaths,
    ...terrainOutputPaths,
    ...regularTilesheetOutputPaths,
    ...additionalFurnitureTilesheetOutputPaths,
  ]).map((outputPath) => ({ outputPath }));
}

function createSeasonalTilesheetOutputPaths(
  directoryPath: string,
  tilesheetBasenames: readonly string[],
): string[] {
  return tilesheetBasenames.flatMap((tilesheetBasename) =>
    seasons.map(
      (season) => `${directoryPath}/${season}_${tilesheetBasename}.png`,
    ),
  );
}

function createTerrainTreeOutputPaths(
  treeBasename: string,
  treeVariants: readonly string[],
): string[] {
  return treeVariants.map(
    (treeVariant) => `terrain/${treeBasename}_${treeVariant}.png`,
  );
}

function createModSeasonalTilesheetOutputPaths(
  modIds: readonly string[],
  tilesheetBasename: string,
): string[] {
  return modIds.flatMap((modId) =>
    seasons.map(
      (season) => `mods/${modId}/${season}_${tilesheetBasename}.png`,
    ),
  );
}

function validateDistinctOutputPaths(
  outputPathCandidates: readonly string[],
): readonly string[] {
  const outputPathSet = new Set<string>();

  for (const outputPathCandidate of outputPathCandidates) {
    if (outputPathSet.has(outputPathCandidate)) {
      throw new Error(
        `Rendering runtime asset manifest contains duplicate output path: ${JSON.stringify(outputPathCandidate)}.`,
      );
    }

    outputPathSet.add(outputPathCandidate);
  }

  return outputPathCandidates;
}
