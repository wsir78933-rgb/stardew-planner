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
  buildingIds: readonly string[];
  paintMaskFilename: string;
}>;

const localAssetRoot = "/game-assets/1.6.15/buildings";

const paintableBuildingMetadataByPaintDataName: Readonly<
  Record<string, PaintableBuildingMetadata>
> = {
  House: {
    buildingIds: ["Farmhouse", "Farmhouse_1", "Farmhouse_2"],
    paintMaskFilename: "houses_PaintMask.png",
  },
  "Log Cabin": {
    buildingIds: ["Log Cabin_2"],
    paintMaskFilename: "Log Cabin_PaintMask.png",
  },
  // The frozen FI/EI map has no "Stone Cabin" ID. Its source record is
  // named "Cabin", so this PaintData entry intentionally projects no item.
  "Stone Cabin": { buildingIds: [], paintMaskFilename: "Stone Cabin_PaintMask.png" },
  "Plank Cabin": {
    buildingIds: ["Plank Cabin_2"],
    paintMaskFilename: "Plank Cabin_PaintMask.png",
  },
  "Beach Cabin": {
    buildingIds: ["Beach Cabin_2"],
    paintMaskFilename: "Beach Cabin_PaintMask.png",
  },
  "Neighbor Cabin": {
    buildingIds: ["Neighbor Cabin_2"],
    paintMaskFilename: "Neighbor Cabin_PaintMask.png",
  },
  "Rustic Cabin": {
    buildingIds: ["Rustic Cabin_2"],
    paintMaskFilename: "Rustic Cabin_PaintMask.png",
  },
  "Trailer Cabin": {
    buildingIds: ["Trailer Cabin_2"],
    paintMaskFilename: "Trailer Cabin_PaintMask.png",
  },
  Stable: { buildingIds: ["Stable"], paintMaskFilename: "Stable_PaintMask.png" },
  "Big Shed": { buildingIds: ["Big Shed"], paintMaskFilename: "Big Shed_PaintMask.png" },
  "Deluxe Coop": {
    buildingIds: ["Deluxe Coop"],
    paintMaskFilename: "Deluxe Coop_PaintMask.png",
  },
  "Deluxe Barn": {
    buildingIds: ["Deluxe Barn"],
    paintMaskFilename: "Deluxe Barn_PaintMask.png",
  },
};

const lockedPaintDataByName = {
  House: "Building/-50 -10/Roof/-25 0/Trim/-25 -8",
  "Log Cabin": "Building/-20 20/Roof/-15 5/Trim/-10 5",
  "Stone Cabin": "Building/-15 25/Roof/-15 5/Trim/-5 5",
  "Plank Cabin": "Building/-55 -20/Roof/-10 5/Trim/-55 -30",
  "Beach Cabin": "Building/-10 0/Roof/0 5/Trim/-5 5",
  "Neighbor Cabin": "Building/-10 0/Roof/-15 10/Trim/-10 5",
  "Rustic Cabin": "Building/-20 5/Roof/-5 5/Trim/-5 0",
  "Trailer Cabin": "Building/-5 0/Roof/-5 5/Trim/-5 0",
  Stable: "Building/-20 5/Roof/-25 0/Trim/-15 0",
  "Big Shed": "Building/-45 -10/Roof/-20 5/Trim/-25 0",
  "Deluxe Coop": "Building/-25 0/Roof/-15 5/Trim/-25 0",
  "Deluxe Barn": "Building/-15 0/Roof/-10 5/Trim/-10 5",
} as const;

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

    const channels = parseBuildingPaintChannels(paintDataName, rawChannelSource);
    for (const buildingId of paintableBuildingMetadata.buildingIds) {
      paintDefinitions[buildingId] = {
        buildingId,
        channels,
        paintMaskLocalPath: `${localAssetRoot}/${paintableBuildingMetadata.paintMaskFilename}`,
      };
    }
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

export function getLockedBuildingPaintDefinition(
  buildingId: string,
): BuildingPaintDefinition | null {
  return getBuildingPaintDefinition(buildingId, lockedPaintDataByName);
}

export function isBuildingPaintable(buildingId: string): boolean {
  if (typeof buildingId !== "string" || buildingId.length === 0) {
    throw new TypeError(
      `Paintable building ID must be a non-empty string; received ${describeValue(buildingId)}.`,
    );
  }

  return Object.values(paintableBuildingMetadataByPaintDataName).some(
    (paintableBuildingMetadata) =>
      paintableBuildingMetadata.buildingIds.includes(buildingId),
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
      candidatePaintableBuildingMetadata.buildingIds.includes(buildingId),
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
