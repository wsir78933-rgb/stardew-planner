import { describe, expect, it } from "vitest";
import {
  getFieldCrop,
  isCropSoldAt,
  listPurchasableFieldCrops,
  type ProcessingProduct,
} from "../../../src/crop-tools/catalog/field-crops";

function product(cropId: string, productId: string): ProcessingProduct {
  const match = getFieldCrop(cropId).processingProducts.find(
    (candidate) => candidate.productId === productId,
  );
  if (!match) {
    throw new Error(`Missing product ${productId} on ${cropId}.`);
  }
  return match;
}

describe("purchasable field crops", () => {
  it("lists the ValleyMath ranked crops plus the 1.6 seasonal crops", () => {
    const cropIds = listPurchasableFieldCrops().map((crop) => crop.cropId);
    expect(cropIds).toHaveLength(31);
    expect(new Set(cropIds).size).toBe(31);
    expect(cropIds).toEqual(
      expect.arrayContaining([
        "parsnip",
        "strawberry",
        "starfruit",
        "carrot",
        "summer-squash",
        "broccoli",
        "powdermelon",
      ]),
    );
  });

  it("omits flowers, rare seeds, rice, taro, coffee, and ancient fruit", () => {
    const cropIds = listPurchasableFieldCrops().map((crop) => crop.cropId);
    for (const excludedId of [
      "blue-jazz",
      "tulip",
      "summer-spangle",
      "poppy",
      "fairy-rose",
      "sunflower",
      "sweet-gem-berry",
      "rice",
      "taro",
      "coffee-bean",
      "ancient-fruit",
    ]) {
      expect(cropIds).not.toContain(excludedId);
    }
  });

  it("throws when cropId is unknown and includes that id", () => {
    expect(() => getFieldCrop("not-a-real-crop")).toThrow(TypeError);
    expect(() => getFieldCrop("not-a-real-crop")).toThrow("not-a-real-crop");
  });

  it("throws when cropId is not a string and includes the received value", () => {
    expect(() => getFieldCrop(12 as never)).toThrow(TypeError);
    expect(() => getFieldCrop(12 as never)).toThrow("Received: 12");
  });
});

describe("seed shops", () => {
  it("sells Pierre year-1 seeds, year-2 seeds, Oasis seeds, and Egg Festival seeds", () => {
    const parsnip = getFieldCrop("parsnip");
    const garlic = getFieldCrop("garlic");
    const strawberry = getFieldCrop("strawberry");
    const starfruit = getFieldCrop("starfruit");
    const beet = getFieldCrop("beet");
    const artichoke = getFieldCrop("artichoke");
    const carrot = getFieldCrop("carrot");

    expect(parsnip.seedOffers).toEqual([{ shop: "pierre", price: 20, minimumYear: 1 }]);
    expect(isCropSoldAt(parsnip, "pierre", 1)).toBe(true);
    expect(isCropSoldAt(parsnip, "oasis", 1)).toBe(false);

    expect(isCropSoldAt(garlic, "pierre", 1)).toBe(false);
    expect(isCropSoldAt(garlic, "pierre", 2)).toBe(true);
    expect(garlic.seedOffers[0]?.price).toBe(40);

    expect(isCropSoldAt(artichoke, "pierre", 1)).toBe(false);
    expect(isCropSoldAt(artichoke, "pierre", 2)).toBe(true);

    expect(strawberry.seedOffers).toEqual([
      { shop: "festival", price: 100, minimumYear: 1, availableFromDay: 13 },
    ]);
    expect(isCropSoldAt(strawberry, "festival", 1)).toBe(true);
    expect(isCropSoldAt(strawberry, "pierre", 2)).toBe(false);

    expect(isCropSoldAt(starfruit, "oasis", 1)).toBe(true);
    expect(isCropSoldAt(starfruit, "pierre", 2)).toBe(false);
    expect(starfruit.seedOffers[0]?.price).toBe(400);
    expect(isCropSoldAt(beet, "oasis", 1)).toBe(true);

    expect(isCropSoldAt(carrot, "pierre", 1)).toBe(false);
    expect(isCropSoldAt(carrot, "oasis", 2)).toBe(false);
    expect(isCropSoldAt(carrot, "festival", 1)).toBe(false);
    expect(isCropSoldAt(getFieldCrop("powdermelon"), "pierre", 2)).toBe(false);
  });

  it("throws for a bad shop or year and includes the received value", () => {
    const parsnip = getFieldCrop("parsnip");
    expect(() => isCropSoldAt(parsnip, "joja" as never, 1)).toThrow(TypeError);
    expect(() => isCropSoldAt(parsnip, "joja" as never, 1)).toThrow("joja");
    expect(() => isCropSoldAt(parsnip, "pierre", 0)).toThrow(RangeError);
    expect(() => isCropSoldAt(parsnip, "pierre", 0)).toThrow("Received: 0");
    expect(() => isCropSoldAt(null as never, "pierre", 1)).toThrow(TypeError);
    expect(() => isCropSoldAt(null as never, "pierre", 1)).toThrow("Received: null");
  });
});

