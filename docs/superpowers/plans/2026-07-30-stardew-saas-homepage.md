# Stardew SaaS Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/` into a bilingual SaaS homepage that uses the supplied Brainfish reference's visual grammar, while embedding the existing English planner unchanged as a separate, adaptive-height application container below the hero.

**Architecture:** A small typed homepage domain owns locale selection and all new English/Chinese copy. A client-only homepage shell composes the new navigation, hero, product explanation, FAQ, and the pre-existing `ReferenceRuntimeHost`; the frozen Svelte/Pixi editor remains isolated behind that host. Tailwind v4 and generated shadcn primitives are used only for the new React page, while a guarded stylesheet adapts the embedded editor's frame without changing its controls or behavior.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Button and Accordion), Vitest, existing Svelte/Pixi reference runtime.

## Global Constraints

- Preserve the frozen English editor's runtime code, local project behavior, URL query behavior, controls, and retained asset visual contract; do not migrate it to React or localize it.
- The new homepage shell only supports `en` and `zh-CN`; persist only the shell locale and set `document.documentElement.lang` and the document title after a locale change.
- New navigation, hero, capability explanation, FAQ, and footer must use the typed homepage dictionary; the embedded editor stays English.
- Keep the editor as a direct structural sibling of readable page copy, never inside the page text-width container or an iframe. The editor must be an independently framed application container below the hero; the marketing page must never be placed inside the editor viewport.
- The editor must still bootstrap only in the client via `ReferenceRuntimeHost`; static route markup must not contain `reference-runtime-root`, `reference-runtime-bootstrap-module`, or the frozen runtime bootstrap script.
- Page scrolling and editor-theme rules must be gated by `body.stardew-homepage` and `#reference-runtime-root`; do not change global scrolling behavior for other frozen-runtime routes.
- Do not modify `public/reference-runtime/bootstrap.mjs`, frozen `_app` assets, existing runtime component code, project storage, or the unrelated dirty `next-env.d.ts`.
- Use high cohesion, low coupling, single-purpose functions, precise names, KISS, YAGNI, and fail-fast input checks. Do not silently swallow errors.
- Use the supplied Brainfish page as the sole visual-component reference: pale lime and white canvas, thin dark outlines, compact navigation, prominent left-aligned sans headline with serif italic emphasis, lime outlined actions, and editorial capability/FAQ sections. Do not copy its text, imagery, assets, logos, or code. Do not add unverified claims, metrics, security claims, APIs, analytics, or a new i18n framework.
- Do not create commits, push, deploy, or alter unrelated files; the user has not authorized those actions.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `src/homepage/homepage-locale.ts` | Defines accepted locale values, validates persisted values, and reads/writes the one locale storage key. |
| `src/homepage/homepage-copy.ts` | Defines the complete typed `en` and `zh-CN` marketing-copy dictionary. |
| `components/ui/button.tsx` | shadcn-generated Button primitive used by the locale switcher and CTA. |
| `components/ui/accordion.tsx` | shadcn-generated Accordion primitive used by the FAQ. |
| `src/components/planner-homepage.tsx` | Owns page-level locale state, document metadata synchronization, and composition of the page sections. |
| `src/components/homepage-locale-switcher.tsx` | Renders and reports one explicit locale change through a narrow callback interface. |
| `src/components/homepage-content.tsx` | Renders semantic marketing sections from a supplied copy object; it has no locale persistence or editor-runtime knowledge. |
| `src/components/homepage-planner-workspace.tsx` | Adds/removes the route-scoped body class and mounts the untouched `ReferenceRuntimeHost`. |
| `vitest.config.ts` | Resolves the project-wide `@/*` alias during Vitest module loading. |
| `app/page.tsx` | Renders the new homepage shell at `/`. |
| `app/globals.css` | Imports Tailwind and defines the new page-only visual system without overriding other route layout rules. |
| `public/reference-runtime/local-only-overrides.css` | Adds narrowly guarded editor-frame visual adjustments for the homepage only. |
| `tests/homepage/*.test.ts` | Tests locale boundary validation, complete copy coverage, and homepage static structural guarantees. |

