"use client";

import { useEffect, useState } from "react";
import { homepageCopyByLocale } from "@/src/homepage/homepage-copy";
import {
  DEFAULT_HOMEPAGE_LOCALE,
  type HomepageLocale,
} from "@/src/homepage/homepage-locale";
import { HomepageContent } from "./homepage-content";
import { HomepagePlannerWorkspace } from "./homepage-planner-workspace";

export function PlannerHomepage() {
  const [homepageLocale, setHomepageLocale] = useState<HomepageLocale>(
    DEFAULT_HOMEPAGE_LOCALE,
  );

  const copy = homepageCopyByLocale[homepageLocale];

  useEffect(() => {
    document.documentElement.lang = homepageLocale;
  }, [homepageLocale]);

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
