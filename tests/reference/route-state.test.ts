import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { referenceRoutes } from "../../src/reference/route-state-manifest";

const requiredRouteIds = [
  "planner",
  "farm-comparison",
  "farm-guide",
  "mods",
  "privacy",
  "terms",
] as const;

const requiredPlannerScenarioIds = [
  "idle",
  "map-picker",
  "catalog",
  "local-projects",
  "json-import",
  "json-export",
  "game-save-import",
  "png-export",
  "hq-png-export",
  "farm-summary",
  "csv-export",
  "placement-validation",
  "cursor-placement",
  "fill",
  "eraser",
  "marquee-selection",
  "selection-edit",
  "selection-move",
  "selection-duplicate",
  "undo",
  "redo",
  "map-switching",
  "season-switching",
  "overlay-grid",
  "overlay-buildable",
  "overlay-crop",
  "overlay-tree",
  "overlay-npc-path",
  "overlay-night",
  "overlay-sprinkler",
  "overlay-scarecrow",
  "overlay-bee-house",
  "overlay-junimo-hut",
  "overlay-resource-clump",
  "weather-unavailable",
] as const;

const prohibitedOnlineTerms = [
  {
    label: "login",
    expression: /\blogin\b/i,
    matchingForms: ["login"],
  },
  {
    label: "sign in / sign-in",
    expression: /\bsign[\s-]*in\b/i,
    matchingForms: ["sign in", "sign-in", "sign   in"],
  },
  {
    label: "social auth",
    expression: /\bsocial[\s-]*auth\b/i,
    matchingForms: ["social auth", "social-auth"],
  },
  {
    label: "account",
    expression: /\baccount\b/i,
    matchingForms: ["account"],
  },
  {
    label: "member / membership",
    expression: /\bmember(?:ship)?\b/i,
    matchingForms: ["member", "membership"],
  },
  {
    label: "premium",
    expression: /\bpremium\b/i,
    matchingForms: ["premium"],
  },
  {
    label: "payment",
    expression: /\bpayment\b/i,
    matchingForms: ["payment"],
  },
  {
    label: "Ko-fi",
    expression: /\bko[\s-]*fi\b/i,
    matchingForms: ["Ko-fi", "Ko fi", "Kofi"],
  },
  {
    label: "cloud",
    expression: /\bcloud\b/i,
    matchingForms: ["cloud"],
  },
  {
    label: "sync / synchronization",
    expression: /\bsync(?:hroni[sz]ation)?\b/i,
    matchingForms: ["sync", "synchronization"],
  },
  {
    label: "share",
    expression: /\bshare\b/i,
    matchingForms: ["share"],
  },
  {
    label: "public plan / public-plan",
    expression: /\bpublic[\s-]*plan\b/i,
    matchingForms: ["public plan", "public-plan", "public   plan"],
  },
  {
    label: "feedback",
    expression: /\bfeedback\b/i,
    matchingForms: ["feedback"],
  },
] as const;

const requiredProhibitedOnlineTermLabels = [
  "login",
  "sign in / sign-in",
  "social auth",
  "account",
  "member / membership",
  "premium",
  "payment",
  "Ko-fi",
  "cloud",
  "sync / synchronization",
  "share",
  "public plan / public-plan",
  "feedback",
] as const;

function getAllRouteStateTextFields(): string[] {
  return referenceRoutes.flatMap((route) => [
    route.id,
    route.path,
    route.acceptancePurpose,
    ...route.viewport,
    ...route.states.flatMap((state) => [
      state.id,
      state.action,
      state.expectedVisibleResult,
      state.viewport,
      state.toolMode ?? "",
      state.selectedEntity ?? "",
      state.modalState ?? "",
    ]),
  ]);
}

function getMatrixMarkdown(): string {
  const matrixPath = resolve(
    process.cwd(),
    "docs/reference/route-state-matrix.md",
  );

  return readFileSync(matrixPath, "utf8");
}

