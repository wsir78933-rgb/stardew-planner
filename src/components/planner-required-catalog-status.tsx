"use client";

import type { ReactNode } from "react";
import type { PlannerChromeLocale } from "@/src/homepage/homepage-locale";
import { usePlannerChromeLocale } from "@/src/i18n/planner-chrome-locale";

export type PlannerRequiredCatalogStatusState =
  | Readonly<{ kind: "loading" }>
  | Readonly<{
      kind: "error";
      message: string;
      onRetry?: () => void;
    }>;

export type PlannerRequiredCatalogGateState =
  | Readonly<{ kind: "ready" }>
  | PlannerRequiredCatalogStatusState;

export function PlannerRequiredCatalogGate({
  children,
  state,
}: Readonly<{
  children?: ReactNode;
  state: PlannerRequiredCatalogGateState;
}>) {
  if (state.kind === "ready") return children;
  return <PlannerRequiredCatalogStatus state={state} />;
}

export function PlannerRequiredCatalogStatus({
  state,
}: Readonly<{ state: PlannerRequiredCatalogStatusState }>) {
  const locale = usePlannerChromeLocale();

  if (state.kind === "loading") {
    return (
      <p aria-live="polite" role="status">
        {readPlacedCatalogLoadingMessage(locale)}
      </p>
    );
  }

  return (
    <div role="alert">
      <p>{state.message}</p>
      {state.onRetry === undefined ? null : (
        <button onClick={state.onRetry} type="button">
          {readPlacedCatalogRetryLabel(locale)}
        </button>
      )}
    </div>
  );
}

function readPlacedCatalogLoadingMessage(locale: PlannerChromeLocale): string {
  if (locale === "en" || locale === "zh") {
    return "Loading placed item catalog…";
  }

  if (locale === "ja") {
    return "配置済みアイテムのカタログを読み込んでいます…";
  }

  if (locale === "ru") {
    return "Загрузка каталога размещённых предметов…";
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read placed catalog loading message because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function readPlacedCatalogRetryLabel(locale: PlannerChromeLocale): string {
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
    `Cannot read placed catalog retry label because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}
