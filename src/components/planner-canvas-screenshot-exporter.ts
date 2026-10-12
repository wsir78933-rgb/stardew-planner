import type {
  MapImageExporter,
  ScreenshotResolution,
} from "../projects/map-image-export";
import { createMapScreenshotDimensions } from "../rendering/map-screenshot";

type ScreenshotTransformPointPort = Readonly<{
  x: number;
  y: number;
  set: (x: number, y: number) => void;
}>;

type ScreenshotMapContainerPort = Readonly<{
  pivot: ScreenshotTransformPointPort;
  position: ScreenshotTransformPointPort;
  scale: ScreenshotTransformPointPort;
}>;

type ScreenshotVisibilityPort = {
  visible: boolean;
};

type ScreenshotRenderTexturePort = Readonly<{
  destroy: (destroySource: boolean) => void;
}>;

type MapPixelGeometry = Readonly<{
  mapHeight: number;
  mapWidth: number;
  tileHeight: number;
  tileWidth: number;
}>;

export function createMapImageCaptureMethods(
  input: Readonly<{
    captureMapScreenshotCanvas: (
      resolution: ScreenshotResolution,
    ) => Promise<HTMLCanvasElement>;
    createCanvasElement: () => HTMLCanvasElement;
  }>,
): MapImageExporter {
  return {
    async captureCleanMapImage(resolution): Promise<Blob> {
      return createPngBlob(await input.captureMapScreenshotCanvas(resolution));
    },
    async captureScreenshot(resolution): Promise<Blob> {
      return createPngBlob(await input.captureMapScreenshotCanvas(resolution));
    },
  };
}

export async function captureMapScreenshotCanvas<
  RenderTexture extends ScreenshotRenderTexturePort,
>(input: Readonly<{
  createRenderTexture: (
    dimensions: Readonly<{ height: number; resolution: 1; width: number }>,
  ) => RenderTexture;
  extractCanvas: (renderTexture: RenderTexture) => unknown;
  htmlCanvasElementConstructor: typeof HTMLCanvasElement | undefined;
  mapContainer: ScreenshotMapContainerPort;
  mapDisplayOverlayContainer: ScreenshotVisibilityPort;
  mapPixelGeometry: MapPixelGeometry;
  mapTileRectanglePreviewGraphics: ScreenshotVisibilityPort;
  placementPreviewContainer: ScreenshotVisibilityPort;
  renderEditorStage: () => void;
  renderMapToTexture: (renderTexture: RenderTexture) => void;
  resolution: ScreenshotResolution;
}>): Promise<HTMLCanvasElement> {
  const screenshotDimensions = createMapScreenshotDimensions({
    mapHeight: input.mapPixelGeometry.mapHeight,
    mapWidth: input.mapPixelGeometry.mapWidth,
    resolution: input.resolution,
    tileHeight: input.mapPixelGeometry.tileHeight,
    tileWidth: input.mapPixelGeometry.tileWidth,
  });
  const screenshotRenderTextureReference: { current: RenderTexture | null } = {
    current: null,
  };

  try {
    return await renderMapScreenshotWithoutEditorOverlays({
      mapDisplayOverlayContainer: input.mapDisplayOverlayContainer,
      mapTileRectanglePreviewGraphics: input.mapTileRectanglePreviewGraphics,
      placementPreviewContainer: input.placementPreviewContainer,
      renderScreenshot: () => renderMapScreenshotWithFullMapTransform({
        mapContainer: input.mapContainer,
        renderScreenshot: () => {
          screenshotRenderTextureReference.current = input.createRenderTexture({
            height: screenshotDimensions.height,
            resolution: 1,
            width: screenshotDimensions.width,
          });
          input.renderMapToTexture(screenshotRenderTextureReference.current);
          return assertHtmlCanvasElement(
            input.extractCanvas(screenshotRenderTextureReference.current),
            input.htmlCanvasElementConstructor,
          );
        },
        resolution: input.resolution,
      }),
    });
  } finally {
    screenshotRenderTextureReference.current?.destroy(true);
    input.renderEditorStage();
  }
}

export async function renderMapScreenshotWithFullMapTransform<Result>(
  input: Readonly<{
    mapContainer: ScreenshotMapContainerPort;
    renderScreenshot: () => Promise<Result> | Result;
    resolution: ScreenshotResolution;
  }>,
): Promise<Result> {
  const originalMapPivot = {
    x: input.mapContainer.pivot.x,
    y: input.mapContainer.pivot.y,
  };
  const originalMapPosition = {
    x: input.mapContainer.position.x,
    y: input.mapContainer.position.y,
  };
  const originalMapScale = {
    x: input.mapContainer.scale.x,
    y: input.mapContainer.scale.y,
  };

  try {
    input.mapContainer.pivot.set(0, 0);
    input.mapContainer.position.set(0, 0);
    input.mapContainer.scale.set(input.resolution, input.resolution);
    return await input.renderScreenshot();
  } finally {
    input.mapContainer.pivot.set(originalMapPivot.x, originalMapPivot.y);
    input.mapContainer.scale.set(originalMapScale.x, originalMapScale.y);
    input.mapContainer.position.set(originalMapPosition.x, originalMapPosition.y);
  }
}

export async function renderMapScreenshotWithoutEditorOverlays<Result>(
  input: Readonly<{
    mapDisplayOverlayContainer: ScreenshotVisibilityPort;
    mapTileRectanglePreviewGraphics: ScreenshotVisibilityPort;
    placementPreviewContainer: ScreenshotVisibilityPort;
    renderScreenshot: () => Promise<Result> | Result;
  }>,
): Promise<Result> {
  const wasMapDisplayOverlayVisible = input.mapDisplayOverlayContainer.visible;
  const wasMapTileRectanglePreviewVisible =
    input.mapTileRectanglePreviewGraphics.visible;
  const wasPlacementPreviewVisible = input.placementPreviewContainer.visible;

  try {
    input.mapDisplayOverlayContainer.visible = false;
    input.mapTileRectanglePreviewGraphics.visible = false;
    input.placementPreviewContainer.visible = false;
    return await input.renderScreenshot();
  } finally {
    input.mapDisplayOverlayContainer.visible = wasMapDisplayOverlayVisible;
    input.mapTileRectanglePreviewGraphics.visible =
      wasMapTileRectanglePreviewVisible;
    input.placementPreviewContainer.visible = wasPlacementPreviewVisible;
  }
}

function assertHtmlCanvasElement(
  extractedCanvas: unknown,
  htmlCanvasElementConstructor: typeof HTMLCanvasElement | undefined,
): HTMLCanvasElement {
  if (htmlCanvasElementConstructor === undefined) {
    throw new Error("Map screenshot export requires HTMLCanvasElement support.");
  }

  if (!(extractedCanvas instanceof htmlCanvasElementConstructor)) {
    throw new TypeError(
      `Pixi map screenshot extraction must return an HTMLCanvasElement; received ${describeValue(extractedCanvas)}.`,
    );
  }

  return extractedCanvas;
}

function createPngBlob(screenshotCanvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    screenshotCanvas.toBlob((screenshotBlob) => {
      if (screenshotBlob === null) {
        reject(new Error("Map screenshot export could not encode the PNG image."));
        return;
      }

      resolve(screenshotBlob);
    }, "image/png");
  });
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "object") {
    return Object.prototype.toString.call(value);
  }

  return JSON.stringify(value);
}
