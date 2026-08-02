import { LegalPageContent } from "../../../src/components/legal-page-content";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { getLegalPageCopy } from "../../../src/legal/legal-page-copy";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

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
      <LegalPageContent legalPageCopy={termsPageCopy} />
    </PublicPageShell>
  );
}
