# React/Pixi Editor Replacement Design

## Status

The user approved the product decisions in this document on 2026-08-02:

- replace the frozen Svelte editor with a React editor;
- retain Pixi.js for map rendering;
- preserve all current user-visible editor capabilities;
- read and write the existing frozen editor's browser-local project format;
- preserve the current visual layout, control positions, and interaction flow;
- meet explicit desktop, mobile, warm-cache, and Core Web Vitals targets;
- complete the work in the current project;
- do not push to GitHub;
- do not create a commit without separate authorization.

The user reviewed the written design and confirmed on 2026-08-02 that the
complete React/Pixi replacement should proceed in the current project.

After source-level compatibility review, the user also confirmed these
implementation decisions:

- compatibility covers the complete format that the frozen validator actually
  accepts and preserves;
- existing string placement IDs are preserved through a reversible in-memory
  ID mapping instead of changing every React controller to string IDs;
- project import appends safely, and ID conflicts create a fully remapped copy
  rather than replacing existing projects.

## Goal

Replace the homepage's frozen Svelte/Pixi runtime with a maintainable React/Pixi
editor that preserves current editor behavior and existing browser-local
projects while improving the time from navigation to an interactive default
farm.

## User scenario

A visitor opens the English homepage, reads server-rendered product content,
and uses the embedded Stardew Valley planner. The editor must load without an
empty white state, must not delay or destabilize the SEO-critical homepage
content, and must continue to open projects already created by the current
frozen editor.

## Non-goals

- Do not redesign the editor.
- Do not move the editor to a new public route.
- Do not replace Pixi.js.
- Do not change the canonical homepage, metadata, structured data, FAQ, or
  public navigation for this migration.
- Do not change the persistent project schema or localStorage key.
- Do not add a global state library, data-fetching framework, animation
  library, i18n framework, or second rendering engine.
- Do not load the old and new editors simultaneously.
- Do not delete the frozen runtime during the initial local cutover.
- Do not push, deploy, or commit.

## Verified current state

The homepage renders `HomepagePlannerWorkspace`, which renders only
`ReferenceRuntimeHost`. That host dynamically loads a client root with SSR
disabled. The client root injects `/reference-runtime/bootstrap.mjs` in an
effect, and the bootstrap mounts the frozen Svelte/Pixi application.

The repository already contains reusable React and TypeScript editor modules:

- `PlannerCanvas` for Pixi lifecycle, TMX rendering, camera controls, overlays,
  placement rendering, screenshots, touch, and joystick behavior;
- `EditorMenuBar`, `EditorToolbar`, `EditorModal`, `ItemCatalogPanel`,
  `SelectionInspector`, and `InteriorDecorPanel` for the editor UI;
- controller modules under `src/editor/` and placement history under
  `src/placement/`;
- map, asset, catalog, rendering, save-import, project, screenshot, and farm
  summary domain modules.

These modules are isolated and tested but are not composed into a current
React editor workspace. No production source currently renders
`<PlannerCanvas>`.

The frozen editor and the TypeScript V2 project store are incompatible:

- frozen editor key: `stardewplan-reference-local-projects-v1`;
- TypeScript store keys: `stardew-planner.local-projects.v1` and
  `stardew-planner.local-projects.v2`;
- frozen root shape: `{ version: 1, projects: [...] }` with project version 4;
- TypeScript V2 root shape: `{ formatVersion: 2, projects: [...] }`;
- frozen projects keep map arrays, string placement IDs, thumbnails, decor,
  and renovations in fields that differ from the V2 model.

Therefore, importing the historical `PlannerWorkspace` unchanged, using
`LocalProjectStoreV2`, or performing a one-time migration would violate the
approved compatibility contract.

## Architecture

### Server-rendered homepage boundary

The existing Next.js homepage remains responsible for the initial HTML,
heading, explanatory copy, links, FAQ, metadata, canonical, language
alternates, and JSON-LD. The React editor is an isolated client component below
that content.

The server-rendered editor host reserves the current workspace dimensions and
shows an accessible loading state. It does not import Pixi, catalog data, TMX
parsers, project codecs, or editor controls into the homepage server bundle.

### Client editor boundary

