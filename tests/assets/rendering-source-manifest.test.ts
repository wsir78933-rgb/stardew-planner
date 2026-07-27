import { describe, expect, it } from "vitest";
import { sourceAssets } from "../../src/assets/source-manifest";
import {
  additionalFurnitureTilesheetSourceAssets,
  buildingPaintMaskSourceAssets,
  buildingSpriteSourceAssets,
  modNonSeasonalTilesheetSourceAssets,
  modSeasonalTilesheetSourceAssets,
  officialTilesheetSourceAssets,
  regularTilesheetSourceAssets,
  renderingDataSourceAssets,
  renderingSourceAssets,
  spriteSourceAssets,
  terrainSourceAssets,
} from "../../src/assets/rendering-source-manifest";
import { validateSourceAsset } from "../../src/assets/source-asset";

const expectedOfficialTilesheetOutputPaths = [
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
  "tilesheets/spring_outdoorsTileSheet.png",
  "tilesheets/summer_outdoorsTileSheet.png",
  "tilesheets/fall_outdoorsTileSheet.png",
  "tilesheets/winter_outdoorsTileSheet.png",
  "tilesheets/spring_outdoorsTileSheet2.png",
  "tilesheets/summer_outdoorsTileSheet2.png",
  "tilesheets/fall_outdoorsTileSheet2.png",
  "tilesheets/winter_outdoorsTileSheet2.png",
  "tilesheets/spring_outdoorTileSheet_extra.png",
  "tilesheets/summer_outdoorTileSheet_extra.png",
  "tilesheets/fall_outdoorTileSheet_extra.png",
  "tilesheets/winter_outdoorTileSheet_extra.png",
  "tilesheets/spring_Waterfalls.png",
  "tilesheets/summer_Waterfalls.png",
  "tilesheets/fall_Waterfalls.png",
  "tilesheets/winter_Waterfalls.png",
  "tilesheets/spring_town.png",
  "tilesheets/summer_town.png",
  "tilesheets/fall_town.png",
  "tilesheets/winter_town.png",
  "tilesheets/spring_Shadows.png",
  "tilesheets/summer_Shadows.png",
  "tilesheets/fall_Shadows.png",
  "tilesheets/winter_Shadows.png",
  "tilesheets/spring_beach.png",
  "tilesheets/summer_beach.png",
  "tilesheets/fall_beach.png",
  "tilesheets/winter_beach.png",
  "tilesheets/spring_island_tilesheet_1.png",
  "tilesheets/summer_island_tilesheet_1.png",
  "tilesheets/fall_island_tilesheet_1.png",
  "tilesheets/winter_island_tilesheet_1.png",
] as const;

