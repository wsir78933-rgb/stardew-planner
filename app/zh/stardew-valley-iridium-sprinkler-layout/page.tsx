import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import {
  getIridiumSprinklerLayoutPageCopy,
  iridiumSprinklerLayoutCanonicalPath,
} from "../../../src/farm-layouts/iridium-sprinkler-layout-content";
import { IridiumSprinklerLayoutPage } from "../../../src/farm-layouts/iridium-sprinkler-layout-page";
import { createIridiumSprinklerLayoutPageStructuredData } from "../../../src/farm-layouts/iridium-sprinkler-layout-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";
import { createCanonicalUrl } from "../../../src/seo/public-site-url";

const locale = "zh-CN";
const canonicalPath = iridiumSprinklerLayoutCanonicalPath;
const pageCopy = getIridiumSprinklerLayoutPageCopy(locale);
const structuredData = createIridiumSprinklerLayoutPageStructuredData(locale);

function createChineseIridiumSprinklerLayoutMetadata(): Metadata {
  const pageMetadata = createPublicPageMetadata({
    locale,
    canonicalPath,
    title: pageCopy.metaTitle,
    description: pageCopy.description,
    socialImagePath: pageCopy.cover.imageSrc,
  });

  if (pageMetadata.openGraph === undefined || pageMetadata.openGraph === null) {
    throw new Error(
      `Iridium Sprinkler Layout metadata is missing openGraph. Received: ${JSON.stringify(pageMetadata.openGraph)}.`,
    );
  }

  return {
    ...pageMetadata,
    openGraph: {
      ...pageMetadata.openGraph,
      images: [
        {
          url: createCanonicalUrl(pageCopy.cover.imageSrc),
          width: pageCopy.cover.imageWidth,
          height: pageCopy.cover.imageHeight,
          alt: pageCopy.cover.imageAlt,
        },
      ],
    },
  };
}

export const dynamic = "force-static";

export const metadata: Metadata = createChineseIridiumSprinklerLayoutMetadata();

export default function ChineseIridiumSprinklerLayoutPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <IridiumSprinklerLayoutPage locale={locale} />
      <JsonLdScript structuredData={structuredData} />
    </PublicPageShell>
  );
}
