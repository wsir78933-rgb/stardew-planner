# B-en layout task card: `profit margin stardew valley`

Role: Agent B-en (layout only). This is a writer-ready task card, not an article body, final Title, final Description, or page assembly request.

Input: `docs/blog-ops/profit-margin-stardew/A-en-research.md`, the original keyword recorded there, `/Users/wusir/Desktop/博客-V7修订版/02-内容生产与质量门.md`, `/Users/wusir/Desktop/博客-V7修订版/03-博客页面生成整合.md`, and the read-only project interface in `docs/blog-ops/profit-margin-stardew/project-interface-spec.md`.

The only write target for this task is this file. Do not modify `app`, `src`, `public`, `package.json`, lockfiles, tests, scripts, existing article files, or any other document. C writes the English body from this card plus A's verified facts; F owns the locked Title/Description and E owns later independent checks. Do not copy the Chinese layout, write a body draft, or invent facts to make the outline symmetrical.

---

## 1. Primary keyword, locale, country, and page contract

| Field | Decision |
|---|---|
| Original keyword | **`profit margin stardew valley`** |
| Locale | `en` |
| Country | `US` — A used Google `hl=en&gl=us&pws=0`; the footer location is not treated as proof of a user's physical location. |
| Search date | 2026-09-22 (Asia/Shanghai) |
| Search provider | Google in the local Ego Browser; A also recorded a web-only `udm=14` pass. |
| Public route | `/profit-margin-stardew` (from the read-only project interface; B does not register or edit it). |
| Article language | Natural US English. Keep the game term **Profit Margin** and the four in-game values **Normal/100%, 75%, 50%, 25%** consistent. |
| Working H1 | **What Is Profit Margin in Stardew Valley? 100%, 75%, 50%, and 25% Explained** |
| Page-level H1 ownership | The shared `BlogArticleContent` shell supplies the page H1. The future body module must not add a second H1. |

The working H1 is an intent-safe proposal for C/F to refine. F may improve wording after the body is locked, but must preserve the single setting-explanation plus conditional-choice promise and must not turn the page into a crop-profit calculator, generic money guide, or product landing page.

---

## 2. One selected search intent

### Selected intent

**Informational explanation with a conditional setting decision.**

ReaderTask: an English-speaking US-localized Stardew Valley player wants to understand what the Profit Margin setting changes, distinguish affected prices from fixed costs/rewards, choose a value for a new solo or multiplayer farm based on desired challenge and pace, and find the setting during new-game setup.

This is one job: **choose and correctly interpret a Profit Margin setting for a new farm**. The setup path is a necessary secondary question because a reader cannot act on the choice without finding the setting. It is not permission to add a separate menu tutorial, existing-save repair guide, or money-making guide.

### Intent evidence from A's real research

- The exact query `profit margin stardew valley` returned a definition/how-to (WikiHow), a short explainer (GameRant), and the Stardew Valley Wiki reference, while Reddit, Steam, the official forum, and challenge videos show players evaluating the setting as a pacing/challenge choice.
- The observed PAA questions that directly support this job were **“What's the best profit margin in Stardew Valley?”**, **“What does 75% profit margin mean in Stardew Valley?”**, and **“Is 75% profit margin good?”**. Use each once in the decision/explanation structure; do not manufacture additional PAA.
- The top-ten set included a crop-profit calculator, but A observed that it did not expose a Profit Margin control. That is a separate calculator intent, not a reason to add calculations or promise that the planner computes gold.
- The default SERP had an unrelated **“What happens at 2:00 am in Stardew Valley?”** PAA item. Exclude it. Its visibility does not make it necessary to this article.
- There was no product-buying or transactional pattern. The planner's CTA must not rewrite the reader's job as “use a planner” or “calculate margin.”

### Strongest evidence and source boundary

