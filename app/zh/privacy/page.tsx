import { LegalPageContent } from "../../../src/components/legal-page-content";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { getLegalPageCopy } from "../../../src/legal/legal-page-copy";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const privacyPageCopy = getLegalPageCopy("zh-CN", "privacy");

export const metadata = createPublicPageMetadata({
  locale: "zh-CN",
  canonicalPath: "/privacy",
  title: privacyPageCopy.title,
  description: privacyPageCopy.description,
});

export default function ChinesePrivacyPage() {
  return (
    <PublicPageShell canonicalPath="/privacy" locale="zh-CN">
      <LegalPageContent legalPageCopy={privacyPageCopy} />
    </PublicPageShell>
  );
}
