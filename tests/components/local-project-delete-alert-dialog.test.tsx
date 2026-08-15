import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as AlertDialog from "radix-ui/alert-dialog";
import { describe, expect, it } from "vitest";
import {
  LocalProjectDeleteAlertDialogContent,
  restoreLocalProjectDeleteButtonFocus,
} from "../../src/components/local-project-delete-alert-dialog";
import { getSaveModalCopy } from "../../src/i18n/save-modal-copy";

describe("local project delete alert dialog", () => {
  it("preserves the localized deletion sentence around a strongly emphasized project title", () => {
    const confirmationMarkup = renderToStaticMarkup(
      createElement(
        AlertDialog.Root,
        { open: true },
        createElement(LocalProjectDeleteAlertDialogContent, {
          deleteButtonFocusTarget: null,
          copy: getSaveModalCopy("zh-CN").deleteProject,
          projectTitle: "Forest Farm",
          onCancel: () => undefined,
          onConfirm: () => false,
        }),
      ),
    );

    expect(confirmationMarkup).toContain("Forest Farm");
    expect(confirmationMarkup).toContain("删除本地项目？");
    expect(confirmationMarkup).toContain("要从此浏览器删除“<strong>Forest Farm</strong>”吗？此操作无法撤销。");
    expect(confirmationMarkup).toContain("删除项目");
    expect(confirmationMarkup).toContain("保留项目");
  });

  it("preserves the HEAD English deletion sentence without quotation marks", () => {
    const confirmationMarkup = renderToStaticMarkup(
      createElement(
        AlertDialog.Root,
        { open: true },
        createElement(LocalProjectDeleteAlertDialogContent, {
          deleteButtonFocusTarget: null,
          copy: getSaveModalCopy("en").deleteProject,
          projectTitle: "Forest Farm",
          onCancel: () => undefined,
          onConfirm: () => false,
        }),
      ),
    );

    expect(confirmationMarkup).toContain(
      "Delete <strong>Forest Farm</strong> from this browser? This cannot be undone.",
    );
    expect(confirmationMarkup).not.toContain('Delete "Forest Farm"');
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