### Task 1: Add the minimal UI toolchain and generated primitives

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `app/globals.css`
- Modify: `tsconfig.json`
- Modify: `vitest.config.ts`
- Do not modify: `app/layout.tsx`
- Create: `postcss.config.mjs`
- Create: `components.json`
- Create: `lib/utils.ts`
- Create: `components/ui/button.tsx`
- Create: `components/ui/accordion.tsx`
- Test: `tests/homepage/ui-toolchain.test.ts`

**Interfaces:**
- Produces: Tailwind v4 processing and `@/components/ui/{button,accordion}` imports for later React components.
- Consumes: the repository's existing Next.js static-export build and TypeScript configuration.

- [ ] **Step 1: Write the failing toolchain contract test**

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const readProjectFile = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), "utf8");

const packageJson = JSON.parse(readProjectFile("package.json")) as {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

describe("homepage UI toolchain", () => {
  test("configures Tailwind's PostCSS plugin and shadcn primitives", () => {
    expect(readProjectFile("postcss.config.mjs")).toContain("@tailwindcss/postcss");
    expect(readProjectFile("components.json")).toContain("https://ui.shadcn.com/schema.json");
    expect(readProjectFile("components/ui/button.tsx")).toContain("Button");
    expect(readProjectFile("components/ui/accordion.tsx")).toContain("Accordion");
    expect(readProjectFile("app/layout.tsx")).not.toContain("next/font/google");
    expect(readProjectFile("app/globals.css")).not.toContain('shadcn/tailwind.css');
    expect(readProjectFile("app/globals.css")).not.toContain("@layer base");
    expect(readProjectFile("vitest.config.ts")).toContain('alias: { "@":');
    expect(packageJson.dependencies).not.toHaveProperty("shadcn");
    expect(packageJson.devDependencies).toHaveProperty("shadcn");
  });
});
```

- [ ] **Step 2: Run the contract test to verify it fails**

Run: `pnpm test tests/homepage/ui-toolchain.test.ts`

Expected: FAIL because the PostCSS configuration and generated primitives do not exist.

- [ ] **Step 3: Install and configure only the dependencies required by Tailwind v4 and shadcn**

Run:

```bash
pnpm add -D @tailwindcss/postcss postcss
pnpm dlx shadcn@4.16.0 init --help
pnpm dlx shadcn@4.16.0 init --template next --base radix --preset nova --yes
pnpm dlx shadcn@4.16.0 add button accordion --yes
```

Use the current shadcn CLI's conventional root aliases. The generated `components.json` must contain aliases equivalent to:

```json
{
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

Add the exact TypeScript alias required by those generated imports:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  }
}
```

Mirror that alias for Vitest module resolution without adding a Vite plugin:

```ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "node",
  },
});
```

Keep only build-time Tailwind declarations and semantic utility mappings at the top of `app/globals.css`; do not retain the Nova-generated concrete `:root`, `.dark`, or `@layer base` rules. Its initial content must be shaped as follows, followed by the existing frozen-runtime-safe `html, body` baseline:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-heading: var(--font-sans);
  --font-sans: var(--font-sans);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --color-foreground: var(--foreground);
  --color-background: var(--background);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
}
```

The PostCSS configuration must export only this plugin mapping:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

The current shadcn CLI replaced the old `--style new-york` selector with preset-based configuration. Pin its verified `4.16.0` command and use the named standard `nova` preset with the explicit `--base radix` override; do not introduce a custom preset code, another component library, or a Tailwind configuration file. If the CLI modifies `app/layout.tsx`, restore only its generated additions so the file exactly retains its pre-task content. Keep generated client-side runtime dependencies (`class-variance-authority`, `clsx`, `lucide-react`, `radix-ui`, `tailwind-merge`) in `dependencies`; move the CLI-only `shadcn` package and CSS-only `tw-animate-css` package to `devDependencies`.

- [ ] **Step 4: Run the contract test and TypeScript verification**

Run:

```bash
pnpm test tests/homepage/ui-toolchain.test.ts
pnpm typecheck
```

