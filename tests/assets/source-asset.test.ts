import { describe, expect, it } from "vitest";
import {
  lstat,
  mkdtemp,
  readFile,
  rename,
  rm,
  mkdir,
  readdir,
  realpath,
  symlink,
  writeFile,
} from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  validateSourceAsset,
  type SourceAsset,
} from "../../src/assets/source-asset";
import { sourceAssets } from "../../src/assets/source-manifest";
import { renderingSourceAssets } from "../../src/assets/rendering-source-manifest";
import {
  farmhouse2Composite,
  gingerIslandOverlays,
  plannerMaps,
  type PlannerMap,
} from "../../src/maps/map-catalog";
import {
  synchronizeAssets,
  type FetchImplementation,
} from "../../src/assets/sync-assets";
import { parseAssetLock } from "../../src/assets/asset-lock";

const executeFile = promisify(execFile);

const validJsonSourceAsset: SourceAsset = {
  sourceUrl: "https://assets.stardewplan.com/assets/1.6.15/data/Crops.json",
  outputPath: "data/Crops.json",
  mediaType: "application/json",
};

const validXmlSourceAsset: SourceAsset = {
  sourceUrl: "https://assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx",
  outputPath: "maps/Farm.tmx",
  mediaType: "application/xml",
};

const validPngSourceAsset: SourceAsset = {
  sourceUrl: "https://assets.stardewplan.com/assets/1.6.15/tilesheets/Farm.png",
  outputPath: "tilesheets/Farm.png",
  mediaType: "image/png",
};

const pngSignature = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const validMinimumPng = Uint8Array.from(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGNgAAAAAgABSK+kcQAAAABJRU5ErkJggg==",
    "base64",
  ),
);
const zeroWidthPng = Uint8Array.from(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAAAAAABCAAAAADVvPBrAAAACklEQVR4nGNgAAAAAgABSK+kcQAAAABJRU5ErkJggg==",
    "base64",
  ),
);

type FetchResponseFixture = {
  body: Uint8Array;
  contentType: string | null;
  ok?: boolean;
  status?: number;
  url: string;
};

function createFetchImplementation(
  responseFixture: FetchResponseFixture,
): FetchImplementation {
  let arrayBufferReadCount = 0;

  return async () => ({
    ok: responseFixture.ok ?? true,
    status: responseFixture.status ?? 200,
    url: responseFixture.url,
    headers: {
      get(headerName: string): string | null {
        return headerName.toLowerCase() === "content-type"
          ? responseFixture.contentType
          : null;
      },
    },
    async arrayBuffer(): Promise<ArrayBuffer> {
      arrayBufferReadCount += 1;

      if (arrayBufferReadCount > 1) {
        throw new Error("The response body was read more than once.");
      }

      return responseFixture.body.buffer.slice(
        responseFixture.body.byteOffset,
        responseFixture.body.byteOffset + responseFixture.body.byteLength,
      ) as ArrayBuffer;
    },
  });
}

async function createTargetDirectory(): Promise<string> {
  return mkdtemp(
    join(await realpath(tmpdir()), "stardew-planner-assets-"),
  );
}

async function removeTargetDirectory(targetDirectory: string): Promise<void> {
  await rm(targetDirectory, { force: true, recursive: true });
}

async function readTextFile(filePath: string): Promise<string> {
  return readFile(filePath, "utf8");
}

async function expectNoStagingOrBackupDirectories(
  targetDirectory: string,
): Promise<void> {
  const targetDirectoryName = basename(targetDirectory);
  const targetDirectoryParentEntries = await readdir(dirname(targetDirectory));

  expect(targetDirectoryParentEntries).not.toContainEqual(
    expect.stringMatching(`^\\.${targetDirectoryName}\\.staging-`),
  );
  expect(targetDirectoryParentEntries).not.toContainEqual(
    expect.stringMatching(`^\\.${targetDirectoryName}\\.backup-`),
  );
}

function createFailingFetchImplementation(
  fetchRequestCounter: { count: number },
): FetchImplementation {
  return async (sourceUrl) => {
    fetchRequestCounter.count += 1;
    throw new Error(`Unexpected asset request for ${sourceUrl}.`);
  };
}

