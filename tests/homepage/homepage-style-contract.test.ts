import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

const homepageBodyScope = "body:has(> [data-homepage-shell])";

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

test("contains the hero value proposition and frames the product stage within the homepage scope", () => {
  const styles = readProjectFile("app/globals.css");
  const heroContentRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-hero-content\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const productStageRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-product-stage\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const mobileProductStageRule = styles.match(
    /@media \(max-width: 700px\)\s*\{[\s\S]*?body:has\(> \[data-homepage-shell\]\) \[data-homepage-product-stage\]\s*\{([\s\S]*?)\n  \}/,
  )?.[1];

  expect(heroContentRule).toBeDefined();
  expect(heroContentRule).toContain("display: grid;");
  expect(heroContentRule).toContain("justify-items: center;");
  expect(heroContentRule).toContain("max-width: 42rem;");
  expect(heroContentRule).toContain("width: 100%;");
  expect(productStageRule).toBeDefined();
  expect(productStageRule).toContain("background: var(--card);");
  expect(productStageRule).toContain("border: 1px solid rgb(36 42 34 / 72%);");
  expect(productStageRule).toContain("border-radius: var(--radius);");
  expect(productStageRule).toContain("overflow: hidden;");
  expect(mobileProductStageRule).toBeDefined();
  expect(mobileProductStageRule).toContain("border-radius: 0;");
});

test("ships the planning guide illustration as a static public WebP", () => {
  const planningGuideImagePath = resolve(
    process.cwd(),
    "public/homepage/stardew-valley-planner-layout.webp",
  );

  expect(existsSync(planningGuideImagePath)).toBe(true);
});

test("lays out the planning guide as readable copy beside a responsive figure", () => {
  const homepageStyles = readProjectFile("app/globals.css");
  const guideRule = homepageStyles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-planning-guide\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const guideFigureRule = homepageStyles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-planning-guide\] figure\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const guideImageRule = homepageStyles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-planning-guide\] img\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const mobileGuideRule = homepageStyles.match(
    /@media \(max-width: 700px\)\s*\{[\s\S]*?body:has\(> \[data-homepage-shell\]\) \[data-homepage-planning-guide\]\s*\{([\s\S]*?)\n  \}/,
  )?.[1];

  expect(homepageStyles).toContain("[data-homepage-planning-guide] figure");
  expect(homepageStyles).toContain("[data-homepage-planning-guide] img");
  expect(guideRule).toBeDefined();
  expect(guideRule).toContain("display: grid;");
  expect(guideRule).toContain(
    "grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);",
  );
  expect(guideFigureRule).toBeDefined();
  expect(guideFigureRule).toContain("border-radius: var(--radius);");
  expect(guideImageRule).toBeDefined();
  expect(guideImageRule).toContain("height: auto;");
  expect(guideImageRule).toContain("max-width: 100%;");
  expect(guideImageRule).toContain("width: 100%;");
  expect(mobileGuideRule).toBeDefined();
  expect(mobileGuideRule).toContain("grid-template-columns: 1fr;");
});

test("limits editor frame styling to the homepage runtime root", () => {
  const overrides = readProjectFile("public/reference-runtime/local-only-overrides.css");

  expect(overrides).toContain(`${homepageBodyScope} #reference-runtime-root`);
  expect(overrides).toContain(`${homepageBodyScope} #reference-runtime-root > .app`);
  expect(overrides).not.toContain("body.stardew-homepage");
  expect(overrides).toContain("transform: translateZ(0);");
  expect(overrides).not.toMatch(/(^|\n)#reference-runtime-root\s*\{/);
});

test("keeps the desktop editor frame at viewport height alongside the frozen runtime sidebar", () => {
  const styles = readProjectFile("app/globals.css");
  const plannerActiveBodyRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\)\.planner-active\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  expect(styles).toContain(homepageBodyScope);
  expect(styles).toContain(`${homepageBodyScope}.planner-active`);
  expect(plannerActiveBodyRule).toBeDefined();
  expect(plannerActiveBodyRule).toContain("overflow-x: hidden !important;");
  expect(plannerActiveBodyRule).toContain("overflow-y: auto !important;");
  expect(styles).not.toContain("body.stardew-homepage");
  expect(styles).toMatch(
    /body:has\(> \[data-homepage-shell\]\)\.planner-active\s*\{[^}]*background:/s,
  );
  expect(styles).toMatch(
    /body:has\(> \[data-homepage-shell\]\)\.planner-active\s*\{[^}]*color:/s,
  );
  expect(styles).toMatch(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-workspace\]\s*\{[^}]*height:\s*100vh;/s,
  );
  expect(styles).not.toContain("height: clamp(51.25rem, 86vh, 56.25rem);");
  expect(styles).toContain("height: 45rem;");
  expect(styles).not.toMatch(/body\s*\{[^}]*overflow:\s*(auto|visible)/s);
});

