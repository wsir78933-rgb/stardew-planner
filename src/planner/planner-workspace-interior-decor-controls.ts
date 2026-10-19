import {
  applyInteriorDecorPatternToHistory,
} from "../interior-decor/interior-decor-controller";
import {
  isInteriorDecorSupportedMapId,
  type InteriorDecorCatalogPattern,
} from "../interior-decor/interior-decor-catalog";
import type { PlannerChromeLocale } from "@/src/homepage/homepage-locale";
import type { InteriorDecorKind } from "../interior-decor/interior-decor-state";
import type { PlacementSelectionKey } from "../editor/editor-selection-controller";
import type { PlacementHistory } from "../placement/placement-history";
import type { PlacementSnapshot } from "../placement/placement-snapshot";

export type InteriorDecorSelectionTransition = Readonly<{
  activeInteriorDecorPattern: InteriorDecorCatalogPattern | null;
  shouldClearOrdinaryPlacementInteraction: boolean;
}>;

export type PlannerWorkspaceInteriorDecorTransition = Readonly<{
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
}>;

export type InteriorDecorRejectionNotification = Readonly<{
  message: string;
  version: number;
}>;

export function cancelInteriorDecorBeforeOrdinaryWorkspaceAction(
  input: Readonly<{
    cancelInteriorDecor: () => void;
    performOrdinaryWorkspaceAction: () => void;
  }>,
): void {
  assertOrdinaryWorkspaceActionInput(input);
  input.cancelInteriorDecor();
  input.performOrdinaryWorkspaceAction();
}

export function getNextInteriorDecorRejectionNotification(
  currentNotification: InteriorDecorRejectionNotification | null,
  showToasts: boolean,
  message: string,
): InteriorDecorRejectionNotification | null {
  if (!showToasts) {
    return null;
  }

  return {
    message,
    version: (currentNotification?.version ?? 0) + 1,
  };
}

export function createInteriorDecorSelectionTransition(
  pattern: InteriorDecorCatalogPattern | null,
): InteriorDecorSelectionTransition {
  assertInteriorDecorPattern(pattern);

  return {
    activeInteriorDecorPattern: pattern,
    shouldClearOrdinaryPlacementInteraction: pattern !== null,
  };
}

export function applyPlannerWorkspaceInteriorDecor(
  input: Readonly<{
    mapId: string;
    pattern: InteriorDecorCatalogPattern;
    placementHistory: PlacementHistory<PlacementSnapshot>;
    targetId: string;
  }>,
): PlannerWorkspaceInteriorDecorTransition {
  assertMapId(input.mapId);
  assertInteriorDecorPattern(input.pattern);

  return {
    placementHistory: applyInteriorDecorPatternToHistory({
      interiorDecorKind: input.pattern.kind,
      patternId: input.pattern.patternId,
      placementHistory: input.placementHistory,
      targetId: input.targetId,
    }),
    selectedPlacementKeys: [],
  };
}

export function getInteriorDecorRejectionMessage(
  mapId: string,
  interiorDecorKind: InteriorDecorKind,
): string {
  assertMapId(mapId);
  assertInteriorDecorKind(interiorDecorKind);

  return `Cannot apply ${interiorDecorKind} on map ${JSON.stringify(mapId)} at this location.`;
}

export function getUnavailableInteriorDecorMessage(
  mapId: string,
  interiorDecorKind: InteriorDecorKind,
  locale: PlannerChromeLocale = "en",
): string | null {
  assertMapId(mapId);
  assertInteriorDecorKind(interiorDecorKind);
  assertInteriorDecorLocale(locale);

  if (isInteriorDecorSupportedMapId(mapId)) {
    return null;
  }

  return readUnavailableInteriorDecorMessage(locale, interiorDecorKind);
}

function readUnavailableInteriorDecorMessage(
  locale: PlannerChromeLocale,
  interiorDecorKind: InteriorDecorKind,
): string {
  if (locale === "en" || locale === "zh") {
    return interiorDecorKind === "wallpaper"
      ? "Wallpaper can only be applied inside."
      : "Flooring can only be applied inside.";
  }

  if (locale === "ja") {
    return interiorDecorKind === "wallpaper"
      ? "壁紙は屋内にだけ使えます。"
      : "フローリングは屋内にだけ使えます。";
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read interior decor message because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function assertInteriorDecorLocale(
  locale: string,
): asserts locale is PlannerChromeLocale {
  if (locale === "en" || locale === "zh" || locale === "ja") {
    return;
  }

  throw new TypeError(
    `Interior decor locale must be "en", "zh", or "ja"; received ${JSON.stringify(locale)}.`,
  );
}

function assertMapId(mapId: unknown): asserts mapId is string {
  if (typeof mapId !== "string" || mapId.length === 0) {
    throw new TypeError(
      `Planner workspace interior decor map ID must be a non-empty string; received ${describeValue(mapId)}.`,
    );
  }
}

function assertOrdinaryWorkspaceActionInput(
  input: unknown,
): asserts input is Readonly<{
  cancelInteriorDecor: () => void;
  performOrdinaryWorkspaceAction: () => void;
}> {
  if (typeof input !== "object" || input === null) {
    throw new TypeError(
      `Planner workspace ordinary action input must be an object; received ${describeValue(input)}.`,
    );
  }
  const inputRecord = input as Record<string, unknown>;
  for (const fieldName of [
    "cancelInteriorDecor",
    "performOrdinaryWorkspaceAction",
  ] as const) {
    if (typeof inputRecord[fieldName] !== "function") {
      throw new TypeError(
        `Planner workspace ordinary action ${JSON.stringify(fieldName)} must be a function; received ${describeValue(inputRecord[fieldName])}.`,
      );
    }
  }
}

function assertInteriorDecorPattern(
  pattern: unknown,
): asserts pattern is InteriorDecorCatalogPattern | null {
  if (pattern === null) {
    return;
  }
  if (typeof pattern !== "object" || pattern === null) {
    throw new TypeError(
      `Planner workspace interior decor pattern must be an object or null; received ${describeValue(pattern)}.`,
    );
  }
  const patternRecord = pattern as Record<string, unknown>;
  if (
    typeof patternRecord.id !== "string" ||
    typeof patternRecord.patternId !== "string"
  ) {
    throw new TypeError(
      `Planner workspace interior decor pattern must contain string id and patternId values; received ${describeValue(pattern)}.`,
    );
  }
  assertInteriorDecorKind(patternRecord.kind);
}

function assertInteriorDecorKind(
  interiorDecorKind: unknown,
): asserts interiorDecorKind is InteriorDecorKind {
  if (interiorDecorKind !== "wallpaper" && interiorDecorKind !== "flooring") {
    throw new TypeError(
      `Planner workspace interior decor kind must be "wallpaper" or "flooring"; received ${describeValue(interiorDecorKind)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  const serializedValue = JSON.stringify(value);
  return serializedValue === undefined ? String(value) : serializedValue;
}
