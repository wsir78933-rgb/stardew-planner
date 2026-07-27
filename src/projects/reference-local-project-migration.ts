import {
  createProjectMapState,
} from "./local-project-editor-actions";
import {
  findReferenceLocalProjectCatalogMapping,
  findReferenceLocalProjectMapMapping,
  type ReferenceLocalProjectCatalogContext,
} from "./reference-local-project-catalog-mapping";
import {
  validateStoredLocalProjectCollectionV2,
  type JsonSafeValue,
  type StoredLocalProjectCollectionV2,
} from "./project-schema";
import {
  createPersistentPlacementSnapshot,
  type PlacementBuilding,
  type PlacementCrop,
  type PlacementItem,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";
import { restoreInteriorDecorState } from "../interior-decor/interior-decor-state";
import { restoreMapRenderOptions } from "../maps/map-render-options";
import { isBuildingPaintable } from "../paint/building-paint";

export const referenceLocalProjectStorageKey =
  "stardewplan-reference-local-projects-v1";

export class ReferenceProjectMigrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReferenceProjectMigrationError";
  }
}

type JsonRecord = Record<string, unknown>;
type SourceProject = Readonly<{
  path: string;
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  season: "spring" | "summer" | "fall" | "winter";
  activeMapId: string;
  maps: readonly SourceMap[];
}>;
type SourceMap = Readonly<{
  id: string;
  mapFile: string;
  label: string;
  season: "spring" | "summer" | "fall" | "winter";
  state: JsonRecord;
  decor: JsonRecord;
  renovations: readonly unknown[];
}>;

const seasons = new Set(["spring", "summer", "fall", "winter"]);
const renovationMappings: Readonly<Record<string, string>> = {
  bedroom_open: "bedroom",
  southern_room: "southern-room",
  corner_room: "corner-room",
  extended_corner: "extended-corner-room",
  dining_room: "dining-room",
  dining_room_wall: "dining-room-wall",
  cubby: "cubby",
  far_upper_room: "far-upper-room",
  remove_crib: "crib",
  cellar: "cellar",
};
const renovationOrder = Object.values(renovationMappings);
const renovationDependencies: Readonly<Record<string, readonly string[]>> = {
  bedroom: [], "southern-room": [], "corner-room": [],
  "extended-corner-room": ["corner-room"], "dining-room": [],
  "dining-room-wall": ["dining-room"], cubby: [], "far-upper-room": [],
  crib: [], cellar: [],
};

export function migrateReferenceLocalProjectCollection(
  serializedSource: string,
): StoredLocalProjectCollectionV2 {
  const sourceProjects = parseReferenceLocalProjectCollection(serializedSource);
  const projects = sourceProjects.map(convertReferenceProject);

  return validateStoredLocalProjectCollectionV2({ formatVersion: 2, projects });
}

