import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  dispatchPlannerJoystickDirection,
  PlannerJoystick,
} from "../../src/components/planner-joystick";

describe("planner joystick", () => {
  it("renders four accessible camera-pan controls in right-hand mode", () => {
    const markup = renderToStaticMarkup(
      createElement(PlannerJoystick, {
        isLeftHanded: false,
        onPan: () => undefined,
      }),
    );

    expect(markup).toContain('aria-label="Map camera controls"');
    expect(markup).toContain('aria-label="Pan map up"');
    expect(markup).toContain('aria-label="Pan map right"');
    expect(markup).toContain('planner-joystick--right');
  });

  it("uses the left-hand modifier without changing available controls", () => {
    const markup = renderToStaticMarkup(
      createElement(PlannerJoystick, {
        isLeftHanded: true,
        onPan: () => undefined,
      }),
    );

    expect(markup).toContain('planner-joystick--left');
    expect(markup).toContain('aria-label="Pan map down"');
    expect(markup).toContain('aria-label="Pan map left"');
  });

  it("describes its arrows as selection movement controls when nudge intent is available", () => {
    const markup = renderToStaticMarkup(
      createElement(PlannerJoystick, {
        isLeftHanded: false,
        onNudge: () => undefined,
        onPan: () => undefined,
      }),
    );

    expect(markup).toContain('aria-label="Selection movement controls"');
    expect(markup).toContain('aria-label="Move selection up"');
    expect(markup).toContain('aria-label="Move selection right"');
    expect(markup).not.toContain('aria-label="Pan map up"');
  });

  it("routes a joystick arrow to selection nudge without panning the camera", () => {
    const invokedIntents: string[] = [];

    dispatchPlannerJoystickDirection(
      {
        onNudge: (direction) => invokedIntents.push(`nudge:${direction}`),
        onPan: (direction) => invokedIntents.push(`pan:${direction}`),
      },
      "ArrowRight",
    );

    expect(invokedIntents).toEqual(["nudge:ArrowRight"]);
  });

  it("routes a joystick arrow to camera pan when no selection nudge is available", () => {
    const invokedIntents: string[] = [];

    dispatchPlannerJoystickDirection(
      {
        onPan: (direction) => invokedIntents.push(`pan:${direction}`),
      },
      "ArrowLeft",
    );

    expect(invokedIntents).toEqual(["pan:ArrowLeft"]);
  });
});
