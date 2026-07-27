import { describe, expect, it } from "vitest";
import type {
  BuildingPlacementMetadataById,
  CatalogJsonFetcher,
  CatalogJsonResponse,
} from "../../src/catalog";

const lockedBuildingDataUrl = "/game-assets/1.6.15/data/Buildings.json";

type BuildingPlacementMetadataLoader = (
  fetchBuildingJson?: CatalogJsonFetcher,
) => Promise<BuildingPlacementMetadataById>;

async function readBuildingPlacementMetadataLoader(): Promise<
  BuildingPlacementMetadataLoader | undefined
> {
  const catalogModule = (await import("../../src/catalog")) as Readonly<
    Record<string, unknown>
  >;
  const exportedLoader = catalogModule.loadBuildingPlacementMetadata;

  expect(exportedLoader).toBeTypeOf("function");

  return typeof exportedLoader === "function"
    ? (exportedLoader as BuildingPlacementMetadataLoader)
    : undefined;
}

function createValidBuildingRecords(): Readonly<Record<string, unknown>> {
  return {
    Shed: {
      Size: { X: 2, Y: 1 },
      CollisionMap: "XO",
      AdditionalPlacementTiles: null,
      HumanDoor: { X: -1, Y: -1 },
      TileProperties: [],
    },
  };
}

function createJsonResponse(jsonValue: unknown): CatalogJsonResponse {
  return {
    ok: true,
    status: 200,
    json: async () => jsonValue,
  };
}

describe("building placement metadata loader", () => {
  it("loads the strict placement projection from the version-locked local Buildings data URL", async () => {
    const loadBuildingPlacementMetadata =
      await readBuildingPlacementMetadataLoader();

    if (loadBuildingPlacementMetadata === undefined) {
      return;
    }

    const requestedUrls: string[] = [];
    const buildingMetadataById = await loadBuildingPlacementMetadata(
      async (requestedUrl) => {
        requestedUrls.push(requestedUrl);
        return createJsonResponse(createValidBuildingRecords());
      },
    );

    expect(requestedUrls).toEqual([lockedBuildingDataUrl]);
    expect(buildingMetadataById).toEqual({
      Shed: {
        size: { width: 2, height: 1 },
        collisionMap: [
          [
            { requiresBuildable: true },
            { requiresBuildable: false },
          ],
        ],
        additionalPlacementTiles: [],
        humanDoor: { x: -1, y: -1 },
        tilePropertyGrid: [],
      },
    });
  });

  it("includes the local URL and received network error when no response arrives", async () => {
    const loadBuildingPlacementMetadata =
      await readBuildingPlacementMetadataLoader();

    if (loadBuildingPlacementMetadata === undefined) {
      return;
    }

    await expect(
      loadBuildingPlacementMetadata(async () => {
        throw new Error("network unavailable");
      }),
    ).rejects.toThrow(
      `Building placement metadata request failed for URL ${JSON.stringify(lockedBuildingDataUrl)} before a response was received; received Error: network unavailable`,
    );
  });

  it("rejects an invalid response shape with the local URL and received value", async () => {
    const loadBuildingPlacementMetadata =
      await readBuildingPlacementMetadataLoader();

    if (loadBuildingPlacementMetadata === undefined) {
      return;
    }

    await expect(
      loadBuildingPlacementMetadata(async () => null as unknown as CatalogJsonResponse),
    ).rejects.toThrow(
      `Building placement metadata response for URL ${JSON.stringify(lockedBuildingDataUrl)} must include boolean ok and integer status; received null`,
    );
  });

  it("rejects a non-integer response status with the local URL and received value", async () => {
    const loadBuildingPlacementMetadata =
      await readBuildingPlacementMetadataLoader();

    if (loadBuildingPlacementMetadata === undefined) {
      return;
    }

    await expect(
      loadBuildingPlacementMetadata(
        async () =>
          ({
            ok: true,
            status: 200.5,
            json: async () => createValidBuildingRecords(),
          }) as unknown as CatalogJsonResponse,
      ),
    ).rejects.toThrow(
      `Building placement metadata response for URL ${JSON.stringify(lockedBuildingDataUrl)} must include boolean ok and integer status; received [object [object Object]]`,
    );
  });

  it("includes the local URL and HTTP status when the local asset request fails", async () => {
    const loadBuildingPlacementMetadata =
      await readBuildingPlacementMetadataLoader();

    if (loadBuildingPlacementMetadata === undefined) {
      return;
    }

    await expect(
      loadBuildingPlacementMetadata(async () => ({
        ok: false,
        status: 503,
        json: async () => null,
      })),
    ).rejects.toThrow(
      `Building placement metadata request failed for URL ${JSON.stringify(lockedBuildingDataUrl)} with status 503`,
    );
  });

  it("rejects a response without a JSON reader with the local URL and received value", async () => {
    const loadBuildingPlacementMetadata =
      await readBuildingPlacementMetadataLoader();

    if (loadBuildingPlacementMetadata === undefined) {
      return;
    }

    await expect(
      loadBuildingPlacementMetadata(
        async () => ({ ok: true, status: 200, json: null }) as unknown as CatalogJsonResponse,
      ),
    ).rejects.toThrow(
      `Building placement metadata response for URL ${JSON.stringify(lockedBuildingDataUrl)} must include a json function; received null`,
    );
  });

  it("includes the local URL and JSON parsing error when the response body is invalid", async () => {
    const loadBuildingPlacementMetadata =
      await readBuildingPlacementMetadataLoader();

    if (loadBuildingPlacementMetadata === undefined) {
      return;
    }

    await expect(
      loadBuildingPlacementMetadata(async () => ({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError("unexpected token");
        },
      })),
    ).rejects.toThrow(
      `Building placement metadata JSON parsing failed for URL ${JSON.stringify(lockedBuildingDataUrl)}; received SyntaxError: unexpected token`,
    );
  });
});
