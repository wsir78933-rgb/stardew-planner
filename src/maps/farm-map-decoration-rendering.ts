import type {
  FarmMapDecorationPlan,
  FarmSpouseFrame,
} from "./farm-map-rendering";

type PixiModule = typeof import("pixi.js");
type PixiTexture = import("pixi.js").Texture;

const craftablesAssetPath = "/game-assets/1.6.15/tilesheets/craftables.png";

export type FarmMapDecorationRenderer = Readonly<{
  container: import("pixi.js").Container;
  animations: readonly Readonly<{
    update(currentTimeMilliseconds: number): boolean;
  }>[];
  destroy(): void;
}>;

export function createFarmMapDecorationRenderer(input: Readonly<{
  farmMapDecorationPlan: FarmMapDecorationPlan;
  pixi: PixiModule;
  texturesByAssetPath: ReadonlyMap<string, PixiTexture>;
  tileWidth: number;
  tileHeight: number;
}>): FarmMapDecorationRenderer {
  assertFarmMapDecorationRendererInput(input);
  const container = new input.pixi.Container();
  container.label = "farmMapDecorations";
  container.eventMode = "none";
  container.sortableChildren = true;
  const frameTextures: PixiTexture[] = [];
  const animations: Array<Readonly<{
    update(currentTimeMilliseconds: number): boolean;
  }>> = [];
  const sprites: import("pixi.js").Sprite[] = [];

  try {
    for (const farmCaveObject of input.farmMapDecorationPlan.caveObjects) {
      const craftablesTexture = getRequiredTexture(
        input.texturesByAssetPath,
        craftablesAssetPath,
      );
      const frameTexture = createBigCraftableFrameTexture(
        input.pixi,
        craftablesTexture,
        farmCaveObject.spriteIndex,
      );
      frameTextures.push(frameTexture);
      const sprite = new input.pixi.Sprite({ texture: frameTexture });
      sprite.label = `farmCaveObject:${farmCaveObject.catalogItemId}:${String(farmCaveObject.x)},${String(farmCaveObject.y)}`;
      sprite.position.set(
        farmCaveObject.x * input.tileWidth,
        farmCaveObject.y * input.tileHeight - input.tileHeight,
      );
      sprite.width = input.tileWidth;
      sprite.height = input.tileHeight * 2;
      sprite.zIndex = (farmCaveObject.y + 1) * input.tileHeight;
      sprites.push(sprite);
      container.addChild(sprite);
    }

    if (input.farmMapDecorationPlan.spouse !== null) {
      const spouseDecoration = input.farmMapDecorationPlan.spouse;
      const spouseTexture = getRequiredTexture(
        input.texturesByAssetPath,
        `/game-assets/1.6.15/${spouseDecoration.spriteAssetPath}`,
      );
      const spouseFrameTextures = createFarmSpouseFrameTextures(
        input.pixi,
        spouseTexture,
        spouseDecoration.frames,
      );
      frameTextures.push(...spouseFrameTextures.uniqueTextures);
      const spouseSprite = new input.pixi.Sprite({
        texture: spouseFrameTextures.frameTextures[0],
      });
      spouseSprite.label = `farmSpouse:${spouseDecoration.spouseId}`;
      spouseSprite.position.set(
        spouseDecoration.x * input.tileWidth + spouseDecoration.offset.x,
        (spouseDecoration.y + 1) * input.tileHeight - input.tileHeight * 2 +
          spouseDecoration.offset.y,
      );
      spouseSprite.width = input.tileWidth;
      spouseSprite.height = input.tileHeight * 2;
      spouseSprite.zIndex =
        (spouseDecoration.y + 1) * input.tileHeight * 4 - input.tileHeight * 2;
      sprites.push(spouseSprite);
      container.addChild(spouseSprite);
      animations.push(
        createFarmSpouseAnimation(
          spouseSprite,
          spouseFrameTextures.frameTextures,
          spouseDecoration.frames,
        ),
      );
    }
  } catch (caughtError) {
    for (const sprite of sprites) {
      sprite.destroy();
    }
    for (const frameTexture of frameTextures) {
      frameTexture.destroy();
    }
    container.destroy({ children: false });
    throw caughtError;
  }

  let hasBeenDestroyed = false;
  return {
    container,
    animations,
    destroy(): void {
      if (hasBeenDestroyed) {
        return;
      }
      hasBeenDestroyed = true;
      container.removeChildren();
      for (const sprite of sprites) {
        sprite.destroy();
      }
      for (const frameTexture of frameTextures) {
        frameTexture.destroy();
      }
      container.destroy({ children: false });
    },
  };
}

