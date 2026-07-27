import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  catalogDatasetUrls,
  createCatalogFromDatasets,
} from "../../src/catalog";
import {
  assertChineseCatalogDisplayManifest,
  getCatalogDisplayName,
  getInteriorDecorDisplayName,
  getMapConfigurationDisplayName,
  getPlannerMapDisplayName,
} from "../../src/i18n/catalog-display";
import { chineseCatalogLabelsById } from "../../src/i18n/zh-cn-catalog-labels";

async function readLockedCatalogDataset(filename: string): Promise<unknown> {
  const absolutePath = path.join(
    process.cwd(),
    "public/game-assets/1.6.15/data",
    filename,
  );

  return JSON.parse(await readFile(absolutePath, "utf8")) as unknown;
}

async function createLockedNativeCatalog() {
  return createCatalogFromDatasets(
    {
      buildings: await readLockedCatalogDataset("Buildings.json"),
      crops: await readLockedCatalogDataset("Crops.json"),
      bigCraftables: await readLockedCatalogDataset("BigCraftables.json"),
      objects: await readLockedCatalogDataset("Objects.json"),
      fences: await readLockedCatalogDataset("Fences.json"),
      floorsAndPaths: await readLockedCatalogDataset("FloorsAndPaths.json"),
      furniture: await readLockedCatalogDataset("Furniture.json"),
      fruitTrees: await readLockedCatalogDataset("FruitTrees.json"),
    },
    catalogDatasetUrls,
  );
}

describe("catalog display names", () => {
  it("requires an explicit Chinese label for every item in the version-locked native catalog", async () => {
    const nativeCatalog = await createLockedNativeCatalog();

    expect(() => assertChineseCatalogDisplayManifest(nativeCatalog)).not.toThrow();

    for (const catalogItem of nativeCatalog.items) {
      const chineseDisplayName =
        getCatalogDisplayName("zh-CN", catalogItem.id, catalogItem.name);
      expect(chineseDisplayName).toMatch(/[一-龥]/);
      expect(chineseDisplayName).not.toBe(catalogItem.name);
    }
  });

  it("fails fast for an unknown Chinese catalog ID instead of exposing the English source name", () => {
    expect(() =>
      getCatalogDisplayName("zh-CN", "object:Untranslated", "Untranslated"),
    ).toThrow('Chinese catalog display label is missing for ID "object:Untranslated"');
  });

  it("rejects a duplicate native catalog ID before manifest-set validation", async () => {
    const nativeCatalog = await createLockedNativeCatalog();
    const firstCatalogItem = nativeCatalog.items[0];

    if (firstCatalogItem === undefined) {
      throw new Error("Locked native catalog unexpectedly has no items.");
    }

    expect(() =>
      assertChineseCatalogDisplayManifest({
        items: [firstCatalogItem, firstCatalogItem],
      }),
    ).toThrow(
      `Chinese catalog display manifest received duplicate native catalog ID ${JSON.stringify(firstCatalogItem.id)}.`,
    );
  });

  it("rejects blank and undeclared placeholder labels", async () => {
    const nativeCatalog = await createLockedNativeCatalog();
    const writableChineseCatalogLabels =
      chineseCatalogLabelsById as Record<string, string>;
    const catalogId = "building:Coop";
    const originalLabel = writableChineseCatalogLabels[catalogId];

    try {
      writableChineseCatalogLabels[catalogId] = " ";
      expect(() => assertChineseCatalogDisplayManifest(nativeCatalog)).toThrow(
        `Chinese catalog display label for native ID ${JSON.stringify(catalogId)} must not be blank.`,
      );

      writableChineseCatalogLabels[catalogId] = "??TODO??";
      expect(() => assertChineseCatalogDisplayManifest(nativeCatalog)).toThrow(
        `Chinese catalog display label for native ID ${JSON.stringify(catalogId)} has disallowed placeholder ${JSON.stringify("??TODO??")}.`,
      );
    } finally {
      writableChineseCatalogLabels[catalogId] = originalLabel;
    }
  });

  it("rejects N/A placeholder variants for a real native catalog label", async () => {
    const nativeCatalog = await createLockedNativeCatalog();
    const writableChineseCatalogLabels =
      chineseCatalogLabelsById as Record<string, string>;
    const catalogId = "building:Coop";
    const originalLabel = writableChineseCatalogLabels[catalogId];

    try {
      for (const placeholderLabel of ["N/A", "n/a", "NA"]) {
        writableChineseCatalogLabels[catalogId] = placeholderLabel;

        expect(() => assertChineseCatalogDisplayManifest(nativeCatalog)).toThrow(
          `Chinese catalog display label for native ID ${JSON.stringify(catalogId)} has disallowed placeholder ${JSON.stringify(placeholderLabel)}.`,
        );
      }
    } finally {
      writableChineseCatalogLabels[catalogId] = originalLabel;
    }
  });

  it("allows only the declared source-compatible placeholder labels", async () => {
    const nativeCatalog = await createLockedNativeCatalog();

    expect(
      getCatalogDisplayName(
        "zh-CN",
        "big-craftable:161",
        "Pink Lemon",
      ),
    ).toBe("??粉色柠檬??");
    expect(
      getCatalogDisplayName(
        "zh-CN",
        "big-craftable:162",
        "Crumbled Statue",
      ),
    ).toBe("??碎屑雕像??");
    expect(() => assertChineseCatalogDisplayManifest(nativeCatalog)).not.toThrow();
  });

  it("preserves verified source names for the English locale", () => {
    expect(getCatalogDisplayName("en", "building:Coop", "Coop")).toBe("Coop");
  });

  it("retains a source name only when a summary row has no catalog ID", () => {
    expect(
      getCatalogDisplayName("zh-CN", undefined, "Existing player farm name"),
    ).toBe("Existing player farm name");
  });

  it("localizes known catalog identifiers", () => {
    expect(getCatalogDisplayName("zh-CN", "building:Coop", "Coop")).toBe(
      "鸡舍",
    );
  });

  it("localizes known map, configuration, and decor identifiers with source fallbacks", () => {
    expect(
      getPlannerMapDisplayName("zh-CN", "riverland", "Riverland Farm"),
    ).toBe("河流农场");
    expect(getPlannerMapDisplayName("zh-CN", "unknown", "Unknown Map")).toBe(
      "Unknown Map",
    );
    expect(
      getMapConfigurationDisplayName("zh-CN", "obelisk", "Obelisk"),
    ).toBe("传送柱");
    expect(
      getMapConfigurationDisplayName("zh-CN", "unknown", "Unknown option"),
    ).toBe("Unknown option");
    expect(
      getInteriorDecorDisplayName("zh-CN", "wallpaper", "17", "Wallpaper 17"),
    ).toBe("壁纸 17");
    expect(
      getInteriorDecorDisplayName("en", "flooring", "17", "Flooring 17"),
    ).toBe("Flooring 17");
    expect(
      getInteriorDecorDisplayName("zh-CN", "wallpaper", "custom", "Custom wallpaper"),
    ).toBe("Custom wallpaper");
  });
});
