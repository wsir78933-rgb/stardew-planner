import type { Metadata } from "next";
import { JsonLdScript } from "../../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../../src/components/public-page-shell";
import { getLocalizedPublicPath } from "../../../../src/i18n/public-route-registry";
import { getPlanningToolRouteCopy } from "../../../../src/i18n/planning-tool-route-copy";
import { createPublicPageMetadata } from "../../../../src/seo/page-metadata";
import { createWebApplicationStructuredData } from "../../../../src/seo/page-structured-data";
import { getPlanningToolPath } from "../../../../src/tools-pages/planning-tool-definition";
import { MaterialsAndResinPage } from "../../../../src/tools-pages/materials-and-resin/materials-and-resin-page";

const toolId = "materials-and-resin";
const locale = "en";
const copy = getPlanningToolRouteCopy(locale, toolId);
const canonicalPath = getPlanningToolPath(toolId);

export const metadata: Metadata = createPublicPageMetadata({
  locale,
  canonicalPath,
  title: copy.metaTitle,
  description: copy.metaDescription,
});

export default function Page() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <JsonLdScript
        structuredData={createWebApplicationStructuredData({
          locale,
          name: copy.metaTitle,
          description: copy.metaDescription,
          pathname: getLocalizedPublicPath("en", canonicalPath),
        })}
      />
      <MaterialsAndResinPage locale={locale} />
    </PublicPageShell>
  );
}
