import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

const globalStylesPath = new URL("../../app/globals.css", import.meta.url);
const globalStyles = readFileSync(globalStylesPath, "utf8");

it("keeps public-page layout styles isolated, scrollable, responsive, and focusable", () => {
  expect(globalStyles).toMatch(/\[data-public-page-shell\]\s*\{[^}]*height:\s*100dvh;/s);
  expect(globalStyles).toMatch(/\[data-public-page-shell\]\s*\{[^}]*overflow-y:\s*auto;/s);
  expect(globalStyles).toMatch(/\[data-public-page-shell\]\s*\{[^}]*overflow-x:\s*hidden;/s);
  expect(globalStyles).toMatch(/\[data-public-page-shell\][^{]*\{[^}]*aspect-ratio:/s);
  expect(globalStyles).toContain("@media (max-width: 700px)");
  expect(globalStyles).toMatch(/\[data-public-page-shell\][^}]*:focus-visible\s*\{[^}]*outline:\s*2px/s);
});

it("does not add public-page declarations to the homepage selector", () => {
  const publicShellIndex = globalStyles.indexOf("[data-public-page-shell]");
  const existingHomepageStyles = globalStyles.slice(0, publicShellIndex);
  const publicStyleBlock = globalStyles.slice(publicShellIndex);

  expect(publicShellIndex).toBeGreaterThanOrEqual(0);
  expect(existingHomepageStyles).toContain(
    "  body.stardew-homepage [data-homepage-capability-number] {\n    margin-bottom: 2rem;\n  }",
  );
  expect(publicStyleBlock).toMatch(
    /\[data-public-page-shell\] \.public-page-shell-language-switcher\s*\{[^}]*white-space:\s*nowrap;/s,
  );
  expect(publicStyleBlock).not.toContain("body.stardew-homepage");
});
