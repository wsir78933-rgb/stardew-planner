# React/Pixi Editor Replacement Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> `superpowers:subagent-driven-development` to execute the linked plans task by
> task, `superpowers:test-driven-development` for every behavior change, and
> `superpowers:verification-before-completion` before any completion claim.

**Goal:** Replace the frozen Svelte editor with a complete React/Pixi editor,
preserve the existing browser-local project format and current visual/feature
contract, and meet the approved loading and SEO gates.

**Architecture:** Keep the Next.js server-rendered homepage as the SEO boundary.
Mount exactly one client editor runtime. The React runtime uses a canonical
reference-format repository, a reversible editor adapter, a focused workspace
orchestrator, and a parallel resource coordinator. The frozen runtime remains
an explicit local fallback until the React path passes all gates.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript 5.9, Pixi.js 8,
Tailwind CSS 4, existing shadcn primitives, Vitest 3.

## Global Constraints

- Preserve unrelated and pre-existing workspace changes.
- Do not commit, stage, push, deploy, install dependencies, delete the frozen
  runtime, or modify Hermes source.
- Do not modify homepage copy, metadata, canonical URLs, JSON-LD, sitemap,
  robots, or deployment configuration.
- Keep `stardewplan-reference-local-projects-v1` and its frozen document schema
  as the only production persistence contract for the replacement workspace.
- Do not import or write through `LocalProjectStoreV2` from the replacement
  workspace.
- Keep current editor layout, labels, control positions, responsive behavior,
  focus order, and interaction flow. No redesign is authorized.
- Follow high cohesion, low coupling, SRP, KISS, Fail Fast, YAGNI, and precise
  naming. Errors at data/resource boundaries must identify the received value.
- Write and run each RED test before production code for that behavior.
- Every dispatched task owns an explicit file set. The main agent reviews its
  diff and verification output before moving to the next task.

## Execution Order

1. [Canonical persistence and reversible adapter](./2026-08-02-react-pixi-canonical-persistence.md)
2. Tasks 1-3 of [loading optimization and cutover](./2026-08-02-react-pixi-loading-cutover.md): marks, prepared-resource coordinator/Canvas contract, and category loading
3. [React workspace and full feature parity](./2026-08-02-react-pixi-workspace-parity.md)
4. Tasks 4-6 of [loading optimization and cutover](./2026-08-02-react-pixi-loading-cutover.md): server fallback, selector, default switch, and built-browser acceptance

The order is mandatory. Workspace code must not be connected to localStorage
until the canonical persistence plan passes. `PlannerCanvas` has one prepared-
resource-contract owner in loading Task 2; workspace tasks consume that
contract and do not redefine it. The React runtime must not become the default
until the complete workspace, static delivery, visual, browser, and performance
gates pass.

## Stage Gates

### Gate 1: Persistence safety

- Frozen fixtures round-trip through React save without semantic loss.
- Every mutation performs one validated canonical write.
- Storage failures leave the original serialized value unchanged.
- Frozen parser and request handler can read React output.

### Gate 2: Complete React workspace

- All current user-visible map, editing, project, import/export, overlay,
  interior, summary, screenshot, pointer, keyboard, touch, and joystick paths
  are wired and covered by focused tests.
- Desktop, compact, and mobile geometry preserves the approved reference.
- No React workspace module imports the V2 persistence or historical migration.

### Gate 3: Default cutover

- Static homepage HTML retains its SEO content and contains no Pixi, catalog,
  TMX, or frozen bootstrap preload.
- The selected runtime is determined before either runtime is imported, and
  only one runtime is mounted/downloaded.
- Desktop cold median is at most 1.5 seconds, mobile Fast 4G cold median is at
  most 2.5 seconds, and warm median is at most 0.8 seconds.
- Homepage LCP, INP, and CLS have no measurable regression in the matched
  reference/new sampling profile.

## Final Verification

Run from the project root:

```bash
pnpm build
pnpm exec vitest run
pnpm typecheck
git diff --check
```

Serve `out/` and run the accepted browser matrix at 1440x900, 1024x768, and
390x844. Record cold/warm performance samples from the built output, never
from Next.js development HMR.
