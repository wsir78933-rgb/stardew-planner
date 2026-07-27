import {
  createEmptyInteriorDecorState,
  setInteriorDecorPattern,
  type InteriorDecorKind,
} from "./interior-decor-state";
import {
  commitPlacementHistory,
  type PlacementHistory,
} from "../placement/placement-history";
import {
  replacePlacementSnapshotInteriorDecor,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";

export type InteriorDecorHistoryApplyInput = Readonly<{
  interiorDecorKind: InteriorDecorKind;
  patternId: string;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  targetId: string;
}>;

export function applyInteriorDecorPatternToHistory(
  interiorDecorHistoryApplyInput: InteriorDecorHistoryApplyInput,
): PlacementHistory<PlacementSnapshot> {
  const currentInteriorDecorState =
    interiorDecorHistoryApplyInput.placementHistory.currentState.interiorDecor ??
    createEmptyInteriorDecorState();
  const nextInteriorDecorState = setInteriorDecorPattern(
    currentInteriorDecorState,
    interiorDecorHistoryApplyInput.interiorDecorKind,
    interiorDecorHistoryApplyInput.targetId,
    interiorDecorHistoryApplyInput.patternId,
  );
  const nextPlacementSnapshot = replacePlacementSnapshotInteriorDecor(
    interiorDecorHistoryApplyInput.placementHistory.currentState,
    nextInteriorDecorState,
  );

  return commitPlacementHistory(
    interiorDecorHistoryApplyInput.placementHistory,
    nextPlacementSnapshot,
  );
}
