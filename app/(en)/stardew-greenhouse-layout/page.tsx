import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import {
  getFeaturedGreenhouseLayoutCase,
  getGreenhouseLayoutPageCopy,
  greenhouseLayoutCanonicalPath,
} from "../../../src/farm-layouts/greenhouse-layout-content";
import { GreenhouseLayoutPage } from "../../../src/farm-layouts/greenhouse-layout-page";
import { createGreenhouseLayoutPageStructuredData } from "../../../src/farm-layouts/greenhouse-layout-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const locale = "en";
const canonicalPath = greenhouseLayoutCanonicalPath;
const pageCopy = getGreenhouseLayoutPageCopy(locale);
const featuredCase = getFeaturedGreenhouseLayoutCase(locale);

export const dynamic = "force-static";

export const metadata: Metadata = createPublicPageMetadata({
  locale,
  canonicalPath,
  title: pageCopy.metaTitle,
  description: pageCopy.description,
  socialImagePath: featuredCase.imageSrc,
});

export default function EnglishGreenhouseLayoutPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <GreenhouseLayoutPage locale={locale} />
      <JsonLdScript
        structuredData={createGreenhouseLayoutPageStructuredData(locale)}
      />
    </PublicPageShell>
  );
}
