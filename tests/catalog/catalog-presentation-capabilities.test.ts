import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  createCatalogFromDatasets,
  createDefaultCatalogItemPresentationChoice,
  createDefaultCatalogPresentationChoice,
  getNextPendingCatalogPresentationChoice,
  getNextSelectedCatalogPresentationChoice,
  validateCatalogPresentationCapabilities,
  validateCatalogItemPresentationChoice,
  validateCatalogPresentationChoice,
} from "../../src/catalog";
import type {
  CatalogItem,
  CatalogPresentationCapabilities,
} from "../../src/catalog";
import { catalogDatasetUrls } from "../../src/catalog/catalog-loader";

const treePresentationCapabilities = {
  canFlip: true,
  rotation: null,
  variantCycle: { count: 2, family: "tree" },
  visibleVariants: [
    {
      label: "No Fruit",
      renderDescriptor: { kind: "variant-index", variant: 0 },
      value: 0,
    },
    {
      label: "Fruit",
      renderDescriptor: { kind: "variant-index", variant: 1 },
      value: 1,
    },
  ],
} as const;

describe("catalog presentation capabilities", () => {
  it("defaults and validates choices at the CatalogItem boundary", () => {
    const catalogItemWithoutCapabilities: CatalogItem = {
      allowedTools: ["cursor"],
      category: "placeable",
      id: "object:390",
      name: "Stone",
      sprite: { kind: "sprite-index", index: 0 },
      textureLocalPath: "/game-assets/test.png",
      tileSize: { width: 1, height: 1 },
    };

    expect(createDefaultCatalogItemPresentationChoice(
      catalogItemWithoutCapabilities,
    )).toEqual({ flipped: false, rotation: 0, variant: 0 });
    expect(validateCatalogItemPresentationChoice(
      catalogItemWithoutCapabilities,
      { flipped: false, rotation: 0, variant: 0 },
    )).toEqual({ flipped: false, rotation: 0, variant: 0 });
    expect(() => validateCatalogItemPresentationChoice(
      catalogItemWithoutCapabilities,
      { flipped: false, rotation: 1, variant: 0 },
    )).toThrow(/object:390.*1/s);

    const catalogItemWithCapabilities: CatalogItem = {
      ...catalogItemWithoutCapabilities,
      id: "fruittree_628",
      presentationCapabilities: treePresentationCapabilities,
    };
    expect(validateCatalogItemPresentationChoice(
      catalogItemWithCapabilities,
      { flipped: true, rotation: 0, variant: 1 },
    )).toEqual({ flipped: true, rotation: 0, variant: 1 });
    expect(() => validateCatalogItemPresentationChoice(
      catalogItemWithCapabilities,
      { flipped: false, rotation: 0, variant: 2 },
    )).toThrow(/fruittree_628.*2/s);
  });

  it("creates and validates default choices with item-specific errors", () => {
    const defaultChoice = createDefaultCatalogPresentationChoice(
      "fruittree_628",
      treePresentationCapabilities,
    );

    expect(defaultChoice).toEqual({ flipped: false, rotation: 0, variant: 0 });
    expect(
      validateCatalogPresentationChoice(
        "fruittree_628",
        treePresentationCapabilities,
        defaultChoice,
      ),
    ).toEqual(defaultChoice);
    expect(() =>
      validateCatalogPresentationChoice(
        "fruittree_628",
        treePresentationCapabilities,
        { flipped: false, rotation: 1, variant: 0 },
      ),
    ).toThrow(/fruittree_628.*1/s);
    expect(() =>
      validateCatalogPresentationChoice(
        "fruittree_628",
        { ...treePresentationCapabilities, canFlip: false },
        { flipped: true, rotation: 0, variant: 0 },
      ),
    ).toThrow(/fruittree_628.*true/s);
  });

  it("cycles hidden wild-tree pending and selected Q choices through variants 0 and 1", async () => {
    const catalog = await createLockedCatalog();
    const hiddenWildTree = requireCatalogItem(catalog.items, "wildtree_6");
    const presentationCapabilities = requirePresentationCapabilities(hiddenWildTree);
    const defaultChoice = createDefaultCatalogPresentationChoice(
      hiddenWildTree.id,
      presentationCapabilities,
    );

    expect(presentationCapabilities).toMatchObject({
      rotation: null,
      variantCycle: { count: 2, family: "tree" },
      visibleVariants: [],
    });
    expect(validateCatalogPresentationChoice(
      hiddenWildTree.id,
      presentationCapabilities,
      defaultChoice,
    )).toEqual(defaultChoice);
    expectCycleBetweenTreeVariants(
      getNextPendingCatalogPresentationChoice,
      hiddenWildTree.id,
      presentationCapabilities,
      defaultChoice,
    );
    expectCycleBetweenTreeVariants(
      getNextSelectedCatalogPresentationChoice,
      hiddenWildTree.id,
      presentationCapabilities,
      defaultChoice,
    );
  });

  it("keeps Q choices unchanged when rotation is null or count one and variantCycle is null", () => {
    const capabilitiesByCase = [
      {
        canFlip: false,
        rotation: null,
        variantCycle: null,
        visibleVariants: [],
      },
      {
        canFlip: false,
        rotation: { count: 1, footprints: [{ width: 1, height: 1 }] },
        variantCycle: null,
        visibleVariants: [],
      },
    ] as const;

    capabilitiesByCase.forEach((presentationCapabilities, caseIndex) => {
      const itemId = `no-cycle:${String(caseIndex)}`;
      const defaultChoice = createDefaultCatalogPresentationChoice(
        itemId,
        presentationCapabilities,
      );

      expect(getNextPendingCatalogPresentationChoice(
        itemId,
        presentationCapabilities,
        defaultChoice,
      )).toEqual(defaultChoice);
      expect(getNextSelectedCatalogPresentationChoice(
        itemId,
        presentationCapabilities,
        defaultChoice,
      )).toEqual(defaultChoice);
    });
  });

  it("cycles actual two- and four-rotation furniture through capability footprints", async () => {
    const catalog = await createLockedCatalog();
    const furnitureCases = [
      {
        itemId: "furniture_724",
        expectedFootprints: [
          { width: 2, height: 1 },
          { width: 1, height: 2 },
        ],
      },
      {
        itemId: "furniture_0",
        expectedFootprints: [
          { width: 1, height: 1 },
          { width: 1, height: 1 },
          { width: 1, height: 1 },
          { width: 1, height: 1 },
        ],
      },
    ] as const;

    for (const furnitureCase of furnitureCases) {
      const catalogItem = requireCatalogItem(catalog.items, furnitureCase.itemId);
      const presentationCapabilities = requirePresentationCapabilities(catalogItem);
      const rotationCapability = presentationCapabilities.rotation;
      expect(rotationCapability?.count).toBe(furnitureCase.expectedFootprints.length);
      if (rotationCapability === null) {
        throw new Error(`Expected ${furnitureCase.itemId} to have rotation capabilities.`);
      }
      expect(rotationCapability.footprints).toEqual(furnitureCase.expectedFootprints);

      let pendingChoice = createDefaultCatalogPresentationChoice(
        furnitureCase.itemId,
        presentationCapabilities,
      );
      for (let rotationIndex = 0; rotationIndex < rotationCapability.count; rotationIndex += 1) {
        expect(pendingChoice).toEqual({
          flipped: false,
          rotation: rotationIndex,
          variant: 0,
        });
        expect(rotationCapability.footprints[pendingChoice.rotation]).toMatchObject({
          width: expect.any(Number),
          height: expect.any(Number),
        });
        pendingChoice = getNextPendingCatalogPresentationChoice(
          furnitureCase.itemId,
          presentationCapabilities,
          pendingChoice,
        );
      }
      expect(pendingChoice).toEqual({ flipped: false, rotation: 0, variant: 0 });
      expect(getNextSelectedCatalogPresentationChoice(
        furnitureCase.itemId,
        presentationCapabilities,
        pendingChoice,
      )).toEqual({ flipped: false, rotation: 1, variant: 0 });
    }
  });

  it("cycles actual fruit-tree and generic selections through variants", async () => {
    const catalog = await createLockedCatalog();
    const fruitTree = requireCatalogItem(catalog.items, "fruittree_628");
    const fruitCapabilities = requirePresentationCapabilities(fruitTree);
    const defaultFruitChoice = createDefaultCatalogPresentationChoice(
      fruitTree.id,
      fruitCapabilities,
    );

    expect(getNextSelectedCatalogPresentationChoice(
      fruitTree.id,
      fruitCapabilities,
      defaultFruitChoice,
    )).toEqual({ flipped: false, rotation: 0, variant: 1 });

    const genericItem = requireCatalogItem(catalog.items, "object:599");
    const genericCapabilities = requirePresentationCapabilities(genericItem);
    let genericChoice = createDefaultCatalogPresentationChoice(
      genericItem.id,
      genericCapabilities,
    );
    for (const expectedVariant of [1, 2, 0]) {
      genericChoice = getNextSelectedCatalogPresentationChoice(
        genericItem.id,
        genericCapabilities,
        genericChoice,
      );
      expect(genericChoice).toEqual({
        flipped: false,
        rotation: 0,
        variant: expectedVariant,
      });
    }
  });

  it.each([
    {
      caseName: "rotation footprint count mismatch",
      receivedPattern: /invalid:capability.*\"footprints\":\[\]/s,
      presentationCapabilities: {
        canFlip: false,
        rotation: { count: 2, footprints: [] },
        variantCycle: null,
        visibleVariants: [],
      },
    },
    {
      caseName: "rotation count below one",
      receivedPattern: /invalid:capability.*\"count\":0/s,
      presentationCapabilities: {
        canFlip: false,
        rotation: { count: 0, footprints: [] },
        variantCycle: null,
        visibleVariants: [],
      },
    },
    {
      caseName: "nonpositive rotation footprint",
      receivedPattern: /invalid:capability.*\"width\":0/s,
      presentationCapabilities: {
        canFlip: false,
        rotation: { count: 1, footprints: [{ width: 0, height: 1 }] },
        variantCycle: null,
        visibleVariants: [],
      },
    },
    {
      caseName: "variant cycle count below two",
      receivedPattern: /invalid:capability.*\"count\":1/s,
      presentationCapabilities: {
        canFlip: false,
        rotation: null,
        variantCycle: { count: 1, family: "tree" },
        visibleVariants: [],
      },
    },
    {
      caseName: "visible variant out of range",
      receivedPattern: /invalid:capability.*\"value\":2/s,
      presentationCapabilities: {
        canFlip: false,
        rotation: null,
        variantCycle: { count: 2, family: "tree" },
        visibleVariants: [createVisibleVariant(2, "Out of range", 2)],
      },
    },
    {
      caseName: "render descriptor out of range",
      receivedPattern: /invalid:capability.*\"variant\":2/s,
      presentationCapabilities: {
        canFlip: false,
        rotation: null,
        variantCycle: { count: 2, family: "tree" },
        visibleVariants: [createVisibleVariant(0, "Out of range descriptor", 2)],
      },
    },
    {
      caseName: "duplicate visible variant",
      receivedPattern: /invalid:capability.*\"value\":0/s,
      presentationCapabilities: {
        canFlip: false,
        rotation: null,
        variantCycle: { count: 2, family: "tree" },
        visibleVariants: [
          createVisibleVariant(0, "First", 0),
          createVisibleVariant(0, "Duplicate", 0),
        ],
      },
    },
    {
      caseName: "render descriptor mismatch",
      receivedPattern: /invalid:capability.*\"variant\":0.*\"value\":1/s,
      presentationCapabilities: {
        canFlip: false,
        rotation: null,
        variantCycle: { count: 2, family: "tree" },
        visibleVariants: [createVisibleVariant(1, "Mismatch", 0)],
      },
    },
    {
      caseName: "visible variant without a cycle",
      receivedPattern: /invalid:capability.*\"value\":0/s,
      presentationCapabilities: {
        canFlip: false,
        rotation: null,
        variantCycle: null,
        visibleVariants: [createVisibleVariant(0, "Impossible", 0)],
      },
    },
  ])("fails fast for $caseName with item ID and received value", ({
    presentationCapabilities,
    receivedPattern,
  }) => {
    expect(() => validateCatalogPresentationCapabilities(
      "invalid:capability",
      presentationCapabilities as unknown as CatalogPresentationCapabilities,
    )).toThrow(receivedPattern);
  });

  it("populates only the frozen-audited presentation capability sets", async () => {
    const catalog = await createLockedCatalog();
    const catalogItemsById = new Map(
      catalog.items.map((catalogItem) => [catalogItem.id, catalogItem]),
    );

    expect(catalogItemsById.get("furniture_0")?.presentationCapabilities?.rotation).toEqual(
      expect.objectContaining({ count: 4 }),
    );
    expect(catalogItemsById.get("object:599")?.presentationCapabilities?.visibleVariants).toMatchObject([
      { label: "Base", value: 0 },
      { label: "Pressure", value: 1 },
      { label: "Enricher", value: 2 },
    ]);
    expect(catalogItemsById.get("big-craftable:143")?.presentationCapabilities?.visibleVariants).toMatchObject([
      { label: "Lit", value: 0 },
      { label: "Unlit", value: 1 },
    ]);
    expect(catalogItemsById.get("big-craftable:142")?.presentationCapabilities).toBeUndefined();

    expect(findCapabilityItemIds(catalog.items, "object:")).toEqual([
      "object:599",
      "object:621",
      "object:645",
    ]);
    expect(findCapabilityItemIds(catalog.items, "big-craftable:")).toEqual([
      "big-craftable:143",
      "big-craftable:144",
      "big-craftable:145",
      "big-craftable:146",
      "big-craftable:147",
      "big-craftable:148",
      "big-craftable:149",
      "big-craftable:150",
      "big-craftable:151",
      "big-craftable:278",
    ]);

    const wildTreeItems = catalog.items.filter((catalogItem) =>
      catalogItem.id.startsWith("wildtree_"));
    expect(findNumericSuffixesByVisibleVariants(wildTreeItems, true)).toEqual([
      "1", "2", "3", "10", "11",
    ]);
    expect(findNumericSuffixesByVisibleVariants(wildTreeItems, false)).toEqual([
      "6", "7", "8", "9", "12", "13",
    ]);
    for (const wildTreeItem of wildTreeItems) {
      expect(wildTreeItem.presentationCapabilities).toMatchObject({
        canFlip: true,
        rotation: null,
        variantCycle: { count: 2, family: "tree" },
      });
    }

    const fruitTreeItems = catalog.items.filter((catalogItem) =>
      catalogItem.id.startsWith("fruittree_"));
    expect(findSortedNumericSuffixes(fruitTreeItems)).toEqual([
      "69", "628", "629", "630", "631", "632", "633", "835",
    ]);
    for (const fruitTreeItem of fruitTreeItems) {
      expect(fruitTreeItem.presentationCapabilities).toMatchObject({
        canFlip: true,
        rotation: null,
        variantCycle: { count: 2, family: "tree" },
        visibleVariants: [
          { label: "No Fruit", value: 0 },
          { label: "Fruit", value: 1 },
        ],
      });
    }
  });
});

