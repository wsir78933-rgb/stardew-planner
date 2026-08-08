import { describe, expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import {
  advanceWorkspaceCatalogPlacementAttempt,
  changeWorkspaceCatalogItemChoice,
  clearWorkspaceCatalogSelection,
  createInitialWorkspaceCatalogChoiceState,
  cyclePendingWorkspaceCatalogChoice,
  selectWorkspaceCatalogItem,
} from "../../src/planner/planner-workspace-catalog-controls";

describe("planner workspace catalog controls", () => {
  it("resolves one composite variant per selected placement attempt", () => {
    const compositeCatalogItem = createCompositeCatalogItem();
    const firstAttemptFractions = [15 / 16, 9 / 24, 11 / 24];
    let firstAttemptSampleIndex = 0;

    const selectedState = selectWorkspaceCatalogItem(
      createInitialWorkspaceCatalogChoiceState(),
      compositeCatalogItem,
      () => firstAttemptFractions[firstAttemptSampleIndex++]!,
    );
    const choiceChangedState = changeWorkspaceCatalogItemChoice(
      selectedState,
      compositeCatalogItem,
      { flipped: false, rotation: 0, variant: 0 },
    );
    const nextAttemptState = advanceWorkspaceCatalogPlacementAttempt(
      choiceChangedState,
      () => 0,
    );

    expect(firstAttemptSampleIndex).toBe(3);
    expect(selectedState.selectedCatalogItem).toMatchObject({
      catalogItem: compositeCatalogItem,
      resolvedCompositeVariant: 4383,
    });
    expect(choiceChangedState.selectedCatalogItem?.resolvedCompositeVariant)
      .toBe(4383);
    expect(nextAttemptState.selectedCatalogItem?.resolvedCompositeVariant)
      .toBe(0);
  });

  it("remembers each item choice, updates only the matching active selection, and retains choices when cleared", () => {
    const treeItem = createCatalogItem("fruittree_628", {
      canFlip: true,
      rotation: null,
      variantCycle: { count: 2, family: "tree" },
      visibleVariants: [
        createVisibleVariant(0, "No Fruit"),
        createVisibleVariant(1, "Fruit"),
      ],
    });
    const furnitureItem = createCatalogItem("furniture_724", {
      canFlip: false,
      rotation: {
        count: 2,
        footprints: [
          { width: 2, height: 1 },
          { width: 1, height: 2 },
        ],
      },
      variantCycle: null,
      visibleVariants: [],
    });
    let catalogChoiceState = createInitialWorkspaceCatalogChoiceState();
    catalogChoiceState = selectWorkspaceCatalogItem(catalogChoiceState, treeItem);
    catalogChoiceState = changeWorkspaceCatalogItemChoice(
      catalogChoiceState,
      treeItem,
      { flipped: true, rotation: 0, variant: 1 },
    );
    catalogChoiceState = selectWorkspaceCatalogItem(
      catalogChoiceState,
      furnitureItem,
    );

    expect(catalogChoiceState.selectedCatalogItem).toEqual({
      catalogItem: furnitureItem,
      presentationChoice: { flipped: false, rotation: 0, variant: 0 },
    });
    expect(catalogChoiceState.presentationChoicesByItemId.get(treeItem.id)).toEqual({
      flipped: true,
      rotation: 0,
      variant: 1,
    });

    catalogChoiceState = changeWorkspaceCatalogItemChoice(
      catalogChoiceState,
      treeItem,
      { flipped: false, rotation: 0, variant: 0 },
    );
    expect(catalogChoiceState.selectedCatalogItem?.catalogItem.id).toBe(
      furnitureItem.id,
    );

    catalogChoiceState = selectWorkspaceCatalogItem(catalogChoiceState, treeItem);
    expect(catalogChoiceState.selectedCatalogItem?.presentationChoice).toEqual({
      flipped: false,
      rotation: 0,
      variant: 0,
    });
    const clearedState = clearWorkspaceCatalogSelection(catalogChoiceState);
    expect(clearedState.selectedCatalogItem).toBeNull();
    expect(clearedState.presentationChoicesByItemId).toBe(
      catalogChoiceState.presentationChoicesByItemId,
    );
  });

  it.each([
    {
      caseName: "tree variant",
      catalogItem: createCatalogItem("wildtree_6", {
        canFlip: true,
        rotation: null,
        variantCycle: { count: 2, family: "tree" },
        visibleVariants: [],
      }),
      expectedChoice: { flipped: false, rotation: 0, variant: 1 },
    },
    {
      caseName: "generic variant",
      catalogItem: createCatalogItem("object:599", {
        canFlip: false,
        rotation: null,
        variantCycle: { count: 3, family: "generic" },
        visibleVariants: [
          createVisibleVariant(0, "Base"),
          createVisibleVariant(1, "Pressure"),
          createVisibleVariant(2, "Enricher"),
        ],
      }),
      expectedChoice: { flipped: false, rotation: 0, variant: 1 },
    },
    {
      caseName: "furniture rotation",
      catalogItem: createCatalogItem("furniture_724", {
        canFlip: false,
        rotation: {
          count: 2,
          footprints: [
            { width: 2, height: 1 },
            { width: 1, height: 2 },
          ],
        },
        variantCycle: null,
        visibleVariants: [],
      }),
      expectedChoice: { flipped: false, rotation: 1, variant: 0 },
    },
  ])("cycles pending Q for $caseName", ({ catalogItem, expectedChoice }) => {
    const selectedState = selectWorkspaceCatalogItem(
      createInitialWorkspaceCatalogChoiceState(),
      catalogItem,
    );
    const pendingTransition = cyclePendingWorkspaceCatalogChoice(selectedState);

    expect(pendingTransition.changed).toBe(true);
    expect(pendingTransition.state.selectedCatalogItem?.presentationChoice).toEqual(
      expectedChoice,
    );
    expect(pendingTransition.state.presentationChoicesByItemId.get(catalogItem.id)).toEqual(
      expectedChoice,
    );
  });

  it("keeps pending Q unchanged for an item without capabilities", () => {
    const plainCatalogItem = createCatalogItem("object:390");
    const selectedState = selectWorkspaceCatalogItem(
      createInitialWorkspaceCatalogChoiceState(),
      plainCatalogItem,
    );
    const pendingTransition = cyclePendingWorkspaceCatalogChoice(selectedState);

    expect(pendingTransition).toEqual({ changed: false, state: selectedState });
  });
});

function createCatalogItem(
  id: string,
  presentationCapabilities?: CatalogItem["presentationCapabilities"],
): CatalogItem {
  return {
    allowedTools: ["cursor"],
    category: "placeable",
    id,
    name: id,
    presentationCapabilities,
    sprite: { kind: "sprite-index", index: 0 },
    textureLocalPath: "/game-assets/test.png",
    tileSize: { width: 1, height: 1 },
  };
}

function createCompositeCatalogItem(): CatalogItem {
  return {
    ...createCatalogItem("furniture_FreeCactus"),
    renderingMetadata: {
      bedType: null,
      compositeSprite: {
        layers: [
          { baseY: 96, count: 16, offsetY: 0 },
          { baseY: 48, count: 24, offsetY: -8 },
          { baseY: 0, count: 24, offsetY: -24 },
        ],
        pieceSize: 16,
        columns: 8,
      },
      furnitureType: "randomized_plant",
      indoors: true,
      isLongTable: false,
      isRug: false,
      isTable: false,
      kind: "furniture",
      outdoors: true,
      rotationSprites: undefined,
      rotationTileSizes: undefined,
      wallMounted: false,
    },
  };
}

function createVisibleVariant(value: number, label: string) {
  return {
    label,
    renderDescriptor: { kind: "variant-index" as const, variant: value },
    value,
  };
}
