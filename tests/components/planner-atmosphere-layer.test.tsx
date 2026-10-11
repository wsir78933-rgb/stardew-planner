import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PlannerAtmosphereLayer } from "../../src/components/planner-atmosphere-layer";
import { createInitialPlannerAmbienceOptions } from "../../src/editor/planner-ambience-options";

describe("PlannerAtmosphereLayer", () => {
  it("renders summer clouds in clear weather with seasonal debris and butterflies", () => {
    const markup = renderToStaticMarkup(
      createElement(PlannerAtmosphereLayer, {
        options: {
          weather: "clear",
          showClouds: true,
          showDebris: true,
          animationsEnabled: false,
        },
        season: "summer",
      }),
    );

    expect(markup).toContain('data-weather="clear"');
    expect(markup).toContain('data-clouds-enabled="true"');
    expect(markup).toContain('data-debris-enabled="true"');
    expect(markup).toContain('data-animations-enabled="false"');
    expect(markup).toContain("cloudLayer");
    expect(markup).toContain("summerDebris");
    expect(markup).toContain("butterfly");
    expect(markup).toContain("paused");
  });

  it.each([
    { season: "spring", weather: "clear", debrisClass: "springDebris" },
    { season: "summer", weather: "rain", debrisClass: "summerDebris" },
  ] as const)(
    "omits enabled cloud cover for $season with $weather weather",
    ({ season, weather, debrisClass }) => {
      const markup = renderToStaticMarkup(
        createElement(PlannerAtmosphereLayer, {
          options: {
            ...createInitialPlannerAmbienceOptions(),
            showClouds: true,
            weather,
          },
          season,
        }),
      );

      expect(markup).toContain('data-clouds-enabled="true"');
      expect(markup).toContain(debrisClass);
      expect(markup).not.toContain("cloudLayer");
    },
  );

  it("omits particles when weather is clear and both visual toggles are off", () => {
    const markup = renderToStaticMarkup(
      createElement(PlannerAtmosphereLayer, {
        options: {
          ...createInitialPlannerAmbienceOptions(),
          showDebris: false,
        },
        season: "winter",
      }),
    );

    expect(markup).toContain('data-weather="clear"');
    expect(markup).not.toContain("cloudLayer");
    expect(markup).not.toContain("weatherLayer");
    expect(markup).not.toContain("debrisLayer");
  });

  it.each(["rain", "storm", "green-rain", "snow"] as const)(
    "renders the %s weather effect",
    (weather) => {
      const markup = renderToStaticMarkup(
        createElement(PlannerAtmosphereLayer, {
          options: {
            ...createInitialPlannerAmbienceOptions(),
            weather,
            showDebris: false,
          },
          season: "summer",
        }),
      );

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

  it("sets system cursor on the canvas wrapper so the canvas inherits it", () => {
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
