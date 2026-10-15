import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CloudProjectLinkStoreError,
  readCloudProjectLinks,
  writeCloudProjectLinks,
  type CloudProjectLink,
} from "../../src/cloud-sync/cloud-project-link-store";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("cloud project link store", () => {
  it("persists links in a separate user-scoped localStorage key", () => {
    const browserStorage = createMemoryStorage();
    vi.stubGlobal("window", { localStorage: browserStorage });
    const firstUserLink = createCloudProjectLink("local-1", "cloud-1");
    const secondUserLink = createCloudProjectLink("local-2", "cloud-2");

    writeCloudProjectLinks("user/one", [firstUserLink]);
    writeCloudProjectLinks("user/two", [secondUserLink]);

    expect(readCloudProjectLinks("user/one")).toEqual([firstUserLink]);
    expect(readCloudProjectLinks("user/two")).toEqual([secondUserLink]);
    expect(browserStorage.length).toBe(2);
  });

  it("rejects duplicate cloud project links with the conflicting ID", () => {
    vi.stubGlobal("window", { localStorage: createMemoryStorage() });
    const firstLink = createCloudProjectLink("local-1", "cloud-1");
    const duplicateCloudLink = createCloudProjectLink("local-2", "cloud-1");

    expect(() => writeCloudProjectLinks("user-1", [firstLink, duplicateCloudLink]))
      .toThrowError(
        new CloudProjectLinkStoreError(
          'Stored cloud project links contain duplicate cloud project ID "cloud-1".',
        ),
      );
  });

  it("reports invalid stored JSON without discarding the value", () => {
    const browserStorage = createMemoryStorage();
    vi.stubGlobal("window", { localStorage: browserStorage });
    browserStorage.setItem(
      "stardew-planner:cloud-project-links:v1:user-1",
      "{not-json",
    );

    expect(() => readCloudProjectLinks("user-1")).toThrow(
      'Stored cloud project links for user "user-1" contain invalid JSON',
    );
  });
});

function createCloudProjectLink(
  localProjectId: string,
  cloudProjectId: string,
): CloudProjectLink {
  return {
    localProjectId,
    cloudProjectId,
    revision: 2,
    lastSyncedSnapshot: `sha256:${"a".repeat(64)}`,
  };
}

function createMemoryStorage(): Storage {
  const storageEntries = new Map<string, string>();
  return {
    get length() {
      return storageEntries.size;
    },
    clear(): void {
      storageEntries.clear();
    },
    getItem(storageKey: string): string | null {
      return storageEntries.get(storageKey) ?? null;
    },
    key(storageIndex: number): string | null {
      return Array.from(storageEntries.keys())[storageIndex] ?? null;
    },
    removeItem(storageKey: string): void {
      storageEntries.delete(storageKey);
    },
    setItem(storageKey: string, serializedValue: string): void {
      storageEntries.set(storageKey, serializedValue);
    },
  };
}
