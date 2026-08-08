import { describe, expect, it, vi } from "vitest";
import {
  createPlannerResourceCoordinator,
  type PreparedDefaultMap,
} from "../../src/resources/planner-resource-coordinator";
import { createInitialMapRenderOptions } from "../../src/maps/map-render-options";
import {
  getMapTileCompositionOptions,
  loadPreparedDefaultMap,
} from "../../src/resources/default-map-resource";
import type { ReferenceProjectRepository } from "../../src/reference-runtime/reference-project-repository";
import { createEditorPerformanceMarker } from "../../src/performance/editor-performance-marks";

const testRepository = {} as ReferenceProjectRepository;

function createPreparedMap(season: PreparedDefaultMap["season"]): PreparedDefaultMap {
  return {
    mapId: "standard",
    season,
    parsedMap: {} as PreparedDefaultMap["parsedMap"],
    renderingContract: {} as PreparedDefaultMap["renderingContract"],
  };
}

function createDeferred<Value>(): Readonly<{
  promise: Promise<Value>;
  resolve(value: Value): void;
  reject(reason: unknown): void;
}> {
  let resolvePromise: ((value: Value) => void) | undefined;
  let rejectPromise: ((reason: unknown) => void) | undefined;
  const promise = new Promise<Value>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  return {
    promise,
    resolve(value) {
      resolvePromise?.(value);
    },
    reject(reason) {
      rejectPromise?.(reason);
    },
  };
}

