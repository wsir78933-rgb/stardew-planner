"use client";

import { PublicPageShell } from "../components/public-page-shell";
import type { PublicLocale } from "../i18n/public-locale";
import { getPlanningToolRouteCopy, type PlanningToolComparisonCopy } from "../i18n/planning-tool-route-copy";
import type { KegCapacityPlanHandoff } from "../workshop-tools/keg-capacity";
import { SimpleHero } from "./simple-hero";
import { getPlanningToolPath, type PlanningToolId } from "./planning-tool-definition";
import { createKegCapacityProductionPlan } from "./planning-tool-handoff";
import { createProductionPlanIncomingHref } from "./production/production-plan-handoff";
import { ProductionPlannerTool } from "./production/production-planner-tool";
import { KegCapacityTool } from "./workshop/keg-capacity-tool";
import { KegMaterialsTool } from "./workshop/keg-materials-tool";
import styles from "./planning-tool-page.module.css";

function PlanningToolComparison({
  copy,
  toolId,
}: Readonly<{ copy: PlanningToolComparisonCopy; toolId: PlanningToolId }>) {
  const headingId = `${toolId}-comparison-title`;
  const regionLabel = copy.title;

  return (
    <section className={styles.comparison} aria-labelledby={headingId}>
      <div className={styles.comparisonIntro}>
        <p className={styles.comparisonEyebrow}>{copy.eyebrow}</p>
        <h2 id={headingId} className={styles.comparisonTitle}>{copy.title}</h2>
        <p className={styles.comparisonDescription}>{copy.description}</p>
      </div>
      <div
        aria-label={regionLabel}
        className={styles.comparisonScroller}
        role="region"
        tabIndex={0}
      >
        <table className={styles.comparisonTable}>
          <caption className={styles.visuallyHidden}>{copy.title}</caption>
          <colgroup>
            <col className={styles.comparisonDimensionColumn} />
            {copy.products.map((product) => (
              <col className={styles.comparisonProductColumn} key={product} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col">{copy.dimensionLabel}</th>
              {copy.products.map((product, productIndex) => (
                <th
                  className={productIndex === 0 ? styles.currentToolHeader : undefined}
                  key={product}
                  scope="col"
                >
                  {product}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {copy.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, valueIndex) => (
                  <td
                    className={valueIndex === 0 ? styles.currentToolValue : undefined}
                    key={`${row.label}-${valueIndex}`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.comparisonScrollHint}>{copy.scrollHint}</p>
      <div className={styles.comparisonSources}>
        <span>{copy.sourcesLabel}:</span>
        {copy.sources.map((source) => (
          <a href={source.href} key={source.href} rel="noreferrer noopener" target="_blank">
            {source.label}
          </a>
        ))}
      </div>
    </section>
  );
}

export function PlanningToolPage({ locale, toolId }: Readonly<{ locale: PublicLocale; toolId: PlanningToolId }>) {
  const copy = getPlanningToolRouteCopy(locale, toolId);
  const calculatorId = `${toolId}-calculator`;
  const isProduction = toolId === "today-processing-list" || toolId === "production-schedule";
  const categoryLabel = locale === "zh-CN" ? (isProduction ? "生产计划" : "工坊建设") : (isProduction ? "Production plan" : "Workshop");
  function testCurrentStock(handoff: KegCapacityPlanHandoff) {
    const input = createKegCapacityProductionPlan(handoff);
    window.location.assign(createProductionPlanIncomingHref(locale, input));
  }
  return (
    <PublicPageShell locale={locale} canonicalPath={getPlanningToolPath(toolId)}>
      <article className={styles.page} data-planning-page={toolId}>
        <SimpleHero locale={locale} copy={copy.hero} actionHref={`#${calculatorId}`} titleId={`${toolId}-hero-title`} />
        <section className={styles.workspace} id={calculatorId} aria-label={copy.title} tabIndex={-1}>
          <p className={styles.breadcrumb}><a href={locale === "zh-CN" ? "/zh/tools" : "/tools"}>{locale === "zh-CN" ? "全部工具" : "All tools"}</a> / {categoryLabel}</p>
          {isProduction ? <ProductionPlannerTool locale={locale} view={toolId === "today-processing-list" ? "today" : "schedule"} /> : null}
          {toolId === "keg-count" ? <KegCapacityTool locale={locale} onTestProductionPlan={testCurrentStock} /> : null}
          {toolId === "materials-and-resin" ? <KegMaterialsTool locale={locale} /> : null}
        </section>
        <PlanningToolComparison copy={copy.comparison} toolId={toolId} />
      </article>
    </PublicPageShell>
  );
}
