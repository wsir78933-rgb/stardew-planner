# Rendering Asset Expansion Plan

**Goal:** Extend the locked map bootstrap snapshot into the complete local rendering/data asset pack required by the planner.

## Confirmed inputs

- The initial local snapshot has 113 validated assets: 64 TMX maps, 48 previews, and `data/Crops.json`.
- The fixed source version is `1.6.15` at `https://assets.stardewplan.com/assets/1.6.15/`.
- Local TMX parsing and the reference resolver identify 108 image files that exist as `image/png` resources. Forty-six requested Mod non-spring seasonal variants return 404 in the fixed source snapshot.
- The public release must remain usable. The renderer will use an explicit local spring-sheet fallback only for a confirmed missing Mod seasonal variant; it will never lock a 404 response or invent an asset file.

## Tasks

1. Create a typed, test-backed static manifest of the 108 verified tilesheets and the public planner data/sprite resources with exact source URLs and relative output paths.
2. Combine the render manifest with `sourceAssets`, run `pnpm assets:sync`, and verify the expanded lock's file/hash correspondence.
3. Implement a small renderer-facing asset resolver that maps a map's tileset reference and season to a local locked path, using the explicit spring fallback only when the corresponding source variant is absent.

## Acceptance

- Every manifest entry passes `validateSourceAsset` and no output path collides under the canonical filesystem-safe rules.
- Synchronization never depends on the original domain at runtime; each locked file exists and matches its recorded SHA-256.
- The resolver never returns a missing path for a catalogued map/reference and exposes whether it used the known seasonal fallback.
- The 46 confirmed unavailable source URLs are not manifest entries and are covered by resolver tests rather than silently requested.
