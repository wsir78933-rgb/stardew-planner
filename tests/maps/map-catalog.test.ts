import { describe, expect, it } from "vitest";
import {
  farmhouse2Composite,
  farmhouse2RenderingRules,
  getPlannerMapById,
  gingerIslandOverlays,
  plannerMaps,
  spouseRoomLayouts,
} from "../../src/maps/map-catalog";

describe("planner map catalog", () => {
  it("preserves every reference map in the original selection order", () => {
    expect(plannerMaps).toEqual([
      { id: "standard", displayName: "Standard Farm", category: "farm", mapFile: "Farm.tmx", previewOutputPath: "maps/previews/Farm.png" },
      { id: "riverland", displayName: "Riverland Farm", category: "farm", mapFile: "Farm_Fishing.tmx", previewOutputPath: "maps/previews/Farm_Fishing.png" },
      { id: "forest", displayName: "Forest Farm", category: "farm", mapFile: "Farm_Foraging.tmx", previewOutputPath: "maps/previews/Farm_Foraging.png" },
      { id: "hilltop", displayName: "Hill-top Farm", category: "farm", mapFile: "Farm_Mining.tmx", previewOutputPath: "maps/previews/Farm_Mining.png" },
      { id: "wilderness", displayName: "Wilderness Farm", category: "farm", mapFile: "Farm_Combat.tmx", previewOutputPath: "maps/previews/Farm_Combat.png" },
      { id: "four-corners", displayName: "Four Corners Farm", category: "farm", mapFile: "Farm_FourCorners.tmx", previewOutputPath: "maps/previews/Farm_FourCorners.png" },
      { id: "beach", displayName: "Beach Farm", category: "farm", mapFile: "Farm_Island.tmx", previewOutputPath: "maps/previews/Farm_Island.png" },
      { id: "meadowlands", displayName: "Meadowlands Farm", category: "farm", mapFile: "Farm_Ranching.tmx", previewOutputPath: "maps/previews/Farm_Ranching.png" },
      { id: "ginger-island", displayName: "Ginger Island", category: "farm", mapFile: "Island_W.tmx", previewOutputPath: "maps/previews/Island_W.png" },
      { id: "farmhouse-0", displayName: "Farmhouse", category: "interior", mapFile: "FarmHouse.tmx", previewOutputPath: "maps/previews/FarmHouse.png" },
      { id: "farmhouse-1", displayName: "Farmhouse (Upgrade 1)", category: "interior", mapFile: "FarmHouse1.tmx", previewOutputPath: "maps/previews/FarmHouse1.png" },
      { id: "farmhouse-2", displayName: "Farmhouse (Upgrade 2)", category: "interior", mapFile: "FarmHouse2.tmx", previewOutputPath: "maps/previews/FarmHouse2.png" },
      { id: "farmhouse-cellar", displayName: "Cellar", category: "interior", mapFile: "Cellar.tmx", previewOutputPath: "maps/previews/Cellar.png" },
      { id: "shed", displayName: "Shed", category: "interior", mapFile: "Shed.tmx", previewOutputPath: "maps/previews/Shed.png" },
      { id: "big-shed", displayName: "Big Shed", category: "interior", mapFile: "Shed2.tmx", previewOutputPath: "maps/previews/Shed2.png" },
      { id: "barn", displayName: "Barn", category: "interior", mapFile: "Barn.tmx", previewOutputPath: "maps/previews/Barn.png" },
      { id: "big-barn", displayName: "Big Barn", category: "interior", mapFile: "Barn2.tmx", previewOutputPath: "maps/previews/Barn2.png" },
      { id: "deluxe-barn", displayName: "Deluxe Barn", category: "interior", mapFile: "Barn3.tmx", previewOutputPath: "maps/previews/Barn3.png" },
      { id: "coop", displayName: "Coop", category: "interior", mapFile: "Coop.tmx", previewOutputPath: "maps/previews/Coop.png" },
      { id: "big-coop", displayName: "Big Coop", category: "interior", mapFile: "Coop2.tmx", previewOutputPath: "maps/previews/Coop2.png" },
      { id: "deluxe-coop", displayName: "Deluxe Coop", category: "interior", mapFile: "Coop3.tmx", previewOutputPath: "maps/previews/Coop3.png" },
      { id: "slime-hutch", displayName: "Slime Hutch", category: "interior", mapFile: "SlimeHutch.tmx", previewOutputPath: "maps/previews/SlimeHutch.png" },
      { id: "greenhouse", displayName: "Greenhouse", category: "interior", mapFile: "Greenhouse.tmx", previewOutputPath: "maps/previews/Greenhouse.png" },
      { id: "farm-cave", displayName: "Farm Cave", category: "interior", mapFile: "FarmCave.tmx", previewOutputPath: "maps/previews/FarmCave.png" },
      { id: "island-farmhouse", displayName: "Island Farmhouse", category: "interior", mapFile: "IslandFarmHouse.tmx", previewOutputPath: "maps/previews/IslandFarmHouse.png" },
      { id: "bus-stop", displayName: "Bus Stop", category: "exterior", mapFile: "BusStop.tmx", previewOutputPath: "maps/previews/BusStop.png" },
      { id: "quarry", displayName: "Quarry", category: "exterior", mapFile: "Quarry.tmx", previewOutputPath: "maps/previews/Quarry.png" },
      { id: "if2r", displayName: "Immersive Farm 2", category: "community-farm", mapFile: "IF2R.tmx", modId: "flashshifter.immersivefarm2remastered", previewOutputPath: "mods/flashshifter.immersivefarm2remastered/preview.png" },
      { id: "frontier", displayName: "Frontier Farm", category: "community-farm", mapFile: "FrontierFarm.tmx", modId: "flashshifter.FrontierFarm", previewOutputPath: "mods/flashshifter.FrontierFarm/preview.png" },
      { id: "grandpas", displayName: "Grandpa's Farm", category: "community-farm", mapFile: "GrandpasFarm.tmx", modId: "flashshifter.GrandpasFarm", previewOutputPath: "mods/flashshifter.GrandpasFarm/preview.png" },
      { id: "capitalist-dream", displayName: "Capitalist Dream Farm", category: "community-farm", mapFile: "capitalist-dream.tmx", modId: "daisyniko.capitalistdreamfarm", previewOutputPath: "mods/daisyniko.capitalistdreamfarm/preview.png" },
      { id: "capitalist-dream-2", displayName: "Capitalist Dream Farm 2", category: "community-farm", mapFile: "capitalist-dream-2.tmx", modId: "daisyniko.capitalistdreamfarm2", previewOutputPath: "mods/daisyniko.capitalistdreamfarm2/preview.png" },
      { id: "overgrown-garden", displayName: "Overgrown Garden Farm", category: "community-farm", mapFile: "overgrown-garden.tmx", modId: "daisyniko.overgrowngardenfarm", previewOutputPath: "mods/daisyniko.overgrowngardenfarm/preview.png" },
      { id: "yet-another", displayName: "Yet Another Farm Map", category: "community-farm", mapFile: "yet-another.tmx", modId: "daisyniko.yetanotherfarmmap", previewOutputPath: "mods/daisyniko.yetanotherfarmmap/preview.png" },
      { id: "solo-four-corners", displayName: "Solo Four Corners Farm", category: "community-farm", mapFile: "solo-four-corners.tmx", modId: "daisyniko.solofourcornersfarm", previewOutputPath: "mods/daisyniko.solofourcornersfarm/preview.png" },
      { id: "strawberry-fields", displayName: "Strawberry Fields Farm", category: "community-farm", mapFile: "strawberry-fields.tmx", modId: "daisyniko.strawberryfieldsfarm", previewOutputPath: "mods/daisyniko.strawberryfieldsfarm/preview.png" },
      { id: "blackberry-fields", displayName: "Blackberry Fields Farm", category: "community-farm", mapFile: "blackberry-fields.tmx", modId: "daisyniko.blackberryfieldsfarm", previewOutputPath: "mods/daisyniko.blackberryfieldsfarm/preview.png" },
      { id: "zenith", displayName: "Zenith Farm", category: "community-farm", mapFile: "zenith.tmx", modId: "daisyniko.zenithfarm", previewOutputPath: "mods/daisyniko.zenithfarm/preview.png" },
      { id: "everfarm", displayName: "Everfarm", category: "community-farm", mapFile: "everfarm.tmx", modId: "draylon.everfarm", previewOutputPath: "mods/draylon.everfarm/preview.png" },
      { id: "sea-breeze-island", displayName: "Sea Breeze Island Farm", category: "community-farm", mapFile: "sea-breeze-island.tmx", modId: "collingbe.seabreezefarmmapislandfarm", previewOutputPath: "mods/collingbe.seabreezefarmmapislandfarm/preview.png" },
      { id: "aimon-s-small-hilltop", displayName: "Aimon's Small Hilltop Farm", category: "community-farm", mapFile: "aimon-s-small-hilltop.tmx", modId: "aimon111.aimonssmallhilltopfarm", previewOutputPath: "mods/aimon111.aimonssmallhilltopfarm/preview.png" },
      { id: "aimon-s-small-forest", displayName: "Aimon's Small Forest Farm", category: "community-farm", mapFile: "aimon-s-small-forest.tmx", modId: "aimon111.aimonssmallforestfarm", previewOutputPath: "mods/aimon111.aimonssmallforestfarm/preview.png" },
      { id: "more-lively-meadowlands", displayName: "More Lively Meadowlands Farm", category: "community-farm", mapFile: "more-lively-meadowlands.tmx", modId: "aimon111.morelivelymeadowlandsfarm", previewOutputPath: "mods/aimon111.morelivelymeadowlandsfarm/preview.png" },
      { id: "modest-maps-standard", displayName: "Modest Maps Standard Farm", category: "community-farm", mapFile: "modest-maps-standard.tmx", modId: "inkubusmods.modestmapsstandardfarm", previewOutputPath: "mods/inkubusmods.modestmapsstandardfarm/preview.png" },
      { id: "waterfall-forest", displayName: "Waterfall Forest Farm (WaFF)", category: "community-farm", mapFile: "waterfall-forest.tmx", modId: "archibaldtk.waterfallforestfarm", previewOutputPath: "mods/archibaldtk.waterfallforestfarm/preview.png" },
      { id: "sve-winery", displayName: "Winery (SVE)", category: "community-interior", mapFile: "winery.tmx", modId: "flashshifter.sve", previewOutputPath: "maps/previews/winery.png" },
      { id: "sve-grandpas-shed-1", displayName: "Grandpa's Shed Floor 1 (SVE)", category: "community-interior", mapFile: "grandpas-shed-1.tmx", modId: "flashshifter.sve", previewOutputPath: "maps/previews/grandpas-shed-1.png" },
      { id: "sve-grandpas-shed-2", displayName: "Grandpa's Shed Floor 2 (SVE)", category: "community-interior", mapFile: "grandpas-shed-2.tmx", modId: "flashshifter.sve", previewOutputPath: "maps/previews/grandpas-shed-2.png" },
    ]);
  });

  it("records the source crop and target for each Ginger Island overlay", () => {
    expect(gingerIslandOverlays).toEqual([
      { id: "restored", displayName: "Restored", mapFile: "Island_House_Restored.tmx", sourceCrop: { x: 0, y: 0, width: 7, height: 9 }, target: { x: 74, y: 33 } },
      { id: "bin", displayName: "Bin", mapFile: "Island_House_Bin.tmx", sourceCrop: { x: 0, y: 0, width: 2, height: 2 }, target: { x: 90, y: 38 } },
      { id: "cave", displayName: "Cave", mapFile: "Island_House_Cave.tmx", sourceCrop: { x: 0, y: 0, width: 3, height: 4 }, target: { x: 95, y: 30 } },
      { id: "obelisk", displayName: "Obelisk", mapFile: "Island_W_Obelisk.tmx", sourceCrop: { x: 0, y: 0, width: 3, height: 9 }, target: { x: 71, y: 29 } },
    ]);
  });

  it("records all FarmHouse2 composite inputs, ordered renovations, and dependency rules", () => {
    expect(farmhouse2Composite.normalMapFile).toBe("FarmHouse2.tmx");
    expect(farmhouse2Composite.marriageMapFile).toBe("FarmHouse2_marriage.tmx");
    expect(farmhouse2Composite.spouseRoomMapFile).toBe("spouseRooms.tmx");
    expect(farmhouse2Composite.maximumSpouseCount).toBe(1);
    expect(farmhouse2Composite.renovationApplicationOrder).toEqual([
      "bedroom", "southern-room", "corner-room", "extended-corner-room", "dining-room", "dining-room-wall", "cubby", "far-upper-room", "crib", "cellar",
    ]);
    expect(farmhouse2Composite.renovations).toEqual([
      { id: "bedroom", displayName: "Open Bedroom", mapFile: "FarmHouse_Bedroom_Open.tmx", sourceCrop: { x: 0, y: 0, width: 51, height: 36 }, target: { x: 0, y: 0 }, dependsOn: [] },
      { id: "southern-room", displayName: "Southern Room", mapFile: "FarmHouse_SouthernRoom_Add.tmx", sourceCrop: { x: 0, y: 0, width: 51, height: 51 }, target: { x: 0, y: 0 }, dependsOn: [] },
      { id: "corner-room", displayName: "Corner Room", mapFile: "FarmHouse_CornerRoom_Add.tmx", sourceCrop: { x: 0, y: 0, width: 55, height: 46 }, target: { x: 0, y: 0 }, dependsOn: [] },
      { id: "extended-corner-room", displayName: "Extended Corner Room", mapFile: "FarmHouse_ExtendedCornerRoom_Add.tmx", sourceCrop: { x: 0, y: 0, width: 70, height: 46 }, target: { x: 0, y: 0 }, dependsOn: ["corner-room"] },
      { id: "dining-room", displayName: "Dining Room", mapFile: "FarmHouse_DiningRoom_Add.tmx", sourceCrop: { x: 0, y: 0, width: 70, height: 46 }, target: { x: 0, y: 0 }, dependsOn: [] },
      { id: "dining-room-wall", displayName: "Dining Room Wall", mapFile: "FarmHouse_DiningRoomWall_Remove.tmx", sourceCrop: { x: 0, y: 0, width: 70, height: 46 }, target: { x: 0, y: 0 }, dependsOn: ["dining-room"] },
      { id: "cubby", displayName: "Cubby", mapFile: "FarmHouse_Cubby_Add.tmx", sourceCrop: { x: 0, y: 0, width: 70, height: 46 }, target: { x: 0, y: 0 }, dependsOn: [] },
      { id: "far-upper-room", displayName: "Far Upper Room", mapFile: "FarmHouse_FarUpperRoom_Add.tmx", sourceCrop: { x: 0, y: 0, width: 70, height: 46 }, target: { x: 0, y: 0 }, dependsOn: [] },
      { id: "crib", displayName: "Crib", mapFile: "FarmHouse_Crib_0.tmx", sourceCrop: { x: 0, y: 0, width: 3, height: 4 }, target: { x: 30, y: 12 }, dependsOn: [] },
      { id: "cellar", displayName: "Cellar", mapFile: "FarmHouse_Cellar.tmx", sourceCrop: { x: 0, y: 0, width: 36, height: 36 }, target: { x: 0, y: 0 }, dependsOn: [] },
    ]);
  });

  it("records all spouse-room source crops and FarmHouse2 front-layer preservation rules", () => {
    expect(spouseRoomLayouts).toEqual([
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
    ]);
    expect(farmhouse2RenderingRules).toEqual({
      frontPreservationRectangle: { x: 50, y: 28, width: 6, height: 1 },
      cornerRoomFrontTile: { x: 49, y: 19, fallbackGid: 2406 },
    });
  });

  it("returns a safe map copy and rejects an unknown identifier", () => {
    const selectedPlannerMap = getPlannerMapById("ginger-island");
    selectedPlannerMap.displayName = "Changed by a caller";

    expect(getPlannerMapById("ginger-island")).toMatchObject({
      displayName: "Ginger Island",
      category: "farm",
      mapFile: "Island_W.tmx",
    });
    expect(() => getPlannerMapById("missing-map")).toThrow(
      "Unknown planner map id: missing-map",
    );
  });

  it("keeps catalog entries free of removed online feature labels", () => {
    expect(JSON.stringify(plannerMaps).toLowerCase()).not.toMatch(
      /account|cloud|share/,
    );
  });
});
