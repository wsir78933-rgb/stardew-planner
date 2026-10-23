import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import {
  getFeaturedWildernessFarmCase,
  getWildernessFarmPageCopy,
  wildernessFarmCanonicalPath,
} from "../../../src/farm-layouts/wilderness-farm-content";
import { WildernessFarmPage } from "../../../src/farm-layouts/wilderness-farm-page";
import { createWildernessFarmPageStructuredData } from "../../../src/farm-layouts/wilderness-farm-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const locale = "zh-CN";
const canonicalPath = wildernessFarmCanonicalPath;
const pageCopy = getWildernessFarmPageCopy(locale);
const featuredCase = getFeaturedWildernessFarmCase(locale);

export const dynamic = "force-static";

export const metadata: Metadata = createPublicPageMetadata({
  locale,
  canonicalPath,
  title: pageCopy.metaTitle,
  description: pageCopy.description,
  socialImagePath: featuredCase.imageSrc,
});

export default function ChineseWildernessFarmLayoutsPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <WildernessFarmPage locale={locale} />
      <JsonLdScript
        structuredData={createWildernessFarmPageStructuredData(locale)}
      />
    </PublicPageShell>
  );
}
