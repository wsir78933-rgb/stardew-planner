"use client";

import { useState } from "react";
import {
  downloadBrowserFile,
  type BrowserFileDownload,
  isBrowserFileDownloadError,
} from "../projects/browser-file-download";
import {
  createMapImageDownloadFile,
  MapImageExportError,
  type ScreenshotResolution,
} from "../projects/map-image-export";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";

type MapImageExportPanelProperties = Readonly<{
  mapFile: string;
  onCaptureScreenshot: (resolution: ScreenshotResolution) => Promise<Blob>;
  season: TilesheetSeason;
}>;

type MapImageFileDownloader = (file: BrowserFileDownload) => void;

export type MapImageScreenshotExportRequest = Readonly<{
  downloadFile?: MapImageFileDownloader;
  mapFile: string;
  onCaptureScreenshot: (resolution: ScreenshotResolution) => Promise<Blob>;
  resolution: ScreenshotResolution;
  season: TilesheetSeason;
}>;

export function MapImageExportPanel({
  mapFile,
  onCaptureScreenshot,
  season,
}: MapImageExportPanelProperties) {
  const [exportErrorMessage, setExportErrorMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  async function handleScreenshotExport(
    resolution: ScreenshotResolution,
  ): Promise<void> {
    try {
      setIsExporting(true);
      await exportMapImageScreenshot({
        mapFile,
        onCaptureScreenshot,
        resolution,
        season,
      });
      setExportErrorMessage(null);
    } catch (caughtError) {
      setExportErrorMessage(formatMapImageExportError(caughtError));
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section aria-label="Export" className="map-image-export-panel">
      <h3>Export</h3>
      <div className="map-image-export-panel__actions">
        <button
          disabled={isExporting}
          onClick={() => void handleScreenshotExport(1)}
          title="1x resolution, compact file size"
          type="button"
        >
          Screenshot
        </button>
        <button
          disabled={isExporting}
          onClick={() => void handleScreenshotExport(2)}
          title="2x resolution, higher quality"
          type="button"
        >
          Screenshot (HQ)
        </button>
      </div>
      {exportErrorMessage !== null ? (
        <p className="map-image-export-panel__error" role="alert">
          {exportErrorMessage}
        </p>
      ) : null}
    </section>
  );
}

export async function exportMapImageScreenshot({
  downloadFile = downloadBrowserFile,
  mapFile,
  onCaptureScreenshot,
  resolution,
  season,
}: MapImageScreenshotExportRequest): Promise<void> {
  const screenshotBlob = await onCaptureScreenshot(resolution);
  assertPngScreenshotBlob(screenshotBlob);
  const mapImageDownloadFile = createMapImageDownloadFile({
    dateStamp: new Date().toISOString().slice(0, 10),
    mapFile,
    season,
  });

  downloadFile({
    blob: screenshotBlob,
    filename: mapImageDownloadFile.filename,
  });
}

function assertPngScreenshotBlob(screenshotBlob: Blob): void {
  if (!(screenshotBlob instanceof Blob)) {
    throw new MapImageExportError(
      `Map screenshot export must produce a Blob; received ${describeValue(screenshotBlob)}.`,
    );
  }

  if (screenshotBlob.type !== "image/png") {
    throw new MapImageExportError(
      `Map screenshot export must produce image/png; received ${describeValue(screenshotBlob.type)}.`,
    );
  }
}

export function formatMapImageExportError(caughtError: unknown): string {
  if (
    caughtError instanceof MapImageExportError ||
    isBrowserFileDownloadError(caughtError)
  ) {
    return `Screenshot export failed: ${caughtError.message}`;
  }

  throw caughtError;
}

function describeValue(value: unknown): string {
  return JSON.stringify(value);
}
