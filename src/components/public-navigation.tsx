import { getLocalizedPublicNavigation } from "../i18n/public-content";
import { LocalizedLink } from "../i18n/localized-link";
import type { SiteLocale } from "../i18n/locales";
import { translate } from "../i18n/messages";

type PublicNavigationProperties = Readonly<{
  locale: SiteLocale;
}>;

export function PublicNavigation({ locale }: PublicNavigationProperties) {
  return (
    <nav aria-label={translate(locale, "public.navigation.label")}>
      {getLocalizedPublicNavigation(locale).map((navigationItem) => (
        <LocalizedLink
          canonicalPath={navigationItem.path}
          key={navigationItem.path}
          locale={locale}
        >
          {navigationItem.label}
        </LocalizedLink>
      ))}
    </nav>
  );
}
