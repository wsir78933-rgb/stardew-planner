import {
  getProcessingIngredient,
  getProcessingIngredientQualities,
  isBearsKnowledgeEligible,
  type ProcessingCoconutSource,
  type ProcessingQuality,
} from "@/src/processing-tools/processing-model";
import {
  cropSeasons,
  type CropSeason,
} from "@/src/tools-pages/planting-field-values";
import type {
  ProductionInventoryLine,
  ProductionMachine,
  ProductionMachineCounts,
  ProductionProfession,
  ProductionQuality,
} from "./production-model";

export const productionSaveXmlMaxLength = 16 * 1024 * 1024;
export const productionSaveSourceNameMaxLength = 512;

export type ProductionSaveXmlSource = Readonly<{
  sourceName: string;
  xmlText: string;
}>;

export type ProductionSaveInventoryItem = Readonly<{
  id: string;
  objectId: string;
  itemName: string;
  quantity: number;
  savedQuality: number;
  quality: ProductionQuality | null;
  candidateIngredientIds: readonly string[];
  selectedIngredientId: string | null;
  coconutSource: ProcessingCoconutSource | null;
  requiresReview: boolean;
  reviewReason: string | null;
}>;

export type ProductionSaveUnsupportedItem = Readonly<{
  objectId: string;
  itemName: string;
  quantity: number;
}>;

export type ProductionSaveCandidate = Readonly<{
  sourceName: string;
  farm: Readonly<{
    farmName: string | null;
    farmType: string | null;
    day: number | null;
    season: CropSeason | null;
    year: number | null;
  }>;
  profession: ProductionProfession | null;
  machineCounts: ProductionMachineCounts;
  busyMachineCounts: ProductionMachineCounts;
  hasBearsKnowledge: boolean | null;
  inventoryItems: readonly ProductionSaveInventoryItem[];
  unsupportedItems: readonly ProductionSaveUnsupportedItem[];
  reviewWarnings: readonly string[];
}>;

export type ProductionSaveInventoryResolution = Readonly<{
  ingredientId: string;
  quality?: ProductionQuality;
  coconutSource?: ProcessingCoconutSource;
  hasBearsKnowledge?: boolean;
}>;

export class ProductionSaveImportError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ProductionSaveImportError";
  }
}

export function isProductionSaveImportError(error: unknown): error is ProductionSaveImportError {
  return error instanceof ProductionSaveImportError;
}

export function parseProductionSaveXml(
  xmlText: string,
  sourceName = "SaveGame XML",
): ProductionSaveCandidate {
  validateSaveInput(xmlText, sourceName);
  rejectDtdAndEntityDeclarations(xmlText, sourceName);
  const saveDocument = parseXmlDocument(xmlText, sourceName);
  const saveGameElement = readSaveGameRoot(saveDocument, sourceName);
  const saveElements = listElements(saveGameElement);
  const playerElement = getDirectChild(saveGameElement, "player");
  const profession = readProcessingProfession(playerElement, sourceName);
  const inventoryResult = readInventoryItems(saveGameElement, saveElements, playerElement, sourceName);
  const machineResult = readPlacedMachines(saveElements, sourceName);
  const farm = readFarmDetails(saveGameElement, playerElement, sourceName);
  const reviewWarnings = [
    ...inventoryResult.reviewWarnings,
    ...machineResult.reviewWarnings,
    ...(farm.farmName === null ? ["The save has no readable farm name."] : []),
    ...(farm.farmType === null ? ["The save has no readable farm type."] : []),
    ...(farm.day === null || farm.season === null || farm.year === null
      ? ["The save farm date is incomplete; verify the planning context before importing."]
      : []),
    ...(profession === null
      ? ["The save has no readable player profession list; choose a processing profession before planning."]
      : []),
    "Bear's Knowledge cannot be confirmed from this save parser; choose its value before importing eligible berries.",
  ];

  return {
    sourceName,
    farm,
    profession,
    machineCounts: machineResult.machineCounts,
    busyMachineCounts: machineResult.busyMachineCounts,
    hasBearsKnowledge: null,
    inventoryItems: inventoryResult.inventoryItems,
    unsupportedItems: inventoryResult.unsupportedItems,
    reviewWarnings,
  };
}

export function parseProductionSaveFiles(
  sources: readonly ProductionSaveXmlSource[],
): readonly ProductionSaveCandidate[] {
  if (!Array.isArray(sources)) {
    throw new ProductionSaveImportError(
      `Save sources must be an array. Received: ${formatReceivedValue(sources)}.`,
    );
  }
  return sources.map((source, sourceIndex) => {
    if (typeof source !== "object" || source === null || Array.isArray(source)) {
      throw new ProductionSaveImportError(
        `Save source at index ${sourceIndex} must be an object. Received: ${formatReceivedValue(source)}.`,
      );
    }
    if (typeof source.sourceName !== "string" || source.sourceName.trim().length === 0) {
      throw new ProductionSaveImportError(
        `Save source at index ${sourceIndex} sourceName must be a nonempty string. Received: ${formatReceivedValue(source.sourceName)}.`,
      );
    }
    if (typeof source.xmlText !== "string") {
      throw new ProductionSaveImportError(
        `Save source at index ${sourceIndex} xmlText must be a string. Received: ${formatReceivedValue(source.xmlText)}.`,
      );
    }
    return parseProductionSaveXml(source.xmlText, source.sourceName);
  });
}

