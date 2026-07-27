export const buildingPaintColorIds = ["color1", "color2", "color3"] as const;

export type BuildingPaintColorId = (typeof buildingPaintColorIds)[number];

export type BuildingPaintColors = Readonly<{
  color1: string;
  color2: string;
  color3: string;
}>;

export type BuildingPaintChannelDefinition = Readonly<{
  id: BuildingPaintColorId;
  label: string;
  minimumLight: number;
  maximumLight: number;
}>;

export type BuildingPaintDefinition = Readonly<{
  buildingId: string;
  channels: readonly BuildingPaintChannelDefinition[];
  paintMaskLocalPath: string;
}>;

type PaintableBuildingMetadata = Readonly<{
  buildingId: string;
  paintMaskFilename: string;
}>;

const localAssetRoot = "/game-assets/1.6.15/buildings";

const paintableBuildingMetadataByPaintDataName: Readonly<
  Record<string, PaintableBuildingMetadata>
> = {
  House: { buildingId: "Farmhouse", paintMaskFilename: "houses_PaintMask.png" },
  "Log Cabin": { buildingId: "Log Cabin", paintMaskFilename: "Log Cabin_PaintMask.png" },
  "Stone Cabin": { buildingId: "Stone Cabin", paintMaskFilename: "Stone Cabin_PaintMask.png" },
  "Plank Cabin": { buildingId: "Plank Cabin", paintMaskFilename: "Plank Cabin_PaintMask.png" },
  "Beach Cabin": { buildingId: "Beach Cabin", paintMaskFilename: "Beach Cabin_PaintMask.png" },
  "Neighbor Cabin": { buildingId: "Neighbor Cabin", paintMaskFilename: "Neighbor Cabin_PaintMask.png" },
  "Rustic Cabin": { buildingId: "Rustic Cabin", paintMaskFilename: "Rustic Cabin_PaintMask.png" },
  "Trailer Cabin": { buildingId: "Trailer Cabin", paintMaskFilename: "Trailer Cabin_PaintMask.png" },
  Stable: { buildingId: "Stable", paintMaskFilename: "Stable_PaintMask.png" },
  "Big Shed": { buildingId: "Big Shed", paintMaskFilename: "Big Shed_PaintMask.png" },
  "Deluxe Coop": { buildingId: "Deluxe Coop", paintMaskFilename: "Deluxe Coop_PaintMask.png" },
  "Deluxe Barn": { buildingId: "Deluxe Barn", paintMaskFilename: "Deluxe Barn_PaintMask.png" },
};

export function createDefaultBuildingPaintColors(): BuildingPaintColors {
  return { color1: "#ffffff", color2: "#ffffff", color3: "#ffffff" };
}

export function parseBuildingPaintDefinitions(
  rawPaintData: unknown,
): Readonly<Record<string, BuildingPaintDefinition>> {
  const paintDataRecord = assertPaintDataRecord(rawPaintData);
  const paintDefinitions: Record<string, BuildingPaintDefinition> = {};

  for (const [paintDataName, rawChannelSource] of Object.entries(paintDataRecord)) {
    const paintableBuildingMetadata =
      paintableBuildingMetadataByPaintDataName[paintDataName];

    if (paintableBuildingMetadata === undefined) {
      continue;
    }

    paintDefinitions[paintableBuildingMetadata.buildingId] = {
      buildingId: paintableBuildingMetadata.buildingId,
      channels: parseBuildingPaintChannels(paintDataName, rawChannelSource),
      paintMaskLocalPath: `${localAssetRoot}/${paintableBuildingMetadata.paintMaskFilename}`,
    };
  }

  return paintDefinitions;
}

export function getBuildingPaintDefinition(
  buildingId: string,
  rawPaintData: unknown,
): BuildingPaintDefinition | null {
  if (typeof buildingId !== "string" || buildingId.length === 0) {
    throw new TypeError(
      `Paintable building ID must be a non-empty string; received ${describeValue(buildingId)}.`,
    );
  }

  return parseBuildingPaintDefinitions(rawPaintData)[buildingId] ?? null;
}

export function isBuildingPaintable(buildingId: string): boolean {
  if (typeof buildingId !== "string" || buildingId.length === 0) {
    throw new TypeError(
      `Paintable building ID must be a non-empty string; received ${describeValue(buildingId)}.`,
    );
  }

  return Object.values(paintableBuildingMetadataByPaintDataName).some(
    (paintableBuildingMetadata) =>
      paintableBuildingMetadata.buildingId === buildingId,
  );
}

export function getBuildingPaintMaskLocalPath(buildingId: string): string | null {
  if (typeof buildingId !== "string" || buildingId.length === 0) {
    throw new TypeError(
      `Paintable building ID must be a non-empty string; received ${describeValue(buildingId)}.`,
    );
  }

  const paintableBuildingMetadata = Object.values(
    paintableBuildingMetadataByPaintDataName,
  ).find(
    (candidatePaintableBuildingMetadata) =>
      candidatePaintableBuildingMetadata.buildingId === buildingId,
  );

  return paintableBuildingMetadata === undefined
    ? null
    : `${localAssetRoot}/${paintableBuildingMetadata.paintMaskFilename}`;
}

