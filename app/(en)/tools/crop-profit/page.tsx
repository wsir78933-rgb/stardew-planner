import type { Metadata } from "next";
import { getToolsPageCopy } from "../../../../src/i18n/tools-page-copy";
import { createPublicPageMetadata } from "../../../../src/seo/page-metadata";

const toolsPageCopy = getToolsPageCopy("en");

export const metadata: Metadata = createPublicPageMetadata({
  locale: "en",
  canonicalPath: "/tools/crop-profit",
  title: toolsPageCopy.profit.metaTitle,
  description: toolsPageCopy.profit.metaDescription,
});

export default function CropProfitPage() {
  return null;
}
