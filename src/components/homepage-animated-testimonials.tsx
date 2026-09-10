"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export type HomepageFarmLayoutSlide = Readonly<{
  quote: string;
  name: string;
  designation: string;
  src: string;
  imageAlt: string;
}>;

export type HomepageAnimatedTestimonialsProps = Readonly<{
  testimonials: readonly HomepageFarmLayoutSlide[];
  previousLabel: string;
  nextLabel: string;
  autoplay?: boolean;
}>;

const homepageTestimonialAutoplayIntervalMs = 5000;
const homepageFarmLayoutSlideFields = [
  "quote",
  "name",
  "designation",
  "src",
  "imageAlt",
] as const;

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

  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }

  if (typeof value !== "object") {
    return String(value);
  }

  return JSON.stringify(value);
}

function assertNonEmptyString(value: unknown, fieldName: string): asserts value is string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(
      `Homepage animated testimonials ${fieldName} must be a non-empty string; received ${describeValue(value)}.`,
    );
  }
}

function assertHomepageFarmLayoutSlide(slide: unknown, slideIndex: number): void {
  if (typeof slide !== "object" || slide === null) {
    throw new TypeError(
      `Homepage farm layout slide at index ${String(slideIndex)} must be a non-null object; received ${describeValue(slide)}.`,
    );
  }

  const farmLayoutSlide = slide as Record<string, unknown>;

  for (const fieldName of homepageFarmLayoutSlideFields) {
    const fieldValue = farmLayoutSlide[fieldName];
    if (typeof fieldValue !== "string" || fieldValue.trim() === "") {
      throw new TypeError(
        `Homepage farm layout slide at index ${String(slideIndex)} field ${JSON.stringify(fieldName)} must be a non-empty string; received ${describeValue(fieldValue)}.`,
      );
    }
  }
}

export function assertHomepageAnimatedTestimonialsInput(
  props: HomepageAnimatedTestimonialsProps,
): void {
  if (typeof props !== "object" || props === null) {
    throw new TypeError(
      `Homepage animated testimonials props must be a non-null object; received ${describeValue(props)}.`,
    );
  }

  const { testimonials, previousLabel, nextLabel, autoplay } = props;

  if (!Array.isArray(testimonials) || testimonials.length === 0) {
    const testimonialsLength = Array.isArray(testimonials)
      ? testimonials.length
      : "invalid";
    throw new TypeError(
      `Homepage animated testimonials testimonials must be a non-empty array; received length=${String(testimonialsLength)} value=${describeValue(testimonials)}.`,
    );
  }

  assertNonEmptyString(previousLabel, "previousLabel");
  assertNonEmptyString(nextLabel, "nextLabel");

  if (autoplay !== undefined && typeof autoplay !== "boolean") {
    throw new TypeError(
      `Homepage animated testimonials autoplay must be a boolean when provided; received ${describeValue(autoplay)}.`,
    );
  }

  for (let slideIndex = 0; slideIndex < testimonials.length; slideIndex += 1) {
    assertHomepageFarmLayoutSlide(testimonials[slideIndex], slideIndex);
  }
}

export function rotateYForIndex(index: number): number {
  if (!Number.isInteger(index) || index < 0) {
    throw new TypeError(
      `Homepage testimonial rotate index must be a non-negative integer; received ${describeValue(index)}.`,
    );
  }

  return ((index * 7 + 3) % 21) - 10;
}

export function splitQuoteIntoMotionUnits(quote: string): string[] {
  if (typeof quote !== "string" || quote.trim() === "") {
    throw new TypeError(
      `Homepage farm layout quote must be a non-empty string; received ${describeValue(quote)}.`,
    );
  }

  if (/\s/.test(quote)) {
    return quote.trim().split(/\s+/);
  }

  return [quote];
}

function assertSlideIndexAndCount(activeIndex: number, slideCount: number): void {
  if (!Number.isInteger(slideCount) || slideCount <= 0) {
    throw new TypeError(
      `Homepage animated testimonials slideCount must be a positive integer; received ${describeValue(slideCount)}.`,
    );
  }

  if (!Number.isInteger(activeIndex) || activeIndex < 0 || activeIndex >= slideCount) {
    throw new TypeError(
      `Homepage animated testimonials activeIndex must be an integer in [0, ${String(slideCount)}); received ${describeValue(activeIndex)}.`,
    );
  }
}

export function goToNextIndex(activeIndex: number, slideCount: number): number {
  assertSlideIndexAndCount(activeIndex, slideCount);
  return (activeIndex + 1) % slideCount;
}

export function goToPreviousIndex(activeIndex: number, slideCount: number): number {
  assertSlideIndexAndCount(activeIndex, slideCount);
  return (activeIndex - 1 + slideCount) % slideCount;
}

