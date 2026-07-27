"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { loadCatalog, type Catalog, type CatalogItem } from "../catalog";
import {
  editorCatalogCategories,
  type EditorCatalogCategory,
  type EditorModalId,
  type EditorPanelPosition,
} from "../editor/editor-view-state";

type ItemCatalogPanelProperties = Readonly<{
  category: EditorCatalogCategory;
  panelPosition: EditorPanelPosition;
  searchQuery: string;
  selectedCatalogItemId: string | null;
  onCatalogItemSelect: (catalogItem: CatalogItem) => void;
  onCategoryChange: (category: EditorCatalogCategory) => void;
  onOpenModal?: (modalId: EditorModalId) => void;
  onSearchQueryChange: (searchQuery: string) => void;
}>;

type CatalogPanelLoadState =
  | Readonly<{ kind: "loading" }>
  | Readonly<{ kind: "ready"; catalog: Catalog }>
  | Readonly<{ kind: "error"; message: string }>;

type CatalogPanelLoader = () => Promise<Catalog>;

type CatalogItemGridProperties = Readonly<{
  catalogItems: readonly CatalogItem[];
  selectedCatalogItemId: string | null;
  onCatalogItemSelect: (catalogItem: CatalogItem) => void;
}>;

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
  category,
  panelPosition,
  searchQuery,
  selectedCatalogItemId,
  onCatalogItemSelect,
  onCategoryChange,
  onOpenModal,
  onSearchQueryChange,
}: ItemCatalogPanelProperties) {
  const [catalogPanelLoadState, setCatalogPanelLoadState] =
    useState<CatalogPanelLoadState>({ kind: "loading" });
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

    void loadCatalogPanelState().then((nextCatalogPanelLoadState) => {
      if (!hasUnmounted) {
        setCatalogPanelLoadState(nextCatalogPanelLoadState);
      }
    });

    return () => {
      hasUnmounted = true;
    };
  }, []);

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
      className={`item-catalog-panel item-catalog-panel--${panelPosition}`}
    >
      <div className="item-catalog-panel__header">
        <div className="item-catalog-panel__categories" role="tablist">
          {editorCatalogCategories.map((catalogCategory) => (
            <button
              aria-controls={catalogPanelId}
              aria-selected={category === catalogCategory}
              className="item-catalog-panel__category"
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
              {catalogCategoryLabels[catalogCategory]}
            </button>
          ))}
        </div>
        <label className="item-catalog-panel__search-label">
          <span className="sr-only">Search catalog</span>
          <input
            className="item-catalog-panel__search"
            onChange={(changeEvent: ChangeEvent<HTMLInputElement>) =>
              onSearchQueryChange(changeEvent.target.value)
            }
            placeholder="Search..."
            type="search"
            value={searchQuery}
          />
        </label>
        {onOpenModal !== undefined ? (
          <div className="item-catalog-panel__reference-actions">
            <button onClick={() => onOpenModal("help-info")} type="button">
              Help &amp; Info
            </button>
            <button onClick={() => onOpenModal("keyboard-shortcuts")} type="button">
              Shortcuts
            </button>
            <button onClick={() => onOpenModal("whats-new")} type="button">
              What&apos;s New
            </button>
          </div>
        ) : null}
      </div>
      <div
        aria-labelledby={`${catalogId}-tab-${category}`}
        className="item-catalog-panel__content"
        id={catalogPanelId}
        role="tabpanel"
      >
        <CatalogPanelContent
          category={category}
          catalogPanelLoadState={catalogPanelLoadState}
          onCatalogItemSelect={onCatalogItemSelect}
          searchQuery={searchQuery}
          selectedCatalogItemId={selectedCatalogItemId}
        />
      </div>
    </aside>
  );
}

type CatalogPanelContentProperties = Readonly<{
  category: EditorCatalogCategory;
  catalogPanelLoadState: CatalogPanelLoadState;
  searchQuery: string;
  selectedCatalogItemId: string | null;
  onCatalogItemSelect: (catalogItem: CatalogItem) => void;
}>;

export function CatalogPanelContent({
  category,
  catalogPanelLoadState,
  searchQuery,
  selectedCatalogItemId,
  onCatalogItemSelect,
}: CatalogPanelContentProperties) {
  if (catalogPanelLoadState.kind === "loading") {
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
      onCatalogItemSelect={onCatalogItemSelect}
      selectedCatalogItemId={selectedCatalogItemId}
    />
  );
}

export function CatalogItemGrid({
  catalogItems,
  selectedCatalogItemId,
  onCatalogItemSelect,
}: CatalogItemGridProperties) {
  return (
    <div aria-label="Verified catalog items" className="item-catalog-panel__grid">
      {catalogItems.map((catalogItem) => {
        const isSelectedCatalogItem = catalogItem.id === selectedCatalogItemId;

        return (
          <button
            aria-label={`Select ${catalogItem.name}, ${String(catalogItem.tileSize.width)} by ${String(catalogItem.tileSize.height)} tiles`}
            aria-pressed={isSelectedCatalogItem}
            className="item-catalog-panel__item"
            data-selected={isSelectedCatalogItem}
            key={catalogItem.id}
            onClick={() => onCatalogItemSelect(catalogItem)}
            type="button"
          >
            <span
              aria-hidden="true"
              className="item-catalog-panel__thumbnail"
              style={getCatalogItemThumbnailStyle(catalogItem)}
            />
            <span className="item-catalog-panel__item-name">{catalogItem.name}</span>
            <span className="item-catalog-panel__item-size">
              {catalogItem.tileSize.width} × {catalogItem.tileSize.height}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export async function loadCatalogPanelState(
  catalogPanelLoader: CatalogPanelLoader = loadCatalog,
): Promise<CatalogPanelLoadState> {
  try {
    return {
      kind: "ready",
      catalog: await catalogPanelLoader(),
    };
  } catch (caughtError) {
    return {
      kind: "error",
      message: formatCatalogLoadError(caughtError),
    };
  }
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
  const allowedCatalogItemCategories =
    catalogItemCategoriesByPanelCategory[category];

  return catalog.items.filter((catalogItem) =>
    allowedCatalogItemCategories.includes(catalogItem.category) &&
    matchesCatalogSearchQuery(catalogItem, lowerCaseSearchQuery),
  );
}

export function getCatalogItemThumbnailStyle(
  catalogItem: CatalogItem,
): CSSProperties {
  const spriteCoordinates = getCatalogSpriteCoordinates(catalogItem);

  return {
    backgroundImage: `url(${catalogItem.textureLocalPath})`,
    backgroundPosition: `-${String(spriteCoordinates.x)}px -${String(spriteCoordinates.y)}px`,
  };
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
  catalogItem: CatalogItem,
): Readonly<{ x: number; y: number }> {
  if (catalogItem.sprite.kind === "source-rect") {
    return { x: catalogItem.sprite.x, y: catalogItem.sprite.y };
  }

  const spriteCellSize = 16;
  const spriteColumnCount = 16;

  return {
    x: (catalogItem.sprite.index % spriteColumnCount) * spriteCellSize,
    y:
      Math.floor(catalogItem.sprite.index / spriteColumnCount) *
      spriteCellSize,
  };
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
    return `Unable to load the local item catalog: ${caughtError.message}`;
  }

  return `Unable to load the local item catalog: ${describeCatalogPanelValue(caughtError)}`;
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
