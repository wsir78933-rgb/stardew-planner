import { describe, expect, it } from "vitest";
import {
  isAutoVisibleResourceClumpCatalogItemId,
  isResourceClumpCatalogItemId,
} from "../../src/catalog/resource-clumps";

describe("resource clump catalog", () => {
  it("keeps the four source resource-clump IDs distinct from ordinary catalog items", () => {
    expect(isResourceClumpCatalogItemId("clump_600")).toBe(true);
    expect(isResourceClumpCatalogItemId("clump_602")).toBe(true);
    expect(isResourceClumpCatalogItemId("clump_622")).toBe(true);
    expect(isResourceClumpCatalogItemId("clump_672")).toBe(true);
    expect(isResourceClumpCatalogItemId("object:600")).toBe(false);
  });

  it("does not show static spawn locations while the non-static meteorite is selected", () => {
    expect(isAutoVisibleResourceClumpCatalogItemId("clump_600")).toBe(true);
    expect(isAutoVisibleResourceClumpCatalogItemId("clump_622")).toBe(false);
    expect(isAutoVisibleResourceClumpCatalogItemId(null)).toBe(false);
  });
});
