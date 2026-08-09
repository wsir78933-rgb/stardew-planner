"use client";

import { useEffect, useState } from "react";
import { homepageCopyByLocale } from "@/src/homepage/homepage-copy";
import type { HomepageLocale } from "@/src/homepage/homepage-locale";
import { createHomepageNavigationUrls } from "@/src/homepage/homepage-navigation-url";
import { HomepageContent } from "./homepage-content";
import { HomepagePlannerWorkspace } from "./homepage-planner-workspace";

type PlannerHomepageProps = Readonly<{
  locale: HomepageLocale;
}>;

export function PlannerHomepage({ locale }: PlannerHomepageProps) {
  const copy = homepageCopyByLocale[locale];
  const [browserNavigationLocation, setBrowserNavigationLocation] = useState({
    hash: "",
    search: "",
  });
  useEffect(() => {
    function synchronizeBrowserNavigationLocation(): void {
      setBrowserNavigationLocation({
        hash: window.location.hash,
        search: window.location.search,
      });
    }

    synchronizeBrowserNavigationLocation();
    window.addEventListener("hashchange", synchronizeBrowserNavigationLocation);
    window.addEventListener("popstate", synchronizeBrowserNavigationLocation);
    return () => {
      window.removeEventListener("hashchange", synchronizeBrowserNavigationLocation);
      window.removeEventListener("popstate", synchronizeBrowserNavigationLocation);
    };
  }, []);
  const navigationUrls = createHomepageNavigationUrls({
    currentLocale: locale,
    ...browserNavigationLocation,
  });

  return (
    <div data-homepage-shell>
      <HomepageContent
        copy={copy}
        currentLocale={locale}
        {...navigationUrls}
        plannerWorkspace={<HomepagePlannerWorkspace />}
      />
    </div>
  );
}
