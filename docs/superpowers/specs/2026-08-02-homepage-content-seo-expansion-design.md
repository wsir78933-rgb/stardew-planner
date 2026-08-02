# Homepage Content SEO Expansion Design

## Status

Conversation design and written specification approved on 2026-08-02.
Implementation is authorized but has not started.

## Goal

Improve the existing homepage at `/` for the English keyword
`stardew valley planner` while preserving the interactive planner on the same
route. The page must explain verified product capabilities, connect the planner
to the existing farm-guide content cluster, and keep the current English and
Simplified Chinese homepage language modes structurally equivalent.

## User Decisions

- Extend the existing typed homepage content model instead of using a copy-only
  rewrite or restructuring `/zh` into a second planner route.
- Keep the current planner on `/`; do not create `/planner`.
- Keep English and Simplified Chinese homepage content synchronized through the
  existing typed i18n model.
- Preserve the `/mods` footer destination and rename its label to
  `Modded farms` in English and `模组农场` in Simplified Chinese.
- Mention game-save import and screenshot export only after both behaviors pass
  a real-browser preflight against a fresh static export.
- For screenshot export, use the user-approved browser-interaction gate: each
  visible screenshot control must emit one download event and visible success
  feedback without adding console warnings or errors. File names, sizes, and
  PNG bytes are outside this reduced gate and must not be claimed.
- Treat the exact current dirty working tree as a protected implementation
  baseline. Preserve every pre-existing tracked and untracked change.
- Use subagents for implementation and review.
- Do not commit, push, deploy, install dependencies, or modify lockfiles.

## Protected Working-Tree Baseline

The user selected the current dirty working tree as the implementation
baseline. Before the browser preflight or any production-content edit, create
an ignored evidence directory at
`.superpowers/sdd/2026-08-02-homepage-content-seo-expansion/` containing:

- `git-status-before.txt` from `git status --short`;
- `tracked-diff-before.patch` from `git diff --binary`;
- `untracked-files-before.txt` containing the sorted untracked-file paths;
- `baseline-sha256.txt` containing SHA-256 hashes for every tracked modified
  file and every untracked file present at baseline capture time.

The snapshot is evidence only. It must not stage, commit, stash, reset,
reformat, copy over, or delete any existing change.

Implementation may edit only files explicitly named by the later approved
implementation plan. When an authorized target file already contains baseline
changes, the implementation must make a narrow patch against its current
contents rather than replace the file. After each implementation task, compare
the new diff to the recorded snapshot and fail immediately if a pre-existing
hunk or untracked file disappeared or changed outside the task's authorized
lines.

The implementation may create only these new task-owned artifacts before the
final file list is approved:

- files under the ignored evidence directory above;
- the browser fixture and test-evidence files explicitly required by this
  specification;
- the written implementation plan under `docs/superpowers/plans/`.

No subagent receives permission to clean the worktree, revert a file, or
modify files outside its assigned file list. Review subagents are read-only.

## Verified Product Claims

The homepage may state only the following product capabilities:

- Users can choose from eight official farm types: Standard, Riverland,
  Forest, Hill-top, Wilderness, Four Corners, Beach, and Meadowlands.
- Ginger Island is also available from the planner map picker. The homepage
  must not describe the planner as supporting only eight maps or all possible
  maps.
- Users can switch between spring, summer, fall, and winter.
- Users can place buildings, crops, placeables, and decor. The copy must not
  claim that every game item is available.
- Users can visualize sprinkler, scarecrow, Bee House, and Junimo Hut coverage.
  The copy must not claim that the planner guarantees an optimal layout or
  validates every placement.
- Projects can be created and saved locally in the current browser.
  The copy must not imply cloud sync, cross-device storage, or account-based
  saving.

The homepage must not claim support for JSON import/export, share links,
accounts, sign-in, cloud sync, payments, or memberships. Those functions are
not available through the current frozen homepage runtime.

## Browser Capability Preflight

The preflight is a fail-fast gate before any production-content edit.

Create `tests/fixtures/browser/minimal-stardew-save.xml` with this exact
browser-upload fixture:

```xml
<SaveGame xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <whichFarm>0</whichFarm>
  <currentSeason>summer</currentSeason>
  <player><farmName>Junimo</farmName></player>
  <locations>
    <GameLocation>
      <name>Farm</name>
      <buildings>
        <Building><buildingType>Barn</buildingType><tileX>10</tileX><tileY>12</tileY></Building>
      </buildings>
      <objects></objects>
      <terrainFeatures></terrainFeatures>
      <resourceClumps></resourceClumps>
      <largeTerrainFeatures></largeTerrainFeatures>
      <furniture></furniture>
    </GameLocation>
  </locations>
</SaveGame>
```

The fixture is test evidence, not production content. Before interacting, wait
for exactly one initialized `#reference-runtime-root`, then record the existing
browser console error and warning fingerprints as the preflight baseline.

1. Build a fresh static export and serve `out/` without development HMR.
2. Cold-load `/` in the Hermes CDP browser.
3. Upload `tests/fixtures/browser/minimal-stardew-save.xml` through the visible
   `Import Game Save` file input.
4. Require one visible `.map-switch-overlay` containing the exact text
   `Junimo Farm`. The overlay must not contain an import-failure message.
5. Require the post-import console error and warning fingerprints to be a
   subset of the recorded baseline.
6. Register one documented browser download-event wait immediately before
   clicking `Screenshot`. Require exactly one download event and one visible
   `Screenshot saved` success notification for that click.
7. Repeat the same isolated event wait for `Screenshot (HQ)`. Require exactly
   one additional download event and one visible `Screenshot saved` success
   notification for that click.
8. Require exactly two download events in total and require the post-download
   console error and warning fingerprints, including occurrence counts, not to
   exceed the recorded baseline.

The preflight evidence report records the served static-export path, browser
URL, fixture path, import overlay text, the two exact button labels, the
download-event count for each click, the observed success notification for each
click, and the before/after console fingerprints.

If any check fails, stop before changing homepage SEO content and report the
failed behavior. Do not silently omit the claim or substitute weaker wording.

If every check passes, the homepage may also state:

- Game-save import is experimental and unsupported or modded items may not be
  mapped.
- Users can export standard or high-quality screenshots of their farm layout.

The homepage must not state or imply a screenshot file format, filename, or
file-size property because the reduced browser-interaction gate does not inspect
download bytes.

## Content Architecture

The homepage keeps this order:

1. Header and in-page navigation.
2. Search-intent-focused hero.
3. Existing interactive planner workspace.
4. Three verified capability cards.
5. Official farm-guide discovery section.
6. FAQ disclosures.
7. Trust statement.
8. Footer.

SEO copy remains outside the planner canvas. The frozen runtime stays
client-only and receives no content or behavior change.

## English Search Elements

### Metadata title

`Stardew Valley Planner – Interactive Farm Layout Tool`

### Metadata description

`Plan all 8 Stardew Valley farm types in your browser. Place buildings and crops, switch seasons, check coverage, and import game saves.`

The metadata description is permitted only after the game-save import preflight
passes.

### H1

`Stardew Valley Planner for Every Farm Layout`

Preserve the existing emphasized-fragment interface with these exact values:

- `headlineBefore`: `Stardew Valley `
- `headlineEmphasis`: `Planner`
- `headlineAfter`: ` for Every Farm Layout`

### Hero supporting copy

`Design your farm directly in the browser. Choose from eight official farm types, place buildings, crops and decor, switch between seasons, and visualize important coverage ranges.`

### Capability cards

1. `Plan every official farm type`
   - `Start with Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach or Meadowlands. Ginger Island is also available in the map picker.`
2. `Place and evaluate your layout`
   - `Arrange buildings, crops, placeables and decor while checking sprinkler, scarecrow, Bee House and Junimo Hut coverage.`
3. `Keep projects in this browser`
   - `Create and save local projects without an account or cloud sync.`

### Trust statement

- Heading: `About this planner`
- Description:
  `Fan-made Stardew Valley planning tool. Not affiliated with or endorsed by ConcernedApe or Stardew Valley. Projects stay in this browser.`