A focused `ReactPlannerHost` dynamically loads `PlannerWorkspace` with SSR
disabled. The host chooses exactly one runtime:

- frozen reference runtime while the local development flag selects it;
- React/Pixi workspace while the local development flag selects it;
- React/Pixi workspace by default only after final acceptance.

The selector must never mount or download both implementations in one page
load. The development selector is unlinked, is not added to the sitemap, and
does not change the canonical URL.

### Workspace composition

`PlannerWorkspace` is a client-side orchestrator. It does not render maps,
parse project JSON, or implement placement rules directly. It coordinates
focused interfaces:

```text
PlannerWorkspace
├── usePlannerWorkspaceState
│   ├── selected map and season
│   ├── active tool and modal
│   ├── display and behavior options
│   ├── placement history and selection
│   └── selected catalog/decor item
├── useReferenceProjectRepository
│   ├── list/open/create/rename/delete projects
│   ├── list/open/create/rename/delete/copy/move maps
│   ├── read/write thumbnails
│   └── import/export the canonical reference document
├── referenceProjectEditorAdapter
│   ├── canonical reference map -> internal editor state
│   └── internal editor state -> canonical reference map
├── PlannerCanvas
├── EditorMenuBar + EditorToolbar
├── ItemCatalogPanel
├── SelectionInspector + InteriorDecorPanel
└── EditorModal
    ├── local projects and project maps
    ├── game-save import
    ├── map and display configuration
    ├── screenshot export
    └── farm summary
```

The workspace uses React reducer state and existing domain functions. It does
not introduce a global store. Each reducer action carries one explicit state
transition. Async resources are coordinated outside the reducer.

### Pixi rendering boundary

`PlannerCanvas` remains the only owner of the Pixi `Application`, containers,
textures, camera event listeners, renderer lifecycle, and map drawing. Parent
components communicate through its typed props and callbacks. They must not
read Pixi internals.

The canvas exposes two distinct readiness signals:

- `canvas-ready`: Pixi mounted and the current map rendered;
- `editor-interactive`: camera input and the basic editor tools can process
  actions for the current map.

The loading UI ends only at `editor-interactive`.

## Persistent project compatibility

### Canonical format

The frozen editor's existing reference document remains the only persistence
contract during this migration. The React editor reads and writes:

```text
localStorage["stardewplan-reference-local-projects-v1"]
```

The React V2 project store is not used for production persistence in the new
workspace.

### Repository interface

The project repository is a focused TypeScript module that consumes a
`Storage`-compatible boundary and produces validated reference project values.
Its public interface covers only current user-visible project operations:

```ts
type ReferenceProjectRepository = Readonly<{
  listProjects(): readonly ReferenceProjectSummary[];
  openProject(projectId: string): ReferenceStoredProject;
  createProject(input: ReferenceProjectCreationInput): ReferenceStoredProject;
  duplicateProject(projectId: string): ReferenceStoredProject;
  renameProject(projectId: string, requestedName: string): ReferenceStoredProject;
  deleteProject(projectId: string): void;
  importProject(serializedProject: string): ReferenceStoredProject;
  exportProject(projectId: string): string;
  updateMap(input: ReferenceMapUpdateInput): ReferenceStoredProject;
  createMap(input: ReferenceMapCreationInput): ReferenceStoredProject;
  renameMap(input: ReferenceMapRenameInput): ReferenceStoredProject;
  duplicateMap(input: ReferenceMapIdentityInput): ReferenceStoredProject;
  deleteMap(input: ReferenceMapIdentityInput): ReferenceStoredProject;
  copyMap(input: ReferenceMapTransferInput): ReferenceStoredProject;
  moveMap(input: ReferenceMapTransferInput): ReferenceMapMoveResult;
  saveThumbnail(input: ReferenceThumbnailSaveInput): ReferenceStoredProject;
}>;
```

Export serializes a canonical version-1 document containing exactly the
selected project. Import requires that same one-project document and appends
it to the current document. If the imported project ID already exists, import
creates a new project ID, new map IDs, a remapped `activeMapId`, remapped
thumbnail paths, and remapped `thumbnailsByMapId` keys in one transaction.
Existing projects are never replaced by import.

