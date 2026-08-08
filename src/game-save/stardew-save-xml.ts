import type {
  GameSaveUnmappedEntry,
  ParsedStardewGameSave,
} from "./game-save-import";
import { GameSaveImportError } from "./game-save-import";

export type GameSaveXmlParser = (xmlSource: string) => Document;

export function parseStardewGameSaveXml(
  xmlSource: string,
  parseXml: GameSaveXmlParser = parseXmlWithBrowserDomParser,
): ParsedStardewGameSave {
  assertXmlSource(xmlSource);
  assertXmlParser(parseXml);
  const xmlDocument = parseXml(xmlSource);
  const saveGameElement = getSaveGameElement(xmlDocument);
  const farmElement = getFarmElement(saveGameElement);
  const unmappedEntries: GameSaveUnmappedEntry[] = [];
  const parsedTerrainFeatures = parseTerrainFeatures(farmElement, unmappedEntries);
  appendLargeTerrainFeatureUnmappedEntries(farmElement, unmappedEntries);
  appendFurnitureUnmappedEntries(farmElement, unmappedEntries);

  return {
    buildings: parseSavedBuildings(farmElement),
    crops: parsedTerrainFeatures.crops,
    farmName: readRequiredText(
      getRequiredDirectChild(
        getRequiredDirectChild(saveGameElement, "player", "SaveGame"),
        "farmName",
        "SaveGame.player",
      ),
      "SaveGame.player.farmName",
    ),
    floorings: parsedTerrainFeatures.floorings,
    objects: parseSavedObjects(farmElement),
    resourceClumps: parseResourceClumps(farmElement),
    season: readRequiredText(
      getRequiredDirectChild(saveGameElement, "currentSeason", "SaveGame"),
      "SaveGame.currentSeason",
    ),
    trees: parsedTerrainFeatures.trees,
    unmappedEntries,
    whichFarm: readRequiredText(
      getRequiredDirectChild(saveGameElement, "whichFarm", "SaveGame"),
      "SaveGame.whichFarm",
    ),
  };
}

function parseXmlWithBrowserDomParser(xmlSource: string): Document {
  if (typeof DOMParser === "undefined") {
    throw new GameSaveImportError(
      "Game save import requires browser DOMParser support.",
    );
  }

  return new DOMParser().parseFromString(xmlSource, "application/xml");
}

function getSaveGameElement(xmlDocument: Document): Element {
  if (hasXmlParserError(xmlDocument)) {
    throw new GameSaveImportError(
      "Failed to import save file: the XML could not be parsed.",
    );
  }

  const rootElement = xmlDocument.documentElement;

  if (rootElement === null || getElementName(rootElement) !== "SaveGame") {
    throw new GameSaveImportError("Not a Stardew Valley save file.");
  }

  return rootElement;
}

function getFarmElement(saveGameElement: Element): Element {
  const locationsElement = getDirectChild(saveGameElement, "locations");

  if (locationsElement === null) {
    throw new GameSaveImportError(
      "Failed to import save file: the <locations> element is missing.",
    );
  }

  for (const locationElement of getDirectChildElements(locationsElement)) {
    const locationNameElement = getDirectChild(locationElement, "name");

    if (locationNameElement !== null && locationNameElement.textContent?.trim() === "Farm") {
      return locationElement;
    }
  }

  throw new GameSaveImportError(
    "Failed to import save file: no Farm location was found.",
  );
}

