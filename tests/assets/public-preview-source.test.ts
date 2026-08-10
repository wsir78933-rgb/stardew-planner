import { describe, expect, it } from "vitest";
import { createPublicPreviewSource } from "../../src/assets/public-preview-source";

describe("createPublicPreviewSource", () => {
  it("maps an official farm PNG preview to its public WebP path", () => {
    expect(createPublicPreviewSource("maps/previews/Farm.png")).toBe(
      "/public-previews/1.6.15/maps/previews/Farm.webp",
    );
  });

  it("maps a mod PNG preview to its public WebP path", () => {
    expect(
      createPublicPreviewSource("mods/draylon.everfarm/preview.png"),
    ).toBe("/public-previews/1.6.15/mods/draylon.everfarm/preview.webp");
  });

  it.each([
    "",
    "/maps/previews/Farm.png",
    "maps/previews/",
    "maps\\previews\\Farm.png",
    "maps/../previews/Farm.png",
    "maps/previews/Farm.jpg",
  ])("rejects invalid preview output path %j", (receivedPreviewOutputPath) => {
    expect(() => createPublicPreviewSource(receivedPreviewOutputPath)).toThrow(
      JSON.stringify(receivedPreviewOutputPath),
    );
  });
});
