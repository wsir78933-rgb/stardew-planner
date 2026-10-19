import type { Metadata } from "next";
import {
  createHomepageLanguageAlternates,
  createPublicLanguageAlternates,
  getHomepageDisplayPath,
  getLocalizedPublicPath,
  type PublicCanonicalPath,
} from "../i18n/public-route-registry";
import type { PublicLocale } from "../i18n/public-locale";
import { createCanonicalUrl, publicSiteUrl } from "./public-site-url";

const sharedSocialImagePath = "/social-images/stardew-valley-farm-planner.webp";

export type PublicPageMetadataInput = Readonly<{
  locale: PublicLocale;
  canonicalPath: PublicCanonicalPath;
  title: string;
  description: string;
  openGraphType?: "article" | "website";
  socialImagePath?: string;
  robots?: Metadata["robots"];
}>;

function createSocialImageUrl(socialImagePath: string): string {
  return new URL(socialImagePath, publicSiteUrl).toString();
}

export function createPublicPageMetadata(
  input: PublicPageMetadataInput,
): Metadata {
  const canonicalUrl = createCanonicalUrl(
    getLocalizedPublicPath(input.locale, input.canonicalPath),
  );
  const openGraphType = input.openGraphType ?? "website";
  const languages = input.canonicalPath === "/"
    ? createHomepageLanguageAlternates()
    : createPublicLanguageAlternates(input.canonicalPath);
  const socialImageUrl = createSocialImageUrl(
    input.socialImagePath ?? sharedSocialImagePath,
  );

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: canonicalUrl, languages },
    openGraph: {
      title: input.title,
      description: input.description,
      type: openGraphType,
      url: canonicalUrl,
      images: [socialImageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [socialImageUrl],
    },
    robots: input.robots,
  };
}

export function createRussianHomepageMetadata(
  input: Readonly<{
    title: string;
    description: string;
  }>,
): Metadata {
  if (input.title.trim().length === 0) {
    throw new Error(
      `Russian homepage title must be a non-empty string. Received: ${JSON.stringify(input.title)}.`,
    );
  }
  if (input.description.trim().length === 0) {
    throw new Error(
      `Russian homepage description must be a non-empty string. Received: ${JSON.stringify(input.description)}.`,
    );
  }

  const canonicalUrl = createCanonicalUrl(getHomepageDisplayPath("ru"));
  const socialImageUrl = createSocialImageUrl(sharedSocialImagePath);

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: canonicalUrl,
      languages: createHomepageLanguageAlternates(),
    },
    openGraph: {
      title: input.title,
      description: input.description,
      type: "website",
      url: canonicalUrl,
      images: [socialImageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [socialImageUrl],
    },
  };
}
