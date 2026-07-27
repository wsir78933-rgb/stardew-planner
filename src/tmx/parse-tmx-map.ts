import { decodeTileLayerData, getBaseTileGid } from "./decode-tile-layer-data";
import type {
  TmxMap,
  TmxObject,
  TmxObjectLayer,
  TmxProperties,
  TmxTileLayer,
  TmxTileset,
} from "./tmx-types";

export async function parseTmxMap(xmlText: string): Promise<TmxMap> {
  const mapDocument = parseXmlDocument(xmlText);
  const mapElement = mapDocument.documentElement;
  const mapWidth = parsePositiveIntegerAttribute(mapElement, "width", "map");
  const mapHeight = parsePositiveIntegerAttribute(mapElement, "height", "map");
  const mapTileWidth = parsePositiveIntegerAttribute(mapElement, "tilewidth", "map");
  const mapTileHeight = parsePositiveIntegerAttribute(mapElement, "tileheight", "map");

  validateMapAttributes(mapElement);

  const mapProperties = readDirectProperties(mapElement, "map");
  const tilesets: TmxTileset[] = [];
  const tileLayers: TmxTileLayer[] = [];
  const objectLayers: TmxObjectLayer[] = [];

  for (const mapChildElement of readDirectChildElements(mapElement)) {
    switch (mapChildElement.tagName) {
      case "properties":
      case "editorsettings":
        break;
      case "tileset":
        tilesets.push(parseInlineTileset(mapChildElement));
        break;
      case "layer":
        tileLayers.push(await parseTileLayer(mapChildElement));
        break;
      case "objectgroup":
        objectLayers.push(parseObjectLayer(mapChildElement));
        break;
      case "group":
        throw new Error(
          `Unsupported TMX group layer "${mapChildElement.getAttribute("name")}". Group layers are not supported.`,
        );
      case "imagelayer":
        throw new Error(
          `Unsupported TMX image layer "${mapChildElement.getAttribute("name")}". Image layers are not supported.`,
        );
      default:
        throw new Error(
          `Unsupported TMX map child element "${mapChildElement.tagName}".`,
        );
    }
  }

  validateTilesetRanges(tilesets);
  validateTileLayerGids(tileLayers, tilesets);
  const tileDataProperties = createTileDataProperties(
    objectLayers,
    mapTileWidth,
    mapTileHeight,
  );

  return {
    width: mapWidth,
    height: mapHeight,
    tileWidth: mapTileWidth,
    tileHeight: mapTileHeight,
    properties: mapProperties,
    tilesets,
    tileLayers,
    objectLayers,
    tileDataProperties,
  };
}

function parseXmlDocument(xmlText: string): XMLDocument {
  if (typeof xmlText !== "string" || xmlText.trim().length === 0) {
    throw new Error(`TMX XML text must be a non-empty string; received "${String(xmlText)}".`);
  }

  if (typeof DOMParser !== "function") {
    throw new Error("TMX XML parsing requires browser DOMParser, but DOMParser is unavailable.");
  }

  const mapDocument = new DOMParser().parseFromString(xmlText, "application/xml");
  const mapElement = mapDocument.documentElement;
  const parserErrors = mapDocument.getElementsByTagName("parsererror");

  if (parserErrors.length > 0 || mapElement === null || mapElement.tagName !== "map") {
    const rootElementName = mapElement?.tagName ?? "null";
    const parserErrorText = parserErrors.item(0)?.textContent ?? "";

    throw new Error(
      `TMX XML root must be "map"; received root "${rootElementName}" with parser error "${parserErrorText}".`,
    );
  }

  return mapDocument;
}

function validateMapAttributes(mapElement: Element): void {
  const orientation = readRequiredAttribute(mapElement, "orientation", "map");
  const infinite = readRequiredAttribute(mapElement, "infinite", "map");

  if (orientation !== "orthogonal") {
    throw new Error(`Unsupported TMX map orientation "${orientation}". Expected "orthogonal".`);
  }

  if (infinite !== "0") {
    throw new Error(`Unsupported TMX map infinite value "${infinite}". Expected "0".`);
  }
}

