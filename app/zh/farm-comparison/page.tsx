import { FarmComparisonContent } from "../../../src/components/farm-comparison-content";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { getPublicPageCopy } from "../../../src/i18n/public-page-content";
import { getLocalizedPublicPath } from "../../../src/i18n/public-route-registry";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";
import { createArticleStructuredData } from "../../../src/seo/page-structured-data";

const pageCopy = getPublicPageCopy("zh-CN");

export const farmComparisonMetadata = createPublicPageMetadata({
  locale: "zh-CN",
  canonicalPath: "/farm-comparison",
  title: pageCopy.farmComparisonTitle,
  description: pageCopy.farmComparisonDescription,
  openGraphType: "article",
});

export const metadata = farmComparisonMetadata;

export default function ChineseFarmComparisonPage() {
  return (
    <PublicPageShell canonicalPath="/farm-comparison" locale="zh-CN">
      <article className="public-page-content">
        <header className="public-page-header">
          <h1>{pageCopy.farmComparisonTitle}</h1>
          <p>{pageCopy.farmComparisonDescription}</p>
        </header>
        <FarmComparisonContent locale="zh-CN" />
      </article>
      <JsonLdScript
        structuredData={createArticleStructuredData({
          headline: pageCopy.farmComparisonTitle,
          description: pageCopy.farmComparisonDescription,
          pathname: getLocalizedPublicPath("zh-CN", "/farm-comparison"),
        })}
      />
    </PublicPageShell>
  );
}
