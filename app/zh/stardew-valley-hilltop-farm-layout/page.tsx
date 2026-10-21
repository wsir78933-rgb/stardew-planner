import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { HilltopFarmPage } from "../../../src/farm-layouts/hilltop-farm-page";
import {
  getFeaturedHilltopFarmCase,
  getHilltopFarmPageCopy,
  hilltopFarmCanonicalPath,
} from "../../../src/farm-layouts/hilltop-farm-content";
import { createHilltopFarmPageStructuredData } from "../../../src/farm-layouts/hilltop-farm-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const locale = "zh-CN";
const canonicalPath = hilltopFarmCanonicalPath;
const pageCopy = getHilltopFarmPageCopy(locale);
const featuredCase = getFeaturedHilltopFarmCase(locale);

export const dynamic = "force-static";

export const metadata: Metadata = createPublicPageMetadata({
  locale,
  canonicalPath,
  title: pageCopy.metaTitle,
  description: pageCopy.description,
  socialImagePath: featuredCase.imageSrc,
});

export default function ChineseHilltopFarmLayoutsPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <HilltopFarmPage locale={locale} />
      <JsonLdScript
        structuredData={createHilltopFarmPageStructuredData(locale)}
      />
    </PublicPageShell>
  );
}