function parseReferenceLocalProjectCollection(serializedSource: string): readonly SourceProject[] {
  if (typeof serializedSource !== "string") {
    fail("source", "must be a JSON string", serializedSource);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(serializedSource);
  } catch (caughtError) {
    const parserMessage = caughtError instanceof Error ? caughtError.message : String(caughtError);
    throw new ReferenceProjectMigrationError(
      `${referenceLocalProjectStorageKey}: malformed JSON ${describeValue(serializedSource)}; parser error: ${parserMessage}`,
    );
  }

  const collection = assertExactRecord(parsed, "source", ["version", "projects"]);
  if (collection.version !== 1) fail("version", "must equal 1", collection.version);
  if (!Array.isArray(collection.projects)) fail("projects", "must be an array", collection.projects);
  if (collection.projects.length === 0) fail("projects", "must not be empty", collection.projects);
  const seenProjectIds = new Set<string>();

  return collection.projects.map((project, projectIndex) => {
    const path = `projects[${String(projectIndex)}]`;
    const record = assertAllowedRecord(project, path, ["id", "title", "created_at", "updated_at", "project"], ["thumbnailsByMapId"]);
    const id = readIdentifier(record.id, `${path}.id`);
    if (seenProjectIds.has(id)) fail(`${path}.id`, "must not duplicate an earlier project ID", id);
    seenProjectIds.add(id);
    const sourceTitle = normalizeSourceText(record.title, `${path}.title`);
    const title = readV2Text(sourceTitle, `${path}.title`);
    const createdAt = readTimestamp(record.created_at, `${path}.created_at`);
    const updatedAt = readTimestamp(record.updated_at, `${path}.updated_at`);
    if (Date.parse(createdAt) > Date.parse(updatedAt)) fail(`${path}.created_at`, "must not be later than updated_at", createdAt);
    const thumbnailsByMapId = record.thumbnailsByMapId === undefined
      ? {}
      : record.thumbnailsByMapId;
    assertEmptyThumbnailRecord(thumbnailsByMapId, `${path}.thumbnailsByMapId`);
    const projectRecord = assertExactRecord(record.project, `${path}.project`, ["version", "gameVersion", "projectName", "season", "activeMapId", "maps"]);
    if (projectRecord.version !== 4) fail(`${path}.project.version`, "must equal 4", projectRecord.version);
    if (projectRecord.gameVersion !== "1.6.15") fail(`${path}.project.gameVersion`, "must equal \"1.6.15\"", projectRecord.gameVersion);
    if (normalizeSourceText(projectRecord.projectName, `${path}.project.projectName`) !== sourceTitle) fail(`${path}.project.projectName`, "must equal normalized title", projectRecord.projectName);
    const season = readSeason(projectRecord.season, `${path}.project.season`);
    const activeMapId = readIdentifier(projectRecord.activeMapId, `${path}.project.activeMapId`);
    if (!Array.isArray(projectRecord.maps) || projectRecord.maps.length === 0) fail(`${path}.project.maps`, "must be a non-empty array", projectRecord.maps);
    const maps = projectRecord.maps.map((map, mapIndex) => parseSourceMap(map, path, id, mapIndex));
    const mapIds = new Set<string>();
    maps.forEach((map) => {
      if (mapIds.has(map.id)) fail(`${path}.project.maps`, "must not contain duplicate map IDs", map.id);
      mapIds.add(map.id);
    });
    if (!maps.some((map) => map.id === activeMapId)) fail(`${path}.project.activeMapId`, "must identify a project map", activeMapId);
    const activeMap = maps.find((map) => map.id === activeMapId);
    if (activeMap === undefined || activeMap.season !== season) fail(`${path}.project.season`, "must equal the active map season", projectRecord.season);
    return { path, id, title, createdAt, updatedAt, season, activeMapId, maps };
  });
}

function parseSourceMap(rawMap: unknown, projectPath: string, projectId: string, mapIndex: number): SourceMap {
  const path = `${projectPath}.maps[${String(mapIndex)}]`;
  const map = assertAllowedRecord(rawMap, path, ["id", "mapFile", "label", "season", "state", "thumbnail"], ["decor", "renovations"]);
  const id = readIdentifier(map.id, `${path}.id`);
  const mapFile = readText(map.mapFile, `${path}.mapFile`);
  const label = readV2Text(normalizeSourceText(map.label, `${path}.label`), `${path}.label`);
  const season = readSeason(map.season, `${path}.season`);
  const expectedThumbnail = `/api/projects/${projectId}/maps/${id}/thumbnail`;
  if (map.thumbnail !== expectedThumbnail) fail(`${path}.thumbnail`, `must equal ${JSON.stringify(expectedThumbnail)}`, map.thumbnail);
  const renovations = map.renovations === undefined ? [] : map.renovations;
  if (!Array.isArray(renovations)) fail(`${path}.renovations`, "must be an array", renovations);
  const decor = map.decor === undefined
    ? { wallpapers: {}, floors: {} }
    : map.decor;
  return { id, mapFile, label, season, state: assertExactRecord(map.state, `${path}.state`, ["buildings", "crops", "items", "nextBuildingId", "nextItemId"]), decor: assertExactRecord(decor, `${path}.decor`, ["wallpapers", "floors"]), renovations };
}

