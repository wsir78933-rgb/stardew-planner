"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type LatestArticlesCarouselControlsProperties = Readonly<{
  ariaLabel: string;
  nextLabel: string;
  previousLabel: string;
  trackId: string;
}>;

export type LatestArticlesCarouselState = Readonly<{
  hasOverflow: boolean;
  isAtEnd: boolean;
  isAtStart: boolean;
}>;

const carouselPositionToleranceInPixels = 1;
const initialCarouselState: LatestArticlesCarouselState = {
  hasOverflow: true,
  isAtEnd: false,
  isAtStart: true,
};

export function getLatestArticlesCarouselState(
  measurements: Readonly<{
    clientWidth: number;
    scrollLeft: number;
    scrollWidth: number;
  }>,
): LatestArticlesCarouselState {
  const maximumScrollLeft = Math.max(
    0,
    measurements.scrollWidth - measurements.clientWidth,
  );
  const hasOverflow = maximumScrollLeft > carouselPositionToleranceInPixels;

  return {
    hasOverflow,
    isAtEnd:
      !hasOverflow ||
      measurements.scrollLeft >=
        maximumScrollLeft - carouselPositionToleranceInPixels,
    isAtStart:
      measurements.scrollLeft <= carouselPositionToleranceInPixels,
  };
}

export function createLatestArticlesScrollOptions(
  clientWidth: number,
  direction: 1 | -1,
  prefersReducedMotion: boolean,
): ScrollToOptions {
  return {
    behavior: prefersReducedMotion ? "auto" : "smooth",
    left: clientWidth * direction,
  };
}

function getRequiredLatestArticlesTrack(trackId: string): HTMLElement {
  const trackElement = document.getElementById(trackId);

  if (trackElement === null) {
    throw new Error(
      `Missing latest articles carousel track. Received trackId: ${JSON.stringify(trackId)}.`,
    );
  }

  return trackElement;
}

function readLatestArticlesCarouselState(
  trackElement: HTMLElement,
): LatestArticlesCarouselState {
  return getLatestArticlesCarouselState({
    clientWidth: trackElement.clientWidth,
    scrollLeft: trackElement.scrollLeft,
    scrollWidth: trackElement.scrollWidth,
  });
}

function useLatestArticlesCarouselState(
  trackId: string,
): LatestArticlesCarouselState {
  const [carouselState, setCarouselState] = useState(initialCarouselState);

  useEffect(() => {
    const trackElement = getRequiredLatestArticlesTrack(trackId);
    const updateCarouselState = () => {
      setCarouselState(readLatestArticlesCarouselState(trackElement));
    };
    const resizeObserver = new ResizeObserver(updateCarouselState);

    trackElement.addEventListener("scroll", updateCarouselState, {
      passive: true,
    });
    resizeObserver.observe(trackElement);

    const trackContentElement = trackElement.firstElementChild;
    if (trackContentElement !== null) {
      resizeObserver.observe(trackContentElement);
    }

    updateCarouselState();

    return () => {
      trackElement.removeEventListener("scroll", updateCarouselState);
      resizeObserver.disconnect();
    };
  }, [trackId]);

  return carouselState;
}

function scrollLatestArticlesTrack(trackId: string, direction: 1 | -1): void {
  const trackElement = getRequiredLatestArticlesTrack(trackId);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  trackElement.scrollBy(
    createLatestArticlesScrollOptions(
      trackElement.clientWidth,
      direction,
      prefersReducedMotion,
    ),
  );
}

export function LatestArticlesCarouselControls({
  ariaLabel,
  nextLabel,
  previousLabel,
  trackId,
}: LatestArticlesCarouselControlsProperties) {
  const carouselState = useLatestArticlesCarouselState(trackId);

  return (
    <div
      aria-label={ariaLabel}
      className="blog-latest-articles-controls"
      hidden={!carouselState.hasOverflow}
      role="group"
    >
      <button
        aria-controls={trackId}
        aria-label={previousLabel}
        disabled={carouselState.isAtStart}
        onClick={() => scrollLatestArticlesTrack(trackId, -1)}
        type="button"
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      <button
        aria-controls={trackId}
        aria-label={nextLabel}
        disabled={carouselState.isAtEnd}
        onClick={() => scrollLatestArticlesTrack(trackId, 1)}
        type="button"
      >
        <ChevronRight aria-hidden="true" />
      </button>
    </div>
  );
}