export function resolveProductionSaveInventoryItem(
  item: ProductionSaveInventoryItem,
  resolution: ProductionSaveInventoryResolution,
): ProductionInventoryLine {
  if (typeof item !== "object" || item === null || Array.isArray(item)) {
    throw new ProductionSaveImportError(
      `Save inventory item must be an object. Received: ${formatReceivedValue(item)}.`,
    );
  }
  if (typeof resolution !== "object" || resolution === null || Array.isArray(resolution)) {
    throw new ProductionSaveImportError(
      `Inventory resolution must be an object. Received: ${formatReceivedValue(resolution)}.`,
    );
  }
  if (!Array.isArray(item.candidateIngredientIds) || item.candidateIngredientIds.length === 0) {
    throw new ProductionSaveImportError(
      `candidateIngredientIds must be a nonempty array. Received: ${formatReceivedValue(item.candidateIngredientIds)}.`,
    );
  }
  item.candidateIngredientIds.forEach((candidateIngredientId, candidateIndex) => {
    if (typeof candidateIngredientId !== "string" || candidateIngredientId.trim().length === 0) {
      throw new ProductionSaveImportError(
        `candidateIngredientIds[${candidateIndex}] must be a nonempty string. Received: ${formatReceivedValue(candidateIngredientId)}.`,
      );
    }
  });
  if (typeof item.id !== "string" || item.id.trim().length === 0) {
    throw new ProductionSaveImportError(`id must be a nonempty string. Received: ${formatReceivedValue(item.id)}.`);
  }
  if (typeof item.objectId !== "string" || item.objectId.length === 0) {
    throw new ProductionSaveImportError(
      `objectId must be a nonempty string. Received: ${formatReceivedValue(item.objectId)}.`,
    );
  }
  if (!Number.isSafeInteger(item.quantity) || item.quantity < 1) {
    throw new ProductionSaveImportError(
      `quantity must be a positive safe integer. Received: ${formatReceivedValue(item.quantity)}.`,
    );
  }
  if (typeof resolution.ingredientId !== "string" || resolution.ingredientId.length === 0) {
    throw new ProductionSaveImportError(
      `ingredientId must be a nonempty string. Received: ${formatReceivedValue(resolution.ingredientId)}.`,
    );
  }
  if (!item.candidateIngredientIds.includes(resolution.ingredientId)) {
    throw new ProductionSaveImportError(
      `ingredientId is not a candidate for save object ${JSON.stringify(item.objectId)}. Received: ${formatReceivedValue(resolution.ingredientId)}.`,
    );
  }

  const quality = resolveInventoryQuality(item, resolution);

  let coconutSource: ProcessingCoconutSource | undefined;
  if (resolution.ingredientId === "coconut") {
    const receivedCoconutSource = resolution.coconutSource;
    if (receivedCoconutSource !== "foraged" && receivedCoconutSource !== "purchased-or-gifted") {
      throw new ProductionSaveImportError(
        `coconutSource must be foraged or purchased-or-gifted for save object ${JSON.stringify(item.objectId)}. Received: ${formatReceivedValue(receivedCoconutSource)}.`,
      );
    }
    coconutSource = receivedCoconutSource;
  } else if (resolution.coconutSource !== undefined) {
    throw new ProductionSaveImportError(
      `coconutSource is only valid for ingredientId "coconut". Received: ${formatReceivedValue(resolution.coconutSource)} for ${JSON.stringify(resolution.ingredientId)}.`,
    );
  }

  if (isBearsKnowledgeEligible(resolution.ingredientId) && typeof resolution.hasBearsKnowledge !== "boolean") {
    throw new ProductionSaveImportError(
      `hasBearsKnowledge must be selected for eligible ingredientId ${JSON.stringify(resolution.ingredientId)}. Received: ${formatReceivedValue(resolution.hasBearsKnowledge)}.`,
    );
  }
  if (!isBearsKnowledgeEligible(resolution.ingredientId) && resolution.hasBearsKnowledge !== undefined) {
    throw new ProductionSaveImportError(
      `hasBearsKnowledge is only valid for eligible berry ingredients. Received: ${formatReceivedValue(resolution.hasBearsKnowledge)} for ${JSON.stringify(resolution.ingredientId)}.`,
    );
  }

  return {
    id: item.id,
    ingredientId: resolution.ingredientId,
    quality,
    quantity: item.quantity,
    reservedQuantity: 0,
    availableDay: 0,
    ...(resolution.hasBearsKnowledge === undefined ? {} : { hasBearsKnowledge: resolution.hasBearsKnowledge }),
    ...(coconutSource === undefined ? {} : { coconutSource }),
  };
}

function validateSaveInput(xmlText: string, sourceName: string): void {
  if (typeof xmlText !== "string") {
    throw new ProductionSaveImportError(`Save XML must be a string. Received: ${formatReceivedValue(xmlText)}.`);
  }
  if (xmlText.length > productionSaveXmlMaxLength) {
    throw new ProductionSaveImportError(
      `Save XML exceeds ${productionSaveXmlMaxLength} characters. Received length: ${xmlText.length}; sourceName: ${formatReceivedValue(sourceName)}.`,
    );
  }
  if (typeof sourceName !== "string" || sourceName.trim().length === 0 || sourceName.length > productionSaveSourceNameMaxLength) {
    throw new ProductionSaveImportError(
      `sourceName must be a nonempty string no longer than ${productionSaveSourceNameMaxLength} characters. Received: ${formatReceivedValue(sourceName)}.`,
    );
  }
}

function rejectDtdAndEntityDeclarations(xmlText: string, sourceName: string): void {
  const declarationMatch = /<!\s*(DOCTYPE|ENTITY)\b/i.exec(xmlText);
  if (declarationMatch !== null) {
    throw new ProductionSaveImportError(
      `Save XML declarations ${JSON.stringify(declarationMatch[0])} are not allowed. sourceName: ${formatReceivedValue(sourceName)}.`,
    );
  }
}

function parseXmlDocument(xmlText: string, sourceName: string): Document {
  if (typeof DOMParser === "undefined") {
    throw new ProductionSaveImportError(
      `Save XML import requires DOMParser support. sourceName: ${formatReceivedValue(sourceName)}.`,
    );
  }
  return new DOMParser().parseFromString(xmlText, "application/xml");
}

function readSaveGameRoot(document: Document, sourceName: string): Element {
  const parserError = Array.from(document.getElementsByTagName("parsererror"))[0];
  if (parserError !== undefined) {
    throw new ProductionSaveImportError(
      `Save XML could not be parsed. sourceName: ${formatReceivedValue(sourceName)}; parser message: ${formatReceivedValue(parserError.textContent?.trim() ?? "")}.`,
    );
  }
  const root = document.documentElement;
  if (root === null || getElementName(root) !== "SaveGame") {
    throw new ProductionSaveImportError(
      `Save XML root must be <SaveGame>. Received: ${formatReceivedValue(root?.nodeName ?? null)}; sourceName: ${formatReceivedValue(sourceName)}.`,
    );
  }
  return root;
}

