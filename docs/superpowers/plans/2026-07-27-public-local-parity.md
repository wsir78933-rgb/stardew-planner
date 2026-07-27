# Public Local-Parity Implementation Plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` task by task. Keep this project static and local-only.

**Goal:** Complete the retained public pages without reintroducing online functionality: show all approved community maps, let visitors reach official farm guide routes, and make the local-only policy explicit.

**Architecture:** Keep public-card derivation in `src/reference`, rendering in the existing page components, and static-export assertions in route tests. Do not add a backend, route handlers, accounts, analytics, external API calls, or a new design system.

**Constraints:** Preserve the existing five public navigation destinations and local `/?farmType=` planner entry points. The words account, cloud sync, membership, and payment are permitted only in clear negative local-only policy statements on the legal pages.

### Task 1: Expose every approved community map on `/mods`

**Files:**

- Modify: `src/reference/mod-farm-cards.ts`
- Test: `tests/components/public-farm-pages.test.tsx`

- [x] First add a failing test which derives all `community-farm` and `community-interior` maps from `plannerMaps`, then checks each for a local preview and `/?farmType=` entry point.
- [x] Run the targeted test and confirm that `sve-winery`, `sve-grandpas-shed-1`, and `sve-grandpas-shed-2` fail.
- [x] Expand the public-card source union only to those two existing community categories, provide explicit local card text for every exposed map, and retain fail-fast missing-text errors.
- [x] Re-run the targeted test and typecheck.

### Task 2: Link comparison content to its individual guides

**Files:**

- Modify: `src/components/farm-comparison-content.tsx`
- Test: `tests/components/public-farm-pages.test.tsx`

- [x] First add failing assertions that every official farm appears with `href="/farm/<id>"` in the comparison markup while keeping its planner link.
- [x] Run the targeted test and confirm the guide-link assertions fail.
- [x] Make the existing quick-comparison Farm link point to each retained static guide route. Do not add duplicate decorative calls to action unless necessary for the actual route to be discoverable.
- [x] Re-run the targeted test and typecheck.

### Task 3: State the local-only boundary accurately on legal pages

**Files:**

- Modify: `app/privacy/page.tsx`
- Modify: `app/terms/page.tsx`
- Modify: `tests/routes/static-routes.test.ts`

- [x] First add positive legal-page assertions for no account, no remote/cloud synchronization, no memberships, and no payments; retain online-flow prohibitions on non-legal pages.
- [x] Run the static route test and confirm the legal positive assertions fail.
- [x] Add concise negative statements on both legal pages; split the static export scan so a declaration of absence is valid on legal pages but no excluded feature UI can occur elsewhere.
- [x] Re-run the static-route test, typecheck, and static build.

### Task 4: Review retained-page boundaries

- [ ] Request an independent read-only review focused on links, asset locality, and accidental online-flow UI.
- [ ] Resolve P0/P1 findings within this plan, then run `pnpm test --run`, `pnpm typecheck`, and `pnpm build` serially.

## Self-review

- This plan deliberately avoids new routes and keeps all links static.
- Map card text remains explicit, so a future map catalog addition fails rather than silently producing an incomplete public card.
- Legal-page vocabulary is scoped as a negative promise, not a reintroduction of remote functionality.
