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
    id: "crop:Parsnip",
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
        onCatalogItemPresentationChoiceChange: () => undefined,
        onCatalogItemSelect: () => undefined,
        onCategoryChange: () => undefined,
        onSearchQueryChange: () => undefined,
      }),
    );

    expect(catalogPanelMarkup).toContain('placeholder="Search all items"');
  });

  it("preserves catalog roles, tab relations, visual classes, and controlled search value", () => {
    const catalogPanelMarkup = renderToStaticMarkup(
      createElement(ItemCatalogPanel, {
        catalogPresentationChoicesByItemId: new Map(),
        category: "crops",
        panelPosition: "left",
        searchQuery: "parsnip",
        selectedCatalogItemId: null,
        onCatalogItemPresentationChoiceChange: () => undefined,
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
        onCatalogItemPresentationChoiceChange: () => undefined,
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
        onCatalogItemPresentationChoiceChange: () => undefined,
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
        onCatalogItemPresentationChoiceChange: () => undefined,
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
        onCatalogItemPresentationChoiceChange: () => undefined,
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
        onCatalogItemPresentationChoiceChange: () => undefined,
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
        onCatalogItemPresentationChoiceChange: () => undefined,
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
        onCatalogItemPresentationChoiceChange: () => undefined,
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
        onCatalogItemPresentationChoiceChange: () => undefined,
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
        onCatalogItemPresentationChoiceChange: () => undefined,
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
        onCatalogItemPresentationChoiceChange: () => undefined,
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

  it("does not request catalog thumbnail textures before the workspace is interactive", () => {
    const catalogGridMarkup = renderToStaticMarkup(
      createElement(CatalogItemGrid, {
        catalogItems: [catalogItems[0]],
        catalogPresentationChoicesByItemId: new Map(),
        selectedCatalogItemId: null,
        shouldLoadThumbnails: false,
        onCatalogItemPresentationChoiceChange: () => undefined,
        onCatalogItemSelect: () => undefined,
      }),
    );

    expect(catalogGridMarkup).not.toContain("background-image");
    expect(catalogGridMarkup).toContain("building-catalog-panel__thumbnail");
  });

  it("renders capability controls as siblings with controlled aria state", () => {
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
        onCatalogItemPresentationChoiceChange: () => undefined,
        onCatalogItemSelect: () => undefined,
      }),
    );

    expect(catalogGridMarkup).toContain('aria-label="Rotate"');
    expect(catalogGridMarkup).toContain('title="Rotate"');
    expect(catalogGridMarkup).toContain(
      'class="rotate-btn item-catalog-panel__rotation-control item-catalog-panel__presentation-control"',
    );
    expect(catalogGridMarkup).toContain(">Enricher</span>");
    expect(catalogGridMarkup).toContain('aria-label="Cycle Sprinkler variant, current Enricher"');
    expect(catalogGridMarkup).toContain('title="Cycle Sprinkler variant, current Enricher"');
    expect(catalogGridMarkup).toMatch(
      /aria-label="Unflip" aria-pressed="true"[^>]*title="Unflip"/,
    );
    expect(catalogGridMarkup).toMatch(/<svg[^>]*aria-hidden="true"/);
    expect(catalogGridMarkup.match(/<div class="item-catalog-panel__item-controls">/g)).toHaveLength(3);
    expect(catalogGridMarkup).toContain(
      "</button><div class=\"item-catalog-panel__item-controls\">",
    );
    expect(catalogGridMarkup).not.toMatch(
      /<button[^>]*>(?:(?!<\/button>).)*<button/s,
    );
    expect(catalogGridMarkup.match(/aria-label="Select /g)).toHaveLength(4);
    expect(catalogGridMarkup).toContain("background-position:-32px 0px");
    expect(catalogGridMarkup).toContain("transform:scaleX(-1)");
  });

  it("localizes known tree variants while keeping variant text in the grouped controls", () => {
    const cherrySapling = createControlledCatalogItems()[2];
    if (cherrySapling === undefined) {
      throw new Error("Expected the Cherry Sapling catalog fixture.");
    }

    const catalogGridMarkup = renderToStaticMarkup(
      createElement(CatalogItemGrid, {
        catalogItems: [cherrySapling],
        catalogPresentationChoicesByItemId: new Map(),
        selectedCatalogItemId: null,
        onCatalogItemPresentationChoiceChange: () => undefined,
        onCatalogItemSelect: () => undefined,
        locale: "zh-CN",
      }),
    );

    expect(catalogGridMarkup).toContain(">无果</span>");
    expect(catalogGridMarkup).toContain('aria-label="切换Cherry Sapling外观，当前为无果"');
    expect(catalogGridMarkup).toContain('title="切换Cherry Sapling外观，当前为无果"');
    expect(catalogGridMarkup).toContain(
      'class="item-catalog-panel__variant-control item-catalog-panel__presentation-control"',
    );
    expect(catalogGridMarkup).toMatch(/<svg[^>]*aria-hidden="true"/);
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
