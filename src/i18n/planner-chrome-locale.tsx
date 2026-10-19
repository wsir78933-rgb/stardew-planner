"use client";

import { createContext, useContext, type ReactElement, type ReactNode } from "react";
import {
  assertPlannerChromeLocale,
  type PlannerChromeLocale,
} from "@/src/homepage/homepage-locale";

const PlannerChromeLocaleContext = createContext<PlannerChromeLocale>("en");

export function PlannerChromeLocaleProvider({
  children,
  locale,
}: Readonly<{
  children: ReactNode;
  locale: PlannerChromeLocale;
}>): ReactElement {
  assertPlannerChromeLocale(locale);

  return (
    <PlannerChromeLocaleContext.Provider value={locale}>
      {children}
    </PlannerChromeLocaleContext.Provider>
  );
}

export function usePlannerChromeLocale(): PlannerChromeLocale {
  return useContext(PlannerChromeLocaleContext);
}
