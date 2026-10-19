import type { Metadata } from "next";
import { Suspense } from "react";
import { PublicPageShell } from "../../../../src/components/public-page-shell";
import { getToolsPageCopy } from "../../../../src/i18n/tools-page-copy";
import { createPublicPageMetadata } from "../../../../src/seo/page-metadata";
import { CropGrowthTool } from "../../../../src/tools-pages/crop-growth-tool";
import { CropGrowthToolQuery } from "../../../../src/tools-pages/crop-growth-tool-query";

const toolsPageCopy = getToolsPageCopy("en");

export const metadata: Metadata = createPublicPageMetadata({
  locale: "en",
  canonicalPath: "/tools/crop-growth",
  title: toolsPageCopy.growth.metaTitle,
  description: toolsPageCopy.growth.metaDescription,
});

export default function CropGrowthPage() {
  return (
    <PublicPageShell canonicalPath="/tools/crop-growth" locale="en">
      <Suspense fallback={<CropGrowthTool locale="en" requestedCropId={null} />}>
        <CropGrowthToolQuery locale="en" />
      </Suspense>
    </PublicPageShell>
  );
}
