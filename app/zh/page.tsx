import { JsonLdScript } from "../../src/components/json-ld-script";
import { PlannerRouteEntry } from "../../src/components/planner-route-entry";
import { createPageMetadata } from "../../src/i18n/page-metadata";
import { createPlannerWebApplicationStructuredData } from "../../src/i18n/page-structured-data";

export const metadata = createPageMetadata({
  locale: "zh-CN",
  canonicalPath: "/",
  titleKey: "seo.planner.title",
  descriptionKey: "seo.planner.description",
});

export default function ChinesePlannerPage() {
  return (
    <>
      <JsonLdScript
        structuredData={createPlannerWebApplicationStructuredData({
          locale: "zh-CN",
          canonicalPath: "/",
          titleKey: "seo.planner.title",
          descriptionKey: "seo.planner.description",
        })}
      />
      <PlannerRouteEntry locale="zh-CN" />
    </>
  );
}
