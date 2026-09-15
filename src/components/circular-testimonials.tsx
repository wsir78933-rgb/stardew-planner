"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";
import { PublicPicture } from "./public-picture";

export type CircularTestimonial = Readonly<{
  quote: string;
  name: string;
  designation: string;
  src: string;
  alt?: string;
}>;

export type CircularTestimonialsColors = Readonly<{
  name?: string;
  designation?: string;
  testimony?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
}>;

export type CircularTestimonialsFontSizes = Readonly<{
  name?: string;
  designation?: string;
  quote?: string;
}>;

export interface CircularTestimonialsProps {
  testimonials: readonly CircularTestimonial[];
  previousLabel: string;
  nextLabel: string;
  autoplay?: boolean;
  colors?: CircularTestimonialsColors;
  fontSizes?: CircularTestimonialsFontSizes;
  className?: string;
}

const circularTestimonialsAutoplayIntervalMs = 5000;
const circularTestimonialsDefaultNameColor = "#000";
const circularTestimonialsDefaultDesignationColor = "#6b7280";
const circularTestimonialsDefaultTestimonyColor = "#4b5563";
const circularTestimonialsDefaultArrowBackground = "#141414";
const circularTestimonialsDefaultArrowForeground = "#f1f1f7";
const circularTestimonialsDefaultArrowHoverBackground = "#00a6fb";
const circularTestimonialsDefaultNameFontSize = "1.5rem";
const circularTestimonialsDefaultDesignationFontSize = "0.925rem";
const circularTestimonialsDefaultQuoteFontSize = "1.125rem";

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

function requireNonEmptyString(value: unknown, fieldPath: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(
      `CircularTestimonials: ${fieldPath} must be a non-empty string, received: ${describeValue(value)}`,
    );
  }

  return value;
}

function assertOptionalStyleRecord(
  value: unknown,
  fieldPath: "colors" | "fontSizes",
): void {
  if (value === undefined) {
    return;
  }

  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(
      `CircularTestimonials: ${fieldPath} must be an object when provided, received: ${describeValue(value)}`,
    );
  }

  for (const [propertyName, propertyValue] of Object.entries(value)) {
    requireNonEmptyString(propertyValue, `${fieldPath}.${propertyName}`);
  }
}

function validateTestimonialItem(
  item: unknown,
  testimonialIndex: number,
): asserts item is CircularTestimonial {
  if (item === null || typeof item !== "object" || Array.isArray(item)) {
    throw new TypeError(
      `CircularTestimonials: testimonials[${String(testimonialIndex)}] must be a valid item object, received: ${describeValue(item)}`,
    );
  }

  const testimonial = item as Record<string, unknown>;
  requireNonEmptyString(
    testimonial.quote,
    `testimonials[${String(testimonialIndex)}].quote`,
  );
  requireNonEmptyString(
    testimonial.name,
    `testimonials[${String(testimonialIndex)}].name`,
  );
  requireNonEmptyString(
    testimonial.designation,
    `testimonials[${String(testimonialIndex)}].designation`,
  );
  requireNonEmptyString(
    testimonial.src,
    `testimonials[${String(testimonialIndex)}].src`,
  );

  if (testimonial.alt !== undefined) {
    requireNonEmptyString(
      testimonial.alt,
      `testimonials[${String(testimonialIndex)}].alt`,
    );
  }
}

export function assertCircularTestimonialsInput(
  props: CircularTestimonialsProps,
): void {
  if (props === null || typeof props !== "object" || Array.isArray(props)) {
    throw new TypeError(
      `CircularTestimonials: props must be a non-null object, received: ${describeValue(props)}`,
    );
  }

  const { testimonials, previousLabel, nextLabel, autoplay } = props;
  const testimonialCount = Array.isArray(testimonials) ? testimonials.length : 0;

  if (!Array.isArray(testimonials) || testimonialCount === 0) {
    throw new TypeError(
      `CircularTestimonials received empty testimonials (length=${String(testimonialCount)}, received=${describeValue(testimonials)})`,
    );
  }

  requireNonEmptyString(previousLabel, "previousLabel");
  requireNonEmptyString(nextLabel, "nextLabel");

  if (autoplay !== undefined && typeof autoplay !== "boolean") {
    throw new TypeError(
      `CircularTestimonials: autoplay must be a boolean when provided, received: ${describeValue(autoplay)}`,
    );
  }

  assertOptionalStyleRecord(props.colors, "colors");
  assertOptionalStyleRecord(props.fontSizes, "fontSizes");

  testimonials.forEach((testimonial, testimonialIndex) => {
    validateTestimonialItem(testimonial, testimonialIndex);
  });
}

