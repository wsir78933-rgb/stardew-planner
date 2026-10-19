import type { HomepageLocale } from "../homepage/homepage-locale";

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
}: PlannerStartupStatusProps): React.ReactElement | null {
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
        {readPlannerStartupRetryLabel(locale)}
      </button>
    </div>
  );
}

function readPlannerStartupRetryLabel(locale: HomepageLocale | undefined): string {
  const resolvedLocale = locale ?? "en";
  if (resolvedLocale === "en" || resolvedLocale === "zh-CN") {
    return "Retry";
  }
  if (resolvedLocale === "ru") {
    return "Повторить";
  }
  throw new TypeError(
    `Planner startup locale must be "en", "zh-CN", or "ru"; received ${JSON.stringify(resolvedLocale)}.`,
  );
}