The strongest evidence is the convergence of the PAA decision questions, explainer/reference formats, and community challenge discussions. Use the **Stardew Valley Wiki Options page** as the mechanics source for the four values, Advanced Options path, price multiplier, truncation, and minimum 1g rule. Use the **Stardew Valley Wiki Multiplayer page** for the affected/unaffected economy categories, the multiplayer rationale, and the wheat/Crab Pot examples. Community pages and videos support the existence of decision/challenge demand only; they are not authority for mechanics or a universal “best” value.

Do not put SERP ranks, competitor names, browser parameters, filesystem paths, workflow roles, research notes, or “the research says” language in the reader-facing article.

---

## 3. Reader conditions and completion mark

### Reader already has

- A vanilla Stardew Valley save or a new-farm decision in mind; the platform and exact UI version are not known from A's research.
- The four visible choices or a question about the setting, but not necessarily a correct model of what the percentage multiplies.
- One of the relevant contexts: first solo farm, multiplayer farm, or an intentional challenge run.
- A need for a conditional recommendation, not a universal score. Player count, desired pace, and tolerance for a tighter sale-income economy are the inputs.
- No requirement to use the Stardew Valley Planner. The reader may want to plan fields or buildings later, but that is not the search task.

### Reader must be able to do after reading

1. Explain that Profit Margin is a Stardew economy multiplier, not the accounting formula “net earnings divided by revenue.”
2. State what Normal/100%, 75%, 50%, and 25% mean for **selected item sale prices and seed prices**, including that fractional results are truncated to an integer and do not fall below 1g.
3. Separate affected categories from the explicitly unchanged Blacksmith, Fish Shop, Traveling Cart, buildings, tool upgrades, and quest gold rewards.
4. Pick a value with a reason tied to solo/co-op/challenge context and desired pace, while understanding that no source establishes one universal best value.
5. Locate the setting through the new-game wrench and Advanced Options path without being given unverified existing-save XML/editing instructions.

The completion mark is a correct choice and explanation, not a promise of an exact number of days to Perfection, a guaranteed difficulty multiplier, or a crop-income forecast.

---

## 4. Scope boundary

### Include

- Direct definition of the setting and the four choices.
- The selected sale/seed price multiplier, integer truncation, and minimum 1g rule.
- A compact, source-backed affected/unaffected economy matrix.
- Conditional solo/co-op/challenge guidance with the word “best” handled as a preference-dependent decision.
- The new-game Advanced Options path, with a platform/version qualifier because A did not run a live game UI test.
- One or two source-backed examples that make the boundary visible: Wheat at 25% and Willy's Crab Pots staying at 1,500g at the lower setting.
- Two controlled in-body diagrams described in Section 9; the table remains the precise source for values and categories.
- A short, natural link to the existing Year 1 money article only where a reader needs follow-up budget context.

### Exclude

- A real-world accounting lesson, net-margin formula, business-profit advice, or generic “how to make money” route. The accounting distinction is one clarification, not a second topic.
- Crop, artisan, or seed profitability calculations; a crop calculator; a promise that Stardew Valley Planner calculates gold or Profit Margin.
- A planner tutorial, farm-layout tutorial, sprinkler coverage tutorial, or processing-room plan. The product is not a prerequisite for this reader task.
- Existing-save editing, XML tags, decimal values, backup procedures, or platform-specific repair steps. A marked these unverified.
- Exact pacing multipliers, exact years to Perfection, or claims that 25% doubles the length of a run. A did not independently measure them.
- The unrelated 2:00 a.m. PAA question, community-center/bundle detours, profession bonuses, crop rankings, or broad Stardew economy encyclopaedia coverage.
- Competitor commentary, SERP rank claims, AI Overview text, or copied snippets.

These boundaries are editorial controls for C, not reader-facing sentences. Do not write “this article does not cover...” in the body; simply keep the structure focused.

---

## 5. Article type, snippet, and schema decision

### Content type

**Definition / explainer with a conditional decision guide.**