Project duplication uses the same remapping rules and leaves the source
project unchanged. These two operations are implemented as focused canonical
document operations because the frozen request handler has no project-import
or project-duplicate endpoint. Every other supported mutation delegates its
semantics to the frozen request handler.

### In-memory adapter

The editor may use stricter internal TypeScript state while a map is open, but
conversion must be reversible. The adapter must preserve every field that the
frozen validator accepts and clones, including:

- project and map UUIDs;
- string placement instance IDs;
- extra state keys and extra placement-entry properties accepted by the frozen
  validator, plus decor record values and renovation JSON values;
- buildings, crops, items, rotations, variants, footprints, tints, locks,
  rug/table/bed flags, and custom placement state;
- season, map file, decor, farmhouse renovations, and map-specific state;
- WebP thumbnails and their map association;
- project and map names, active map, `created_at`, and timestamps of unrelated
  projects. A successful frozen mutation is expected to update only the
  affected project's valid ISO `updated_at` timestamp.

The frozen validator reconstructs document, stored-project, project, and map
objects from its known schema and therefore does not preserve unsupported
unknown properties at those four structural levels. The React repository
matches that verified contract; it does not claim to preserve fields that the
frozen editor itself discards.

The current React placement controllers use numeric instance IDs, while the
canonical format uses strings. An open-map session owns a reversible mapping:

- canonical generated IDs such as `b12` and `i9` use their numeric suffix when
  that numeric ID is available;
- arbitrary valid string IDs receive collision-free transient numeric IDs;
- existing edited entries serialize with their original canonical string ID;
- new React entries receive the next unused canonical `bN` or `iN` ID;
- deleted entries disappear without reassigning surviving canonical IDs;
- undo and redo operate only on transient numeric IDs inside the session.

Known editable fields are merged onto the original accepted state-entry
envelope so accepted extension properties remain unchanged.

When a known field cannot be represented by the internal model, the adapter
must fail before mutation with an error naming the project, map, field, and
received value. It must not silently substitute a default.

Saving uses an immutable read-modify-validate-serialize-write transaction:

1. read the current canonical document;
2. validate the full document;
3. update one explicitly identified project/map operation;
4. validate the resulting full document;
5. serialize once;
6. call `storage.setItem` once.

If any step fails, the original localStorage value remains unchanged.

### Compatibility acceptance

Compatibility is proven with round trips in both directions:

- frozen fixture -> React open -> React save -> frozen parser;
- React save -> frozen editor operation -> React parser;
- multiple projects and multiple maps;
- thumbnails, decor, renovations, and every placement category;
- corrupt JSON, invalid schema, missing relationships, and storage quota
  errors.

## User-visible feature parity

The React editor is not eligible for default cutover until these capabilities
match the current frozen editor:

### Map and rendering

- current map catalog and display names;
- map and season switching;
- Standard Farm default load;
- Ginger Island and farmhouse-specific configuration;
- all verified map layers and seasonal tilesheets;
- zoom, pan, pointer, touch, pinch, keyboard, and joystick controls;
- grid, coverage, buildability, crop, NPC path, night, resource-clump, and
  related current overlays;
- current desktop, compact, and mobile canvas behavior.

### Editing

- catalog categories and search;
- building, crop, placeable, furniture, decor, tree, path, fence, and related
  supported placements;
- cursor placement, fill, erase, rectangle erase, single selection, rectangle
  selection, group movement, duplication, rotation, deletion, and dismissal;
- undo and redo with the current keyboard shortcuts;
- free placement and current editor preferences;
- selection inspection, paint, tint, light, variant, and supported placement
  properties;
- interior wallpaper and floor decoration.

### Projects and import/export

- project list, create, open, rename, duplicate, delete, import, and export;
- project map list, create, open, rename, duplicate, delete, copy, and move;
- active map persistence;
- screenshot and high-quality screenshot export;
- map thumbnails;
- game-save XML import and its current unmapped-item feedback;
- farm summary and its current map/season context.

### Visual and interaction parity

The React editor preserves the current information architecture, control
positions, labels, modal flow, responsive breakpoints, and interaction order.
Tailwind CSS and existing shadcn primitives may implement the UI, but they do
not authorize a visual redesign.