function createBigCraftableFrameTexture(
  pixi: PixiModule,
  craftablesTexture: PixiTexture,
  spriteIndex: number,
): PixiTexture {
  if (!Number.isSafeInteger(spriteIndex) || spriteIndex < 0) {
    throw new TypeError(
      `Farm cave big-craftable sprite index must be a non-negative safe integer; received ${String(spriteIndex)}.`,
    );
  }
  const frameX = (spriteIndex % 8) * 16;
  const frameY = Math.floor(spriteIndex / 8) * 32;
  assertTextureFrameFits(craftablesTexture, frameX, frameY, 16, 32, String(spriteIndex));
  return new pixi.Texture({
    frame: new pixi.Rectangle(frameX, frameY, 16, 32),
    source: craftablesTexture.source,
  });
}

function createFarmSpouseFrameTextures(
  pixi: PixiModule,
  spouseTexture: PixiTexture,
  frames: readonly FarmSpouseFrame[],
): Readonly<{
  frameTextures: readonly PixiTexture[];
  uniqueTextures: readonly PixiTexture[];
}> {
  if (!Array.isArray(frames) || frames.length === 0) {
    throw new TypeError(
      `Farm spouse animation frames must contain at least one frame; received ${String(frames.length)}.`,
    );
  }

  const textureByFrameIndex = new Map<number, PixiTexture>();
  for (const [frameIndex, durationMilliseconds] of frames) {
    if (!Number.isSafeInteger(frameIndex) || frameIndex < 0) {
      throw new TypeError(
        `Farm spouse frame index must be a non-negative safe integer; received ${String(frameIndex)}.`,
      );
    }
    if (!Number.isFinite(durationMilliseconds) || durationMilliseconds <= 0) {
      throw new TypeError(
        `Farm spouse frame ${String(frameIndex)} duration must be a positive finite number; received ${String(durationMilliseconds)}.`,
      );
    }
    if (!textureByFrameIndex.has(frameIndex)) {
      const frameX = (frameIndex % 4) * 16;
      const frameY = Math.floor(frameIndex / 4) * 32;
      assertTextureFrameFits(
        spouseTexture,
        frameX,
        frameY,
        16,
        32,
        String(frameIndex),
      );
      textureByFrameIndex.set(
        frameIndex,
        new pixi.Texture({
          frame: new pixi.Rectangle(frameX, frameY, 16, 32),
          source: spouseTexture.source,
        }),
      );
    }
  }

  return {
    frameTextures: frames.map(([frameIndex]) => {
      const frameTexture = textureByFrameIndex.get(frameIndex);
      if (frameTexture === undefined) {
        throw new Error(
          `Farm spouse frame texture ${String(frameIndex)} was not created from the local spouse sprite sheet.`,
        );
      }
      return frameTexture;
    }),
    uniqueTextures: [...textureByFrameIndex.values()],
  };
}

