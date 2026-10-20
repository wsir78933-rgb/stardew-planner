import type { Metadata } from "next";
import { FishFarmPage } from "../../../src/farm-layouts/fish-farm-page";
import {
  fishFarmCanonicalPath,
  getFeaturedFishFarmCase,
  getFishFarmPageCopy,
} from "../../../src/farm-layouts/fish-farm-content";
import { createFishFarmPageStructuredData } from "../../../src/farm-layouts/fish-farm-structured-data";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const locale = "en";
const canonicalPath = fishFarmCanonicalPath;
const pageCopy = getFishFarmPageCopy(locale);
const featuredCase = getFeaturedFishFarmCase(locale);

export const dynamic = "force-static";

export const metadata: Metadata = createPublicPageMetadata({
  locale,
  canonicalPath,
  title: pageCopy.metaTitle,
  description: pageCopy.description,
  socialImagePath: featuredCase.imageSrc,
});

export default function EnglishFishFarmLayoutsPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <FishFarmPage locale={locale} />
      <JsonLdScript structuredData={createFishFarmPageStructuredData(locale)} />
    </PublicPageShell>
  );
}
