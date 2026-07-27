import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  getNextInteriorDecorKind,
  InteriorDecorPanel,
} from "../../src/components/interior-decor-panel";
import {
  interiorFlooringPatterns,
  interiorWallpaperPatterns,
} from "../../src/interior-decor/interior-decor-catalog";

describe("interior decor panel", () => {
  it("supports roving tab keyboard navigation between wallpaper and flooring", () => {
    expect(getNextInteriorDecorKind("wallpaper", "ArrowRight")).toBe(
      "flooring",
    );
    expect(getNextInteriorDecorKind("flooring", "ArrowRight")).toBe(
      "wallpaper",
    );
    expect(getNextInteriorDecorKind("wallpaper", "ArrowLeft")).toBe(
      "flooring",
    );
    expect(getNextInteriorDecorKind("flooring", "Home")).toBe("wallpaper");
    expect(getNextInteriorDecorKind("wallpaper", "End")).toBe("flooring");
    expect(getNextInteriorDecorKind("wallpaper", "Enter")).toBeNull();
  });

  it("does not render on a map without verified interior decor regions", () => {
    const markup = renderToStaticMarkup(
      createElement(InteriorDecorPanel, {
        mapId: "standard",
        selectedPattern: null,
        onPatternSelect: () => undefined,
      }),
    );

    expect(markup).toBe("");
  });

  it("renders accessible wallpaper and flooring selections with the selected pattern", () => {
    const selectedPattern = interiorWallpaperPatterns[17];

    if (selectedPattern === undefined) {
      throw new Error("Interior decor catalog must contain wallpaper 17.");
    }

    const markup = renderToStaticMarkup(
      createElement(InteriorDecorPanel, {
        mapId: "farmhouse-2",
        selectedPattern,
        onPatternSelect: () => undefined,
      }),
    );

    expect(markup).toContain('aria-label="Interior decor"');
    expect(markup).toContain(">Wallpapers</button>");
    expect(markup).toContain(">Flooring</button>");
    expect(markup).toContain('aria-label="Select Wallpaper 17"');
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain(
      "background-image:url(/game-assets/1.6.15/tilesheets/walls_and_floors.png)",
    );
    expect(markup).toContain("width:16px");
    expect(markup).toContain("height:28px");
    expect(markup).toMatch(/id="[^"]+-tab-wallpaper"/);
    expect(markup).toMatch(/aria-labelledby="[^"]+-tab-wallpaper"/);
    expect(markup).toMatch(/aria-controls="[^"]+-panel-flooring"/);
    expect(markup).toMatch(/id="[^"]+-panel-flooring"/);
  });

  it("clips flooring previews to their original 28 by 26 source rectangle", () => {
    const selectedPattern = interiorFlooringPatterns[0];

    if (selectedPattern === undefined) {
      throw new Error("Interior decor catalog must contain flooring 0.");
    }

    const markup = renderToStaticMarkup(
      createElement(InteriorDecorPanel, {
        mapId: "shed",
        selectedPattern,
        onPatternSelect: () => undefined,
      }),
    );

    expect(markup).toContain("width:28px");
    expect(markup).toContain("height:26px");
  });
});