export function splitCircularTestimonialQuote(quote: string): string[] {
  requireNonEmptyString(quote, "quote");

  return quote.trim().split(/\s+/);
}

export function calculateCircularTestimonialsGap(width: number): number {
  if (!Number.isFinite(width) || width <= 0) {
    throw new TypeError(
      `CircularTestimonials: container width must be a positive finite number, received: ${describeValue(width)}`,
    );
  }

  const minWidth = 360;
  const maxWidth = 1456;
  const minGap = 28;
  const maxGap = 86;

  if (width <= minWidth) {
    return minGap;
  }

  if (width >= maxWidth) {
    return maxGap;
  }

  return minGap + ((maxGap - minGap) * (width - minWidth)) / (maxWidth - minWidth);
}

export function getCircularImageStyle({
  activeIndex,
  containerWidth,
  index,
  prefersReducedMotion = false,
  testimonialsLength,
}: Readonly<{
  index: number;
  activeIndex: number;
  testimonialsLength: number;
  containerWidth: number;
  prefersReducedMotion?: boolean;
}>): CSSProperties {
  if (!Number.isInteger(index) || index < 0 || index >= testimonialsLength) {
    throw new RangeError(
      `CircularTestimonials: image index must be an integer in [0, ${String(testimonialsLength)}), received: ${describeValue(index)}`,
    );
  }

  if (
    !Number.isInteger(activeIndex) ||
    activeIndex < 0 ||
    activeIndex >= testimonialsLength
  ) {
    throw new RangeError(
      `CircularTestimonials: active index must be an integer in [0, ${String(testimonialsLength)}), received: ${describeValue(activeIndex)}`,
    );
  }

  const gap = calculateCircularTestimonialsGap(containerWidth);
  const maxStickUp = gap * 0.8;
  const transition = prefersReducedMotion
    ? "none"
    : "transform 800ms cubic-bezier(.4,2,.3,1), opacity 800ms cubic-bezier(.4,2,.3,1)";
  const isActive = index === activeIndex;
  const isLeft =
    (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
  const isRight = (activeIndex + 1) % testimonialsLength === index;

  if (isActive) {
    return {
      zIndex: 3,
      opacity: 1,
      pointerEvents: "auto",
      transform:
        "translate(-50%, 0) translateX(0px) translateY(0px) scale(1) rotateY(0deg)",
      transition,
    };
  }

  if (isLeft) {
    return {
      zIndex: 2,
      opacity: 1,
      pointerEvents: "auto",
      transform: `translate(-50%, 0) translateX(-${String(gap)}px) translateY(-${String(maxStickUp)}px) scale(0.85) rotateY(15deg)`,
      transition,
    };
  }

  if (isRight) {
    return {
      zIndex: 2,
      opacity: 1,
      pointerEvents: "auto",
      transform: `translate(-50%, 0) translateX(${String(gap)}px) translateY(-${String(maxStickUp)}px) scale(0.85) rotateY(-15deg)`,
      transition,
    };
  }

  return {
    zIndex: 1,
    opacity: 0,
    pointerEvents: "none",
    transform:
      "translate(-50%, 0) translateX(0px) translateY(0px) scale(0.74) rotateY(0deg)",
    transition,
  };
}

function goToNextIndex(activeIndex: number, testimonialsLength: number): number {
  return (activeIndex + 1) % testimonialsLength;
}

function goToPreviousIndex(activeIndex: number, testimonialsLength: number): number {
  return (activeIndex - 1 + testimonialsLength) % testimonialsLength;
}

function CircularTestimonialImage({
  isActive,
  testimonial,
}: Readonly<{
  isActive: boolean;
  testimonial: CircularTestimonial;
}>) {
  const imageAlt = testimonial.alt ?? testimonial.name;
  const imageProperties = {
    alt: imageAlt,
    decoding: "async" as const,
    draggable: false,
    loading: isActive ? ("eager" as const) : ("lazy" as const),
  };

  if (testimonial.src.endsWith(".webp")) {
    return <PublicPicture {...imageProperties} src={testimonial.src} />;
  }

  return <img {...imageProperties} src={testimonial.src} />;
}

function CircularTestimonialCopy({
  canAnimateQuoteWords,
  colors,
  fontSizes,
  prefersReducedMotion,
  testimonial,
}: Readonly<{
  canAnimateQuoteWords: boolean;
  colors: Readonly<{
    name: string;
    designation: string;
    testimony: string;
  }>;
  fontSizes: Readonly<{
    name: string;
    designation: string;
    quote: string;
  }>;
  prefersReducedMotion: boolean;
  testimonial: CircularTestimonial;
}>) {
  const quoteUnits = splitCircularTestimonialQuote(testimonial.quote);
  const shouldAnimateQuoteWords = canAnimateQuoteWords && !prefersReducedMotion;

  return (
    <motion.div
      data-circular-testimonial-active
      initial={
        prefersReducedMotion || !canAnimateQuoteWords
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 20 }
      }
      animate={{ opacity: 1, y: 0 }}
      exit={
        prefersReducedMotion || !canAnimateQuoteWords
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: -20 }
      }
      transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: "easeInOut" }}
    >
      <h3
        data-circular-testimonial-name
        data-homepage-testimonial-name
        style={{
          color: colors.name,
          fontSize: fontSizes.name,
        }}
      >
        {testimonial.name}
      </h3>
      <p
        data-circular-testimonial-designation
        data-homepage-testimonial-designation
        style={{ color: colors.designation, fontSize: fontSizes.designation }}
      >
        {testimonial.designation}
      </p>
      <motion.p
        aria-atomic="true"
        aria-live="polite"
        data-circular-testimonial-quote
        data-homepage-testimonial-quote
        style={{ color: colors.testimony, fontSize: fontSizes.quote }}
      >
        {shouldAnimateQuoteWords
          ? quoteUnits.map((word, wordIndex) => (
              <Fragment key={`${testimonial.src}-${String(wordIndex)}`}>
                <motion.span
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  className="circular-testimonial-word"
                  initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                  transition={{
                    delay: 0.025 * wordIndex,
                    duration: 0.22,
                    ease: "easeInOut",
                  }}
                >
                  {word}
                </motion.span>
                {wordIndex < quoteUnits.length - 1 ? " " : null}
              </Fragment>
            ))
          : testimonial.quote}
      </motion.p>
    </motion.div>
  );
}

