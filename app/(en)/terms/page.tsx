import { JsonLdScript } from "../../../src/components/json-ld-script";
import { LegalPageContent } from "../../../src/components/legal-page-content";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { getLocalizedPublicPath } from "../../../src/i18n/public-route-registry";
import { getLegalPageCopy } from "../../../src/legal/legal-page-copy";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";
import { createWebPageStructuredData } from "../../../src/seo/page-structured-data";

const termsPageCopy = getLegalPageCopy("en", "terms");

export const metadata = createPublicPageMetadata({
  locale: "en",
  canonicalPath: "/terms",
  title: termsPageCopy.title,
  description: termsPageCopy.description,
});

export default function TermsPage() {
  return (
    <PublicPageShell canonicalPath="/terms" locale="en">
      <JsonLdScript
        structuredData={createWebPageStructuredData({
          locale: "en",
          name: termsPageCopy.title,
          description: termsPageCopy.description,
          pathname: getLocalizedPublicPath("en", "/terms"),
        })}
      />
      <LegalPageContent legalPageCopy={termsPageCopy} />
    </PublicPageShell>
  );
}
