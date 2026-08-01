import { getPublicPageCopy } from "../i18n/public-page-content";
import type { PublicLocale } from "../i18n/public-locale";
import {
  getLocalizedPublicPath,
  type PublicCanonicalPath,
} from "../i18n/public-route-registry";

type PublicNavigationProperties = Readonly<{
  locale: PublicLocale;
  canonicalPath: PublicCanonicalPath;
}>;

export function PublicNavigation({
  locale,
  canonicalPath,
}: PublicNavigationProperties) {
  const pageCopy = getPublicPageCopy(locale);

  return (
    <nav aria-label={pageCopy.navigationLabel}>
      {pageCopy.navigation.map((navigationItem) => (
        <a
          aria-current={
            navigationItem.path === canonicalPath ? "page" : undefined
          }
          href={getLocalizedPublicPath(locale, navigationItem.path)}
          key={navigationItem.path}
        >
          {navigationItem.label}
        </a>
      ))}
    </nav>
  );
}
