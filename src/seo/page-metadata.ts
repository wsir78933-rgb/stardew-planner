import type { Metadata } from "next";
import {
  createPublicLanguageAlternates,
  getLocalizedPublicPath,
  type PublicCanonicalPath,
} from "../i18n/public-route-registry";
import type { PublicLocale } from "../i18n/public-locale";
import { createCanonicalUrl, publicSiteUrl } from "./public-site-url";

const sharedSocialImageUrl = new URL(
  "/social-images/stardew-valley-farm-planner.png",
  publicSiteUrl,
).toString();

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
      images: [sharedSocialImageUrl],
    },
    twitter: {
      card: "summary",
      title: input.title,
      description: input.description,
      images: [sharedSocialImageUrl],
    },
  };
}
