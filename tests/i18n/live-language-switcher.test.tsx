/** @vitest-environment jsdom */

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { LiveLanguageSwitcher } from "../../src/i18n/live-language-switcher";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const mountedRoots: Root[] = [];

afterEach(async () => {
  await act(async () => {
    for (const mountedRoot of mountedRoots.splice(0)) {
      mountedRoot.unmount();
    }
  });
  window.history.replaceState({}, "", "/");
  document.body.replaceChildren();
});

describe("LiveLanguageSwitcher", () => {
  it("uses the live browser search and hash after static hydration", async () => {
    window.history.replaceState(
      {},
      "",
      "/farm/standard?farmType=beach&view=grid#details",
    );

    const container = await renderLiveLanguageSwitcher();

    expect(getLinkHref(container, "English")).toBe(
      "/farm/standard?farmType=beach&view=grid#details",
    );
    expect(getLinkHref(container, "简体中文")).toBe(
      "/zh/farm/standard?farmType=beach&view=grid#details",
    );
  });

  it("refreshes language links after anchor navigation changes the hash", async () => {
    window.history.replaceState({}, "", "/farm/standard?farmType=beach#start");

    const container = await renderLiveLanguageSwitcher();

    await act(async () => {
      window.history.replaceState(
        {},
        "",
        "/farm/standard?farmType=beach#updated",
      );
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    expect(getLinkHref(container, "English")).toBe(
      "/farm/standard?farmType=beach#updated",
    );
    expect(getLinkHref(container, "简体中文")).toBe(
      "/zh/farm/standard?farmType=beach#updated",
    );
  });

  it("refreshes language links after browser history navigation", async () => {
    const container = await renderLiveLanguageSwitcher();

    await act(async () => {
      window.history.pushState({}, "", "/farm/standard?farmType=forest#history");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(getLinkHref(container, "English")).toBe(
      "/farm/standard?farmType=forest#history",
    );
    expect(getLinkHref(container, "简体中文")).toBe(
      "/zh/farm/standard?farmType=forest#history",
    );
  });
});

async function renderLiveLanguageSwitcher(): Promise<HTMLDivElement> {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  mountedRoots.push(root);

  await act(async () => {
    root.render(
      createElement(LiveLanguageSwitcher, {
        canonicalPath: "/farm/standard",
        locale: "en",
      }),
    );
  });

  return container;
}

function getLinkHref(container: HTMLDivElement, linkText: string): string | null {
  const link = [...container.querySelectorAll("a")].find(
    (candidate) => candidate.textContent === linkText,
  );

  return link?.getAttribute("href") ?? null;
}
