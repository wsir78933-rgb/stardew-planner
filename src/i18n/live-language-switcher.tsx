"use client";

import { useEffect, useState } from "react";
import {
  assertCanonicalPublicPath,
} from "./canonical-public-routes";
import { LanguageSwitcher } from "./language-switcher";
import type { SiteLocale } from "./locales";

type LiveLanguageSwitcherProperties = Readonly<{
  locale: SiteLocale;
  canonicalPath: string;
  initialSearch?: string;
  initialHash?: string;
}>;

type BrowserLocationState = Readonly<{
  search: string;
  hash: string;
}>;

export function LiveLanguageSwitcher({
  locale,
  canonicalPath,
  initialSearch = "",
  initialHash = "",
}: LiveLanguageSwitcherProperties) {
  assertCanonicalPublicPath(canonicalPath);
  const [browserLocation, setBrowserLocation] = useState<BrowserLocationState>({
    search: initialSearch,
    hash: initialHash,
  });

  useEffect(() => {
    function syncBrowserLocation(): void {
      setBrowserLocation({
        search: window.location.search,
        hash: window.location.hash,
      });
    }

    syncBrowserLocation();
    window.addEventListener("popstate", syncBrowserLocation);
    window.addEventListener("hashchange", syncBrowserLocation);

    return () => {
      window.removeEventListener("popstate", syncBrowserLocation);
      window.removeEventListener("hashchange", syncBrowserLocation);
    };
  }, []);

  return (
    <LanguageSwitcher
      canonicalPath={canonicalPath}
      hash={browserLocation.hash}
      locale={locale}
      search={browserLocation.search}
    />
  );
}
