"use client";

import type { ReactElement } from "react";
import type { PlannerChromeLocale } from "@/src/homepage/homepage-locale";
import { usePlannerChromeLocale } from "@/src/i18n/planner-chrome-locale";

export type PlannerStartupStatusState =
  | {
      kind: "loading";
      message: string;
    }
  | {
      kind: "error";
      message: string;
      onRetry: () => void;
    }
  | {
      kind: "interactive";
    };

export interface PlannerStartupStatusProps {
  state: PlannerStartupStatusState;
}

export function PlannerStartupStatus({
  state,
}: PlannerStartupStatusProps): ReactElement | null {
  const locale = usePlannerChromeLocale();

  if (state.kind === "interactive") {
    return null;
  }

  if (state.kind === "loading") {
    return (
      <div
        aria-live="polite"
        className="planner-startup-status"
        role="status"
      >
        {state.message}
      </div>
    );
  }

  return (
    <div className="planner-startup-status" role="alert">
      <span>{state.message}</span>
      <button onClick={state.onRetry} type="button">
        {readPlannerRetryLabel(locale)}
      </button>
    </div>
  );
}

function readPlannerRetryLabel(locale: PlannerChromeLocale): string {
  if (locale === "en" || locale === "zh") {
    return "Retry";
  }

  if (locale === "ja") {
    return "再試行";
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read planner retry label because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}
