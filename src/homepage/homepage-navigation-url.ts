import { getHomepageDisplayPath } from "../i18n/public-route-registry";
import { getPlannerMapIdFromSearch } from "../maps/planner-map-query";
import {
  HOMEPAGE_LOCALES,
  isHomepageLocale,
  type HomepageLocale,
} from "./homepage-locale";

export type HomepageLocaleHrefByLocale = Readonly<Record<HomepageLocale, string>>;

export type HomepageNavigationUrls = Readonly<{
  localeHrefByLocale: HomepageLocaleHrefByLocale;
  plannerHref: string;
}>;

function readPreservedHomepageSuffix(hash: string, search: string): string {
  const plannerMapId = getPlannerMapIdFromSearch(search);
  const supportedNavigationParameters = new URLSearchParams();
  if (plannerMapId !== null) {
    supportedNavigationParameters.set("farmType", plannerMapId);
  }
  const serializedNavigationParameters = supportedNavigationParameters.toString();
  const supportedNavigationSearch = serializedNavigationParameters.length === 0
    ? ""
    : `?${serializedNavigationParameters}`;
  const editorHash = hash === "#planner" ? "#planner" : "";
  return `${supportedNavigationSearch}${editorHash}`;
}

export function createHomepageNavigationUrls(input: Readonly<{
  currentLocale: HomepageLocale;
  hash: string;
  search: string;
}>): HomepageNavigationUrls {
  if (!isHomepageLocale(input.currentLocale)) {
    throw new Error(
      `Unsupported homepage locale. Received: ${JSON.stringify(input.currentLocale)}.`,
    );
  }

  const preservedSuffix = readPreservedHomepageSuffix(input.hash, input.search);
  const localeHrefByLocale = {
    en: `${getHomepageDisplayPath("en")}${preservedSuffix}`,
    "zh-CN": `${getHomepageDisplayPath("zh-CN")}${preservedSuffix}`,
    ja: `${getHomepageDisplayPath("ja")}${preservedSuffix}`,
    ru: `${getHomepageDisplayPath("ru")}${preservedSuffix}`,
  } as const satisfies HomepageLocaleHrefByLocale;

  if (Object.keys(localeHrefByLocale).length !== HOMEPAGE_LOCALES.length) {
    throw new Error(
      `Homepage navigation is missing a locale href. Expected ${JSON.stringify(HOMEPAGE_LOCALES)}.`,
    );
  }

  return {
    localeHrefByLocale,
    plannerHref: "#planner",
  };
}
