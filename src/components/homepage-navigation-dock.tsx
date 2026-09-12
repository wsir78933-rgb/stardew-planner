"use client";

import type { ReactNode } from "react";
import type { HomepageCopy } from "@/src/homepage/homepage-copy";
import type { HomepageLocale } from "@/src/homepage/homepage-locale";
import type { HomepageLocaleHrefByLocale } from "@/src/homepage/homepage-navigation-url";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import { SiteNavigationDock } from "./site-navigation-dock";

const HOMEPAGE_NAVIGATION_COPY_FIELD_NAMES = [
  "productName",
  "capabilitiesLabel",
  "faqLabel",
  "blogLabel",
  "plannerActionLabel",
  "languageLabel",
] as const;

type HomepageNavigationDockProps = Readonly<{
  copy: HomepageCopy;
  currentLocale: HomepageLocale;
  localeHrefByLocale: HomepageLocaleHrefByLocale;
  localeSwitcher?: ReactNode;
  plannerHref: string;
}>;

function requireHomepageDockNonEmptyString(
  fieldName: string,
  fieldValue: unknown,
): string {
  if (typeof fieldValue !== "string" || fieldValue.length === 0) {
    throw new TypeError(
      `HomepageNavigationDock ${fieldName} must be a non-empty string; received ${JSON.stringify(fieldValue)}.`,
    );
  }

  return fieldValue;
}

function requireHomepageNavigationCopy(
  navigationCopy: HomepageCopy["navigation"],
): HomepageCopy["navigation"] {
  if (navigationCopy === null || typeof navigationCopy !== "object") {
    throw new TypeError(
      `HomepageNavigationDock copy.navigation must be an object; received ${JSON.stringify(navigationCopy)}.`,
    );
  }

  for (const fieldName of HOMEPAGE_NAVIGATION_COPY_FIELD_NAMES) {
    requireHomepageDockNonEmptyString(
      `copy.navigation.${fieldName}`,
      navigationCopy[fieldName],
    );
  }

  return navigationCopy;
}

export function HomepageNavigationDock({
  copy,
  currentLocale,
  localeSwitcher,
  plannerHref,
}: HomepageNavigationDockProps) {
  const navigationCopy = requireHomepageNavigationCopy(copy.navigation);
  const resolvedPlannerHref = requireHomepageDockNonEmptyString(
    "plannerHref",
    plannerHref,
  );

  return (
    <SiteNavigationDock
      blogHref={getLocalizedPublicPath(currentLocale, "/blog")}
      blogLabel={navigationCopy.blogLabel}
      brandHref={getLocalizedPublicPath(currentLocale, "/")}
      brandLabel={navigationCopy.productName}
      currentLocale={currentLocale}
      languageLabel={navigationCopy.languageLabel}
      languageMode="browser"
      languageSwitcher={localeSwitcher}
      plannerHref={resolvedPlannerHref}
      plannerLabel={navigationCopy.plannerActionLabel}
      surface="homepage"
    />
  );
}
