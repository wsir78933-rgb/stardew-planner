import { describe, expect, it } from "vitest";
import {
  EDITOR_INTERACTIVE_THRESHOLDS,
  FAST_4G_NETWORK_CONDITIONS,
  REQUIRED_EDITOR_PERFORMANCE_MARKS,
  assertInteractiveThreshold,
  assertCdpRuntimeApis,
  calculateSortedMedian,
  findForbiddenFrozenRuntimeRequests,
  findMissingEditorPerformanceMarks,
  parseEditorPerformanceMeasurementArguments,
} from "../../scripts/measure-editor-performance.mjs";

describe("editor performance measurement contract", () => {
  it("requires explicit valid CLI values and at least three samples", () => {
    expect(() =>
      parseEditorPerformanceMeasurementArguments([
        "--base-url",
        "http://127.0.0.1:3000",
        "--cdp-http-url",
        "http://127.0.0.1:9333",
        "--viewport",
        "desktop",
        "--cache",
        "cold",
        "--samples",
        "2",
      ]),
    ).toThrow(/--samples.*2.*at least 3/);

    expect(
      parseEditorPerformanceMeasurementArguments([
        "--base-url",
        "http://127.0.0.1:3000/",
        "--cdp-http-url",
        "http://127.0.0.1:9333/",
        "--viewport",
        "mobile",
        "--cache",
        "cold",
        "--samples",
        "3",
      ]),
    ).toEqual({
      baseUrl: "http://127.0.0.1:3000",
      cacheMode: "cold",
      cdpHttpUrl: "http://127.0.0.1:9333",
      sampleCount: 3,
      viewportKind: "mobile",
    });
  });

  it("rejects the removed --runtime option", () => {
    expect(() =>
      parseEditorPerformanceMeasurementArguments([
        "--base-url",
        "http://127.0.0.1:3000",
        "--cdp-http-url",
        "http://127.0.0.1:9333",
        "--runtime",
        "react",
        "--viewport",
        "desktop",
        "--cache",
        "cold",
        "--samples",
        "3",
      ]),
    ).toThrow(/Unsupported measurement option "--runtime"/);
  });

  it("uses the median of sorted values without mutating the recorded samples", () => {
    const recordedInteractiveDurations = [900, 300, 600];

    expect(calculateSortedMedian(recordedInteractiveDurations)).toBe(600);
    expect(recordedInteractiveDurations).toEqual([900, 300, 600]);
  });

  it("reports every missing approved mark with its received mark list", () => {
    expect(
      findMissingEditorPerformanceMarks([
        "editor:island-mounted",
        "editor:interactive",
      ]),
    ).toEqual(
      REQUIRED_EDITOR_PERFORMANCE_MARKS.filter(
        (markName) =>
          markName !== "editor:island-mounted" &&
          markName !== "editor:interactive",
      ),
    );
  });

  it("rejects every frozen runtime resource request", () => {
    expect(
      findForbiddenFrozenRuntimeRequests([
        "http://127.0.0.1:3000/reference-runtime/bootstrap.mjs",
        "http://127.0.0.1:3000/_app/immutable/entry/start.js",
        "http://127.0.0.1:3000/_next/static/chunks/app/page.js",
      ]),
    ).toEqual([
      "http://127.0.0.1:3000/reference-runtime/bootstrap.mjs",
      "http://127.0.0.1:3000/_app/immutable/entry/start.js",
    ]);
  });

  it("keeps the approved threshold contract explicit", () => {
    expect(EDITOR_INTERACTIVE_THRESHOLDS).toEqual({
      "desktop:cold": 1500,
      "desktop:warm": 800,
      "mobile:cold": 2500,
      "mobile:warm": 800,
    });
  });

  it("uses Chrome DevTools Fast 4G rather than the slower 4G throughput", () => {
    expect(FAST_4G_NETWORK_CONDITIONS).toEqual({
      connectionType: "cellular4g",
      downloadThroughput: 1_012_500,
      latency: 165,
      offline: false,
      uploadThroughput: 168_750,
    });
  });

  it("fails before navigation when a required built-in CDP API is unavailable", () => {
    expect(() =>
      assertCdpRuntimeApis({
        fetch() {},
        process: {
          version: "v20.9.0",
        },
      }),
    ).toThrow(/Node v20\.9\.0.*WebSocket/);
  });

  it("accepts an optional finite positive --max-interactive-ms override", () => {
    expect(parseEditorPerformanceMeasurementArguments([
      "--base-url", "http://127.0.0.1:3000",
      "--cdp-http-url", "http://127.0.0.1:9333",
      "--viewport", "mobile",
      "--cache", "cold",
      "--samples", "3",
      "--max-interactive-ms", "3839.1",
    ])).toEqual({
      baseUrl: "http://127.0.0.1:3000",
      cacheMode: "cold",
      cdpHttpUrl: "http://127.0.0.1:9333",
      maximumInteractiveMilliseconds: 3839.1,
      sampleCount: 3,
      viewportKind: "mobile",
    });
  });

  it.each(["", "0", "-1", "NaN", "Infinity"])(
    "rejects invalid --max-interactive-ms value %j",
    (receivedMaximum) => {
      expect(() => parseEditorPerformanceMeasurementArguments([
        "--base-url", "http://127.0.0.1:3000",
        "--cdp-http-url", "http://127.0.0.1:9333",
        "--viewport", "mobile",
        "--cache", "cold",
        "--samples", "3",
        "--max-interactive-ms", receivedMaximum,
      ])).toThrow(new RegExp(`--max-interactive-ms.*${receivedMaximum || '\\\"\\\"'}`));
    },
  );

  it("uses the invocation override for the median gate", () => {
    expect(() => assertInteractiveThreshold({
      baseUrl: "http://127.0.0.1:3000",
      cacheMode: "cold",
      cdpHttpUrl: "http://127.0.0.1:9333",
      maximumInteractiveMilliseconds: 3839.1,
      sampleCount: 3,
      viewportKind: "mobile",
    }, 3840)).toThrow(/3840ms.*3839\.1ms.*mobile:cold/);
  });

  it("preserves the profile threshold when no override is provided", () => {
    expect(() => assertInteractiveThreshold({
      baseUrl: "http://127.0.0.1:3000",
      cacheMode: "cold",
      cdpHttpUrl: "http://127.0.0.1:9333",
      sampleCount: 3,
      viewportKind: "mobile",
    }, 2500.1)).toThrow(/2500\.1ms.*2500ms.*mobile:cold/);
  });
});
