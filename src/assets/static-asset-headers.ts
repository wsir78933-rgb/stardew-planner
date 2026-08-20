export function matchHeadersPathPattern(
  pattern: string,
  pathname: string,
): boolean {
  assertHeadersPathPattern(pattern);
  assertHeadersPathname(pathname);

  const splatIndex = pattern.indexOf("*");
  if (splatIndex === -1) {
    return pathname === pattern;
  }

  const prefix = pattern.slice(0, splatIndex);
  const suffix = pattern.slice(splatIndex + 1);
  return (
    pathname.length >= prefix.length + suffix.length
    && pathname.startsWith(prefix)
    && pathname.endsWith(suffix)
  );
}

function assertHeadersPathPattern(pattern: unknown): asserts pattern is string {
  if (!isAbsoluteHeadersPath(pattern)) {
    throw new TypeError(
      `Headers path pattern must be a non-empty string starting with "/"; received ${describeValue(pattern)}.`,
    );
  }

  const firstSplatIndex = pattern.indexOf("*");
  if (
    firstSplatIndex !== -1
    && pattern.indexOf("*", firstSplatIndex + 1) !== -1
  ) {
    throw new TypeError(
      `Headers path pattern may contain at most one splat "*"; received ${describeValue(pattern)}.`,
    );
  }
}

function assertHeadersPathname(pathname: unknown): asserts pathname is string {
  if (!isAbsoluteHeadersPath(pathname)) {
    throw new TypeError(
      `Headers pathname must be a non-empty string starting with "/"; received ${describeValue(pathname)}.`,
    );
  }
}

function isAbsoluteHeadersPath(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.startsWith("/");
}

function describeValue(value: unknown): string {
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