function CircularTestimonialHiddenCopy({
  testimonial,
}: Readonly<{ testimonial: CircularTestimonial }>) {
  return (
    <div
      aria-hidden="true"
      data-circular-testimonial-hidden-item
      hidden
    >
      <h3>{testimonial.name}</h3>
      <p>{testimonial.designation}</p>
      <p>{testimonial.quote}</p>
    </div>
  );
}

export function CircularTestimonials({
  autoplay = true,
  className,
  colors = {},
  fontSizes = {},
  nextLabel,
  previousLabel,
  testimonials,
}: CircularTestimonialsProps) {
  assertCircularTestimonialsInput({
    autoplay,
    colors,
    fontSizes,
    nextLabel,
    previousLabel,
    testimonials,
  });

  const prefersReducedMotion = useReducedMotion() === true;
  const [activeIndex, setActiveIndex] = useState(0);
  const [canAnimateQuoteWords, setCanAnimateQuoteWords] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [hoveredArrow, setHoveredArrow] = useState<"next" | "previous" | null>(
    null,
  );
  const [isInViewport, setIsInViewport] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const testimonialsRootRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const testimonialsLength = testimonials.length;
  const safeActiveIndex = Math.min(activeIndex, testimonialsLength - 1);
  const activeTestimonial = testimonials[safeActiveIndex];
  const resolvedColors = {
    name: colors.name ?? circularTestimonialsDefaultNameColor,
    designation:
      colors.designation ?? circularTestimonialsDefaultDesignationColor,
    testimony: colors.testimony ?? circularTestimonialsDefaultTestimonyColor,
    arrowBackground:
      colors.arrowBackground ?? circularTestimonialsDefaultArrowBackground,
    arrowForeground:
      colors.arrowForeground ?? circularTestimonialsDefaultArrowForeground,
    arrowHoverBackground:
      colors.arrowHoverBackground ?? circularTestimonialsDefaultArrowHoverBackground,
  };
  const resolvedFontSizes = {
    name: fontSizes.name ?? circularTestimonialsDefaultNameFontSize,
    designation:
      fontSizes.designation ?? circularTestimonialsDefaultDesignationFontSize,
    quote: fontSizes.quote ?? circularTestimonialsDefaultQuoteFontSize,
  };

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current !== null) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((currentIndex) =>
      goToNextIndex(
        Math.min(currentIndex, testimonialsLength - 1),
        testimonialsLength,
      ),
    );
    stopAutoplay();
  }, [stopAutoplay, testimonialsLength]);

  const handlePrevious = useCallback(() => {
    setActiveIndex((currentIndex) =>
      goToPreviousIndex(
        Math.min(currentIndex, testimonialsLength - 1),
        testimonialsLength,
      ),
    );
    stopAutoplay();
  }, [stopAutoplay, testimonialsLength]);

  useEffect(() => {
    setCanAnimateQuoteWords(true);
  }, []);

  useEffect(() => {
    setActiveIndex((currentIndex) =>
      currentIndex < testimonialsLength ? currentIndex : 0,
    );
  }, [testimonialsLength]);

  useEffect(() => {
    const imageContainer = imageContainerRef.current;

    if (!imageContainer) {
      return;
    }

    const handleResize = () => {
      setContainerWidth(imageContainer.offsetWidth || 1200);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const testimonialsRoot = testimonialsRootRef.current;

    if (!testimonialsRoot) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry?.isIntersecting === true);
      },
      { threshold: 0.1 },
    );

    observer.observe(testimonialsRoot);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      !autoplay ||
      !isInViewport ||
      prefersReducedMotion ||
      testimonialsLength <= 1
    ) {
      return;
    }

    autoplayIntervalRef.current = setInterval(() => {
      setActiveIndex((currentIndex) =>
        goToNextIndex(
          Math.min(currentIndex, testimonialsLength - 1),
          testimonialsLength,
        ),
      );
    }, circularTestimonialsAutoplayIntervalMs);

    return stopAutoplay;
  }, [autoplay, isInViewport, prefersReducedMotion, stopAutoplay, testimonialsLength]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      const target = event.target;
      if (target instanceof HTMLElement) {
        if (
          target.isContentEditable ||
          ["BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(target.tagName) ||
          target.closest("[data-homepage-workspace]")
        ) {
          return;
        }
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleNext, handlePrevious]);

  if (!activeTestimonial) {
    throw new Error(
      `CircularTestimonials: no testimonial at activeIndex=${String(safeActiveIndex)} (length=${String(testimonialsLength)})`,
    );
  }

  return (
    <div
      className={cn("circular-testimonials", className)}
      data-circular-testimonials
      data-homepage-animated-testimonials
      ref={testimonialsRootRef}
    >
      <div
        data-circular-testimonials-media
        data-homepage-testimonial-media
        ref={imageContainerRef}
      >
        <div data-circular-testimonials-stage>
          {testimonials.map((testimonial, testimonialIndex) => {
            const isActive = testimonialIndex === safeActiveIndex;

            return (
              <div
                aria-hidden={isActive ? undefined : true}
                data-circular-testimonials-image
                key={`${testimonial.src}-${String(testimonialIndex)}`}
                style={getCircularImageStyle({
                  activeIndex: safeActiveIndex,
                  containerWidth,
                  index: testimonialIndex,
                  prefersReducedMotion,
                  testimonialsLength,
                })}
              >
                <CircularTestimonialImage
                  isActive={isActive}
                  testimonial={testimonial}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div data-circular-testimonials-copy data-homepage-testimonial-copy>
        <div data-circular-testimonials-copy-body>
          <AnimatePresence initial={false} mode="wait">
            <CircularTestimonialCopy
              canAnimateQuoteWords={canAnimateQuoteWords}
              colors={resolvedColors}
              fontSizes={resolvedFontSizes}
              key={`${activeTestimonial.src}-${String(safeActiveIndex)}`}
              prefersReducedMotion={prefersReducedMotion}
              testimonial={activeTestimonial}
            />
          </AnimatePresence>
          <div data-circular-testimonials-hidden-copy>
            {testimonials.map((testimonial, testimonialIndex) =>
              testimonialIndex === safeActiveIndex ? null : (
                <CircularTestimonialHiddenCopy
                  key={`${testimonial.src}-${String(testimonialIndex)}`}
                  testimonial={testimonial}
                />
              ),
            )}
          </div>
        </div>
        <div data-circular-testimonials-controls>
          <button
            aria-label={previousLabel}
            data-circular-testimonials-previous
            onClick={handlePrevious}
            onMouseEnter={() => setHoveredArrow("previous")}
            onMouseLeave={() => setHoveredArrow(null)}
            style={{
              backgroundColor:
                hoveredArrow === "previous"
                  ? resolvedColors.arrowHoverBackground
                  : resolvedColors.arrowBackground,
              color: resolvedColors.arrowForeground,
            }}
            type="button"
          >
            <IconArrowLeft aria-hidden="true" size={28} />
          </button>
          <button
            aria-label={nextLabel}
            data-circular-testimonials-next
            onClick={handleNext}
            onMouseEnter={() => setHoveredArrow("next")}
            onMouseLeave={() => setHoveredArrow(null)}
            style={{
              backgroundColor:
                hoveredArrow === "next"
                  ? resolvedColors.arrowHoverBackground
                  : resolvedColors.arrowBackground,
              color: resolvedColors.arrowForeground,
            }}
            type="button"
          >
            <IconArrowRight aria-hidden="true" size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}
