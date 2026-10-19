import { getPlannerMapIdFromSearch } from "../maps/planner-map-query";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import {
  HOMEPAGE_LOCALES,
  type HomepageLocale,
} from "./homepage-locale";

export type HomepageLocaleHrefByLocale = Readonly<Record<HomepageLocale, string>>;

export type HomepageNavigationUrls = Readonly<{
  localeHrefByLocale: HomepageLocaleHrefByLocale;
  plannerHref: string;
}>;

export function createHomepageNavigationUrls(input: Readonly<{
  currentLocale: HomepageLocale;
  hash: string;
  search: string;
}>): HomepageNavigationUrls {
  const plannerMapId = getPlannerMapIdFromSearch(input.search);
  const supportedNavigationParameters = new URLSearchParams();
  if (plannerMapId !== null) {
    supportedNavigationParameters.set("farmType", plannerMapId);
  }
  const serializedNavigationParameters = supportedNavigationParameters.toString();
  const supportedNavigationSearch = serializedNavigationParameters.length === 0
    ? ""
    : `?${serializedNavigationParameters}`;
  const editorHash = input.hash === "#planner" ? "#planner" : "";
  const localeHrefByLocale = Object.fromEntries(
    HOMEPAGE_LOCALES.map((locale) => [
      locale,
      `${readHomepageLocaleRootPath(locale)}${supportedNavigationSearch}${editorHash}`,
    ]),
  ) as Record<HomepageLocale, string>;

  return {
    localeHrefByLocale,
    plannerHref: "#planner",
  };
}

function readHomepageLocaleRootPath(locale: HomepageLocale): string {
  if (locale === "ja") {
    return "/ja";
  }

  if (locale === "en" || locale === "zh-CN") {
    return getLocalizedPublicPath(locale, "/");
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot build homepage navigation href because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}
