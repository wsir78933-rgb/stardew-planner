import {
  createCatalogFromDatasets,
  type RawCatalogDatasets,
} from "./catalog-schema";
import type { Catalog, CatalogJsonFetcher, CatalogJsonResponse } from "./catalog-types";

const catalogAssetRoot = "/game-assets/1.6.15/data";

export const catalogDatasetUrls = {
  buildings: `${catalogAssetRoot}/Buildings.json`,
  crops: `${catalogAssetRoot}/Crops.json`,
  bigCraftables: `${catalogAssetRoot}/BigCraftables.json`,
  objects: `${catalogAssetRoot}/Objects.json`,
  fences: `${catalogAssetRoot}/Fences.json`,
  floorsAndPaths: `${catalogAssetRoot}/FloorsAndPaths.json`,
  furniture: `${catalogAssetRoot}/Furniture.json`,
  fruitTrees: `${catalogAssetRoot}/FruitTrees.json`,
} as const;

export async function loadCatalog(
  fetchCatalogJson: CatalogJsonFetcher = fetchBrowserCatalogJson,
): Promise<Catalog> {
  const rawCatalogDatasets: RawCatalogDatasets = {
    buildings: await fetchCatalogDataset(catalogDatasetUrls.buildings, fetchCatalogJson),
    crops: await fetchCatalogDataset(catalogDatasetUrls.crops, fetchCatalogJson),
    bigCraftables: await fetchCatalogDataset(
      catalogDatasetUrls.bigCraftables,
      fetchCatalogJson,
    ),
    objects: await fetchCatalogDataset(catalogDatasetUrls.objects, fetchCatalogJson),
    fences: await fetchCatalogDataset(catalogDatasetUrls.fences, fetchCatalogJson),
    floorsAndPaths: await fetchCatalogDataset(
      catalogDatasetUrls.floorsAndPaths,
      fetchCatalogJson,
    ),
    furniture: await fetchCatalogDataset(
      catalogDatasetUrls.furniture,
      fetchCatalogJson,
    ),
    fruitTrees: await fetchCatalogDataset(
      catalogDatasetUrls.fruitTrees,
      fetchCatalogJson,
    ),
  };

  return createCatalogFromDatasets(rawCatalogDatasets, catalogDatasetUrls);
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
