import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { FourCornersFarmPage } from "../../../src/farm-layouts/four-corners-farm-page";
import {
  fourCornersFarmCanonicalPath,
  getFourCornersFarmPageCopy,
} from "../../../src/farm-layouts/four-corners-farm-content";
import { createFourCornersFarmStructuredData } from "../../../src/farm-layouts/four-corners-farm-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const locale = "en";
const canonicalPath = fourCornersFarmCanonicalPath;
const pageCopy = getFourCornersFarmPageCopy(locale);
const featuredCase = pageCopy.cases[0];

if (featuredCase === undefined) {
  throw new Error(
    `Four Corners Farm page metadata requires at least one visible case for locale ${JSON.stringify(locale)}; received ${pageCopy.cases.length} cases.`,
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

export default function EnglishFourCornersFarmLayoutsPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <FourCornersFarmPage locale={locale} />
      <JsonLdScript structuredData={createFourCornersFarmStructuredData(locale)} />
    </PublicPageShell>
  );
}
