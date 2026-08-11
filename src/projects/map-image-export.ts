import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";

export const screenshotResolutions = [1, 2] as const;

export type ScreenshotResolution = (typeof screenshotResolutions)[number];

export type MapImageExporter = Readonly<{
  captureCleanMapImage: (resolution: ScreenshotResolution) => Promise<Blob>;
  captureScreenshot: (resolution: ScreenshotResolution) => Promise<Blob>;
}>;

export type MapImageExporterReference = {
  current: MapImageExporter | null;
};

export class MapImageExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MapImageExportError";
  }
}

export type MapImageDownloadFile = Readonly<{
  filename: string;
  mimeType: "image/png";
}>;

type CreateMapImageDownloadFileInput = Readonly<{
  mapFile: string;
  season: string;
  dateStamp: string;
}>;

const supportedSeasons = ["spring", "summer", "fall", "winter"] as const;

export function clearMapImageExporter(
  mapImageExporterReference: MapImageExporterReference,
): void {
  mapImageExporterReference.current = null;
}

export function createMapImageDownloadFile(
  createMapImageDownloadFileInput: CreateMapImageDownloadFileInput,
): MapImageDownloadFile {
  assertMapImageDownloadFileInput(createMapImageDownloadFileInput);
  const { dateStamp, mapFile, season } = createMapImageDownloadFileInput;

  return {
    filename: `${mapFile.slice(0, -".tmx".length)}_${season}_${dateStamp}.png`,
    mimeType: "image/png",
  };
}

function assertMapImageDownloadFileInput(
  createMapImageDownloadFileInput: CreateMapImageDownloadFileInput,
): void {
  if (
    typeof createMapImageDownloadFileInput !== "object" ||
    createMapImageDownloadFileInput === null
  ) {
    throw new MapImageExportError(
      `Map image export input must be a non-null object; received ${describeValue(createMapImageDownloadFileInput)}.`,
    );
  }

  assertMapFile(createMapImageDownloadFileInput.mapFile);
  assertSeason(createMapImageDownloadFileInput.season);
  assertDateStamp(createMapImageDownloadFileInput.dateStamp);
}

function assertMapFile(mapFile: string): void {
  if (
    typeof mapFile !== "string" ||
    !/^[^/\\]+\.tmx$/.test(mapFile)
  ) {
    throw new MapImageExportError(
      `Map image export mapFile must be a .tmx filename without path separators; received ${describeValue(mapFile)}.`,
    );
  }
}

function assertSeason(season: string): asserts season is TilesheetSeason {
  if (!(supportedSeasons as readonly string[]).includes(season)) {
    throw new MapImageExportError(
      `Map image export season must be one of "spring", "summer", "fall", "winter"; received ${describeValue(season)}.`,
    );
  }
}

function assertDateStamp(dateStamp: string): void {
  if (typeof dateStamp !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateStamp)) {
    throw new MapImageExportError(
      `Map image export date stamp must match YYYY-MM-DD; received ${describeValue(dateStamp)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  return JSON.stringify(value);
}
