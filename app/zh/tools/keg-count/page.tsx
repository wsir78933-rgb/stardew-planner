import type { Metadata } from "next";
import { PublicPageShell } from "../../../../src/components/public-page-shell";
import { getPlanningToolRouteCopy } from "../../../../src/i18n/planning-tool-route-copy";
import { createPublicPageMetadata } from "../../../../src/seo/page-metadata";
import { getPlanningToolPath } from "../../../../src/tools-pages/planning-tool-definition";
import { KegCountPage } from "../../../../src/tools-pages/keg-count/keg-count-page";

const toolId = "keg-count";
const locale = "zh-CN";
const copy = getPlanningToolRouteCopy(locale, toolId);

export const metadata: Metadata = createPublicPageMetadata({
  locale,
  canonicalPath: getPlanningToolPath(toolId),
  title: copy.metaTitle,
  description: copy.metaDescription,
});

export default function Page() {
  return (
    <PublicPageShell canonicalPath={getPlanningToolPath(toolId)} locale={locale}>
      <KegCountPage locale={locale} />
    </PublicPageShell>
  );
}
