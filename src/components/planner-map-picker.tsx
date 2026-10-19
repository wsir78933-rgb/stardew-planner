"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { PlannerChromeLocale } from "@/src/homepage/homepage-locale";
import {
  getPlannerMapById,
  plannerMaps,
  type PlannerMap,
  type PlannerMapCategory,
} from "../maps/map-catalog";
import { usePlannerChromeLocale } from "@/src/i18n/planner-chrome-locale";

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
  locale?: PlannerChromeLocale;
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
  locale,
  maps,
  selectedMapId,
  onMapSelect,
  mapIdDataAttribute,
}: PlannerMapPickerProperties) {
  const chromeLocale = usePlannerChromeLocale();
  const resolvedLocale = locale ?? chromeLocale;
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
      <div aria-label={readPlannerMapPickerGroupLabel(resolvedLocale, "categories")} className="planner-map-picker__tabs" role="tablist">
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
              {readPlannerMapTabLabel(resolvedLocale, topLevelTabDefinition.id)}
            </button>
          );
        })}
      </div>
      {activeTopLevelTab === "community" ? (
        <div
          aria-label={readPlannerMapPickerGroupLabel(resolvedLocale, "community")}
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
                {readPlannerMapTabLabel(resolvedLocale, communityTabDefinition.id)}
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
              <span>{readPlannerMapDisplayLabel(resolvedLocale, plannerMap.id, plannerMap.displayName)}</span>
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

const japaneseVanillaMapLabels = {
  standard: "スタンダード",
  riverland: "リバーランド",
  forest: "フォレスト",
  hilltop: "ヒルトップ",
  wilderness: "ワイルド",
  "four-corners": "4コーナーズファーム",
  beach: "ビーチの牧場",
  meadowlands: "メドウランズ牧場",
  "ginger-island": "ジンジャーアイランド",
  "farmhouse-0": "家",
  "farmhouse-1": "家のアップグレード1",
  "farmhouse-2": "家のアップグレード2",
  "farmhouse-cellar": "地下室",
  shed: "納屋",
  "big-shed": "ビッグシェッド",
  barn: "家畜小屋",
  "big-barn": "大型の家畜小屋",
  "deluxe-barn": "デラックス家畜小屋",
  coop: "小屋",
  "big-coop": "大型の小屋",
  "deluxe-coop": "デラックス小屋",
  "slime-hutch": "スライムハッチ",
  greenhouse: "温室",
  "farm-cave": "農場の洞窟",
  "island-farmhouse": "島の家",
  "ginger-island-north": "島北部",
  "ginger-island-south": "島南部",
  "ginger-island-south-east": "島南東部",
  "ginger-island-east": "島東部",
  railroad: "線路",
  backwoods: "裏の森",
  "secret-woods": "秘密の森",
  summit: "山の頂上",
  "pelican-town": "ペリカンタウン",
  "cindersap-forest": "シンダーサップの森",
  mountain: "山",
  "pelican-beach": "ペリカンビーチ",
  "calico-desert": "カリコ砂漠",
  "bus-stop": "バス停",
  quarry: "石切場",
} as const;

export function readPlannerMapDisplayLabel(
  locale: PlannerChromeLocale,
  mapId: string,
  englishDisplayName: string,
): string {
  if (locale === "en" || locale === "zh") {
    return englishDisplayName;
  }

  if (locale === "ja") {
    const japaneseLabel = japaneseVanillaMapLabels[mapId as keyof typeof japaneseVanillaMapLabels];
    if (japaneseLabel !== undefined) {
      return japaneseLabel;
    }

    const plannerMap = plannerMaps.find((candidateMap) => candidateMap.id === mapId);
    if (plannerMap !== undefined && "modId" in plannerMap) {
      return englishDisplayName;
    }

    throw new Error(
      `Cannot read Japanese map label because map id is ${JSON.stringify(mapId)}.`,
    );
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read planner map label because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function readPlannerMapTabLabel(
  locale: PlannerChromeLocale,
  tabId: PlannerMapPickerTopLevelTab | PlannerMapPickerCommunityTab,
): string {
  if (locale === "en" || locale === "zh") {
    if (tabId === "farm") return "Farm";
    if (tabId === "interiors") return "Interiors";
    if (tabId === "exteriors") return "Exteriors";
    if (tabId === "community") return "Community";
    if (tabId === "farms") return "Farms";
    const unsupportedTab: never = tabId;
    throw new Error(`Unknown planner map picker tab: ${JSON.stringify(unsupportedTab)}.`);
  }

  if (locale === "ja") {
    if (tabId === "farm" || tabId === "farms") return "牧場";
    if (tabId === "interiors") return "屋内";
    if (tabId === "exteriors") return "屋外";
    if (tabId === "community") return "コミュニティ";
    const unsupportedTab: never = tabId;
    throw new Error(`Unknown planner map picker tab: ${JSON.stringify(unsupportedTab)}.`);
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read planner map tab label because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function readPlannerMapPickerGroupLabel(
  locale: PlannerChromeLocale,
  group: "categories" | "community",
): string {
  if (locale === "en" || locale === "zh") {
    return group === "categories" ? "Map categories" : "Community map categories";
  }

  if (locale === "ja") {
    return group === "categories" ? "マップの分類" : "コミュニティマップの分類";
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read planner map group label because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}
