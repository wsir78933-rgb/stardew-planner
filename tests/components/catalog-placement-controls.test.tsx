import {
  Children,
  isValidElement,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type {
  CatalogItem,
  CatalogPresentationChoice,
} from "../../src/catalog";
import { CatalogPlacementControls } from "../../src/components/catalog-placement-controls";

type PlacementControlButtonProperties = Readonly<{
  "aria-label": string;
  "data-control"?: "rotation" | "variant";
  onClick?: (mouseEvent: MouseEvent<HTMLButtonElement>) => void;
}>;

const defaultPresentationChoice: CatalogPresentationChoice = {
  flipped: false,
  rotation: 0,
  variant: 0,
};

describe("catalog placement controls", () => {
  it("renders nothing when there is no pending catalog item", () => {
    expect(CatalogPlacementControls({
      catalogItem: null,
      isFilling: false,
      locale: "en",
      onCancel: () => undefined,
      onCyclePendingChoice: () => true,
      presentationChoice: null,
    })).toBeNull();
  });

  it("fails with the item ID when a pending item has no presentation choice", () => {
    const catalogItem = {
      ...createCatalogItem({ name: "Oak Chair", rotationCount: 0, variantLabels: [] }),
      id: "furniture_OakChair",
    };

    expect(() => CatalogPlacementControls({
      catalogItem,
      isFilling: false,
      locale: "en",
      onCancel: () => undefined,
      onCyclePendingChoice: () => true,
      presentationChoice: null,
    })).toThrow("furniture_OakChair");
  });

  it("uses the same spaced base name in the pending status as in the catalog", () => {
    const catalogItem = {
      ...createCatalogItem({ name: "JojaBed", rotationCount: 0, variantLabels: [] }),
      id: "furniture_JojaBed",
    };
    const placementControls = CatalogPlacementControls({
      catalogItem,
      isFilling: false,
      locale: "en",
      onCancel: () => undefined,
      onCyclePendingChoice: () => true,
      presentationChoice: defaultPresentationChoice,
    });

    expect(renderToStaticMarkup(placementControls)).toContain("Placing Joja Bed");
    expect(catalogItem.name).toBe("JojaBed");
  });

  it("uses rotation before variants and wires the pending action and cancel callbacks", () => {
    const catalogItem = createCatalogItem({
      name: "Oak Chair",
      rotationCount: 4,
      variantLabels: ["Base", "Alternate"],
    });
    let cycleCallCount = 0;
    let cancelCallCount = 0;
    const placementControls = CatalogPlacementControls({
      catalogItem,
      isFilling: false,
      locale: "en",
      onCancel: () => {
        cancelCallCount += 1;
      },
      onCyclePendingChoice: () => {
        cycleCallCount += 1;
        return true;
      },
      presentationChoice: defaultPresentationChoice,
    });
    if (placementControls === null) {
      throw new Error("Expected placement controls for the pending Oak Chair.");
    }

    const placementControlsMarkup = renderToStaticMarkup(placementControls);
    const [primaryActionButton, cancelButton] = getPlacementActionButtons(placementControls);
    if (primaryActionButton === undefined || cancelButton === undefined) {
      throw new Error("Expected primary and cancel buttons for a rotatable item.");
    }

    expect(placementControlsMarkup).toContain('class="catalog-placement-controls selection-pill"');
    expect(placementControlsMarkup).toContain("Placing Oak Chair");
    expect(placementControlsMarkup).toContain("Click to place · Esc to cancel");
    expect(placementControlsMarkup).toContain(
      'd="M20 16A8.94 8.94 0 1 1 20 8M20 4V8H16"',
    );
    expect(primaryActionButton.props["data-control"]).toBe("rotation");
    expect(primaryActionButton.props["aria-label"]).toBe("Rotate");
    expect(cancelButton.props["aria-label"]).toBe("Cancel placement (Esc)");

    primaryActionButton.props.onClick?.({} as MouseEvent<HTMLButtonElement>);
    cancelButton.props.onClick?.({} as MouseEvent<HTMLButtonElement>);
    expect(cycleCallCount).toBe(1);
    expect(cancelCallCount).toBe(1);
  });

  it("shows the localized tree variant action while keeping the item name in English", () => {
    const catalogItem = createCatalogItem({
      name: "Cherry Sapling",
      rotationCount: 0,
      variantLabels: ["No Fruit", "Fruit"],
    });
    const placementControls = CatalogPlacementControls({
      catalogItem,
      isFilling: false,
      locale: "zh-CN",
      onCancel: () => undefined,
      onCyclePendingChoice: () => true,
      presentationChoice: defaultPresentationChoice,
    });
    if (placementControls === null) {
      throw new Error("Expected placement controls for the pending Cherry Sapling.");
    }

    const placementControlsMarkup = renderToStaticMarkup(placementControls);
    const [variantActionButton, cancelButton] = getPlacementActionButtons(placementControls);
    if (variantActionButton === undefined || cancelButton === undefined) {
      throw new Error("Expected variant and cancel buttons for a variant item.");
    }

    expect(placementControlsMarkup).toContain("正在放置Cherry Sapling");
    expect(placementControlsMarkup).toContain("点击放置 · 按 Esc 取消");
    expect(placementControlsMarkup).toContain(
      'd="M3 7H21M17 3L21 7L17 11M21 17H3M7 13L3 17L7 21"',
    );
    expect(variantActionButton.props["data-control"]).toBe("variant");
    expect(variantActionButton.props["aria-label"]).toBe("变体");
    expect(cancelButton.props["aria-label"]).toBe("取消放置（Esc）");
  });

  it("keeps Cancel available when an item has no presentation action", () => {
    const placementControls = CatalogPlacementControls({
      catalogItem: createCatalogItem({
        name: "Stone",
        rotationCount: 0,
        variantLabels: [],
      }),
      isFilling: false,
      locale: "en",
      onCancel: () => undefined,
      onCyclePendingChoice: () => true,
      presentationChoice: defaultPresentationChoice,
    });
    if (placementControls === null) {
      throw new Error("Expected placement controls for the pending Stone.");
    }

    const actionButtons = getPlacementActionButtons(placementControls);
    expect(actionButtons).toHaveLength(1);
    expect(actionButtons[0]?.props["aria-label"]).toBe("Cancel placement (Esc)");
    expect(renderToStaticMarkup(placementControls)).not.toContain("data-control=");
  });

  it("shows the localized fill action status and drag hint", () => {
    const englishFillControls = CatalogPlacementControls({
      catalogItem: createCatalogItem({
        name: "Oak Chair",
        rotationCount: 0,
        variantLabels: [],
      }),
      isFilling: true,
      locale: "en",
      onCancel: () => undefined,
      onCyclePendingChoice: () => true,
      presentationChoice: defaultPresentationChoice,
    });
    const chineseFillControls = CatalogPlacementControls({
      catalogItem: createCatalogItem({
        name: "Oak Chair",
        rotationCount: 0,
        variantLabels: [],
      }),
      isFilling: true,
      locale: "zh-CN",
      onCancel: () => undefined,
      onCyclePendingChoice: () => true,
      presentationChoice: defaultPresentationChoice,
    });

    expect(renderToStaticMarkup(englishFillControls)).toContain("Filling Oak Chair");
    expect(renderToStaticMarkup(englishFillControls)).toContain(
      "Drag to fill · Esc to cancel",
    );
    expect(renderToStaticMarkup(chineseFillControls)).toContain("正在填充Oak Chair");
    expect(renderToStaticMarkup(chineseFillControls)).toContain("拖动填充 · 按 Esc 取消");
  });

  it("shows the sprite for the current presentation choice", () => {
    const catalogItem: CatalogItem = {
      ...createCatalogItem({
        name: "Coffee Table",
        rotationCount: 2,
        variantLabels: [],
      }),
      renderingMetadata: {
        bedType: null,
        compositeSprite: null,
        furnitureType: "table",
        indoors: true,
        isLongTable: false,
        isRug: false,
        isTable: true,
        kind: "furniture",
        outdoors: true,
        rotationSprites: [
          { sprite: { kind: "source-rect", x: 0, y: 0, width: 32, height: 16 } },
          { sprite: { kind: "source-rect", x: 32, y: 0, width: 16, height: 32 } },
        ],
        rotationTileSizes: [
          { width: 2, height: 1 },
          { width: 1, height: 2 },
        ],
        wallMounted: false,
      },
    };
    const rotatedPresentationChoice: CatalogPresentationChoice = {
      flipped: false,
      rotation: 1,
      variant: 0,
    };
    const placementControls = CatalogPlacementControls({
      catalogItem,
      isFilling: false,
      locale: "en",
      onCancel: () => undefined,
      onCyclePendingChoice: () => true,
      presentationChoice: rotatedPresentationChoice,
    });
    if (placementControls === null) {
      throw new Error("Expected placement controls for the pending Coffee Table.");
    }

    const thumbnail = getPlacementThumbnail(placementControls);
    expect(thumbnail.props.style).toMatchObject({
      backgroundImage: 'url("/game-assets/test.png")',
      backgroundPosition: "-32px 0px",
      height: 32,
      width: 16,
    });
  });
});

function getPlacementActionButtons(
  placementControls: ReactElement,
): readonly ReactElement<PlacementControlButtonProperties>[] {
  const placementControlsProperties = placementControls.props as Readonly<{
    children?: ReactNode;
  }>;
  const placementControlsChildren = Children.toArray(
    placementControlsProperties.children,
  );
  const actionContainer = placementControlsChildren[2];
  if (!isValidElement<{ children?: ReactNode }>(actionContainer)) {
    throw new Error("Pending catalog pill has no action container.");
  }

  const actionButtons = Children.toArray(actionContainer.props.children).filter(
    (actionButton): actionButton is ReactElement<PlacementControlButtonProperties> =>
      isValidElement<PlacementControlButtonProperties>(actionButton),
  );
  if (actionButtons.length === 0) {
    throw new Error("Pending catalog pill has no action buttons.");
  }
  return actionButtons;
}

function getPlacementThumbnail(
  placementControls: ReactElement,
): ReactElement<Readonly<{ style?: CSSProperties }>> {
  const placementControlsProperties = placementControls.props as Readonly<{
    children?: ReactNode;
  }>;
  const placementControlsChildren = Children.toArray(
    placementControlsProperties.children,
  );
  const thumbnailFrame = placementControlsChildren[0];
  if (!isValidElement<Readonly<{ children?: ReactNode }>>(thumbnailFrame)) {
    throw new Error("Pending catalog pill has no thumbnail frame.");
  }
  const thumbnailScale = Children.toArray(thumbnailFrame.props.children)[0];
  if (!isValidElement<Readonly<{ children?: ReactNode }>>(thumbnailScale)) {
    throw new Error("Pending catalog pill has no scaled thumbnail.");
  }
  const thumbnail = Children.toArray(thumbnailScale.props.children)[0];
  if (!isValidElement<Readonly<{ style?: CSSProperties }>>(thumbnail)) {
    throw new Error("Pending catalog pill has no sprite thumbnail.");
  }
  return thumbnail;
}

function createCatalogItem(input: Readonly<{
  name: string;
  rotationCount: number;
  variantLabels: readonly string[];
}>): CatalogItem {
  return {
    allowedTools: ["cursor"],
    category: "placeable",
    id: `test:${input.name}`,
    name: input.name,
    presentationCapabilities: {
      canFlip: false,
      rotation: input.rotationCount > 1
        ? {
            count: input.rotationCount,
            footprints: Array.from({ length: input.rotationCount }, () => ({
              width: 1,
              height: 1,
            })),
          }
        : null,
      variantCycle: input.variantLabels.length > 1
        ? { count: input.variantLabels.length, family: "generic" }
        : null,
      visibleVariants: input.variantLabels.map((label, variant) => ({
        label,
        renderDescriptor: { kind: "variant-index", variant },
        value: variant,
      })),
    },
    sprite: { kind: "sprite-index", index: 0 },
    textureLocalPath: "/game-assets/test.png",
    tileSize: { width: 1, height: 1 },
  };
}
