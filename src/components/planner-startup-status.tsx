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
        Retry
      </button>
    </div>
  );
}
