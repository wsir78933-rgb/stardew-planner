"use client";

import type { ReactElement } from "react";
import {
  type HomepageLocale,
  type PlannerChromeLocale,
} from "@/src/homepage/homepage-locale";
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
  locale?: HomepageLocale;
  state: PlannerStartupStatusState;
}

export function PlannerStartupStatus({
  locale,
  state,
}: PlannerStartupStatusProps): ReactElement | null {
  const chromeLocale = usePlannerChromeLocale();
  const retryLocale = locale === undefined ? chromeLocale : readPlannerStartupLocale(locale);

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
        {readPlannerRetryLabel(retryLocale)}
      </button>
    </div>
  );
}

function readPlannerStartupLocale(locale: HomepageLocale): PlannerChromeLocale {
  if (locale === "en") {
    return "en";
  }
  if (locale === "zh-CN") {
    return "zh";
  }
  if (locale === "ja") {
    return "ja";
  }
  if (locale === "ru") {
    return "ru";
  }
  const unsupportedLocale: never = locale;
  throw new TypeError(
    `Planner startup locale must be "en", "zh-CN", or "ru"; received ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function readPlannerRetryLabel(locale: PlannerChromeLocale): string {
  if (locale === "en" || locale === "zh") {
    return "Retry";
  }

  if (locale === "ja") {
    return "再試行";
  }

  if (locale === "ru") {
    return "Повторить";
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read planner retry label because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}
