"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type RefObject,
} from "react";
import {
  createDefaultCatalogItemPresentationChoice,
  getBuildingThumbnailCompositionLayers,
  getCropRenderingMetadata,
  getSeasonalPlaceableFrame,
  getNextPendingCatalogPresentationChoice,
  getNextSelectedCatalogPresentationChoice,
  loadCatalogCategory,
  validateCatalogItemPresentationChoice,
  type Catalog,
  type CatalogBuildingMultilayerLayer,
  type CatalogItem,
  type CatalogPresentationChoice,
} from "../catalog";
import {
  editorCatalogCategories,
  type EditorCatalogCategory,
  type EditorModalId,
  type EditorPanelPosition,
} from "../editor/editor-view-state";
import { referencePlaceableCatalogNames } from "../catalog/reference-placeable-order";
import {
  resolvePlannerTextureFrame,
  type PlannerTextureFrame,
} from "../rendering/planner-texture-frame-resolution";
import { Filter, Info, Search } from "lucide-react";
import {
  loadBuildingThumbnailImages,
  useBuildingThumbnailLoadEligibility,
} from "./building-thumbnail-visibility";

type ItemCatalogPanelProperties = Readonly<{
  catalogPresentationChoicesByItemId: ReadonlyMap<
    string,
    CatalogPresentationChoice
  >;
  category: EditorCatalogCategory;
  leftHandMode?: boolean;
  panelPosition: EditorPanelPosition;
  searchQuery: string;
  selectedCatalogItemId: string | null;
  onCatalogItemPresentationChoiceChange: (
    catalogItem: CatalogItem,
    presentationChoice: CatalogPresentationChoice,
  ) => void;
  onCatalogItemSelect: (
    catalogItem: CatalogItem,
    presentationChoice: CatalogPresentationChoice,
  ) => void;
  onCategoryChange: (category: EditorCatalogCategory) => void;
  onOpenModal?: (modalId: EditorModalId) => void;
  onReadyCatalogItems?: (catalogItems: readonly CatalogItem[]) => void;
  onSearchQueryChange: (searchQuery: string) => void;
  shouldLoadThumbnails?: boolean;
}>;

type CatalogPanelLoadState =
  | Readonly<{ kind: "loading"; category: EditorCatalogCategory }>
  | Readonly<{
      kind: "ready";
      category: EditorCatalogCategory;
      catalog: Catalog;
    }>
  | Readonly<{
      kind: "error";
      category: EditorCatalogCategory;
      message: string;
    }>;

type CatalogPanelLoader = (category: EditorCatalogCategory) => Promise<Catalog>;

type CatalogItemGridProperties = Readonly<{
  catalogItems: readonly CatalogItem[];
  catalogPresentationChoicesByItemId: ReadonlyMap<
    string,
    CatalogPresentationChoice
  >;
  selectedCatalogItemId: string | null;
  onCatalogItemPresentationChoiceChange: (
    catalogItem: CatalogItem,
    presentationChoice: CatalogPresentationChoice,
  ) => void;
  onCatalogItemSelect: (
    catalogItem: CatalogItem,
    presentationChoice: CatalogPresentationChoice,
  ) => void;
  shouldLoadThumbnails?: boolean;
}>;

export type CatalogItemControl = "flip" | "rotation" | "variant";

const catalogCategoryLabels: Readonly<Record<EditorCatalogCategory, string>> = {
  buildings: "Buildings",
  crops: "Crops",
  placeables: "Placeables",
  decor: "Decor",
};

const catalogItemCategoriesByPanelCategory: Readonly<
  Record<EditorCatalogCategory, readonly CatalogItem["category"][]>
> = {
  buildings: ["building"],
  crops: ["crop"],
  placeables: ["placeable", "floor", "fence"],
  decor: ["decor"],
};

export function ItemCatalogPanel({
  catalogPresentationChoicesByItemId,
  category,
  leftHandMode = false,
  panelPosition,
  searchQuery,
  selectedCatalogItemId,
  onCatalogItemPresentationChoiceChange,
  onCatalogItemSelect,
  onCategoryChange,
  onOpenModal,
  onReadyCatalogItems,
  onSearchQueryChange,
  shouldLoadThumbnails = true,
}: ItemCatalogPanelProperties) {
  const [catalogPanelLoadState, setCatalogPanelLoadState] =
    useState<CatalogPanelLoadState>({ kind: "loading", category });
  const catalogId = useId();
  const catalogPanelId = `${catalogId}-panel`;
  const catalogTabElementReferences = useRef<
    Record<EditorCatalogCategory, HTMLButtonElement | null>
  >({
    buildings: null,
    crops: null,
    placeables: null,
    decor: null,
  });

  useEffect(() => {
    let hasUnmounted = false;

    setCatalogPanelLoadState({ kind: "loading", category });

    void loadCatalogPanelState(category).then((nextCatalogPanelLoadState) => {
      if (!hasUnmounted) {
        setCatalogPanelLoadState(nextCatalogPanelLoadState);
        const readyCatalogItems = getReadyCatalogItems(nextCatalogPanelLoadState);
        if (readyCatalogItems !== null) {
          onReadyCatalogItems?.(readyCatalogItems);
        }
      }
    });

    return () => {
      hasUnmounted = true;
    };
  }, [category, onReadyCatalogItems]);

  function handleCategoryKeyDown(
    keyboardEvent: KeyboardEvent<HTMLButtonElement>,
    currentCategory: EditorCatalogCategory,
  ): void {
    const nextCategory = getNextCatalogCategory(
      currentCategory,
      keyboardEvent.key,
    );

    if (nextCategory === null) {
      return;
    }

    keyboardEvent.preventDefault();
    onCategoryChange(nextCategory);

    const nextCategoryTabElement =
      catalogTabElementReferences.current[nextCategory];

    if (nextCategoryTabElement === null) {
      throw new Error(
        `Catalog tab element is unavailable for category ${JSON.stringify(nextCategory)}.`,
      );
    }

    nextCategoryTabElement.focus();
  }

  return (
    <aside
      aria-label="Item catalog"
      className={`bottom-wrapper item-catalog-panel item-catalog-panel--${panelPosition}${
        panelPosition === "left" ? " left-mode" : ""
      }${leftHandMode ? " left-hand" : ""}`}
    >
      <div className="bottom-panel">
        <div className="panel-branding">
          <div className="branding-actions">
            {onOpenModal !== undefined ? (
              <button
                className="branding-btn"
                onClick={() => onOpenModal("help-info")}
                type="button"
              >
                Help
              </button>
            ) : null}
          </div>
        </div>
        <div className="panel-tabs item-catalog-panel__categories" role="tablist">
          {editorCatalogCategories.map((catalogCategory) => (
            <button
              aria-controls={catalogPanelId}
              aria-selected={category === catalogCategory}
              className={`tab-icon item-catalog-panel__category${
                category === catalogCategory ? " active" : ""
              }`}
              id={`${catalogId}-tab-${catalogCategory}`}
              key={catalogCategory}
              onClick={() => onCategoryChange(catalogCategory)}
              onKeyDown={(keyboardEvent) =>
                handleCategoryKeyDown(keyboardEvent, catalogCategory)
              }
              ref={(catalogTabElement) => {
                catalogTabElementReferences.current[catalogCategory] =
                  catalogTabElement;
              }}
              role="tab"
              tabIndex={category === catalogCategory ? 0 : -1}
              type="button"
            >
              <CatalogCategoryIcon category={catalogCategory} />
              <span className="tab-label">{catalogCategoryLabels[catalogCategory]}</span>
            </button>
          ))}
        </div>
        <div className="panel-content item-catalog-panel__content">
          <div className="sidebar-search">
            <div className="search-container item-catalog-panel__search-label">
              <span className="sr-only">Search catalog</span>
              <button
                aria-label="Search catalog"
                className="search-toggle"
                title="Search"
                type="button"
              >
                <Search aria-hidden="true" size={20} strokeWidth={2} />
              </button>
              <span className="search-wrapper">
                <input
                  className="search-input item-catalog-panel__search"
                  onChange={(changeEvent: ChangeEvent<HTMLInputElement>) =>
                    onSearchQueryChange(changeEvent.target.value)
                  }
                  placeholder="Search..."
                  type="search"
                  value={searchQuery}
                />
              </span>
              <button
                aria-label="Filter catalog"
                className="filter-btn"
                title="Filter"
                type="button"
              >
                <Filter aria-hidden="true" size={20} strokeWidth={2} />
              </button>
              <div className="help-bubble-wrapper">
                <button
                  aria-label="Help & Info"
                  className="filter-btn"
                  onClick={() => onOpenModal?.("help-info")}
                  title="Help & Info"
                  type="button"
                >
                  <Info aria-hidden="true" size={20} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
          <div
            aria-labelledby={`${catalogId}-tab-${category}`}
            id={catalogPanelId}
            role="tabpanel"
          >
            <CatalogPanelContent
              catalogPresentationChoicesByItemId={catalogPresentationChoicesByItemId}
              category={category}
              catalogPanelLoadState={catalogPanelLoadState}
              onCatalogItemPresentationChoiceChange={onCatalogItemPresentationChoiceChange}
              onCatalogItemSelect={onCatalogItemSelect}
              searchQuery={searchQuery}
              selectedCatalogItemId={selectedCatalogItemId}
              shouldLoadThumbnails={shouldLoadThumbnails}
            />
          </div>
          <KeybindFooter onOpenModal={onOpenModal} />
        </div>
      </div>
    </aside>
  );
}

