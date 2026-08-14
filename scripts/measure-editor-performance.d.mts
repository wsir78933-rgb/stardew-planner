export type EditorViewportKind = "desktop" | "mobile";
export type EditorCacheMode = "cold" | "warm";

export type EditorPerformanceMeasurementOptions = Readonly<{
  baseUrl: string;
  cacheMode: EditorCacheMode;
  cdpHttpUrl: string;
  maximumInteractiveMilliseconds?: number;
  sampleCount: number;
  viewportKind: EditorViewportKind;
}>;

export declare const REQUIRED_EDITOR_PERFORMANCE_MARKS: readonly string[];

export declare const EDITOR_INTERACTIVE_THRESHOLDS: Readonly<
  Record<`${EditorViewportKind}:${EditorCacheMode}`, number>
>;

export declare const FAST_4G_NETWORK_CONDITIONS: Readonly<{
  connectionType: "cellular4g";
  downloadThroughput: number;
  latency: number;
  offline: false;
  uploadThroughput: number;
}>;

export declare function parseEditorPerformanceMeasurementArguments(
  argumentValues: readonly string[],
): EditorPerformanceMeasurementOptions;

export declare function calculateSortedMedian(
  recordedValues: readonly number[],
): number;

export declare function assertInteractiveThreshold(
  measurementOptions: EditorPerformanceMeasurementOptions,
  medianInteractiveMilliseconds: number,
): void;

export declare function findMissingEditorPerformanceMarks(
  recordedMarkNames: readonly string[],
): string[];

export declare function createMarkDurationsByName(
  entries: readonly Readonly<{ name: string; startTime: number }>[],
): Record<string, number>;

export declare function findForbiddenFrozenRuntimeRequests(
  requestedUrls: readonly string[],
): string[];

export declare function assertCdpRuntimeApis(
  runtimeApi?: Record<string, unknown>,
): void;
