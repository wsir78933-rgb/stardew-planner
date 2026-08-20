import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PublicSiteAnalytics } from "../../src/components/public-site-analytics";
import { SiteAnalyticsScripts } from "../../src/components/site-analytics-scripts";
import { subscribeToEditorInteractivePerformanceMark } from "../../src/performance/subscribe-to-editor-interactive-performance-mark";

const navigationState = vi.hoisted(() => ({
  pathname: "/blog",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
}));

vi.mock("next/script", async () => {
  const { createElement: createScriptElement } = await import("react");

  return {
    default: function NextScript(properties: {
      children?: string;
      id?: string;
      src?: string;
      strategy?: string;
    }) {
      return createScriptElement(
        "script",
        {
          "data-strategy": properties.strategy,
          id: properties.id,
          src: properties.src,
        },
        properties.children,
      );
    },
  };
});

const englishLayoutSource = readFileSync(
  join(process.cwd(), "app/(en)/layout.tsx"),
  "utf8",
);
const chineseLayoutSource = readFileSync(
  join(process.cwd(), "app/zh/layout.tsx"),
  "utf8",
);
const siteAnalyticsScriptsSource = readFileSync(
  join(process.cwd(), "src/components/site-analytics-scripts.tsx"),
  "utf8",
);
const publicSiteAnalyticsSource = readFileSync(
  join(process.cwd(), "src/components/public-site-analytics.tsx"),
  "utf8",
);
const editorInteractiveSubscriptionSource = readFileSync(
  join(
    process.cwd(),
    "src/performance/subscribe-to-editor-interactive-performance-mark.ts",
  ),
  "utf8",
);

type FakePerformanceMark = Readonly<{
  name: string;
}>;

type FakePerformanceObserverCallback = (list: {
  getEntries: () => FakePerformanceMark[];
}) => void;

function createFakeEditorInteractivePerformance() {
  const marks: FakePerformanceMark[] = [];
  let observerCallback: FakePerformanceObserverCallback | undefined;
  let observeOptions: unknown;
  let disconnectCount = 0;
  let isObserverDisconnected = false;

  class FakePerformanceObserver {
    constructor(callback: FakePerformanceObserverCallback) {
      observerCallback = (list) => {
        if (isObserverDisconnected) {
          return;
        }

        callback(list);
      };
    }

    observe(options: unknown) {
      observeOptions = options;
    }

    disconnect() {
      isObserverDisconnected = true;
      disconnectCount += 1;
    }
  }

  return {
    FakePerformanceObserver,
    addMark(name: string) {
      marks.push({ name });
    },
    deliverObserverEntries(entryNames: readonly string[]) {
      if (observerCallback === undefined) {
        throw new Error("PerformanceObserver was not constructed.");
      }

      observerCallback({
        getEntries: () => entryNames.map((name) => ({ name })),
      });
    },
    getDisconnectCount() {
      return disconnectCount;
    },
    getObserveOptions() {
      return observeOptions;
    },
    performanceTimeline: {
      getEntriesByName(name: string, entryType?: string) {
        if (entryType !== undefined && entryType !== "mark") {
          return [];
        }

        return marks.filter((mark) => mark.name === name);
      },
    },
  };
}

describe("public site analytics placement", () => {
  it("keeps GA and Clarity snippets only in SiteAnalyticsScripts", () => {
    expect(siteAnalyticsScriptsSource).toContain(
      "https://www.googletagmanager.com/gtag/js?id=G-SEKQT6DTT1",
    );
    expect(siteAnalyticsScriptsSource).toContain("G-SEKQT6DTT1");
    expect(siteAnalyticsScriptsSource).toContain("xwledpd5pa");
    expect(siteAnalyticsScriptsSource).toContain('strategy="afterInteractive"');
    expect(siteAnalyticsScriptsSource).toContain('id="google-analytics"');
    expect(siteAnalyticsScriptsSource).toContain('id="microsoft-clarity"');

    expect(publicSiteAnalyticsSource).toContain('"use client"');
    expect(publicSiteAnalyticsSource).toContain("usePathname");
    expect(publicSiteAnalyticsSource).toContain("next/navigation");
    expect(publicSiteAnalyticsSource).toContain("SiteAnalyticsScripts");
    expect(publicSiteAnalyticsSource).toContain(
      "subscribeToEditorInteractivePerformanceMark",
    );
    expect(publicSiteAnalyticsSource).toContain(
      "subscribe-to-editor-interactive-performance-mark",
    );
    expect(publicSiteAnalyticsSource).not.toContain("googletagmanager");
    expect(publicSiteAnalyticsSource).not.toContain("G-SEKQT6DTT1");
    expect(publicSiteAnalyticsSource).not.toContain("xwledpd5pa");
    expect(editorInteractiveSubscriptionSource).toContain("editor:interactive");
    expect(editorInteractiveSubscriptionSource).toContain("PerformanceObserver");
    expect(editorInteractiveSubscriptionSource).toContain(
      "export function subscribeToEditorInteractivePerformanceMark",
    );
  });

  it("renders PublicSiteAnalytics from both locale layouts instead of gtag URLs", () => {
    for (const layoutSource of [englishLayoutSource, chineseLayoutSource]) {
      expect(layoutSource).toContain("<PublicSiteAnalytics />");
      expect(layoutSource).toContain("public-site-analytics");
      expect(layoutSource).not.toContain("googletagmanager");
      expect(layoutSource).not.toContain('from "next/script"');
      expect(layoutSource).toContain("globals.css");
    }

    expect(englishLayoutSource).toContain('lang="en"');
    expect(chineseLayoutSource).toContain('lang="zh-CN"');
  });
});

