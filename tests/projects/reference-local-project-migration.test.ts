import { describe, expect, it } from "vitest";
import {
  ReferenceProjectMigrationError,
  migrateReferenceLocalProjectCollection,
  referenceLocalProjectStorageKey,
} from "../../src/projects/reference-local-project-migration";

const validFrozenCollection = JSON.stringify({
  version: 1,
  projects: [{
    id: "farm-001",
    title: "Spring Farm",
    created_at: "2026-07-27T00:00:00.000Z",
    updated_at: "2026-07-27T00:00:00.000Z",
    project: {
      version: 4,
      gameVersion: "1.6.15",
      projectName: "Spring Farm",
      season: "spring",
      activeMapId: "12",
      maps: [{
        id: "12",
        mapFile: "Farm.tmx",
        label: "Standard Layout",
        season: "spring",
        state: {
          buildings: [{
            instanceId: "b1",
            buildingId: "Big Shed",
            x: 3,
            y: 4,
            paintColor: {
              color1: { hue: 0, saturation: 100, lightness: 50 },
              color2: { hue: 120, saturation: 100, lightness: 50 },
              color3: { hue: 240, saturation: 100, lightness: 50 },
            },
          }],
          crops: [{ cropId: "472", x: 5, y: 6 }],
          items: [{
            instanceId: "i1",
            itemId: "object_16",
            x: 7,
            y: 8,
            layer: "item",
            rotation: 0,
            footprint: { w: 1, h: 1 },
            variant: 0,
            tintColor: "#abcdef",
            locked: false,
            isRug: false,
            isGrass: false,
            isTable: false,
            isLongTable: false,
            flipped: false,
            bedType: null,
          }],
          nextBuildingId: 2,
          nextItemId: 2,
        },
        decor: { wallpapers: { Bedroom: "17" }, floors: { MainFloor: "MoreFloors:8" } },
        renovations: [],
        thumbnail: "/api/projects/farm-001/maps/12/thumbnail",
      }],
    },
    thumbnailsByMapId: {},
  }],
});

function changeFrozenCollection(
  change: (collection: Record<string, unknown>) => void,
): string {
  const collection = JSON.parse(validFrozenCollection) as Record<string, unknown>;
  change(collection);
  return JSON.stringify(collection);
}

function getSourceProject(collection: Record<string, unknown>): Record<string, unknown> {
  return (collection.projects as Record<string, unknown>[])[0]!;
}

function getSourceMap(collection: Record<string, unknown>): Record<string, unknown> {
  const maps = (getSourceProject(collection).project as Record<string, unknown>)
    .maps as Record<string, unknown>[];
  return maps[0]!;
}

function getSourceState(collection: Record<string, unknown>): Record<string, unknown> {
  return getSourceMap(collection).state as Record<string, unknown>;
}

