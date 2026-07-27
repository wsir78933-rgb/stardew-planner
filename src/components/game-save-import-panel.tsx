"use client";

import { useId, useRef, useState, type ChangeEvent } from "react";
import {
  GameSaveImportError,
  type ImportedGameSaveState,
} from "../game-save/game-save-import";
import type { SiteLocale } from "../i18n/locales";
import { formatTranslation, translate } from "../i18n/messages";

type GameSaveImportControlProperties = Readonly<{
  locale?: SiteLocale;
  onImportGameSave: (serializedGameSave: string) => void;
}>;

type GameSaveImportResultModalProperties = Readonly<{
  locale?: SiteLocale;
  importedGameSaveState: ImportedGameSaveState;
  onClose: () => void;
}>;

export function GameSaveImportControl({
  locale = "en",
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
      setImportErrorMessage(formatGameSaveImportError(caughtError, locale));
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <section aria-label={translate(locale, "planner.gameSave.label")} className="game-save-import-control">
      <label
        className={`game-save-import-control__file-trigger${
          isImporting ? " game-save-import-control__file-trigger--disabled" : ""
        }`}
        title={translate(locale, "planner.gameSave.title")}
      >
        <span>{isImporting ? translate(locale, "planner.gameSave.importing") : translate(locale, "planner.gameSave.label")}</span>
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
  locale = "en",
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
          <h2 id={headingId}>{formatTranslation(locale, "planner.gameSave.farm", { name: importedGameSaveState.farmName })}</h2>
          <button aria-label={translate(locale, "planner.gameSave.closeResult")} onClick={onClose} type="button">
            ×
          </button>
        </header>
        {unmappedItemCount > 0 ? (
          <p className="game-save-import-result__warning">
            {formatTranslation(locale, "planner.gameSave.unmapped", { count: unmappedItemCount })}
          </p>
        ) : (
          <p className="game-save-import-result__success">
            {translate(locale, "planner.gameSave.success")}
          </p>
        )}
        <p className="game-save-import-result__notice">
          {translate(locale, "planner.gameSave.experimental")}
        </p>
        <p className="game-save-import-result__notice">
          {translate(locale, "planner.gameSave.browserOnly")}
        </p>
        <footer className="game-save-import-result__footer">
          <button onClick={onClose} type="button">
            {translate(locale, "planner.gameSave.close")}
          </button>
        </footer>
      </section>
    </div>
  );
}

export function formatGameSaveImportError(
  caughtError: unknown,
  locale: SiteLocale = "en",
): string {
  if (classifyGameSaveImportError(caughtError) === "game-save-import") {
    return translate(locale, "planner.gameSave.error");
  }

  throw caughtError;
}

function classifyGameSaveImportError(
  caughtError: unknown,
): "game-save-import" | null {
  return caughtError instanceof GameSaveImportError ? "game-save-import" : null;
}
