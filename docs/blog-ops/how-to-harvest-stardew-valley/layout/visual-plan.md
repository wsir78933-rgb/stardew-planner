# Visual Plan: Stardew Valley Crop Harvesting Methods

- **Role**: B (Layout / 布局)
- **Document**: Visual Scheme & Media Specification
- **Target File**: `writing/en-figure.svg` (source SVG created by Role C, processed into WebP/AVIF by Role G)
- **Canvas Dimensions**: 1672 × 941 pixels (16:9 aspect ratio matching `PublicPicture`)
- **Target Placement in Article**: Embedded directly after Section 2 (*Crops That Require a Scythe to Harvest*).
- **Scope & Role Boundary**: Role B specifies the executable layout, geometric coordinates, visual semantics, typography scale, and exact text strings. In accordance with role boundaries, Role B does not make unverified claims of "AAA verified" or "mobile actual render PASS"; physical rendering and multi-device visual validation remain the responsibility of Role C and Role G.

---

## 1. Visual Purpose & Reader Value

When new players harvest crops in Stardew Valley, confusion stems from two conflicting mechanics:
1. **Hand-interaction vs. Tool-swinging**: Trying to swing tools at standard crops or left-clicking instead of using `Check / Do Action` (Right-Click / X).
2. **Crop-to-Tool Requirements**: Knowing which specific crops require a scythe versus direct hand harvesting, and which tools harvest giant crops or handle trellis barriers.

This infographic directly illustrates the **Crop Category ➔ Required Action & Tool ➔ Control Input** pipeline, giving the reader an immediate operational visual guide that clarifies the physical mechanics.

---

## 2. 390px Mobile Viewport Readability Strategy

On mobile devices, a 1672 × 941 image scales down to approximately 390px in width (a ~4.28× reduction in scale). To ensure readability at this scaled-down width, this redesign applies the following rules:

1. **Radically Reduced Text Density**: Eliminated multi-sentence prose paragraphs and dense multi-column bullet lists. Replaced with concise labels, prominent keycap badges, and visual flow chips.
2. **Enlarged Typography Floor**:
   - Canvas Main Title: 54px (scales to ~12.6px at 390px width).
   - Card Titles & Section Headers: 42–46px (scales to ~10–11px).
   - Control Input Keycaps & Tool Labels: 36–40px (scales to ~8.5–9.5px).
   - Secondary Labels & Crop Tags: 28–32px (scales to ~6.5–7.5px).
   - Strict Minimum: No text element on canvas may be smaller than 28px.
3. **Structured 2-Card Flow + 1-Band Exception Layout**: Replaced the previous 3 narrow vertical columns with two wide, high-contrast action cards (Hand Harvest vs. Scythe Harvest) and a single horizontal bottom exceptions strip.

---

## 3. Diagram Architecture & Geometric Grid

### SVG Canvas Overview (1672 × 941)

```
+---------------------------------------------------------------------------------------------------+
|  HEADER: STARDEW VALLEY CROP HARVESTING GUIDE                                  Canvas: 1672 x 941  |
|  Crop Category ➔ Required Action & Tool ➔ PC Control Input                                         |
+---------------------------------------------------------------------------------------------------+
|                                                 |                                                 |
|   CARD 1 (Left, 756 x 540):                     |   CARD 2 (Right, 756 x 540):                    |
|   STANDARD CROPS ➔ HAND HARVEST                 |   SCYTHE CROPS ➔ SCYTHE SWING                   |
|                                                 |                                                 |
|   [ Parsnip ] [ Melon ] [ Pumpkin ] [ Cauli ]   |   [ Kale ] [ Wheat ] [ Amaranth ] [ Rice/Fiber] |
|                       ▼                         |                       ▼                         |
|   Action: Check / Do Action                     |   Action: Use Tool (Swing Scythe)               |
|   Tool: None (Hand Interaction)                 |   Tool: Starter / Golden / Iridium Scythe       |
|                       ▼                         |                       ▼                         |
|   PC INPUT:                                     |   PC INPUT:                                     |
|   +-------------------+ +-------------------+   |   +-------------------+ +-------------------+   |
|   |    Right-Click    | |      X Key        |   |   |    Left-Click     | |      C Key        |   |
|   +-------------------+ +-------------------+   |   +-------------------+ +-------------------+   |
|   Hold & Walk = Continuous Harvest (0 Energy)   |   Starter/Gold: Scythe crops • Iridium: All     |
|                                                 |                                                 |
+-------------------------------------------------+-------------------------------------------------+
|   BOTTOM BAND (1552 x 180): SPECIAL RULES & HARVEST EXCEPTIONS                                    |
|   +-------------------------+ +-------------------------+ +-----------------------------------+   |
|   |   3×3 GIANT CROPS       | |     TRELLIS CROPS       | |          SEASON ROLLOVER          |   |
|   |   Use Axe (3 Hits)      | |   Green Bean/Hops/Grape | |   Day 28 ➔ 1: Outdoor Crops Wilt  |   |
|   |   Drops 15–21; No Wilt  | |   Solid; Plan Walkways  | |   Multi-Season & Greenhouse Live  |   |
|   +-------------------------+ +-------------------------+ +-----------------------------------+   |
+---------------------------------------------------------------------------------------------------+
```