function readFarmDetails(
  saveGameElement: Element,
  playerElement: Element | null,
  sourceName: string,
): ProductionSaveCandidate["farm"] {
  const currentSeasonValue = readOptionalDirectChildText(saveGameElement, "currentSeason");
  let season: CropSeason | null = null;
  if (currentSeasonValue !== null) {
    if (!cropSeasons.includes(currentSeasonValue as CropSeason)) {
      throw new ProductionSaveImportError(
        `Save field currentSeason is invalid. Received: ${formatReceivedValue(currentSeasonValue)}.`,
      );
    }
    season = currentSeasonValue as CropSeason;
  }

  const day = readOptionalInteger(saveGameElement, "dayOfMonth", 1, 28, sourceName);
  const year = readOptionalInteger(saveGameElement, "year", 1, Number.MAX_SAFE_INTEGER, sourceName);
  return {
    farmName: playerElement === null ? null : readOptionalDirectChildText(playerElement, "farmName"),
    farmType:
      readOptionalDirectChildText(saveGameElement, "whichFarm") ??
      readOptionalDirectChildText(saveGameElement, "farmType"),
    day,
    season,
    year,
  };
}

function readProcessingProfession(
  playerElement: Element | null,
  sourceName: string,
): ProductionProfession | null {
  if (playerElement === null) return null;
  const professionsElement = getDirectChild(playerElement, "professions");
  if (professionsElement === null) return null;

  const professionIds = getDirectChildElements(professionsElement).map((professionElement, index) => {
    const value = professionElement.textContent?.trim() ?? "";
    if (getElementName(professionElement) !== "int" || !/^\d+$/.test(value)) {
      throw new ProductionSaveImportError(
        `Save player profession at index ${index} must be a nonnegative integer. Received: ${formatReceivedValue(value)}; sourceName: ${formatReceivedValue(sourceName)}.`,
      );
    }
    const professionId = Number(value);
    if (!Number.isSafeInteger(professionId)) {
      throw new ProductionSaveImportError(
        `Save player profession at index ${index} is outside the safe integer range. Received: ${formatReceivedValue(value)}; sourceName: ${formatReceivedValue(sourceName)}.`,
      );
    }
    return professionId;
  });

  if (professionIds.includes(4)) return "artisan";
  if (professionIds.includes(1)) return "tiller";
  return "none";
}

function readInventoryItems(
  saveGameElement: Element,
  saveElements: readonly Element[],
  playerElement: Element | null,
  sourceName: string,
): Readonly<{
  inventoryItems: readonly ProductionSaveInventoryItem[];
  unsupportedItems: readonly ProductionSaveUnsupportedItem[];
  reviewWarnings: readonly string[];
}> {
  const supportedItemGroups = new Map<string, MutableSupportedSaveItem>();
  const unsupportedItemGroups = new Map<string, MutableUnsupportedSaveItem>();
  const carriedMachineCounts = createMachineCounts();
  let itemIndex = 0;
  const warnings = new Set<string>();
  const junimoInventoryItems = readJunimoSharedInventoryItems(saveGameElement, sourceName);
  const inventoryItemGroups = [
    ...saveElements.filter((element) =>
      getElementName(element) === "items" && isPlayerOrChestInventory(element, playerElement),
    ).map((element) => getDirectChildElements(element)),
    ...(junimoInventoryItems === null ? [] : [junimoInventoryItems]),
  ];

  for (const serializedItems of inventoryItemGroups) {
    for (const serializedItem of serializedItems) {
      if (isNilElement(serializedItem)) continue;
      const itemElement = findSerializedItemElement(serializedItem);
      if (itemElement === null) {
        throw new ProductionSaveImportError(
          `Save inventory item ${itemIndex} has no item identifier. Received: ${formatReceivedValue(serializedItem.textContent?.trim() ?? "")}; sourceName: ${formatReceivedValue(sourceName)}.`,
        );
      }

      const objectReference = readSaveObjectReference(itemElement, itemIndex, sourceName);
      const objectId = objectReference.objectId;
      const quantity = readStackCount(itemElement, itemIndex, sourceName);
      const itemName = readSaveItemName(itemElement, objectId);
      const isBigCraftable = readSaveItemIsBigCraftable(itemElement, objectReference, itemIndex, sourceName);
      const ingredientIds = isBigCraftable !== true &&
        (objectReference.typeDefinitionId === null || objectReference.typeDefinitionId === "O")
        ? PRODUCTION_INGREDIENT_IDS_BY_SAVE_OBJECT_ID[objectId]
        : undefined;
      if (ingredientIds === undefined) {
        const machine = SAVE_MACHINE_BY_OBJECT_ID[objectId];
        if (machine !== undefined) {
          if (isBigCraftable === null) {
            throw new ProductionSaveImportError(
              `Save inventory objectId ${JSON.stringify(objectId)} is ambiguous between an object and a big craftable. Received: missing QualifiedItemId type and bigCraftable flag; sourceName: ${formatReceivedValue(sourceName)}.`,
            );
          }
          if (!isBigCraftable) {
            appendUnsupportedItem(unsupportedItemGroups, objectId, itemName, quantity);
            itemIndex += 1;
            continue;
          }
          carriedMachineCounts[machine] = addSaveInventoryQuantity(
            carriedMachineCounts[machine],
            quantity,
            `stored ${machine} count for objectId ${JSON.stringify(objectId)}`,
          );
        } else {
          appendUnsupportedItem(unsupportedItemGroups, objectId, itemName, quantity);
        }
        itemIndex += 1;
        continue;
      }

      const savedQuality = readSavedQuality(itemElement, itemIndex, sourceName);
      const groupKey = `${objectId}:${savedQuality}`;
      const existingGroup = supportedItemGroups.get(groupKey);
      if (existingGroup === undefined) {
        const itemPreview = createSupportedSaveItem(
          sourceName,
          objectId,
          itemName,
          savedQuality,
          ingredientIds,
          itemIndex,
        );
        supportedItemGroups.set(groupKey, {
          ...itemPreview,
          quantity,
        });
      } else {
        existingGroup.quantity = addSaveInventoryQuantity(
          existingGroup.quantity,
          quantity,
          `inventory quantity for objectId ${JSON.stringify(objectId)} and quality ${savedQuality}`,
        );
      }
      itemIndex += 1;
    }
  }

  if (Object.values(carriedMachineCounts).some((count) => count > 0)) {
    warnings.add(
      "Keg, Preserves Jar, or Dehydrator items were detected as stored equipment; they are not included in placed free capacity.",
    );
  }
  const reviewItemCount = [...supportedItemGroups.values()].filter((item) => item.requiresReview).length;
  if (reviewItemCount > 0) {
    warnings.add(`${reviewItemCount} supported inventory item group(s) need source or quality review before import.`);
  }

  return {
    inventoryItems: [...supportedItemGroups.values()].map(({ quantity, ...item }) => ({ ...item, quantity })),
    unsupportedItems: [...unsupportedItemGroups.values()],
    reviewWarnings: [...warnings],
  };
}

