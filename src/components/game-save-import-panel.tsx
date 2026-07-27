"use client";

import { useId, useRef, useState, type ChangeEvent } from "react";
import {
  GameSaveImportError,
  type ImportedGameSaveState,
} from "../game-save/game-save-import";

type GameSaveImportControlProperties = Readonly<{
  onImportGameSave: (serializedGameSave: string) => void;
}>;

type GameSaveImportResultModalProperties = Readonly<{
  importedGameSaveState: ImportedGameSaveState;
  onClose: () => void;
}>;

export function GameSaveImportControl({
  onImportGameSave,
}: GameSaveImportControlProperties) {
  const gameSaveFileInputReference = useRef<HTMLInputElement>(null);
  const [importErrorMessage, setImportErrorMessage] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  function handleGameSaveFileChange(
    changeEvent: ChangeEvent<HTMLInputElement>,
  ): void {
    const selectedGameSaveFile = changeEvent.currentTarget.files?.[0];

    if (selectedGameSaveFile === undefined) {
      return;
    }

    void importGameSaveFile(selectedGameSaveFile);
  }

  async function importGameSaveFile(selectedGameSaveFile: File): Promise<void> {
    try {
      setIsImporting(true);
      const serializedGameSave = await selectedGameSaveFile.text();
      onImportGameSave(serializedGameSave);
      setImportErrorMessage(null);

      if (gameSaveFileInputReference.current !== null) {
        gameSaveFileInputReference.current.value = "";
      }
    } catch (caughtError) {
      setImportErrorMessage(formatGameSaveImportError(caughtError));
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <section aria-label="Import Game Save" className="game-save-import-control">
      <label
        className={`game-save-import-control__file-trigger${
          isImporting ? " game-save-import-control__file-trigger--disabled" : ""
        }`}
        title="Import a Stardew Valley save file to view your farm layout"
      >
        <span>{isImporting ? "Importing Game Save…" : "Import Game Save"}</span>
        <input
          accept="*"
          disabled={isImporting}
          onChange={handleGameSaveFileChange}
          ref={gameSaveFileInputReference}
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

export function GameSaveImportResultModal({
  importedGameSaveState,
  onClose,
}: GameSaveImportResultModalProperties) {
  const headingId = useId();
  const unmappedItemCount = importedGameSaveState.unmappedEntries.length;

  return (
    <div className="game-save-import-result__backdrop">
      <section
        aria-labelledby={headingId}
        aria-modal="true"
        className="game-save-import-result"
        role="dialog"
      >
        <header className="game-save-import-result__header">
          <h2 id={headingId}>"{importedGameSaveState.farmName} Farm"</h2>
          <button aria-label="Close game save import result" onClick={onClose} type="button">
            ×
          </button>
        </header>
        {unmappedItemCount > 0 ? (
          <p className="game-save-import-result__warning">
            {String(unmappedItemCount)} items couldn&apos;t be mapped (likely from mods).
          </p>
        ) : (
          <p className="game-save-import-result__success">
            All recognized map placements were imported.
          </p>
        )}
        <p className="game-save-import-result__notice">
          Game save import is experimental. Unsupported items are not placed on the map.
        </p>
        <p className="game-save-import-result__notice">
          The imported map is only in this browser until you save it to this device.
        </p>
        <footer className="game-save-import-result__footer">
          <button onClick={onClose} type="button">
            Close
          </button>
        </footer>
      </section>
    </div>
  );
}

export function formatGameSaveImportError(caughtError: unknown): string {
  if (caughtError instanceof GameSaveImportError) {
    return `Game save import failed: ${caughtError.message}`;
  }

  throw caughtError;
}
