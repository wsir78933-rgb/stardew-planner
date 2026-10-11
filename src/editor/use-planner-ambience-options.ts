"use client";

import { useEffect, useState } from "react";
import {
  createInitialPlannerAmbienceOptions,
  plannerAmbienceOptionsStorageKey,
  restorePlannerAmbienceOptions,
  type PlannerAmbienceOptions,
} from "./planner-ambience-options";

export type PlannerAmbienceOptionsState = Readonly<{
  plannerAmbienceOptions: PlannerAmbienceOptions;
  setPlannerAmbienceOptions(nextPlannerAmbienceOptions: unknown): void;
}>;

export function usePlannerAmbienceOptions(): PlannerAmbienceOptionsState {
  const [plannerAmbienceOptions, setPlannerAmbienceOptionsState] = useState(
    createInitialPlannerAmbienceOptions,
  );
  const [hasRestoredPlannerAmbienceOptions, setHasRestoredPlannerAmbienceOptions] =
    useState(false);

  useEffect(() => {
    const storedOptions = window.localStorage.getItem(
      plannerAmbienceOptionsStorageKey,
    );
    if (storedOptions !== null) {
      setPlannerAmbienceOptionsState(
        restoreStoredPlannerAmbienceOptions(storedOptions),
      );
    }
    setHasRestoredPlannerAmbienceOptions(true);
  }, []);

  useEffect(() => {
    if (!hasRestoredPlannerAmbienceOptions) {
      return;
    }

    window.localStorage.setItem(
      plannerAmbienceOptionsStorageKey,
      JSON.stringify(plannerAmbienceOptions),
    );
  }, [hasRestoredPlannerAmbienceOptions, plannerAmbienceOptions]);

  return {
    plannerAmbienceOptions,
    setPlannerAmbienceOptions(nextPlannerAmbienceOptions): void {
      setPlannerAmbienceOptionsState(
        restorePlannerAmbienceOptions(nextPlannerAmbienceOptions),
      );
    },
  };
}

function restoreStoredPlannerAmbienceOptions(
  storedOptions: string,
): PlannerAmbienceOptions {
  let parsedOptions: unknown;
  try {
    parsedOptions = JSON.parse(storedOptions);
  } catch (caughtError) {
    if (caughtError instanceof SyntaxError) {
      throw new TypeError(
        `Stored planner ambience options under ${JSON.stringify(plannerAmbienceOptionsStorageKey)} must be valid JSON; received ${JSON.stringify(storedOptions)}.`,
        { cause: caughtError },
      );
    }

    throw caughtError;
  }

  return restorePlannerAmbienceOptions(parsedOptions);
}
