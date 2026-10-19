import type { Metadata } from "next";
import { Suspense } from "react";
import { PublicPageShell } from "../../../../src/components/public-page-shell";
import { getToolsPageCopy } from "../../../../src/i18n/tools-page-copy";
import { createPublicPageMetadata } from "../../../../src/seo/page-metadata";
import { CropGrowthTool } from "../../../../src/tools-pages/crop-growth-tool";
import { CropGrowthToolQuery } from "../../../../src/tools-pages/crop-growth-tool-query";

const toolsPageCopy = getToolsPageCopy("zh-CN");

export const metadata: Metadata = createPublicPageMetadata({
  locale: "zh-CN",
  canonicalPath: "/tools/crop-growth",
  title: toolsPageCopy.growth.metaTitle,
  description: toolsPageCopy.growth.metaDescription,
});

export default function ChineseCropGrowthPage() {
  return (
    <PublicPageShell canonicalPath="/tools/crop-growth" locale="zh-CN">
      <Suspense fallback={<CropGrowthTool locale="zh-CN" requestedCropId={null} />}>
        <CropGrowthToolQuery locale="zh-CN" />
      </Suspense>
    </PublicPageShell>
  );
}
