"use client";

import type { ReactNode } from "react";

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
  if (state.kind === "loading") {
    return (
      <p aria-live="polite" role="status">
        Loading placed item catalog…
      </p>
    );
  }

  return (
    <div role="alert">
      <p>{state.message}</p>
      {state.onRetry === undefined ? null : (
        <button onClick={state.onRetry} type="button">
          Retry
        </button>
      )}
    </div>
  );
}
