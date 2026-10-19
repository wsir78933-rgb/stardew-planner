"use client";

import type { ReactNode } from "react";
import type { HomepageLocale } from "../homepage/homepage-locale";

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
  locale,
  state,
}: Readonly<{
  children?: ReactNode;
  locale?: HomepageLocale;
  state: PlannerRequiredCatalogGateState;
}>) {
  if (state.kind === "ready") return children;
  return <PlannerRequiredCatalogStatus locale={locale} state={state} />;
}

export function PlannerRequiredCatalogStatus({
  locale,
  state,
}: Readonly<{
  locale?: HomepageLocale;
  state: PlannerRequiredCatalogStatusState;
}>) {
  if (state.kind === "loading") {
    return (
      <p aria-live="polite" role="status">
        {readRequiredCatalogLoadingLabel(locale)}
      </p>
    );
  }

  return (
    <div role="alert">
      <p>{state.message}</p>
      {state.onRetry === undefined ? null : (
        <button onClick={state.onRetry} type="button">
          {readRequiredCatalogRetryLabel(locale)}
        </button>
      )}
    </div>
  );
}

function readRequiredCatalogLocale(locale: HomepageLocale | undefined): HomepageLocale {
  const resolvedLocale = locale ?? "en";
  if (resolvedLocale === "en" || resolvedLocale === "zh-CN" || resolvedLocale === "ru") {
    return resolvedLocale;
  }
  throw new TypeError(
    `Required catalog locale must be "en", "zh-CN", or "ru"; received ${JSON.stringify(resolvedLocale)}.`,
  );
}

function readRequiredCatalogLoadingLabel(locale: HomepageLocale | undefined): string {
  const resolvedLocale = readRequiredCatalogLocale(locale);
  if (resolvedLocale === "en" || resolvedLocale === "zh-CN") {
    return "Loading placed item catalog…";
  }
  return "Загрузка каталога размещённых предметов…";
}

function readRequiredCatalogRetryLabel(locale: HomepageLocale | undefined): string {
  const resolvedLocale = readRequiredCatalogLocale(locale);
  if (resolvedLocale === "en" || resolvedLocale === "zh-CN") {
    return "Retry";
  }
  return "Повторить";
}
