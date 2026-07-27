# Stardew Planner Clone Product Design

## Status

Confirmed by the user on 2026-07-26. This document is the binding product scope for the fixed reference snapshot of `https://stardewplan.com/` observed on 2026-07-26.

## Product goal

Recreate the complete public Stardew Planner website so a desktop or mobile visitor experiences the same pages, visual language, maps, artwork, copy, navigation, planner workflows, and tool behavior as the reference website.

The only intentional product differences are that account and cloud features do not exist. Local projects replace cloud projects while preserving the original project-management experience.

## Public-site scope

The release includes every public route in the fixed snapshot:

- The main planner.
- Farm comparison.
- Individual farm guide pages.
- Mod-map discovery and planning pages.
- Privacy and terms pages.
- All public navigation paths between those pages.

The reference site identity, name, logo, visual assets, maps, and copy are in scope. The user has confirmed the required rights for the materials to be used.

## Planner scope

The planner includes the reference site's public planning capability:

- Official farms, Ginger Island, interiors, building interiors, renovations, 18 Community Mod farm maps, and the three visible SVE interior maps.
- Buildings, crops, trees, placeables, furniture, paths, fences, wallpaper, flooring, colours, variants, rotations, and locked objects.
- Placement validation, selection, movement, duplication, erasure, fill, marquee selection, undo, redo, map switching, seasonal views, and map summaries.
- Grid, buildable, crop, tree, NPC-path, night-mode, sprinkler, scarecrow, bee-house, Junimo-hut, and resource-clump overlays. The visible Weather control remains unavailable because it is unavailable in the fixed reference snapshot.
- 1x and HQ PNG capture, farm-summary CSV export, `farm-plan.json` import/export, and local game-save import.
- The reference site's desktop keyboard and mouse behaviour plus its mobile touch and responsive behaviour.

## Local-project behaviour

Projects remain a first-class public workflow. A visitor can create, rename, delete, open, and save multi-map projects exactly as they can in the reference experience. Every project is local to the current browser; the product exposes no account, device synchronization, public link, or server-persisted project state.

## Explicit exclusions

The release contains no:

- Sign-in, registration, social-auth provider controls, session UI, or account profile.
- Membership, supporter, payment, Ko-fi, premium locks, or premium messaging.
- Cloud project storage, cross-device synchronization, or server-side project APIs.
- Public-plan creation, public-plan links, share controls, or share thumbnails.
- Feedback submission or any other business API.

Removed capabilities must be absent from the interface. They must not appear as disabled controls, unavailable notices, or empty menu gaps.

## Reference assets and copy

The release uses a build-time mirror of the authorized source assets. The mirror is versioned, content-hash locked, and bundled with the release. A live visitor never depends on the reference site's asset domain.

The public copy, brand, and page content remain equivalent to the reference snapshot, except that the privacy and terms prose must accurately state the absence of accounts, cloud storage, memberships, and payments while retaining the reference page structure and visual presentation.

## Device and visual-parity requirements

Desktop and mobile are separate parity targets, not scaled versions of one layout. The reference state matrix must capture the page, viewport, tool mode, selected entity, modal state, and expected visual result for every acceptance scenario.

Parity means:

- Equivalent route, page structure, navigation labels, visible copy, artwork, and control availability.
- Equivalent results for the same planner action sequence.
- Equivalent responsive arrangement, pointer/touch behaviour, and safe-area treatment at the approved desktop and mobile viewports.

## Non-functional constraints

- The application is a static Next.js export rooted directly at `/Users/wusir/Desktop/开发项目集合/stardew planner/`; no nested application directory is created.
- The user-approved baseline is Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, and PixiJS.
- No Next API route, Server Action, database, account provider, payment integration, or cloud project service may be introduced.
- Every external source asset must be validated before it enters the release bundle.
- Invalid imported files and asset mismatches must produce an explicit user-facing failure and leave the existing local project unchanged.
- Modules communicate through focused exported interfaces; no feature reaches into another feature's internal state.
- Functions have one responsibility, use exact domain names, and avoid generic names such as `data`, `temp`, `helper`, `util`, and `manager`.
- Boundary validation fails fast with the invalid value in the error. Code must not silently catch or discard an error it cannot handle.
- Implement only confirmed behaviour with the smallest readable design; do not add speculative abstractions.

## Product acceptance

The product is accepted only after the fixed reference state matrix passes for desktop and mobile, the public routes are available from the static export, removed account/cloud/share flows are absent, and project data survives browser restart without leaving the browser.
