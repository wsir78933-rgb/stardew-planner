import { catalogDatasetUrls } from "./catalog-loader";
import {
  createBuildingCatalogFromDataset,
  createCropCatalogFromDatasets,
  createDecorCatalogFromDataset,
  createPlaceableCatalogFromDatasets,
  type CatalogDatasetUrls,
} from "./catalog-schema";
import type { Catalog, CatalogJsonFetcher, CatalogJsonResponse } from "./catalog-types";

export const catalogPanelCategories = [
  "buildings",
  "crops",
  "placeables",
  "decor",
] as const;

export type CatalogPanelCategory = (typeof catalogPanelCategories)[number];
export type CatalogDatasetName = keyof CatalogDatasetUrls;

export type CatalogDatasetLoader = Readonly<{
  loadDataset: (datasetName: CatalogDatasetName) => Promise<unknown>;
}>;

export type CatalogCategoryLoader = CatalogDatasetLoader & Readonly<{
  loadCategory: (category: CatalogPanelCategory) => Promise<Catalog>;
}>;

export type CatalogPrefetchScheduler = Readonly<{
  postTask?: (callback: () => void) => unknown;
  setTimeout: (callback: () => void, delayMilliseconds: number) => unknown;
}>;

const catalogDatasetNames = Object.keys(
  catalogDatasetUrls,
) as readonly CatalogDatasetName[];

const datasetsByCategory: Readonly<
  Record<CatalogPanelCategory, readonly CatalogDatasetName[]>
> = {
  buildings: ["buildings"],
  crops: ["crops", "objects"],
  placeables: [
    "bigCraftables",
    "objects",
    "fences",
    "floorsAndPaths",
    "furniture",
    "fruitTrees",
  ],
  decor: ["furniture", "bigCraftables"],
};

let browserCatalogCategoryLoader: CatalogCategoryLoader | undefined;

export function createCatalogCategoryLoader(
  fetchCatalogJson: CatalogJsonFetcher = fetchBrowserCatalogJson,
): CatalogCategoryLoader {
  const datasetPromises = new Map<CatalogDatasetName, Promise<unknown>>();

  function loadDataset(datasetName: CatalogDatasetName): Promise<unknown> {
    validateCatalogDatasetName(datasetName);
    const existingDatasetPromise = datasetPromises.get(datasetName);

    if (existingDatasetPromise !== undefined) {
      return existingDatasetPromise;
    }

    const datasetPromise = fetchCatalogDataset(
      catalogDatasetUrls[datasetName],
      fetchCatalogJson,
    );
    datasetPromises.set(datasetName, datasetPromise);
    void datasetPromise.catch(() => {
      if (datasetPromises.get(datasetName) === datasetPromise) {
        datasetPromises.delete(datasetName);
      }
    });

    return datasetPromise;
  }

  async function loadCategory(category: CatalogPanelCategory): Promise<Catalog> {
    validateCatalogPanelCategory(category);

    if (category === "buildings") {
      const buildings = await loadCategoryDataset(category, "buildings", loadDataset);

      return createCategoryProjection(category, ["buildings"], () =>
        createBuildingCatalogFromDataset(buildings, catalogDatasetUrls.buildings),
      );
    }

    if (category === "crops") {
      const cropsPromise = loadCategoryDataset(category, "crops", loadDataset);
      const objectsPromise = loadCategoryDataset(category, "objects", loadDataset);
      const [crops, objects] = await Promise.all([cropsPromise, objectsPromise]);

      return createCategoryProjection(category, ["crops", "objects"], () =>
        createCropCatalogFromDatasets(
          crops,
          objects,
          catalogDatasetUrls.crops,
          catalogDatasetUrls.objects,
        ),
      );
    }

    if (category === "placeables") {
      const bigCraftablesPromise = loadCategoryDataset(
        category,
        "bigCraftables",
        loadDataset,
      );
      const objectsPromise = loadCategoryDataset(category, "objects", loadDataset);
      const fencesPromise = loadCategoryDataset(category, "fences", loadDataset);
      const floorsAndPathsPromise = loadCategoryDataset(
        category,
        "floorsAndPaths",
        loadDataset,
      );
      const furniturePromise = loadCategoryDataset(category, "furniture", loadDataset);
      const fruitTreesPromise = loadCategoryDataset(category, "fruitTrees", loadDataset);
      const [
        bigCraftables,
        objects,
        fences,
        floorsAndPaths,
        furniture,
        fruitTrees,
      ] = await Promise.all([
        bigCraftablesPromise,
        objectsPromise,
        fencesPromise,
        floorsAndPathsPromise,
        furniturePromise,
        fruitTreesPromise,
      ]);

      return createCategoryProjection(category, datasetsByCategory.placeables, () =>
        createPlaceableCatalogFromDatasets(
          bigCraftables,
          objects,
          fences,
          floorsAndPaths,
          furniture,
          fruitTrees,
          catalogDatasetUrls,
        ),
      );
    }

    const furniturePromise = loadCategoryDataset(category, "furniture", loadDataset);
    const bigCraftablesPromise = loadCategoryDataset(
      category,
      "bigCraftables",
      loadDataset,
    );
    const [furniture, bigCraftables] = await Promise.all([
      furniturePromise,
      bigCraftablesPromise,
    ]);

    return createCategoryProjection(category, datasetsByCategory.decor, () =>
      createDecorCatalogFromDataset(
        furniture,
        catalogDatasetUrls.furniture,
        bigCraftables,
        catalogDatasetUrls.bigCraftables,
      ),
    );
  }

  return { loadDataset, loadCategory };
}

