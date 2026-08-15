"use client";

import { ReactPlannerHost } from "./react-planner-host";
import type { HomepageLocale } from "../homepage/homepage-locale";

export function HomepagePlannerWorkspace({ locale }: Readonly<{ locale: HomepageLocale }>) {
  return (
    <section data-homepage-product-stage data-homepage-workspace id="planner">
      <ReactPlannerHost locale={locale} />
    </section>
  );
}
