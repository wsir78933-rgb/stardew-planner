import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createPublicPreviewSource } from "../../src/assets/public-preview-source";
import { HomepagePlannerSlot } from "../../src/components/homepage-planner-slot";
import type { HomepageLocale } from "../../src/homepage/homepage-locale";

const homepagePlannerSlotHookState = vi.hoisted(() => ({
  isEnabled: false,
  stateIndex: 0,
  plannerSectionReference: { current: null as unknown },
}));

vi.mock("react", async (importOriginal) => {
  const actualReact = await importOriginal<typeof import("react")>();

  return {
    ...actualReact,
    useCallback: ((callback: Function, dependencies: readonly unknown[]) =>
      homepagePlannerSlotHookState.isEnabled
        ? callback
        : actualReact.useCallback(callback, dependencies)) as typeof actualReact.useCallback,
    useEffect: ((
      effect: Parameters<typeof actualReact.useEffect>[0],
      dependencies?: Parameters<typeof actualReact.useEffect>[1],
    ) => {
      if (!homepagePlannerSlotHookState.isEnabled) {
        return actualReact.useEffect(effect, dependencies);
      }
    }) as typeof actualReact.useEffect,
    useRef: ((initialValue: unknown) => {
      if (!homepagePlannerSlotHookState.isEnabled) {
        return actualReact.useRef(initialValue);
      }

      return homepagePlannerSlotHookState.plannerSectionReference;
    }) as typeof actualReact.useRef,
    useState: ((initialValue: unknown) => {
      if (!homepagePlannerSlotHookState.isEnabled) {
        return actualReact.useState(initialValue);
      }

      const hookIndex = homepagePlannerSlotHookState.stateIndex;
      homepagePlannerSlotHookState.stateIndex += 1;
      if (hookIndex === 0) return [true, () => undefined];
      if (hookIndex === 1) return [false, () => undefined];
      throw new Error(
        `Unexpected HomepagePlannerSlot state hook at index ${hookIndex}.`,
      );
    }) as typeof actualReact.useState,
  };
});

const homepagePlannerPreviewSource = createPublicPreviewSource(
  "maps/previews/Farm.png",
);
const homepagePlannerSlotSource = readFileSync(
  join(process.cwd(), "src/components/homepage-planner-slot.tsx"),
  "utf8",
);

afterEach(() => {
  homepagePlannerSlotHookState.isEnabled = false;
  homepagePlannerSlotHookState.stateIndex = 0;
  homepagePlannerSlotHookState.plannerSectionReference.current = null;
});

function readHomepagePlannerAlignmentCallback(
  homepagePlannerSlotElement: ReactElement<{ children?: ReactNode }>,
): () => void {
  const homepagePlannerChildren = homepagePlannerSlotElement.props.children;
  const childElements = Array.isArray(homepagePlannerChildren)
    ? homepagePlannerChildren
    : [homepagePlannerChildren];
  const plannerHostElement = childElements.find(
    (childElement) =>
      isValidElement(childElement) &&
      "onAlignPlanner" in (childElement.props as object),
  );

  if (!isValidElement(plannerHostElement)) {
    throw new Error("HomepagePlannerSlot did not render its planner host.");
  }

  const alignmentCallback = (
    plannerHostElement.props as { onAlignPlanner?: unknown }
  ).onAlignPlanner;
  if (typeof alignmentCallback !== "function") {
    throw new Error("Homepage planner host alignment callback is missing.");
  }

  return alignmentCallback as () => void;
}

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

  it("aligns the referenced planner section and fails fast when its ref is missing", () => {
    homepagePlannerSlotHookState.isEnabled = true;
    const scrollIntoView = vi.fn();
    homepagePlannerSlotHookState.plannerSectionReference.current = {
      scrollIntoView,
    };
    const firstHomepagePlannerSlot = HomepagePlannerSlot({
      locale: "en",
      previewImageAlt:
        "Pixel-art Standard Farm map with a central dirt field, farmhouse, greenhouse, and two ponds",
    });
    const firstAlignmentCallback = readHomepagePlannerAlignmentCallback(
      firstHomepagePlannerSlot,
    );

    expect(firstHomepagePlannerSlot.props.id).toBe("planner");

    firstAlignmentCallback();
    firstAlignmentCallback();

    expect(scrollIntoView).toHaveBeenCalledTimes(2);
    expect(scrollIntoView).toHaveBeenNthCalledWith(1, {
      behavior: "auto",
      block: "start",
      inline: "nearest",
    });
    expect(scrollIntoView).toHaveBeenNthCalledWith(2, {
      behavior: "auto",
      block: "start",
      inline: "nearest",
    });

    homepagePlannerSlotHookState.plannerSectionReference.current = null;
    expect(firstAlignmentCallback).toThrow(
      "HomepagePlannerSlot cannot align the planner section because its ref is null.",
    );
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
