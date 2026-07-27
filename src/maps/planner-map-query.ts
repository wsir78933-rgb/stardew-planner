import { plannerMaps } from "./map-catalog";

export function getPlannerMapIdFromSearch(search: string): string | null {
  if (typeof search !== "string") {
    throw new TypeError(
      `Planner map search string must be a string; received ${describeValue(search)}.`,
    );
  }

  const requestedMapIds = new URLSearchParams(search).getAll("farmType");

  if (requestedMapIds.length !== 1) {
    return null;
  }

  const requestedMapId = requestedMapIds[0];
  const matchingPlannerMap = plannerMaps.find(
    (plannerMap) => plannerMap.id === requestedMapId,
  );

  return matchingPlannerMap === undefined ? null : matchingPlannerMap.id;
}

function describeValue(value: unknown): string {
  return value === undefined ? "undefined" : JSON.stringify(value);
}
