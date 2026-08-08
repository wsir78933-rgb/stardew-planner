import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  type LucideIcon,
} from "lucide-react";

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
  icon: LucideIcon;
  nudgeLabel: string;
  panLabel: string;
  position: "down" | "left" | "right" | "up";
}>[] = [
  {
    direction: "ArrowUp",
    icon: ChevronUp,
    nudgeLabel: "Move selection up",
    panLabel: "Pan map up",
    position: "up",
  },
  {
    direction: "ArrowLeft",
    icon: ChevronLeft,
    nudgeLabel: "Move selection left",
    panLabel: "Pan map left",
    position: "left",
  },
  {
    direction: "ArrowRight",
    icon: ChevronRight,
    nudgeLabel: "Move selection right",
    panLabel: "Pan map right",
    position: "right",
  },
  {
    direction: "ArrowDown",
    icon: ChevronDown,
    nudgeLabel: "Move selection down",
    panLabel: "Pan map down",
    position: "down",
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
      className={`joystick-outer planner-joystick planner-joystick--${
        isLeftHanded ? "left" : "right"
      }`}
      role="group"
    >
      <div aria-hidden="true" className="joystick-ring" />
      {joystickControls.map((joystickControl) => (
        <button
          aria-label={
            hasNudgeIntent
              ? joystickControl.nudgeLabel
              : joystickControl.panLabel
          }
          className={`arrow-btn arrow-btn-${joystickControl.position} planner-joystick__button planner-joystick__button--${joystickControl.direction.toLowerCase()}`}
          key={joystickControl.direction}
          onClick={() =>
            dispatchPlannerJoystickDirection(
              { onNudge, onPan },
              joystickControl.direction,
            )
          }
          type="button"
        >
          <joystickControl.icon aria-hidden="true" size={18} strokeWidth={2} />
        </button>
      ))}
      <div aria-hidden="true" className="joystick-knob" />
    </div>
  );
}
