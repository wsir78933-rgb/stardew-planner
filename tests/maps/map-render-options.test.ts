import { describe, expect, it } from "vitest";
import {
  createInitialMapRenderOptions,
  setFarmhouse2MarriageMapEnabled,
  setFarmhouse2RenovationEnabled,
  setFarmhouse2SpouseId,
  restoreMapRenderOptions,
  setFarmCaveChoice,
  setFarmSpouseId,
  toggleGingerIslandOverlay,
} from "../../src/maps/map-render-options";

describe("map render options", () => {
  it("keeps the locked Ginger Island restored-state overlays enabled by default", () => {
    expect(createInitialMapRenderOptions()).toEqual({
      gingerIslandOverlayIds: ["restored", "bin", "cave", "obelisk"],
      farmhouse2: {
        marriageMapEnabled: false,
        renovationIds: [],
        spouseId: null,
      },
      farm: {
        spouseId: null,
        caveChoice: "none",
      },
    });
  });

  it("toggles one locked Ginger Island overlay without changing the other map options", () => {
    const mapRenderOptions = toggleGingerIslandOverlay(
      createInitialMapRenderOptions(),
      "cave",
    );

    expect(mapRenderOptions.gingerIslandOverlayIds).toEqual([
      "restored",
      "bin",
      "obelisk",
    ]);
    expect(mapRenderOptions.farmhouse2).toEqual({
      marriageMapEnabled: false,
      renovationIds: [],
      spouseId: null,
    });
    expect(mapRenderOptions.farm).toEqual({ spouseId: null, caveChoice: "none" });
  });

  it("requires a marriage map before a spouse room and requires renovations in dependency order", () => {
    const initialMapRenderOptions = createInitialMapRenderOptions();

    expect(() =>
      setFarmhouse2SpouseId(initialMapRenderOptions, "abigail"),
    ).toThrow("requires marriageMapEnabled to be true");
    expect(() =>
      setFarmhouse2RenovationEnabled(
        initialMapRenderOptions,
        "extended-corner-room",
        true,
      ),
    ).toThrow('requires renovation "corner-room"');

    const mapRenderOptionsWithMarriage = setFarmhouse2MarriageMapEnabled(
      initialMapRenderOptions,
      true,
    );
    const mapRenderOptionsWithSpouse = setFarmhouse2SpouseId(
      mapRenderOptionsWithMarriage,
      "abigail",
    );
    const mapRenderOptionsWithCornerRoom = setFarmhouse2RenovationEnabled(
      mapRenderOptionsWithSpouse,
      "corner-room",
      true,
    );

    expect(
      setFarmhouse2RenovationEnabled(
        mapRenderOptionsWithCornerRoom,
        "extended-corner-room",
        true,
      ),
    ).toEqual({
      gingerIslandOverlayIds: ["restored", "bin", "cave", "obelisk"],
      farmhouse2: {
        marriageMapEnabled: true,
        renovationIds: ["corner-room", "extended-corner-room"],
        spouseId: "abigail",
      },
      farm: {
        spouseId: null,
        caveChoice: "none",
      },
    });
  });

  it("restores legacy options with the complete default farm configuration", () => {
    const initialOptions = createInitialMapRenderOptions();
    const { farm: _farm, ...legacyOptions } = initialOptions;

    expect(restoreMapRenderOptions(legacyOptions).farm).toEqual({
      spouseId: null,
      caveChoice: "none",
    });
  });

  it("sets outdoor spouse and cave options independently and validates values", () => {
    const withSpouse = setFarmSpouseId(createInitialMapRenderOptions(), "Abigail");
    const withMushrooms = setFarmCaveChoice(withSpouse, "mushrooms");

    expect(withMushrooms.farm).toEqual({
      spouseId: "Abigail",
      caveChoice: "mushrooms",
    });
    expect(() => setFarmSpouseId(withMushrooms, "Krobus" as never)).toThrow(
      'Farm spouse ID must be one of Abigail, Penny, Leah, Haley, Maru, Sebastian, Alex, Harvey, Elliott, Sam, Shane, Emily; received "Krobus".',
    );
    expect(() => setFarmCaveChoice(withMushrooms, "void" as never)).toThrow(
      'Farm cave choice must be "none", "mushrooms", or "bats"; received "void".',
    );
  });
});
