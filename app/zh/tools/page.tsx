import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { getLocalizedPublicPath } from "../../../src/i18n/public-route-registry";
import { getToolsPageCopy } from "../../../src/i18n/tools-page-copy";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";
import { createWebApplicationStructuredData } from "../../../src/seo/page-structured-data";
import { ToolsHomePage } from "../../../src/tools-pages/tools-home-page";

const toolsPageCopy = getToolsPageCopy("zh-CN");

export const metadata: Metadata = createPublicPageMetadata({
  locale: "zh-CN",
  canonicalPath: "/tools",
  title: toolsPageCopy.home.metaTitle,
  description: toolsPageCopy.home.metaDescription,
});

export default function ChineseToolsPage() {
  return (
    <PublicPageShell canonicalPath="/tools" locale="zh-CN">
      <JsonLdScript
        structuredData={createWebApplicationStructuredData({
          locale: "zh-CN",
          name: toolsPageCopy.home.metaTitle,
          description: toolsPageCopy.home.metaDescription,
          pathname: getLocalizedPublicPath("zh-CN", "/tools"),
        })}
      />
      <ToolsHomePage locale="zh-CN" />
    </PublicPageShell>
  );
}