function parseSavedBuildings(
  farmElement: Element,
): ParsedStardewGameSave["buildings"] {
  const buildingsElement = getDirectChild(farmElement, "buildings");

  if (buildingsElement === null) {
    return [];
  }

  return getDirectChildElements(buildingsElement).map((buildingElement, buildingIndex) => {
    const nettingStyleElement = getDirectChild(buildingElement, "nettingStyle");

    return {
        buildingType: readRequiredText(
          getRequiredDirectChild(
            buildingElement,
            "buildingType",
            `Farm.buildings[${String(buildingIndex)}]`,
          ),
          `Farm.buildings[${String(buildingIndex)}].buildingType`,
        ),
        x: readRequiredSafeInteger(
          getRequiredDirectChild(
            buildingElement,
            "tileX",
            `Farm.buildings[${String(buildingIndex)}]`,
          ),
          `Farm.buildings[${String(buildingIndex)}].tileX`,
        ),
        y: readRequiredSafeInteger(
          getRequiredDirectChild(
            buildingElement,
            "tileY",
            `Farm.buildings[${String(buildingIndex)}]`,
          ),
          `Farm.buildings[${String(buildingIndex)}].tileY`,
        ),
        ...(nettingStyleElement === null
          ? {}
          : {
              nettingStyle: readRequiredSafeInteger(
                nettingStyleElement,
                `Farm.buildings[${String(buildingIndex)}].nettingStyle`,
              ),
            }),
      };
  });
}

function parseSavedObjects(
  farmElement: Element,
): ParsedStardewGameSave["objects"] {
  const objectsElement = getDirectChild(farmElement, "objects");

  if (objectsElement === null) {
    return [];
  }

  return parseDictionaryEntries(objectsElement, "Farm.objects").map(
    ({ keyElement, valueElement }) => {
      const coordinates = readSavedCoordinates(keyElement, "Farm.objects.key");
      const objectElement = getFirstDescendantElement(valueElement, "Object") ?? valueElement;
      const heldObjectElement = getDirectChild(objectElement, "heldObject");

      return {
        flipped: readOptionalBoolean(
          getDirectChild(objectElement, "flipped"),
          false,
          "Farm.objects.flipped",
        ),
        heldObjectId:
          heldObjectElement === null
            ? null
            : readOptionalDescendantText(heldObjectElement, "itemId"),
        isBigCraftable: readOptionalBoolean(
          getDirectChild(objectElement, "bigCraftable"),
          false,
          "Farm.objects.bigCraftable",
        ),
        itemId: readFirstRequiredText(
          objectElement,
          ["itemId", "parentSheetIndex"],
          "Farm.objects.itemId",
        ),
        tintColor: readPlayerChoiceColor(objectElement),
        x: coordinates.x,
        y: coordinates.y,
      };
    },
  );
}

function parseTerrainFeatures(
  farmElement: Element,
  unmappedEntries: GameSaveUnmappedEntry[],
): Readonly<{
  crops: ParsedStardewGameSave["crops"];
  floorings: ParsedStardewGameSave["floorings"];
  trees: ParsedStardewGameSave["trees"];
}> {
  const terrainFeaturesElement = getDirectChild(farmElement, "terrainFeatures");
  const crops: Array<ParsedStardewGameSave["crops"][number]> = [];
  const floorings: Array<ParsedStardewGameSave["floorings"][number]> = [];
  const trees: Array<ParsedStardewGameSave["trees"][number]> = [];

  if (terrainFeaturesElement === null) {
    return { crops, floorings, trees };
  }

  const terrainFeatureEntries = parseDictionaryEntries(
    terrainFeaturesElement,
    "Farm.terrainFeatures",
  );
  for (const [
    terrainFeatureIndex,
    { keyElement, valueElement },
  ] of terrainFeatureEntries.entries()) {
    const terrainFeatureEntryPath =
      `Farm.terrainFeatures[${String(terrainFeatureIndex)}]`;
    const coordinates = readSavedCoordinates(
      keyElement,
      `${terrainFeatureEntryPath}.key`,
    );
    const terrainFeatureElement =
      getFirstDescendantElement(valueElement, "TerrainFeature") ?? valueElement;
    const terrainFeatureType = getElementType(terrainFeatureElement);
    const terrainFeaturePath = `${terrainFeatureEntryPath}.${terrainFeatureType}`;

    if (terrainFeatureType === "HoeDirt") {
      const hoeDirtState = readOptionalSafeInteger(
        getDirectChild(terrainFeatureElement, "state"),
        0,
        `${terrainFeaturePath}.state`,
      );
      const cropElement = getDirectChild(terrainFeatureElement, "crop");
      const nestedCropElement =
        cropElement === null
          ? null
          : getFirstDescendantElement(cropElement, "Crop") ?? cropElement;
      crops.push({
        hoeDirtState,
        isDead:
          nestedCropElement === null
            ? false
            : readOptionalBoolean(
                getDirectChild(nestedCropElement, "dead"),
                false,
                "Farm.terrainFeatures.crop.dead",
              ),
        seedIndex:
          nestedCropElement === null
            ? null
            : readOptionalDescendantText(nestedCropElement, "seedIndex"),
        x: coordinates.x,
        y: coordinates.y,
      });
      continue;
    }

    if (terrainFeatureType === "Flooring") {
      floorings.push({
        whichFloor: readRequiredText(
          getRequiredDirectChild(
            terrainFeatureElement,
            "whichFloor",
            "Farm.terrainFeatures.Flooring",
          ),
          "Farm.terrainFeatures.Flooring.whichFloor",
        ),
        x: coordinates.x,
        y: coordinates.y,
      });
      continue;
    }

    if (terrainFeatureType === "Tree") {
      trees.push(parseSavedWildTree(
        terrainFeatureElement,
        coordinates,
        terrainFeaturePath,
      ));
      continue;
    }

    if (terrainFeatureType === "FruitTree") {
      trees.push(parseSavedFruitTree(
        terrainFeatureElement,
        coordinates,
        terrainFeaturePath,
      ));
      continue;
    }

    unmappedEntries.push({
      kind: formatTerrainFeatureKind(terrainFeatureType),
      sourceId: readTerrainFeatureSourceId(terrainFeatureElement, terrainFeatureType),
    });
  }

  return { crops, floorings, trees };
}

