import { ChinesePlannerIntroduction } from "../../src/components/chinese-planner-introduction";
import { JsonLdScript } from "../../src/components/json-ld-script";
import { PublicPageShell } from "../../src/components/public-page-shell";
import { getPublicPageCopy } from "../../src/i18n/public-page-content";
import { getLocalizedPublicPath } from "../../src/i18n/public-route-registry";
import { createPublicPageMetadata } from "../../src/seo/page-metadata";
import { createWebApplicationStructuredData } from "../../src/seo/page-structured-data";

const pageCopy = getPublicPageCopy("zh-CN");

export const metadata = createPublicPageMetadata({
  locale: "zh-CN",
  pathname: "/",
  title: pageCopy.plannerTitle,
  description: pageCopy.plannerDescription,
});

export default function ChinesePlannerPage() {
  return (
    <PublicPageShell canonicalPath="/" locale="zh-CN">
      <ChinesePlannerIntroduction />
      <JsonLdScript
        structuredData={createWebApplicationStructuredData({
          name: pageCopy.plannerTitle,
          description: pageCopy.plannerDescription,
          pathname: getLocalizedPublicPath("zh-CN", "/"),
        })}
      />
    </PublicPageShell>
  );
}
