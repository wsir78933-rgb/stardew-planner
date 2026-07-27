"use client";

import { useState } from "react";
import {
  createMapImageDownloadFile,
  MapImageExportError,
  type ScreenshotResolution,
} from "../projects/map-image-export";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import type { SiteLocale } from "../i18n/locales";
import { translate } from "../i18n/messages";

type MapImageExportPanelProperties = Readonly<{
  locale?: SiteLocale;
  mapFile: string;
  onCaptureScreenshot: (resolution: ScreenshotResolution) => Promise<Blob>;
  season: TilesheetSeason;
}>;

export function MapImageExportPanel({
  locale = "en",
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
      const screenshotBlob = await onCaptureScreenshot(resolution);
      assertPngScreenshotBlob(screenshotBlob);
      const mapImageDownloadFile = createMapImageDownloadFile({
        dateStamp: new Date().toISOString().slice(0, 10),
        mapFile,
        season,
      });

      downloadMapImage(screenshotBlob, mapImageDownloadFile.filename);
      setExportErrorMessage(null);
    } catch (caughtError) {
      setExportErrorMessage(formatMapImageExportError(caughtError, locale));
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section aria-label={translate(locale, "planner.export.label")} className="map-image-export-panel">
      <h3>{translate(locale, "planner.export.label")}</h3>
      <div className="map-image-export-panel__actions">
        <button
          disabled={isExporting}
          onClick={() => void handleScreenshotExport(1)}
          title={translate(locale, "planner.export.compactTitle")}
          type="button"
        >
          {translate(locale, "planner.export.screenshot")}
        </button>
        <button
          disabled={isExporting}
          onClick={() => void handleScreenshotExport(2)}
          title={translate(locale, "planner.export.hqTitle")}
          type="button"
        >
          {translate(locale, "planner.export.screenshotHq")}
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

function downloadMapImage(screenshotBlob: Blob, filename: string): void {
  if (typeof document === "undefined") {
    throw new MapImageExportError(
      `Cannot download map screenshot ${JSON.stringify(filename)} without a browser document.`,
    );
  }

  if (typeof URL.createObjectURL !== "function") {
    throw new MapImageExportError(
      `Cannot download map screenshot ${JSON.stringify(filename)} because URL.createObjectURL is unavailable.`,
    );
  }

  const screenshotUrl = URL.createObjectURL(screenshotBlob);
  const screenshotLink = document.createElement("a");

  screenshotLink.download = filename;
  screenshotLink.href = screenshotUrl;
  screenshotLink.style.display = "none";
  document.body.append(screenshotLink);
  screenshotLink.click();
  screenshotLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(screenshotUrl), 0);
}

export function formatMapImageExportError(
  caughtError: unknown,
  locale: SiteLocale = "en",
): string {
  if (classifyMapImageExportError(caughtError) === "map-image-export") {
    return translate(locale, "planner.export.error");
  }

  throw caughtError;
}

function classifyMapImageExportError(
  caughtError: unknown,
): "map-image-export" | null {
  return caughtError instanceof MapImageExportError ? "map-image-export" : null;
}

function describeValue(value: unknown): string {
  return JSON.stringify(value);
}
