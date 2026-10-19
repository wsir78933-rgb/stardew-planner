"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { DockIconButton } from "@/components/ui/dock";
import {
  activateToolsNavigationCategory,
  activateToolsNavigationTrigger,
  closeToolsNavigationOnPointerLeave,
  createClosedToolsNavigationInteraction,
  hoverToolsNavigationAllTools,
  hoverToolsNavigationCategory,
  isToolsNavigationMenuKey,
  moveToolsNavigationFocus,
  openToolsNavigationFromPointerHover,
  readFineHoverPointer,
  readToolsNavigationCategoryFocusKey,
  readToolsNavigationCategoryIdFromFocusKey,
  readToolsNavigationToolFocusKey,
  readToolsNavigationToolIdFromFocusKey,
  returnToToolsNavigationCategories,
  TOOLS_NAVIGATION_ALL_TOOLS_FOCUS_KEY,
  TOOLS_NAVIGATION_BACK_FOCUS_KEY,
  TOOLS_NAVIGATION_TRIGGER_FOCUS_KEY,
  type ToolsNavigationInteraction,
} from "./tools-navigation-interaction";
import {
  getToolsNavigationModel,
  readToolsNavigationCategory,
  readToolsNavigationTool,
  type ToolsNavigationCategory,
  type ToolsNavigationLocale,
  type ToolsNavigationModel,
  type ToolsNavigationTool,
} from "./tools-navigation-model";
import styles from "./tools-navigation-menu.module.css";

type ToolsNavigationMenuProps = Readonly<{
  locale: ToolsNavigationLocale;
}>;

