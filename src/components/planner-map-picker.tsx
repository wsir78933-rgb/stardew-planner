"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { getRussianPlannerMapDisplayName } from "../i18n/planner-russian-display-names";
import {
  getPlannerMapById,
  plannerMaps,
  type PlannerMap,
  type PlannerMapCategory,
} from "../maps/map-catalog";

type PlannerMapPickerLocale = "en" | "zh" | "ru";

export type PlannerMapPickerTopLevelTab =
  | "farm"
  | "interiors"
  | "exteriors"
  | "community";

export type PlannerMapPickerCommunityTab = "farms" | "interiors";

export type PlannerMapPickerState = Readonly<{
  activeCommunityTab: PlannerMapPickerCommunityTab;
  activeTopLevelTab: PlannerMapPickerTopLevelTab;
}>;

type PlannerMapPickerProperties = Readonly<{
  locale?: PlannerMapPickerLocale;
  maps: readonly PlannerMap[];
  selectedMapId: string | null;
  onMapSelect: (mapId: string) => void;
  mapIdDataAttribute: `data-${string}`;
}>;

type TopLevelTabDefinition = Readonly<{
  id: PlannerMapPickerTopLevelTab;
  mapCategory: Exclude<PlannerMapCategory, "community-farm" | "community-interior"> | null;
}>;

type CommunityTabDefinition = Readonly<{
  id: PlannerMapPickerCommunityTab;
  mapCategory: Extract<PlannerMapCategory, "community-farm" | "community-interior">;
}>;

const topLevelTabDefinitions = [
  { id: "farm", mapCategory: "farm" },
  { id: "interiors", mapCategory: "interior" },
  { id: "exteriors", mapCategory: "exterior" },
  { id: "community", mapCategory: null },
] as const satisfies readonly TopLevelTabDefinition[];

const communityTabDefinitions = [
  { id: "farms", mapCategory: "community-farm" },
  { id: "interiors", mapCategory: "community-interior" },
] as const satisfies readonly CommunityTabDefinition[];

