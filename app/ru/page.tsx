import { JsonLdScript } from "../../src/components/json-ld-script";
import { PlannerHomepage } from "../../src/components/planner-homepage";
import { createRussianHomepageMetadata } from "../../src/seo/page-metadata";
import { createRussianHomepageWebApplicationStructuredData } from "../../src/seo/page-structured-data";

const russianHomepageTitle =
  "Планировщик фермы Stardew Valley — бесплатно онлайн";
const russianHomepageDescription =
  "Планировщик для Stardew Valley: создавайте планировку фермы онлайн. 8 типов ферм, здания и посевы, смена сезонов, зоны действия и импорт сохранений.";

export const metadata = createRussianHomepageMetadata({
  title: russianHomepageTitle,
  description: russianHomepageDescription,
});

export default function RussianPlannerPage() {
  return (
    <>
      <PlannerHomepage locale="ru" />
      <JsonLdScript
        structuredData={createRussianHomepageWebApplicationStructuredData({
          name: russianHomepageTitle,
          description: russianHomepageDescription,
        })}
      />
    </>
  );
}
