"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { subscribeToEditorInteractivePerformanceMark } from "../performance/subscribe-to-editor-interactive-performance-mark";
import { isPlannerEntryPathname } from "../seo/planner-entry-pathname";
import { SiteAnalyticsScripts } from "./site-analytics-scripts";

export function PublicSiteAnalytics() {
  const pathname = usePathname();

  if (!isPlannerEntryPathname(pathname)) {
    return <SiteAnalyticsScripts />;
  }

  return <PlannerEntrySiteAnalytics />;
}

function PlannerEntrySiteAnalytics() {
  const [shouldLoadSiteAnalytics, setShouldLoadSiteAnalytics] = useState(false);

  useEffect(() => {
    return subscribeToEditorInteractivePerformanceMark(
      () => {
        setShouldLoadSiteAnalytics(true);
      },
      {
        PerformanceObserverConstructor: PerformanceObserver,
        performanceTimeline: performance,
      },
    );
  }, []);

  if (!shouldLoadSiteAnalytics) {
    return null;
  }

  return <SiteAnalyticsScripts />;
}
