import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import ChinesePlannerPage, {
  metadata as chinesePlannerMetadata,
} from "../../app/zh/page";

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