function readJunimoSharedInventoryItems(saveGameElement: Element, sourceName: string): readonly Element[] | null {
  const globalInventoryItems = readGlobalJunimoInventoryItems(saveGameElement, sourceName);
  const legacyJunimoChestElement = readLegacyJunimoChestElement(saveGameElement, sourceName);
  const legacyInventoryItems = legacyJunimoChestElement === null
    ? null
    : readSerializedItemList(legacyJunimoChestElement, "junimoChest", sourceName);

  if (globalInventoryItems !== null && legacyInventoryItems !== null) {
    if (globalInventoryItems.length > 0 && legacyInventoryItems.length > 0) {
      assertMatchingJunimoInventory(globalInventoryItems, legacyInventoryItems, sourceName);
    }
    if (globalInventoryItems.length > 0) return globalInventoryItems;
    if (legacyInventoryItems.length > 0) return legacyInventoryItems;
    return globalInventoryItems;
  }

  if (globalInventoryItems !== null) return globalInventoryItems;
  if (legacyInventoryItems !== null) return legacyInventoryItems;
  return null;
}

function readGlobalJunimoInventoryItems(saveGameElement: Element, sourceName: string): readonly Element[] | null {
  const globalInventoriesElement = getDirectChild(saveGameElement, "globalInventories");
  if (globalInventoriesElement === null) return null;

  let junimoInventoryItems: readonly Element[] | null = null;
  for (const [entryIndex, dictionaryEntry] of getDirectChildElements(globalInventoriesElement).entries()) {
    if (getElementName(dictionaryEntry) !== "item") {
      throw new ProductionSaveImportError(
        `globalInventories entry ${entryIndex} must be an <item>. Received: ${formatReceivedValue(getElementName(dictionaryEntry))}; sourceName: ${formatReceivedValue(sourceName)}.`,
      );
    }
    const keyElement = getDirectChild(dictionaryEntry, "key");
    const valueElement = getDirectChild(dictionaryEntry, "value");
    if (keyElement === null || valueElement === null) {
      throw new ProductionSaveImportError(
        `globalInventories entry ${entryIndex} must include <key> and <value>. Received: key=${formatReceivedValue(keyElement?.textContent?.trim() ?? null)}, value=${formatReceivedValue(valueElement?.textContent?.trim() ?? null)}; sourceName: ${formatReceivedValue(sourceName)}.`,
      );
    }

    const keyValueElement = getDirectChild(keyElement, "string");
    const inventoryId = keyValueElement?.textContent?.trim() ?? keyElement.textContent?.trim() ?? "";
    if (inventoryId.length === 0) {
      throw new ProductionSaveImportError(
        `globalInventories entry ${entryIndex} has an empty string key. Received: ${formatReceivedValue(inventoryId)}; sourceName: ${formatReceivedValue(sourceName)}.`,
      );
    }
    if (inventoryId !== "JunimoChests") continue;
    if (junimoInventoryItems !== null) {
      throw new ProductionSaveImportError(
        `globalInventories contains duplicate JunimoChests keys. Received: ${formatReceivedValue(inventoryId)}; sourceName: ${formatReceivedValue(sourceName)}.`,
      );
    }
    junimoInventoryItems = readSerializedItemList(valueElement, "globalInventories[JunimoChests]", sourceName);
  }
  return junimoInventoryItems;
}

function readLegacyJunimoChestElement(saveGameElement: Element, sourceName: string): Element | null {
  const legacyElements = getDirectChildElements(saveGameElement).filter(
    (element) => getElementName(element) === "junimoChest",
  );
  if (legacyElements.length > 1) {
    throw new ProductionSaveImportError(
      `Save has multiple legacy junimoChest elements. Received: ${formatReceivedValue(legacyElements.length)}; sourceName: ${formatReceivedValue(sourceName)}.`,
    );
  }
  return legacyElements[0] ?? null;
}

function readSerializedItemList(
  listValueElement: Element,
  fieldName: string,
  sourceName: string,
): readonly Element[] {
  const arrayElement = getDirectChild(listValueElement, "ArrayOfItem");
  const itemListElement = arrayElement ?? listValueElement;
  const itemElements = getDirectChildElements(itemListElement);
  for (const [itemIndex, itemElement] of itemElements.entries()) {
    if (getElementName(itemElement) !== "Item") {
      throw new ProductionSaveImportError(
        `${fieldName} entry ${itemIndex} must be an <Item>. Received: ${formatReceivedValue(getElementName(itemElement))}; sourceName: ${formatReceivedValue(sourceName)}.`,
      );
    }
  }
  return itemElements;
}

function assertMatchingJunimoInventory(
  globalInventoryItems: readonly Element[],
  legacyInventoryItems: readonly Element[],
  sourceName: string,
): void {
  const globalStock = readSaveInventoryStock(globalInventoryItems, "globalInventories[JunimoChests]", sourceName);
  const legacyStock = readSaveInventoryStock(legacyInventoryItems, "junimoChest", sourceName);
  const itemKeys = new Set([...globalStock.keys(), ...legacyStock.keys()]);

  for (const itemKey of itemKeys) {
    const globalQuantity = globalStock.get(itemKey) ?? 0;
    const legacyQuantity = legacyStock.get(itemKey) ?? 0;
    if (globalQuantity !== legacyQuantity) {
      throw new ProductionSaveImportError(
        `Global Junimo inventory conflicts with the legacy junimoChest list. Received: item=${formatReceivedValue(itemKey)}, globalQuantity=${formatReceivedValue(globalQuantity)}, legacyQuantity=${formatReceivedValue(legacyQuantity)}; sourceName: ${formatReceivedValue(sourceName)}.`,
      );
    }
  }
}

