"use client";

import type { ReactNode } from "react";
import { Languages, Map, Newspaper } from "lucide-react";
import { Dock, DockIconButton } from "@/components/ui/dock";
import type { HomepageLocale } from "@/src/homepage/homepage-locale";
import type { HomepageLocaleHrefByLocale } from "@/src/homepage/homepage-navigation-url";
import { HomepageLocaleSwitcher } from "./homepage-locale-switcher";
import { HomepageLocaleSwitcherWithBrowserNavigation } from "./homepage-locale-switcher-with-browser-navigation";

export type SiteNavigationDockSurface = "homepage" | "public";

export type SiteNavigationDockProps = Readonly<{
  blogHref: string;
  blogLabel: string;
  brandHref: string;
  brandLabel: string;
  currentLocale: HomepageLocale;
  languageLabel: string;
  languageMode: "browser" | "static";
  localeHrefByLocale?: HomepageLocaleHrefByLocale;
  languageSwitcher?: ReactNode;
  plannerHref: string;
  plannerLabel: string;
  surface: SiteNavigationDockSurface;
}>;

function requireSiteNavigationDockNonEmptyString(
  fieldName: string,
  fieldValue: unknown,
): string {
  if (typeof fieldValue !== "string" || fieldValue.trim().length === 0) {
    throw new TypeError(
      `SiteNavigationDock ${fieldName} must be a non-empty string; received ${JSON.stringify(fieldValue)}.`,
    );
  }

  return fieldValue;
}

function renderSiteNavigationLanguageSwitcher(input: Readonly<{
  currentLocale: HomepageLocale;
  languageLabel: string;
  languageMode: "browser" | "static";
  languageSwitcher: ReactNode;
  localeHrefByLocale: HomepageLocaleHrefByLocale | undefined;
}>): ReactNode {
  if (input.languageSwitcher !== undefined) {
    return input.languageSwitcher;
  }

  if (input.languageMode === "browser") {
    return (
      <HomepageLocaleSwitcherWithBrowserNavigation
        currentLocale={input.currentLocale}
        label={input.languageLabel}
      />
    );
  }

  if (input.localeHrefByLocale === undefined) {
    throw new TypeError(
      "SiteNavigationDock localeHrefByLocale is required when languageMode is static; received undefined.",
    );
  }

  return (
    <HomepageLocaleSwitcher
      icon={Languages}
      label={input.languageLabel}
      localeHrefByLocale={input.localeHrefByLocale}
    />
  );
}

export function SiteNavigationDock({
  blogHref,
  blogLabel,
  brandHref,
  brandLabel,
  currentLocale,
  languageLabel,
  languageMode,
  languageSwitcher,
  localeHrefByLocale,
  plannerHref,
  plannerLabel,
  surface,
}: SiteNavigationDockProps) {
  const resolvedBrandHref = requireSiteNavigationDockNonEmptyString(
    "brandHref",
    brandHref,
  );
  const resolvedBrandLabel = requireSiteNavigationDockNonEmptyString(
    "brandLabel",
    brandLabel,
  );
  const resolvedBlogHref = requireSiteNavigationDockNonEmptyString(
    "blogHref",
    blogHref,
  );
  const resolvedBlogLabel = requireSiteNavigationDockNonEmptyString(
    "blogLabel",
    blogLabel,
  );
  const resolvedPlannerHref = requireSiteNavigationDockNonEmptyString(
    "plannerHref",
    plannerHref,
  );
  const resolvedPlannerLabel = requireSiteNavigationDockNonEmptyString(
    "plannerLabel",
    plannerLabel,
  );
  const resolvedLanguageLabel = requireSiteNavigationDockNonEmptyString(
    "languageLabel",
    languageLabel,
  );
  const isHomepageSurface = surface === "homepage";

  return (
    <nav aria-label={resolvedBrandLabel}>
      <a
        className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background/90 px-3 py-2 text-sm font-bold shadow-sm backdrop-blur-lg"
        data-homepage-brand={isHomepageSurface ? true : undefined}
        data-public-page-brand={isHomepageSurface ? undefined : true}
        href={resolvedBrandHref}
      >
        <img
          alt=""
          className="size-7 rounded-md"
          height={28}
          src="/favicon.png"
          width={28}
        />
        <span>{resolvedBrandLabel}</span>
      </a>
      <Dock>
        <div
          key="site-dock-links"
          data-homepage-navigation-links={isHomepageSurface ? true : undefined}
          data-public-page-navigation-links={
            isHomepageSurface ? undefined : true
          }
        >
          <DockIconButton
            href={resolvedBlogHref}
            icon={Newspaper}
            label={resolvedBlogLabel}
          />
        </div>
        <div
          key="site-dock-actions"
          data-homepage-header-actions={isHomepageSurface ? true : undefined}
          data-public-page-header-actions={isHomepageSurface ? undefined : true}
        >
          <div key="site-dock-language" className="contents">
            {renderSiteNavigationLanguageSwitcher({
              currentLocale,
              languageLabel: resolvedLanguageLabel,
              languageMode,
              languageSwitcher,
              localeHrefByLocale,
            })}
          </div>
          <DockIconButton
            key="site-dock-planner"
            data-homepage-header-action={isHomepageSurface ? true : undefined}
            data-public-page-header-action={
              isHomepageSurface ? undefined : true
            }
            href={resolvedPlannerHref}
            icon={Map}
            label={resolvedPlannerLabel}
          />
        </div>
      </Dock>
    </nav>
  );
}