The content-brief definition pattern supplies the direct definition, mechanism, categories, practical context, and limitations. The decision block is necessary because the actual SERP includes “best” and “good” questions. This is not a product comparison: the four values are settings within one game, not competing products. It is not a pure how-to: the menu path is a supporting action after the reader understands the choice.

### Featured snippet target

- **Location:** immediately after H1, in the first H2, `What Is Profit Margin in Stardew Valley?`.
- **Format:** one plain-language **40–60 word paragraph**, not a table or ordered list.
- **Opening requirement:** start with “Profit Margin in Stardew Valley is...” and define it as the game's multiplier for selected sale and seed prices, then state the four choices and the fact that lower values do not apply to every cost or reward.
- **Evidence binding:** Stardew Valley Wiki `Options` for the setting, values, multiplier, and rounding rule. Link the first mechanics claim inline.
- Do not lead with a preamble, business analogy, CTA, or tool mention before this paragraph.

### PAA placement

Use the three directly relevant PAA questions once, as headings or clearly labeled sub-answers:

| Observed PAA | Single planned location | Repetition rule |
|---|---|---|
| “What's the best profit margin in Stardew Valley?” | H2 `What is the best Profit Margin for a new farm?` | Answer conditionally there; do not create a second universal ranking. |
| “What does 75% profit margin mean in Stardew Valley?” | H3 `What does 75% Profit Margin mean?` under the four-setting explanation. | Define the multiplier and tradeoff once; do not repeat it in a separate FAQ. |
| “Is 75% profit margin good?” | H3 `Is 75% Profit Margin good?` under the decision section. | Answer “it depends on the intended constraint”; do not label it universally best. |

Do **not** add a standalone FAQ solely to repeat these answers. A visible FAQ is optional only if C can add a genuinely new, necessary reader question without duplication; no FAQPage schema may be inferred from that choice.

### Schema/interface guardrail

The definition skill suggests DefinedTerm/FAQ options, but the existing project interface currently emits Article JSON-LD and does not provide a DefinedTerm contract for this target. Keep the page's current Article structured data; do not add DefinedTerm or FAQPage JSON-LD from this layout. Any schema change is outside B's scope and requires an explicit interface decision.

---

## 6. Necessary subquestions and deletion test

Every planned section must move the single ReaderTask forward. If removing a proposed block still lets the reader choose and set the value, the block belongs in an internal link or must be removed.

| Necessary subquestion | Planned answer location | Why the reader needs it |
|---|---|---|
| What does Profit Margin mean in this game, rather than in accounting? | H2 quick definition and first example | Prevents the central “percentage of net profit” misread. |
| What do Normal/100%, 75%, 50%, and 25% do? | H2 four-setting table plus H3 `What does 75% Profit Margin mean?` | Directly answers the noun query and observed PAA. |
| Which prices scale, and which costs/rewards stay fixed? | H2 affected/unaffected matrix plus Figure 1 | Lets the reader predict the tradeoff without treating the whole shop economy as multiplied. |
| What is the best value for this save? | H2 decision matrix plus H3 `Is 75% Profit Margin good?` | Converts “best” into a conditional choice using player count and desired pace. |
| Where is the setting chosen? | H2 setup path plus Figure 2 | Completes the new-farm action without drifting into unverified save editing. |
| What should the reader check before creating the farm? | Final three-question checklist in the setup section | Verifies player context, intended constraint, and affected/fixed-cost understanding. |

Required edge cases stay next to the relevant claim: lower margins also reduce the listed seed prices, fractional results are truncated with a 1g floor, and fixed categories/rewards remain outside the multiplier. Do not hide these in a final disclaimer.

---

## 7. Working H1/H2/H3 structure for C

These are editorial working headings, not a locked final Title or body. C should write normal English prose under them, not copy the field names or workflow language.

### H1 (page shell)

`What Is Profit Margin in Stardew Valley? 100%, 75%, 50%, and 25% Explained`

### Opening before the first supporting section

