"use client";

import { useEffect, useState } from "react";
import { homepageCopyByLocale } from "@/src/homepage/homepage-copy";
import {
  DEFAULT_HOMEPAGE_LOCALE,
  getStoredHomepageLocale,
  saveHomepageLocale,
  type HomepageLocale,
} from "@/src/homepage/homepage-locale";
import { HomepageContent } from "./homepage-content";
import { HomepagePlannerWorkspace } from "./homepage-planner-workspace";

export function PlannerHomepage() {
  const [homepageLocale, setHomepageLocale] = useState<HomepageLocale>(
    DEFAULT_HOMEPAGE_LOCALE,
  );

  useEffect(() => {
    setHomepageLocale(getStoredHomepageLocale(window.localStorage));
  }, []);

  const copy = homepageCopyByLocale[homepageLocale];

  useEffect(() => {
    document.documentElement.lang = homepageLocale;
    document.title = copy.navigation.productName;
    saveHomepageLocale(window.localStorage, homepageLocale);
  }, [copy.navigation.productName, homepageLocale]);

  return (
    <div data-homepage-shell>
      <HomepageContent
        copy={copy}
        currentLocale={homepageLocale}
        onLocaleChange={setHomepageLocale}
        plannerWorkspace={<HomepagePlannerWorkspace />}
      />
    </div>
  );
}
