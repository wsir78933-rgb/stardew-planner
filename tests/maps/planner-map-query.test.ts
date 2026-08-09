import { describe, expect, it } from "vitest";
import { getPlannerMapIdFromSearch } from "../../src/maps/planner-map-query";

describe("planner map query", () => {
  it("returns a known official map ID from the public plan link", () => {
    expect(getPlannerMapIdFromSearch("?farmType=forest")).toBe("forest");
  });

  it("returns a known mod map ID from the public plan link", () => {
    expect(getPlannerMapIdFromSearch("?farmType=modest-maps-standard")).toBe(
      "modest-maps-standard",
    );
  });

  it("rejects a missing map identifier", () => {
    expect(getPlannerMapIdFromSearch("")).toBeNull();
  });

  it("rejects an unknown map identifier", () => {
    expect(getPlannerMapIdFromSearch("?farmType=unknown-mod-farm")).toBeNull();
  });

  it("rejects repeated map identifiers", () => {
    expect(
      getPlannerMapIdFromSearch("?farmType=forest&farmType=beach"),
    ).toBeNull();
  });
});
