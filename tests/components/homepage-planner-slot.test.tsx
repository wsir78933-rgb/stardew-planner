import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  HomepagePlannerSlot,
  loadPlannerHostWhenPlannerSectionIntersects,
} from "../../src/components/homepage-planner-slot";
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

const homepagePlannerSlotSource = readFileSync(
  join(process.cwd(), "src/components/homepage-planner-slot.tsx"),
  "utf8",
);

class FakePlannerSectionIntersectionObserver {
  static readonly createdObservers: FakePlannerSectionIntersectionObserver[] = [];

  readonly observedPlannerSections: Element[] = [];
  disconnectCount = 0;

  constructor(
    private readonly notifyPlannerSectionIntersection: IntersectionObserverCallback,
  ) {
    FakePlannerSectionIntersectionObserver.createdObservers.push(this);
  }

  observe(plannerSection: Element): void {
    this.observedPlannerSections.push(plannerSection);
  }

  disconnect(): void {
    this.disconnectCount += 1;
  }

  deliverPlannerSectionEntries(
    plannerSectionEntries: IntersectionObserverEntry[],
  ): void {
    this.notifyPlannerSectionIntersection(
      plannerSectionEntries,
      this as unknown as IntersectionObserver,
    );
  }
}

afterEach(() => {
  homepagePlannerSlotHookState.isEnabled = false;
  homepagePlannerSlotHookState.stateIndex = 0;
  homepagePlannerSlotHookState.plannerSectionReference.current = null;
  FakePlannerSectionIntersectionObserver.createdObservers.length = 0;
});

function createPlannerSectionElement(): HTMLElement {
  return { id: "planner" } as HTMLElement;
}

function readCreatedPlannerSectionIntersectionObserver(): FakePlannerSectionIntersectionObserver {
  const [plannerSectionObserver, ...unexpectedObservers] =
    FakePlannerSectionIntersectionObserver.createdObservers;

  if (plannerSectionObserver === undefined || unexpectedObservers.length > 0) {
    throw new Error(
      `Expected one planner section intersection observer; received ${FakePlannerSectionIntersectionObserver.createdObservers.length}.`,
    );
  }

  return plannerSectionObserver;
}

