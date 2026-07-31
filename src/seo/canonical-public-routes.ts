import { officialFarmTypes } from "../reference/official-farm-guides";

const fixedCanonicalPublicPaths = [
  "/",
  "/farm-comparison",
  "/mods",
  "/privacy",
  "/terms",
] as const;

function assertCanonicalPublicPaths(paths: readonly string[]): void {
  const encounteredPaths = new Set<string>();

  for (const pathname of paths) {
    if (!pathname.startsWith("/") || pathname.includes("?") || pathname.includes("#")) {
      throw new Error(
        `Canonical public pathname must start with "/" and contain no query or fragment. Received: ${JSON.stringify(pathname)}.`,
      );
    }
    if (encounteredPaths.has(pathname)) {
      throw new Error(
        `Canonical public paths must be unique. Duplicate pathname: ${JSON.stringify(pathname)}.`,
      );
    }

    encounteredPaths.add(pathname);
  }
}

const configuredCanonicalPublicPaths = [
  ...fixedCanonicalPublicPaths,
  ...officialFarmTypes.map((farmType) => `/farm/${farmType}`),
] as const;

assertCanonicalPublicPaths(configuredCanonicalPublicPaths);

export const canonicalPublicPaths = configuredCanonicalPublicPaths;
