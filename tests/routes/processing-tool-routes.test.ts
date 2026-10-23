import type { Metadata } from "next";
import { describe, expect, it } from "vitest";
import { metadata as enBasicProcessingProfit } from "../../app/(en)/tools/basic-processing-profit/page";
import { metadata as enMachineComparison } from "../../app/(en)/tools/machine-comparison/page";
import { metadata as enKegProcessing } from "../../app/(en)/tools/keg-processing/page";
import { metadata as enPreservesJarProcessing } from "../../app/(en)/tools/preserves-jar-processing/page";
import { metadata as enDehydratorProcessing } from "../../app/(en)/tools/dehydrator-processing/page";
import { metadata as enKegIngredientRanking } from "../../app/(en)/tools/keg-ingredient-ranking/page";
import { metadata as enCaskAging } from "../../app/(en)/tools/cask-aging/page";
import { metadata as zhBasicProcessingProfit } from "../../app/zh/tools/basic-processing-profit/page";
import { metadata as zhMachineComparison } from "../../app/zh/tools/machine-comparison/page";
import { metadata as zhKegProcessing } from "../../app/zh/tools/keg-processing/page";
import { metadata as zhPreservesJarProcessing } from "../../app/zh/tools/preserves-jar-processing/page";
import { metadata as zhDehydratorProcessing } from "../../app/zh/tools/dehydrator-processing/page";
import { metadata as zhKegIngredientRanking } from "../../app/zh/tools/keg-ingredient-ranking/page";
import { metadata as zhCaskAging } from "../../app/zh/tools/cask-aging/page";
import { getProcessingToolRouteCopy } from "../../src/i18n/processing-tool-route-copy";
import type { PublicLocale } from "../../src/i18n/public-locale";
import {
  createPublicLanguageAlternates,
  getLocalizedPublicPath,
} from "../../src/i18n/public-route-registry";
import {
  getProcessingToolDefinition,
  PROCESSING_TOOL_IDS,
  type ProcessingToolId,
} from "../../src/tools-pages/processing/processing-tool-definition";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

const routeMetadataByLocale: Readonly<
  Record<PublicLocale, Readonly<Record<ProcessingToolId, Metadata>>>
> = {
  en: {
    "basic-processing-profit": enBasicProcessingProfit,
    "machine-comparison": enMachineComparison,
    "keg-processing": enKegProcessing,
    "preserves-jar-processing": enPreservesJarProcessing,
    "dehydrator-processing": enDehydratorProcessing,
    "keg-ingredient-ranking": enKegIngredientRanking,
    "cask-aging": enCaskAging,
  },
  "zh-CN": {
    "basic-processing-profit": zhBasicProcessingProfit,
    "machine-comparison": zhMachineComparison,
    "keg-processing": zhKegProcessing,
    "preserves-jar-processing": zhPreservesJarProcessing,
    "dehydrator-processing": zhDehydratorProcessing,
    "keg-ingredient-ranking": zhKegIngredientRanking,
    "cask-aging": zhCaskAging,
  },
};

describe("processing tool routes", () => {
  it("publishes seven stable English and Chinese routes with paired canonical metadata", () => {
    for (const toolId of PROCESSING_TOOL_IDS) {
      const canonicalPath = getProcessingToolDefinition(toolId).canonicalPath;
      const englishRouteCopy = getProcessingToolRouteCopy("en", toolId);
      const chineseRouteCopy = getProcessingToolRouteCopy("zh-CN", toolId);
      const englishMetadata = routeMetadataByLocale.en[toolId];
      const chineseMetadata = routeMetadataByLocale["zh-CN"][toolId];
      const englishCanonicalUrl = createCanonicalUrl(canonicalPath);
      const chineseCanonicalPath = getLocalizedPublicPath("zh-CN", canonicalPath);

      expect(englishMetadata.title).toBe(englishRouteCopy.metaTitle);
      expect(englishMetadata.description).toBe(englishRouteCopy.metaDescription);
      expect(englishMetadata.alternates).toEqual({
        canonical: englishCanonicalUrl,
        languages: createPublicLanguageAlternates(canonicalPath),
      });

      expect(chineseMetadata.title).toBe(chineseRouteCopy.metaTitle);
      expect(chineseMetadata.description).toBe(chineseRouteCopy.metaDescription);
      expect(chineseMetadata.alternates).toEqual({
        canonical: createCanonicalUrl(chineseCanonicalPath),
        languages: createPublicLanguageAlternates(canonicalPath),
      });
    }
  });
});
