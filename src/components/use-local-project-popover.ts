"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  intersectPopoverBounds,
  LIBRARY_POPOVER_GAP_PX,
  placeLibraryPopover,
  type LibraryPopoverPlacement,
  type PopoverBounds,
} from "./local-project-popover-position";

export type LibraryPopoverKind = "more" | "move";

export type OpenLibraryPopover = Readonly<{
  kind: LibraryPopoverKind;
  projectId: string;
}>;

export type LocalProjectPopoverController = Readonly<{
  assignMorePopoverElement: (popoverElement: HTMLDivElement | null) => void;
  assignMovePopoverElement: (popoverElement: HTMLDivElement | null) => void;
  close: () => void;
  isOpen: (kind: LibraryPopoverKind, projectId: string) => boolean;
  openPopover: OpenLibraryPopover | null;
  toggle: (
    kind: LibraryPopoverKind,
    projectId: string,
    triggerElement: HTMLButtonElement | null,
  ) => void;
}>;

type PopoverSize = Readonly<{
  width: number;
  height: number;
}>;

export function readLibraryPopoverDomId(
  kind: LibraryPopoverKind,
  projectId: string,
): string {
  if (kind !== "more" && kind !== "move") {
    throw new Error(
      `Cannot build a library popover id because kind is ${JSON.stringify(kind)}.`,
    );
  }
  if (projectId.length === 0) {
    throw new Error(
      `Cannot build a library popover id because projectId is ${JSON.stringify(projectId)}.`,
    );
  }

  return `local-project-${kind}-menu-${encodeLibraryPopoverProjectId(projectId)}`;
}

function encodeLibraryPopoverProjectId(projectId: string): string {
  let encodedProjectId = "";
  for (const character of projectId) {
    if (/^[A-Za-z0-9_-]$/.test(character)) {
      encodedProjectId += character;
      continue;
    }
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined) {
      throw new Error(
        `Cannot build a library popover id because projectId is ${JSON.stringify(projectId)}.`,
      );
    }
    encodedProjectId += `_${codePoint.toString(16)}_`;
  }
  return encodedProjectId;
}

export function useLocalProjectPopover(): LocalProjectPopoverController {
  const [openPopover, setOpenPopover] = useState<OpenLibraryPopover | null>(null);
  const triggerElementRef = useRef<HTMLButtonElement | null>(null);
  const morePopoverElementRef = useRef<HTMLDivElement | null>(null);
  const movePopoverElementRef = useRef<HTMLDivElement | null>(null);
  const assignMorePopoverElement = useCallback((popoverElement: HTMLDivElement | null) => {
    morePopoverElementRef.current = popoverElement;
  }, []);
  const assignMovePopoverElement = useCallback((popoverElement: HTMLDivElement | null) => {
    movePopoverElementRef.current = popoverElement;
  }, []);
  const close = useCallback(() => {
    setOpenPopover(null);
  }, []);
  const isOpen = useCallback((kind: LibraryPopoverKind, projectId: string) => {
    return openPopover?.kind === kind && openPopover.projectId === projectId;
  }, [openPopover]);
  const toggle = useCallback((
    kind: LibraryPopoverKind,
    projectId: string,
    triggerElement: HTMLButtonElement | null,
  ) => {
    readLibraryPopoverDomId(kind, projectId);
    triggerElementRef.current = triggerElement;
    setOpenPopover((currentPopover) => {
      if (currentPopover?.kind === kind && currentPopover.projectId === projectId) {
        return null;
      }
      return { kind, projectId };
    });
  }, []);

  useEffect(() => {
    if (openPopover === null) return;

    function dismissFromPointerDown(pointerEvent: PointerEvent): void {
      if (pointerEvent.button !== 0) return;

      const eventTarget = pointerEvent.target;
      if (!(eventTarget instanceof Node)) {
        throw new Error(
          `Cannot dismiss the library popover because the pointer target is ${JSON.stringify(eventTarget)}.`,
        );
      }
      if (isLibraryDeleteDialogOpen()) return;

      const popoverElement = readOpenPopoverElement(
        openPopover,
        morePopoverElementRef.current,
        movePopoverElementRef.current,
      );
      const triggerElement = triggerElementRef.current;
      if (popoverElement?.contains(eventTarget)) return;
      if (triggerElement?.contains(eventTarget)) return;

      setOpenPopover(null);
    }

    function dismissFromEscape(keyboardEvent: KeyboardEvent): void {
      if (keyboardEvent.key !== "Escape") return;
      if (isLibraryDeleteDialogOpen()) return;

      keyboardEvent.preventDefault();
      keyboardEvent.stopPropagation();
      if (keyboardEvent.repeat) return;

      const triggerElement = triggerElementRef.current;
      setOpenPopover(null);
      focusLibraryPopoverTrigger(triggerElement);
    }

    document.addEventListener("pointerdown", dismissFromPointerDown, true);
    document.addEventListener("keydown", dismissFromEscape, true);

    return () => {
      document.removeEventListener("pointerdown", dismissFromPointerDown, true);
      document.removeEventListener("keydown", dismissFromEscape, true);
    };
  }, [openPopover]);

  useLayoutEffect(() => {
    if (openPopover === null) return;

    const popoverKind = openPopover.kind;

    function placeOpenLibraryPopover(): void {
      const popoverElement = popoverKind === "more"
        ? morePopoverElementRef.current
        : movePopoverElementRef.current;
      const triggerElement = triggerElementRef.current;
      if (popoverElement === null || triggerElement === null) return;
      if (!popoverElement.isConnected || !triggerElement.isConnected) return;
      placeConnectedLibraryPopover(popoverElement, triggerElement);
    }

    function placeOpenLibraryPopoverFromScroll(scrollEvent: Event): void {
      const popoverElement = popoverKind === "more"
        ? morePopoverElementRef.current
        : movePopoverElementRef.current;
      if (scrollTargetIsInsidePopover(scrollEvent, popoverElement)) return;
      placeOpenLibraryPopover();
    }

    placeOpenLibraryPopover();
    document.addEventListener("scroll", placeOpenLibraryPopoverFromScroll, true);
    window.addEventListener("resize", placeOpenLibraryPopover);
    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener("resize", placeOpenLibraryPopover);
    visualViewport?.addEventListener("scroll", placeOpenLibraryPopoverFromScroll);

    return () => {
      document.removeEventListener("scroll", placeOpenLibraryPopoverFromScroll, true);
      window.removeEventListener("resize", placeOpenLibraryPopover);
      visualViewport?.removeEventListener("resize", placeOpenLibraryPopover);
      visualViewport?.removeEventListener("scroll", placeOpenLibraryPopoverFromScroll);
    };
  }, [openPopover]);

  return {
    assignMorePopoverElement,
    assignMovePopoverElement,
    close,
    isOpen,
    openPopover,
    toggle,
  };
}

