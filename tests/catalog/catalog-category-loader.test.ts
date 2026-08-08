import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  catalogDatasetUrls,
  createCatalogCategoryLoader,
  loadBuildingPlacementMetadata,
  loadBrowserCatalogDataset,
  scheduleInactiveCatalogCategoryPrefetch,
  type CatalogJsonResponse,
} from "../../src/catalog";

type LockedCatalogDatasetName = keyof typeof catalogDatasetUrls;

async function readLockedCatalogDataset(
  datasetName: LockedCatalogDatasetName,
): Promise<unknown> {
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
  const datasetPath = path.join(
    process.cwd(),
    "public/game-assets/1.6.15/data",
    filenameByDatasetName[datasetName],
  );

  return JSON.parse(await readFile(datasetPath, "utf8")) as unknown;
}

async function readAllLockedCatalogDatasets(): Promise<
  Readonly<Record<LockedCatalogDatasetName, unknown>>
> {
  const datasetEntries = await Promise.all(
    (Object.keys(catalogDatasetUrls) as LockedCatalogDatasetName[]).map(
      async (datasetName) => [
        datasetName,
        await readLockedCatalogDataset(datasetName),
      ] as const,
    ),
  );

  return Object.fromEntries(datasetEntries) as Readonly<
    Record<LockedCatalogDatasetName, unknown>
  >;
}

function createSuccessfulJsonResponse(jsonValue: unknown): CatalogJsonResponse {
  return { ok: true, status: 200, json: async () => jsonValue };
}

function createLockedCatalogFetcher(
  lockedDatasets: Readonly<Record<LockedCatalogDatasetName, unknown>>,
  requestedUrls: string[],
) {
  const datasetNameByUrl = new Map<string, LockedCatalogDatasetName>(
    Object.entries(catalogDatasetUrls).map(([datasetName, datasetUrl]) => [
      datasetUrl,
      datasetName as LockedCatalogDatasetName,
    ]),
  );

  return async (requestedUrl: string): Promise<CatalogJsonResponse> => {
    requestedUrls.push(requestedUrl);
    const datasetName = datasetNameByUrl.get(requestedUrl);

    if (datasetName === undefined) {
      throw new Error(`Unexpected catalog URL ${JSON.stringify(requestedUrl)}.`);
    }

    return createSuccessfulJsonResponse(lockedDatasets[datasetName]);
  };
}

