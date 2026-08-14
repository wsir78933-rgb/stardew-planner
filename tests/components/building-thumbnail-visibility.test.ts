import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createBuildingThumbnailImageLoader,
  getBuildingThumbnailLoadEligibility,
  createBuildingThumbnailObserverOptions,
} from "../../src/components/building-thumbnail-visibility";

describe("building thumbnail visibility", () => {
  it("observes the sidebar scrollport and one scrollport-height below it", () => {
    const itemGridElement = createItemGridElement(180, 540);

    expect(createBuildingThumbnailObserverOptions(itemGridElement)).toEqual({
      root: itemGridElement,
      rootMargin: "0px 0px 180px 0px",
      threshold: 0,
    });
  });

  it("mounts the hook with attached refs, observes the pixel priority region, and refreshes it after resize", async () => {
    const itemGridElement = createItemGridElement(180, 540);
    const thumbnailCanvasElement = {} as HTMLCanvasElement;
    const fakeIntersectionObservers: FakeIntersectionObserver[] = [];
    vi.stubGlobal(
      "IntersectionObserver",
      class extends FakeIntersectionObserver {
        constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit) {
          super(callback, options);
          fakeIntersectionObservers.push(this);
        }
      },
    );
    const hookRuntime = createMountedHookRuntime();
    vi.resetModules();
    vi.doMock("react", () => hookRuntime.reactModule);
    const { useBuildingThumbnailLoadEligibility } = await import(
      "../../src/components/building-thumbnail-visibility"
    );
    const canvasReference = { current: thumbnailCanvasElement };
    const itemGridReference = { current: itemGridElement };
    const mountedHook = hookRuntime.mount(() =>
      useBuildingThumbnailLoadEligibility(
        true,
        canvasReference,
        itemGridReference,
      ),
    );

    expect(mountedHook.render()).toBe(false);
    expect(fakeIntersectionObservers).toHaveLength(1);
    expect(fakeIntersectionObservers[0]).toMatchObject({
      options: {
        root: itemGridElement,
        rootMargin: "0px 0px 180px 0px",
        threshold: 0,
      },
      observedElements: [thumbnailCanvasElement],
    });

    Object.defineProperty(itemGridElement, "clientHeight", {
      configurable: true,
      value: 260,
    });
    expect(mountedHook.render()).toBe(false);
    expect(fakeIntersectionObservers).toHaveLength(2);
    expect(fakeIntersectionObservers[0]?.disconnectCount).toBe(1);
    expect(fakeIntersectionObservers[1]).toMatchObject({
      options: {
        root: itemGridElement,
        rootMargin: "0px 0px 260px 0px",
        threshold: 0,
      },
      observedElements: [thumbnailCanvasElement],
    });

    fakeIntersectionObservers[1]?.reportIntersection();
    expect(mountedHook.render()).toBe(true);
    expect(fakeIntersectionObservers[1]?.disconnectCount).toBe(2);

    Object.defineProperty(itemGridElement, "clientHeight", {
      configurable: true,
      value: 320,
    });
    expect(mountedHook.render()).toBe(true);
    expect(fakeIntersectionObservers).toHaveLength(2);

    mountedHook.unmount();
  });

  it("returns fallback eligibility from the mounted hook without IntersectionObserver", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const hookRuntime = createMountedHookRuntime();
    vi.resetModules();
    vi.doMock("react", () => hookRuntime.reactModule);
    const { useBuildingThumbnailLoadEligibility } = await import(
      "../../src/components/building-thumbnail-visibility"
    );
    const mountedHook = hookRuntime.mount(() =>
      useBuildingThumbnailLoadEligibility(
        true,
        { current: {} as HTMLCanvasElement },
        { current: createItemGridElement(180, 540) },
      ),
    );

    expect(mountedHook.render()).toBe(true);
    mountedHook.unmount();
  });

  it("keeps the image gate closed before interactivity and opens without an observer", () => {
    expect(getBuildingThumbnailLoadEligibility(false, false, false)).toBe(false);
    expect(getBuildingThumbnailLoadEligibility(false, true, true)).toBe(false);
    expect(getBuildingThumbnailLoadEligibility(true, false, false)).toBe(true);
    expect(getBuildingThumbnailLoadEligibility(true, true, false)).toBe(false);
    expect(getBuildingThumbnailLoadEligibility(true, true, true)).toBe(true);
  });

  it("shares one requested image across thumbnail loader calls", async () => {
    const requestedAssetPaths: string[] = [];
    const loadBuildingThumbnailImages = createBuildingThumbnailImageLoader(
      createSuccessfulImageFactory(requestedAssetPaths),
    );

    const [firstImagesByAssetPath, secondImagesByAssetPath] = await Promise.all([
      loadBuildingThumbnailImages(["/tilesheets/a.png"]),
      loadBuildingThumbnailImages(["/tilesheets/a.png", "/tilesheets/a.png"]),
    ]);

    expect(requestedAssetPaths).toEqual(["/tilesheets/a.png"]);
    expect(firstImagesByAssetPath.get("/tilesheets/a.png")).toBe(
      secondImagesByAssetPath.get("/tilesheets/a.png"),
    );
  });

  it("removes a rejected image promise so a later thumbnail can retry it", async () => {
    const requestedAssetPaths: string[] = [];
    const loadBuildingThumbnailImages = createBuildingThumbnailImageLoader(
      createFailThenSucceedImageFactory(requestedAssetPaths),
    );

    await expect(
      loadBuildingThumbnailImages(["/tilesheets/a.png"]),
    ).rejects.toThrow("Unable to load building thumbnail asset /tilesheets/a.png.");
    await expect(
      loadBuildingThumbnailImages(["/tilesheets/a.png"]),
    ).resolves.toBeInstanceOf(Map);

    expect(requestedAssetPaths).toEqual([
      "/tilesheets/a.png",
      "/tilesheets/a.png",
    ]);
  });
});

