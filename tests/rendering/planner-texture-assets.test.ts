import { describe, expect, it, vi } from "vitest";
import { initializePlannerTextureAssets } from "../../src/rendering/planner-texture-assets";

describe("planner texture assets", () => {
  it("initializes the locked PNG loader once for one Pixi module", async () => {
    const initializeAssets = vi.fn(async () => undefined);
    const pixiAssetRuntime = {
      Assets: {
        init: initializeAssets,
      },
    };

    await initializePlannerTextureAssets(pixiAssetRuntime);
    await initializePlannerTextureAssets(pixiAssetRuntime);

    expect(initializeAssets).toHaveBeenCalledTimes(1);
    expect(initializeAssets).toHaveBeenCalledWith({
      preferences: {
        preferCreateImageBitmap: false,
        preferWorkers: false,
      },
      skipDetections: true,
      texturePreference: {
        format: "png",
      },
    });
  });

  it("does not combine two independent Pixi module lifecycles", async () => {
    const firstInitializeAssets = vi.fn(async () => undefined);
    const secondInitializeAssets = vi.fn(async () => undefined);

    await initializePlannerTextureAssets({
      Assets: { init: firstInitializeAssets },
    });
    await initializePlannerTextureAssets({
      Assets: { init: secondInitializeAssets },
    });

    expect(firstInitializeAssets).toHaveBeenCalledOnce();
    expect(secondInitializeAssets).toHaveBeenCalledOnce();
  });
});
