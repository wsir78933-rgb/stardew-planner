import type { Metadata } from "next";
import { JsonLdScript } from "../../../../src/components/json-ld-script";
import { getLocalizedPublicPath } from "../../../../src/i18n/public-route-registry";
import { getToolsPageCopy } from "../../../../src/i18n/tools-page-copy";
import { createPublicPageMetadata } from "../../../../src/seo/page-metadata";
import { createWebApplicationStructuredData } from "../../../../src/seo/page-structured-data";

const toolsPageCopy = getToolsPageCopy("zh-CN");

export const metadata: Metadata = createPublicPageMetadata({
  locale: "zh-CN",
  canonicalPath: "/tools/crop-profit",
  title: toolsPageCopy.profit.metaTitle,
  description: toolsPageCopy.profit.metaDescription,
});

export default function ChineseCropProfitPage() {
  return (
    <JsonLdScript
      structuredData={createWebApplicationStructuredData({
        locale: "zh-CN",
        name: toolsPageCopy.profit.metaTitle,
        description: toolsPageCopy.profit.metaDescription,
        pathname: getLocalizedPublicPath("zh-CN", "/tools/crop-profit"),
      })}
    />
  );
}
