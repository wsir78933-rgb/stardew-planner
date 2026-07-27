export type PlannerJoystickDirection =
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUp";

type PlannerJoystickIntentHandlers = Readonly<{
  onNudge?: (direction: PlannerJoystickDirection) => void;
  onPan: (direction: PlannerJoystickDirection) => void;
}>;

type PlannerJoystickProperties = PlannerJoystickIntentHandlers &
  Readonly<{
    isLeftHanded: boolean;
  }>;

const joystickControls: readonly Readonly<{
  direction: PlannerJoystickDirection;
  glyph: string;
  nudgeLabel: string;
  panLabel: string;
}>[] = [
  {
    direction: "ArrowUp",
    glyph: "↑",
    nudgeLabel: "Move selection up",
    panLabel: "Pan map up",
  },
  {
    direction: "ArrowLeft",
    glyph: "←",
    nudgeLabel: "Move selection left",
    panLabel: "Pan map left",
  },
  {
    direction: "ArrowRight",
    glyph: "→",
    nudgeLabel: "Move selection right",
    panLabel: "Pan map right",
  },
  {
    direction: "ArrowDown",
    glyph: "↓",
    nudgeLabel: "Move selection down",
    panLabel: "Pan map down",
  },
];

export function dispatchPlannerJoystickDirection(
  plannerJoystickIntentHandlers: PlannerJoystickIntentHandlers,
  direction: PlannerJoystickDirection,
): void {
  if (plannerJoystickIntentHandlers.onNudge !== undefined) {
    plannerJoystickIntentHandlers.onNudge(direction);
    return;
  }

  plannerJoystickIntentHandlers.onPan(direction);
}

export function PlannerJoystick({
  isLeftHanded,
  onNudge,
  onPan,
}: PlannerJoystickProperties) {
  const hasNudgeIntent = onNudge !== undefined;

  return (
    <div
      aria-label={
        hasNudgeIntent ? "Selection movement controls" : "Map camera controls"
      }
      className={`planner-joystick planner-joystick--${
        isLeftHanded ? "left" : "right"
      }`}
      role="group"
    >
      {joystickControls.map((joystickControl) => (
        <button
          aria-label={
            hasNudgeIntent
              ? joystickControl.nudgeLabel
              : joystickControl.panLabel
          }
          className={`planner-joystick__button planner-joystick__button--${joystickControl.direction.toLowerCase()}`}
          key={joystickControl.direction}
          onClick={() =>
            dispatchPlannerJoystickDirection(
              { onNudge, onPan },
              joystickControl.direction,
            )
          }
          type="button"
        >
          {joystickControl.glyph}
        </button>
      ))}
    </div>
  );
}
