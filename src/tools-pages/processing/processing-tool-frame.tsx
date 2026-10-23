import Link from "next/link";
import type { ReactNode } from "react";
import type { PublicLocale } from "../../i18n/public-locale";
import {
  getProcessingToolFrameCopy,
  getProcessingToolRouteCopy,
} from "../../i18n/processing-tool-route-copy";
import { SimpleHero } from "../simple-hero";
import {
  getProcessingToolHref,
  type ProcessingToolId,
} from "./processing-tool-definition";
import { ProcessingToolGuide } from "./processing-tool-guide";
import styles from "./processing-tool-frame.module.css";

export type ProcessingToolFrameProperties = Readonly<{
  children: ReactNode;
  currentTool: ProcessingToolId;
  locale: PublicLocale;
  title: string;
}>;

function readProcessingFrameCategoryLabel(
  categoryLabels: Readonly<Record<string, string>>,
  categoryId: string,
): string {
  const categoryLabel = categoryLabels[categoryId];
  if (typeof categoryLabel !== "string" || categoryLabel.trim().length === 0) {
    throw new Error(
      `Processing frame category label is missing. Received id=${JSON.stringify(categoryId)}, label=${JSON.stringify(categoryLabel)}.`,
    );
  }
  return categoryLabel;
}

export function ProcessingToolFrame({
  children,
  currentTool,
  locale,
  title,
}: ProcessingToolFrameProperties) {
  const frameCopy = getProcessingToolFrameCopy(locale);
  const routeCopy = getProcessingToolRouteCopy(locale, currentTool);
  const calculatorId = `${currentTool}-calculator`;
  const processingCategoryLabel = readProcessingFrameCategoryLabel(
    frameCopy.categoryLabels,
    "processing",
  );

  return (
    <article className={styles.processingPage} data-processing-page="true">
      <SimpleHero
        actionHref={`#${calculatorId}`}
        copy={routeCopy.hero}
        locale={locale}
        titleId={`${currentTool}-hero-title`}
      />

      <div className={styles.workspaceBreakout}>
        <div className={styles.mainColumn}>
          <p className={styles.breadcrumb}>
            {frameCopy.allToolsLabel}
            <span aria-hidden="true"> / </span>
            {processingCategoryLabel}
          </p>
          <section
            aria-label={title}
            className={styles.workspace}
            id={calculatorId}
            tabIndex={-1}
          >
            {currentTool === "keg-processing" ? (
              <Link
                className={styles.relatedToolLink}
                href={getProcessingToolHref(locale, "keg-ingredient-ranking")}
              >
                {frameCopy.kegRankingLinkLabel}
              </Link>
            ) : null}
            {children}
          </section>
        </div>
      </div>
      <ProcessingToolGuide currentTool={currentTool} locale={locale} />
    </article>
  );
}
