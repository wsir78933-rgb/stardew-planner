import {
  applyInteriorDecorPatternToHistory,
} from "../interior-decor/interior-decor-controller";
import {
  isInteriorDecorSupportedMapId,
  type InteriorDecorCatalogPattern,
} from "../interior-decor/interior-decor-catalog";
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

type InteriorDecorMessageLocale = "en" | "zh" | "ru";

export function getInteriorDecorRejectionMessage(
  mapId: string,
  interiorDecorKind: InteriorDecorKind,
  locale: InteriorDecorMessageLocale = "en",
): string {
  assertMapId(mapId);
  assertInteriorDecorKind(interiorDecorKind);
  assertInteriorDecorMessageLocale(locale);

  if (locale === "ru") {
    return `Нельзя применить ${readRussianInteriorDecorKind(interiorDecorKind)} на карте ${JSON.stringify(mapId)} в этом месте.`;
  }

  return `Cannot apply ${interiorDecorKind} on map ${JSON.stringify(mapId)} at this location.`;
}

export function getUnavailableInteriorDecorMessage(
  mapId: string,
  interiorDecorKind: InteriorDecorKind,
  locale: InteriorDecorMessageLocale = "en",
): string | null {
  assertMapId(mapId);
  assertInteriorDecorKind(interiorDecorKind);
  assertInteriorDecorMessageLocale(locale);

  if (isInteriorDecorSupportedMapId(mapId)) {
    return null;
  }

  if (locale === "ru") {
    return interiorDecorKind === "wallpaper"
      ? "Обои можно применять только внутри."
      : "Настил можно применять только внутри.";
  }

  return interiorDecorKind === "wallpaper"
    ? "Wallpaper can only be applied inside."
    : "Flooring can only be applied inside.";
}

function assertInteriorDecorMessageLocale(
  locale: InteriorDecorMessageLocale,
): asserts locale is InteriorDecorMessageLocale {
  if (locale === "en" || locale === "zh" || locale === "ru") {
    return;
  }
  throw new TypeError(
    `Interior decor message locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readRussianInteriorDecorKind(interiorDecorKind: InteriorDecorKind): string {
  if (interiorDecorKind === "wallpaper") return "обои";
  if (interiorDecorKind === "flooring") return "настил";
  throw new TypeError(
    `Interior decor kind must be "wallpaper" or "flooring"; received ${JSON.stringify(interiorDecorKind)}.`,
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
