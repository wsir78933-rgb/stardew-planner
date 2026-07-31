import { LegalPageContent } from "../../src/components/legal-page-content";
import { PublicPageShell } from "../../src/components/public-page-shell";
import { termsDocument } from "../../src/reference/legal-pages";
import { createPublicPageMetadata } from "../../src/seo/page-metadata";

export const termsMetadata = createPublicPageMetadata({
  pathname: "/terms",
  title: termsDocument.title,
  description:
    "Read the terms for this browser-local Stardew Valley farm planning tool.",
});

export const metadata = termsMetadata;

export default function TermsPage() {
  return (
    <PublicPageShell>
      <LegalPageContent document={termsDocument} />
    </PublicPageShell>
  );
}
