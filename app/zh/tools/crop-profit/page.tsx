import type { Metadata } from "next";
import { PublicPageShell } from "../../../../src/components/public-page-shell";
import { getToolsPageCopy } from "../../../../src/i18n/tools-page-copy";
import { createPublicPageMetadata } from "../../../../src/seo/page-metadata";
import { CropProfitPathTool } from "../../../../src/tools-pages/crop-growth-tool-query";

const toolsPageCopy = getToolsPageCopy("zh-CN");

export const metadata: Metadata = createPublicPageMetadata({
  locale: "zh-CN",
  canonicalPath: "/tools/crop-profit",
  title: toolsPageCopy.profit.metaTitle,
  description: toolsPageCopy.profit.metaDescription,
});

export default function ChineseCropProfitPage() {
  return (
    <PublicPageShell canonicalPath="/tools/crop-profit" locale="zh-CN">
      <CropProfitPathTool locale="zh-CN" />
    </PublicPageShell>
  );
}
