import { describe, expect, it } from "vitest";
import { editorModalIds } from "../../src/editor/editor-view-state";
import {
  isPlannerModalLayerOpen,
  lockPlannerModalPageScroll,
  type PlannerModalPageScrollLockStyle,
} from "../../src/components/planner-modal-page-scroll-lock";

type OverflowYOperation = Readonly<{
  name: string;
  priority?: string;
  value?: string;
}>;

describe("Planner modal page scroll lock", () => {
  it("leaves the page unlocked when no modal layer is open", () => {
    expect(isPlannerModalLayerOpen({
      editorModalId: null,
      hasImportedGameSaveResult: false,
    })).toBe(false);
  });

  it("locks the page for every editor modal", () => {
    for (const editorModalId of editorModalIds) {
      expect(isPlannerModalLayerOpen({
        editorModalId,
        hasImportedGameSaveResult: false,
      })).toBe(true);
    }
  });

  it("locks the page for an imported game save result without an editor modal", () => {
    expect(isPlannerModalLayerOpen({
      editorModalId: null,
      hasImportedGameSaveResult: true,
    })).toBe(true);
  });

  it("sets overflow-y to hidden with important priority when acquired", () => {
    const inMemoryStyle = createInMemoryPageBodyStyle();

    lockPlannerModalPageScroll(inMemoryStyle.pageBodyStyle);

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

    const releasePlannerModalPageScroll = lockPlannerModalPageScroll(
      inMemoryStyle.pageBodyStyle,
    );
    releasePlannerModalPageScroll();

    expect(inMemoryStyle.overflowY()).toEqual({
      priority: "important",
      value: "auto",
    });
  });

  it("removes overflow-y on cleanup when no inline value existed", () => {
    const inMemoryStyle = createInMemoryPageBodyStyle();

    const releasePlannerModalPageScroll = lockPlannerModalPageScroll(
      inMemoryStyle.pageBodyStyle,
    );
    releasePlannerModalPageScroll();

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
  pageBodyStyle: PlannerModalPageScrollLockStyle;
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
