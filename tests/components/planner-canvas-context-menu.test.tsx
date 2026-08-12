import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

describe("PlannerCanvasContextMenu", () => {
  it("renders exactly the Copy full map action at the requested canvas point", async () => {
    const contextMenuModule = await import(
      "../../src/components/planner-canvas-context-menu"
    ).catch(() => null);

    expect(contextMenuModule?.PlannerCanvasContextMenu).toBeTypeOf("function");
    if (contextMenuModule === null) {
      return;
    }

    const markup = renderToStaticMarkup(
      createElement(contextMenuModule.PlannerCanvasContextMenu, {
        canvasHostElement: null,
        editorRootElement: null,
        focusRestoreElement: null,
        onClose: vi.fn(),
        onCopyFullMap: async () => undefined,
        position: { x: 120, y: 80 },
      }),
    );

    expect(markup).toContain('role="menu"');
    expect(markup).toContain("Copy full map");
    expect(markup).toContain("left:120px");
    expect(markup).toContain("top:80px");
    expect(markup).toContain("position:absolute");
    expect(markup).toContain("z-index:40");
    expect(markup).toContain('data-planner-canvas-context-menu="true"');
    expect(markup).toContain('data-planner-canvas-context-menu-layer="editor-root"');
    expect((markup.match(/role="menuitem"/g) ?? [])).toHaveLength(1);
  });

  it("clamps menu positions at every canvas-host edge", async () => {
    const contextMenuModule = await import(
      "../../src/components/planner-canvas-context-menu"
    );

    expect(contextMenuModule.clampPlannerCanvasContextMenuPosition).toBeTypeOf(
      "function",
    );
    if (contextMenuModule.clampPlannerCanvasContextMenuPosition === undefined) {
      return;
    }

    const dimensions = {
      canvasHost: { height: 200, width: 300 },
      menu: { height: 40, width: 100 },
    };

    expect(
      contextMenuModule.clampPlannerCanvasContextMenuPosition({
        ...dimensions,
        point: { x: -20, y: -10 },
      }),
    ).toEqual({ x: 0, y: 0 });
    expect(
      contextMenuModule.clampPlannerCanvasContextMenuPosition({
        ...dimensions,
        point: { x: 299, y: 199 },
      }),
    ).toEqual({ x: 200, y: 160 });
    expect(
      contextMenuModule.clampPlannerCanvasContextMenuPosition({
        ...dimensions,
        point: { x: 250, y: 20 },
      }),
    ).toEqual({ x: 200, y: 20 });
    expect(
      contextMenuModule.clampPlannerCanvasContextMenuPosition({
        ...dimensions,
        point: { x: 20, y: 190 },
      }),
    ).toEqual({ x: 20, y: 160 });
  });

  it("converts a clamped canvas point into editor-root coordinates", async () => {
    const contextMenuModule = await import(
      "../../src/components/planner-canvas-context-menu"
    );

    expect(contextMenuModule.getPlannerCanvasContextMenuRootPosition).toBeTypeOf(
      "function",
    );
    if (contextMenuModule.getPlannerCanvasContextMenuRootPosition === undefined) {
      return;
    }

    expect(
      contextMenuModule.getPlannerCanvasContextMenuRootPosition({
        canvasHostBoundingRectangle: { left: 264, top: 108 },
        editorRootBoundingRectangle: { left: 40, top: 30 },
        editorRootClientBorder: { left: 2, top: 2 },
        point: { x: 120, y: 80 },
      }),
    ).toEqual({ x: 342, y: 156 });
  });

  it("repositions on window resize and either observed layout boundary", async () => {
    const contextMenuModule = await import(
      "../../src/components/planner-canvas-context-menu"
    );

    expect(contextMenuModule.bindPlannerCanvasContextMenuPositionUpdates).toBeTypeOf(
      "function",
    );
    if (contextMenuModule.bindPlannerCanvasContextMenuPositionUpdates === undefined) {
      return;
    }

    const observedElements: Element[] = [];
    const windowListeners = new Set<() => void>();
    let observedResizeListener: (() => void) | undefined;
    let disconnectCount = 0;
    let positionUpdateCount = 0;
    const canvasHostElement = {} as Element;
    const editorRootElement = {} as Element;
    const cleanup = contextMenuModule.bindPlannerCanvasContextMenuPositionUpdates({
      canvasHostElement,
      createResizeObserver: (onResize) => {
        observedResizeListener = onResize;
        return {
        disconnect: () => {
          disconnectCount += 1;
        },
        observe: (element) => observedElements.push(element),
        };
      },
      editorRootElement,
      onPositionUpdate: () => {
        positionUpdateCount += 1;
      },
      windowPort: {
        addEventListener: (_eventName, listener) => windowListeners.add(listener),
        removeEventListener: (_eventName, listener) => windowListeners.delete(listener),
      },
    });

    expect(observedElements).toEqual([canvasHostElement, editorRootElement]);
    const windowResizeListener = [...windowListeners][0];
    if (windowResizeListener === undefined) {
      throw new Error("Expected one window resize listener.");
    }
    windowResizeListener();
    observedResizeListener?.();
    expect(positionUpdateCount).toBe(2);
    cleanup();
    cleanup();
    expect(disconnectCount).toBe(1);
    expect(windowListeners).toEqual(new Set());
  });

  it("focuses its action on open and restores focus to the Pixi canvas on close", async () => {
    const contextMenuModule = await import(
      "../../src/components/planner-canvas-context-menu"
    );

    expect(contextMenuModule.focusPlannerCanvasContextMenuItem).toBeTypeOf("function");
    expect(contextMenuModule.restorePlannerCanvasContextMenuFocus).toBeTypeOf("function");
    if (
      contextMenuModule.focusPlannerCanvasContextMenuItem === undefined ||
      contextMenuModule.restorePlannerCanvasContextMenuFocus === undefined
    ) {
      return;
    }

    const focusMenuItem = vi.fn();
    const menuElement = {
      querySelector: () => ({ focus: focusMenuItem }),
    } as unknown as HTMLElement;
    const focusCanvas = vi.fn();

    contextMenuModule.focusPlannerCanvasContextMenuItem(menuElement);
    contextMenuModule.restorePlannerCanvasContextMenuFocus({
      focus: focusCanvas,
      isConnected: true,
    } as unknown as HTMLCanvasElement);

    expect(focusMenuItem).toHaveBeenCalledWith({ preventScroll: true });
    expect(focusCanvas).toHaveBeenCalledWith({ preventScroll: true });
  });

  it("closes for Escape and pointer presses outside its own menu", async () => {
    const contextMenuModule = await import(
      "../../src/components/planner-canvas-context-menu"
    ).catch(() => null);

    expect(contextMenuModule?.shouldClosePlannerCanvasContextMenu).toBeTypeOf("function");
    if (contextMenuModule === null) {
      return;
    }

    const insideMenuTarget = {} as Node;
    const outsideMenuTarget = {} as Node;
    const menuElement = {
      contains: (eventTarget: Node | null) => eventTarget === insideMenuTarget,
    } as unknown as HTMLElement;

    expect(
      contextMenuModule.shouldClosePlannerCanvasContextMenu(
        { key: "Escape" } as KeyboardEvent,
        menuElement,
      ),
    ).toBe(true);
    expect(
      contextMenuModule.shouldClosePlannerCanvasContextMenu(
        { key: "Enter" } as KeyboardEvent,
        menuElement,
      ),
    ).toBe(false);
    expect(
      contextMenuModule.shouldClosePlannerCanvasContextMenu(
        { target: outsideMenuTarget } as unknown as PointerEvent,
        menuElement,
      ),
    ).toBe(true);
    expect(
      contextMenuModule.shouldClosePlannerCanvasContextMenu(
        { target: insideMenuTarget } as unknown as PointerEvent,
        menuElement,
      ),
    ).toBe(false);
  });

  it("closes before forwarding the Copy full map action", async () => {
    const contextMenuModule = await import(
      "../../src/components/planner-canvas-context-menu"
    );

    expect(contextMenuModule.handlePlannerCanvasContextMenuCopyAction).toBeTypeOf(
      "function",
    );
    if (contextMenuModule.handlePlannerCanvasContextMenuCopyAction === undefined) {
      return;
    }

    const actionOrder: string[] = [];
    await contextMenuModule.handlePlannerCanvasContextMenuCopyAction(
      () => actionOrder.push("close"),
      async () => {
        actionOrder.push("copy");
      },
    );

    expect(actionOrder).toEqual(["close", "copy"]);
  });
});
