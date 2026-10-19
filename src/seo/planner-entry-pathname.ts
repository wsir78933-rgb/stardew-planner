const plannerEntryPathnames = new Set(["/", "/zh", "/zh/", "/ru", "/ru/"]);

export function isPlannerEntryPathname(pathname: string): boolean {
  if (typeof pathname !== "string") {
    throw new TypeError(
      `Planner entry pathname must be a string. Received: ${JSON.stringify(pathname)}.`,
    );
  }

  return plannerEntryPathnames.has(pathname);
}
