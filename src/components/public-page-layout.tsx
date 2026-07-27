import type { ReactNode } from "react";
import { LiveLanguageSwitcher } from "../i18n/live-language-switcher";
import { LocalizedLink } from "../i18n/localized-link";
import type { SiteLocale } from "../i18n/locales";
import { translate } from "../i18n/messages";
import { PublicNavigation } from "./public-navigation";

type PublicPageLayoutProperties = Readonly<{
  locale: SiteLocale;
  canonicalPath: string;
  search?: string;
  hash?: string;
  children: ReactNode;
}>;

export function PublicPageLayout({
  locale,
  canonicalPath,
  search,
  hash,
  children,
}: PublicPageLayoutProperties) {
  return (
    <div className="public-page-layout">
      <header className="public-page-layout__header">
        <LocalizedLink canonicalPath="/" locale={locale}>
          {translate(locale, "site.title")}
        </LocalizedLink>
        <PublicNavigation locale={locale} />
        <LiveLanguageSwitcher
          canonicalPath={canonicalPath}
          initialHash={hash}
          initialSearch={search}
          locale={locale}
        />
      </header>
      <main className="public-page-layout__content">{children}</main>
    </div>
  );
}
