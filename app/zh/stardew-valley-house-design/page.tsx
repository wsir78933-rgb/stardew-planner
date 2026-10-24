import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import {
  getHouseDesignPageCopy,
  houseDesignCanonicalPath,
} from "../../../src/farm-layouts/house-design-content";
import { HouseDesignPage } from "../../../src/farm-layouts/house-design-page";
import { createHouseDesignPageStructuredData } from "../../../src/farm-layouts/house-design-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const locale = "zh-CN";
const canonicalPath = houseDesignCanonicalPath;
const pageCopy = getHouseDesignPageCopy(locale);

export const dynamic = "force-static";

export const metadata: Metadata = createPublicPageMetadata({
  locale,
  canonicalPath,
  title: pageCopy.metaTitle,
  description: pageCopy.description,
  socialImagePath: pageCopy.cover.imageSrc,
});

export default function ChineseHouseDesignPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <HouseDesignPage locale={locale} />
      <JsonLdScript structuredData={createHouseDesignPageStructuredData(locale)} />
    </PublicPageShell>
  );
}
