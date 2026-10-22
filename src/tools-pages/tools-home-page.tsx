import type { ReactNode } from "react";
import type { PublicLocale } from "../i18n/public-locale";
import { getToolsPageCopy, type ToolsPageCopy } from "../i18n/tools-page-copy";
import {
  createCropGrowthToolHref,
  createCropProfitHref,
  createToolsHomeHref,
} from "./planting-tool-href";
import { ProductionPlanSummary } from "./production-plan-summary";
import styles from "./tools-page.module.css";

type ToolsHomePageProperties = Readonly<{
  locale: PublicLocale;
}>;

export function ToolsHomePage({ locale }: ToolsHomePageProperties) {
  const copy = getToolsPageCopy(locale);
  const profitHref = createCropProfitHref(locale);
  const growthHref = createCropGrowthToolHref(locale);

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
          <button className={`public-secondary-cta ${styles.action}`} disabled type="button">
            {copy.home.resumeProduction}
          </button>
          <button className={`public-secondary-cta ${styles.action}`} disabled type="button">
            {copy.home.importSave}
          </button>
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
        <UnavailableCategoryCard category={copy.categories.processing} />
        <UnavailableCategoryCard category={copy.categories.production} />
        <UnavailableCategoryCard category={copy.categories.workshop} />
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

function UnavailableCategoryCard({
  category,
}: Readonly<{
  category: ToolsPageCopy["categories"]["processing"];
}>) {
  return (
    <CategoryCard
      description={category.description}
      enter={
        <button className={`public-primary-cta ${styles.action}`} disabled type="button">
          {category.enter}
        </button>
      }
      title={category.title}
    >
      {category.tools.map((toolName) => (
        <li key={toolName}>
          <button className={styles.action} disabled type="button">
            {toolName}
          </button>
        </li>
      ))}
    </CategoryCard>
  );
}
