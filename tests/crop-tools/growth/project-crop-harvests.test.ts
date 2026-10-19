import { describe, expect, it } from "vitest";
import {
  projectCropHarvests,
  type CropHarvestInput,
  type HarvestMarker,
} from "../../../src/crop-tools/growth/project-crop-harvests";

function harvestInput(overrides: Partial<CropHarvestInput> = {}): CropHarvestInput {
  return {
    cropId: "parsnip",
    season: "spring",
    plantDay: 1,
    fertilizer: "none",
    agriculturist: false,
    missedWateringDays: 0,
    location: "outdoor",
    afterHarvest: "regrow",
    ...overrides,
  };
}

function markerDays(markers: readonly HarvestMarker[], marker: HarvestMarker["marker"]): number[] {
  return markers.filter((entry) => entry.marker === marker).map((entry) => entry.day);
}

describe("projectCropHarvests", () => {
  it("matures an unfertilized Parsnip planted Spring 1 on Spring 5", () => {
    const projection = projectCropHarvests(harvestInput());
    expect(projection.cropId).toBe("parsnip");
    expect(projection.growDays).toBe(4);
    expect(projection.regrowIntervalDays).toBeNull();
    expect(projection.firstMature).toEqual({ season: "spring", day: 5, yearOffset: 0 });
    expect(projection.harvestCount).toBe(1);
    expect(projection.lastSafePlant).toEqual({ season: "spring", day: 24, yearOffset: 0 });
    expect(projection.canHarvest).toBe(true);
    expect(projection.pastDeadline).toBe(false);
    expect(projection.markers).toEqual([
      { season: "spring", day: 1, yearOffset: 0, marker: "plant" },
      { season: "spring", day: 5, yearOffset: 0, marker: "harvest" },
    ]);
  });

  it("keeps the Strawberry regrow interval at 4 days with and without Speed-Gro", () => {
    const plain = projectCropHarvests(
      harvestInput({
        cropId: "strawberry",
        plantDay: 13,
        fertilizer: "none",
        afterHarvest: "regrow",
      }),
    );
    const speedGro = projectCropHarvests(
      harvestInput({
        cropId: "strawberry",
        plantDay: 13,
        fertilizer: "speed-gro",
        afterHarvest: "regrow",
      }),
    );

    expect(plain.regrowIntervalDays).toBe(4);
    expect(speedGro.regrowIntervalDays).toBe(4);
    expect(plain.firstMature).toEqual({ season: "spring", day: 21, yearOffset: 0 });
    expect(plain.harvestCount).toBe(2);
    expect(plain.lastSafePlant).toEqual({ season: "spring", day: 20, yearOffset: 0 });
    expect(markerDays(plain.markers, "harvest")).toEqual([21, 25]);
    expect(speedGro.firstMature).toEqual({ season: "spring", day: 20, yearOffset: 0 });
    expect(markerDays(speedGro.markers, "harvest")).toEqual([20, 24, 28]);
    expect(speedGro.growDays).toBe(7);
  });

  it("delays Parsnip by one day when one watering is missed", () => {
    const projection = projectCropHarvests(harvestInput({ missedWateringDays: 1 }));
    expect(projection.growDays).toBe(5);
    expect(projection.firstMature).toEqual({ season: "spring", day: 6, yearOffset: 0 });
    expect(projection.lastSafePlant).toEqual({ season: "spring", day: 23, yearOffset: 0 });
  });

  it("does not kill a Greenhouse or Ginger Island crop at the season boundary", () => {
    const lateParsnip = harvestInput({ plantDay: 26, afterHarvest: "leave-empty" });
    const outdoor = projectCropHarvests(lateParsnip);
    const greenhouse = projectCropHarvests({ ...lateParsnip, location: "greenhouse" });
    const gingerIsland = projectCropHarvests({ ...lateParsnip, location: "ginger-island" });

    expect(outdoor.canHarvest).toBe(false);
    expect(outdoor.pastDeadline).toBe(true);
    expect(outdoor.harvestCount).toBe(0);
    expect(outdoor.firstMature).toEqual({ season: "summer", day: 2, yearOffset: 0 });

    expect(greenhouse.canHarvest).toBe(true);
    expect(greenhouse.pastDeadline).toBe(false);
    expect(greenhouse.lastSafePlant).toBeNull();
    expect(greenhouse.firstMature).toEqual({ season: "summer", day: 2, yearOffset: 0 });
    expect(greenhouse.harvestCount).toBe(1);
    expect(greenhouse.markers).toContainEqual({
      season: "summer",
      day: 2,
      yearOffset: 0,
      marker: "harvest",
    });
    expect(gingerIsland).toEqual(greenhouse);
  });

  it("lets Corn keep producing from Summer into Fall", () => {
    const projection = projectCropHarvests(
      harvestInput({
        cropId: "corn",
        season: "summer",
        plantDay: 1,
        afterHarvest: "regrow",
      }),
    );
    expect(projection.firstMature).toEqual({ season: "summer", day: 15, yearOffset: 0 });
    expect(projection.harvestCount).toBe(11);
    expect(projection.regrowIntervalDays).toBe(4);
    expect(projection.markers).toContainEqual({
      season: "fall",
      day: 3,
      yearOffset: 0,
      marker: "harvest",
    });
    expect(projection.lastSafePlant).toEqual({ season: "fall", day: 14, yearOffset: 0 });
    expect(projection.pastDeadline).toBe(false);
  });

  it("replants Parsnip the same day and repeats the missed-watering delay", () => {
    const projection = projectCropHarvests(
      harvestInput({ afterHarvest: "replant-same-day", missedWateringDays: 1 }),
    );
    expect(projection.growDays).toBe(5);
    expect(markerDays(projection.markers, "plant")).toEqual([1]);
    expect(markerDays(projection.markers, "replant")).toEqual([6, 11, 16, 21]);
    expect(markerDays(projection.markers, "harvest")).toEqual([26]);
    expect(projection.harvestCount).toBe(5);
  });

  it("uses Hyper Speed-Gro and Agriculturist stage rounding", () => {
    expect(
      projectCropHarvests(harvestInput({ fertilizer: "hyper-speed-gro" })).firstMature,
    ).toEqual({ season: "spring", day: 3, yearOffset: 0 });
    expect(
      projectCropHarvests(
        harvestInput({ fertilizer: "deluxe-speed-gro", agriculturist: true }),
      ).growDays,
    ).toBe(2);
    expect(
      projectCropHarvests(harvestInput({ fertilizer: "speed-gro", agriculturist: true })).growDays,
    ).toBe(3);
  });

  it("throws for an unknown cropId and includes that id", () => {
    expect(() => projectCropHarvests(harvestInput({ cropId: "missing-crop" }))).toThrow(
      TypeError,
    );
    expect(() => projectCropHarvests(harvestInput({ cropId: "missing-crop" }))).toThrow(
      "missing-crop",
    );
  });

  it("rejects out-of-range planting and watering values with the received number", () => {
    expect(() => projectCropHarvests(harvestInput({ plantDay: 0 }))).toThrow(RangeError);
    expect(() => projectCropHarvests(harvestInput({ plantDay: 0 }))).toThrow("Received: 0");
    expect(() => projectCropHarvests(harvestInput({ plantDay: 29 }))).toThrow("Received: 29");
    expect(() => projectCropHarvests(harvestInput({ missedWateringDays: 15 }))).toThrow(
      RangeError,
    );
    expect(() => projectCropHarvests(harvestInput({ missedWateringDays: 15 }))).toThrow(
      "Received: 15",
    );
    expect(() => projectCropHarvests(harvestInput({ location: "indoors" as never }))).toThrow(
      TypeError,
    );
    expect(() => projectCropHarvests(harvestInput({ location: "indoors" as never }))).toThrow(
      "indoors",
    );
    expect(() => projectCropHarvests(harvestInput({ fertilizer: "basic" as never }))).toThrow(
      "basic",
    );
    expect(() =>
      projectCropHarvests(harvestInput({ afterHarvest: "sell" as never })),
    ).toThrow("sell");
  });
});