afterEach(() => {
  vi.doUnmock("react");
  vi.resetModules();
  vi.unstubAllGlobals();
});

class FakeIntersectionObserver {
  readonly observedElements: Element[] = [];
  disconnectCount = 0;

  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options: IntersectionObserverInit,
  ) {}

  disconnect(): void {
    this.disconnectCount += 1;
  }

  observe(observedElement: Element): void {
    this.observedElements.push(observedElement);
  }

  reportIntersection(): void {
    this.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

function createItemGridElement(
  clientHeight: number,
  clientWidth: number,
): HTMLDivElement {
  return {
    clientHeight,
    clientWidth,
  } as HTMLDivElement;
}

function createMountedHookRuntime() {
  const hookStates: unknown[] = [];
  const effectSlots = new Map<number, HookEffectSlot>();
  let currentHookIndex = 0;
  let scheduledEffects: readonly ScheduledHookEffect[] = [];

  return {
    mount<Output>(renderHook: () => Output) {
      let currentOutput: Output;

      function render(): Output {
        currentHookIndex = 0;
        const nextScheduledEffects: ScheduledHookEffect[] = [];
        scheduledEffects = nextScheduledEffects;
        currentOutput = renderHook();

        for (const scheduledEffect of scheduledEffects) {
          const previousEffect = effectSlots.get(scheduledEffect.hookIndex);
          previousEffect?.cleanup?.();
          const cleanup = scheduledEffect.effect();
          effectSlots.set(scheduledEffect.hookIndex, {
            cleanup: typeof cleanup === "function" ? cleanup : undefined,
            dependencies: scheduledEffect.dependencies,
          });
        }

        return currentOutput;
      }

      return {
        render,
        unmount(): void {
          for (const effectSlot of effectSlots.values()) {
            effectSlot.cleanup?.();
          }
          effectSlots.clear();
        },
      };
    },
    reactModule: {
      useEffect(
        effect: () => void | (() => void),
        dependencies: readonly unknown[],
      ): void {
        const hookIndex = currentHookIndex;
        currentHookIndex += 1;
        const previousEffect = effectSlots.get(hookIndex);
        if (
          previousEffect === undefined ||
          !haveEqualDependencies(previousEffect.dependencies, dependencies)
        ) {
          (scheduledEffects as ScheduledHookEffect[]).push({
            dependencies,
            effect,
            hookIndex,
          });
        }
      },
      useState<Value>(initialValue: Value): readonly [Value, (nextValue: Value) => void] {
        const stateIndex = currentHookIndex;
        currentHookIndex += 1;
        if (!(stateIndex in hookStates)) {
          hookStates[stateIndex] = initialValue;
        }

        return [
          hookStates[stateIndex] as Value,
          (nextValue: Value): void => {
            hookStates[stateIndex] = nextValue;
          },
        ];
      },
    },
  };
}

type HookEffectSlot = Readonly<{
  cleanup?: () => void;
  dependencies: readonly unknown[];
}>;

type ScheduledHookEffect = Readonly<{
  dependencies: readonly unknown[];
  effect: () => void | (() => void);
  hookIndex: number;
}>;

function haveEqualDependencies(
  previousDependencies: readonly unknown[],
  nextDependencies: readonly unknown[],
): boolean {
  return previousDependencies.length === nextDependencies.length &&
    previousDependencies.every((dependency, index) =>
      Object.is(dependency, nextDependencies[index])
    );
}

function createSuccessfulImageFactory(
  requestedAssetPaths: string[],
): () => HTMLImageElement {
  return () => createFakeImage(requestedAssetPaths, "load");
}

function createFailThenSucceedImageFactory(
  requestedAssetPaths: string[],
): () => HTMLImageElement {
  let imageCreationCount = 0;

  return () => {
    imageCreationCount += 1;
    return createFakeImage(
      requestedAssetPaths,
      imageCreationCount === 1 ? "error" : "load",
    );
  };
}

function createFakeImage(
  requestedAssetPaths: string[],
  result: "error" | "load",
): HTMLImageElement {
  const image = { onerror: null, onload: null } as unknown as HTMLImageElement;

  Object.defineProperty(image, "src", {
    configurable: true,
    set(requestedAssetPath: string): void {
      requestedAssetPaths.push(requestedAssetPath);
      if (result === "load") {
        const onload = image.onload as ((event: Event) => void) | null;
        onload?.({} as Event);
        return;
      }

      const onerror = image.onerror as ((event: Event) => void) | null;
      onerror?.({} as Event);
    },
  });

  return image;
}
