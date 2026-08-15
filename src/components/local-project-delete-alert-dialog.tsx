"use client";

import { useRef, type ReactNode } from "react";
import * as AlertDialog from "radix-ui/alert-dialog";
import type { LocalProjectDeleteCopy } from "../i18n/save-modal-copy";

export type LocalProjectDeleteButtonFocusTarget = Readonly<{
  isConnected: boolean;
  focus(): void;
}>;

export type LocalProjectDeleteAlertDialogProps = Readonly<{
  copy: LocalProjectDeleteCopy;
  deleteButtonFocusTarget: LocalProjectDeleteButtonFocusTarget | null;
  projectTitle: string;
  onCancel(): void;
  onConfirm(): boolean;
}>;

export function LocalProjectDeleteAlertDialog({
  copy,
  deleteButtonFocusTarget,
  projectTitle,
  onCancel,
  onConfirm,
}: LocalProjectDeleteAlertDialogProps): ReactNode {
  return (
    <AlertDialog.Root open>
      <AlertDialog.Portal>
        <LocalProjectDeleteAlertDialogContent
          deleteButtonFocusTarget={deleteButtonFocusTarget}
          copy={copy}
          onCancel={onCancel}
          onConfirm={onConfirm}
          projectTitle={projectTitle}
        />
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export function LocalProjectDeleteAlertDialogContent({
  copy,
  deleteButtonFocusTarget,
  projectTitle,
  onCancel,
  onConfirm,
}: LocalProjectDeleteAlertDialogProps): ReactNode {
  const restoreDeleteButtonFocusOnCloseRef = useRef(true);

  function handleConfirm(): void {
    if (onConfirm()) {
      restoreDeleteButtonFocusOnCloseRef.current = false;
    }
  }

  return (
    <>
      <AlertDialog.Overlay className="local-project-panel__delete-alert-overlay" />
      <AlertDialog.Content
        className="local-project-panel__delete-alert-content"
        onCloseAutoFocus={(closeAutoFocusEvent) => {
          if (!restoreDeleteButtonFocusOnCloseRef.current) {
            closeAutoFocusEvent.preventDefault();
            return;
          }

          restoreLocalProjectDeleteButtonFocus(
            closeAutoFocusEvent,
            deleteButtonFocusTarget,
          );
        }}
        onEscapeKeyDown={onCancel}
      >
        <AlertDialog.Title>{copy.title}</AlertDialog.Title>
        <AlertDialog.Description>
          {copy.descriptionPrefix}
          <strong>{projectTitle}</strong>
          {copy.descriptionSuffix}
        </AlertDialog.Description>
        <div className="local-project-panel__delete-alert-actions">
          <AlertDialog.Action onClick={handleConfirm} type="button">
            {copy.confirm}
          </AlertDialog.Action>
          <AlertDialog.Cancel onClick={onCancel} type="button">
            {copy.dismiss}
          </AlertDialog.Cancel>
        </div>
      </AlertDialog.Content>
    </>
  );
}

export function restoreLocalProjectDeleteButtonFocus(
  closeAutoFocusEvent: Readonly<{ preventDefault(): void }>,
  deleteButtonFocusTarget: LocalProjectDeleteButtonFocusTarget | null,
): void {
  closeAutoFocusEvent.preventDefault();

  if (deleteButtonFocusTarget === null) {
    throw new Error(
      "Cannot restore local project deletion focus because the original Delete button focus target is missing.",
    );
  }

  if (!deleteButtonFocusTarget.isConnected) {
    throw new Error(
      "Cannot restore local project deletion focus because the original Delete button focus target is disconnected.",
    );
  }

  deleteButtonFocusTarget.focus();
}
