import type { Metadata } from "next";
import { PublicPageShell } from "../../../../src/components/public-page-shell";
import { getPlanningToolRouteCopy } from "../../../../src/i18n/planning-tool-route-copy";
import { createPublicPageMetadata } from "../../../../src/seo/page-metadata";
import { getPlanningToolPath } from "../../../../src/tools-pages/planning-tool-definition";
import { ProductionSchedulePage } from "../../../../src/tools-pages/production-schedule/production-schedule-page";

const toolId = "production-schedule";
const locale = "en";
const copy = getPlanningToolRouteCopy(locale, toolId);

export const metadata: Metadata = createPublicPageMetadata({
  locale,
  canonicalPath: getPlanningToolPath(toolId),
  title: copy.metaTitle,
  description: copy.metaDescription,
});

export default function EnglishProductionSchedulePage() {
  return (
    <PublicPageShell canonicalPath={getPlanningToolPath(toolId)} locale={locale}>
      <ProductionSchedulePage locale={locale} />
    </PublicPageShell>
  );
}
