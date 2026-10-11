import { describe, expect, it } from "vitest";
import {
  createFarmCaveObjects,
  createFarmMapDecorationPlan,
  getFarmSpousePatioTarget,
  supportsFarmCaveChoice,
  supportsFarmSpousePatio,
  type FarmMapDecorationPlan,
} from "../../src/maps/farm-map-rendering";
import { createFarmMapDecorationRenderer } from "../../src/maps/farm-map-decoration-rendering";
import type { TmxMap } from "../../src/tmx/tmx-types";

class TestRectangle {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly width: number,
    public readonly height: number,
  ) {}
}

class TestTexture {
  readonly destroyed = false;
  readonly height: number;
  readonly source: Readonly<{ width: number; height: number }>;
  readonly width: number;

  constructor(options: Readonly<{ frame?: TestRectangle; source: TestTexture["source"] }>) {
    this.source = options.source;
    this.width = options.frame?.width ?? options.source.width;
    this.height = options.frame?.height ?? options.source.height;
  }

  destroy(): void {}
}

class TestSprite {
  destroyed = false;
  height = 0;
  label = "";
  positionCoordinates: readonly number[] = [];
  texture: TestTexture;
  width = 0;
  zIndex = 0;
  position = {
    set: (...coordinates: number[]) => {
      this.positionCoordinates = coordinates;
    },
  };

  constructor(options: Readonly<{ texture: TestTexture }>) {
    this.texture = options.texture;
  }

  destroy(): void {
    this.destroyed = true;
  }
}

class TestContainer {
  children: TestSprite[] = [];
  destroyed = false;
  eventMode = "auto";
  label = "";
  sortableChildren = false;

  addChild(sprite: TestSprite): void {
    this.children.push(sprite);
  }

  removeChildren(): TestSprite[] {
    const children = this.children;
    this.children = [];
    return children;
  }

  destroy(): void {
    this.destroyed = true;
  }
}

const testPixi = {
  Container: TestContainer,
  Rectangle: TestRectangle,
  Sprite: TestSprite,
  Texture: TestTexture,
} as unknown as typeof import("pixi.js");

const emptyMap: TmxMap = {
  width: 80,
  height: 65,
  tileWidth: 16,
  tileHeight: 16,
  properties: {},
  tilesets: [],
  tileLayers: [],
  objectLayers: [],
  tileDataProperties: new Map(),
};

