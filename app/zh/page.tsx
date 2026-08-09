import { JsonLdScript } from "../../src/components/json-ld-script";
import { PlannerHomepage } from "../../src/components/planner-homepage";
import { getPublicPageCopy } from "../../src/i18n/public-page-content";
import { getLocalizedPublicPath } from "../../src/i18n/public-route-registry";
import { createPublicPageMetadata } from "../../src/seo/page-metadata";
import { createWebApplicationStructuredData } from "../../src/seo/page-structured-data";

const pageCopy = getPublicPageCopy("zh-CN");

export const metadata = createPublicPageMetadata({
  locale: "zh-CN",
  canonicalPath: "/",
  title: pageCopy.plannerTitle,
  description: pageCopy.plannerDescription,
});

export default function ChinesePlannerPage() {
  return (
    <>
      <PlannerHomepage locale="zh-CN" />
      <JsonLdScript
        structuredData={createWebApplicationStructuredData({
          name: pageCopy.plannerTitle,
          description: pageCopy.plannerDescription,
          pathname: getLocalizedPublicPath("zh-CN", "/"),
        })}
      />
    </>
  );
}
