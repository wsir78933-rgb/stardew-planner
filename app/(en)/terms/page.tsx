import { LegalContent } from "../../../src/components/legal-content";
import { PublicPageLayout } from "../../../src/components/public-page-layout";
import { createPageMetadata } from "../../../src/i18n/page-metadata";

export const metadata = createPageMetadata({
  locale: "en",
  canonicalPath: "/terms",
  titleKey: "seo.terms.title",
  descriptionKey: "seo.terms.description",
});

export default function EnglishTermsPage() {
  return (
    <PublicPageLayout canonicalPath="/terms" locale="en">
      <LegalContent locale="en" page="terms" />
    </PublicPageLayout>
  );
}
