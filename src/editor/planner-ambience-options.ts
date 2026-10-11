export const plannerAmbienceWeatherIds = [
  "clear",
  "rain",
  "storm",
  "green-rain",
  "snow",
] as const;

export type PlannerAmbienceWeather = (typeof plannerAmbienceWeatherIds)[number];

export type PlannerAmbienceOptions = Readonly<{
  weather: PlannerAmbienceWeather;
  showClouds: boolean;
  showDebris: boolean;
  animationsEnabled: boolean;
}>;

export const plannerAmbienceOptionsStorageKey =
  "stardew-planner:planner-ambience-options";

export function createInitialPlannerAmbienceOptions(): PlannerAmbienceOptions {
  return {
    weather: "clear",
    showClouds: false,
    showDebris: true,
    animationsEnabled: true,
  };
}

export function restorePlannerAmbienceOptions(
  rawPlannerAmbienceOptions: unknown,
): PlannerAmbienceOptions {
  if (rawPlannerAmbienceOptions === undefined) {
    return createInitialPlannerAmbienceOptions();
  }

  const optionsRecord = assertPlainRecord(
    rawPlannerAmbienceOptions,
    "Planner ambience options",
  );
  assertExactKeys(optionsRecord, [
    "weather",
    "showClouds",
    "showDebris",
    "animationsEnabled",
  ]);

  return {
    weather: readWeather(optionsRecord.weather),
    showClouds: readBoolean(optionsRecord.showClouds, "showClouds"),
    showDebris: readBoolean(optionsRecord.showDebris, "showDebris"),
    animationsEnabled: readBoolean(
      optionsRecord.animationsEnabled,
      "animationsEnabled",
    ),
  };
}

export function setPlannerAmbienceWeather(
  currentOptions: PlannerAmbienceOptions,
  weather: PlannerAmbienceWeather,
): PlannerAmbienceOptions {
  const restoredOptions = restorePlannerAmbienceOptions(currentOptions);
  return { ...restoredOptions, weather: readWeather(weather) };
}

export function setPlannerAmbienceClouds(
  currentOptions: PlannerAmbienceOptions,
  showClouds: boolean,
): PlannerAmbienceOptions {
  const restoredOptions = restorePlannerAmbienceOptions(currentOptions);
  return {
    ...restoredOptions,
    showClouds: readBoolean(showClouds, "showClouds"),
  };
}

export function setPlannerAmbienceDebris(
  currentOptions: PlannerAmbienceOptions,
  showDebris: boolean,
): PlannerAmbienceOptions {
  const restoredOptions = restorePlannerAmbienceOptions(currentOptions);
  return {
    ...restoredOptions,
    showDebris: readBoolean(showDebris, "showDebris"),
  };
}

export function setPlannerAmbienceAnimationsEnabled(
  currentOptions: PlannerAmbienceOptions,
  animationsEnabled: boolean,
): PlannerAmbienceOptions {
  const restoredOptions = restorePlannerAmbienceOptions(currentOptions);
  return {
    ...restoredOptions,
    animationsEnabled: readBoolean(animationsEnabled, "animationsEnabled"),
  };
}

function assertPlainRecord(
  value: unknown,
  label: string,
): Record<string, unknown> {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value) ||
    (Object.getPrototypeOf(value) !== Object.prototype &&
      Object.getPrototypeOf(value) !== null)
  ) {
    throw new TypeError(
      `${label} must be a plain object; received ${describeValue(value)}.`,
    );
  }

  return value as Record<string, unknown>;
}

function assertExactKeys(
  value: Record<string, unknown>,
  expectedKeys: readonly string[],
): void {
  const actualKeys = Object.keys(value);
  if (
    actualKeys.length !== expectedKeys.length ||
    expectedKeys.some((expectedKey) => !Object.hasOwn(value, expectedKey))
  ) {
    throw new TypeError(
      `Planner ambience options must contain exactly ${expectedKeys.join(", ")}; received ${actualKeys.join(", ") || "no keys"}.`,
    );
  }
}

function readWeather(value: unknown): PlannerAmbienceWeather {
  if (
    typeof value !== "string" ||
    !plannerAmbienceWeatherIds.includes(value as PlannerAmbienceWeather)
  ) {
    throw new TypeError(
      `Planner ambience weather must be one of ${plannerAmbienceWeatherIds.join(", ")}; received ${describeValue(value)}.`,
    );
  }

  return value as PlannerAmbienceWeather;
}

function readBoolean(value: unknown, fieldName: string): boolean {
  if (typeof value !== "boolean") {
    throw new TypeError(
      `Planner ambience option ${JSON.stringify(fieldName)} must be a boolean; received ${describeValue(value)}.`,
    );
  }

  return value;
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  return String(value);
}
