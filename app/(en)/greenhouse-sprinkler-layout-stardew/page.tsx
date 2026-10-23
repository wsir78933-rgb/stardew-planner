import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import {
  getGreenhouseSprinklerLayoutPageCopy,
  greenhouseSprinklerLayoutCanonicalPath,
} from "../../../src/farm-layouts/greenhouse-sprinkler-layout-content";
import { GreenhouseSprinklerLayoutPage } from "../../../src/farm-layouts/greenhouse-sprinkler-layout-page";
import { createGreenhouseSprinklerLayoutPageStructuredData } from "../../../src/farm-layouts/greenhouse-sprinkler-layout-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const locale = "en";
const canonicalPath = greenhouseSprinklerLayoutCanonicalPath;
const pageCopy = getGreenhouseSprinklerLayoutPageCopy(locale);

export const dynamic = "force-static";

export const metadata: Metadata = createPublicPageMetadata({
  locale,
  canonicalPath,
  title: pageCopy.metaTitle,
  description: pageCopy.description,
  socialImagePath: pageCopy.cover.imageSrc,
});

export default function EnglishGreenhouseSprinklerLayoutPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <GreenhouseSprinklerLayoutPage locale={locale} />
      <JsonLdScript
        structuredData={createGreenhouseSprinklerLayoutPageStructuredData(locale)}
      />
    </PublicPageShell>
  );
}
