import { DOMParser as XmlDomParser } from "@xmldom/xmldom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isProductionSaveImportError,
  parseProductionSaveFiles,
  parseProductionSaveXml,
  productionSaveSourceNameMaxLength,
  productionSaveXmlMaxLength,
  resolveProductionSaveInventoryItem,
} from "../../src/production-tools/production-save-import";

const validSaveXml = `
<SaveGame xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <whichFarm>0</whichFarm>
  <currentSeason>spring</currentSeason>
  <dayOfMonth>2</dayOfMonth>
  <year>3</year>
  <player>
    <farmName>Junimo Farm</farmName>
    <professions><int>1</int><int>4</int><int>5</int></professions>
    <items>
      <Item><value><Object><parentSheetIndex>24</parentSheetIndex><Stack>4</Stack><quality>0</quality></Object></value></Item>
      <Item><value><Object><parentSheetIndex>398</parentSheetIndex><Stack>2</Stack><quality>2</quality></Object></value></Item>
      <Item><value><Object><parentSheetIndex>88</parentSheetIndex><Stack>1</Stack><quality>0</quality></Object></value></Item>
      <Item><value><Object><parentSheetIndex>296</parentSheetIndex><Stack>1</Stack><quality>1</quality></Object></value></Item>
      <Item><value><Object><parentSheetIndex>410</parentSheetIndex><Stack>1</Stack><quality>0</quality></Object></value></Item>
      <Item><value><Object><parentSheetIndex>390</parentSheetIndex><Stack>3</Stack><quality>0</quality></Object></value></Item>
    </items>
  </player>
  <unrelated><items><Item><value><Object><parentSheetIndex>24</parentSheetIndex><Stack>999</Stack><quality>0</quality></Object></value></Item></items></unrelated>
  <locations>
    <GameLocation>
      <name>Farm</name>
      <objects>
        <item><key/><value><Object><itemId>12</itemId><bigCraftable>true</bigCraftable><minutesUntilReady>0</minutesUntilReady><readyForHarvest>false</readyForHarvest><heldObject xsi:nil="true"/></Object></value></item>
        <item><key/><value><Object><itemId>15</itemId><bigCraftable>true</bigCraftable><minutesUntilReady>100</minutesUntilReady><readyForHarvest>false</readyForHarvest><heldObject xsi:nil="true"/></Object></value></item>
        <item><key/><value><Object xsi:type="Chest"><itemId>130</itemId><bigCraftable>false</bigCraftable><items>
          <Item><value><Object><parentSheetIndex>24</parentSheetIndex><Stack>3</Stack><quality>0</quality></Object></value></Item>
        </items></Object></value></item>
      </objects>
      <buildings>
        <Building><indoors><GameLocation><name>Shed</name><objects>
          <item><key/><value><Object><itemId>Dehydrator</itemId><bigCraftable>true</bigCraftable><minutesUntilReady>0</minutesUntilReady><readyForHarvest>false</readyForHarvest><heldObject xsi:nil="true"/></Object></value></item>
        </objects></GameLocation></indoors></Building>
      </buildings>
    </GameLocation>
  </locations>
</SaveGame>`;

function captureError(action: () => unknown): Error {
  try {
    action();
  } catch (error) {
    if (error instanceof Error) return error;
    throw new Error(`Expected an Error. Received: ${String(error)}.`);
  }
  throw new Error("Expected the action to throw.");
}

function saveXmlWithPlayerItems(itemsXml: string): string {
  return `<SaveGame><whichFarm>0</whichFarm><currentSeason>spring</currentSeason><dayOfMonth>1</dayOfMonth><year>1</year><player><farmName>Test Farm</farmName><professions/><items>${itemsXml}</items></player><locations><GameLocation><name>Farm</name><objects/></GameLocation></locations></SaveGame>`;
}

