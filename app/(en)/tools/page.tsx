import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { getLocalizedPublicPath } from "../../../src/i18n/public-route-registry";
import { getToolsPageCopy } from "../../../src/i18n/tools-page-copy";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";
import { createWebApplicationStructuredData } from "../../../src/seo/page-structured-data";
import { ToolsHomePage } from "../../../src/tools-pages/tools-home-page";

const toolsPageCopy = getToolsPageCopy("en");
const canonicalPath = "/tools";

export const metadata: Metadata = createPublicPageMetadata({
  locale: "en",
  canonicalPath,
  title: toolsPageCopy.home.metaTitle,
  description: toolsPageCopy.home.metaDescription,
});

export default function ToolsPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale="en">
      <JsonLdScript
        structuredData={createWebApplicationStructuredData({
          locale: "en",
          name: toolsPageCopy.home.metaTitle,
          description: toolsPageCopy.home.metaDescription,
          pathname: getLocalizedPublicPath("en", canonicalPath),
        })}
      />
      <ToolsHomePage locale="en" />
    </PublicPageShell>
  );
}
