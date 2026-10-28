import { JsonLdScript } from "../../../src/components/json-ld-script";
import { LegalPageContent } from "../../../src/components/legal-page-content";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { getLocalizedPublicPath } from "../../../src/i18n/public-route-registry";
import { getLegalPageCopy } from "../../../src/legal/legal-page-copy";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";
import { createWebPageStructuredData } from "../../../src/seo/page-structured-data";

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
      <JsonLdScript
        structuredData={createWebPageStructuredData({
          locale: "zh-CN",
          name: privacyPageCopy.title,
          description: privacyPageCopy.description,
          pathname: getLocalizedPublicPath("zh-CN", "/privacy"),
        })}
      />
      <LegalPageContent legalPageCopy={privacyPageCopy} />
    </PublicPageShell>
  );
}