function parseInlineTileset(tilesetElement: Element): TmxTileset {
  const externalTilesetSource = tilesetElement.getAttribute("source");

  if (externalTilesetSource !== null) {
    throw new Error(
      `Unsupported external TMX tileset source "${externalTilesetSource}". Inline tilesets are required.`,
    );
  }

  const tilesetName = readRequiredAttribute(tilesetElement, "name", "tileset");
  const tilesetContext = `tileset "${tilesetName}"`;
  const tilesetChildElements = readDirectChildElements(tilesetElement);

  validateInlineTilesetDirectChildren(tilesetChildElements, tilesetName);

  const imageElements = tilesetChildElements.filter(
    (tilesetChildElement) => tilesetChildElement.tagName === "image",
  );

  if (imageElements.length !== 1) {
    throw new Error(
      `TMX tileset "${tilesetName}" must have exactly one inline image; received ${imageElements.length}.`,
    );
  }

  const imageElement = imageElements[0];
  const tileCount = parsePositiveIntegerAttribute(tilesetElement, "tilecount", tilesetContext);

  if (imageElement === undefined) {
    throw new Error(`TMX tileset "${tilesetName}" has no image element.`);
  }

  return {
    firstGid: parsePositiveIntegerAttribute(tilesetElement, "firstgid", tilesetContext),
    name: tilesetName,
    tileWidth: parsePositiveIntegerAttribute(tilesetElement, "tilewidth", tilesetContext),
    tileHeight: parsePositiveIntegerAttribute(tilesetElement, "tileheight", tilesetContext),
    tileCount,
    columns: parsePositiveIntegerAttribute(tilesetElement, "columns", tilesetContext),
    imageSource: readRequiredAttribute(imageElement, "source", `image in tileset "${tilesetName}"`),
    imageWidth: parsePositiveIntegerAttribute(imageElement, "width", `image in tileset "${tilesetName}"`),
    imageHeight: parsePositiveIntegerAttribute(imageElement, "height", `image in tileset "${tilesetName}"`),
    properties: readDirectProperties(tilesetElement, tilesetContext),
    tileProperties: parseInlineTileProperties(tilesetChildElements, tilesetName),
  };
}

function validateInlineTilesetDirectChildren(
  tilesetChildElements: readonly Element[],
  tilesetName: string,
): void {
  for (const tilesetChildElement of tilesetChildElements) {
    if (
      tilesetChildElement.tagName !== "image" &&
      tilesetChildElement.tagName !== "properties" &&
      tilesetChildElement.tagName !== "tile"
    ) {
      throw new Error(
        `TMX tileset "${tilesetName}" has unsupported direct child element "${tilesetChildElement.tagName}".`,
      );
    }
  }
}

function parseInlineTileProperties(
  tilesetChildElements: readonly Element[],
  tilesetName: string,
): ReadonlyMap<number, TmxProperties> {
  const tileProperties = new Map<number, TmxProperties>();

  for (const tileElement of tilesetChildElements) {
    if (tileElement.tagName !== "tile") {
      continue;
    }

    const tileId = parseNonNegativeIntegerAttribute(
      tileElement,
      "id",
      `tile in tileset "${tilesetName}"`,
    );

    validateInlineTileDirectChildren(tileElement, tilesetName, tileId);
    const existingProperties = tileProperties.get(tileId) ?? {};

    tileProperties.set(
      tileId,
      {
        ...existingProperties,
        ...readDirectProperties(tileElement, `tile "${tileId}" in tileset "${tilesetName}"`),
      },
    );
  }

  return tileProperties;
}

function validateInlineTileDirectChildren(
  tileElement: Element,
  tilesetName: string,
  tileId: number,
): void {
  for (const tileChildElement of readDirectChildElements(tileElement)) {
    if (
      tileChildElement.tagName !== "properties" &&
      tileChildElement.tagName !== "animation"
    ) {
      throw new Error(
        `TMX tile "${tileId}" in tileset "${tilesetName}" has unsupported direct child element "${tileChildElement.tagName}".`,
      );
    }
  }
}