If `pnpm typecheck` fails only because the ignored `.next/types/validator.ts` references route modules absent from the working tree, prove `.next` is ignored with `git check-ignore -q .next`, remove that exact generated cache with `rm -rf .next`, then rerun `pnpm typecheck`. If the ignore check fails or TypeScript reports a source-file error after the cache cleanup, stop and report the exact error. Expected: both commands exit 0.

### Task 2: Implement the typed homepage locale and copy boundary

**Files:**
- Create: `src/homepage/homepage-locale.ts`
- Create: `src/homepage/homepage-copy.ts`
- Create: `tests/homepage/homepage-locale.test.ts`
- Create: `tests/homepage/homepage-copy.test.ts`

**Interfaces:**
- Produces: `HomepageLocale`, `HOMEPAGE_LOCALES`, `DEFAULT_HOMEPAGE_LOCALE`, `getStoredHomepageLocale`, `saveHomepageLocale`, and `homepageCopyByLocale`.
- Consumes: browser `Storage` through the function argument, so tests do not depend on global browser state.

- [ ] **Step 1: Write the failing locale boundary tests**

```ts
import { describe, expect, test } from "vitest";
import {
  DEFAULT_HOMEPAGE_LOCALE,
  getStoredHomepageLocale,
  saveHomepageLocale,
} from "@/src/homepage/homepage-locale";

const createStorage = (storedValue: string | null): Storage => ({
  getItem: () => storedValue,
  setItem: () => undefined,
} as Storage);

describe("homepage locale storage", () => {
  test("falls back when storage contains an unsupported locale", () => {
    expect(getStoredHomepageLocale(createStorage("fr-FR"))).toBe(DEFAULT_HOMEPAGE_LOCALE);
  });

  test("keeps the approved Chinese locale", () => {
    expect(getStoredHomepageLocale(createStorage("zh-CN"))).toBe("zh-CN");
  });

  test("rejects attempts to persist an unsupported locale", () => {
    expect(() => saveHomepageLocale(createStorage(null), "fr-FR" as never)).toThrow(
      'Unsupported homepage locale: "fr-FR"',
    );
  });
});
```

Write the failing complete-copy test:

```ts
import { expect, test } from "vitest";
import { HOMEPAGE_LOCALES } from "@/src/homepage/homepage-locale";
import { homepageCopyByLocale } from "@/src/homepage/homepage-copy";

test("ships every approved locale with the same top-level homepage sections", () => {
  expect(Object.keys(homepageCopyByLocale)).toEqual([...HOMEPAGE_LOCALES]);
  expect(Object.keys(homepageCopyByLocale.en)).toEqual(Object.keys(homepageCopyByLocale["zh-CN"]));
});
```

- [ ] **Step 2: Run the locale tests to verify they fail**

Run: `pnpm test tests/homepage/homepage-locale.test.ts tests/homepage/homepage-copy.test.ts`

Expected: FAIL because the domain modules do not exist.

- [ ] **Step 3: Add the smallest typed locale and copy modules**

Implement this public locale contract:

```ts
export const HOMEPAGE_LOCALES = ["en", "zh-CN"] as const;
export type HomepageLocale = (typeof HOMEPAGE_LOCALES)[number];
export const DEFAULT_HOMEPAGE_LOCALE: HomepageLocale = "en";
export const HOMEPAGE_LOCALE_STORAGE_KEY = "stardew-homepage-locale";

export function isHomepageLocale(localeValue: string): localeValue is HomepageLocale;
export function getStoredHomepageLocale(storage: Pick<Storage, "getItem">): HomepageLocale;
export function saveHomepageLocale(
  storage: Pick<Storage, "setItem">,
  homepageLocale: HomepageLocale,
): void;
```

`getStoredHomepageLocale` must return `DEFAULT_HOMEPAGE_LOCALE` for `null` or values not in `HOMEPAGE_LOCALES`. `saveHomepageLocale` must guard at runtime with `isHomepageLocale` and throw `new Error(\`Unsupported homepage locale: "${homepageLocale}"\`)` for any unapproved value before writing the storage key.