describe("planner resource coordinator", () => {
  it("keeps Farmhouse 2 overlay tile-data composition at the resource boundary", () => {
    expect(getMapTileCompositionOptions("farmhouse-2")).toEqual({
      includeTileDataProperties: true,
    });
    expect(getMapTileCompositionOptions("ginger-island")).toBeUndefined();
  });

  it("shares the same full map request while it is in flight", async () => {
    let resolveMap: ((preparedMap: PreparedDefaultMap) => void) | undefined;
    const loadMap = vi.fn(
      () => new Promise<PreparedDefaultMap>((resolve) => { resolveMap = resolve; }),
    );
    const coordinator = createPlannerResourceCoordinator({
      importPixi: async () => ({} as typeof import("pixi.js")),
      readProjectState: async () => ({ repository: testRepository, projects: [] }),
      loadDefaultMap: loadMap,
    });
    const request = { mapId: "standard", season: "spring" as const, mapRenderOptions: createInitialMapRenderOptions() };

    const firstRequest = coordinator.loadDefaultMap(request);
    const secondRequest = coordinator.loadDefaultMap(request);

    expect(loadMap).toHaveBeenCalledTimes(1);
    resolveMap?.(createPreparedMap("spring"));
    await expect(firstRequest).resolves.toEqual(await secondRequest);
  });

  it("marks successful coordinator resources only after their promises resolve", async () => {
    const markedNames: string[] = [];
    const performanceMarker = createEditorPerformanceMarker({
      mark(markName) {
        markedNames.push(markName);
      },
    });
    performanceMarker.mark("editor:island-mounted");
    const pixi = createDeferred<typeof import("pixi.js")>();
    const projectState = createDeferred<{
      repository: ReferenceProjectRepository;
      projects: readonly [];
    }>();
    const preparedMap = createDeferred<PreparedDefaultMap>();
    let reportFetched: (() => void) | undefined;
    let reportParsed: (() => void) | undefined;
    const loadDefaultMap = vi.fn((_request, progress) => {
      reportFetched = progress.onFetched;
      reportParsed = progress.onParsed;
      return preparedMap.promise;
    });
    const coordinator = createPlannerResourceCoordinator({
      importPixi: () => pixi.promise,
      readProjectState: () => projectState.promise,
      loadDefaultMap,
      performanceMarker,
    });
    const request = {
      mapId: "standard",
      season: "spring" as const,
      mapRenderOptions: createInitialMapRenderOptions(),
    };

    const pixiPromise = coordinator.importPixi();
    const projectPromise = coordinator.readProjectState();
    const firstMapPromise = coordinator.loadDefaultMap(request);
    const duplicateMapPromise = coordinator.loadDefaultMap(request);

    expect(markedNames).toEqual(["editor:island-mounted"]);
    expect(loadDefaultMap).toHaveBeenCalledTimes(1);

    reportFetched?.();
    expect(markedNames).toEqual([
      "editor:island-mounted",
      "editor:default-map-fetched",
    ]);
    reportParsed?.();
    preparedMap.resolve(createPreparedMap("spring"));
    await expect(firstMapPromise).resolves.toEqual(await duplicateMapPromise);
    expect(markedNames).toEqual([
      "editor:island-mounted",
      "editor:default-map-fetched",
      "editor:default-map-parsed",
    ]);

    pixi.resolve({} as typeof import("pixi.js"));
    projectState.resolve({ repository: testRepository, projects: [] });
    await Promise.all([pixiPromise, projectPromise]);
    expect(markedNames).toEqual([
      "editor:island-mounted",
      "editor:default-map-fetched",
      "editor:default-map-parsed",
      "editor:pixi-module-ready",
      "editor:project-state-ready",
    ]);
  });

  it("does not mark a failed resource as successfully ready", async () => {
    const markedNames: string[] = [];
    const performanceMarker = createEditorPerformanceMarker({
      mark(markName) {
        markedNames.push(markName);
      },
    });
    performanceMarker.mark("editor:island-mounted");
    const coordinator = createPlannerResourceCoordinator({
      importPixi: async () => {
        throw new Error("Pixi import failed");
      },
      readProjectState: async () => {
        throw new Error("project read failed");
      },
      loadDefaultMap: async () => {
        throw new Error("map read failed");
      },
      performanceMarker,
    });
    const request = {
      mapId: "standard",
      season: "spring" as const,
      mapRenderOptions: createInitialMapRenderOptions(),
    };

    await expect(coordinator.importPixi()).rejects.toThrow("Pixi import failed");
    await expect(coordinator.readProjectState()).rejects.toThrow("project read failed");
    await expect(coordinator.loadDefaultMap(request)).rejects.toThrow("map read failed");
    expect(markedNames).toEqual(["editor:island-mounted"]);
  });

  it("does not share requests with a different season or rendering options", async () => {
    const loadMap = vi.fn(async (request: { season: PreparedDefaultMap["season"] }) => createPreparedMap(request.season));
    const coordinator = createPlannerResourceCoordinator({
      importPixi: async () => ({} as typeof import("pixi.js")),
      readProjectState: async () => ({ repository: testRepository, projects: [] }),
      loadDefaultMap: loadMap,
    });
    const options = createInitialMapRenderOptions();

    await coordinator.loadDefaultMap({ mapId: "standard", season: "spring", mapRenderOptions: options });
    await coordinator.loadDefaultMap({ mapId: "standard", season: "summer", mapRenderOptions: options });
    await coordinator.loadDefaultMap({ mapId: "standard", season: "spring", mapRenderOptions: { ...options, gingerIslandOverlayIds: [] } });

    expect(loadMap).toHaveBeenCalledTimes(3);
  });

  it("evicts rejected map requests so an explicit retry starts fresh", async () => {
    const loadMap = vi.fn()
      .mockRejectedValueOnce(new Error("map failed"))
      .mockResolvedValueOnce(createPreparedMap("spring"));
    const coordinator = createPlannerResourceCoordinator({
      importPixi: async () => ({} as typeof import("pixi.js")),
      readProjectState: async () => ({ repository: testRepository, projects: [] }),
      loadDefaultMap: loadMap,
    });
    const request = { mapId: "standard", season: "spring" as const, mapRenderOptions: createInitialMapRenderOptions() };

    await expect(coordinator.loadDefaultMap(request)).rejects.toThrow("map failed");
    await expect(coordinator.loadDefaultMap(request)).resolves.toEqual(createPreparedMap("spring"));
    expect(loadMap).toHaveBeenCalledTimes(2);
  });

  it("reports map, season, URL, and HTTP status for a failed real map fetch", async () => {
    await expect(loadPreparedDefaultMap(
      { mapId: "standard", season: "winter", mapRenderOptions: createInitialMapRenderOptions() },
      {
        fetchMapAsset: async () => ({
          ok: false,
          status: 503,
          text: async () => "",
        }),
      },
    )).rejects.toThrow(
      /(?=.*standard)(?=.*winter)(?=.*\/game-assets\/1\.6\.15\/maps\/Farm\.tmx)(?=.*503)/s,
    );
  });

  it.each([
    [
      "network rejection",
      { fetchMapAsset: async () => Promise.reject(new Error("network unavailable")) },
      /standard.*spring.*Farm\.tmx.*network unavailable/s,
    ],
    [
      "response text rejection",
      {
        fetchMapAsset: async () => ({
          ok: true,
          status: 200,
          text: async () => Promise.reject(new Error("body stream failed")),
        }),
      },
      /standard.*spring.*Farm\.tmx.*body stream failed/s,
    ],
    [
      "TMX parse rejection",
      {
        fetchMapAsset: async () => ({ ok: true, status: 200, text: async () => "<map/>" }),
        parseMapXml: async () => Promise.reject(new Error("TMX malformed")),
      },
      /standard.*spring.*Farm\.tmx.*TMX malformed/s,
    ],
  ])("adds context when %s occurs", async (_caseName, ports, expectedMessage) => {
    await expect(loadPreparedDefaultMap(
      { mapId: "standard", season: "spring", mapRenderOptions: createInitialMapRenderOptions() },
      ports,
    )).rejects.toThrow(expectedMessage);
  });

  it("rejects a non-function injected port with its received value", async () => {
    await expect(loadPreparedDefaultMap(
      { mapId: "standard", season: "spring", mapRenderOptions: createInitialMapRenderOptions() },
      { fetchMapAsset: "not a function" } as unknown as Parameters<typeof loadPreparedDefaultMap>[1],
    )).rejects.toThrow(/fetchMapAsset.*not a function/s);
  });

  it.each([
    ["ok", "yes"],
    ["status", 99],
    ["text", "not a function"],
  ])("rejects malformed map response %s with contextual received value", async (fieldName, fieldValue) => {
    const malformedResponse = {
      ok: true,
      status: 200,
      text: async () => "<map/>",
      [fieldName]: fieldValue,
    };

    await expect(loadPreparedDefaultMap(
      { mapId: "standard", season: "spring", mapRenderOptions: createInitialMapRenderOptions() },
      {
        fetchMapAsset: async () => malformedResponse as unknown as {
          ok: boolean;
          status: number;
          text(): Promise<string>;
        },
      },
    )).rejects.toThrow(
      new RegExp(`(?=.*${fieldName})(?=.*mapId.*standard)(?=.*season.*spring)`, "s"),
    );
  });
});