async function parseTileLayer(layerElement: Element): Promise<TmxTileLayer> {
  const layerName = readRequiredAttribute(layerElement, "name", "layer");
  const layerChildElements = readDirectChildElements(layerElement);

  validateTileLayerDirectChildren(layerChildElements, layerName);

  const dataElements = layerChildElements.filter(
    (layerChildElement) => layerChildElement.tagName === "data",
  );

  if (dataElements.length !== 1) {
    throw new Error(
      `TMX layer "${layerName}" must have exactly one data element; received ${dataElements.length}.`,
    );
  }

  const dataElement = dataElements[0];

  if (dataElement === undefined) {
    throw new Error(`TMX layer "${layerName}" has no data element.`);
  }

  if (readDirectChildElements(dataElement).some((dataChildElement) => dataChildElement.tagName === "chunk")) {
    throw new Error(`Unsupported TMX chunk in layer "${layerName}". Infinite maps are not supported.`);
  }

  const layerWidth = parsePositiveIntegerAttribute(layerElement, "width", `layer "${layerName}"`);
  const layerHeight = parsePositiveIntegerAttribute(layerElement, "height", `layer "${layerName}"`);
  const rawGids = await decodeTileLayerData({
    layerName,
    encoding: dataElement.getAttribute("encoding"),
    compression: dataElement.getAttribute("compression"),
    payload: dataElement.textContent ?? "",
  });
  const expectedGidCount = layerWidth * layerHeight;

  if (rawGids.length !== expectedGidCount) {
    throw new Error(
      `TMX layer "${layerName}" has ${rawGids.length} GIDs for dimensions ${layerWidth}x${layerHeight}; expected ${expectedGidCount}.`,
    );
  }

  return {
    id: parseOptionalPositiveIntegerAttribute(layerElement, "id", `layer "${layerName}"`),
    name: layerName,
    width: layerWidth,
    height: layerHeight,
    visible: parseOptionalBooleanAttribute(layerElement, "visible", true, `layer "${layerName}"`),
    opacity: parseOptionalNonNegativeNumberAttribute(layerElement, "opacity", 1, `layer "${layerName}"`),
    offsetX: parseOptionalNumberAttribute(layerElement, "offsetx", 0, `layer "${layerName}"`),
    offsetY: parseOptionalNumberAttribute(layerElement, "offsety", 0, `layer "${layerName}"`),
    properties: readDirectProperties(layerElement, `layer "${layerName}"`),
    rawGids,
  };
}

function validateTileLayerDirectChildren(
  layerChildElements: readonly Element[],
  layerName: string,
): void {
  for (const layerChildElement of layerChildElements) {
    if (
      layerChildElement.tagName !== "properties" &&
      layerChildElement.tagName !== "data"
    ) {
      throw new Error(
        `TMX layer "${layerName}" has unsupported direct child element "${layerChildElement.tagName}".`,
      );
    }
  }
}

function parseObjectLayer(objectLayerElement: Element): TmxObjectLayer {
  const objectLayerName = readRequiredAttribute(objectLayerElement, "name", "object layer");
  const objects = readDirectChildElements(objectLayerElement)
    .filter((objectLayerChildElement) => objectLayerChildElement.tagName === "object")
    .map((objectElement) => parseObject(objectElement, objectLayerName));

  return {
    id: parseOptionalPositiveIntegerAttribute(objectLayerElement, "id", `object layer "${objectLayerName}"`),
    name: objectLayerName,
    visible: parseOptionalBooleanAttribute(objectLayerElement, "visible", true, `object layer "${objectLayerName}"`),
    locked: parseOptionalBooleanAttribute(objectLayerElement, "locked", false, `object layer "${objectLayerName}"`),
    opacity: parseOptionalNonNegativeNumberAttribute(objectLayerElement, "opacity", 1, `object layer "${objectLayerName}"`),
    offsetX: parseOptionalNumberAttribute(objectLayerElement, "offsetx", 0, `object layer "${objectLayerName}"`),
    offsetY: parseOptionalNumberAttribute(objectLayerElement, "offsety", 0, `object layer "${objectLayerName}"`),
    properties: readDirectProperties(objectLayerElement, `object layer "${objectLayerName}"`),
    objects,
  };
}

function parseObject(objectElement: Element, objectLayerName: string): TmxObject {
  const objectName = objectElement.getAttribute("name") ?? "";
  const objectContext = `object "${objectName}" in layer "${objectLayerName}"`;

  return {
    id: parseOptionalPositiveIntegerAttribute(objectElement, "id", objectContext),
    name: objectName,
    type: objectElement.getAttribute("type") ?? "",
    x: parseOptionalNumberAttribute(objectElement, "x", 0, objectContext),
    y: parseOptionalNumberAttribute(objectElement, "y", 0, objectContext),
    width: parseOptionalNonNegativeNumberAttribute(objectElement, "width", 0, objectContext),
    height: parseOptionalNonNegativeNumberAttribute(objectElement, "height", 0, objectContext),
    rotation: parseOptionalNumberAttribute(objectElement, "rotation", 0, objectContext),
    visible: parseOptionalBooleanAttribute(objectElement, "visible", true, objectContext),
    properties: readDirectProperties(objectElement, objectContext),
  };
}

