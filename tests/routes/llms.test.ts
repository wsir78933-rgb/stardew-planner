import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import { getLocalizedPublicRouteEntries } from "../../src/i18n/public-route-registry";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

it("exports a bilingual LLM site guide with every public route", () => {
  const llmsText = readFileSync(join(process.cwd(), "out", "llms.txt"), "utf8");

  expect(llmsText).toMatch(/^# Stardew Valley Planner\n/m);
  expect(llmsText).toContain("## English");
  expect(llmsText).toContain("## 简体中文");
  expect(llmsText).toContain("browser-local projects");
  expect(llmsText).toContain("浏览器本地项目");

  for (const { pathname } of getLocalizedPublicRouteEntries()) {
    const publicUrl = createCanonicalUrl(pathname);

    expect(llmsText).toContain(`](${publicUrl})`);
  }
});
