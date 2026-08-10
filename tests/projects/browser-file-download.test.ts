import { describe, expect, it } from "vitest";
import {
  downloadBrowserFile,
  type BrowserFileDownloadPlatform,
} from "../../src/projects/browser-file-download";

describe("browser file download", () => {
  it("downloads a JSON Blob through the provided browser platform", () => {
    const jsonBlob = new Blob(["{\"formatVersion\":2}"], {
      type: "application/json;charset=utf-8",
    });
    const recording = createRecordingDownloadPlatform();

    downloadBrowserFile(
      { blob: jsonBlob, filename: "Forest - Summer.json" },
      recording.platform,
    );

    expect(recording.receivedBlob).toBe(jsonBlob);
    expect(recording.anchor.download).toBe("Forest - Summer.json");
    expect(recording.anchor.href).toBe("blob:project-export");
    expect(recording.anchor.style.display).toBe("none");
    expect(recording.events).toEqual([
      "create-object-url",
      "create-anchor",
      "append-anchor",
      "click-anchor",
      "remove-anchor",
      "schedule-revocation",
    ]);
    expect(recording.revokedObjectUrls).toEqual([]);

    recording.scheduledCallbacks[0]!();

    expect(recording.revokedObjectUrls).toEqual(["blob:project-export"]);
  });

  it("preserves the PNG Blob identity and filename", () => {
    const pngBlob = new Blob(["png"], { type: "image/png" });
    const recording = createRecordingDownloadPlatform();

    downloadBrowserFile(
      { blob: pngBlob, filename: "Farm_spring_2026-08-10.png" },
      recording.platform,
    );

    expect(recording.receivedBlob).toBe(pngBlob);
    expect(recording.anchor.download).toBe("Farm_spring_2026-08-10.png");
  });

  it("schedules object URL revocation when anchor creation fails", () => {
    const anchorCreationError = new Error("Cannot create download anchor.");
    const recording = createRecordingDownloadPlatform({
      anchorCreationError,
    });

    expect(
      captureThrownError(() =>
        downloadBrowserFile(
          { blob: new Blob(["project"]), filename: "Forest - Summer.json" },
          recording.platform,
        ),
      ),
    ).toBe(anchorCreationError);
    expect(recording.events).toEqual([
      "create-object-url",
      "create-anchor",
      "schedule-revocation",
    ]);

    recording.scheduledCallbacks[0]!();

    expect(recording.revokedObjectUrls).toEqual(["blob:project-export"]);
  });

  it("schedules object URL revocation and propagates the remove failure", () => {
    const anchorRemovalError = new Error("Cannot remove download anchor.");
    const recording = createRecordingDownloadPlatform({
      anchorRemovalError,
    });

    expect(
      captureThrownError(() =>
        downloadBrowserFile(
          { blob: new Blob(["project"]), filename: "Forest - Summer.json" },
          recording.platform,
        ),
      ),
    ).toBe(anchorRemovalError);
    expect(recording.events).toEqual([
      "create-object-url",
      "create-anchor",
      "append-anchor",
      "click-anchor",
      "remove-anchor",
      "schedule-revocation",
    ]);

    recording.scheduledCallbacks[0]!();

    expect(recording.revokedObjectUrls).toEqual(["blob:project-export"]);
  });

  it("preserves both the click and remove failures when cleanup also fails", () => {
    const anchorClickError = new Error("Cannot click download anchor.");
    const anchorRemovalError = new Error("Cannot remove download anchor.");
    const recording = createRecordingDownloadPlatform({
      anchorClickError,
      anchorRemovalError,
    });

    const propagatedError = captureThrownError(() =>
      downloadBrowserFile(
        { blob: new Blob(["project"]), filename: "Forest - Summer.json" },
        recording.platform,
      ),
    );

    expect(propagatedError).toBeInstanceOf(AggregateError);
    expect((propagatedError as AggregateError).errors).toEqual([
      anchorClickError,
      anchorRemovalError,
    ]);
    expect(recording.events).toContain("schedule-revocation");
  });

  it("rejects a whitespace-only filename before creating an object URL", () => {
    const recording = createRecordingDownloadPlatform();

    expect(() =>
      downloadBrowserFile({ blob: new Blob(["project"]), filename: "   " }, recording.platform),
    ).toThrow('"   "');
    expect(recording.events).toEqual([]);
  });

  it("rejects a non-Blob value at the download boundary", () => {
    const invalidBlobValue = "not-a-blob";
    const recording = createRecordingDownloadPlatform();

    expect(() =>
      downloadBrowserFile(
        {
          blob: invalidBlobValue as unknown as Blob,
          filename: "Farm_spring_2026-08-10.png",
        },
        recording.platform,
      ),
    ).toThrow('"not-a-blob"');
    expect(recording.events).toEqual([]);
  });

  it("reports the unavailable document capability with the requested filename", () => {
    expect(() =>
      downloadBrowserFile({ blob: new Blob(["project"]), filename: "Forest - Summer.json" }),
    ).toThrow(/document.*Forest - Summer\.json/);
  });
});

function createRecordingDownloadPlatform(
  failures: Readonly<{
    anchorClickError?: Error;
    anchorCreationError?: Error;
    anchorRemovalError?: Error;
  }> = {},
): {
  anchor: {
    click(): void;
    download: string;
    href: string;
    remove(): void;
    style: { display: string };
  };
  events: string[];
  platform: BrowserFileDownloadPlatform;
  receivedBlob: Blob | null;
  revokedObjectUrls: string[];
  scheduledCallbacks: Array<() => void>;
} {
  const events: string[] = [];
  const revokedObjectUrls: string[] = [];
  const scheduledCallbacks: Array<() => void> = [];
  let receivedBlob: Blob | null = null;
  const anchor = {
    download: "",
    href: "",
    style: { display: "" },
    click(): void {
      events.push("click-anchor");
      if (failures.anchorClickError !== undefined) {
        throw failures.anchorClickError;
      }
    },
    remove(): void {
      events.push("remove-anchor");
      if (failures.anchorRemovalError !== undefined) {
        throw failures.anchorRemovalError;
      }
    },
  };
  const platform: BrowserFileDownloadPlatform = {
    appendDownloadAnchor(): void {
      events.push("append-anchor");
    },
    createDownloadAnchor() {
      events.push("create-anchor");
      if (failures.anchorCreationError !== undefined) {
        throw failures.anchorCreationError;
      }
      return anchor;
    },
    createObjectUrl(blob: Blob): string {
      receivedBlob = blob;
      events.push("create-object-url");
      return "blob:project-export";
    },
    revokeObjectUrl(objectUrl: string): void {
      revokedObjectUrls.push(objectUrl);
    },
    schedule(callback: () => void): void {
      events.push("schedule-revocation");
      scheduledCallbacks.push(callback);
    },
  };

  return {
    anchor,
    events,
    platform,
    get receivedBlob() {
      return receivedBlob;
    },
    revokedObjectUrls,
    scheduledCallbacks,
  };
}

function captureThrownError(action: () => void): unknown {
  try {
    action();
  } catch (caughtError) {
    return caughtError;
  }

  throw new Error("Expected browser file download action to throw.");
}
