"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type HomepageFeaturesGalleryImage = Readonly<{
  src: string;
}>;

export type HomepageFeaturesGalleryProps = Readonly<{
  alt: string;
  autoplay?: boolean;
  images: readonly HomepageFeaturesGalleryImage[];
}>;

export const homepageFeaturesGalleryImages = [
  {
    src: "/homepage/features/meadowlands-aesthetic-01-prismatic-fall.jpg",
  },
  {
    src: "/homepage/features/meadowlands-aesthetic-01-prismatic-spring.jpg",
  },
  {
    src: "/homepage/features/meadowlands-aesthetic-01-prismatic-summer.jpg",
  },
  {
    src: "/homepage/features/meadowlands-aesthetic-03-modded-overview.jpg",
  },
  {
    src: "/homepage/features/meadowlands-aesthetic-05-vanilla-year7.png",
  },
] as const satisfies readonly HomepageFeaturesGalleryImage[];

const homepageFeaturesGalleryAutoplayIntervalMs = 5000;

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function assertNonEmptyString(value: unknown, fieldName: string): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(
      `Homepage features gallery ${fieldName} must be a non-empty string; received ${describeValue(value)}.`,
    );
  }
}

export function assertHomepageFeaturesGalleryInput(
  props: HomepageFeaturesGalleryProps,
): void {
  if (props === null || typeof props !== "object" || Array.isArray(props)) {
    throw new TypeError(
      `Homepage features gallery props must be a non-null object; received ${describeValue(props)}.`,
    );
  }

  assertNonEmptyString(props.alt, "alt");

  if (!Array.isArray(props.images) || props.images.length === 0) {
    const imageCount = Array.isArray(props.images) ? props.images.length : "invalid";
    throw new TypeError(
      `Homepage features gallery images must be a non-empty array; received length=${String(imageCount)} value=${describeValue(props.images)}.`,
    );
  }

  if (props.autoplay !== undefined && typeof props.autoplay !== "boolean") {
    throw new TypeError(
      `Homepage features gallery autoplay must be a boolean when provided; received ${describeValue(props.autoplay)}.`,
    );
  }

  props.images.forEach((image, imageIndex) => {
    if (image === null || typeof image !== "object" || Array.isArray(image)) {
      throw new TypeError(
        `Homepage features gallery images[${String(imageIndex)}] must be a non-null object; received ${describeValue(image)}.`,
      );
    }

    assertNonEmptyString(image.src, `images[${String(imageIndex)}].src`);
  });
}

function isElementInViewport(element: HTMLElement): boolean {
  const elementRect = element.getBoundingClientRect();

  return elementRect.bottom > 0 && elementRect.top < window.innerHeight;
}

export function HomepageFeaturesGallery({
  alt,
  autoplay = true,
  images,
}: HomepageFeaturesGalleryProps) {
  assertHomepageFeaturesGalleryInput({ alt, autoplay, images });

  const [activeIndex, setActiveIndex] = useState(0);
  const [lastAutoplayTick, setLastAutoplayTick] = useState(0);
  const prefersReducedMotion = useReducedMotion() === true;
  const galleryRef = useRef<HTMLDivElement>(null);
  const safeActiveIndex = Math.min(activeIndex, images.length - 1);

  useEffect(() => {
    if (!autoplay || prefersReducedMotion || images.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setLastAutoplayTick(Date.now());
      const gallery = galleryRef.current;

      if (!gallery || !isElementInViewport(gallery)) {
        return;
      }

      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, homepageFeaturesGalleryAutoplayIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [autoplay, images.length, prefersReducedMotion]);

  return (
    <div
      data-homepage-features-gallery
      data-homepage-features-gallery-active-index={String(safeActiveIndex)}
      data-homepage-features-gallery-autoplay={String(autoplay)}
      data-homepage-features-gallery-last-autoplay-tick={String(lastAutoplayTick)}
      data-homepage-features-gallery-reduced-motion={
        prefersReducedMotion ? "true" : "false"
      }
      ref={galleryRef}
    >
      {images.map((image, imageIndex) => {
        const isActive = imageIndex === safeActiveIndex;

        return (
          <motion.div
            animate={{ opacity: isActive ? 1 : 0 }}
            aria-hidden={isActive ? undefined : true}
            data-homepage-features-gallery-image
            initial={false}
            key={image.src}
            style={{ pointerEvents: isActive ? "auto" : "none" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
          >
            <img
              alt={alt}
              decoding="async"
              draggable={false}
              loading={imageIndex === 0 ? "eager" : "lazy"}
              src={image.src}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
