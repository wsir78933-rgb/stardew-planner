# React/Pixi Canonical Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> `superpowers:subagent-driven-development` and
> `superpowers:test-driven-development` task by task.

**Goal:** Give the React editor a lossless, atomic read/write boundary for the
frozen editor's existing local project document without migration.

**Architecture:** A repository owns the `Storage` boundary and delegates exact
project/map semantics to the already verified reference request handler. A
separate reversible adapter opens one map into strict editor state and merges
only edited fields back into the source envelope.

**Tech Stack:** TypeScript, Vitest, existing reference runtime schema/request
handler, existing placement/editor state types.

## Constraints

- Fixed key: `stardewplan-reference-local-projects-v1`.
- Do not import `src/projects/local-project-store.ts` or any historical
  reference-to-V2 migration module.
- Reads make zero writes. Each successful mutation makes exactly one
  `storage.setItem` call after full-document validation.
- Preserve project/map IDs, canonical string placement IDs, thumbnails, decor,
  renovations, `created_at`, unrelated project timestamps, all accepted state
  extension properties, and all accepted decor/renovation JSON values.
- Match the frozen validator's real boundary: unsupported unknown properties at
  document/stored-project/project/map structural levels are not part of its
  persistent contract because the frozen validator itself discards them.
- A non-representable known value fails before mutation and names project ID,
  map ID, field path, and received value.

### Task 1: Canonical fixtures and repository public contract

**Files:**

- Create: `tests/reference-runtime/fixtures/reference-project-document.ts`
- Create: `src/reference-runtime/reference-project-repository.ts`
- Create: `tests/reference-runtime/reference-project-repository.test.ts`

- [x] Write a two-project fixture containing multiple maps, every supported
  placement kind and property, generated and arbitrary string IDs, thumbnails,
  decor, renovations, extra accepted state keys, and extra accepted placement-
  entry properties. Do not add unsupported structural unknown fields.
- [x] Write RED contract tests that import the future repository through an
  optional namespace property and assert the fixed storage key plus public
  method names. Run:

```bash
pnpm exec vitest run tests/reference-runtime/reference-project-repository.test.ts
```

Expected RED: the repository factory/export is absent.

- [x] Implement only the exported types, fixed key, storage port, and factory
  shell. The factory must require browser `localStorage` only when no injected
  storage is provided; missing browser storage throws a specific error.
- [x] Re-run the focused test and `pnpm typecheck`.

The repository exposes list/open/create/duplicate/rename/delete/import/export
project; create/update/rename/delete/duplicate/copy/move map; and save-thumbnail
operations. `updateMap` is the single save name and accepts the complete frozen
PUT body: map file, label, season, state, decor, renovations, and `setActive`.
Input names must describe the exact operation, not generic data.

### Task 2: Read, validate, list, open, import, and export

**Files:**

- Modify: `src/reference-runtime/reference-project-repository.ts`
- Modify: `tests/reference-runtime/reference-project-repository.test.ts`

- [x] Add RED tests for empty storage, valid list/open, missing project,
  malformed JSON, wrong document version, duplicate IDs, zero-write reads,
  one-project canonical document export, safe-append import, import rejection
  unless the document contains exactly one project, and invalid import.
- [x] Run the focused test and record failures caused by unimplemented reads.
- [x] Implement one private `readReferenceProjectDocument()` function using
  `parseReferenceProjectDocument` and `validateReferenceProjectDocument`.
  Return a validated empty document only for `null`; never treat corrupt text
  as empty.
- [x] Implement list/open/export without mutation. Import parses and validates
  its complete one-project canonical document, appends to the current document,
  and writes the combined document once. It never replaces existing projects.
- [x] Re-run the focused test and typecheck.

### Task 3: Exact project and map mutations

**Files:**

- Modify: `src/reference-runtime/reference-project-repository.ts`
- Modify: `tests/reference-runtime/reference-project-repository.test.ts`

- [x] Add RED tests for create/duplicate/rename/delete project; create/update/rename/
  delete/duplicate/copy/move map; new target project transfer; and WebP
  thumbnail save/read.
