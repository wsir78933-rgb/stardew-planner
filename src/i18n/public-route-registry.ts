import { blogPostSlugs, type BlogPostSlug } from "../blog/blog-post-identities";
import { createCanonicalUrl } from "../seo/public-site-url";
import { publicLocales, type PublicLocale } from "./public-locale";

const fixedCanonicalPublicPaths = [
  "/",
  "/privacy",
  "/terms",
  "/contact",
  "/tools",
  "/tools/crop-profit",
  "/tools/crop-growth",
] as const;

type BlogCanonicalPublicPath =
  | "/blog"
  | "/blog/archive"
  | `/${BlogPostSlug}`;

export type PublicCanonicalPath =
  | (typeof fixedCanonicalPublicPaths)[number]
  | BlogCanonicalPublicPath;

const blogCanonicalPublicPaths: readonly BlogCanonicalPublicPath[] = [
  "/blog",
  "/blog/archive",
  ...blogPostSlugs.map((slug) => `/${slug}` as const),
];

export const canonicalPublicPaths: readonly PublicCanonicalPath[] = [
  ...fixedCanonicalPublicPaths,
  ...blogCanonicalPublicPaths,
];

const noindexCanonicalPublicPaths = new Set<PublicCanonicalPath>([
  "/contact",
]);

export const indexableCanonicalPublicPaths: readonly PublicCanonicalPath[] =
  canonicalPublicPaths.filter(
    (canonicalPath) => !noindexCanonicalPublicPaths.has(canonicalPath),
  );

export type LocalizedPublicRouteEntry = Readonly<{
  locale: PublicLocale;
  canonicalPath: PublicCanonicalPath;
  pathname: string;
}>;

function assertPublicLocale(locale: PublicLocale): void {
  if (!publicLocales.includes(locale)) {
    throw new Error(`Unsupported public locale. Received: ${JSON.stringify(locale)}.`);
  }
}

function assertCanonicalPublicPath(canonicalPath: PublicCanonicalPath): void {
  if (!canonicalPublicPaths.includes(canonicalPath)) {
    throw new Error(
      `Unsupported public canonical path. Received: ${JSON.stringify(canonicalPath)}.`,
    );
  }
}

export function getLocalizedPublicPath(
  locale: PublicLocale,
  canonicalPath: PublicCanonicalPath,
): string {
  assertPublicLocale(locale);
  assertCanonicalPublicPath(canonicalPath);

  if (locale === "en") {
    return canonicalPath;
  }

  return canonicalPath === "/" ? "/zh" : `/zh${canonicalPath}`;
}

export function getLocalizedPublicRouteEntries(): readonly LocalizedPublicRouteEntry[] {
  return publicLocales.flatMap((locale) =>
    canonicalPublicPaths.map((canonicalPath) => ({
      locale,
      canonicalPath,
      pathname: getLocalizedPublicPath(locale, canonicalPath),
    })),
  );
}

export function getLocalizedIndexablePublicRouteEntries(): readonly LocalizedPublicRouteEntry[] {
  return publicLocales.flatMap((locale) =>
    indexableCanonicalPublicPaths.map((canonicalPath) => ({
      locale,
      canonicalPath,
      pathname: getLocalizedPublicPath(locale, canonicalPath),
    })),
  );
}

export type PairedPublicLanguageAlternates = Readonly<{
  en: string;
  "zh-CN": string;
  "x-default": string;
}>;

export type HomepagePublicLanguageAlternates = Readonly<
  PairedPublicLanguageAlternates & {
    ja: string;
  }
>;

export function createPublicLanguageAlternates(
  canonicalPath: "/",
): HomepagePublicLanguageAlternates;
export function createPublicLanguageAlternates(
  canonicalPath: Exclude<PublicCanonicalPath, "/">,
): PairedPublicLanguageAlternates;
export function createPublicLanguageAlternates(
  canonicalPath: PublicCanonicalPath,
): PairedPublicLanguageAlternates | HomepagePublicLanguageAlternates;
export function createPublicLanguageAlternates(
  canonicalPath: PublicCanonicalPath,
): PairedPublicLanguageAlternates | HomepagePublicLanguageAlternates {
  const pairedAlternates: PairedPublicLanguageAlternates = {
    en: createCanonicalUrl(getLocalizedPublicPath("en", canonicalPath)),
    "zh-CN": createCanonicalUrl(getLocalizedPublicPath("zh-CN", canonicalPath)),
    "x-default": createCanonicalUrl(getLocalizedPublicPath("en", canonicalPath)),
  };

  if (canonicalPath !== "/") {
    return pairedAlternates;
  }

  return {
    ...pairedAlternates,
    ja: createCanonicalUrl("/ja"),
  };
}
