"use client";

import { useEffect, useState } from "react";
import type { HomepageLocale } from "../homepage/homepage-locale";
import { createHomepageNavigationUrls } from "../homepage/homepage-navigation-url";
import { HomepageLocaleSwitcher } from "./homepage-locale-switcher";

type HomepageLocaleSwitcherWithBrowserNavigationProps = Readonly<{
  currentLocale: HomepageLocale;
  label: string;
}>;

export function HomepageLocaleSwitcherWithBrowserNavigation({
  currentLocale,
  label,
}: HomepageLocaleSwitcherWithBrowserNavigationProps) {
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

  const { localeHrefByLocale } = createHomepageNavigationUrls({
    currentLocale,
    ...browserNavigationLocation,
  });

  return (
    <HomepageLocaleSwitcher
      label={label}
      localeHrefByLocale={localeHrefByLocale}
    />
  );
}