Define `HomepageCopy` from the JSX needs rather than with an unbounded index signature. Its exact top-level keys are `navigation`, `hero`, `workspace`, `capabilities`, `faq`, and `footer`. Include real localized text for all visible strings: navigation labels, headline, supporting copy, buttons, three capability titles/descriptions, three FAQ question/answer pairs, workspace label, and footer copyright/link labels. Do not put editor text in this dictionary.

- [ ] **Step 4: Run the focused tests**

Run: `pnpm test tests/homepage/homepage-locale.test.ts tests/homepage/homepage-copy.test.ts`

Expected: all focused locale tests exit 0.

### Task 3: Compose the bilingual homepage around the isolated editor

**Files:**
- Create: `src/components/homepage-locale-switcher.tsx`
- Create: `src/components/homepage-content.tsx`
- Create: `src/components/homepage-planner-workspace.tsx`
- Create: `src/components/planner-homepage.tsx`
- Modify: `app/page.tsx`
- Test: `tests/components/homepage-locale-switcher.test.tsx`
- Test: `tests/routes/planner-editor-page.test.tsx`

**Interfaces:**
- Consumes: `HomepageLocale`, `HomepageCopy`, `homepageCopyByLocale`, `getStoredHomepageLocale`, `saveHomepageLocale`, `Button`, `Accordion`, and `ReferenceRuntimeHost`.
- Produces: `PlannerHomepage`, the sole `/` route component, with a direct `HomepagePlannerWorkspace` child that owns the runtime host.

- [ ] **Step 1: Write the failing locale switcher and static-route tests**

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import { HomepageLocaleSwitcher } from "@/src/components/homepage-locale-switcher";

test("reports the explicit locale selected by the visitor", () => {
  const onLocaleChange = vi.fn();
  const markup = renderToStaticMarkup(
    <HomepageLocaleSwitcher currentLocale="en" onLocaleChange={onLocaleChange} />,
  );
  expect(markup).toContain("中文");
  expect(markup).toContain("English");
});
```

Replace the existing root-route assertion with this structural contract while retaining its three no-eager-runtime assertions:

```tsx
expect(markup).toContain("data-homepage-shell");
expect(markup).toContain("data-homepage-workspace");
expect(markup).not.toContain("reference-runtime-root");
expect(markup).not.toContain("reference-runtime-bootstrap-module");
expect(markup).not.toContain("/reference-runtime/bootstrap.mjs");
```

- [ ] **Step 2: Run the route/component tests to verify they fail**

Run: `pnpm test tests/components/homepage-locale-switcher.test.tsx tests/routes/planner-editor-page.test.tsx`

Expected: FAIL because the homepage components and structural markers do not exist.

- [ ] **Step 3: Implement focused presentation and integration components**

Implement the locale switcher's narrow public interface exactly:

```tsx
type HomepageLocaleSwitcherProps = {
  currentLocale: HomepageLocale;
  onLocaleChange: (homepageLocale: HomepageLocale) => void;
};
```

It renders two shadcn `Button` controls labelled `English` and `中文`; each calls `onLocaleChange` with its fixed, validated literal. It must not read storage or touch the document.

Implement `HomepageContent({ copy, currentLocale, onLocaleChange })` as semantic sections in this order: compact Brainfish-reference navigation, left-aligned hero with a semantic serif-emphasis fragment, direct workspace sibling, editorial capability explanation, FAQ, `footer`. Use `id="capabilities"`, `id="faq"`, and `id="planner"` on the corresponding navigable targets. Use the existing generated Accordion for exactly the dictionary-provided FAQ items. All visible new-shell strings must come from `copy` except the two fixed locale names.

Implement `HomepagePlannerWorkspace` as a client component that uses one `useEffect` to add `stardew-homepage` to `document.body.classList` and removes exactly that class in cleanup. Its returned element must have `data-homepage-workspace` and contain only the untouched `<ReferenceRuntimeHost />` as the editor mounting child. CSS must give that element the approved 820–900px desktop / 720px mobile visual application viewport and make its runtime root the containing block for frozen fixed controls.

Implement `PlannerHomepage` as a client component that:

1. initializes state to `DEFAULT_HOMEPAGE_LOCALE`;
2. in one mount effect reads `window.localStorage` with `getStoredHomepageLocale` and updates state;
3. in one `[homepageLocale]` effect sets `document.documentElement.lang`, `document.title`, and calls `saveHomepageLocale(window.localStorage, homepageLocale)`;
4. selects `homepageCopyByLocale[homepageLocale]`; and
5. returns `<div data-homepage-shell><HomepageContent ... /></div>`.

Set English and Chinese titles in the dictionary as `Stardew Valley Farm Planner` and `星露谷物语农场规划器`. Do not introduce a router, context provider, i18n library, storage abstraction, or React migration of the editor.

Replace `app/page.tsx` with the server component:

```tsx
import { PlannerHomepage } from "../src/components/planner-homepage";

