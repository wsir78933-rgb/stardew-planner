import { describe, expect, it, vi } from "vitest";
import {
  createPlacementAnimationController,
  createPlacementSprite,
  destroyPlacementSprites,
} from "../../src/components/planner-canvas";
import type { PlacementRenderEntry } from "../../src/rendering/placement-rendering";

class TestRectangle {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly width: number,
    public readonly height: number,
  ) {}
}

class TestTexture {
  destroyed = false;
  readonly frame: TestRectangle | undefined;
  readonly height: number;
  readonly source: unknown;
  readonly width: number;

  constructor(options: Readonly<{ frame?: TestRectangle; source: unknown }>) {
    this.frame = options.frame;
    this.height = options.frame?.height ?? 2048;
    this.source = options.source;
    this.width = options.frame?.width ?? 704;
  }

  destroy(): void {
    this.destroyed = true;
  }
}

class TestSprite {
  alpha = 1;
  anchorCoordinates: number[] = [];
  destroyed = false;
  positionCoordinates: number[] = [];
  rotation = 0;
  scaleCoordinates: number[] = [];
  texture: TestTexture;
  tint = 0xffffff;
  anchor = {
    set: (...coordinates: number[]) => {
      this.anchorCoordinates = coordinates;
    },
  };
  position = {
    set: (...coordinates: number[]) => {
      this.positionCoordinates = coordinates;
    },
  };
  scale = {
    x: 1,
    y: 1,
    set: (...coordinates: number[]) => {
      this.scaleCoordinates = coordinates;
      this.scale.x = coordinates[0] ?? 1;
      this.scale.y = coordinates[1] ?? coordinates[0] ?? 1;
    },
  };

  constructor(options: Readonly<{ texture: TestTexture }>) {
    this.texture = options.texture;
  }

  destroy(): void {
    this.destroyed = true;
  }
}

const testPixi = {
  Rectangle: TestRectangle,
  Sprite: TestSprite,
  Texture: TestTexture,
} as unknown as typeof import("pixi.js");

const cursorTexture = {
  source: { localPath: "/game-assets/1.6.15/sprites/Cursors.png" },
} as unknown as import("pixi.js").Texture;

