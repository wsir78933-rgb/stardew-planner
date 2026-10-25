import type { PublicLocale } from "../i18n/public-locale";

export const PLANNING_TOOL_IDS = [
  "today-processing-list",
  "production-schedule",
  "keg-count",
  "materials-and-resin",
] as const;

export type PlanningToolId = (typeof PLANNING_TOOL_IDS)[number];
export type PlanningToolCanonicalPath = `/tools/${PlanningToolId}`;

export function isPlanningToolId(value: string): value is PlanningToolId {
  return PLANNING_TOOL_IDS.includes(value as PlanningToolId);
}

export function getPlanningToolPath(toolId: PlanningToolId): PlanningToolCanonicalPath {
  if (!isPlanningToolId(toolId)) {
    throw new Error(`Unknown planning tool id: ${JSON.stringify(toolId)}.`);
  }
  return `/tools/${toolId}`;
}

export const PLANNING_TOOL_CANONICAL_PATHS = PLANNING_TOOL_IDS.map(getPlanningToolPath);

export function getPlanningToolHref(locale: PublicLocale, toolId: PlanningToolId): string {
  if (locale !== "en" && locale !== "zh-CN") {
    throw new Error(`Unsupported planning tool locale: ${JSON.stringify(locale)}.`);
  }
  return `${locale === "zh-CN" ? "/zh" : ""}${getPlanningToolPath(toolId)}`;
}

export function readPlanningToolIdFromPathname(
  locale: PublicLocale,
  pathname: string,
): PlanningToolId | null {
  for (const toolId of PLANNING_TOOL_IDS) {
    if (getPlanningToolHref(locale, toolId) === pathname) return toolId;
  }
  return null;
}