describe("catalog category loader", () => {
  it("loads Buildings without requesting inactive category datasets", async () => {
    const lockedDatasets = await readAllLockedCatalogDatasets();
    const requestedUrls: string[] = [];
    const categoryLoader = createCatalogCategoryLoader(
      createLockedCatalogFetcher(lockedDatasets, requestedUrls),
    );

    const catalog = await categoryLoader.loadCategory("buildings");

    expect(requestedUrls).toEqual([catalogDatasetUrls.buildings]);
    expect(catalog.items).toHaveLength(49);
    expect(catalog.items.every((catalogItem) => catalogItem.category === "building"))
      .toBe(true);
  });

  it("starts Crop and Objects requests before either category dependency resolves", async () => {
    const lockedDatasets = await readAllLockedCatalogDatasets();
    const requestedUrls: string[] = [];
    let resolveCropsResponse: ((response: CatalogJsonResponse) => void) | undefined;
    let resolveObjectsResponse: ((response: CatalogJsonResponse) => void) | undefined;
    const categoryLoader = createCatalogCategoryLoader(async (requestedUrl) => {
      requestedUrls.push(requestedUrl);

      if (requestedUrl === catalogDatasetUrls.crops) {
        return new Promise<CatalogJsonResponse>((resolve) => {
          resolveCropsResponse = resolve;
        });
      }

      if (requestedUrl === catalogDatasetUrls.objects) {
        return new Promise<CatalogJsonResponse>((resolve) => {
          resolveObjectsResponse = resolve;
        });
      }

      throw new Error(`Unexpected catalog URL ${JSON.stringify(requestedUrl)}.`);
    });

    const catalogPromise = categoryLoader.loadCategory("crops");

    await Promise.resolve();
    expect(requestedUrls).toEqual([
      catalogDatasetUrls.crops,
      catalogDatasetUrls.objects,
    ]);
    expect(resolveCropsResponse).toBeTypeOf("function");
    expect(resolveObjectsResponse).toBeTypeOf("function");

    resolveCropsResponse?.(createSuccessfulJsonResponse(lockedDatasets.crops));
    resolveObjectsResponse?.(createSuccessfulJsonResponse(lockedDatasets.objects));

    await expect(catalogPromise).resolves.toMatchObject({
      items: expect.arrayContaining([
        expect.objectContaining({ id: "crop:CarrotSeeds", name: "Carrot" }),
      ]),
    });
  });

  it("starts every Placeables dependency before waiting for a response", async () => {
    const lockedDatasets = await readAllLockedCatalogDatasets();
    const requestedUrls: string[] = [];
    const resolveResponsesByUrl = new Map<
      string,
      (response: CatalogJsonResponse) => void
    >();
    const categoryLoader = createCatalogCategoryLoader(async (requestedUrl) => {
      requestedUrls.push(requestedUrl);
      return new Promise<CatalogJsonResponse>((resolve) => {
        resolveResponsesByUrl.set(requestedUrl, resolve);
      });
    });

    const catalogPromise = categoryLoader.loadCategory("placeables");

    await Promise.resolve();

    expect(requestedUrls).toEqual([
      catalogDatasetUrls.bigCraftables,
      catalogDatasetUrls.objects,
      catalogDatasetUrls.fences,
      catalogDatasetUrls.floorsAndPaths,
      catalogDatasetUrls.furniture,
      catalogDatasetUrls.fruitTrees,
    ]);
    expect(resolveResponsesByUrl).toHaveLength(6);

    for (const [datasetName, datasetUrl] of Object.entries(catalogDatasetUrls)) {
      if (datasetName !== "buildings" && datasetName !== "crops") {
        const resolveResponse = resolveResponsesByUrl.get(datasetUrl);
        expect(resolveResponse).toBeTypeOf("function");
        resolveResponse?.(
          createSuccessfulJsonResponse(
            lockedDatasets[datasetName as LockedCatalogDatasetName],
          ),
        );
      }
    }

    const catalog = await catalogPromise;
    expect(catalog.items.some((catalogItem) => catalogItem.id === "furniture_0"))
      .toBe(true);
    expect(catalog.items.some((catalogItem) => catalogItem.id === "wildtree_1"))
      .toBe(true);
  });

  it("loads the complete Decor projection from furniture and BigCraftables", async () => {
    const lockedDatasets = await readAllLockedCatalogDatasets();
    const requestedUrls: string[] = [];
    const categoryLoader = createCatalogCategoryLoader(
      createLockedCatalogFetcher(lockedDatasets, requestedUrls),
    );

    const catalog = await categoryLoader.loadCategory("decor");

    expect(requestedUrls).toEqual([
      catalogDatasetUrls.furniture,
      catalogDatasetUrls.bigCraftables,
    ]);
    expect(catalog.items).toHaveLength(947);
    expect(catalog.items[0]).toMatchObject({ id: "furniture_0", name: "Oak Chair" });
    expect(catalog.items).toContainEqual(
      expect.objectContaining({ id: "big-craftable:0", name: "House Plant" }),
    );
    expect(catalog.items).toContainEqual(
      expect.objectContaining({
        id: "wp_0",
        name: "Wallpaper 0",
        textureLocalPath: "/game-assets/1.6.15/tilesheets/walls_and_floors.png",
      }),
    );
    expect(catalog.items.at(-1)).toMatchObject({
      id: "fl_MoreFloors:8",
      name: "Flooring MoreFloors:8",
      textureLocalPath: "/game-assets/1.6.15/tilesheets/floors_2.png",
    });
  });

  it("retains category, dataset URL, and original cause when a category dataset fails", async () => {
    const failedResponseError = new Error("network unavailable");
    const categoryLoader = createCatalogCategoryLoader(async (requestedUrl) => {
      if (requestedUrl === catalogDatasetUrls.crops) {
        throw failedResponseError;
      }

      return { ok: true, status: 200, json: async () => ({}) };
    });

    const categoryLoadError = await categoryLoader.loadCategory("crops").catch(
      (caughtError: unknown) => caughtError,
    );

    expect(categoryLoadError).toBeInstanceOf(Error);
    expect((categoryLoadError as Error).message).toContain(
      `Catalog category "crops" failed while loading dataset URL ${JSON.stringify(catalogDatasetUrls.crops)}`,
    );
    expect((categoryLoadError as Error).cause).toBe(failedResponseError);
  });

  it("evicts a rejected dataset promise so an explicit retry starts a new request", async () => {
    let cropsRequestCount = 0;
    const categoryLoader = createCatalogCategoryLoader(async (requestedUrl) => {
      if (requestedUrl === catalogDatasetUrls.crops) {
        cropsRequestCount += 1;
        throw new Error(`Crops request ${String(cropsRequestCount)} failed.`);
      }

      return createSuccessfulJsonResponse({});
    });

    await expect(categoryLoader.loadCategory("crops")).rejects.toThrow(
      `Catalog category "crops" failed while loading dataset URL ${JSON.stringify(catalogDatasetUrls.crops)}`,
    );
    await expect(categoryLoader.loadCategory("crops")).rejects.toThrow(
      `Catalog category "crops" failed while loading dataset URL ${JSON.stringify(catalogDatasetUrls.crops)}`,
    );

    expect(cropsRequestCount).toBe(2);
  });

  it("rejects an invalid dataset name before calling the injected fetch port", () => {
    const requestedUrls: string[] = [];
    const categoryLoader = createCatalogCategoryLoader(async (requestedUrl) => {
      requestedUrls.push(requestedUrl);
      return createSuccessfulJsonResponse({});
    });
    const loadRuntimeDataset = categoryLoader.loadDataset as (
      datasetName: string,
    ) => Promise<unknown>;

    expect(() => loadRuntimeDataset("paintData")).toThrow(
      'Catalog dataset name must be one of ["buildings","crops","bigCraftables","objects","fences","floorsAndPaths","furniture","fruitTrees"]; received "paintData".',
    );
    expect(requestedUrls).toEqual([]);
  });

  it("rejects an invalid browser dataset name before calling global fetch", async () => {
    const originalFetchDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      "fetch",
    );
    const requestedUrls: string[] = [];
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      writable: true,
      value: async (requestedUrl: string) => {
        requestedUrls.push(requestedUrl);
        return createSuccessfulJsonResponse({});
      },
    });

    try {
      const loadRuntimeBrowserDataset = loadBrowserCatalogDataset as (
        datasetName: string,
      ) => Promise<unknown>;

      expect(() => loadRuntimeBrowserDataset("paintData")).toThrow(
        'Catalog dataset name must be one of ["buildings","crops","bigCraftables","objects","fences","floorsAndPaths","furniture","fruitTrees"]; received "paintData".',
      );
      expect(requestedUrls).toEqual([]);
    } finally {
      if (originalFetchDescriptor === undefined) {
        Reflect.deleteProperty(globalThis, "fetch");
      } else {
        Object.defineProperty(globalThis, "fetch", originalFetchDescriptor);
      }
    }
  });

  it("rejects an invalid category schema instead of resolving to an empty catalog", async () => {
    const categoryLoader = createCatalogCategoryLoader(async (requestedUrl) => {
      if (requestedUrl === catalogDatasetUrls.crops) {
        return createSuccessfulJsonResponse([]);
      }

      if (requestedUrl === catalogDatasetUrls.objects) {
        return createSuccessfulJsonResponse({});
      }

      throw new Error(`Unexpected catalog URL ${JSON.stringify(requestedUrl)}.`);
    });

    await expect(categoryLoader.loadCategory("crops")).rejects.toThrow(
      `Catalog category "crops" failed while loading dataset URL ${JSON.stringify(catalogDatasetUrls.crops)}`,
    );
  });

  it("shares a Buildings request between its category projection and placement metadata", async () => {
    const lockedDatasets = await readAllLockedCatalogDatasets();
    const requestedUrls: string[] = [];
    const categoryLoader = createCatalogCategoryLoader(
      createLockedCatalogFetcher(lockedDatasets, requestedUrls),
    );

    const [buildingCatalog, buildingMetadataById] = await Promise.all([
      categoryLoader.loadCategory("buildings"),
      loadBuildingPlacementMetadata(categoryLoader),
    ]);

    expect(requestedUrls).toEqual([catalogDatasetUrls.buildings]);
    expect(buildingCatalog.items).toHaveLength(49);
    expect(buildingMetadataById.Coop.size).toEqual({ width: 6, height: 3 });
  });

  it("shares the default browser Buildings request while category and metadata loads are in flight", async () => {
    const lockedBuildings = await readLockedCatalogDataset("buildings");
    const originalFetchDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      "fetch",
    );
    const requestedUrls: string[] = [];
    let resolveBuildingResponse: ((response: Response) => void) | undefined;
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      writable: true,
      value: async (requestedUrl: string) => {
        requestedUrls.push(requestedUrl);
        return new Promise<Response>((resolve) => {
          resolveBuildingResponse = resolve;
        });
      },
    });

    vi.resetModules();

    try {
      const isolatedCatalogModule = await import("../../src/catalog");
      const buildingCatalogPromise =
        isolatedCatalogModule.loadCatalogCategory("buildings");
      const buildingMetadataPromise =
        isolatedCatalogModule.loadBuildingPlacementMetadata();

      expect(requestedUrls).toEqual([catalogDatasetUrls.buildings]);
      expect(resolveBuildingResponse).toBeTypeOf("function");

      resolveBuildingResponse?.(
        new Response(JSON.stringify(lockedBuildings), { status: 200 }),
      );

      const [buildingCatalog, buildingMetadataById] = await Promise.all([
        buildingCatalogPromise,
        buildingMetadataPromise,
      ]);

      expect(requestedUrls).toEqual([catalogDatasetUrls.buildings]);
      expect(buildingCatalog.items).toHaveLength(49);
      expect(buildingMetadataById.Coop.size).toEqual({ width: 6, height: 3 });
    } finally {
      if (originalFetchDescriptor === undefined) {
        Reflect.deleteProperty(globalThis, "fetch");
      } else {
        Object.defineProperty(globalThis, "fetch", originalFetchDescriptor);
      }
      vi.resetModules();
    }
  });

  it("reuses the fulfilled default browser Buildings request for sequential metadata loading", async () => {
    const lockedBuildings = await readLockedCatalogDataset("buildings");
    const originalFetchDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      "fetch",
    );
    const requestedUrls: string[] = [];
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      writable: true,
      value: async (requestedUrl: string) => {
        requestedUrls.push(requestedUrl);
        return new Response(JSON.stringify(lockedBuildings), { status: 200 });
      },
    });

    vi.resetModules();

    try {
      const isolatedCatalogModule = await import("../../src/catalog");
      const buildingCatalog =
        await isolatedCatalogModule.loadCatalogCategory("buildings");
      const buildingMetadataById =
        await isolatedCatalogModule.loadBuildingPlacementMetadata();

      expect(requestedUrls).toEqual([catalogDatasetUrls.buildings]);
      expect(buildingCatalog.items).toHaveLength(49);
      expect(buildingMetadataById.Coop.size).toEqual({ width: 6, height: 3 });
    } finally {
      if (originalFetchDescriptor === undefined) {
        Reflect.deleteProperty(globalThis, "fetch");
      } else {
        Object.defineProperty(globalThis, "fetch", originalFetchDescriptor);
      }
      vi.resetModules();
    }
  });

  it("does not schedule inactive prefetch until the explicit interactive report", () => {
    const scheduledTasks: Array<() => void> = [];
    const loadedCategories: string[] = [];
    const categoryLoader = {
      loadCategory(category: string) {
        loadedCategories.push(category);
        return Promise.resolve({ items: [] });
      },
      loadDataset() {
        return Promise.resolve({});
      },
    };

    scheduleInactiveCatalogCategoryPrefetch("editor:interactive", "buildings", categoryLoader, {
      postTask(callback) {
        scheduledTasks.push(callback);
      },
      setTimeout() {
        throw new Error("scheduler.postTask must be preferred when callable.");
      },
    });

    expect(loadedCategories).toEqual([]);
    expect(scheduledTasks).toHaveLength(1);

    scheduledTasks[0]();

    expect(loadedCategories).toEqual(["crops", "placeables", "decor"]);
  });

  it("rejects a prefetch request without the interactive lifecycle report", () => {
    const categoryLoader = {
      loadCategory() {
        return Promise.resolve({ items: [] });
      },
      loadDataset() {
        return Promise.resolve({});
      },
    };
    const scheduler = {
      setTimeout() {
        throw new Error("Prefetch must not schedule before editor interactivity.");
      },
    };

    expect(() =>
      scheduleInactiveCatalogCategoryPrefetch(
        "editor:canvas-mounted",
        "buildings",
        categoryLoader,
        scheduler,
      ),
    ).toThrow(
      'Catalog prefetch requires lifecycle report "editor:interactive"',
    );
  });

  it("uses one zero-delay task when scheduler.postTask is unavailable", () => {
    const scheduledDelays: number[] = [];
    const categoryLoader = {
      loadCategory() {
        return Promise.resolve({ items: [] });
      },
      loadDataset() {
        return Promise.resolve({});
      },
    };

    scheduleInactiveCatalogCategoryPrefetch("editor:interactive", "decor", categoryLoader, {
      setTimeout(_callback, delayMilliseconds) {
        scheduledDelays.push(delayMilliseconds);
      },
    });

    expect(scheduledDelays).toEqual([0]);
  });

  it("returns an observable prefetch rejection instead of leaving a category failure unhandled", async () => {
    let scheduledTask: (() => void) | undefined;
    const categoryLoader = {
      loadCategory(category: string) {
        return category === "crops"
          ? Promise.reject(new Error("Crops prefetch failed."))
          : Promise.resolve({ items: [] });
      },
      loadDataset() {
        return Promise.resolve({});
      },
    };

    const prefetchCompletion = scheduleInactiveCatalogCategoryPrefetch(
      "editor:interactive",
      "buildings",
      categoryLoader,
      {
        setTimeout(callback) {
          scheduledTask = callback;
        },
      },
    );

    expect(scheduledTask).toBeTypeOf("function");
    scheduledTask?.();

    await expect(prefetchCompletion).rejects.toThrow("Crops prefetch failed");
  });

  it("rejects observable fallback prefetch completion when a category loader throws synchronously", async () => {
    const synchronousPrefetchFailure = new Error(
      "Crops prefetch threw synchronously.",
    );
    let scheduledTask: (() => void) | undefined;
    const categoryLoader = {
      loadCategory(category: string) {
        if (category === "crops") {
          throw synchronousPrefetchFailure;
        }

        return Promise.resolve({ items: [] });
      },
      loadDataset() {
        return Promise.resolve({});
      },
    };

    const prefetchCompletion = scheduleInactiveCatalogCategoryPrefetch(
      "editor:interactive",
      "buildings",
      categoryLoader,
      {
        setTimeout(callback) {
          scheduledTask = callback;
        },
      },
    );

    expect(scheduledTask).toBeTypeOf("function");
    expect(() => scheduledTask?.()).not.toThrow();
    await expect(prefetchCompletion).rejects.toBe(synchronousPrefetchFailure);
  });

  it("calls native scheduler.postTask with its scheduler receiver", () => {
    let schedulerReceiver: unknown;
    const browserScheduler = {
      postTask(this: unknown) {
        schedulerReceiver = this;
      },
    };
    const categoryLoader = {
      loadCategory() {
        return Promise.resolve({ items: [] });
      },
      loadDataset() {
        return Promise.resolve({});
      },
    };
    const globalWithScheduler = globalThis as typeof globalThis & {
      scheduler?: typeof browserScheduler;
    };
    const originalScheduler = globalWithScheduler.scheduler;

    globalWithScheduler.scheduler = browserScheduler;

    try {
      scheduleInactiveCatalogCategoryPrefetch(
        "editor:interactive",
        "buildings",
        categoryLoader,
      );
    } finally {
      globalWithScheduler.scheduler = originalScheduler;
    }

    expect(schedulerReceiver).toBe(browserScheduler);
  });
});
