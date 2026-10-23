"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PublicPageShell } from "../../components/public-page-shell";
import type { PublicLocale } from "../../i18n/public-locale";
import { getProcessingToolRouteCopy } from "../../i18n/processing-tool-route-copy";
import { CaskAgingTool } from "./cask-aging-tool";
import { KegIngredientRankingTool } from "./keg-ingredient-ranking-tool";
import { ProcessingComparisonTool } from "./processing-comparison-tool";
import { ProcessingToolFrame } from "./processing-tool-frame";
import {
  getProcessingToolDefinition,
  isProcessingComparisonToolId,
  readProcessingToolIdFromPathname,
  type ProcessingToolId,
} from "./processing-tool-definition";

export type ProcessingToolsLayoutProperties = Readonly<{
  children: ReactNode;
  locale: PublicLocale;
}>;

export function ProcessingToolsLayout({
  children,
  locale,
}: ProcessingToolsLayoutProperties) {
  const pathname = usePathname();
  const currentTool = readProcessingToolIdFromPathname(locale, pathname);

  if (currentTool === null) {
    return <>{children}</>;
  }

  const definition = getProcessingToolDefinition(currentTool);
  const routeCopy = getProcessingToolRouteCopy(locale, currentTool);

  return (
    <PublicPageShell canonicalPath={definition.canonicalPath} locale={locale}>
      <ProcessingToolFrame currentTool={currentTool} locale={locale} title={routeCopy.title}>
        {renderProcessingToolWorkspace(locale, currentTool)}
      </ProcessingToolFrame>
      {children}
    </PublicPageShell>
  );
}

function renderProcessingToolWorkspace(
  locale: PublicLocale,
  toolId: ProcessingToolId,
) {
  const definition = getProcessingToolDefinition(toolId);

  if (definition.family === "comparison") {
    if (!isProcessingComparisonToolId(toolId)) {
      throw new Error(
        `Processing tool ${JSON.stringify(toolId)} has comparison family but is not a comparison tool.`,
      );
    }

    return <ProcessingComparisonTool locale={locale} toolId={toolId} />;
  }

  if (toolId === "keg-ingredient-ranking") {
    return <KegIngredientRankingTool locale={locale} />;
  }

  if (toolId === "cask-aging") {
    return <CaskAgingTool locale={locale} />;
  }

  throw new Error(
    `Processing tool ${JSON.stringify(toolId)} has unsupported family ${JSON.stringify(definition.family)}.`,
  );
}
