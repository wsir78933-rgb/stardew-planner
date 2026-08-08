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
  loadBuildingThumbnailImages,
  loadCatalogPanelState,
  materializeBuildingThumbnailFrame,
  normalizeBuildingThumbnailSourceFrame,
  resolveBuildingThumbnailLayers,
} from "../../src/components/item-catalog-panel";
import {
  catalogDatasetUrls,
  createBuildingCatalogFromDataset,
  createSeasonalPlaceableCatalogProperties,
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

    expect(catalogPanelMarkup).toContain('placeholder="Search..."');
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
    expect(catalogPanelMarkup).toContain(
      'class="panel-tabs item-catalog-panel__categories" role="tablist"',
    );
    expect(catalogPanelMarkup.match(/role="tab"/g)).toHaveLength(4);
    expect(catalogPanelMarkup).toContain('aria-selected="true"');
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
  });

  it("preserves Home, End, ArrowLeft, and ArrowRight category navigation", () => {
    expect(getNextCatalogCategory("placeables", "Home")).toBe("buildings");
    expect(getNextCatalogCategory("crops", "End")).toBe("decor");
    expect(getNextCatalogCategory("buildings", "ArrowLeft")).toBe("decor");
    expect(getNextCatalogCategory("decor", "ArrowRight")).toBe("buildings");
    expect(getNextCatalogCategory("crops", "Enter")).toBeNull();
  });

  it("loads only the active category through a fake local category loader", async () => {
    const requestedUrls: string[] = [];
    const fakeLocalCategoryLoader = async (category: string): Promise<Catalog> => {
      requestedUrls.push(`/game-assets/1.6.15/data/${category}.json`);
      return catalog;
    };

    await expect(loadCatalogPanelState("crops", fakeLocalCategoryLoader)).resolves.toEqual({
      kind: "ready",
      category: "crops",
      catalog,
    });
    expect(requestedUrls).toEqual(["/game-assets/1.6.15/data/crops.json"]);
  });

  it("exposes every already loaded category item for the workspace Canvas without another request", () => {
    expect(
      getReadyCatalogItems({ kind: "ready", category: "placeables", catalog }),
    ).toEqual(catalogItems);
    expect(
      getReadyCatalogItems({ kind: "loading", category: "placeables" }),
    ).toBeNull();
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
        catalogPresentationChoicesByItemId: new Map(),
        category: "decor",
        catalogPanelLoadState: { kind: "ready", category: "decor", catalog },
        onCatalogItemPresentationChoiceChange: () => undefined,
        onCatalogItemSelect: () => undefined,
        searchQuery: "",
        selectedCatalogItemId: null,
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
        catalogPanelLoadState: {
          kind: "ready",
          category: "buildings",
          catalog,
        },
        onCatalogItemPresentationChoiceChange: () => undefined,
        onCatalogItemSelect: () => undefined,
        searchQuery: "",
        selectedCatalogItemId: null,
      }),
    );

    expect(staleReadyMarkup).toContain("Loading local catalog…");
    expect(staleReadyMarkup).not.toContain("Coop");
  });

  it("renders current-category loading instead of a stale prior-category error", () => {
    const staleErrorMarkup = renderToStaticMarkup(
      createElement(CatalogPanelContent, {
        catalogPresentationChoicesByItemId: new Map(),
        category: "placeables",
        catalogPanelLoadState: {
          kind: "error",
          category: "crops",
          message: "Prior crops request failed.",
        },
        onCatalogItemPresentationChoiceChange: () => undefined,
        onCatalogItemSelect: () => undefined,
        searchQuery: "",
        selectedCatalogItemId: null,
      }),
    );

    expect(staleErrorMarkup).toContain("Loading local catalog…");
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
      category: "crops",
      message:
        'Unable to load the local item catalog: Catalog category "crops" failed while loading dataset URL "/game-assets/1.6.15/data/Crops.json". Cause: Catalog dataset URL "/game-assets/1.6.15/data/Crops.json" must contain 50 records; received 0 record IDs [].',
    });
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

    const imagesByResolvedAssetPath = await loadBuildingThumbnailImages(
      allResolvedAssetPaths,
      createSuccessfulBuildingThumbnailImageFactory(
        createdImages,
        requestedImagePaths,
      ),
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

    const imagesByResolvedAssetPath = await loadBuildingThumbnailImages(
      [startupCursorAtlasPath, startupCursorAtlasPath],
      createSuccessfulBuildingThumbnailImageFactory(
        createdImages,
        requestedImagePaths,
      ),
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

    await expect(loadBuildingThumbnailImages([rejectedAssetPath], () => {
      const image = { onerror: null, onload: null } as unknown as HTMLImageElement;
      Object.defineProperty(image, "src", {
        configurable: true,
        set(): void {
          const onerror = image.onerror as ((event: Event) => void) | null;
          onerror?.({} as Event);
        },
      });
      return image;
    })).rejects.toThrow(`Unable to load building thumbnail asset ${rejectedAssetPath}.`);
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

    expect(catalogGridMarkup).toContain(">Rotate</button>");
    expect(catalogGridMarkup).toContain(">Enricher</button>");
    expect(catalogGridMarkup).toContain('aria-label="Cycle Sprinkler variant, current Enricher"');
    expect(catalogGridMarkup).toMatch(
      /aria-pressed="true"[^>]*>Unflip<\/button>/,
    );
    expect(catalogGridMarkup).not.toMatch(
      /<button[^>]*>(?:(?!<\/button>).)*<button/s,
    );
    expect(catalogGridMarkup.match(/aria-label="Select /g)).toHaveLength(4);
    expect(catalogGridMarkup).toContain("background-position:-32px 0px");
    expect(catalogGridMarkup).toContain("transform:scaleX(-1)");
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
