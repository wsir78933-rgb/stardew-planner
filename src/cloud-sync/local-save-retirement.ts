export type LocalSaveRetirementState =
  | Readonly<{ kind: "not-configured" }>
  | Readonly<{
      kind: "countdown";
      daysRemaining: number;
      hoursRemaining: number;
      minutesRemaining: number;
    }>
  | Readonly<{ kind: "ended" }>;

const ISO_TIMESTAMP_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-](\d{2}):(\d{2}))$/;

export function getConfiguredLocalSaveRetirementAt(
  configuredRetirementAt: string | undefined =
    process.env.NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT,
): string | null {
  if (
    configuredRetirementAt === undefined
    || configuredRetirementAt.trim().length === 0
  ) {
    return null;
  }

  parseLocalSaveRetirementAt(configuredRetirementAt);
  return configuredRetirementAt;
}

export function getLocalSaveRetirementState(
  retirementAt: string | null,
  nowEpochMilliseconds: number,
): LocalSaveRetirementState {
  if (!Number.isFinite(nowEpochMilliseconds)) {
    throw new Error(
      `Cannot calculate local-save retirement countdown because current time value ${JSON.stringify(nowEpochMilliseconds)} is not a finite timestamp.`,
    );
  }
  if (retirementAt === null) return { kind: "not-configured" };

  const retirementEpochMilliseconds = parseLocalSaveRetirementAt(retirementAt);
  const remainingMilliseconds = retirementEpochMilliseconds - nowEpochMilliseconds;
  if (remainingMilliseconds <= 0) return { kind: "ended" };

  const remainingMinutes = Math.ceil(remainingMilliseconds / 60_000);
  const daysRemaining = Math.floor(remainingMinutes / (24 * 60));
  const minutesAfterDays = remainingMinutes - daysRemaining * 24 * 60;

  return {
    kind: "countdown",
    daysRemaining,
    hoursRemaining: Math.floor(minutesAfterDays / 60),
    minutesRemaining: minutesAfterDays % 60,
  };
}

function parseLocalSaveRetirementAt(retirementAt: string): number {
  const timestampParts = ISO_TIMESTAMP_PATTERN.exec(retirementAt);
  if (timestampParts === null) {
    throw invalidLocalSaveRetirementAtError(retirementAt);
  }

  const year = Number(timestampParts[1]);
  const month = Number(timestampParts[2]);
  const day = Number(timestampParts[3]);
  const hour = Number(timestampParts[4]);
  const minute = Number(timestampParts[5]);
  const second = Number(timestampParts[6]);
  const offsetHour = Number(timestampParts[8] ?? 0);
  const offsetMinute = Number(timestampParts[9] ?? 0);
  const calendarDate = new Date(0);
  calendarDate.setUTCHours(0, 0, 0, 0);
  calendarDate.setUTCFullYear(year, month - 1, day);

  if (
    calendarDate.getUTCFullYear() !== year
    || calendarDate.getUTCMonth() !== month - 1
    || calendarDate.getUTCDate() !== day
    || hour > 23
    || minute > 59
    || second > 59
    || offsetHour > 23
    || offsetMinute > 59
  ) {
    throw invalidLocalSaveRetirementAtError(retirementAt);
  }

  const retirementEpochMilliseconds = Date.parse(retirementAt);
  if (!Number.isFinite(retirementEpochMilliseconds)) {
    throw invalidLocalSaveRetirementAtError(retirementAt);
  }

  return retirementEpochMilliseconds;
}

function invalidLocalSaveRetirementAtError(retirementAt: string): Error {
  return new Error(
    `Cannot parse local-save retirement timestamp ${JSON.stringify(retirementAt)}; expected a valid ISO 8601 timestamp with a timezone.`,
  );
}
