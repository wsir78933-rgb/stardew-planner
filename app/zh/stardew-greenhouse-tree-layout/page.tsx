import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import {
  getGreenhouseTreeLayoutPageCopy,
  greenhouseTreeLayoutCanonicalPath,
} from "../../../src/farm-layouts/greenhouse-tree-layout-content";
import { GreenhouseTreeLayoutPage } from "../../../src/farm-layouts/greenhouse-tree-layout-page";
import { createGreenhouseTreeLayoutPageStructuredData } from "../../../src/farm-layouts/greenhouse-tree-layout-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const locale = "zh-CN";
const canonicalPath = greenhouseTreeLayoutCanonicalPath;
const pageCopy = getGreenhouseTreeLayoutPageCopy(locale);

export const dynamic = "force-static";

export const metadata: Metadata = createPublicPageMetadata({
  locale,
  canonicalPath,
  title: pageCopy.metaTitle,
  description: pageCopy.description,
  socialImagePath: pageCopy.cover.imageSrc,
});

export default function ChineseGreenhouseTreeLayoutPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <GreenhouseTreeLayoutPage locale={locale} />
      <JsonLdScript
        structuredData={createGreenhouseTreeLayoutPageStructuredData(locale)}
      />
    </PublicPageShell>
  );
}
