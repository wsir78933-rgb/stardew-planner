import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as typescript from "typescript";
import { describe, expect, it, vi } from "vitest";
import { createInitialEditorPreferences } from "../../src/editor/browser-editor-preferences";
import {
  PlannerWorkspaceStaticBoundary,
  type PlannerWorkspaceRenderState,
} from "../../src/components/planner-workspace";
import {
  createInitialPlannerWorkspaceState,
  reducePlannerWorkspaceState,
} from "../../src/planner/planner-workspace-state";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";
import type { PlannerWorkspaceStateController } from "../../src/planner/use-planner-workspace-state";
import { createReferenceProjectRepository } from "../../src/reference-runtime/reference-project-repository";
import type { PreparedPlannerWorkspace } from "../../src/planner/planner-workspace-bootstrap";
import type { PreparedDefaultMap } from "../../src/resources/default-map-resource";
import { referenceProjectDocumentFixture } from "../reference-runtime/fixtures/reference-project-document";

vi.mock("../../src/components/planner-canvas", async (importOriginal) => {
  const originalPlannerCanvasModule = await importOriginal<
    typeof import("../../src/components/planner-canvas")
  >();

  return {
    ...originalPlannerCanvasModule,
    PlannerCanvas({
      leftHandMode,
      showResourceClumpSpawnLocations,
    }: Pick<
      import("../../src/components/planner-canvas").PlannerCanvasProperties,
      "leftHandMode" | "showResourceClumpSpawnLocations"
    >) {
      return (
        <output
          data-planner-canvas-left-hand-mode={String(leftHandMode)}
          data-planner-canvas-show-resource-clump-spawn-locations={String(
            showResourceClumpSpawnLocations,
          )}
        />
      );
    },
  };
});

vi.mock("../../src/components/item-catalog-panel", async (importOriginal) => {
  const originalItemCatalogPanelModule = await importOriginal<
    typeof import("../../src/components/item-catalog-panel")
  >();

  return {
    ...originalItemCatalogPanelModule,
    ItemCatalogPanel(
      itemCatalogPanelProperties: Parameters<
        typeof originalItemCatalogPanelModule.ItemCatalogPanel
      >[0],
    ) {
      return (
        <>
          <output
            data-catalog-thumbnails-enabled={String(
              itemCatalogPanelProperties.shouldLoadThumbnails,
            )}
          />
          <originalItemCatalogPanelModule.ItemCatalogPanel
            {...itemCatalogPanelProperties}
          />
        </>
      );
    },
  };
});

function readPlannerWorkspaceStyles(): string {
  return readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
}

function unwrapParenthesizedReturnExpression(
  returnExpression: typescript.Expression,
): typescript.Expression {
  if (typescript.isParenthesizedExpression(returnExpression)) {
    return returnExpression.expression;
  }

  return returnExpression;
}

function getPlannerCanvasRootElement(): typescript.JsxElement {
  const plannerCanvasPath = resolve(process.cwd(), "src/components/planner-canvas.tsx");
  const plannerCanvasSource = readFileSync(plannerCanvasPath, "utf8");
  const plannerCanvasSourceFile = typescript.createSourceFile(
    plannerCanvasPath,
    plannerCanvasSource,
    typescript.ScriptTarget.Latest,
    true,
    typescript.ScriptKind.TSX,
  );

  if (plannerCanvasSourceFile.parseDiagnostics.length > 0) {
    throw new Error(`Unable to parse ${plannerCanvasPath} as TSX.`);
  }

  const plannerCanvasFunction = plannerCanvasSourceFile.statements.find(
    (statement): statement is typescript.FunctionDeclaration =>
      typescript.isFunctionDeclaration(statement) &&
      statement.name?.text === "PlannerCanvas",
  );

  if (plannerCanvasFunction?.body === undefined) {
    throw new Error("Expected PlannerCanvas to have a function body.");
  }

  const plannerCanvasReturnStatement = plannerCanvasFunction.body.statements.find(
    typescript.isReturnStatement,
  );

  if (plannerCanvasReturnStatement?.expression === undefined) {
    throw new Error("Expected PlannerCanvas to return its canvas root JSX element.");
  }

  const plannerCanvasRootExpression = unwrapParenthesizedReturnExpression(
    plannerCanvasReturnStatement.expression,
  );

  if (!typescript.isJsxElement(plannerCanvasRootExpression)) {
    throw new Error("Expected PlannerCanvas to return a JSX element root.");
  }

  return plannerCanvasRootExpression;
}

