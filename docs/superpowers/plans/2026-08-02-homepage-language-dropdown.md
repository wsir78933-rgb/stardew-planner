# Homepage Language Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two-button homepage locale switcher with one fixed-label `Language ▾` dropdown that switches immediately and supports future locales.

**Architecture:** Keep locale ownership and persistence in `PlannerHomepage`. Make `HomepageLocaleSwitcher` a focused disclosure component with native buttons, a plain list, and local open/focus state. Render options from the central homepage locale registry and use scoped homepage data attributes for styling.

**Tech Stack:** React 19, TypeScript, existing Button primitive, CSS, Vitest, Next.js 16.

## Global Constraints

- The closed trigger text is always exactly `Language` plus a decorative down chevron.
- The open panel lists language names only; it must not visually or semantically mark the current language.
- Selecting a language switches immediately, closes the panel, and returns focus to the trigger.
- Escape closes the panel and restores trigger focus; a pointer event outside closes it without stealing focus.
- Preserve existing colors, radius, typography, locale persistence, localized copy, routes, SEO, and all other header controls.
- Add no project dependency and do not change the frozen planner runtime.
- Preserve all unrelated dirty-worktree changes. Do not stage, commit, push, or deploy.

---

### Task 1: Accessible homepage language dropdown

**Files:**
- Modify: `src/homepage/homepage-locale.ts`
- Modify: `src/components/homepage-locale-switcher.tsx`
- Modify: `src/components/homepage-content.tsx`
- Modify: `app/globals.css`
- Test: `tests/components/homepage-locale-switcher.test.tsx`
- Test: `tests/homepage/homepage-style-contract.test.ts`

**Interfaces:**
- Consumes: `HOMEPAGE_LOCALES`, `HomepageLocale`, `Button`, `label: string`, and `onLocaleChange(homepageLocale: HomepageLocale): void`.
- Produces: `HOMEPAGE_LOCALE_LABELS: Readonly<Record<HomepageLocale, string>>` and `HomepageLocaleSwitcher({ label, onLocaleChange })`.

- [ ] **Step 1: Add failing component and style contracts**

Update the focused component test so the server-rendered closed state requires:

```tsx
<HomepageLocaleSwitcher label="Language" onLocaleChange={onLocaleChange} />
```

Assert these literal contracts:

```ts
expect(markup).toContain("Language");
expect(markup).toContain("English");
expect(markup).toContain("中文");
expect(markup).toContain('aria-expanded="false"');
expect(markup).toContain("aria-controls=");
expect(markup).toContain("hidden");
expect(markup).not.toContain("aria-pressed");
expect(markup).not.toContain("aria-current");
```

Update the homepage style contract to require scoped selectors for:

```css
[data-homepage-language-switcher]
[data-homepage-language-trigger]
[data-homepage-language-menu]
[data-homepage-language-option]
```

and reject the old homepage language `[role="group"]` selector.

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
pnpm vitest run tests/components/homepage-locale-switcher.test.tsx tests/homepage/homepage-style-contract.test.ts
```

Expected: FAIL because the current component requires `currentLocale`, renders two pressed buttons, lacks disclosure attributes, and the CSS still targets `[role="group"]`.

- [ ] **Step 3: Centralize the language labels**

Add to `src/homepage/homepage-locale.ts`:

```ts
export const HOMEPAGE_LOCALE_LABELS = {
  en: "English",
  "zh-CN": "中文",
} as const satisfies Readonly<Record<HomepageLocale, string>>;
```

The `satisfies` relationship must fail typechecking when a future `HOMEPAGE_LOCALES` entry lacks a label.

- [ ] **Step 4: Implement the minimal disclosure component**

Remove `currentLocale` from `HomepageLocaleSwitcherProps` and from its call in `HomepageContent`. In `HomepageLocaleSwitcher`, use `useId`, `useRef`, `useState`, and an open-only `useEffect` that registers and cleans up `pointerdown` and `keydown` document listeners.

The trigger must be a native-button `Button` with:

```tsx
aria-controls={languageMenuId}
aria-expanded={isLanguageMenuOpen}
aria-label={label}
data-homepage-language-trigger
type="button"
variant="ghost"
```

Render visible `Language` text and a decorative `▾` span with `aria-hidden="true"`. Render a `ul` with `hidden={!isLanguageMenuOpen}` and map `HOMEPAGE_LOCALES` to native option buttons using `HOMEPAGE_LOCALE_LABELS[homepageLocale]`.

Keep event responsibilities separate:

```ts
function closeLanguageMenu(): void
function restoreTriggerFocus(): void
function selectHomepageLocale(homepageLocale: HomepageLocale): void
```

The outside-pointer listener only closes when `languageSwitcherRef.current?.contains(event.target as Node) === false`. The Escape listener closes and restores focus. Selection calls `onLocaleChange`, closes, and restores focus.

- [ ] **Step 5: Replace only the old language-group CSS**

Remove the homepage `[role="group"]` selector blocks and add data-attribute-scoped rules. Preserve the existing `rgb(36 42 34 / 22%)` border, `0.45rem` outer radius, `var(--secondary)` hover surface, and existing foreground/muted colors.

The switcher is `position: relative`; the trigger is a compact flex control; the menu is absolutely positioned below and right-aligned with a solid surface, border, restrained shadow, list reset, and a z-index above the header. Each option is a full-width native button with at least `2.5rem` height, left-aligned text, pointer cursor, and visible `:focus-visible` outline using `var(--ring)`.

- [ ] **Step 6: Run focused tests and verify GREEN**

Run:

```bash
pnpm vitest run tests/components/homepage-locale-switcher.test.tsx tests/homepage/homepage-style-contract.test.ts
```

Expected: both files pass with no warnings.

- [ ] **Step 7: Run static verification**

Run:

```bash
pnpm typecheck
pnpm test --run
git diff --check
```

Expected: typecheck succeeds; production build generates all routes; the full Vitest suite passes; diff check reports no whitespace errors.

- [ ] **Step 8: Verify browser behavior and visual scope**

At desktop `996×936` and mobile `390×844`, verify:

1. Only one `Language ▾` trigger is visible and the old two-button capsule is absent.
2. Click and keyboard activation open the list containing `English` and `中文` with no current marker.
3. Selecting each option switches copy immediately, closes the panel, and persists after reload.
4. Escape closes and focuses the trigger; clicking outside closes without preventing the clicked target.
5. Focus outlines are visible, the panel is aligned below the trigger, and no horizontal overflow occurs.
6. No other header control, homepage section, planner runtime, or public route styling changes.

- [ ] **Step 9: Independent review**

Review only the task-owned changes against the design spec and global constraints. Report separate specification and code-quality verdicts plus Critical, Important, and Minor findings. Do not modify, stage, commit, push, or deploy.
