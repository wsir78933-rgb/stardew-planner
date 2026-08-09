import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

const globalStylesPath = new URL("../../app/globals.css", import.meta.url);
const globalStyles = readFileSync(globalStylesPath, "utf8");

it("keeps public-page layout styles naturally scrollable, responsive, and focusable", () => {
  const rootRules = Array.from(
    globalStyles.matchAll(/^\s*(?:html\s*,\s*body|body\s*,\s*html|html|body)\s*\{[^}]*\}/gm),
    (match) => match[0],
  );
  const bodyRules = rootRules.filter((rule) => /^\s*body\s*\{/.test(rule));
  const publicShellRules = Array.from(
    globalStyles.matchAll(/^\s*\[data-public-page-shell\]\s*\{[^}]*\}/gm),
    (match) => match[0],
  );
  const rootDeclarations = rootRules.join("\n");
  const bodyDeclarations = bodyRules.join("\n");
  const publicShellDeclarations = publicShellRules.join("\n");
  const fixedViewportHeightDeclaration =
    /(?:^|[{;])\s*height\s*:\s*(?:100%|100vh|100dvh)\s*(?:!important\s*)?(?:;|})/i;
  const verticalOverflowLockDeclaration =
    /(?:^|[{;])\s*overflow(?:-y)?\s*:\s*(?:auto|scroll|hidden|clip)\s*(?:!important\s*)?(?:;|})/i;

  expect(rootRules).not.toHaveLength(0);
  expect(bodyRules).not.toHaveLength(0);
  expect(bodyDeclarations).toMatch(
    /(?:^|[{;])\s*min-height\s*:\s*100vh\s*(?:!important\s*)?(?:;|})/i,
  );
  expect(rootDeclarations).not.toMatch(fixedViewportHeightDeclaration);
  expect(rootDeclarations).not.toMatch(verticalOverflowLockDeclaration);
  expect(publicShellRules).not.toHaveLength(0);
  expect(publicShellDeclarations).toMatch(/min-height:\s*100dvh;/);
  expect(publicShellDeclarations).toMatch(/overflow-x:\s*clip;/);
  expect(publicShellDeclarations).not.toMatch(fixedViewportHeightDeclaration);
  expect(publicShellDeclarations).not.toMatch(verticalOverflowLockDeclaration);
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
    "  body:has(> [data-homepage-shell]) [data-homepage-capability-number] {\n    margin-bottom: 2rem;\n  }",
  );
  expect(publicStyleBlock).toMatch(
    /\[data-public-page-shell\] \.public-page-shell-language-switcher\s*\{[^}]*white-space:\s*nowrap;/s,
  );
  expect(publicStyleBlock).not.toContain("body:has(> [data-homepage-shell])");
});

it("replaces the public footer layout with the shared site footer attributes", () => {
  const footerRule = globalStyles.match(
    /\[data-public-page-shell\] > \[data-site-footer\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const copyrightRule = globalStyles.match(
    /\[data-public-page-shell\] > \[data-site-footer\] > p\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const publicFooterFocusRule = globalStyles.match(
    /\[data-public-page-shell\] > \[data-site-footer\] a:focus-visible\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const mobilePublicFooterRule = globalStyles.match(
    /^  \[data-public-page-shell\] > \[data-site-footer\]\s*\{([\s\S]*?)^  \}/m,
  )?.[1];
  const mobilePublicFooterSocialIconsRule = globalStyles.match(
    /^  \[data-public-page-shell\] > \[data-site-footer\] \[data-site-footer-social-icons\]\s*\{([\s\S]*?)^  \}/m,
  )?.[1];
  const mobilePublicFooterSectionsRule = globalStyles.match(
    /^  \[data-public-page-shell\] > \[data-site-footer\] \[data-site-footer-sections\]\s*\{([\s\S]*?)^  \}/m,
  )?.[1];

  expect(globalStyles).not.toContain("[data-public-page-shell] > footer");
  expect(footerRule).toBeDefined();
  expect(footerRule).toContain("border-top: 1px solid rgb(28 33 27 / 24%);");
  expect(copyrightRule).toBeDefined();
  expect(copyrightRule).toContain("border-top: 1px solid rgb(28 33 27 / 24%);");
  expect(copyrightRule).toContain("grid-column: 1 / -1;");
  expect(publicFooterFocusRule).toBeDefined();
  expect(publicFooterFocusRule).toContain("outline: 2px solid #1c211b;");
  expect(mobilePublicFooterRule).toBeDefined();
  expect(mobilePublicFooterRule).toContain(
    "grid-template-columns: minmax(0, 1fr);",
  );
  expect(mobilePublicFooterSocialIconsRule).toBeDefined();
  expect(mobilePublicFooterSocialIconsRule).toContain("grid-column: auto;");
  expect(mobilePublicFooterSectionsRule).toBeDefined();
  expect(mobilePublicFooterSectionsRule).toContain("grid-column: auto;");
  expect(mobilePublicFooterSectionsRule).toContain("grid-row: auto;");
  expect(mobilePublicFooterSectionsRule).toContain("grid-template-columns: 1fr;");
});
