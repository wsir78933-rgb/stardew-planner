import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { FrontierFarmPage } from "../../../src/farm-layouts/frontier-farm-page";
import {
  frontierFarmCanonicalPath,
  getFrontierFarmPageCopy,
} from "../../../src/farm-layouts/frontier-farm-content";
import { createFrontierFarmStructuredData } from "../../../src/farm-layouts/frontier-farm-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const locale = "en";
const canonicalPath = frontierFarmCanonicalPath;
const pageCopy = getFrontierFarmPageCopy(locale);

export const dynamic = "force-static";

export const metadata: Metadata = createPublicPageMetadata({
  locale,
  canonicalPath,
  title: pageCopy.metaTitle,
  description: pageCopy.description,
  socialImagePath: pageCopy.cover.imageSrc,
});

export default function EnglishFrontierFarmLayoutsPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <FrontierFarmPage locale={locale} />
      <JsonLdScript structuredData={createFrontierFarmStructuredData(locale)} />
    </PublicPageShell>
  );
}
