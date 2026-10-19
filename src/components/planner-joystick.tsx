"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  type LucideIcon,
} from "lucide-react";
import type { PlannerChromeLocale } from "@/src/homepage/homepage-locale";
import { usePlannerChromeLocale } from "@/src/i18n/planner-chrome-locale";

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
  onNudge,
  onPan,
}: PlannerJoystickProperties) {
  const locale = usePlannerChromeLocale();
  const hasNudgeIntent = onNudge !== undefined;
  const joystickCopy = readJoystickCopy(locale);

  return (
    <div
      aria-label={
        hasNudgeIntent ? joystickCopy.selectionGroup : joystickCopy.cameraGroup
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
              ? joystickCopy.nudge[joystickControl.direction]
              : joystickCopy.pan[joystickControl.direction]
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

function readJoystickCopy(locale: PlannerChromeLocale): Readonly<{
  cameraGroup: string;
  nudge: Readonly<Record<PlannerJoystickDirection, string>>;
  pan: Readonly<Record<PlannerJoystickDirection, string>>;
  selectionGroup: string;
}> {
  if (locale === "en" || locale === "zh") {
    return {
      cameraGroup: "Map camera controls",
      nudge: {
        ArrowDown: "Move selection down",
        ArrowLeft: "Move selection left",
        ArrowRight: "Move selection right",
        ArrowUp: "Move selection up",
      },
      pan: {
        ArrowDown: "Pan map down",
        ArrowLeft: "Pan map left",
        ArrowRight: "Pan map right",
        ArrowUp: "Pan map up",
      },
      selectionGroup: "Selection movement controls",
    };
  }

  if (locale === "ja") {
    return {
      cameraGroup: "マップのカメラ操作",
      nudge: {
        ArrowDown: "選択を下へ移動",
        ArrowLeft: "選択を左へ移動",
        ArrowRight: "選択を右へ移動",
        ArrowUp: "選択を上へ移動",
      },
      pan: {
        ArrowDown: "マップを下へ移動",
        ArrowLeft: "マップを左へ移動",
        ArrowRight: "マップを右へ移動",
        ArrowUp: "マップを上へ移動",
      },
      selectionGroup: "選択の移動操作",
    };
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read joystick labels because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}
