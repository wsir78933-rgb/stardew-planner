# React/Pixi Editor Acceptance

## Scope

- Every homepage planner URL uses React + Pixi. Legacy `plannerRuntime` query
  parameters are ignored.
- Static SEO shell remains server-rendered. The planner starts only after client
  hydration, so the static output contains the accessible `Loading planner…`
  status rather than canvas or retired-runtime markup.

## Production measurement command

```bash
pnpm build
pnpm exec serve out --listen 3000
node scripts/measure-editor-performance.mjs \
  --base-url http://127.0.0.1:3000 \
  --cdp-http-url http://127.0.0.1:9333 \
  --viewport desktop|mobile \
  --cache cold|warm \
  --samples 3
```

The script creates a temporary CDP page for each sample, validates all eight
editor marks, rejects retired-runtime requests, clicks the live canvas,
and reports LCP, CLS, Event Timing interaction duration, and long-task count.

Fast 4G uses the Chrome DevTools Fast 4G profile: 8.1 Mbps downstream, 1.35
Mbps upstream, and 165 ms latency at a 390 by 844 viewport. The mobile cold
target is 2500 ms. The historical measurement below does not meet this gate
and must not be used as acceptance evidence. Desktop cold and warm targets are
1500 ms and 800 ms.

## Measured results

| Profile | Samples in ms | Median | Target | Result |
| --- | --- | ---: | ---: | --- |
| Desktop cold | 610.4, 608.8, 607.4 | 608.8 | <= 1500 | pass |
| Mobile Fast 4G cold | 2827.2, 2655.1, 2669.6 | 2669.6 | <= 2500 | fail (historical) |
| Desktop warm | 574.5, 565.6, 553.8 | 565.6 | <= 800 | pass |

The measured canvas interaction duration was 24–40 ms, CLS was 0 for every
recorded sample, and the React request sets contained no
`/reference-runtime/` or `/_app/immutable/` request.

## Browser checks

| Viewport | Check | Result |
| --- | --- | --- |
| Desktop 1280 by 720 | Eight marks, completed Pixi canvas, menu, toolbar, catalog, and farm renderer | pass |
| Mobile 390 by 844 | Canvas measured 388 by 528, workspace width 390, document scroll width 390 | pass |
| React-only route | Retired runtime root count 0 and no retired-runtime network request | pass |

## SEO checks

The built `out/index.html` retains the SEO title, description, canonical URL,
English/Chinese alternate URLs, WebApplication JSON-LD, visible H1, farm-guide
links, FAQ content, trust content, sitemap route, and robots route. The
React-only editor assets are absent from static HTML and begin only after
hydration.

## Final regression checks

- `pnpm exec vitest run tests --testTimeout=15000`: 155 files and 1500 tests
  passed.
- `pnpm typecheck`: passed.
- `NEXT_TELEMETRY_DISABLED=1 pnpm build`: passed; all 30 public routes were
  statically generated where expected.
- `git diff --check`: passed.

## Performance implementation

- The homepage mounts the React planner host directly.
- Pixi texture loading is initialized once with explicit local PNG/WebP
  preferences, avoiding runtime format detection work.
- Required standard-farm textures use lossless WebP equivalents: 848 KB of PNG
  source files becomes approximately 270 KB of transferred texture assets.
- Catalog thumbnails load only once the map is interactive, so they do not
  compete with required map textures.
- Every later map/season continues to use its canonical PNG asset if no
  lossless WebP equivalent is declared.