function parseSavedWildTree(
  terrainFeatureElement: Element,
  coordinates: Readonly<{ x: number; y: number }>,
  terrainFeaturePath: string,
): Extract<ParsedStardewGameSave["trees"][number], { kind: "wild-tree" }> {
  return {
    flipped: readOptionalBoolean(
      getDirectChild(terrainFeatureElement, "flipped"),
      false,
      `${terrainFeaturePath}.flipped`,
    ),
    growthStage: readRequiredNonNegativeSafeInteger(
      getRequiredTerrainFeatureField(
        terrainFeatureElement,
        "growthStage",
        `${terrainFeaturePath}.growthStage`,
      ),
      `${terrainFeaturePath}.growthStage`,
    ),
    hasMoss: readOptionalBoolean(
      getDirectChild(terrainFeatureElement, "hasMoss"),
      false,
      `${terrainFeaturePath}.hasMoss`,
    ),
    kind: "wild-tree",
    stump: readOptionalBoolean(
      getDirectChild(terrainFeatureElement, "stump"),
      false,
      `${terrainFeaturePath}.stump`,
    ),
    treeType: readRequiredText(
      getRequiredTerrainFeatureField(
        terrainFeatureElement,
        "treeType",
        `${terrainFeaturePath}.treeType`,
      ),
      `${terrainFeaturePath}.treeType`,
    ),
    x: coordinates.x,
    y: coordinates.y,
  };
}

function parseSavedFruitTree(
  terrainFeatureElement: Element,
  coordinates: Readonly<{ x: number; y: number }>,
  terrainFeaturePath: string,
): Extract<ParsedStardewGameSave["trees"][number], { kind: "fruit-tree" }> {
  return {
    flipped: readOptionalBoolean(
      getDirectChild(terrainFeatureElement, "flipped"),
      false,
      `${terrainFeaturePath}.flipped`,
    ),
    growthStage: readRequiredNonNegativeSafeInteger(
      getRequiredTerrainFeatureField(
        terrainFeatureElement,
        "growthStage",
        `${terrainFeaturePath}.growthStage`,
      ),
      `${terrainFeaturePath}.growthStage`,
    ),
    kind: "fruit-tree",
    stump: readOptionalBoolean(
      getDirectChild(terrainFeatureElement, "stump"),
      false,
      `${terrainFeaturePath}.stump`,
    ),
    treeId: readRequiredText(
      getRequiredTerrainFeatureField(
        terrainFeatureElement,
        "treeId",
        `${terrainFeaturePath}.treeId`,
      ),
      `${terrainFeaturePath}.treeId`,
    ),
    x: coordinates.x,
    y: coordinates.y,
  };
}

