"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HomepageLocale } from "../homepage/homepage-locale";
import { subscribeToEditorInteractivePerformanceMark } from "../performance/subscribe-to-editor-interactive-performance-mark";
import { PlannerStartupStatus } from "./planner-startup-status";

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

export function loadPlannerHostWhenPlannerSectionIntersects(
  plannerSection: HTMLElement,
  loadPlannerHost: () => void,
  intersectionObserverConstructor: typeof IntersectionObserver,
): () => void {
  if (typeof intersectionObserverConstructor !== "function") {
    throw new TypeError(
      `IntersectionObserver must be a function to watch the planner section. Received typeof ${typeof intersectionObserverConstructor}, value ${String(intersectionObserverConstructor)}.`,
    );
  }

  if (plannerSection === null) {
    throw new Error(
      `Planner section ref is null. Received ${String(plannerSection)}.`,
    );
  }

  let hasDisconnectedPlannerSectionObserver = false;
  let hasLoadedPlannerHost = false;
  const plannerSectionObserver = new intersectionObserverConstructor(
    (plannerSectionEntries) => {
      if (plannerSectionEntries.length === 0) {
        throw new Error(
          `IntersectionObserver reported no planner section entries. Received length ${String(plannerSectionEntries.length)}.`,
        );
      }

      const isPlannerSectionIntersecting = plannerSectionEntries.some(
        (plannerSectionEntry) => plannerSectionEntry.isIntersecting,
      );
      if (!isPlannerSectionIntersecting) {
        return;
      }

      if (hasLoadedPlannerHost) {
        return;
      }

      hasLoadedPlannerHost = true;
      loadPlannerHost();
      disconnectPlannerSectionObserver();
    },
  );

  function disconnectPlannerSectionObserver(): void {
    if (hasDisconnectedPlannerSectionObserver) {
      return;
    }

    hasDisconnectedPlannerSectionObserver = true;
    plannerSectionObserver.disconnect();
  }

  plannerSectionObserver.observe(plannerSection);

  return disconnectPlannerSectionObserver;
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

  useEffect(() => {
    const plannerSection = homepagePlannerSectionReference.current;

    if (plannerSection === null) {
      throw new Error(
        "HomepagePlannerSlot cannot watch the planner section because its ref is null.",
      );
    }

    return loadPlannerHostWhenPlannerSectionIntersects(
      plannerSection,
      () => {
        setShouldLoadPlannerHost(true);
      },
      IntersectionObserver,
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
        <PlannerStartupStatus
          locale={locale}
          state={{ kind: "loading", message: "Loading local planner resources…" }}
        />
      )}
    </section>
  );
}