function getPlannerWorkspaceRenderedBoundary(): typescript.FunctionDeclaration {
  const plannerWorkspacePath = resolve(
    process.cwd(),
    "src/components/planner-workspace.tsx",
  );
  const plannerWorkspaceSource = readFileSync(plannerWorkspacePath, "utf8");
  const plannerWorkspaceSourceFile = typescript.createSourceFile(
    plannerWorkspacePath,
    plannerWorkspaceSource,
    typescript.ScriptTarget.Latest,
    true,
    typescript.ScriptKind.TSX,
  );

  if (plannerWorkspaceSourceFile.parseDiagnostics.length > 0) {
    throw new Error(`Unable to parse ${plannerWorkspacePath} as TSX.`);
  }

  const plannerWorkspaceRenderedBoundary = plannerWorkspaceSourceFile.statements.find(
    (statement): statement is typescript.FunctionDeclaration =>
      typescript.isFunctionDeclaration(statement) &&
      statement.name?.text === "PlannerWorkspaceRenderedBoundary",
  );

  if (plannerWorkspaceRenderedBoundary?.body === undefined) {
    throw new Error(
      "Expected PlannerWorkspaceRenderedBoundary to have a function body.",
    );
  }

  return plannerWorkspaceRenderedBoundary;
}

function getPropertyAccessPath(
  expression: typescript.Expression,
): readonly string[] {
  if (typescript.isIdentifier(expression)) {
    return [expression.text];
  }

  if (typescript.isPropertyAccessExpression(expression)) {
    return [...getPropertyAccessPath(expression.expression), expression.name.text];
  }

  throw new Error(
    `Expected a property access path; received ${expression.getText()}.`,
  );
}

function getStaticClassNamesFromJsxElement(
  jsxElement: typescript.JsxElement,
): readonly string[] {
  const classNameAttribute = jsxElement.openingElement.attributes.properties.find(
    (property): property is typescript.JsxAttribute =>
      typescript.isJsxAttribute(property) && property.name.text === "className",
  );

  if (classNameAttribute?.initializer === undefined) {
    throw new Error("Expected the PlannerCanvas root JSX element to have className.");
  }

  const classNameInitializer = classNameAttribute.initializer;
  if (typescript.isStringLiteral(classNameInitializer)) {
    return classNameInitializer.text.split(" ").filter(Boolean);
  }

  if (
    !typescript.isJsxExpression(classNameInitializer) ||
    classNameInitializer.expression === undefined ||
    !typescript.isTemplateExpression(classNameInitializer.expression)
  ) {
    throw new Error(
      "Expected the PlannerCanvas root className to be a static string or template expression.",
    );
  }

  const classNameFragments = [
    classNameInitializer.expression.head.text,
    ...classNameInitializer.expression.templateSpans.map(
      (templateSpan) => templateSpan.literal.text,
    ),
  ];

  return classNameFragments.flatMap((classNameFragment) =>
    classNameFragment.split(" ").filter(Boolean),
  );
}

function containsPlannerJoystick(jsxElement: typescript.JsxElement): boolean {
  let plannerJoystickWasFound = false;

  function visitJsxNode(sourceNode: typescript.Node): void {
    if (
      typescript.isJsxSelfClosingElement(sourceNode) &&
      typescript.isIdentifier(sourceNode.tagName) &&
      sourceNode.tagName.text === "PlannerJoystick"
    ) {
      plannerJoystickWasFound = true;
      return;
    }

    typescript.forEachChild(sourceNode, visitJsxNode);
  }

  typescript.forEachChild(jsxElement, visitJsxNode);
  return plannerJoystickWasFound;
}

