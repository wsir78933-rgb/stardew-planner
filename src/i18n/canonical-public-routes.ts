export const canonicalPublicPaths = [
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
  "/privacy",
  "/terms",
] as const;

export type CanonicalPublicPath = (typeof canonicalPublicPaths)[number];

export function assertCanonicalPublicPath(
  canonicalPath: string,
): asserts canonicalPath is CanonicalPublicPath {
  if (canonicalPublicPaths.includes(canonicalPath as CanonicalPublicPath)) {
    return;
  }

  throw new Error(
    `canonical public path "${canonicalPath}" is not supported`,
  );
}
