import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { matchHeadersPathPattern } from "../../src/assets/static-asset-headers";

const publicHeadersFilePath = join(process.cwd(), "public", "_headers");

describe("Cloudflare static asset _headers", () => {
  it("long-caches hashed Next static files and sets TMX Content-Type", () => {
    const headersFileText = readFileSync(publicHeadersFilePath, "utf8");
    const headerRules = parseHeadersFileRules(headersFileText);

    expect(headersFileText).toContain("/_next/static/*");
    expect(headersFileText).toContain("max-age=31536000");
    expect(headersFileText).toContain("immutable");
    expect(headersFileText).toContain("/*.tmx");
    expect(headersFileText).toContain("application/xml");

    expect(headerRules).toEqual([
      {
        pattern: "/_next/static/*",
        headers: [
          {
            name: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        pattern: "/*.tmx",
        headers: [
          {
            name: "Content-Type",
            value: "application/xml; charset=utf-8",
          },
        ],
      },
    ]);
  });

  it("does not assign a one-year cache to HTML or unhashed /game-assets", () => {
    const headerRules = parseHeadersFileRules(
      readFileSync(publicHeadersFilePath, "utf8"),
    );
    const oneYearCachePatterns = headerRules
      .filter((headerRule) =>
        headerRule.headers.some(
          (header) =>
            header.name.toLowerCase() === "cache-control"
            && header.value.includes("max-age=31536000"),
        ),
      )
      .map((headerRule) => headerRule.pattern);

    // Hashed /_next/static/* files may be immutable. HTML and the unhashed
    // /game-assets tree must keep Cloudflare's default revalidate cache.
    expect(oneYearCachePatterns).toEqual(["/_next/static/*"]);
    expect(oneYearCachePatterns).not.toContain("/*.html");
    expect(oneYearCachePatterns).not.toContain("/");
    expect(
      oneYearCachePatterns.some((pattern) => pattern.startsWith("/game-assets/")),
    ).toBe(false);

    expect(matchHeadersPathPattern("/_next/static/*", "/")).toBe(false);
    expect(matchHeadersPathPattern("/_next/static/*", "/index.html")).toBe(false);
    expect(
      matchHeadersPathPattern(
        "/_next/static/*",
        "/game-assets/1.6.15/data/Buildings.json",
      ),
    ).toBe(false);
    expect(
      matchHeadersPathPattern(
        "/_next/static/*",
        "/game-assets/1.6.15/maps/Farm.tmx",
      ),
    ).toBe(false);
  });
});

describe("matchHeadersPathPattern", () => {
  it.each([
    {
      pattern: "/_next/static/*",
      pathname: "/_next/static/chunks/foo.js",
    },
    {
      pattern: "/*.tmx",
      pathname: "/game-assets/1.6.15/maps/Farm.tmx",
    },
    {
      pattern: "/*.tmx",
      pathname: "/assets/maps/Farm.tmx",
    },
  ])("matches $pathname with $pattern", ({ pattern, pathname }) => {
    expect(matchHeadersPathPattern(pattern, pathname)).toBe(true);
  });

  it("does not match a non-TMX path against /*.tmx", () => {
    expect(
      matchHeadersPathPattern("/*.tmx", "/game-assets/1.6.15/maps/Farm.png"),
    ).toBe(false);
  });

  it.each([
    { pattern: "", pathname: "/_next/static/chunks/foo.js" },
    { pattern: "/_next/static/*", pathname: "" },
    { pattern: "_next/static/*", pathname: "/_next/static/chunks/foo.js" },
    { pattern: "/*.tmx", pathname: "game-assets/1.6.15/maps/Farm.tmx" },
    { pattern: "/foo/*/bar/*", pathname: "/foo/a/bar/b" },
    { pattern: 1, pathname: "/foo" },
    { pattern: "/foo", pathname: null },
  ])(
    "rejects invalid pattern/pathname $pattern $pathname",
    ({ pattern, pathname }) => {
      expect(() =>
        matchHeadersPathPattern(pattern as never, pathname as never),
      ).toThrow(TypeError);
      expect(() =>
        matchHeadersPathPattern(pattern as never, pathname as never),
      ).toThrow(receivedValuePattern(pattern, pathname));
    },
  );
});

function parseHeadersFileRules(headersFileText: string): ReadonlyArray<{
  headers: ReadonlyArray<{ name: string; value: string }>;
  pattern: string;
}> {
  const headerRules: Array<{
    headers: Array<{ name: string; value: string }>;
    pattern: string;
  }> = [];
  let currentHeaderRule: (typeof headerRules)[number] | null = null;

  for (const rawLine of headersFileText.split("\n")) {
    if (rawLine.trim().length === 0 || rawLine.trimStart().startsWith("#")) {
      continue;
    }

    if (!/^\s/.test(rawLine)) {
      currentHeaderRule = { pattern: rawLine.trim(), headers: [] };
      headerRules.push(currentHeaderRule);
      continue;
    }

    if (currentHeaderRule === null) {
      throw new TypeError(
        `_headers header line has no pattern; received ${JSON.stringify(rawLine)}.`,
      );
    }

    const separatorIndex = rawLine.indexOf(":");
    if (separatorIndex === -1) {
      throw new TypeError(
        `_headers header line is missing ":"; received ${JSON.stringify(rawLine)}.`,
      );
    }

    currentHeaderRule.headers.push({
      name: rawLine.slice(0, separatorIndex).trim(),
      value: rawLine.slice(separatorIndex + 1).trim(),
    });
  }

  return headerRules;
}

function receivedValuePattern(pattern: unknown, pathname: unknown): RegExp {
  const invalidValue =
    isInvalidHeadersPathValue(pattern) ? pattern : pathname;
  const escapedValue = describeReceivedValue(invalidValue).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
  return new RegExp(escapedValue);
}

function isInvalidHeadersPathValue(value: unknown): boolean {
  if (typeof value !== "string" || value.length === 0 || !value.startsWith("/")) {
    return true;
  }

  const firstSplatIndex = value.indexOf("*");
  return firstSplatIndex !== -1 && value.indexOf("*", firstSplatIndex + 1) !== -1;
}

function describeReceivedValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  return String(value);
}
