import { getRussianPlannerMapDisplayName } from "./planner-russian-display-names";
import { getPlannerMapById } from "../maps/map-catalog";
import { getPlannerMapIdForMapFile } from "../reference-runtime/use-reference-project-workspace";

export type ProjectMapLabelLocale = "en" | "zh" | "ru";

export type ProjectMapLabelRecord = Readonly<{
  mapFile: string;
  label: string;
}>;

export function readVisibleProjectMapLabel(
  projectMapRecord: ProjectMapLabelRecord,
  locale: ProjectMapLabelLocale,
): string {
  const storedProjectMapRecord = readStoredProjectMapLabelRecord(projectMapRecord);
  const projectMapLabelLocale = readProjectMapLabelLocale(locale);
  if (projectMapLabelLocale === "en" || projectMapLabelLocale === "zh") {
    return storedProjectMapRecord.label;
  }
  return readRussianVisibleProjectMapLabel(storedProjectMapRecord);
}

function readRussianVisibleProjectMapLabel(
  storedProjectMapRecord: ProjectMapLabelRecord,
): string {
  const plannerMapId = getPlannerMapIdForMapFile(storedProjectMapRecord.mapFile);
  const catalogPlannerMap = getPlannerMapById(plannerMapId);
  if (storedProjectMapRecord.label !== catalogPlannerMap.displayName) {
    return storedProjectMapRecord.label;
  }
  return getRussianPlannerMapDisplayName(catalogPlannerMap.id);
}

function readStoredProjectMapLabelRecord(
  projectMapRecord: ProjectMapLabelRecord,
): ProjectMapLabelRecord {
  if (typeof projectMapRecord !== "object" || projectMapRecord === null) {
    throw new TypeError(
      `Project map record must be an object; received ${JSON.stringify(projectMapRecord)}.`,
    );
  }
  if (typeof projectMapRecord.mapFile !== "string" || projectMapRecord.mapFile.length === 0) {
    throw new TypeError(
      `Project map record mapFile must be a non-empty string; received ${JSON.stringify(projectMapRecord.mapFile)}.`,
    );
  }
  if (typeof projectMapRecord.label !== "string") {
    throw new TypeError(
      `Project map record label must be a string; received ${JSON.stringify(projectMapRecord.label)}.`,
    );
  }
  return projectMapRecord;
}

function readProjectMapLabelLocale(
  locale: ProjectMapLabelLocale,
): ProjectMapLabelLocale {
  if (locale === "en" || locale === "zh" || locale === "ru") {
    return locale;
  }
  throw new TypeError(
    `Project map label locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}
