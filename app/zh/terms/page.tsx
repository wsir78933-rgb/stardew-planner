import { LegalPageContent } from "../../../src/components/legal-page-content";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { getLegalPageCopy } from "../../../src/legal/legal-page-copy";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const termsPageCopy = getLegalPageCopy("zh-CN", "terms");

export const metadata = createPublicPageMetadata({
  locale: "zh-CN",
  canonicalPath: "/terms",
  title: termsPageCopy.title,
  description: termsPageCopy.description,
});

export default function ChineseTermsPage() {
  return (
    <PublicPageShell canonicalPath="/terms" locale="zh-CN">
      <LegalPageContent legalPageCopy={termsPageCopy} />
    </PublicPageShell>
  );
}
