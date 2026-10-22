import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import {
  getFruitTreeLayoutPageCopy,
  fruitTreeLayoutCanonicalPath,
} from "../../../src/farm-layouts/fruit-tree-layout-content";
import { FruitTreeLayoutPage } from "../../../src/farm-layouts/fruit-tree-layout-page";
import { createFruitTreeLayoutPageStructuredData } from "../../../src/farm-layouts/fruit-tree-layout-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";
import { createCanonicalUrl } from "../../../src/seo/public-site-url";

const locale = "zh-CN";
const canonicalPath = fruitTreeLayoutCanonicalPath;
const pageCopy = getFruitTreeLayoutPageCopy(locale);
const structuredData = createFruitTreeLayoutPageStructuredData(locale);

function createChineseFruitTreeLayoutMetadata(): Metadata {
  const pageMetadata = createPublicPageMetadata({
    locale,
    canonicalPath,
    title: pageCopy.metaTitle,
    description: pageCopy.description,
    socialImagePath: pageCopy.cover.imageSrc,
  });

  if (pageMetadata.openGraph === undefined || pageMetadata.openGraph === null) {
    throw new Error(
      `Fruit Tree Layout metadata is missing openGraph. Received: ${JSON.stringify(pageMetadata.openGraph)}.`,
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

export const metadata: Metadata = createChineseFruitTreeLayoutMetadata();

export default function ChineseFruitTreeLayoutPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <FruitTreeLayoutPage locale={locale} />
      <JsonLdScript structuredData={structuredData} />
    </PublicPageShell>
  );
}
