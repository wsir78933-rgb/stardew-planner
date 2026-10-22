import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import {
  getSprinklerLayoutPageCopy,
  sprinklerLayoutCanonicalPath,
  type SprinklerLayoutPageCopy,
} from "../../../src/farm-layouts/sprinkler-layout-content";
import { SprinklerLayoutPage } from "../../../src/farm-layouts/sprinkler-layout-page";
import { createSprinklerLayoutPageStructuredData } from "../../../src/farm-layouts/sprinkler-layout-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";
import { createCanonicalUrl } from "../../../src/seo/public-site-url";

const locale = "en";
const canonicalPath = sprinklerLayoutCanonicalPath;
const pageCopy = getSprinklerLayoutPageCopy(locale);
const structuredData = createSprinklerLayoutPageStructuredData(locale);

type SprinklerLayoutOpenGraphImage = Readonly<{
  alt: string;
  height: number;
  url: string;
  width: number;
}>;

function readSprinklerLayoutOpenGraphImage(
  pageStructuredData: Record<string, unknown>,
): SprinklerLayoutOpenGraphImage {
  const primaryImage = pageStructuredData.primaryImageOfPage;
  if (typeof primaryImage !== "object" || primaryImage === null) {
    throw new Error(
      `Sprinkler layout Open Graph image is missing primaryImageOfPage. Received: ${JSON.stringify(primaryImage)}.`,
    );
  }

  const imageRecord = primaryImage as Record<string, unknown>;
  const url = imageRecord.contentUrl;
  const width = imageRecord.width;
  const height = imageRecord.height;
  const alt = imageRecord.caption;
  if (
    typeof url !== "string" ||
    typeof width !== "number" ||
    !Number.isInteger(width) ||
    typeof height !== "number" ||
    !Number.isInteger(height) ||
    typeof alt !== "string"
  ) {
    throw new Error(
      `Sprinkler layout Open Graph image must include a string contentUrl, integer width, integer height, and string caption. Received: ${JSON.stringify(primaryImage)}.`,
    );
  }

  return { alt, height, url, width };
}

function createSprinklerLayoutPageMetadata(
  copy: SprinklerLayoutPageCopy,
  pageStructuredData: Record<string, unknown>,
): Metadata {
  const pageMetadata = createPublicPageMetadata({
    locale,
    canonicalPath,
    title: copy.metaTitle,
    description: copy.description,
    socialImagePath: copy.cover.imageSrc,
  });
  const coverImage = readSprinklerLayoutOpenGraphImage(pageStructuredData);
  const expectedCoverUrl = createCanonicalUrl(copy.cover.imageSrc);
  if (coverImage.url !== expectedCoverUrl) {
    throw new Error(
      `Sprinkler layout Open Graph image must use the cover preview. Expected: ${JSON.stringify(expectedCoverUrl)}. Received: ${JSON.stringify(coverImage.url)}.`,
    );
  }
  if (
    coverImage.width !== copy.cover.imageWidth ||
    coverImage.height !== copy.cover.imageHeight
  ) {
    throw new Error(
      `Sprinkler layout Open Graph dimensions must match the cover preview. Expected: ${copy.cover.imageWidth}x${copy.cover.imageHeight}. Received: ${coverImage.width}x${coverImage.height}.`,
    );
  }
  if (pageMetadata.openGraph === undefined || pageMetadata.openGraph === null) {
    throw new Error(
      `Sprinkler layout page metadata is missing openGraph. Received: ${JSON.stringify(pageMetadata.openGraph)}.`,
    );
  }

  return {
    ...pageMetadata,
    openGraph: {
      ...pageMetadata.openGraph,
      images: [
        {
          url: coverImage.url,
          width: coverImage.width,
          height: coverImage.height,
          alt: coverImage.alt,
        },
      ],
    },
  };
}

export const dynamic = "force-static";

export const metadata: Metadata = createSprinklerLayoutPageMetadata(
  pageCopy,
  structuredData,
);

export default function EnglishSprinklerLayoutsPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <SprinklerLayoutPage locale={locale} />
      <JsonLdScript structuredData={structuredData} />
    </PublicPageShell>
  );
}
