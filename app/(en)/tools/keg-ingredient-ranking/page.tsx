import type { Metadata } from "next";
import { getProcessingToolRouteCopy } from "../../../../src/i18n/processing-tool-route-copy";
import { createPublicPageMetadata } from "../../../../src/seo/page-metadata";
import { getProcessingToolDefinition } from "../../../../src/tools-pages/processing/processing-tool-definition";

const toolId = "keg-ingredient-ranking";
const routeCopy = getProcessingToolRouteCopy("en", toolId);

export const metadata: Metadata = createPublicPageMetadata({
  locale: "en",
  canonicalPath: getProcessingToolDefinition(toolId).canonicalPath,
  title: routeCopy.metaTitle,
  description: routeCopy.metaDescription,
});

export default function KegIngredientRankingPage() {
  return null;
}
