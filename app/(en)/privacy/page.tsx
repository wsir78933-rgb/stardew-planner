import { LegalContent } from "../../../src/components/legal-content";
import { PublicPageLayout } from "../../../src/components/public-page-layout";
import { createPageMetadata } from "../../../src/i18n/page-metadata";

export const metadata = createPageMetadata({
  locale: "en",
  canonicalPath: "/privacy",
  titleKey: "seo.privacy.title",
  descriptionKey: "seo.privacy.description",
});

export default function EnglishPrivacyPage() {
  return (
    <PublicPageLayout canonicalPath="/privacy" locale="en">
      <LegalContent locale="en" page="privacy" />
    </PublicPageLayout>
  );
}