### Farm-guide discovery copy

- Heading: `Choose a farm type before you plan`
- Description:
  `Compare each official farm's space, constraints, and strengths, then open the guide that matches your layout.`
- Comparison CTA: `Compare all farm types`

### FAQ copy

1. `Where are my projects stored?`
   - `Projects are saved locally in this browser. There is no account or cloud sync, so use the same browser and device to reopen them.`
2. `Which Stardew Valley farm types can I plan?`
   - `The planner includes Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, and Meadowlands. Ginger Island is also available in the map picker.`
3. `Which seasons and coverage views are available?`
   - `You can switch between spring, summer, fall, and winter and show sprinkler, scarecrow, Bee House, and Junimo Hut coverage.`
4. `Can I import a Stardew Valley save?`
   - `Yes. Game-save import is experimental, and unsupported or modded items may not be mapped.`
5. `Can I export my farm layout?`
   - `Yes. The planner provides standard and high-quality screenshot downloads.`

## Simplified Chinese Content Contract

The Simplified Chinese homepage mode must contain a faithful translation of
every new English section. It must preserve the same meaning, limitations,
number of capability cards, farm-guide destinations, FAQ topics, and trust
statement. It must not introduce stronger claims than the approved English
copy.

Required core translations are:

- H1: `适用于各种农场布局的星露谷物语规划器`
- H1 fragments:
  - `headlineBefore`: `适用于各种农场布局的`
  - `headlineEmphasis`: `星露谷物语`
  - `headlineAfter`: `规划器`
- Hero supporting copy:
  `直接在浏览器中设计农场。选择八种官方农场类型，放置建筑、作物和装饰，切换季节，并查看重要设施的覆盖范围。`
- `Plan every official farm type` → `规划每一种官方农场类型`
- `Place and evaluate your layout` → `摆放并检查农场布局`
- `Keep projects in this browser` → `将项目保存在当前浏览器中`
- Capability descriptions:
  - `从标准、河流、森林、山顶、荒野、四角、海滩或草原农场开始规划。地图选择器中还提供姜岛。`
  - `放置建筑、作物、可放置物和装饰，同时查看洒水器、稻草人、蜂房和祝尼魔小屋的覆盖范围。`
  - `无需账号或云同步，直接在当前浏览器中创建并保存本地项目。`
- Farm-guide heading: `规划前先选择农场类型`
- Farm-guide description:
  `比较每种官方农场的空间、限制和优势，再打开适合你布局的指南。`
- Farm comparison CTA: `对比全部农场类型`
- `Modded farms` → `模组农场`
- Trust statement:
  - Heading: `关于这个规划器`
  - Description:
    `这是一个玩家制作的《星露谷物语》规划工具，与 ConcernedApe 或《星露谷物语》官方无隶属或认可关系。项目只保存在当前浏览器中。`
- FAQ:
  1. `项目保存在哪里？`
     - `项目保存在当前浏览器本地。这里没有账号或云同步功能，因此请使用同一浏览器和设备重新打开项目。`
  2. `支持规划哪些星露谷物语农场类型？`
     - `规划器包含标准、河流、森林、山顶、荒野、四角、海滩和草原农场。地图选择器中还提供姜岛。`
  3. `可以查看哪些季节和覆盖范围？`
     - `你可以在春、夏、秋、冬之间切换，并显示洒水器、稻草人、蜂房和祝尼魔小屋的覆盖范围。`
  4. `可以导入星露谷物语存档吗？`
     - `可以。存档导入仍是实验性功能，不受支持或来自模组的物品可能无法映射。`
  5. `可以导出农场布局吗？`
     - `可以。规划器提供标准画质和高画质的截图下载。`

The current standalone `/zh` introduction route remains unchanged. This task
maintains the existing client-side language mode on `/`; it does not redesign
the localized route architecture.

## Farm-Guide Discovery

A new `HomepageFarmGuideLinks` component owns the official farm-guide section.
It receives the current homepage locale and localized section copy through its
public props.

The component must:

- Iterate the existing `officialFarmTypes` source of truth.
- Read each localized display name through
  `getLocalizedOfficialFarmGuide(locale, farmType)`.
