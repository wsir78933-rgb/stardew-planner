import type { ReactNode } from "react";
import { getPublicPageCopy } from "../i18n/public-page-content";
import type { PublicLocale } from "../i18n/public-locale";
import {
  getLocalizedPublicPath,
  type PublicCanonicalPath,
} from "../i18n/public-route-registry";
import { createSiteFooterContent } from "../site-footer/site-footer-content";
import { PublicNavigation } from "./public-navigation";
import { SiteFooter } from "./site-footer";

type PublicPageShellProperties = Readonly<{
  children: ReactNode;
  locale: PublicLocale;
  canonicalPath: PublicCanonicalPath;
}>;

function getCounterpartLocale(locale: PublicLocale): PublicLocale {
  return locale === "en" ? "zh-CN" : "en";
}

export function PublicPageShell({
  children,
  locale,
  canonicalPath,
}: PublicPageShellProperties) {
  const pageCopy = getPublicPageCopy(locale);

  return (
    <div data-public-page-shell="true">
      <header className="public-page-shell-header">
        <a
          className="public-page-shell-brand"
          href={getLocalizedPublicPath(locale, "/")}
        >
          {pageCopy.brandLabel}
        </a>
        <PublicNavigation canonicalPath={canonicalPath} locale={locale} />
        <a
          className="public-page-shell-language-switcher"
          href={getLocalizedPublicPath(
            getCounterpartLocale(locale),
            canonicalPath,
          )}
        >
          {pageCopy.counterpartLabel}
        </a>
      </header>
      <main>{children}</main>
      <SiteFooter content={createSiteFooterContent(pageCopy.footer, locale)} />
    </div>
  );
}