function parseResourceClumps(
  farmElement: Element,
): ParsedStardewGameSave["resourceClumps"] {
  const resourceClumpsElement = getDirectChild(farmElement, "resourceClumps");

  if (resourceClumpsElement === null) {
    return [];
  }

  return getDirectChildElements(resourceClumpsElement).map(
    (resourceClumpElement) => {
      const tileElement = getRequiredDirectChild(
        resourceClumpElement,
        "tile",
        "Farm.resourceClumps",
      );
      const coordinates = readSavedCoordinates(tileElement, "Farm.resourceClumps.tile");

      return {
        parentSheetIndex: readRequiredSafeInteger(
          getRequiredDirectChild(
            resourceClumpElement,
            "parentSheetIndex",
            "Farm.resourceClumps",
          ),
          "Farm.resourceClumps.parentSheetIndex",
        ),
        x: coordinates.x,
        y: coordinates.y,
      };
    },
  );
}

function appendLargeTerrainFeatureUnmappedEntries(
  farmElement: Element,
  unmappedEntries: GameSaveUnmappedEntry[],
): void {
  const largeTerrainFeaturesElement = getDirectChild(
    farmElement,
    "largeTerrainFeatures",
  );

  if (largeTerrainFeaturesElement === null) {
    return;
  }

  for (const largeTerrainFeatureElement of getDirectChildElements(
    largeTerrainFeaturesElement,
  )) {
    const largeTerrainFeatureType = getElementType(largeTerrainFeatureElement);
    const sourceId =
      readOptionalDescendantText(largeTerrainFeatureElement, "size") ??
      largeTerrainFeatureType;

    unmappedEntries.push({
      kind: largeTerrainFeatureType === "Bush" ? "bush" : "large-terrain-feature",
      sourceId,
    });
  }
}

function appendFurnitureUnmappedEntries(
  farmElement: Element,
  unmappedEntries: GameSaveUnmappedEntry[],
): void {
  const furnitureElement = getDirectChild(farmElement, "furniture");

  if (furnitureElement === null) {
    return;
  }

  for (const savedFurnitureElement of getDirectChildElements(furnitureElement)) {
    const furnitureItemId =
      readOptionalDescendantText(savedFurnitureElement, "itemId") ??
      getElementType(savedFurnitureElement);
    unmappedEntries.push({ kind: "furniture", sourceId: furnitureItemId });
  }
}

function parseDictionaryEntries(
  dictionaryElement: Element,
  fieldPath: string,
): readonly Readonly<{ keyElement: Element; valueElement: Element }>[] {
  return getDirectChildElements(dictionaryElement).map((entryElement, entryIndex) => ({
    keyElement: getRequiredDirectChild(
      entryElement,
      "key",
      `${fieldPath}[${String(entryIndex)}]`,
    ),
    valueElement: getRequiredDirectChild(
      entryElement,
      "value",
      `${fieldPath}[${String(entryIndex)}]`,
    ),
  }));
}

function readSavedCoordinates(
  coordinateElement: Element,
  fieldPath: string,
): Readonly<{ x: number; y: number }> {
  return {
    x: readRequiredSafeInteger(
      getFirstRequiredDescendantElement(coordinateElement, "X", fieldPath),
      `${fieldPath}.X`,
    ),
    y: readRequiredSafeInteger(
      getFirstRequiredDescendantElement(coordinateElement, "Y", fieldPath),
      `${fieldPath}.Y`,
    ),
  };
}

function readPlayerChoiceColor(objectElement: Element): string {
  const playerChoiceColorElement = getDirectChild(objectElement, "playerChoiceColor");

  if (playerChoiceColorElement === null) {
    return "#ffffff";
  }

  const red = readColorChannel(playerChoiceColorElement, "R");
  const green = readColorChannel(playerChoiceColorElement, "G");
  const blue = readColorChannel(playerChoiceColorElement, "B");

  return `#${toHexColorChannel(red)}${toHexColorChannel(green)}${toHexColorChannel(blue)}`;
}

