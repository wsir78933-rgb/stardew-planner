import { LegalPageContent } from "../../../src/components/legal-page-content";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { getLegalPageCopy } from "../../../src/legal/legal-page-copy";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

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
      <LegalPageContent legalPageCopy={privacyPageCopy} />
    </PublicPageShell>
  );
}
