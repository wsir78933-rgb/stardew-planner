import { JsonLdScript } from "../../src/components/json-ld-script";
import { PlannerHomepage } from "../../src/components/planner-homepage";
import { createPublicPageMetadata } from "../../src/seo/page-metadata";
import { createWebApplicationStructuredData } from "../../src/seo/page-structured-data";

const plannerStructuredDataDescription =
  "Plan Stardew Valley farm layouts in your browser with an interactive map.";

const plannerRouteMetadataDescription =
  "Plan your Stardew Valley farm before building in-game. Choose from 8 farm types, place buildings and crops, switch seasons, check coverage, and import saves.";

export const metadata = createPublicPageMetadata({
  locale: "en",
  canonicalPath: "/",
  title: "Stardew Valley Planner – Free Online Farm Layout Tool",
  description: plannerRouteMetadataDescription,
});

export default function PlannerPage() {
  return (
    <>
      <PlannerHomepage locale="en" />
      <JsonLdScript
        structuredData={createWebApplicationStructuredData({
          name: "Stardew Valley Farm Planner",
          description: plannerStructuredDataDescription,
          pathname: "/",
        })}
      />
    </>
  );
}
