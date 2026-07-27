import { describe, expect, it } from "vitest";
import {
  clearMapImageExporter,
  createMapImageDownloadFile,
  screenshotResolutions,
} from "../../src/projects/map-image-export";

describe("map image export", () => {
  it("creates the source-shaped screenshot download description", () => {
    expect(
      createMapImageDownloadFile({
        mapFile: "Farm.tmx",
        season: "spring",
        dateStamp: "2026-07-26",
      }),
    ).toEqual({
      filename: "Farm_spring_2026-07-26.png",
      mimeType: "image/png",
    });
    expect(screenshotResolutions).toEqual([1, 2]);
  });

  it("rejects invalid map file, season, and date values at the export boundary", () => {
    expect(() =>
      createMapImageDownloadFile({
        mapFile: "../Farm.tmx",
        season: "spring",
        dateStamp: "2026-07-26",
      }),
    ).toThrow('Map image export mapFile must be a .tmx filename without path separators; received "../Farm.tmx"');

    expect(() =>
      createMapImageDownloadFile({
        mapFile: "Farm.tmx",
        season: "rainy",
        dateStamp: "2026-07-26",
      }),
    ).toThrow('Map image export season must be one of "spring", "summer", "fall", "winter"; received "rainy"');

    expect(() =>
      createMapImageDownloadFile({
        mapFile: "Farm.tmx",
        season: "spring",
        dateStamp: "07-26-2026",
      }),
    ).toThrow('Map image export date stamp must match YYYY-MM-DD; received "07-26-2026"');
  });

  it("clears an obsolete map exporter before switching maps", () => {
    const staleMapExporterReference = {
      current: {
        captureScreenshot: async () => new Blob(["png"], { type: "image/png" }),
      },
    };

    clearMapImageExporter(staleMapExporterReference);

    expect(staleMapExporterReference.current).toBeNull();
  });
});
