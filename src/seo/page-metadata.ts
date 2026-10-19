import type { Metadata } from "next";
import {
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

function createSharedPublicMetadata(
  input: Readonly<{
    title: string;
    description: string;
    canonicalUrl: string;
    languages: ReturnType<typeof createPublicLanguageAlternates>;
    openGraphType: "article" | "website";
    socialImageUrl: string;
    robots?: Metadata["robots"];
  }>,
): Metadata {
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.canonicalUrl, languages: input.languages },
    openGraph: {
      title: input.title,
      description: input.description,
      type: input.openGraphType,
      url: input.canonicalUrl,
      images: [input.socialImageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [input.socialImageUrl],
    },
    robots: input.robots,
  };
}

function requireHomepageMetadataText(
  fieldName: "title" | "description",
  localeName: "Japanese" | "Russian",
  fieldValue: string,
): void {
  if (fieldValue.trim().length === 0) {
    throw new Error(
      `${localeName} homepage ${fieldName} must be a non-empty string. Received: ${JSON.stringify(fieldValue)}.`,
    );
  }
}

export function createPublicPageMetadata(
  input: PublicPageMetadataInput,
): Metadata {
  return createSharedPublicMetadata({
    title: input.title,
    description: input.description,
    canonicalUrl: createCanonicalUrl(
      getLocalizedPublicPath(input.locale, input.canonicalPath),
    ),
    languages: createPublicLanguageAlternates(input.canonicalPath),
    openGraphType: input.openGraphType ?? "website",
    socialImageUrl: createSocialImageUrl(
      input.socialImagePath ?? sharedSocialImagePath,
    ),
    robots: input.robots,
  });
}

export function createJapaneseHomepageMetadata(
  input: Readonly<{
    title: string;
    description: string;
  }>,
): Metadata {
  requireHomepageMetadataText("title", "Japanese", input.title);
  requireHomepageMetadataText("description", "Japanese", input.description);

  return createSharedPublicMetadata({
    title: input.title,
    description: input.description,
    canonicalUrl: createCanonicalUrl(getHomepageDisplayPath("ja")),
    languages: createPublicLanguageAlternates("/"),
    openGraphType: "website",
    socialImageUrl: createSocialImageUrl(sharedSocialImagePath),
  });
}

export function createRussianHomepageMetadata(
  input: Readonly<{
    title: string;
    description: string;
  }>,
): Metadata {
  requireHomepageMetadataText("title", "Russian", input.title);
  requireHomepageMetadataText("description", "Russian", input.description);

  return createSharedPublicMetadata({
    title: input.title,
    description: input.description,
    canonicalUrl: createCanonicalUrl(getHomepageDisplayPath("ru")),
    languages: createPublicLanguageAlternates("/"),
    openGraphType: "website",
    socialImageUrl: createSocialImageUrl(sharedSocialImagePath),
  });
}
