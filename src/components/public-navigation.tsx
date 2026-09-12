import { getPublicPageCopy } from "../i18n/public-page-content";
import type { PublicLocale } from "../i18n/public-locale";
import {
  getLocalizedPublicPath,
  type PublicCanonicalPath,
} from "../i18n/public-route-registry";
import { SiteNavigationDock } from "./site-navigation-dock";

type PublicNavigationProperties = Readonly<{
  locale: PublicLocale;
  canonicalPath: PublicCanonicalPath;
}>;

function createPublicPageHeaderHrefs(
  locale: PublicLocale,
  canonicalPath: PublicCanonicalPath,
) {
  const homepagePath = getLocalizedPublicPath(locale, "/");

  return {
    brandHref: homepagePath,
    blogHref: getLocalizedPublicPath(locale, "/blog"),
    plannerHref: `${homepagePath}#planner`,
    localeHrefByLocale: {
      en: getLocalizedPublicPath("en", canonicalPath),
      "zh-CN": getLocalizedPublicPath("zh-CN", canonicalPath),
    },
  };
}

export function PublicNavigation({
  locale,
  canonicalPath,
}: PublicNavigationProperties) {
  const pageCopy = getPublicPageCopy(locale);
  const headerHrefs = createPublicPageHeaderHrefs(locale, canonicalPath);

  return (
    <SiteNavigationDock
      blogHref={headerHrefs.blogHref}
      blogLabel={pageCopy.navigation.blogLabel}
      brandHref={headerHrefs.brandHref}
      brandLabel={pageCopy.navigation.productName}
      currentLocale={locale}
      languageLabel={pageCopy.navigation.languageLabel}
      languageMode="static"
      localeHrefByLocale={headerHrefs.localeHrefByLocale}
      plannerHref={headerHrefs.plannerHref}
      plannerLabel={pageCopy.navigation.plannerActionLabel}
      surface="public"
    />
  );
}
