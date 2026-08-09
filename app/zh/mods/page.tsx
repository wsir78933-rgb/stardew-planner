import { JsonLdScript } from "../../../src/components/json-ld-script";
import { ModMapCardGrid } from "../../../src/components/mod-map-card-grid";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { getPublicPageCopy } from "../../../src/i18n/public-page-content";
import { getLocalizedPublicPath } from "../../../src/i18n/public-route-registry";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";
import { createCollectionPageStructuredData } from "../../../src/seo/page-structured-data";

const pageCopy = getPublicPageCopy("zh-CN");

export const modsMetadata = createPublicPageMetadata({
  locale: "zh-CN",
  canonicalPath: "/mods",
  title: pageCopy.modsMetaTitle,
  description: pageCopy.modsDescription,
});

export const metadata = modsMetadata;

export default function ChineseModsPage() {
  return (
    <PublicPageShell canonicalPath="/mods" locale="zh-CN">
      <article className="public-page-content">
        <header className="public-page-header">
          <h1>{pageCopy.modsTitle}</h1>
          <p>{pageCopy.modsIntroduction}</p>
          <p className="public-note">{pageCopy.modsPlannerScope}</p>
        </header>
        <ModMapCardGrid locale="zh-CN" />
      </article>
      <JsonLdScript
        structuredData={createCollectionPageStructuredData({
          name: pageCopy.modsTitle,
          description: pageCopy.modsDescription,
          pathname: getLocalizedPublicPath("zh-CN", "/mods"),
        })}
      />
    </PublicPageShell>
  );
}
