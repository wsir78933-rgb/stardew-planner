import { describe, expect, it } from "vitest";
import {
  lockMapPickerPageScroll,
  type MapPickerPageScrollLockStyle,
} from "../../src/components/map-picker-page-scroll-lock";

type OverflowYOperation = Readonly<{
  name: string;
  priority?: string;
  value?: string;
}>;

describe("Map picker page scroll lock", () => {
  it("sets overflow-y to hidden with important priority when acquired", () => {
    const inMemoryStyle = createInMemoryPageBodyStyle();

    lockMapPickerPageScroll(inMemoryStyle.pageBodyStyle);

    expect(inMemoryStyle.operations).toEqual([
      {
        name: "overflow-y",
        priority: "important",
        value: "hidden",
      },
    ]);
  });

  it("restores the previous inline overflow-y value and priority on cleanup", () => {
    const inMemoryStyle = createInMemoryPageBodyStyle({
      priority: "important",
      value: "auto",
    });

    const releaseMapPickerPageScroll = lockMapPickerPageScroll(
      inMemoryStyle.pageBodyStyle,
    );
    releaseMapPickerPageScroll();

    expect(inMemoryStyle.overflowY()).toEqual({
      priority: "important",
      value: "auto",
    });
  });

  it("removes overflow-y on cleanup when no inline value existed", () => {
    const inMemoryStyle = createInMemoryPageBodyStyle();

    const releaseMapPickerPageScroll = lockMapPickerPageScroll(
      inMemoryStyle.pageBodyStyle,
    );
    releaseMapPickerPageScroll();

    expect(inMemoryStyle.operations).toEqual([
      {
        name: "overflow-y",
        priority: "important",
        value: "hidden",
      },
      { name: "overflow-y" },
    ]);
    expect(inMemoryStyle.overflowY()).toEqual({ priority: "", value: "" });
  });
});

function createInMemoryPageBodyStyle(
  initialOverflowY: Readonly<{ priority: string; value: string }> = {
    priority: "",
    value: "",
  },
): Readonly<{
  operations: OverflowYOperation[];
  overflowY: () => Readonly<{ priority: string; value: string }>;
  pageBodyStyle: MapPickerPageScrollLockStyle;
}> {
  let overflowYValue = initialOverflowY.value;
  let overflowYPriority = initialOverflowY.priority;
  const operations: OverflowYOperation[] = [];

  return {
    operations,
    overflowY: () => ({
      priority: overflowYPriority,
      value: overflowYValue,
    }),
    pageBodyStyle: {
      getPropertyPriority(propertyName: string): string {
        return propertyName === "overflow-y" ? overflowYPriority : "";
      },
      getPropertyValue(propertyName: string): string {
        return propertyName === "overflow-y" ? overflowYValue : "";
      },
      removeProperty(propertyName: string): string {
        operations.push({ name: propertyName });
        const removedValue = propertyName === "overflow-y" ? overflowYValue : "";

        if (propertyName === "overflow-y") {
          overflowYValue = "";
          overflowYPriority = "";
        }

        return removedValue;
      },
      setProperty(
        propertyName: string,
        value: string | null,
        priority?: string,
      ): void {
        operations.push({
          name: propertyName,
          priority,
          value: value ?? undefined,
        });

        if (propertyName === "overflow-y") {
          overflowYValue = value ?? "";
          overflowYPriority = priority ?? "";
        }
      },
    },
  };
}
