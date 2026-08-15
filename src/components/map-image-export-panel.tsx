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
import type { ImageExportCopy } from "../i18n/save-modal-copy";

type MapImageExportPanelProperties = Readonly<{
  copy: ImageExportCopy;
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
  copy,
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
      setExportErrorMessage(formatMapImageExportError(caughtError, copy));
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section aria-label={copy.exportLabel} className="map-image-export-panel">
      <h3>{copy.exportLabel}</h3>
      <div className="map-image-export-panel__actions">
        <button
          disabled={isExporting}
          onClick={() => void handleScreenshotExport(1)}
          title={copy.screenshotTitle}
          type="button"
        >
          {copy.screenshot}
        </button>
        <button
          disabled={isExporting}
          onClick={() => void handleScreenshotExport(2)}
          title={copy.screenshotHighQualityTitle}
          type="button"
        >
          {copy.screenshotHighQuality}
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

export function formatMapImageExportError(
  caughtError: unknown,
  imageExportCopy: ImageExportCopy,
): string {
  if (
    caughtError instanceof MapImageExportError ||
    isBrowserFileDownloadError(caughtError)
  ) {
    return imageExportCopy.exportFailure(caughtError.message);
  }

  throw caughtError;
}

function describeValue(value: unknown): string {
  return JSON.stringify(value);
}