function readSaveInventoryStock(
  serializedItems: readonly Element[],
  fieldName: string,
  sourceName: string,
): Map<string, number> {
  const itemQuantities = new Map<string, number>();
  for (const [itemIndex, serializedItem] of serializedItems.entries()) {
    if (isNilElement(serializedItem)) continue;
    const itemElement = findSerializedItemElement(serializedItem);
    if (itemElement === null) {
      throw new ProductionSaveImportError(
        `${fieldName} item ${itemIndex} has no item identifier. Received: ${formatReceivedValue(serializedItem.textContent?.trim() ?? "")}; sourceName: ${formatReceivedValue(sourceName)}.`,
      );
    }
    const objectReference = readSaveObjectReference(itemElement, itemIndex, sourceName);
    const quantity = readStackCount(itemElement, itemIndex, sourceName);
    const isBigCraftable = readSaveItemIsBigCraftable(itemElement, objectReference, itemIndex, sourceName);
    const savedQualityValues = ["quality", "Quality"]
      .map((fieldName) => readOptionalDirectChildText(itemElement, fieldName))
      .filter((qualityValue): qualityValue is string => qualityValue !== null);
    const itemKey = JSON.stringify({
      objectId: objectReference.objectId,
      typeDefinitionId: objectReference.typeDefinitionId,
      isBigCraftable,
      savedQualityValues,
    });
    itemQuantities.set(
      itemKey,
      addSaveInventoryQuantity(
        itemQuantities.get(itemKey) ?? 0,
        quantity,
        `${fieldName} quantity for ${itemKey}`,
      ),
    );
  }
  return itemQuantities;
}

function createSupportedSaveItem(
  sourceName: string,
  objectId: string,
  itemName: string,
  savedQuality: number,
  candidateIngredientIds: readonly string[],
  itemIndex: number,
): Omit<ProductionSaveInventoryItem, "quantity"> {
  for (const ingredientId of candidateIngredientIds) {
    getProcessingIngredient(ingredientId);
  }

  const quality = readProductionQuality(savedQuality, objectId);
  const validIngredientIds = candidateIngredientIds.filter((ingredientId) =>
    quality !== null && getProcessingIngredientQualities(ingredientId).includes(quality),
  );
  const chosenIngredientId = validIngredientIds.length === 1 ? validIngredientIds[0] ?? null : null;
  const needsCoconutSourceReview = chosenIngredientId === "coconut";
  const needsBearsKnowledgeReview = validIngredientIds.some((ingredientId) => isBearsKnowledgeEligible(ingredientId));
  const unresolvedSource = validIngredientIds.length > 1;
  const noIngredientSupportsQuality = validIngredientIds.length === 0;
  const reviewReasons = [
    ...(unresolvedSource ? ["The save item ID has multiple source-specific ingredient records; select its source." ] : []),
    ...(needsCoconutSourceReview ? ["The save does not reveal whether this coconut was foraged or purchased/gifted; select its source."] : []),
    ...(needsBearsKnowledgeReview ? ["The save does not reveal whether Bear's Knowledge is active for this berry; select its value."] : []),
    ...(noIngredientSupportsQuality ? [`Saved quality ${savedQuality} is unsupported for all candidate ingredient records; choose a valid quality manually.`] : []),
  ];

  return {
    id: createSaveInventoryLineId(sourceName, objectId, savedQuality, itemIndex),
    objectId,
    itemName,
    savedQuality,
    quality: validIngredientIds.length === 0 ? null : quality,
    candidateIngredientIds: validIngredientIds.length === 0 ? candidateIngredientIds : validIngredientIds,
    selectedIngredientId: noIngredientSupportsQuality ? null : chosenIngredientId,
    coconutSource: null,
    requiresReview: reviewReasons.length > 0,
    reviewReason: reviewReasons.length === 0 ? null : reviewReasons.join(" "),
  };
}

function readProductionQuality(savedQuality: number, objectId: string): ProductionQuality | null {
  const qualityBySaveValue: Readonly<Record<number, ProductionQuality>> = {
    0: "normal",
    1: "silver",
    2: "gold",
    4: "iridium",
  };
  const quality = qualityBySaveValue[savedQuality];
  if (quality === undefined && ![0, 1, 2, 4].includes(savedQuality)) {
    throw new ProductionSaveImportError(
      `Save object ${JSON.stringify(objectId)} has unsupported quality code. Received: ${formatReceivedValue(savedQuality)}.`,
    );
  }
  return quality ?? null;
}

function resolveInventoryQuality(
  item: ProductionSaveInventoryItem,
  resolution: ProductionSaveInventoryResolution,
): ProductionQuality {
  const validQualities = getProcessingIngredientQualities(resolution.ingredientId);
  const quality: unknown = resolution.quality === undefined ? item.quality : resolution.quality;
  if (typeof quality !== "string" || !validQualities.includes(quality as ProcessingQuality)) {
    throw new ProductionSaveImportError(
      `A supported quality is required for ingredientId ${JSON.stringify(resolution.ingredientId)}. Received: ${formatReceivedValue(quality)}.`,
    );
  }
  return quality as ProductionQuality;
}

