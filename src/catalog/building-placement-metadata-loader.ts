import { createBuildingPlacementMetadata } from "./building-placement-metadata";
import {
  loadBrowserCatalogDataset,
  type CatalogDatasetLoader,
} from "./catalog-category-loader";
import type { BuildingPlacementMetadataById } from "./building-placement-metadata";
import type { CatalogJsonFetcher, CatalogJsonResponse } from "./catalog-types";

const buildingPlacementMetadataUrl = "/game-assets/1.6.15/data/Buildings.json";

export async function loadBuildingPlacementMetadata(
  buildingDatasetSource?: CatalogJsonFetcher | CatalogDatasetLoader,
): Promise<BuildingPlacementMetadataById> {
  const rawBuildingRecords = await loadBuildingRecords(buildingDatasetSource);

  return createBuildingPlacementMetadata(rawBuildingRecords);
}

async function loadBuildingRecords(
  buildingDatasetSource: CatalogJsonFetcher | CatalogDatasetLoader | undefined,
): Promise<unknown> {
  if (buildingDatasetSource === undefined) {
    return loadBrowserCatalogDataset("buildings");
  }

  if (typeof buildingDatasetSource === "function") {
    return fetchBuildingRecords(buildingDatasetSource);
  }

  if (typeof buildingDatasetSource.loadDataset !== "function") {
    throw new TypeError(
      `Building placement metadata dataset source must be a fetch function or include loadDataset; received ${describeValue(buildingDatasetSource)}.`,
    );
  }

  return buildingDatasetSource.loadDataset("buildings");
}

async function fetchBuildingRecords(
  fetchBuildingJson: CatalogJsonFetcher,
): Promise<unknown> {
  let buildingResponse: CatalogJsonResponse;

  try {
    buildingResponse = await fetchBuildingJson(buildingPlacementMetadataUrl);
  } catch (caughtError) {
    throw new Error(
      `Building placement metadata request failed for URL ${JSON.stringify(buildingPlacementMetadataUrl)} before a response was received; received ${describeCaughtError(caughtError)}.`,
      { cause: caughtError },
    );
  }

  if (
    typeof buildingResponse !== "object" ||
    buildingResponse === null ||
    typeof buildingResponse.ok !== "boolean" ||
    !Number.isInteger(buildingResponse.status)
  ) {
    throw new Error(
      `Building placement metadata response for URL ${JSON.stringify(buildingPlacementMetadataUrl)} must include boolean ok and integer status; received ${describeValue(buildingResponse)}.`,
    );
  }

  if (!buildingResponse.ok) {
    throw new Error(
      `Building placement metadata request failed for URL ${JSON.stringify(buildingPlacementMetadataUrl)} with status ${String(buildingResponse.status)}.`,
    );
  }

  if (typeof buildingResponse.json !== "function") {
    throw new Error(
      `Building placement metadata response for URL ${JSON.stringify(buildingPlacementMetadataUrl)} must include a json function; received ${describeValue(buildingResponse.json)}.`,
    );
  }

  try {
    return await buildingResponse.json();
  } catch (caughtError) {
    throw new Error(
      `Building placement metadata JSON parsing failed for URL ${JSON.stringify(buildingPlacementMetadataUrl)}; received ${describeCaughtError(caughtError)}.`,
      { cause: caughtError },
    );
  }
}

function describeCaughtError(caughtError: unknown): string {
  if (caughtError instanceof Error) {
    return `${caughtError.name}: ${caughtError.message}`;
  }

  return describeValue(caughtError);
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
