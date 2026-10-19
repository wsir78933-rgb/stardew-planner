export const profitRouteIds = ["sell-raw", "keg", "jar", "dehydrator"] as const;

export type ProfitRouteId = (typeof profitRouteIds)[number];

export function parseProfitRouteId(rawValue: unknown): ProfitRouteId {
  if (profitRouteIds.includes(rawValue as ProfitRouteId)) {
    return rawValue as ProfitRouteId;
  }

  throw new Error(
    `Route must be sell-raw, keg, jar, or dehydrator. Received: ${JSON.stringify(rawValue)}.`,
  );
}
