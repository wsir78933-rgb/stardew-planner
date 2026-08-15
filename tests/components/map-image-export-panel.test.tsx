import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  exportMapImageScreenshot,
  formatMapImageExportError,
  MapImageExportPanel,
} from "../../src/components/map-image-export-panel";
import { getSaveModalCopy } from "../../src/i18n/save-modal-copy";
import {
  downloadBrowserFile,
  isBrowserFileDownloadError,
  type BrowserFileDownload,
  type BrowserFileDownloadPlatform,
} from "../../src/projects/browser-file-download";
import { MapImageExportError } from "../../src/projects/map-image-export";

describe("map image export panel", () => {
  it("renders the source-shaped 1x and HQ screenshot controls", () => {
    const markup = renderToStaticMarkup(
      createElement(MapImageExportPanel, {
        copy: getSaveModalCopy("zh-CN").imageExport,
        mapFile: "Farm.tmx",
        onCaptureScreenshot: async () =>
          new Blob(["png"], { type: "image/png" }),
        season: "spring",
      }),
    );

    expect(markup).toContain("截图");
    expect(markup).toContain("截图（高清）");
    expect(markup).toContain('title="1 倍分辨率，文件较小"');
    expect(markup).toContain('title="2 倍分辨率，画质更高"');
  });

  it("keeps the screenshot export error container as a role alert", () => {
    const componentSource = readFileSync(
      new URL("../../src/components/map-image-export-panel.tsx", import.meta.url),
      "utf8",
    );

    expect(componentSource).toContain('role="alert"');
  });

  it("formats a real browser download capability failure for the alert container", async () => {
    expect(
      formatMapImageExportError(
        new MapImageExportError("Map is loading."),
        getSaveModalCopy("zh-CN").imageExport,
      ),
    ).toBe("截图导出失败：Map is loading.");

    let capturedResolution: number | null = null;
    const browserDownloadError = await getRejectedPromiseError(
      exportMapImageScreenshot({
        mapFile: "Farm.tmx",
        onCaptureScreenshot: async (resolution) => {
          capturedResolution = resolution;
          return new Blob(["png"], { type: "image/png" });
        },
        resolution: 1,
        season: "spring",
      }),
    );

    expect(capturedResolution).toBe(1);
    expect(isBrowserFileDownloadError(browserDownloadError)).toBe(true);
    expect(formatMapImageExportError(
      browserDownloadError,
      getSaveModalCopy("en").imageExport,
    )).toContain(
      "Browser file download platform requires document",
    );
    expect(formatMapImageExportError(
      browserDownloadError,
      getSaveModalCopy("en").imageExport,
    )).toMatch(
      /Farm_spring_\d{4}-\d{2}-\d{2}\.png/,
    );
  });

  it("rethrows the original screenshot capture failure", async () => {
    const screenshotCaptureError = new Error("Unexpected screenshot capture fault.");

    await expect(
      exportMapImageScreenshot({
        mapFile: "Farm.tmx",
        onCaptureScreenshot: async () => {
          throw screenshotCaptureError;
        },
        resolution: 1,
        season: "spring",
      }),
    ).rejects.toBe(screenshotCaptureError);
  });

  it("rethrows the original anchor click failure from the injected downloader", async () => {
    const anchorClickError = new Error("Unexpected anchor click fault.");
    const platform = createAnchorClickFailurePlatform(anchorClickError);
    const downloadFile = (file: BrowserFileDownload): void => {
      downloadBrowserFile(file, platform);
    };

    await expect(
      exportMapImageScreenshot({
        downloadFile,
        mapFile: "Farm.tmx",
        onCaptureScreenshot: async () => new Blob(["png"], { type: "image/png" }),
        resolution: 2,
        season: "spring",
      }),
    ).rejects.toBe(anchorClickError);
    expect(isBrowserFileDownloadError(anchorClickError)).toBe(false);
  });
});

function createAnchorClickFailurePlatform(
  anchorClickError: Error,
): BrowserFileDownloadPlatform {
  return {
    appendDownloadAnchor(): void {},
    createDownloadAnchor() {
      return {
        download: "",
        href: "",
        style: { display: "" },
        click(): void {
          throw anchorClickError;
        },
        remove(): void {},
      };
    },
    createObjectUrl(): string {
      return "blob:map-image";
    },
    revokeObjectUrl(): void {},
    schedule(): void {},
  };
}

async function getRejectedPromiseError(promise: Promise<void>): Promise<unknown> {
  try {
    await promise;
  } catch (caughtError) {
    return caughtError;
  }

  throw new Error("Expected map image screenshot export to reject.");
}