function getMatrixTechnicalIds(matrixMarkdown: string): string[] {
  return [...matrixMarkdown.matchAll(/^\| `([^`]+)` \|/gm)].map(
    (match) => match[1],
  );
}

describe("reference route manifest", () => {
  it("contains exactly the fixed public route inventory", () => {
    expect(referenceRoutes.map((route) => route.id)).toEqual(requiredRouteIds);
  });

  it("keeps every banned online term in the route-state validation contract", () => {
    expect(prohibitedOnlineTerms.map((term) => term.label)).toEqual(
      requiredProhibitedOnlineTermLabels,
    );

    for (const prohibitedOnlineTerm of prohibitedOnlineTerms) {
      for (const matchingForm of prohibitedOnlineTerm.matchingForms) {
        expect(matchingForm).toMatch(prohibitedOnlineTerm.expression);
      }
    }
  });

  it("keeps all flattened route and state fields free of banned online terms", () => {
    const routeStateText = getAllRouteStateTextFields().join("\n");

    for (const prohibitedOnlineTerm of prohibitedOnlineTerms) {
      expect(routeStateText).not.toMatch(prohibitedOnlineTerm.expression);
    }
  });

  it("gives each planner scenario separate desktop and mobile acceptance states", () => {
    const plannerRoute = referenceRoutes.find((route) => route.id === "planner");

    expect(plannerRoute?.path).toBe("/");
    expect(plannerRoute?.viewport).toEqual(["desktop", "mobile"]);
    expect(plannerRoute?.states).toHaveLength(
      requiredPlannerScenarioIds.length * 2,
    );

    for (const scenarioId of requiredPlannerScenarioIds) {
      expect(plannerRoute?.states.map((state) => state.id)).toContain(
        `desktop-${scenarioId}`,
      );
      expect(plannerRoute?.states.map((state) => state.id)).toContain(
        `mobile-${scenarioId}`,
      );
    }
  });

  it("records complete visual state context for every acceptance state", () => {
    for (const route of referenceRoutes) {
      for (const state of route.states) {
        expect(state.viewport).toMatch(/^(desktop|mobile)$/);
        expect(["cursor", "fill", "eraser", "multi-select", null]).toContain(
          state.toolMode,
        );
        expect(
          typeof state.selectedEntity === "string" || state.selectedEntity === null,
        ).toBe(true);
        expect(
          typeof state.modalState === "string" || state.modalState === null,
        ).toBe(true);
      }
    }
  });

  it("describes browser-local project controls including saving to the current browser project", () => {
    const projectStates = referenceRoutes
      .find((route) => route.id === "planner")
      ?.states.filter((state) => state.id.endsWith("local-projects"));

    expect(projectStates).toHaveLength(2);

    for (const projectState of projectStates ?? []) {
      expect(projectState.action).toContain(
        "save to the current browser local project",
      );
      expect(projectState.expectedVisibleResult).toContain("current browser local");
      expect(projectState.expectedVisibleResult).toContain(
        "save to the current browser local project",
      );
      expect(projectState.expectedVisibleResult).toMatch(
        /create, open, rename, duplicate, and delete/i,
      );
    }
  });

  it("keeps the Chinese route-state matrix exactly synchronized with the manifest", () => {
    const matrixMarkdown = getMatrixMarkdown();
    const expectedTechnicalIds = referenceRoutes.flatMap((route) => [
      route.id,
      ...route.states.map((state) => state.id),
    ]);

    expect(getMatrixTechnicalIds(matrixMarkdown).sort()).toEqual(
      expectedTechnicalIds.sort(),
    );
    expect(matrixMarkdown).toContain(
      "| 状态 ID | 视口 | 工具模式 | 选中实体 | 模态状态 | 操作 | 应可见结果 |",
    );
    expect(matrixMarkdown).toContain("当前浏览器本地");
  });

  it("keeps the original Chinese matrix free of every banned online term", () => {
    const matrixMarkdown = getMatrixMarkdown();

    for (const prohibitedOnlineTerm of prohibitedOnlineTerms) {
      expect(matrixMarkdown).not.toMatch(prohibitedOnlineTerm.expression);
    }
  });

  it("records saving to the current browser project in both local-project matrix rows", () => {
    const matrixMarkdown = getMatrixMarkdown();
    const localProjectRows = matrixMarkdown
      .split("\n")
      .filter((matrixLine) => matrixLine.includes("-local-projects`"));

    expect(localProjectRows).toHaveLength(2);

    for (const localProjectRow of localProjectRows) {
      expect(localProjectRow).toContain("保存到当前浏览器本机项目");
    }
  });
});