export function PlannerMapPicker({
  locale,
  maps,
  selectedMapId,
  onMapSelect,
  mapIdDataAttribute,
}: PlannerMapPickerProperties) {
  const pickerLocale = readPlannerMapPickerLocale(locale);
  const initialPickerState = getInitialPlannerMapPickerState(selectedMapId);
  const [activeTopLevelTab, setActiveTopLevelTab] = useState(
    initialPickerState.activeTopLevelTab,
  );
  const [activeCommunityTab, setActiveCommunityTab] = useState(
    initialPickerState.activeCommunityTab,
  );
  const pickerId = useId();
  const topLevelTabReferences = useRef<
    Partial<Record<PlannerMapPickerTopLevelTab, HTMLButtonElement>>
  >({});
  const communityTabReferences = useRef<
    Partial<Record<PlannerMapPickerCommunityTab, HTMLButtonElement>>
  >({});
  const activeMapCategory = getActiveMapCategory(
    activeTopLevelTab,
    activeCommunityTab,
  );
  const activeMaps = maps.filter(
    (plannerMap) => plannerMap.category === activeMapCategory,
  );
  const activeTabPanelId = `${pickerId}-tabpanel`;
  const activeTabPanelLabelledBy = [
    `${pickerId}-tab-${activeTopLevelTab}`,
    activeTopLevelTab === "community"
      ? `${pickerId}-community-tab-${activeCommunityTab}`
      : null,
  ]
    .filter((tabId): tabId is string => tabId !== null)
    .join(" ");

  function selectTopLevelTab(nextTab: PlannerMapPickerTopLevelTab): void {
    setActiveTopLevelTab(nextTab);
  }

  function handleTopLevelTabKeyDown(
    keyboardEvent: KeyboardEvent<HTMLButtonElement>,
  ): void {
    const nextTab = getNextPlannerMapTab(activeTopLevelTab, keyboardEvent.key);

    if (nextTab === null) {
      return;
    }

    keyboardEvent.preventDefault();
    selectTopLevelTab(nextTab);

    const nextTabElement = topLevelTabReferences.current[nextTab];

    if (!nextTabElement) {
      throw new Error(`Planner map picker tab ref is unavailable for ${nextTab}.`);
    }

    nextTabElement.focus();
  }

  function selectCommunityTab(nextTab: PlannerMapPickerCommunityTab): void {
    setActiveCommunityTab(nextTab);
  }

  function handleCommunityTabKeyDown(
    keyboardEvent: KeyboardEvent<HTMLButtonElement>,
  ): void {
    const nextTab = getNextPlannerMapCommunityTab(
      activeCommunityTab,
      keyboardEvent.key,
    );

    if (nextTab === null) {
      return;
    }

    keyboardEvent.preventDefault();
    selectCommunityTab(nextTab);

    const nextTabElement = communityTabReferences.current[nextTab];

    if (!nextTabElement) {
      throw new Error(
        `Planner map picker community tab ref is unavailable for ${nextTab}.`,
      );
    }

    nextTabElement.focus();
  }

  return (
    <div className="planner-map-picker">
      <div aria-label={readPlannerMapPickerGroupLabel("map-categories", pickerLocale)} className="planner-map-picker__tabs" role="tablist">
        {topLevelTabDefinitions.map((topLevelTabDefinition) => {
          const isActiveTab = topLevelTabDefinition.id === activeTopLevelTab;
          const tabId = `${pickerId}-tab-${topLevelTabDefinition.id}`;

          return (
            <button
              aria-controls={activeTabPanelId}
              aria-selected={isActiveTab}
              className="planner-map-picker__tab"
              id={tabId}
              key={topLevelTabDefinition.id}
              onClick={() => selectTopLevelTab(topLevelTabDefinition.id)}
              onKeyDown={handleTopLevelTabKeyDown}
              ref={(tabElement) => {
                if (tabElement) {
                  topLevelTabReferences.current[topLevelTabDefinition.id] = tabElement;
                }
              }}
              role="tab"
              tabIndex={isActiveTab ? 0 : -1}
              type="button"
            >
              {readPlannerMapPickerTabLabel(topLevelTabDefinition.id, pickerLocale)}
            </button>
          );
        })}
      </div>
      {activeTopLevelTab === "community" ? (
        <div
          aria-label={readPlannerMapPickerGroupLabel("community-map-categories", pickerLocale)}
          className="planner-map-picker__community-tabs"
          role="tablist"
        >
          {communityTabDefinitions.map((communityTabDefinition) => {
            const isActiveTab = communityTabDefinition.id === activeCommunityTab;

            return (
              <button
                aria-controls={activeTabPanelId}
                aria-selected={isActiveTab}
                className="planner-map-picker__community-tab"
                id={`${pickerId}-community-tab-${communityTabDefinition.id}`}
                key={communityTabDefinition.id}
                onClick={() => selectCommunityTab(communityTabDefinition.id)}
                onKeyDown={handleCommunityTabKeyDown}
                ref={(tabElement) => {
                  if (tabElement) {
                    communityTabReferences.current[communityTabDefinition.id] =
                      tabElement;
                  }
                }}
                role="tab"
                tabIndex={isActiveTab ? 0 : -1}
                type="button"
              >
                {readPlannerMapPickerTabLabel(communityTabDefinition.id, pickerLocale)}
              </button>
            );
          })}
        </div>
      ) : null}
      <div
        aria-labelledby={activeTabPanelLabelledBy}
        className="planner-map-picker__tabpanel"
        id={activeTabPanelId}
        role="tabpanel"
        tabIndex={0}
      >
        <div className="editor-modal__map-grid">
          {activeMaps.map((plannerMap) => (
            <button
              aria-pressed={plannerMap.id === selectedMapId}
              key={plannerMap.id}
              onClick={() => onMapSelect(plannerMap.id)}
              type="button"
              {...{ [mapIdDataAttribute]: plannerMap.id }}
            >
              <img
                alt=""
                aria-hidden="true"
                src={`/game-assets/1.6.15/${plannerMap.previewOutputPath}`}
              />
              <span>{readPlannerMapPickerMapLabel(plannerMap, pickerLocale)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function readPlannerMapPickerLocale(
  locale: PlannerMapPickerLocale | undefined,
): PlannerMapPickerLocale {
  const resolvedLocale = locale ?? "en";
  if (resolvedLocale === "en" || resolvedLocale === "zh" || resolvedLocale === "ru") {
    return resolvedLocale;
  }
  throw new TypeError(
    `Planner map picker locale must be "en", "zh", or "ru"; received ${JSON.stringify(resolvedLocale)}.`,
  );
}

function readPlannerMapPickerGroupLabel(
  group: "map-categories" | "community-map-categories",
  locale: PlannerMapPickerLocale,
): string {
  if (locale === "en" || locale === "zh") {
    return group === "map-categories" ? "Map categories" : "Community map categories";
  }
  if (locale === "ru") {
    return group === "map-categories" ? "Категории карт" : "Категории карт сообщества";
  }
  throw new TypeError(
    `Planner map picker locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readPlannerMapPickerTabLabel(
  tabId: PlannerMapPickerTopLevelTab | PlannerMapPickerCommunityTab,
  locale: PlannerMapPickerLocale,
): string {
  if (locale === "ru") {
    if (tabId === "farm") return "Ферма";
    if (tabId === "interiors") return "Интерьеры";
    if (tabId === "exteriors") return "Экстерьеры";
    if (tabId === "community") return "Сообщество";
    if (tabId === "farms") return "Фермы";
    throw new Error(`Unknown planner map picker tab: ${JSON.stringify(tabId)}.`);
  }
  if (locale === "en" || locale === "zh") {
    if (tabId === "farm") return "Farm";
    if (tabId === "interiors") return "Interiors";
    if (tabId === "exteriors") return "Exteriors";
    if (tabId === "community") return "Community";
    if (tabId === "farms") return "Farms";
    throw new Error(`Unknown planner map picker tab: ${JSON.stringify(tabId)}.`);
  }
  throw new TypeError(
    `Planner map picker locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readPlannerMapCatalogId(mapId: string): (typeof plannerMaps)[number]["id"] {
  const catalogPlannerMap = plannerMaps.find(
    (candidatePlannerMap) => candidatePlannerMap.id === mapId,
  );
  if (catalogPlannerMap === undefined) {
    throw new Error(`Unknown planner map id: ${JSON.stringify(mapId)}.`);
  }
  return catalogPlannerMap.id;
}

function readPlannerMapPickerMapLabel(
  plannerMap: PlannerMap,
  locale: PlannerMapPickerLocale,
): string {
  if (locale === "en" || locale === "zh") {
    return plannerMap.displayName;
  }
  if (locale === "ru") {
    return getRussianPlannerMapDisplayName(readPlannerMapCatalogId(plannerMap.id));
  }
  throw new TypeError(
    `Planner map picker locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

export function getInitialPlannerMapPickerState(
  selectedMapId: string | null,
): PlannerMapPickerState {
  if (selectedMapId === null) {
    return { activeCommunityTab: "farms", activeTopLevelTab: "farm" };
  }

  const selectedPlannerMap = getPlannerMapById(selectedMapId);

  return getPlannerMapPickerStateForCategory(selectedPlannerMap.category);
}

export function getPlannerMapPickerStateForCategory(
  category: PlannerMapCategory,
): PlannerMapPickerState {
  if (category === "farm") {
    return { activeCommunityTab: "farms", activeTopLevelTab: "farm" };
  }

  if (category === "interior") {
    return { activeCommunityTab: "farms", activeTopLevelTab: "interiors" };
  }

  if (category === "exterior") {
    return { activeCommunityTab: "farms", activeTopLevelTab: "exteriors" };
  }

  if (category === "community-farm") {
    return { activeCommunityTab: "farms", activeTopLevelTab: "community" };
  }

  if (category === "community-interior") {
    return { activeCommunityTab: "interiors", activeTopLevelTab: "community" };
  }

  return throwUnknownPlannerMapCategory(category);
}

function throwUnknownPlannerMapCategory(category: never): never {
  throw new Error(`Unknown planner map category: ${category}`);
}

export function getNextPlannerMapTab(
  currentTab: PlannerMapPickerTopLevelTab,
  pressedKey: string,
): PlannerMapPickerTopLevelTab | null {
  const currentTabIndex = topLevelTabDefinitions.findIndex(
    (topLevelTabDefinition) => topLevelTabDefinition.id === currentTab,
  );

  if (currentTabIndex === -1) {
    throw new Error(`Unknown planner map picker tab: ${currentTab}`);
  }

  if (pressedKey === "Home") {
    return topLevelTabDefinitions[0].id;
  }

  if (pressedKey === "End") {
    return topLevelTabDefinitions[topLevelTabDefinitions.length - 1].id;
  }

  if (pressedKey === "ArrowLeft") {
    return topLevelTabDefinitions[
      (currentTabIndex - 1 + topLevelTabDefinitions.length) %
        topLevelTabDefinitions.length
    ].id;
  }

  if (pressedKey === "ArrowRight") {
    return topLevelTabDefinitions[
      (currentTabIndex + 1) % topLevelTabDefinitions.length
    ].id;
  }

  return null;
}

export function getNextPlannerMapCommunityTab(
  currentTab: PlannerMapPickerCommunityTab,
  pressedKey: string,
): PlannerMapPickerCommunityTab | null {
  const currentTabIndex = communityTabDefinitions.findIndex(
    (communityTabDefinition) => communityTabDefinition.id === currentTab,
  );

  if (currentTabIndex === -1) {
    throw new Error(`Unknown planner map picker community tab: ${currentTab}`);
  }

  if (pressedKey === "Home") {
    return communityTabDefinitions[0].id;
  }

  if (pressedKey === "End") {
    return communityTabDefinitions[communityTabDefinitions.length - 1].id;
  }

  if (pressedKey === "ArrowLeft") {
    return communityTabDefinitions[
      (currentTabIndex - 1 + communityTabDefinitions.length) %
        communityTabDefinitions.length
    ].id;
  }

  if (pressedKey === "ArrowRight") {
    return communityTabDefinitions[
      (currentTabIndex + 1) % communityTabDefinitions.length
    ].id;
  }

  return null;
}

function getActiveMapCategory(
  activeTopLevelTab: PlannerMapPickerTopLevelTab,
  activeCommunityTab: PlannerMapPickerCommunityTab,
): PlannerMapCategory {
  if (activeTopLevelTab === "community") {
    return getCommunityTabDefinition(activeCommunityTab).mapCategory;
  }

  const topLevelTabDefinition = topLevelTabDefinitions.find(
    (candidateTopLevelTabDefinition) =>
      candidateTopLevelTabDefinition.id === activeTopLevelTab,
  );

  if (!topLevelTabDefinition || topLevelTabDefinition.mapCategory === null) {
    throw new Error(`Unknown planner map picker tab: ${activeTopLevelTab}`);
  }

  return topLevelTabDefinition.mapCategory;
}

function getCommunityTabDefinition(
  communityTab: PlannerMapPickerCommunityTab,
): CommunityTabDefinition {
  const communityTabDefinition = communityTabDefinitions.find(
    (candidateCommunityTabDefinition) =>
      candidateCommunityTabDefinition.id === communityTab,
  );

  if (!communityTabDefinition) {
    throw new Error(`Unknown planner map picker community tab: ${communityTab}`);
  }

  return communityTabDefinition;
}
