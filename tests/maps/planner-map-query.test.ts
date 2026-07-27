import { describe, expect, it } from "vitest";
import { getPlannerMapIdFromSearch } from "../../src/maps/planner-map-query";

describe("planner map query", () => {
  it("returns a known map ID from the public plan link", () => {
    expect(getPlannerMapIdFromSearch("?farmType=forest")).toBe("forest");
  });

  it("rejects missing, duplicate, and unknown map identifiers", () => {
    expect(getPlannerMapIdFromSearch("")).toBeNull();
    expect(getPlannerMapIdFromSearch("?farmType=unknown-mod-farm")).toBeNull();
    expect(
      getPlannerMapIdFromSearch("?farmType=forest&farmType=beach"),
    ).toBeNull();
  });
});
