import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import ChinesePlannerPage, {
  metadata as chinesePlannerMetadata,
} from "../../app/zh/page";
import { generateMetadata as generateChineseFarmMetadata } from "../../app/zh/farm/[type]/page";

it("renders a Chinese static introduction that links to the English planner", () => {
  const markup = renderToStaticMarkup(<ChinesePlannerPage />);

  expect(markup).toContain("星露谷农场规划器");
  expect(markup).toContain('href="/"');
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
