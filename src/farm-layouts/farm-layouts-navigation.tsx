"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { DockIconButton } from "@/components/ui/dock";
import type { HomepageDisplayLocale } from "../homepage/homepage-locale";
import {
  activateFarmLayoutsCategory,
  createClosedFarmLayoutsNavigationInteraction,
  getFarmLayoutsNavigationCategoryFocusKey,
  getFarmLayoutsNavigationPageFocusKey,
  isFarmLayoutsNavigationKey,
  moveFarmLayoutsNavigationFocus,
  openFarmLayoutsCategoryFromPointerHover,
  openFarmLayoutsNavigationFromPointerHover,
  readCompactFarmLayoutsNavigation,
  readFineFarmLayoutsPointer,
  returnFarmLayoutsNavigationToCategories,
  toggleFarmLayoutsNavigation,
  FARM_LAYOUTS_NAVIGATION_BACK_FOCUS_KEY,
  FARM_LAYOUTS_NAVIGATION_TRIGGER_FOCUS_KEY,
  type FarmLayoutsNavigationInteraction,
} from "./farm-layouts-navigation-interaction";
import {
  getFarmLayoutsNavigationModel,
  readFarmLayoutsNavigationCategory,
  type FarmLayoutsNavigationCategory,
} from "./farm-layouts-navigation-model";
import styles from "./farm-layouts-navigation.module.css";

type FarmLayoutsNavigationProps = Readonly<{
  locale: HomepageDisplayLocale;
}>;

type FarmLayoutsFlyoutPosition = Readonly<{
  left: number;
  top: number;
}>;

