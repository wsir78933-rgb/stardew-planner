"use client";

import { useSyncExternalStore } from "react";

export function subscribeToBrowserLocationSearch(
  onStoreChange: () => void,
): () => void {
  window.addEventListener("popstate", onStoreChange);

  return () => {
    window.removeEventListener("popstate", onStoreChange);
  };
}

export function getBrowserLocationSearch(): string {
  return window.location.search;
}

export function getServerLocationSearch(): string {
  return "";
}

export function useStaticLocationSearch(): string {
  return useSyncExternalStore(
    subscribeToBrowserLocationSearch,
    getBrowserLocationSearch,
    getServerLocationSearch,
  );
}
