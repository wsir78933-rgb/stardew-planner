"use client";

import { useEffect, useState, type ComponentType } from "react";
import { PlannerStartupStatus } from "./planner-startup-status";

export type PlannerRuntimeKind = "react" | "reference";

type PlannerRuntimeComponent = ComponentType;

type PlannerRuntimeSelectionState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; runtime: PlannerRuntimeComponent };

type PlannerRuntimeLoaders = Readonly<{
  react: () => Promise<PlannerRuntimeComponent>;
  reference: () => Promise<PlannerRuntimeComponent>;
}>;

export type EditorRuntimeSelectorProperties = Readonly<{
  plannerRuntimeSearch?: string;
  loadPlannerRuntime?: (
    plannerRuntimeKind: PlannerRuntimeKind,
  ) => Promise<PlannerRuntimeComponent>;
}>;

const defaultPlannerRuntimeKind: PlannerRuntimeKind = "react";

export function resolvePlannerRuntimeKind(
  plannerRuntimeSearch: string,
): PlannerRuntimeKind {
  const plannerRuntimeValues = new URLSearchParams(
    plannerRuntimeSearch,
  ).getAll("plannerRuntime");

  if (plannerRuntimeValues.length === 0) {
    return defaultPlannerRuntimeKind;
  }

  if (plannerRuntimeValues.length !== 1) {
    throw new Error(
      `Planner runtime query must contain at most one plannerRuntime value; received ${JSON.stringify(plannerRuntimeValues)}.`,
    );
  }

  const [plannerRuntimeValue] = plannerRuntimeValues;
  if (plannerRuntimeValue === "react" || plannerRuntimeValue === "reference") {
    return plannerRuntimeValue;
  }

  return defaultPlannerRuntimeKind;
}

export function createPlannerRuntimeLoader(
  plannerRuntimeLoaders: PlannerRuntimeLoaders,
): (
  plannerRuntimeKind: PlannerRuntimeKind,
) => Promise<PlannerRuntimeComponent> {
  return (plannerRuntimeKind) => plannerRuntimeLoaders[plannerRuntimeKind]();
}

export const loadSelectedPlannerRuntime = createPlannerRuntimeLoader({
  react: async () => {
    const { ReactPlannerHost } = await import("./react-planner-host");
    return ReactPlannerHost;
  },
  reference: async () => {
    const { ReferenceRuntimeHost } = await import("./reference-runtime-host");
    return ReferenceRuntimeHost;
  },
});

export function describePlannerRuntimeLoadFailure(
  plannerRuntimeKind: PlannerRuntimeKind,
  caughtError: unknown,
): string {
  if (caughtError instanceof Error) {
    return `Could not load ${plannerRuntimeKind} planner runtime: ${caughtError.message}`;
  }

  return `Could not load ${plannerRuntimeKind} planner runtime: received non-Error value ${JSON.stringify(caughtError)}.`;
}

export function EditorRuntimeSelector({
  plannerRuntimeSearch,
  loadPlannerRuntime = loadSelectedPlannerRuntime,
}: EditorRuntimeSelectorProperties) {
  const [runtimeLoadAttempt, setRuntimeLoadAttempt] = useState(0);
  const [plannerRuntimeSelectionState, setPlannerRuntimeSelectionState] =
    useState<PlannerRuntimeSelectionState>({ kind: "loading" });

  useEffect(() => {
    const resolvedPlannerRuntimeSearch =
      plannerRuntimeSearch ?? window.location.search;
    const plannerRuntimeKind = resolvePlannerRuntimeKind(
      resolvedPlannerRuntimeSearch,
    );
    let isCurrentSelectorInstance = true;

    setPlannerRuntimeSelectionState({ kind: "loading" });

    void loadPlannerRuntime(plannerRuntimeKind).then(
      (PlannerRuntime) => {
        if (isCurrentSelectorInstance) {
          setPlannerRuntimeSelectionState({
            kind: "ready",
            runtime: PlannerRuntime,
          });
        }
      },
      (caughtError: unknown) => {
        if (isCurrentSelectorInstance) {
          setPlannerRuntimeSelectionState({
            kind: "error",
            message: describePlannerRuntimeLoadFailure(
              plannerRuntimeKind,
              caughtError,
            ),
          });
        }
      },
    );

    return () => {
      isCurrentSelectorInstance = false;
    };
  }, [loadPlannerRuntime, plannerRuntimeSearch, runtimeLoadAttempt]);

  if (plannerRuntimeSelectionState.kind === "loading") {
    return (
      <PlannerStartupStatus
        state={{ kind: "loading", message: "Loading planner…" }}
      />
    );
  }

  if (plannerRuntimeSelectionState.kind === "error") {
    return (
      <PlannerStartupStatus
        state={{
          kind: "error",
          message: plannerRuntimeSelectionState.message,
          onRetry: () => {
            setRuntimeLoadAttempt((currentAttempt) => currentAttempt + 1);
          },
        }}
      />
    );
  }

  const SelectedPlannerRuntime = plannerRuntimeSelectionState.runtime;

  return <SelectedPlannerRuntime />;
}
