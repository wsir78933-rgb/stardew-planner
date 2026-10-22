import { describe, expect, it } from "vitest";
import {
  listHarvestCalendarMarks,
  listHarvestCalendarMonths,
  projectCropGrowthForm,
  readCropHarvestProjection,
} from "@/src/tools-pages/crop-harvest-calendar";
import {
  createDefaultCropGrowthForm,
  loadCropGrowthForm,
  normalizeCropGrowthForm,
  parseCropGrowthForm,
  serializeCropGrowthForm,
  type CropGrowthForm,
} from "@/src/tools-pages/crop-growth-form";
import { createDefaultCropProfitForm } from "@/src/tools-pages/crop-profit-form";
import { createProfitGrowthForm } from "@/src/tools-pages/planting-tool-handoff";

describe("profit to growth handoff", () => {
  it("carries the planting setup and resets growth-only conditions", () => {
    const profitForm = {
      ...createDefaultCropProfitForm(),
      season: "summer",
      plantingDay: 20,
      speedGro: "hyper",
      profession: "agriculturist",
    } as const;

    expect(
      createProfitGrowthForm(profitForm, "corn"),
    ).toEqual({
      cropId: "corn",
      season: "summer",
      plantingDay: 20,
      speedGro: "hyper",
      agriculturist: true,
      missedWateringDays: 0,
      location: "outdoor",
      afterHarvest: "regrow",
    });
  });

  it("uses replanting for single-harvest crops to match seasonal rankings", () => {
    const growthForm = createProfitGrowthForm(createDefaultCropProfitForm(), "parsnip");
    expect(growthForm.afterHarvest).toBe("replant-same-day");
  });

  it("fails with the offending crop id when the handoff crop is unknown", () => {
    expect(() => createProfitGrowthForm(createDefaultCropProfitForm(), "not-a-crop")).toThrow(
      "not-a-crop",
    );
  });
});

describe("growth form normalization", () => {
  it("normalizes a saved Strawberry no-replant setting and preserves the saved form shape", () => {
    const legacySettings: CropGrowthForm = {
      ...createDefaultCropGrowthForm("parsnip"),
      cropId: "strawberry",
      plantingDay: 13,
      location: "greenhouse",
      missedWateringDays: 2,
      afterHarvest: "no-replant",
    };
    const loadedForm = parseCropGrowthForm(JSON.stringify(legacySettings));

    expect(loadedForm.afterHarvest).toBe("regrow");
    expect(loadedForm).toMatchObject({
      cropId: "strawberry",
      season: "spring",
      plantingDay: 13,
      location: "greenhouse",
      missedWateringDays: 2,
    });
    expect(Object.keys(JSON.parse(serializeCropGrowthForm(loadedForm))).sort()).toEqual(
      [
        "afterHarvest",
        "agriculturist",
        "cropId",
        "location",
        "missedWateringDays",
        "plantingDay",
        "season",
        "speedGro",
      ].sort(),
    );
  });

  it("preserves the player's replant or no-replant choice for single-harvest crops", () => {
    const parsnipForm = createDefaultCropGrowthForm("parsnip");

    expect(
      normalizeCropGrowthForm({ ...parsnipForm, afterHarvest: "replant-same-day" }).afterHarvest,
    ).toBe("replant-same-day");
    expect(
      normalizeCropGrowthForm({ ...parsnipForm, afterHarvest: "no-replant" }).afterHarvest,
    ).toBe("no-replant");
  });

  it("resets an unsupported regrow choice when switching to a single-harvest crop", () => {
    const strawberryForm = createDefaultCropGrowthForm("strawberry");
    const parsnipForm = normalizeCropGrowthForm({ ...strawberryForm, cropId: "parsnip" });

    expect(strawberryForm.afterHarvest).toBe("regrow");
    expect(parsnipForm.afterHarvest).toBe("no-replant");
  });

  it("rejects invalid crop ids and planting days with the received values", () => {
    const parsnipForm = createDefaultCropGrowthForm("parsnip");

    expect(() => normalizeCropGrowthForm({ ...parsnipForm, cropId: "missing-crop" })).toThrow(
      "missing-crop",
    );
    expect(() => normalizeCropGrowthForm({ ...parsnipForm, plantingDay: 29 })).toThrow("29");
  });

  it("preserves an unknown stored crop id for the caller to report", () => {
    const oldStoredSettings = JSON.stringify({
      ...createDefaultCropGrowthForm("parsnip"),
      cropId: "removed-crop",
    });

    expect(loadCropGrowthForm(oldStoredSettings, "parsnip").cropId).toBe("removed-crop");
  });
});

