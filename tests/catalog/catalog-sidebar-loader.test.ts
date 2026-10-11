import { readFile } from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  catalogDatasetUrls,
  createBuildingCatalogFromDataset,
  createCropCatalogFromDatasets,
  createDecorCatalogFromDataset,
  createPlaceableCatalogFromDatasets,
  selectCatalogSidebarPlaceableItems,
  type CatalogItem,
} from "../../src/catalog";

type LockedCatalogDatasetName = keyof typeof catalogDatasetUrls;

const filenameByDatasetName: Readonly<Record<LockedCatalogDatasetName, string>> = {
  buildings: "Buildings.json",
  crops: "Crops.json",
  bigCraftables: "BigCraftables.json",
  objects: "Objects.json",
  fences: "Fences.json",
  floorsAndPaths: "FloorsAndPaths.json",
  furniture: "Furniture.json",
  fruitTrees: "FruitTrees.json",
};

async function readLockedCatalogDatasets(): Promise<
  Readonly<Record<LockedCatalogDatasetName, unknown>>
> {
  const datasetEntries = await Promise.all(
    (Object.keys(catalogDatasetUrls) as LockedCatalogDatasetName[]).map(
      async (datasetName) => {
        const datasetPath = path.join(
          process.cwd(),
          "public/game-assets/1.6.15/data",
          filenameByDatasetName[datasetName],
        );
        const dataset = JSON.parse(await readFile(datasetPath, "utf8")) as unknown;
        return [datasetName, dataset] as const;
      },
    ),
  );

  return Object.fromEntries(datasetEntries) as Readonly<
    Record<LockedCatalogDatasetName, unknown>
  >;
}

function createExpectedVisibleCatalogItems(
  lockedDatasets: Readonly<Record<LockedCatalogDatasetName, unknown>>,
): readonly CatalogItem[] {
  const buildingItems = createBuildingCatalogFromDataset(
    lockedDatasets.buildings,
    catalogDatasetUrls.buildings,
  ).items;
  const cropItems = createCropCatalogFromDatasets(
    lockedDatasets.crops,
    lockedDatasets.objects,
    catalogDatasetUrls.crops,
    catalogDatasetUrls.objects,
  ).items;
  const placeableItems = selectCatalogSidebarPlaceableItems(
    createPlaceableCatalogFromDatasets(
      lockedDatasets.bigCraftables,
      lockedDatasets.objects,
      lockedDatasets.fences,
      lockedDatasets.floorsAndPaths,
      lockedDatasets.furniture,
      lockedDatasets.fruitTrees,
      catalogDatasetUrls,
    ).items,
  );
  const decorItems = createDecorCatalogFromDataset(
    lockedDatasets.furniture,
    catalogDatasetUrls.furniture,
    lockedDatasets.bigCraftables,
    catalogDatasetUrls.bigCraftables,
  ).items;
  const uniqueItemsById = new Map<string, CatalogItem>();

  for (const catalogItem of [
    ...buildingItems,
    ...cropItems,
    ...placeableItems,
    ...decorItems,
  ]) {
    const existingCatalogItem = uniqueItemsById.get(catalogItem.id);
    if (existingCatalogItem === undefined) {
      uniqueItemsById.set(catalogItem.id, catalogItem);
      continue;
    }
    if (
      existingCatalogItem.category !== catalogItem.category ||
      existingCatalogItem.name !== catalogItem.name
    ) {
      throw new Error(
        `Locked visible catalog ID ${JSON.stringify(catalogItem.id)} has conflicting category or name.`,
      );
    }
  }

  return [...uniqueItemsById.values()];
}