describe("SiteAnalyticsScripts", () => {
  it("renders the GA and Clarity afterInteractive scripts", () => {
    const markup = renderToStaticMarkup(createElement(SiteAnalyticsScripts));

    expect(markup).toContain(
      "https://www.googletagmanager.com/gtag/js?id=G-SEKQT6DTT1",
    );
    expect(markup).toContain("G-SEKQT6DTT1");
    expect(markup).toContain("xwledpd5pa");
    expect(markup).toContain('data-strategy="afterInteractive"');
    expect(markup).toContain('id="google-analytics"');
    expect(markup).toContain('id="microsoft-clarity"');
  });
});

describe("PublicSiteAnalytics", () => {
  it("renders analytics scripts immediately on non-planner public pages", () => {
    for (const pathname of ["/blog", "/contact", "/zh/blog"]) {
      navigationState.pathname = pathname;

      const markup = renderToStaticMarkup(createElement(PublicSiteAnalytics));

      expect(markup).toContain(
        "https://www.googletagmanager.com/gtag/js?id=G-SEKQT6DTT1",
      );
      expect(markup).toContain("xwledpd5pa");
    }
  });

  it("does not render analytics scripts on the planner entry before editor:interactive", () => {
    navigationState.pathname = "/";

    const markup = renderToStaticMarkup(createElement(PublicSiteAnalytics));

    expect(markup).toBe("");
    expect(markup).not.toContain("googletagmanager");
    expect(markup).not.toContain("clarity");
  });

  it("does not render analytics scripts on the Chinese planner entry before editor:interactive", () => {
    navigationState.pathname = "/zh";

    const markup = renderToStaticMarkup(createElement(PublicSiteAnalytics));

    expect(markup).toBe("");
  });
});

describe("subscribeToEditorInteractivePerformanceMark", () => {
  it("loads immediately when the editor:interactive mark already exists", () => {
    const fakePerformance = createFakeEditorInteractivePerformance();
    fakePerformance.addMark("editor:interactive");
    let loadCount = 0;

    const unsubscribe = subscribeToEditorInteractivePerformanceMark(() => {
      loadCount += 1;
    }, {
      performanceTimeline: fakePerformance.performanceTimeline,
      PerformanceObserverConstructor: fakePerformance.FakePerformanceObserver,
    });

    expect(loadCount).toBe(1);
    expect(fakePerformance.getObserveOptions()).toBeUndefined();

    unsubscribe();
  });

  it("observes buffered marks and loads only after editor:interactive", () => {
    const fakePerformance = createFakeEditorInteractivePerformance();
    let loadCount = 0;

    const unsubscribe = subscribeToEditorInteractivePerformanceMark(() => {
      loadCount += 1;
    }, {
      performanceTimeline: fakePerformance.performanceTimeline,
      PerformanceObserverConstructor: fakePerformance.FakePerformanceObserver,
    });

    expect(loadCount).toBe(0);
    expect(fakePerformance.getObserveOptions()).toEqual({
      buffered: true,
      type: "mark",
    });

    fakePerformance.deliverObserverEntries(["editor:canvas-mounted"]);
    expect(loadCount).toBe(0);

    fakePerformance.deliverObserverEntries(["editor:interactive"]);
    expect(loadCount).toBe(1);
    expect(fakePerformance.getDisconnectCount()).toBe(1);

    fakePerformance.deliverObserverEntries(["editor:interactive"]);
    expect(loadCount).toBe(1);

    unsubscribe();
  });

  it("throws when PerformanceObserver is not a function, including typeof PerformanceObserver", () => {
    const fakePerformance = createFakeEditorInteractivePerformance();

    expect(() =>
      subscribeToEditorInteractivePerformanceMark(() => {
        throw new Error("onEditorInteractive should not run.");
      }, {
        performanceTimeline: fakePerformance.performanceTimeline,
        PerformanceObserverConstructor: undefined,
      }),
    ).toThrow(/typeof PerformanceObserver: undefined/);
    expect(() =>
      subscribeToEditorInteractivePerformanceMark(() => {
        throw new Error("onEditorInteractive should not run.");
      }, {
        performanceTimeline: fakePerformance.performanceTimeline,
        PerformanceObserverConstructor: undefined,
      }),
    ).toThrow(Error);
  });
});
