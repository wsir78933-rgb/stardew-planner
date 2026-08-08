import {
  createRandomFurnitureCompositeVariant,
  createDefaultCatalogItemPresentationChoice,
  getNextPendingCatalogPresentationChoice,
  validateCatalogItemPresentationChoice,
  type CatalogItem,
  type CatalogPresentationChoice,
} from "../catalog";

export type WorkspaceSelectedCatalogItem = Readonly<{
  catalogItem: CatalogItem;
  presentationChoice: CatalogPresentationChoice;
  resolvedCompositeVariant?: number;
}>;

export type WorkspaceCatalogChoiceState = Readonly<{
  presentationChoicesByItemId: ReadonlyMap<string, CatalogPresentationChoice>;
  selectedCatalogItem: WorkspaceSelectedCatalogItem | null;
}>;

export type WorkspacePendingCatalogChoiceTransition = Readonly<{
  changed: boolean;
  state: WorkspaceCatalogChoiceState;
}>;

export function createInitialWorkspaceCatalogChoiceState(): WorkspaceCatalogChoiceState {
  return {
    presentationChoicesByItemId: new Map(),
    selectedCatalogItem: null,
  };
}

export function selectWorkspaceCatalogItem(
  catalogChoiceState: WorkspaceCatalogChoiceState,
  catalogItem: CatalogItem,
  randomFractionSource: () => number = Math.random,
): WorkspaceCatalogChoiceState {
  const rememberedChoice = catalogChoiceState.presentationChoicesByItemId.get(
    catalogItem.id,
  );
  const presentationChoice = rememberedChoice === undefined
    ? createDefaultCatalogItemPresentationChoice(catalogItem)
    : validateCatalogItemPresentationChoice(catalogItem, rememberedChoice);

  return {
    ...catalogChoiceState,
    selectedCatalogItem: {
      catalogItem,
      presentationChoice,
      ...resolveCompositeVariant(catalogItem, randomFractionSource),
    },
  };
}

export function advanceWorkspaceCatalogPlacementAttempt(
  catalogChoiceState: WorkspaceCatalogChoiceState,
  randomFractionSource: () => number = Math.random,
): WorkspaceCatalogChoiceState {
  const selectedCatalogItem = catalogChoiceState.selectedCatalogItem;
  if (selectedCatalogItem === null) {
    return catalogChoiceState;
  }
  const resolvedCompositeVariant = resolveCompositeVariant(
    selectedCatalogItem.catalogItem,
    randomFractionSource,
  );
  if (resolvedCompositeVariant.resolvedCompositeVariant === undefined) {
    return catalogChoiceState;
  }
  return {
    ...catalogChoiceState,
    selectedCatalogItem: {
      ...selectedCatalogItem,
      ...resolvedCompositeVariant,
    },
  };
}

export function changeWorkspaceCatalogItemChoice(
  catalogChoiceState: WorkspaceCatalogChoiceState,
  catalogItem: CatalogItem,
  presentationChoice: CatalogPresentationChoice,
): WorkspaceCatalogChoiceState {
  const validatedChoice = validateCatalogItemPresentationChoice(
    catalogItem,
    presentationChoice,
  );
  const nextChoicesByItemId = new Map(
    catalogChoiceState.presentationChoicesByItemId,
  );
  nextChoicesByItemId.set(catalogItem.id, validatedChoice);
  const selectedCatalogItem =
    catalogChoiceState.selectedCatalogItem?.catalogItem.id === catalogItem.id
      ? {
          ...catalogChoiceState.selectedCatalogItem,
          catalogItem,
          presentationChoice: validatedChoice,
        }
      : catalogChoiceState.selectedCatalogItem;

  return {
    presentationChoicesByItemId: nextChoicesByItemId,
    selectedCatalogItem,
  };
}

function resolveCompositeVariant(
  catalogItem: CatalogItem,
  randomFractionSource: () => number,
): Readonly<{ resolvedCompositeVariant?: number }> {
  const renderingMetadata = catalogItem.renderingMetadata;
  if (
    renderingMetadata?.kind !== "furniture"
    || renderingMetadata.compositeSprite === null
  ) {
    return {};
  }
  return {
    resolvedCompositeVariant: createRandomFurnitureCompositeVariant(
      renderingMetadata.compositeSprite,
      randomFractionSource,
    ),
  };
}

export function clearWorkspaceCatalogSelection(
  catalogChoiceState: WorkspaceCatalogChoiceState,
): WorkspaceCatalogChoiceState {
  if (catalogChoiceState.selectedCatalogItem === null) {
    return catalogChoiceState;
  }
  return { ...catalogChoiceState, selectedCatalogItem: null };
}

export function cyclePendingWorkspaceCatalogChoice(
  catalogChoiceState: WorkspaceCatalogChoiceState,
): WorkspacePendingCatalogChoiceTransition {
  const selectedCatalogItem = catalogChoiceState.selectedCatalogItem;
  const presentationCapabilities =
    selectedCatalogItem?.catalogItem.presentationCapabilities;
  if (selectedCatalogItem === null || presentationCapabilities === undefined) {
    return { changed: false, state: catalogChoiceState };
  }
  const nextChoice = getNextPendingCatalogPresentationChoice(
    selectedCatalogItem.catalogItem.id,
    presentationCapabilities,
    selectedCatalogItem.presentationChoice,
  );
  if (areCatalogPresentationChoicesEqual(
    nextChoice,
    selectedCatalogItem.presentationChoice,
  )) {
    return { changed: false, state: catalogChoiceState };
  }

  return {
    changed: true,
    state: changeWorkspaceCatalogItemChoice(
      catalogChoiceState,
      selectedCatalogItem.catalogItem,
      nextChoice,
    ),
  };
}

function areCatalogPresentationChoicesEqual(
  firstChoice: CatalogPresentationChoice,
  secondChoice: CatalogPresentationChoice,
): boolean {
  return firstChoice.flipped === secondChoice.flipped &&
    firstChoice.rotation === secondChoice.rotation &&
    firstChoice.variant === secondChoice.variant;
}
