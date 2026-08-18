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
    "[Carpenter Stardew: Which Robin Service Do You Need Today?](https://stardewvalleyplanner.art/carpenter-stardew)",
  );
  expect(llmsText).toContain(
    "[Robin's Shop Is Empty? Find Her in Stardew Valley Today](https://stardewvalleyplanner.art/where-is-robin-stardew-valley)",
  );
  expect(llmsText).toContain(
    "[罗宾的商店没人？今天去哪里找她](https://stardewvalleyplanner.art/zh/where-is-robin-stardew-valley)",
  );
  expect(llmsText).toContain(
    "[Meet Every Stardew Valley NPC in One Practical Guide](https://stardewvalleyplanner.art/stardew-valley-npc)",
  );
  expect(llmsText).toContain(
    "[一篇实用指南认识星露谷每位 NPC](https://stardewvalleyplanner.art/zh/stardew-valley-npc)",
  );

  for (const { pathname } of getLocalizedIndexablePublicRouteEntries()) {
    const publicUrl = createCanonicalUrl(pathname);

    expect(llmsText).toContain(`](${publicUrl})`);
  }
});
