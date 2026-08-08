import type { CatalogPaintableChestRenderingMetadata } from "./catalog-types";

const metadata: CatalogPaintableChestRenderingMetadata = { kind: "paintable-chest" };
const ids = new Set(["130", "232", "BigChest", "BigStoneChest"]);

export const paintableChestPalette = [
  ["Blue", "#5555ff"], ["Sky Blue", "#77bfff"], ["Teal", "#00aaaa"], ["Aqua", "#00eaaf"], ["Green", "#00aa00"], ["Lime", "#9fec00"], ["Yellow", "#ffea12"], ["Light Orange", "#ffa712"], ["Orange", "#ff6912"], ["Red", "#ff0000"], ["Dark Red", "#870023"], ["Light Pink", "#ffadc7"], ["Hot Pink", "#ff75c3"], ["Purple", "#ac00c6"], ["Bright Purple", "#8f00ff"], ["Dark Purple", "#590b8e"], ["Dark Gray", "#404040"], ["Gray", "#646464"], ["Light Gray", "#c8c8c8"], ["White", "#fefefe"],
] as const;

export function getLockedPaintableChestMetadata(recordId: string): CatalogPaintableChestRenderingMetadata | undefined {
  return ids.has(recordId) ? metadata : undefined;
}
