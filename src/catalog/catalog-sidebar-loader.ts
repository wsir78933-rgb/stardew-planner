import {
  catalogPanelCategories,
  loadCatalogCategory,
  type CatalogPanelCategory,
} from "./catalog-category-loader";
import type { Catalog } from "./catalog-types";
import {
  catalogSidebarCategories,
  deduplicateCatalogItems,
  getCatalogSidebarItems,
  selectCatalogSidebarPlaceableItems,
  type CatalogSidebarCategory,
} from "./catalog-sidebar-model";

const legacyCategoriesBySidebarCategory: Readonly<
  Record<CatalogSidebarCategory, readonly CatalogPanelCategory[]>
> = {
  buildings: ["buildings"],
  crops: ["crops", "placeables"],
  trees: ["placeables"],
  equipment: ["placeables", "decor"],
  paths: ["placeables"],
  lighting: ["placeables", "decor"],
  furniture: ["decor"],
  decor: ["placeables", "decor"],
};

const sidebarCategoryPromises = new Map<
  CatalogSidebarCategory,
  Promise<Catalog>
>();
let sidebarCatalogPromise: Promise<Catalog> | undefined;

export function loadSidebarCatalogCategory(
  category: CatalogSidebarCategory,
): Promise<Catalog> {
  validateCatalogSidebarCategory(category);
  const existingCategoryPromise = sidebarCategoryPromises.get(category);
  if (existingCategoryPromise !== undefined) {
    return existingCategoryPromise;
  }

  const categoryPromise = loadSidebarCatalogCategoryProjection(category);
  sidebarCategoryPromises.set(category, categoryPromise);
  void categoryPromise.catch(() => {
    if (sidebarCategoryPromises.get(category) === categoryPromise) {
      sidebarCategoryPromises.delete(category);
    }
  });

  return categoryPromise;
}

export function loadSidebarCatalog(): Promise<Catalog> {
  if (sidebarCatalogPromise !== undefined) {
    return sidebarCatalogPromise;
  }

  const catalogPromise = loadCompleteSidebarCatalog();
  sidebarCatalogPromise = catalogPromise;
  void catalogPromise.catch(() => {
    if (sidebarCatalogPromise === catalogPromise) {
      sidebarCatalogPromise = undefined;
    }
  });

  return catalogPromise;
}

async function loadSidebarCatalogCategoryProjection(
  category: CatalogSidebarCategory,
): Promise<Catalog> {
  const sourceCategories = legacyCategoriesBySidebarCategory[category];
  const sourceCatalogs = await Promise.all(
    sourceCategories.map((sourceCategory) => loadCatalogCategory(sourceCategory)),
  );
  const sidebarSourceItems = sourceCatalogs.flatMap((catalog, index) =>
    sourceCategories[index] === "placeables"
      ? selectCatalogSidebarPlaceableItems(catalog.items)
      : catalog.items,
  );

  return {
    items: getCatalogSidebarItems(sidebarSourceItems, category, ""),
  };
}

async function loadCompleteSidebarCatalog(): Promise<Catalog> {
  const sourceCatalogs = await Promise.all(
    catalogPanelCategories.map((category) => loadCatalogCategory(category)),
  );
  const sourceCatalogByCategory = new Map(
    catalogPanelCategories.map((category, index) => [category, sourceCatalogs[index]]),
  );
  const buildingItems = getRequiredSourceCatalog(sourceCatalogByCategory, "buildings").items;
  const cropItems = getRequiredSourceCatalog(sourceCatalogByCategory, "crops").items;
  const placeableItems = selectCatalogSidebarPlaceableItems(
    getRequiredSourceCatalog(sourceCatalogByCategory, "placeables").items,
  );
  const decorItems = getRequiredSourceCatalog(sourceCatalogByCategory, "decor").items;

  return {
    items: deduplicateCatalogItems([
      ...buildingItems,
      ...cropItems,
      ...placeableItems,
      ...decorItems,
    ]),
  };
}

function getRequiredSourceCatalog(
  sourceCatalogByCategory: ReadonlyMap<CatalogPanelCategory, Catalog | undefined>,
  category: CatalogPanelCategory,
): Catalog {
  const sourceCatalog = sourceCatalogByCategory.get(category);
  if (sourceCatalog === undefined) {
    throw new Error(
      `Sidebar catalog source ${JSON.stringify(category)} was not loaded.`,
    );
  }

  return sourceCatalog;
}

function validateCatalogSidebarCategory(
  category: string,
): asserts category is CatalogSidebarCategory {
  if (!(catalogSidebarCategories as readonly string[]).includes(category)) {
    throw new TypeError(
      `Catalog sidebar category must be one of ${catalogSidebarCategories.join(", ")}; received ${describeValue(category)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }
  if (typeof value === "symbol" || typeof value === "function") {
    return String(value);
  }
  if (typeof value === "bigint") {
    return `${String(value)}n`;
  }
  return JSON.stringify(value) ?? String(value);
}