describe("sell prices and processing", () => {
  it("keeps ValleyMath base prices, yields, and machine days", () => {
    expect(getFieldCrop("parsnip").sellPrice).toBe(35);
    expect(getFieldCrop("parsnip").tillerSellPrice).toBe(38);
    expect(getFieldCrop("potato").expectedUnitsPerHarvest).toBe(1.25);
    expect(getFieldCrop("blueberry").expectedUnitsPerHarvest).toBe(3);
    expect(getFieldCrop("cranberries").expectedUnitsPerHarvest).toBe(2);
    expect(getFieldCrop("starfruit").tillerSellPrice).toBe(825);
    expect(getFieldCrop("hops").tillerSellPrice).toBe(27);

    expect(product("strawberry", "wine")).toMatchObject({
      machine: "keg",
      processingDays: 7,
      unitsPerBatch: 1,
      normalQualityPrice: 360,
      artisanPrice: 504,
    });
    expect(product("strawberry", "jelly")).toMatchObject({
      machine: "jar",
      processingDays: 3,
      normalQualityPrice: 290,
      artisanPrice: 406,
    });
    expect(product("strawberry", "dried-fruit")).toMatchObject({
      machine: "dehydrator",
      processingDays: 1,
      unitsPerBatch: 5,
      normalQualityPrice: 925,
      artisanPrice: 1295,
    });
    expect(product("radish", "juice")).toMatchObject({
      machine: "keg",
      processingDays: 4,
      normalQualityPrice: 202,
      artisanPrice: 283,
    });
    expect(product("hops", "pale-ale")).toMatchObject({
      machine: "keg",
      processingDays: 2,
      normalQualityPrice: 300,
      artisanPrice: 420,
    });
    expect(getFieldCrop("hops").processingProducts.map((item) => item.productId)).toEqual([
      "pale-ale",
    ]);
    expect(product("wheat", "beer")).toMatchObject({
      processingDays: 2,
      normalQualityPrice: 200,
      artisanPrice: 280,
    });
    expect(product("grape", "raisins")).toMatchObject({
      machine: "dehydrator",
      unitsPerBatch: 5,
      processingDays: 1,
      normalQualityPrice: 600,
      artisanPrice: 840,
    });
    expect(getFieldCrop("grape").processingProducts.map((item) => item.productId)).toEqual([
      "wine",
      "jelly",
      "raisins",
    ]);
    expect(product("pumpkin", "pickles").normalQualityPrice).toBe(690);
    expect(product("pumpkin", "juice")).toMatchObject({
      processingDays: 4,
      normalQualityPrice: 720,
      artisanPrice: 1008,
    });
    expect(product("powdermelon", "wine").normalQualityPrice).toBe(180);
    expect(getFieldCrop("parsnip").growthStages).toEqual([1, 1, 1, 1]);
    expect(getFieldCrop("cranberries").regrowIntervalDays).toBe(5);
  });
});
