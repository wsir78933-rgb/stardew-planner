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

test("keeps frozen runtime scrolling outside the homepage body class and bounds the editor", () => {
  const styles = readProjectFile("app/globals.css");

  expect(styles).toContain("body.stardew-homepage");
  expect(styles).toContain("body.stardew-homepage.planner-active");
  expect(styles).toMatch(
    /body\.stardew-homepage\.planner-active\s*\{[^}]*background:/s,
  );
  expect(styles).toMatch(
    /body\.stardew-homepage\.planner-active\s*\{[^}]*color:/s,
  );
  expect(styles).toContain("height: clamp(51.25rem, 86vh, 56.25rem);");
  expect(styles).toContain("height: 45rem;");
  expect(styles).not.toMatch(/body\s*\{[^}]*overflow:\s*(auto|visible)/s);
});
