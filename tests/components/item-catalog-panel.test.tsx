import { readFile } from "node:fs/promises";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  CatalogItemGrid,
  CatalogPanelContent,
  createBuildingThumbnailLayerDrawCommand,
  getReadyCatalogItems,
  getCatalogItemsForPanel,
  getCatalogItemThumbnailStyle,
  getNextCatalogItemControlChoice,
  getNextCatalogCategory,
  ItemCatalogPanel,
  loadFullCatalogPanelState,
  loadCatalogPanelState,
  materializeBuildingThumbnailFrame,
  normalizeBuildingThumbnailSourceFrame,
  resolveBuildingThumbnailLayers,
  shouldExpandCatalogPanelBeforeSearchFocus,
  shouldFocusCatalogSearchForShortcut,
} from "../../src/components/item-catalog-panel";
import { createBuildingThumbnailImageLoader } from "../../src/components/building-thumbnail-visibility";
import {
  catalogDatasetUrls,
  createBuildingCatalogFromDataset,
  createSeasonalPlaceableCatalogProperties,
  getCatalogSidebarFilters,
} from "../../src/catalog";
import { createBushCatalogItems } from "../../src/catalog/bushes";
import { resolvePlannerTextureFrame } from "../../src/rendering/planner-texture-frame-resolution";
import type {
  Catalog,
  CatalogItem,
  CatalogPresentationChoice,
} from "../../src/catalog";

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
    id: "crop:472",
    name: "Parsnip",
    category: "crop",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
    sprite: { kind: "sprite-index", index: 17 },
    allowedTools: ["cursor", "multi-select", "fill", "erase"],
    renderingMetadata: {
      kind: "crop",
      fullyGrownRect: { kind: "source-rect", x: 192, y: 256, width: 16, height: 32 },
      tintColors: [],
      hasForageShadow: false,
    },
  },
  {
    id: "big-craftable:232",
    name: "Stone Chest",
    category: "placeable",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/craftables.png",
    sprite: { kind: "sprite-index", index: 232 },
    allowedTools: ["cursor", "multi-select", "erase"],
  },
  {
    id: "floor:1",
    name: "Stone Floor",
    category: "floor",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/flooring.png",
    sprite: { kind: "source-rect", x: 0, y: 0, width: 64, height: 64 },
    allowedTools: ["cursor", "multi-select", "fill", "erase"],
  },
  {
    id: "fence:322",
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
    textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
    sprite: { kind: "source-rect", x: 32, y: 400, width: 32, height: 32 },
    allowedTools: ["cursor", "multi-select", "erase"],
  },
];

const catalog: Catalog = { items: catalogItems };

const wallpaperCatalogItem: CatalogItem = {
  id: "wp_0",
  name: "Wallpaper 0",
  category: "decor",
  interiorDecorKind: "wallpaper",
  tileSize: { width: 1, height: 1 },
  textureLocalPath: "/game-assets/1.6.15/tilesheets/walls_and_floors.png",
  sprite: { kind: "source-rect", x: 0, y: 8, width: 16, height: 28 },
  allowedTools: ["cursor", "multi-select", "fill", "erase"],
};