describe("farm map rendering options", () => {
  it("exposes spouse patio and cave settings only for maps with real rendering support", () => {
    expect(supportsFarmSpousePatio("standard")).toBe(true);
    expect(supportsFarmSpousePatio("ginger-island")).toBe(false);
    expect(supportsFarmSpousePatio("farm-cave")).toBe(false);
    expect(supportsFarmCaveChoice("standard")).toBe(true);
    expect(supportsFarmCaveChoice("farm-cave")).toBe(true);
    expect(supportsFarmCaveChoice("ginger-island")).toBe(false);
    expect(supportsFarmCaveChoice("slime-hutch")).toBe(false);
    expect(() => supportsFarmSpousePatio("unknown-map")).toThrow();
  });

  it("uses the real standard-farm spouse patio and NPC coordinates", () => {
    const plan = createFarmMapDecorationPlan({
      mapId: "standard",
      parsedMap: emptyMap,
      spouseId: "Abigail",
      caveChoice: "none",
    });

    expect(plan.spouse).toEqual({
      spouseId: "Abigail",
      spriteAssetPath: "sprites/Abigail.png",
      x: 71,
      y: 8,
      offset: { x: 0, y: 0 },
      frames: [[16, 500], [17, 500], [18, 500], [19, 500]],
    });
    expect(plan.caveObjects).toEqual([]);
  });

  it("reads the map's SpouseAreaLocation and rejects a patio that exceeds map bounds", () => {
    expect(getFarmSpousePatioTarget({
      ...emptyMap,
      properties: { SpouseAreaLocation: "12 7" },
    })).toEqual({ x: 12, y: 7 });
    expect(() => getFarmSpousePatioTarget({
      ...emptyMap,
      properties: { SpouseAreaLocation: "78 63" },
    })).toThrow('does not fit a 4x4 patio in map dimensions 80x65');
    expect(() => getFarmSpousePatioTarget({
      ...emptyMap,
      properties: { SpouseAreaLocation: "left 7" },
    })).toThrow('must contain two non-negative integer coordinates; received "left 7"');
  });

  it("creates the competitor's exact six mushroom boxes and dehydrator only for mushrooms", () => {
    const mushroomObjects = createFarmCaveObjects("mushrooms");

    expect(mushroomObjects).toEqual([
      { catalogItemId: "big-craftable:128", spriteIndex: 128, x: 4, y: 5 },
      { catalogItemId: "big-craftable:128", spriteIndex: 128, x: 6, y: 5 },
      { catalogItemId: "big-craftable:128", spriteIndex: 128, x: 8, y: 5 },
      { catalogItemId: "big-craftable:128", spriteIndex: 128, x: 4, y: 7 },
      { catalogItemId: "big-craftable:128", spriteIndex: 128, x: 6, y: 7 },
      { catalogItemId: "big-craftable:128", spriteIndex: 128, x: 8, y: 7 },
      { catalogItemId: "big-craftable:Dehydrator", spriteIndex: 286, x: 10, y: 5 },
    ]);
    expect(createFarmCaveObjects("none")).toEqual([]);
    expect(createFarmCaveObjects("bats")).toEqual([]);
  });

  it("renders spouse and mushroom assets through loaded local sprite sheets", () => {
    const spousePlan = createFarmMapDecorationPlan({
      mapId: "standard",
      parsedMap: emptyMap,
      spouseId: "Abigail",
      caveChoice: "none",
    });
    const spouseSpriteSheet = createTestTexture(128, 512);
    const spouseRenderer = createFarmMapDecorationRenderer({
      farmMapDecorationPlan: spousePlan,
      pixi: testPixi,
      texturesByAssetPath: new Map([
        ["/game-assets/1.6.15/sprites/Abigail.png", spouseSpriteSheet],
      ]) as unknown as ReadonlyMap<string, import("pixi.js").Texture>,
      tileWidth: 16,
      tileHeight: 16,
    });
    const spouseSprite = (spouseRenderer.container as unknown as TestContainer)
      .children[0]!;

    expect(spouseSprite.label).toBe("farmSpouse:Abigail");
    expect(spouseSprite.positionCoordinates).toEqual([1136, 112]);
    expect(spouseRenderer.animations[0]?.update(1000)).toBe(false);
    expect(spouseRenderer.animations[0]?.update(1500)).toBe(true);
    expect(spouseSprite.texture.width).toBe(16);

    const cavePlan: FarmMapDecorationPlan = {
      spouse: null,
      caveObjects: createFarmCaveObjects("mushrooms"),
    };
    const craftablesTexture = createTestTexture(128, 1280);
    const caveRenderer = createFarmMapDecorationRenderer({
      farmMapDecorationPlan: cavePlan,
      pixi: testPixi,
      texturesByAssetPath: new Map([
        ["/game-assets/1.6.15/tilesheets/craftables.png", craftablesTexture],
      ]) as unknown as ReadonlyMap<string, import("pixi.js").Texture>,
      tileWidth: 16,
      tileHeight: 16,
    });

    expect((caveRenderer.container as unknown as TestContainer).children).toHaveLength(7);
    expect((caveRenderer.container as unknown as TestContainer).children.map(
      (sprite) => sprite.label,
    )).toContain("farmCaveObject:big-craftable:Dehydrator:10,5");
    expect((caveRenderer.container as unknown as TestContainer).children[0]!.positionCoordinates)
      .toEqual([64, 64]);
    spouseRenderer.destroy();
    caveRenderer.destroy();
  });
});

function createTestTexture(width: number, height: number): TestTexture {
  return new TestTexture({ source: { width, height } });
}