function createCategoryProjection(
  category: CatalogPanelCategory,
  datasetNames: readonly CatalogDatasetName[],
  createCatalog: () => Catalog,
): Catalog {
  try {
    return createCatalog();
  } catch (caughtError) {
    throw createCategoryLoadError(category, datasetNames, caughtError);
  }
}

export function loadCatalogCategory(category: CatalogPanelCategory): Promise<Catalog> {
  return getBrowserCatalogCategoryLoader().loadCategory(category);
}

export function loadBrowserCatalogDataset(
  datasetName: CatalogDatasetName,
): Promise<unknown> {
  return getBrowserCatalogCategoryLoader().loadDataset(datasetName);
}

export function scheduleInactiveCatalogCategoryPrefetch(
  editorLifecycleReport: string,
  activeCategory: CatalogPanelCategory,
  categoryLoader: CatalogCategoryLoader,
  scheduler: CatalogPrefetchScheduler = getBrowserCatalogPrefetchScheduler(),
): Promise<void> {
  if (editorLifecycleReport !== "editor:interactive") {
    throw new Error(
      `Catalog prefetch requires lifecycle report "editor:interactive"; received ${JSON.stringify(editorLifecycleReport)}.`,
    );
  }

  validateCatalogPanelCategory(activeCategory);
  validateCatalogCategoryLoader(categoryLoader);
  validateCatalogPrefetchScheduler(scheduler);

  return new Promise<void>((resolvePrefetch, rejectPrefetch) => {
    const prefetchInactiveCategories = () => {
      const categoryPrefetches = catalogPanelCategories
        .filter((category) => category !== activeCategory)
        .map((category) =>
          new Promise<Catalog>((resolveCategoryPrefetch) => {
            resolveCategoryPrefetch(categoryLoader.loadCategory(category));
          }),
        );

      void Promise.all(categoryPrefetches).then(
        () => resolvePrefetch(),
        rejectPrefetch,
      );
    };

    try {
      if (typeof scheduler.postTask === "function") {
        const scheduledTask = scheduler.postTask(prefetchInactiveCategories);
        void Promise.resolve(scheduledTask).then(undefined, rejectPrefetch);
        return;
      }

      scheduler.setTimeout(prefetchInactiveCategories, 0);
    } catch (caughtError) {
      rejectPrefetch(caughtError);
    }
  });
}

function getBrowserCatalogCategoryLoader(): CatalogCategoryLoader {
  if (browserCatalogCategoryLoader === undefined) {
    browserCatalogCategoryLoader = createCatalogCategoryLoader();
  }

  return browserCatalogCategoryLoader;
}

async function loadCategoryDataset(
  category: CatalogPanelCategory,
  datasetName: CatalogDatasetName,
  loadDataset: CatalogDatasetLoader["loadDataset"],
): Promise<unknown> {
  try {
    return await loadDataset(datasetName);
  } catch (caughtError) {
    throw createCategoryLoadError(
      category,
      [datasetName],
      getOriginalDatasetFailure(caughtError),
    );
  }
}

function getOriginalDatasetFailure(caughtError: unknown): unknown {
  if (caughtError instanceof Error && caughtError.cause !== undefined) {
    return caughtError.cause;
  }

  return caughtError;
}