function readPlacedMachines(saveElements: readonly Element[], sourceName: string): Readonly<{
  machineCounts: ProductionMachineCounts;
  busyMachineCounts: ProductionMachineCounts;
  reviewWarnings: readonly string[];
}> {
  const machineCounts = createMachineCounts();
  const busyMachineCounts = createMachineCounts();
  const reviewWarnings: string[] = [];
  let placedObjectIndex = 0;
  let foundMachineCount = 0;

  for (const objectsElement of saveElements.filter((element) => getElementName(element) === "objects")) {
    for (const dictionaryEntry of getDirectChildElements(objectsElement)) {
      const entryValue = getDirectChild(dictionaryEntry, "value");
      const objectElement = entryValue === null ? findSerializedItemElement(dictionaryEntry) : findSerializedItemElement(entryValue);
      if (objectElement === null) continue;
      const objectReference = readSaveObjectReference(objectElement, placedObjectIndex, sourceName);
      const objectId = objectReference.objectId;
      const machine = SAVE_MACHINE_BY_OBJECT_ID[objectId];
      if (machine === undefined) {
        placedObjectIndex += 1;
        continue;
      }
      const isBigCraftable = readSaveItemIsBigCraftable(
        objectElement,
        objectReference,
        placedObjectIndex,
        sourceName,
      );
      if (isBigCraftable === null) {
        throw new ProductionSaveImportError(
          `Placed machine candidate ${JSON.stringify(objectId)} at objects index ${placedObjectIndex} is missing a QualifiedItemId type or bigCraftable flag. Received: ${formatReceivedValue(isBigCraftable)}; sourceName: ${formatReceivedValue(sourceName)}.`,
        );
      }
      if (!isBigCraftable) {
        placedObjectIndex += 1;
        continue;
      }
      foundMachineCount += 1;

      const minutesUntilReady = readOptionalInteger(objectElement, "minutesUntilReady", 0, Number.MAX_SAFE_INTEGER, sourceName);
      const readyForHarvestValue = readOptionalDirectChildText(objectElement, "readyForHarvest");
      const heldObjectElement = getDirectChild(objectElement, "heldObject");
      if (minutesUntilReady === null && readyForHarvestValue === null && heldObjectElement === null) {
        throw new ProductionSaveImportError(
          `Placed machine ${JSON.stringify(machine)} at objects index ${placedObjectIndex} has no readable busy-state fields. sourceName: ${formatReceivedValue(sourceName)}.`,
        );
      }
      const readyForHarvest = readyForHarvestValue === null
        ? false
        : readSaveBoolean(readyForHarvestValue, `objects[${placedObjectIndex}].readyForHarvest`);
      const hasHeldObject = heldObjectElement !== null && !isNilElement(heldObjectElement) && findSerializedItemElement(heldObjectElement) !== null;
      const isBusy = (minutesUntilReady ?? 0) > 0 || readyForHarvest || hasHeldObject;
      if (minutesUntilReady === null && !isBusy) {
        throw new ProductionSaveImportError(
          `Placed machine ${JSON.stringify(machine)} at objects index ${placedObjectIndex} has no minutesUntilReady and no positive busy-state signal, so free capacity cannot be confirmed. Received: minutesUntilReady=null, readyForHarvest=${formatReceivedValue(readyForHarvest)}, heldObjectPresent=${formatReceivedValue(hasHeldObject)}; sourceName: ${formatReceivedValue(sourceName)}.`,
        );
      }
      if (isBusy) {
        busyMachineCounts[machine] += 1;
      } else {
        machineCounts[machine] += 1;
      }
      placedObjectIndex += 1;
    }
  }

  if (foundMachineCount === 0) {
    reviewWarnings.push("No placed processing machines were found in the save's locations or building interiors.");
  }

  return { machineCounts, busyMachineCounts, reviewWarnings };
}

function readOptionalInteger(
  parent: Element,
  fieldName: string,
  minimum: number,
  maximum: number,
  sourceName: string,
): number | null {
  const rawValue = readOptionalDirectChildText(parent, fieldName);
  if (rawValue === null) return null;
  if (!/^\d+$/.test(rawValue)) {
    throw new ProductionSaveImportError(
      `Save field ${fieldName} must be a nonnegative integer. Received: ${formatReceivedValue(rawValue)}; sourceName: ${formatReceivedValue(sourceName)}.`,
    );
  }
  const parsedValue = Number(rawValue);
  if (!Number.isSafeInteger(parsedValue) || parsedValue < minimum || parsedValue > maximum) {
    throw new ProductionSaveImportError(
      `Save field ${fieldName} must be from ${minimum} to ${maximum}. Received: ${formatReceivedValue(rawValue)}; sourceName: ${formatReceivedValue(sourceName)}.`,
    );
  }
  return parsedValue;
}

function readStackCount(itemElement: Element, itemIndex: number, sourceName: string): number {
  const stackValues = ["Stack", "stack", "quantity"]
    .map((fieldName) => readOptionalDirectChildText(itemElement, fieldName))
    .filter((stackValue): stackValue is string => stackValue !== null);
  if (stackValues.length === 0) {
    throw new ProductionSaveImportError(
      `Save inventory item ${itemIndex} is missing Stack. sourceName: ${formatReceivedValue(sourceName)}.`,
    );
  }
  const parsedStackValues = stackValues.map((stackValue) => {
    if (!/^\d+$/.test(stackValue)) {
      throw new ProductionSaveImportError(
        `Save inventory item ${itemIndex} Stack must be a nonnegative integer. Received: ${formatReceivedValue(stackValue)}; sourceName: ${formatReceivedValue(sourceName)}.`,
      );
    }
    const quantity = Number(stackValue);
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      throw new ProductionSaveImportError(
        `Save inventory item ${itemIndex} Stack must be a positive safe integer. Received: ${formatReceivedValue(stackValue)}; sourceName: ${formatReceivedValue(sourceName)}.`,
      );
    }
    return quantity;
  });
  if (new Set(parsedStackValues).size > 1) {
    throw new ProductionSaveImportError(
      `Save inventory item ${itemIndex} has conflicting Stack values. Received: ${formatReceivedValue(parsedStackValues)}; sourceName: ${formatReceivedValue(sourceName)}.`,
    );
  }
  return parsedStackValues[0] as number;
}

function readSavedQuality(itemElement: Element, itemIndex: number, sourceName: string): number {
  const qualityValues = ["quality", "Quality"]
    .map((fieldName) => readOptionalDirectChildText(itemElement, fieldName))
    .filter((qualityValue): qualityValue is string => qualityValue !== null);
  if (qualityValues.length === 0) {
    throw new ProductionSaveImportError(
      `Supported save inventory item ${itemIndex} is missing quality. sourceName: ${formatReceivedValue(sourceName)}.`,
    );
  }
  const parsedQualityValues = qualityValues.map((qualityValue) => {
    if (!/^\d+$/.test(qualityValue)) {
      throw new ProductionSaveImportError(
        `Save inventory item ${itemIndex} quality must be a nonnegative integer. Received: ${formatReceivedValue(qualityValue)}; sourceName: ${formatReceivedValue(sourceName)}.`,
      );
    }
    const quality = Number(qualityValue);
    if (!Number.isSafeInteger(quality)) {
      throw new ProductionSaveImportError(
        `Save inventory item ${itemIndex} quality is outside the safe integer range. Received: ${formatReceivedValue(qualityValue)}; sourceName: ${formatReceivedValue(sourceName)}.`,
      );
    }
    return quality;
  });
  if (new Set(parsedQualityValues).size > 1) {
    throw new ProductionSaveImportError(
      `Save inventory item ${itemIndex} has conflicting quality values. Received: ${formatReceivedValue(parsedQualityValues)}; sourceName: ${formatReceivedValue(sourceName)}.`,
    );
  }
  return parsedQualityValues[0] as number;
}

