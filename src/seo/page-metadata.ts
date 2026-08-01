import type { Metadata } from "next";
import {
  createPublicLanguageAlternates,
  getLocalizedPublicPath,
  type PublicCanonicalPath,
} from "../i18n/public-route-registry";
import type { PublicLocale } from "../i18n/public-locale";
import { createCanonicalUrl } from "./public-site-url";

export type PublicPageMetadataInput = Readonly<{
  locale: PublicLocale;
  canonicalPath: PublicCanonicalPath;
  title: string;
  description: string;
  openGraphType?: "article" | "website";
}>;

export function createPublicPageMetadata(
  input: PublicPageMetadataInput,
): Metadata {
  const canonicalUrl = createCanonicalUrl(
    getLocalizedPublicPath(input.locale, input.canonicalPath),
  );
  const openGraphType = input.openGraphType ?? "website";
  const languages = createPublicLanguageAlternates(input.canonicalPath);

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: canonicalUrl, languages },
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
