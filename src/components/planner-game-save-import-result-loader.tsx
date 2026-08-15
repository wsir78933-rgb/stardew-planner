"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { ImportedGameSaveState } from "../game-save/game-save-import";
import type {
  GameSaveCopy,
  GameSaveResultLoaderCopy,
} from "../i18n/save-modal-copy";

type PlannerGameSaveImportResultContentProperties = Readonly<{
  copy: GameSaveCopy;
  importedGameSaveState: ImportedGameSaveState;
  onClose: () => void;
}>;

type PlannerGameSaveImportResultLoaderProperties =
  Readonly<{
    copy: Readonly<{
      gameSave: GameSaveCopy;
      gameSaveResultLoader: GameSaveResultLoaderCopy;
    }>;
    importedGameSaveState: ImportedGameSaveState | null;
    onClose: () => void;
  }>;

export function PlannerGameSaveImportResultLoader({
  copy,
  importedGameSaveState,
  onClose,
}: PlannerGameSaveImportResultLoaderProperties) {
  const [PlannerGameSaveImportResultContent, setPlannerGameSaveImportResultContent] =
    useState<ComponentType<PlannerGameSaveImportResultContentProperties> | null>(null);
  const [resultLoadErrorMessage, setResultLoadErrorMessage] = useState<string | null>(
    null,
  );
  const [resultLoadGeneration, setResultLoadGeneration] = useState(0);

  useEffect(() => {
    if (importedGameSaveState === null) return;
    let hasDisposed = false;
    setResultLoadErrorMessage(null);

    async function loadGameSaveResultContent(): Promise<void> {
      try {
        const {
          PlannerGameSaveImportResultContent: loadedPlannerGameSaveImportResultContent,
        } = await import("./planner-game-save-modal-content");
        if (hasDisposed) return;
        setPlannerGameSaveImportResultContent(
          () => loadedPlannerGameSaveImportResultContent,
        );
        setResultLoadErrorMessage(null);
      } catch (caughtError) {
        if (hasDisposed) return;
        setResultLoadErrorMessage(
          createGameSaveResultLoadErrorMessage(caughtError, copy.gameSaveResultLoader),
        );
      }
    }

    void loadGameSaveResultContent();

    return () => {
      hasDisposed = true;
    };
  }, [copy.gameSaveResultLoader, importedGameSaveState, resultLoadGeneration]);

  if (importedGameSaveState === null) return null;
  if (resultLoadErrorMessage !== null) {
    return (
      <div className="game-save-import-control__error" role="alert">
        <p>{resultLoadErrorMessage}</p>
        <button
          onClick={() =>
            setResultLoadGeneration((currentResultLoadGeneration) =>
              createNextGameSaveResultLoadGeneration(currentResultLoadGeneration),
            )
          }
          type="button"
        >
          {createGameSaveResultRetryLabel(copy.gameSaveResultLoader)}
        </button>
        <button onClick={onClose} type="button">{copy.gameSave.close}</button>
      </div>
    );
  }
  if (PlannerGameSaveImportResultContent === null) {
    return (
      <p className="game-save-import-control__message" role="status">
        {copy.gameSaveResultLoader.loading}
      </p>
    );
  }
  return (
    <PlannerGameSaveImportResultContent
      copy={copy.gameSave}
      importedGameSaveState={importedGameSaveState}
      onClose={onClose}
    />
  );
}

export function createGameSaveResultLoadErrorMessage(
  caughtError: unknown,
  copy: GameSaveResultLoaderCopy,
): string {
  const errorMessage = caughtError instanceof Error
    ? caughtError.message
    : String(caughtError);
  return copy.loadFailure(errorMessage);
}

export function createGameSaveResultRetryLabel(
  copy: GameSaveResultLoaderCopy,
): string {
  return copy.retry;
}

export function createNextGameSaveResultLoadGeneration(
  currentResultLoadGeneration: number,
): number {
  if (
    !Number.isSafeInteger(currentResultLoadGeneration)
    || currentResultLoadGeneration < 0
    || currentResultLoadGeneration === Number.MAX_SAFE_INTEGER
  ) {
    throw new TypeError(
      "Game-save result load generation must be a non-negative safe integer smaller than "
        + `${String(Number.MAX_SAFE_INTEGER)}; received `
        + `${JSON.stringify(currentResultLoadGeneration)}.`,
    );
  }

  return currentResultLoadGeneration + 1;
}
