"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPublicPreviewSource } from "../assets/public-preview-source";
import type { HomepageLocale } from "../homepage/homepage-locale";
import { subscribeToEditorInteractivePerformanceMark } from "../performance/subscribe-to-editor-interactive-performance-mark";

const homepagePlannerPreviewSource = createPublicPreviewSource(
  "maps/previews/Farm.png",
);

const HomepagePlannerReactHost = dynamic(
  () =>
    import("./react-planner-host").then(
      (plannerHostModule) => plannerHostModule.ReactPlannerHost,
    ),
  { ssr: false },
);

type HomepagePlannerSlotProps = Readonly<{
  locale: HomepageLocale;
  previewImageAlt: string;
}>;

function assertHomepagePlannerSlotNonEmptyString(
  fieldName: "locale" | "previewImageAlt",
  fieldValue: unknown,
): asserts fieldValue is string {
  if (typeof fieldValue !== "string" || fieldValue.length === 0) {
    throw new TypeError(
      `HomepagePlannerSlot ${fieldName} must be a non-empty string; received ${JSON.stringify(fieldValue)}.`,
    );
  }
}

export function HomepagePlannerSlot({
  locale,
  previewImageAlt,
}: HomepagePlannerSlotProps) {
  const [shouldLoadPlannerHost, setShouldLoadPlannerHost] = useState(false);
  const [isEditorInteractive, setIsEditorInteractive] = useState(false);
  const homepagePlannerSectionReference = useRef<HTMLElement | null>(null);
  const handleAlignPlanner = useCallback(() => {
    const plannerSection = homepagePlannerSectionReference.current;

    if (plannerSection === null) {
      throw new Error(
        "HomepagePlannerSlot cannot align the planner section because its ref is null.",
      );
    }

    plannerSection.scrollIntoView({
      behavior: "auto",
      block: "start",
      inline: "nearest",
    });
  }, []);

  useEffect(() => {
    setShouldLoadPlannerHost(true);

    return subscribeToEditorInteractivePerformanceMark(
      () => {
        setIsEditorInteractive(true);
      },
      {
        PerformanceObserverConstructor: PerformanceObserver,
        performanceTimeline: performance,
      },
    );
  }, []);

  assertHomepagePlannerSlotNonEmptyString("locale", locale);
  assertHomepagePlannerSlotNonEmptyString("previewImageAlt", previewImageAlt);

  return (
    <section
      data-homepage-product-stage
      data-homepage-workspace
      id="planner"
      ref={homepagePlannerSectionReference}
    >
      {shouldLoadPlannerHost ? (
        <HomepagePlannerReactHost
          locale={locale}
          onAlignPlanner={handleAlignPlanner}
        />
      ) : null}
      {isEditorInteractive ? null : (
        <img
          alt={previewImageAlt}
          data-homepage-planner-preview
          decoding="async"
          height={260}
          loading="lazy"
          src={homepagePlannerPreviewSource}
          width={320}
        />
      )}
    </section>
  );
}