Visual parity is defined by computed geometry and screenshots at desktop,
compact, and mobile widths. Pixel-perfect matching is not required where the
browser produces rendering noise, but control presence, position, dimensions,
overflow, focus order, and usable hit targets must match the approved
reference evidence.

## Loading and SEO architecture

### Critical path

The initial page must prioritize server-rendered homepage content. The editor
must not add a full-runtime `modulepreload` to the initial HTML.

After the editor island mounts, start these independent operations in
parallel:

- import `pixi.js`;
- fetch the default Standard Farm TMX;
- read and validate browser-local project state;
- restore lightweight editor preferences.

The current `PlannerCanvas` serializes TMX work before Pixi import. That
waterfall is replaced by an explicit resource coordinator whose promises are
consumed by the canvas through a typed interface. A resource URL has one
in-flight promise per page lifecycle.

### First interactive editor

The first interactive editor requires only:

- the editor control shell;
- validated lightweight workspace state;
- Pixi;
- the current map TMX;
- the current map's required tilesheets;
- camera input;
- placement history for the open map;
- the basic selection, place, erase, undo, and redo controls.

It does not wait for every catalog category, all other maps, inactive season
textures, screenshots, game-save import, farm summary, or unopened modal code.

### Deferred work

- Catalog JSON is loaded by visible category. Independent files in one
  category load with `Promise.all`.
- `Buildings.json` is fetched once and shared with placement metadata.
- Furniture, decor, fruit trees, advanced placeables, and their textures load
  when their category becomes relevant.
- Other map TMX and tilesheets load only after map selection.
- Screenshot, game-save import, project-management details, and farm-summary
  code split at their modal boundary.
- Deferred work uses browser scheduling only after the interactive signal; it
  must yield to input and must not block homepage LCP.

### Loading UI

The server-rendered workspace reserves the current height. A small accessible
status reports loading without changing layout. The status changes based on
real resource states, never an arbitrary timeout.

Known failures expose a specific message and recovery action. A failed project
read does not delete data. A failed editor startup does not mount the old
runtime automatically in the same page because that would double-load heavy
resources; the user may explicitly reload with the local fallback selector.

### Performance marks

The new editor records local browser marks without analytics:

- `editor:island-mounted`;
- `editor:project-state-ready`;
- `editor:pixi-module-ready`;
- `editor:default-map-fetched`;
- `editor:default-map-parsed`;
- `editor:required-textures-ready`;
- `editor:canvas-mounted`;
- `editor:interactive`.

The acceptance time is `navigationStart` to `editor:interactive`. Tests also
observe LCP, CLS, supported INP event timing, and long tasks. No tracking SDK or
network reporting is added.

### Hosting boundary

The app remains a static export. Repository code cannot assume production
cache headers. Before deployment, the hosting layer must be verified for:

- long immutable caching of hashed `/_next/static/**` assets;
- long immutable caching of versioned `/game-assets/1.6.15/**` assets;
- short/revalidated HTML caching;
- Brotli or gzip for JavaScript, JSON, and TMX.

No deployment configuration is changed until the actual host and current
response headers are verified and the user separately authorizes that scope.

## Local cutover and rollback

Development happens in the current project without pushing or committing.
The frozen runtime remains the default while the React implementation is
incomplete. A local, unlinked selector chooses one implementation before either
is imported.

After all functional, compatibility, visual, SEO, build, and performance gates
pass locally:

1. make the React/Pixi implementation the default in the current project;
2. keep the frozen runtime files and selector as a local fallback;
3. verify the built default no longer requests frozen Svelte runtime assets;
4. report the remaining fallback files and their static-output cost;
5. delete the fallback only after separate user approval.

This is one completed implementation, not a partial public rollout. The hidden
selector exists only to compare and recover safely during local development.

## Error handling

- Validate data at localStorage, imported file, TMX, JSON, and asset URL
  boundaries.
- Include the received value and project/map/resource identity in errors.
- Do not catch unknown errors merely to continue.
- Do not use empty catches, fallback defaults for unknown project fields, or
  console-only failures.
- Abort stale map and catalog work on lifecycle replacement where supported;
  otherwise guard completion with a current-generation identity.
- Destroy Pixi applications, textures owned by the lifecycle, observers, and
  event listeners on unmount.
