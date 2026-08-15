"use client";

import { useId, useState, type ChangeEvent } from "react";
import {
  GameSaveImportError,
  type ImportedGameSaveState,
} from "../game-save/game-save-import";
import type { GameSaveCopy } from "../i18n/save-modal-copy";
import { closeModalFromBackdropClick } from "./modal-backdrop-close";

type GameSaveImportControlProperties = Readonly<{
  copy: GameSaveCopy;
  onImportGameSave: (serializedGameSave: string) => void;
}>;

type GameSaveImportResultModalProperties = Readonly<{
  copy: GameSaveCopy;
  importedGameSaveState: ImportedGameSaveState;
  onClose: () => void;
}>;

export function GameSaveImportControl({
  copy,
  onImportGameSave,
}: GameSaveImportControlProperties) {
  const [importErrorMessage, setImportErrorMessage] = useState<string | null>(null);
  const [importingFileName, setImportingFileName] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  function handleGameSaveFileChange(
    changeEvent: ChangeEvent<HTMLInputElement>,
  ): void {
    const selectedGameSaveFileInput = changeEvent.currentTarget;
    const selectedGameSaveFile = selectedGameSaveFileInput.files?.[0];

    if (selectedGameSaveFile === undefined) {
      return;
    }

    setImportingFileName(selectedGameSaveFile.name);
    void importGameSaveFile(selectedGameSaveFile, selectedGameSaveFileInput);
  }

  async function importGameSaveFile(
    selectedGameSaveFile: File,
    selectedGameSaveFileInput: HTMLInputElement,
  ): Promise<void> {
    try {
      setIsImporting(true);
      const serializedGameSave = await selectedGameSaveFile.text();
      onImportGameSave(serializedGameSave);
      setImportErrorMessage(null);
    } catch (caughtError) {
      setImportErrorMessage(formatGameSaveImportError(caughtError, copy));
    } finally {
      selectedGameSaveFileInput.value = "";
      setImportingFileName(null);
      setIsImporting(false);
    }
  }

  return (
    <section aria-label={copy.ariaLabel} className="game-save-import-control">
      <p className="game-save-import-control__description">
        {copy.description}
      </p>
      <label
        className={`game-save-import-control__file-trigger${
          isImporting ? " game-save-import-control__file-trigger--disabled" : ""
        }`}
        title={copy.tooltip}
      >
        <span>{createGameSaveImportTriggerLabel(importingFileName, copy)}</span>
        <input
          accept="*"
          disabled={isImporting}
          onChange={handleGameSaveFileChange}
          type="file"
        />
      </label>
      {importErrorMessage !== null ? (
        <p className="game-save-import-control__error" role="alert">
          {importErrorMessage}
        </p>
      ) : null}
    </section>
  );
}

export function createGameSaveImportTriggerLabel(
  importingFileName: string | null,
  copy: GameSaveCopy,
): string {
  if (importingFileName === null) {
    return copy.chooseFile;
  }

  return copy.importing(importingFileName);
}

export function GameSaveImportResultModal({
  copy,
  importedGameSaveState,
  onClose,
}: GameSaveImportResultModalProperties) {
  const headingId = useId();
  const unmappedItemCount = importedGameSaveState.unmappedEntries.length;

  return (
    <div
      className="game-save-import-result__backdrop"
      onClick={(mouseEvent) => {
        closeModalFromBackdropClick({
          currentTarget: mouseEvent.currentTarget,
          eventTarget: mouseEvent.target,
          onClose,
        });
      }}
    >
      <section
        aria-labelledby={headingId}
        aria-modal="true"
        className="game-save-import-result"
        role="dialog"
      >
        <header className="game-save-import-result__header">
          <h2 id={headingId}>{copy.resultTitle(importedGameSaveState.farmName)}</h2>
          <button aria-label={copy.resultCloseLabel} onClick={onClose} type="button">
            ×
          </button>
        </header>
        {unmappedItemCount > 0 ? (
          <p className="game-save-import-result__warning">
            {copy.unmappedItems(unmappedItemCount)}
          </p>
        ) : (
          <p className="game-save-import-result__success">
            {copy.resultImportedAll}
          </p>
        )}
        <p className="game-save-import-result__notice">
          {copy.experimentalNotice}
        </p>
        <p className="game-save-import-result__notice">
          {copy.localOnlyNotice}
        </p>
        <footer className="game-save-import-result__footer">
          <button onClick={onClose} type="button">
            {copy.close}
          </button>
        </footer>
      </section>
    </div>
  );
}

export function formatGameSaveImportError(
  caughtError: unknown,
  copy: GameSaveCopy,
): string {
  if (caughtError instanceof GameSaveImportError) {
    return copy.importFailure(caughtError.message);
  }

  throw caughtError;
}
