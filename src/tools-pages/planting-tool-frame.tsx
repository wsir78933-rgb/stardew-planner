import type { MouseEvent, ReactNode } from "react";
import type { PublicLocale } from "../i18n/public-locale";
import { getToolsPageCopy } from "../i18n/tools-page-copy";
import {
  createCropGrowthToolHref,
  createCropProfitHref,
} from "./planting-tool-href";
import { SimpleHero } from "./simple-hero";
import { PlantingToolGuide } from "./planting-tool-guide";
import styles from "./tools-page.module.css";

export type PlantingToolId = "crop-profit" | "crop-growth";

type PlantingToolFrameProperties = Readonly<{
  locale: PublicLocale;
  currentTool: PlantingToolId;
  documentHeading: boolean;
  title: string;
  saveStatus: "empty" | "saved" | "failed";
  onSelectTool?: (tool: PlantingToolId) => void;
  children: ReactNode;
}>;

function requirePlantingToolDocumentHeading(documentHeading: unknown): boolean {
  if (typeof documentHeading !== "boolean") {
    throw new Error(
      `Cannot render PlantingToolFrame: documentHeading=${JSON.stringify(documentHeading)} must be a boolean.`,
    );
  }

  return documentHeading;
}

export function PlantingToolFrame({
  locale,
  currentTool,
  documentHeading,
  title,
  saveStatus,
  onSelectTool,
  children,
}: PlantingToolFrameProperties) {
  const heroIsDocumentHeading = requirePlantingToolDocumentHeading(documentHeading);
  const copy = getToolsPageCopy(locale);
  const profitHref = createCropProfitHref(locale);
  const growthHref = createCropGrowthToolHref(locale);
  const heroCopy = currentTool === "crop-profit" ? copy.profit.hero : copy.growth.hero;
  const calculatorId = `${currentTool}-calculator`;
  const heroTitleId = `${currentTool}-hero-title`;
  const saveLabel =
    saveStatus === "failed" ? copy.frame.saveFailed : saveStatus === "saved" ? copy.frame.saved : null;

  return (
    <article className={styles.toolsPage}>
      <SimpleHero
        actionHref={`#${calculatorId}`}
        copy={heroCopy}
        documentHeading={heroIsDocumentHeading}
        locale={locale}
        titleId={heroTitleId}
      />
      <section aria-label={title} className={styles.toolArea}>
        <header className={styles.pageHeader}>
          <p className="public-breadcrumbs">{copy.frame.breadcrumb}</p>
          {saveLabel === null ? null : (
            <p className={styles.saveStatus} role={saveStatus === "failed" ? "alert" : undefined}>
              {saveLabel}
            </p>
          )}
        </header>
        <div className={styles.frame}>
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
            <div className={styles.workspace} id={calculatorId} tabIndex={-1}>
              {children}
            </div>
          </div>
        </div>
      </section>
      <PlantingToolGuide currentTool={currentTool} locale={locale} />
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

  return (
    <a
      aria-current={current ? "page" : undefined}
      className={className}
      href={href}
      onClick={(event) => handlePlantingToolTabClick(event, onSelect)}
    >
      {label}
    </a>
  );
}

function handlePlantingToolTabClick(
  event: MouseEvent<HTMLAnchorElement>,
  onSelect: (() => void) | undefined,
): void {
  if (
    onSelect === undefined ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  event.preventDefault();
  onSelect();
}