function createAnimatedRenderEntry(
  animation: PlacementRenderEntry["animation"],
  overrides: Partial<PlacementRenderEntry> = {},
): PlacementRenderEntry {
  return {
    animation,
    catalogItem: {
      allowedTools: ["cursor"],
      category: "placeable",
      id: "big-craftable:146",
      name: "Campfire",
      sprite: { kind: "sprite-index", index: 146 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/craftables.png",
      tileSize: { width: 1, height: 1 },
    },
    effectiveFootprint: { width: 1, height: 1 },
    frame: { x: 276, y: 1985, width: 12, height: 11 },
    key: "item:12",
    pixelGeometry: {
      anchorX: 0,
      anchorY: 0,
      horizontalScale: 1,
      positionX: 35,
      positionY: 46,
      uniformScale: 0.75,
    },
    rotationQuarterTurns: 0,
    shouldApplySelectionTint: true,
    textureLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
    tileX: 2,
    tileY: 3,
    ...overrides,
  };
}

const flameFrames = [0, 1, 2, 3].map((frameIndex) => ({
  x: 276 + frameIndex * 12,
  y: 1985,
  width: 12,
  height: 11,
}));

describe("PlannerCanvas placement animation", () => {
  it("cycles exact 100ms frames from the frozen position hash and destroys every owned frame", () => {
    const placementSprite = createPlacementSprite(
      testPixi,
      createAnimatedRenderEntry({
        frameDurationMilliseconds: 100,
        frames: flameFrames,
        kind: "frame-cycle",
        timeOffsetMilliseconds: 46,
      }, { tintColor: "#123456" }),
      cursorTexture,
      null,
      16,
      16,
      false,
    );
    const sprite = placementSprite.sprite as unknown as TestSprite;

    expect(sprite.positionCoordinates).toEqual([35, 46]);
    expect(sprite.scaleCoordinates).toEqual([0.75]);
    expect(sprite.tint).toBe(0x123456);
    expect(placementSprite.animation?.update(53)).toBe(false);
    expect((sprite.texture.frame as TestRectangle).x).toBe(276);
    expect(placementSprite.animation?.update(54)).toBe(true);
    expect((sprite.texture.frame as TestRectangle).x).toBe(288);
    expect(placementSprite.animation?.update(154)).toBe(true);
    expect((sprite.texture.frame as TestRectangle).x).toBe(300);

    const ownedFrameTextures = [
      placementSprite.frameTexture,
      ...placementSprite.animationFrameTextures,
    ] as unknown as TestTexture[];
    expect(ownedFrameTextures).toHaveLength(4);
    destroyPlacementSprites([placementSprite]);
    expect(sprite.destroyed).toBe(true);
    expect(ownedFrameTextures.every((frameTexture) => frameTexture.destroyed))
      .toBe(true);
  });

  it("applies exact glow opacity, pulse formula, and selection tint", () => {
    const glowRenderEntry = createAnimatedRenderEntry({
      baseScale: 0.6,
      kind: "scale-pulse",
      phaseOffsetMilliseconds: -1533,
      pulseAmplitude: 0.2,
      timeDivisorMilliseconds: 1000,
      timeModuloMilliseconds: 3140,
    }, {
      frame: { x: 88, y: 1779, width: 30, height: 30 },
      opacity: 0.35,
      pixelGeometry: {
        anchorX: 0.5,
        anchorY: 0.5,
        horizontalScale: 1,
        positionX: 40,
        positionY: 48,
        uniformScale: 0.6,
      },
      tintColor: "#eee8aa",
    });
    const unselectedPlacementSprite = createPlacementSprite(
      testPixi,
      glowRenderEntry,
      cursorTexture,
      null,
      16,
      16,
      false,
    );
    const selectedPlacementSprite = createPlacementSprite(
      testPixi,
      glowRenderEntry,
      cursorTexture,
      null,
      16,
      16,
      true,
    );
    const unselectedSprite =
      unselectedPlacementSprite.sprite as unknown as TestSprite;
    const selectedSprite = selectedPlacementSprite.sprite as unknown as TestSprite;
    const expectedPulseScale =
      0.6 + Math.sin(((1000 - 1533) % 3140) / 1000) * 0.2;

    expect(unselectedSprite.alpha).toBe(0.35);
    expect(unselectedSprite.tint).toBe(0xeee8aa);
    expect(selectedSprite.tint).toBe(0xffdf4a);
    expect(unselectedPlacementSprite.animation?.update(1000)).toBe(true);
    expect(unselectedSprite.scaleCoordinates[0]).toBeCloseTo(
      expectedPulseScale,
      12,
    );
    expect(unselectedPlacementSprite.animation?.update(1000)).toBe(false);

    destroyPlacementSprites([
      unselectedPlacementSprite,
      selectedPlacementSprite,
    ]);
  });

  it("uses no timer for static entries and one shared 100ms timer for every animation", () => {
    vi.useFakeTimers();
    let currentTimeMilliseconds = 1000;
    const performanceNowSpy = vi.spyOn(performance, "now").mockImplementation(
      () => currentTimeMilliseconds,
    );
    const render = vi.fn();
    const firstAnimation = { update: vi.fn(() => true) };
    const secondAnimation = { update: vi.fn(() => false) };
    const animationController = createPlacementAnimationController(render);

    try {
      animationController.replaceAnimations([]);
      expect(vi.getTimerCount()).toBe(0);

      animationController.replaceAnimations([
        firstAnimation,
        secondAnimation,
        firstAnimation,
        secondAnimation,
      ]);
      expect(vi.getTimerCount()).toBe(1);
      vi.advanceTimersByTime(100);
      expect(firstAnimation.update).toHaveBeenCalledWith(1000);
      expect(secondAnimation.update).toHaveBeenCalledWith(1000);
      expect(render).toHaveBeenCalledTimes(1);

      firstAnimation.update.mockReturnValue(false);
      currentTimeMilliseconds = 1100;
      vi.advanceTimersByTime(100);
      expect(render).toHaveBeenCalledTimes(1);

      animationController.replaceAnimations([firstAnimation]);
      expect(vi.getTimerCount()).toBe(1);
      animationController.replaceAnimations([]);
      expect(vi.getTimerCount()).toBe(0);
      animationController.replaceAnimations([secondAnimation]);
      expect(vi.getTimerCount()).toBe(1);
      animationController.dispose();
      animationController.dispose();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      animationController.dispose();
      performanceNowSpy.mockRestore();
      vi.useRealTimers();
    }
  });

  it("rejects an invalid animation descriptor before Pixi allocation", () => {
    let frameTextureAllocationCount = 0;
    let spriteAllocationCount = 0;
    const allocationTrackingPixi = {
      Rectangle: TestRectangle,
      Sprite: class extends TestSprite {
        constructor(options: Readonly<{ texture: TestTexture }>) {
          super(options);
          spriteAllocationCount += 1;
        }
      },
      Texture: class extends TestTexture {
        constructor(options: Readonly<{ frame?: TestRectangle; source: unknown }>) {
          super(options);
          frameTextureAllocationCount += 1;
        }
      },
    } as unknown as typeof import("pixi.js");

    expect(() => createPlacementSprite(
      allocationTrackingPixi,
      createAnimatedRenderEntry({
        frameDurationMilliseconds: 0,
        frames: flameFrames,
        kind: "frame-cycle",
        timeOffsetMilliseconds: 46,
      }),
      cursorTexture,
      null,
      16,
      16,
      false,
    )).toThrow(
      'Placement render entry "item:12" frame-cycle duration must be a positive finite number; received 0.',
    );
    expect(frameTextureAllocationCount).toBe(0);
    expect(spriteAllocationCount).toBe(0);

    expect(() => createPlacementSprite(
      allocationTrackingPixi,
      createAnimatedRenderEntry({
        frameDurationMilliseconds: 100,
        frames: [{}],
        kind: "frame-cycle",
        timeOffsetMilliseconds: 46,
      } as unknown as NonNullable<PlacementRenderEntry["animation"]>),
      cursorTexture,
      null,
      16,
      16,
      false,
    )).toThrow(
      'Placement render entry "item:12" frame-cycle frame 0 must contain non-negative integer x/y and positive integer width/height; received {}.',
    );
    expect(frameTextureAllocationCount).toBe(0);
    expect(spriteAllocationCount).toBe(0);
  });
});
