"use client";

import { useEffect, useState } from "react";
import { LiveLanguageSwitcher } from "../i18n/live-language-switcher";
import { getPlannerMapIdFromSearch } from "../maps/planner-map-query";
import type { SiteLocale } from "../i18n/locales";
import { PlannerWorkspace } from "./planner-workspace";

type PlannerRouteEntryProperties = Readonly<{
  locale: SiteLocale;
}>;

export function PlannerRouteEntry({ locale }: PlannerRouteEntryProperties) {
  const [initialMapId, setInitialMapId] = useState<string | null>(null);

  useEffect(() => {
    setInitialMapId(getPlannerMapIdFromSearch(window.location.search));
  }, []);

  return (
    <>
      <LiveLanguageSwitcher canonicalPath="/" locale={locale} />
      <PlannerWorkspace
        initialMapId={initialMapId ?? undefined}
        key={initialMapId ?? "default-map"}
        locale={locale}
      />
    </>
  );
}
