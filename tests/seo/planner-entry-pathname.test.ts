import { describe, expect, it } from "vitest";
import { isPlannerEntryPathname } from "../../src/seo/planner-entry-pathname";

describe("isPlannerEntryPathname", () => {
  it("is true only for English and Chinese planner entry pathnames", () => {
    expect(isPlannerEntryPathname("/")).toBe(true);
    expect(isPlannerEntryPathname("/zh")).toBe(true);
    expect(isPlannerEntryPathname("/zh/")).toBe(true);
  });

  it("is false for other public pathnames, including blog and contact", () => {
    expect(isPlannerEntryPathname("/blog")).toBe(false);
    expect(isPlannerEntryPathname("/zh/blog")).toBe(false);
    expect(isPlannerEntryPathname("/contact")).toBe(false);
    expect(isPlannerEntryPathname("/zh/contact")).toBe(false);
    expect(isPlannerEntryPathname("/privacy")).toBe(false);
    expect(isPlannerEntryPathname("/zh/privacy")).toBe(false);
    expect(isPlannerEntryPathname("/terms")).toBe(false);
    expect(isPlannerEntryPathname("/zh/terms")).toBe(false);
    expect(isPlannerEntryPathname("/blog/archive")).toBe(false);
    expect(isPlannerEntryPathname("/zh/blog/archive")).toBe(false);
    expect(isPlannerEntryPathname("")).toBe(false);
    expect(isPlannerEntryPathname("/zh/blog/")).toBe(false);
    expect(isPlannerEntryPathname("/ZH")).toBe(false);
    expect(isPlannerEntryPathname("/zh?farmType=standard")).toBe(false);
  });

  it("rejects non-string pathnames with TypeError and the actual value", () => {
    expect(() => isPlannerEntryPathname(undefined as never)).toThrow(TypeError);
    expect(() => isPlannerEntryPathname(undefined as never)).toThrow(
      "Received: undefined",
    );
    expect(() => isPlannerEntryPathname(null as never)).toThrow(TypeError);
    expect(() => isPlannerEntryPathname(null as never)).toThrow("Received: null");
    expect(() => isPlannerEntryPathname(0 as never)).toThrow(TypeError);
    expect(() => isPlannerEntryPathname(0 as never)).toThrow("Received: 0");
    expect(() => isPlannerEntryPathname({ pathname: "/" } as never)).toThrow(
      TypeError,
    );
    expect(() => isPlannerEntryPathname({ pathname: "/" } as never)).toThrow(
      'Received: {"pathname":"/"}',
    );
  });
});
