import Link from "next/link";
import { getLocalizedPath } from "./localized-path";
import type { SiteLocale } from "./locales";
import { translate } from "./messages";

type LanguageSwitcherProps = {
  locale: SiteLocale;
  canonicalPath: string;
  search?: string;
  hash?: string;
};

export function LanguageSwitcher({
  locale,
  canonicalPath,
  search,
  hash,
}: LanguageSwitcherProps) {
  const englishPath = getLocalizedPath("en", canonicalPath, search, hash);
  const chinesePath = getLocalizedPath("zh-CN", canonicalPath, search, hash);

  return (
    <nav aria-label={translate(locale, "languageSwitcher.label")}>
      <Link href={englishPath}>{translate("en", "languageSwitcher.english")}</Link>
      <Link href={chinesePath}>
        {translate("zh-CN", "languageSwitcher.simplifiedChinese")}
      </Link>
    </nav>
  );
}
