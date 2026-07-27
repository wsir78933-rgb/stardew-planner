import {
  localProjectV2StorageKey,
  type LocalProjectStorageAdapter,
} from "./local-project-store";
import {
  migrateReferenceLocalProjectCollection,
  referenceLocalProjectStorageKey,
} from "./reference-local-project-migration";
import { parseStoredLocalProjectCollectionV2 } from "./project-schema";

export type ReferenceStorageMigrationResult = Readonly<{
  status: "existing-v2" | "migrated" | "no-source";
}>;

export function migrateReferenceProjectsIfNeeded(
  storage: LocalProjectStorageAdapter,
): ReferenceStorageMigrationResult {
  const serializedV2Collection = storage.getItem(localProjectV2StorageKey);

  if (serializedV2Collection !== null) {
    parseStoredLocalProjectCollectionV2(serializedV2Collection);
    return { status: "existing-v2" };
  }

  const serializedSource = storage.getItem(referenceLocalProjectStorageKey);

  if (serializedSource === null) {
    return { status: "no-source" };
  }

  const migratedCollection = migrateReferenceLocalProjectCollection(serializedSource);
  storage.setItem(localProjectV2StorageKey, JSON.stringify(migratedCollection));
  return { status: "migrated" };
}
