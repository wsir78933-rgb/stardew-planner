import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import { HomepageLocaleSwitcher } from "@/src/components/homepage-locale-switcher";

test("renders the explicit locale choices for the visitor", () => {
  const onLocaleChange = vi.fn();
  const markup = renderToStaticMarkup(
    <HomepageLocaleSwitcher
      currentLocale="en"
      label="Language"
      onLocaleChange={onLocaleChange}
    />,
  );

  expect(markup).toContain('aria-label="Language"');
  expect(markup).toContain("中文");
  expect(markup).toContain("English");
});
