import type { ReactNode } from "react";
import type { PublicLocale } from "../i18n/public-locale";
import { getToolsPageCopy } from "../i18n/tools-page-copy";
import { createCropProfitHref, createToolsHomeHref } from "./planting-tool-href";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import styles from "./tools-page.module.css";

type PlantingToolFrameProperties = Readonly<{
  locale: PublicLocale;
  currentTool: "crop-profit" | "crop-growth";
  title: string;
  saveStatus: "empty" | "saved" | "failed";
  children: ReactNode;
}>;

export function PlantingToolFrame({
  locale,
  currentTool,
  title,
  saveStatus,
  children,
}: PlantingToolFrameProperties) {
  const copy = getToolsPageCopy(locale);
  const toolsHomeHref = createToolsHomeHref(locale);
  const profitHref = createCropProfitHref(locale);
  const growthHref = getLocalizedPublicPath(locale, "/tools/crop-growth");
  const saveLabel =
    saveStatus === "failed" ? copy.frame.saveFailed : saveStatus === "saved" ? copy.frame.saved : null;

  return (
    <article className={styles.toolsPage}>
      <header className={styles.pageHeader}>
        <p className="public-breadcrumbs">{copy.frame.breadcrumb}</p>
        <h1>{title}</h1>
        {saveLabel === null ? null : (
          <p role={saveStatus === "failed" ? "alert" : undefined}>{saveLabel}</p>
        )}
      </header>
      <div className={styles.frame}>
        <nav aria-label={copy.frame.allTools} className={styles.sidebar}>
          <a href={toolsHomeHref}>{copy.frame.allTools}</a>
          <span aria-current="page">{copy.frame.planting}</span>
          <button className={styles.action} disabled type="button">
            {copy.frame.processing}
          </button>
          <button className={styles.action} disabled type="button">
            {copy.frame.production}
          </button>
          <button className={styles.action} disabled type="button">
            {copy.frame.workshop}
          </button>
          <p className={styles.note}>{copy.frame.versionNote}</p>
        </nav>
        <div>
          <div className={styles.tabRow}>
            <a
              aria-current={currentTool === "crop-profit" ? "page" : undefined}
              className={currentTool === "crop-profit" ? "public-primary-cta" : "public-secondary-cta"}
              href={profitHref}
            >
              {copy.frame.profitTab}
            </a>
            <a
              aria-current={currentTool === "crop-growth" ? "page" : undefined}
              className={currentTool === "crop-growth" ? "public-primary-cta" : "public-secondary-cta"}
              href={growthHref}
            >
              {copy.frame.growthTab}
            </a>
          </div>
          <div className={styles.workspace}>{children}</div>
        </div>
      </div>
    </article>
  );
}
