import { describe, expect, it } from "vitest";
import { interiorWallpaperPatterns } from "../../src/interior-decor/interior-decor-catalog";
import {
  applyPlannerWorkspaceInteriorDecor,
  cancelInteriorDecorBeforeOrdinaryWorkspaceAction,
  createInteriorDecorSelectionTransition,
  getInteriorDecorRejectionMessage,
  getNextInteriorDecorRejectionNotification,
  getUnavailableInteriorDecorMessage,
} from "../../src/planner/planner-workspace-interior-decor-controls";
import { createPlacementHistory } from "../../src/placement/placement-history";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";

describe("planner workspace interior decor controls", () => {
  it("clears ordinary placement interaction when a decor pattern is selected", () => {
    const selectedWallpaper = interiorWallpaperPatterns[0];

    if (selectedWallpaper === undefined) {
      throw new Error("Expected the interior wallpaper catalog to contain a pattern.");
    }

    expect(createInteriorDecorSelectionTransition(selectedWallpaper)).toEqual({
      activeInteriorDecorPattern: selectedWallpaper,
      shouldClearOrdinaryPlacementInteraction: true,
    });
  });

  it("commits decor through the shared placement history and clears placement selection", () => {
    const selectedWallpaper = interiorWallpaperPatterns[0];

    if (selectedWallpaper === undefined) {
      throw new Error("Expected the interior wallpaper catalog to contain a pattern.");
    }

    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const interiorDecorTransition = applyPlannerWorkspaceInteriorDecor({
      mapId: "farmhouse-0",
      pattern: selectedWallpaper,
      placementHistory,
      targetId: "MainRoom",
    });

    expect(interiorDecorTransition.placementHistory.currentState.interiorDecor).toEqual({
      floors: {},
      wallpapers: { MainRoom: selectedWallpaper.patternId },
    });
    expect(interiorDecorTransition.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(interiorDecorTransition.selectedPlacementKeys).toEqual([]);
  });

  it("creates an accessible rejection message that identifies the map and decor kind", () => {
    expect(getInteriorDecorRejectionMessage("farmhouse-0", "flooring")).toBe(
      'Cannot apply flooring on map "farmhouse-0" at this location.',
    );
  });

  it("explains when wallpaper and flooring are unavailable outside supported interiors", () => {
    expect(getUnavailableInteriorDecorMessage("standard", "wallpaper")).toBe(
      "Wallpaper can only be applied inside.",
    );
    expect(getUnavailableInteriorDecorMessage("standard", "flooring")).toBe(
      "Flooring can only be applied inside.",
    );
    expect(getUnavailableInteriorDecorMessage("farmhouse-0", "wallpaper")).toBeNull();
  });

  it("suppresses both unavailable catalog and invalid-target rejections when toast display is disabled", () => {
    const unavailableWallpaperMessage = getUnavailableInteriorDecorMessage(
      "standard",
      "wallpaper",
    );
    if (unavailableWallpaperMessage === null) {
      throw new Error("Expected Standard Farm wallpaper selection to be unavailable.");
    }
    const invalidTargetMessage = getInteriorDecorRejectionMessage(
      "farmhouse-0",
      "wallpaper",
    );

    expect(
      getNextInteriorDecorRejectionNotification(
        null,
        false,
        unavailableWallpaperMessage,
      ),
    ).toBeNull();
    expect(
      getNextInteriorDecorRejectionNotification(null, false, invalidTargetMessage),
    ).toBeNull();
  });

  it("increments the notification version when the same rejection repeats", () => {
    const rejectionMessage = 'Cannot apply wallpaper on map "farmhouse-0" at this location.';
    const firstNotification = getNextInteriorDecorRejectionNotification(
      null,
      true,
      rejectionMessage,
    );
    if (firstNotification === null) {
      throw new Error("Expected enabled toast display to create a rejection notification.");
    }

    expect(
      getNextInteriorDecorRejectionNotification(
        firstNotification,
        true,
        rejectionMessage,
      ),
    ).toEqual({
      message: rejectionMessage,
      version: 2,
    });
  });

  it("cancels active decor before an ordinary catalog, tool, or map action proceeds", () => {
    const receivedActions: string[] = [];

    for (const ordinaryAction of [
      "catalog",
      "tool",
      "map",
      "project-map-open-same-planner-map",
    ] as const) {
      cancelInteriorDecorBeforeOrdinaryWorkspaceAction({
        cancelInteriorDecor: () => receivedActions.push("cancel"),
        performOrdinaryWorkspaceAction: () => receivedActions.push(ordinaryAction),
      });
    }

    expect(receivedActions).toEqual([
      "cancel",
      "catalog",
      "cancel",
      "tool",
      "cancel",
      "map",
      "cancel",
      "project-map-open-same-planner-map",
    ]);
  });
});
