import { LegalContent } from "../../../src/components/legal-content";
import { PublicPageLayout } from "../../../src/components/public-page-layout";
import { createPageMetadata } from "../../../src/i18n/page-metadata";

export const metadata = createPageMetadata({
  locale: "zh-CN",
  canonicalPath: "/privacy",
  titleKey: "seo.privacy.title",
  descriptionKey: "seo.privacy.description",
});

export default function ChinesePrivacyPage() {
  return (
    <PublicPageLayout canonicalPath="/privacy" locale="zh-CN">
      <LegalContent locale="zh-CN" page="privacy" />
    </PublicPageLayout>
  );
}
