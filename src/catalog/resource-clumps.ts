import type { CatalogItem } from "./catalog-types";

const resourceClumpCatalogItems: readonly CatalogItem[] = [
  {
    id: "clump_600",
    name: "Large Stump",
    category: "decor",
    tileSize: { width: 2, height: 2 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
    sprite: { kind: "source-rect", x: 0, y: 400, width: 32, height: 32 },
    allowedTools: ["cursor", "multi-select", "erase"],
  },
  {
    id: "clump_602",
    name: "Large Log",
    category: "decor",
    tileSize: { width: 2, height: 2 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
    sprite: { kind: "source-rect", x: 32, y: 400, width: 32, height: 32 },
    allowedTools: ["cursor", "multi-select", "erase"],
  },
  {
    id: "clump_622",
    name: "Meteorite",
    category: "decor",
    tileSize: { width: 2, height: 2 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
    sprite: { kind: "source-rect", x: 352, y: 400, width: 32, height: 32 },
    allowedTools: ["cursor", "multi-select", "erase"],
  },
  {
    id: "clump_672",
    name: "Large Boulder",
    category: "decor",
    tileSize: { width: 2, height: 2 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
    sprite: { kind: "source-rect", x: 0, y: 448, width: 32, height: 32 },
    allowedTools: ["cursor", "multi-select", "erase"],
  },
];

const resourceClumpCatalogItemIds = new Set(
  resourceClumpCatalogItems.map((resourceClumpCatalogItem) => resourceClumpCatalogItem.id),
);

export function createResourceClumpCatalogItems(): readonly CatalogItem[] {
  return resourceClumpCatalogItems;
}

export function isResourceClumpCatalogItemId(
  catalogItemId: unknown,
): catalogItemId is string {
  return typeof catalogItemId === "string" && resourceClumpCatalogItemIds.has(catalogItemId);
}

export function isAutoVisibleResourceClumpCatalogItemId(
  catalogItemId: unknown,
): boolean {
  return catalogItemId !== "clump_622" && isResourceClumpCatalogItemId(catalogItemId);
}