function createPreparedWorkspaceFixture(): PreparedPlannerWorkspace {
  let serializedProjectDocument = JSON.stringify(referenceProjectDocumentFixture);
  const repository = createReferenceProjectRepository({
    now: () => "2026-08-03T00:00:00.000Z",
    storage: {
      getItem: () => serializedProjectDocument,
      setItem: (_storageKey, nextSerializedProjectDocument) => {
        serializedProjectDocument = nextSerializedProjectDocument;
      },
    },
  });

  return {
    canvasResources: {
      pixi: {} as typeof import("pixi.js"),
      preparedMap: {
        mapId: "standard",
        parsedMap: {} as PreparedDefaultMap["parsedMap"],
        renderingContract: {} as PreparedDefaultMap["renderingContract"],
        season: "spring",
      },
      resourceGeneration: 1,
    },
    preferences: createInitialEditorPreferences(),
    projectState: {
      projects: repository.listProjects(),
      repository,
    },
    resourceGeneration: 1,
    buildingsCatalog: { items: [] },
    savePreferences: () => undefined,
  };
}

function createWorkspaceStateController(
  input: Readonly<{
    autoShowResourceClumps?: boolean;
    leftHandMode: boolean;
    panelPosition: "bottom" | "left";
    selectedCatalogItemId?: string | null;
  }>,
): PlannerWorkspaceStateController {
  const withoutPlacementCatalogRequirements = reducePlannerWorkspaceState(
    createInitialPlannerWorkspaceState(),
    {
      placementSnapshot: createEmptyPlacementSnapshot(),
      type: "reset-placement-history",
    },
  );
  const withBehaviorOption = reducePlannerWorkspaceState(
    withoutPlacementCatalogRequirements,
    {
      option: "leftHandMode",
      type: "set-behavior-option",
      value: input.leftHandMode,
    },
  );
  const withPanelPosition = reducePlannerWorkspaceState(
    withBehaviorOption,
    {
      panelPosition: input.panelPosition,
      type: "select-panel-position",
    },
  );
  const withResourceClumpBehavior = input.autoShowResourceClumps === undefined
    ? withPanelPosition
    : reducePlannerWorkspaceState(withPanelPosition, {
        option: "autoShowResourceClumps",
        type: "set-behavior-option",
        value: input.autoShowResourceClumps,
      });
  const plannerWorkspaceState = input.selectedCatalogItemId === undefined
    ? withResourceClumpBehavior
    : reducePlannerWorkspaceState(withResourceClumpBehavior, {
        catalogItemId: input.selectedCatalogItemId,
        type: "set-selected-catalog-item",
      });
  const rejectUnexpectedWorkspaceAction = (): never => {
    throw new Error("Static workspace layout rendering must not dispatch an action.");
  };

  return {
    applyPlacementEditResult: rejectUnexpectedWorkspaceAction,
    dispatchPlannerWorkspaceAction: rejectUnexpectedWorkspaceAction,
    plannerWorkspaceState,
    resetPlacementHistory: rejectUnexpectedWorkspaceAction,
    setSelectedPlacementKeys: rejectUnexpectedWorkspaceAction,
  };
}

function renderPreparedWorkspace(
  input: Readonly<{
    leftHandMode: boolean;
    panelPosition: "bottom" | "left";
    runtimeStatus?: "loading" | "ready" | "interactive";
  }>,
): string {
  const plannerWorkspaceRenderState: PlannerWorkspaceRenderState = {
    kind: "prepared",
    preparedWorkspace: createPreparedWorkspaceFixture(),
    runtimeStatus: input.runtimeStatus ?? "interactive",
  };

  return renderToStaticMarkup(
    createElement(PlannerWorkspaceStaticBoundary, {
      plannerWorkspaceRenderState,
      plannerWorkspaceStateController: createWorkspaceStateController(input),
    }),
  );
}

function getMobilePlannerWorkspaceStyles(plannerWorkspaceStyles: string): string {
  const mobileRuleStart = plannerWorkspaceStyles.lastIndexOf("@media (max-width: 640px)");

  if (mobileRuleStart === -1) {
    throw new Error("Expected the mobile planner workspace CSS rule.");
  }

  const openingBraceIndex = plannerWorkspaceStyles.indexOf("{", mobileRuleStart);
  let braceDepth = 0;

  for (
    let styleCharacterIndex = openingBraceIndex;
    styleCharacterIndex < plannerWorkspaceStyles.length;
    styleCharacterIndex += 1
  ) {
    const styleCharacter = plannerWorkspaceStyles[styleCharacterIndex];
    if (styleCharacter === "{") {
      braceDepth += 1;
    }
    if (styleCharacter === "}") {
      braceDepth -= 1;
      if (braceDepth === 0) {
        return plannerWorkspaceStyles.slice(mobileRuleStart, styleCharacterIndex + 1);
      }
    }
  }

  throw new Error("Mobile planner workspace CSS rule is not closed.");
}