export function ToolsNavigationMenu({ locale }: ToolsNavigationMenuProps) {
  const model = getToolsNavigationModel(locale);
  const categoryPanelId = useId();
  const navigationRef = useRef<HTMLDivElement>(null);
  const [interaction, setInteraction] = useState<ToolsNavigationInteraction>(
    createClosedToolsNavigationInteraction,
  );

  useEffect(() => {
    focusToolsNavigationKey(navigationRef.current, interaction.focusKey);
  }, [interaction.focusKey]);

  function onNavigationPointerEnter() {
    if (!readFineHoverPointer(readToolsNavigationMatchMedia())) {
      return;
    }

    setInteraction((current) => openToolsNavigationFromPointerHover(current));
  }

  function onNavigationPointerLeave() {
    setInteraction(closeToolsNavigationOnPointerLeave());
  }

  function onNavigationClick(event: MouseEvent<HTMLDivElement>) {
    if (!isToolsNavigationTriggerTarget(event.target)) {
      return;
    }

    if (readFineHoverPointer(readToolsNavigationMatchMedia())) {
      return;
    }

    event.preventDefault();
    setInteraction((current) => activateToolsNavigationTrigger(current));
  }

  function onNavigationKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!isToolsNavigationMenuKey(event.key)) {
      return;
    }

    const currentFocusKey = readToolsNavigationEventFocusKey(event.target);
    if (currentFocusKey === null) {
      return;
    }

    event.preventDefault();
    const canHoverFinePointer = readFineHoverPointer(readToolsNavigationMatchMedia());
    setInteraction((current) =>
      moveToolsNavigationFocus({
        canHoverFinePointer,
        categoryIds: model.categories.map((category) => category.id),
        currentFocusKey,
        interaction: current,
        key: event.key,
        toolIds: readToolsNavigationToolIdsForFocus(
          model,
          currentFocusKey,
          current.openCategoryId,
        ),
      }),
    );
  }

  function onNavigationBlur(event: FocusEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }

    setInteraction((current) => {
      if (current.suppressHover && !current.isCategoryPanelOpen) {
        return current;
      }

      if (isClosedToolsNavigationInteraction(current)) {
        return current;
      }

      return closeToolsNavigationOnPointerLeave();
    });
  }

  function onCategoryPointerEnter(categoryId: string) {
    readToolsNavigationCategory(model, categoryId);
    if (!readFineHoverPointer(readToolsNavigationMatchMedia())) {
      return;
    }

    setInteraction((current) => {
      if (current.suppressHover) {
        return current;
      }

      return hoverToolsNavigationCategory(current, categoryId);
    });
  }

  function onAllToolsPointerEnter() {
    if (!readFineHoverPointer(readToolsNavigationMatchMedia())) {
      return;
    }

    setInteraction((current) => {
      if (current.suppressHover) {
        return current;
      }

      return hoverToolsNavigationAllTools(current);
    });
  }

  function onCategoryClick(categoryId: string) {
    readToolsNavigationCategory(model, categoryId);
    const canHoverFinePointer = readFineHoverPointer(readToolsNavigationMatchMedia());
    setInteraction((current) =>
      activateToolsNavigationCategory(current, categoryId, canHoverFinePointer),
    );
  }

  function onBackToCategories() {
    setInteraction((current) => {
      if (current.openCategoryId === null) {
        throw new Error(
          `Unknown tools navigation category ${JSON.stringify(current.openCategoryId)}.`,
        );
      }

      readToolsNavigationCategory(model, current.openCategoryId);
      return returnToToolsNavigationCategories(current.openCategoryId);
    });
  }

  return (
    <div
      className={styles.toolsNavigation}
      data-category-panel={interaction.isCategoryPanelOpen ? "open" : "closed"}
      data-mobile-tools={interaction.showsMobileToolList ? "true" : "false"}
      data-suppress-hover={interaction.suppressHover ? "true" : "false"}
      data-tools-navigation={model.locale}
      onBlur={onNavigationBlur}
      onClick={onNavigationClick}
      onKeyDown={onNavigationKeyDown}
      onPointerEnter={onNavigationPointerEnter}
      onPointerLeave={onNavigationPointerLeave}
      ref={navigationRef}
    >
      <ToolsNavigationTrigger
        categoryPanelId={categoryPanelId}
        isCategoryPanelOpen={interaction.isCategoryPanelOpen}
        model={model}
      />
      <ToolsNavigationFlyout
        categoryPanelId={categoryPanelId}
        interaction={interaction}
        model={model}
        onAllToolsPointerEnter={onAllToolsPointerEnter}
        onBackToCategories={onBackToCategories}
        onCategoryClick={onCategoryClick}
        onCategoryPointerEnter={onCategoryPointerEnter}
      />
    </div>
  );
}

function ToolsNavigationTrigger({
  categoryPanelId,
  isCategoryPanelOpen,
  model,
}: Readonly<{
  categoryPanelId: string;
  isCategoryPanelOpen: boolean;
  model: ToolsNavigationModel;
}>) {
  return (
    <DockIconButton
      aria-controls={categoryPanelId}
      aria-expanded={isCategoryPanelOpen}
      aria-haspopup="true"
      data-tools-focus-key={TOOLS_NAVIGATION_TRIGGER_FOCUS_KEY}
      data-tools-navigation-trigger=""
      href={model.toolsHomeHref}
      label={model.triggerLabel}
    />
  );
}

function ToolsNavigationFlyout({
  categoryPanelId,
  interaction,
  model,
  onAllToolsPointerEnter,
  onBackToCategories,
  onCategoryClick,
  onCategoryPointerEnter,
}: Readonly<{
  categoryPanelId: string;
  interaction: ToolsNavigationInteraction;
  model: ToolsNavigationModel;
  onAllToolsPointerEnter: () => void;
  onBackToCategories: () => void;
  onCategoryClick: (categoryId: string) => void;
  onCategoryPointerEnter: (categoryId: string) => void;
}>) {
  return (
    <div className={styles.flyout}>
      <div className={styles.categoryColumn}>
        <ToolsNavigationCategoryPanel
          categoryPanelId={categoryPanelId}
          interaction={interaction}
          model={model}
          onAllToolsPointerEnter={onAllToolsPointerEnter}
          onCategoryClick={onCategoryClick}
          onCategoryPointerEnter={onCategoryPointerEnter}
        />
        {model.categories.map((category) => (
          <ToolsNavigationToolPanel
            category={category}
            interaction={interaction}
            key={category.id}
            model={model}
            onBackToCategories={onBackToCategories}
          />
        ))}
      </div>
    </div>
  );
}

