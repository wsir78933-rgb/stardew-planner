import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  CatalogItemGrid,
  CatalogPanelContent,
  getCatalogItemsForPanel,
  ItemCatalogPanel,
  loadCatalogPanelState,
} from "../../src/components/item-catalog-panel";
import type { Catalog, CatalogItem } from "../../src/catalog";

const catalogItems: readonly CatalogItem[] = [
  {
    id: "building:Coop",
    name: "Coop",
    category: "building",
    tileSize: { width: 6, height: 3 },
    textureLocalPath: "/game-assets/1.6.15/buildings/Coop.png",
    sprite: { kind: "source-rect", x: 16, y: 32, width: 96, height: 48 },
    allowedTools: ["cursor", "multi-select", "erase"],
  },
  {
    id: "crop:Parsnip",
    name: "Parsnip",
    category: "crop",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
    sprite: { kind: "sprite-index", index: 17 },
    allowedTools: ["cursor", "multi-select", "fill", "erase"],
  },
  {
    id: "object:Stone",
    name: "Stone",
    category: "placeable",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
    sprite: { kind: "sprite-index", index: 2 },
    allowedTools: ["cursor", "multi-select", "erase"],
  },
  {
    id: "floor:Stone Floor",
    name: "Stone Floor",
    category: "floor",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/flooring.png",
    sprite: { kind: "source-rect", x: 0, y: 0, width: 64, height: 64 },
    allowedTools: ["cursor", "multi-select", "fill", "erase"],
  },
  {
    id: "fence:Wood Fence",
    name: "Wood Fence",
    category: "fence",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/Fence1.png",
    sprite: { kind: "source-rect", x: 0, y: 0, width: 48, height: 352 },
    allowedTools: ["cursor", "multi-select", "erase"],
  },
  {
    id: "clump_602",
    name: "Large Log",
    category: "decor",
    tileSize: { width: 2, height: 2 },
    textureLocalPath: "/game-assets/1.6.15/sprites/springobjects.png",
    sprite: { kind: "source-rect", x: 32, y: 400, width: 32, height: 32 },
    allowedTools: ["cursor", "multi-select", "erase"],
  },
];

const catalog: Catalog = { items: catalogItems };

describe("item catalog panel", () => {
  it("renders the reference search placeholder", () => {
    const catalogPanelMarkup = renderToStaticMarkup(
      createElement(ItemCatalogPanel, {
        category: "buildings",
        panelPosition: "bottom",
        searchQuery: "",
        selectedCatalogItemId: null,
        onCatalogItemSelect: () => undefined,
        onCategoryChange: () => undefined,
        onSearchQueryChange: () => undefined,
      }),
    );

    expect(catalogPanelMarkup).toContain('placeholder="Search..."');
  });

  it("loads the catalog through a fake local loader", async () => {
    const requestedUrls: string[] = [];
    const fakeLocalCatalogLoader = async (): Promise<Catalog> => {
      requestedUrls.push("/game-assets/1.6.15/data/Crops.json");
      return catalog;
    };

    await expect(loadCatalogPanelState(fakeLocalCatalogLoader)).resolves.toEqual({
      kind: "ready",
      catalog,
    });
    expect(requestedUrls).toEqual(["/game-assets/1.6.15/data/Crops.json"]);
  });

  it("filters only verified items for each panel category", () => {
    expect(getCatalogItemsForPanel(catalog, "buildings", "coop")).toEqual([
      catalogItems[0],
    ]);
    expect(getCatalogItemsForPanel(catalog, "crops", "par")).toEqual([
      catalogItems[1],
    ]);
    expect(getCatalogItemsForPanel(catalog, "placeables", "stone")).toEqual([
      catalogItems[2],
      catalogItems[3],
    ]);
    expect(getCatalogItemsForPanel(catalog, "decor", "log")).toEqual([
      catalogItems[5],
    ]);
  });

  it("renders verified resource-clump decor items in the Decor panel", () => {
    const decorPanelMarkup = renderToStaticMarkup(
      createElement(CatalogPanelContent, {
        category: "decor",
        catalogPanelLoadState: { kind: "ready", catalog },
        onCatalogItemSelect: () => undefined,
        searchQuery: "",
        selectedCatalogItemId: null,
      }),
    );

    expect(decorPanelMarkup).toContain("Large Log");
    expect(decorPanelMarkup).not.toContain("Decor items are not shown");
  });

  it("preserves the local URL and record error when catalog loading fails", async () => {
    const exactLoaderFailure = new Error(
      'Catalog dataset /game-assets/1.6.15/data/Crops.json record "Parsnip" has invalid SpriteIndex -1.',
    );

    await expect(
      loadCatalogPanelState(async () => {
        throw exactLoaderFailure;
      }),
    ).resolves.toEqual({
      kind: "error",
      message:
        'Unable to load the local item catalog: Catalog dataset /game-assets/1.6.15/data/Crops.json record "Parsnip" has invalid SpriteIndex -1.',
    });
  });

  it("renders local texture thumbnails and marks the selected item", () => {
    const catalogGridMarkup = renderToStaticMarkup(
      createElement(CatalogItemGrid, {
        catalogItems: [catalogItems[0]],
        selectedCatalogItemId: "building:Coop",
        onCatalogItemSelect: () => undefined,
      }),
    );

    expect(catalogGridMarkup).toContain('aria-pressed="true"');
    expect(catalogGridMarkup).toContain("Coop");
    expect(catalogGridMarkup).toContain("6 × 3");
    expect(catalogGridMarkup).toContain(
      "background-image:url(/game-assets/1.6.15/buildings/Coop.png)",
    );
    expect(catalogGridMarkup).toContain("background-position:-16px -32px");
  });
});
