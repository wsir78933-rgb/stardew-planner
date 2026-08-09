function createBaseHeadingAnchor(heading: string): string {
  const normalizedHeading = heading.normalize("NFKD").toLowerCase();
  const separatedHeading = normalizedHeading
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/gu, "");

  return separatedHeading.length > 0 ? separatedHeading : "section";
}

export function createUniqueHeadingAnchors(headings: readonly string[]): readonly string[] {
  const anchorCounts = new Map<string, number>();

  return headings.map((heading) => {
    const baseAnchor = createBaseHeadingAnchor(heading);
    const occurrenceCount = (anchorCounts.get(baseAnchor) ?? 0) + 1;
    anchorCounts.set(baseAnchor, occurrenceCount);

    return occurrenceCount === 1 ? baseAnchor : `${baseAnchor}-${occurrenceCount}`;
  });
}
