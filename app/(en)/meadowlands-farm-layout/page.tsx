import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { MeadowlandsFarmPage } from "../../../src/farm-layouts/meadowlands-farm-page";
import {
  getMeadowlandsFarmPageCopy,
  meadowlandsFarmCanonicalPath,
} from "../../../src/farm-layouts/meadowlands-farm-content";
import { createMeadowlandsFarmStructuredData } from "../../../src/farm-layouts/meadowlands-farm-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const locale = "en";
const canonicalPath = meadowlandsFarmCanonicalPath;
const pageCopy = getMeadowlandsFarmPageCopy(locale);
const featuredCase = pageCopy.cases[0];

if (featuredCase === undefined) {
  throw new Error(
    `Meadowlands Farm page metadata requires at least one visible case for locale ${JSON.stringify(locale)}; received ${pageCopy.cases.length} cases.`,
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

export default function EnglishMeadowlandsFarmLayoutsPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <MeadowlandsFarmPage locale={locale} />
      <JsonLdScript structuredData={createMeadowlandsFarmStructuredData(locale)} />
    </PublicPageShell>
  );
}
