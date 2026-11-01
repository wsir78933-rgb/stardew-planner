"use client";

import type { PlannerChromeLocale } from "@/src/homepage/homepage-locale";
import type { PlannerMap } from "../maps/map-catalog";
import { PlannerMapPicker } from "./planner-map-picker";

type ProjectMapInstancePanelProperties = Readonly<{
  locale?: PlannerChromeLocale;
  mapChoices: readonly PlannerMap[];
  onAddMap: (plannerMapId: string) => void;
}>;

export function ProjectMapInstancePanel({
  locale = "en",
  mapChoices,
  onAddMap,
}: ProjectMapInstancePanelProperties) {
  const addMapLabel = readAddMapLabel(locale);

  return (
    <section aria-label={addMapLabel} className="project-map-instance-panel">
      <PlannerMapPicker
        locale={locale}
        mapIdDataAttribute="data-project-add-map-id"
        maps={mapChoices}
        onMapSelect={onAddMap}
        selectedMapId={null}
      />
    </section>
  );
}

function readAddMapLabel(locale: PlannerChromeLocale): string {
  if (locale === "en" || locale === "zh") {
    return "Add map";
  }

  if (locale === "ja") {
    return "マップを追加";
  }

  if (locale === "ru") {
    return "Добавить карту";
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read project map picker label because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}
