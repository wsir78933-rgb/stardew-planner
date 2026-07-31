import type { Metadata } from "next";
import { createCanonicalUrl } from "./public-site-url";

export type PublicPageMetadataInput = Readonly<{
  pathname: string;
  title: string;
  description: string;
  openGraphType?: "article" | "website";
}>;

export function createPublicPageMetadata(
  input: PublicPageMetadataInput,
): Metadata {
  const canonicalUrl = createCanonicalUrl(input.pathname);
  const openGraphType = input.openGraphType ?? "website";

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: canonicalUrl },
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