describe("item catalog panel", () => {
  it("renders tall BigCraftable thumbnails from the 16x32 craftables frames", () => {
    const scarecrow: CatalogItem = {
      id: "big-craftable:8",
      name: "Scarecrow",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/craftables.png",
      sprite: { kind: "sprite-index", index: 8 },
      thumbnailSprite: {
        kind: "source-rect",
        x: 0,
        y: 32,
        width: 16,
        height: 32,
      },
      allowedTools: ["cursor"],
    };

    expect(getCatalogItemThumbnailStyle(scarecrow, {
      flipped: false,
      rotation: 0,
      variant: 0,
    })).toMatchObject({
      backgroundPosition: "0px -60px",
      backgroundSize: "240px 2760px",
      height: 60,
      width: 30,
    });
  });

  it("uses the mature crop frame from the shared crop rendering contract for thumbnails", () => {
    const carrot: CatalogItem = {
      id: "crop:CarrotSeeds",
      name: "Carrot",
      category: "crop",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
      sprite: { kind: "sprite-index", index: 48 },
      allowedTools: ["cursor", "multi-select", "fill", "erase"],
      renderingMetadata: {
        kind: "crop",
        fullyGrownRect: { kind: "source-rect", x: 64, y: 768, width: 16, height: 32 },
        tintColors: [],
        hasForageShadow: false,
      },
    };

    expect(getCatalogItemThumbnailStyle(carrot, {
      flipped: false,
      rotation: 0,
      variant: 0,
    })).toMatchObject({
      backgroundPosition: "-120px -1440px",
      backgroundSize: "480px 1920px",
      height: 60,
      width: 30,
    });
  });

  it("rounds scaled furniture dimensions like the reference planner", () => {
    const aquaticSanctuary: CatalogItem = {
      id: "furniture_2400",
      name: "Aquatic Sanctuary",
      category: "placeable",
      tileSize: { width: 7, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/furniture.png",
      sprite: { kind: "source-rect", x: 0, y: 1200, width: 112, height: 48 },
      allowedTools: ["cursor"],
    };

    expect(getCatalogItemThumbnailStyle(aquaticSanctuary, {
      flipped: false,
      rotation: 0,
      variant: 0,
    })).toMatchObject({
      backgroundPosition: "0px -642.8571428571429px",
      backgroundSize: "274.2857142857143px 797.1428571428571px",
      height: 26,
      width: 60,
    });
  });

  it("renders the Tea Sapling from the bushes sheet at its tall source frame", () => {
    const teaSapling: CatalogItem = {
      id: "object:251",
      name: "Tea Sapling",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/bushes.png",
      sprite: { kind: "source-rect", x: 32, y: 256, width: 16, height: 32 },
      allowedTools: ["cursor"],
      ...createSeasonalPlaceableCatalogProperties("object:251"),
    };

    expect(getCatalogItemThumbnailStyle(teaSapling, {
      flipped: false,
      rotation: 0,
      variant: 0,
    })).toMatchObject({
      backgroundPosition: "-60px -480px",
      backgroundSize: "240px 660px",
      height: 60,
      width: 30,
    });
  });

  it("uses the reference texture scales for small special placeable sheets", () => {
    const cactus: CatalogItem = {
      id: "furniture_FreeCactus",
      name: "Cactus",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/FreeCactuses.png",
      sprite: { kind: "source-rect", x: 0, y: 96, width: 16, height: 16 },
      allowedTools: ["cursor"],
    };
    const mannequin: CatalogItem = {
      id: "furniture_mannequin_male",
      name: "Mannequin (Male)",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/Mannequins.png",
      sprite: { kind: "source-rect", x: 32, y: 0, width: 16, height: 32 },
      allowedTools: ["cursor"],
    };

    expect(getCatalogItemThumbnailStyle(cactus, {
      flipped: false,
      rotation: 0,
      variant: 0,
    })).toMatchObject({
      backgroundPosition: "0px -360px",
      backgroundSize: "480px 480px",
      height: 60,
      width: 60,
    });
    expect(getCatalogItemThumbnailStyle(mannequin, {
      flipped: false,
      rotation: 0,
      variant: 0,
    })).toMatchObject({
      backgroundPosition: "-60px 0px",
      backgroundSize: "240px 240px",
      height: 60,
      width: 30,
    });
  });

  it("keeps wild-tree thumbnails on their 48x160 terrain sheets", () => {
    const mushroomTree: CatalogItem = {
      id: "wildtree_12",
      name: "Green Rain Tree (Mushroom)",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/terrain/tree3_greenRain.png",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 48, height: 96 },
      allowedTools: ["cursor"],
    };

    expect(getCatalogItemThumbnailStyle(mushroomTree, {
      flipped: false,
      rotation: 0,
      variant: 0,
    })).toMatchObject({
      backgroundPosition: "0px 0px",
      backgroundSize: "30px 100px",
      height: 60,
      width: 30,
    });
  });

  it("renders the reference search placeholder", () => {
    const catalogPanelMarkup = renderToStaticMarkup(
      createElement(ItemCatalogPanel, {
        catalogPresentationChoicesByItemId: new Map(),
        category: "buildings",
        panelPosition: "bottom",
        searchQuery: "",
        selectedCatalogItemId: null,
        onCatalogItemSelect: () => undefined,
        onCategoryChange: () => undefined,
        onSearchQueryChange: () => undefined,
      }),
    );

    expect(catalogPanelMarkup).toContain('placeholder="Search all items"');
  });

  it("renders the eight category icons with the live reference SVG paths and stroke", () => {
    const catalogPanelMarkup = renderToStaticMarkup(
      createElement(ItemCatalogPanel, {
        catalogPresentationChoicesByItemId: new Map(),
        category: "buildings",
        panelPosition: "bottom",
        searchQuery: "",
        selectedCatalogItemId: null,
        onCatalogItemSelect: () => undefined,
        onCategoryChange: () => undefined,
        onSearchQueryChange: () => undefined,
      }),
    );
    const expectedCategoryIcons = [
      {
        category: "buildings",
        path: "M3 21V12L5 7L12 3L19 7L21 12V21ZM8 21V14H16V21M12 9H12.01",
      },
      {
        category: "crops",
        path: "M12 21V11C12 6.5 15.5 3 21 3C21 8.5 17.5 11 12 11M12 15C12 11 8.5 8 3 8C3 12.5 6.5 15 12 15M5 21H19",
      },
      {
        category: "trees",
        path: "M12 3L16 8H13.5L18 13H15L21 18H3L9 13H6L10.5 8H8ZM12 18V21",
      },
      {
        category: "equipment",
        path: "M10.05 5.46L11.46 4.05A1.5 1.5 0 0 1 13.59 4.05L19.95 10.41A1.5 1.5 0 0 1 19.95 12.54L18.54 13.95A1.5 1.5 0 0 1 16.41 13.95L10.05 7.59A1.5 1.5 0 0 1 10.05 5.46ZM13.23 10.77L4 20",
      },
      {
        category: "paths",
        path: "M3 21V5L5 3L7 5V21ZM17 21V5L19 3L21 5V21ZM7 9H17M7 15H17M7 15L17 9",
      },
      {
        category: "lighting",
        path: "M12 3C12.9 5.2 15.5 6.2 15.5 8.5A3.5 3.5 0 0 1 8.5 8.5C8.5 7.2 9 6.4 9.8 5.6C10 6.7 10.6 7.2 11.3 7.2C11.5 5.6 11.3 4.4 12 3ZM8.5 16H15.5L13.5 21H10.5ZM3 8.5H4.5M19.5 8.5H21M6 4.5L4.8 3.3M18 4.5L19.2 3.3",
      },
      {
        category: "furniture",
        path: "M6 10V6A2 2 0 0 1 8 4H16A2 2 0 0 1 18 6V10M3 12A2 2 0 0 1 7 12V14H17V12A2 2 0 0 1 21 12V17A1 1 0 0 1 20 18H4A1 1 0 0 1 3 17ZM6 18V21M18 18V21",
      },
      {
        category: "decor",
        path: "M8 6L12 3L16 6M5 6H19A2 2 0 0 1 21 8V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V8A2 2 0 0 1 5 6ZM7 17L10.5 12.5L13 15.5L14.5 14L17 17",
      },
    ] as const;

    for (const expectedCategoryIcon of expectedCategoryIcons) {
      const categoryTabStart = catalogPanelMarkup.indexOf(
        `data-category="${expectedCategoryIcon.category}"`,
      );
      expect(categoryTabStart).toBeGreaterThanOrEqual(0);

      const categoryIconStart = catalogPanelMarkup.indexOf("<svg", categoryTabStart);
      const categoryIconEnd = catalogPanelMarkup.indexOf("</svg>", categoryIconStart);
      const categoryIconMarkup = catalogPanelMarkup.slice(
        categoryIconStart,
        categoryIconEnd + "</svg>".length,
      );

      expect(categoryIconMarkup).toContain('aria-hidden="true"');
      expect(categoryIconMarkup).toContain('height="18"');
      expect(categoryIconMarkup).toContain('width="18"');
      expect(categoryIconMarkup).toContain('viewBox="0 0 24 24"');
      expect(categoryIconMarkup).toContain(
        '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
      );
      expect(categoryIconMarkup).toContain(`<path d="${expectedCategoryIcon.path}"></path>`);
    }
  });

  it("preserves catalog roles, tab relations, visual classes, and controlled search value", () => {
    const catalogPanelMarkup = renderToStaticMarkup(
      createElement(ItemCatalogPanel, {
        catalogPresentationChoicesByItemId: new Map(),
        category: "crops",
        panelPosition: "left",
        searchQuery: "parsnip",
        selectedCatalogItemId: null,
        onCatalogItemSelect: () => undefined,
        onCategoryChange: () => undefined,
        onSearchQueryChange: () => undefined,
      }),
    );

    expect(catalogPanelMarkup).toContain(
      'class="bottom-wrapper item-catalog-panel item-catalog-panel--left left-mode"',
    );
    expect(catalogPanelMarkup).toContain('data-expanded="false"');
    expect(catalogPanelMarkup).toContain("item-catalog-panel__branding");
    expect(catalogPanelMarkup).toContain("item-catalog-panel__mobile-toggle");
    expect(catalogPanelMarkup).toContain("item-catalog-panel__search-row");
    expect(catalogPanelMarkup).toContain(
      'class="panel-tabs item-catalog-panel__categories" role="tablist"',
    );
    expect(catalogPanelMarkup.match(/role="tab"/g)).toHaveLength(8);
    expect(catalogPanelMarkup).toContain('aria-selected="true"');
    expect(catalogPanelMarkup).toContain('aria-label="Crops"');
    expect(catalogPanelMarkup).toContain('aria-controls=');
    expect(catalogPanelMarkup).toContain(
      'class="panel-content item-catalog-panel__content"',
    );
    expect(catalogPanelMarkup).toContain('role="tabpanel"');
    expect(catalogPanelMarkup).toContain('aria-labelledby=');
    expect(catalogPanelMarkup).toContain(
      'class="search-input item-catalog-panel__search"',
    );
    expect(catalogPanelMarkup).toContain('type="search"');
    expect(catalogPanelMarkup).toContain('value="parsnip"');
    expect(catalogPanelMarkup.indexOf("Search all items")).toBeLessThan(
      catalogPanelMarkup.indexOf('role="tablist"'),
    );
  });

  it("navigates the eight category tabs in a four-column grid", () => {
    expect(getNextCatalogCategory("lighting", "Home")).toBe("buildings");
    expect(getNextCatalogCategory("buildings", "End")).toBe("decor");
    expect(getNextCatalogCategory("buildings", "ArrowLeft")).toBe("equipment");
    expect(getNextCatalogCategory("equipment", "ArrowRight")).toBe("buildings");
    expect(getNextCatalogCategory("crops", "ArrowDown")).toBe("lighting");
    expect(getNextCatalogCategory("lighting", "ArrowUp")).toBe("crops");
    expect(getNextCatalogCategory("crops", "Enter")).toBeNull();
  });

  it("loads only the active category through a fake local category loader", async () => {
    const requestedUrls: string[] = [];
    const fakeLocalCategoryLoader = async (): Promise<Catalog> => {
      requestedUrls.push("/game-assets/1.6.15/data/crops.json");
      return catalog;
    };

    await expect(loadCatalogPanelState("crops", fakeLocalCategoryLoader)).resolves.toEqual({
      kind: "ready",
      scope: "category",
      category: "crops",
      catalog,
    });
    expect(requestedUrls).toEqual(["/game-assets/1.6.15/data/crops.json"]);
  });

  it("exposes the complete loaded catalog for the workspace Canvas", () => {
    expect(
      getReadyCatalogItems({ kind: "ready", scope: "all", catalog }),
    ).toEqual(catalogItems);
    expect(
      getReadyCatalogItems({ kind: "loading", scope: "all" }),
    ).toBeNull();
  });

  it("searches all catalog categories regardless of the selected category", () => {
    expect(getCatalogItemsForPanel(catalog, "buildings", "coop")).toEqual([
      catalogItems[0],
    ]);
    expect(getCatalogItemsForPanel(catalog, "crops", "par")).toEqual([
      catalogItems[1],
    ]);
    expect(getCatalogItemsForPanel(catalog, "equipment", "stone")).toEqual([
      catalogItems[2],
      catalogItems[3],
    ]);
    expect(getCatalogItemsForPanel(catalog, "decor", "log")).toEqual([
      catalogItems[5],
    ]);
  });

  it("classifies placeable machines as Equipment and keeps search global", () => {
    const keg: CatalogItem = {
      ...catalogItems[2],
      id: "big-craftable:12",
      name: "Keg",
    };
    const catalogWithKeg: Catalog = { items: [...catalogItems, keg] };

    expect(getCatalogSidebarFilters(catalogWithKeg.items, "equipment")).toContainEqual({
      id: "machines",
      label: "Machines",
      count: 1,
    });
    expect(
      getCatalogItemsForPanel(catalogWithKeg, "equipment", "", "machines"),
    ).toEqual([keg]);
    expect(
      getCatalogItemsForPanel(catalogWithKeg, "buildings", "keg", "animal"),
    ).toEqual([keg]);
  });

  it("renders verified resource-clump decor items in the Decor panel", () => {
    const decorPanelMarkup = renderToStaticMarkup(
      createElement(CatalogPanelContent, {
        catalogPresentationChoicesByItemId: new Map(),
        category: "decor",
        catalogItems: [catalogItems[5]],
        catalogPanelLoadState: { kind: "ready", scope: "category", category: "decor", catalog },
        onRetry: () => undefined,
        onCatalogItemSelect: () => undefined,
        selectedCatalogItemId: null,
        viewMode: "grid",
        locale: "en",
      }),
    );

    expect(decorPanelMarkup).toContain("Large Log");
    expect(decorPanelMarkup).not.toContain("Decor items are not shown");
  });

  it("renders current-category loading instead of stale ready content", () => {
    const staleReadyMarkup = renderToStaticMarkup(
      createElement(CatalogPanelContent, {
        catalogPresentationChoicesByItemId: new Map(),
        category: "crops",
        catalogItems: null,
        catalogPanelLoadState: {
          kind: "ready",
          scope: "category",
          category: "buildings",
          catalog,
        },
        onRetry: () => undefined,
        onCatalogItemSelect: () => undefined,
        selectedCatalogItemId: null,
        viewMode: "grid",
        locale: "en",
      }),
    );

    expect(staleReadyMarkup).toContain("Loading items…");
    expect(staleReadyMarkup).not.toContain("Coop");
  });

  it("renders current-category loading instead of a stale prior-category error", () => {
    const staleErrorMarkup = renderToStaticMarkup(
      createElement(CatalogPanelContent, {
        catalogPresentationChoicesByItemId: new Map(),
        category: "equipment",
        catalogItems: null,
        catalogPanelLoadState: {
          kind: "error",
          scope: "category",
          category: "crops",
          message: "Prior crops request failed.",
        },
        onRetry: () => undefined,
        onCatalogItemSelect: () => undefined,
        selectedCatalogItemId: null,
        viewMode: "grid",
        locale: "en",
      }),
    );

    expect(staleErrorMarkup).toContain("Loading items…");
    expect(staleErrorMarkup).not.toContain("Prior crops request failed.");
  });

  it("preserves the local URL and record error when catalog loading fails", async () => {
    const exactLoaderFailure = new Error(
      'Catalog dataset /game-assets/1.6.15/data/Crops.json record "Parsnip" has invalid SpriteIndex -1.',
    );

    await expect(
      loadCatalogPanelState("crops", async () => {
        throw exactLoaderFailure;
      }),
    ).resolves.toEqual({
      kind: "error",
      scope: "category",
      category: "crops",
      message:
        'Unable to load the local item catalog: Catalog dataset /game-assets/1.6.15/data/Crops.json record "Parsnip" has invalid SpriteIndex -1.',
    });
  });

  it("retains the received schema value from a category error cause in the panel message", async () => {
    const schemaFailure = new Error(
      'Catalog dataset URL "/game-assets/1.6.15/data/Crops.json" must contain 50 records; received 0 record IDs [].',
    );
    const categoryFailure = new Error(
      'Catalog category "crops" failed while loading dataset URL "/game-assets/1.6.15/data/Crops.json".',
      { cause: schemaFailure },
    );

    await expect(
      loadCatalogPanelState("crops", async () => {
        throw categoryFailure;
      }),
    ).resolves.toEqual({
      kind: "error",
      scope: "category",
      category: "crops",
      message:
        'Unable to load the local item catalog: Catalog category "crops" failed while loading dataset URL "/game-assets/1.6.15/data/Crops.json". Cause: Catalog dataset URL "/game-assets/1.6.15/data/Crops.json" must contain 50 records; received 0 record IDs [].',
    });
  });

  it("loads the complete catalog through the full-catalog loader", async () => {
    const requestedUrls: string[] = [];
    const fullCatalog = await loadFullCatalogPanelState(async () => {
      requestedUrls.push("/game-assets/1.6.15/data/all.json");
      return catalog;
    });

    expect(fullCatalog).toEqual({ kind: "ready", scope: "all", catalog });
    expect(getReadyCatalogItems(fullCatalog)).toEqual(catalogItems);
    expect(requestedUrls).toEqual(["/game-assets/1.6.15/data/all.json"]);
  });

  it("renders a concrete load error with a retry action", () => {
    const failedCatalogMarkup = renderToStaticMarkup(
      createElement(CatalogPanelContent, {
        catalogPresentationChoicesByItemId: new Map(),
        category: "equipment",
        catalogItems: null,
        catalogPanelLoadState: {
          kind: "error",
          scope: "category",
          category: "equipment",
          message: "Catalog category equipment failed at /data/Equipment.json.",
        },
        onRetry: () => undefined,
        onCatalogItemSelect: () => undefined,
        selectedCatalogItemId: null,
        viewMode: "grid",
        locale: "en",
      }),
    );

    expect(failedCatalogMarkup).toContain(
      "Catalog category equipment failed at /data/Equipment.json.",
    );
    expect(failedCatalogMarkup).toContain(">Retry</button>");
  });

  it("prevents slash-search from stealing text entry, modal, or modified shortcuts", () => {
    const buttonTarget = { tagName: "BUTTON" } as unknown as EventTarget;
    const inputTarget = { tagName: "INPUT" } as unknown as EventTarget;
    const editableTarget = { isContentEditable: true } as unknown as EventTarget;

    expect(
      shouldFocusCatalogSearchForShortcut("/", buttonTarget, buttonTarget, false),
    ).toBe(true);
    expect(
      shouldFocusCatalogSearchForShortcut("/", inputTarget, inputTarget, false),
    ).toBe(false);
    expect(
      shouldFocusCatalogSearchForShortcut("/", editableTarget, editableTarget, false),
    ).toBe(false);
    expect(
      shouldFocusCatalogSearchForShortcut("/", buttonTarget, buttonTarget, true),
    ).toBe(false);
    expect(
      shouldFocusCatalogSearchForShortcut("/", buttonTarget, buttonTarget, false, {
        ctrlKey: true,
      }),
    ).toBe(false);
    expect(
      shouldFocusCatalogSearchForShortcut("/", buttonTarget, buttonTarget, false, {
        metaKey: true,
      }),
    ).toBe(false);
    expect(
      shouldFocusCatalogSearchForShortcut("/", buttonTarget, buttonTarget, false, {
        altKey: true,
      }),
    ).toBe(false);
  });

  it("expands only a collapsed mobile bottom drawer before slash-search focus", () => {
    expect(
      shouldExpandCatalogPanelBeforeSearchFocus("bottom", false, true),
    ).toBe(true);
    expect(
      shouldExpandCatalogPanelBeforeSearchFocus("bottom", true, true),
    ).toBe(false);
    expect(
      shouldExpandCatalogPanelBeforeSearchFocus("bottom", false, false),
    ).toBe(false);
    expect(
      shouldExpandCatalogPanelBeforeSearchFocus("left", false, true),
    ).toBe(false);
  });

  it("renders local texture thumbnails and marks the selected item", () => {
    const catalogGridMarkup = renderToStaticMarkup(
      createElement(CatalogItemGrid, {
        catalogItems: [catalogItems[0]],
        catalogPresentationChoicesByItemId: new Map(),
        selectedCatalogItemId: "building:Coop",
        onCatalogItemSelect: () => undefined,
      }),
    );

    expect(catalogGridMarkup).toContain('aria-pressed="true"');
    expect(catalogGridMarkup).toContain("Coop");
    expect(catalogGridMarkup).toContain("6 × 3");
    expect(catalogGridMarkup).toContain("building-catalog-panel__thumbnail");
    expect(catalogGridMarkup).not.toContain("background-image");
  });

  it("switches only the catalog item grid to list presentation", () => {
    const listMarkup = renderToStaticMarkup(
      createElement(CatalogItemGrid, {
        catalogItems: [catalogItems[0]],
        catalogPresentationChoicesByItemId: new Map(),
        selectedCatalogItemId: null,
        onCatalogItemSelect: () => undefined,
        viewMode: "list",
      }),
    );

    expect(listMarkup).toContain("item-catalog-panel__grid--list");
    expect(listMarkup).toContain("item-catalog-panel__item-name");
    expect(listMarkup).toContain('aria-label="Select Coop, 6 by 3 tiles"');
  });

  it("renders building cards with the reference 80 by 80 canvas thumbnail", () => {
    const catalogGridMarkup = renderToStaticMarkup(
      createElement(CatalogItemGrid, {
        catalogItems: [catalogItems[0]],
        catalogPresentationChoicesByItemId: new Map(),
        selectedCatalogItemId: null,
        onCatalogItemSelect: () => undefined,
      }),
    );

    expect(catalogGridMarkup).toMatch(
      /<canvas[^>]*class="item-catalog-panel__thumbnail building-catalog-panel__thumbnail"[^>]*height="80"[^>]*width="80"/,
    );
    expect(catalogGridMarkup).not.toContain("background-image");
  });

  it("draws the Shipping Bin lid from its resolved startup-atlas frame with the existing destination formula", () => {
    const cursorTexturePath = "/game-assets/1.6.15/sprites/Cursors.png";
    const shippingBinLidSourceFrame = {
      kind: "source-rect" as const,
      x: 134,
      y: 226,
      width: 30,
      height: 25,
    };
    const normalizedShippingBinLidFrame = normalizeBuildingThumbnailSourceFrame(
      "ShippingBinLid",
      shippingBinLidSourceFrame,
    );

    expect(normalizedShippingBinLidFrame).toBe(shippingBinLidSourceFrame);
    if (normalizedShippingBinLidFrame === null) {
      throw new Error("Expected Shipping Bin lid to retain its explicit frame.");
    }

    const resolvedShippingBinLid = resolvePlannerTextureFrame(
      cursorTexturePath,
      normalizedShippingBinLidFrame,
    );
    expect(resolvedShippingBinLid).toEqual({
      resolvedAssetPath: "/planner-textures/initial/Cursors-startup.webp",
      resolvedFrame: { x: 134, y: 226, width: 30, height: 25 },
    });
    if (resolvedShippingBinLid.resolvedFrame === null) {
      throw new Error("Expected Shipping Bin lid resolution to retain a source frame.");
    }

    expect(createBuildingThumbnailLayerDrawCommand({
      drawScale: 2,
      layer: {
        frame: shippingBinLidSourceFrame,
        id: "ShippingBinLid",
        offsetX: 1,
        offsetY: -7,
        textureLocalPath: cursorTexturePath,
      },
      originX: 12,
      originY: 16,
      resolvedAssetPath: resolvedShippingBinLid.resolvedAssetPath,
      resolvedFrame: resolvedShippingBinLid.resolvedFrame,
    })).toEqual({
      destinationHeight: 50,
      destinationWidth: 60,
      destinationX: 14,
      destinationY: 2,
      resolvedAssetPath: "/planner-textures/initial/Cursors-startup.webp",
      sourceFrame: { x: 134, y: 226, width: 30, height: 25 },
    });
  });

  it("loads all 49 default Buildings through the production resolver without a complete Cursor request", async () => {
    const requestedImagePaths: string[] = [];
    const createdImages: HTMLImageElement[] = [];
    const defaultBuildingCatalogItems = await loadDefaultBuildingCatalog();
    const lockedCursorTexturePath = "/game-assets/1.6.15/sprites/Cursors.png";
    const startupCursorAtlasPath = "/planner-textures/initial/Cursors-startup.webp";
    const completeCursorTexturePath = "/planner-textures/initial/Cursors.webp";
    const resolvedDefaultLayersByCatalogItem = defaultBuildingCatalogItems.map(
      (catalogItem) => ({
        catalogItem,
        resolvedLayers: resolveBuildingThumbnailLayers(catalogItem, 0),
      }),
    );
    const cursorThumbnailLayers = resolvedDefaultLayersByCatalogItem.flatMap(
      ({ catalogItem, resolvedLayers }) => resolvedLayers.flatMap(
        ({ layer, resolvedAssetPath, resolvedFrame }) =>
          (layer.textureLocalPath ?? catalogItem.textureLocalPath) === lockedCursorTexturePath
            ? [{
                catalogItemId: catalogItem.id,
                layerId: layer.id,
                resolvedAssetPath,
                resolvedFrame,
              }]
            : [],
      ),
    );
    const allResolvedAssetPaths = resolvedDefaultLayersByCatalogItem.flatMap(
      ({ resolvedLayers }) => resolvedLayers.map(
        ({ resolvedAssetPath }) => resolvedAssetPath,
      ),
    );
    const uniqueResolvedAssetPaths = [...new Set(allResolvedAssetPaths)];

    const loadBuildingThumbnailImages = createBuildingThumbnailImageLoader(
      createSuccessfulBuildingThumbnailImageFactory(
        createdImages,
        requestedImagePaths,
      ),
    );
    const imagesByResolvedAssetPath = await loadBuildingThumbnailImages(
      allResolvedAssetPaths,
    );

    expect(defaultBuildingCatalogItems).toHaveLength(49);
    expect(cursorThumbnailLayers).toEqual([
      {
        catalogItemId: "building:Shipping Bin",
        layerId: "ShippingBinLid",
        resolvedAssetPath: startupCursorAtlasPath,
        resolvedFrame: { x: 134, y: 226, width: 30, height: 25 },
      },
    ]);
    expect(allResolvedAssetPaths.length).toBeGreaterThan(uniqueResolvedAssetPaths.length);
    expect(requestedImagePaths).toEqual(uniqueResolvedAssetPaths);
    expect(createdImages).toHaveLength(uniqueResolvedAssetPaths.length);
    expect([...imagesByResolvedAssetPath.keys()]).toEqual(uniqueResolvedAssetPaths);
    expect(requestedImagePaths.filter((assetPath) =>
      assetPath === startupCursorAtlasPath
    )).toHaveLength(1);
    expect(requestedImagePaths.filter((assetPath) =>
      assetPath === completeCursorTexturePath
    )).toHaveLength(0);
    expect(requestedImagePaths.filter((assetPath) =>
      assetPath === lockedCursorTexturePath
    )).toHaveLength(0);
  });

  it("deduplicates resolved building thumbnail asset paths before creating images", async () => {
    const requestedImagePaths: string[] = [];
    const createdImages: HTMLImageElement[] = [];
    const startupCursorAtlasPath = "/planner-textures/initial/Cursors-startup.webp";

    const loadBuildingThumbnailImages = createBuildingThumbnailImageLoader(
      createSuccessfulBuildingThumbnailImageFactory(
        createdImages,
        requestedImagePaths,
      ),
    );
    const imagesByResolvedAssetPath = await loadBuildingThumbnailImages(
      [startupCursorAtlasPath, startupCursorAtlasPath],
    );

    expect(createdImages).toHaveLength(1);
    expect(requestedImagePaths).toEqual([
      startupCursorAtlasPath,
    ]);
    expect([...imagesByResolvedAssetPath.keys()]).toEqual([startupCursorAtlasPath]);
  });

  it("materializes a valid 0x0 full-texture sentinel from image dimensions", () => {
    expect(materializeBuildingThumbnailFrame(
      "Base",
      null,
      { naturalWidth: 64, naturalHeight: 96 } as HTMLImageElement,
    )).toEqual({ x: 0, y: 0, width: 64, height: 96 });
  });

  it("resolves and materializes the real Shed full-texture layer before creating its draw command", async () => {
    const shedCatalogItem = getRequiredDefaultBuilding(
      await loadDefaultBuildingCatalog(),
      "Shed",
    );
    const [shedBaseLayer] = resolveBuildingThumbnailLayers(shedCatalogItem, 0);
    if (shedBaseLayer === undefined) {
      throw new Error("Expected the default Shed thumbnail Base layer.");
    }

    expect({
      layerId: shedBaseLayer.layer.id,
      resolvedAssetPath: shedBaseLayer.resolvedAssetPath,
      resolvedFrame: shedBaseLayer.resolvedFrame,
    }).toEqual({
      layerId: "Base",
      resolvedAssetPath: "/game-assets/1.6.15/buildings/Shed.png",
      resolvedFrame: null,
    });

    const shedFullTextureFrame = materializeBuildingThumbnailFrame(
      shedBaseLayer.layer.id,
      shedBaseLayer.resolvedFrame,
      { naturalWidth: 112, naturalHeight: 128 } as HTMLImageElement,
    );
    expect(shedFullTextureFrame).toEqual({ x: 0, y: 0, width: 112, height: 128 });
    expect(createBuildingThumbnailLayerDrawCommand({
      drawScale: 0.5,
      layer: shedBaseLayer.layer,
      originX: 4,
      originY: 8,
      resolvedAssetPath: shedBaseLayer.resolvedAssetPath,
      resolvedFrame: shedFullTextureFrame,
    })).toEqual({
      destinationHeight: 64,
      destinationWidth: 56,
      destinationX: 4,
      destinationY: -32,
      resolvedAssetPath: "/game-assets/1.6.15/buildings/Shed.png",
      sourceFrame: { x: 0, y: 0, width: 112, height: 128 },
    });
  });

  it("preserves the real Fish Pond explicit water frame through its draw-command chain", async () => {
    const fishPondCatalogItem = getRequiredDefaultBuilding(
      await loadDefaultBuildingCatalog(),
      "Fish Pond",
    );
    const fishPondWaterLayer = resolveBuildingThumbnailLayers(
      fishPondCatalogItem,
      0,
    ).find(({ layer }) => layer.id === "FishPondWater");
    if (fishPondWaterLayer === undefined) {
      throw new Error("Expected the default Fish Pond water thumbnail layer.");
    }

    expect({
      resolvedAssetPath: fishPondWaterLayer.resolvedAssetPath,
      resolvedFrame: fishPondWaterLayer.resolvedFrame,
    }).toEqual({
      resolvedAssetPath: "/game-assets/1.6.15/buildings/Fish Pond.png",
      resolvedFrame: {
        kind: "source-rect",
        x: 0,
        y: 80,
        width: 80,
        height: 80,
      },
    });

    const fishPondWaterFrame = materializeBuildingThumbnailFrame(
      fishPondWaterLayer.layer.id,
      fishPondWaterLayer.resolvedFrame,
      { naturalWidth: 0, naturalHeight: 0 } as HTMLImageElement,
    );
    expect(createBuildingThumbnailLayerDrawCommand({
      drawScale: 0.5,
      layer: fishPondWaterLayer.layer,
      originX: 4,
      originY: 8,
      resolvedAssetPath: fishPondWaterLayer.resolvedAssetPath,
      resolvedFrame: fishPondWaterFrame,
    })).toEqual({
      destinationHeight: 40,
      destinationWidth: 40,
      destinationX: 4,
      destinationY: 8,
      resolvedAssetPath: "/game-assets/1.6.15/buildings/Fish Pond.png",
      sourceFrame: {
        kind: "source-rect",
        x: 0,
        y: 80,
        width: 80,
        height: 80,
      },
    });
  });

  it("rejects a building thumbnail image error with its resolved asset path", async () => {
    const rejectedAssetPath = "/planner-textures/initial/Cursors-startup.webp";

    const loadBuildingThumbnailImages = createBuildingThumbnailImageLoader(() => {
      const image = { onerror: null, onload: null } as unknown as HTMLImageElement;
      Object.defineProperty(image, "src", {
        configurable: true,
        set(): void {
          const onerror = image.onerror as ((event: Event) => void) | null;
          onerror?.({} as Event);
        },
      });
      return image;
    });

    await expect(loadBuildingThumbnailImages([rejectedAssetPath])).rejects.toThrow(
      `Unable to load building thumbnail asset ${rejectedAssetPath}.`,
    );
  });

  it.each([
    { width: 0, height: 16 },
    { width: 16, height: 0 },
  ])("rejects a single-zero building thumbnail frame $width x $height", (frame) => {
    expect(() => normalizeBuildingThumbnailSourceFrame("Base", {
      kind: "source-rect",
      x: 0,
      y: 0,
      ...frame,
    })).toThrow(new RegExp(
      `Base.*invalid source dimensions.*${String(frame.width)}.*${String(frame.height)}`,
    ));
  });

  it("renders crop cards with the reference 80 by 80 canvas thumbnail", () => {
    const catalogGridMarkup = renderToStaticMarkup(
      createElement(CatalogItemGrid, {
        catalogItems: [catalogItems[1]],
        catalogPresentationChoicesByItemId: new Map(),
        selectedCatalogItemId: null,
        onCatalogItemSelect: () => undefined,
      }),
    );

    expect(catalogGridMarkup).toMatch(
      /<canvas[^>]*class="item-catalog-panel__thumbnail crop-catalog-panel__thumbnail"[^>]*height="80"[^>]*width="80"/,
    );
    expect(catalogGridMarkup).not.toContain("background-image");
  });

  it("renders wallpaper cards with the reference framed two-times preview", () => {
    const catalogGridMarkup = renderToStaticMarkup(
      createElement(CatalogItemGrid, {
        catalogItems: [wallpaperCatalogItem],
        catalogPresentationChoicesByItemId: new Map(),
        selectedCatalogItemId: null,
        shouldLoadThumbnails: true,
        onCatalogItemSelect: () => undefined,
      }),
    );

    expect(catalogGridMarkup).toContain(
      'background-image:url(&quot;/assets/ui/wallpaper-frame.png&quot;)',
    );
    expect(catalogGridMarkup).toContain(
      'background-image:url(&quot;/game-assets/1.6.15/tilesheets/walls_and_floors.png&quot;)',
    );
    expect(catalogGridMarkup).toContain("background-size:64px 64px");
    expect(catalogGridMarkup).toContain("background-size:512px 1376px");
    expect(catalogGridMarkup).toContain("width:32px");
    expect(catalogGridMarkup).toContain("height:56px");
    expect(catalogGridMarkup).toContain("left:16px");
    expect(catalogGridMarkup).toContain("top:4px");
  });

  it("preserves wallpaper thumbnail geometry without asset URLs before interactivity", () => {
    const catalogGridMarkup = renderToStaticMarkup(
      createElement(CatalogItemGrid, {
        catalogItems: [wallpaperCatalogItem],
        catalogPresentationChoicesByItemId: new Map(),
        selectedCatalogItemId: null,
        shouldLoadThumbnails: false,
        onCatalogItemSelect: () => undefined,
      }),
    );

    expect(catalogGridMarkup).not.toContain("background-image");
    expect(catalogGridMarkup).not.toContain("wallpaper-frame.png");
    expect(catalogGridMarkup).not.toContain("walls_and_floors.png");
    expect(catalogGridMarkup).toContain(
      'class="item-catalog-panel__thumbnail interior-decor-catalog-panel__thumbnail"',
    );
    expect(catalogGridMarkup).toContain(
      'class="interior-decor-catalog-panel__preview"',
    );
    expect(catalogGridMarkup).toContain("background-size:64px 64px");
    expect(catalogGridMarkup).toContain("background-size:512px 1376px");
    expect(catalogGridMarkup).toContain("width:32px");
    expect(catalogGridMarkup).toContain("height:56px");
    expect(catalogGridMarkup).toContain("left:16px");
    expect(catalogGridMarkup).toContain("top:4px");
  });

  it("keeps mystic-tree thumbnails on the reference 48x160 terrain sheet", () => {
    const mysticTree: CatalogItem = {
      id: "wildtree_mystic",
      name: "Mystic Tree",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/terrain/mystic_tree.png",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 48, height: 96 },
      allowedTools: ["cursor"],
    };

    expect(getCatalogItemThumbnailStyle(mysticTree, {
      flipped: false,
      rotation: 0,
      variant: 0,
    })).toMatchObject({
      backgroundPosition: "0px 0px",
      backgroundSize: "30px 100px",
      height: 60,
      width: 30,
    });
  });

  it("uses the selected berry frame in the Medium Bush thumbnail", () => {
    const mediumBush = createBushCatalogItems().find(
      (catalogItem) => catalogItem.id === "bush:medium",
    );
    if (mediumBush === undefined) {
      throw new Error("Expected the Medium Bush catalog item.");
    }

    const plainBushThumbnail = getCatalogItemThumbnailStyle(
      mediumBush,
      { flipped: false, rotation: 0, variant: 0 },
    );
    const berryBushThumbnail = getCatalogItemThumbnailStyle(
      mediumBush,
      { flipped: false, rotation: 0, variant: 1 },
    );

    expect(plainBushThumbnail.backgroundPosition).toBe("0px 0px");
    expect(berryBushThumbnail.backgroundPosition).toBe("-40px 0px");
    expect(berryBushThumbnail.backgroundSize).toBe("160px 440px");
  });

  it("does not request catalog thumbnail textures before the workspace is interactive", () => {
    const catalogGridMarkup = renderToStaticMarkup(
      createElement(CatalogItemGrid, {
        catalogItems: [catalogItems[0]],
        catalogPresentationChoicesByItemId: new Map(),
        selectedCatalogItemId: null,
        shouldLoadThumbnails: false,
        onCatalogItemSelect: () => undefined,
      }),
    );

    expect(catalogGridMarkup).not.toContain("background-image");
    expect(catalogGridMarkup).toContain("building-catalog-panel__thumbnail");
  });

  it("keeps each catalog card limited to the item selection button", () => {
    const controlledCatalogItems = createControlledCatalogItems();
    const presentationChoicesByItemId = new Map<string, CatalogPresentationChoice>([
      ["furniture_724", { flipped: false, rotation: 1, variant: 0 }],
      ["object:599", { flipped: false, rotation: 0, variant: 2 }],
      ["fruittree_628", { flipped: true, rotation: 0, variant: 1 }],
    ]);
    const catalogGridMarkup = renderToStaticMarkup(
      createElement(CatalogItemGrid, {
        catalogItems: controlledCatalogItems,
        catalogPresentationChoicesByItemId: presentationChoicesByItemId,
        selectedCatalogItemId: "fruittree_628",
        onCatalogItemSelect: () => undefined,
      }),
    );

    expect(catalogGridMarkup.match(/<button/g)).toHaveLength(controlledCatalogItems.length);
    expect(catalogGridMarkup.match(/aria-label="Select /g)).toHaveLength(4);
    expect(catalogGridMarkup).toContain('title="Coffee Table"');
    expect(catalogGridMarkup).not.toContain("presentation-control");
    expect(catalogGridMarkup).not.toContain("item-controls");
    expect(catalogGridMarkup).not.toContain('data-control="rotation"');
    expect(catalogGridMarkup).not.toContain('data-control="variant"');
    expect(catalogGridMarkup).toContain("background-position:-32px 0px");
    expect(catalogGridMarkup).toContain("transform:scaleX(-1)");
  });

  it("keeps scene-unavailable furniture selectable and groups it after available items", () => {
    const controlledItems = createControlledCatalogItems();
    const sourceFurniture = controlledItems[0];
    if (
      sourceFurniture === undefined ||
      sourceFurniture.renderingMetadata?.kind !== "furniture"
    ) {
      throw new Error("Expected a furniture catalog fixture with scene permissions.");
    }

    const availableFurniture: CatalogItem = {
      ...sourceFurniture,
      id: "furniture_available",
      name: "Available Table",
    };
    const indoorOnlyFurniture: CatalogItem = {
      ...sourceFurniture,
      id: "furniture_indoor_only",
      name: "Indoor Table",
      renderingMetadata: {
        ...sourceFurniture.renderingMetadata,
        outdoors: false,
      },
    };
    for (const viewMode of ["grid", "list"] as const) {
      const catalogGridMarkup = renderToStaticMarkup(
        createElement(CatalogItemGrid, {
          catalogItems: [indoorOnlyFurniture, availableFurniture],
          catalogPresentationChoicesByItemId: new Map(),
          selectedCatalogItemId: null,
          onCatalogItemSelect: () => undefined,
          mapId: "standard",
          isSearch: true,
          viewMode,
        }),
      );

      expect(catalogGridMarkup.indexOf("Available Table")).toBeLessThan(
        catalogGridMarkup.indexOf("Indoor Table"),
      );
      expect(catalogGridMarkup).toContain(
        'aria-level="3" class="item-catalog-panel__unavailable-divider" role="heading"',
      );
      expect(catalogGridMarkup).toContain("1 result can&#x27;t be placed here");
      expect(catalogGridMarkup).toContain('data-scene-availability="indoor-only"');
      expect(catalogGridMarkup).toContain(
        'aria-label="Select Indoor Table, 1 by 1 tiles. This item can only be placed indoors."',
      );
      expect(catalogGridMarkup).toContain(
        'title="Indoor Table. This item can only be placed indoors."',
      );
      expect(catalogGridMarkup).not.toContain('disabled=""');
      expect(catalogGridMarkup.match(/role="listitem"/g)).toHaveLength(2);
    }
  });

  it("labels outdoor-only items on indoor maps in both grid and list modes", () => {
    const sourceFurniture = createControlledCatalogItems()[0];
    if (
      sourceFurniture === undefined ||
      sourceFurniture.renderingMetadata?.kind !== "furniture"
    ) {
      throw new Error("Expected a furniture catalog fixture with scene permissions.");
    }
    const outdoorOnlyFurniture: CatalogItem = {
      ...sourceFurniture,
      id: "furniture_outdoor_only",
      name: "Outdoor Lamp",
      renderingMetadata: {
        ...sourceFurniture.renderingMetadata,
        indoors: false,
      },
    };

    for (const viewMode of ["grid", "list"] as const) {
      const catalogGridMarkup = renderToStaticMarkup(
        createElement(CatalogItemGrid, {
          catalogItems: [outdoorOnlyFurniture],
          catalogPresentationChoicesByItemId: new Map(),
          selectedCatalogItemId: null,
          onCatalogItemSelect: () => undefined,
          mapId: "farmhouse-0",
          viewMode,
        }),
      );

      expect(catalogGridMarkup).toContain('data-scene-availability="outdoor-only"');
      expect(catalogGridMarkup).toContain(
        'aria-label="Select Outdoor Lamp, 1 by 1 tiles. This item can only be placed outdoors."',
      );
      expect(catalogGridMarkup).toContain("1 item can&#x27;t be placed here");
      expect(catalogGridMarkup).not.toContain('disabled=""');
    }
  });

  it("shows base names without normal, fruit, lit, or dry state suffixes", () => {
    const statefulCatalogItems: readonly CatalogItem[] = [
      "Oak Tree (Normal)",
      "Cherry Tree (No Fruit)",
      "Campfire (Lit)",
      "Tilled Dirt (Dry)",
    ].map<CatalogItem>((name, index) => ({
      id: `catalog-item-${String(index)}`,
      name,
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/test.png",
      sprite: { kind: "sprite-index", index: 0 },
      allowedTools: ["cursor"],
    }));
    const catalogGridMarkup = renderToStaticMarkup(
      createElement(CatalogItemGrid, {
        catalogItems: statefulCatalogItems,
        catalogPresentationChoicesByItemId: new Map(),
        selectedCatalogItemId: null,
        onCatalogItemSelect: () => undefined,
      }),
    );

    expect(catalogGridMarkup).toContain("Oak Tree");
    expect(catalogGridMarkup).toContain("Cherry Tree");
    expect(catalogGridMarkup).toContain("Campfire");
    expect(catalogGridMarkup).toContain("Tilled Dirt");
    expect(catalogGridMarkup).not.toContain("(Normal)");
    expect(catalogGridMarkup).not.toContain("(No Fruit)");
    expect(catalogGridMarkup).not.toContain("(Lit)");
    expect(catalogGridMarkup).not.toContain("(Dry)");
  });

  it("keeps Rarecrow and Campfire family numbering while cleaning state suffixes", () => {
    const rarecrowReferenceIds = [
      "big-craftable:110",
      "big-craftable:113",
      "big-craftable:126",
      "big-craftable:136",
      "big-craftable:137",
      "big-craftable:138",
      "big-craftable:139",
      "big-craftable:140",
    ];
    const rarecrowCatalogItems = rarecrowReferenceIds.map<CatalogItem>(
      (id) => ({
        id,
        name: "Rarecrow",
        category: "placeable",
        tileSize: { width: 1, height: 1 },
        textureLocalPath: "/game-assets/test.png",
        sprite: { kind: "sprite-index", index: 0 },
        allowedTools: ["cursor"],
      }),
    );
    const catalogGridMarkup = renderToStaticMarkup(
      createElement(CatalogItemGrid, {
        catalogItems: rarecrowCatalogItems,
        catalogPresentationChoicesByItemId: new Map(),
        selectedCatalogItemId: null,
        onCatalogItemSelect: () => undefined,
      }),
    );

    expect(catalogGridMarkup).toContain("Rarecrow");
    expect(catalogGridMarkup).toContain("Rarecrow 2");
    expect(catalogGridMarkup).toContain("Rarecrow 8");
  });

  it("cleans the lit suffix from Campfire names", () => {
    const campfireCatalogItems: readonly CatalogItem[] = [
      { id: "big-craftable:146", name: "Campfire (Lit)" },
      { id: "big-craftable:278", name: "Campfire (Lit)" },
    ].map<CatalogItem>(({ id, name }) => ({
      id,
      name,
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/test.png",
      sprite: { kind: "sprite-index", index: 0 },
      allowedTools: ["cursor"],
    }));
    const catalogGridMarkup = renderToStaticMarkup(
      createElement(CatalogItemGrid, {
        catalogItems: campfireCatalogItems,
        catalogPresentationChoicesByItemId: new Map(),
        selectedCatalogItemId: null,
        onCatalogItemSelect: () => undefined,
      }),
    );

    expect(catalogGridMarkup).toContain("Campfire");
    expect(catalogGridMarkup).toContain("Campfire 2");
    expect(catalogGridMarkup).not.toContain("(Lit)");
  });

  it("uses the reference base name in Chinese catalog lists", () => {
    const cherrySapling = createControlledCatalogItems()[2];
    if (cherrySapling === undefined) {
      throw new Error("Expected the Cherry Tree catalog fixture.");
    }

    const catalogGridMarkup = renderToStaticMarkup(
      createElement(CatalogItemGrid, {
        catalogItems: [cherrySapling],
        catalogPresentationChoicesByItemId: new Map(),
        selectedCatalogItemId: null,
        onCatalogItemSelect: () => undefined,
        locale: "zh-CN",
      }),
    );

    expect(catalogGridMarkup).toContain("Cherry Tree");
    expect(catalogGridMarkup).not.toContain("Cherry Tree (No Fruit)");
    expect(catalogGridMarkup).toContain('title="Cherry Tree"');
    expect(catalogGridMarkup).not.toContain("无果");
    expect(catalogGridMarkup).not.toContain("presentation-control");
    expect(catalogGridMarkup.match(/<button/g)).toHaveLength(1);
  });

  it("calculates catalog control callbacks without selecting another item", () => {
    const [furnitureItem, genericItem, fruitTreeItem, plainItem] =
      createControlledCatalogItems();
    if (
      furnitureItem === undefined || genericItem === undefined ||
      fruitTreeItem === undefined || plainItem === undefined
    ) {
      throw new Error("Expected four controlled catalog item fixtures.");
    }

    expect(getNextCatalogItemControlChoice(
      furnitureItem,
      { flipped: false, rotation: 1, variant: 0 },
      "rotation",
    )).toEqual({ flipped: false, rotation: 0, variant: 0 });
    expect(getNextCatalogItemControlChoice(
      genericItem,
      { flipped: false, rotation: 0, variant: 2 },
      "variant",
    )).toEqual({ flipped: false, rotation: 0, variant: 0 });
    expect(getNextCatalogItemControlChoice(
      fruitTreeItem,
      { flipped: false, rotation: 0, variant: 1 },
      "flip",
    )).toEqual({ flipped: true, rotation: 0, variant: 1 });
    expect(() => getNextCatalogItemControlChoice(
      plainItem,
      { flipped: false, rotation: 0, variant: 0 },
      "rotation",
    )).toThrow(/object:390.*rotation/s);
  });
});

function createControlledCatalogItems(): readonly CatalogItem[] {
  const createPlaceableCatalogItem = (
    id: string,
    name: string,
    presentationCapabilities?: CatalogItem["presentationCapabilities"],
    renderingMetadata?: CatalogItem["renderingMetadata"],
  ): CatalogItem => ({
    allowedTools: ["cursor"],
    category: "placeable",
    id,
    name,
    presentationCapabilities,
    renderingMetadata,
    sprite: { kind: "sprite-index", index: 0 },
    textureLocalPath: "/game-assets/test.png",
    tileSize: { width: 1, height: 1 },
  });

  return [
    createPlaceableCatalogItem(
      "furniture_724",
      "Coffee Table",
      {
        canFlip: false,
        rotation: {
          count: 2,
          footprints: [
            { width: 2, height: 1 },
            { width: 1, height: 2 },
          ],
        },
        variantCycle: null,
        visibleVariants: [],
      },
      {
        bedType: null,
        compositeSprite: null,
        furnitureType: "table",
        indoors: true,
        isLongTable: false,
        isRug: false,
        isTable: true,
        kind: "furniture",
        outdoors: true,
        rotationSprites: [
          {
            sprite: { kind: "source-rect", x: 0, y: 0, width: 32, height: 16 },
          },
          {
            sprite: { kind: "source-rect", x: 32, y: 0, width: 16, height: 32 },
          },
        ],
        rotationTileSizes: [
          { width: 2, height: 1 },
          { width: 1, height: 2 },
        ],
        wallMounted: false,
      },
    ),
    createPlaceableCatalogItem("object:599", "Sprinkler", {
      canFlip: false,
      rotation: null,
      variantCycle: { count: 3, family: "generic" },
      visibleVariants: [
        createVisibleVariant(0, "Base"),
        createVisibleVariant(1, "Pressure"),
        createVisibleVariant(2, "Enricher"),
      ],
    }),
    createPlaceableCatalogItem("fruittree_628", "Cherry Sapling", {
      canFlip: true,
      rotation: null,
      variantCycle: { count: 2, family: "tree" },
      visibleVariants: [
        createVisibleVariant(0, "No Fruit"),
        createVisibleVariant(1, "Fruit"),
      ],
    }),
    createPlaceableCatalogItem("object:390", "Stone"),
  ];
}

function createVisibleVariant(value: number, label: string) {
  return {
    label,
    renderDescriptor: { kind: "variant-index" as const, variant: value },
    value,
  };
}

function createSuccessfulBuildingThumbnailImageFactory(
  createdImages: HTMLImageElement[],
  requestedImagePaths: string[],
): () => HTMLImageElement {
  return () => {
    const image = {
      naturalHeight: 64,
      naturalWidth: 64,
      onerror: null,
      onload: null,
    } as unknown as HTMLImageElement;
    Object.defineProperty(image, "src", {
      configurable: true,
      set(requestedImagePath: string): void {
        requestedImagePaths.push(requestedImagePath);
        const onload = image.onload as ((event: Event) => void) | null;
        onload?.({} as Event);
      },
    });
    createdImages.push(image);
    return image;
  };
}

async function loadDefaultBuildingCatalog(): Promise<readonly CatalogItem[]> {
  const rawBuildings = JSON.parse(await readFile(
    path.join(process.cwd(), "public/game-assets/1.6.15/data/Buildings.json"),
    "utf8",
  )) as unknown;

  return createBuildingCatalogFromDataset(
    rawBuildings,
    catalogDatasetUrls.buildings,
  ).items;
}

function getRequiredDefaultBuilding(
  catalogItems: readonly CatalogItem[],
  buildingId: string,
): CatalogItem {
  const catalogItem = catalogItems.find((item) => item.id === `building:${buildingId}`);
  if (catalogItem === undefined) {
    throw new Error(`Expected default building ${JSON.stringify(buildingId)}.`);
  }
  return catalogItem;
}