function createTileDataProperties(
  objectLayers: readonly TmxObjectLayer[],
  tileWidth: number,
  tileHeight: number,
): ReadonlyMap<string, TmxProperties> {
  const tileDataProperties = new Map<string, TmxProperties>();

  for (const objectLayer of objectLayers) {
    for (const object of objectLayer.objects) {
      if (object.name !== "TileData") {
        continue;
      }

      const tileDataBounds = parseTileDataBounds(objectLayer.name, object, tileWidth, tileHeight);

      for (let tileY = tileDataBounds.startY; tileY < tileDataBounds.endY; tileY += 1) {
        for (let tileX = tileDataBounds.startX; tileX < tileDataBounds.endX; tileX += 1) {
          const tileDataKey = `${objectLayer.name}:${tileX},${tileY}`;
          const existingProperties = tileDataProperties.get(tileDataKey) ?? {};

          tileDataProperties.set(tileDataKey, {
            ...existingProperties,
            ...object.properties,
          });
        }
      }
    }
  }

  return tileDataProperties;
}

interface TileDataBounds {
  readonly startX: number;
  readonly startY: number;
  readonly endX: number;
  readonly endY: number;
}

function parseTileDataBounds(
  objectLayerName: string,
  tileDataObject: TmxObject,
  tileWidth: number,
  tileHeight: number,
): TileDataBounds {
  const objectContext = `TileData object in layer "${objectLayerName}"`;
  const tileX = parseTileDataMultiple(tileDataObject.x, "x", tileWidth, objectContext);
  const tileY = parseTileDataMultiple(tileDataObject.y, "y", tileHeight, objectContext);
  const tileSpanWidth = parseTileDataSpan(tileDataObject.width, "width", tileWidth, objectContext);
  const tileSpanHeight = parseTileDataSpan(tileDataObject.height, "height", tileHeight, objectContext);

  return {
    startX: tileX,
    startY: tileY,
    endX: tileX + tileSpanWidth,
    endY: tileY + tileSpanHeight,
  };
}

function parseTileDataMultiple(
  value: number,
  attributeName: "x" | "y" | "width" | "height",
  tileSize: number,
  objectContext: string,
): number {
  const tileCoordinate = value / tileSize;

  if (!Number.isSafeInteger(tileCoordinate)) {
    throw new Error(
      `TMX ${objectContext} requires "${attributeName}" value "${value}" to be a multiple of tile size "${tileSize}".`,
    );
  }

  return tileCoordinate;
}

function parseTileDataSpan(
  value: number,
  attributeName: "width" | "height",
  tileSize: number,
  objectContext: string,
): number {
  const tileSpan = parseTileDataMultiple(value, attributeName, tileSize, objectContext);

  if (tileSpan <= 0) {
    throw new Error(
      `TMX ${objectContext} requires positive "${attributeName}" value; received "${value}".`,
    );
  }

  return tileSpan;
}

function validateTilesetRanges(tilesets: readonly TmxTileset[]): void {
  let previousTilesetEnd = 1;

  for (const tileset of tilesets) {
    if (tileset.firstGid < previousTilesetEnd) {
      throw new Error(
        `TMX tileset "${tileset.name}" has firstgid "${tileset.firstGid}" that overlaps the previous tileset range ending at "${previousTilesetEnd - 1}".`,
      );
    }

    previousTilesetEnd = tileset.firstGid + tileset.tileCount;
  }
}

function validateTileLayerGids(
  tileLayers: readonly TmxTileLayer[],
  tilesets: readonly TmxTileset[],
): void {
  for (const tileLayer of tileLayers) {
    for (const [gidIndex, rawGid] of tileLayer.rawGids.entries()) {
      const baseGid = getBaseTileGid(rawGid);

      if (baseGid === 0) {
        continue;
      }

      const matchingTileset = tilesets.find(
        (tileset) =>
          baseGid >= tileset.firstGid &&
          baseGid < tileset.firstGid + tileset.tileCount,
      );

      if (matchingTileset === undefined) {
        throw new Error(
          `TMX layer "${tileLayer.name}" has raw GID "${rawGid}" (base GID "${baseGid}") at index ${gidIndex}, outside every inline tileset range.`,
        );
      }
    }
  }
}

function readDirectProperties(parentElement: Element, context: string): TmxProperties {
  const propertiesElement = readDirectChildElements(parentElement).find(
    (childElement) => childElement.tagName === "properties",
  );

  if (propertiesElement === undefined) {
    return {};
  }

  const properties: Record<string, string> = {};

  for (const propertyElement of readDirectChildElements(propertiesElement)) {
    if (propertyElement.tagName !== "property") {
      throw new Error(
        `TMX ${context} has unsupported properties child "${propertyElement.tagName}".`,
      );
    }

    const propertyName = readRequiredAttribute(propertyElement, "name", `${context} property`);

    if (Object.hasOwn(properties, propertyName)) {
      throw new Error(`TMX ${context} has duplicate property name "${propertyName}".`);
    }

    properties[propertyName] = propertyElement.getAttribute("value") ?? propertyElement.textContent ?? "";
  }

  return properties;
}

