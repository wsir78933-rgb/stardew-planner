import { describe, expect, it } from "vitest";
import { decodeTileLayerData } from "../../src/tmx/decode-tile-layer-data";

describe("decodeTileLayerData", () => {
  it("rejects a base64 payload with incomplete padding before decompression", async () => {
    await expect(
      decodeTileLayerData({
        layerName: "Padding layer",
        encoding: "base64",
        compression: "zlib",
        payload: "A A=",
      }),
    ).rejects.toThrow('invalid base64 padding in payload "A A="');
  });

  it("rejects a base64 payload whose unpadded length is not divisible by four", async () => {
    await expect(
      decodeTileLayerData({
        layerName: "Length layer",
        encoding: "base64",
        compression: "zlib",
        payload: "AAA",
      }),
    ).rejects.toThrow('invalid base64 payload length for "AAA"');
  });
});
