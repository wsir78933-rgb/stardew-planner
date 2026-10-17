import {
  Children,
  isValidElement,
  type ComponentProps,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  getLockedLitBigCraftableRenderingMetadata,
  type CatalogItem,
  type CatalogPresentationChoice,
} from "../../src/catalog";
import { fireAnimationFrames } from "../../src/rendering/fire-rendering-primitives";
import { createLitBigCraftablePlacementRenderLayers } from "../../src/rendering/lit-big-craftable-placement-rendering";
import type { PlacementItem } from "../../src/placement/placement-snapshot";
import { resolvePlannerTextureFrame } from "../../src/rendering/planner-texture-frame-resolution";
import { CatalogLitThumbnail } from "../../src/components/catalog-lit-thumbnail";
import {
  CatalogPlacementControls,
  getCatalogPlacementMode,
  type CatalogPlacementMode,
} from "../../src/components/catalog-placement-controls";

type PlacementControlButtonProperties = Readonly<{
  "aria-label": string;
  "data-control"?: "rotation" | "variant";
  onClick?: (mouseEvent: MouseEvent<HTMLButtonElement>) => void;
}>;

type PlacementThumbnailElement =
  | ReactElement<ComponentProps<typeof CatalogLitThumbnail>, typeof CatalogLitThumbnail>
  | ReactElement<ComponentProps<"span">, "span">;

function isPlacementThumbnailElement(
  element: unknown,
): element is PlacementThumbnailElement {
  return (
    isValidElement(element) &&
    (element.type === CatalogLitThumbnail || element.type === "span")
  );
}

const defaultPresentationChoice: CatalogPresentationChoice = {
  flipped: false,
  rotation: 0,
  variant: 0,
};

