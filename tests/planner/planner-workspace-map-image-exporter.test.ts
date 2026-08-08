import { describe, expect, it, vi } from "vitest";
import {
  captureCurrentMapScreenshot,
  createCurrentMapImageExporterSlot,
  getCurrentMapImageExporter,
  updateCurrentMapImageExporter,
} from "../../src/planner/planner-workspace-map-image-exporter";
import { MapImageExportError } from "../../src/projects/map-image-export";

describe("planner workspace map image exporter", () => {
  it("ignores stale callbacks and clears only a matching current map", () => {
    const currentMapImageExporterSlot = createCurrentMapImageExporterSlot();
    const currentExporter = { captureScreenshot: vi.fn() };
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
    const currentExporter = { captureScreenshot: vi.fn() };
    const staleExporter = { captureScreenshot: vi.fn() };

    updateCurrentMapImageExporter(currentMapImageExporterSlot, "farm", "farm", currentExporter);
    updateCurrentMapImageExporter(currentMapImageExporterSlot, "farm", "island", staleExporter);

    expect(getCurrentMapImageExporter(currentMapImageExporterSlot, "farm")).toBe(currentExporter);
  });

  it("does not let an old map cleanup clear a newly registered exporter", () => {
    const currentMapImageExporterSlot = createCurrentMapImageExporterSlot();
    const newMapExporter = { captureScreenshot: vi.fn() };
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
    updateCurrentMapImageExporter(currentMapImageExporterSlot, "farm", "farm", { captureScreenshot });

    await captureCurrentMapScreenshot(currentMapImageExporterSlot, "farm", 1);
    await captureCurrentMapScreenshot(currentMapImageExporterSlot, "farm", 2);

    expect(captureScreenshot).toHaveBeenNthCalledWith(1, 1);
    expect(captureScreenshot).toHaveBeenNthCalledWith(2, 2);
    expect(() => captureCurrentMapScreenshot(currentMapImageExporterSlot, "island", 1)).toThrow(
      'Current map image exporter is unavailable',
    );
    expect(() => captureCurrentMapScreenshot(currentMapImageExporterSlot, "island", 1)).toThrow(
      MapImageExportError,
    );
  });
});