The first two or three sentences should state the answer shape: Profit Margin changes selected sale and seed prices; lower values are an economy constraint rather than an accounting percentage; the right choice depends on solo/co-op/challenge context. Point to the definition and table immediately. No history, product pitch, or “in today's...” preamble.

### H2-1 — `What Is Profit Margin in Stardew Valley?`

- Host the 40–60 word featured-snippet paragraph directly under the H2.
- Define the setting, four values, and selected price scope.
- Link the first mechanics statement to [Stardew Valley Wiki: Options](https://stardewvalleywiki.com/Options).
- State that the setting is selected during new-game creation through Advanced Options, but leave the full path for H2-5.

### H2-2 — `How the four Profit Margin settings change selected prices`

- Use one precise table, not four repetitive mini-sections:

  | Setting | Multiplier reading | Writer requirement |
  |---|---|---|
  | Normal / 100% | Normal reference value | Do not call this “best”; call it the standard baseline. |
  | 75% | Affected sale and seed prices use the 75% setting | Explain that this is not 75% of every shop cost or reward. |
  | 50% | Affected sale and seed prices use the 50% setting | Keep any challenge guidance conditional, not a measured difficulty score. |
  | 25% | Affected sale and seed prices use the 25% setting | Do not claim an exact run-length or Perfection multiplier. |

- Keep the source-backed rule beside the table: fractional prices are truncated to an integer and never below 1g.
- H3 — `What does 75% Profit Margin mean?` Give one direct explanation using the multiplier language. Do not turn “75%” into a real-world profit percentage.
- Explain the two-sided tradeoff: lower settings reduce selected sale income **and** selected seed prices. Do not summarize the setting as “everything pays 25%.”

### H2-3 — `What Profit Margin affects—and what it leaves unchanged`

- H3 — `Prices that scale`
  - Tie the paragraph and table to `SV-PM-02` and `SV-PM-04`.
  - Include the source-backed categories: selected item sales such as crops, forage, minerals, and cooked foods; Pierre seed prices; and selected Joja prices (Grass Starter, Sugar, Wheat Flour, and Rice).
- H3 — `Costs, shops, and rewards that stay fixed`
  - Tie the paragraph and table to `SV-PM-05` and `SV-PM-06`.
  - Include Blacksmith, Fish Shop, Traveling Cart, buildings, tool upgrades, and quest gold rewards as unchanged. Use Willy's Crab Pots staying at 1,500g as an example only; do not generalize one item into every shop rule.
- Use a two-column matrix with `Affected by Profit Margin` and `Not affected by Profit Margin`. The matrix is a precision aid, not a replacement for prose explaining how to use it.
- Link to [Stardew Valley Wiki: Multiplayer](https://stardewvalleywiki.com/Multiplayer) for the category boundary and multiplayer rationale.
- Place Figure 1 immediately after the matrix; see Section 9.

### H2-4 — `What is the best Profit Margin for a new farm?`

- Open with a conditional answer: there is no source-backed universal best value. Use player count, desired pace, and willingness to accept a tighter sale-income economy.
- H3 — `Choose Normal (100%) for a standard solo start`
  - Treat Normal as the reference economy, not a moral or skill judgment.
  - A first-farm recommendation is editorial guidance; do not present it as a Wiki rule.
- H3 — `Use co-op goals to decide whether to lower the setting`
  - Explain that the Multiplayer Wiki presents lower margins as an economy rebalance for multiple active players.
  - A group may consider 75% as a moderate constraint or go lower if it deliberately wants more constraint; do not call 75% universally correct and do not claim exact pacing results.
- H3 — `Use 50% or 25% for an intentional challenge run`
  - Reddit, Steam, and challenge-video evidence establishes challenge demand, not a controlled difficulty scale. Label player experience as experience if mentioned; use the Wiki for mechanics.
- H3 — `Is 75% Profit Margin good?`
  - Answer in one conditional block: it is a reasonable choice when the group wants a visible constraint without selecting the lowest setting, but “good” depends on the intended pace and player count. Do not repeat the whole table or promise that it fixes multiplayer balance.
- One natural internal link may appear here after the paragraph on early budget pressure: [How to Earn Money in Stardew Valley: Year 1 Gold You Can Spend This Morning](https://stardewvalleyplanner.art/how-to-earn-money-stardew). The link is a follow-up for cash planning, not a reason to add a cash-route section.

### H2-5 — `Where to choose Profit Margin when starting a new farm`

- H3 — `Open Advanced Options from the new-game setup`
  - Give the verified high-level path only: start new game → open the wrench/Advanced Options control → select Profit Margin → choose Normal/75/50/25 → create the farm.
  - Link the path to the Options page. State only that the public Wiki documents the path; do not promise identical labels or placement on every platform without a live, version-specific check.
- H3 — `Check the choice before creating the save`
  - End with a short checklist: player count, desired pace/challenge, and whether the reader understands selected prices versus fixed costs/rewards.
  - Do not add existing-save edit instructions. If a reader needs troubleshooting, send that to a separately researched page rather than guessing.
- Place Figure 2 after the ordered path; see Section 9.
- End directly after the checklist or with one precise next action. Do not add a generic motivational conclusion, broad farm-planning summary, or a second product pitch.

### FAQ decision

No standalone FAQ section is required. The three relevant PAA questions are already placed once as H2/H3 answers where they help the main task, and the unrelated 2:00 a.m. question is excluded. If C identifies a non-repetitive FAQ need, it must remain inside the same setting-choice job and must not introduce unverified mechanics or trigger a new schema requirement.

---

## 8. Information gain that must land in the body

“More complete than the top ten” is not an acceptance claim. The following concrete additions must be visible in the stated locations and tied to A's evidence.

| Information gain | Required body location | Evidence and acceptance test |
|---|---|---|
| Correct the accounting-margin misconception | H2-1 snippet and H2-2 first explanation | A flagged a staging article that incorrectly used a real-world net-margin formula. The body must define the game multiplier directly and never calculate accounting profit. |
| Show the affected/unaffected economy boundary | H2-3 matrix, prose, and Figure 1 | `SV-PM-02`, `SV-PM-04`, `SV-PM-05`, and `SV-PM-06`; a reader can classify Wheat versus Crab Pots without assuming every cost scales. |
| Make “best” conditional and actionable | H2-4 decision matrix and the `75%` H3 | PAA plus solo/co-op/challenge evidence; a reader can choose a setting after supplying player count and desired pace, but no universal value is claimed. |
| Keep authority separate from anecdotes | H2-4 wording and source list | Wiki pages support mechanics. Reddit/Steam/videos are, at most, labeled evidence that challenge/pacing discussions exist; no community anecdote becomes a rule. |
| Make setup actionable without an unsafe troubleshooting promise | H2-5 path and Figure 2 | `SV-PM-01`; the body shows where to choose the setting and stops before unverified save-edit instructions. |

The table and figures may present the same facts in different forms only when each has a distinct job: the table is the exact lookup, Figure 1 is the category boundary, and Figure 2 is the menu path. Do not repeat a full four-value table in an FAQ.

---

## 9. Body media plan: images must explain the choice

The cover does not satisfy the body-media requirement. Both figures below are required unless a later source/interface review proves one is unnecessary; do not replace them with decorative art or a guessed screenshot.

### Figure 1 — Profit Margin price boundary diagram

| Field | Requirement |
|---|---|
| Semantic ID | `fig-01-price-boundary` (semantic only; G locks the final public filename/path). |
| Placement | Immediately after the H2-3 affected/unaffected matrix and the short paragraph that explains how to read it. |
| Reader must see | A controlled two-column diagram: left = selected sale/seed prices that scale with Normal/75/50/25; right = categories explicitly outside the multiplier. Include a small multiplier strip and one source-backed example: Wheat is 6g at 25% instead of 25g; Willy's Crab Pots remain 1,500g. |
| Type | Controlled infographic/diagram. It is not an in-game screenshot, a crop-profit calculator, or a claim that every item in a shop behaves identically. |
| Source binding | `SV-PM-02`, `SV-PM-04`, `SV-PM-05`, `SV-PM-06`; the same claims must remain in nearby text/table. |
| Suggested alt | `Diagram showing Stardew Valley Profit Margin prices that scale and shop costs and rewards that stay unchanged.` |
| Caption duty | State that the diagram separates selected sale/seed prices from unchanged categories; label the Wheat and Crab Pot examples and do not add uncited categories. |
| Asset contract | 1672 × 941; lossy WebP plus same-stem AVIF sibling; inline WebP at or below 400 KiB; `decoding="async"`, `loading="lazy"`; meaningful alt and caption. Use the existing `PublicPicture` contract. |
| Rights/production | Use a controlled, legible drawing with documented usage rights. Do not use generative artwork as exact evidence and do not render text too small to read on mobile. |

### Figure 2 — New-game Advanced Options path

| Field | Requirement |
|---|---|
| Semantic ID | `fig-02-advanced-options-path` (semantic only; G locks the final public filename/path). |
| Placement | After the ordered path in H2-5, before the final three-question check. |
| Reader must see | A platform-neutral flow: `New Game` → wrench/`Advanced Options` → `Profit Margin` selector → `Normal / 75% / 50% / 25%` → create the farm. The selected value must be visibly connected to the decision, not shown as a generic menu. |
| Type | Controlled schematic based on the public Options page. It is not a platform-specific screenshot because A did not run a live game UI test. |
| Source binding | `SV-PM-01`; the body must carry the same platform/version qualifier. |
| Suggested alt | `Schematic of the Stardew Valley new-game path to Advanced Options and the Profit Margin selector.` |
| Caption duty | Say that this is a menu-path diagram, not a platform-specific screenshot; the public Wiki is the source for the documented path. |
| Asset contract | 1672 × 941; lossy WebP plus same-stem AVIF sibling; inline WebP at or below 400 KiB; `decoding="async"`, `loading="lazy"`; meaningful alt and caption. Use the existing `PublicPicture` contract. |
| Rights/production | Controlled drawing only unless a later live UI check supplies an authentic, version-labeled screenshot. Do not fake UI chrome or claim cross-platform identity. |

### Cover note

The future cover is a separate page-header/LCP asset and is not counted as a body figure. Its subject may signal a Stardew economy setting, but it must not carry exact UI or pricing claims and must not be the only visual. No cover path, filename, or asset is locked by B.

---

## 10. Public citations, internal links, and CTA placement

### Inline public references

Use source links next to the claims they support, then repeat only the public source list in the existing `BlogSources` block. Do not link to SERP result pages or use competitor articles as mechanics authority.

1. [Stardew Valley Wiki: Options](https://stardewvalleywiki.com/Options) — first definition, four choices, price multiplier, integer truncation/minimum 1g, and documented new-game Advanced Options path.
2. [Stardew Valley Wiki: Multiplayer](https://stardewvalleywiki.com/Multiplayer) — affected sale categories, scaled seed/selected Joja prices, unchanged categories/rewards, Wheat and Crab Pot examples, and the multiplayer rebalance explanation.

The forum page [Profit margin](https://forums.stardewvalley.net/threads/profit-margin.19528/) is **not required** for this outline. Include it only if C retains a short, clearly labeled community troubleshooting context; if included, label it as a community discussion and do not use its save-edit advice. Otherwise leave it out of both body and source list.

### Existing internal link

- Use `/how-to-earn-money-stardew` once, at the end of the H2-4 paragraph that explains why a lower sale-income setting can affect an early budget. Anchor text should describe the follow-up Year 1 money guide. Do not reproduce its route, crop schedule, or spending plan.
- No other internal article link is required for the primary job. Do not add a seasonal crop, profession, sprinkler, greenhouse, or calculator link merely to reach a link count.

### Tool association and CTA

The planner is **not a required tool for the ReaderTask**, so there is no in-body planner tutorial, planner step, or planner-as-solution claim. If a body sentence mentions future field/building placement, it may state only that the planner is a placement sketch and not an economy calculator; omit that sentence if it does not help the setting decision.

The existing `BlogSources` component automatically renders the existing planner CTA immediately before the Sources section. If the future article uses `BlogSources` for the public references, this is the only planner CTA slot:

`final body/checklist → existing planner CTA (optional product bridge, no margin-calculator claim) → Sources`

Do not add a second CTA near the opening or decision table, do not change the CTA copy, and do not make using the planner a completion condition. The interface behavior is recorded here so the CTA cannot quietly rewrite the search intent.

### Source block

- Use the existing heading `Sources` and list Options first, Multiplayer second.
- Checked label: `Checked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer.` Add a community note only if the forum is actually used.
- Keep source labels public and reader-readable. Do not expose Fact IDs, local paths, SERP dumps, body hashes, or workflow notes.

---

## 11. Word-count target and fallback conditions

### Count target

- Target **2,000–2,300 qualified English body words** so the final candidate can satisfy the workflow's hard 2,000-word gate without padding.
- Count normal paragraphs, lists, and data-table cells. Exclude page title/H1/H2/H3, table of contents, FAQ if later added, source list, CTA, metadata, URL strings, alt text, and captions, following the V7 counting rules.
- A's raw top-five arithmetic was about 1,737 visible words but mixed discussion/UI/video text and is not a comparable article-body target. Do not force 3,000 words or fill the gap with generic game economy content.

### Fail-fast fallback conditions

1. If C needs a mechanic, number, platform rule, pacing multiplier, or existing-save procedure not cleared in A, return to A for verification. Do not guess or cite a forum snippet as authority.
2. If the verified material cannot honestly support 2,000 qualified words within this single setting-choice job, report **“current topic evidence is insufficient for the 2,000-word specification”** and return to A/B/C. Do not pad, merge calculator/money-making intents, or add unrelated PAA.
3. If either figure lacks a legal asset, readable controlled design, required WebP/AVIF pair, dimensions, or budget, keep the slot blocked and return to media/interface ownership. Do not substitute a cover-only page, decorative placeholder, fake screenshot, or guessed path.
4. If the Options or Multiplayer URL/content changes before lock, recheck the affected claims and source block. Do not retain a stale checked label as current evidence.
5. If a proposed CTA or internal link cannot help the reader complete the setting decision, omit it; product relevance never overrides the selected intent.

---

## 12. Interface handoff and acceptance checklist

Before handing this card to C, B's output is accepted only when all of these are true:

- [x] The original keyword, `locale=en`, `country=US`, search date/provider, and route context are recorded.
- [x] One ReaderTask is selected: understand, choose, and set Profit Margin for a new solo/co-op farm.
- [x] Intent evidence comes from A's actual SERP/PAA record; the unrelated 2:00 a.m. PAA and calculator intent are excluded.
- [x] Article type is independently selected as definition/explainer with conditional decision guidance, not comparison, listicle, or transactional landing page.
- [x] Working H1 plus H2/H3 structure, deletion tests, required subquestions, and PAA placement are explicit.
- [x] Featured-snippet location and 40–60-word paragraph requirements are explicit.
- [x] Information gain is tied to the accounting misconception, affected/unaffected matrix, conditional best-choice method, source separation, and safe setup path.
- [x] Every body figure has a semantic job, exact placement, source binding, alt/caption duty, controlled-material requirement, and existing media contract.
- [x] Public citations are bound to the Options and Multiplayer URLs; internal link and automatic CTA positions are explicit.
- [x] Word target, qualified counting rules, and fail-fast fallback conditions are explicit.
- [x] The card does not authorize app/src/public/package/test/article writes or a body draft.

The next agent must preserve these boundaries. Any material change to the ReaderTask, source facts, media meaning, schema, or product association returns to the relevant owner instead of being silently expanded in C.