- Create destinations through
  `getLocalizedPublicPath(locale, canonicalPath)`.
- Link English mode to `/farm-comparison` and `/farm/<type>`.
- Link Simplified Chinese mode to `/zh/farm-comparison` and
  `/zh/farm/<type>`.
- Render one comparison CTA and exactly eight official farm-guide links.

The component must not duplicate the farm-type list, concatenate localized
paths manually, or read internal state from another component.

## Component Responsibilities

- `PlannerHomepage` continues to own homepage locale state and supplies the
  selected `HomepageLocale`.
- `HomepageContent` remains a composition component. It renders the approved
  sections and passes typed inputs to focused child components.
- `HomepageFarmGuideLinks` owns only localized official-farm discovery links.
- `homepage-copy.ts` owns all user-facing English and Simplified Chinese
  homepage strings.
- `official-farm-guides.ts` remains the single source for official farm types.
- `public-page-content.ts` remains the localization interface for official farm
  display names.
- `public-route-registry.ts` remains the localization interface for public
  destinations.

No class, strategy pattern, generic abstraction layer, or new state container
is introduced.

`HomepageCopy` adds these exact public fields:

- `farmGuides.heading`
- `farmGuides.description`
- `farmGuides.comparisonLinkLabel`
- `trust.heading`
- `trust.description`

The FAQ tuple expands from three to five items. The footer field
`farmGuidesLinkLabel` is renamed to `moddedFarmsLinkLabel` so its identifier
matches the `/mods` destination.

## Footer Contract

The footer keeps two destinations:

- `Farm comparison` / `农场对比` points to the locale-appropriate farm
  comparison route.
- `Modded farms` / `模组农场` points to the locale-appropriate mods route.

The existing mismatch in which `Farm guides` points to `/mods` must no longer
exist.

## FAQ Contract

FAQ content remains native closed-by-default `details` and `summary` markup.
The final FAQ set covers:

1. Where projects are stored.
2. Which official farm types are supported.
3. Which seasons and coverage views are available.
4. The experimental limitations of game-save import.
5. Standard and high-quality screenshot export.

Items 4 and 5 are allowed only after the browser preflight passes. Because the
user selected fail-fast verification, a failed preflight stops the task rather
than producing a reduced FAQ set.

## Styling

New presentation must stay inside the existing homepage structural scope:
`body:has(> [data-homepage-shell])`.

The farm-guide discovery section reuses the current dark-green, cream, lime,
border, typography, and spacing system. It may add only the selectors required
for the new section and responsive link grid. It must not restyle the planner,
header, existing capability cards, FAQ, or non-homepage routes.

At desktop widths, the official farm links may use a compact multi-column grid.
At `390×844`, the links must remain readable, keyboard reachable, and free of
horizontal overflow.

## Error Handling

- Unsupported locales continue to fail through the existing locale and public
  route boundaries.
- Invalid canonical paths continue to fail through
  `getLocalizedPublicPath()` with the received value in the message.
- Missing farm-guide records must not be caught or replaced with placeholder
  text.
- Browser-preflight failures stop implementation and are reported with the
  failed action and observed browser evidence.
- No exception may be silently swallowed.

## Test Strategy

Production-content changes follow TDD.

1. Run the browser capability preflight before writing content tests.
2. Add failing metadata assertions for the approved English title and
   description.
3. Add failing server-rendered homepage assertions for one H1, the approved
   hero, verified capability content, trust text, localized comparison link,
   and exactly eight localized farm-guide links.
4. Add failing copy-contract assertions that both locales expose the same
   typed sections and equivalent item counts.
5. Run the targeted suite and record the expected RED result.
6. Implement the minimum copy, component, metadata, and scoped CSS changes.
7. Re-run targeted tests and record GREEN.
8. Build a fresh static export and verify the same content and links in
   `out/index.html`.
