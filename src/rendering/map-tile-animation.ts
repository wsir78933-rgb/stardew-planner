import type { RenderingTileAnimation } from "./map-rendering-contract";

export type MapTileAnimationUpdate = Readonly<{
  update(currentTimeMilliseconds: number): boolean;
}>;

export function getMapTileAnimationFrameIndex(
  renderingTileAnimation: RenderingTileAnimation,
  currentTimeMilliseconds: number,
): number {
  validateRenderingTileAnimation(renderingTileAnimation);
  validateCurrentTime(currentTimeMilliseconds);
  return getMapTileAnimationFrameIndexUnchecked(
    renderingTileAnimation,
    currentTimeMilliseconds,
  );
}

export function createMapTileAnimationUpdate(
  renderingTileAnimation: RenderingTileAnimation,
  applyFrame: (frameIndex: number) => void,
  mapId: string,
  tileGid: number,
): MapTileAnimationUpdate {
  validateRenderingTileAnimation(renderingTileAnimation);
  validateApplyFrame(applyFrame, mapId, tileGid);

  let currentFrameIndex = 0;
  let currentFrameGid = renderingTileAnimation.frames[0]?.gid;

  return {
    update(currentTimeMilliseconds): boolean {
      validateCurrentTime(currentTimeMilliseconds, mapId, tileGid);

      const nextFrameIndex = getMapTileAnimationFrameIndexUnchecked(
        renderingTileAnimation,
        currentTimeMilliseconds,
      );
      if (nextFrameIndex === currentFrameIndex) {
        return false;
      }

      const nextFrameGid = renderingTileAnimation.frames[nextFrameIndex]?.gid;
      if (nextFrameGid === undefined) {
        throw new Error(
          `Map tile animation frame ${nextFrameIndex} is unavailable for GID ${tileGid} in mapId ${JSON.stringify(mapId)}.`,
        );
      }

      currentFrameIndex = nextFrameIndex;
      if (nextFrameGid === currentFrameGid) {
        return false;
      }

      applyFrame(nextFrameIndex);
      currentFrameGid = nextFrameGid;
      return true;
    },
  };
}

function validateRenderingTileAnimation(
  renderingTileAnimation: RenderingTileAnimation,
): void {
  if (
    typeof renderingTileAnimation !== "object" ||
    renderingTileAnimation === null ||
    !Array.isArray(renderingTileAnimation.frames) ||
    renderingTileAnimation.frames.length === 0
  ) {
    throw new TypeError(
      `Map tile animation must contain a non-empty frame array; received ${String(renderingTileAnimation)}.`,
    );
  }

  let totalDurationMilliseconds = 0;
  for (const [frameIndex, frame] of renderingTileAnimation.frames.entries()) {
    if (
      typeof frame !== "object" ||
      frame === null ||
      !Number.isSafeInteger(frame.gid) ||
      frame.gid <= 0 ||
      !Number.isSafeInteger(frame.durationMilliseconds) ||
      frame.durationMilliseconds <= 0
    ) {
      throw new TypeError(
        `Map tile animation frame ${frameIndex} must have a positive GID and duration; received ${describeValue(frame)}.`,
      );
    }

    totalDurationMilliseconds += frame.durationMilliseconds;
  }

  if (
    !Number.isSafeInteger(renderingTileAnimation.durationMilliseconds) ||
    renderingTileAnimation.durationMilliseconds <= 0 ||
    totalDurationMilliseconds !== renderingTileAnimation.durationMilliseconds
  ) {
    throw new RangeError(
      `Map tile animation total duration ${renderingTileAnimation.durationMilliseconds}ms does not match its frames (${totalDurationMilliseconds}ms).`,
    );
  }
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  try {
    const serializedValue = JSON.stringify(value);
    if (serializedValue !== undefined) {
      return serializedValue;
    }
  } catch {
    // Fall through for values such as circular objects.
  }

  return String(value);
}

function validateApplyFrame(
  applyFrame: (frameIndex: number) => void,
  mapId: string,
  tileGid: number,
): void {
  if (typeof applyFrame !== "function") {
    throw new TypeError(
      `Map tile animation frame callback must be a function for GID ${tileGid} in mapId ${JSON.stringify(mapId)}; received ${String(applyFrame)}.`,
    );
  }
  if (typeof mapId !== "string" || mapId.length === 0) {
    throw new TypeError(
      `Map tile animation mapId must be a non-empty string; received ${String(mapId)}.`,
    );
  }
  if (!Number.isSafeInteger(tileGid) || tileGid <= 0) {
    throw new TypeError(
      `Map tile animation tileGid must be a positive safe integer; received ${String(tileGid)}.`,
    );
  }
}

function validateCurrentTime(
  currentTimeMilliseconds: number,
  mapId?: string,
  tileGid?: number,
): void {
  if (!Number.isFinite(currentTimeMilliseconds) || currentTimeMilliseconds < 0) {
    const animationContext = mapId === undefined || tileGid === undefined
      ? ""
      : ` for GID ${tileGid} in mapId ${JSON.stringify(mapId)}`;
    throw new TypeError(
      `Map tile animation time${animationContext} must be a finite non-negative number of milliseconds; received ${String(currentTimeMilliseconds)}.`,
    );
  }
}

function getMapTileAnimationFrameIndexUnchecked(
  renderingTileAnimation: RenderingTileAnimation,
  currentTimeMilliseconds: number,
): number {
  let elapsedMilliseconds = currentTimeMilliseconds % renderingTileAnimation.durationMilliseconds;
  for (const [frameIndex, frame] of renderingTileAnimation.frames.entries()) {
    if (elapsedMilliseconds < frame.durationMilliseconds) {
      return frameIndex;
    }

    elapsedMilliseconds -= frame.durationMilliseconds;
  }

  throw new Error(
    `Map tile animation timeline did not resolve a frame at ${currentTimeMilliseconds}ms for duration ${renderingTileAnimation.durationMilliseconds}ms.`,
  );
}
