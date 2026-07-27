import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LanguageSwitcher } from "../../src/i18n/language-switcher";

describe("LanguageSwitcher", () => {
  it.each(["en", "zh-CN"] as const)(
    "keeps the canonical pathname, query, and hash when rendering from %s",
    (locale) => {
      const markup = renderToStaticMarkup(
        <LanguageSwitcher
          locale={locale}
          canonicalPath="/farm/standard"
          search="farmType=beach"
          hash="details"
        />,
      );

      expect(markup).toContain(
        'href="/farm/standard?farmType=beach#details"',
      );
      expect(markup).toContain(
        'href="/zh/farm/standard?farmType=beach#details"',
      );
      expect(markup).toContain(">English</a>");
      expect(markup).toContain(">简体中文</a>");
    },
  );
});