describe("catalog placement controls", () => {
  it("renders nothing when there is no pending catalog item", () => {
    expect(CatalogPlacementControls({
      catalogItem: null,
      placementMode: "place",
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
      placementMode: "place",
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
      placementMode: "place",
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
      placementMode: "place",
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
      placementMode: "place",
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
      placementMode: "place",
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
      placementMode: "fill",
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
      placementMode: "fill",
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

  it("maps Multi, Erase, and no tool away from place and fill", () => {
    expect(getCatalogPlacementMode("cursor")).toBe("place");
    expect(getCatalogPlacementMode("fill")).toBe("fill");
    expect(getCatalogPlacementMode("multi-select")).toBeNull();
    expect(getCatalogPlacementMode("erase")).toBeNull();
    expect(getCatalogPlacementMode(null)).toBeNull();
    expect(() => getCatalogPlacementMode("zoom" as never)).toThrow("zoom");
  });

  it("shows only the pending item name for Multi and Erase in English and Chinese", () => {
    const catalogItem = createCatalogItem({
      name: "Junimo Hut",
      rotationCount: 4,
      variantLabels: [],
    });
    const placeHints = [
      "Placing",
      "Click to place",
      "Filling",
      "Drag to fill",
      "正在放置",
      "点击放置",
      "正在填充",
      "拖动填充",
    ];
    let cycleCallCount = 0;
    let cancelCallCount = 0;

    for (const tool of ["multi-select", "erase"] as const) {
      for (const locale of ["en", "zh-CN"] as const) {
        const placementControls = CatalogPlacementControls({
          catalogItem,
          locale,
          onCancel: () => {
            cancelCallCount += 1;
          },
          onCyclePendingChoice: () => {
            cycleCallCount += 1;
            return true;
          },
          placementMode: getCatalogPlacementMode(tool),
          presentationChoice: defaultPresentationChoice,
        });
        if (placementControls === null) {
          throw new Error(
            `Expected pending controls for ${tool} in ${locale}.`,
          );
        }

        const placementControlsMarkup = renderToStaticMarkup(placementControls);
        const [rotationButton, cancelButton] = getPlacementActionButtons(placementControls);
        if (rotationButton === undefined || cancelButton === undefined) {
          throw new Error(
            `Expected rotation and cancel buttons for ${tool} in ${locale}.`,
          );
        }

        expect(getCatalogPlacementMode(tool)).toBeNull();
        expect(placementControlsMarkup).toContain("Junimo Hut");
        expect(placementControlsMarkup).toContain('aria-label="Junimo Hut"');
        expect(placementControlsMarkup).not.toContain("catalog-placement-controls__hint");
        for (const placeHint of placeHints) {
          expect(placementControlsMarkup).not.toContain(placeHint);
        }
        expect(rotationButton.props["data-control"]).toBe("rotation");
        expect(rotationButton.props["aria-label"]).toBe(locale === "en" ? "Rotate" : "旋转");
        expect(cancelButton.props["aria-label"]).toBe(
          locale === "en" ? "Cancel placement (Esc)" : "取消放置（Esc）",
        );
        rotationButton.props.onClick?.({} as MouseEvent<HTMLButtonElement>);
        cancelButton.props.onClick?.({} as MouseEvent<HTMLButtonElement>);
      }
    }

    expect(cycleCallCount).toBe(4);
    expect(cancelCallCount).toBe(4);
  });

  it("rejects a placement mode outside place, fill, and null", () => {
    expect(() => CatalogPlacementControls({
      catalogItem: createCatalogItem({
        name: "Stone",
        rotationCount: 0,
        variantLabels: [],
      }),
      locale: "en",
      onCancel: () => undefined,
      onCyclePendingChoice: () => true,
      placementMode: "multi-select" as CatalogPlacementMode,
      presentationChoice: defaultPresentationChoice,
    })).toThrow('"multi-select"');
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
      placementMode: "place",
      locale: "en",
      onCancel: () => undefined,
      onCyclePendingChoice: () => true,
      presentationChoice: rotatedPresentationChoice,
    });
    if (placementControls === null) {
      throw new Error("Expected placement controls for the pending Coffee Table.");
    }

    const thumbnail = getPlacementThumbnail(placementControls);
    if (thumbnail.type !== "span") {
      throw new Error(
        `Expected standard span thumbnail for ${catalogItem.id}; received ${String(thumbnail.type)}.`,
      );
    }
    expect(thumbnail.props.style).toMatchObject({
      backgroundImage: 'url("/game-assets/test.png")',
      backgroundPosition: "-32px 0px",
      height: 32,
      width: 16,
    });
  });

  it("shows the same static lit flames as placement and keeps the variant button", () => {
    const campfire = createLitBigCraftableCard("146");
    const carvedBrazier = createLitBigCraftableCard("148");
    const litChoice: CatalogPresentationChoice = {
      flipped: false,
      rotation: 0,
      variant: 0,
    };
    const unlitChoice: CatalogPresentationChoice = {
      flipped: false,
      rotation: 0,
      variant: 1,
    };

    const litCampfire = renderPlacementControls(campfire, litChoice);
    if (litCampfire === null) {
      throw new Error(
        `Expected placement controls for lit ${campfire.id}; received ${String(litCampfire)}.`,
      );
    }
    const unlitCampfire = renderPlacementControls(campfire, unlitChoice);
    if (unlitCampfire === null) {
      throw new Error(
        `Expected placement controls for unlit ${campfire.id}; received ${String(unlitCampfire)}.`,
      );
    }
    const litBrazier = renderPlacementControls(carvedBrazier, litChoice);
    if (litBrazier === null) {
      throw new Error(
        `Expected placement controls for lit ${carvedBrazier.id}; received ${String(litBrazier)}.`,
      );
    }
    const litFlames = readRenderedFlameStyles(litCampfire);
    const unlitFlames = readRenderedFlameStyles(unlitCampfire);
    const brazierFlames = readRenderedFlameStyles(litBrazier);

    expect(litFlames).toHaveLength(3);
    expect(unlitFlames).toHaveLength(0);
    expect(brazierFlames).toHaveLength(1);
    expect(getPlacementActionButtons(litCampfire).map((button) => button.props["data-control"]))
      .toEqual(["variant", undefined]);
    expectFlameStylesToMatchPlacement(campfire, litChoice, litFlames);
    expectFlameStylesToMatchPlacement(carvedBrazier, litChoice, brazierFlames);
    expect(renderToStaticMarkup(litCampfire).match(/catalog-lit-thumbnail__flame/g)).toHaveLength(3);
    expect(renderToStaticMarkup(unlitCampfire)).not.toContain("catalog-lit-thumbnail__flame");
    expect(renderToStaticMarkup(unlitCampfire)).toContain("catalog-lit-thumbnail__body");
  });
});

function renderPlacementControls(
  catalogItem: CatalogItem,
  presentationChoice: CatalogPresentationChoice,
) {
  return CatalogPlacementControls({
    catalogItem,
    locale: "en",
    onCancel: () => undefined,
    onCyclePendingChoice: () => true,
    placementMode: "place",
    presentationChoice,
  });
}

function readRenderedFlameStyles(
  placementControls: ReturnType<typeof CatalogPlacementControls>,
): readonly CSSProperties[] {
  if (placementControls === null) {
    throw new Error(
      `Expected placement controls for a lit catalog item; received ${String(placementControls)}.`,
    );
  }
  const thumbnail = getPlacementThumbnail(placementControls);
  if (thumbnail.type !== CatalogLitThumbnail) {
    throw new Error(
      `Lit placement pill did not render CatalogLitThumbnail; received ${String(thumbnail.type)}.`,
    );
  }
  const renderedThumbnail = CatalogLitThumbnail(thumbnail.props);
  return Children.toArray(renderedThumbnail.props.children).flatMap((child) => {
    if (!isValidElement<{ className?: string; style?: CSSProperties }>(child)) {
      return [];
    }
    if (child.props.className !== "catalog-lit-thumbnail__flame") {
      return [];
    }
    if (child.props.style === undefined) {
      throw new Error("Lit placement flame is missing its crop style.");
    }
    return [child.props.style];
  });
}

function expectFlameStylesToMatchPlacement(
  catalogItem: CatalogItem,
  presentationChoice: CatalogPresentationChoice,
  flameStyles: readonly CSSProperties[],
): void {
  const staticFireFrame = fireAnimationFrames[0];
  if (staticFireFrame === undefined) {
    throw new Error("Static fire animation frame 0 is missing.");
  }
  const placementItem: PlacementItem = {
    bedType: null,
    flipped: false,
    footprint: { height: 1, width: 1 },
    instanceId: 0,
    isGrass: false,
    isLongTable: false,
    isRug: false,
    isTable: false,
    itemId: catalogItem.id,
    layer: "item",
    locked: false,
    rotation: 0,
    tintColor: "#ffffff",
    variant: presentationChoice.variant,
    x: 0,
    y: 0,
  };
  const baseFrame = catalogItem.sprite.kind === "sprite-index"
    ? {
        height: 32,
        width: 16,
        x: (catalogItem.sprite.index % 8) * 16,
        y: Math.floor(catalogItem.sprite.index / 8) * 32,
      }
    : null;
  const renderLayers = createLitBigCraftablePlacementRenderLayers(
    catalogItem,
    placementItem,
    baseFrame,
  );
  if (renderLayers === null) {
    throw new Error(`Expected placement layers for ${catalogItem.id}.`);
  }
  const baseLayer = renderLayers[0];
  if (baseLayer?.frame === null || baseLayer === undefined) {
    throw new Error(`Expected a body layer for ${catalogItem.id}.`);
  }
  const flameLayers = renderLayers.filter((renderLayer) =>
    renderLayer.frame?.x === staticFireFrame.x
    && renderLayer.frame.y === staticFireFrame.y
    && renderLayer.frame.width === staticFireFrame.width
    && renderLayer.frame.height === staticFireFrame.height
  );
  const flameTexturePath = flameLayers[0]?.textureLocalPath;
  if (flameTexturePath === undefined) {
    throw new Error(`Expected a cursor texture for ${catalogItem.id}.`);
  }
  const resolvedFlame = resolvePlannerTextureFrame(flameTexturePath, staticFireFrame);
  const bodyScale = readPlacementThumbnailBox(catalogItem, presentationChoice) / baseLayer.frame.width;

  expect(flameStyles).toHaveLength(flameLayers.length);
  flameStyles.forEach((flameStyle, flameIndex) => {
    const flameLayer = flameLayers[flameIndex];
    if (flameLayer === undefined) {
      throw new Error(`Missing placement flame ${String(flameIndex)} for ${catalogItem.id}.`);
    }
    const uniformScale = flameLayer.pixelGeometry.uniformScale ?? 1;
    expect(flameStyle).toMatchObject({
      backgroundImage: `url(${JSON.stringify(resolvedFlame.resolvedAssetPath)})`,
      backgroundPosition: `-${String(staticFireFrame.x)}px -${String(staticFireFrame.y)}px`,
      height: staticFireFrame.height,
      left: (flameLayer.pixelGeometry.positionX - baseLayer.pixelGeometry.positionX) * bodyScale,
      top: (flameLayer.pixelGeometry.positionY - baseLayer.pixelGeometry.positionY) * bodyScale,
      transform: `scale(${String(uniformScale * bodyScale)})`,
      width: staticFireFrame.width,
    });
  });
}

function readPlacementThumbnailBox(
  catalogItem: CatalogItem,
  presentationChoice: CatalogPresentationChoice,
): number {
  const placementControls = renderPlacementControls(catalogItem, presentationChoice);
  if (placementControls === null) {
    throw new Error(
      `Expected placement controls for ${catalogItem.id}; received ${String(placementControls)}.`,
    );
  }
  const thumbnail = getPlacementThumbnail(placementControls);
  if (thumbnail.type !== CatalogLitThumbnail) {
    throw new Error(
      `Expected CatalogLitThumbnail for ${catalogItem.id}; received ${String(thumbnail.type)}.`,
    );
  }
  const renderedThumbnail = CatalogLitThumbnail(thumbnail.props);
  const bodyWidth = renderedThumbnail.props.style?.width;
  if (typeof bodyWidth !== "number") {
    throw new Error(
      `Expected a numeric lit thumbnail width for ${catalogItem.id}; received ${JSON.stringify(bodyWidth)}.`,
    );
  }
  return bodyWidth;
}

function createLitBigCraftableCard(recordId: "146" | "148"): CatalogItem {
  const renderingMetadata = getLockedLitBigCraftableRenderingMetadata(recordId);
  if (renderingMetadata === undefined) {
    throw new Error(`Expected locked lit metadata for big-craftable:${recordId}.`);
  }
  return {
    allowedTools: ["cursor"],
    category: "placeable",
    id: `big-craftable:${recordId}`,
    name: recordId === "146" ? "Campfire" : "Carved Brazier",
    presentationCapabilities: {
      canFlip: false,
      rotation: null,
      variantCycle: { count: 2, family: "generic" },
      visibleVariants: [
        {
          label: "Lit",
          renderDescriptor: { kind: "variant-index", variant: 0 },
          value: 0,
        },
        {
          label: "Unlit",
          renderDescriptor: { kind: "variant-index", variant: 1 },
          value: 1,
        },
      ],
    },
    renderingMetadata,
    sprite: { kind: "sprite-index", index: Number(recordId) },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/craftables.png",
    tileSize: { height: 1, width: 1 },
  };
}

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
): PlacementThumbnailElement {
  const placementControlsProperties = placementControls.props as Readonly<{
    children?: ReactNode;
  }>;
  const placementControlsChildren = Children.toArray(
    placementControlsProperties.children,
  );
  const thumbnailFrame = placementControlsChildren[0];
  if (!isValidElement<Readonly<{ children?: ReactNode }>>(thumbnailFrame)) {
    throw new Error(
      `Pending catalog pill has no thumbnail frame; received ${String(thumbnailFrame)}.`,
    );
  }
  const thumbnailScale = Children.toArray(thumbnailFrame.props.children)[0];
  if (!isValidElement<Readonly<{ children?: ReactNode }>>(thumbnailScale)) {
    throw new Error(
      `Pending catalog pill has no scaled thumbnail; received ${String(thumbnailScale)}.`,
    );
  }
  const thumbnail = Children.toArray(thumbnailScale.props.children)[0];
  if (!isPlacementThumbnailElement(thumbnail)) {
    throw new Error(
      `Pending catalog pill has no sprite thumbnail; received ${String(thumbnail)}.`,
    );
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
