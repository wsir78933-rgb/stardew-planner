type ModalBackdropClickProperties = Readonly<{
  currentTarget: EventTarget;
  eventTarget: EventTarget | null;
  onClose: () => void;
}>;

export function closeModalFromBackdropClick({
  currentTarget,
  eventTarget,
  onClose,
}: ModalBackdropClickProperties): void {
  if (eventTarget !== currentTarget) {
    return;
  }

  onClose();
}
