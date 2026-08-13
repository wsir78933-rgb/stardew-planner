import { describe, expect, it } from "vitest";
import {
  captureMapScreenshotCanvas,
  createMapImageCaptureMethods,
  renderMapScreenshotWithFullMapTransform,
  renderMapScreenshotWithoutEditorOverlays,
} from "../../src/components/planner-canvas-screenshot-exporter";

describe("planner canvas screenshot exporter", () => {
  it("captures the complete map while hiding overlays and restores editor state", async () => {
    const mapContainer = createScreenshotTransform({
      pivot: { x: 640, y: 520 },
      position: { x: 920, y: 680 },
      scale: { x: 0.75, y: 0.75 },
    });
    const mapDisplayOverlayContainer = { visible: true };
    const mapTileRectanglePreviewGraphics = { visible: false };
    const placementPreviewContainer = { visible: true };
    const extractedCanvas = new TestPngCanvas(320, 200);
    const lifecycleEvents: string[] = [];
    const renderTexture = {
      destroy(destroySource: boolean): void {
        lifecycleEvents.push(`destroy-texture:${String(destroySource)}`);
      },
    };

    const capturedCanvas = await captureMapScreenshotCanvas({
      createRenderTexture(dimensions) {
        expect(dimensions).toEqual({ height: 128, resolution: 1, width: 192 });
        lifecycleEvents.push("create-texture");
        return renderTexture;
      },
      extractCanvas(receivedRenderTexture) {
        expect(receivedRenderTexture).toBe(renderTexture);
        lifecycleEvents.push("extract-canvas");
        return extractedCanvas;
      },
      htmlCanvasElementConstructor: TestPngCanvas as unknown as typeof HTMLCanvasElement,
      mapContainer,
      mapDisplayOverlayContainer,
      mapPixelGeometry: {
        mapHeight: 2,
        mapWidth: 3,
        tileHeight: 32,
        tileWidth: 32,
      },
      mapTileRectanglePreviewGraphics,
      placementPreviewContainer,
      renderEditorStage() {
        lifecycleEvents.push("render-editor-stage");
      },
      renderMapToTexture(receivedRenderTexture) {
        expect(receivedRenderTexture).toBe(renderTexture);
        expect(getScreenshotTransformValues(mapContainer)).toEqual({
          pivot: { x: 0, y: 0 },
          position: { x: 0, y: 0 },
          scale: { x: 2, y: 2 },
        });
        expect({
          mapDisplayOverlayVisible: mapDisplayOverlayContainer.visible,
          mapTileRectanglePreviewVisible: mapTileRectanglePreviewGraphics.visible,
          placementPreviewVisible: placementPreviewContainer.visible,
        }).toEqual({
          mapDisplayOverlayVisible: false,
          mapTileRectanglePreviewVisible: false,
          placementPreviewVisible: false,
        });
        lifecycleEvents.push("render-map");
      },
      resolution: 2,
    });

    expect(capturedCanvas).toBe(extractedCanvas);
    expect(lifecycleEvents).toEqual([
      "create-texture",
      "render-map",
      "extract-canvas",
      "destroy-texture:true",
      "render-editor-stage",
    ]);
    expect(getScreenshotTransformValues(mapContainer)).toEqual({
      pivot: { x: 640, y: 520 },
      position: { x: 920, y: 680 },
      scale: { x: 0.75, y: 0.75 },
    });
    expect({
      mapDisplayOverlayVisible: mapDisplayOverlayContainer.visible,
      mapTileRectanglePreviewVisible: mapTileRectanglePreviewGraphics.visible,
      placementPreviewVisible: placementPreviewContainer.visible,
    }).toEqual({
      mapDisplayOverlayVisible: true,
      mapTileRectanglePreviewVisible: false,
      placementPreviewVisible: true,
    });
  });

  it("restores transforms and overlays when screenshot rendering rejects", async () => {
    const mapContainer = createScreenshotTransform({
      pivot: { x: 20, y: 10 },
      position: { x: 50, y: 40 },
      scale: { x: 0.5, y: 0.5 },
    });
    const mapDisplayOverlayContainer = { visible: false };
    const mapTileRectanglePreviewGraphics = { visible: true };
    const placementPreviewContainer = { visible: true };
    const screenshotFailure = new Error("extract failed");

    await expect(renderMapScreenshotWithoutEditorOverlays({
      mapDisplayOverlayContainer,
      mapTileRectanglePreviewGraphics,
      placementPreviewContainer,
      renderScreenshot: () => renderMapScreenshotWithFullMapTransform({
        mapContainer,
        renderScreenshot: () => Promise.reject(screenshotFailure),
        resolution: 1,
      }),
    })).rejects.toBe(screenshotFailure);

    expect(mapDisplayOverlayContainer.visible).toBe(false);
    expect(mapTileRectanglePreviewGraphics.visible).toBe(true);
    expect(placementPreviewContainer.visible).toBe(true);
    expect(getScreenshotTransformValues(mapContainer)).toEqual({
      pivot: { x: 20, y: 10 },
      position: { x: 50, y: 40 },
      scale: { x: 0.5, y: 0.5 },
    });
  });

  it("encodes clean maps without a footer and screenshots with the existing watermark footer", async () => {
    const createdWatermarkCanvases: TestPngCanvas[] = [];
    const mapScreenshotCanvas = new TestPngCanvas(160, 100);
    const capturedResolutions: number[] = [];
    const mapImageCaptureMethods = createMapImageCaptureMethods({
      captureMapScreenshotCanvas: async (resolution) => {
        capturedResolutions.push(resolution);
        return mapScreenshotCanvas as unknown as HTMLCanvasElement;
      },
      createCanvasElement: () => {
        const watermarkCanvas = new TestPngCanvas(0, 0);
        createdWatermarkCanvases.push(watermarkCanvas);
        return watermarkCanvas as unknown as HTMLCanvasElement;
      },
    });

    const cleanMapImageBlob = await mapImageCaptureMethods.captureCleanMapImage(1);
    expect(await cleanMapImageBlob.text()).toBe("160x100");
    expect(createdWatermarkCanvases).toEqual([]);

    const watermarkedScreenshotBlob = await mapImageCaptureMethods.captureScreenshot(1);
    expect(await watermarkedScreenshotBlob.text()).toBe("160x124");
    expect(capturedResolutions).toEqual([1, 1]);
    expect(createdWatermarkCanvases).toHaveLength(1);
    expect(createdWatermarkCanvases[0]).toMatchObject({
      height: 124,
      width: 160,
    });
  });
});