function readSaveObjectReference(
  itemElement: Element,
  itemIndex: number,
  sourceName: string,
): SaveObjectReference {
  const itemId = readOptionalDirectChildText(itemElement, "itemId");
  const qualifiedItemId = readOptionalDirectChildText(itemElement, "QualifiedItemId");
  const parentSheetIndex = readOptionalDirectChildText(itemElement, "parentSheetIndex");
  if (itemId === "") {
    throw new ProductionSaveImportError(
      `Save item ${itemIndex} itemId must not be empty. Received: ${formatReceivedValue(itemId)}; sourceName: ${formatReceivedValue(sourceName)}.`,
    );
  }
  if (qualifiedItemId === "") {
    throw new ProductionSaveImportError(
      `Save item ${itemIndex} QualifiedItemId must not be empty. Received: ${formatReceivedValue(qualifiedItemId)}; sourceName: ${formatReceivedValue(sourceName)}.`,
    );
  }

  let objectId = itemId ?? parentSheetIndex;
  let typeDefinitionId: string | null = null;
  if (qualifiedItemId !== null) {
    const qualifiedParts = /^\(([^()\s]+)\)(.+)$/.exec(qualifiedItemId);
    if (qualifiedParts === null) {
      throw new ProductionSaveImportError(
        `Save item ${itemIndex} QualifiedItemId must contain a type prefix and item ID. Received: ${formatReceivedValue(qualifiedItemId)}; sourceName: ${formatReceivedValue(sourceName)}.`,
      );
    }
    typeDefinitionId = qualifiedParts[1] as string;
    const qualifiedObjectId = qualifiedParts[2] as string;
    if (itemId !== null && itemId !== qualifiedObjectId) {
      throw new ProductionSaveImportError(
        `Save item ${itemIndex} has conflicting itemId and QualifiedItemId aliases. Received: itemId=${formatReceivedValue(itemId)}, QualifiedItemId=${formatReceivedValue(qualifiedItemId)} (normalized ID ${formatReceivedValue(qualifiedObjectId)}); sourceName: ${formatReceivedValue(sourceName)}.`,
      );
    }
    objectId = itemId ?? qualifiedObjectId;
  }

  if (objectId === null || objectId.length === 0) {
    throw new ProductionSaveImportError(
      `Save item ${itemIndex} is missing parentSheetIndex, itemId, and QualifiedItemId. sourceName: ${formatReceivedValue(sourceName)}.`,
    );
  }
  return { objectId, typeDefinitionId };
}

function readSaveItemIsBigCraftable(
  itemElement: Element,
  objectReference: SaveObjectReference,
  itemIndex: number,
  sourceName: string,
): boolean | null {
  const bigCraftableText = readOptionalDirectChildText(itemElement, "bigCraftable");
  const bigCraftableFlag = bigCraftableText === null
    ? null
    : readSaveBoolean(bigCraftableText, `saveItems[${itemIndex}].bigCraftable`);
  const isObjectType = objectReference.typeDefinitionId === "O";
  const isBigCraftableType = objectReference.typeDefinitionId === "BC";

  if ((isObjectType && bigCraftableFlag === true) || (isBigCraftableType && bigCraftableFlag === false)) {
    throw new ProductionSaveImportError(
      `Save item has conflicting QualifiedItemId type and bigCraftable flag. Received: QualifiedItemId type=${formatReceivedValue(objectReference.typeDefinitionId)}, bigCraftable=${formatReceivedValue(bigCraftableFlag)} for objectId ${formatReceivedValue(objectReference.objectId)}; sourceName: ${formatReceivedValue(sourceName)}.`,
    );
  }
  if (isObjectType) return false;
  if (isBigCraftableType) return true;
  if (objectReference.typeDefinitionId !== null) return false;
  return bigCraftableFlag;
}

function readSaveItemName(itemElement: Element, objectId: string): string {
  const name = ["DisplayName", "displayName", "Name", "name"]
    .map((fieldName) => readOptionalDirectChildText(itemElement, fieldName))
    .find((value): value is string => value !== null && value.length > 0);
  if (name !== undefined) return name;
  const candidateIngredientIds = PRODUCTION_INGREDIENT_IDS_BY_SAVE_OBJECT_ID[objectId];
  if (candidateIngredientIds !== undefined) {
    return getProcessingIngredient(candidateIngredientIds[0] as string).englishName.split(" (")[0] as string;
  }
  return `Object ${objectId}`;
}

function appendUnsupportedItem(
  unsupportedItems: Map<string, MutableUnsupportedSaveItem>,
  objectId: string,
  itemName: string,
  quantity: number,
): void {
  const groupKey = `${objectId}:${itemName}`;
  const existingItem = unsupportedItems.get(groupKey);
  if (existingItem === undefined) {
    unsupportedItems.set(groupKey, { objectId, itemName, quantity });
  } else {
    existingItem.quantity = addSaveInventoryQuantity(
      existingItem.quantity,
      quantity,
      `unsupported inventory quantity for objectId ${JSON.stringify(objectId)}`,
    );
  }
}

function addSaveInventoryQuantity(currentQuantity: number, addedQuantity: number, fieldName: string): number {
  const combinedQuantity = currentQuantity + addedQuantity;
  if (!Number.isSafeInteger(combinedQuantity)) {
    throw new ProductionSaveImportError(
      `${fieldName} exceeds the safe integer range. Received: ${formatReceivedValue(currentQuantity)} + ${formatReceivedValue(addedQuantity)} = ${formatReceivedValue(combinedQuantity)}.`,
    );
  }
  return combinedQuantity;
}

function createSaveInventoryLineId(
  sourceName: string,
  objectId: string,
  quality: number,
  itemIndex: number,
): string {
  return `save:${encodeURIComponent(sourceName)}:${objectId}:${quality}:${itemIndex}`;
}

function createMachineCounts(): Record<ProductionMachine, number> {
  return { keg: 0, jar: 0, dehydrator: 0 };
}

function isPlayerOrChestInventory(itemsElement: Element, playerElement: Element | null): boolean {
  if (playerElement !== null && itemsElement.parentElement === playerElement) return true;

  let ancestorElement = itemsElement.parentElement;
  while (ancestorElement !== null) {
    if (getElementName(ancestorElement) === "Object" && isChestObject(ancestorElement)) return true;
    ancestorElement = ancestorElement.parentElement;
  }
  return false;
}

