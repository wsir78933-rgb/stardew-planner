import { JsonLdScript } from "../../../src/components/json-ld-script";
import { ModMapCardGrid } from "../../../src/components/mod-map-card-grid";
import { PublicPageLayout } from "../../../src/components/public-page-layout";
import { createPageMetadata } from "../../../src/i18n/page-metadata";
import { createCollectionPageStructuredData } from "../../../src/i18n/page-structured-data";
import { translate } from "../../../src/i18n/messages";

export const metadata = createPageMetadata({
  locale: "zh-CN",
  canonicalPath: "/mods",
  titleKey: "seo.mods.title",
  descriptionKey: "seo.mods.description",
});

export default function ChineseModsPage() {
  return (
    <PublicPageLayout canonicalPath="/mods" locale="zh-CN">
      <JsonLdScript
        structuredData={createCollectionPageStructuredData({
          locale: "zh-CN",
          canonicalPath: "/mods",
          titleKey: "seo.mods.title",
          descriptionKey: "seo.mods.description",
        })}
      />
      <h1>{translate("zh-CN", "public.navigation.mods")}</h1>
      <ModMapCardGrid locale="zh-CN" />
    </PublicPageLayout>
  );
}