function convertReferenceProject(sourceProject: SourceProject) {
  const mapInstances: Record<string, { baseMapId: string; name: string; state: JsonSafeValue }> = {};
  sourceProject.maps.forEach((sourceMap, mapIndex) => {
    mapInstances[sourceMap.id] = convertSourceMap(sourceMap, `${sourceProject.path}.maps[${String(mapIndex)}]`);
  });
  return { formatVersion: 2 as const, id: sourceProject.id, name: sourceProject.title, createdAt: sourceProject.createdAt, updatedAt: sourceProject.updatedAt, activeMapInstanceId: sourceProject.activeMapId, mapInstances };
}

function convertSourceMap(sourceMap: SourceMap, path: string) {
  const mapMapping = findReferenceLocalProjectMapMapping(sourceMap.mapFile);
  if (mapMapping === undefined) fail(`${path}.mapFile`, `Unknown source mapFile ${JSON.stringify(sourceMap.mapFile)}`, sourceMap.mapFile);
  const { baseMapId } = mapMapping;
  const placementSnapshot = convertPlacementSnapshot(sourceMap.state, sourceMap.decor, path);
  const mapRenderOptions = convertRenovations(sourceMap.renovations, baseMapId, `${path}.renovations`);
  return {
    baseMapId,
    name: sourceMap.label,
    state: createProjectMapState(sourceMap.season, placementSnapshot, mapRenderOptions),
  };
}

function convertPlacementSnapshot(state: JsonRecord, decor: JsonRecord, path: string): PlacementSnapshot {
  const buildings = readArray(state.buildings, `${path}.state.buildings`).map((building, index) => convertBuilding(building, `${path}.state.buildings[${String(index)}]`));
  const crops = readArray(state.crops, `${path}.state.crops`).map((crop, index) => convertCrop(crop, `${path}.state.crops[${String(index)}]`));
  const items = readArray(state.items, `${path}.state.items`).map((item, index) => convertItem(item, `${path}.state.items[${String(index)}]`));
  const snapshot = {
    buildings,
    crops,
    items,
    nextBuildingId: readPositiveInteger(state.nextBuildingId, `${path}.state.nextBuildingId`),
    nextItemId: readPositiveInteger(state.nextItemId, `${path}.state.nextItemId`),
    interiorDecor: restoreTargetInteriorDecor(decor, `${path}.decor`),
  };
  return wrapTargetValidation(
    () => createPersistentPlacementSnapshot(snapshot),
    `${path}.state`,
    state,
    "placement snapshot",
    isPlacementSnapshotValidationError,
  );
}

function convertBuilding(rawBuilding: unknown, path: string): PlacementBuilding {
  const building = assertAllowedRecord(rawBuilding, path, ["instanceId", "buildingId", "x", "y"], ["paintColor", "waterColor", "variant", "locked"]);
  rejectPresent(building, "waterColor", path); rejectPresent(building, "variant", path); rejectPresent(building, "locked", path);
  const mapping = getManifestCatalogMapping("building", readText(building.buildingId, `${path}.buildingId`), `${path}.buildingId`);
  const result = { instanceId: readGeneratedInstanceId(building.instanceId, "b", `${path}.instanceId`), buildingId: mapping.storedId, x: readInteger(building.x, `${path}.x`), y: readInteger(building.y, `${path}.y`) };
  return Object.hasOwn(building, "paintColor")
    ? { ...result, paintColors: convertPaint(building.paintColor, mapping.storedId, `${path}.paintColor`) }
    : result;
}

