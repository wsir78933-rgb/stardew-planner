/** @vitest-environment jsdom */

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const plannerRouteEntryDoubles = vi.hoisted(() => ({
  plannerWorkspaceProperties: [] as Array<Record<string, unknown>>,
}));

vi.mock("../../src/components/planner-workspace", () => ({
  PlannerWorkspace: (properties: Record<string, unknown>) => {
    plannerRouteEntryDoubles.plannerWorkspaceProperties.push(properties);
    return createElement("div");
  },
}));

import { PlannerRouteEntry } from "../../src/components/planner-route-entry";

const mountedRoots: Root[] = [];

afterEach(async () => {
  await act(async () => {
    for (const mountedRoot of mountedRoots.splice(0)) {
      mountedRoot.unmount();
    }
  });
  plannerRouteEntryDoubles.plannerWorkspaceProperties.length = 0;
  window.history.replaceState({}, "", "/");
  document.body.replaceChildren();
});

describe("planner route entry", () => {
  it("applies one valid farmType query as the planner initial map", async () => {
    window.history.replaceState({}, "", "/?farmType=forest#details");

    const container = await renderPlannerRouteEntry("en");

    expect(plannerRouteEntryDoubles.plannerWorkspaceProperties).toContainEqual({
      initialMapId: "forest",
      locale: "en",
    });
    expect(getLinkHref(container, "简体中文")).toBe("/zh?farmType=forest#details");
    expect(getLinkHref(container, "English")).toBe("/?farmType=forest#details");
  });

  it("keeps the default initial map for duplicate or unknown farmType queries", async () => {
    window.history.replaceState(
      {},
      "",
      "/?farmType=forest&farmType=unknown-mod-farm",
    );

    window.history.replaceState(
      {},
      "",
      "/zh?farmType=forest&farmType=unknown-mod-farm#map",
    );

    const container = await renderPlannerRouteEntry("zh-CN");

    expect(plannerRouteEntryDoubles.plannerWorkspaceProperties).toEqual([
      { locale: "zh-CN" },
    ]);
    expect(getLinkHref(container, "English")).toBe(
      "/?farmType=forest&farmType=unknown-mod-farm#map",
    );
    expect(getLinkHref(container, "简体中文")).toBe(
      "/zh?farmType=forest&farmType=unknown-mod-farm#map",
    );
  });
});

async function renderPlannerRouteEntry(
  locale: "en" | "zh-CN",
): Promise<HTMLDivElement> {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  mountedRoots.push(root);

  await act(async () => {
    root.render(createElement(PlannerRouteEntry, { locale }));
  });

  return container;
}

function getLinkHref(container: HTMLDivElement, linkText: string): string | null {
  const link = [...container.querySelectorAll("a")].find(
    (candidate) => candidate.textContent === linkText,
  );

  return link?.getAttribute("href") ?? null;
}
