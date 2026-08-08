"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  getPlannerMapById,
  type PlannerMap,
  type PlannerMapCategory,
} from "../maps/map-catalog";

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
  maps: readonly PlannerMap[];
  selectedMapId: string | null;
  onMapSelect: (mapId: string) => void;
  mapIdDataAttribute: `data-${string}`;
}>;

type TopLevelTabDefinition = Readonly<{
  id: PlannerMapPickerTopLevelTab;
  label: string;
  mapCategory: Exclude<PlannerMapCategory, "community-farm" | "community-interior"> | null;
}>;

type CommunityTabDefinition = Readonly<{
  id: PlannerMapPickerCommunityTab;
  label: string;
  mapCategory: Extract<PlannerMapCategory, "community-farm" | "community-interior">;
}>;

const topLevelTabDefinitions = [
  { id: "farm", label: "Farm", mapCategory: "farm" },
  { id: "interiors", label: "Interiors", mapCategory: "interior" },
  { id: "exteriors", label: "Exteriors", mapCategory: "exterior" },
  { id: "community", label: "Community", mapCategory: null },
] as const satisfies readonly TopLevelTabDefinition[];

const communityTabDefinitions = [
  { id: "farms", label: "Farms", mapCategory: "community-farm" },
  { id: "interiors", label: "Interiors", mapCategory: "community-interior" },
] as const satisfies readonly CommunityTabDefinition[];

export function PlannerMapPicker({
  maps,
  selectedMapId,
  onMapSelect,
  mapIdDataAttribute,
}: PlannerMapPickerProperties) {
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
      <div aria-label="Map categories" className="planner-map-picker__tabs" role="tablist">
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
              {topLevelTabDefinition.label}
            </button>
          );
        })}
      </div>
      {activeTopLevelTab === "community" ? (
        <div
          aria-label="Community map categories"
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
                {communityTabDefinition.label}
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
              <span>{plannerMap.displayName}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
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
