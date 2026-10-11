import { describe, expect, it } from "vitest";
import {
  createInitialPlannerAmbienceOptions,
  plannerAmbienceOptionsStorageKey,
  restorePlannerAmbienceOptions,
  setPlannerAmbienceAnimationsEnabled,
  setPlannerAmbienceClouds,
  setPlannerAmbienceDebris,
  setPlannerAmbienceWeather,
} from "../../src/editor/planner-ambience-options";

describe("planner ambience options", () => {
  it("starts with the local clear-weather defaults", () => {
    expect(createInitialPlannerAmbienceOptions()).toEqual({
      weather: "clear",
      showClouds: false,
      showDebris: true,
      animationsEnabled: true,
    });
    expect(plannerAmbienceOptionsStorageKey).toBe(
      "stardew-planner:planner-ambience-options",
    );
  });

  it("restores an exact valid schema and defaults a missing value", () => {
    const initialOptions = createInitialPlannerAmbienceOptions();
    expect(restorePlannerAmbienceOptions(undefined)).toEqual(initialOptions);
    expect(restorePlannerAmbienceOptions({
      weather: "green-rain",
      showClouds: true,
      showDebris: false,
      animationsEnabled: false,
    })).toEqual({
      weather: "green-rain",
      showClouds: true,
      showDebris: false,
      animationsEnabled: false,
    });
  });

  it("rejects invalid weather, non-boolean toggles, and unknown schema fields", () => {
    expect(() => restorePlannerAmbienceOptions({
      weather: "sunny",
      showClouds: false,
      showDebris: true,
      animationsEnabled: true,
    })).toThrow('Planner ambience weather must be one of clear, rain, storm, green-rain, snow; received "sunny".');
    expect(() => restorePlannerAmbienceOptions({
      weather: "rain",
      showClouds: "yes",
      showDebris: true,
      animationsEnabled: true,
    })).toThrow('Planner ambience option "showClouds" must be a boolean; received "yes".');
    expect(() => restorePlannerAmbienceOptions({
      weather: "rain",
      showClouds: false,
      showDebris: true,
      animationsEnabled: true,
      upload: true,
    })).toThrow("exactly weather, showClouds, showDebris, animationsEnabled");
  });

  it("updates each option without changing the other settings", () => {
    const initialOptions = createInitialPlannerAmbienceOptions();
    const rainyOptions = setPlannerAmbienceWeather(initialOptions, "storm");
    const cloudyOptions = setPlannerAmbienceClouds(rainyOptions, true);
    const debrisHiddenOptions = setPlannerAmbienceDebris(cloudyOptions, false);
    const pausedOptions = setPlannerAmbienceAnimationsEnabled(
      debrisHiddenOptions,
      false,
    );

    expect(pausedOptions).toEqual({
      weather: "storm",
      showClouds: true,
      showDebris: false,
      animationsEnabled: false,
    });
  });
});