function expectCycleBetweenTreeVariants(
  getNextChoice: typeof getNextPendingCatalogPresentationChoice,
  itemId: string,
  presentationCapabilities: CatalogPresentationCapabilities,
  defaultChoice: ReturnType<typeof createDefaultCatalogPresentationChoice>,
): void {
  const alternateChoice = getNextChoice(
    itemId,
    presentationCapabilities,
    defaultChoice,
  );
  expect(alternateChoice).toEqual({ flipped: false, rotation: 0, variant: 1 });
  expect(getNextChoice(
    itemId,
    presentationCapabilities,
    alternateChoice,
  )).toEqual(defaultChoice);
}

function createVisibleVariant(value: number, label: string, renderVariant: number) {
  return {
    label,
    renderDescriptor: { kind: "variant-index" as const, variant: renderVariant },
    value,
  };
}

function requireCatalogItem(
  catalogItems: readonly CatalogItem[],
  itemId: string,
): CatalogItem {
  const catalogItem = catalogItems.find((candidateItem) => candidateItem.id === itemId);
  if (catalogItem === undefined) {
    throw new Error(`Expected locked catalog item ${JSON.stringify(itemId)}.`);
  }
  return catalogItem;
}

function requirePresentationCapabilities(
  catalogItem: CatalogItem,
): CatalogPresentationCapabilities {
  if (catalogItem.presentationCapabilities === undefined) {
    throw new Error(`Expected presentation capabilities for ${catalogItem.id}.`);
  }
  return catalogItem.presentationCapabilities;
}

