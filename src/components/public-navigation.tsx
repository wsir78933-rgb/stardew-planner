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
  const currentLocalizedPath = getLocalizedPublicPath(locale, canonicalPath);

  return (
    <nav aria-label={pageCopy.navigationLabel}>
      {pageCopy.navigation.map((navigationItem) => {
        const navigationDestination = getLocalizedPublicPath(
          locale,
          navigationItem.path,
        );

        return (
          <a
            aria-current={
              navigationDestination === currentLocalizedPath ? "page" : undefined
            }
            href={navigationDestination}
            key={navigationItem.path}
          >
            {navigationItem.label}
          </a>
        );
      })}
    </nav>
  );
}
