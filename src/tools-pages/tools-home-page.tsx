import type { ReactNode } from "react";
import type { PublicLocale } from "../i18n/public-locale";
import { getToolsPageCopy, type ToolsPageCopy } from "../i18n/tools-page-copy";
import {
  createCropGrowthToolHref,
  createCropProfitHref,
} from "./planting-tool-href";
import {
  getProcessingToolHref,
  PROCESSING_TOOL_IDS,
} from "./processing/processing-tool-definition";
import { ProductionPlanSummary } from "./production-plan-summary";
import { getPlanningToolHref, type PlanningToolId } from "./planning-tool-definition";
import styles from "./tools-page.module.css";

type ToolsHomePageProperties = Readonly<{
  locale: PublicLocale;
}>;

export function ToolsHomePage({ locale }: ToolsHomePageProperties) {
  const copy = getToolsPageCopy(locale);
  const profitHref = createCropProfitHref(locale);
  const growthHref = createCropGrowthToolHref(locale);
  const processingToolLinks = PROCESSING_TOOL_IDS.map((toolId) => ({
    href: getProcessingToolHref(locale, toolId),
    label: copy.categories.processing.tools[toolId],
    toolId,
  }));
  const firstProcessingToolHref = getProcessingToolHref(
    locale,
    "basic-processing-profit",
  );

  return (
    <article className={styles.toolsPage} data-tools-home="true">
      <header className="public-page-header">
        <h1>{copy.home.heading}</h1>
        <p>{copy.home.subhead}</p>
      </header>
      <section className={styles.panel}>
        <h2>{copy.home.resumeHeading}</h2>
        <ProductionPlanSummary copy={copy} />
        <div className={styles.resumeRow}>
          <a className="public-secondary-cta" href={profitHref}>
            {copy.home.resumeProfit}
          </a>
          <a className="public-secondary-cta" href={getPlanningToolHref(locale, "today-processing-list")}>
            {copy.home.resumeProduction}
          </a>
          <a className="public-secondary-cta" href={`${getPlanningToolHref(locale, "today-processing-list")}#import-save`}>
            {copy.home.importSave}
          </a>
        </div>
      </section>
      <div className={styles.categoryGrid}>
        <CategoryCard
          description={copy.categories.planting.description}
          enter={<a className="public-primary-cta" href={profitHref}>{copy.categories.planting.enter}</a>}
          title={copy.categories.planting.title}
        >
          <li>
            <a href={profitHref}>{readPlantingToolName(copy.categories.planting.tools, 0)}</a>
          </li>
          <li>
            <a href={growthHref}>{readPlantingToolName(copy.categories.planting.tools, 1)}</a>
          </li>
        </CategoryCard>
        <CategoryCard
          description={copy.categories.processing.description}
          enter={
            <a className="public-primary-cta" href={firstProcessingToolHref}>
              {copy.categories.processing.enter}
            </a>
          }
          title={copy.categories.processing.title}
        >
          {processingToolLinks.map((processingToolLink) => (
            <li key={processingToolLink.toolId}>
              <a href={processingToolLink.href}>{processingToolLink.label}</a>
            </li>
          ))}
        </CategoryCard>
        <PlanningCategoryCard locale={locale} category={copy.categories.production} toolIds={["today-processing-list", "production-schedule"]} />
        <PlanningCategoryCard locale={locale} category={copy.categories.workshop} toolIds={["keg-count", "materials-and-resin"]} />
      </div>
      <p className="public-note">{copy.home.scopeNote}</p>
      <p className="public-note">{copy.home.versionLabel}</p>
    </article>
  );
}

function CategoryCard({
  title,
  description,
  enter,
  children,
}: Readonly<{
  title: string;
  description: string;
  enter: ReactNode;
  children: ReactNode;
}>) {
  return (
    <section className={styles.card} data-tool-category={title}>
      <h2>{title}</h2>
      <p>{description}</p>
      <ul className={styles.toolList}>{children}</ul>
      {enter}
    </section>
  );
}

function readPlantingToolName(toolNames: readonly string[], index: 0 | 1): string {
  const toolName = toolNames[index];
  if (toolNames.length !== 2 || toolName === undefined) {
    throw new Error(
      `Planting category must list season profit and growth calendar. Received: ${JSON.stringify(toolNames)}.`,
    );
  }

  return toolName;
}

function PlanningCategoryCard({
  category,
  locale,
  toolIds,
}: Readonly<{
  category: ToolsPageCopy["categories"]["production"];
  locale: PublicLocale;
  toolIds: readonly [PlanningToolId, PlanningToolId];
}>) {
  return (
    <CategoryCard
      description={category.description}
      enter={
        <a className="public-primary-cta" href={getPlanningToolHref(locale, toolIds[0])}>
          {category.enter}
        </a>
      }
      title={category.title}
    >
      {category.tools.map((toolName, index) => (
        <li key={toolName}>
          <a href={getPlanningToolHref(locale, toolIds[index])}>
            {toolName}
          </a>
        </li>
      ))}
    </CategoryCard>
  );
}
