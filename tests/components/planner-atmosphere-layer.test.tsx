import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  PlannerAtmosphereLayer,
  type PlannerAtmosphereLayerProperties,
  type PlannerAtmosphereMapProjection,
  type PlannerAtmosphereMapViewportBounds,
} from "../../src/components/planner-atmosphere-layer";
import { createInitialPlannerAmbienceOptions } from "../../src/editor/planner-ambience-options";

const visibleMapViewportBounds = {
  left: 340,
  top: 40,
  width: 600,
  height: 500,
} as const;

const projectedStandardMap = {
  mapFile: "Farm.tmx",
  mapWidthTiles: 80,
  mapHeightTiles: 56,
  mapScreenLeft: 340,
  mapScreenTop: 40,
  cameraZoom: 1,
} as const;

describe("PlannerAtmosphereLayer", () => {
  it("positions map particles inside the current visible map bounds", () => {
    const markup = renderAtmosphereMarkup({
      options: createInitialPlannerAmbienceOptions(),
      season: "spring",
    });

    expect(markup).toContain('data-atmosphere-map-particles="true"');
    expect(markup).toContain('style="left:340px;top:40px;width:600px;height:500px"');
    expect(markup).toContain('data-atmosphere-particle="butterfly"');
    expect(markup).toMatch(/data-frame="\d+" data-world-x="-?\d+" data-world-y="-?\d+"/);
    expect(markup).toContain('background-position:');
  });

  it.each([
    { season: "spring", expectedDebrisCount: 14, expectedButterflies: true },
    { season: "summer", expectedDebrisCount: 0, expectedButterflies: true },
    { season: "fall", expectedDebrisCount: 14, expectedButterflies: false },
    { season: "winter", expectedDebrisCount: 0, expectedButterflies: false },
  ] as const)(
    "follows competitor season support for $season particles",
    ({ season, expectedDebrisCount, expectedButterflies }) => {
      const markup = renderAtmosphereMarkup({
        options: createInitialPlannerAmbienceOptions(),
        season,
      });

      expect(countAtmosphereParticles(markup, "debris")).toBe(expectedDebrisCount);
      if (expectedButterflies) {
        expect(countAtmosphereParticles(markup, "butterfly")).toBeGreaterThan(0);
      } else {
        expect(countAtmosphereParticles(markup, "butterfly")).toBe(0);
      }
    },
  );

  it.each([
    { mapFile: "Farm.tmx", debrisCountsBySeason: [14, 0, 14, 0] },
    { mapFile: "Beach.tmx", debrisCountsBySeason: [14, 0, 14, 0] },
    { mapFile: "Desert.tmx", debrisCountsBySeason: [0, 0, 0, 0] },
    { mapFile: "Island_W.tmx", debrisCountsBySeason: [0, 0, 0, 0] },
    { mapFile: "Island_N.tmx", debrisCountsBySeason: [0, 0, 0, 0] },
    { mapFile: "Island_S.tmx", debrisCountsBySeason: [0, 0, 0, 0] },
    { mapFile: "Island_SE.tmx", debrisCountsBySeason: [0, 0, 0, 0] },
    { mapFile: "Island_E.tmx", debrisCountsBySeason: [14, 14, 14, 14] },
    { mapFile: "Woods.tmx", debrisCountsBySeason: [14, 14, 14, 0] },
  ] as const)(
    "matches competitor debris season support for $mapFile",
    ({ mapFile, debrisCountsBySeason }) => {
      const seasons = ["spring", "summer", "fall", "winter"] as const;

      seasons.forEach((season, seasonIndex) => {
        const markup = renderAtmosphereMarkup({
          mapProjection: { ...projectedStandardMap, mapFile },
          options: createInitialPlannerAmbienceOptions(),
          season,
        });

        expect(
          countAtmosphereParticles(markup, "debris"),
          `${mapFile} ${season}`,
        ).toBe(debrisCountsBySeason[seasonIndex]);
      });
    },
  );

  it.each([
    { mapFile: "Island_W.tmx", season: "winter", debrisCount: 0, butterflies: true },
    { mapFile: "Desert.tmx", season: "winter", debrisCount: 0, butterflies: true },
    { mapFile: "Beach.tmx", season: "spring", debrisCount: 14, butterflies: false },
    { mapFile: "Island_E.tmx", season: "winter", debrisCount: 14, butterflies: false },
    { mapFile: "Woods.tmx", season: "summer", debrisCount: 14, butterflies: true },
  ] as const)(
    "applies map ambience rules for $mapFile during $season",
    ({ mapFile, season, debrisCount, butterflies }) => {
      const markup = renderAtmosphereMarkup({
        mapProjection: { ...projectedStandardMap, mapFile },
        options: createInitialPlannerAmbienceOptions(),
        season,
      });

      expect(countAtmosphereParticles(markup, "debris")).toBe(debrisCount);
      if (butterflies) {
        expect(countAtmosphereParticles(markup, "butterfly")).toBeGreaterThan(0);
      } else {
        expect(countAtmosphereParticles(markup, "butterfly")).toBe(0);
      }
    },
  );

  it("keeps Island_W clear of butterflies and debris when their shared toggle is off", () => {
    const markup = renderAtmosphereMarkup({
      mapProjection: { ...projectedStandardMap, mapFile: "Island_W.tmx" },
      options: {
        ...createInitialPlannerAmbienceOptions(),
        showDebris: false,
      },
      season: "winter",
    });

    expect(countAtmosphereParticles(markup, "debris")).toBe(0);
    expect(countAtmosphereParticles(markup, "butterfly")).toBe(0);
  });

  it("removes both seasonal debris and butterflies when the shared toggle is off", () => {
    const markup = renderAtmosphereMarkup({
      options: {
        ...createInitialPlannerAmbienceOptions(),
        showDebris: false,
      },
      season: "spring",
    });

    expect(markup).not.toContain('data-atmosphere-map-particles="true"');
    expect(countAtmosphereParticles(markup, "debris")).toBe(0);
    expect(countAtmosphereParticles(markup, "butterfly")).toBe(0);
  });

  it("does not render particle layers when visible map bounds are absent or null", () => {
    const options = createInitialPlannerAmbienceOptions();
    const markupWithoutBounds = renderToStaticMarkup(
      createElement(PlannerAtmosphereLayer, { options, season: "spring" }),
    );
    const markupWithNullBounds = renderAtmosphereMarkup({
      mapViewportBounds: null,
      options,
      season: "spring",
    });

    expect(markupWithoutBounds).toBe("");
    expect(markupWithNullBounds).toBe("");
  });

  it("rejects non-positive visible map dimensions with their values", () => {
    expect(() => renderAtmosphereMarkup({
      mapViewportBounds: { ...visibleMapViewportBounds, width: 0 },
      options: createInitialPlannerAmbienceOptions(),
      season: "spring",
    })).toThrow("mapViewportBounds.width must be greater than 0; received 0.");
  });

  it("rejects a missing map filename before seeding butterflies", () => {
    expect(() => renderAtmosphereMarkup({
      mapProjection: { ...projectedStandardMap, mapFile: "" },
      options: createInitialPlannerAmbienceOptions(),
      season: "spring",
    })).toThrow("mapProjection.mapFile must be a non-empty string; received .");
  });

  it("pauses butterfly flight when animations are disabled and uses the game sprite atlas", () => {
    const markup = renderAtmosphereMarkup({
      options: {
        ...createInitialPlannerAmbienceOptions(),
        animationsEnabled: false,
      },
      season: "spring",
    });
    const atmosphereStyles = readFileSync(
      resolve(process.cwd(), "src/components/planner-atmosphere-layer.module.css"),
      "utf8",
    );

    expect(markup).toContain('data-animations-enabled="false"');
    expect(markup).toMatch(/class="[^"]*paused[^"]*"/);
    expect(atmosphereStyles).toMatch(
      /\.paused,\s*\.paused \*\s*\{\s*animation-play-state:\s*paused !important;/,
    );
    expect(atmosphereStyles).toContain('background-image: url("/assets/tilesheets/critters.webp")');
    expect(atmosphereStyles).toContain("background-size: 320px 640px");
    expect(atmosphereStyles).not.toContain("butterfly-wing-flap");
    expect(atmosphereStyles).not.toContain("butterfly-drift");
  });

  it("renders summer clouds and butterflies without summer debris", () => {
    const markup = renderAtmosphereMarkup({
      options: {
        weather: "clear",
        showClouds: true,
        showDebris: true,
        animationsEnabled: true,
      },
      season: "summer",
    });

    expect(markup).toContain('data-weather="clear"');
    expect(markup).toContain('data-clouds-enabled="true"');
    expect(markup).toContain('data-debris-enabled="true"');
    expect(markup).toContain('data-animations-enabled="true"');
    expect(markup).toContain("cloudLayer");
    expect(countAtmosphereParticles(markup, "butterfly")).toBeGreaterThan(0);
    expect(countAtmosphereParticles(markup, "debris")).toBe(0);
  });

  it("projects authentic 16-pixel butterfly frames through the current camera zoom", () => {
    const markupAtUnitZoom = renderAtmosphereMarkup({
      options: createInitialPlannerAmbienceOptions(),
      season: "spring",
    });
    const markupAtDoubleZoom = renderAtmosphereMarkup({
      mapProjection: { ...projectedStandardMap, cameraZoom: 2 },
      options: createInitialPlannerAmbienceOptions(),
      season: "spring",
    });
    const unitZoomSprite = readFirstButterflySprite(markupAtUnitZoom);
    const doubleZoomSprite = readFirstButterflySprite(markupAtDoubleZoom);
    const worldPixelLeft = (unitZoomSprite.worldX - 64) / 4;
    const worldPixelTop = (unitZoomSprite.worldY - 128) / 4;

    expect(unitZoomSprite.frame).toBeGreaterThanOrEqual(160);
    expect(unitZoomSprite.frame).toBeLessThan(190);
    expect(unitZoomSprite.left).toBe(worldPixelLeft);
    expect(unitZoomSprite.top).toBe(worldPixelTop);
    expect(doubleZoomSprite.worldX).toBe(unitZoomSprite.worldX);
    expect(doubleZoomSprite.worldY).toBe(unitZoomSprite.worldY);
    expect(doubleZoomSprite.left).toBe(worldPixelLeft * 2);
    expect(doubleZoomSprite.top).toBe(worldPixelTop * 2);
  });

  it("renders weather particles independently of seasonal ambience particles", () => {
    const markup = renderAtmosphereMarkup({
      options: {
        ...createInitialPlannerAmbienceOptions(),
        weather: "snow",
        showDebris: false,
      },
      season: "winter",
    });

    expect(markup).toContain('data-weather="snow"');
    expect(markup).toContain("weatherLayer");
    expect(markup).not.toContain('data-atmosphere-map-particles="true"');
  });

  it.each(["rain", "storm", "green-rain", "snow"] as const)(
    "hides butterflies and seasonal debris during %s and restores them in clear weather",
    (weather) => {
      const nonClearMarkup = renderAtmosphereMarkup({
        options: {
          ...createInitialPlannerAmbienceOptions(),
          weather,
          showDebris: true,
        },
        season: "spring",
      });
      const clearMarkup = renderAtmosphereMarkup({
        options: {
          ...createInitialPlannerAmbienceOptions(),
          weather: "clear",
          showDebris: true,
        },
        season: "spring",
      });

      expect(nonClearMarkup).toContain(`data-weather="${weather}"`);
      expect(nonClearMarkup).toContain("weatherLayer");
      expect(nonClearMarkup).not.toContain('data-atmosphere-map-particles="true"');
      expect(countAtmosphereParticles(nonClearMarkup, "debris")).toBe(0);
      expect(countAtmosphereParticles(nonClearMarkup, "butterfly")).toBe(0);

      expect(clearMarkup).toContain('data-atmosphere-map-particles="true"');
      expect(countAtmosphereParticles(clearMarkup, "debris")).toBe(14);
      expect(countAtmosphereParticles(clearMarkup, "butterfly")).toBeGreaterThan(0);
    },
  );

  it.each(["rain", "storm", "green-rain", "snow"] as const)(
    "continues to render the %s weather effect with map particle bounds",
    (weather) => {
      const markup = renderAtmosphereMarkup({
        options: {
          ...createInitialPlannerAmbienceOptions(),
          weather,
          showDebris: false,
        },
        season: "summer",
      });

      expect(markup).toContain(`data-weather="${weather}"`);
      expect(markup).toContain("weatherLayer");
      if (weather === "storm") {
        expect(markup).toContain("lightningFlash");
      }
      if (weather === "green-rain") {
        expect(markup).toContain("greenRainTint");
      }
    },
  );

  it("keeps the system cursor on the canvas wrapper when requested", () => {
    const atmosphereStyles = readFileSync(
      resolve(process.cwd(), "src/components/planner-atmosphere-layer.module.css"),
      "utf8",
    );
    const globalStyles = readFileSync(
      resolve(process.cwd(), "app/globals.css"),
      "utf8",
    );

    expect(atmosphereStyles).toMatch(
      /\.systemCursor\s*\{\s*cursor:\s*auto\s*!important;\s*\}/,
    );
    expect(atmosphereStyles).not.toContain(".systemCursor canvas");
    expect(globalStyles).toContain(".planner-editor-shell .canvas-container canvas {\n  cursor: inherit !important;");
  });
});

function renderAtmosphereMarkup({
  mapProjection = projectedStandardMap,
  mapViewportBounds = visibleMapViewportBounds,
  options,
  season,
}: Readonly<{
  mapProjection?: PlannerAtmosphereMapProjection | null;
  mapViewportBounds?: PlannerAtmosphereMapViewportBounds | null;
  options: PlannerAtmosphereLayerProperties["options"];
  season: PlannerAtmosphereLayerProperties["season"];
}>): string {
  return renderToStaticMarkup(
    createElement(PlannerAtmosphereLayer, {
      mapProjection,
      mapViewportBounds,
      options,
      season,
    }),
  );
}

function readFirstButterflySprite(markup: string): Readonly<{
  frame: number;
  worldX: number;
  worldY: number;
  left: number;
  top: number;
}> {
  const spriteMatch = markup.match(
    /data-atmosphere-particle="butterfly" data-frame="(\d+)" data-world-x="(-?\d+)" data-world-y="(-?\d+)" style="([^"]+)"/,
  );
  if (spriteMatch === null) {
    throw new Error("Expected a rendered butterfly sprite; no matching DOM element was found.");
  }

  const leftMatch = spriteMatch[4].match(/left:(-?[\d.]+)px/);
  const topMatch = spriteMatch[4].match(/top:(-?[\d.]+)px/);
  if (leftMatch === null || topMatch === null) {
    throw new Error(`Butterfly sprite position is missing from style ${spriteMatch[4]}.`);
  }

  return {
    frame: Number(spriteMatch[1]),
    worldX: Number(spriteMatch[2]),
    worldY: Number(spriteMatch[3]),
    left: Number(leftMatch[1]),
    top: Number(topMatch[1]),
  };
}

function countAtmosphereParticles(
  markup: string,
  particleKind: "debris" | "butterfly",
): number {
  return Array.from(
    markup.matchAll(new RegExp(`data-atmosphere-particle="${particleKind}"`, "g")),
  ).length;
}