test("adds desktop gutters while keeping the mobile workspace flush with the viewport", () => {
  const styles = readProjectFile("app/globals.css");
  const desktopWorkspaceRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-workspace\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const mobileWorkspaceRule = styles.match(
    /@media \(max-width: 700px\)\s*\{[\s\S]*?body:has\(> \[data-homepage-shell\]\) \[data-homepage-workspace\]\s*\{([\s\S]*?)\n  \}/,
  )?.[1];

  expect(desktopWorkspaceRule).toBeDefined();
  expect(mobileWorkspaceRule).toBeDefined();
  expect(desktopWorkspaceRule).toContain("margin: 0 0 clamp(5.5rem, 10vw, 9rem);");
  expect(desktopWorkspaceRule).toContain(
    "padding-inline: clamp(1.25rem, 3vw, 3rem);",
  );
  expect(desktopWorkspaceRule).not.toContain("max-width:");
  expect(mobileWorkspaceRule).toContain("padding-inline: 0;");
  expect(mobileWorkspaceRule).not.toMatch(/margin(?:-inline)?:\s*auto/);
});

test("uses matching softly feathered side glows for homepage states", () => {
  const styles = readProjectFile("app/globals.css");
  const homepageBackground = styles.match(
    /body:has\(> \[data-homepage-shell\]\)\s*\{[\s\S]*?\n[ \t]+background:\s*([\s\S]*?);\n[ \t]+color:/,
  )?.[1];
  const plannerActiveBackground = styles.match(
    /body:has\(> \[data-homepage-shell\]\)\.planner-active\s*\{[\s\S]*?\n[ \t]+background:\s*([\s\S]*?);\n[ \t]+color:/,
  )?.[1];

  expect(homepageBackground).toBeDefined();
  expect(plannerActiveBackground).toBeDefined();

  const normalizedHomepageBackground = homepageBackground?.replace(/\s+/g, " ").trim();
  const normalizedPlannerActiveBackground = plannerActiveBackground
    ?.replace(/\s+/g, " ")
    .trim();

  expect(normalizedPlannerActiveBackground).toBe(normalizedHomepageBackground);
  expect(normalizedHomepageBackground).toContain("var(--background)");
  expect(normalizedHomepageBackground).not.toContain("linear-gradient");
  expect(normalizedHomepageBackground?.match(/radial-gradient\(/g)).toHaveLength(2);
  expect(normalizedHomepageBackground).toContain(
    "ellipse 80rem 52rem at -22rem -8rem",
  );
  expect(normalizedHomepageBackground).toContain(
    "ellipse 80rem 52rem at calc(100% + 22rem) -8rem",
  );
});

test("keeps the independent homepage hero glow at eight percent opacity", () => {
  const styles = readProjectFile("app/globals.css");
  const heroGlowRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-hero\]::after\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  expect(heroGlowRule).toBeDefined();
  expect(heroGlowRule).toContain(
    "radial-gradient(circle, rgb(201 251 69 / 8%) 0%, rgb(201 251 69 / 0%) 69%)",
  );
});

test("centers the homepage hero as one vertical content stack", () => {
  const styles = readProjectFile("app/globals.css");
  const heroRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-hero\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  expect(heroRule).toBeDefined();
  expect(heroRule).toContain("align-items: center;");
  expect(heroRule).toContain("display: flex;");
  expect(heroRule).toContain("flex-direction: column;");
  expect(heroRule).toContain("text-align: center;");
});

test("uses a compact wider hero headline without an eyebrow spacing rule", () => {
  const styles = readProjectFile("app/globals.css");
  const desktopHeadlineRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-shell\] h1\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const mobileHeadlineRule = styles.match(
    /@media \(max-width: 700px\)\s*\{[\s\S]*?body:has\(> \[data-homepage-shell\]\) \[data-homepage-shell\] h1\s*\{([\s\S]*?)\n  \}/,
  )?.[1];

  expect(desktopHeadlineRule).toBeDefined();
  expect(desktopHeadlineRule).toContain(
    "font-size: clamp(3.1rem, 5.8vw, 5.5rem);",
  );
  expect(desktopHeadlineRule).toContain("line-height: 0.94;");
  expect(desktopHeadlineRule).toContain("max-width: 13ch;");
  expect(mobileHeadlineRule).toBeDefined();
  expect(mobileHeadlineRule).toContain(
    "font-size: clamp(2.75rem, 12vw, 4.25rem);",
  );
  expect(mobileHeadlineRule).toContain("max-width: 10ch;");
  expect(styles).not.toContain("[data-homepage-eyebrow]");
});

test("keeps the trust statement in its own centered bounded strip", () => {
  const styles = readProjectFile("app/globals.css");
  const trustRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-shell\] > main > section\[data-homepage-trust\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const trustParagraphRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-trust\] p\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  expect(trustRule).toBeDefined();
  expect(trustRule).toContain("max-width: 48rem;");
  expect(trustRule).toContain("padding: clamp(2rem, 4vw, 3.5rem) 0;");
  expect(trustRule).toContain("text-align: center;");
  expect(trustRule).toContain(
    "width: calc(100% - clamp(2.5rem, 6vw, 6rem));",
  );
  expect(trustParagraphRule).toBeDefined();
  expect(trustParagraphRule).toContain("margin-inline: auto;");
});

test("styles the homepage language dropdown through dedicated data attributes", () => {
  const styles = readProjectFile("app/globals.css");
  const switcherRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-language-switcher\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const triggerRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-language-trigger\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const menuRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-language-menu\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const optionRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-language-option\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const optionFocusRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-language-option\]:focus-visible\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  expect(styles).toContain("[data-homepage-language-switcher]");
  expect(styles).toContain("[data-homepage-language-trigger]");
  expect(styles).toContain("[data-homepage-language-menu]");
  expect(styles).toContain("[data-homepage-language-option]");
  expect(styles).not.toContain(
    '[data-homepage-header-actions] [role="group"]',
  );
  expect(switcherRule).toContain("position: relative;");
  expect(triggerRule).toContain("border: 1px solid rgb(36 42 34 / 22%);");
  expect(triggerRule).toContain("border-radius: 0.45rem;");
  expect(triggerRule).toContain("min-height: 2rem;");
  expect(menuRule).toContain("background: var(--background);");
  expect(menuRule).toContain("border: 1px solid rgb(36 42 34 / 22%);");
  expect(menuRule).toContain("border-radius: 0.45rem;");
  expect(menuRule).toContain("box-shadow:");
  expect(menuRule).toContain("list-style: none;");
  expect(menuRule).toContain("position: absolute;");
  expect(menuRule).toContain("right: 0;");
  expect(menuRule).toContain("top: calc(100% + 0.4rem);");
  expect(menuRule).toContain("z-index: 10;");
  expect(optionRule).toContain("cursor: pointer;");
  expect(optionRule).toContain("min-height: 2.5rem;");
  expect(optionRule).toContain("width: 100%;");
  expect(optionFocusRule).toContain("outline: 2px solid var(--ring);");
});

test("uses the shared footer contract for a bounded desktop layout and a single mobile column", () => {
  const styles = readProjectFile("app/globals.css");
  const desktopFooterRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-site-footer\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const desktopSectionsRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-site-footer-sections\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  expect(styles).toContain("[data-site-footer]");
  expect(styles).toContain("[data-site-footer-identity]");
  expect(styles).toContain("[data-site-footer-social-icons]");
  expect(styles).toContain("[data-site-footer-sections]");
  expect(desktopFooterRule).toBeDefined();
  expect(desktopFooterRule).toContain("display: grid;");
  expect(desktopFooterRule).toContain(
    "grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.6fr);",
  );
  expect(desktopFooterRule).toContain("width: 100%;");
  expect(desktopSectionsRule).toBeDefined();
  expect(desktopSectionsRule).toContain("grid-column: 2;");
  expect(desktopSectionsRule).toContain(
    "grid-template-columns: repeat(3, minmax(0, 1fr));",
  );
  expect(styles).toContain(
    "body:has(> [data-homepage-shell]) [data-site-footer-social-icons] :is(span, a) {",
  );

  const mobileFooterRule = styles.match(
    /@media \(max-width: 700px\) \{[\s\S]*?body:has\(> \[data-homepage-shell\]\) \[data-site-footer\]\s*\{([\s\S]*?)\n  \}/,
  )?.[1];
  const mobileSectionsRule = styles.match(
    /@media \(max-width: 700px\) \{[\s\S]*?body:has\(> \[data-homepage-shell\]\) \[data-site-footer-sections\]\s*\{([\s\S]*?)\n  \}/,
  )?.[1];

  expect(mobileFooterRule).toBeDefined();
  expect(mobileFooterRule).toContain("grid-template-columns: minmax(0, 1fr);");
  expect(mobileSectionsRule).toBeDefined();
  expect(mobileSectionsRule).toContain("grid-column: auto;");
  expect(mobileSectionsRule).toContain("grid-row: auto;");
  expect(mobileSectionsRule).toContain("grid-template-columns: 1fr;");
});