function readColorChannel(colorElement: Element, channelName: "R" | "G" | "B"): number {
  const colorChannelElement = getFirstRequiredDescendantElement(
    colorElement,
    channelName,
    "Farm.objects.playerChoiceColor",
  );
  const colorChannel = readRequiredSafeInteger(
    colorChannelElement,
    `Farm.objects.playerChoiceColor.${channelName}`,
  );

  if (colorChannel < 0 || colorChannel > 255) {
    throw new GameSaveImportError(
      `Game save XML field "Farm.objects.playerChoiceColor.${channelName}" must be between 0 and 255; received ${String(colorChannel)}.`,
    );
  }

  return colorChannel;
}

function toHexColorChannel(colorChannel: number): string {
  return colorChannel.toString(16).padStart(2, "0");
}

function readTerrainFeatureSourceId(
  terrainFeatureElement: Element,
  terrainFeatureType: string,
): string {
  const sourceFieldName =
    terrainFeatureType === "Grass"
      ? "grassType"
      : terrainFeatureType === "Tree"
        ? "treeType"
        : terrainFeatureType === "FruitTree"
          ? "treeId"
        : "id";

  return readOptionalDescendantText(terrainFeatureElement, sourceFieldName) ?? terrainFeatureType;
}

function formatTerrainFeatureKind(terrainFeatureType: string): string {
  if (terrainFeatureType === "Tree") {
    return "tree";
  }

  if (terrainFeatureType === "FruitTree") {
    return "fruit-tree";
  }

  if (terrainFeatureType === "Grass") {
    return "grass";
  }

  return "terrain-feature";
}

function getElementType(element: Element): string {
  const xsiType = element.getAttribute("xsi:type") ?? element.getAttribute("type");

  if (xsiType !== null && xsiType.length > 0) {
    return xsiType.includes(":") ? xsiType.split(":").at(-1) ?? xsiType : xsiType;
  }

  return getElementName(element);
}

function getFirstRequiredDescendantElement(
  parentElement: Element,
  expectedName: string,
  fieldPath: string,
): Element {
  const descendantElement = getFirstDescendantElement(parentElement, expectedName);

  if (descendantElement === null) {
    throw new GameSaveImportError(
      `Failed to import save file: required <${expectedName}> element is missing at ${fieldPath}.`,
    );
  }

  return descendantElement;
}

function getRequiredDirectChild(
  parentElement: Element,
  expectedName: string,
  fieldPath: string,
): Element {
  const childElement = getDirectChild(parentElement, expectedName);

  if (childElement === null) {
    throw new GameSaveImportError(
      `Failed to import save file: required <${expectedName}> element is missing at ${fieldPath}.`,
    );
  }

  return childElement;
}

function getRequiredTerrainFeatureField(
  terrainFeatureElement: Element,
  expectedName: string,
  fieldPath: string,
): Element {
  const fieldElement = getDirectChild(terrainFeatureElement, expectedName);

  if (fieldElement === null) {
    throw new GameSaveImportError(
      `Game save XML field ${JSON.stringify(fieldPath)} is required; received undefined.`,
    );
  }

  return fieldElement;
}

function getDirectChild(parentElement: Element, expectedName: string): Element | null {
  return (
    getDirectChildElements(parentElement).find(
      (childElement) => getElementName(childElement) === expectedName,
    ) ?? null
  );
}

function getFirstDescendantElement(
  parentElement: Element,
  expectedName: string,
): Element | null {
  for (const childElement of getDirectChildElements(parentElement)) {
    if (getElementName(childElement) === expectedName) {
      return childElement;
    }

    const nestedElement = getFirstDescendantElement(childElement, expectedName);

    if (nestedElement !== null) {
      return nestedElement;
    }
  }

  return null;
}

