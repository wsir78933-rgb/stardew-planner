import { JsonLdScript } from "../src/components/json-ld-script";
import { PlannerHomepage } from "../src/components/planner-homepage";
import { createPublicPageMetadata } from "../src/seo/page-metadata";
import { createWebApplicationStructuredData } from "../src/seo/page-structured-data";

const plannerPageDescription =
  "Plan Stardew Valley farm layouts in your browser with an interactive map.";

export const metadata = createPublicPageMetadata({
  pathname: "/",
  title: "Stardew Valley Farm Planner",
  description: plannerPageDescription,
});

export default function PlannerPage() {
  return (
    <>
      <PlannerHomepage />
      <JsonLdScript
        structuredData={createWebApplicationStructuredData({
          name: "Stardew Valley Farm Planner",
          description: plannerPageDescription,
          pathname: "/",
        })}
      />
    </>
  );
}