export default function PlannerPage() {
  return <PlannerHomepage />;
}
```

- [ ] **Step 4: Run focused component and route tests**

Run: `pnpm test tests/components/homepage-locale-switcher.test.tsx tests/routes/planner-editor-page.test.tsx`

Expected: focused tests exit 0 and static markup still has no runtime root or bootstrap script.

### Task 4: Apply the SaaS visual system and safely frame the editor

**Files:**
- Modify: `app/globals.css`
- Modify: `public/reference-runtime/local-only-overrides.css`
- Modify: `tests/reference-runtime/local-only-overrides.test.ts`
- Create: `tests/homepage/homepage-style-contract.test.ts`

**Interfaces:**
- Consumes: `body.stardew-homepage`, `[data-homepage-shell]`, `[data-homepage-workspace]`, and `#reference-runtime-root` emitted by Task 3.
- Produces: route-scoped page scrolling and an editor frame whose styling cannot leak to other runtime routes.

- [ ] **Step 1: Write the failing CSS-scope tests**

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

const readProjectFile = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), "utf8");

test("limits editor frame styling to the homepage runtime root", () => {
  const overrides = readProjectFile("public/reference-runtime/local-only-overrides.css");
  expect(overrides).toContain("body.stardew-homepage #reference-runtime-root");
  expect(overrides).not.toMatch(/(^|\n)#reference-runtime-root\s*\{/);
});

test("keeps normal frozen-runtime scrolling outside the homepage body class", () => {
  const styles = readProjectFile("app/globals.css");
  expect(styles).toContain("body.stardew-homepage");
  expect(styles).not.toMatch(/body\s*\{[^}]*overflow:\s*(auto|visible)/s);
});
```

Extend the existing local-only override test with assertions that the two homepage selector prefixes above exist while preserving every current excluded-control assertion.

- [ ] **Step 2: Run style-contract tests to verify they fail**

Run: `pnpm test tests/homepage/homepage-style-contract.test.ts tests/reference-runtime/local-only-overrides.test.ts`

Expected: FAIL because no homepage-scoped styling exists.

- [ ] **Step 3: Add only route-scoped visual rules**

In `app/globals.css`, retain the frozen-runtime-safe global `html, body` baseline and add styles that only target `body.stardew-homepage` and descendants. The target appearance follows the supplied Brainfish reference: a white/pale-lime canvas, restrained thin dark borders, lime outlined actions, compact navigation, a large left-aligned sans hero with serif italic emphasis, and editorial capability/FAQ sections. Define page-specific CSS custom properties under `body.stardew-homepage` rather than changing global color variables.

Use rules shaped like these exact scoping boundaries:

```css
body.stardew-homepage {
  min-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

body.stardew-homepage [data-homepage-shell] {
  min-height: 100%;
  color: var(--homepage-ink);
}

body.stardew-homepage [data-homepage-workspace] {
  width: min(100% - 2rem, 1440px);
  margin-inline: auto;
}
```

In `public/reference-runtime/local-only-overrides.css`, preserve every existing selector and add homepage rules only under `body.stardew-homepage #reference-runtime-root`. The root must become a positioned, transformed containing block and force the frozen `.app` to fill the approved workspace height, so frozen fixed controls are limited to the editor container rather than the browser viewport. The rules may add a border, radius, shadow, overflow clipping, and background around the existing editor frame; they must not rename, hide, or alter event behavior of retained controls, change the frozen 340px sidebar contract, or modify frozen files.

Include responsive page-shell rules for a narrow phone layout; the editor may horizontally scroll within its own workspace rather than collapsing or rewriting frozen controls.

- [ ] **Step 4: Run focused CSS contract tests**

Run: `pnpm test tests/homepage/homepage-style-contract.test.ts tests/reference-runtime/local-only-overrides.test.ts`

Expected: focused style tests exit 0 and existing excluded-control checks remain green.

### Task 5: Verify the integrated static export and interactive browser paths

**Files:**
- Modify only files required to correct a verified Task 1–4 test/build/browser failure.
- Test: `tests/routes/static-routes.test.ts`
- Test: `tests/reference-runtime/reference-runtime-visual-contract.test.ts`
- Test: all relevant tests from Tasks 1–4.

**Interfaces:**
- Consumes: all previous task contracts.
- Produces: verification evidence for the static shell, client-only runtime bootstrap, preserved frozen visual rules, and bilingual homepage interaction.

- [ ] **Step 1: Run the complete targeted automated suite**

Run:

```bash
pnpm test tests/homepage tests/components/homepage-locale-switcher.test.tsx tests/routes/planner-editor-page.test.tsx tests/routes/static-routes.test.ts tests/reference-runtime/local-only-overrides.test.ts tests/reference-runtime/reference-runtime-visual-contract.test.ts
pnpm typecheck
pnpm build
```

Expected: all commands exit 0. If a command fails, identify the exact failed contract, write a failing regression test if one is missing, then make the smallest in-scope correction and rerun the command that failed before continuing.

- [ ] **Step 2: Verify the homepage in the local browser**

Run the local production build with `pnpm start`, then verify through the local browser that:

1. `/` shows the new Brainfish-reference English navigation, hero, editor workspace, capabilities, FAQ, and footer;
2. the existing editor visibly loads below the hero inside its own bounded application container, and its fixed controls never overlap navigation or hero copy;
3. selecting `中文` changes every new-shell section to Chinese but leaves editor text English;
4. reloading `/` preserves the selected shell locale;
5. switching back to `English` restores English shell copy;
6. `/farm-comparison`, `/mods`, `/privacy`, and `/terms` render without the homepage layout or page-scrolling leakage; and
7. `/?farmType=standard` still starts the editor without an eager server-side runtime root or bootstrap script.

Record the exact browser URLs checked and any observed exception. Do not call a visual result successful without completing all seven checks.

- [ ] **Step 3: Inspect final scope before handoff**

Run:

```bash
git diff --check
git status --short
git diff -- app/page.tsx app/globals.css app/layout.tsx package.json tsconfig.json postcss.config.mjs components.json src public/reference-runtime/local-only-overrides.css tests
```

Expected: no whitespace errors; no changes to `next-env.d.ts`, `public/reference-runtime/bootstrap.mjs`, frozen `_app` assets, or unrelated routes. Report the actual changed files and verification outputs. Do not create a commit.

## Plan Self-Review

- **Spec coverage:** Task 1 supplies the selected Tailwind/shadcn technology; Task 2 confines i18n to a typed, validated shell dictionary; Task 3 supplies the required English/Chinese sections while preserving client-only runtime isolation; Task 4 applies the supplied Brainfish visual grammar and a bounded, route-safe editor application frame; Task 5 verifies static boundaries, existing assets, i18n behavior, responsive browser behavior, other routes, and query preservation.
- **Intentional exclusions:** React migration, editor localization, project-data migration, external APIs, analytics, unverified claims, copied visual assets/text, commits, deployment, and changes to the frozen runtime are explicitly excluded.
- **Placeholder scan:** The plan contains no TBD/TODO/"implement later" placeholders. Every behavior change has an explicit test-first command, expected failure, implementation contract, and passing command.
- **Interface consistency:** Locale functions and types are defined in Task 2 before Task 3 consumes them; shell markers and body class are defined in Task 3 before Task 4 styles and tests them; Task 5 consumes all earlier contracts.
