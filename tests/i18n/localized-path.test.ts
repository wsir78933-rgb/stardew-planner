import { describe, expect, it } from "vitest";
import {
  assertCanonicalPublicPath,
  canonicalPublicPaths,
} from "../../src/i18n/canonical-public-routes";
import {
  getCanonicalPath,
  getLocalizedPath,
} from "../../src/i18n/localized-path";

describe("localized paths", () => {
  it("defines only the eleven retained statically exported canonical public paths", () => {
    expect(canonicalPublicPaths).toEqual([
      "/",
      "/farm-comparison",
      "/farm/standard",
      "/farm/riverland",
      "/farm/forest",
      "/farm/hilltop",
      "/farm/wilderness",
      "/farm/four-corners",
      "/farm/beach",
      "/farm/meadowlands",
      "/mods",
    ]);
  });

  it("keeps English canonical paths while appending a search and hash", () => {
    expect(
      getLocalizedPath("en", "/farm/standard", "farmType=beach", "map"),
    ).toBe("/farm/standard?farmType=beach#map");
  });

  it("uses the /zh prefix for Chinese paths", () => {
    expect(getLocalizedPath("zh-CN", "/")).toBe("/zh");
    expect(getLocalizedPath("zh-CN", "/farm/standard")).toBe(
      "/zh/farm/standard",
    );
  });

  it("rejects canonical paths without a leading slash", () => {
    expect(() => getLocalizedPath("zh-CN", "farm/standard")).toThrow(
      'canonical path "farm/standard" must start with "/"',
    );
  });

  it("rejects Chinese-prefixed paths as canonical input", () => {
    expect(() => getLocalizedPath("zh-CN", "/zh")).toThrow("/zh");
    expect(() => getLocalizedPath("zh-CN", "/zh/farm/standard")).toThrow(
      "/zh/farm/standard",
    );
  });

  it("rejects unknown public paths with the received path", () => {
    expect(() => getLocalizedPath("en", "/farm/custom")).toThrow(
      'canonical public path "/farm/custom" is not supported',
    );
    expect(() => getCanonicalPath("en", "/farm/custom")).toThrow(
      'canonical public path "/farm/custom" is not supported',
    );
    expect(() => getCanonicalPath("zh-CN", "/zh/farm/custom")).toThrow(
      'canonical public path "/farm/custom" is not supported',
    );
  });

  it("rejects removed legal canonical paths", () => {
    expect(() => assertCanonicalPublicPath("/privacy")).toThrow(
      'canonical public path "/privacy" is not supported',
    );
    expect(() => assertCanonicalPublicPath("/terms")).toThrow(
      'canonical public path "/terms" is not supported',
    );
  });

  it("converts localized paths back to canonical paths", () => {
    expect(getCanonicalPath("en", "/farm/standard")).toBe("/farm/standard");
    expect(getCanonicalPath("zh-CN", "/zh")).toBe("/");
    expect(getCanonicalPath("zh-CN", "/zh/farm/standard")).toBe(
      "/farm/standard",
    );
  });

  it("rejects Chinese-prefixed paths for the English locale", () => {
    expect(() => getCanonicalPath("en", "/zh")).toThrow("/zh");
    expect(() => getCanonicalPath("en", "/zh/farm/standard")).toThrow(
      "/zh/farm/standard",
    );
  });
});