- A failed async resource changes one explicit UI state to error; it does not
  leave an indefinite loading state.

## File responsibility plan

Existing modules are reused where their responsibility already matches the
design. New files are limited to responsibilities that do not currently
exist:

- React runtime selector/host;
- React planner workspace orchestrator;
- workspace reducer and typed actions, ported narrowly from historical work
  only after comparison with current modules;
- canonical reference project repository;
- reversible reference project/editor adapter;
- shared resource coordinator and category-based catalog loaders;
- local performance mark boundary;
- route, component, repository, adapter, resource, visual, browser, and
  performance tests.

Historical branch files are evidence, not an implementation source to merge
wholesale. In particular, the historical one-time migration to
`LocalProjectStoreV2` is rejected because it violates the approved persistence
contract. Any useful workspace orchestration is ported file by file against
current APIs and tests.

## Testing strategy

Implementation uses strict red-green-refactor cycles.

### Unit and integration

- repository parsing, validation, atomic writes, and all project/map
  operations;
- reversible reference-to-editor adapter with full fixtures;
- reducer transitions and controller orchestration;
- shared request promise cache and category loaders;
- performance event ordering;
- component control presence, focus, keyboard, and error states;
- Pixi lifecycle and stale async cleanup;
- frozen/React alternating-read compatibility.

### Rendering and interaction

- every supported map loads in every supported season as an automated smoke
  matrix where resource contracts permit;
- Standard Farm full interaction path: place, select, move, duplicate, rotate,
  erase, fill, delete, undo, redo, save, reopen;
- current overlays, interiors, paint/tint/light, import, export, screenshots,
  summaries, projects, and map operations;
- desktop, compact, and mobile visual geometry and browser interactions.

### SEO and delivery

- initial static HTML retains readable homepage content, heading, metadata,
  canonical, alternates, and JSON-LD;
- the server HTML does not include Pixi or full editor catalog code;
- the default accepted build requests the React editor and does not request
  frozen runtime assets;
- editor loading does not change reserved geometry;
- `pnpm typecheck`, relevant Vitest suites, full `pnpm test`, `pnpm build`, and
  `git diff --check` pass;
- static `out/` is the browser-verification source, not HMR.

### Performance

Use the same browser version, viewport, CPU/network profile, static build, and
measurement script for old and new editors. Run at least three samples and use
the median:

- desktop cold cache: `navigationStart -> editor:interactive <= 1.5 s`;
- mobile emulation with Fast 4G cold cache: `<= 2.5 s`;
- warm cache: `<= 0.8 s`;
- no measurable regression in homepage LCP, INP, or CLS;
- no fake completion at canvas visibility before the basic tools respond.

If a target is not met, report the measured segments and stop acceptance. Do
not hide the miss behind a loading animation or relax the metric without user
approval.

## Acceptance criteria

- The React/Pixi editor is the default local homepage implementation.
- The frozen Svelte runtime is not downloaded by that default implementation.
- Every current user-visible capability listed above passes its functional
  acceptance path.
- Existing reference projects open, edit, save, export, and reopen without
  semantic data loss; the frozen implementation can still read the saved data.
- The current visual layout and interaction positions are preserved at the
  accepted breakpoints.
- The explicit desktop, mobile, and warm-cache targets pass.
- Homepage SEO HTML and Core Web Vitals do not regress.
- All required automated and built-browser checks pass.
- No unrelated file is modified.
- No commit, push, deployment, or fallback deletion occurs.

## Known risks

- The target is a complete editor replacement, not a small import switch. The
  workspace orchestrator, canonical project repository, reversible adapter,
  and React visual styles do not currently exist on `main`.
- Default-map resources include about 1 MB of TMX/PNG data before transport
  compression and image decode; absolute performance targets must be proven on
  the accepted profiles rather than assumed.
- Exact compatibility may reveal frozen fields that the stricter current
  internal model cannot represent. The adapter must preserve or explicitly
  model them; it cannot discard them.
- Existing React components have tests but no integrated production consumer,
  so integration can expose lifecycle and state-coupling defects.
- Keeping the fallback avoids destructive deletion but retains static files in
  the output until separately approved for removal.