### Exact Coordinates & Dimensions:

- **Canvas ViewBox**: `0 0 1672 941`
- **Header Area**:
  - `x`: 60, `y`: 40, `width`: 1552, `height`: 85
  - Title: `y` = 78, `font-size`: 52px, `font-weight`: 700, Fill: `#ffffff`
  - Subtitle: `y` = 118, `font-size`: 30px, `font-weight`: 500, Fill: `#94a3b8`
- **Card 1: Standard Crops ➔ Hand Harvest** (Left Card):
  - Bounding Box: `x`: 60, `y`: 145, `width`: 756, `height`: 535, `rx`: 16
  - Background: `#0f172a` (Slate-900), Border: 3px `#059669` (Emerald-600)
  - Card Header Banner: `x`: 60, `y`: 145, `width`: 756, `height`: 70, Fill: `#064e3b`
  - Card Title: `x`: 90, `y`: 192, `font-size`: 38px, `font-weight`: 700, Fill: `#ecfdf5`
  - Target Crops Strip: `y`: 240, Pills for `Parsnip`, `Melon`, `Pumpkin`, `Cauliflower` (`font-size`: 28px)
  - Action & Tool Row: `y`: 320, Label: `Action: Check / Do Action` (`font-size`: 32px, Fill: `#e2e8f0`)
  - Keycap 1 (`Right-Click`): `x`: 100, `y`: 370, `width`: 270, `height`: 90, `rx`: 12, Fill: `#1e293b`, Border: 2px `#10b981`, Text: 36px `#ffffff`
  - Keycap 2 (`X Key`): `x`: 446, `y`: 370, `width`: 270, `height`: 90, `rx`: 12, Fill: `#1e293b`, Border: 2px `#10b981`, Text: 36px `#ffffff`
  - Tip Badge: `x`: 90, `y`: 510, `width`: 696, `height`: 120, Fill: `#062e24`, Text 1: `Continuous Harvest: Hold Right-Click or X while walking` (30px), Text 2: `Hand harvest uses 0 energy and requires no tool` (28px)
- **Card 2: Scythe Crops ➔ Tool Harvest** (Right Card):
  - Bounding Box: `x`: 856, `y`: 145, `width`: 756, `height`: 535, `rx`: 16
  - Background: `#0f172a` (Slate-900), Border: 3px `#3b82f6` (Blue-500)
  - Card Header Banner: `x`: 856, `y`: 145, `width`: 756, `height`: 70, Fill: `#1e3a5f`
  - Card Title: `x`: 886, `y`: 192, `font-size`: 38px, `font-weight`: 700, Fill: `#eff6ff`
  - Target Crops Strip: `y`: 240, Pills for `Kale`, `Wheat`, `Amaranth`, `Rice`, `Fiber` (`font-size`: 28px)
  - Action & Tool Row: `y`: 320, Label: `Action: Use Tool (Equip Scythe)` (`font-size`: 32px, Fill: `#e2e8f0`)
  - Keycap 1 (`Left-Click`): `x`: 896, `y`: 370, `width`: 270, `height`: 90, `rx`: 12, Fill: `#1e293b`, Border: 2px `#3b82f6`, Text: 36px `#ffffff`
  - Keycap 2 (`C Key`): `x`: 1242, `y`: 370, `width`: 270, `height`: 90, `rx`: 12, Fill: `#1e293b`, Border: 2px `#3b82f6`, Text: 36px `#ffffff`
  - Tool Difference Badge: `x`: 886, `y`: 510, `width`: 696, `height`: 120, Fill: `#172554`, Text 1: `Starter & Golden Scythes: Harvest scythe-specific crops` (30px), Text 2: `Iridium Scythe (1.6): Harvests ANY crop within swing radius` (28px)
