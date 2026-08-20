"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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
    <section data-homepage-product-stage data-homepage-workspace id="planner">
      {shouldLoadPlannerHost ? (
        <HomepagePlannerReactHost locale={locale} />
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
