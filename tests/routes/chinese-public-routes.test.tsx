import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import ChinesePlannerPage, {
  metadata as chinesePlannerMetadata,
} from "../../app/zh/page";
import { homepageCopyByLocale } from "../../src/homepage/homepage-copy";
import { generateMetadata as generateChineseFarmMetadata } from "../../app/zh/farm/[type]/page";

it("renders /zh as the Chinese homepage with the shared planner workspace", () => {
  const markup = renderToStaticMarkup(<ChinesePlannerPage />);

  expect(markup).toContain(
    '<h1>星露谷物语<em data-homepage-hero-emphasis="true">规划器</em>——免费在线农场布局工具</h1>',
  );
  expect(markup).toContain(
    "别等建筑落地后才发现布局不顺。先在浏览器中试排 8 种农场，摆放建筑和作物、检查四季与覆盖范围，再照着方案进游戏建造。",
  );
  expect(markup).toContain('data-homepage-shell="true"');
  expect(markup).toContain("data-homepage-workspace");
  expect(markup).toContain(homepageCopyByLocale["zh-CN"].planningGuide.heading);
  expect(markup.match(/href="#planner"/g)).toHaveLength(3);
  expect(markup).toContain('href="/zh"');
  expect(markup).toContain('href="/"');
  expect(markup).not.toContain('data-public-page-shell="true"');
  expect(markup).not.toContain("The editing interface opens in English.");
  expect(markup).not.toContain("reference-runtime-root");
});

it("assigns Chinese root canonical and paired language alternates", () => {
  expect(chinesePlannerMetadata.alternates).toMatchObject({
    canonical: "https://stardewvalleyplanner.art/zh",
    languages: {
      en: "https://stardewvalleyplanner.art",
      "zh-CN": "https://stardewvalleyplanner.art/zh",
      "x-default": "https://stardewvalleyplanner.art",
    },
  });
});

it("uses the Next not-found boundary for unknown Chinese farm types", async () => {
  await expect(
    generateChineseFarmMetadata({
      params: Promise.resolve({ type: "unknown-farm" }),
    }),
  ).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
});
