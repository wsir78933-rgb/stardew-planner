import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { ExpandedFarmPage } from "../../../src/farm-layouts/expanded-farm-page";
import {
  expandedFarmCanonicalPath,
  getExpandedFarmPageCopy,
  getFeaturedExpandedFarmCase,
} from "../../../src/farm-layouts/expanded-farm-content";
import { createExpandedFarmPageStructuredData } from "../../../src/farm-layouts/expanded-farm-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const locale = "zh-CN";
const canonicalPath = expandedFarmCanonicalPath;
const pageCopy = getExpandedFarmPageCopy(locale);
const featuredCase = getFeaturedExpandedFarmCase(locale);

export const dynamic = "force-static";

export const metadata: Metadata = createPublicPageMetadata({
  locale,
  canonicalPath,
  title: pageCopy.metaTitle,
  description: pageCopy.description,
  socialImagePath: featuredCase.imageSrc,
});

export default function ChineseExpandedFarmLayoutsPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <ExpandedFarmPage locale={locale} />
      <JsonLdScript
        structuredData={createExpandedFarmPageStructuredData(locale)}
      />
    </PublicPageShell>
  );
}