function ToolsNavigationCategoryPanel({
  categoryPanelId,
  interaction,
  model,
  onAllToolsPointerEnter,
  onCategoryClick,
  onCategoryPointerEnter,
}: Readonly<{
  categoryPanelId: string;
  interaction: ToolsNavigationInteraction;
  model: ToolsNavigationModel;
  onAllToolsPointerEnter: () => void;
  onCategoryClick: (categoryId: string) => void;
  onCategoryPointerEnter: (categoryId: string) => void;
}>) {
  const categoryPanelVisible =
    interaction.isCategoryPanelOpen && !interaction.showsMobileToolList;

  return (
    <div
      aria-hidden={categoryPanelVisible ? undefined : true}
      aria-labelledby={`${categoryPanelId}-title`}
      className={styles.categoryPanel}
      data-tools-category-panel=""
      id={categoryPanelId}
      role="group"
    >
      <p className={styles.panelTitle} id={`${categoryPanelId}-title`}>
        {model.categoryPanelTitle}
      </p>
      {model.categories.map((category) => (
        <button
          aria-controls={`${categoryPanelId}-${category.id}`}
          aria-expanded={interaction.openCategoryId === category.id}
          aria-haspopup="true"
          className={styles.row}
          data-tools-category={category.id}
          data-tools-focus-key={readToolsNavigationCategoryFocusKey(category.id)}
          key={category.id}
          onClick={() => onCategoryClick(category.id)}
          onMouseDown={preventToolsNavigationPointerFocus}
          onPointerEnter={() => onCategoryPointerEnter(category.id)}
          tabIndex={-1}
          type="button"
        >
          <span>{category.label}</span>
          <span
            aria-hidden="true"
            className={styles.chevron}
            data-tools-navigation-chevron=""
          >
            {">"}
          </span>
        </button>
      ))}
      <a
        className={styles.row}
        data-tools-focus-key={TOOLS_NAVIGATION_ALL_TOOLS_FOCUS_KEY}
        href={model.allToolsHref}
        onMouseDown={preventToolsNavigationPointerFocus}
        onPointerEnter={onAllToolsPointerEnter}
        tabIndex={-1}
      >
        {model.allToolsLabel}
      </a>
    </div>
  );
}

