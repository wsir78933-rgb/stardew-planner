import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { catalogDatasetUrls, createCatalogFromDatasets } from "../../src/catalog";
import {
  findReferenceLocalProjectMapMapping,
  getReferenceLocalProjectCatalogMapping,
  referenceLocalProjectCatalogMappingEntries,
  referenceLocalProjectMapMappingEntries,
} from "../../src/projects/reference-local-project-catalog-mapping";
import { plannerMaps } from "../../src/maps/map-catalog";

describe("reference local project catalog mapping", () => {
  it("maps only to IDs present in the locked destination catalog", async () => {
    const readDataset = async (filename: string): Promise<unknown> =>
      JSON.parse(await readFile(
        path.join(process.cwd(), "public/game-assets/1.6.15/data", filename),
        "utf8",
      )) as unknown;
    const catalog = createCatalogFromDatasets({
      buildings: await readDataset("Buildings.json"),
      crops: await readDataset("Crops.json"),
      bigCraftables: await readDataset("BigCraftables.json"),
      objects: await readDataset("Objects.json"),
      fences: await readDataset("Fences.json"),
      floorsAndPaths: await readDataset("FloorsAndPaths.json"),
      furniture: await readDataset("Furniture.json"),
      fruitTrees: await readDataset("FruitTrees.json"),
    }, catalogDatasetUrls);

    for (const { catalogId } of referenceLocalProjectCatalogMappingEntries) {
      expect(catalog.items.some((item) => item.id === catalogId)).toBe(true);
    }
  });

  it("contains a literal map entry for every frozen runtime map group", () => {
    expect(referenceLocalProjectMapMappingEntries).toHaveLength(48);
    expect(new Set(referenceLocalProjectMapMappingEntries.map((entry) => entry.group)))
      .toEqual(new Set([
        "farm",
        "exterior",
        "interior",
        "community-farm",
        "community-interior",
      ]));
    expect(countEntriesByGroup(referenceLocalProjectMapMappingEntries)).toEqual({
      farm: 9,
      exterior: 2,
      interior: 16,
      "community-farm": 18,
      "community-interior": 3,
    });

    for (const mapping of referenceLocalProjectMapMappingEntries) {
      const targetMap = plannerMaps.find(
        (map) => map.mapFile === mapping.sourceMapFile,
      );
      expect(targetMap).toBeDefined();
      expect(targetMap!.id).toBe(mapping.baseMapId);
      expect(targetMap!.category).toBe(mapping.group);
      expect(findReferenceLocalProjectMapMapping(mapping.sourceMapFile))
        .toEqual(mapping);
    }
  });

  it("contains every double-evidenced frozen catalog group as literal entries", () => {
    expect(new Set(referenceLocalProjectCatalogMappingEntries.map((entry) => entry.group)))
      .toEqual(new Set([
        "building",
        "crop",
        "big-craftable",
        "object",
        "floor",
        "fence",
        "furniture",
        "wild-tree",
        "fruit-tree",
        "resource-clump",
      ]));
    expect(countEntriesByGroup(referenceLocalProjectCatalogMappingEntries)).toEqual({
      building: 25,
      crop: 50,
      "big-craftable": 160,
      object: 88,
      floor: 13,
      fence: 4,
      furniture: 644,
      "wild-tree": 11,
      "fruit-tree": 8,
      "resource-clump": 4,
    });

    expect(getReferenceLocalProjectCatalogMapping("building", "Barn")).toEqual({
      context: "building",
      group: "building",
      sourceId: "Barn",
      storedId: "Barn",
      catalogId: "building:Barn",
    });
    expect(getReferenceLocalProjectCatalogMapping("crop", "472")).toEqual({
      context: "crop",
      group: "crop",
      sourceId: "472",
      storedId: "crop:472",
      catalogId: "crop:472",
    });
    expect(getReferenceLocalProjectCatalogMapping("item", "object_16")).toEqual({
      context: "item",
      group: "object",
      sourceId: "object_16",
      storedId: "object:16",
      catalogId: "object:16",
    });
  });

  it("preserves the target stored-ID contract for every literal mapping", () => {
    for (const mapping of referenceLocalProjectCatalogMappingEntries) {
      expect(mapping.storedId).toBe(expectedStoredId(mapping));
    }
  });

  it("uses only reviewed literal mappings from the frozen compatibility inventory", () => {
    expect(getReferenceLocalProjectCatalogMapping("building", "Barn")).toEqual({
      context: "building",
      group: "building",
      sourceId: "Barn",
      storedId: "Barn",
      catalogId: "building:Barn",
    });
    expect(getReferenceLocalProjectCatalogMapping("crop", "472")).toEqual({
      context: "crop",
      group: "crop",
      sourceId: "472",
      storedId: "crop:472",
      catalogId: "crop:472",
    });
    expect(getReferenceLocalProjectCatalogMapping("item", "object_16")).toEqual({
      context: "item",
      group: "object",
      sourceId: "object_16",
      storedId: "object:16",
      catalogId: "object:16",
    });
  });

  it("rejects unmapped frozen source IDs instead of deriving a prefix conversion", () => {
    expect(() =>
      getReferenceLocalProjectCatalogMapping("item", "object_999"),
    ).toThrow('Unknown frozen item source ID "object_999"');
    expect(() =>
      getReferenceLocalProjectCatalogMapping("crop", "crop_472"),
    ).toThrow('Unknown frozen crop source ID "crop_472"');
  });
});

function countEntriesByGroup(
  entries: readonly Readonly<{ group: string }>[],
): Record<string, number> {
  return Object.fromEntries(entries.map((entry) => entry.group).reduce(
    (counts, group) => counts.set(group, (counts.get(group) ?? 0) + 1),
    new Map<string, number>(),
  ));
}

function expectedStoredId(mapping: Readonly<{
  group: string;
  sourceId: string;
}>): string {
  switch (mapping.group) {
    case "building":
      return mapping.sourceId;
    case "crop":
      return `crop:${mapping.sourceId}`;
    case "big-craftable":
      return `big-craftable:${mapping.sourceId}`;
    case "object":
      return `object:${readSourceSuffix(mapping.sourceId, "object_")}`;
    case "floor":
      return `floor:${readSourceSuffix(mapping.sourceId, "floor_")}`;
    case "fence":
      return `fence:${readSourceSuffix(mapping.sourceId, "fence_")}`;
    case "furniture":
    case "wild-tree":
    case "fruit-tree":
    case "resource-clump":
      return mapping.sourceId;
    default:
      throw new Error(`Unexpected catalog mapping group ${JSON.stringify(mapping.group)}.`);
  }
}

function readSourceSuffix(sourceId: string, requiredPrefix: string): string {
  if (!sourceId.startsWith(requiredPrefix)) {
    throw new Error(
      `Expected source ID ${JSON.stringify(sourceId)} to start with ${JSON.stringify(requiredPrefix)}.`,
    );
  }

  const suffix = sourceId.slice(requiredPrefix.length);
  if (suffix.length === 0) {
    throw new Error(
      `Expected source ID ${JSON.stringify(sourceId)} to contain a suffix after ${JSON.stringify(requiredPrefix)}.`,
    );
  }

  return suffix;
}