export function validateBuildingPaintColors(
  rawBuildingPaintColors: unknown,
): BuildingPaintColors {
  if (
    typeof rawBuildingPaintColors !== "object" ||
    rawBuildingPaintColors === null ||
    Array.isArray(rawBuildingPaintColors) ||
    (Object.getPrototypeOf(rawBuildingPaintColors) !== Object.prototype &&
      Object.getPrototypeOf(rawBuildingPaintColors) !== null)
  ) {
    throw new TypeError(
      `Building paint colors must be a plain object; received ${describeValue(rawBuildingPaintColors)}.`,
    );
  }

  const buildingPaintColors = rawBuildingPaintColors as Record<string, unknown>;
  const expectedColorIds = new Set<string>(buildingPaintColorIds);

  for (const colorId of Object.keys(buildingPaintColors)) {
    if (!expectedColorIds.has(colorId)) {
      throw new TypeError(
        `Building paint colors must not contain ${JSON.stringify(colorId)}; received ${describeValue(buildingPaintColors[colorId])}.`,
      );
    }
  }

  return {
    color1: readPaintColor(buildingPaintColors.color1, "color1"),
    color2: readPaintColor(buildingPaintColors.color2, "color2"),
    color3: readPaintColor(buildingPaintColors.color3, "color3"),
  };
}

function assertPaintDataRecord(
  rawPaintData: unknown,
): Readonly<Record<string, unknown>> {
  if (
    typeof rawPaintData !== "object" ||
    rawPaintData === null ||
    Array.isArray(rawPaintData) ||
    (Object.getPrototypeOf(rawPaintData) !== Object.prototype &&
      Object.getPrototypeOf(rawPaintData) !== null)
  ) {
    throw new TypeError(
      `PaintData must be a plain object; received ${describeValue(rawPaintData)}.`,
    );
  }

  return rawPaintData as Readonly<Record<string, unknown>>;
}

function parseBuildingPaintChannels(
  paintDataName: string,
  rawChannelSource: unknown,
): readonly BuildingPaintChannelDefinition[] {
  if (typeof rawChannelSource !== "string" || rawChannelSource.length === 0) {
    throw new TypeError(
      `PaintData building ${JSON.stringify(paintDataName)} must be a non-empty string; received ${describeValue(rawChannelSource)}.`,
    );
  }

  const channelSourceParts = rawChannelSource.split("/");

  if (channelSourceParts.length % 2 !== 0) {
    throw new Error(
      `PaintData building ${JSON.stringify(paintDataName)} must contain label/range pairs; received ${describeValue(rawChannelSource)}.`,
    );
  }

  if (channelSourceParts.length > buildingPaintColorIds.length * 2) {
    throw new Error(
      `PaintData building ${JSON.stringify(paintDataName)} has too many channels; received ${String(channelSourceParts.length / 2)}.`,
    );
  }

  return Array.from(
    { length: channelSourceParts.length / 2 },
    (_, channelIndex) => {
      const label = channelSourceParts[channelIndex * 2]?.trim() ?? "";
      const range = channelSourceParts[channelIndex * 2 + 1]?.trim() ?? "";
      const colorId = buildingPaintColorIds[channelIndex];

      if (colorId === undefined || label.length === 0) {
        throw new Error(
          `PaintData building ${JSON.stringify(paintDataName)} channel ${JSON.stringify(label)} has no supported color channel at index ${String(channelIndex)}.`,
        );
      }

      const lightRangeParts = range.split(/\s+/);

      if (lightRangeParts.length !== 2) {
        throw new Error(
          `PaintData building ${JSON.stringify(paintDataName)} channel ${JSON.stringify(label)} must contain two light values; received ${describeValue(range)}.`,
        );
      }

      const minimumLight = Number(lightRangeParts[0]);
      const maximumLight = Number(lightRangeParts[1]);

      if (!Number.isFinite(minimumLight) || !Number.isFinite(maximumLight)) {
        throw new Error(
          `PaintData building ${JSON.stringify(paintDataName)} channel ${JSON.stringify(label)} must contain finite light values; received ${describeValue(range)}.`,
        );
      }

      if (minimumLight > maximumLight) {
        throw new Error(
          `PaintData building ${JSON.stringify(paintDataName)} channel ${JSON.stringify(label)} has minimum light ${String(minimumLight)} greater than maximum light ${String(maximumLight)}.`,
        );
      }

      return { colorId, id: colorId, label, minimumLight, maximumLight };
    },
  ).map(({ colorId: _colorId, ...channel }) => channel);
}

function readPaintColor(rawPaintColor: unknown, colorId: BuildingPaintColorId): string {
  if (typeof rawPaintColor !== "string" || !/^#[0-9a-f]{6}$/i.test(rawPaintColor)) {
    throw new TypeError(
      `Building paint color ${JSON.stringify(colorId)} must be a six-digit hex color; received ${describeValue(rawPaintColor)}.`,
    );
  }

  return rawPaintColor.toLowerCase();
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  return JSON.stringify(value);
}