describe("planner workspace frozen layout contracts", () => {
  it.each([
    ["loading", "false"],
    ["ready", "false"],
    ["interactive", "true"],
  ] as const)(
    "enables catalog thumbnails only for the %s runtime status",
    (runtimeStatus, expectedThumbnailState) => {
      const plannerWorkspaceMarkup = renderPreparedWorkspace({
        leftHandMode: false,
        panelPosition: "left",
        runtimeStatus,
      });

      expect(plannerWorkspaceMarkup).toContain(
        `data-catalog-thumbnails-enabled="${expectedThumbnailState}"`,
      );
    },
  );

  it("nests PlannerJoystick within the real planner-canvas root", () => {
    const plannerCanvasRootElement = getPlannerCanvasRootElement();
    const plannerCanvasClassNames = getStaticClassNamesFromJsxElement(
      plannerCanvasRootElement,
    );

    expect(plannerCanvasClassNames).toEqual(
      expect.arrayContaining(["planner-canvas", "canvas-container"]),
    );
    expect(containsPlannerJoystick(plannerCanvasRootElement)).toBe(true);
  });

  it("observes the selected map in the rendered boundary before the prepared-only branch", () => {
    const plannerWorkspaceRenderedBoundary =
      getPlannerWorkspaceRenderedBoundary();
    const boundaryStatements = plannerWorkspaceRenderedBoundary.body!.statements;
    const observationStatementIndex = boundaryStatements.findIndex(
      (statement) =>
        typescript.isExpressionStatement(statement) &&
        typescript.isCallExpression(statement.expression) &&
        typescript.isPropertyAccessExpression(statement.expression.expression) &&
        statement.expression.expression.name.text === "observeSelectedMapId",
    );
    const returnStatementIndex = boundaryStatements.findIndex(
      typescript.isReturnStatement,
    );

    expect(observationStatementIndex).toBeGreaterThanOrEqual(0);
    expect(returnStatementIndex).toBeGreaterThan(observationStatementIndex);

    const observationStatement = boundaryStatements[
      observationStatementIndex
    ];
    if (
      !typescript.isExpressionStatement(observationStatement) ||
      !typescript.isCallExpression(observationStatement.expression) ||
      !typescript.isPropertyAccessExpression(observationStatement.expression.expression)
    ) {
      throw new Error("Expected a direct selected-map observation call.");
    }

    expect(
      getPropertyAccessPath(observationStatement.expression.expression),
    ).toEqual([
      "cameraStateRetentionReference",
      "current",
      "observeSelectedMapId",
    ]);
    expect(observationStatement.expression.arguments).toHaveLength(1);
    expect(
      getPropertyAccessPath(observationStatement.expression.arguments[0]),
    ).toEqual([
      "plannerWorkspaceStateController",
      "plannerWorkspaceState",
      "selectedPlannerMapId",
    ]);
  });

  it("places the bottom catalog after the canvas in the desktop editor flex layout", () => {
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();

    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell:has\(\.item-catalog-panel--bottom\) \.planner-editor-canvas-area\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell:has\(\.item-catalog-panel--bottom\) \.planner-canvas\s*\{[^}]*flex:\s*1[^;}]*;[^}]*order:\s*1;[^}]*position:\s*relative;/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.bottom-wrapper\.item-catalog-panel--bottom\s*\{[^}]*order:\s*2;[^}]*width:\s*100%;/s,
    );
  });

  it("styles unavailable interior decor feedback above the editor toolbar", () => {
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();

    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.toolbar-wrapper\s*\{[^}]*z-index:\s*25;/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.planner-workspace__toast\s*\{[^}]*background:\s*var\(--bg-raised\);[^}]*border:\s*1px solid var\(--border-subtle\);[^}]*position:\s*absolute;[^}]*z-index:\s*26;/s,
    );
  });

  it("forwards the workspace-owned left-hand setting to the ready menu, catalog, and canvas", () => {
    const bottomLeftHandWorkspaceMarkup = renderPreparedWorkspace({
      leftHandMode: true,
      panelPosition: "bottom",
    });
    const leftPanelWorkspaceMarkup = renderPreparedWorkspace({
      leftHandMode: true,
      panelPosition: "left",
    });
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();

    expect(bottomLeftHandWorkspaceMarkup).toContain(
      'class="menu-bar editor-menu-bar left-hand"',
    );
    expect(bottomLeftHandWorkspaceMarkup).toContain(
      'class="bottom-wrapper item-catalog-panel item-catalog-panel--bottom left-hand"',
    );
    expect(bottomLeftHandWorkspaceMarkup).toContain(
      'data-planner-canvas-left-hand-mode="true"',
    );
    expect(leftPanelWorkspaceMarkup).toContain(
      'class="bottom-wrapper item-catalog-panel item-catalog-panel--left left-mode left-hand"',
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.menu-bar\.left-hand\s*\{[^}]*left:\s*var\(--lk-sm\);[^}]*right:\s*auto;/s,
    );
    expect(plannerWorkspaceStyles).toContain(
      ".planner-editor-shell .item-catalog-panel--bottom.left-hand .bottom-panel",
    );
    expect(plannerWorkspaceStyles).not.toContain(
      ".planner-editor-shell .left-hand .bottom-panel",
    );
    expect(plannerWorkspaceStyles).not.toContain(
      ".planner-editor-shell .left-hand .tab-icon.active::after",
    );
    expect(plannerWorkspaceStyles).not.toContain(
      ".planner-editor-shell .left-hand .panel-content",
    );
    expect(plannerWorkspaceStyles).not.toContain(
      ".planner-editor-shell .left-hand .search-container",
    );
    expect(plannerWorkspaceStyles).not.toContain(
      ".planner-editor-shell .left-hand .item-grid",
    );
  });

  it("shows resource-clump spawn locations only for an enabled selected resource clump", () => {
    const renderResourceClumpSelection = (
      selectedCatalogItemId: string | null,
      autoShowResourceClumps: boolean,
    ) => renderPreparedWorkspace({
      autoShowResourceClumps,
      leftHandMode: false,
      panelPosition: "left",
      selectedCatalogItemId,
    });

    expect(renderResourceClumpSelection("clump_600", true)).toContain(
      'data-planner-canvas-show-resource-clump-spawn-locations="true"',
    );
    expect(renderResourceClumpSelection("clump_622", true)).toContain(
      'data-planner-canvas-show-resource-clump-spawn-locations="false"',
    );
    expect(renderResourceClumpSelection(null, true)).toContain(
      'data-planner-canvas-show-resource-clump-spawn-locations="false"',
    );
    expect(renderResourceClumpSelection("object:390", true)).toContain(
      'data-planner-canvas-show-resource-clump-spawn-locations="false"',
    );
    expect(renderResourceClumpSelection("clump_600", false)).toContain(
      'data-planner-canvas-show-resource-clump-spawn-locations="false"',
    );
  });

  it("keeps the joystick within its shortened Canvas and mirrors only the mobile bottom search strip", () => {
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();
    const mobilePlannerWorkspaceStyles = getMobilePlannerWorkspaceStyles(
      plannerWorkspaceStyles,
    );

    expect(plannerWorkspaceStyles).not.toContain(
      ".planner-editor-shell:has(.item-catalog-panel--bottom) .planner-joystick.joystick-outer",
    );
    expect(mobilePlannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.planner-joystick\.joystick-outer\s*\{[^}]*bottom:\s*var\(--lk-xs\);/s,
    );
    expect(mobilePlannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.item-catalog-panel--bottom\.left-hand \.sidebar-search\s*\{[^}]*left:\s*auto;[^}]*right:\s*-49\.43px;/s,
    );
  });

  it("hides the joystick for fine pointers and reveals an eligible joystick for coarse pointers", () => {
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();
    const coarsePointerRule = plannerWorkspaceStyles.match(
      /@media \(pointer: coarse\)\s*\{([\s\S]*?)\n\}/,
    )?.[1];

    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.planner-joystick\.joystick-outer\s*\{[^}]*display:\s*none;/s,
    );
    expect(coarsePointerRule).toBeDefined();
    expect(coarsePointerRule).toMatch(
      /\.planner-editor-shell \.planner-joystick\.joystick-outer\s*\{[^}]*display:\s*block;/s,
    );
  });

  it("uses high-contrast homepage destructive treatments on light editor surfaces", () => {
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();

    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.tool-btn\.erase-hover:hover:not\(:disabled\):not\(\.active\)\s*\{[^}]*background:\s*rgb\(177 58 40 \/ 10%\);[^}]*color:\s*#b13a28;/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.tool-btn\.erase\s*\{[^}]*background:\s*rgb\(177 58 40 \/ 15%\);[^}]*color:\s*#b13a28;/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.pill-delete\s*\{[^}]*color:\s*#b13a28;/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.pill-delete:hover\s*\{[^}]*background:\s*rgb\(177 58 40 \/ 15%\);/s,
    );
  });

  it("uses the homepage foreground for the Help branding button", () => {
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();

    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.branding-btn\s*\{[^}]*background:\s*var\(--bg-deep\);[^}]*color:\s*var\(--foreground\);/s,
    );
    expect(plannerWorkspaceStyles).not.toMatch(/--text-body\s*:/);
  });

  it("does not show Help from the fine-pointer mobile breakpoint", () => {
    const mobilePlannerWorkspaceStyles = getMobilePlannerWorkspaceStyles(
      readPlannerWorkspaceStyles(),
    );

    expect(mobilePlannerWorkspaceStyles).not.toMatch(
      /\.planner-editor-shell \.help-bubble-wrapper\s*\{[^}]*display:\s*flex;/s,
    );
  });

  it("uses the frozen coarse-pointer catalog controls", () => {
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();
    const coarsePointerRule = plannerWorkspaceStyles.match(
      /@media \(pointer: coarse\)\s*\{([\s\S]*?)\n\}/,
    )?.[1];

    expect(coarsePointerRule).toBeDefined();
    expect(coarsePointerRule).toMatch(
      /\.planner-editor-shell \.keybind-footer\s*\{[^}]*display:\s*none;/s,
    );
    expect(coarsePointerRule).toMatch(
      /\.planner-editor-shell \.help-bubble-wrapper\s*\{[^}]*display:\s*flex;/s,
    );
    expect(coarsePointerRule).toMatch(
      /\.planner-editor-shell \.rotate-btn\s*\{[^}]*height:\s*24px;[^}]*width:\s*24px;/s,
    );
    expect(coarsePointerRule).toMatch(
      /\.planner-editor-shell \.flip-btn\s*\{[^}]*height:\s*24px;[^}]*width:\s*24px;/s,
    );
  });

  it("uses stable mobile canvas flow and 44px coarse-pointer targets without resizing the joystick", () => {
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();
    const mobilePlannerWorkspaceStyles = getMobilePlannerWorkspaceStyles(
      plannerWorkspaceStyles,
    );
    const coarseMobilePointerRule = plannerWorkspaceStyles.match(
      /@media \(pointer: coarse\) and \(max-width: 640px\)\s*\{([\s\S]*?)\n\}/,
    )?.[1];
    const compactCoarseMobilePointerRule = plannerWorkspaceStyles.match(
      /@media \(pointer: coarse\) and \(max-width: 394px\)\s*\{([\s\S]*?)\n\}/,
    )?.[1];
    const narrowToolbarPointerRule = plannerWorkspaceStyles.match(
      /@media \(pointer: coarse\) and \(max-width: 374px\)\s*\{([\s\S]*?)\n\}/,
    )?.[1];

    expect(mobilePlannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.planner-editor-canvas-area\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;/s,
    );
    expect(mobilePlannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.planner-canvas\s*\{[^}]*flex:\s*1[^;}]*;[^}]*order:\s*1;[^}]*position:\s*relative;/s,
    );
    expect(coarseMobilePointerRule).toBeDefined();
    expect(coarseMobilePointerRule).toMatch(
      /\.planner-editor-shell \.menu-btn,[\s\S]*?\.planner-editor-shell \.tool-btn\s*\{[^}]*height:\s*44px;[^}]*width:\s*44px;/s,
    );
    expect(coarseMobilePointerRule).toMatch(
      /\.planner-editor-shell \.toolbar-wrapper\s*\{[^}]*left:\s*var\(--lk-xs\);[^}]*transform:\s*none;/s,
    );
    expect(coarseMobilePointerRule).toMatch(
      /\.planner-editor-shell:has\(\.menu-bar\.left-hand\) \.toolbar-wrapper\s*\{[^}]*left:\s*auto;[^}]*right:\s*var\(--lk-xs\);/s,
    );
    expect(coarseMobilePointerRule).toMatch(
      /\.planner-editor-shell \.panel-tabs\s*\{[^}]*flex-basis:\s*52px;[^}]*gap:\s*1px;[^}]*padding:\s*4px;/s,
    );
    expect(coarseMobilePointerRule).toMatch(
      /\.planner-editor-shell \.tab-icon\s*\{[^}]*flex:\s*0 0 44px;[^}]*height:\s*44px;[^}]*width:\s*44px;/s,
    );
    expect(coarseMobilePointerRule).toMatch(
      /\.planner-editor-shell \.rotate-btn,[\s\S]*?\.planner-editor-shell \.flip-btn\s*\{[^}]*height:\s*44px;[^}]*width:\s*44px;/s,
    );
    expect(coarseMobilePointerRule).not.toContain(".planner-editor-shell .arrow-btn");
    expect(coarseMobilePointerRule).not.toContain(".planner-joystick");
    expect(compactCoarseMobilePointerRule).toBeDefined();
    expect(compactCoarseMobilePointerRule).toMatch(
      /\.planner-editor-shell \.item-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);/s,
    );
    expect(compactCoarseMobilePointerRule).not.toContain(".planner-joystick");
    expect(narrowToolbarPointerRule).toBeDefined();
    expect(narrowToolbarPointerRule).toMatch(
      /\.planner-editor-shell \.toolbar-wrapper\s*\{[^}]*top:\s*64px;/s,
    );
    expect(narrowToolbarPointerRule).not.toContain(".planner-joystick");
  });

  it("keeps the coarse mobile Help target above the canvas clip at 44 by 44 pixels", () => {
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();
    const coarseMobilePointerRule = plannerWorkspaceStyles.match(
      /@media \(pointer: coarse\) and \(max-width: 640px\)\s*\{([\s\S]*?)\n\}/,
    )?.[1];

    expect(coarseMobilePointerRule).toBeDefined();
    expect(coarseMobilePointerRule).toMatch(
      /\.planner-editor-shell \.bottom-wrapper\.item-catalog-panel--bottom\s*\{[^}]*overflow:\s*visible;/s,
    );
    expect(coarseMobilePointerRule).toMatch(
      /\.planner-editor-shell \.item-catalog-panel--bottom \.panel-content:has\(\.help-bubble-wrapper\)\s*\{[^}]*overflow:\s*visible;/s,
    );
    expect(coarseMobilePointerRule).toMatch(
      /\.planner-editor-shell \.help-bubble-wrapper\s*\{[^}]*z-index:\s*3;/s,
    );
    expect(coarseMobilePointerRule).toMatch(
      /\.planner-editor-shell \.help-bubble-wrapper > \.filter-btn\s*\{[^}]*height:\s*44px;[^}]*min-width:\s*44px;[^}]*width:\s*44px;/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.item-catalog-panel__content > \[role="tabpanel"\]\s*\{[^}]*overflow:\s*hidden;/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.item-grid\s*\{[^}]*overflow-y:\s*auto;/s,
    );
  });

  it("reserves the frozen safe-area-aware bottom heights for the canvas and controls", () => {
    const plannerWorkspaceStyles = readPlannerWorkspaceStyles();

    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell \.bottom-panel\s*\{[^}]*height:\s*calc\(220px \+ env\(safe-area-inset-bottom, 0px\)\);[^}]*padding-bottom:\s*env\(safe-area-inset-bottom, 0px\);/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /\.planner-editor-shell:has\(\.item-catalog-panel--bottom\) \.selection-inspector\s*\{[^}]*bottom:\s*calc\(232px \+ env\(safe-area-inset-bottom, 0px\)\);/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /@media \(max-width: 640px\)\s*\{[\s\S]*?\.planner-editor-shell \.bottom-panel\s*\{[^}]*height:\s*calc\(190px \+ env\(safe-area-inset-bottom, 0px\)\);/s,
    );
    expect(plannerWorkspaceStyles).toMatch(
      /@media \(max-width: 640px\)\s*\{[\s\S]*?\.planner-editor-shell \.selection-inspector\s*\{[^}]*bottom:\s*calc\(202px \+ env\(safe-area-inset-bottom, 0px\)\);/s,
    );
  });
});
