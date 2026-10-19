import type { Metadata } from "next";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { getToolsPageCopy } from "../../../src/i18n/tools-page-copy";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";
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
      <ToolsHomePage locale="zh-CN" />
    </PublicPageShell>
  );
}
