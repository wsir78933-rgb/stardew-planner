export type MapPickerPageScrollLockStyle = Pick<
  CSSStyleDeclaration,
  "getPropertyPriority" | "getPropertyValue" | "removeProperty" | "setProperty"
>;

export function lockMapPickerPageScroll(
  pageBodyStyle: MapPickerPageScrollLockStyle,
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
