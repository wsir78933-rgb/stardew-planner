import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

test("limits editor frame styling to the homepage runtime root", () => {
  const overrides = readProjectFile("public/reference-runtime/local-only-overrides.css");

  expect(overrides).toContain("body.stardew-homepage #reference-runtime-root");
  expect(overrides).toContain("body.stardew-homepage #reference-runtime-root > .app");
  expect(overrides).toContain("transform: translateZ(0);");
  expect(overrides).not.toMatch(/(^|\n)#reference-runtime-root\s*\{/);
});

test("keeps the desktop editor frame at viewport height alongside the frozen runtime sidebar", () => {
  const styles = readProjectFile("app/globals.css");

  expect(styles).toContain("body.stardew-homepage");
  expect(styles).toContain("body.stardew-homepage.planner-active");
  expect(styles).toMatch(
    /body\.stardew-homepage\.planner-active\s*\{[^}]*background:/s,
  );
  expect(styles).toMatch(
    /body\.stardew-homepage\.planner-active\s*\{[^}]*color:/s,
  );
  expect(styles).toMatch(
    /body\.stardew-homepage \[data-homepage-workspace\]\s*\{[^}]*height:\s*100vh;/s,
  );
  expect(styles).not.toContain("height: clamp(51.25rem, 86vh, 56.25rem);");
  expect(styles).toContain("height: 45rem;");
  expect(styles).not.toMatch(/body\s*\{[^}]*overflow:\s*(auto|visible)/s);
});

test("renders the workspace frame flush with the viewport edges", () => {
  const styles = readProjectFile("app/globals.css");
  const desktopWorkspaceRule = styles.match(
    /body\.stardew-homepage \[data-homepage-workspace\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const mobileWorkspaceRule = styles.match(
    /@media \(max-width: 700px\)\s*\{[\s\S]*?body\.stardew-homepage \[data-homepage-workspace\]\s*\{([\s\S]*?)\n  \}/,
  )?.[1];

  expect(desktopWorkspaceRule).toBeDefined();
  expect(mobileWorkspaceRule).toBeDefined();
  expect(desktopWorkspaceRule).toContain("margin: 0 0 clamp(5.5rem, 10vw, 9rem);");
  expect(desktopWorkspaceRule).toContain("padding-inline: 0;");
  expect(desktopWorkspaceRule).not.toContain("max-width:");
  expect(mobileWorkspaceRule).toContain("padding-inline: 0;");
  expect(mobileWorkspaceRule).not.toMatch(/margin(?:-inline)?:\s*auto/);
});

test("uses matching softly feathered side glows for homepage states", () => {
  const styles = readProjectFile("app/globals.css");
  const homepageBackground = styles.match(
    /body\.stardew-homepage\s*\{[\s\S]*?\n[ \t]+background:\s*([\s\S]*?);\n[ \t]+color:/,
  )?.[1];
  const plannerActiveBackground = styles.match(
    /body\.stardew-homepage\.planner-active\s*\{[\s\S]*?\n[ \t]+background:\s*([\s\S]*?);\n[ \t]+color:/,
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