const expectedModNonSeasonalTilesheetOutputPaths = [
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

const expectedModSeasonalTilesheetOutputPaths = [
  "mods/aimon111.aimonssmallhilltopfarm/spring_daisyextras.png",
  "mods/archibaldtk.waterfallforestfarm/spring_daisyextras.png",
  "mods/collingbe.seabreezefarmmapislandfarm/spring_daisyextras.png",
  "mods/daisyniko.blackberryfieldsfarm/spring_daisyextras.png",
  "mods/daisyniko.capitalistdreamfarm2/spring_daisyextras.png",
  "mods/daisyniko.overgrowngardenfarm/spring_daisyextras.png",
  "mods/daisyniko.solofourcornersfarm/spring_daisyextras.png",
  "mods/daisyniko.strawberryfieldsfarm/spring_daisyextras.png",
  "mods/daisyniko.yetanotherfarmmap/spring_daisyextras.png",
  "mods/daisyniko.zenithfarm/spring_daisyextras.png",
  "mods/archibaldtk.waterfallforestfarm/spring_ATK_AToMS_EXground.png",
  "mods/archibaldtk.waterfallforestfarm/spring_ATK_AToMS_EXaqua.png",
  "mods/archibaldtk.waterfallforestfarm/spring_ATK_AToMS_foliage.png",
  "mods/archibaldtk.waterfallforestfarm/spring_ATK_AToMS_EXmisc.png",
  "mods/draylon.everfarm/spring_Blend.png",
  "mods/flashshifter.FrontierFarm/spring_z_extras.png",
  "mods/flashshifter.FrontierFarm/summer_z_extras.png",
  "mods/flashshifter.FrontierFarm/fall_z_extras.png",
  "mods/flashshifter.FrontierFarm/winter_z_extras.png",
  "mods/flashshifter.GrandpasFarm/spring_z_extras.png",
  "mods/flashshifter.GrandpasFarm/summer_z_extras.png",
  "mods/flashshifter.GrandpasFarm/fall_z_extras.png",
  "mods/flashshifter.GrandpasFarm/winter_z_extras.png",
  "mods/flashshifter.immersivefarm2remastered/spring_z_extras.png",
  "mods/flashshifter.immersivefarm2remastered/summer_z_extras.png",
  "mods/flashshifter.immersivefarm2remastered/fall_z_extras.png",
  "mods/flashshifter.immersivefarm2remastered/winter_z_extras.png",
  "mods/flashshifter.sve/spring_z_extras.png",
  "mods/flashshifter.sve/summer_z_extras.png",
  "mods/flashshifter.sve/fall_z_extras.png",
  "mods/flashshifter.sve/winter_z_extras.png",
  "mods/flashshifter.FrontierFarm/spring_SVE_Tilesheet2.png",
  "mods/flashshifter.FrontierFarm/summer_SVE_Tilesheet2.png",
  "mods/flashshifter.FrontierFarm/fall_SVE_Tilesheet2.png",
  "mods/flashshifter.FrontierFarm/winter_SVE_Tilesheet2.png",
  "mods/flashshifter.GrandpasFarm/spring_SVE_Tilesheet2.png",
  "mods/flashshifter.GrandpasFarm/summer_SVE_Tilesheet2.png",
  "mods/flashshifter.GrandpasFarm/fall_SVE_Tilesheet2.png",
  "mods/flashshifter.GrandpasFarm/winter_SVE_Tilesheet2.png",
  "mods/flashshifter.immersivefarm2remastered/spring_SVE_Tilesheet2.png",
  "mods/flashshifter.immersivefarm2remastered/summer_SVE_Tilesheet2.png",
  "mods/flashshifter.immersivefarm2remastered/fall_SVE_Tilesheet2.png",
  "mods/flashshifter.immersivefarm2remastered/winter_SVE_Tilesheet2.png",
] as const;

const expectedUnavailableTilesheetOutputPaths = [
  "mods/aimon111.aimonssmallhilltopfarm/summer_daisyextras.png",
  "mods/aimon111.aimonssmallhilltopfarm/fall_daisyextras.png",
  "mods/aimon111.aimonssmallhilltopfarm/winter_daisyextras.png",
  "mods/archibaldtk.waterfallforestfarm/summer_daisyextras.png",
  "mods/archibaldtk.waterfallforestfarm/fall_daisyextras.png",
  "mods/archibaldtk.waterfallforestfarm/winter_daisyextras.png",
  "mods/collingbe.seabreezefarmmapislandfarm/summer_daisyextras.png",
  "mods/collingbe.seabreezefarmmapislandfarm/fall_daisyextras.png",
  "mods/collingbe.seabreezefarmmapislandfarm/winter_daisyextras.png",
  "mods/daisyniko.blackberryfieldsfarm/summer_daisyextras.png",
  "mods/daisyniko.blackberryfieldsfarm/fall_daisyextras.png",
  "mods/daisyniko.blackberryfieldsfarm/winter_daisyextras.png",
  "mods/daisyniko.capitalistdreamfarm2/summer_daisyextras.png",
  "mods/daisyniko.capitalistdreamfarm2/fall_daisyextras.png",
  "mods/daisyniko.capitalistdreamfarm2/winter_daisyextras.png",
  "mods/daisyniko.overgrowngardenfarm/summer_daisyextras.png",
  "mods/daisyniko.overgrowngardenfarm/fall_daisyextras.png",
  "mods/daisyniko.overgrowngardenfarm/winter_daisyextras.png",
  "mods/daisyniko.solofourcornersfarm/summer_daisyextras.png",
  "mods/daisyniko.solofourcornersfarm/fall_daisyextras.png",
  "mods/daisyniko.solofourcornersfarm/winter_daisyextras.png",
  "mods/daisyniko.strawberryfieldsfarm/summer_daisyextras.png",
  "mods/daisyniko.strawberryfieldsfarm/fall_daisyextras.png",
  "mods/daisyniko.strawberryfieldsfarm/winter_daisyextras.png",
  "mods/daisyniko.yetanotherfarmmap/summer_daisyextras.png",
  "mods/daisyniko.yetanotherfarmmap/fall_daisyextras.png",
  "mods/daisyniko.yetanotherfarmmap/winter_daisyextras.png",
  "mods/daisyniko.zenithfarm/summer_daisyextras.png",
  "mods/daisyniko.zenithfarm/fall_daisyextras.png",
  "mods/daisyniko.zenithfarm/winter_daisyextras.png",
  "mods/archibaldtk.waterfallforestfarm/summer_ATK_AToMS_EXground.png",
  "mods/archibaldtk.waterfallforestfarm/fall_ATK_AToMS_EXground.png",
  "mods/archibaldtk.waterfallforestfarm/winter_ATK_AToMS_EXground.png",
  "mods/archibaldtk.waterfallforestfarm/summer_ATK_AToMS_EXaqua.png",
  "mods/archibaldtk.waterfallforestfarm/fall_ATK_AToMS_EXaqua.png",
  "mods/archibaldtk.waterfallforestfarm/winter_ATK_AToMS_EXaqua.png",
  "mods/archibaldtk.waterfallforestfarm/summer_ATK_AToMS_foliage.png",
  "mods/archibaldtk.waterfallforestfarm/fall_ATK_AToMS_foliage.png",
  "mods/archibaldtk.waterfallforestfarm/winter_ATK_AToMS_foliage.png",
  "mods/archibaldtk.waterfallforestfarm/summer_ATK_AToMS_EXmisc.png",
  "mods/archibaldtk.waterfallforestfarm/fall_ATK_AToMS_EXmisc.png",
  "mods/archibaldtk.waterfallforestfarm/winter_ATK_AToMS_EXmisc.png",
  "mods/draylon.everfarm/summer_Blend.png",
  "mods/draylon.everfarm/fall_Blend.png",
  "mods/draylon.everfarm/winter_Blend.png",
  "mods/daisyniko.capitalistdreamfarm2/DesertTiles.png",
  "tilesheets/freecactuses.png",
] as const;

describe("rendering source manifest", () => {
  it("locks the exact verified tilesheet and static rendering resource categories", () => {
    expect(officialTilesheetSourceAssets).toHaveLength(42);
    expect(modNonSeasonalTilesheetSourceAssets).toHaveLength(23);
    expect(modSeasonalTilesheetSourceAssets).toHaveLength(43);
    expect(renderingDataSourceAssets).toHaveLength(9);
    expect(buildingSpriteSourceAssets).toHaveLength(34);
    expect(buildingPaintMaskSourceAssets).toHaveLength(12);
    expect(spriteSourceAssets).toHaveLength(4);
    expect(terrainSourceAssets).toHaveLength(35);
    expect(regularTilesheetSourceAssets).toHaveLength(15);
    expect(additionalFurnitureTilesheetSourceAssets).toHaveLength(7);
    expect(renderingSourceAssets).toHaveLength(224);

    expect(
      officialTilesheetSourceAssets.map(
        (sourceAsset) => sourceAsset.outputPath,
      ),
    ).toContain("tilesheets/Farm Obelisk.png");
    expect(
      modNonSeasonalTilesheetSourceAssets.map(
        (sourceAsset) => sourceAsset.outputPath,
      ),
    ).toContain(
      "mods/inkubusmods.modestmapsstandardfarm/.spring_outdoorsTileSheet.png",
    );
    expect(
      modSeasonalTilesheetSourceAssets.map(
        (sourceAsset) => sourceAsset.outputPath,
      ),
    ).toContain(
      "mods/flashshifter.immersivefarm2remastered/winter_SVE_Tilesheet2.png",
    );
    expect(
      additionalFurnitureTilesheetSourceAssets.map(
        (sourceAsset) => sourceAsset.outputPath,
      ),
    ).toContain("tilesheets/FreeCactuses.png");
    expect(
      renderingDataSourceAssets.map((sourceAsset) => sourceAsset.outputPath),
    ).not.toContain("data/Crops.json");
  });

  it("keeps every original locked source asset ordered before the rendering expansion", () => {
    expect(sourceAssets).toHaveLength(337);
    expect(sourceAssets.slice(0, 113)).toHaveLength(113);
    expect(sourceAssets.slice(113)).toEqual(renderingSourceAssets);

    const sourceAssetOutputPaths = sourceAssets.map(
      (sourceAsset) => sourceAsset.outputPath,
    );
    expect(new Set(sourceAssetOutputPaths)).toHaveLength(337);
  });

  it("locks the exact output path sequence for every verified tilesheet category", () => {
    expect(
      officialTilesheetSourceAssets.map((sourceAsset) => sourceAsset.outputPath),
    ).toEqual(expectedOfficialTilesheetOutputPaths);
    expect(
      modNonSeasonalTilesheetSourceAssets.map(
        (sourceAsset) => sourceAsset.outputPath,
      ),
    ).toEqual(expectedModNonSeasonalTilesheetOutputPaths);
    expect(
      modSeasonalTilesheetSourceAssets.map(
        (sourceAsset) => sourceAsset.outputPath,
      ),
    ).toEqual(expectedModSeasonalTilesheetOutputPaths);
  });

  it("excludes every known unavailable tilesheet output path", () => {
    const renderingOutputPathSet = new Set(
      renderingSourceAssets.map((sourceAsset) => sourceAsset.outputPath),
    );

    expect(expectedUnavailableTilesheetOutputPaths).toHaveLength(47);
    expect(new Set(expectedUnavailableTilesheetOutputPaths)).toHaveLength(47);

    for (const unavailableTilesheetOutputPath of expectedUnavailableTilesheetOutputPaths) {
      expect(renderingOutputPathSet).not.toContain(unavailableTilesheetOutputPath);
    }
  });

  it("encodes source URLs while preserving canonical filesystem output paths", () => {
    const farmObeliskSourceAsset = renderingSourceAssets.find(
      (sourceAsset) => sourceAsset.outputPath === "tilesheets/Farm Obelisk.png",
    );

    expect(farmObeliskSourceAsset).toEqual({
      sourceUrl:
        "https://assets.stardewplan.com/assets/1.6.15/tilesheets/Farm%20Obelisk.png",
      outputPath: "tilesheets/Farm Obelisk.png",
      mediaType: "image/png",
    });
  });

  it("validates every rendering resource and has no output path collision", () => {
    const renderingOutputPaths = renderingSourceAssets.map(
      (sourceAsset) => sourceAsset.outputPath,
    );

    for (const sourceAsset of renderingSourceAssets) {
      expect(() => validateSourceAsset(sourceAsset)).not.toThrow();
    }

    expect(new Set(renderingOutputPaths)).toHaveLength(
      renderingSourceAssets.length,
    );
  });
});