function KeybindFooter({
  onOpenModal,
}: Readonly<{ onOpenModal?: (modalId: EditorModalId) => void }>) {
  const keybinds = [
    ["V", "cursor"],
    ["E", "erase"],
    ["F", "fill"],
    ["Q", "rotate"],
    ["Del", "delete"],
    ["⌘Z", "undo"],
    ["⌘Y", "redo"],
    ["WASD", "pan"],
    ["R", "T", "zoom"],
    ["⌘", "x-ray"],
    ["RMB", "deselect"],
  ] as const;

  return (
    <div className="keybind-footer">
      <span className="keybind-title">
        Keybinds
        <button
          className="keybind-more"
          onClick={() => onOpenModal?.("keyboard-shortcuts")}
          type="button"
        >
          (Learn More)
        </button>
      </span>
      {keybinds.map((keybind) => (
        <span className="keybind" key={keybind.join("-")}>
          {keybind.slice(0, -1).map((key) => (
            <kbd key={key}>{key}</kbd>
          ))}
          {keybind.at(-1)}
        </span>
      ))}
    </div>
  );
}

function CatalogCategoryIcon({
  category,
}: Readonly<{
  category: EditorCatalogCategory;
}>) {
  if (category === "crops") {
    return <span aria-hidden="true" className="tab-sprite crops-sprite" />;
  }

  const assetPathByCategory: Readonly<
    Record<Exclude<EditorCatalogCategory, "crops">, string>
  > = {
    buildings: "/assets/ui/tabs/buildings.png",
    placeables: "/assets/ui/tabs/package.png",
    decor: "/assets/ui/tabs/couch_and_lamp.png",
  };

  return (
    <img
      alt=""
      aria-hidden="true"
      className="tab-img"
      src={assetPathByCategory[category]}
    />
  );
}

type CatalogPanelContentProperties = Readonly<{
  catalogPresentationChoicesByItemId: ReadonlyMap<
    string,
    CatalogPresentationChoice
  >;
  category: EditorCatalogCategory;
  catalogPanelLoadState: CatalogPanelLoadState;
  searchQuery: string;
  selectedCatalogItemId: string | null;
  onCatalogItemPresentationChoiceChange: (
    catalogItem: CatalogItem,
    presentationChoice: CatalogPresentationChoice,
  ) => void;
  onCatalogItemSelect: (
    catalogItem: CatalogItem,
    presentationChoice: CatalogPresentationChoice,
  ) => void;
  shouldLoadThumbnails?: boolean;
}>;

export function CatalogPanelContent({
  catalogPresentationChoicesByItemId,
  category,
  catalogPanelLoadState,
  searchQuery,
  selectedCatalogItemId,
  onCatalogItemPresentationChoiceChange,
  onCatalogItemSelect,
  shouldLoadThumbnails = true,
}: CatalogPanelContentProperties) {
  if (
    catalogPanelLoadState.kind === "loading" ||
    catalogPanelLoadState.category !== category
  ) {
    return (
      <p aria-live="polite" className="item-catalog-panel__state" role="status">
        Loading local catalog…
      </p>
    );
  }

  if (catalogPanelLoadState.kind === "error") {
    return (
      <p className="item-catalog-panel__error" role="alert">
        {catalogPanelLoadState.message}
      </p>
    );
  }

  const visibleCatalogItems = getCatalogItemsForPanel(
    catalogPanelLoadState.catalog,
    category,
    searchQuery,
  );

  if (visibleCatalogItems.length === 0) {
    return (
      <p className="item-catalog-panel__state">
        No verified {catalogCategoryLabels[category].toLowerCase()} items match
        {" "}
        {JSON.stringify(searchQuery)}.
      </p>
    );
  }

  return (
    <CatalogItemGrid
      catalogItems={visibleCatalogItems}
      catalogPresentationChoicesByItemId={catalogPresentationChoicesByItemId}
      onCatalogItemPresentationChoiceChange={onCatalogItemPresentationChoiceChange}
      onCatalogItemSelect={onCatalogItemSelect}
      selectedCatalogItemId={selectedCatalogItemId}
      shouldLoadThumbnails={shouldLoadThumbnails}
    />
  );
}

