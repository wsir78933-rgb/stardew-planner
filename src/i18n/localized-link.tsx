import Link from "next/link";
import type { ComponentProps } from "react";
import { getLocalizedPath } from "./localized-path";
import type { SiteLocale } from "./locales";

export type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  locale: SiteLocale;
  canonicalPath: string;
  search?: string;
  hash?: string;
};

export function LocalizedLink({
  locale,
  canonicalPath,
  search,
  hash,
  ...linkProps
}: LocalizedLinkProps) {
  const href = getLocalizedPath(locale, canonicalPath, search, hash);

  return <Link href={href} {...linkProps} />;
}