describe("harvest calendar months", () => {
  it("keeps the single-season marks export usable and rejects invalid dates", () => {
    const marks = listHarvestCalendarMarks("spring", 1, [
      { season: "spring", day: 5, replantedSameDay: false },
    ]);

    expect(marks).toHaveLength(28);
    expect(marks[0]).toBe("plant");
    expect(marks[4]).toBe("harvest");
    expect(() => listHarvestCalendarMarks("spring", 1.5, [])).toThrow("1.5");
    expect(() => listHarvestCalendarMarks("monsoon" as never, 1, [])).toThrow("monsoon");
  });

  it("shows Corn through its last legal outdoor season, including the six late-summer plantings harvests", () => {
    const cornForm: CropGrowthForm = {
      ...createDefaultCropGrowthForm("corn"),
      season: "summer",
      plantingDay: 20,
      afterHarvest: "no-replant",
    };
    const projection = projectCropGrowthForm(cornForm);
    const months = listHarvestCalendarMonths(cornForm, projection);

    expect(projection.harvests).toEqual([
      { season: "fall", day: 6, replantedSameDay: false },
      { season: "fall", day: 10, replantedSameDay: false },
      { season: "fall", day: 14, replantedSameDay: false },
      { season: "fall", day: 18, replantedSameDay: false },
      { season: "fall", day: 22, replantedSameDay: false },
      { season: "fall", day: 26, replantedSameDay: false },
    ]);
    expect(projection.lastSafePlanting).toEqual({ season: "fall", day: 14, yearOffset: 0 });
    expect(projection.outdoorDeadline).toEqual({ season: "fall", day: 28, yearOffset: 0 });
    expect(months.map(({ season, yearOffset }) => ({ season, yearOffset }))).toEqual([
      { season: "summer", yearOffset: 0 },
      { season: "fall", yearOffset: 0 },
    ]);
    expect(months.map((month) => month.marks)).toHaveLength(2);
    expect(months.every((month) => month.marks.length === 28)).toBe(true);
    expect(months[0]?.marks[19]).toBe("plant");
    expect(months[1]?.marks[5]).toBe("harvest");
    expect(months[1]?.marks[25]).toBe("harvest");
    expect(months[1]?.marks[27]).toBeNull();
  });

  it("shows Strawberry's automatic regrowth after a stale no-replant selection", () => {
    const strawberryForm: CropGrowthForm = {
      ...createDefaultCropGrowthForm("strawberry"),
      plantingDay: 13,
      afterHarvest: "no-replant",
    };
    const projection = projectCropGrowthForm(strawberryForm);
    const months = listHarvestCalendarMonths(strawberryForm, projection);

    expect(projection.harvests).toEqual([
      { season: "spring", day: 21, replantedSameDay: false },
      { season: "spring", day: 25, replantedSameDay: false },
    ]);
    expect(months[0]?.marks[12]).toBe("plant");
    expect(months[0]?.marks[20]).toBe("harvest");
    expect(months[0]?.marks[24]).toBe("harvest");
  });

  it("labels protected Winter-to-Spring dates with the next year offset and includes day 28", () => {
    const protectedForm: CropGrowthForm = {
      ...createDefaultCropGrowthForm("strawberry"),
      season: "winter",
      plantingDay: 28,
      location: "greenhouse",
      afterHarvest: "no-replant",
    };
    const projection = projectCropGrowthForm(protectedForm);
    const months = listHarvestCalendarMonths(protectedForm, projection);

    expect(months.map(({ season, yearOffset }) => ({ season, yearOffset }))).toEqual([
      { season: "winter", yearOffset: 0 },
      { season: "spring", yearOffset: 1 },
    ]);
    expect(months.every((month) => month.marks.length === 28)).toBe(true);
    expect(months[0]?.marks[27]).toBe("plant");
    expect(months[1]?.marks[7]).toBe("harvest");
    expect(months[1]?.marks[27]).toBe("harvest");
    expect(projection.lastSafePlanting).toBeNull();
    expect(projection.outdoorDeadline).toBeNull();
  });

  it("returns no outdoor calendar months when the crop cannot grow in that season", () => {
    const winterParsnip: CropGrowthForm = {
      ...createDefaultCropGrowthForm("parsnip"),
      season: "winter",
    };
    const projection = projectCropGrowthForm(winterParsnip);

    expect(projection.seasonCheck).toBe("past-deadline");
    expect(listHarvestCalendarMonths(winterParsnip, projection)).toEqual([]);
  });

  it("rejects malformed full deadline dates and invalid calendar input values", () => {
    const parsnipForm = createDefaultCropGrowthForm("parsnip");
    const projection = projectCropGrowthForm(parsnipForm);

    expect(() =>
      readCropHarvestProjection({
        ...projection,
        outdoorDeadline: { season: "spring", day: 28, yearOffset: -1 },
      }),
    ).toThrow("Received: -1");
    expect(() => listHarvestCalendarMonths({ ...parsnipForm, plantingDay: 29 }, projection)).toThrow(
      "29",
    );
  });
});
