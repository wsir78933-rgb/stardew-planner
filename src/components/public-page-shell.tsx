import type { ReactNode } from "react";
import { getPublicPageCopy } from "../i18n/public-page-content";
import type { PublicLocale } from "../i18n/public-locale";
import type { PublicCanonicalPath } from "../i18n/public-route-registry";
import { createSiteFooterContent } from "../site-footer/site-footer-content";
import { PublicNavigation } from "./public-navigation";
import { SiteFooter } from "./site-footer";

type PublicPageShellProperties = Readonly<{
  children: ReactNode;
  locale: PublicLocale;
  canonicalPath: PublicCanonicalPath;
}>;

export function PublicPageShell({
  children,
  locale,
  canonicalPath,
}: PublicPageShellProperties) {
  const pageCopy = getPublicPageCopy(locale);

  return (
    <div data-public-page-shell="true">
      <header data-public-page-header>
        <PublicNavigation canonicalPath={canonicalPath} locale={locale} />
      </header>
      <main>{children}</main>
      <SiteFooter content={createSiteFooterContent(pageCopy.footer, locale)} />
    </div>
  );
}
