import type { Metadata } from "next";
import { JsonLdScript } from "../../../../src/components/json-ld-script";
import { getLocalizedPublicPath } from "../../../../src/i18n/public-route-registry";
import { getToolsPageCopy } from "../../../../src/i18n/tools-page-copy";
import { createPublicPageMetadata } from "../../../../src/seo/page-metadata";
import { createWebApplicationStructuredData } from "../../../../src/seo/page-structured-data";

const toolsPageCopy = getToolsPageCopy("en");

export const metadata: Metadata = createPublicPageMetadata({
  locale: "en",
  canonicalPath: "/tools/crop-profit",
  title: toolsPageCopy.profit.metaTitle,
  description: toolsPageCopy.profit.metaDescription,
});

export default function CropProfitPage() {
  return (
    <JsonLdScript
      structuredData={createWebApplicationStructuredData({
        locale: "en",
        name: toolsPageCopy.profit.metaTitle,
        description: toolsPageCopy.profit.metaDescription,
        pathname: getLocalizedPublicPath("en", "/tools/crop-profit"),
      })}
    />
  );
}
