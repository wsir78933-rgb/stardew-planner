import type { Metadata } from "next";
import { JsonLdScript } from "../../../../src/components/json-ld-script";
import { getLocalizedPublicPath } from "../../../../src/i18n/public-route-registry";
import { getProcessingToolRouteCopy } from "../../../../src/i18n/processing-tool-route-copy";
import { createPublicPageMetadata } from "../../../../src/seo/page-metadata";
import { createWebApplicationStructuredData } from "../../../../src/seo/page-structured-data";
import { getProcessingToolDefinition } from "../../../../src/tools-pages/processing/processing-tool-definition";

const toolId = "dehydrator-processing";
const routeCopy = getProcessingToolRouteCopy("zh-CN", toolId);
const canonicalPath = getProcessingToolDefinition(toolId).canonicalPath;

export const metadata: Metadata = createPublicPageMetadata({
  locale: "zh-CN",
  canonicalPath,
  title: routeCopy.metaTitle,
  description: routeCopy.metaDescription,
});

export default function ChineseDehydratorProcessingPage() {
  return (
    <JsonLdScript
      structuredData={createWebApplicationStructuredData({
        locale: "zh-CN",
        name: routeCopy.metaTitle,
        description: routeCopy.metaDescription,
        pathname: getLocalizedPublicPath("zh-CN", canonicalPath),
      })}
    />
  );
}
