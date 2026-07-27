import { PlannerRouteEntry } from "../../src/components/planner-route-entry";
import { createPageMetadata } from "../../src/i18n/page-metadata";

export const metadata = createPageMetadata({
  locale: "en",
  canonicalPath: "/",
  titleKey: "seo.planner.title",
  descriptionKey: "seo.planner.description",
});

export default function EnglishPlannerPage() {
  return <PlannerRouteEntry locale="en" />;
}
