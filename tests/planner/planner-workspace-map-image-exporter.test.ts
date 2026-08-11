import { describe, expect, it, vi } from "vitest";
import {
  captureCurrentCleanMapImage,
  captureCurrentMapScreenshot,
  createCurrentMapImageExporterSlot,
  getCurrentMapImageExporter,
  updateCurrentMapImageExporter,
} from "../../src/planner/planner-workspace-map-image-exporter";
import { MapImageExportError } from "../../src/projects/map-image-export";

describe("planner workspace map image exporter", () => {
  it("ignores stale callbacks and clears only a matching current map", () => {
    const currentMapImageExporterSlot = createCurrentMapImageExporterSlot();
    const currentExporter = { captureCleanMapImage: vi.fn(), captureScreenshot: vi.fn() };
    updateCurrentMapImageExporter(currentMapImageExporterSlot, "farm", "farm", currentExporter);
    updateCurrentMapImageExporter(currentMapImageExporterSlot, "farm", "island", null);
    expect(getCurrentMapImageExporter(currentMapImageExporterSlot, "farm")).toBe(currentExporter);
    updateCurrentMapImageExporter(currentMapImageExporterSlot, "farm", "farm", null);
    expect(() =>
      getCurrentMapImageExporter(currentMapImageExporterSlot, "farm"),
    ).toThrow("registered planner map ID null");
  });

  it("does not let a stale ready exporter replace the current exact exporter", () => {
    const currentMapImageExporterSlot = createCurrentMapImageExporterSlot();
    const currentExporter = { captureCleanMapImage: vi.fn(), captureScreenshot: vi.fn() };
    const staleExporter = { captureCleanMapImage: vi.fn(), captureScreenshot: vi.fn() };

    updateCurrentMapImageExporter(currentMapImageExporterSlot, "farm", "farm", currentExporter);
    updateCurrentMapImageExporter(currentMapImageExporterSlot, "farm", "island", staleExporter);

    expect(getCurrentMapImageExporter(currentMapImageExporterSlot, "farm")).toBe(currentExporter);
  });

  it("does not let an old map cleanup clear a newly registered exporter", () => {
    const currentMapImageExporterSlot = createCurrentMapImageExporterSlot();
    const newMapExporter = { captureCleanMapImage: vi.fn(), captureScreenshot: vi.fn() };
    updateCurrentMapImageExporter(
      currentMapImageExporterSlot,
      "island",
      "island",
      newMapExporter,
    );

    updateCurrentMapImageExporter(
      currentMapImageExporterSlot,
      "farm",
      "farm",
      null,
    );

    expect(getCurrentMapImageExporter(currentMapImageExporterSlot, "island")).toBe(
      newMapExporter,
    );
  });

  it("forwards exact screenshot resolutions and fails without the exact exporter", async () => {
    const currentMapImageExporterSlot = createCurrentMapImageExporterSlot();
    const captureScreenshot = vi.fn(async () => new Blob(["png"], { type: "image/png" }));
    const captureCleanMapImage = vi.fn(async () => new Blob(["clean png"], { type: "image/png" }));
    updateCurrentMapImageExporter(currentMapImageExporterSlot, "farm", "farm", {
      captureCleanMapImage,
      captureScreenshot,
    });

    await captureCurrentMapScreenshot(currentMapImageExporterSlot, "farm", 1);
    await captureCurrentMapScreenshot(currentMapImageExporterSlot, "farm", 2);

    expect(captureScreenshot).toHaveBeenNthCalledWith(1, 1);
    expect(captureScreenshot).toHaveBeenNthCalledWith(2, 2);
    expect(captureCleanMapImage).not.toHaveBeenCalled();
    expect(() => captureCurrentMapScreenshot(currentMapImageExporterSlot, "island", 1)).toThrow(
      'Current map image exporter is unavailable',
    );
    expect(() => captureCurrentMapScreenshot(currentMapImageExporterSlot, "island", 1)).toThrow(
      MapImageExportError,
    );
  });

  it("forwards clean-map capture without calling the watermarked screenshot exporter", async () => {
    const currentMapImageExporterSlot = createCurrentMapImageExporterSlot();
    const captureCleanMapImage = vi.fn(async () => new Blob(["clean png"], { type: "image/png" }));
    const captureScreenshot = vi.fn(async () => new Blob(["watermarked png"], { type: "image/png" }));
    updateCurrentMapImageExporter(currentMapImageExporterSlot, "farm", "farm", {
      captureCleanMapImage,
      captureScreenshot,
    });

    await captureCurrentCleanMapImage(currentMapImageExporterSlot, "farm", 1);

    expect(captureCleanMapImage).toHaveBeenCalledWith(1);
    expect(captureScreenshot).not.toHaveBeenCalled();
  });
});
