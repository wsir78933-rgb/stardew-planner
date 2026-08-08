import { resolveInitialPlannerTextureAssetPath } from "./initial-planner-texture-path";

export type PlannerTextureFrame = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type ResolvedPlannerTextureFrame = Readonly<{
  resolvedAssetPath: string;
  resolvedFrame: PlannerTextureFrame | null;
}>;

const cursorLockedTexturePath = "/game-assets/1.6.15/sprites/Cursors.png";
const startupCursorAtlasAssetPath = "/planner-textures/initial/Cursors-startup.webp";

const startupCursorFrameByLockedFrameKey = new Map<string, PlannerTextureFrame>([
  [
    createFrameKey(cursorLockedTexturePath, { x: 134, y: 226, width: 30, height: 25 }),
    { x: 0, y: 0, width: 30, height: 25 },
  ],
  [
    createFrameKey(cursorLockedTexturePath, { x: 656, y: 394, width: 16, height: 16 }),
    { x: 30, y: 0, width: 16, height: 16 },
  ],
  [
    createFrameKey(cursorLockedTexturePath, { x: 672, y: 394, width: 16, height: 16 }),
    { x: 46, y: 0, width: 16, height: 16 },
  ],
  [
    createFrameKey(cursorLockedTexturePath, { x: 688, y: 394, width: 16, height: 16 }),
    { x: 62, y: 0, width: 16, height: 16 },
  ],
]);

export function resolvePlannerTextureFrame(
  lockedTexturePath: string,
  sourceFrame: PlannerTextureFrame | null,
): ResolvedPlannerTextureFrame {
  if (sourceFrame === null) {
    return {
      resolvedAssetPath: resolveInitialPlannerTextureAssetPath(lockedTexturePath),
      resolvedFrame: null,
    };
  }

  assertPlannerTextureFrame(lockedTexturePath, sourceFrame);

  const startupAtlasFrame = startupCursorFrameByLockedFrameKey.get(
    createFrameKey(lockedTexturePath, sourceFrame),
  );

  if (startupAtlasFrame !== undefined) {
    return {
      resolvedAssetPath: startupCursorAtlasAssetPath,
      resolvedFrame: startupAtlasFrame,
    };
  }

  return {
    resolvedAssetPath: resolveInitialPlannerTextureAssetPath(lockedTexturePath),
    resolvedFrame: sourceFrame,
  };
}

function createFrameKey(
  lockedTexturePath: string,
  frame: PlannerTextureFrame,
): string {
  return `${lockedTexturePath}|${String(frame.x)},${String(frame.y)},${String(frame.width)},${String(frame.height)}`;
}

function assertPlannerTextureFrame(
  lockedTexturePath: string,
  receivedFrame: unknown,
): asserts receivedFrame is PlannerTextureFrame {
  const frameRecord =
    typeof receivedFrame === "object" && receivedFrame !== null
      ? receivedFrame as Partial<Record<keyof PlannerTextureFrame, unknown>>
      : null;
  const receivedValues = `x=${String(frameRecord?.x)}, y=${String(frameRecord?.y)}, width=${String(frameRecord?.width)}, height=${String(frameRecord?.height)}`;
  const receivedFrameDescription = describeReceivedFrame(receivedFrame);

  if (
    frameRecord === null ||
    !isNonNegativeInteger(frameRecord.x) ||
    !isNonNegativeInteger(frameRecord.y) ||
    !isPositiveInteger(frameRecord.width) ||
    !isPositiveInteger(frameRecord.height)
  ) {
    throw new TypeError(
      `Planner texture frame for ${JSON.stringify(lockedTexturePath)} must contain non-negative integer x/y and positive integer width/height; received frame ${receivedFrameDescription}; fields ${receivedValues}.`,
    );
  }
}

function describeReceivedFrame(receivedFrame: unknown): string {
  if (typeof receivedFrame === "string" || Array.isArray(receivedFrame)) {
    return JSON.stringify(receivedFrame);
  }

  return String(receivedFrame);
}

function isNonNegativeInteger(receivedValue: unknown): receivedValue is number {
  return typeof receivedValue === "number" &&
    Number.isFinite(receivedValue) &&
    Number.isInteger(receivedValue) &&
    receivedValue >= 0;
}

function isPositiveInteger(receivedValue: unknown): receivedValue is number {
  return typeof receivedValue === "number" &&
    Number.isFinite(receivedValue) &&
    Number.isInteger(receivedValue) &&
    receivedValue > 0;
}
