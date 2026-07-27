import type { SiteLocale } from "../i18n/locales";
import { ReferenceProjectMigrationError } from "../projects/reference-local-project-migration";

export function getLocalizedPlannerErrorMessage(
  locale: SiteLocale,
  caughtError: unknown,
): string | null {
  if (!(caughtError instanceof ReferenceProjectMigrationError)) {
    return null;
  }

  if (locale === "zh-CN") {
    return `无法迁移现有的本地规划方案。原始数据没有被修改。${caughtError.message}`;
  }

  return `Existing local plans could not be migrated. The original data was not changed. ${caughtError.message}`;
}
