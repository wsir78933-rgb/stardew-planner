import { JsonLdScript } from "../../../src/components/json-ld-script";
import { LegalPageContent } from "../../../src/components/legal-page-content";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { getLocalizedPublicPath } from "../../../src/i18n/public-route-registry";
import { getLegalPageCopy } from "../../../src/legal/legal-page-copy";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";
import { createWebPageStructuredData } from "../../../src/seo/page-structured-data";

const privacyPageCopy = getLegalPageCopy("en", "privacy");

export const metadata = createPublicPageMetadata({
  locale: "en",
  canonicalPath: "/privacy",
  title: privacyPageCopy.title,
  description: privacyPageCopy.description,
});

export default function PrivacyPage() {
  return (
    <PublicPageShell canonicalPath="/privacy" locale="en">
      <JsonLdScript
        structuredData={createWebPageStructuredData({
          locale: "en",
          name: privacyPageCopy.title,
          description: privacyPageCopy.description,
          pathname: getLocalizedPublicPath("en", "/privacy"),
        })}
      />
      <LegalPageContent legalPageCopy={privacyPageCopy} />
    </PublicPageShell>
  );
}
