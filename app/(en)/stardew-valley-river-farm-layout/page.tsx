import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { RiverFarmPage } from "../../../src/farm-layouts/river-farm-page";
import {
  getRiverFarmPageCopy,
  riverFarmCanonicalPath,
} from "../../../src/farm-layouts/river-farm-content";
import { createRiverFarmStructuredData } from "../../../src/farm-layouts/river-farm-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const locale = "en";
const canonicalPath = riverFarmCanonicalPath;
const pageCopy = getRiverFarmPageCopy(locale);

export const dynamic = "force-static";

export const metadata: Metadata = createPublicPageMetadata({
  locale,
  canonicalPath,
  title: pageCopy.metaTitle,
  description: pageCopy.description,
  socialImagePath: pageCopy.cover.imageSrc,
});

export default function EnglishRiverFarmLayoutsPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <RiverFarmPage locale={locale} />
      <JsonLdScript structuredData={createRiverFarmStructuredData(locale)} />
    </PublicPageShell>
  );
}
