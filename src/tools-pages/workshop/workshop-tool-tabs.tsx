import Link from "next/link";
import type { PublicLocale } from "../../i18n/public-locale";
import { getWorkshopToolCopy } from "../../i18n/workshop-tool-copy";
import styles from "./workshop-tool.module.css";

export type WorkshopToolTabId = "keg-count" | "materials-and-resin";

export function WorkshopToolTabs({
  locale,
  currentTool,
}: Readonly<{ locale: PublicLocale; currentTool: WorkshopToolTabId }>) {
  const navigationCopy = getWorkshopToolCopy(locale).navigation;
  const toolTabs: readonly Readonly<{ id: WorkshopToolTabId; label: string }>[] = [
    { id: "keg-count", label: navigationCopy.kegCapacity },
    { id: "materials-and-resin", label: navigationCopy.kegMaterials },
  ];

  return (
    <nav aria-label={navigationCopy.label} className={styles.toolNavigation}>
      {toolTabs.map((toolTab) => (
        <Link
          aria-current={toolTab.id === currentTool ? "page" : undefined}
          className={styles.toolTab}
          href={createWorkshopToolHref(locale, toolTab.id)}
          key={toolTab.id}
        >
          {toolTab.label}
        </Link>
      ))}
    </nav>
  );
}

function createWorkshopToolHref(locale: PublicLocale, toolId: WorkshopToolTabId): string {
  const path = `/tools/${toolId}`;
  if (locale === "en") {
    return path;
  }
  if (locale === "zh-CN") {
    return `/zh${path}`;
  }
  throw new Error(
    `Workshop tool route locale is unsupported. Received: ${JSON.stringify(locale)}.`,
  );
}
