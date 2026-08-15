import type { EditorModalId } from "../editor/editor-view-state";

export type PlannerModalPageScrollLockStyle = Pick<
  CSSStyleDeclaration,
  "getPropertyPriority" | "getPropertyValue" | "removeProperty" | "setProperty"
>;

export function isPlannerModalLayerOpen({
  editorModalId,
  hasImportedGameSaveResult,
}: Readonly<{
  editorModalId: EditorModalId | null;
  hasImportedGameSaveResult: boolean;
}>): boolean {
  return editorModalId !== null || hasImportedGameSaveResult;
}

export function lockPlannerModalPageScroll(
  pageBodyStyle: PlannerModalPageScrollLockStyle,
): () => void {
  const previousOverflowY = pageBodyStyle.getPropertyValue("overflow-y");
  const previousOverflowYPriority =
    pageBodyStyle.getPropertyPriority("overflow-y");

  pageBodyStyle.setProperty("overflow-y", "hidden", "important");

  return () => {
    if (previousOverflowY === "") {
      pageBodyStyle.removeProperty("overflow-y");
      return;
    }

    pageBodyStyle.setProperty(
      "overflow-y",
      previousOverflowY,
      previousOverflowYPriority,
    );
  };
}
