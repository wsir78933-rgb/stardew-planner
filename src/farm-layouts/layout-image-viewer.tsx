"use client";

import { useRef, type MouseEvent } from "react";
import { X } from "lucide-react";
import { PublicPicture } from "@/src/components/public-picture";
import styles from "./beach-farm-page.module.css";

type LayoutImageViewerProperties = Readonly<{
  closeLabel: string;
  enlargeLabel: string;
  imageAlt: string;
  imageHeight: number;
  imageOriginalSrc: string;
  imageSrc: string;
  imageWidth: number;
  isPriorityImage?: boolean;
}>;

function openLayoutImageDialog(dialog: HTMLDialogElement | null): void {
  if (dialog === null) {
    throw new Error("Cannot open the layout image viewer because its dialog ref is null.");
  }

  if (!dialog.open) {
    dialog.showModal();
  }
}

function closeLayoutImageDialog(dialog: HTMLDialogElement | null): void {
  if (dialog?.open) {
    dialog.close();
  }
}

export function LayoutImageViewer({
  closeLabel,
  enlargeLabel,
  imageAlt,
  imageHeight,
  imageOriginalSrc,
  imageSrc,
  imageWidth,
  isPriorityImage = false,
}: LayoutImageViewerProperties) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerLabel = `${enlargeLabel}: ${imageAlt}`;

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>): void {
    if (event.target === event.currentTarget) {
      closeLayoutImageDialog(dialogRef.current);
    }
  }

  return (
    <>
      <button
        aria-label={triggerLabel}
        className={styles.imageTrigger}
        data-layout-image-trigger="true"
        onClick={() => openLayoutImageDialog(dialogRef.current)}
        type="button"
      >
        <PublicPicture
          alt={imageAlt}
          className={styles.layoutImage}
          decoding="async"
          fetchPriority={isPriorityImage ? "high" : "auto"}
          height={imageHeight}
          loading={isPriorityImage ? "eager" : "lazy"}
          src={imageSrc}
          width={imageWidth}
        />
      </button>

      <dialog
        aria-label={imageAlt}
        className={styles.imageDialog}
        data-layout-image-dialog="true"
        onClick={handleBackdropClick}
        ref={dialogRef}
      >
        <button
          aria-label={closeLabel}
          className={styles.dialogCloseButton}
          onClick={() => closeLayoutImageDialog(dialogRef.current)}
          type="button"
        >
          <X aria-hidden="true" size={20} strokeWidth={1.9} />
        </button>
        <img
          alt={imageAlt}
          className={styles.dialogImage}
          decoding="async"
          height={imageHeight}
          loading="lazy"
          src={imageOriginalSrc}
          width={imageWidth}
        />
      </dialog>
    </>
  );
}
