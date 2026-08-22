import { Button } from "@/components/ui/button";
import { getPublicPageCopy } from "../i18n/public-page-content";
import type { PublicLocale } from "../i18n/public-locale";
import {
  getLocalizedPublicPath,
  type PublicCanonicalPath,
} from "../i18n/public-route-registry";
import { HomepageLocaleSwitcher } from "./homepage-locale-switcher";

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
    capabilitiesHref: `${homepagePath}#capabilities`,
    faqHref: `${homepagePath}#faq`,
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
    <nav aria-label={pageCopy.navigation.productName}>
      <a data-public-page-brand href={headerHrefs.brandHref}>
        {pageCopy.navigation.productName}
      </a>
      <div data-public-page-navigation-links>
        <a href={headerHrefs.capabilitiesHref}>
          {pageCopy.navigation.capabilitiesLabel}
        </a>
        <a href={headerHrefs.faqHref}>{pageCopy.navigation.faqLabel}</a>
        <a href={headerHrefs.blogHref}>{pageCopy.navigation.blogLabel}</a>
      </div>
      <div data-public-page-header-actions>
        <HomepageLocaleSwitcher
          label={pageCopy.navigation.languageLabel}
          localeHrefByLocale={headerHrefs.localeHrefByLocale}
        />
        <Button asChild data-public-page-header-action size="lg">
          <a href={headerHrefs.plannerHref}>
            {pageCopy.navigation.plannerActionLabel}
          </a>
        </Button>
      </div>
    </nav>
  );
}