function convertCrop(rawCrop: unknown, path: string): PlacementCrop {
  const crop = assertExactRecord(rawCrop, path, ["cropId", "x", "y"]);
  const mapping = getManifestCatalogMapping("crop", readText(crop.cropId, `${path}.cropId`), `${path}.cropId`);
  return { cropId: mapping.storedId, x: readInteger(crop.x, `${path}.x`), y: readInteger(crop.y, `${path}.y`) };
}

function convertItem(rawItem: unknown, path: string): PlacementItem {
  const item = assertAllowedRecord(rawItem, path, ["instanceId", "itemId", "x", "y", "layer", "rotation", "footprint", "variant", "tintColor", "locked", "isRug", "isGrass", "isTable", "isLongTable", "flipped", "bedType"], ["heldItemId"]);
  if (Object.hasOwn(item, "heldItemId")) fail(`${path}.heldItemId`, "is unsupported", item.heldItemId);
  const mapping = getManifestCatalogMapping("item", readText(item.itemId, `${path}.itemId`), `${path}.itemId`);
  const footprint = assertExactRecord(item.footprint, `${path}.footprint`, ["w", "h"]);
  return { instanceId: readGeneratedInstanceId(item.instanceId, "i", `${path}.instanceId`), itemId: mapping.storedId, x: readInteger(item.x, `${path}.x`), y: readInteger(item.y, `${path}.y`), layer: readItemLayer(item.layer, `${path}.layer`), rotation: readInteger(item.rotation, `${path}.rotation`), footprint: { width: readPositiveInteger(footprint.w, `${path}.footprint.w`), height: readPositiveInteger(footprint.h, `${path}.footprint.h`) }, variant: readInteger(item.variant, `${path}.variant`), tintColor: readHex(item.tintColor, `${path}.tintColor`), locked: readBoolean(item.locked, `${path}.locked`), isRug: readBoolean(item.isRug, `${path}.isRug`), isGrass: readBoolean(item.isGrass, `${path}.isGrass`), isTable: readBoolean(item.isTable, `${path}.isTable`), isLongTable: readBoolean(item.isLongTable, `${path}.isLongTable`), flipped: readBoolean(item.flipped, `${path}.flipped`), bedType: readNullableText(item.bedType, `${path}.bedType`) };
}

function convertRenovations(rawRenovations: readonly unknown[], baseMapId: string, path: string) {
  if (rawRenovations.length === 0) return undefined;
  if (baseMapId !== "farmhouse-2") fail(path, "is supported only on FarmHouse2.tmx", rawRenovations);
  const renovationIds = rawRenovations.map((rawRenovation, index) => {
    const sourceRenovation = readText(rawRenovation, `${path}[${String(index)}]`);
    const targetRenovation = renovationMappings[sourceRenovation];
    if (targetRenovation === undefined) fail(`${path}[${String(index)}]`, "is not a supported renovation", sourceRenovation);
    return targetRenovation;
  });
  if (new Set(renovationIds).size !== renovationIds.length) fail(path, "must not contain duplicate renovations", renovationIds);
  if (renovationIds.some((id, index) => index > 0 && renovationOrder.indexOf(id) <= renovationOrder.indexOf(renovationIds[index - 1]!))) fail(path, "must use target renovation order", renovationIds);
  const selected = new Set(renovationIds);
  renovationIds.forEach((id) => renovationDependencies[id]!.forEach((dependency) => { if (!selected.has(dependency)) fail(path, `${JSON.stringify(id)} requires ${JSON.stringify(dependency)}`, renovationIds); }));
  return wrapTargetValidation(
    () => restoreMapRenderOptions({ gingerIslandOverlayIds: [], farmhouse2: { marriageMapEnabled: false, renovationIds, spouseId: null } }),
    path,
    rawRenovations,
    "map renovations",
    isMapRenderOptionsValidationError,
  );
}