- **Bottom Band: Special Rules & Exceptions**:
  - Bounding Box: `x`: 60, `y`: 705, `width`: 1552, `height`: 195, `rx`: 16
  - Background: `#0b0f19`, Border: 2px `#334155`
  - **Exception 1: Giant Crops** (`x`: 85, `y`: 725, `width`: 465, `height`: 155, Fill: `#1e1b4b`, Border: `#6366f1`):
    - Title: `3×3 Giant Crops` (34px `#c7d2fe`, bold)
    - Line 1: `Tool: Use Axe (3 hits)` (28px)
    - Line 2: `Drops 15–21 items; does not wilt` (28px)
  - **Exception 2: Trellis Crops** (`x`: 603, `y`: 725, `width`: 465, `height`: 155, Fill: `#312e81`, Border: `#818cf8`):
    - Title: `Impassable Trellises` (34px `#e0e7ff`, bold)
    - Line 1: `Green Beans, Hops, Grapes` (28px)
    - Line 2: `Solid tiles: plan walking rows` (28px)
  - **Exception 3: Season Rollover** (`x`: 1121, `y`: 725, `width`: 465, `height`: 155, Fill: `#3b0764`, Border: `#c084fc`):
    - Title: `Season Transition` (34px `#f3e8ff`, bold)
    - Line 1: `Day 28 ➔ 1: outdoor crops wilt` (28px)
    - Line 2: `Multi-season & Greenhouse survive` (28px)

---

## 4. Localized String Dictionary (For Roles C & T)

To ensure seamless localization and avoid layout breakage:

```json
{
  "HEADER_TITLE": "STARDEW VALLEY: CROP HARVESTING METHODS",
  "HEADER_SUBTITLE": "Crop Category ➔ Required Action & Tool ➔ PC Control Input",
  "CARD_1_TITLE": "STANDARD CROPS ➔ HAND HARVEST",
  "CARD_1_CROPS": "Parsnip • Cauliflower • Melon • Pumpkin",
  "CARD_1_ACTION": "Action: Check / Do Action (Direct Interaction)",
  "CARD_1_KEY_1": "Right-Click",
  "CARD_1_KEY_2": "X Key",
  "CARD_1_TIP_1": "Continuous Harvest: Hold Right-Click or X while walking",
  "CARD_1_TIP_2": "Standard harvest consumes 0 energy and requires no tool",
  "CARD_2_TITLE": "SCYTHE CROPS ➔ SCYTHE SWING",
  "CARD_2_CROPS": "Kale • Wheat • Amaranth • Unmilled Rice • Fiber",
  "CARD_2_ACTION": "Action: Use Tool (Equip Scythe & Swing)",
  "CARD_2_KEY_1": "Left-Click",
  "CARD_2_KEY_2": "C Key",
  "CARD_2_TIP_1": "Starter & Golden Scythes: Harvest scythe-specific crops",
  "CARD_2_TIP_2": "Iridium Scythe (1.6): Harvests ANY crop in swing radius",
  "EXC_1_TITLE": "3×3 Giant Crops",
  "EXC_1_LINE_1": "Tool: Use Axe (3 hits)",
  "EXC_1_LINE_2": "Yields 15–21 items; does not wilt",
  "EXC_2_TITLE": "Impassable Trellises",
  "EXC_2_LINE_1": "Green Beans, Hops, Grapes",
  "EXC_2_LINE_2": "Solid tiles: plan walking rows",
  "EXC_3_TITLE": "Season Rollover",
  "EXC_3_LINE_1": "Day 28 ➔ 1: Outdoor crops wilt",
  "EXC_3_LINE_2": "Multi-season & Greenhouse survive"
}
```

---

## 5. Media Integration Specification

### Target Snippet for Role C:
```html
<figure className="blog-article-media">
  <PublicPicture
    alt="Diagram of Stardew Valley harvest methods mapping standard crops to hand harvesting with Right-Click or X and scythe crops to Left-Click tool swinging, plus giant crop and trellis rules."
    decoding="async"
    height={941}
    loading="lazy"
    src="/blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp"
    width={1672}
  />
  <figcaption>
    Schematic: Stardew Valley crop harvest methods, showing control inputs for hand-picked crops, scythe-harvested crops, and special rules for giant crops and trellises.
  </figcaption>
</figure>
```

- **Alt Text Rationale**: Plainly identifies that standard crops map to hand harvesting with Right-Click or X, scythe crops map to tool swinging with Left-Click or C, and summarizes the bottom exception rules. Free of editorial disclaimers.
- **Caption Rationale**: Begins with the standard label `Schematic:` followed immediately by a concise description of the depicted harvest mechanics.
