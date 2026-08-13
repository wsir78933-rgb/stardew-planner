import type { PlacementRenderFrame } from "./placement-rendering";

type FireRenderFrame = Exclude<PlacementRenderFrame, null>;

export const fireAnimationFrames: readonly FireRenderFrame[] = [0, 1, 2, 3]
  .map((frameIndex) => ({
    x: 276 + frameIndex * 12,
    y: 1985,
    width: 12,
    height: 11,
  }));

export const fireGlowFrame: FireRenderFrame = {
  x: 88,
  y: 1779,
  width: 30,
  height: 30,
};

export function resolveFireAnimationTimeOffset(x: number, y: number): number {
  return ((x * 3047 + y * 88 + x * y * 31) ^ 1502) % 400;
}

export function resolveFireGlowPhaseOffset(x: number, y: number): number {
  return ((x * 777 + y * 9746 + x * y * 31) ^ 25214903917) % 3140;
}
