"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type CanvasContextMenuPoint = Readonly<{ x: number; y: number }>;

type PlannerCanvasContextMenuResizeObserver = Readonly<{
  disconnect(): void;
  observe(element: Element): void;
}>;

type PlannerCanvasContextMenuWindowPort = Readonly<{
  addEventListener(eventName: "resize", listener: () => void): void;
  removeEventListener(eventName: "resize", listener: () => void): void;
}>;

export function clampPlannerCanvasContextMenuPosition(
  input: Readonly<{
    canvasHost: Readonly<{ height: number; width: number }>;
    menu: Readonly<{ height: number; width: number }>;
    point: CanvasContextMenuPoint;
  }>,
): CanvasContextMenuPoint {
  const maximumX = Math.max(0, input.canvasHost.width - input.menu.width);
  const maximumY = Math.max(0, input.canvasHost.height - input.menu.height);

  return {
    x: Math.min(Math.max(input.point.x, 0), maximumX),
    y: Math.min(Math.max(input.point.y, 0), maximumY),
  };
}

export function getPlannerCanvasContextMenuRootPosition(
  input: Readonly<{
    canvasHostBoundingRectangle: Readonly<{ left: number; top: number }>;
    editorRootBoundingRectangle: Readonly<{ left: number; top: number }>;
    editorRootClientBorder: Readonly<{ left: number; top: number }>;
    point: CanvasContextMenuPoint;
  }>,
): CanvasContextMenuPoint {
  return {
    x:
      input.canvasHostBoundingRectangle.left -
      input.editorRootBoundingRectangle.left -
      input.editorRootClientBorder.left +
      input.point.x,
    y:
      input.canvasHostBoundingRectangle.top -
      input.editorRootBoundingRectangle.top -
      input.editorRootClientBorder.top +
      input.point.y,
  };
}

export function bindPlannerCanvasContextMenuPositionUpdates(
  input: Readonly<{
    canvasHostElement: Element;
    createResizeObserver?: (
      onResize: () => void,
    ) => PlannerCanvasContextMenuResizeObserver;
    editorRootElement: Element;
    onPositionUpdate: () => void;
    windowPort: PlannerCanvasContextMenuWindowPort;
  }>,
): () => void {
  let hasDisposed = false;
  const resizeObserver = input.createResizeObserver?.(input.onPositionUpdate);

  resizeObserver?.observe(input.canvasHostElement);
  resizeObserver?.observe(input.editorRootElement);
  input.windowPort.addEventListener("resize", input.onPositionUpdate);

  return (): void => {
    if (hasDisposed) {
      return;
    }
    hasDisposed = true;
    resizeObserver?.disconnect();
    input.windowPort.removeEventListener("resize", input.onPositionUpdate);
  };
}

export function shouldClosePlannerCanvasContextMenu(
  event: KeyboardEvent | PointerEvent,
  menuElement: HTMLElement,
): boolean {
  if ("key" in event) {
    return event.key === "Escape";
  }

  return !menuElement.contains(event.target as Node | null);
}

export function focusPlannerCanvasContextMenuItem(menuElement: HTMLElement): void {
  const menuItem = menuElement.querySelector<HTMLElement>('[role="menuitem"]');

  menuItem?.focus({ preventScroll: true });
}

export function restorePlannerCanvasContextMenuFocus(
  focusRestoreElement: HTMLCanvasElement | null,
): void {
  if (focusRestoreElement?.isConnected) {
    focusRestoreElement.focus({ preventScroll: true });
  }
}

export async function handlePlannerCanvasContextMenuCopyAction(
  onClose: () => void,
  onCopyFullMap: () => Promise<void>,
): Promise<void> {
  onClose();
  await onCopyFullMap();
}

