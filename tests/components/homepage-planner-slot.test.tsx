import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { createPublicPreviewSource } from "../../src/assets/public-preview-source";
import { HomepagePlannerSlot } from "../../src/components/homepage-planner-slot";
import type { HomepageLocale } from "../../src/homepage/homepage-locale";

const homepagePlannerPreviewSource = createPublicPreviewSource(
  "maps/previews/Farm.png",
);
const homepagePlannerSlotSource = readFileSync(
  join(process.cwd(), "src/components/homepage-planner-slot.tsx"),
  "utf8",
);

describe("HomepagePlannerSlot", () => {
  it("renders only the farm preview on the first static frame", () => {
    const homepagePlannerSlotMarkup = renderToStaticMarkup(
      createElement(HomepagePlannerSlot, {
        locale: "en",
        previewImageAlt:
          "Pixel-art Standard Farm map with a central dirt field, farmhouse, greenhouse, and two ponds",
      }),
    );

    expect(homepagePlannerSlotMarkup).toContain(
      'id="planner"',
    );
    expect(homepagePlannerSlotMarkup).toContain("data-homepage-product-stage");
    expect(homepagePlannerSlotMarkup).toContain("data-homepage-workspace");
    expect(homepagePlannerSlotMarkup).toContain("data-homepage-planner-preview");
    expect(homepagePlannerSlotMarkup).toContain(
      `src="${homepagePlannerPreviewSource}"`,
    );
    expect(homepagePlannerSlotMarkup).toContain('width="320"');
    expect(homepagePlannerSlotMarkup).toContain('height="260"');
    expect(homepagePlannerSlotMarkup).toContain('loading="lazy"');
    expect(homepagePlannerSlotMarkup).toContain('decoding="async"');
    expect(homepagePlannerSlotMarkup).not.toContain("fetchPriority");
    expect(homepagePlannerSlotMarkup).not.toContain("Loading planner…");
    expect(homepagePlannerSlotMarkup).not.toContain("planner-canvas__viewport");
    expect(homepagePlannerSlotMarkup).not.toContain("<canvas");
  });

  it("rejects a missing locale with the received value", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(HomepagePlannerSlot, {
          locale: "" as HomepageLocale,
          previewImageAlt:
            "Pixel-art Standard Farm map with a central dirt field, farmhouse, greenhouse, and two ponds",
        }),
      ),
    ).toThrow(TypeError);
    expect(() =>
      renderToStaticMarkup(
        createElement(HomepagePlannerSlot, {
          locale: "" as HomepageLocale,
          previewImageAlt:
            "Pixel-art Standard Farm map with a central dirt field, farmhouse, greenhouse, and two ponds",
        }),
      ),
    ).toThrow('received ""');
  });

  it("rejects a missing preview image alt with the received value", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(HomepagePlannerSlot, {
          locale: "zh-CN",
          previewImageAlt: "",
        }),
      ),
    ).toThrow(TypeError);
    expect(() =>
      renderToStaticMarkup(
        createElement(HomepagePlannerSlot, {
          locale: "zh-CN",
          previewImageAlt: "",
        }),
      ),
    ).toThrow('received ""');
  });

  it("loads ReactPlannerHost only through next/dynamic after hydration", () => {
    expect(homepagePlannerSlotSource).toContain('"use client"');
    expect(homepagePlannerSlotSource).toContain('from "next/dynamic"');
    expect(homepagePlannerSlotSource).toContain('import("./react-planner-host")');
    expect(homepagePlannerSlotSource).toContain("ssr: false");
    expect(homepagePlannerSlotSource).toContain("useEffect(() => {");
    expect(homepagePlannerSlotSource).not.toMatch(
      /from\s+["']\.\/react-planner-host["']/,
    );
    expect(homepagePlannerSlotSource).not.toMatch(/from\s+["']pixi\.js["']/);
    expect(homepagePlannerSlotSource).not.toContain("IntersectionObserver");
  });
});