type ScreenshotTransform = Readonly<{
  pivot: Readonly<{ x: number; y: number; set: (x: number, y: number) => void }>;
  position: Readonly<{ x: number; y: number; set: (x: number, y: number) => void }>;
  scale: Readonly<{ x: number; y: number; set: (x: number, y?: number) => void }>;
}>;

function createScreenshotTransform(input: Readonly<{
  pivot: Readonly<{ x: number; y: number }>;
  position: Readonly<{ x: number; y: number }>;
  scale: Readonly<{ x: number; y: number }>;
}>): ScreenshotTransform {
  return {
    pivot: createScreenshotTransformPoint(input.pivot),
    position: createScreenshotTransformPoint(input.position),
    scale: createScreenshotTransformPoint(input.scale),
  };
}

function createScreenshotTransformPoint(input: Readonly<{ x: number; y: number }>): {
  x: number;
  y: number;
  set: (x: number, y?: number) => void;
} {
  return {
    x: input.x,
    y: input.y,
    set(x, y = x): void {
      this.x = x;
      this.y = y;
    },
  };
}

function getScreenshotTransformValues(transform: ScreenshotTransform): Readonly<{
  pivot: Readonly<{ x: number; y: number }>;
  position: Readonly<{ x: number; y: number }>;
  scale: Readonly<{ x: number; y: number }>;
}> {
  return {
    pivot: { x: transform.pivot.x, y: transform.pivot.y },
    position: { x: transform.position.x, y: transform.position.y },
    scale: { x: transform.scale.x, y: transform.scale.y },
  };
}

class TestPngCanvas {
  height: number;
  width: number;

  constructor(width: number, height: number) {
    this.height = height;
    this.width = width;
  }

  getContext(contextId: string): {
    drawImage: () => void;
    fillRect: () => void;
    fillText: () => void;
    fillStyle: string;
    font: string;
    textBaseline: CanvasTextBaseline;
  } | null {
    if (contextId !== "2d") return null;
    return {
      drawImage: () => {},
      fillRect: () => {},
      fillStyle: "",
      fillText: () => {},
      font: "",
      textBaseline: "alphabetic",
    };
  }

  toBlob(callback: (blob: Blob | null) => void): void {
    callback(new Blob([`${String(this.width)}x${String(this.height)}`], {
      type: "image/png",
    }));
  }
}
