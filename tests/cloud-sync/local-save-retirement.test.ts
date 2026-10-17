import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getConfiguredLocalSaveRetirementAt,
  getLocalSaveRetirementState,
} from "../../src/cloud-sync/local-save-retirement";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("local-save retirement deadline", () => {
  it("reports an unset public deadline without inventing a countdown", () => {
    vi.stubEnv("NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT", " ");

    const configuredRetirementAt = getConfiguredLocalSaveRetirementAt();

    expect(configuredRetirementAt).toBeNull();
    expect(getLocalSaveRetirementState(configuredRetirementAt, 1_797_000_000_000)).toEqual({
      kind: "not-configured",
    });
  });

  it("counts down by elapsed time across a calendar-day boundary", () => {
    const currentTime = Date.parse("2026-10-15T23:30:00.000Z");
    const retirementAt = "2026-10-16T00:00:00.000Z";

    expect(getLocalSaveRetirementState(retirementAt, currentTime)).toEqual({
      kind: "countdown",
      daysRemaining: 0,
      hoursRemaining: 0,
      minutesRemaining: 30,
    });
  });

  it("shows the configured seven-day migration window", () => {
    const currentTime = Date.parse("2026-10-15T00:00:00.000Z");
    const retirementAt = "2026-10-22T00:00:00.000Z";

    expect(getLocalSaveRetirementState(retirementAt, currentTime)).toEqual({
      kind: "countdown",
      daysRemaining: 7,
      hoursRemaining: 0,
      minutesRemaining: 0,
    });
  });

  it("rounds a partial minute up and changes to ended at zero", () => {
    const retirementAt = "2026-10-16T00:00:00.000Z";
    const retirementTime = Date.parse(retirementAt);

    expect(getLocalSaveRetirementState(retirementAt, retirementTime - 1)).toEqual({
      kind: "countdown",
      daysRemaining: 0,
      hoursRemaining: 0,
      minutesRemaining: 1,
    });
    expect(getLocalSaveRetirementState(retirementAt, retirementTime)).toEqual({
      kind: "ended",
    });
    expect(getLocalSaveRetirementState(retirementAt, retirementTime + 1)).toEqual({
      kind: "ended",
    });
  });

  it("reports the invalid configured timestamp value", () => {
    expect(() => getLocalSaveRetirementState("2026-02-30T00:00:00Z", 0)).toThrow(
      /2026-02-30T00:00:00Z/,
    );
  });
});