function loadPlannerHostWithFakeObserver(
  loadPlannerHost: () => void,
): FakePlannerSectionIntersectionObserver {
  const plannerSection = createPlannerSectionElement();

  loadPlannerHostWhenPlannerSectionIntersects(
    plannerSection,
    loadPlannerHost,
    FakePlannerSectionIntersectionObserver as unknown as typeof IntersectionObserver,
  );

  const plannerSectionObserver = readCreatedPlannerSectionIntersectionObserver();
  if (plannerSectionObserver.observedPlannerSections.length !== 1) {
    throw new Error(
      `Expected the planner section to be observed once; received ${plannerSectionObserver.observedPlannerSections.length}.`,
    );
  }
  if (plannerSectionObserver.observedPlannerSections[0] !== plannerSection) {
    throw new Error(
      "Planner section intersection observer did not observe the provided planner section.",
    );
  }

  return plannerSectionObserver;
}

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
  it("renders the planner startup status on the first static frame", () => {
    const homepagePlannerSlotMarkup = renderToStaticMarkup(
      createElement(HomepagePlannerSlot, {
        locale: "en",
        previewImageAlt:
          "Pixel-art Standard Farm map with a central dirt field, farmhouse, greenhouse, and two ponds",
      }),
    );

    expect(homepagePlannerSlotMarkup).toContain('id="planner"');
    expect(homepagePlannerSlotMarkup).toContain("data-homepage-product-stage");
    expect(homepagePlannerSlotMarkup).toContain("data-homepage-workspace");
    expect(homepagePlannerSlotMarkup).toContain('class="planner-startup-status"');
    expect(homepagePlannerSlotMarkup).toContain('role="status"');
    expect(homepagePlannerSlotMarkup).toContain(
      'src="/homepage/loading/male-farmer-strip.png"',
    );
    expect(homepagePlannerSlotMarkup).toContain(
      "Loading local planner resources…",
    );
    expect(homepagePlannerSlotMarkup).not.toContain(
      "data-homepage-planner-preview",
    );
    expect(homepagePlannerSlotMarkup).not.toContain("planner-canvas__viewport");
    expect(homepagePlannerSlotMarkup).not.toContain("<canvas");
    expect(homepagePlannerSlotMarkup).not.toContain("maps/previews/Farm.png");
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
    expect(homepagePlannerSlotSource).toContain("IntersectionObserver");
    expect(homepagePlannerSlotSource).not.toMatch(
      /useEffect\(\(\)\s*=>\s*\{?\s*setShouldLoadPlannerHost\(true\)/,
    );
    expect(
      homepagePlannerSlotSource.match(
        /loadPlannerHostWhenPlannerSectionIntersects/g,
      )?.length ?? 0,
    ).toBeGreaterThanOrEqual(2);
  });

  it("rejects a non-function intersection observer constructor with the received value", () => {
    const receivedIntersectionObserverConstructor = "viewport-observer";

    expect(() =>
      loadPlannerHostWhenPlannerSectionIntersects(
        createPlannerSectionElement(),
        () => undefined,
        receivedIntersectionObserverConstructor as unknown as typeof IntersectionObserver,
      ),
    ).toThrow(TypeError);
    expect(() =>
      loadPlannerHostWhenPlannerSectionIntersects(
        createPlannerSectionElement(),
        () => undefined,
        receivedIntersectionObserverConstructor as unknown as typeof IntersectionObserver,
      ),
    ).toThrow(/viewport-observer|string/);
  });

  it("rejects an empty planner section intersection entry list with its length", () => {
    const loadPlannerHost = vi.fn();
    const plannerSectionObserver = loadPlannerHostWithFakeObserver(loadPlannerHost);

    expect(() => plannerSectionObserver.deliverPlannerSectionEntries([])).toThrow(
      /0/,
    );
    expect(loadPlannerHost).not.toHaveBeenCalled();
  });

  it("does not load the planner host when the planner section is outside the viewport", () => {
    const loadPlannerHost = vi.fn();
    const plannerSectionObserver = loadPlannerHostWithFakeObserver(loadPlannerHost);

    expect(() =>
      plannerSectionObserver.deliverPlannerSectionEntries([
        { isIntersecting: false } as IntersectionObserverEntry,
      ]),
    ).not.toThrow();
    expect(loadPlannerHost).not.toHaveBeenCalled();
    expect(plannerSectionObserver.disconnectCount).toBe(0);
  });

  it("loads the planner host once when the planner section intersects and disconnects", () => {
    const loadPlannerHost = vi.fn();
    const plannerSectionObserver = loadPlannerHostWithFakeObserver(loadPlannerHost);

    plannerSectionObserver.deliverPlannerSectionEntries([
      { isIntersecting: true } as IntersectionObserverEntry,
    ]);

    expect(loadPlannerHost).toHaveBeenCalledTimes(1);
    expect(plannerSectionObserver.disconnectCount).toBe(1);
  });

  it("disconnects the planner section observer on cleanup and allows a second cleanup", () => {
    const plannerSection = createPlannerSectionElement();
    const disconnectPlannerSectionObserver =
      loadPlannerHostWhenPlannerSectionIntersects(
        plannerSection,
        () => undefined,
        FakePlannerSectionIntersectionObserver as unknown as typeof IntersectionObserver,
      );
    const plannerSectionObserver = readCreatedPlannerSectionIntersectionObserver();

    expect(plannerSectionObserver.observedPlannerSections).toEqual([
      plannerSection,
    ]);
    expect(plannerSectionObserver.disconnectCount).toBe(0);

    disconnectPlannerSectionObserver();

    expect(plannerSectionObserver.disconnectCount).toBe(1);
    expect(() => disconnectPlannerSectionObserver()).not.toThrow();
  });
});