- [x] Assert every handler-supported mutation reads current serialized storage,
  invokes the injected `handleReferenceProjectRequest` compatible handler,
  validates the returned full document, serializes, and calls `setItem` once.
- [x] Assert duplicate-project and import use one focused immutable canonical
  operation, then the same full validation/serialization/single-write boundary.
  A duplicate gets a new project ID, new map IDs, remapped active map,
  thumbnails, and thumbnail keys. Import retains IDs when conflict-free; a
  project-ID conflict applies the same complete remapping. Inject `now()` and
  `createIdentifier()` ports so timestamps and identifiers are deterministic.
- [x] Assert handler failure, schema failure, and `setItem` failure do not issue
  any second/repair write and do not mutate the original serialized string.
- [x] Implement one private transaction function. Build encoded paths and the
  exact request bodies already accepted by `handleReferenceProjectRequest`;
  require the expected 2xx response shape before serializing.
- [x] Run focused tests, typecheck, and `git diff --check`.

### Task 4: Reversible open-map adapter

**Files:**

- Create: `src/reference-runtime/reference-project-editor-adapter.ts`
- Create: `tests/reference-runtime/reference-project-editor-adapter.test.ts`

The adapter exports an open-map session containing the untouched source map,
project/map identity, placement snapshot, season, interior decor, both
canonical-string-to-transient-number ID maps, and original canonical next-ID
counters. Map render configuration is derived from verified frozen map fields;
the adapter must not invent a persistent `renderOptions` field. Saving accepts
that session plus edited state and returns a new `ReferenceProjectMap`.

The adapter persists only verified frozen fields: `mapFile`, `label`, `season`,
accepted `state`, `decor`, `renovations`, active-map identity, and thumbnail
relations. Visual render options absent from that schema are derived or
session-only and are never serialized. Ginger Island or farmhouse
configuration is persisted only through an existing verified field such as
`renovations`; implementation must not invent a storage key.

- [x] Add RED tests for frozen-to-editor projection of every supported field,
  including generated IDs, arbitrary string IDs, collision-free transient
  numeric IDs, next-ID state, and accepted entry extension properties.
- [x] Add RED tests that an open/save no-op is semantically equal, edited
  placement/decor/renovation fields change, and unrelated source fields remain
  byte-for-byte deep-equal.
- [x] Add RED fail-fast cases for values the strict editor model cannot
  represent. Assert error context includes project/map/path/value.
- [x] Add RED interaction coverage for arbitrary IDs through select/delete/
  undo/save/reopen and for new entries receiving unused canonical `bN`/`iN`
  IDs without changing surviving IDs.
- [x] Implement pure projection and merge functions. Keep the original accepted
  state-entry envelopes; overwrite only known edited placement fields, state
  arrays, next IDs, season, decor, and renovations.
- [x] Run:

```bash
pnpm exec vitest run tests/reference-runtime/reference-project-editor-adapter.test.ts
pnpm typecheck
```

### Task 5: Frozen/React alternating-read compatibility

**Files:**

- Create: `tests/reference-runtime/reference-project-compatibility.integration.test.ts`
- Modify only if a verified contract gap exists:
  `src/reference-runtime/reference-project-repository.ts`
- Modify only if a verified reversible mapping gap exists:
  `src/reference-runtime/reference-project-editor-adapter.ts`

- [x] Add RED integration paths: frozen fixture -> React open/save -> frozen
  parser; React save -> frozen PATCH map-label or duplicate-map mutation ->
  serialize returned document -> React open; multiple projects/maps;
  duplicate/import remapping; thumbnails/decor/renovations; storage quota error.
- [x] Fix only evidenced boundary defects. Do not normalize or migrate schema.
- [x] Run all persistence suites, typecheck, and diff check:

```bash
pnpm exec vitest run \
  tests/reference-runtime/reference-project-repository.test.ts \
  tests/reference-runtime/reference-project-editor-adapter.test.ts \
  tests/reference-runtime/reference-project-compatibility.integration.test.ts
pnpm typecheck
git diff --check
```