export function CatalogItemGrid({
  catalogItems,
  catalogPresentationChoicesByItemId,
  selectedCatalogItemId,
  onCatalogItemPresentationChoiceChange,
  onCatalogItemSelect,
  shouldLoadThumbnails = true,
}: CatalogItemGridProperties) {
  const itemGridScrollRootReference = useRef<HTMLDivElement>(null);

  return (
    <div
      aria-label="Verified catalog items"
      className="item-grid item-catalog-panel__grid"
      ref={itemGridScrollRootReference}
    >
      {catalogItems.map((catalogItem, catalogItemIndex) => {
        const isSelectedCatalogItem = catalogItem.id === selectedCatalogItemId;
        const presentationChoice = getControlledCatalogItemChoice(
          catalogItem,
          catalogPresentationChoicesByItemId,
        );
        const displayName = getCatalogItemDisplayName(
          catalogItem,
          catalogItems,
          catalogItemIndex,
          presentationChoice,
        );
        const presentationCapabilities = catalogItem.presentationCapabilities;
        const showsRotationControl =
          (presentationCapabilities?.rotation?.count ?? 0) > 1;
        const visibleVariantLabel =
          (presentationCapabilities?.visibleVariants.length ?? 0) > 1
            ? getVisibleVariantLabel(catalogItem, presentationChoice)
            : null;

        return (
          <div className="item-catalog-panel__item-container" key={catalogItem.id}>
            <button
              aria-label={`Select ${displayName}, ${String(catalogItem.tileSize.width)} by ${String(catalogItem.tileSize.height)} tiles`}
              aria-pressed={isSelectedCatalogItem}
              className={`icon-cell item-catalog-panel__item${
                isSelectedCatalogItem ? " selected" : ""
              }`}
              data-selected={isSelectedCatalogItem}
              onClick={() => onCatalogItemSelect(catalogItem, presentationChoice)}
              type="button"
            >
              {catalogItem.category === "building" ? (
                <BuildingCatalogThumbnail
                  catalogItem={catalogItem}
                  itemGridScrollRootReference={itemGridScrollRootReference}
                  presentationChoice={presentationChoice}
                  shouldLoadThumbnail={shouldLoadThumbnails}
                />
              ) : catalogItem.category === "crop" ? (
                <CropCatalogThumbnail
                  catalogItem={catalogItem}
                  shouldLoadThumbnail={shouldLoadThumbnails}
                />
              ) : catalogItem.interiorDecorKind !== undefined ? (
                <InteriorDecorCatalogThumbnail
                  catalogItem={catalogItem}
                  shouldLoadThumbnail={shouldLoadThumbnails}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="item-catalog-panel__thumbnail"
                  style={getCatalogItemThumbnailStyle(
                    catalogItem,
                    presentationChoice,
                    shouldLoadThumbnails,
                  )}
                />
              )}
              <span className="sr-only">
                {displayName}, {catalogItem.tileSize.width} × {catalogItem.tileSize.height}
              </span>
            </button>
            {showsRotationControl ? (
              <CatalogItemChoiceButton
                catalogItem={catalogItem}
                control="rotation"
                label="Rotate"
                onCatalogItemPresentationChoiceChange={onCatalogItemPresentationChoiceChange}
                presentationChoice={presentationChoice}
              />
            ) : null}
            {visibleVariantLabel !== null ? (
              <CatalogItemChoiceButton
                ariaLabel={`Cycle ${displayName} variant, current ${visibleVariantLabel}`}
                catalogItem={catalogItem}
                control="variant"
                label={visibleVariantLabel}
                onCatalogItemPresentationChoiceChange={onCatalogItemPresentationChoiceChange}
                presentationChoice={presentationChoice}
              />
            ) : null}
            {presentationCapabilities?.canFlip === true ? (
              <CatalogItemChoiceButton
                ariaPressed={presentationChoice.flipped}
                catalogItem={catalogItem}
                control="flip"
                label={presentationChoice.flipped ? "Unflip" : "Flip"}
                onCatalogItemPresentationChoiceChange={onCatalogItemPresentationChoiceChange}
                presentationChoice={presentationChoice}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function getCatalogItemDisplayName(
  catalogItem: CatalogItem,
  catalogItems: readonly CatalogItem[],
  catalogItemIndex: number,
  presentationChoice: CatalogPresentationChoice,
): string {
  const familyName = getReferencePlaceableFamilyName(catalogItem.name);
  const occurrence = familyName === undefined
    ? 1
    : catalogItems
      .slice(0, catalogItemIndex + 1)
      .filter((candidate) => candidate.name === familyName)
      .length;
  const numberedName = occurrence > 1
    ? `${catalogItem.name} ${String(occurrence)}`
    : catalogItem.name;
  const visibleVariant = getCatalogDisplayVariantLabel(
    catalogItem,
    presentationChoice,
  );

  return visibleVariant === null
    ? numberedName
    : `${numberedName} (${visibleVariant})`;
}

function getCatalogDisplayVariantLabel(
  catalogItem: CatalogItem,
  presentationChoice: CatalogPresentationChoice,
): string | null {
  const visibleVariant = catalogItem.presentationCapabilities?.visibleVariants.find(
    (candidateVariant) => candidateVariant.value === presentationChoice.variant,
  );
  if (
    visibleVariant === undefined ||
    !["Dry", "Normal", "No Fruit", "Lit", "Unlit"].includes(visibleVariant.label)
  ) {
    return null;
  }
  return visibleVariant.label;
}

type BuildingCatalogThumbnailProperties = Readonly<{
  catalogItem: CatalogItem;
  itemGridScrollRootReference: RefObject<HTMLDivElement | null>;
  presentationChoice: CatalogPresentationChoice;
  shouldLoadThumbnail: boolean;
}>;

type CropCatalogThumbnailProperties = Readonly<{
  catalogItem: CatalogItem;
  shouldLoadThumbnail: boolean;
}>;

function InteriorDecorCatalogThumbnail({
  catalogItem,
  shouldLoadThumbnail,
}: Readonly<{
  catalogItem: CatalogItem;
  shouldLoadThumbnail: boolean;
}>) {
  if (catalogItem.sprite.kind !== "source-rect") {
    throw new TypeError(
      `Interior decor thumbnail ${JSON.stringify(catalogItem.id)} requires a source-rect frame.`,
    );
  }

  const isFlooring = catalogItem.interiorDecorKind === "flooring";
  const frameAssetPath = isFlooring
    ? "/assets/ui/flooring-frame.png"
    : "/assets/ui/wallpaper-frame.png";
  const textureDimensions = getCatalogTextureDimensions(catalogItem.textureLocalPath);
  if (textureDimensions === null) {
    throw new Error(
      `Interior decor thumbnail texture dimensions are unavailable for ${JSON.stringify(catalogItem.textureLocalPath)}.`,
    );
  }

  const previewWidth = Math.round(catalogItem.sprite.width * 2);
  const previewHeight = Math.round(catalogItem.sprite.height * 2);
  const previewLeft = Math.round((64 - previewWidth) / 2);
  const previewTop = isFlooring ? 4 : Math.round((64 - previewHeight) / 2);

  return (
    <span
      aria-hidden="true"
      className="item-catalog-panel__thumbnail interior-decor-catalog-panel__thumbnail"
      style={{
        ...(shouldLoadThumbnail
          ? { backgroundImage: `url(${JSON.stringify(frameAssetPath)})` }
          : {}),
        backgroundSize: "64px 64px",
        height: 64,
        position: "relative",
        width: 64,
      }}
    >
      <span
        aria-hidden="true"
        className="interior-decor-catalog-panel__preview"
        style={{
          ...(shouldLoadThumbnail
            ? {
                backgroundImage: `url(${JSON.stringify(catalogItem.textureLocalPath)})`,
              }
            : {}),
          backgroundPosition: `${formatCatalogPixelOffset(catalogItem.sprite.x * 2)} ${formatCatalogPixelOffset(catalogItem.sprite.y * 2)}`,
          backgroundSize: `${String(textureDimensions.width * 2)}px ${String(textureDimensions.height * 2)}px`,
          height: previewHeight,
          left: previewLeft,
          position: "absolute",
          top: previewTop,
          width: previewWidth,
        }}
      />
    </span>
  );
}

function CropCatalogThumbnail({
  catalogItem,
  shouldLoadThumbnail,
}: CropCatalogThumbnailProperties) {
  const canvasReference = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasReference.current;
    if (canvas === null) {
      return;
    }

    const context = canvas.getContext("2d");
    if (context === null) {
      throw new Error(
        `Crop thumbnail canvas could not create a 2D context for ${JSON.stringify(catalogItem.id)}.`,
      );
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    if (!shouldLoadThumbnail) {
      return;
    }

    const cropRenderingMetadata = getCropRenderingMetadata(catalogItem);
    const sourceRect = cropRenderingMetadata.fullyGrownRect;

    const image = new Image();
    image.onload = () => {
      const drawScale = Math.min(
        2.5,
        canvas.width / sourceRect.width,
        canvas.height / sourceRect.height,
      );
      const destinationWidth = sourceRect.width * drawScale;
      const destinationHeight = sourceRect.height * drawScale;

      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        image,
        sourceRect.x,
        sourceRect.y,
        sourceRect.width,
        sourceRect.height,
        (canvas.width - destinationWidth) / 2,
        (canvas.height - destinationHeight) / 2,
        destinationWidth,
        destinationHeight,
      );

      if (
        cropRenderingMetadata.coloredRect !== undefined
      ) {
        const tintColor = cropRenderingMetadata.tintColors[0];
        if (tintColor === undefined) {
          throw new Error(
            `Crop thumbnail ${JSON.stringify(catalogItem.id)} has a colored frame without a tint color.`,
          );
        }
        const tintedCanvas = document.createElement("canvas");
        tintedCanvas.width = canvas.width;
        tintedCanvas.height = canvas.height;
        const tintedContext = tintedCanvas.getContext("2d");
        if (tintedContext === null) {
          throw new Error(
            `Crop thumbnail tint canvas could not create a 2D context for ${JSON.stringify(catalogItem.id)}.`,
          );
        }

        const coloredRect = cropRenderingMetadata.coloredRect;
        tintedContext.imageSmoothingEnabled = false;
        tintedContext.drawImage(
          image,
          coloredRect.x,
          coloredRect.y,
          coloredRect.width,
          coloredRect.height,
          (canvas.width - destinationWidth) / 2,
          (canvas.height - destinationHeight) / 2,
          destinationWidth,
          destinationHeight,
        );
        tintedContext.globalCompositeOperation = "multiply";
        const red = tintColor >> 16 & 255;
        const green = tintColor >> 8 & 255;
        const blue = tintColor & 255;
        tintedContext.fillStyle = `rgb(${String(red)},${String(green)},${String(blue)})`;
        tintedContext.fillRect(0, 0, tintedCanvas.width, tintedCanvas.height);
        tintedContext.globalCompositeOperation = "destination-in";
        tintedContext.drawImage(
          image,
          coloredRect.x,
          coloredRect.y,
          coloredRect.width,
          coloredRect.height,
          (canvas.width - destinationWidth) / 2,
          (canvas.height - destinationHeight) / 2,
          destinationWidth,
          destinationHeight,
        );
        context.drawImage(tintedCanvas, 0, 0);
      }
    };
    image.onerror = () => {
      throw new Error(
        `Unable to load crop thumbnail asset ${catalogItem.textureLocalPath} for ${JSON.stringify(catalogItem.id)}.`,
      );
    };
    image.src = catalogItem.textureLocalPath;

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [catalogItem, shouldLoadThumbnail]);

  return (
    <canvas
      aria-hidden="true"
      className="item-catalog-panel__thumbnail crop-catalog-panel__thumbnail"
      height={80}
      ref={canvasReference}
      width={80}
    />
  );
}

export type ResolvedBuildingThumbnailLayer = Readonly<{
  layer: CatalogBuildingMultilayerLayer;
  resolvedAssetPath: string;
  resolvedFrame: PlannerTextureFrame | null;
}>;

type MaterializedBuildingThumbnailLayer = Readonly<{
  layer: CatalogBuildingMultilayerLayer;
  resolvedAssetPath: string;
  sourceFrame: PlannerTextureFrame;
}>;

export function resolveBuildingThumbnailLayers(
  catalogItem: CatalogItem,
  variant: number,
): readonly ResolvedBuildingThumbnailLayer[] {
  return getBuildingThumbnailCompositionLayers(
    catalogItem,
    "spring",
    variant,
  ).map(({ frame, layer }) => {
    const lockedTexturePath = layer.textureLocalPath ?? catalogItem.textureLocalPath;
    const normalizedSourceFrame = normalizeBuildingThumbnailSourceFrame(
      layer.id,
      frame,
    );
    const { resolvedAssetPath, resolvedFrame } = resolvePlannerTextureFrame(
      lockedTexturePath,
      normalizedSourceFrame,
    );
    return { layer, resolvedAssetPath, resolvedFrame };
  });
}

function BuildingCatalogThumbnail({
  catalogItem,
  itemGridScrollRootReference,
  presentationChoice,
  shouldLoadThumbnail,
}: BuildingCatalogThumbnailProperties) {
  const canvasReference = useRef<HTMLCanvasElement>(null);
  const canLoadThumbnail = useBuildingThumbnailLoadEligibility(
    shouldLoadThumbnail,
    canvasReference,
    itemGridScrollRootReference,
  );

  useEffect(() => {
    if (!canLoadThumbnail) {
      return;
    }

    const canvas = canvasReference.current;
    if (canvas === null) {
      return;
    }

    const context = canvas.getContext("2d");
    if (context === null) {
      throw new Error(`Building thumbnail canvas could not create a 2D context for ${JSON.stringify(catalogItem.id)}.`);
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (catalogItem.sprite.kind !== "source-rect") {
      throw new TypeError(`Building thumbnail ${JSON.stringify(catalogItem.id)} requires a source-rect sprite.`);
    }

    const resolvedLayers = resolveBuildingThumbnailLayers(
      catalogItem,
      presentationChoice.variant,
    );
    let buildingThumbnailLoadIsActive = true;

    void loadBuildingThumbnailImages(
      resolvedLayers.map(({ resolvedAssetPath }) => resolvedAssetPath),
    ).then((imagesByResolvedAssetPath) => {
      if (!buildingThumbnailLoadIsActive) {
        return;
      }

      const materializedLayers: readonly MaterializedBuildingThumbnailLayer[] =
        resolvedLayers.map(({ layer, resolvedAssetPath, resolvedFrame }) => {
          const image = imagesByResolvedAssetPath.get(resolvedAssetPath);
          if (image === undefined) {
            throw new Error(
              `Building thumbnail layer ${JSON.stringify(layer.id)} has no loaded resolved texture ${resolvedAssetPath}.`,
            );
          }
          return {
            layer,
            resolvedAssetPath,
            sourceFrame: materializeBuildingThumbnailFrame(
              layer.id,
              resolvedFrame,
              image,
            ),
          };
        });
      if (materializedLayers.length === 0) {
        throw new Error(`Building thumbnail ${JSON.stringify(catalogItem.id)} has no visible composition layers.`);
      }

      let minimumX = Number.POSITIVE_INFINITY;
      let minimumY = Number.POSITIVE_INFINITY;
      let maximumX = Number.NEGATIVE_INFINITY;
      let maximumY = Number.NEGATIVE_INFINITY;
      for (const { layer, sourceFrame } of materializedLayers) {
        const layerScale = layer.scale ?? 1;
        minimumX = Math.min(minimumX, layer.offsetX);
        minimumY = Math.min(minimumY, layer.offsetY);
        maximumX = Math.max(maximumX, layer.offsetX + sourceFrame.width * layerScale);
        maximumY = Math.max(maximumY, layer.offsetY + sourceFrame.height * layerScale);
      }

      const drawScale = Math.min(
        canvas.width / (maximumX - minimumX),
        canvas.height / (maximumY - minimumY),
      );
      const originX = (canvas.width - (maximumX - minimumX) * drawScale) / 2 - minimumX * drawScale;
      const originY = (canvas.height - (maximumY - minimumY) * drawScale) / 2 - minimumY * drawScale;
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (const { layer, resolvedAssetPath, sourceFrame } of materializedLayers) {
        drawBuildingThumbnailLayer(
          context,
          createBuildingThumbnailLayerDrawCommand({
            drawScale,
            layer,
            originX,
            originY,
            resolvedAssetPath,
            resolvedFrame: sourceFrame,
          }),
          layer,
          imagesByResolvedAssetPath,
        );
      }
    }).catch((caughtError: unknown) => {
      if (!buildingThumbnailLoadIsActive) {
        return;
      }

      throw new Error(
        `Building thumbnail asset failed to load for ${JSON.stringify(catalogItem.id)}: ${catalogItem.textureLocalPath}`,
        { cause: caughtError },
      );
    });

    return () => {
      buildingThumbnailLoadIsActive = false;
    };
  }, [
    catalogItem.id,
    catalogItem.renderingMetadata,
    catalogItem.sprite,
    catalogItem.textureLocalPath,
    presentationChoice.variant,
    canLoadThumbnail,
  ]);

  return (
    <canvas
      aria-hidden="true"
      className="item-catalog-panel__thumbnail building-catalog-panel__thumbnail"
      height={80}
      ref={canvasReference}
      width={80}
    />
  );
}

export type BuildingThumbnailLayerDrawCommand = Readonly<{
  destinationHeight: number;
  destinationWidth: number;
  destinationX: number;
  destinationY: number;
  resolvedAssetPath: string;
  sourceFrame: PlannerTextureFrame;
}>;

export function normalizeBuildingThumbnailSourceFrame(
  layerId: string,
  sourceFrame: CatalogBuildingMultilayerLayer["frame"],
): PlannerTextureFrame | null {
  if (sourceFrame.width === 0 && sourceFrame.height === 0) {
    return null;
  }
  if (
    !Number.isFinite(sourceFrame.width) ||
    !Number.isFinite(sourceFrame.height) ||
    sourceFrame.width <= 0 ||
    sourceFrame.height <= 0
  ) {
    throw new Error(
      `Building thumbnail layer ${JSON.stringify(layerId)} has invalid source dimensions width=${String(sourceFrame.width)}, height=${String(sourceFrame.height)}.`,
    );
  }
  return sourceFrame;
}

export function materializeBuildingThumbnailFrame(
  layerId: string,
  resolvedFrame: PlannerTextureFrame | null,
  image: HTMLImageElement,
): PlannerTextureFrame {
  if (resolvedFrame !== null) {
    return resolvedFrame;
  }
  if (
    !Number.isFinite(image.naturalWidth) ||
    !Number.isFinite(image.naturalHeight) ||
    image.naturalWidth <= 0 ||
    image.naturalHeight <= 0
  ) {
    throw new Error(
      `Building thumbnail layer ${JSON.stringify(layerId)} could not materialize a full-texture frame; received naturalWidth=${String(image.naturalWidth)}, naturalHeight=${String(image.naturalHeight)}.`,
    );
  }
  return {
    x: 0,
    y: 0,
    width: image.naturalWidth,
    height: image.naturalHeight,
  };
}

export function createBuildingThumbnailLayerDrawCommand(
  input: Readonly<{
    drawScale: number;
    layer: CatalogBuildingMultilayerLayer;
    originX: number;
    originY: number;
    resolvedAssetPath: string;
    resolvedFrame: PlannerTextureFrame;
  }>,
): BuildingThumbnailLayerDrawCommand {
  const layerScale = input.layer.scale ?? 1;
  return {
    destinationHeight: input.resolvedFrame.height * layerScale * input.drawScale,
    destinationWidth: input.resolvedFrame.width * layerScale * input.drawScale,
    destinationX: input.originX + input.layer.offsetX * input.drawScale,
    destinationY: input.originY + input.layer.offsetY * input.drawScale,
    resolvedAssetPath: input.resolvedAssetPath,
    sourceFrame: input.resolvedFrame,
  };
}

function drawBuildingThumbnailLayer(
  context: CanvasRenderingContext2D,
  drawCommand: BuildingThumbnailLayerDrawCommand,
  layer: CatalogBuildingMultilayerLayer,
  imagesByResolvedAssetPath: ReadonlyMap<string, HTMLImageElement>,
): void {
  const image = imagesByResolvedAssetPath.get(drawCommand.resolvedAssetPath);
  if (image === undefined) {
    throw new Error(`Building thumbnail layer ${JSON.stringify(layer.id)} has no loaded resolved texture ${drawCommand.resolvedAssetPath}.`);
  }
  const tint = layer.tint;
  if (tint === undefined) {
    context.globalAlpha = layer.opacity ?? 1;
    context.drawImage(
      image,
      drawCommand.sourceFrame.x,
      drawCommand.sourceFrame.y,
      drawCommand.sourceFrame.width,
      drawCommand.sourceFrame.height,
      drawCommand.destinationX,
      drawCommand.destinationY,
      drawCommand.destinationWidth,
      drawCommand.destinationHeight,
    );
    context.globalAlpha = 1;
    return;
  }

  const tintedLayerCanvas = document.createElement("canvas");
  tintedLayerCanvas.width = Math.max(1, Math.ceil(drawCommand.destinationWidth));
  tintedLayerCanvas.height = Math.max(1, Math.ceil(drawCommand.destinationHeight));
  const tintedLayerContext = tintedLayerCanvas.getContext("2d");
  if (tintedLayerContext === null) {
    throw new Error(`Building thumbnail layer ${JSON.stringify(layer.id)} could not create a tint context.`);
  }
  tintedLayerContext.imageSmoothingEnabled = false;
  tintedLayerContext.drawImage(
    image,
    drawCommand.sourceFrame.x,
    drawCommand.sourceFrame.y,
    drawCommand.sourceFrame.width,
    drawCommand.sourceFrame.height,
    0,
    0,
    drawCommand.destinationWidth,
    drawCommand.destinationHeight,
  );
  tintedLayerContext.globalCompositeOperation = "multiply";
  const tintValue = tint.kind === "water-color-or-fixed"
    ? tint.fixedColor
    : tint.seasonalColors.spring;
  tintedLayerContext.fillStyle = `#${tintValue.toString(16).padStart(6, "0")}`;
  tintedLayerContext.fillRect(0, 0, tintedLayerCanvas.width, tintedLayerCanvas.height);
  tintedLayerContext.globalCompositeOperation = "destination-in";
  tintedLayerContext.drawImage(
    image,
    drawCommand.sourceFrame.x,
    drawCommand.sourceFrame.y,
    drawCommand.sourceFrame.width,
    drawCommand.sourceFrame.height,
    0,
    0,
    drawCommand.destinationWidth,
    drawCommand.destinationHeight,
  );
  context.globalAlpha = layer.opacity ?? 1;
  context.drawImage(tintedLayerCanvas, drawCommand.destinationX, drawCommand.destinationY);
  context.globalAlpha = 1;
}

function CatalogItemChoiceButton({
  ariaLabel,
  ariaPressed,
  catalogItem,
  control,
  label,
  onCatalogItemPresentationChoiceChange,
  presentationChoice,
}: Readonly<{
  ariaLabel?: string;
  ariaPressed?: boolean;
  catalogItem: CatalogItem;
  control: CatalogItemControl;
  label: string;
  onCatalogItemPresentationChoiceChange: (
    catalogItem: CatalogItem,
    presentationChoice: CatalogPresentationChoice,
  ) => void;
  presentationChoice: CatalogPresentationChoice;
}>) {
  return (
    <button
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      className={`${
        control === "flip" ? "flip-btn" : "rotate-btn"
      } item-catalog-panel__presentation-control${
        control === "flip" && presentationChoice.flipped ? " flipped" : ""
      }`}
      onClick={() => onCatalogItemPresentationChoiceChange(
        catalogItem,
        getNextCatalogItemControlChoice(
          catalogItem,
          presentationChoice,
          control,
        ),
      )}
      type="button"
    >
      {label}
    </button>
  );
}

export function getNextCatalogItemControlChoice(
  catalogItem: CatalogItem,
  presentationChoice: CatalogPresentationChoice,
  control: CatalogItemControl,
): CatalogPresentationChoice {
  const validatedChoice = validateCatalogItemPresentationChoice(
    catalogItem,
    presentationChoice,
  );
  const presentationCapabilities = catalogItem.presentationCapabilities;
  if (presentationCapabilities === undefined) {
    throwUnsupportedCatalogItemControl(catalogItem.id, control);
  }
  if (
    control === "rotation" &&
    (presentationCapabilities.rotation?.count ?? 0) > 1
  ) {
    return getNextPendingCatalogPresentationChoice(
      catalogItem.id,
      presentationCapabilities,
      validatedChoice,
    );
  }
  if (
    control === "variant" &&
    presentationCapabilities.variantCycle !== null &&
    presentationCapabilities.visibleVariants.length > 1
  ) {
    return getNextSelectedCatalogPresentationChoice(
      catalogItem.id,
      presentationCapabilities,
      validatedChoice,
    );
  }
  if (control === "flip" && presentationCapabilities.canFlip) {
    return validateCatalogItemPresentationChoice(catalogItem, {
      ...validatedChoice,
      flipped: !validatedChoice.flipped,
    });
  }
  throwUnsupportedCatalogItemControl(catalogItem.id, control);
}

function getControlledCatalogItemChoice(
  catalogItem: CatalogItem,
  presentationChoicesByItemId: ReadonlyMap<string, CatalogPresentationChoice>,
): CatalogPresentationChoice {
  const controlledChoice = presentationChoicesByItemId.get(catalogItem.id);
  return controlledChoice === undefined
    ? createDefaultCatalogItemPresentationChoice(catalogItem)
    : validateCatalogItemPresentationChoice(catalogItem, controlledChoice);
}

function getVisibleVariantLabel(
  catalogItem: CatalogItem,
  presentationChoice: CatalogPresentationChoice,
): string {
  const visibleVariant = catalogItem.presentationCapabilities?.visibleVariants.find(
    (candidateVariant) => candidateVariant.value === presentationChoice.variant,
  );
  if (visibleVariant === undefined) {
    throw new Error(
      `Catalog item ${JSON.stringify(catalogItem.id)} has no visible label for variant ${describeCatalogPanelValue(presentationChoice.variant)}.`,
    );
  }
  return visibleVariant.label;
}

function throwUnsupportedCatalogItemControl(
  catalogItemId: string,
  control: CatalogItemControl,
): never {
  throw new Error(
    `Catalog item ${JSON.stringify(catalogItemId)} does not support ${JSON.stringify(control)} control.`,
  );
}

export async function loadCatalogPanelState(
  category: EditorCatalogCategory,
  catalogPanelLoader: CatalogPanelLoader = loadCatalogCategory,
): Promise<CatalogPanelLoadState> {
  try {
    return {
      kind: "ready",
      category,
      catalog: await catalogPanelLoader(category),
    };
  } catch (caughtError) {
    return {
      kind: "error",
      category,
      message: formatCatalogLoadError(caughtError),
    };
  }
}

export function getReadyCatalogItems(
  catalogPanelLoadState: CatalogPanelLoadState,
): readonly CatalogItem[] | null {
  return catalogPanelLoadState.kind === "ready"
    ? catalogPanelLoadState.catalog.items
    : null;
}

export function getCatalogItemsForPanel(
  catalog: Catalog,
  category: EditorCatalogCategory,
  searchQuery: string,
): readonly CatalogItem[] {
  validateCatalogPanelCategory(category);
  validateCatalogSearchQuery(searchQuery);

  if (!Array.isArray(catalog.items)) {
    throw new TypeError(
      `Catalog items must be an array. Received: ${describeCatalogPanelValue(catalog.items)}.`,
    );
  }

  const lowerCaseSearchQuery = searchQuery.trim().toLowerCase();
  if (category === "placeables" && isReferencePlaceableCatalog(catalog)) {
    return selectReferencePlaceableCatalogItems(catalog.items).filter((catalogItem) =>
      matchesCatalogSearchQuery(catalogItem, lowerCaseSearchQuery),
    );
  }
  const allowedCatalogItemCategories =
    catalogItemCategoriesByPanelCategory[category];

  return catalog.items.filter((catalogItem) => {
    const isFurnitureItem = catalogItem.renderingMetadata?.kind === "furniture";
    const isDecorBigCraftableItem =
      catalogItem.category === "placeable" &&
      catalogItem.id.startsWith("big-craftable:");
    const belongsToPanel = category === "decor"
      ? catalogItem.category === "decor" || isFurnitureItem || isDecorBigCraftableItem
      : allowedCatalogItemCategories.includes(catalogItem.category) &&
        !(category === "placeables" && isFurnitureItem);

    return belongsToPanel && matchesCatalogSearchQuery(catalogItem, lowerCaseSearchQuery);
  });
}

function isReferencePlaceableCatalog(catalog: Catalog): boolean {
  return catalog.items.some((catalogItem) => catalogItem.id === "object:599") &&
    catalog.items.some((catalogItem) => catalogItem.id === "grass_7");
}

function selectReferencePlaceableCatalogItems(
  catalogItems: readonly CatalogItem[],
): readonly CatalogItem[] {
  const candidates = catalogItems.filter((catalogItem) =>
    catalogItem.renderingMetadata?.kind !== "furniture" &&
    (catalogItem.category === "placeable" ||
      catalogItem.category === "floor" ||
      catalogItem.category === "fence" ||
      catalogItem.id.startsWith("clump_")),
  );
  const selectedCatalogItems: CatalogItem[] = [];
  const consumedCatalogItemIds = new Set<string>();

  for (const referenceName of referencePlaceableCatalogNames) {
    const baseName = normalizeReferencePlaceableName(referenceName);
    const familyName = getReferencePlaceableFamilyName(referenceName);
    const matchingItems = candidates.filter((catalogItem) =>
      !consumedCatalogItemIds.has(catalogItem.id) &&
      matchesReferencePlaceableName(catalogItem, referenceName, baseName, familyName),
    );
    const selectedCatalogItem = matchingItems[0];

    if (selectedCatalogItem === undefined) {
      throw new Error(
        `Reference placeables require catalog item ${JSON.stringify(referenceName)}; no unused local item matched it.`,
      );
    }

    consumedCatalogItemIds.add(selectedCatalogItem.id);
    selectedCatalogItems.push(selectedCatalogItem);
  }

  return selectedCatalogItems;
}

function matchesReferencePlaceableName(
  catalogItem: CatalogItem,
  referenceName: string,
  baseName: string,
  familyName: string | undefined,
): boolean {
  if (referenceName === "Tilled Dirt (Dry)") {
    return catalogItem.id === "hoedirt";
  }
  if (referenceName === "Grass Starter" || referenceName === "Blue Grass Starter") {
    return catalogItem.id === (referenceName === "Grass Starter" ? "grass_1" : "grass_7");
  }
  if (isReferenceFloorName(referenceName)) {
    return catalogItem.category === "floor" && catalogItem.name === baseName;
  }
  if (isReferenceFenceName(referenceName)) {
    return referenceName === "Gate"
      ? catalogItem.id === "object:325"
      : catalogItem.category === "fence" && catalogItem.name === baseName;
  }
  if (familyName !== undefined) {
    return catalogItem.name === familyName;
  }
  if (referenceName.includes("Tree")) {
    return (catalogItem.id.startsWith("wildtree_") || catalogItem.id.startsWith("fruittree_")) &&
      catalogItem.name === baseName;
  }
  return catalogItem.name === referenceName || catalogItem.name === baseName;
}

function normalizeReferencePlaceableName(referenceName: string): string {
  return referenceName
    .replace(/ \(Lit\)$/, "")
    .replace(/ \(Normal\)$/, "")
    .replace(/ \(No Fruit\)$/, "");
}

function getReferencePlaceableFamilyName(referenceName: string): string | undefined {
  if (/^Rarecrow(?: \d+)?$/.test(referenceName)) {
    return "Rarecrow";
  }
  if (referenceName === "Campfire") {
    return "Campfire";
  }
  if (/^Campfire(?: \d+)? \(Lit\)$/.test(referenceName)) {
    return "Campfire";
  }
  return undefined;
}

function isReferenceFloorName(referenceName: string): boolean {
  return [
    "Wood Floor",
    "Stone Floor",
    "Weathered Floor",
    "Crystal Floor",
    "Straw Floor",
    "Gravel Path",
    "Wood Path",
    "Crystal Path",
    "Cobblestone Path",
    "Stepping Stone Path",
    "Brick Floor",
    "Rustic Plank Floor",
    "Stone Walkway Floor",
  ].includes(referenceName);
}

function isReferenceFenceName(referenceName: string): boolean {
  return ["Gate", "Hardwood Fence", "Wood Fence", "Stone Fence", "Iron Fence"].includes(
    referenceName,
  );
}

export function getCatalogItemThumbnailStyle(
  catalogItem: CatalogItem,
  presentationChoice: CatalogPresentationChoice,
  shouldLoadThumbnail = true,
): CSSProperties {
  const validatedChoice = validateCatalogItemPresentationChoice(
    catalogItem,
    presentationChoice,
  );
  const furnitureRotationSprite =
    catalogItem.renderingMetadata?.kind === "furniture"
      ? catalogItem.renderingMetadata.rotationSprites?.[validatedChoice.rotation]
      : undefined;
  const cropRenderingMetadata = catalogItem.category === "crop"
    ? getCropRenderingMetadata(catalogItem)
    : undefined;
  const thumbnailSprite =
    cropRenderingMetadata?.fullyGrownRect ??
    furnitureRotationSprite?.sprite ??
    catalogItem.thumbnailSprite ??
    getDefaultCatalogThumbnailSprite(catalogItem) ??
    catalogItem.sprite;
  const spriteCoordinates = getCatalogSpriteCoordinates(
    thumbnailSprite,
    catalogItem.textureLocalPath,
  );
  const spriteSize = getCatalogSpriteSize(
    thumbnailSprite,
  );
  const usesEntireTexture =
    thumbnailSprite.kind ===
      "source-rect" &&
    (spriteSize.width === 0 || spriteSize.height === 0);
  const isHorizontallyFlipped =
    validatedChoice.flipped !== (furnitureRotationSprite?.flipped === true);
  const preservesFurnitureNegativeZero = furnitureRotationSprite?.flipped === true;

  const thumbnailScale =
    catalogItem.category === "building"
      ? 1
      : cropRenderingMetadata !== undefined
        ? Math.min(60 / spriteSize.width, 60 / spriteSize.height, 2.5)
      : Math.min(60 / spriteSize.width, 60 / spriteSize.height, 4);
  const textureDimensions = getCatalogTextureDimensions(
    catalogItem.textureLocalPath,
  );
  const usesScaledSprite =
    !usesEntireTexture &&
    thumbnailScale !== 1 &&
    textureDimensions !== null;
  const renderedSpriteScale = usesScaledSprite ? thumbnailScale : 1;

  return {
    ...(shouldLoadThumbnail
      ? {
          // Quote the URL so asset names containing spaces (for example
          // "Junimo Hut.png" and "Big Coop.png") are accepted by the CSS
          // parser instead of silently becoming `background-image: none`.
          backgroundImage: `url(${JSON.stringify(catalogItem.textureLocalPath)})`,
        }
      : {}),
    backgroundPosition: usesEntireTexture
      ? "center"
      : `${formatCatalogPixelOffset(spriteCoordinates.x * renderedSpriteScale, preservesFurnitureNegativeZero)} ${formatCatalogPixelOffset(spriteCoordinates.y * renderedSpriteScale, preservesFurnitureNegativeZero)}`,
    backgroundSize:
      usesEntireTexture || !usesScaledSprite || textureDimensions === null
        ? usesEntireTexture
          ? "contain"
          : undefined
        : `${String(textureDimensions.width * thumbnailScale)}px ${String(textureDimensions.height * thumbnailScale)}px`,
    height: usesEntireTexture
      ? "100%"
      : usesScaledSprite
        ? Math.round(spriteSize.height * thumbnailScale)
        : spriteSize.height,
    transform: isHorizontallyFlipped ? "scaleX(-1)" : undefined,
    width: usesEntireTexture
      ? "100%"
      : usesScaledSprite
        ? Math.round(spriteSize.width * thumbnailScale)
        : spriteSize.width,
  };
}

function getDefaultCatalogThumbnailSprite(
  catalogItem: CatalogItem,
): CatalogItem["sprite"] | undefined {
  const seasonalSpringFrame = getSeasonalPlaceableFrame(catalogItem, "spring");
  if (seasonalSpringFrame !== null) {
    return seasonalSpringFrame;
  }
  if (catalogItem.sprite.kind !== "sprite-index") {
    return undefined;
  }

  const textureBasename = catalogItem.textureLocalPath.split("/").pop();
  if (textureBasename !== "craftables.png") {
    return undefined;
  }

  return {
    kind: "source-rect",
    x: (catalogItem.sprite.index % 8) * 16,
    y: Math.floor(catalogItem.sprite.index / 8) * 32,
    width: 16,
    height: 32,
  };
}

function formatCatalogPixelOffset(offset: number, preservesNegativeZero = false): string {
  return offset === 0 && !preservesNegativeZero ? "0px" : `-${String(offset)}px`;
}

function getCatalogTextureDimensions(
  textureLocalPath: string,
): Readonly<{ width: number; height: number }> | null {
  const textureBasename = textureLocalPath.split("/").pop();

  if (textureBasename === "springobjects.png") {
    return { width: 384, height: 624 };
  }

  if (textureBasename === "bushes.png") {
    return { width: 128, height: 352 };
  }

  if (textureBasename === "craftables.png") {
    return { width: 128, height: 1472 };
  }

  if (textureBasename === "FreeCactuses.png" || textureBasename === "Mannequins.png") {
    return { width: 128, height: 128 };
  }

  if (textureBasename === "flooring.png") {
    return { width: 256, height: 256 };
  }

  if (textureBasename === "walls_and_floors.png") {
    return { width: 256, height: 688 };
  }

  if (textureBasename === "wallpapers_2.png") {
    return { width: 256, height: 96 };
  }

  if (textureBasename === "floors_2.png") {
    return { width: 256, height: 64 };
  }

  if (textureBasename === "hoeDirt.png") {
    return { width: 192, height: 64 };
  }

  if (textureBasename === "crops.png") {
    return { width: 256, height: 1024 };
  }

  if (textureBasename === "Cursors_1_6.png") {
    return { width: 512, height: 512 };
  }

  if (textureBasename === "grass.png") {
    return { width: 66, height: 240 };
  }

  if (
    textureBasename?.startsWith("tree") === true ||
    textureBasename === "mushroom_tree.png" ||
    textureBasename === "mystic_tree.png"
  ) {
    if (textureBasename === "tree3_greenRain.png" || textureBasename === "mystic_tree.png") {
      return { width: 48, height: 160 };
    }
    return textureBasename === "tree_palm.png" || textureBasename === "tree8_spring.png"
      ? { width: 48, height: 160 }
      : textureBasename === "tree_palm2.png"
        ? { width: 96, height: 160 }
        : { width: 144, height: 160 };
  }

  if (textureBasename === "fruitTrees.png") {
    return { width: 432, height: 720 };
  }

  const furnitureTextureDimensions: Readonly<
    Record<string, Readonly<{ width: number; height: number }>>
  > = {
    "furniture.png": { width: 512, height: 1488 },
    "furniture_2.png": { width: 256, height: 512 },
    "furniture_3.png": { width: 208, height: 432 },
    "joja_furniture.png": { width: 208, height: 336 },
    "junimo_furniture.png": { width: 208, height: 432 },
    "retro_furniture.png": { width: 208, height: 265 },
    "wizard_furniture.png": { width: 208, height: 432 },
  };
  if (textureBasename !== undefined && furnitureTextureDimensions[textureBasename] !== undefined) {
    return furnitureTextureDimensions[textureBasename];
  }

  if (textureBasename?.startsWith("Fence") === true) {
    return { width: 48, height: 352 };
  }

  return null;
}

export function getNextCatalogCategory(
  currentCategory: EditorCatalogCategory,
  keyboardKey: string,
): EditorCatalogCategory | null {
  const currentCategoryIndex = editorCatalogCategories.indexOf(currentCategory);

  if (currentCategoryIndex === -1) {
    throw new Error(
      `Catalog keyboard navigation received unknown category ${JSON.stringify(currentCategory)}.`,
    );
  }

  if (keyboardKey === "Home") {
    return editorCatalogCategories[0];
  }

  if (keyboardKey === "End") {
    return editorCatalogCategories[editorCatalogCategories.length - 1];
  }

  if (keyboardKey === "ArrowLeft") {
    return editorCatalogCategories[
      (currentCategoryIndex - 1 + editorCatalogCategories.length) %
        editorCatalogCategories.length
    ];
  }

  if (keyboardKey === "ArrowRight") {
    return editorCatalogCategories[
      (currentCategoryIndex + 1) % editorCatalogCategories.length
    ];
  }

  return null;
}

function getCatalogSpriteCoordinates(
  catalogSprite: CatalogItem["sprite"],
  textureLocalPath: string,
): Readonly<{ x: number; y: number }> {
  if (catalogSprite.kind === "source-rect") {
    return { x: catalogSprite.x, y: catalogSprite.y };
  }

  const spriteCellSize = 16;
  const textureBasename = textureLocalPath.split("/").pop();
  const spriteColumnCount = textureBasename === "springobjects.png"
    ? 24
    : textureBasename === "craftables.png"
      ? 8
      : 16;

  return {
    x: (catalogSprite.index % spriteColumnCount) * spriteCellSize,
    y:
      Math.floor(catalogSprite.index / spriteColumnCount) *
      spriteCellSize,
  };
}

function getCatalogSpriteSize(
  catalogSprite: CatalogItem["sprite"],
): Readonly<{ width: number; height: number }> {
  if (catalogSprite.kind === "source-rect") {
    return { height: catalogSprite.height, width: catalogSprite.width };
  }

  return { height: 16, width: 16 };
}

function matchesCatalogSearchQuery(
  catalogItem: CatalogItem,
  lowerCaseSearchQuery: string,
): boolean {
  return lowerCaseSearchQuery.length === 0 ||
    catalogItem.name.toLowerCase().includes(lowerCaseSearchQuery) ||
    catalogItem.id.toLowerCase().includes(lowerCaseSearchQuery);
}

function formatCatalogLoadError(caughtError: unknown): string {
  if (caughtError instanceof Error) {
    const causeMessage = formatCatalogLoadErrorCause(caughtError.cause);

    return causeMessage === null
      ? `Unable to load the local item catalog: ${caughtError.message}`
      : `Unable to load the local item catalog: ${caughtError.message} Cause: ${causeMessage}`;
  }

  return `Unable to load the local item catalog: ${describeCatalogPanelValue(caughtError)}`;
}

function formatCatalogLoadErrorCause(caughtCause: unknown): string | null {
  if (caughtCause === undefined) {
    return null;
  }

  if (caughtCause instanceof Error) {
    return caughtCause.message;
  }

  return describeCatalogPanelValue(caughtCause);
}

function validateCatalogPanelCategory(category: EditorCatalogCategory): void {
  if (!editorCatalogCategories.includes(category)) {
    throw new TypeError(
      `Catalog panel category must be one of ${editorCatalogCategories.join(", ")}. Received: ${describeCatalogPanelValue(category)}.`,
    );
  }
}

function validateCatalogSearchQuery(searchQuery: string): void {
  if (typeof searchQuery !== "string") {
    throw new TypeError(
      `Catalog search query must be a string. Received: ${describeCatalogPanelValue(searchQuery)}.`,
    );
  }
}

function describeCatalogPanelValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "symbol") {
    return value.toString();
  }

  return String(value);
}