const validExistingAssetLock = JSON.stringify({
  assets: [
    {
      sourceUrl: "https://assets.stardewplan.com/assets/1.6.15/maps/Old.tmx",
      outputPath: "maps/Old.tmx",
      mediaType: "application/xml",
      sha256: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
  ],
});

const validJsonAssetLock = JSON.stringify({
  assets: [
    {
      sourceUrl: validJsonSourceAsset.sourceUrl,
      outputPath: validJsonSourceAsset.outputPath,
      mediaType: validJsonSourceAsset.mediaType,
      sha256: "d1d57f9b39af9791f24a1f210b93eb19b014735a245295fa84abee2ef99c2966",
    },
  ],
});

const validSourceAsset: SourceAsset = {
  sourceUrl: "https://assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx",
  outputPath: "maps/Farm.tmx",
  mediaType: "application/xml",
};

function getValidationFailureMessage(sourceAsset: unknown): string {
  try {
    validateSourceAsset(sourceAsset as SourceAsset);
  } catch (validationError) {
    if (validationError instanceof Error) {
      return validationError.message;
    }

    throw validationError;
  }

  throw new Error(
    `Expected source asset validation to fail for ${JSON.stringify(sourceAsset)}.`,
  );
}

async function getSynchronizationFailureMessage(
  synchronization: Promise<void>,
): Promise<string> {
  try {
    await synchronization;
  } catch (synchronizationError) {
    if (synchronizationError instanceof Error) {
      return synchronizationError.message;
    }

    throw synchronizationError;
  }

  throw new Error("Expected asset synchronization to fail.");
}

describe("source asset contract", () => {
  it("preserves the locked map and crop prefix before adding static rendering assets", async () => {
    expect(sourceAssets).toHaveLength(337);

    const { mapSourceAssets } = await import(
      "../../src/assets/map-source-manifest"
    );
    const expectedMapOutputPaths = createExpectedMapOutputPaths();
    const sourceAssetOutputPaths = sourceAssets.map(
      (sourceAsset) => sourceAsset.outputPath,
    );

    expect(mapSourceAssets).toHaveLength(112);
    expect(sourceAssets[0]).toEqual({
      sourceUrl:
        "https://assets.stardewplan.com/assets/1.6.15/data/Crops.json",
      outputPath: "data/Crops.json",
      mediaType: "application/json",
    });
    expect(sourceAssets.slice(1, 113)).toEqual(mapSourceAssets);
    expect(sourceAssets.slice(113)).toEqual(renderingSourceAssets);
    expect(sourceAssetOutputPaths).toEqual([
      "data/Crops.json",
      ...expectedMapOutputPaths,
      ...renderingSourceAssets.map(
        (sourceAsset) => sourceAsset.outputPath,
      ),
    ]);
    expect(new Set(sourceAssetOutputPaths).size).toBe(337);

    expect(findSourceAssetByOutputPath(sourceAssets, "maps/Farm.tmx")).toEqual({
      sourceUrl:
        "https://assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx",
      outputPath: "maps/Farm.tmx",
      mediaType: "application/xml",
    });
    expect(
      findSourceAssetByOutputPath(
        sourceAssets,
        "mods/flashshifter.immersivefarm2remastered/IF2R.tmx",
      ),
    ).toEqual({
      sourceUrl:
        "https://assets.stardewplan.com/assets/1.6.15/mods/flashshifter.immersivefarm2remastered/IF2R.tmx",
      outputPath: "mods/flashshifter.immersivefarm2remastered/IF2R.tmx",
      mediaType: "application/xml",
    });
    expect(
      findSourceAssetByOutputPath(sourceAssets, "maps/previews/winery.png"),
    ).toEqual({
      sourceUrl:
        "https://assets.stardewplan.com/assets/1.6.15/maps/previews/winery.png",
      outputPath: "maps/previews/winery.png",
      mediaType: "image/png",
    });
    expect(
      findSourceAssetByOutputPath(
        sourceAssets,
        "mods/flashshifter.immersivefarm2remastered/preview.png",
      ),
    ).toEqual({
      sourceUrl:
        "https://assets.stardewplan.com/assets/1.6.15/mods/flashshifter.immersivefarm2remastered/preview.png",
      outputPath: "mods/flashshifter.immersivefarm2remastered/preview.png",
      mediaType: "image/png",
    });

    expect(
      mapSourceAssets
        .filter((sourceAsset) => sourceAsset.mediaType === "application/xml")
        .slice(-16)
        .map((sourceAsset) => sourceAsset.outputPath),
    ).toEqual([
      "maps/Island_House_Restored.tmx",
      "maps/Island_House_Bin.tmx",
      "maps/Island_House_Cave.tmx",
      "maps/Island_W_Obelisk.tmx",
      "maps/FarmHouse2_marriage.tmx",
      "maps/spouseRooms.tmx",
      "maps/FarmHouse_Bedroom_Open.tmx",
      "maps/FarmHouse_SouthernRoom_Add.tmx",
      "maps/FarmHouse_CornerRoom_Add.tmx",
      "maps/FarmHouse_ExtendedCornerRoom_Add.tmx",
      "maps/FarmHouse_DiningRoom_Add.tmx",
      "maps/FarmHouse_DiningRoomWall_Remove.tmx",
      "maps/FarmHouse_Cubby_Add.tmx",
      "maps/FarmHouse_FarUpperRoom_Add.tmx",
      "maps/FarmHouse_Crib_0.tmx",
      "maps/FarmHouse_Cellar.tmx",
    ]);
  });

  it("validates every source asset in the manifest", () => {
    for (const sourceAsset of sourceAssets) {
      expect(() => validateSourceAsset(sourceAsset)).not.toThrow();
    }
  });

  it("reports the complete shape of an invalid source asset object", () => {
    const invalidSourceAsset = { unexpected: "value" };

    expect(
      getValidationFailureMessage(invalidSourceAsset),
    ).toContain('{"unexpected":"value"}');
  });

  it.each([
    [
      "a raw parent directory segment",
      "https://assets.stardewplan.com/assets/1.6.15/maps/../Farm.tmx",
    ],
    [
      "a raw backslash separator",
      "https://assets.stardewplan.com/assets/1.6.15/maps\\Farm.tmx",
    ],
  ])(
    "rejects %s before URL pathname normalization",
    (_, sourceUrl) => {
      const sourceAsset = { ...validSourceAsset, sourceUrl };

      expect(getValidationFailureMessage(sourceAsset)).toContain(sourceUrl);
    },
  );

  it.each([
    "https://assets.stardewplan.com/assets/1.6.15/maps/Farm%20Copy.tmx",
    "https://assets.stardewplan.com/assets/1.6.15/maps/%E6%B5%8B%E8%AF%95.tmx",
  ])("accepts safe percent-encoded source paths", (sourceUrl) => {
    expect(() =>
      validateSourceAsset({ ...validSourceAsset, sourceUrl }),
    ).not.toThrow();
  });

  it.each([
    "%2F",
    "%5C",
    "%2E",
    "%2E%2E",
    "%252F",
    "%255C",
    "%252E",
    "%252E%252E",
    "%25252F",
    "%25255C",
    "%25252E",
    "%25252E%25252E",
    "%ZZ",
  ])(
    "rejects dangerous or malformed percent-encoded path expression %s",
    (encodedPathPart) => {
      const sourceUrl = `https://assets.stardewplan.com/assets/1.6.15/maps/${encodedPathPart}Farm.tmx`;

      expect(
        getValidationFailureMessage({ ...validSourceAsset, sourceUrl }),
      ).toContain(sourceUrl);
    },
  );

  it.each([
    [
      "non-HTTPS URL",
      {
        ...validSourceAsset,
        sourceUrl: "http://assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx",
      },
      "http://assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx",
    ],
    [
      "unapproved asset origin",
      {
        ...validSourceAsset,
        sourceUrl: "https://example.com/assets/1.6.15/maps/Farm.tmx",
      },
      "https://example.com/assets/1.6.15/maps/Farm.tmx",
    ],
    [
      "asset URL outside the locked version path",
      {
        ...validSourceAsset,
        sourceUrl:
          "https://assets.stardewplan.com/assets/1.6.14/maps/Farm.tmx",
      },
      "https://assets.stardewplan.com/assets/1.6.14/maps/Farm.tmx",
    ],
    [
      "query string",
      {
        ...validSourceAsset,
        sourceUrl:
          "https://assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx?cache=1",
      },
      "?cache=1",
    ],
    [
      "empty trailing query marker",
      {
        ...validSourceAsset,
        sourceUrl:
          "https://assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx?",
      },
      "https://assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx?",
    ],
    [
      "fragment",
      {
        ...validSourceAsset,
        sourceUrl:
          "https://assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx#preview",
      },
      "#preview",
    ],
    [
      "empty trailing fragment marker",
      {
        ...validSourceAsset,
        sourceUrl:
          "https://assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx#",
      },
      "https://assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx#",
    ],
    [
      "URL username",
      {
        ...validSourceAsset,
        sourceUrl:
          "https://stardew@assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx",
      },
      "stardew",
    ],
    [
      "URL password",
      {
        ...validSourceAsset,
        sourceUrl:
          "https://stardew:secret@assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx",
      },
      "https://stardew:secret@assets.stardewplan.com/assets/1.6.15/maps/Farm.tmx",
    ],
    [
      "encoded path traversal separators",
      {
        ...validSourceAsset,
        sourceUrl:
          "https://assets.stardewplan.com/assets/1.6.15/%2F..%2F1.6.14/maps/Farm.tmx",
      },
      "https://assets.stardewplan.com/assets/1.6.15/%2F..%2F1.6.14/maps/Farm.tmx",
    ],
    [
      "encoded backslash path separator",
      {
        ...validSourceAsset,
        sourceUrl:
          "https://assets.stardewplan.com/assets/1.6.15/maps%5CFarm.tmx",
      },
      "https://assets.stardewplan.com/assets/1.6.15/maps%5CFarm.tmx",
    ],
    [
      "encoded dot path traversal",
      {
        ...validSourceAsset,
        sourceUrl:
          "https://assets.stardewplan.com/assets/1.6.15/maps/%2E%2E/Farm.tmx",
      },
      "https://assets.stardewplan.com/assets/1.6.15/maps/%2E%2E/Farm.tmx",
    ],
    [
      "absolute output path",
      {
        ...validSourceAsset,
        outputPath: "/maps/Farm.tmx",
      },
      "/maps/Farm.tmx",
    ],
    [
      "Windows drive absolute output path with forward slashes",
      {
        ...validSourceAsset,
        outputPath: "C:/outside/Farm.tmx",
      },
      "C:/outside/Farm.tmx",
    ],
    [
      "Windows drive-relative output path",
      {
        ...validSourceAsset,
        outputPath: "C:outside/Farm.tmx",
      },
      "C:outside/Farm.tmx",
    ],
    [
      "Windows drive absolute output path with backslashes",
      {
        ...validSourceAsset,
        outputPath: "Z:\\outside\\Farm.tmx",
      },
      "Z:\\outside\\Farm.tmx",
    ],
    [
      "empty output path",
      {
        ...validSourceAsset,
        outputPath: "",
      },
      '""',
    ],
    [
      "parent traversal output path",
      {
        ...validSourceAsset,
        outputPath: "maps/../Farm.tmx",
      },
      "maps/../Farm.tmx",
    ],
    [
      "backslash output path",
      {
        ...validSourceAsset,
        outputPath: "maps\\Farm.tmx",
      },
      "maps\\Farm.tmx",
    ],
    [
      "NUL output path",
      {
        ...validSourceAsset,
        outputPath: "maps/\u0000Farm.tmx",
      },
      "maps/\u0000Farm.tmx",
    ],
    [
      "unsupported media type",
      {
        ...validSourceAsset,
        mediaType: "text/plain",
      },
      "text/plain",
    ],
  ])("fails fast for %s and reports the invalid value", (_, sourceAsset, value) => {
    expect(getValidationFailureMessage(sourceAsset)).toContain(value);
  });

  it.each(["maps//Farm.tmx", "maps/Farm.tmx/"])(
    "rejects an output path with an empty path segment: %s",
    (outputPath) => {
      expect(
        getValidationFailureMessage({ ...validSourceAsset, outputPath }),
      ).toContain(outputPath);
    },
  );
});

function createExpectedMapOutputPaths(): string[] {
  return [
    ...plannerMaps.flatMap((plannerMap) => [
      getExpectedPlannerMapOutputPath(plannerMap),
      plannerMap.previewOutputPath,
    ]),
    ...gingerIslandOverlays.map(
      (gingerIslandOverlay) => `maps/${gingerIslandOverlay.mapFile}`,
    ),
    `maps/${farmhouse2Composite.marriageMapFile}`,
    `maps/${farmhouse2Composite.spouseRoomMapFile}`,
    ...farmhouse2Composite.renovations.map(
      (farmhouseRenovation) => `maps/${farmhouseRenovation.mapFile}`,
    ),
  ];
}

function getExpectedPlannerMapOutputPath(plannerMap: PlannerMap): string {
  if (plannerMap.modId) {
    return `mods/${plannerMap.modId}/${plannerMap.mapFile}`;
  }

  return `maps/${plannerMap.mapFile}`;
}

function findSourceAssetByOutputPath(
  sourceAssetsToSearch: readonly SourceAsset[],
  outputPath: string,
): SourceAsset | undefined {
  return sourceAssetsToSearch.find(
    (sourceAsset) => sourceAsset.outputPath === outputPath,
  );
}

describe("asset synchronization", () => {
  it("imports through the asset CLI runtime without triggering a network request", async () => {
    const { stdout } = await executeFile(
      "pnpm",
      [
        "exec",
        "tsx",
        "-e",
        'globalThis.fetch = () => { throw new Error("Unexpected network request during import."); }; import("./src/assets/sync-assets.ts").then(() => process.stdout.write("SYNC_MODULE_IMPORTED"));',
      ],
      { cwd: process.cwd() },
    );

    expect(stdout).toBe("SYNC_MODULE_IMPORTED");
  });

  it("rejects an empty candidate list before creating staging or requesting assets", async () => {
    const targetDirectory = await createTargetDirectory();
    const fetchRequestCounter = { count: 0 };

    try {
      await expect(
        synchronizeAssets(
          [],
          createFailingFetchImplementation(fetchRequestCounter),
          targetDirectory,
        ),
      ).rejects.toThrow("[]");

      expect(fetchRequestCounter.count).toBe(0);
      await expectNoStagingOrBackupDirectories(targetDirectory);
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("rejects candidate output paths data/Crops.json and data//Crops.json before requesting assets", async () => {
    const targetDirectory = await createTargetDirectory();
    const fetchRequestCounter = { count: 0 };
    const sourceAssetWithEmptyPathSegment = {
      ...validXmlSourceAsset,
      outputPath: "data//Crops.json",
    };

    try {
      await expect(
        synchronizeAssets(
          [validJsonSourceAsset, sourceAssetWithEmptyPathSegment],
          createFailingFetchImplementation(fetchRequestCounter),
          targetDirectory,
        ),
      ).rejects.toThrow(sourceAssetWithEmptyPathSegment.outputPath);

      expect(fetchRequestCounter.count).toBe(0);
      await expectNoStagingOrBackupDirectories(targetDirectory);
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("writes a validated JSON asset and its locked SHA-256 hash", async () => {
    const targetDirectory = await createTargetDirectory();
    const jsonBody = new TextEncoder().encode('{"spring":28}');

    try {
      await synchronizeAssets(
        [validJsonSourceAsset],
        createFetchImplementation({
          body: jsonBody,
          contentType: "application/json; charset=utf-8",
          url: validJsonSourceAsset.sourceUrl,
        }),
        targetDirectory,
      );

      expect(
        await readTextFile(join(targetDirectory, validJsonSourceAsset.outputPath)),
      ).toBe('{"spring":28}');
      expect(
        JSON.parse(await readTextFile(join(targetDirectory, "asset-lock.json"))),
      ).toEqual({
        assets: [
          {
            sourceUrl: validJsonSourceAsset.sourceUrl,
            outputPath: validJsonSourceAsset.outputPath,
            mediaType: "application/json",
            sha256:
              "d1d57f9b39af9791f24a1f210b93eb19b014735a245295fa84abee2ef99c2966",
          },
        ],
      });
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("writes a strictly parsed TMX document", async () => {
    const targetDirectory = await createTargetDirectory();
    const tmxDocument = '<?xml version="1.0" encoding="UTF-8"?><map width="1" height="1" />';

    try {
      await synchronizeAssets(
        [validXmlSourceAsset],
        createFetchImplementation({
          body: new TextEncoder().encode(tmxDocument),
          contentType: "application/xml",
          url: validXmlSourceAsset.sourceUrl,
        }),
        targetDirectory,
      );

      expect(
        await readTextFile(join(targetDirectory, validXmlSourceAsset.outputPath)),
      ).toBe(tmxDocument);
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("writes a structurally valid minimum PNG", async () => {
    const targetDirectory = await createTargetDirectory();

    try {
      await synchronizeAssets(
        [validPngSourceAsset],
        createFetchImplementation({
          body: validMinimumPng,
          contentType: "image/png",
          url: validPngSourceAsset.sourceUrl,
        }),
        targetDirectory,
      );

      expect(
        await readFile(join(targetDirectory, validPngSourceAsset.outputPath)),
      ).toEqual(Buffer.from(validMinimumPng));
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it.each([
    [
      "a PNG signature followed by truncated content",
      pngSignature,
      "IHDR",
    ],
    [
      "an IHDR chunk with a zero width",
      zeroWidthPng,
      "IHDR",
    ],
    [
      "a PNG chunk with an invalid CRC",
      (() => {
        const pngWithInvalidCrc = validMinimumPng.slice();
        pngWithInvalidCrc[pngWithInvalidCrc.length - 13] ^= 0x01;
        return pngWithInvalidCrc;
      })(),
      "CRC",
    ],
    [
      "a PNG with no IEND chunk",
      validMinimumPng.slice(0, -12),
      "IEND",
    ],
    [
      "a PNG with bytes after IEND",
      new Uint8Array([...validMinimumPng, 0x00]),
      "IEND",
    ],
  ])("rejects %s and reports the source URL", async (_, body, expectedMessage) => {
    const targetDirectory = await createTargetDirectory();

    try {
      const synchronizationFailureMessage = await getSynchronizationFailureMessage(
        synchronizeAssets(
          [validPngSourceAsset],
          createFetchImplementation({
            body,
            contentType: "image/png",
            url: validPngSourceAsset.sourceUrl,
          }),
          targetDirectory,
        ),
      );

      expect(synchronizationFailureMessage).toContain(
        validPngSourceAsset.sourceUrl,
      );
      expect(synchronizationFailureMessage).toContain(expectedMessage);
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("rejects a candidate output path that would overwrite the asset lock", async () => {
    const targetDirectory = await createTargetDirectory();
    const collidingSourceAsset = {
      ...validJsonSourceAsset,
      outputPath: "asset-lock.json",
    };

    try {
      await expect(
        synchronizeAssets(
          [collidingSourceAsset],
          createFetchImplementation({
            body: new TextEncoder().encode('{"spring":28}'),
            contentType: "application/json",
            url: collidingSourceAsset.sourceUrl,
          }),
          targetDirectory,
        ),
      ).rejects.toThrow("asset-lock.json");
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("rejects an asset-lock child path before requesting assets", async () => {
    const targetDirectory = await createTargetDirectory();
    const fetchRequestCounter = { count: 0 };
    const lockChildSourceAsset = {
      ...validJsonSourceAsset,
      outputPath: "asset-lock.json/previous.json",
    };

    try {
      await expect(
        synchronizeAssets(
          [lockChildSourceAsset],
          createFailingFetchImplementation(fetchRequestCounter),
          targetDirectory,
        ),
      ).rejects.toThrow(lockChildSourceAsset.outputPath);

      expect(fetchRequestCounter.count).toBe(0);
      await expectNoStagingOrBackupDirectories(targetDirectory);
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it.each([
    [
      "a case-variant asset lock filename",
      [{ ...validJsonSourceAsset, outputPath: "ASSET-LOCK.JSON" }],
      ["ASSET-LOCK.JSON"],
    ],
    [
      "a child below a case-variant asset lock filename",
      [
        {
          ...validJsonSourceAsset,
          outputPath: "ASSET-LOCK.JSON/previous.json",
        },
      ],
      ["ASSET-LOCK.JSON/previous.json"],
    ],
    [
      "output paths that differ only by case",
      [
        validJsonSourceAsset,
        { ...validXmlSourceAsset, outputPath: "data/crops.json" },
      ],
      ["data/Crops.json", "data/crops.json"],
    ],
    [
      "output paths that differ only by Unicode normalization",
      [
        { ...validJsonSourceAsset, outputPath: "maps/Caf\u00e9.json" },
        { ...validXmlSourceAsset, outputPath: "maps/Cafe\u0301.json" },
      ],
      ["maps/Caf\u00e9.json", "maps/Cafe\u0301.json"],
    ],
  ])(
    "rejects %s before requesting assets or creating staging",
    async (_, conflictingSourceAssets, expectedOutputPaths) => {
      const targetDirectory = await createTargetDirectory();
      const fetchRequestCounter = { count: 0 };

      try {
        const synchronizationFailureMessage =
          await getSynchronizationFailureMessage(
            synchronizeAssets(
              conflictingSourceAssets,
              createFailingFetchImplementation(fetchRequestCounter),
              targetDirectory,
            ),
          );

        for (const expectedOutputPath of expectedOutputPaths) {
          expect(synchronizationFailureMessage).toContain(expectedOutputPath);
        }

        expect(fetchRequestCounter.count).toBe(0);
        await expectNoStagingOrBackupDirectories(targetDirectory);
      } finally {
        await removeTargetDirectory(targetDirectory);
      }
    },
  );

  it.each([
    [
      "duplicate output paths",
      [
        validJsonSourceAsset,
        {
          ...validXmlSourceAsset,
          outputPath: validJsonSourceAsset.outputPath,
        },
      ],
      validJsonSourceAsset.outputPath,
    ],
    [
      "an output path that is an ancestor of another output path",
      [
        { ...validJsonSourceAsset, outputPath: "data" },
        validJsonSourceAsset,
      ],
      "data",
    ],
    [
      "an output path that is a descendant of another output path",
      [
        validJsonSourceAsset,
        { ...validXmlSourceAsset, outputPath: "data/Maps.tmx" },
        { ...validPngSourceAsset, outputPath: "data/Maps.tmx/tiles.png" },
      ],
      "data/Maps.tmx",
    ],
  ])(
    "rejects %s before requesting assets or creating staging",
    async (_, conflictingSourceAssets, conflictingOutputPath) => {
      const targetDirectory = await createTargetDirectory();
      const fetchRequestCounter = { count: 0 };

      try {
        await expect(
          synchronizeAssets(
            conflictingSourceAssets,
            createFailingFetchImplementation(fetchRequestCounter),
            targetDirectory,
          ),
        ).rejects.toThrow(conflictingOutputPath);

        expect(fetchRequestCounter.count).toBe(0);
        await expectNoStagingOrBackupDirectories(targetDirectory);
      } finally {
        await removeTargetDirectory(targetDirectory);
      }
    },
  );

  it.each([
    [
      "invalid JSON",
      validJsonSourceAsset,
      new TextEncoder().encode('{"spring":'),
      "application/json",
      validJsonSourceAsset.sourceUrl,
      "spring",
    ],
    [
      "invalid XML",
      validXmlSourceAsset,
      new TextEncoder().encode("<map>"),
      "application/xml",
      validXmlSourceAsset.sourceUrl,
      "<map>",
    ],
    [
      "invalid PNG magic bytes",
      validPngSourceAsset,
      new Uint8Array([0x00, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      "image/png",
      validPngSourceAsset.sourceUrl,
      "00504e470d0a1a0a",
    ],
  ])(
    "rejects %s and reports the invalid value",
    async (_, sourceAsset, body, contentType, url, expectedValue) => {
      const targetDirectory = await createTargetDirectory();

      try {
        await expect(
          synchronizeAssets(
            [sourceAsset],
            createFetchImplementation({ body, contentType, url }),
            targetDirectory,
          ),
        ).rejects.toThrow(expectedValue);
      } finally {
        await removeTargetDirectory(targetDirectory);
      }
    },
  );

  it.each([
    [
      "invalid UTF-8 JSON bytes",
      validJsonSourceAsset,
      new Uint8Array([0xc3, 0x28]),
      "application/json",
      "c328",
    ],
    [
      "an XML parser warning",
      validXmlSourceAsset,
      new TextEncoder().encode("<map invalidAttribute></map>"),
      "application/xml",
      "invalidAttribute",
    ],
    [
      "a TMX document with an invalid root element",
      validXmlSourceAsset,
      new TextEncoder().encode("<tileset />"),
      "application/xml",
      "tileset",
    ],
  ])(
    "rejects %s and reports the invalid value",
    async (_, sourceAsset, body, contentType, expectedValue) => {
      const targetDirectory = await createTargetDirectory();

      try {
        await expect(
          synchronizeAssets(
            [sourceAsset],
            createFetchImplementation({
              body,
              contentType,
              url: sourceAsset.sourceUrl,
            }),
            targetDirectory,
          ),
        ).rejects.toThrow(expectedValue);
      } finally {
        await removeTargetDirectory(targetDirectory);
      }
    },
  );

  it.each([
    ["a wrong content type", "text/plain", "text/plain"],
    ["a missing content type", null, "null"],
  ])("rejects %s and reports the received value", async (_, contentType, expectedValue) => {
    const targetDirectory = await createTargetDirectory();

    try {
      await expect(
        synchronizeAssets(
          [validJsonSourceAsset],
          createFetchImplementation({
            body: new TextEncoder().encode('{"spring":28}'),
            contentType,
            url: validJsonSourceAsset.sourceUrl,
          }),
          targetDirectory,
        ),
      ).rejects.toThrow(expectedValue);
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("rejects an HTTP failure and reports its status", async () => {
    const targetDirectory = await createTargetDirectory();

    try {
      await expect(
        synchronizeAssets(
          [validJsonSourceAsset],
          createFetchImplementation({
            body: new Uint8Array(),
            contentType: "application/json",
            ok: false,
            status: 503,
            url: validJsonSourceAsset.sourceUrl,
          }),
          targetDirectory,
        ),
      ).rejects.toThrow("503");
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("rejects an OK response with a non-2xx integer status", async () => {
    const targetDirectory = await createTargetDirectory();

    try {
      await expect(
        synchronizeAssets(
          [validJsonSourceAsset],
          createFetchImplementation({
            body: new TextEncoder().encode('{"spring":28}'),
            contentType: "application/json",
            ok: true,
            status: 503,
            url: validJsonSourceAsset.sourceUrl,
          }),
          targetDirectory,
        ),
      ).rejects.toThrow("503");
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it.each([
    ["a false ok response with a 200 status", false, 200],
    ["a true ok response with a fractional status", true, 200.5],
  ])(
    "rejects %s and reports the source URL, ok, and status",
    async (_, ok, status) => {
      const targetDirectory = await createTargetDirectory();

      try {
        const synchronizationFailureMessage =
          await getSynchronizationFailureMessage(
            synchronizeAssets(
              [validJsonSourceAsset],
              createFetchImplementation({
                body: new TextEncoder().encode('{"spring":28}'),
                contentType: "application/json",
                ok,
                status,
                url: validJsonSourceAsset.sourceUrl,
              }),
              targetDirectory,
            ),
          );

        expect(synchronizationFailureMessage).toContain(
          validJsonSourceAsset.sourceUrl,
        );
        expect(synchronizationFailureMessage).toContain(`ok: ${ok}`);
        expect(synchronizationFailureMessage).toContain(`status: ${status}`);
      } finally {
        await removeTargetDirectory(targetDirectory);
      }
    },
  );

  it("rejects a redirected final URL variant and reports it", async () => {
    const targetDirectory = await createTargetDirectory();
    const redirectedUrl = `${validJsonSourceAsset.sourceUrl}?cache=1`;

    try {
      await expect(
        synchronizeAssets(
          [validJsonSourceAsset],
          createFetchImplementation({
            body: new TextEncoder().encode('{"spring":28}'),
            contentType: "application/json",
            url: redirectedUrl,
          }),
          targetDirectory,
        ),
      ).rejects.toThrow(redirectedUrl);
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("rejects an existing lock hash mismatch without replacing its published files", async () => {
    const targetDirectory = await createTargetDirectory();
    const previousHash = "0000000000000000000000000000000000000000000000000000000000000000";
    const nextHash = "d1d57f9b39af9791f24a1f210b93eb19b014735a245295fa84abee2ef99c2966";

    try {
      await mkdir(join(targetDirectory, "data"), { recursive: true });
      await writeFile(join(targetDirectory, "data", "Crops.json"), "old crops");
      await writeFile(
        join(targetDirectory, "asset-lock.json"),
        JSON.stringify({
          assets: [
            {
              sourceUrl: validJsonSourceAsset.sourceUrl,
              outputPath: validJsonSourceAsset.outputPath,
              mediaType: validJsonSourceAsset.mediaType,
              sha256: previousHash,
            },
          ],
        }),
      );

      const failedSynchronization = synchronizeAssets(
        [validJsonSourceAsset],
        createFetchImplementation({
          body: new TextEncoder().encode('{"spring":28}'),
          contentType: "application/json",
          url: validJsonSourceAsset.sourceUrl,
        }),
        targetDirectory,
      );

      await expect(failedSynchronization).rejects.toThrow(
        validJsonSourceAsset.outputPath,
      );
      await expect(failedSynchronization).rejects.toThrow(previousHash);
      await expect(failedSynchronization).rejects.toThrow(nextHash);
      expect(
        await readTextFile(join(targetDirectory, "data", "Crops.json")),
      ).toBe("old crops");
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("rejects a corrupted existing asset lock and reports its invalid hash", async () => {
    const targetDirectory = await createTargetDirectory();

    try {
      await writeFile(
        join(targetDirectory, "asset-lock.json"),
        JSON.stringify({
          assets: [
            {
              sourceUrl: validXmlSourceAsset.sourceUrl,
              outputPath: validXmlSourceAsset.outputPath,
              mediaType: validXmlSourceAsset.mediaType,
              sha256: "not-a-sha256-hash",
            },
          ],
        }),
      );

      await expect(
        synchronizeAssets(
          [validJsonSourceAsset],
          createFetchImplementation({
            body: new TextEncoder().encode('{"spring":28}'),
            contentType: "application/json",
            url: validJsonSourceAsset.sourceUrl,
          }),
          targetDirectory,
        ),
      ).rejects.toThrow("not-a-sha256-hash");
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it.each([
    ["the lock file itself", "asset-lock.json", "asset-lock.json"],
    [
      "a child of the lock file",
      "asset-lock.json/previous.json",
      "asset-lock.json/previous.json",
    ],
    ["duplicate output paths", "data/Crops.json", "data/Crops.json"],
  ])(
    "rejects a parsed lock containing %s",
    (_, invalidOutputPath, expectedValue) => {
      const outputPaths =
        invalidOutputPath === "data/Crops.json"
          ? ["data/Crops.json", "data/Crops.json"]
          : [invalidOutputPath];

      expect(() =>
        parseAssetLock(
          JSON.stringify({
            assets: outputPaths.map((outputPath) => ({
              sourceUrl: validJsonSourceAsset.sourceUrl,
              outputPath,
              mediaType: validJsonSourceAsset.mediaType,
              sha256:
                "d1d57f9b39af9791f24a1f210b93eb19b014735a245295fa84abee2ef99c2966",
            })),
          }),
        ),
      ).toThrow(expectedValue);
    },
  );

  it.each([
    ["an ancestor output path", ["data", "data/Crops.json"], "data"],
    [
      "a descendant output path",
      ["maps/Farm.tmx", "maps/Farm.tmx/tiles.png"],
      "maps/Farm.tmx",
    ],
  ])(
    "rejects a parsed lock containing %s",
    (_, outputPaths, expectedValue) => {
      expect(() =>
        parseAssetLock(
          JSON.stringify({
            assets: outputPaths.map((outputPath) => ({
              sourceUrl: validJsonSourceAsset.sourceUrl,
              outputPath,
              mediaType: validJsonSourceAsset.mediaType,
              sha256:
                "d1d57f9b39af9791f24a1f210b93eb19b014735a245295fa84abee2ef99c2966",
            })),
          }),
        ),
      ).toThrow(expectedValue);
    },
  );

  it.each([
    [
      "a case-variant asset lock filename",
      ["ASSET-LOCK.JSON"],
      ["ASSET-LOCK.JSON"],
    ],
    [
      "a child below a case-variant asset lock filename",
      ["ASSET-LOCK.JSON/previous.json"],
      ["ASSET-LOCK.JSON/previous.json"],
    ],
    [
      "output paths that differ only by case",
      ["data/Crops.json", "data/crops.json"],
      ["data/Crops.json", "data/crops.json"],
    ],
    [
      "output paths that differ only by Unicode normalization",
      ["maps/Caf\u00e9.json", "maps/Cafe\u0301.json"],
      ["maps/Caf\u00e9.json", "maps/Cafe\u0301.json"],
    ],
  ])(
    "rejects a parsed lock containing %s",
    (_, outputPaths, expectedOutputPaths) => {
      const assetLockContents = JSON.stringify({
        assets: outputPaths.map((outputPath) => ({
          sourceUrl: validJsonSourceAsset.sourceUrl,
          outputPath,
          mediaType: validJsonSourceAsset.mediaType,
          sha256:
            "d1d57f9b39af9791f24a1f210b93eb19b014735a245295fa84abee2ef99c2966",
        })),
      });

      try {
        parseAssetLock(assetLockContents);
      } catch (assetLockError) {
        if (assetLockError instanceof Error) {
          for (const expectedOutputPath of expectedOutputPaths) {
            expect(assetLockError.message).toContain(expectedOutputPath);
          }

          return;
        }

        throw assetLockError;
      }

      throw new Error(
        `Expected asset lock parsing to fail for ${assetLockContents}.`,
      );
    },
  );

  it("rejects a corrupted existing lock before requesting assets or creating staging", async () => {
    const targetDirectory = await createTargetDirectory();
    const fetchRequestCounter = { count: 0 };

    try {
      await writeFile(
        join(targetDirectory, "asset-lock.json"),
        JSON.stringify({
          assets: [
            {
              sourceUrl: validXmlSourceAsset.sourceUrl,
              outputPath: validXmlSourceAsset.outputPath,
              mediaType: validXmlSourceAsset.mediaType,
              sha256: "not-a-sha256-hash",
            },
          ],
        }),
      );

      await expect(
        synchronizeAssets(
          [validJsonSourceAsset],
          createFailingFetchImplementation(fetchRequestCounter),
          targetDirectory,
        ),
      ).rejects.toThrow("not-a-sha256-hash");

      expect(fetchRequestCounter.count).toBe(0);
      await expectNoStagingOrBackupDirectories(targetDirectory);
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("rejects an existing lock with data/Crops.json and data//Crops.json before requesting assets", async () => {
    const targetDirectory = await createTargetDirectory();
    const fetchRequestCounter = { count: 0 };

    try {
      await writeFile(
        join(targetDirectory, "asset-lock.json"),
        JSON.stringify({
          assets: [
            {
              sourceUrl: validJsonSourceAsset.sourceUrl,
              outputPath: "data/Crops.json",
              mediaType: "application/json",
              sha256:
                "d1d57f9b39af9791f24a1f210b93eb19b014735a245295fa84abee2ef99c2966",
            },
            {
              sourceUrl: validJsonSourceAsset.sourceUrl,
              outputPath: "data//Crops.json",
              mediaType: "application/json",
              sha256:
                "d1d57f9b39af9791f24a1f210b93eb19b014735a245295fa84abee2ef99c2966",
            },
          ],
        }),
      );

      await expect(
        synchronizeAssets(
          [validJsonSourceAsset],
          createFailingFetchImplementation(fetchRequestCounter),
          targetDirectory,
        ),
      ).rejects.toThrow("data//Crops.json");

      expect(fetchRequestCounter.count).toBe(0);
      await expectNoStagingOrBackupDirectories(targetDirectory);
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("rejects an unlocked existing file before requesting assets and preserves the published target", async () => {
    const targetDirectory = await createTargetDirectory();
    const fetchRequestCounter = { count: 0 };
    const unlockedExistingFilePath = join(
      targetDirectory,
      "unlocked-existing-file.txt",
    );

    try {
      await mkdir(join(targetDirectory, "data"), { recursive: true });
      await writeFile(
        join(targetDirectory, validJsonSourceAsset.outputPath),
        '{"spring":28}',
      );
      await writeFile(join(targetDirectory, "asset-lock.json"), validJsonAssetLock);
      await writeFile(unlockedExistingFilePath, "must remain unchanged");

      await expect(
        synchronizeAssets(
          [validJsonSourceAsset],
          createFailingFetchImplementation(fetchRequestCounter),
          targetDirectory,
        ),
      ).rejects.toThrow("unlocked-existing-file.txt");

      expect(fetchRequestCounter.count).toBe(0);
      expect(await readTextFile(unlockedExistingFilePath)).toBe(
        "must remain unchanged",
      );
      await expectNoStagingOrBackupDirectories(targetDirectory);
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("rejects a FIFO locked asset before staging or requests and preserves the published target", async () => {
    const targetDirectory = await createTargetDirectory();
    const fetchRequestCounter = { count: 0 };
    const fifoAssetPath = join(
      targetDirectory,
      validJsonSourceAsset.outputPath,
    );

    try {
      await mkdir(dirname(fifoAssetPath), { recursive: true });
      await executeFile("mkfifo", [fifoAssetPath]);
      await writeFile(join(targetDirectory, "asset-lock.json"), validJsonAssetLock);

      await expect(
        synchronizeAssets(
          [validJsonSourceAsset],
          createFailingFetchImplementation(fetchRequestCounter),
          targetDirectory,
        ),
      ).rejects.toThrow(fifoAssetPath);

      expect(fetchRequestCounter.count).toBe(0);
      expect((await lstat(fifoAssetPath)).isFIFO()).toBe(true);
      expect(await readTextFile(join(targetDirectory, "asset-lock.json"))).toBe(
        validJsonAssetLock,
      );
      await expectNoStagingOrBackupDirectories(targetDirectory);
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("rejects an existing lock entry whose physical asset is missing before requesting assets", async () => {
    const targetDirectory = await createTargetDirectory();
    const fetchRequestCounter = { count: 0 };

    try {
      await writeFile(join(targetDirectory, "asset-lock.json"), validJsonAssetLock);

      await expect(
        synchronizeAssets(
          [validJsonSourceAsset],
          createFailingFetchImplementation(fetchRequestCounter),
          targetDirectory,
        ),
      ).rejects.toThrow(validJsonSourceAsset.outputPath);

      expect(fetchRequestCounter.count).toBe(0);
      expect(await readTextFile(join(targetDirectory, "asset-lock.json"))).toBe(
        validJsonAssetLock,
      );
      await expectNoStagingOrBackupDirectories(targetDirectory);
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("rejects an internal symbolic link before requesting assets", async () => {
    const targetDirectory = await createTargetDirectory();
    const fetchRequestCounter = { count: 0 };
    const linkedExistingFilePath = join(
      targetDirectory,
      "linked-existing-file.txt",
    );

    try {
      await mkdir(join(targetDirectory, "data"), { recursive: true });
      await writeFile(
        join(targetDirectory, validJsonSourceAsset.outputPath),
        '{"spring":28}',
      );
      await writeFile(join(targetDirectory, "asset-lock.json"), validJsonAssetLock);
      await symlink(
        join(targetDirectory, validJsonSourceAsset.outputPath),
        linkedExistingFilePath,
      );

      await expect(
        synchronizeAssets(
          [validJsonSourceAsset],
          createFailingFetchImplementation(fetchRequestCounter),
          targetDirectory,
        ),
      ).rejects.toThrow("linked-existing-file.txt");

      expect(fetchRequestCounter.count).toBe(0);
      await expectNoStagingOrBackupDirectories(targetDirectory);
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("rejects removing an existing locked output path before requesting assets", async () => {
    const targetDirectory = await createTargetDirectory();
    const fetchRequestCounter = { count: 0 };

    try {
      await mkdir(join(targetDirectory, "maps"), { recursive: true });
      await writeFile(join(targetDirectory, "maps", "Old.tmx"), "old map");
      await writeFile(join(targetDirectory, "asset-lock.json"), validExistingAssetLock);

      await expect(
        synchronizeAssets(
          [validJsonSourceAsset],
          createFailingFetchImplementation(fetchRequestCounter),
          targetDirectory,
        ),
      ).rejects.toThrow("maps/Old.tmx");

      expect(fetchRequestCounter.count).toBe(0);
      expect(await readTextFile(join(targetDirectory, "maps", "Old.tmx"))).toBe(
        "old map",
      );
      await expectNoStagingOrBackupDirectories(targetDirectory);
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("rejects a symbolic-link target ancestor before creating staging or writing outside", async () => {
    const workspaceDirectory = await createTargetDirectory();
    const outsideDirectory = await createTargetDirectory();
    const linkedAncestorDirectory = join(workspaceDirectory, "linked-assets");
    const targetDirectory = join(linkedAncestorDirectory, "published-assets");
    const fetchRequestCounter = { count: 0 };

    try {
      await symlink(outsideDirectory, linkedAncestorDirectory);

      await expect(
        synchronizeAssets(
          [validJsonSourceAsset],
          createFailingFetchImplementation(fetchRequestCounter),
          targetDirectory,
        ),
      ).rejects.toThrow(linkedAncestorDirectory);

      expect(fetchRequestCounter.count).toBe(0);
      expect(await readdir(outsideDirectory)).toEqual([]);
    } finally {
      await removeTargetDirectory(workspaceDirectory);
      await removeTargetDirectory(outsideDirectory);
    }
  });

  it("rejects a target file before creating staging or requesting assets", async () => {
    const workspaceDirectory = await createTargetDirectory();
    const targetDirectory = join(workspaceDirectory, "published-assets");
    const fetchRequestCounter = { count: 0 };

    try {
      await writeFile(targetDirectory, "not a directory");

      await expect(
        synchronizeAssets(
          [validJsonSourceAsset],
          createFailingFetchImplementation(fetchRequestCounter),
          targetDirectory,
        ),
      ).rejects.toThrow(targetDirectory);

      expect(fetchRequestCounter.count).toBe(0);
    } finally {
      await removeTargetDirectory(workspaceDirectory);
    }
  });

  it("preserves an existing published target after a candidate validation failure", async () => {
    const targetDirectory = await createTargetDirectory();

    try {
      await mkdir(join(targetDirectory, "data"), { recursive: true });
      await writeFile(
        join(targetDirectory, validJsonSourceAsset.outputPath),
        '{"spring":28}',
      );
      await writeFile(join(targetDirectory, "asset-lock.json"), validJsonAssetLock);

      await expect(
        synchronizeAssets(
          [validJsonSourceAsset],
          createFetchImplementation({
            body: new TextEncoder().encode('{"spring":'),
            contentType: "application/json",
            url: validJsonSourceAsset.sourceUrl,
          }),
          targetDirectory,
        ),
      ).rejects.toThrow("spring");

      expect(
        await readTextFile(join(targetDirectory, validJsonSourceAsset.outputPath)),
      ).toBe(
        '{"spring":28}',
      );
      expect(await readTextFile(join(targetDirectory, "asset-lock.json"))).toBe(
        validJsonAssetLock,
      );
      await expectNoStagingOrBackupDirectories(targetDirectory);
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });

  it("restores the published target and cleans staging after a replacement failure", async () => {
    const targetDirectory = await createTargetDirectory();
    const replacementFailure = new Error("Simulated replacement failure.");
    let renameCallCount = 0;

    try {
      await mkdir(join(targetDirectory, "data"), { recursive: true });
      await writeFile(join(targetDirectory, "data", "Crops.json"), "old crops");
      await writeFile(
        join(targetDirectory, "asset-lock.json"),
        JSON.stringify({
          assets: [
            {
              sourceUrl: validJsonSourceAsset.sourceUrl,
              outputPath: validJsonSourceAsset.outputPath,
              mediaType: validJsonSourceAsset.mediaType,
              sha256:
                "d1d57f9b39af9791f24a1f210b93eb19b014735a245295fa84abee2ef99c2966",
            },
          ],
        }),
      );

      await expect(
        synchronizeAssets(
          [validJsonSourceAsset],
          createFetchImplementation({
            body: new TextEncoder().encode('{"spring":28}'),
            contentType: "application/json",
            url: validJsonSourceAsset.sourceUrl,
          }),
          targetDirectory,
          {
            renameDirectory: async (sourceDirectory, destinationDirectory) => {
              renameCallCount += 1;

              if (renameCallCount === 2) {
                throw replacementFailure;
              }

              await rename(sourceDirectory, destinationDirectory);
            },
          },
        ),
      ).rejects.toThrow("restored");

      expect(await readTextFile(join(targetDirectory, "data", "Crops.json"))).toBe(
        "old crops",
      );
      expect(renameCallCount).toBe(3);
      await expectNoStagingOrBackupDirectories(targetDirectory);
    } finally {
      await removeTargetDirectory(targetDirectory);
    }
  });
});
