"use client";

import { useEffect, useState } from "react";
import type { ToolsPageCopy } from "../i18n/tools-page-copy";
import { isProductionPlanStateValidationError, parseProductionPlanState, productionPlanStateStorageKey } from "../production-tools/production-plan-state";
import { isBrowserStorageFailure, readBrowserToolStorage } from "./browser-tool-storage";
import {
  parseProductionPlanStorage,
  productionPlanStorageKey,
  type ProductionPlanRecord,
} from "./production-plan-record";

type ProductionPlanSummaryProperties = Readonly<{
  copy: ToolsPageCopy;
}>;

export function ProductionPlanSummary({ copy }: ProductionPlanSummaryProperties) {
  const [summary, setSummary] = useState(copy.home.noCurrentPlan);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    try {
      const currentStateText = readBrowserToolStorage(productionPlanStateStorageKey);
      if (currentStateText !== null) {
        const state = parseProductionPlanState(currentStateText);
        setSummary(`${state.current.input.inventory.length} ${copy.planConfirm.lineCount}`);
        setFailed(false);
        return;
      }
      const storageText = readBrowserToolStorage(productionPlanStorageKey);
      if (storageText === null) {
        setSummary(copy.home.noCurrentPlan);
        setFailed(false);
        return;
      }

      const plan = parseProductionPlanStorage(storageText);
      setSummary(describeProductionPlan(plan, copy));
      setFailed(false);
    } catch (error) {
      if (isBrowserStorageFailure(error)) {
        setSummary(copy.frame.saveFailed);
        setFailed(true);
        return;
      }

      if (isProductionPlanStateValidationError(error) || (error instanceof Error && error.message.includes("Received:"))) {
        setSummary(error.message);
        setFailed(true);
        return;
      }

      throw error;
    }
  }, [copy]);

  return (
    <p role={failed ? "alert" : undefined}>
      {copy.home.currentPlanLabel}: {summary}
    </p>
  );
}

function describeProductionPlan(plan: ProductionPlanRecord, copy: ToolsPageCopy): string {
  return `${plan.lines.length} ${copy.planConfirm.lineCount}`;
}