function installLockedCatalogFetch(
  lockedDatasets: Readonly<Record<LockedCatalogDatasetName, unknown>>,
  failBuildingsOnce = false,
) {
  const requestedUrls: string[] = [];
  const datasetNameByUrl = new Map<string, LockedCatalogDatasetName>(
    Object.entries(catalogDatasetUrls).map(([datasetName, datasetUrl]) => [
      datasetUrl,
      datasetName as LockedCatalogDatasetName,
    ]),
  );
  let shouldFailBuildings = failBuildingsOnce;
  const fetchMock = vi.fn(async (request: RequestInfo | URL): Promise<Response> => {
    const requestedUrl = String(request);
    requestedUrls.push(requestedUrl);
    const datasetName = datasetNameByUrl.get(requestedUrl);

    if (datasetName === undefined) {
      return new Response("Unexpected catalog URL", { status: 404 });
    }
    if (datasetName === "buildings" && shouldFailBuildings) {
      shouldFailBuildings = false;
      return new Response("Temporary failure", { status: 503 });
    }

    return new Response(JSON.stringify(lockedDatasets[datasetName]), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  });
  vi.stubGlobal("fetch", fetchMock);

  return { fetchMock, requestedUrls };
}

async function importFreshCatalogModule() {
  vi.resetModules();
  return import("../../src/catalog");
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("catalog sidebar loader", () => {
  it("loads the exact unique union of every legacy-visible source", async () => {
    const lockedDatasets = await readLockedCatalogDatasets();
    const expectedItems = createExpectedVisibleCatalogItems(lockedDatasets);
    const { fetchMock, requestedUrls } = installLockedCatalogFetch(lockedDatasets);
    const catalogModule = await importFreshCatalogModule();
    const loadedCatalog = await catalogModule.loadSidebarCatalog();
    const loadedItemIds = loadedCatalog.items.map(({ id }) => id).sort();
    const expectedItemIds = expectedItems.map(({ id }) => id).sort();

    expect(loadedItemIds).toEqual(expectedItemIds);
    expect(new Set(loadedItemIds).size).toBe(loadedItemIds.length);
    expect(loadedCatalog.items).toEqual(expectedItems);
    expect(new Set(requestedUrls)).toEqual(new Set(Object.values(catalogDatasetUrls)));
    expect(fetchMock).toHaveBeenCalledTimes(8);
    expect(loadedCatalog.items.some(({ name }) => name === "Keg")).toBe(true);
    expect(loadedCatalog.items.some(({ id }) => id === "wp_0")).toBe(true);
    expect(loadedCatalog.items.some(({ id }) => id === "grass_1")).toBe(true);
  });

  it("keeps each sidebar category projection equal to its full-index category set", async () => {
    const lockedDatasets = await readLockedCatalogDatasets();
    installLockedCatalogFetch(lockedDatasets);
    const catalogModule = await importFreshCatalogModule();
    const completeCatalog = await catalogModule.loadSidebarCatalog();

    for (const category of catalogModule.catalogSidebarCategories) {
      const categoryCatalog = await catalogModule.loadSidebarCatalogCategory(category);
      const completeCategoryItems = catalogModule.getCatalogSidebarItems(
        completeCatalog.items,
        category,
        "",
      );

      expect(categoryCatalog.items.map(({ id }) => id).sort()).toEqual(
        completeCategoryItems.map(({ id }) => id).sort(),
      );
    }

    const cropCatalog = await catalogModule.loadSidebarCatalogCategory("crops");
    expect(cropCatalog.items).toContainEqual(
      expect.objectContaining({ id: "object:251", name: "Tea Sapling" }),
    );
  });

  it("loads only required legacy datasets for a focused category", async () => {
    const lockedDatasets = await readLockedCatalogDatasets();
    const { requestedUrls } = installLockedCatalogFetch(lockedDatasets);
    const catalogModule = await importFreshCatalogModule();

    const catalog = await catalogModule.loadSidebarCatalogCategory("buildings");

    expect(requestedUrls).toEqual([catalogDatasetUrls.buildings]);
    expect(catalog.items).toHaveLength(49);
    expect(catalog.items.every((catalogItem) => catalogItem.category === "building"))
      .toBe(true);
  });

  it("retries after a failed source request instead of caching an incomplete catalog", async () => {
    const lockedDatasets = await readLockedCatalogDatasets();
    const { fetchMock, requestedUrls } = installLockedCatalogFetch(lockedDatasets, true);
    const catalogModule = await importFreshCatalogModule();

    await expect(catalogModule.loadSidebarCatalog()).rejects.toThrow(/Buildings\.json/);
    const catalog = await catalogModule.loadSidebarCatalog();

    expect(catalog.items.some(({ id }) => id === "building:Farmhouse")).toBe(true);
    expect(new Set(catalog.items.map(({ id }) => id)).size).toBe(catalog.items.length);
    expect(requestedUrls.filter((url) => url === catalogDatasetUrls.buildings)).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledTimes(9);
  });

  it("clears a failed sidebar-category promise so the category can be retried", async () => {
    const lockedDatasets = await readLockedCatalogDatasets();
    const { fetchMock, requestedUrls } = installLockedCatalogFetch(lockedDatasets, true);
    const catalogModule = await importFreshCatalogModule();

    await expect(
      catalogModule.loadSidebarCatalogCategory("buildings"),
    ).rejects.toThrow(/Buildings\.json/);
    const catalog = await catalogModule.loadSidebarCatalogCategory("buildings");

    expect(catalog.items).toHaveLength(49);
    expect(requestedUrls).toEqual([catalogDatasetUrls.buildings, catalogDatasetUrls.buildings]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("fails fast on an unknown sidebar category", async () => {
    const catalogModule = await importFreshCatalogModule();

    expect(() =>
      catalogModule.loadSidebarCatalogCategory("unknown" as "buildings"),
    ).toThrow(/received "unknown"/);
    expect(() =>
      catalogModule.loadSidebarCatalogCategory(Symbol("invalid-sidebar-category") as unknown as "buildings"),
    ).toThrow(/Symbol\(invalid-sidebar-category\)/);
    expect(() =>
      catalogModule.loadSidebarCatalogCategory(23n as unknown as "buildings"),
    ).toThrow(/received 23n/);
  });
});
