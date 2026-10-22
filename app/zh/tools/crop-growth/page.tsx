import type { Metadata } from "next";
import { getToolsPageCopy } from "../../../../src/i18n/tools-page-copy";
import { createPublicPageMetadata } from "../../../../src/seo/page-metadata";

const toolsPageCopy = getToolsPageCopy("zh-CN");

export const metadata: Metadata = createPublicPageMetadata({
  locale: "zh-CN",
  canonicalPath: "/tools/crop-growth",
  title: toolsPageCopy.growth.metaTitle,
  description: toolsPageCopy.growth.metaDescription,
});

export default function ChineseCropGrowthPage() {
  return null;
}