function readOpenPopoverElement(
  openPopover: OpenLibraryPopover | null,
  morePopoverElement: HTMLDivElement | null,
  movePopoverElement: HTMLDivElement | null,
): HTMLElement | null {
  if (openPopover === null) return null;
  return openPopover.kind === "more" ? morePopoverElement : movePopoverElement;
}

function isLibraryDeleteDialogOpen(): boolean {
  return document.querySelector("[role='alertdialog']") !== null;
}

function focusLibraryPopoverTrigger(triggerElement: HTMLButtonElement | null): void {
  if (triggerElement === null) {
    throw new Error(
      "Cannot return library popover focus because the trigger button is null.",
    );
  }
  if (!triggerElement.isConnected) return;

  triggerElement.focus();
  if (document.activeElement !== triggerElement) {
    throw new Error(
      `Cannot return library popover focus because the active element is ${describeFocusTarget(document.activeElement)} instead of ${describeFocusTarget(triggerElement)}.`,
    );
  }
}

function placeConnectedLibraryPopover(
  popoverElement: HTMLElement,
  triggerElement: HTMLButtonElement,
): void {
  const naturalSize = readNaturalPopoverSize(popoverElement);
  if (naturalSize === null) return;

  const boundaryElement = readLibraryBoundaryElement(popoverElement);
  const boundaryBounds = intersectPopoverBounds(
    readPopoverBounds(boundaryElement.getBoundingClientRect()),
    readViewportBounds(),
  );
  if (
    boundaryBounds.right <= boundaryBounds.left
    || boundaryBounds.bottom <= boundaryBounds.top
  ) {
    return;
  }

  const placement = placeLibraryPopover({
    boundaryBounds,
    gapPx: LIBRARY_POPOVER_GAP_PX,
    popoverHeight: naturalSize.height,
    popoverWidth: naturalSize.width,
    triggerBounds: readPopoverBounds(triggerElement.getBoundingClientRect()),
  });
  const origin = readFixedContainingBlockOrigin(popoverElement);
  writeLibraryPopoverFrame(popoverElement, placement, naturalSize, origin);
}

function readNaturalPopoverSize(popoverElement: HTMLElement): PopoverSize | null {
  const measurementElement = createNaturalPopoverMeasurement(popoverElement);
  const parentElement = popoverElement.parentElement;
  if (parentElement === null) {
    throw new Error(
      `Cannot measure the library popover because its parent element is null. tagName=${popoverElement.tagName} id=${JSON.stringify(popoverElement.id)}.`,
    );
  }

  parentElement.insertBefore(measurementElement, popoverElement.nextSibling);
  try {
    const width = measurementElement.offsetWidth;
    const height = measurementElement.offsetHeight;
    if (width <= 0 || height <= 0) return null;
    return { width, height };
  } finally {
    measurementElement.remove();
  }
}

