# StardewPlan Reference Runtime Correction Design

## Status

This design corrects the visual and map-rendering baseline after the local
React/Pixi planner was found not to match the current public reference. It is
authorized by the confirmed product scope: use the locked public StardewPlan
snapshot and its authorised assets, while removing account, payment,
membership, cloud synchronization, feedback, support, and share-link flows.

## Evidence used to lock the reference

The reference is the public SvelteKit deployment observed on 2026-07-27.

- The root document starts `/_app/immutable/entry/start.CLoByjli.js` and
  `/_app/immutable/entry/app.DTzIUNnu.js`.
- The planner's Svelte/Pixi implementation is loaded from
  `/_app/immutable/chunks/CUwsdp_r.js`.
- The renderer declares game asset version `1.6.15` and resolves maps,
  previews, data, buildings, sprites, terrain, tilesheets, and mods beneath
  `https://assets.stardewplan.com/assets/1.6.15/`.
- At 1440px, the reference is a full-screen canvas with a 340px left catalog,
  a centred five-button toolbar, and six top-right menu buttons. At 390px, the
  catalog is a 190px bottom panel and the menu is a compact trigger.

The current local implementation loads the same family of raw maps but does
not execute the reference renderer's map composition, draw-layer, UI sprite,
and responsive stylesheet logic. It therefore cannot meet visual parity by
CSS adjustment alone.

## Chosen approach

Use the frozen, authorised public client as a vendored planner runtime inside
the existing static Next.js export. Next.js continues to own document export
and public route generation; a small React host mounts the local frozen
SvelteKit client into the route body. This is deliberately a runtime boundary,
not an iframe and not a second server application.

The source snapshot is transformed only at explicit boundaries:

1. Every game, UI, JS, and CSS resource is copied into `public/` with a
   SHA-256 lock. No visitor requests `stardewplan.com` or
   `assets.stardewplan.com`.
2. The one runtime host check that selects remote game assets is patched to
   select local `/assets/` paths at every deployed hostname.
3. A pre-bootstrap browser-local API adapter implements only local project
   CRUD and map CRUD in `localStorage`. It never issues a network request.
4. Auth, account, support, membership, Ko-fi, feedback, cloud-sync, and share
   controls are removed from rendered UI by a version-locked stylesheet and
   the adapter rejects their endpoint requests. `Save Project` and project
   management remain, but are labelled and stored as local browser projects.

This gives the same current Svelte DOM, CSS, Pixi map renderer, item sprites,
map transitions, desktop layout, and mobile layout as the frozen reference,
while the data boundary stays browser-local and static-host compatible.

## Runtime boundaries

### Reference snapshot synchronizer

`src/reference-runtime/reference-runtime-snapshot.ts` owns the explicit
source entry URLs, allowed public origins, content types, and recursive module
discovery. It accepts only paths below:

- `https://stardewplan.com/_app/immutable/`
- `https://stardewplan.com/assets/`
- `https://stardewplan.com/img/`
- `https://assets.stardewplan.com/assets/1.6.15/`

It rejects cross-origin module imports, query strings, hash fragments,
backslash paths, dot-segment paths, duplicated output paths, and a source
module whose local-path transform cannot be applied exactly once. The
synchronizer writes one atomic `reference-runtime-lock.json` beside the
mirrored tree.

### Local API compatibility adapter

`public/reference-runtime/local-project-api.mjs` replaces `window.fetch`
before the frozen Svelte entry starts. It handles only the project endpoints
that the frozen client uses:

- `GET` and `POST /api/projects`
- `GET`, `PUT`, and `DELETE /api/projects/:projectId`
- `POST /api/projects/:projectId/maps`
- `PATCH` and `DELETE /api/projects/:projectId/maps/:mapId`
- `POST` and `GET /api/projects/:projectId/maps/:mapId/thumbnail`
- `POST /api/projects/:projectId/maps/:mapId/duplicate`
- `POST /api/projects/:projectId/maps/:mapId/copy`
- `POST /api/projects/:projectId/maps/:mapId/move`
- `PUT /api/projects/:projectId/maps/:mapId`

It returns one fixed local session and premium capability only so the existing
project panel can be used; all account-related controls are absent from the
screen. The local session is not an account, has no identifier exposed in UI,
and has no remote transport. Project records are parsed and validated before
each mutation. Invalid request body values produce a JSON error with the
offending value, leave the stored project state unchanged, and return a 400
response. Requests to `/api/plans`, `/api/feedback`, `/api/account`,
`/api/auth/sign-in`, and `/api/admin` return a clear 404 JSON response and
are not exposed by visible controls.

### Next route host

`src/components/reference-runtime-host.tsx` renders only the runtime mount
element and loads the pre-bootstrap module once. Each retained public route
uses this host, allowing the frozen Svelte router to read the real browser
path (`/`, `/farm-comparison`, `/farm/[type]`, `/mods`, `/privacy`, and
`/terms`) without iframe navigation or a second URL model.

## Visual acceptance states

The shipped runtime must match the frozen source state at the following
viewports.

| State | Required result |
| --- | --- |
| 1440x1024 root | 340px left catalog, horizontal category tabs, search/filter, four-column icon grid, centred five-button toolbar, six-button top-right menu, full remaining canvas. |
| 1280x800 root | 340px left catalog, compact top-right Menu trigger because the reference compact threshold is 1400px. |
| 390x844 root | 190px bottom catalog, 49px vertical category rail, three-column icon grid, 36px toolbar buttons, compact menu trigger, map canvas above catalog. |
| Root Map picker | Farm, Interiors, Exteriors, Community tabs; three-column map grid; exact locked preview images; map-change confirmation when the current map has content. |
| Standard Farm in each season | TMX background, tilesheet selection, building draw layers, crop/item sprites, and overlays are rendered by the frozen reference Pixi implementation. |
| Local project lifecycle | Create, rename, delete, save, open, duplicate/copy/move map, JSON import/export, screenshots, CSV farm summary, and game-save import remain browser-local. |

## Explicit exclusions

No document may render Sign in, Sign out, Support, Ko-fi, Feedback,
membership labels, premium locks, cloud/device sync claims, Save as Link,
share URLs, public `/plan/:id` output, social links, account pages, or a
request to a remote API. The legal routes retain the reference visual shell
but state the local-only policy accurately.

## Verification

- Unit-test recursive snapshot discovery, URL/path rejection, lock validation,
  exact local-asset patching, and local project API mutations.
- Run the existing project and placement test suites unchanged.
- Inspect a production static export for remote asset and API URLs.
- Compare the local runtime against the frozen reference at 1440x1024,
  1280x800, and 390x844 using browser screenshots plus DOM checks for the
  acceptance states above.
