import type {
  CatalogItem,
  CatalogPresentationCapabilities,
  CatalogSeason,
  CatalogSeasonalPlaceableRenderingMetadata,
  CatalogSourceRect,
  CatalogTileSize,
} from "./catalog-types";

type BushCatalogItemId = "bush:small" | "bush:medium" | "bush:large";

type BushDefinition = Readonly<{
  id: BushCatalogItemId;
  name: string;
  tileSize: CatalogTileSize;
}>;

const localAssetRoot = "/game-assets/1.6.15";
const bushesTextureLocalPath = `${localAssetRoot}/tilesheets/bushes.png`;
const bushPlacementTools = ["cursor", "multi-select", "erase"] as const;
const bushSeasons = ["spring", "summer", "fall", "winter"] as const;

const bushDefinitions = [
  {
    id: "bush:small",
    name: "Small Bush",
    tileSize: { width: 1, height: 1 },
  },
  {
    id: "bush:medium",
    name: "Medium Bush",
    tileSize: { width: 2, height: 1 },
  },
  {
    id: "bush:large",
    name: "Large Bush",
    tileSize: { width: 3, height: 1 },
  },
] as const satisfies readonly BushDefinition[];

const bushSourceFramesById: Readonly<
  Record<BushCatalogItemId, Readonly<Record<CatalogSeason, CatalogSourceRect>>>
> = {
  "bush:small": {
    spring: createSourceRect(0, 224, 16, 32),
    summer: createSourceRect(32, 224, 16, 32),
    fall: createSourceRect(64, 224, 16, 32),
    winter: createSourceRect(96, 224, 16, 32),
  },
  "bush:medium": {
    spring: createSourceRect(0, 0, 32, 48),
    summer: createSourceRect(64, 0, 32, 48),
    fall: createSourceRect(0, 48, 32, 48),
    winter: createSourceRect(64, 48, 32, 48),
  },
  "bush:large": {
    spring: createSourceRect(0, 128, 48, 48),
    summer: createSourceRect(0, 128, 48, 48),
    fall: createSourceRect(48, 128, 48, 48),
    winter: createSourceRect(0, 176, 48, 48),
  },
};

export function createBushCatalogItems(): readonly CatalogItem[] {
  return bushDefinitions.map((bushDefinition) => ({
    id: bushDefinition.id,
    name: bushDefinition.name,
    category: "placeable",
    tileSize: bushDefinition.tileSize,
    textureLocalPath: bushesTextureLocalPath,
    sprite: getBushSourceRect(bushDefinition.id, "spring"),
    allowedTools: bushPlacementTools,
    presentationCapabilities: createBushPresentationCapabilities(
      bushDefinition.id,
    ),
    renderingMetadata: createBushSeasonalRenderingMetadata(
      bushDefinition.id,
    ),
  }));
}

export function getBushSourceRect(
  itemId: string,
  season: CatalogSeason,
  variant = 0,
): CatalogSourceRect {
  assertBushSourceRequest(itemId, season, variant);
  const baseFrame = bushSourceFramesById[itemId as BushCatalogItemId][season];

  if (itemId === "bush:medium" && variant === 1) {
    return { ...baseFrame, x: baseFrame.x + baseFrame.width };
  }

  return baseFrame;
}

export function isBushCatalogItemId(itemId: string): itemId is BushCatalogItemId {
  return Object.hasOwn(bushSourceFramesById, itemId);
}

function assertBushSourceRequest(
  itemId: unknown,
  season: unknown,
  variant: unknown,
): asserts itemId is BushCatalogItemId {
  if (typeof itemId !== "string" || !isBushCatalogItemId(itemId)) {
    throw new RangeError(
      `Bush source frame item ID must be one of ${bushDefinitions.map(({ id }) => JSON.stringify(id)).join(", ")}; received ${describeValue(itemId)}.`,
    );
  }
  if (!(bushSeasons as readonly unknown[]).includes(season)) {
    throw new RangeError(
      `Bush source frame season for item ${JSON.stringify(itemId)} must be one of ${bushSeasons.map((seasonName) => JSON.stringify(seasonName)).join(", ")}; received ${describeValue(season)}.`,
    );
  }
  if (!Number.isSafeInteger(variant)) {
    throw new RangeError(
      `Bush source frame variant for item ${JSON.stringify(itemId)} must be a safe integer; received ${describeValue(variant)}.`,
    );
  }

  const maximumVariant = itemId === "bush:medium" ? 1 : 0;
  if ((variant as number) < 0 || (variant as number) > maximumVariant) {
    throw new RangeError(
      `Bush source frame variant for item ${JSON.stringify(itemId)} must be from 0 to ${String(maximumVariant)}; received ${describeValue(variant)}.`,
    );
  }
}

function createBushPresentationCapabilities(
  itemId: BushCatalogItemId,
): CatalogPresentationCapabilities {
  if (itemId !== "bush:medium") {
    return {
      canFlip: true,
      rotation: null,
      variantCycle: null,
      visibleVariants: [],
    };
  }

  return {
    canFlip: true,
    rotation: null,
    variantCycle: { count: 2, family: "tree" },
    visibleVariants: [
      createVisibleBushVariant(0, "Plain"),
      createVisibleBushVariant(1, "Berries"),
    ],
  };
}

function createVisibleBushVariant(value: number, label: string) {
  return {
    label,
    renderDescriptor: { kind: "variant-index" as const, variant: value },
    value,
  };
}

function createBushSeasonalRenderingMetadata(
  itemId: BushCatalogItemId,
): CatalogSeasonalPlaceableRenderingMetadata {
  return {
    kind: "seasonal-placeable",
    composition: "single-sprite",
    seasonalFrames: {
      spring: getBushSourceRect(itemId, "spring"),
      summer: getBushSourceRect(itemId, "summer"),
      fall: getBushSourceRect(itemId, "fall"),
      winter: getBushSourceRect(itemId, "winter"),
    },
  };
}

function createSourceRect(
  x: number,
  y: number,
  width: number,
  height: number,
): CatalogSourceRect {
  return { kind: "source-rect", x, y, width, height };
}

function describeValue(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean" || value === null) {
    return String(value);
  }
  return Object.prototype.toString.call(value);
}