describe("reference local project migration", () => {
  it("converts the reviewed compatibility subset through the target domain state", () => {
    expect(referenceLocalProjectStorageKey).toBe(
      "stardewplan-reference-local-projects-v1",
    );
    expect(migrateReferenceLocalProjectCollection(validFrozenCollection)).toMatchObject({
      formatVersion: 2,
      projects: [{
        id: "farm-001",
        activeMapInstanceId: "12",
        mapInstances: {
          12: {
            baseMapId: "standard",
            name: "Standard Layout",
            state: {
              season: "spring",
              placementSnapshot: {
                buildings: [{
                  instanceId: 1,
                  buildingId: "Big Shed",
                  x: 3,
                  y: 4,
                  paintColors: {
                    color1: "#ff0000",
                    color2: "#00ff00",
                    color3: "#0000ff",
                  },
                }],
                crops: [{ cropId: "crop:472", x: 5, y: 6 }],
                items: [{
                  instanceId: 1,
                  itemId: "object:16",
                  footprint: { width: 1, height: 1 },
                  tintColor: "#abcdef",
                }],
                interiorDecor: { wallpapers: { Bedroom: "17" }, floors: { MainFloor: "MoreFloors:8" } },
              },
            },
          },
        },
      }],
    });
  });

  it.each([
    ["farm", "Farm.tmx", "standard"],
    ["exterior", "BusStop.tmx", "bus-stop"],
    ["interior", "Shed2.tmx", "big-shed"],
    ["community farm", "IF2R.tmx", "if2r"],
    ["community interior", "winery.tmx", "sve-winery"],
  ])("migrates the known frozen %s map group", (_group, sourceMapFile, baseMapId) => {
    const source = changeFrozenCollection((collection) => {
      getSourceMap(collection).mapFile = sourceMapFile;
    });

    expect(migrateReferenceLocalProjectCollection(source).projects[0]!.mapInstances["12"])
      .toMatchObject({ baseMapId });
  });

  it.each([
    ["building", "Barn", "Barn"],
    ["crop", "472", "crop:472"],
    ["big craftable", "0", "big-craftable:0"],
    ["object", "object_16", "object:16"],
    ["floor", "floor_0", "floor:0"],
    ["fence", "fence_322", "fence:322"],
    ["furniture", "furniture_0", "furniture_0"],
    ["wild tree", "wildtree_1", "wildtree_1"],
    ["fruit tree", "fruittree_69", "fruittree_69"],
    ["resource clump", "clump_600", "clump_600"],
  ])("migrates the known frozen %s catalog group", (group, sourceId, storedId) => {
    const source = changeFrozenCollection((collection) => {
      const state = getSourceState(collection);
      if (group === "building") {
        const building = (state.buildings as Record<string, unknown>[])[0]!;
        building.buildingId = sourceId;
        delete building.paintColor;
        return;
      }
      if (group === "crop") {
        (state.crops as Record<string, unknown>[])[0]!.cropId = sourceId;
        return;
      }
      (state.items as Record<string, unknown>[])[0]!.itemId = sourceId;
    });

    if (group === "building") {
      expect(migrateReferenceLocalProjectCollection(source)).toMatchObject({
        projects: [{
          mapInstances: {
            12: { state: { placementSnapshot: { buildings: [{ buildingId: storedId }] } } },
          },
        }],
      });
    } else if (group === "crop") {
      expect(migrateReferenceLocalProjectCollection(source)).toMatchObject({
        projects: [{
          mapInstances: {
            12: { state: { placementSnapshot: { crops: [{ cropId: storedId }] } } },
          },
        }],
      });
    } else {
      expect(migrateReferenceLocalProjectCollection(source)).toMatchObject({
        projects: [{
          mapInstances: {
            12: { state: { placementSnapshot: { items: [{ itemId: storedId }] } } },
          },
        }],
      });
    }
  });

  it("accepts only the source runtime's documented omissions and text normalization", () => {
    const sourceWithRuntimeNormalization = changeFrozenCollection((source) => {
      const project = getSourceProject(source);
      project.title = "  Spring Farm  ";
      const sourceProject = project.project as Record<string, unknown>;
      sourceProject.projectName = "  Spring Farm  ";
      getSourceMap(source).label = "  Standard Layout  ";
      delete project.thumbnailsByMapId;
      delete getSourceMap(source).decor;
      delete getSourceMap(source).renovations;
    });

    expect(migrateReferenceLocalProjectCollection(sourceWithRuntimeNormalization))
      .toMatchObject({
        projects: [{
          name: "Spring Farm",
          mapInstances: { 12: { name: "Standard Layout" } },
        }],
      });
  });

  it.each([
    ["Farmhouse", "Farmhouse"],
    ["Stable", "Stable"],
    ["Deluxe Coop", "Deluxe Coop"],
    ["Deluxe Barn", "Deluxe Barn"],
    ["Big Shed", "Big Shed"],
  ])("preserves losslessly representable paint for mapped paintable building %s", (sourceBuildingId, targetBuildingId) => {
    const source = changeFrozenCollection((collection) => {
      (getSourceState(collection).buildings as Record<string, unknown>[])[0]!
        .buildingId = sourceBuildingId;
    });

    expect(migrateReferenceLocalProjectCollection(source)).toMatchObject({
      projects: [{
        mapInstances: {
          12: {
            state: {
              placementSnapshot: {
                buildings: [{
                  buildingId: targetBuildingId,
                  paintColors: {
                    color1: "#ff0000",
                    color2: "#00ff00",
                    color3: "#0000ff",
                  },
                }],
              },
            },
          },
        },
      }],
    });
  });

  it("rejects paint assigned to a mapped building without a target paint mask", () => {
    const source = changeFrozenCollection((collection) => {
      (getSourceState(collection).buildings as Record<string, unknown>[])[0]!
        .buildingId = "Barn";
    });

    expect(() => migrateReferenceLocalProjectCollection(source)).toThrow(
      'projects[0].maps[0].state.buildings[0].paintColor',
    );
  });

  it.each([
    ["decor", (source: Record<string, unknown>) => {
      getSourceMap(source).decor = {
        wallpapers: { Bedroom: "MoreWalls:26" },
        floors: {},
      };
    }, "projects[0].maps[0].decor", "MoreWalls:26"],
    ["placement snapshot", (source: Record<string, unknown>) => {
      const buildings = getSourceState(source).buildings as Record<string, unknown>[];
      buildings.push({ ...buildings[0]!, x: 9, y: 9 });
    }, "projects[0].maps[0].state", "b1"],
  ])("wraps deterministic target %s validation with the source path and value", (_targetArea, change, expectedPath, expectedValue) => {
    const source = changeFrozenCollection(change);

    expect(() => migrateReferenceLocalProjectCollection(source))
      .toThrow(ReferenceProjectMigrationError);
    expect(() => migrateReferenceLocalProjectCollection(source))
      .toThrow(expectedPath);
    expect(() => migrateReferenceLocalProjectCollection(source))
      .toThrow(expectedValue);
  });

  it.each([
    ["unknown map files", (source: Record<string, unknown>) => {
      (((source.projects as Record<string, unknown>[])[0]!.project as Record<string, unknown>).maps as Record<string, unknown>[])[0]!.mapFile = "NotAMap.tmx";
    }, 'projects[0].maps[0].mapFile'],
    ["unsupported building water colors", (source: Record<string, unknown>) => {
      (((((source.projects as Record<string, unknown>[])[0]!.project as Record<string, unknown>).maps as Record<string, unknown>[])[0]!.state as Record<string, unknown>).buildings as Record<string, unknown>[])[0]!.waterColor = "#00ffff";
    }, 'projects[0].maps[0].state.buildings[0].waterColor'],
    ["unknown catalog IDs", (source: Record<string, unknown>) => {
      (((((source.projects as Record<string, unknown>[])[0]!.project as Record<string, unknown>).maps as Record<string, unknown>[])[0]!.state as Record<string, unknown>).items as Record<string, unknown>[])[0]!.itemId = "object_999";
    }, 'projects[0].maps[0].state.items[0].itemId'],
    ["missing required target item fields", (source: Record<string, unknown>) => {
      delete (((((source.projects as Record<string, unknown>[])[0]!.project as Record<string, unknown>).maps as Record<string, unknown>[])[0]!.state as Record<string, unknown>).items as Record<string, unknown>[])[0]!.tintColor;
    }, 'projects[0].maps[0].state.items[0].tintColor'],
  ])("rejects %s without producing a partial collection", (_name, change, path) => {
    expect(() => migrateReferenceLocalProjectCollection(changeFrozenCollection(change)))
      .toThrow(path);
  });

  it("wraps source JSON syntax errors with the frozen storage context", () => {
    expect(() => migrateReferenceLocalProjectCollection("{"))
      .toThrow(ReferenceProjectMigrationError);
    expect(() => migrateReferenceLocalProjectCollection("{"))
      .toThrow(referenceLocalProjectStorageKey);
  });

  it.each([
    ["nonempty thumbnail data", (source: Record<string, unknown>) => {
      getSourceProject(source).thumbnailsByMapId = { 12: "data:image/webp;base64,AA==" };
    }, "projects[0].thumbnailsByMapId"],
    ["null thumbnail records", (source: Record<string, unknown>) => {
      getSourceProject(source).thumbnailsByMapId = null;
    }, "projects[0].thumbnailsByMapId"],
    ["null decor", (source: Record<string, unknown>) => {
      getSourceMap(source).decor = null;
    }, "projects[0].maps[0].decor"],
    ["null renovations", (source: Record<string, unknown>) => {
      getSourceMap(source).renovations = null;
    }, "projects[0].maps[0].renovations"],
    ["source building variants", (source: Record<string, unknown>) => {
      (getSourceState(source).buildings as Record<string, unknown>[])[0]!.variant = 1;
    }, "projects[0].maps[0].state.buildings[0].variant"],
    ["source building lock flags", (source: Record<string, unknown>) => {
      (getSourceState(source).buildings as Record<string, unknown>[])[0]!.locked = false;
    }, "projects[0].maps[0].state.buildings[0].locked"],
    ["held items", (source: Record<string, unknown>) => {
      (getSourceState(source).items as Record<string, unknown>[])[0]!.heldItemId = "i2";
    }, "projects[0].maps[0].state.items[0].heldItemId"],
    ["unknown source extensions", (source: Record<string, unknown>) => {
      getSourceMap(source).unknownExtension = true;
    }, "projects[0].maps[0].unknownExtension"],
    ["overlong project names", (source: Record<string, unknown>) => {
      getSourceProject(source).title = "x".repeat(81);
    }, "projects[0].title"],
    ["project names over the V2 limit after trimming", (source: Record<string, unknown>) => {
      const project = getSourceProject(source);
      const title = ` ${"x".repeat(81)} `;
      project.title = title;
      (project.project as Record<string, unknown>).projectName = title;
    }, "projects[0].title"],
    ["map labels over the V2 limit after trimming", (source: Record<string, unknown>) => {
      getSourceMap(source).label = ` ${"x".repeat(81)} `;
    }, "projects[0].maps[0].label"],
    ["noncanonical timestamps", (source: Record<string, unknown>) => {
      getSourceProject(source).created_at = "2026-07-27";
    }, "projects[0].created_at"],
    ["empty projects", (source: Record<string, unknown>) => {
      (getSourceProject(source).project as Record<string, unknown>).maps = [];
      (getSourceProject(source).project as Record<string, unknown>).activeMapId = "12";
    }, "projects[0].project.maps"],
    ["invalid renovations", (source: Record<string, unknown>) => {
      getSourceMap(source).mapFile = "FarmHouse2.tmx";
      getSourceMap(source).renovations = ["not-a-renovation"];
    }, "projects[0].maps[0].renovations[0]"],
    ["renovation dependency omissions", (source: Record<string, unknown>) => {
      getSourceMap(source).mapFile = "FarmHouse2.tmx";
      getSourceMap(source).renovations = ["extended_corner"];
    }, "projects[0].maps[0].renovations"],
    ["out-of-order renovations", (source: Record<string, unknown>) => {
      getSourceMap(source).mapFile = "FarmHouse2.tmx";
      getSourceMap(source).renovations = ["corner_room", "bedroom_open"];
    }, "projects[0].maps[0].renovations"],
    ["out-of-range paint channels", (source: Record<string, unknown>) => {
      (((getSourceState(source).buildings as Record<string, unknown>[])[0]!
        .paintColor as Record<string, unknown>).color1 as Record<string, unknown>)
        .hue = 361;
    }, "projects[0].maps[0].state.buildings[0].paintColor.color1.hue"],
    ["duplicate source project IDs", (source: Record<string, unknown>) => {
      (source.projects as Record<string, unknown>[]).push(getSourceProject(source));
    }, "projects[1].id"],
    ["project-level season loss", (source: Record<string, unknown>) => {
      (getSourceProject(source).project as Record<string, unknown>).season = "winter";
    }, "projects[0].project.season"],
    ["source identifiers with dots", (source: Record<string, unknown>) => {
      getSourceProject(source).id = "farm.001";
    }, "projects[0].id"],
  ])("rejects %s as an all-or-nothing conversion", (_name, change, path) => {
    expect(() => migrateReferenceLocalProjectCollection(changeFrozenCollection(change)))
      .toThrow(path);
  });

  it("rejects an empty source collection", () => {
    expect(() => migrateReferenceLocalProjectCollection(JSON.stringify({
      version: 1,
      projects: [],
    }))).toThrow("projects");
  });
});
