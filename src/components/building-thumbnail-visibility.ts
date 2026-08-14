"use client";

import { useEffect, useState, type RefObject } from "react";

export type BuildingThumbnailImageLoader = (
  resolvedAssetPaths: readonly string[],
) => Promise<ReadonlyMap<string, HTMLImageElement>>;

export type BuildingThumbnailObserverFactory = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit,
) => Pick<IntersectionObserver, "disconnect" | "observe">;

export function createBuildingThumbnailObserverOptions(
  itemGridElement: HTMLElement,
): IntersectionObserverInit {
  return {
    root: itemGridElement,
    rootMargin: `0px 0px ${String(itemGridElement.clientHeight)}px 0px`,
    threshold: 0,
  };
}

export function observeBuildingThumbnailLoadEligibility(
  thumbnailCanvasElement: HTMLCanvasElement,
  itemGridElement: HTMLElement,
  onEligible: () => void,
  createBuildingThumbnailObserver: BuildingThumbnailObserverFactory = (
    callback,
    options,
  ) => new IntersectionObserver(callback, options),
): () => void {
  const thumbnailObserver = createBuildingThumbnailObserver(
    (entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        onEligible();
        observer.disconnect();
      }
    },
    createBuildingThumbnailObserverOptions(itemGridElement),
  );
  thumbnailObserver.observe(thumbnailCanvasElement);

  return () => {
    thumbnailObserver.disconnect();
  };
}

export function getBuildingThumbnailLoadEligibility(
  shouldLoadThumbnail: boolean,
  isIntersectionObserverAvailable: boolean,
  hasEnteredThumbnailPriorityArea: boolean,
): boolean {
  if (!shouldLoadThumbnail) {
    return false;
  }

  return !isIntersectionObserverAvailable || hasEnteredThumbnailPriorityArea;
}

export function useBuildingThumbnailLoadEligibility(
  shouldLoadThumbnail: boolean,
  canvasReference: RefObject<HTMLCanvasElement | null>,
  itemGridScrollRootReference: RefObject<HTMLDivElement | null>,
): boolean {
  const [hasEnteredThumbnailPriorityArea, setHasEnteredThumbnailPriorityArea] =
    useState(false);
  const isIntersectionObserverAvailable = typeof IntersectionObserver !== "undefined";
  const itemGridScrollRootHeight =
    itemGridScrollRootReference.current?.clientHeight ?? null;

  useEffect(() => {
    if (
      !shouldLoadThumbnail ||
      hasEnteredThumbnailPriorityArea ||
      !isIntersectionObserverAvailable
    ) {
      return;
    }

    const canvas = canvasReference.current;
    const itemGridElement = itemGridScrollRootReference.current;
    if (canvas === null || itemGridElement === null) {
      return;
    }

    return observeBuildingThumbnailLoadEligibility(
      canvas,
      itemGridElement,
      () => {
        setHasEnteredThumbnailPriorityArea(true);
      },
    );
  }, [
    canvasReference,
    hasEnteredThumbnailPriorityArea,
    isIntersectionObserverAvailable,
    itemGridScrollRootHeight,
    itemGridScrollRootReference,
    shouldLoadThumbnail,
  ]);

  return getBuildingThumbnailLoadEligibility(
    shouldLoadThumbnail,
    isIntersectionObserverAvailable,
    hasEnteredThumbnailPriorityArea,
  );
}

export function createBuildingThumbnailImageLoader(
  createBuildingThumbnailImage: () => HTMLImageElement,
): BuildingThumbnailImageLoader {
  const imagePromisesByResolvedAssetPath = new Map<
    string,
    Promise<HTMLImageElement>
  >();

  return async (resolvedAssetPaths) => {
    const uniqueResolvedAssetPaths = [...new Set(resolvedAssetPaths)];
    const loadedImages = await Promise.all(
      uniqueResolvedAssetPaths.map(async (resolvedAssetPath) => [
        resolvedAssetPath,
        await loadBuildingThumbnailImage(
          resolvedAssetPath,
          imagePromisesByResolvedAssetPath,
          createBuildingThumbnailImage,
        ),
      ] as const),
    );

    return new Map(loadedImages);
  };
}

function loadBuildingThumbnailImage(
  resolvedAssetPath: string,
  imagePromisesByResolvedAssetPath: Map<string, Promise<HTMLImageElement>>,
  createBuildingThumbnailImage: () => HTMLImageElement,
): Promise<HTMLImageElement> {
  const existingImagePromise = imagePromisesByResolvedAssetPath.get(
    resolvedAssetPath,
  );
  if (existingImagePromise !== undefined) {
    return existingImagePromise;
  }

  const image = createBuildingThumbnailImage();
  const imagePromise = new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(
      new Error(`Unable to load building thumbnail asset ${resolvedAssetPath}.`),
    );
  });
  imagePromisesByResolvedAssetPath.set(resolvedAssetPath, imagePromise);
  void imagePromise.catch(() => {
    if (imagePromisesByResolvedAssetPath.get(resolvedAssetPath) === imagePromise) {
      imagePromisesByResolvedAssetPath.delete(resolvedAssetPath);
    }
  });
  image.src = resolvedAssetPath;

  return imagePromise;
}

export const loadBuildingThumbnailImages = createBuildingThumbnailImageLoader(
  () => new Image(),
);