function convertPaint(rawPaint: unknown, buildingId: string, path: string) {
  const paint = assertExactRecord(rawPaint, path, ["color1", "color2", "color3"]);
  if (!isBuildingPaintable(buildingId)) fail(path, `cannot be assigned to non-paintable building ${JSON.stringify(buildingId)}`, rawPaint);
  return { color1: convertHsl(paint.color1, `${path}.color1`), color2: convertHsl(paint.color2, `${path}.color2`), color3: convertHsl(paint.color3, `${path}.color3`) };
}

function restoreTargetInteriorDecor(rawDecor: JsonRecord, path: string) {
  return wrapTargetValidation(
    () => restoreInteriorDecorState(rawDecor),
    path,
    rawDecor,
    "interior decor",
    isInteriorDecorValidationError,
  );
}

function wrapTargetValidation<Value>(
  validateTargetValue: () => Value,
  sourcePath: string,
  sourceValue: unknown,
  targetArea: string,
  isExpectedTargetValidationError: (caughtError: Error) => boolean,
): Value {
  try {
    return validateTargetValue();
  } catch (caughtError) {
    if (
      caughtError instanceof Error &&
      isExpectedTargetValidationError(caughtError)
    ) {
      fail(
        sourcePath,
        `${targetArea} cannot represent this source value because ${caughtError.message}`,
        sourceValue,
      );
    }
    throw caughtError;
  }
}

function isInteriorDecorValidationError(caughtError: Error): boolean {
  return caughtError.message.startsWith("Interior decor ");
}

function isPlacementSnapshotValidationError(caughtError: Error): boolean {
  return caughtError.message.startsWith("Placement snapshot ") ||
    caughtError.message.startsWith("Building paint ") ||
    isInteriorDecorValidationError(caughtError);
}

function isMapRenderOptionsValidationError(caughtError: Error): boolean {
  return caughtError.message.startsWith("Map render options");
}

function convertHsl(rawColor: unknown, path: string): string {
  const color = assertExactRecord(rawColor, path, ["hue", "saturation", "lightness"]);
  const hue = readNumberInRange(color.hue, 0, 360, `${path}.hue`); const saturation = readNumberInRange(color.saturation, 0, 100, `${path}.saturation`) / 100; const lightness = readNumberInRange(color.lightness, 0, 100, `${path}.lightness`) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation; const segment = hue / 60; const second = chroma * (1 - Math.abs((segment % 2) - 1));
  const [red, green, blue] = segment < 1 ? [chroma, second, 0] : segment < 2 ? [second, chroma, 0] : segment < 3 ? [0, chroma, second] : segment < 4 ? [0, second, chroma] : segment < 5 ? [second, 0, chroma] : [chroma, 0, second];
  const match = lightness - chroma / 2;
  return `#${[red, green, blue].map((channel) => Math.round((channel + match) * 255).toString(16).padStart(2, "0")).join("")}`;
}

function getManifestCatalogMapping(context: ReferenceLocalProjectCatalogContext, sourceId: string, path: string) {
  const mapping = findReferenceLocalProjectCatalogMapping(context, sourceId);
  if (mapping === undefined) fail(path, `Unknown frozen ${context} source ID ${JSON.stringify(sourceId)}`, sourceId);
  return mapping;
}