function getDirectChildElements(parentElement: Element): readonly Element[] {
  return Array.from(parentElement.childNodes).filter(
    (childNode): childNode is Element => childNode.nodeType === 1,
  );
}

function getElementName(element: Element): string {
  const localName = element.localName ?? element.nodeName;
  return localName.includes(":") ? localName.split(":").at(-1) ?? localName : localName;
}

function readFirstRequiredText(
  parentElement: Element,
  candidateElementNames: readonly string[],
  fieldPath: string,
): string {
  for (const candidateElementName of candidateElementNames) {
    const candidateElement = getDirectChild(parentElement, candidateElementName);

    if (candidateElement !== null) {
      return readRequiredText(candidateElement, fieldPath);
    }
  }

  throw new GameSaveImportError(
    `Failed to import save file: required one of ${candidateElementNames.map((candidateElementName) => `<${candidateElementName}>`).join(", ")} is missing at ${fieldPath}.`,
  );
}

function readOptionalDescendantText(
  parentElement: Element,
  expectedName: string,
): string | null {
  const descendantElement = getFirstDescendantElement(parentElement, expectedName);
  return descendantElement === null ? null : readRequiredText(descendantElement, expectedName);
}

function readRequiredText(element: Element, fieldPath: string): string {
  const textValue = element.textContent?.trim() ?? "";

  if (textValue.length === 0) {
    throw new GameSaveImportError(
      `Game save XML field "${fieldPath}" must be a non-empty string; received ${JSON.stringify(textValue)}.`,
    );
  }

  return textValue;
}

function readRequiredSafeInteger(element: Element, fieldPath: string): number {
  const stringValue = readRequiredText(element, fieldPath);

  if (!/^-?\d+$/.test(stringValue)) {
    throw new GameSaveImportError(
      `Game save XML field "${fieldPath}" must be a safe integer; received ${JSON.stringify(stringValue)}.`,
    );
  }

  const numericValue = Number.parseInt(stringValue, 10);

  if (!Number.isSafeInteger(numericValue)) {
    throw new GameSaveImportError(
      `Game save XML field "${fieldPath}" must be a safe integer; received ${JSON.stringify(stringValue)}.`,
    );
  }

  return numericValue;
}

function readOptionalSafeInteger(
  element: Element | null,
  defaultValue: number,
  fieldPath: string,
): number {
  return element === null
    ? defaultValue
    : readRequiredSafeInteger(element, fieldPath);
}

function readRequiredNonNegativeSafeInteger(
  element: Element,
  fieldPath: string,
): number {
  const stringValue = readRequiredText(element, fieldPath);
  const numericValue = Number(stringValue);

  if (!/^\d+$/.test(stringValue) || !Number.isSafeInteger(numericValue)) {
    throw new GameSaveImportError(
      `Game save XML field "${fieldPath}" must be a non-negative safe integer; received ${JSON.stringify(stringValue)}.`,
    );
  }

  return numericValue;
}

function readOptionalBoolean(
  element: Element | null,
  defaultValue: boolean,
  fieldPath: string,
): boolean {
  if (element === null) {
    return defaultValue;
  }

  const booleanValue = readRequiredText(element, fieldPath);

  if (booleanValue === "true") {
    return true;
  }

  if (booleanValue === "false") {
    return false;
  }

  throw new GameSaveImportError(
    `Game save XML field "${fieldPath}" must be "true" or "false"; received ${JSON.stringify(booleanValue)}.`,
  );
}

function hasXmlParserError(xmlDocument: Document): boolean {
  return xmlDocument.getElementsByTagName("parsererror").length > 0;
}

function assertXmlSource(xmlSource: string): void {
  if (typeof xmlSource !== "string" || xmlSource.trim().length === 0) {
    throw new GameSaveImportError(
      `Game save XML source must be a non-empty string; received ${JSON.stringify(xmlSource)}.`,
    );
  }
}

function assertXmlParser(parseXml: GameSaveXmlParser): void {
  if (typeof parseXml !== "function") {
    throw new GameSaveImportError(
      `Game save XML parser must be a function; received ${JSON.stringify(parseXml)}.`,
    );
  }
}