function findCapabilityItemIds(
  catalogItems: readonly CatalogItem[],
  idPrefix: string,
): readonly string[] {
  return catalogItems
    .filter((catalogItem) => catalogItem.id.startsWith(idPrefix))
    .filter((catalogItem) => catalogItem.presentationCapabilities !== undefined)
    .map((catalogItem) => catalogItem.id)
    .sort();
}

function findNumericSuffixesByVisibleVariants(
  catalogItems: readonly CatalogItem[],
  hasVisibleVariants: boolean,
): readonly string[] {
  return findSortedNumericSuffixes(catalogItems.filter((catalogItem) =>
    (catalogItem.presentationCapabilities?.visibleVariants.length ?? 0) > 0 === hasVisibleVariants));
}

function findSortedNumericSuffixes(catalogItems: readonly CatalogItem[]): readonly string[] {
  return catalogItems
    .map((catalogItem) => catalogItem.id.slice(catalogItem.id.lastIndexOf("_") + 1))
    .sort((leftId, rightId) => Number(leftId) - Number(rightId));
}

async function createLockedCatalog() {
  const datasetDirectory = join(process.cwd(), "public/game-assets/1.6.15/data");
  const readDataset = async (filename: string) =>
    JSON.parse(await readFile(join(datasetDirectory, filename), "utf8")) as unknown;

  return createCatalogFromDatasets({
    bigCraftables: await readDataset("BigCraftables.json"),
    buildings: await readDataset("Buildings.json"),
    crops: await readDataset("Crops.json"),
    fences: await readDataset("Fences.json"),
    floorsAndPaths: await readDataset("FloorsAndPaths.json"),
    fruitTrees: await readDataset("FruitTrees.json"),
    furniture: await readDataset("Furniture.json"),
    objects: await readDataset("Objects.json"),
  }, catalogDatasetUrls);
}