function createFarmSpouseAnimation(
  spouseSprite: import("pixi.js").Sprite,
  frameTextures: readonly PixiTexture[],
  frames: readonly FarmSpouseFrame[],
): Readonly<{ update(currentTimeMilliseconds: number): boolean }> {
  const animationDuration = frames.reduce(
    (totalMilliseconds, [, frameDuration]) => totalMilliseconds + frameDuration,
    0,
  );
  let animationStartedAt: number | null = null;
  let currentFrameIndex = 0;

  return {
    update(currentTimeMilliseconds): boolean {
      if (!Number.isFinite(currentTimeMilliseconds)) {
        throw new TypeError(
          `Farm spouse animation time must be finite; received ${String(currentTimeMilliseconds)}.`,
        );
      }
      animationStartedAt ??= currentTimeMilliseconds;
      let elapsedMilliseconds =
        (currentTimeMilliseconds - animationStartedAt) % animationDuration;
      let nextFrameIndex = 0;
      while (
        nextFrameIndex < frames.length - 1 &&
        elapsedMilliseconds >= frames[nextFrameIndex]![1]
      ) {
        elapsedMilliseconds -= frames[nextFrameIndex]![1];
        nextFrameIndex += 1;
      }

      if (currentFrameIndex === nextFrameIndex) {
        return false;
      }
      const nextFrameTexture = frameTextures[nextFrameIndex];
      if (nextFrameTexture === undefined) {
        throw new Error(
          `Farm spouse animation frame ${String(nextFrameIndex)} has no local texture.`,
        );
      }
      currentFrameIndex = nextFrameIndex;
      spouseSprite.texture = nextFrameTexture;
      return true;
    },
  };
}

function getRequiredTexture(
  texturesByAssetPath: ReadonlyMap<string, PixiTexture>,
  assetPath: string,
): PixiTexture {
  const texture = texturesByAssetPath.get(assetPath);
  if (texture === undefined) {
    throw new Error(
      `Farm map decoration requires local texture ${JSON.stringify(assetPath)}; received no loaded texture for that asset path.`,
    );
  }
  return texture;
}

function assertTextureFrameFits(
  texture: PixiTexture,
  x: number,
  y: number,
  width: number,
  height: number,
  frameLabel: string,
): void {
  const sourceWidth = texture.source.width;
  const sourceHeight = texture.source.height;
  if (
    x < 0 ||
    y < 0 ||
    x + width > sourceWidth ||
    y + height > sourceHeight
  ) {
    throw new RangeError(
      `Farm map decoration frame ${JSON.stringify(frameLabel)} at ${String(x)},${String(y)} size ${String(width)}x${String(height)} exceeds texture dimensions ${String(sourceWidth)}x${String(sourceHeight)}.`,
    );
  }
}

function assertFarmMapDecorationRendererInput(input: Readonly<{
  farmMapDecorationPlan: FarmMapDecorationPlan;
  pixi: PixiModule;
  texturesByAssetPath: ReadonlyMap<string, PixiTexture>;
  tileWidth: number;
  tileHeight: number;
}>): void {
  if (typeof input !== "object" || input === null) {
    throw new TypeError(
      `Farm map decoration renderer input must be an object; received ${String(input)}.`,
    );
  }
  if (!Number.isSafeInteger(input.tileWidth) || input.tileWidth <= 0) {
    throw new TypeError(
      `Farm map decoration tileWidth must be a positive safe integer; received ${String(input.tileWidth)}.`,
    );
  }
  if (!Number.isSafeInteger(input.tileHeight) || input.tileHeight <= 0) {
    throw new TypeError(
      `Farm map decoration tileHeight must be a positive safe integer; received ${String(input.tileHeight)}.`,
    );
  }
  if (
    typeof input.farmMapDecorationPlan !== "object" ||
    input.farmMapDecorationPlan === null ||
    !Array.isArray(input.farmMapDecorationPlan.caveObjects)
  ) {
    throw new TypeError(
      `Farm map decoration plan must contain a caveObjects array; received ${String(input.farmMapDecorationPlan)}.`,
    );
  }
  if (!(input.texturesByAssetPath instanceof Map)) {
    throw new TypeError(
      `Farm map decoration texturesByAssetPath must be a Map; received ${String(input.texturesByAssetPath)}.`,
    );
  }
}
