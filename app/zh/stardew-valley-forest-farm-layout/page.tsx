import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { ForestFarmPage } from "../../../src/farm-layouts/forest-farm-page";
import {
  forestFarmCanonicalPath,
  getForestFarmPageCopy,
} from "../../../src/farm-layouts/forest-farm-content";
import { createForestFarmStructuredData } from "../../../src/farm-layouts/forest-farm-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const locale = "zh-CN";
const canonicalPath = forestFarmCanonicalPath;
const pageCopy = getForestFarmPageCopy(locale);
const featuredCase = pageCopy.cases[0];

if (featuredCase === undefined) {
  throw new Error(
    `Forest Farm page metadata requires at least one visible case for locale ${JSON.stringify(locale)}; received ${pageCopy.cases.length} cases.`,
  );
}

export const dynamic = "force-static";

export const metadata: Metadata = createPublicPageMetadata({
  locale,
  canonicalPath,
  title: pageCopy.metaTitle,
  description: pageCopy.description,
  socialImagePath: featuredCase.imageSrc,
});

export default function ChineseForestFarmLayoutsPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <ForestFarmPage locale={locale} />
      <JsonLdScript structuredData={createForestFarmStructuredData(locale)} />
    </PublicPageShell>
  );
}