function ToolsNavigationToolPanel({
  category,
  interaction,
  model,
  onBackToCategories,
}: Readonly<{
  category: ToolsNavigationCategory;
  interaction: ToolsNavigationInteraction;
  model: ToolsNavigationModel;
  onBackToCategories: () => void;
}>) {
  const isOpen = interaction.openCategoryId === category.id;
  const showBackButton = interaction.showsMobileToolList && isOpen;

  return (
    <div
      aria-hidden={isOpen ? undefined : true}
      className={styles.toolPanel}
      data-tools-tool-panel={category.id}
      data-tools-tool-panel-open={isOpen ? "true" : "false"}
    >
      <div
        aria-label={category.label}
        className={styles.toolPanelInner}
        role="group"
      >
        <p className={styles.panelTitle}>{category.label}</p>
        {showBackButton ? (
          <button
            className={styles.backButton}
            data-tools-focus-key={TOOLS_NAVIGATION_BACK_FOCUS_KEY}
            data-tools-navigation-back=""
            onClick={onBackToCategories}
            onMouseDown={preventToolsNavigationPointerFocus}
            tabIndex={-1}
            type="button"
          >
            {`← ${model.backToCategoriesLabel}`}
          </button>
        ) : null}
        {category.tools.map((tool) => (
          <ToolsNavigationToolRow key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}

function ToolsNavigationToolRow({
  tool,
}: Readonly<{ tool: ToolsNavigationTool }>) {
  const focusKey = readToolsNavigationToolFocusKey(tool.id);

  if (tool.href === null) {
    return (
      <button
        aria-disabled="true"
        className={styles.row}
        data-tools-focus-key={focusKey}
        data-tools-tool={tool.id}
        onMouseDown={preventToolsNavigationPointerFocus}
        tabIndex={-1}
        type="button"
      >
        {tool.label}
      </button>
    );
  }

  return (
    <a
      className={styles.row}
      data-tools-focus-key={focusKey}
      data-tools-tool={tool.id}
      href={tool.href}
      onMouseDown={preventToolsNavigationPointerFocus}
      tabIndex={-1}
    >
      {tool.label}
    </a>
  );
}

function preventToolsNavigationPointerFocus(event: MouseEvent<HTMLElement>) {
  event.preventDefault();
}

function readToolsNavigationMatchMedia():
  | ((query: string) => { matches: boolean })
  | undefined {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return undefined;
  }

  return window.matchMedia.bind(window);
}

function isToolsNavigationTriggerTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest("[data-tools-navigation-trigger]") !== null
  );
}

function readToolsNavigationEventFocusKey(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) {
    return null;
  }

  const focusElement = target.closest("[data-tools-focus-key]");
  if (focusElement === null) {
    return null;
  }

  const focusKey = focusElement.getAttribute("data-tools-focus-key");
  if (focusKey === null || focusKey.length === 0) {
    throw new Error(
      `Unknown tools navigation focus key ${JSON.stringify(focusKey)}.`,
    );
  }

  return focusKey;
}

function readToolsNavigationToolIdsForFocus(
  model: ToolsNavigationModel,
  currentFocusKey: string,
  openCategoryId: string | null,
): readonly string[] {
  const categoryFocusId = readToolsNavigationCategoryIdFromFocusKey(currentFocusKey);
  if (categoryFocusId !== null) {
    return readToolsNavigationCategory(model, categoryFocusId).tools.map(
      (tool) => tool.id,
    );
  }

  if (openCategoryId === null) {
    return [];
  }

  const toolFocusId = readToolsNavigationToolIdFromFocusKey(currentFocusKey);
  const isOpenCategoryContext =
    toolFocusId !== null ||
    currentFocusKey === TOOLS_NAVIGATION_BACK_FOCUS_KEY ||
    currentFocusKey === TOOLS_NAVIGATION_TRIGGER_FOCUS_KEY;

  if (!isOpenCategoryContext) {
    return [];
  }

  if (toolFocusId !== null) {
    readToolsNavigationTool(model, toolFocusId);
  }

  return readToolsNavigationCategory(model, openCategoryId).tools.map(
    (tool) => tool.id,
  );
}

function focusToolsNavigationKey(
  navigationElement: HTMLDivElement | null,
  focusKey: string | null,
) {
  if (focusKey === null || navigationElement === null) {
    return;
  }

  const focusElement = navigationElement.querySelector<HTMLElement>(
    `[data-tools-focus-key="${focusKey}"]`,
  );
  if (focusElement === null) {
    throw new Error(
      `Unknown tools navigation focus key ${JSON.stringify(focusKey)}.`,
    );
  }

  if (typeof document !== "undefined" && document.activeElement === focusElement) {
    return;
  }

  focusElement.focus({ preventScroll: true });
}

function isClosedToolsNavigationInteraction(
  interaction: ToolsNavigationInteraction,
): boolean {
  return (
    !interaction.isCategoryPanelOpen &&
    interaction.openCategoryId === null &&
    !interaction.showsMobileToolList &&
    !interaction.suppressHover &&
    interaction.focusKey === null
  );
}
