import type { Metadata } from "next";
import { BeachFarmPage } from "../../../src/farm-layouts/beach-farm-page";
import {
  beachFarmCanonicalPath,
  getBeachFarmPageCopy,
} from "../../../src/farm-layouts/beach-farm-content";
import { createBeachFarmPageStructuredData } from "../../../src/farm-layouts/beach-farm-structured-data";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const locale = "en";
const canonicalPath = beachFarmCanonicalPath;
const pageCopy = getBeachFarmPageCopy(locale);
const featuredCase = pageCopy.cases[0];

if (featuredCase === undefined) {
  throw new Error(
    `Beach Farm page metadata requires at least one visible case for locale ${JSON.stringify(locale)}; received ${pageCopy.cases.length} cases.`,
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

export default function EnglishBeachFarmLayoutsPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <BeachFarmPage locale={locale} />
      <JsonLdScript structuredData={createBeachFarmPageStructuredData(locale)} />
    </PublicPageShell>
  );
}