function HomepageFarmLayoutSlideCopy({
  canAnimateQuoteWords,
  isActive,
  prefersReducedMotion,
  testimonial,
}: Readonly<{
  canAnimateQuoteWords: boolean;
  isActive: boolean;
  prefersReducedMotion: boolean;
  testimonial: HomepageFarmLayoutSlide;
}>) {
  const quoteUnits = splitQuoteIntoMotionUnits(testimonial.quote);
  const quoteUsesWordMotion = quoteUnits.length > 1;
  const shouldAnimateQuoteWords =
    isActive && canAnimateQuoteWords && !prefersReducedMotion;

  return (
    <div hidden={!isActive}>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={
          prefersReducedMotion || !canAnimateQuoteWords
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 20 }
        }
        key={isActive ? "active" : "idle"}
        transition={{
          duration: prefersReducedMotion || !canAnimateQuoteWords ? 0 : 0.2,
          ease: "easeInOut",
        }}
      >
        <h3 data-homepage-testimonial-name={isActive ? true : undefined}>
          {testimonial.name}
        </h3>
        <p data-homepage-testimonial-designation={isActive ? true : undefined}>
          {testimonial.designation}
        </p>
        <motion.p
          aria-live={isActive ? "polite" : undefined}
          data-homepage-testimonial-quote={isActive ? true : undefined}
        >
          {shouldAnimateQuoteWords ? (
            quoteUnits.map((quoteUnit, quoteUnitIndex) => (
              <motion.span
                animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                key={`${testimonial.src}-quote-${String(quoteUnitIndex)}`}
                style={quoteUsesWordMotion ? { display: "inline-block" } : undefined}
                transition={{
                  delay: 0.02 * quoteUnitIndex,
                  duration: 0.2,
                  ease: "easeInOut",
                }}
              >
                {quoteUnit}
                {quoteUsesWordMotion ? "\u00A0" : null}
              </motion.span>
            ))
          ) : (
            testimonial.quote
          )}
        </motion.p>
      </motion.div>
    </div>
  );
}

export function HomepageAnimatedTestimonials(props: HomepageAnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [canAnimateQuoteWords, setCanAnimateQuoteWords] = useState(false);
  const prefersReducedMotion = useReducedMotion() === true;
  const autoplay = props.autoplay === true;
  const testimonialCount = Array.isArray(props.testimonials)
    ? props.testimonials.length
    : 0;

  useEffect(() => {
    setCanAnimateQuoteWords(true);
  }, []);

  useEffect(() => {
    if (!autoplay || prefersReducedMotion || testimonialCount === 0) {
      return;
    }

    const autoplayIntervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => goToNextIndex(currentIndex, testimonialCount));
    }, homepageTestimonialAutoplayIntervalMs);

    return () => {
      window.clearInterval(autoplayIntervalId);
    };
  }, [autoplay, prefersReducedMotion, testimonialCount]);

  assertHomepageAnimatedTestimonialsInput(props);

  const { testimonials, previousLabel, nextLabel } = props;

  return (
    <div data-homepage-animated-testimonials>
      <div data-homepage-testimonial-media>
        <AnimatePresence initial={false}>
          {testimonials.map((testimonial, testimonialIndex) => {
            const isActive = testimonialIndex === activeIndex;
            const rotation = rotateYForIndex(testimonialIndex);

            return (
              <motion.div
                animate={{
                  opacity: isActive ? 1 : 0.7,
                  rotate: isActive ? 0 : rotation,
                  scale: isActive ? 1 : 0.95,
                  y: isActive && !prefersReducedMotion ? [0, -80, 0] : 0,
                  z: isActive ? 0 : -100,
                  zIndex: isActive ? 40 : testimonials.length + 2 - testimonialIndex,
                }}
                data-homepage-testimonial-image
                exit={{
                  opacity: 0,
                  rotate: rotation,
                  scale: 0.9,
                  z: 100,
                }}
                initial={false}
                key={testimonial.src}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.4,
                  ease: "easeInOut",
                }}
              >
                <img
                  alt={testimonial.imageAlt}
                  decoding="async"
                  draggable={false}
                  loading="lazy"
                  src={testimonial.src}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div data-homepage-testimonial-copy>
        {testimonials.map((testimonial, testimonialIndex) => (
          <HomepageFarmLayoutSlideCopy
            canAnimateQuoteWords={canAnimateQuoteWords}
            isActive={testimonialIndex === activeIndex}
            key={testimonial.src}
            prefersReducedMotion={prefersReducedMotion}
            testimonial={testimonial}
          />
        ))}
        <div data-homepage-testimonial-controls>
          <button
            aria-label={previousLabel}
            data-homepage-testimonial-previous
            onClick={() => {
              setActiveIndex((currentIndex) =>
                goToPreviousIndex(currentIndex, testimonials.length),
              );
            }}
            type="button"
          >
            <IconArrowLeft aria-hidden="true" />
          </button>
          <button
            aria-label={nextLabel}
            data-homepage-testimonial-next
            onClick={() => {
              setActiveIndex((currentIndex) =>
                goToNextIndex(currentIndex, testimonials.length),
              );
            }}
            type="button"
          >
            <IconArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
