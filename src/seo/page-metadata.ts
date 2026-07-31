import type { Metadata } from "next";
import {
  canonicalPublicPaths,
  createPublicLanguageAlternates,
  getLocalizedPublicPath,
} from "../i18n/public-route-registry";
import type { PublicLocale } from "../i18n/public-locale";
import { createCanonicalUrl } from "./public-site-url";

export type PublicPageMetadataInput = Readonly<{
  pathname: string;
  locale?: PublicLocale;
  title: string;
  description: string;
  openGraphType?: "article" | "website";
}>;

export function createPublicPageMetadata(
  input: PublicPageMetadataInput,
): Metadata {
  const locale = input.locale ?? "en";
  const canonicalPublicPath = canonicalPublicPaths.find(
    (candidate) => candidate === input.pathname,
  );
  const canonicalUrl = createCanonicalUrl(
    canonicalPublicPath
      ? getLocalizedPublicPath(locale, canonicalPublicPath)
      : input.pathname,
  );
  const openGraphType = input.openGraphType ?? "website";
  const languages = canonicalPublicPath
    ? createPublicLanguageAlternates(canonicalPublicPath)
    : undefined;

  return {
    title: input.title,
    description: input.description,
    alternates: languages
      ? { canonical: canonicalUrl, languages }
      : { canonical: canonicalUrl },
    openGraph: {
      title: input.title,
      description: input.description,
      type: openGraphType,
      url: canonicalUrl,
    },
    twitter: {
      card: "summary",
      title: input.title,
      description: input.description,
    },
  };
}