9. Run type checking, the complete Vitest suite, and `git diff --check`.
10. Cold-load the built homepage at desktop and `390×844`, exercise language
    switching, official farm links, FAQ pointer and keyboard interaction, and
    the planner startup path.
    After switching to `zh-CN`, require exactly one
    `/zh/farm-comparison` link, exactly eight `/zh/farm/<type>` links generated
    from `officialFarmTypes`, and one footer `/zh/mods` link labeled `模组农场`.
11. Cold-load `/farm-comparison`, `/farm/standard`, and `/mods` to confirm that
    homepage-only content and styles do not leak.

Tests assert rendered behavior and generated artifacts, not private component
implementation or mocks.

## Confirmed FAQ Keyboard Fallback

The real-browser acceptance gate requires each FAQ disclosure to toggle from
both `Enter` and `Space` after its `<summary>` receives focus. Pointer toggling
already works, but the available browser input paths did not activate the
native disclosure default. The user confirmed on 2026-08-02 that this keyboard
gap should be fixed rather than accepted as an automation limitation.

The fallback is deliberately local to the homepage FAQ:

- `HomepageContent` attaches one `onKeyDown` handler to each FAQ `<summary>`.
- The handler ignores every key except `Enter` and the single-space key value.
- For an accepted key, it calls `preventDefault()` before toggling the owning
  `<details>` element exactly once, preventing native and explicit activation
  from both changing the same disclosure.
- The handler validates that the summary parent is a `DETAILS` element and
  fails with the observed tag name if the component structure is broken.
- The behavior lives in a focused plain-function module consumed through its
  exported handler; no class, strategy layer, dependency, or unrelated FAQ
  state model is introduced.

Tests exercise the handler with real state transitions: `Enter` opens a closed
disclosure, `Space` closes an open disclosure, unrelated keys do nothing, and
an invalid parent fails fast with the offending tag value. Browser acceptance
must then prove pointer, `Enter`, and `Space` toggling on the built homepage.

## Confirmed Final Review Fix Wave

The user confirmed on 2026-08-02 that both Important findings from the final
review must be fixed before acceptance:

- Client-side locale synchronization must not overwrite the exact page title
  supplied by the route metadata. Locale changes continue to update the root
  `lang` attribute and persisted homepage locale, while the English route title
  remains `Stardew Valley Planner – Interactive Farm Layout Tool` after
  hydration and locale round trips.
- Sidebar contrast remediation is limited to enabled sidebar links. The
  homepage runtime root must not redefine shared text variables because those
  variables inherit into unrelated runtime content. Enabled `.panel-row` links
  use the existing `--text` token and their hover state uses
  `--text-bright`; disabled rows and all other runtime text remain untouched.

This is one narrow TDD fix wave. It introduces no dependency, abstraction,
route, content change, runtime rewrite, commit, push, or deployment.

## Acceptance Criteria

- The metadata title contains the exact target phrase `Stardew Valley Planner`.
- The static English homepage contains exactly one H1 with the approved
  search-intent-focused heading.
- English and Simplified Chinese homepage modes contain equivalent approved
  sections and limitations.
- The homepage exposes one farm-comparison link and eight official farm-guide
  links, localized through existing interfaces.
- The footer labels match their actual destinations in both languages.
- Every product claim is backed by the current homepage runtime or the required
  browser preflight.
- The static export contains the approved English title, description, H1,
  capability content, farm-guide links, FAQ answers, and trust statement before
  client hydration.
- The planner remains mounted once through its existing client-only boundary.
- Desktop and `390×844` layouts have no horizontal overflow or blocked planner
  interaction.
- Targeted tests, type checking, production build, full Vitest suite, and
  `git diff --check` pass with fresh evidence.
- No unrelated dirty working-tree change is overwritten or reformatted.

## Non-Goals

- Replacing the frozen Svelte/Pixi runtime.
- Creating a `/planner` route.
- Rebuilding `/zh` as a second interactive planner page.
- Adding JSON project import/export to the frozen runtime.
- Restoring share links, cloud sync, accounts, authentication, payments, or
  memberships.
- Adding technical SEO changes to canonical, hreflang, schema, sitemap, robots,
  redirects, headers, or deployment.
- Adding dependencies, redesigning unrelated UI, committing, pushing, or
  deploying.