function savedItem(objectId: string, quantity: number, quality?: number): string {
  const qualityElement = quality === undefined ? "" : `<quality>${quality}</quality>`;
  const bigCraftableElement = objectId === "12" || objectId === "15" ? "<bigCraftable>true</bigCraftable>" : "";
  return `<Item><value><Object><parentSheetIndex>${objectId}</parentSheetIndex>${bigCraftableElement}<Stack>${quantity}</Stack>${qualityElement}</Object></value></Item>`;
}

function modernObjectItem(objectId: string, quantity: number, quality: number): string {
  return `<Item><value><Object><itemId>${objectId}</itemId><QualifiedItemId>(O)${objectId}</QualifiedItemId><bigCraftable>false</bigCraftable><Stack>${quantity}</Stack><quality>${quality}</quality></Object></value></Item>`;
}

function saveXmlWithGlobalJunimoInventory(itemXml: string): string {
  return validSaveXml.replace(
    "<locations>",
    `<globalInventories><item><key><string>JunimoChests</string></key><value><ArrayOfItem>${itemXml}</ArrayOfItem></value></item></globalInventories><locations>`,
  );
}

describe("production SaveGame import", () => {
  beforeEach(() => {
    vi.stubGlobal("DOMParser", XmlDomParser);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reads player and nested chest stock, farm details, profession, and placed machine availability", () => {
    const candidate = parseProductionSaveXml(validSaveXml, "Junimo_Farm");

    expect(candidate).toMatchObject({
      sourceName: "Junimo_Farm",
      farm: { farmName: "Junimo Farm", farmType: "0", day: 2, season: "spring", year: 3 },
      profession: "artisan",
      machineCounts: { keg: 1, jar: 0, dehydrator: 1 },
      busyMachineCounts: { keg: 0, jar: 1, dehydrator: 0 },
      hasBearsKnowledge: null,
    });
    expect(candidate.inventoryItems).toEqual(expect.arrayContaining([
      expect.objectContaining({ objectId: "24", selectedIngredientId: "parsnip", quantity: 7, quality: "normal" }),
      expect.objectContaining({ objectId: "398", candidateIngredientIds: ["grape-foraged", "grape"], selectedIngredientId: null, quantity: 2, quality: "gold", requiresReview: true }),
      expect.objectContaining({ objectId: "296", candidateIngredientIds: ["salmonberry-cave"], selectedIngredientId: "salmonberry-cave", quantity: 1, quality: "silver", requiresReview: true }),
    ]));
    expect(candidate.inventoryItems.reduce((total, item) => total + item.quantity, 0)).toBe(12);
    expect(candidate.unsupportedItems).toEqual([{ objectId: "390", itemName: "Object 390", quantity: 3 }]);
    expect(candidate.reviewWarnings.join(" ")).toContain("Bear's Knowledge cannot be confirmed");
  });

  it("reads the shared Junimo inventory once even when multiple Junimo Chests reference it", () => {
    const junimoChestReferences = [1, 2].map((referenceIndex) =>
      `<item><key><Vector2><X>${referenceIndex}</X><Y>1</Y></Vector2></key><value><Object xsi:type="Chest"><itemId>256</itemId><QualifiedItemId>(BC)256</QualifiedItemId><bigCraftable>true</bigCraftable><specialChestType>JunimoChest</specialChestType><items/></Object></value></item>`,
    ).join("");
    const sharedInventoryXml = saveXmlWithGlobalJunimoInventory(modernObjectItem("258", 9, 0))
      .replace("</objects>", `${junimoChestReferences}</objects>`);
    const candidate = parseProductionSaveXml(sharedInventoryXml, "shared-junimo-inventory.xml");

    expect(candidate.inventoryItems).toEqual(expect.arrayContaining([
      expect.objectContaining({ objectId: "258", selectedIngredientId: "blueberry", quantity: 9, quality: "normal" }),
    ]));
    expect(candidate.inventoryItems.filter((item) => item.objectId === "258")).toHaveLength(1);
    expect(candidate.inventoryItems.find((item) => item.objectId === "258")?.quantity).toBe(9);
  });

  it("uses a legacy Junimo inventory and deduplicates identical legacy and global copies", () => {
    const blueberryItem = modernObjectItem("258", 9, 0);
    const legacyOnlyXml = validSaveXml.replace(
      "<locations>",
      `<junimoChest>${blueberryItem}</junimoChest><locations>`,
    );
    const legacyCandidate = parseProductionSaveXml(legacyOnlyXml, "legacy-junimo-inventory.xml");

    expect(legacyCandidate.inventoryItems.find((item) => item.objectId === "258")?.quantity).toBe(9);

    const matchingGlobalAndLegacyXml = saveXmlWithGlobalJunimoInventory(blueberryItem).replace(
      "<locations>",
      `<junimoChest>${blueberryItem}</junimoChest><locations>`,
    );
    const matchingCandidate = parseProductionSaveXml(matchingGlobalAndLegacyXml, "matching-junimo-inventories.xml");

    expect(matchingCandidate.inventoryItems.filter((item) => item.objectId === "258")).toHaveLength(1);
    expect(matchingCandidate.inventoryItems.find((item) => item.objectId === "258")?.quantity).toBe(9);
  });

  it("fails with both quantities when legacy and global Junimo inventories conflict", () => {
    const conflictingJunimoXml = saveXmlWithGlobalJunimoInventory(modernObjectItem("258", 9, 0)).replace(
      "<locations>",
      `<junimoChest>${modernObjectItem("258", 8, 0)}</junimoChest><locations>`,
    );
    const conflictError = captureError(() => parseProductionSaveXml(conflictingJunimoXml, "conflicting-junimo-inventories.xml"));

    expect(isProductionSaveImportError(conflictError)).toBe(true);
    expect(conflictError.message).toContain("conflicts with the legacy junimoChest list");
    expect(conflictError.message).toContain("globalQuantity=9");
    expect(conflictError.message).toContain("legacyQuantity=8");
  });

  it("uses 1.6 item identifiers instead of treating ParentSheetIndex as an equivalent alias", () => {
    const itemIdWinsXml = saveXmlWithPlayerItems(
      '<Item><value><Object><parentSheetIndex>258</parentSheetIndex><itemId>296</itemId><QualifiedItemId>(O)296</QualifiedItemId><bigCraftable>false</bigCraftable><Stack>1</Stack><quality>1</quality></Object></value></Item>',
    );
    const candidate = parseProductionSaveXml(itemIdWinsXml, "item-id-wins.xml");

    expect(candidate.inventoryItems).toEqual([
      expect.objectContaining({
        objectId: "296",
        candidateIngredientIds: ["salmonberry-cave"],
        selectedIngredientId: "salmonberry-cave",
        quality: "silver",
      }),
    ]);

    const conflictingModernIdsXml = saveXmlWithPlayerItems(
      '<Item><value><Object><parentSheetIndex>258</parentSheetIndex><itemId>296</itemId><QualifiedItemId>(O)258</QualifiedItemId><bigCraftable>false</bigCraftable><Stack>1</Stack><quality>0</quality></Object></value></Item>',
    );
    const conflictingIdError = captureError(() => parseProductionSaveXml(conflictingModernIdsXml, "conflicting-item-ids.xml"));
    expect(isProductionSaveImportError(conflictingIdError)).toBe(true);
    expect(conflictingIdError.message).toContain("conflicting itemId and QualifiedItemId aliases");
    expect(conflictingIdError.message).toContain('itemId="296"');
    expect(conflictingIdError.message).toContain('QualifiedItemId="(O)258"');
  });

  it("distinguishes an Object ID collision from a big-craftable machine ID", () => {
    const typedItemsXml = saveXmlWithPlayerItems([
      '<Item><value><Object><itemId>12</itemId><QualifiedItemId>(O)12</QualifiedItemId><bigCraftable>false</bigCraftable><Stack>1</Stack><quality>0</quality><DisplayName>Stone</DisplayName></Object></value></Item>',
      '<Item><value><Object><itemId>12</itemId><QualifiedItemId>(BC)12</QualifiedItemId><bigCraftable>true</bigCraftable><Stack>2</Stack></Object></value></Item>',
    ].join("")).replace(
      "<objects/>",
      '<objects><item><key/><value><Object><itemId>12</itemId><QualifiedItemId>(O)12</QualifiedItemId><bigCraftable>false</bigCraftable></Object></value></item></objects>',
    );
    const candidate = parseProductionSaveXml(typedItemsXml, "typed-machine-id.xml");

    expect(candidate.machineCounts.keg).toBe(0);
    expect(candidate.busyMachineCounts.keg).toBe(0);
    expect(candidate.unsupportedItems).toEqual([{ objectId: "12", itemName: "Stone", quantity: 1 }]);
    expect(candidate.reviewWarnings.join(" ")).toContain("stored equipment");

    const conflictingTypeXml = saveXmlWithPlayerItems(
      '<Item><value><Object><itemId>12</itemId><QualifiedItemId>(O)12</QualifiedItemId><bigCraftable>true</bigCraftable><Stack>1</Stack></Object></value></Item>',
    );
    const conflictingTypeError = captureError(() => parseProductionSaveXml(conflictingTypeXml, "conflicting-item-type.xml"));
    expect(isProductionSaveImportError(conflictingTypeError)).toBe(true);
    expect(conflictingTypeError.message).toContain("conflicting QualifiedItemId type and bigCraftable flag");
    expect(conflictingTypeError.message).toContain('QualifiedItemId type="O", bigCraftable=true');
  });

  it("treats absent browser attribute values as empty and does not treat untyped objects as chests", () => {
    class BrowserNullAttributeDOMParser extends XmlDomParser {
      parseFromString(xmlSource: string, mimeType: string) {
        const document = super.parseFromString(xmlSource, mimeType);
        for (const objectElement of Array.from(document.getElementsByTagName("Object"))) {
          if (objectElement.getAttribute("xsi:type") !== "") continue;
          const originalGetAttribute = objectElement.getAttribute.bind(objectElement);
          Object.defineProperties(objectElement, {
            getAttribute: {
              value: (attributeName: string) => attributeName === "xsi:type" ? null : originalGetAttribute(attributeName),
            },
            getAttributeNS: { value: () => null },
          });
        }
        return document;
      }
    }
    vi.stubGlobal("DOMParser", BrowserNullAttributeDOMParser);

    const untypedContainerXml = validSaveXml.replace('<Object xsi:type="Chest">', "<Object>");
    const candidate = parseProductionSaveXml(untypedContainerXml, "untyped-container.xml");

    expect(candidate.inventoryItems.find((item) => item.objectId === "24")?.quantity).toBe(4);
    expect(candidate.inventoryItems.reduce((total, item) => total + item.quantity, 0)).toBe(9);
  });

  it("requires explicit source, quality, and berry-boost decisions before creating inventory lines", () => {
    const candidate = parseProductionSaveXml(validSaveXml, "Junimo_Farm");
    const grapeItem = candidate.inventoryItems.find((item) => item.objectId === "398");
    const coconutItem = candidate.inventoryItems.find((item) => item.objectId === "88");
    const caveSalmonberryItem = candidate.inventoryItems.find((item) => item.objectId === "296");
    const blackberryItem = candidate.inventoryItems.find((item) => item.objectId === "410");
    if (grapeItem === undefined || coconutItem === undefined || caveSalmonberryItem === undefined || blackberryItem === undefined) {
      throw new Error("Expected grape, coconut, salmonberry, and blackberry preview rows.");
    }

    expect(resolveProductionSaveInventoryItem(grapeItem, {
      ingredientId: "grape",
    })).toMatchObject({ ingredientId: "grape", quantity: 2, quality: "gold", availableDay: 0 });
    expect(() => resolveProductionSaveInventoryItem(coconutItem, {
      ingredientId: "coconut",
    })).toThrow("coconutSource must be foraged or purchased-or-gifted");
    expect(resolveProductionSaveInventoryItem(coconutItem, {
      ingredientId: "coconut",
      coconutSource: "purchased-or-gifted",
    })).toMatchObject({ ingredientId: "coconut", coconutSource: "purchased-or-gifted" });
    expect(caveSalmonberryItem.quality).toBe("silver");
    expect(() => resolveProductionSaveInventoryItem(caveSalmonberryItem, {
      ingredientId: "salmonberry-cave",
    })).toThrow("hasBearsKnowledge must be selected");
    expect(resolveProductionSaveInventoryItem(caveSalmonberryItem, {
      ingredientId: "salmonberry-cave",
      hasBearsKnowledge: false,
    })).toMatchObject({ ingredientId: "salmonberry-cave", quality: "silver", hasBearsKnowledge: false });
    expect(() => resolveProductionSaveInventoryItem(blackberryItem, {
      ingredientId: "blackberry-ground",
    })).toThrow("hasBearsKnowledge must be selected");
    expect(resolveProductionSaveInventoryItem(blackberryItem, {
      ingredientId: "blackberry-ground",
      hasBearsKnowledge: true,
    })).toMatchObject({ ingredientId: "blackberry-ground", hasBearsKnowledge: true });
  });

  it("parses multiple local save files and validates source values at the boundary", () => {
    expect(parseProductionSaveFiles([
      { sourceName: "first", xmlText: validSaveXml },
      { sourceName: "second", xmlText: validSaveXml.replace("Junimo Farm", "Blue Farm") },
    ]).map(({ sourceName, farm }) => [sourceName, farm.farmName])).toEqual([
      ["first", "Junimo Farm"],
      ["second", "Blue Farm"],
    ]);

    const invalidSourceError = captureError(() => parseProductionSaveFiles([
      { sourceName: "", xmlText: validSaveXml },
    ]));
    expect(isProductionSaveImportError(invalidSourceError)).toBe(true);
    expect(invalidSourceError.message).toContain('Received: ""');
    expect(() => parseProductionSaveFiles(null as never)).toThrow("Received: null");
  });

  it("rejects malformed, wrong-root, unsafe, oversized, and invalid-season input with concrete values", () => {
    const malformedError = captureError(() => parseProductionSaveXml("<SaveGame><player></SaveGame>", "broken.xml"));
    expect(malformedError.message).toContain("player");

    const wrongRootError = captureError(() => parseProductionSaveXml("<NotASave />", "not-save.xml"));
    expect(isProductionSaveImportError(wrongRootError)).toBe(true);
    expect(wrongRootError.message).toContain('Received: "NotASave"');

    const unsafeXmlError = captureError(() => parseProductionSaveXml(
      '<!DOCTYPE SaveGame [<!ENTITY x "expanded">]><SaveGame />',
      "unsafe.xml",
    ));
    expect(isProductionSaveImportError(unsafeXmlError)).toBe(true);
    expect(unsafeXmlError.message).toContain("<!DOCTYPE");

    const invalidSeasonError = captureError(() => parseProductionSaveXml(
      validSaveXml.replace("<currentSeason>spring</currentSeason>", "<currentSeason>monsoon</currentSeason>"),
      "bad-season.xml",
    ));
    expect(isProductionSaveImportError(invalidSeasonError)).toBe(true);
    expect(invalidSeasonError.message).toContain('Received: "monsoon"');

    const oversizedError = captureError(() => parseProductionSaveXml("x".repeat(productionSaveXmlMaxLength + 1), "large.xml"));
    expect(isProductionSaveImportError(oversizedError)).toBe(true);
    expect(oversizedError.message).toContain(String(productionSaveXmlMaxLength + 1));

    const oversizedNameError = captureError(() => parseProductionSaveXml(validSaveXml, "s".repeat(productionSaveSourceNameMaxLength + 1)));
    expect(isProductionSaveImportError(oversizedNameError)).toBe(true);
    expect(oversizedNameError.message).toContain(`no longer than ${productionSaveSourceNameMaxLength}`);
    expect(oversizedNameError.message).toContain("s".repeat(30));
  });

  it("rejects an unsupported save quality code and refuses invalid resolved qualities", () => {
    const invalidQualityXml = validSaveXml.replace("<quality>0</quality>", "<quality>3</quality>");
    const invalidQualityError = captureError(() => parseProductionSaveXml(invalidQualityXml, "quality-3.xml"));
    expect(isProductionSaveImportError(invalidQualityError)).toBe(true);
    expect(invalidQualityError.message).toContain("Received: 3");

    const teaItem = {
      id: "tea-row",
      objectId: "815",
      itemName: "Tea Leaves",
      quantity: 1,
      savedQuality: 0,
      quality: "normal" as const,
      candidateIngredientIds: ["tea-leaves"],
      selectedIngredientId: "tea-leaves",
      coconutSource: null,
      requiresReview: false,
      reviewReason: null,
    };
    const invalidResolvedQuality = captureError(() => resolveProductionSaveInventoryItem(teaItem, {
      ingredientId: "tea-leaves",
      quality: "silver",
    }));
    expect(isProductionSaveImportError(invalidResolvedQuality)).toBe(true);
    expect(invalidResolvedQuality.message).toContain('Received: "silver"');
  });

  it("fails rather than counting a placed machine with no readable state as day-zero free capacity", () => {
    const missingMachineStateXml = validSaveXml.replace(
      "<minutesUntilReady>0</minutesUntilReady><readyForHarvest>false</readyForHarvest><heldObject xsi:nil=\"true\"/>",
      "",
    );
    const machineStateError = captureError(() => parseProductionSaveXml(missingMachineStateXml, "missing-machine-state.xml"));
    expect(isProductionSaveImportError(machineStateError)).toBe(true);
    expect(machineStateError.message).toContain("no readable busy-state fields");
  });

  it("does not infer free capacity when a placed machine has no timer and no positive busy signal", () => {
    const missingTimerXml = validSaveXml.replace(
      "<minutesUntilReady>0</minutesUntilReady>",
      "",
    );
    const missingTimerError = captureError(() => parseProductionSaveXml(missingTimerXml, "missing-timer.xml"));

    expect(isProductionSaveImportError(missingTimerError)).toBe(true);
    expect(missingTimerError.message).toContain("no minutesUntilReady and no positive busy-state signal");
    expect(missingTimerError.message).toContain("readyForHarvest=false, heldObjectPresent=false");
  });

  it("rejects unsafe sums across supported stock, unsupported stock, and stored equipment", () => {
    const maxSafeQuantity = Number.MAX_SAFE_INTEGER;
    const overflowingItems = [
      { objectId: "258", quality: 0, message: "inventory quantity for objectId" },
      { objectId: "390", quality: undefined, message: "unsupported inventory quantity for objectId" },
      { objectId: "12", quality: undefined, message: "stored keg count for objectId" },
    ];

    for (const { objectId, quality, message } of overflowingItems) {
      const overflowError = captureError(() => parseProductionSaveXml(
        saveXmlWithPlayerItems([
          savedItem(objectId, maxSafeQuantity, quality),
          savedItem(objectId, maxSafeQuantity, quality),
        ].join("")),
        "overflow.xml",
      ));

      expect(isProductionSaveImportError(overflowError)).toBe(true);
      expect(overflowError.message).toContain(message);
      expect(overflowError.message).toContain("9007199254740991 + 9007199254740991 = 18014398509481982");
    }
  });
});
