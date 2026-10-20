import type { ReactNode } from "react";
import type { PublicLocale } from "../i18n/public-locale";
import { getToolsPageCopy } from "../i18n/tools-page-copy";
import { createCropProfitHref, createToolsHomeHref } from "./planting-tool-href";
import styles from "./tools-page.module.css";

export type PlantingToolId = "crop-profit" | "crop-growth";

type PlantingToolFrameProperties = Readonly<{
  locale: PublicLocale;
  currentTool: PlantingToolId;
  title: string;
  saveStatus: "empty" | "saved" | "failed";
  onSelectTool?: (tool: PlantingToolId) => void;
  children: ReactNode;
}>;

export function PlantingToolFrame({
  locale,
  currentTool,
  title,
  saveStatus,
  onSelectTool,
  children,
}: PlantingToolFrameProperties) {
  const copy = getToolsPageCopy(locale);
  const toolsHomeHref = createToolsHomeHref(locale);
  const profitHref = createCropProfitHref(locale);
  const growthHref = `${profitHref}?tool=growth`;
  const saveLabel =
    saveStatus === "failed" ? copy.frame.saveFailed : saveStatus === "saved" ? copy.frame.saved : null;

  return (
    <article className={styles.toolsPage}>
      <header className={styles.pageHeader}>
        <p className="public-breadcrumbs">{copy.frame.breadcrumb}</p>
        <div className={styles.titleRow}>
          <h1>{title}</h1>
          {saveLabel === null ? null : (
            <p className={styles.saveStatus} role={saveStatus === "failed" ? "alert" : undefined}>
              {saveLabel}
            </p>
          )}
        </div>
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
            <PlantingToolTab
              current={currentTool === "crop-profit"}
              href={profitHref}
              label={copy.frame.profitTab}
              onSelect={onSelectTool === undefined ? undefined : () => onSelectTool("crop-profit")}
            />
            <PlantingToolTab
              current={currentTool === "crop-growth"}
              href={growthHref}
              label={copy.frame.growthTab}
              onSelect={onSelectTool === undefined ? undefined : () => onSelectTool("crop-growth")}
            />
          </div>
          <div className={styles.workspace}>{children}</div>
        </div>
      </div>
    </article>
  );
}

function PlantingToolTab({
  current,
  href,
  label,
  onSelect,
}: Readonly<{
  current: boolean;
  href: string;
  label: string;
  onSelect: (() => void) | undefined;
}>) {
  const className = current ? "public-primary-cta" : "public-secondary-cta";

  if (onSelect === undefined) {
    return (
      <a aria-current={current ? "page" : undefined} className={className} href={href}>
        {label}
      </a>
    );
  }

  return (
    <button
      aria-current={current ? "page" : undefined}
      className={className}
      onClick={onSelect}
      type="button"
    >
      {label}
    </button>
  );
}