function assertExactRecord(raw: unknown, path: string, fields: readonly string[]): JsonRecord { return assertAllowedRecord(raw, path, fields, []); }
function assertAllowedRecord(raw: unknown, path: string, required: readonly string[], optional: readonly string[]): JsonRecord { if (raw === null || typeof raw !== "object" || Array.isArray(raw) || (Object.getPrototypeOf(raw) !== Object.prototype && Object.getPrototypeOf(raw) !== null)) fail(path, "must be a plain object", raw); const record = raw as JsonRecord; for (const field of required) if (!Object.hasOwn(record, field)) fail(`${path}.${field}`, "is required", undefined); for (const field of Object.keys(record)) if (!required.includes(field) && !optional.includes(field)) fail(`${path}.${field}`, "is not supported", record[field]); return record; }
function assertEmptyThumbnailRecord(raw: unknown, path: string): void { const record = assertExactRecord(raw, path, []); if (Object.keys(record).length > 0) fail(path, "must be empty because thumbnails are unsupported", raw); }
function readArray(raw: unknown, path: string): readonly unknown[] { if (!Array.isArray(raw)) fail(path, "must be an array", raw); return raw; }
function readText(raw: unknown, path: string): string { if (typeof raw !== "string" || raw.length === 0) fail(path, "must be a non-empty string", raw); return raw; }
function readNullableText(raw: unknown, path: string): string | null { if (raw === null) return null; return readText(raw, path); }
function normalizeSourceText(raw: unknown, path: string): string { const value = readText(raw, path).trim(); if (value.length === 0 || value.length > 100) fail(path, "must contain 1 through 100 characters after trimming", raw); return value; }
function readV2Text(value: string, path: string): string { if (value.length > 80) fail(path, "exceeds the V2 80-character limit after source normalization", value); return value; }
function readIdentifier(raw: unknown, path: string): string { const value = readText(raw, path); if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/.test(value)) fail(path, "must be a safe source identifier", value); return value; }
function readTimestamp(raw: unknown, path: string): string { const value = readText(raw, path); const milliseconds = Date.parse(value); if (Number.isNaN(milliseconds) || new Date(milliseconds).toISOString() !== value) fail(path, "must be a canonical ISO timestamp", value); return value; }
function readSeason(raw: unknown, path: string): "spring" | "summer" | "fall" | "winter" { if (!seasons.has(raw as string)) fail(path, "must be a supported season", raw); return raw as "spring" | "summer" | "fall" | "winter"; }
function readInteger(raw: unknown, path: string): number { if (typeof raw !== "number" || !Number.isSafeInteger(raw)) fail(path, "must be a safe integer", raw); return raw; }
function readPositiveInteger(raw: unknown, path: string): number { const value = readInteger(raw, path); if (value < 1) fail(path, "must be positive", raw); return value; }
function readGeneratedInstanceId(raw: unknown, prefix: string, path: string): number { const value = readText(raw, path); const match = new RegExp(`^${prefix}([1-9][0-9]*)$`).exec(value); if (match === null) fail(path, `must be a canonical ${prefix}-prefixed generated identifier`, value); const numericId = Number(match![1]); if (!Number.isSafeInteger(numericId)) fail(path, "must be a safe generated identifier", value); return numericId; }
function readBoolean(raw: unknown, path: string): boolean { if (typeof raw !== "boolean") fail(path, "must be a boolean", raw); return raw; }
function readItemLayer(raw: unknown, path: string): "item" | "path" | "fence" { if (raw !== "item" && raw !== "path" && raw !== "fence") fail(path, "must be item, path, or fence", raw); return raw; }
function readHex(raw: unknown, path: string): string { const value = readText(raw, path); if (!/^#[0-9a-f]{6}$/i.test(value)) fail(path, "must be a six-digit hex color", value); return value.toLowerCase(); }
function readNumberInRange(raw: unknown, minimum: number, maximum: number, path: string): number { if (typeof raw !== "number" || !Number.isFinite(raw) || raw < minimum || raw > maximum) fail(path, `must be a finite number from ${String(minimum)} through ${String(maximum)}`, raw); return raw; }
function rejectPresent(record: JsonRecord, field: string, path: string): void { if (Object.hasOwn(record, field)) fail(`${path}.${field}`, "is unsupported", record[field]); }
function fail(path: string, message: string, value: unknown): never { throw new ReferenceProjectMigrationError(`${path}: ${message}; received ${describeValue(value)}.`); }
function describeValue(value: unknown): string { return value === undefined ? "undefined" : JSON.stringify(value); }
