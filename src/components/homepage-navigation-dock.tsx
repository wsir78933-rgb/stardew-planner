"use client";

import type { ReactNode } from "react";
import type { HomepageCopy } from "@/src/homepage/homepage-copy";
import {
  isHomepageDisplayLocale,
  type HomepageDisplayLocale,
} from "@/src/homepage/homepage-locale";
import type { HomepageLocaleHrefByLocale } from "@/src/homepage/homepage-navigation-url";
import {
  getHomepageDisplayPath,
  getLocalizedPublicPath,
} from "@/src/i18n/public-route-registry";
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
  currentLocale: HomepageDisplayLocale;
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

function readHomepageBlogPath(locale: HomepageDisplayLocale): string {
  if (locale === "ru") {
    return getLocalizedPublicPath("en", "/blog");
  }
  if (locale === "en" || locale === "zh-CN") {
    return getLocalizedPublicPath(locale, "/blog");
  }

  throw new TypeError(
    `Unsupported homepage navigation locale. Received: ${JSON.stringify(locale)}.`,
  );
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
  if (!isHomepageDisplayLocale(currentLocale)) {
    throw new TypeError(
      `HomepageNavigationDock currentLocale must be a homepage display locale. Received: ${JSON.stringify(currentLocale)}.`,
    );
  }

  const navigationCopy = requireHomepageNavigationCopy(copy.navigation);
  const resolvedPlannerHref = requireHomepageDockNonEmptyString(
    "plannerHref",
    plannerHref,
  );

  return (
    <SiteNavigationDock
      blogHref={readHomepageBlogPath(currentLocale)}
      blogLabel={navigationCopy.blogLabel}
      brandHref={getHomepageDisplayPath(currentLocale)}
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