function readDirectChildElements(parentElement: Element): Element[] {
  return Array.from(parentElement.childNodes).filter(
    (childNode): childNode is Element => childNode.nodeType === 1,
  );
}

function readRequiredAttribute(element: Element, attributeName: string, context: string): string {
  const attributeValue = element.getAttribute(attributeName);

  if (attributeValue === null || attributeValue.length === 0) {
    throw new Error(
      `TMX ${context} requires non-empty "${attributeName}" attribute; received "${attributeValue}".`,
    );
  }

  return attributeValue;
}

function parsePositiveIntegerAttribute(element: Element, attributeName: string, context: string): number {
  const attributeValue = readRequiredAttribute(element, attributeName, context);

  if (!/^[1-9]\d*$/.test(attributeValue)) {
    throw new Error(
      `TMX ${context} requires positive integer "${attributeName}"; received "${attributeValue}".`,
    );
  }

  const parsedValue = Number(attributeValue);

  if (!Number.isSafeInteger(parsedValue)) {
    throw new Error(
      `TMX ${context} has unsafe integer "${attributeName}" value "${attributeValue}".`,
    );
  }

  return parsedValue;
}

function parseNonNegativeIntegerAttribute(
  element: Element,
  attributeName: string,
  context: string,
): number {
  const attributeValue = readRequiredAttribute(element, attributeName, context);

  if (!/^(0|[1-9]\d*)$/.test(attributeValue)) {
    throw new Error(
      `TMX ${context} requires non-negative integer "${attributeName}"; received "${attributeValue}".`,
    );
  }

  const parsedValue = Number(attributeValue);

  if (!Number.isSafeInteger(parsedValue)) {
    throw new Error(
      `TMX ${context} has unsafe integer "${attributeName}" value "${attributeValue}".`,
    );
  }

  return parsedValue;
}

function parseOptionalPositiveIntegerAttribute(
  element: Element,
  attributeName: string,
  context: string,
): number | null {
  const attributeValue = element.getAttribute(attributeName);

  if (attributeValue === null) {
    return null;
  }

  if (!/^[1-9]\d*$/.test(attributeValue)) {
    throw new Error(
      `TMX ${context} requires positive integer "${attributeName}" when present; received "${attributeValue}".`,
    );
  }

  const parsedValue = Number(attributeValue);

  if (!Number.isSafeInteger(parsedValue)) {
    throw new Error(
      `TMX ${context} has unsafe integer "${attributeName}" value "${attributeValue}".`,
    );
  }

  return parsedValue;
}

function parseOptionalBooleanAttribute(
  element: Element,
  attributeName: string,
  defaultValue: boolean,
  context: string,
): boolean {
  const attributeValue = element.getAttribute(attributeName);

  if (attributeValue === null) {
    return defaultValue;
  }

  if (attributeValue === "1" || attributeValue === "true") {
    return true;
  }

  if (attributeValue === "0" || attributeValue === "false") {
    return false;
  }

  throw new Error(
    `TMX ${context} requires boolean "${attributeName}" when present; received "${attributeValue}".`,
  );
}

function parseOptionalNonNegativeNumberAttribute(
  element: Element,
  attributeName: string,
  defaultValue: number,
  context: string,
): number {
  const parsedValue = parseOptionalNumberAttribute(element, attributeName, defaultValue, context);

  if (parsedValue < 0) {
    throw new Error(
      `TMX ${context} requires non-negative "${attributeName}" when present; received "${element.getAttribute(attributeName)}".`,
    );
  }

  return parsedValue;
}

function parseOptionalNumberAttribute(
  element: Element,
  attributeName: string,
  defaultValue: number,
  context: string,
): number {
  const attributeValue = element.getAttribute(attributeName);

  if (attributeValue === null) {
    return defaultValue;
  }

  if (attributeValue.trim().length === 0) {
    throw new Error(
      `TMX ${context} requires numeric "${attributeName}" when present; received "${attributeValue}".`,
    );
  }

  const parsedValue = Number(attributeValue);

  if (!Number.isFinite(parsedValue)) {
    throw new Error(
      `TMX ${context} requires finite numeric "${attributeName}" when present; received "${attributeValue}".`,
    );
  }

  return parsedValue;
}
