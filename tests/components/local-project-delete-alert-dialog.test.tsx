import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as AlertDialog from "radix-ui/alert-dialog";
import { describe, expect, it } from "vitest";
import {
  LocalProjectDeleteAlertDialogContent,
  restoreLocalProjectDeleteButtonFocus,
} from "../../src/components/local-project-delete-alert-dialog";

describe("local project delete alert dialog", () => {
  it("names the project and exposes explicit destructive and cancellation actions", () => {
    const confirmationMarkup = renderToStaticMarkup(
      createElement(
        AlertDialog.Root,
        { open: true },
        createElement(LocalProjectDeleteAlertDialogContent, {
          deleteButtonFocusTarget: null,
          projectTitle: "Forest Farm",
          onCancel: () => undefined,
          onConfirm: () => false,
        }),
      ),
    );

    expect(confirmationMarkup).toContain("Forest Farm");
    expect(confirmationMarkup).toContain("Delete project");
    expect(confirmationMarkup).toContain("Keep project");
  });

  it("prevents default close focus and restores the connected Delete button", () => {
    let preventDefaultCallCount = 0;
    let focusCallCount = 0;

    restoreLocalProjectDeleteButtonFocus(
      {
        preventDefault(): void {
          preventDefaultCallCount += 1;
        },
      },
      {
        isConnected: true,
        focus(): void {
          focusCallCount += 1;
        },
      },
    );

    expect(preventDefaultCallCount).toBe(1);
    expect(focusCallCount).toBe(1);
  });

  it("fails fast when the original Delete button focus target is missing", () => {
    expect(() =>
      restoreLocalProjectDeleteButtonFocus(
        { preventDefault: () => undefined },
        null,
      ),
    ).toThrow(/original Delete button.*missing/);
  });

  it("fails fast when the original Delete button focus target is disconnected", () => {
    expect(() =>
      restoreLocalProjectDeleteButtonFocus(
        { preventDefault: () => undefined },
        {
          isConnected: false,
          focus: () => undefined,
        },
      ),
    ).toThrow(/original Delete button.*disconnected/);
  });
});
