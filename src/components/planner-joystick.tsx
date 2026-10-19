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

type PlannerJoystickLocale = "en" | "zh" | "ru";

type PlannerJoystickProperties = PlannerJoystickIntentHandlers &
  Readonly<{
    isLeftHanded: boolean;
    locale?: PlannerJoystickLocale;
  }>;

const joystickControls: readonly Readonly<{
  direction: PlannerJoystickDirection;
  icon: LucideIcon;
  position: "down" | "left" | "right" | "up";
}>[] = [
  { direction: "ArrowUp", icon: ChevronUp, position: "up" },
  { direction: "ArrowLeft", icon: ChevronLeft, position: "left" },
  { direction: "ArrowRight", icon: ChevronRight, position: "right" },
  { direction: "ArrowDown", icon: ChevronDown, position: "down" },
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
  locale,
  onNudge,
  onPan,
}: PlannerJoystickProperties) {
  const joystickLocale = readPlannerJoystickLocale(locale);
  const hasNudgeIntent = onNudge !== undefined;

  return (
    <div
      aria-label={readPlannerJoystickGroupLabel(hasNudgeIntent, joystickLocale)}
      className={`joystick-outer planner-joystick planner-joystick--${
        isLeftHanded ? "left" : "right"
      }`}
      role="group"
    >
      <div aria-hidden="true" className="joystick-ring" />
      {joystickControls.map((joystickControl) => (
        <button
          aria-label={readPlannerJoystickControlLabel(
            joystickControl.direction,
            hasNudgeIntent ? "nudge" : "pan",
            joystickLocale,
          )}
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

function readPlannerJoystickLocale(
  locale: PlannerJoystickLocale | undefined,
): PlannerJoystickLocale {
  const resolvedLocale = locale ?? "en";
  if (resolvedLocale === "en" || resolvedLocale === "zh" || resolvedLocale === "ru") {
    return resolvedLocale;
  }
  throw new TypeError(
    `Planner joystick locale must be "en", "zh", or "ru"; received ${JSON.stringify(resolvedLocale)}.`,
  );
}

function readPlannerJoystickGroupLabel(
  hasNudgeIntent: boolean,
  locale: PlannerJoystickLocale,
): string {
  if (locale === "en" || locale === "zh") {
    return hasNudgeIntent ? "Selection movement controls" : "Map camera controls";
  }
  if (locale === "ru") {
    return hasNudgeIntent ? "Перемещение выбранного" : "Камера карты";
  }
  throw new TypeError(
    `Planner joystick locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readPlannerJoystickControlLabel(
  direction: PlannerJoystickDirection,
  intent: "nudge" | "pan",
  locale: PlannerJoystickLocale,
): string {
  if (locale === "ru") {
    if (intent === "pan" && direction === "ArrowUp") return "Сдвинуть карту вверх";
    if (intent === "pan" && direction === "ArrowLeft") return "Сдвинуть карту влево";
    if (intent === "pan" && direction === "ArrowRight") return "Сдвинуть карту вправо";
    if (intent === "pan" && direction === "ArrowDown") return "Сдвинуть карту вниз";
    if (intent === "nudge" && direction === "ArrowUp") return "Сдвинуть выбранное вверх";
    if (intent === "nudge" && direction === "ArrowLeft") return "Сдвинуть выбранное влево";
    if (intent === "nudge" && direction === "ArrowRight") return "Сдвинуть выбранное вправо";
    if (intent === "nudge" && direction === "ArrowDown") return "Сдвинуть выбранное вниз";
    throw new TypeError(
      `Planner joystick control must be a pan or nudge cardinal direction; received intent ${JSON.stringify(intent)} and direction ${JSON.stringify(direction)}.`,
    );
  }
  if (locale === "en" || locale === "zh") {
    if (intent === "pan" && direction === "ArrowUp") return "Pan map up";
    if (intent === "pan" && direction === "ArrowLeft") return "Pan map left";
    if (intent === "pan" && direction === "ArrowRight") return "Pan map right";
    if (intent === "pan" && direction === "ArrowDown") return "Pan map down";
    if (intent === "nudge" && direction === "ArrowUp") return "Move selection up";
    if (intent === "nudge" && direction === "ArrowLeft") return "Move selection left";
    if (intent === "nudge" && direction === "ArrowRight") return "Move selection right";
    if (intent === "nudge" && direction === "ArrowDown") return "Move selection down";
    throw new TypeError(
      `Planner joystick control must be a pan or nudge cardinal direction; received intent ${JSON.stringify(intent)} and direction ${JSON.stringify(direction)}.`,
    );
  }
  throw new TypeError(
    `Planner joystick locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}