export function FarmLayoutsNavigation({ locale }: FarmLayoutsNavigationProps) {
  const model = getFarmLayoutsNavigationModel(locale);
  const navigationPanelId = useId();
  const navigationRef = useRef<HTMLDivElement>(null);
  const [interaction, setInteraction] = useState<FarmLayoutsNavigationInteraction>(
    createClosedFarmLayoutsNavigationInteraction,
  );
  const [flyoutPosition, setFlyoutPosition] =
    useState<FarmLayoutsFlyoutPosition | null>(null);
  const isFlyoutPositioned = flyoutPosition !== null;

  useEffect(() => {
    if (
      interaction.focusKey === null ||
      (interaction.focusKey !== FARM_LAYOUTS_NAVIGATION_TRIGGER_FOCUS_KEY &&
        !isFlyoutPositioned)
    ) {
      return;
    }

    const navigation = navigationRef.current;
    if (navigation === null) {
      throw new Error(
        `Farm Layouts navigation cannot focus ${JSON.stringify(interaction.focusKey)} because its root is missing.`,
      );
    }

    const focusTarget = navigation.querySelector<HTMLElement>(
      `[data-farm-layouts-focus-key="${interaction.focusKey}"]`,
    );
    if (focusTarget === null) {
      throw new Error(
        `Unknown Farm Layouts navigation focus key ${JSON.stringify(interaction.focusKey)}.`,
      );
    }

    focusTarget.focus({ preventScroll: true });
  }, [interaction.focusKey, isFlyoutPositioned]);

  useEffect(() => {
    function closeOnOutsidePointerDown(event: PointerEvent) {
      const navigation = navigationRef.current;
      if (navigation === null) {
        throw new Error(
          "Farm Layouts navigation root is missing during outside-pointer handling.",
        );
      }

      const eventTarget = event.target;
      if (eventTarget instanceof Node && navigation.contains(eventTarget)) {
        return;
      }

      setInteraction(createClosedFarmLayoutsNavigationInteraction());
      setFlyoutPosition(null);
    }

    document.addEventListener("pointerdown", closeOnOutsidePointerDown);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointerDown);
    };
  }, []);

  useEffect(() => {
    if (interaction.panel === "closed") {
      return;
    }

    function updateFlyoutPosition() {
      const navigation = navigationRef.current;
      if (navigation === null) {
        throw new Error(
          "Farm Layouts navigation root disappeared while its flyout was open.",
        );
      }

      const trigger = navigation.querySelector<HTMLElement>(
        "[data-farm-layouts-navigation-trigger]",
      );
      if (trigger === null) {
        throw new Error(
          "Farm Layouts navigation trigger is missing while its flyout is open.",
        );
      }

      const viewportWidth = window.innerWidth;
      if (!Number.isFinite(viewportWidth) || viewportWidth <= 0) {
        throw new TypeError(
          `Farm Layouts navigation viewport width must be a positive number; received ${JSON.stringify(viewportWidth)}.`,
        );
      }

      const triggerBounds = trigger.getBoundingClientRect();
      const navigationBounds = navigation.getBoundingClientRect();
      const compact = readCompactFarmLayoutsNavigation(
        readFarmLayoutsMatchMedia(),
      );
      const sidePadding = Math.min(12, viewportWidth / 2);
      const availableWidth = Math.max(1, viewportWidth - sidePadding * 2);
      const flyoutWidth = compact ? Math.min(352, availableWidth) : 520;
      const maximumLeft = Math.max(
        sidePadding,
        viewportWidth - sidePadding - flyoutWidth,
      );
      const leftInViewport = Math.max(
        sidePadding,
        Math.min(triggerBounds.left, maximumLeft),
      );

      setFlyoutPosition({
        left: leftInViewport - navigationBounds.left,
        top: navigationBounds.height,
      });
    }

    function closeOnEscapeOutsideNavigation(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      const navigation = navigationRef.current;
      if (navigation === null) {
        throw new Error(
          "Farm Layouts navigation root is missing during outside-Escape handling.",
        );
      }

      const eventTarget = event.target;
      if (eventTarget instanceof Node && navigation.contains(eventTarget)) {
        return;
      }

      event.preventDefault();
      setInteraction(createClosedFarmLayoutsNavigationInteraction());
      setFlyoutPosition(null);
    }

    updateFlyoutPosition();
    window.addEventListener("resize", updateFlyoutPosition);
    window.addEventListener("scroll", updateFlyoutPosition, true);
    document.addEventListener("keydown", closeOnEscapeOutsideNavigation);

    return () => {
      window.removeEventListener("resize", updateFlyoutPosition);
      window.removeEventListener("scroll", updateFlyoutPosition, true);
      document.removeEventListener("keydown", closeOnEscapeOutsideNavigation);
    };
  }, [interaction.panel]);

  function onTriggerClick() {
    if (
      readFineFarmLayoutsPointer(readFarmLayoutsMatchMedia()) &&
      interaction.panel !== "closed"
    ) {
      return;
    }

    setFlyoutPosition(null);
    setInteraction((current) => toggleFarmLayoutsNavigation(current));
  }

  function onNavigationPointerEnter() {
    if (!readFineFarmLayoutsPointer(readFarmLayoutsMatchMedia())) {
      return;
    }

    setInteraction((current) =>
      openFarmLayoutsNavigationFromPointerHover(current),
    );
  }

  function onNavigationPointerLeave() {
    if (!readFineFarmLayoutsPointer(readFarmLayoutsMatchMedia())) {
      return;
    }

    const navigation = navigationRef.current;
    const focusedKey = readFarmLayoutsFocusKey(document.activeElement);
    if (
      navigation !== null &&
      navigation.contains(document.activeElement) &&
      focusedKey !== null &&
      focusedKey !== FARM_LAYOUTS_NAVIGATION_TRIGGER_FOCUS_KEY
    ) {
      return;
    }

    setInteraction(createClosedFarmLayoutsNavigationInteraction());
    setFlyoutPosition(null);
  }

  function onNavigationKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!isFarmLayoutsNavigationKey(event.key)) {
      return;
    }

    const currentFocusKey = readFarmLayoutsFocusKey(event.target);
    if (currentFocusKey === null) {
      return;
    }

    const nextInteraction = moveFarmLayoutsNavigationFocus({
      compact: readCompactFarmLayoutsNavigation(readFarmLayoutsMatchMedia()),
      currentFocusKey,
      interaction,
      key: event.key,
      model,
    });

    if (nextInteraction === interaction) {
      return;
    }

    event.preventDefault();
    setInteraction(nextInteraction);
    if (nextInteraction.panel === "closed") {
      setFlyoutPosition(null);
    }
  }

  function onNavigationBlur(event: FocusEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }

    setInteraction(createClosedFarmLayoutsNavigationInteraction());
    setFlyoutPosition(null);
  }

  function onCategoryPointerEnter(categoryId: string) {
    if (!readFineFarmLayoutsPointer(readFarmLayoutsMatchMedia())) {
      return;
    }

    setInteraction((current) =>
      openFarmLayoutsCategoryFromPointerHover(current, categoryId),
    );
  }

  function onCategoryClick(categoryId: string) {
    const compact = readCompactFarmLayoutsNavigation(
      readFarmLayoutsMatchMedia(),
    );
    setInteraction((current) =>
      activateFarmLayoutsCategory(current, categoryId, compact),
    );
  }

  function onBackToCategories() {
    setInteraction((current) =>
      returnFarmLayoutsNavigationToCategories(current),
    );
  }

  const isNavigationOpen = interaction.panel !== "closed";
  const isCompactNavigation = readCompactFarmLayoutsNavigation(
    readFarmLayoutsMatchMedia(),
  );
  const isCategoryPanelVisible =
    isNavigationOpen &&
    !(isCompactNavigation && interaction.panel === "category");
  const isPagePanelVisible = interaction.panel === "category";
  const selectedCategory =
    interaction.openCategoryId === null
      ? null
      : readFarmLayoutsNavigationCategory(model, interaction.openCategoryId);
  const renderedCategory =
    selectedCategory ?? readFarmLayoutsNavigationCategory(model, "farm-maps");
  const renderedCategoryIndex = readFarmLayoutsNavigationCategoryIndex(
    model.categories,
    renderedCategory.id,
  );
  const pagePanelStyle = {
    "--farm-layouts-category-index": renderedCategoryIndex,
  } as CSSProperties;
  const positionStyle =
    flyoutPosition === null
      ? undefined
      : {
          left: flyoutPosition.left,
          top: flyoutPosition.top,
        };

  return (
    <div
      className={styles.farmLayoutsNavigation}
      data-farm-layouts-navigation={locale}
      data-open={isNavigationOpen ? "true" : "false"}
      data-panel={interaction.panel}
      onBlur={onNavigationBlur}
      onKeyDown={onNavigationKeyDown}
      onPointerEnter={onNavigationPointerEnter}
      onPointerLeave={onNavigationPointerLeave}
      ref={navigationRef}
    >
      <DockIconButton
        aria-controls={navigationPanelId}
        aria-expanded={isNavigationOpen}
        aria-haspopup="true"
        data-farm-layouts-focus-key={FARM_LAYOUTS_NAVIGATION_TRIGGER_FOCUS_KEY}
        data-farm-layouts-navigation-trigger=""
        label={model.triggerLabel}
        onClick={onTriggerClick}
      />
      <div
        aria-hidden={isNavigationOpen ? undefined : true}
        className={styles.flyout}
        data-positioned={flyoutPosition === null ? "false" : "true"}
        id={navigationPanelId}
        style={positionStyle}
      >
        <div className={styles.categoryColumn}>
          <div
            aria-hidden={isCategoryPanelVisible ? undefined : true}
            aria-labelledby={`${navigationPanelId}-category-title`}
            className={styles.categoryPanel}
            data-farm-layouts-category-panel=""
            id={`${navigationPanelId}-categories`}
            role="group"
          >
            <p
              className={styles.panelTitle}
              id={`${navigationPanelId}-category-title`}
            >
              {model.categoryPanelTitle}
            </p>
            {model.categories.map((category) => {
              const isSelectedCategory =
                interaction.panel === "category" &&
                interaction.openCategoryId === category.id;

              return (
                <button
                  aria-controls={`${navigationPanelId}-page`}
                  aria-expanded={isSelectedCategory}
                  aria-haspopup="true"
                  className={styles.row}
                  data-farm-layouts-focus-key={
                    getFarmLayoutsNavigationCategoryFocusKey(category.id)
                  }
                  data-farm-layouts-category={category.id}
                  key={category.id}
                  onClick={() => onCategoryClick(category.id)}
                  onPointerEnter={() => onCategoryPointerEnter(category.id)}
                  tabIndex={-1}
                  type="button"
                >
                  <span>{category.label}</span>
                  <ChevronRight
                    aria-hidden="true"
                    className={styles.chevron}
                    size={16}
                    strokeWidth={2}
                  />
                </button>
              );
            })}
          </div>
          <div
            aria-hidden={isPagePanelVisible ? undefined : true}
            aria-labelledby={`${navigationPanelId}-page-title`}
            className={styles.pagePanel}
            data-farm-layouts-page-panel={renderedCategory.id}
            data-farm-layouts-page-panel-open={
              isPagePanelVisible ? "true" : "false"
            }
            id={`${navigationPanelId}-page`}
            role="group"
            style={pagePanelStyle}
          >
            <div className={styles.pagePanelInner}>
              <p
                className={styles.panelTitle}
                id={`${navigationPanelId}-page-title`}
              >
                {renderedCategory.label}
              </p>
              <button
                className={styles.backButton}
                data-farm-layouts-focus-key={
                  FARM_LAYOUTS_NAVIGATION_BACK_FOCUS_KEY
                }
                onClick={onBackToCategories}
                tabIndex={-1}
                type="button"
              >
                <span className="inline-flex items-center gap-1">
                  <ArrowLeft aria-hidden="true" size={16} strokeWidth={2} />
                  {model.backToCategoriesLabel}
                </span>
              </button>
              {renderedCategory.pages.length === 0 ? (
                <p
                  className={styles.emptyState}
                  data-farm-layouts-empty-state={renderedCategory.id}
                >
                  {model.emptyStateLabel}
                </p>
              ) : (
                renderedCategory.pages.map((page) => (
                  <a
                    className={styles.row}
                    data-farm-layouts-focus-key={
                      getFarmLayoutsNavigationPageFocusKey(page.id)
                    }
                    data-farm-layouts-page={page.id}
                    href={page.href}
                    key={page.id}
                    tabIndex={-1}
                  >
                    <span>{page.label}</span>
                    <ChevronRight
                      aria-hidden="true"
                      className={styles.chevron}
                      size={16}
                      strokeWidth={2}
                    />
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function readFarmLayoutsNavigationCategoryIndex(
  categories: readonly FarmLayoutsNavigationCategory[],
  categoryId: string,
): number {
  const categoryIndex = categories.findIndex(
    (category) => category.id === categoryId,
  );
  if (categoryIndex < 0) {
    throw new Error(
      `Farm Layouts navigation category ${JSON.stringify(categoryId)} is missing from ${JSON.stringify(categories.map((category) => category.id))}.`,
    );
  }

  return categoryIndex;
}

function readFarmLayoutsMatchMedia():
  | ((query: string) => { matches: boolean })
  | undefined {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return undefined;
  }

  return window.matchMedia.bind(window);
}

function readFarmLayoutsFocusKey(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) {
    return null;
  }

  const focusTarget = target.closest("[data-farm-layouts-focus-key]");
  if (focusTarget === null) {
    return null;
  }

  const focusKey = focusTarget.getAttribute("data-farm-layouts-focus-key");
  if (focusKey === null || focusKey.length === 0) {
    throw new Error(
      `Unknown Farm Layouts navigation focus key ${JSON.stringify(focusKey)}.`,
    );
  }

  return focusKey;
}