export function PlannerCanvasContextMenu(
  properties: Readonly<{
    onClose: () => void;
    onCopyFullMap: () => Promise<void>;
    canvasHostElement: HTMLElement | null;
    editorRootElement: HTMLElement | null;
    focusRestoreElement: HTMLCanvasElement | null;
    position: CanvasContextMenuPoint;
  }>,
) {
  const menuElementReference = useRef<HTMLDivElement>(null);
  const [rootPosition, setRootPosition] = useState(properties.position);

  useLayoutEffect(() => {
    const canvasHostElement = properties.canvasHostElement;
    const editorRootElement = properties.editorRootElement;

    if (canvasHostElement === null || editorRootElement === null) {
      setRootPosition(properties.position);
      return;
    }

    const updatePosition = (): void => {
      const menuElement = menuElementReference.current;

      if (menuElement === null) {
        return;
      }

      const clampedPosition = clampPlannerCanvasContextMenuPosition({
        canvasHost: {
          height: canvasHostElement.clientHeight,
          width: canvasHostElement.clientWidth,
        },
        menu: {
          height: menuElement.offsetHeight,
          width: menuElement.offsetWidth,
        },
        point: properties.position,
      });

      setRootPosition(getPlannerCanvasContextMenuRootPosition({
        canvasHostBoundingRectangle: canvasHostElement.getBoundingClientRect(),
        editorRootBoundingRectangle: editorRootElement.getBoundingClientRect(),
        editorRootClientBorder: {
          left: editorRootElement.clientLeft,
          top: editorRootElement.clientTop,
        },
        point: clampedPosition,
      }));
    };

    updatePosition();

    return bindPlannerCanvasContextMenuPositionUpdates({
      canvasHostElement,
      createResizeObserver:
        typeof ResizeObserver === "undefined"
          ? undefined
          : (onResize) => new ResizeObserver(onResize),
      editorRootElement,
      onPositionUpdate: updatePosition,
      windowPort: window,
    });
  }, [properties.canvasHostElement, properties.editorRootElement, properties.position]);

  useLayoutEffect(() => {
    const menuElement = menuElementReference.current;

    if (menuElement === null) {
      return;
    }

    focusPlannerCanvasContextMenuItem(menuElement);

    return () => {
      restorePlannerCanvasContextMenuFocus(properties.focusRestoreElement);
    };
  }, [properties.focusRestoreElement]);

  useEffect(() => {
    const closeForKeyboardEvent = (keyboardEvent: KeyboardEvent): void => {
      const menuElement = menuElementReference.current;

      if (
        menuElement !== null &&
        shouldClosePlannerCanvasContextMenu(keyboardEvent, menuElement)
      ) {
        properties.onClose();
      }
    };
    const closeForOutsidePointerEvent = (pointerEvent: PointerEvent): void => {
      const menuElement = menuElementReference.current;

      if (
        menuElement !== null &&
        shouldClosePlannerCanvasContextMenu(pointerEvent, menuElement)
      ) {
        properties.onClose();
      }
    };

    document.addEventListener("keydown", closeForKeyboardEvent);
    document.addEventListener("pointerdown", closeForOutsidePointerEvent);

    return () => {
      document.removeEventListener("keydown", closeForKeyboardEvent);
      document.removeEventListener("pointerdown", closeForOutsidePointerEvent);
    };
  }, [properties.onClose]);

  function handleCopyFullMap(): void {
    void handlePlannerCanvasContextMenuCopyAction(
      properties.onClose,
      properties.onCopyFullMap,
    );
  }

  const menu = (
    <div
      aria-label="Map actions"
      data-planner-canvas-context-menu="true"
      data-planner-canvas-context-menu-layer="editor-root"
      ref={menuElementReference}
      role="menu"
      style={{
        left: rootPosition.x,
        pointerEvents: "auto",
        position: "absolute",
        top: rootPosition.y,
        zIndex: 40,
      }}
    >
      <button onClick={handleCopyFullMap} role="menuitem" type="button">
        Copy full map
      </button>
    </div>
  );

  if (typeof document === "undefined" || properties.editorRootElement === null) {
    return menu;
  }

  return createPortal(menu, properties.editorRootElement);
}