function createNaturalPopoverMeasurement(popoverElement: HTMLElement): HTMLElement {
  const clonedNode = popoverElement.cloneNode(true);
  if (!(clonedNode instanceof HTMLElement)) {
    throw new Error(
      `Cannot measure the library popover because the clone is ${clonedNode.nodeName}.`,
    );
  }

  clearMeasurementElementIds(clonedNode);
  clonedNode.setAttribute("data-library-popover-measurement", "true");
  clonedNode.setAttribute("aria-hidden", "true");
  clonedNode.setAttribute("inert", "");
  clonedNode.style.visibility = "hidden";
  clonedNode.style.pointerEvents = "none";
  clonedNode.style.position = "fixed";
  clonedNode.style.width = "max-content";
  clonedNode.style.boxSizing = "border-box";
  clonedNode.style.maxHeight = "none";
  clonedNode.style.maxWidth = "none";
  clonedNode.style.minWidth = "";
  clonedNode.style.overflowX = "visible";
  return clonedNode;
}

function clearMeasurementElementIds(measurementElement: HTMLElement): void {
  removeElementId(measurementElement);
  const identifiedElements = measurementElement.querySelectorAll("[id]");
  for (const identifiedElement of identifiedElements) {
    removeElementId(identifiedElement);
  }
}

function removeElementId(element: Element): void {
  if (element.id.length === 0 && !element.hasAttribute("id")) return;
  element.removeAttribute("id");
}

function scrollTargetIsInsidePopover(
  scrollEvent: Event,
  popoverElement: HTMLElement | null,
): boolean {
  if (popoverElement === null) return false;
  const scrollTarget = scrollEvent.target;
  return scrollTarget instanceof Node && popoverElement.contains(scrollTarget);
}

function readLibraryBoundaryElement(popoverElement: HTMLElement): HTMLElement {
  const dialogElement = popoverElement.closest("[role='dialog']");
  if (dialogElement instanceof HTMLElement) return dialogElement;

  const panelElement = popoverElement.closest(".local-project-panel");
  if (panelElement instanceof HTMLElement) return panelElement;

  throw new Error(
    "Cannot place the library popover because it is not inside a dialog or .local-project-panel.",
  );
}

function readViewportBounds(): PopoverBounds {
  const visualViewport = window.visualViewport;
  if (visualViewport === null) {
    return {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0,
    };
  }

  return {
    top: visualViewport.offsetTop,
    right: visualViewport.offsetLeft + visualViewport.width,
    bottom: visualViewport.offsetTop + visualViewport.height,
    left: visualViewport.offsetLeft,
  };
}

function readPopoverBounds(
  rect: Pick<DOMRect, "top" | "right" | "bottom" | "left">,
): PopoverBounds {
  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
  };
}

function readFixedContainingBlockOrigin(
  element: HTMLElement,
): Readonly<{ top: number; left: number }> {
  let ancestor = element.parentElement;
  while (ancestor !== null) {
    if (ancestorEstablishesFixedContainingBlock(ancestor)) {
      const ancestorBounds = ancestor.getBoundingClientRect();
      return { top: ancestorBounds.top, left: ancestorBounds.left };
    }
    ancestor = ancestor.parentElement;
  }

  return { top: 0, left: 0 };
}

function ancestorEstablishesFixedContainingBlock(ancestor: HTMLElement): boolean {
  const style = window.getComputedStyle(ancestor);
  if (style.transform !== "none") return true;
  if (style.filter !== "none") return true;
  if (style.perspective !== "none") return true;
  if (style.contentVisibility === "auto") return true;
  if (
    style.contain.includes("paint")
    || style.contain === "strict"
    || style.contain === "content"
  ) {
    return true;
  }

  return style.willChange.split(",").some((willChangeToken) => {
    const normalizedToken = willChangeToken.trim();
    return normalizedToken === "transform"
      || normalizedToken === "filter"
      || normalizedToken === "perspective"
      || normalizedToken === "contain";
  });
}

function writeLibraryPopoverFrame(
  popoverElement: HTMLElement,
  placement: LibraryPopoverPlacement,
  naturalSize: PopoverSize,
  origin: Readonly<{ top: number; left: number }>,
): void {
  popoverElement.style.position = "fixed";
  popoverElement.style.top = formatPopoverPx(placement.top - origin.top);
  popoverElement.style.right = "auto";
  popoverElement.style.bottom = "auto";
  popoverElement.style.left = formatPopoverPx(placement.left - origin.left);
  popoverElement.style.width = "max-content";
  popoverElement.style.boxSizing = "border-box";
  popoverElement.style.maxHeight = formatPopoverPx(placement.maxHeight);
  popoverElement.style.maxWidth = formatPopoverPx(placement.maxWidth);
  popoverElement.style.minWidth = placement.maxWidth + 0.5 < naturalSize.width ? "0px" : "";
  popoverElement.style.overflowX = naturalSize.width - placement.maxWidth > 0.5 ? "auto" : "visible";
  popoverElement.style.zIndex = "4";
}

function formatPopoverPx(value: number): string {
  if (!Number.isFinite(value)) {
    throw new Error(
      `Cannot write a library popover coordinate because the value is ${JSON.stringify(value)}.`,
    );
  }

  return `${value}px`;
}

function describeFocusTarget(element: Element | null): string {
  if (element === null) return "null";

  return `${element.tagName.toLowerCase()}[data-project-action=${JSON.stringify(element.getAttribute("data-project-action"))}, aria-label=${JSON.stringify(element.getAttribute("aria-label"))}]`;
}
