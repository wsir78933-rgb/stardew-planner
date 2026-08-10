"use client";

import { useRef, type ReactNode } from "react";
import * as AlertDialog from "radix-ui/alert-dialog";

export type LocalProjectDeleteButtonFocusTarget = Readonly<{
  isConnected: boolean;
  focus(): void;
}>;

export type LocalProjectDeleteAlertDialogProps = Readonly<{
  deleteButtonFocusTarget: LocalProjectDeleteButtonFocusTarget | null;
  projectTitle: string;
  onCancel(): void;
  onConfirm(): boolean;
}>;

export function LocalProjectDeleteAlertDialog({
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
          onCancel={onCancel}
          onConfirm={onConfirm}
          projectTitle={projectTitle}
        />
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export function LocalProjectDeleteAlertDialogContent({
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
        <AlertDialog.Title>Delete local project?</AlertDialog.Title>
        <AlertDialog.Description>
          Delete <strong>{projectTitle}</strong> from this browser? This cannot
          be undone.
        </AlertDialog.Description>
        <div className="local-project-panel__delete-alert-actions">
          <AlertDialog.Action onClick={handleConfirm} type="button">
            Delete project
          </AlertDialog.Action>
          <AlertDialog.Cancel onClick={onCancel} type="button">
            Keep project
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
