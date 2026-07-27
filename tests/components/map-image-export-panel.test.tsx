import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  formatMapImageExportError,
  MapImageExportPanel,
} from "../../src/components/map-image-export-panel";
import { MapImageExportError } from "../../src/projects/map-image-export";

describe("map image export panel", () => {
  it("renders the source-shaped 1x and HQ screenshot controls", () => {
    const markup = renderToStaticMarkup(
      createElement(MapImageExportPanel, {
        mapFile: "Farm.tmx",
        onCaptureScreenshot: async () =>
          new Blob(["png"], { type: "image/png" }),
        season: "spring",
      }),
    );

    expect(markup).toContain("Screenshot");
    expect(markup).toContain("Screenshot (HQ)");
    expect(markup).toContain('title="1x resolution, compact file size"');
    expect(markup).toContain('title="2x resolution, higher quality"');
  });

  it("shows known screenshot export errors and rethrows unknown failures", () => {
    expect(
      formatMapImageExportError(new MapImageExportError("Map is loading.")),
    ).toBe("Screenshot export failed: Map is loading.");
    expect(() => formatMapImageExportError(new Error("Unexpected Pixi fault."))).toThrow(
      "Unexpected Pixi fault.",
    );
  });
});
