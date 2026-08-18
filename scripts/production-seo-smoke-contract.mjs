const canonicalPublicPathnames = Object.freeze([
  "/",
  "/privacy",
  "/terms",
  "/contact",
  "/blog",
  "/blog/archive",
  "/carpenter-stardew",
  "/where-is-robin-stardew-valley",
  "/stardew-valley-npc",
]);

const publicLocales = Object.freeze(["en", "zh-CN"]);

function assertValidInternalPathname(pathname, pathnameDescription) {
  if (
    typeof pathname !== "string"
    || !pathname.startsWith("/")
    || pathname.startsWith("//")
    || pathname.includes("\\")
    || pathname.includes("?")
    || pathname.includes("#")
    || (pathname !== "/" && pathname.endsWith("/"))
  ) {
    throw new Error(
      `${pathnameDescription} must be a query-free root-relative pathname without a trailing slash; received ${JSON.stringify(pathname)}.`,
    );
  }

  const parsedPathname = new URL(pathname, "https://production-seo-smoke.invalid");

  if (
    parsedPathname.origin !== "https://production-seo-smoke.invalid"
    || parsedPathname.pathname !== pathname
  ) {
    throw new Error(
      `${pathnameDescription} must resolve unchanged on the production origin; received ${JSON.stringify(pathname)} and resolved ${JSON.stringify(parsedPathname.href)}.`,
    );
  }
}

function assertUniqueInternalPathnames(pathnames, pathnameDescription) {
  for (const pathname of pathnames) {
    assertValidInternalPathname(pathname, pathnameDescription);
  }

  if (new Set(pathnames).size !== pathnames.length) {
    throw new Error(
      `${pathnameDescription} values must be unique; received ${JSON.stringify(pathnames)}.`,
    );
  }
}

function getLocalizedPathname(locale, canonicalPathname) {
  return locale === "en"
    ? canonicalPathname
    : canonicalPathname === "/"
      ? "/zh"
      : `/zh${canonicalPathname}`;
}

function createPublicHtmlPathContract(locale, canonicalPathname) {
  const englishPathname = getLocalizedPathname("en", canonicalPathname);
  const chinesePathname = getLocalizedPathname("zh-CN", canonicalPathname);

  return Object.freeze({
    canonicalPathname,
    locale,
    pathname: getLocalizedPathname(locale, canonicalPathname),
    languageAlternatePathnames: Object.freeze({
      en: englishPathname,
      "zh-CN": chinesePathname,
      "x-default": englishPathname,
    }),
  });
}

assertUniqueInternalPathnames(
  canonicalPublicPathnames,
  "Production SEO smoke canonical pathname",
);
export const expectedPublicHtmlPathContracts = Object.freeze(
  publicLocales.flatMap((locale) =>
    canonicalPublicPathnames.map((canonicalPathname) =>
      createPublicHtmlPathContract(locale, canonicalPathname),
    ),
  ),
);

export const expectedNoindexContactPathnames = Object.freeze([
  "/contact",
  "/zh/contact",
]);

export const expectedSitemapPathnames = Object.freeze(
  expectedPublicHtmlPathContracts
    .map(({ pathname }) => pathname)
    .filter(
      (pathname) => !expectedNoindexContactPathnames.includes(pathname),
    ),
);

export const missingPageProbePathname =
  "/__production-seo-smoke-missing-page__";

export const requiredSecurityHeaderNames = Object.freeze([
  "strict-transport-security",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
]);

assertUniqueInternalPathnames(
  expectedPublicHtmlPathContracts.map(({ pathname }) => pathname),
  "Production SEO smoke public HTML pathname",
);
assertUniqueInternalPathnames(
  expectedSitemapPathnames,
  "Production SEO smoke sitemap pathname",
);
assertUniqueInternalPathnames(
  expectedNoindexContactPathnames,
  "Production SEO smoke noindex Contact pathname",
);
assertValidInternalPathname(
  missingPageProbePathname,
  "Production SEO smoke missing-page probe pathname",
);

if (expectedPublicHtmlPathContracts.length !== 18) {
  throw new Error(
    `Production SEO smoke must declare 18 public HTML path contracts; received ${String(expectedPublicHtmlPathContracts.length)}.`,
  );
}

if (expectedSitemapPathnames.length !== 16) {
  throw new Error(
    `Production SEO smoke must declare 16 sitemap pathnames; received ${String(expectedSitemapPathnames.length)}.`,
  );
}