function isChestObject(objectElement: Element): boolean {
  const objectType =
    objectElement.getAttributeNS("http://www.w3.org/2001/XMLSchema-instance", "type") ??
    objectElement.getAttribute("xsi:type") ??
    "";
  return objectType.split(".").at(-1) === "Chest";
}

function findSerializedItemElement(container: Element): Element | null {
  if (hasSaveItemIdField(container)) return container;
  for (const element of listElements(container).slice(1)) {
    if (hasSaveItemIdField(element)) return element;
  }
  return null;
}

function hasSaveItemIdField(element: Element): boolean {
  return ["parentSheetIndex", "itemId", "QualifiedItemId"].some((fieldName) =>
    getDirectChild(element, fieldName) !== null,
  );
}

function isNilElement(element: Element): boolean {
  const nilValue = element.getAttribute("xsi:nil") ?? element.getAttribute("nil");
  return nilValue?.toLowerCase() === "true" || nilValue === "1";
}

function readSaveBoolean(value: string, fieldName: string): boolean {
  if (value === "true" || value === "True" || value === "1") return true;
  if (value === "false" || value === "False" || value === "0") return false;
  throw new ProductionSaveImportError(
    `${fieldName} must be a boolean. Received: ${formatReceivedValue(value)}.`,
  );
}

function readOptionalDirectChildText(parent: Element, fieldName: string): string | null {
  const child = getDirectChild(parent, fieldName);
  if (child === null) return null;
  return child.textContent?.trim() ?? "";
}

function getDirectChild(parent: Element, childName: string): Element | null {
  for (const childNode of Array.from(parent.childNodes)) {
    if (childNode.nodeType === 1 && getElementName(childNode as Element) === childName) {
      return childNode as Element;
    }
  }
  return null;
}

function getDirectChildElements(parent: Element): Element[] {
  return Array.from(parent.childNodes)
    .filter((childNode) => childNode.nodeType === 1)
    .map((childNode) => childNode as Element);
}

function listElements(root: Document | Element): Element[] {
  const elements: Element[] = [];
  const documentRoot = root.nodeType === 9 ? (root as Document).documentElement : null;
  const stack: Element[] = root.nodeType === 9
    ? documentRoot === null ? [] : [documentRoot]
    : [root as Element];

  while (stack.length > 0) {
    const currentElement = stack.pop() as Element;
    elements.push(currentElement);
    const children = getDirectChildElements(currentElement);
    for (let childIndex = children.length - 1; childIndex >= 0; childIndex -= 1) {
      stack.push(children[childIndex] as Element);
    }
  }
  return elements;
}

function getElementName(element: Element): string {
  return element.localName ?? element.nodeName.split(":").at(-1) ?? element.nodeName;
}

function formatReceivedValue(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch (error) {
    if (error instanceof TypeError) {
      return `[unserializable ${typeof value}: ${String(value)}]`;
    }
    throw error;
  }
}

type MutableSupportedSaveItem = Omit<ProductionSaveInventoryItem, "quantity"> & {
  quantity: number;
};

type SaveObjectReference = Readonly<{
  objectId: string;
  typeDefinitionId: string | null;
}>;

type MutableUnsupportedSaveItem = {
  objectId: string;
  itemName: string;
  quantity: number;
};

const SAVE_MACHINE_BY_OBJECT_ID: Readonly<Record<string, ProductionMachine>> = {
  "12": "keg",
  "15": "jar",
  Dehydrator: "dehydrator",
};

const PRODUCTION_INGREDIENT_IDS_BY_SAVE_OBJECT_ID: Readonly<Record<string, readonly string[]>> = {
  "16": ["wild-horseradish"],
  "20": ["leek"],
  "22": ["dandelion"],
  "24": ["parsnip"],
  "78": ["cave-carrot"],
  "88": ["coconut"],
  "90": ["cactus-fruit", "cactus-fruit-grown"],
  "91": ["banana"],
  "188": ["green-bean"],
  "190": ["cauliflower"],
  "192": ["potato"],
  "248": ["garlic"],
  "250": ["kale"],
  "252": ["rhubarb"],
  "254": ["melon"],
  "256": ["tomato"],
  "257": ["morel"],
  "258": ["blueberry"],
  "259": ["fiddlehead-fern"],
  "260": ["hot-pepper"],
  "262": ["wheat"],
  "264": ["radish"],
  "266": ["red-cabbage"],
  "268": ["starfruit"],
  "270": ["corn"],
  "271": ["unmilled-rice"],
  "272": ["eggplant"],
  "274": ["artichoke"],
  "276": ["pumpkin"],
  "278": ["bok-choy"],
  "280": ["yam"],
  "281": ["chanterelle"],
  "282": ["cranberries"],
  "284": ["beet"],
  "296": ["salmonberry", "salmonberry-cave"],
  "300": ["amaranth"],
  "304": ["hops"],
  "340": [
    "honey-blue-jazz",
    "honey-fairy-rose",
    "honey-poppy",
    "honey-summer-spangle",
    "honey-sunflower",
    "honey-tulip",
    "honey-wild",
  ],
  "396": ["spice-berry"],
  "398": ["grape-foraged", "grape"],
  "399": ["spring-onion"],
  "400": ["strawberry"],
  "404": ["common-mushroom"],
  "406": ["wild-plum"],
  "408": ["hazelnut"],
  "410": ["blackberry", "blackberry-cave", "blackberry-ground"],
  "412": ["winter-root"],
  "414": ["crystal-fruit"],
  "416": ["snow-yam"],
  "420": ["red-mushroom"],
  "422": ["purple-mushroom"],
  "423": ["rice"],
  "433": ["coffee-bean"],
  "454": ["ancient-fruit"],
  "613": ["apple"],
  "634": ["apricot"],
  "635": ["orange"],
  "636": ["peach"],
  "637": ["pomegranate"],
  "638": ["cherry"],
  "815": ["tea-leaves"],
  "829": ["ginger"],
  "830": ["taro-root"],
  "832": ["pineapple"],
  "834": ["mango"],
  "851": ["magma-cap"],
  "889": ["qi-fruit"],
  Broccoli: ["broccoli"],
  Carrot: ["carrot"],
  Powdermelon: ["powdermelon"],
  SummerSquash: ["summer-squash"],
};

for (const candidateIngredientIds of Object.values(PRODUCTION_INGREDIENT_IDS_BY_SAVE_OBJECT_ID)) {
  for (const ingredientId of candidateIngredientIds) {
    getProcessingIngredient(ingredientId);
  }
}
