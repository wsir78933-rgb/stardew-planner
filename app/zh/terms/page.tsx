import { LegalContent } from "../../../src/components/legal-content";
import { PublicPageLayout } from "../../../src/components/public-page-layout";
import { createPageMetadata } from "../../../src/i18n/page-metadata";

export const metadata = createPageMetadata({
  locale: "zh-CN",
  canonicalPath: "/terms",
  titleKey: "seo.terms.title",
  descriptionKey: "seo.terms.description",
});

export default function ChineseTermsPage() {
  return (
    <PublicPageLayout canonicalPath="/terms" locale="zh-CN">
      <LegalContent locale="zh-CN" page="terms" />
    </PublicPageLayout>
  );
}