async function fetchCatalogDataset(
  datasetUrl: string,
  fetchCatalogJson: CatalogJsonFetcher,
): Promise<unknown> {
  let catalogResponse: CatalogJsonResponse;

  try {
    catalogResponse = await fetchCatalogJson(datasetUrl);
  } catch (caughtError) {
    throw new Error(
      `Catalog dataset request failed for URL ${JSON.stringify(datasetUrl)} before a response was received.`,
      { cause: caughtError },
    );
  }

  if (
    typeof catalogResponse !== "object" ||
    catalogResponse === null ||
    typeof catalogResponse.ok !== "boolean" ||
    !Number.isInteger(catalogResponse.status)
  ) {
    throw new Error(
      `Catalog dataset response for URL ${JSON.stringify(datasetUrl)} must include boolean ok and integer status; received ${describeValue(catalogResponse)}.`,
    );
  }

  if (!catalogResponse.ok) {
    throw new Error(
      `Catalog dataset request failed for URL ${JSON.stringify(datasetUrl)} with status ${String(catalogResponse.status)}.`,
    );
  }

  if (typeof catalogResponse.json !== "function") {
    throw new Error(
      `Catalog dataset response for URL ${JSON.stringify(datasetUrl)} must include a json function; received ${describeValue(catalogResponse.json)}.`,
    );
  }

  try {
    return await catalogResponse.json();
  } catch (caughtError) {
    throw new Error(
      `Catalog dataset JSON parsing failed for URL ${JSON.stringify(datasetUrl)}.`,
      { cause: caughtError },
    );
  }
}

async function fetchBrowserCatalogJson(
  datasetUrl: string,
): Promise<CatalogJsonResponse> {
  if (typeof globalThis.fetch !== "function") {
    throw new Error(
      `Catalog dataset request cannot fetch local URL ${JSON.stringify(datasetUrl)} because global fetch is unavailable.`,
    );
  }

  return globalThis.fetch(datasetUrl);
}

function createCategoryLoadError(
  category: CatalogPanelCategory,
  datasetNames: readonly CatalogDatasetName[],
  caughtError: unknown,
): Error {
  const datasetUrls = datasetNames.map((datasetName) => catalogDatasetUrls[datasetName]);

  return new Error(
    `Catalog category ${JSON.stringify(category)} failed while loading dataset URL ${datasetUrls.map((datasetUrl) => JSON.stringify(datasetUrl)).join(", ")}.`,
    { cause: caughtError },
  );
}

function validateCatalogPanelCategory(category: string): asserts category is CatalogPanelCategory {
  if (!(catalogPanelCategories as readonly string[]).includes(category)) {
    throw new Error(
      `Catalog panel category must be one of ${JSON.stringify(catalogPanelCategories)}; received ${JSON.stringify(category)}.`,
    );
  }
}

function validateCatalogDatasetName(
  datasetName: unknown,
): asserts datasetName is CatalogDatasetName {
  if (
    typeof datasetName !== "string" ||
    !Object.hasOwn(catalogDatasetUrls, datasetName)
  ) {
    throw new Error(
      `Catalog dataset name must be one of ${JSON.stringify(catalogDatasetNames)}; received ${describeValue(datasetName)}.`,
    );
  }
}

function validateCatalogCategoryLoader(
  categoryLoader: CatalogCategoryLoader,
): void {
  if (
    typeof categoryLoader !== "object" ||
    categoryLoader === null ||
    typeof categoryLoader.loadCategory !== "function" ||
    typeof categoryLoader.loadDataset !== "function"
  ) {
    throw new TypeError(
      `Catalog category loader must include loadCategory and loadDataset functions; received ${describeValue(categoryLoader)}.`,
    );
  }
}

function getBrowserCatalogPrefetchScheduler(): CatalogPrefetchScheduler {
  const browserGlobal = globalThis as typeof globalThis & Readonly<{
    scheduler?: Readonly<{ postTask?: (callback: () => void) => unknown }>;
  }>;
  const browserScheduler = browserGlobal.scheduler;

  return {
    postTask:
      typeof browserScheduler?.postTask === "function"
        ? (callback) => browserScheduler.postTask?.(callback)
        : undefined,
    setTimeout: (callback, delayMilliseconds) =>
      globalThis.setTimeout(callback, delayMilliseconds),
  };
}

function validateCatalogPrefetchScheduler(scheduler: CatalogPrefetchScheduler): void {
  if (
    typeof scheduler !== "object" ||
    scheduler === null ||
    typeof scheduler.setTimeout !== "function"
  ) {
    throw new TypeError(
      `Catalog prefetch scheduler must include a setTimeout function; received ${describeValue(scheduler)}.`,
    );
  }
}

function describeValue(rawValue: unknown): string {
  if (rawValue === undefined) {
    return "undefined";
  }

  if (rawValue === null) {
    return "null";
  }

  if (Array.isArray(rawValue)) {
    return rawValue.length === 0 ? "[]" : `[array length ${String(rawValue.length)}]`;
  }

  if (typeof rawValue === "object") {
    return `[object ${Object.prototype.toString.call(rawValue)}]`;
  }

  return JSON.stringify(rawValue);
}
