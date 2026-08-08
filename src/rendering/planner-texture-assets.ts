type PlannerTextureAssetInitializationOptions = Readonly<{
  preferences: Readonly<{
    preferCreateImageBitmap: false;
    preferWorkers: false;
  }>;
  skipDetections: true;
  texturePreference: Readonly<{
    format: "png";
  }>;
}>;

type PlannerTextureAssetRuntime = Readonly<{
  Assets: Readonly<{
    init: (
      plannerTextureAssetInitializationOptions: PlannerTextureAssetInitializationOptions,
    ) => Promise<void>;
  }>;
}>;

const initializedTextureAssetRuntimes = new WeakSet<object>();

const plannerTextureAssetInitializationOptions: PlannerTextureAssetInitializationOptions = {
  preferences: {
    preferCreateImageBitmap: false,
    preferWorkers: false,
  },
  skipDetections: true,
  texturePreference: {
    format: "png",
  },
};

export async function initializePlannerTextureAssets(
  plannerTextureAssetRuntime: PlannerTextureAssetRuntime,
): Promise<void> {
  if (initializedTextureAssetRuntimes.has(plannerTextureAssetRuntime)) {
    return;
  }

  await plannerTextureAssetRuntime.Assets.init(
    plannerTextureAssetInitializationOptions,
  );
  initializedTextureAssetRuntimes.add(plannerTextureAssetRuntime);
}
