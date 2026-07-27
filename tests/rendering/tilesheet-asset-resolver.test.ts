import { describe, expect, it } from "vitest";
import { resolveTilesheetAsset } from "../../src/rendering/tilesheet-asset-resolver";

const localAssetRoot = "/game-assets/1.6.15/";

describe("resolveTilesheetAsset", () => {
  it("resolves official seasonal tilesheets for the requested runtime season", () => {
    expect(
      resolveTilesheetAsset({
        tilesetSource: "spring_outdoorsTileSheet",
        season: "winter",
        modId: null,
      }),
    ).toEqual({
      localPath: `${localAssetRoot}tilesheets/winter_outdoorsTileSheet.png`,
      usedSpringFallback: false,
    });
  });

  it("rewrites a seasonal source prefix instead of retaining the map source season", () => {
    expect(
      resolveTilesheetAsset({
        tilesetSource: "summer_town.png",
        season: "fall",
        modId: null,
      }),
    ).toEqual({
      localPath: `${localAssetRoot}tilesheets/fall_town.png`,
      usedSpringFallback: false,
    });
  });

  it("resolves official non-seasonal tilesheets without changing their casing", () => {
    expect(
      resolveTilesheetAsset({
        tilesetSource: "Farm Obelisk",
        season: "summer",
        modId: null,
      }),
    ).toEqual({
      localPath: `${localAssetRoot}tilesheets/Farm Obelisk.png`,
      usedSpringFallback: false,
    });
  });

  it("resolves the official wallpapers tilesheet without a mod identifier", () => {
    expect(
      resolveTilesheetAsset({
        tilesetSource: "wallpapers_2",
        season: "spring",
        modId: null,
      }),
    ).toEqual({
      localPath: `${localAssetRoot}tilesheets/wallpapers_2.png`,
      usedSpringFallback: false,
    });
  });

  it("resolves the official floors tilesheet without a mod identifier", () => {
    expect(
      resolveTilesheetAsset({
        tilesetSource: "floors_2",
        season: "winter",
        modId: null,
      }),
    ).toEqual({
      localPath: `${localAssetRoot}tilesheets/floors_2.png`,
      usedSpringFallback: false,
    });
  });

  it("handles the exact paths aliases and Windows-style map sources", () => {
    expect(
      resolveTilesheetAsset({
        tilesetSource: "paths",
        season: "winter",
        modId: "example.not-used-for-paths",
      }),
    ).toEqual({
      localPath: `${localAssetRoot}tilesheets/paths.png`,
      usedSpringFallback: false,
    });

    expect(
      resolveTilesheetAsset({
        tilesetSource: "paths.png",
        season: "spring",
        modId: null,
      }),
    ).toEqual({
      localPath: `${localAssetRoot}tilesheets/paths.png`,
      usedSpringFallback: false,
    });

    expect(
      resolveTilesheetAsset({
        tilesetSource: "Mines\\mine",
        season: "spring",
        modId: null,
      }),
    ).toEqual({
      localPath: `${localAssetRoot}tilesheets/mine.png`,
      usedSpringFallback: false,
    });
  });

  it("resolves custom mod tilesheets while preserving dotted names and casing", () => {
    expect(
      resolveTilesheetAsset({
        tilesetSource: "ALL_Waterfall_Shed",
        season: "summer",
        modId: "archibaldtk.waterfallforestfarm",
      }),
    ).toEqual({
      localPath:
        `${localAssetRoot}mods/archibaldtk.waterfallforestfarm/ALL_Waterfall_Shed.png`,
      usedSpringFallback: false,
    });

    expect(
      resolveTilesheetAsset({
        tilesetSource: "spring_SVE_Tilesheet2.png",
        season: "fall",
        modId: "flashshifter.immersivefarm2remastered",
      }),
    ).toEqual({
      localPath:
        `${localAssetRoot}mods/flashshifter.immersivefarm2remastered/fall_SVE_Tilesheet2.png`,
      usedSpringFallback: false,
    });
  });

  it("keeps dots at the beginning of non-seasonal mod filenames", () => {
    expect(
      resolveTilesheetAsset({
        tilesetSource: ".paths.png",
        season: "spring",
        modId: "inkubusmods.modestmapsstandardfarm",
      }),
    ).toEqual({
      localPath:
        `${localAssetRoot}mods/inkubusmods.modestmapsstandardfarm/.paths.png`,
      usedSpringFallback: false,
    });

    expect(
      resolveTilesheetAsset({
        tilesetSource: ".spring_outdoorsTileSheet.png",
        season: "winter",
        modId: "inkubusmods.modestmapsstandardfarm",
      }),
    ).toEqual({
      localPath:
        `${localAssetRoot}mods/inkubusmods.modestmapsstandardfarm/.spring_outdoorsTileSheet.png`,
      usedSpringFallback: false,
    });
  });

  it("uses the locked spring daisyextras sheet for a known unavailable mod season", () => {
    expect(
      resolveTilesheetAsset({
        tilesetSource: "spring_daisyextras",
        season: "summer",
        modId: "daisyniko.blackberryfieldsfarm",
      }),
    ).toEqual({
      localPath:
        `${localAssetRoot}mods/daisyniko.blackberryfieldsfarm/spring_daisyextras.png`,
      usedSpringFallback: true,
    });
  });

  it("uses the locked spring Waterfall Forest sheet for each known unavailable extension", () => {
    expect(
      resolveTilesheetAsset({
        tilesetSource: "spring_ATK_AToMS_EXground.png",
        season: "fall",
        modId: "archibaldtk.waterfallforestfarm",
      }),
    ).toEqual({
      localPath:
        `${localAssetRoot}mods/archibaldtk.waterfallforestfarm/spring_ATK_AToMS_EXground.png`,
      usedSpringFallback: true,
    });
  });

  it("uses the locked spring Everfarm Blend sheet for a known unavailable mod season", () => {
    expect(
      resolveTilesheetAsset({
        tilesetSource: "summer_Blend",
        season: "winter",
        modId: "draylon.everfarm",
      }),
    ).toEqual({
      localPath: `${localAssetRoot}mods/draylon.everfarm/spring_Blend.png`,
      usedSpringFallback: true,
    });
  });

  it("reports the confirmed unavailable Capitalist Dream 2 DesertTiles asset without a fake local path", () => {
    expect(
      resolveTilesheetAsset({
        tilesetSource: "DesertTiles.png",
        season: "spring",
        modId: "daisyniko.capitalistdreamfarm2",
      }),
    ).toEqual({
      knownUnavailable: {
        outputPath:
          "mods/daisyniko.capitalistdreamfarm2/DesertTiles.png",
        reason:
          "The locked Stardew Planner 1.6.15 source returned HTTP 404 for this required tilesheet.",
      },
    });
  });

  it("rejects unknown sources without a mod identifier", () => {
    expect(() =>
      resolveTilesheetAsset({
        tilesetSource: "UnknownTilesheet",
        season: "spring",
        modId: null,
      }),
    ).toThrow("UnknownTilesheet");
  });

  it("rejects a manifest-absent mod output instead of returning an unverified path", () => {
    expect(() =>
      resolveTilesheetAsset({
        tilesetSource: "NotLockedAnywhere.png",
        season: "fall",
        modId: "example.unlockedmod",
      }),
    ).toThrow("NotLockedAnywhere.png");
  });
});
