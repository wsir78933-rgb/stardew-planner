import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { PublicPageShell } from "../../src/components/public-page-shell";

it("renders a shared static navigation frame around route content", () => {
  const markup = renderToStaticMarkup(
    <PublicPageShell>
      <h1>Example route</h1>
    </PublicPageShell>,
  );

  expect(markup).toContain('data-public-page-shell="true"');
  expect(markup).toContain('aria-label="Public navigation"');
  expect(markup).toContain('href="/"');
  expect(markup).toContain("Example route");
  expect(markup).toContain("Privacy");
  expect(markup).toContain("© Stardew Valley Farm Planner");
});
