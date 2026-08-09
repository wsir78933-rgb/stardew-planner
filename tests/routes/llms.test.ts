import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import { getLocalizedIndexablePublicRouteEntries } from "../../src/i18n/public-route-registry";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

it("exports a bilingual LLM site guide with every indexable public route", () => {
  const llmsText = readFileSync(join(process.cwd(), "out", "llms.txt"), "utf8");

  expect(llmsText).toMatch(/^# Stardew Valley Planner\n/m);
  expect(llmsText).toContain("## English");
  expect(llmsText).toContain("## 简体中文");
  expect(llmsText).toContain("browser-local projects");
  expect(llmsText).toContain("浏览器本地项目");
  expect(llmsText).toContain(
    "[Carpenter in Stardew Valley](https://stardewvalleyplanner.art/carpenter-stardew)",
  );
  expect(llmsText).toContain(
    "[罗宾在星露谷物语的哪里](https://stardewvalleyplanner.art/zh/where-is-robin-stardew-valley)",
  );

  for (const { pathname } of getLocalizedIndexablePublicRouteEntries()) {
    const publicUrl = createCanonicalUrl(pathname);

    expect(llmsText).toContain(`](${publicUrl})`);
  }
});
