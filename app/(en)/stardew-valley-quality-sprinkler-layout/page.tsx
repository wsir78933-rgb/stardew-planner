import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import {
  getQualitySprinklerLayoutPageCopy,
  qualitySprinklerLayoutCanonicalPath,
} from "../../../src/farm-layouts/quality-sprinkler-layout-content";
import { QualitySprinklerLayoutPage } from "../../../src/farm-layouts/quality-sprinkler-layout-page";
import { createQualitySprinklerLayoutPageStructuredData } from "../../../src/farm-layouts/quality-sprinkler-layout-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const locale = "en";
const canonicalPath = qualitySprinklerLayoutCanonicalPath;
const pageCopy = getQualitySprinklerLayoutPageCopy(locale);

export const dynamic = "force-static";

export const metadata: Metadata = createPublicPageMetadata({
  locale,
  canonicalPath,
  title: pageCopy.metaTitle,
  description: pageCopy.description,
  socialImagePath: pageCopy.cover.imageSrc,
});

export default function EnglishQualitySprinklerLayoutsPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <QualitySprinklerLayoutPage locale={locale} />
      <JsonLdScript
        structuredData={createQualitySprinklerLayoutPageStructuredData(locale)}
      />
    </PublicPageShell>
  );
}
