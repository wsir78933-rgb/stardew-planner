"use client";

import {
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Keyboard,
  LayoutGrid,
  List,
  Search,
  X,
} from "lucide-react";
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
import { Select } from "radix-ui";
import {
  createDefaultCatalogItemPresentationChoice,
  getBuildingThumbnailCompositionLayers,
  getCatalogSidebarFilters,
  getCatalogSidebarItems,
  getCropRenderingMetadata,
  getSeasonalPlaceableFrame,
  getNextPendingCatalogPresentationChoice,
  getNextSelectedCatalogPresentationChoice,
  loadSidebarCatalog,
  loadSidebarCatalogCategory,
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
import {
  resolvePlannerTextureFrame,
  type PlannerTextureFrame,
} from "../rendering/planner-texture-frame-resolution";
import type { HomepageLocale } from "../homepage/homepage-locale";
import {
  getCatalogPanelCopy,
  type CatalogPanelCopy,
} from "../i18n/catalog-panel-copy";
import {
  getCatalogItemSceneAvailability,
  isCatalogItemVisibleOnMap,
  type CatalogItemSceneAvailability,
} from "../catalog/catalog-scene-availability";
import { getCatalogSidebarDisplayName } from "../catalog/catalog-sidebar-model";
import {
  loadBuildingThumbnailImages,
  useBuildingThumbnailLoadEligibility,
} from "./building-thumbnail-visibility";
import { CatalogLitThumbnail } from "./catalog-lit-thumbnail";

type ItemCatalogPanelProperties = Readonly<{
  catalogPresentationChoicesByItemId: ReadonlyMap<
    string,
    CatalogPresentationChoice
  >;
  category: EditorCatalogCategory;
  leftHandMode?: boolean;
  locale?: HomepageLocale;
  mapId?: string;
  panelPosition: EditorPanelPosition;
  searchQuery: string;
  selectedCatalogItemId: string | null;
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
  | Readonly<{
      kind: "loading";
      scope: "category";
      category: EditorCatalogCategory;
    }>
  | Readonly<{
      kind: "ready";
      scope: "category";
      category: EditorCatalogCategory;
      catalog: Catalog;
    }>
  | Readonly<{
      kind: "error";
      scope: "category";
      category: EditorCatalogCategory;
      message: string;
    }>;

type FullCatalogLoadState =
  | Readonly<{ kind: "loading"; scope: "all" }>
  | Readonly<{ kind: "ready"; scope: "all"; catalog: Catalog }>
  | Readonly<{ kind: "error"; scope: "all"; message: string }>;

type ActiveCatalogPanelLoadState =
  | CatalogPanelLoadState
  | FullCatalogLoadState;

type CatalogPanelLoader = () => Promise<Catalog>;

type CatalogItemViewMode = "grid" | "list";

type CatalogItemGridProperties = Readonly<{
  catalogItems: readonly CatalogItem[];
  catalogPresentationChoicesByItemId: ReadonlyMap<
    string,
    CatalogPresentationChoice
  >;
  selectedCatalogItemId: string | null;
  onCatalogItemSelect: (
    catalogItem: CatalogItem,
    presentationChoice: CatalogPresentationChoice,
  ) => void;
  shouldLoadThumbnails?: boolean;
  viewMode?: CatalogItemViewMode;
  locale?: HomepageLocale;
  mapId?: string;
  isSearch?: boolean;
}>;

type UnavailableCatalogItem = Readonly<{
  catalogItem: CatalogItem;
  availability: Exclude<CatalogItemSceneAvailability, "available">;
}>;

type CatalogItemSceneGroups = Readonly<{
  availableCatalogItems: readonly CatalogItem[];
  unavailableCatalogItems: readonly UnavailableCatalogItem[];
}>;

type CatalogPanelFilterOption = Readonly<{
  count: number;
  id: string;
  label: string;
}>;

export type CatalogItemControl = "flip" | "rotation" | "variant";

export function ItemCatalogPanel({
  catalogPresentationChoicesByItemId,
  category,
  leftHandMode = false,
  locale = "en",
  mapId = "standard",
  panelPosition,
  searchQuery,
  selectedCatalogItemId,
  onCatalogItemSelect,
  onCategoryChange,
  onOpenModal,
  onReadyCatalogItems,
  onSearchQueryChange,
  shouldLoadThumbnails = true,
}: ItemCatalogPanelProperties) {
  const copy = getCatalogPanelCopy(locale);
  const [catalogPanelLoadState, setCatalogPanelLoadState] =
    useState<CatalogPanelLoadState>({
      kind: "loading",
      scope: "category",
      category,
    });
  const [fullCatalogLoadState, setFullCatalogLoadState] =
    useState<FullCatalogLoadState>({ kind: "loading", scope: "all" });
  const [categoryLoadAttempt, setCategoryLoadAttempt] = useState(0);
  const [fullCatalogLoadAttempt, setFullCatalogLoadAttempt] = useState(0);
  const [selectedFilterId, setSelectedFilterId] = useState("all");
  const [viewMode, setViewMode] = useState<CatalogItemViewMode>("grid");
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const catalogId = useId();
  const catalogPanelId = `${catalogId}-panel`;
  const catalogSearchInputReference = useRef<HTMLInputElement>(null);
  const focusCatalogSearchAfterExpansionReference = useRef(false);
  const catalogTabElementReferences = useRef<
    Partial<Record<EditorCatalogCategory, HTMLButtonElement | null>>
  >({});
  const previousCategoryReference = useRef(category);
  const hasLoadedFullCatalogReference = useRef(false);
  const hasSearchQuery = searchQuery.trim().length > 0;
  const shouldLoadFullCatalog = shouldLoadThumbnails || hasSearchQuery;

  useEffect(() => {
    let hasUnmounted = false;

    setCatalogPanelLoadState({
      kind: "loading",
      scope: "category",
      category,
    });

    void loadCatalogPanelState(category, undefined, locale).then((nextCatalogPanelLoadState) => {
      if (hasUnmounted) {
        return;
      }

      setCatalogPanelLoadState(nextCatalogPanelLoadState);
      if (nextCatalogPanelLoadState.kind === "ready") {
        onReadyCatalogItems?.(nextCatalogPanelLoadState.catalog.items);
      }
    });

    return () => {
      hasUnmounted = true;
    };
  }, [category, categoryLoadAttempt, locale, onReadyCatalogItems]);

  useEffect(() => {
    if (!shouldLoadFullCatalog || hasLoadedFullCatalogReference.current) {
      return;
    }

    let hasUnmounted = false;

    setFullCatalogLoadState({ kind: "loading", scope: "all" });

    void loadFullCatalogPanelState(undefined, locale).then((nextFullCatalogLoadState) => {
      if (hasUnmounted) {
        return;
      }

      setFullCatalogLoadState(nextFullCatalogLoadState);
      const readyCatalogItems = getReadyCatalogItems(nextFullCatalogLoadState);
      if (readyCatalogItems !== null) {
        hasLoadedFullCatalogReference.current = true;
        onReadyCatalogItems?.(readyCatalogItems);
      }
    });

    return () => {
      hasUnmounted = true;
    };
  }, [fullCatalogLoadAttempt, locale, onReadyCatalogItems, shouldLoadFullCatalog]);

  useEffect(() => {
    if (previousCategoryReference.current === category) {
      return;
    }

    previousCategoryReference.current = category;
    setSelectedFilterId("all");
    onSearchQueryChange("");
  }, [category, onSearchQueryChange]);

  useEffect(() => {
    if (!isMobileExpanded || !focusCatalogSearchAfterExpansionReference.current) {
      return;
    }

    focusCatalogSearchAfterExpansionReference.current = false;
    const catalogSearchInput = catalogSearchInputReference.current;
    if (catalogSearchInput === null) {
      throw new Error(
        "Catalog search input is unavailable after expanding the mobile item panel.",
      );
    }

    catalogSearchInput.focus();
  }, [isMobileExpanded]);

  useEffect(() => {
    function handleGlobalCatalogShortcut(
      keyboardEvent: globalThis.KeyboardEvent,
    ): void {
      const hasOpenModal =
        document.querySelector('[aria-modal="true"], dialog[open]') !== null;
      if (!shouldFocusCatalogSearchForShortcut(
        keyboardEvent.key,
        keyboardEvent.target,
        document.activeElement,
        hasOpenModal,
        keyboardEvent,
      )) {
        return;
      }

      keyboardEvent.preventDefault();
      if (
        shouldExpandCatalogPanelBeforeSearchFocus(
          panelPosition,
          isMobileExpanded,
          window.matchMedia("(max-width: 640px)").matches,
        )
      ) {
        focusCatalogSearchAfterExpansionReference.current = true;
        setIsMobileExpanded(true);
        return;
      }

      catalogSearchInputReference.current?.focus();
    }

    window.addEventListener("keydown", handleGlobalCatalogShortcut);
    return () => {
      window.removeEventListener("keydown", handleGlobalCatalogShortcut);
    };
  }, [isMobileExpanded, panelPosition]);

  const activeCatalogPanelLoadState = getActiveCatalogPanelLoadState(
    catalogPanelLoadState,
    fullCatalogLoadState,
    category,
    hasSearchQuery,
  );
  const activeCatalog = activeCatalogPanelLoadState.kind === "ready"
    ? activeCatalogPanelLoadState.catalog
    : null;
  const mapVisibleCatalogItems = activeCatalog === null
    ? null
    : activeCatalog.items.filter((catalogItem) =>
        isCatalogItemVisibleOnMap(catalogItem, mapId),
      );
  const sceneAvailableCatalogItems = mapVisibleCatalogItems === null
    ? null
    : mapVisibleCatalogItems.filter((catalogItem) =>
        getCatalogItemSceneAvailability(catalogItem, mapId) === "available",
      );
  const categoryFilters = sceneAvailableCatalogItems === null
    ? []
    : getCatalogSidebarFilters(sceneAvailableCatalogItems, category);
  const activeFilterId = categoryFilters.some(
    (catalogFilter) => catalogFilter.id === selectedFilterId,
  )
    ? selectedFilterId
    : "all";
  const activeCatalogFilter = categoryFilters.find(
    (catalogFilter) => catalogFilter.id === activeFilterId,
  );
  const activeCatalogFilterLabel = activeCatalogFilter === undefined
    ? copy.all
    : getCatalogFilterOptionLabel(activeCatalogFilter, copy);
  const visibleCatalogItems = mapVisibleCatalogItems === null
    ? null
    : getCatalogSidebarItems(
        mapVisibleCatalogItems,
        category,
        searchQuery,
        activeFilterId,
        locale,
      );
  const visibleCatalogItemCount = visibleCatalogItems?.length ?? null;

  function selectCatalogCategory(nextCategory: EditorCatalogCategory): void {
    if (!editorCatalogCategories.includes(nextCategory)) {
      throw new TypeError(
        `Item catalog received unknown category ${JSON.stringify(nextCategory)}.`,
      );
    }

    setSelectedFilterId("all");
    onSearchQueryChange("");
    onCategoryChange(nextCategory);
  }

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
    selectCatalogCategory(nextCategory);

    const nextCategoryTabElement =
      catalogTabElementReferences.current[nextCategory];

    if (nextCategoryTabElement === null || nextCategoryTabElement === undefined) {
      throw new Error(
        `Catalog tab element is unavailable for category ${JSON.stringify(nextCategory)}.`,
      );
    }

    nextCategoryTabElement.focus();
  }

  function handleSearchInputKeyDown(
    keyboardEvent: KeyboardEvent<HTMLInputElement>,
  ): void {
    if (keyboardEvent.key !== "Escape" || searchQuery.length === 0) {
      return;
    }

    keyboardEvent.preventDefault();
    onSearchQueryChange("");
  }

  function handleCatalogFilterChange(nextFilterId: string): void {
    if (!categoryFilters.some((catalogFilter) => catalogFilter.id === nextFilterId)) {
      throw new Error(
        `Item catalog received unavailable filter ${JSON.stringify(nextFilterId)} for category ${JSON.stringify(category)}.`,
      );
    }

    setSelectedFilterId(nextFilterId);
  }

  function handleCatalogLoadRetry(): void {
    if (activeCatalogPanelLoadState.scope === "all") {
      setFullCatalogLoadAttempt((attempt) => attempt + 1);
      return;
    }

    setCategoryLoadAttempt((attempt) => attempt + 1);
  }

  return (
    <aside
      aria-label={copy.catalogLabel}
      className={`bottom-wrapper item-catalog-panel item-catalog-panel--${panelPosition}${
        panelPosition === "left" ? " left-mode" : ""
      }${leftHandMode ? " left-hand" : ""}`}
      data-expanded={isMobileExpanded}
    >
      <div className="bottom-panel">
        <div className="panel-branding item-catalog-panel__branding">
          <span className="item-catalog-panel__brand">{copy.brand}</span>
          <div className="branding-actions">
            {onOpenModal !== undefined ? (
              <>
                <button
                  aria-label={copy.help}
                  className="branding-btn item-catalog-panel__action"
                  onClick={() => onOpenModal("help-info")}
                  title={copy.help}
                  type="button"
                >
                  <CircleHelp aria-hidden="true" size={18} />
                  <span>{copy.help}</span>
                </button>
                <button
                  aria-label={copy.keyboardShortcuts}
                  className="branding-btn item-catalog-panel__action"
                  onClick={() => onOpenModal("keyboard-shortcuts")}
                  title={copy.keyboardShortcuts}
                  type="button"
                >
                  <Keyboard aria-hidden="true" size={18} />
                  <span>{copy.keyboardShortcuts}</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
        <button
          aria-controls={catalogPanelId}
          aria-expanded={isMobileExpanded}
          className="item-catalog-panel__mobile-toggle"
          onClick={() => setIsMobileExpanded((isExpanded) => !isExpanded)}
          type="button"
        >
          {isMobileExpanded ? (
            <ChevronUp aria-hidden="true" size={18} />
          ) : (
            <ChevronDown aria-hidden="true" size={18} />
          )}
          {isMobileExpanded ? copy.collapseItems : copy.browseItems}
        </button>
        <div className="sidebar-search item-catalog-panel__search-row">
          <div className="search-container">
            <Search aria-hidden="true" size={18} />
            <input
              aria-label={copy.searchAllItems}
              className="search-input item-catalog-panel__search"
              id={`${catalogId}-search`}
              onChange={(changeEvent: ChangeEvent<HTMLInputElement>) =>
                onSearchQueryChange(changeEvent.target.value)
              }
              onKeyDown={handleSearchInputKeyDown}
              placeholder={copy.searchAllItems}
              ref={catalogSearchInputReference}
              type="search"
              value={searchQuery}
            />
            {searchQuery.length > 0 ? (
              <button
                aria-label={copy.clearSearch}
                className="search-toggle item-catalog-panel__clear-search"
                onClick={() => {
                  onSearchQueryChange("");
                  catalogSearchInputReference.current?.focus();
                }}
                title={copy.clearSearch}
                type="button"
              >
                <X aria-hidden="true" size={18} />
              </button>
            ) : null}
          </div>
        </div>
        <div
          aria-label={copy.catalogLabel}
          className="panel-tabs item-catalog-panel__categories"
          role="tablist"
        >
          {editorCatalogCategories.map((catalogCategory) => (
            <button
              aria-controls={catalogPanelId}
              aria-label={copy.categories[catalogCategory]}
              aria-selected={category === catalogCategory}
              className={`tab-icon item-catalog-panel__category${
                category === catalogCategory ? " active" : ""
              }`}
              data-category={catalogCategory}
              id={`${catalogId}-tab-${catalogCategory}`}
              key={catalogCategory}
              onClick={() => selectCatalogCategory(catalogCategory)}
              onKeyDown={(keyboardEvent) =>
                handleCategoryKeyDown(keyboardEvent, catalogCategory)
              }
              ref={(catalogTabElement) => {
                catalogTabElementReferences.current[catalogCategory] =
                  catalogTabElement;
              }}
              role="tab"
              tabIndex={category === catalogCategory ? 0 : -1}
              title={copy.categories[catalogCategory]}
              type="button"
            >
              <CatalogCategoryIcon category={catalogCategory} />
              <span className="tab-label">{copy.categories[catalogCategory]}</span>
            </button>
          ))}
        </div>
        <div className="panel-content item-catalog-panel__content">
          <div className="item-catalog-panel__heading">
            <div className="item-catalog-panel__title-group">
              <h2 className="item-catalog-panel__title">
                {hasSearchQuery ? copy.searchResults : copy.categories[category]}
              </h2>
              {visibleCatalogItemCount === null ? null : (
                <span aria-label={String(visibleCatalogItemCount)} className="item-catalog-panel__count">
                  {visibleCatalogItemCount}
                </span>
              )}
            </div>
            <div className="item-catalog-panel__heading-controls">
              {categoryFilters.length > 1 ? (
                <div className="item-catalog-panel__filter-menu">
                  <Select.Root
                    onValueChange={handleCatalogFilterChange}
                    value={activeFilterId}
                  >
                    <Select.Trigger
                      aria-label={copy.filterItems}
                      className="item-catalog-panel__filter-trigger"
                    >
                      <Select.Value>{activeCatalogFilterLabel}</Select.Value>
                      <Select.Icon aria-hidden="true">
                        <ChevronDown size={16} />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content
                        className="item-catalog-panel__filter-menu-content"
                        collisionPadding={8}
                        position="popper"
                        sideOffset={4}
                      >
                        <Select.Viewport className="item-catalog-panel__filter-menu-list">
                          {categoryFilters.map((catalogFilter) => {
                            const catalogFilterOptionLabel =
                              getCatalogFilterOptionLabel(catalogFilter, copy);

                            return (
                              <Select.Item
                                className="item-catalog-panel__filter-option"
                                key={catalogFilter.id}
                                textValue={catalogFilterOptionLabel}
                                value={catalogFilter.id}
                              >
                                <Select.ItemText>
                                  {catalogFilterOptionLabel}
                                </Select.ItemText>
                                <Select.ItemIndicator aria-hidden="true">
                                  <Check size={16} />
                                </Select.ItemIndicator>
                              </Select.Item>
                            );
                          })}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
              ) : null}
              <div className="item-catalog-panel__views" role="group">
                <button
                  aria-label={copy.gridView}
                  aria-pressed={viewMode === "grid"}
                  className={`item-catalog-panel__view${viewMode === "grid" ? " active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title={copy.gridView}
                  type="button"
                >
                  <LayoutGrid aria-hidden="true" size={18} />
                </button>
                <button
                  aria-label={copy.listView}
                  aria-pressed={viewMode === "list"}
                  className={`item-catalog-panel__view${viewMode === "list" ? " active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title={copy.listView}
                  type="button"
                >
                  <List aria-hidden="true" size={18} />
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
              catalogPanelLoadState={activeCatalogPanelLoadState}
              catalogItems={visibleCatalogItems}
              onRetry={handleCatalogLoadRetry}
              onCatalogItemSelect={onCatalogItemSelect}
              selectedCatalogItemId={selectedCatalogItemId}
              viewMode={viewMode}
              locale={locale}
              mapId={mapId}
              isSearch={hasSearchQuery}
              shouldLoadThumbnails={shouldLoadThumbnails}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

const catalogCategoryIconPaths: Readonly<Record<EditorCatalogCategory, string>> = {
  buildings: "M3 21V12L5 7L12 3L19 7L21 12V21ZM8 21V14H16V21M12 9H12.01",
  crops: "M12 21V11C12 6.5 15.5 3 21 3C21 8.5 17.5 11 12 11M12 15C12 11 8.5 8 3 8C3 12.5 6.5 15 12 15M5 21H19",
  trees: "M12 3L16 8H13.5L18 13H15L21 18H3L9 13H6L10.5 8H8ZM12 18V21",
  equipment: "M10.05 5.46L11.46 4.05A1.5 1.5 0 0 1 13.59 4.05L19.95 10.41A1.5 1.5 0 0 1 19.95 12.54L18.54 13.95A1.5 1.5 0 0 1 16.41 13.95L10.05 7.59A1.5 1.5 0 0 1 10.05 5.46ZM13.23 10.77L4 20",
  paths: "M3 21V5L5 3L7 5V21ZM17 21V5L19 3L21 5V21ZM7 9H17M7 15H17M7 15L17 9",
  lighting: "M12 3C12.9 5.2 15.5 6.2 15.5 8.5A3.5 3.5 0 0 1 8.5 8.5C8.5 7.2 9 6.4 9.8 5.6C10 6.7 10.6 7.2 11.3 7.2C11.5 5.6 11.3 4.4 12 3ZM8.5 16H15.5L13.5 21H10.5ZM3 8.5H4.5M19.5 8.5H21M6 4.5L4.8 3.3M18 4.5L19.2 3.3",
  furniture: "M6 10V6A2 2 0 0 1 8 4H16A2 2 0 0 1 18 6V10M3 12A2 2 0 0 1 7 12V14H17V12A2 2 0 0 1 21 12V17A1 1 0 0 1 20 18H4A1 1 0 0 1 3 17ZM6 18V21M18 18V21",
  decor: "M8 6L12 3L16 6M5 6H19A2 2 0 0 1 21 8V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V8A2 2 0 0 1 5 6ZM7 17L10.5 12.5L13 15.5L14.5 14L17 17",
};

function CatalogCategoryIcon({
  category,
}: Readonly<{
  category: EditorCatalogCategory;
}>) {
  const categoryIconPath = catalogCategoryIconPaths[category];
  if (categoryIconPath === undefined) {
    throw new TypeError(
      `Item catalog does not define an icon for category ${JSON.stringify(category)}.`,
    );
  }

  return (
    <svg aria-hidden="true" height={18} viewBox="0 0 24 24" width={18}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={categoryIconPath} />
      </g>
    </svg>
  );
}

type CatalogPanelContentProperties = Readonly<{
  catalogPresentationChoicesByItemId: ReadonlyMap<
    string,
    CatalogPresentationChoice
  >;
  category: EditorCatalogCategory;
  catalogItems: readonly CatalogItem[] | null;
  catalogPanelLoadState: ActiveCatalogPanelLoadState;
  selectedCatalogItemId: string | null;
  onRetry: () => void;
  onCatalogItemSelect: (
    catalogItem: CatalogItem,
    presentationChoice: CatalogPresentationChoice,
  ) => void;
  shouldLoadThumbnails?: boolean;
  viewMode: CatalogItemViewMode;
  locale: HomepageLocale;
  mapId?: string;
  isSearch?: boolean;
}>;

export function CatalogPanelContent({
  catalogPresentationChoicesByItemId,
  category,
  catalogItems,
  catalogPanelLoadState,
  selectedCatalogItemId,
  onRetry,
  onCatalogItemSelect,
  shouldLoadThumbnails = true,
  viewMode,
  locale,
  mapId = "standard",
  isSearch = false,
}: CatalogPanelContentProperties) {
  const copy = getCatalogPanelCopy(locale);

  if (
    catalogPanelLoadState.kind === "loading" ||
    (catalogPanelLoadState.scope === "category" &&
      catalogPanelLoadState.category !== category)
  ) {
    return (
      <p aria-live="polite" className="item-catalog-panel__state" role="status">
        {copy.loading}
      </p>
    );
  }

  if (catalogPanelLoadState.kind === "error") {
    return (
      <div className="item-catalog-panel__error" role="alert">
        <p>
          {copy.loadFailed} {catalogPanelLoadState.message}
        </p>
        <button onClick={onRetry} type="button">
          {copy.retry}
        </button>
      </div>
    );
  }

  if (catalogItems === null) {
    throw new Error(
      `Ready catalog panel state for scope ${JSON.stringify(catalogPanelLoadState.scope)} has no filtered catalog items.`,
    );
  }

  if (catalogItems.length === 0) {
    return (
      <p aria-live="polite" className="item-catalog-panel__state" role="status">
        {copy.noResults}
      </p>
    );
  }

  return (
    <CatalogItemGrid
      catalogItems={catalogItems}
      catalogPresentationChoicesByItemId={catalogPresentationChoicesByItemId}
      onCatalogItemSelect={onCatalogItemSelect}
      selectedCatalogItemId={selectedCatalogItemId}
      shouldLoadThumbnails={shouldLoadThumbnails}
      viewMode={viewMode}
      locale={locale}
      mapId={mapId}
      isSearch={isSearch}
    />
  );
}

export function CatalogItemGrid({
  catalogItems,
  catalogPresentationChoicesByItemId,
  selectedCatalogItemId,
  onCatalogItemSelect,
  shouldLoadThumbnails = true,
  viewMode = "grid",
  locale = "en",
  mapId = "standard",
  isSearch = false,
}: CatalogItemGridProperties) {
  const itemGridScrollRootReference = useRef<HTMLDivElement>(null);
  const copy = getCatalogPanelCopy(locale);
  const { availableCatalogItems, unavailableCatalogItems } =
    getCatalogItemSceneGroups(catalogItems, mapId);
  const unavailableGroupLabel = unavailableCatalogItems.length === 0
    ? null
    : copy.unavailableGroup(unavailableCatalogItems.length, isSearch);

  function renderCatalogItem(
    catalogItem: CatalogItem,
    availability: CatalogItemSceneAvailability,
  ) {
    const isSelectedCatalogItem = catalogItem.id === selectedCatalogItemId;
    const presentationChoice = getControlledCatalogItemChoice(
      catalogItem,
      catalogPresentationChoicesByItemId,
    );
    const displayName = getCatalogSidebarDisplayName(catalogItem, locale);
    const unavailableReason = availability === "available"
      ? null
      : copy.sceneAvailabilityReason(availability);
    const selectionLabel = unavailableReason === null
      ? copy.selectItem(
          displayName,
          catalogItem.tileSize.width,
          catalogItem.tileSize.height,
        )
      : `${copy.selectItem(
          displayName,
          catalogItem.tileSize.width,
          catalogItem.tileSize.height,
        )}. ${unavailableReason}`;
    const itemNameTitle = unavailableReason === null
      ? displayName
      : `${displayName}. ${unavailableReason}`;
    const litVariantLabel = readLitBigCraftableVariantLabel(
      catalogItem,
      presentationChoice,
      copy,
    );
    const accessibleSelectionLabel = appendLitVariantLabel(
      selectionLabel,
      litVariantLabel,
    );
    const itemTitle = appendLitVariantLabel(itemNameTitle, litVariantLabel);

    return (
      <div
        className="item-catalog-panel__item-container"
        key={catalogItem.id}
        role="listitem"
      >
        <button
          aria-label={accessibleSelectionLabel}
          aria-pressed={isSelectedCatalogItem}
          className={`icon-cell item-catalog-panel__item${
            isSelectedCatalogItem ? " selected" : ""
          }`}
          data-scene-availability={availability}
          data-selected={isSelectedCatalogItem}
          onClick={() =>
            onCatalogItemSelect(
              catalogItem,
              resolveCatalogItemCardSelectionChoice(
                catalogItem,
                presentationChoice,
                isSelectedCatalogItem,
              ),
            )
          }
          title={itemTitle}
          type="button"
        >
          <span aria-hidden="true" className="item-catalog-panel__art">
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
            ) : catalogItem.renderingMetadata?.kind === "lit-big-craftable" ? (
              <CatalogLitThumbnail
                bodyStyle={getCatalogItemThumbnailStyle(
                  catalogItem,
                  presentationChoice,
                  shouldLoadThumbnails,
                  viewMode,
                )}
                catalogItem={catalogItem}
                presentationChoice={presentationChoice}
                shouldLoadThumbnail={shouldLoadThumbnails}
                thumbnailClassName="item-catalog-panel__thumbnail"
              />
            ) : (
              <span
                aria-hidden="true"
                className="item-catalog-panel__thumbnail"
                style={getCatalogItemThumbnailStyle(
                  catalogItem,
                  presentationChoice,
                  shouldLoadThumbnails,
                  viewMode,
                )}
              />
            )}
          </span>
          <span aria-hidden="true" className="item-catalog-panel__item-name">
            {displayName}
          </span>
          <span className="sr-only">
            {unavailableReason === null ? null : `${unavailableReason} `}
            {displayName}, {catalogItem.tileSize.width} × {catalogItem.tileSize.height}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      aria-label={copy.catalogLabel}
      className={`item-grid item-catalog-panel__grid item-catalog-panel__items${
        viewMode === "list" ? " item-catalog-panel__grid--list" : ""
      }`}
      role="list"
      ref={itemGridScrollRootReference}
    >
      {availableCatalogItems.map((catalogItem) =>
        renderCatalogItem(catalogItem, "available"),
      )}
      {unavailableGroupLabel === null ? null : (
        <div
          aria-level={3}
          className="item-catalog-panel__unavailable-divider"
          role="heading"
        >
          {unavailableGroupLabel}
        </div>
      )}
      {unavailableCatalogItems.map(({ catalogItem, availability }) =>
        renderCatalogItem(catalogItem, availability),
      )}
    </div>
  );
}

function getCatalogItemSceneGroups(
  catalogItems: readonly CatalogItem[],
  mapId: string,
): CatalogItemSceneGroups {
  const availableCatalogItems: CatalogItem[] = [];
  const unavailableCatalogItems: UnavailableCatalogItem[] = [];

  for (const catalogItem of catalogItems) {
    const availability = getCatalogItemSceneAvailability(catalogItem, mapId);
    if (availability === "available") {
      availableCatalogItems.push(catalogItem);
    } else {
      unavailableCatalogItems.push({ catalogItem, availability });
    }
  }

  return { availableCatalogItems, unavailableCatalogItems };
}

function getCatalogFilterOptionLabel(
  catalogFilter: CatalogPanelFilterOption,
  copy: CatalogPanelCopy,
): string {
  const catalogFilterLabel = catalogFilter.id === "all"
    ? copy.all
    : copy.filterLabels[catalogFilter.id] ?? catalogFilter.label;

  return `${catalogFilterLabel} (${String(catalogFilter.count)})`;
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

export function resolveCatalogItemCardSelectionChoice(
  catalogItem: CatalogItem,
  presentationChoice: CatalogPresentationChoice,
  isSelectedCatalogItem: boolean,
): CatalogPresentationChoice {
  const validatedChoice = validateCatalogItemPresentationChoice(
    catalogItem,
    presentationChoice,
  );
  if (typeof isSelectedCatalogItem !== "boolean") {
    throw new TypeError(
      `Catalog item card selection flag for ${JSON.stringify(catalogItem.id)} must be a boolean; received ${JSON.stringify(isSelectedCatalogItem)}.`,
    );
  }
  if (!isSelectedCatalogItem || !isLitBigCraftableCatalogItem(catalogItem)) {
    return validatedChoice;
  }

  const presentationCapabilities = catalogItem.presentationCapabilities;
  if (
    presentationCapabilities === undefined
    || presentationCapabilities.variantCycle?.count !== 2
  ) {
    throw new Error(
      `Lit BigCraftable catalog item ${JSON.stringify(catalogItem.id)} requires a 2-step variant cycle; received ${JSON.stringify(presentationCapabilities)}.`,
    );
  }

  return getNextSelectedCatalogPresentationChoice(
    catalogItem.id,
    presentationCapabilities,
    validatedChoice,
  );
}

function readLitBigCraftableVariantLabel(
  catalogItem: CatalogItem,
  presentationChoice: CatalogPresentationChoice,
  copy: CatalogPanelCopy,
): string | null {
  if (!isLitBigCraftableCatalogItem(catalogItem)) {
    return null;
  }

  const presentationCapabilities = catalogItem.presentationCapabilities;
  if (
    presentationCapabilities === undefined
    || presentationCapabilities.variantCycle?.count !== 2
  ) {
    throw new Error(
      `Lit BigCraftable catalog item ${JSON.stringify(catalogItem.id)} requires a 2-step variant cycle; received ${JSON.stringify(presentationCapabilities)}.`,
    );
  }

  const visibleVariant = presentationCapabilities.visibleVariants.find(
    (variant) => variant.value === presentationChoice.variant,
  );
  if (visibleVariant === undefined) {
    throw new Error(
      `Lit BigCraftable catalog item ${JSON.stringify(catalogItem.id)} has no visible variant ${String(presentationChoice.variant)}; received ${JSON.stringify(presentationCapabilities.visibleVariants)}.`,
    );
  }

  const localizedLabel = copy.variantLabels[visibleVariant.label];
  if (localizedLabel === undefined) {
    throw new Error(
      `Lit BigCraftable catalog item ${JSON.stringify(catalogItem.id)} variant label ${JSON.stringify(visibleVariant.label)} has no catalog copy.`,
    );
  }
  return localizedLabel;
}

function appendLitVariantLabel(
  label: string,
  litVariantLabel: string | null,
): string {
  return litVariantLabel === null ? label : `${label}, ${litVariantLabel}`;
}

function isLitBigCraftableCatalogItem(catalogItem: CatalogItem): boolean {
  return catalogItem.renderingMetadata?.kind === "lit-big-craftable";
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
  catalogPanelLoader?: CatalogPanelLoader,
  locale: HomepageLocale = "en",
): Promise<CatalogPanelLoadState> {
  validateCatalogPanelCategory(category);
  assertCatalogPanelLocale(locale);
  const resolvedCatalogPanelLoader = catalogPanelLoader ?? (() =>
    loadSidebarCatalogCategory(category));

  try {
    return {
      kind: "ready",
      scope: "category",
      category,
      catalog: await resolvedCatalogPanelLoader(),
    };
  } catch (caughtError) {
    return {
      kind: "error",
      scope: "category",
      category,
      message: formatCatalogLoadError(caughtError, locale),
    };
  }
}

function getActiveCatalogPanelLoadState(
  categoryCatalogLoadState: CatalogPanelLoadState,
  fullCatalogLoadState: FullCatalogLoadState,
  category: EditorCatalogCategory,
  hasSearchQuery: boolean,
): ActiveCatalogPanelLoadState {
  if (hasSearchQuery) {
    return fullCatalogLoadState;
  }

  if (
    categoryCatalogLoadState.kind === "ready" &&
    categoryCatalogLoadState.category === category
  ) {
    return categoryCatalogLoadState;
  }

  if (fullCatalogLoadState.kind === "ready") {
    return fullCatalogLoadState;
  }

  if (categoryCatalogLoadState.category === category) {
    return categoryCatalogLoadState;
  }

  return { kind: "loading", scope: "category", category };
}

export async function loadFullCatalogPanelState(
  catalogPanelLoader?: CatalogPanelLoader,
  locale: HomepageLocale = "en",
): Promise<FullCatalogLoadState> {
  assertCatalogPanelLocale(locale);
  const resolvedCatalogPanelLoader = catalogPanelLoader ?? loadSidebarCatalog;

  try {
    return {
      kind: "ready",
      scope: "all",
      catalog: await resolvedCatalogPanelLoader(),
    };
  } catch (caughtError) {
    return {
      kind: "error",
      scope: "all",
      message: formatCatalogLoadError(caughtError, locale),
    };
  }
}

export function getReadyCatalogItems(
  fullCatalogLoadState: FullCatalogLoadState,
): readonly CatalogItem[] | null {
  return fullCatalogLoadState.kind === "ready"
    ? fullCatalogLoadState.catalog.items
    : null;
}

export function getCatalogItemsForPanel(
  catalog: Catalog,
  category: EditorCatalogCategory,
  searchQuery: string,
  filterId = "all",
  locale: HomepageLocale = "en",
): readonly CatalogItem[] {
  validateCatalogPanelCategory(category);
  validateCatalogSearchQuery(searchQuery);
  validateCatalogFilterId(filterId);
  assertCatalogPanelLocale(locale);

  if (!Array.isArray(catalog.items)) {
    throw new TypeError(
      `Catalog items must be an array. Received: ${describeCatalogPanelValue(catalog.items)}.`,
    );
  }

  return getCatalogSidebarItems(catalog.items, category, searchQuery, filterId, locale);
}

export function getCatalogItemThumbnailStyle(
  catalogItem: CatalogItem,
  presentationChoice: CatalogPresentationChoice,
  shouldLoadThumbnail = true,
  viewMode: CatalogItemViewMode = "grid",
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
    getDefaultCatalogThumbnailSprite(catalogItem, validatedChoice.variant) ??
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

  const maximumSpriteDimension = viewMode === "list" ? 24 : 60;
  const thumbnailScale =
    catalogItem.category === "building"
      ? 1
      : cropRenderingMetadata !== undefined
        ? Math.min(
            maximumSpriteDimension / spriteSize.width,
            maximumSpriteDimension / spriteSize.height,
            2.5,
          )
      : Math.min(
          maximumSpriteDimension / spriteSize.width,
          maximumSpriteDimension / spriteSize.height,
          4,
        );
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
  presentationVariant = 0,
): CatalogItem["sprite"] | undefined {
  const seasonalSpringFrame = getSeasonalPlaceableFrame(
    catalogItem,
    "spring",
    presentationVariant,
  );
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

  const columnCount = 4;
  const rowCount = Math.ceil(editorCatalogCategories.length / columnCount);
  const currentRow = Math.floor(currentCategoryIndex / columnCount);
  const currentColumn = currentCategoryIndex % columnCount;

  if (keyboardKey === "ArrowLeft") {
    const previousColumn = (currentColumn - 1 + columnCount) % columnCount;
    return editorCatalogCategories[currentRow * columnCount + previousColumn] ?? null;
  }

  if (keyboardKey === "ArrowRight") {
    const nextColumn = (currentColumn + 1) % columnCount;
    return editorCatalogCategories[currentRow * columnCount + nextColumn] ?? null;
  }

  if (keyboardKey === "ArrowUp") {
    const previousRow = (currentRow - 1 + rowCount) % rowCount;
    return editorCatalogCategories[previousRow * columnCount + currentColumn] ?? null;
  }

  if (keyboardKey === "ArrowDown") {
    const nextRow = (currentRow + 1) % rowCount;
    return editorCatalogCategories[nextRow * columnCount + currentColumn] ?? null;
  }

  return null;
}

export function shouldFocusCatalogSearchForShortcut(
  keyboardKey: string,
  eventTarget: EventTarget | null,
  activeElement: EventTarget | null,
  hasOpenModal: boolean,
  modifiers: Readonly<{
    altKey?: boolean;
    ctrlKey?: boolean;
    metaKey?: boolean;
  }> = {},
): boolean {
  if (
    keyboardKey !== "/" ||
    hasOpenModal ||
    modifiers.altKey === true ||
    modifiers.ctrlKey === true ||
    modifiers.metaKey === true
  ) {
    return false;
  }

  return !isCatalogTextEntryTarget(eventTarget) &&
    !isCatalogTextEntryTarget(activeElement);
}

export function shouldExpandCatalogPanelBeforeSearchFocus(
  panelPosition: EditorPanelPosition,
  isMobileExpanded: boolean,
  isMobileViewport: boolean,
): boolean {
  return panelPosition === "bottom" &&
    isMobileViewport &&
    !isMobileExpanded;
}

function isCatalogTextEntryTarget(eventTarget: EventTarget | null): boolean {
  if (eventTarget === null || typeof eventTarget !== "object") {
    return false;
  }

  const target = eventTarget as EventTarget & Readonly<{
    tagName?: string;
    isContentEditable?: boolean;
    closest?: (selector: string) => Element | null;
  }>;
  const tagName = target.tagName?.toUpperCase();
  if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
    return true;
  }

  if (target.isContentEditable === true) {
    return true;
  }

  return target.closest?.('[contenteditable]:not([contenteditable="false"])') != null;
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

function assertCatalogPanelLocale(
  locale: HomepageLocale,
): asserts locale is HomepageLocale {
  if (locale === "en" || locale === "zh-CN" || locale === "ru") {
    return;
  }
  throw new TypeError(
    `Catalog panel locale must be "en", "zh-CN", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function formatCatalogLoadError(
  caughtError: unknown,
  locale: HomepageLocale,
): string {
  assertCatalogPanelLocale(locale);
  if (caughtError instanceof Error) {
    const causeMessage = formatCatalogLoadErrorCause(caughtError.cause);

    if (locale === "ru") {
      return causeMessage === null
        ? `Не удалось загрузить локальный каталог предметов: ${caughtError.message}`
        : `Не удалось загрузить локальный каталог предметов: ${caughtError.message} Причина: ${causeMessage}`;
    }

    return causeMessage === null
      ? `Unable to load the local item catalog: ${caughtError.message}`
      : `Unable to load the local item catalog: ${caughtError.message} Cause: ${causeMessage}`;
  }

  if (locale === "ru") {
    return `Не удалось загрузить локальный каталог предметов: ${describeCatalogPanelValue(caughtError)}`;
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

function validateCatalogFilterId(filterId: string): void {
  if (typeof filterId !== "string" || filterId.trim().length === 0) {
    throw new TypeError(
      `Catalog filter ID must be a non-empty string. Received: ${describeCatalogPanelValue(filterId)}.`,
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
