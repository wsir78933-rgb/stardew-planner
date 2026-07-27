import { assertSiteLocale, type SiteLocale } from "./locales";
import { assertCanonicalPublicPath } from "./canonical-public-routes";

const chineseLocalePathPrefix = "/zh";

export function getLocalizedPath(
  locale: SiteLocale,
  canonicalPath: string,
  search = "",
  hash = "",
): string {
  assertSiteLocale(locale);
  assertCanonicalPath(canonicalPath);

  const localizedPath =
    locale === "en"
      ? canonicalPath
      : canonicalPath === "/"
        ? chineseLocalePathPrefix
        : `${chineseLocalePathPrefix}${canonicalPath}`;

  return `${localizedPath}${normalizeSearch(search)}${normalizeHash(hash)}`;
}

export function getCanonicalPath(
  locale: SiteLocale,
  localizedPath: string,
): string {
  assertSiteLocale(locale);
  assertPathStartsWithSlash(localizedPath, "localized path");

  if (locale === "en") {
    assertNotChineseLocalePath(localizedPath, "English localized path");
    assertCanonicalPublicPath(localizedPath);
    return localizedPath;
  }

  if (localizedPath === chineseLocalePathPrefix) {
    return "/";
  }

  if (localizedPath.startsWith(`${chineseLocalePathPrefix}/`)) {
    const canonicalPath = localizedPath.slice(chineseLocalePathPrefix.length);
    assertCanonicalPublicPath(canonicalPath);
    return canonicalPath;
  }

  throw new Error(
    `localized path "${localizedPath}" must start with "${chineseLocalePathPrefix}"`,
  );
}

function assertCanonicalPath(canonicalPath: string): void {
  assertPathStartsWithSlash(canonicalPath, "canonical path");
  assertNotChineseLocalePath(canonicalPath, "canonical path");
  assertCanonicalPublicPath(canonicalPath);
}

function assertNotChineseLocalePath(path: string, pathName: string): void {
  if (!isChineseLocalePath(path)) {
    return;
  }

  throw new Error(
    `${pathName} "${path}" must not use the "${chineseLocalePathPrefix}" locale prefix`,
  );
}

function isChineseLocalePath(path: string): boolean {
  return (
    path === chineseLocalePathPrefix ||
    path.startsWith(`${chineseLocalePathPrefix}/`)
  );
}

function assertPathStartsWithSlash(path: string, pathName: string): void {
  if (typeof path === "string" && path.startsWith("/")) {
    return;
  }

  throw new Error(`${pathName} ${formatInvalidValue(path)} must start with "/"`);
}

function normalizeSearch(search: string): string {
  assertString(search, "search");
  return search === "" || search.startsWith("?") ? search : `?${search}`;
}

function normalizeHash(hash: string): string {
  assertString(hash, "hash");
  return hash === "" || hash.startsWith("#") ? hash : `#${hash}`;
}

function assertString(value: unknown, valueName: string): asserts value is string {
  if (typeof value === "string") {
    return;
  }

  throw new Error(`${valueName} ${formatInvalidValue(value)} must be a string`);
}

function formatInvalidValue(value: unknown): string {
  return typeof value === "string" ? `"${value}"` : String(value);
}
