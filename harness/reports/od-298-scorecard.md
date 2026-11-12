# Scheme quality scorecard

Base: `origin/master` (48ded0add0). Candidate: `origin/feat/od-297-accepted-decisions` (239ec425cb).

**Fail.** 10 gated criteria moved the wrong way: derived.share, derived.literal-values, shift.approval-unapproved, relations.wcag-level-drops, relations.distinct-lost.normal, relations.distinct-lost.deuteranopia, relations.distinct-lost.protanopia, relations.distinct-lost.tritanopia, relations.shared-split, component-pairs.difference-shrunk.

Every number is computed by code from the two checkouts. Run `open-ds compare --base <ref>` to produce it again. Each gated count is gated per scheme (and per scheme and theme where it applies): a breach in one part fails, whatever the total does.

## Notes

- `invariants.floating-not-defined`: Floating not defined in dense-data, content-first, accessible-first, brand-expressive, multi-brand: no color.surface.floating, so the dark surface ladder is not checked above the raised surface. Not gated.
- `blast-radius.answers-generate-nothing`: Answers do not generate values. dense-data: 79 of 79 answer changes move no value; content-first: 79 of 79 answer changes move no value; accessible-first: 79 of 79 answer changes move no value; brand-expressive: 79 of 79 answer changes move no value; multi-brand: 79 of 79 answer changes move no value. Their trace links are not counted as orphans.
- `blast-radius.answer-orphans`: Counts only answers that move a value. No answer moves one, so it is 0 by construction, not a clean result.
- `accessibility.apca-warnings`: APCA Lc is a warning only, by the owner's decision: shown, never gated.
- `curves.grades`: Contrast grades are reported, not gated (gradesGated: false), by the owner's decision. They gate once OD-299 lands.

| Criterion | Base | Candidate | Delta | Direction | Result |
| --- | ---: | ---: | ---: | --- | --- |
| `traceability.traced-share` | 0.8034 | 1 | +0.1966 | ↑ higher is better | pass |
| `traceability.untraced` | 129 | 0 | -129 | ↓ lower is better | pass |
| `traceability.weak` | 204 | 0 | -204 | ↓ lower is better | pass |
| `traceability.weak.own` | 21 | 0 | -21 | ↓ lower is better | pass |
| `traceability.weak.exact-rule` | 6 | 0 | -6 | ↓ lower is better | pass |
| `traceability.weak.borrowed` | 48 | 0 | -48 | ↓ lower is better | pass |
| `traceability.weak.linked` | 0 | 0 | 0 | ↓ lower is better | pass |
| `traceability.weak.none` | 129 | 0 | -129 | ↓ lower is better | pass |
| `derived.share` | 0.8932 | 0.8972 | +0.0040 | ↑ higher is better | **fail** in a part |
| `derived.literal-values` | 196 | 200 | +4 | ↓ lower is better | **fail** |
| `derived.component-literals` | 8 | 6 | -2 | ↓ lower is better | pass |
| `invariants.failures` | 18 | 4 | -14 | ↓ lower is better | pass |
| `invariants.spacing-map` | 0 | 0 | 0 | ↓ lower is better | pass |
| `invariants.color-scale` | 0 | 0 | 0 | ↓ lower is better | pass |
| `invariants.focus-ring` | 0 | not present |  | ↓ lower is better | pass |
| `invariants.compact-step` | 0 | 0 | 0 | ↓ lower is better | pass |
| `invariants.nested-radius` | 4 | 4 | 0 | ↓ lower is better | pass |
| `invariants.dark-ladder` | 14 | 0 | -14 | ↓ lower is better | pass |
| `invariants.floating-not-defined` | 5 | 5 | 0 | shown, not gated | — |
| `generation.answer-driven` | 0 | 0 | 0 | ↑ higher is better | pass |
| `generation.answer-driven-share` | 0 | 0 | 0 | ↑ higher is better | pass |
| `blast-radius.answers-generate-nothing` | 395 | 395 | 0 | shown, not gated | — |
| `blast-radius.answer-orphans` | 0 | 0 | 0 | ↓ lower is better | pass |
| `blast-radius.answer-orphan-share` | not present | not present |  | shown, not gated | — |
| `blast-radius.anchor-orphans` | 37 | 35 | -2 | ↓ lower is better | pass |
| `blast-radius.hidden-couplings` | 0 | 0 | 0 | ↓ lower is better | pass |
| `accessibility.wcag-failures` | 0 | 0 | 0 | ↓ lower is better | pass |
| `accessibility.wcag-waiting` | 0 | 0 | 0 | shown, not gated | — |
| `accessibility.apca-warnings` | 108 | 98 | -10 | ↓ lower is better, not gated | — |
| `accessibility.hit-area` | 0 | 0 | 0 | ↓ lower is better | pass |
| `accessibility.text-not-rem` | 0 | 0 | 0 | ↓ lower is better | pass |
| `motion.reduced-motion-transforms` | 0 | 0 | 0 | ↓ lower is better | pass |
| `motion.duration-caps` | 5 | 0 | -5 | ↓ lower is better | pass |
| `repetition.repeated-sentences` | 719 | 651 | -68 | ↓ lower is better | pass |
| `size.tokens` | 9046 | 9330 | +284 | shown, not gated | — |
| `size.css-bytes` | 2954890 | 3068536 | +113646 | shown, not gated | — |
| `size.unused-semantics` | 52 | 51 | -1 | ↓ lower is better | pass |
| `relations.contrast-margin` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.state-gap` | 0 | 0 | 0 | ↓ lower is better | pass |
| `curves.min-gap` | 25 | 25 | 0 | ↓ lower is better | pass |
| `curves.grades` | 119 | 119 | 0 | shown, not gated | — |
| `derived.new-literals` | 0 | 7 | +7 | shown, not gated | — |
| `derived.new-literals-unreasoned` | 0 | 0 | 0 | ↓ lower is better | pass |
| `shift.moves` | 0 | 27 | +27 | shown, not gated | — |
| `shift.review-unreasoned` | 0 | 0 | 0 | ↓ lower is better | pass |
| `shift.approval-unapproved` | 0 | 2 | +2 | ↓ lower is better | **fail** |
| `shift.hue` | 0 | 0 | 0 | ↓ lower is better | pass |
| `shift.key-colors` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.wcag-level-drops` | 0 | 1 | +1 | ↓ lower is better | **fail** |
| `relations.step-order` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.ladder-order` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.state-sign` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.distinct-lost.normal` | 0 | 1 | +1 | ↓ lower is better | **fail** |
| `relations.distinct-lost.deuteranopia` | 0 | 1 | +1 | ↓ lower is better | **fail** |
| `relations.distinct-lost.protanopia` | 0 | 1 | +1 | ↓ lower is better | **fail** |
| `relations.distinct-lost.tritanopia` | 0 | 3 | +3 | ↓ lower is better | **fail** |
| `relations.shared-split` | 0 | 1 | +1 | ↓ lower is better | **fail** |
| `component-pairs.level-drops` | 0 | 0 | 0 | ↓ lower is better | pass |
| `component-pairs.difference-shrunk` | 0 | 14 | +14 | ↓ lower is better | **fail** |
| `component-pairs.moved` | 0 | 475 | +475 | shown, not gated | — |
| `component-pairs.flagged-components` | 0 | 48 | +48 | shown, not gated | — |

## Relations per scheme

| Scheme | Relation | Kind | Base | Candidate |
| --- | --- | --- | --- | --- |
| dense-data | `spacing-map` | recorded | pass | pass |
| dense-data | `color-scale` | recorded | pass | pass |
| dense-data | `focus-ring` | minimum | pass | not present |
| dense-data | `compact-step` | minimum | pass | pass |
| dense-data | `nested-radius` | minimum | pass | pass |
| dense-data | `dark-ladder` | minimum | fail (2 of 2) | pass |
| dense-data | `duration-caps` | minimum | pass | pass |
| dense-data | `hit-area` | minimum | pass | pass |
| content-first | `spacing-map` | recorded | pass | pass |
| content-first | `color-scale` | recorded | pass | pass |
| content-first | `focus-ring` | minimum | pass | not present |
| content-first | `compact-step` | minimum | pass | pass |
| content-first | `nested-radius` | minimum | fail (1 of 1) | fail (1 of 1) |
| content-first | `dark-ladder` | minimum | fail (2 of 2) | pass |
| content-first | `duration-caps` | minimum | fail (2 of 2) | pass |
| content-first | `hit-area` | minimum | pass | pass |
| accessible-first | `spacing-map` | recorded | pass | pass |
| accessible-first | `color-scale` | recorded | pass | pass |
| accessible-first | `focus-ring` | minimum | pass | not present |
| accessible-first | `compact-step` | minimum | pass | pass |
| accessible-first | `nested-radius` | minimum | fail (1 of 1) | fail (1 of 1) |
| accessible-first | `dark-ladder` | minimum | fail (2 of 2) | pass |
| accessible-first | `duration-caps` | minimum | fail (1 of 2) | pass |
| accessible-first | `hit-area` | minimum | pass | pass |
| brand-expressive | `spacing-map` | recorded | pass | pass |
| brand-expressive | `color-scale` | recorded | pass | pass |
| brand-expressive | `focus-ring` | minimum | pass | not present |
| brand-expressive | `compact-step` | minimum | pass | pass |
| brand-expressive | `nested-radius` | minimum | fail (1 of 1) | fail (1 of 1) |
| brand-expressive | `dark-ladder` | minimum | fail (2 of 2) | pass |
| brand-expressive | `duration-caps` | minimum | pass | pass |
| brand-expressive | `hit-area` | minimum | pass | pass |
| multi-brand | `spacing-map` | recorded | pass | pass |
| multi-brand | `color-scale` | recorded | pass | pass |
| multi-brand | `focus-ring` | minimum | pass | not present |
| multi-brand | `compact-step` | minimum | pass | pass |
| multi-brand | `nested-radius` | minimum | fail (1 of 1) | fail (1 of 1) |
| multi-brand | `dark-ladder` | minimum | fail (6 of 6) | pass |
| multi-brand | `duration-caps` | minimum | fail (2 of 2) | pass |
| multi-brand | `hit-area` | minimum | pass | pass |

## Detail

### `traceability.traced-share`

Share of semantic values that reach an answer

Per scheme (base → candidate): dense-data 0.8244 → 1; content-first 0.8015 → 1; accessible-first 0.8015 → 1; brand-expressive 0.7955 → 1; multi-brand 0.7939 → 1.

- 695 of 695 values traced

### `traceability.untraced`

Semantic values that reach no answer

Per scheme (base → candidate): dense-data 23 → 0; content-first 26 → 0; accessible-first 26 → 0; brand-expressive 27 → 0; multi-brand 27 → 0.

### `traceability.weak`

Values whose reason does not explain them (weakReasons)

Per scheme (base → candidate): dense-data 38 → 0; content-first 42 → 0; accessible-first 41 → 0; brand-expressive 41 → 0; multi-brand 42 → 0.

### `traceability.weak.own`

Weak reasons of kind "own"

Per scheme (base → candidate): dense-data 3 → 0; content-first 5 → 0; accessible-first 5 → 0; brand-expressive 4 → 0; multi-brand 4 → 0.

### `traceability.weak.exact-rule`

Weak reasons of kind "exact-rule"

Per scheme (base → candidate): dense-data 0 → 0; content-first 2 → 0; accessible-first 1 → 0; brand-expressive 1 → 0; multi-brand 2 → 0.

### `traceability.weak.borrowed`

Weak reasons of kind "borrowed"

Per scheme (base → candidate): dense-data 12 → 0; content-first 9 → 0; accessible-first 9 → 0; brand-expressive 9 → 0; multi-brand 9 → 0.

### `traceability.weak.linked`

Weak reasons of kind "linked"

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

### `traceability.weak.none`

Weak reasons of kind "none"

Per scheme (base → candidate): dense-data 23 → 0; content-first 26 → 0; accessible-first 26 → 0; brand-expressive 27 → 0; multi-brand 27 → 0.

### `derived.share`

Share of semantic values (per brand and mode) derived from a scale, relation or alias

Per scheme (base → candidate): dense-data 0.9008 → 0.9065; content-first 0.8931 → 0.8993; accessible-first 0.9008 → 0.9058; brand-expressive 0.8788 → 0.8714; multi-brand 0.8931 → 0.8993.

Worse in: brand-expressive 0.8788 → 0.8714.

- relation: 98
- alias: 52
- scale: 1596
- literal: 200

### `derived.literal-values`

Semantic values (per brand and mode) that end on a raw literal

Per scheme (base → candidate): dense-data 26 → 26; content-first 28 → 28; accessible-first 26 → 26; brand-expressive 32 → 36; multi-brand 84 → 84.

Worse in: brand-expressive/dark 16 → 18; brand-expressive/light 16 → 18.

- dense-data: type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.easing.standard, motion.easing.exit, elevation.card, elevation.overlay
- content-first: radius.badge, type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.easing.standard, motion.easing.exit, elevation.card, elevation.overlay
- accessible-first: type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.easing.standard, motion.easing.exit, elevation.card, elevation.overlay
- brand-expressive: radius.control, radius.badge, type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.duration.hero, motion.easing.standard, motion.easing.exit, motion.easing.exit-offscreen, motion.easing.emphasize, elevation.card, elevation.overlay
- multi-brand: type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.easing.standard, motion.easing.exit, elevation.card, elevation.overlay, radius.badge, radius.control

### `derived.component-literals`

Raw hex, px and ms literals in component code and CSS that bypass the tokens

- px: 6
- ui/src/components/chart.tsx:204 2px
- ui/src/components/chart.tsx:207 1.5px
- ui/src/components/chart.tsx:289 2px
- ui/src/components/command.tsx:82 300px
- ui/src/components/drawer.tsx:62 100px
- ui/src/components/navigation-menu.tsx:72 1px

### `invariants.failures`

Failing relation checks, all invariants

Per scheme (base → candidate): dense-data 2 → 0; content-first 3 → 1; accessible-first 3 → 1; brand-expressive 3 → 1; multi-brand 7 → 1.

- dense-data: spacing-map pass, color-scale pass, focus-ring not present, compact-step pass, nested-radius pass, dark-ladder pass, duration-caps pass, hit-area pass
- content-first: spacing-map pass, color-scale pass, focus-ring not present, compact-step pass, nested-radius fail, dark-ladder pass, duration-caps pass, hit-area pass
- accessible-first: spacing-map pass, color-scale pass, focus-ring not present, compact-step pass, nested-radius fail, dark-ladder pass, duration-caps pass, hit-area pass
- brand-expressive: spacing-map pass, color-scale pass, focus-ring not present, compact-step pass, nested-radius fail, dark-ladder pass, duration-caps pass, hit-area pass
- multi-brand: spacing-map pass, color-scale pass, focus-ring not present, compact-step pass, nested-radius fail, dark-ladder pass, duration-caps pass, hit-area pass

### `invariants.spacing-map`

Each spacing map step is the base step × its multiplier × the rhythm, a multiple of 4px, at most 64px

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

- dense-data: pass
- content-first: pass
- accessible-first: pass
- brand-expressive: pass
- multi-brand: pass

### `invariants.color-scale`

Each step of a generated color scale is the generator's output from its recorded key color

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

- dense-data: pass
- content-first: pass
- accessible-first: pass
- brand-expressive: pass
- multi-brand: pass

### `invariants.focus-ring`

The focus ring is the default border + 1 step

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

- dense-data: not present
- content-first: not present
- accessible-first: not present
- brand-expressive: not present
- multi-brand: not present

### `invariants.compact-step`

A compact control is the default − 1 step on the control scale

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

- dense-data: pass
- content-first: pass
- accessible-first: pass
- brand-expressive: pass
- multi-brand: pass

### `invariants.nested-radius`

A nested corner: outer = inner + padding + border (an inner corner never goes below 0)

Per scheme (base → candidate): dense-data 0 → 0; content-first 1 → 1; accessible-first 1 → 1; brand-expressive 1 → 1; multi-brand 1 → 1.

- dense-data: pass
- content-first: fail
-   the menu item corner is 8px; a 12px menu with 4px padding and a 1px border gives 7px
- accessible-first: fail
-   the menu item corner is 4px; a 8px menu with 4px padding and a 2px border gives 2px
- brand-expressive: fail
-   the menu item corner is 20px; a 24px menu with 4px padding and a 2px border gives 18px
- multi-brand: fail
-   the menu item corner is 4px; a 8px menu with 4px padding and a 1px border gives 3px

### `invariants.dark-ladder`

In dark mode the surfaces lighten as they rise: sunken < default < raised < floating

Per scheme (base → candidate): dense-data 2 → 0; content-first 2 → 0; accessible-first 2 → 0; brand-expressive 2 → 0; multi-brand 6 → 0.

- dense-data: pass (not present: color.surface.floating)
- content-first: pass (not present: color.surface.floating)
- accessible-first: pass (not present: color.surface.floating)
- brand-expressive: pass (not present: color.surface.floating)
- multi-brand: pass (not present: color.surface.floating)

### `invariants.floating-not-defined`

Schemes that define no color.surface.floating, so the dark ladder never checks it (shown, not gated)

Per scheme (base → candidate): dense-data 1 → 1; content-first 1 → 1; accessible-first 1 → 1; brand-expressive 1 → 1; multi-brand 1 → 1.

- dense-data: floating not defined
- content-first: floating not defined
- accessible-first: floating not defined
- brand-expressive: floating not defined
- multi-brand: floating not defined

### `generation.answer-driven`

Semantic tokens whose value changes when an answer their trace cites changes (may only rise, per scheme)

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

- dense-data: 0 of 139 traced tokens
- content-first: 0 of 139 traced tokens
- accessible-first: 0 of 138 traced tokens
- brand-expressive: 0 of 140 traced tokens
- multi-brand: 0 of 139 traced tokens

### `generation.answer-driven-share`

Share of traced semantic tokens that an answer they cite drives (may only rise, per scheme)

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

- 0 of 695 traced tokens move with an answer they cite

### `blast-radius.answers-generate-nothing`

Answers that move no value when they change: answers do not generate values

Per scheme (base → candidate): dense-data 79 → 79; content-first 79 → 79; accessible-first 79 → 79; brand-expressive 79 → 79; multi-brand 79 → 79.

- dense-data: 79 of 79 answer changes move no value
- content-first: 79 of 79 answer changes move no value
- accessible-first: 79 of 79 answer changes move no value
- brand-expressive: 79 of 79 answer changes move no value
- multi-brand: 79 of 79 answer changes move no value

### `blast-radius.answer-orphans`

Only answers that move at least one value: tokens citing such an answer that do not move. Answers that move nothing are not counted, so 0 does not mean answers drive values; see generation.answer-driven

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

### `blast-radius.answer-orphan-share`

Only answers that move at least one value: the share of their trace links that do not move (not present when no answer moves a value)

- 0 of 0 answer links do not move

### `blast-radius.anchor-orphans`

Tokens recorded as derived from an anchor (its scale, relation or formula) that do not move when it changes

Per scheme (base → candidate): dense-data 7 → 7; content-first 7 → 7; accessible-first 7 → 7; brand-expressive 8 → 7; multi-brand 8 → 7.

- dense-data base-step (space.4: 0.25rem → 0.3125rem): 6 — component-spacing-map.x12, component-spacing-map.x2, component-spacing-map.x3, component-spacing-map.x4, component-spacing-map.x6, component-spacing-map.x8
- dense-data control-height (size.32 → size.24): 1 — size.control.compact
- content-first base-step (space.4: 0.25rem → 0.3125rem): 6 — component-spacing-map.x12, component-spacing-map.x2, component-spacing-map.x3, component-spacing-map.x4, component-spacing-map.x6, component-spacing-map.x8
- content-first control-height (size.48 → size.44): 1 — size.control.compact
- accessible-first base-step (space.4: 0.25rem → 0.3125rem): 6 — component-spacing-map.x12, component-spacing-map.x2, component-spacing-map.x3, component-spacing-map.x4, component-spacing-map.x6, component-spacing-map.x8
- accessible-first control-height (size.52 → size.56): 1 — size.control.compact
- brand-expressive base-step (space.4: 0.25rem → 0.3125rem): 6 — component-spacing-map.x12, component-spacing-map.x2, component-spacing-map.x3, component-spacing-map.x4, component-spacing-map.x6, component-spacing-map.x8
- brand-expressive control-height (size.52 → size.60): 1 — size.control.compact
- multi-brand base-step (space.4: 0.25rem → 0.3125rem): 6 — component-spacing-map.x12, component-spacing-map.x2, component-spacing-map.x3, component-spacing-map.x4, component-spacing-map.x6, component-spacing-map.x8
- multi-brand control-height (size.44 → size.48): 1 — size.control.compact

### `blast-radius.hidden-couplings`

Tokens that move when an answer or anchor changes, with no trace link or recorded derivation to it

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

### `accessibility.wcag-failures`

Grammar pairs below their WCAG contrast (pairs on a fill that waits for a fix excluded)

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

- 1344 pairs measured

### `accessibility.wcag-waiting`

Grammar pairs below their WCAG contrast on a fill that records it waits for a fix

### `accessibility.apca-warnings`

Grammar pairs whose APCA Lc is under the readability floor for their role (warning, not gated)

Per scheme (base → candidate): dense-data 15 → 15; content-first 20 → 19; accessible-first 16 → 7; brand-expressive 13 → 13; multi-brand 44 → 44.

- dense-data/dark: color.text.muted on color.surface.canvas Lc -49.4, floor 60
- dense-data/dark: color.text.muted on color.surface.default Lc -48.5, floor 60
- dense-data/dark: color.text.muted on color.surface.raised Lc -45.6, floor 60
- dense-data/dark: color.text.muted on color.surface.sunken Lc -49.8, floor 60
- dense-data/dark: color.text.muted on color.surface.highlight Lc -49.8, floor 60
- dense-data/dark: color.text.muted on color.surface.selected Lc -46.0, floor 60
- dense-data/dark: color.text.on-light on color.action.primary Lc 57.4, floor 60
- dense-data/dark: color.text.on-light on color.action.danger Lc 55.6, floor 60
- dense-data/dark: color.text.on-action on color.action.primary Lc 57.4, floor 60
- dense-data/dark: color.text.on-danger on color.action.danger Lc 55.6, floor 60
- … 88 more in scorecard.json

### `accessibility.hit-area`

Every control is at least 24px; a touch-first scheme's default control is at least 44px

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

- dense-data: pass
- content-first: pass
- accessible-first: pass
- brand-expressive: pass
- multi-brand: pass

### `accessibility.text-not-rem`

Text sizes that are not in rem, so they ignore the user's text setting

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

### `motion.reduced-motion-transforms`

Transforms that still move under prefers-reduced-motion: reduce

### `motion.duration-caps`

Durations stay within their family's cap: feedback ≤ 150ms, panels ≤ 300ms, expressive ≤ 500ms

Per scheme (base → candidate): dense-data 0 → 0; content-first 2 → 0; accessible-first 1 → 0; brand-expressive 0 → 0; multi-brand 2 → 0.

- dense-data: pass
- content-first: pass
- accessible-first: pass
- brand-expressive: pass
- multi-brand: pass

### `repetition.repeated-sentences`

Extra copies of sentences repeated across reasons, token names taken out

Per scheme (base → candidate): dense-data 75 → 66; content-first 73 → 67; accessible-first 76 → 63; brand-expressive 73 → 66; multi-brand 422 → 389.

- dense-data: ×25 "one product one brand ramp on cool neutrals" (answer color.definition; pick default/light color.neutral.0; pick default/light color.neutral.50; …)
- dense-data: ×24 "the scheme's neutral is slate" (pick default/light color.neutral.0; pick default/light color.neutral.50; pick default/light color.neutral.100; …)
- dense-data: ×2 "a quiet tint behind danger" (pick default/light color.status.danger.subtle; pick default/dark color.status.danger.subtle)
- dense-data: ×2 "a quiet tint behind info" (pick default/light color.status.info.subtle; pick default/dark color.status.info.subtle)
- dense-data: ×2 "a quiet tint behind success" (pick default/light color.status.success.subtle; pick default/dark color.status.success.subtle)
- dense-data: ×2 "a quiet tint behind warning" (pick default/light color.status.warning.subtle; pick default/dark color.status.warning.subtle)
- dense-data: ×2 "a see-through layer that dims the page behind a modal so the dialog is the one thing to act on" (pick default/light color.surface.scrim; pick default/dark color.surface.scrim)
- dense-data: ×2 "disabled text has no contrast minimum" (pick default/light color.disabled.text; pick default/dark color.disabled.text)
- dense-data: ×2 "experts do not need more" (answer accessibility.roles; pick default/light color.surface.pressed)
- dense-data: ×2 "it decorates so it holds no contrast minimum" (pick default/light color.border.default; pick default/dark color.border.default)
- … 174 more in scorecard.json

### `size.tokens`

Semantic and component tokens

Per scheme (base → candidate): dense-data 1809 → 1866; content-first 1809 → 1866; accessible-first 1809 → 1865; brand-expressive 1810 → 1867; multi-brand 1809 → 1866.

- dense-data: 139 semantic, 1727 component
- content-first: 139 semantic, 1727 component
- accessible-first: 138 semantic, 1727 component
- brand-expressive: 140 semantic, 1727 component
- multi-brand: 139 semantic, 1727 component

### `size.css-bytes`

Bytes of each scheme's generated tokens.css

Per scheme (base → candidate): dense-data 422088 → 438256; content-first 422049 → 438199; accessible-first 422302 → 438384; brand-expressive 422232 → 438626; multi-brand 1266219 → 1315071.

- dense-data: 438256 bytes, 1869 custom properties
- content-first: 438199 bytes, 1869 custom properties
- accessible-first: 438384 bytes, 1868 custom properties
- brand-expressive: 438626 bytes, 1870 custom properties
- multi-brand: 1315071 bytes, 1869 custom properties

### `size.unused-semantics`

Semantic tokens no token, CSS or component reads

Per scheme (base → candidate): dense-data 10 → 10; content-first 10 → 10; accessible-first 11 → 10; brand-expressive 11 → 11; multi-brand 10 → 10.

- dense-data: color.category.1.subtle, color.category.2.subtle, color.category.3.subtle, color.category.4.subtle, color.category.5.subtle, color.neutral.300, color.neutral.800, color.neutral.950, color.status.info, color.status.warning
- content-first: color.category.1.subtle, color.category.2.subtle, color.category.3.subtle, color.category.4.subtle, color.category.5.subtle, color.neutral.300, color.neutral.800, color.neutral.950, color.status.info, color.status.warning
- accessible-first: color.category.1.subtle, color.category.2.subtle, color.category.3.subtle, color.category.4.subtle, color.category.5.subtle, color.neutral.400, color.neutral.800, color.neutral.950, color.status.info, color.status.warning
- brand-expressive: color.category.1.subtle, color.category.2.subtle, color.category.3.subtle, color.category.4.subtle, color.category.5.subtle, color.neutral.300, color.neutral.800, color.neutral.950, color.status.info, color.status.warning, motion.duration.hero
- multi-brand: color.category.1.subtle, color.category.2.subtle, color.category.3.subtle, color.category.4.subtle, color.category.5.subtle, color.neutral.300, color.neutral.800, color.neutral.950, color.status.info, color.status.warning

### `relations.contrast-margin`

Contrast pairs less than 0.1 above their floor

### `relations.state-gap`

State steps (rest → hover → pressed) closer than ΔE 0.02

### `curves.min-gap`

Neighbouring scale steps closer than 0.03 in OKLab lightness

Per scheme (base → candidate): dense-data 5 → 5; content-first 3 → 3; accessible-first 3 → 3; brand-expressive 7 → 7; multi-brand 7 → 7.

- dense-data: slate.light 0 → 50 differ by 0.021
- dense-data: slate.light 50 → 100 differ by 0.022
- dense-data: slate.dark 800 → 900 differ by 0.022
- dense-data: slate.dark 900 → 950 differ by 0.021
- dense-data: red.light 100 → 200 differ by 0.010
- content-first: stone.light 0 → 50 differ by 0.006
- content-first: stone.dark 900 → 950 differ by 0.006
- content-first: red.light 100 → 200 differ by 0.010
- accessible-first: gray.light 0 → 50 differ by 0.024
- accessible-first: gray.dark 900 → 950 differ by 0.024
- … 15 more in scorecard.json

### `curves.grades`

Step pairs under their contrast grade (400 apart 3:1, 500 apart 4.5:1, 700 apart 7:1)

Per scheme (base → candidate): dense-data 22 → 22; content-first 24 → 24; accessible-first 21 → 21; brand-expressive 24 → 24; multi-brand 28 → 28.

- dense-data: slate.light 0 and 400 are 2.67:1, need 3:1
- dense-data: slate.dark 300 and 800 are 4.11:1, need 4.5:1
- dense-data: slate.dark 300 and 900 are 4.38:1, need 4.5:1
- dense-data: slate.dark 400 and 800 are 2.36:1, need 3:1
- dense-data: slate.dark 400 and 900 are 2.51:1, need 4.5:1
- dense-data: slate.dark 400 and 950 are 2.67:1, need 4.5:1
- dense-data: slate.dark 500 and 900 are 1.54:1, need 3:1
- dense-data: slate.dark 500 and 950 are 1.63:1, need 3:1
- dense-data: violet.dark 400 and 900 are 4.13:1, need 4.5:1
- dense-data: violet.dark 500 and 900 are 2.76:1, need 3:1
- … 109 more in scorecard.json

### `derived.new-literals`

Literals new in the candidate

- dense-data: motion.easing.exit (why: We use the strong-out easing (0.23, 1, 0.32, 1) for a layer that closes in place in order to do the exit move of the productive family. The curve does this by covering most of the way in the first third of its time, then easing to a stop. So a closed popover is gone before the next click, because productive exits take a strong ease-out (motion.roles) and easing never springs here (motion.definition).)
- content-first: motion.easing.exit (why: We use the strong-out easing (0.23, 1, 0.32, 1) for a layer that closes in place in order to do the exit move of the productive family. The curve does this by covering most of the way in the first third of its time, then easing to a stop. So a closed popover is gone before the next click, because productive exits take a strong ease-out (motion.roles) and easing never springs here (motion.definition).)
- accessible-first: motion.easing.exit (why: We use the strong-out easing (0.23, 1, 0.32, 1) for a layer that closes in place in order to do the exit move of the productive family. The curve does this by covering most of the way in the first third of its time, then easing to a stop. So a closed popover is gone before the next click, because productive exits take a strong ease-out (motion.roles) and easing never springs here (motion.definition).)
- brand-expressive: motion.easing.exit (why: We use the strong-out easing (0.23, 1, 0.32, 1) for a layer that closes in place in order to do the exit move. The curve does this by covering most of the way in the first third of its time, then easing to a stop. So a closed popover is gone before the next tap, because an expressive exit eases out unless the layer leaves the screen (motion.roles), and easing is set per move (motion.definition).)
- brand-expressive: motion.easing.exit-offscreen (why: We use the accelerate easing (0.4, 0, 1, 1) for a drawer or sheet that slides off the screen in order to do the exit move of a layer that leaves the view. The curve does this by starting slow and speeding up, so the panel gathers pace on its way out. So visitors read the drawer as gone, not paused at the edge, because an expressive family accelerates only what leaves the screen (motion.roles) and easing is set per move (motion.definition).)
- brand-expressive: motion.easing.emphasize (why: We use the spring easing (0.34, 1.56, 0.64, 1) for the emphasize move only, in order to celebrate a moment such as a sign-up that worked. The curve does this by passing its target and settling back, so the eye catches the bounce. So the brand's spring is felt where it means something, not on every menu, because easing is a spring (motion.definition) and motion carries expression (motion.roles).)
- multi-brand: motion.easing.exit (why: We use the strong-out easing (0.23, 1, 0.32, 1) for a layer that closes in place in order to do the exit move of the productive family. The curve does this by covering most of the way in the first third of its time, then easing to a stop. So a closed popover is gone before the next click, because productive exits take a strong ease-out (motion.roles) and easing never springs here (motion.definition).)

### `derived.new-literals-unreasoned`

Literals new in the candidate with no recorded reason

### `shift.moves`

Color tokens that moved, per scheme, brand and mode, every move listed by tier

- approval: 27
-   dense-data/dark color.surface.raised: #161B23 → #262D38, ΔE 0.075 (approval, surface limits)
-   dense-data/dark color.surface.sunken: #262D38 → #06090E, ΔE 0.157 (approval, surface limits)
-   dense-data/dark color.surface.highlight: #262D38 → #06090E, ΔE 0.157 (approval, surface limits)
-   dense-data/dark color.surface.pressed: #262D38 → #06090E, ΔE 0.157 (approval, surface limits)
-   content-first/dark color.surface.raised: #1F1B16 → #2E2A24, ΔE 0.062 (approval, surface limits)
-   content-first/dark color.surface.sunken: #2E2A24 → #0B0906, ΔE 0.146 (approval, surface limits)
-   content-first/dark color.surface.highlight: #2E2A24 → #0B0906, ΔE 0.146 (approval, surface limits)
-   accessible-first/dark color.surface.default: #141414 → #222222, ΔE 0.061 (approval, surface limits)
-   accessible-first/dark color.surface.raised: #141414 → #333333, ΔE 0.130 (approval, surface limits)
- … 20 more in scorecard.json

### `shift.review-unreasoned`

Moves in the review tier (ΔE 0.02 to 0.05) with no new recorded reason

### `shift.approval-unapproved`

Moves over ΔE 0.05 (or a role's own limit) that the owner has not approved

- accessible-first/dark color.border.default: #333333 → #595959, ΔE 0.143 (approval)
- accessible-first/dark color.border.strong: #949494 → #B4B4B4, ΔE 0.103 (approval)

### `shift.hue`

Chromatic tokens (C > 0.05) whose hue turned more than 5°

### `shift.key-colors`

Brand key colors that changed with no adjustment recorded

### `relations.wcag-level-drops`

Contrast pairs that drop a WCAG level (under 3, 3, 4.5, 7)

Per scheme (base → candidate): accessible-first not present → 1.

Worse in: accessible-first/dark 0 → 1.

- accessible-first/dark: color.text.muted on color.surface.raised 8.89:1 → 6.09:1
- dense-data/dark: color.border.focus on color.surface.raised 7.62:1 → 6.11:1 (approved by Yonatan, 2026-11-12: Cause: AA trade-off on the lighter dark raised surface. color.border.focus keeps AA on raised layers; the raised step is lighter so height reads by tone.)
- multi-brand/birch-dark: color.border.focus on color.surface.raised 7.80:1 → 6.39:1 (approved by Yonatan, 2026-11-12: Cause: AA trade-off on the lighter dark raised surface. color.border.focus keeps AA on raised layers; the raised step is lighter so height reads by tone.)

### `relations.step-order`

Scale steps that swap their lightness order

### `relations.ladder-order`

Surface ladder rungs that swap their lightness order

- dense-data/dark: color.surface.sunken and color.surface.default swap lightness order (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. sunken and default now keep that order.)
- dense-data/dark: color.surface.sunken and color.surface.raised swap lightness order (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. sunken and raised now keep that order.)
- content-first/dark: color.surface.sunken and color.surface.default swap lightness order (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. sunken and default now keep that order.)
- content-first/dark: color.surface.sunken and color.surface.raised swap lightness order (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. sunken and raised now keep that order.)
- accessible-first/dark: color.surface.sunken and color.surface.default swap lightness order (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. sunken and default now keep that order.)
- accessible-first/dark: color.surface.sunken and color.surface.raised swap lightness order (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. sunken and raised now keep that order.)
- brand-expressive/dark: color.surface.sunken and color.surface.default swap lightness order (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. sunken and default now keep that order.)
- brand-expressive/dark: color.surface.sunken and color.surface.raised swap lightness order (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. sunken and raised now keep that order.)
- multi-brand/aster-dark: color.surface.sunken and color.surface.default swap lightness order (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. sunken and default now keep that order.)
- multi-brand/aster-dark: color.surface.sunken and color.surface.raised swap lightness order (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. sunken and raised now keep that order.)
- … 4 more in scorecard.json

### `relations.state-sign`

State steps (rest → hover → pressed) whose lightness change flips sign

### `relations.distinct-lost.normal`

Pairs distinct on base that are no longer distinct (ΔE 0.02), normal vision

Per scheme (base → candidate): accessible-first not present → 1.

Worse in: accessible-first/dark 0 → 1.

- accessible-first/dark: color.surface.pressed and color.surface.raised were ΔE 0.130 apart, now 0.000

### `relations.distinct-lost.deuteranopia`

Pairs distinct on base that are no longer distinct (ΔE 0.02), deuteranopia simulated

Per scheme (base → candidate): accessible-first not present → 1.

Worse in: accessible-first/dark 0 → 1.

- accessible-first/dark: color.surface.pressed and color.surface.raised were ΔE 0.130 apart, now 0.000

### `relations.distinct-lost.protanopia`

Pairs distinct on base that are no longer distinct (ΔE 0.02), protanopia simulated

Per scheme (base → candidate): accessible-first not present → 1.

Worse in: accessible-first/dark 0 → 1.

- accessible-first/dark: color.surface.pressed and color.surface.raised were ΔE 0.130 apart, now 0.000

### `relations.distinct-lost.tritanopia`

Pairs distinct on base that are no longer distinct (ΔE 0.02), tritanopia simulated

Per scheme (base → candidate): dense-data not present → 1; accessible-first not present → 1; multi-brand not present → 1.

Worse in: accessible-first/dark 0 → 1; dense-data/dark 0 → 1; multi-brand/aster-dark 0 → 1.

- dense-data/dark: color.surface.raised and color.surface.selected were ΔE 0.069 apart, now 0.012
- accessible-first/dark: color.surface.pressed and color.surface.raised were ΔE 0.130 apart, now 0.000
- multi-brand/aster-dark: color.surface.raised and color.surface.selected were ΔE 0.066 apart, now 0.020

### `relations.shared-split`

Colors that were one color on base and are split now

Per scheme (base → candidate): accessible-first not present → 1.

Worse in: accessible-first/dark 0 → 1.

- accessible-first/dark: color.disabled.text no longer shares color.border.strong's color (#949494 vs #B4B4B4)
- dense-data/dark: color.surface.raised no longer shares color.surface.default's color (#262D38 vs #161B23) (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. default moved to its rung, so color.surface.raised no longer shares its step.)
- dense-data/dark: color.action.secondary.hover no longer shares color.surface.sunken's color (#262D38 vs #06090E) (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. sunken moved to its rung, so color.action.secondary.hover no longer shares its step.)
- dense-data/dark: color.category.5.subtle no longer shares color.surface.sunken's color (#262D38 vs #06090E) (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. sunken moved to its rung, so color.category.5.subtle no longer shares its step.)
- dense-data/dark: color.disabled.surface no longer shares color.surface.sunken's color (#262D38 vs #06090E) (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. sunken moved to its rung, so color.disabled.surface no longer shares its step.)
- content-first/dark: color.surface.raised no longer shares color.surface.default's color (#2E2A24 vs #1F1B16) (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. default moved to its rung, so color.surface.raised no longer shares its step.)
- content-first/dark: color.action.secondary.hover no longer shares color.surface.sunken's color (#2E2A24 vs #0B0906) (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. sunken moved to its rung, so color.action.secondary.hover no longer shares its step.)
- content-first/dark: color.category.5.subtle no longer shares color.surface.sunken's color (#2E2A24 vs #0B0906) (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. sunken moved to its rung, so color.category.5.subtle no longer shares its step.)
- content-first/dark: color.disabled.surface no longer shares color.surface.sunken's color (#2E2A24 vs #0B0906) (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. sunken moved to its rung, so color.disabled.surface no longer shares its step.)
- accessible-first/dark: color.surface.raised no longer shares color.surface.default's color (#333333 vs #222222) (approved by Yonatan, 2026-11-12: Cause: dark surface order fixed. In dark, sunken sits below content and raised above it, as decision 5 sets. default moved to its rung, so color.surface.raised no longer shares its step.)
- … 26 more in scorecard.json

### `component-pairs.level-drops`

Component pairs whose contrast drops a WCAG level, less the ones the owner approved

- dense-data/dark menubar data-[variant=destructive] text: --menubar-item-label-destructive on --menubar-content-background: 7.28:1 → 5.84:1, ΔE fg/bg 0.543 → 0.472 (approved by Yonatan, 2026-11-12: Cause: AA trade-off on the lighter dark raised surface. The menubar item label destructive keeps AA on the raised menu fill.)
- content-first/dark menubar data-[variant=destructive] text: --menubar-item-label-destructive on --menubar-content-background: 7.21:1 → 6.00:1, ΔE fg/bg 0.535 → 0.475 (approved by Yonatan, 2026-11-12: Cause: AA trade-off on the lighter dark raised surface. The menubar item label destructive keeps AA on the raised menu fill.)
- brand-expressive/dark menubar data-[variant=destructive] text: --menubar-item-label-destructive on --menubar-content-background: 7.58:1 → 6.26:1, ΔE fg/bg 0.553 → 0.481 (approved by Yonatan, 2026-11-12: Cause: AA trade-off on the lighter dark raised surface. The menubar item label destructive keeps AA on the raised menu fill.)
- multi-brand/aster-dark menubar data-[variant=destructive] text: --menubar-item-label-destructive on --menubar-content-background: 7.52:1 → 6.16:1, ΔE fg/bg 0.559 → 0.490 (approved by Yonatan, 2026-11-12: Cause: AA trade-off on the lighter dark raised surface. The menubar item label destructive keeps AA on the raised menu fill.)
- multi-brand/birch-dark menubar data-[variant=destructive] text: --menubar-item-label-destructive on --menubar-content-background: 7.52:1 → 6.16:1, ΔE fg/bg 0.559 → 0.490 (approved by Yonatan, 2026-11-12: Cause: AA trade-off on the lighter dark raised surface. The menubar item label destructive keeps AA on the raised menu fill.)
- multi-brand/coral-dark menubar data-[variant=destructive] text: --menubar-item-label-destructive on --menubar-content-background: 7.52:1 → 6.16:1, ΔE fg/bg 0.559 → 0.490 (approved by Yonatan, 2026-11-12: Cause: AA trade-off on the lighter dark raised surface. The menubar item label destructive keeps AA on the raised menu fill.)

### `component-pairs.difference-shrunk`

Component pairs whose foreground-to-background ΔE fell below 0.1, less the ones the owner approved

Worse in: accessible-first/dark 0 → 2; brand-expressive/dark 0 → 2; content-first/dark 0 → 2; dense-data/dark 0 → 2; multi-brand/aster-dark 0 → 2; multi-brand/birch-dark 0 → 2; multi-brand/coral-dark 0 → 2.

- dense-data/dark chart [&_.recharts-radial-bar-background-sector] icon: --chart-track-fill on the page: 1.37:1 → 1.05:1, ΔE fg/bg 0.119 → 0.038
- dense-data/dark chart [&_.recharts-rectangle.recharts-tooltip-cursor] icon: --chart-cursor-fill on the page: 1.37:1 → 1.05:1, ΔE fg/bg 0.119 → 0.038
- content-first/dark chart [&_.recharts-radial-bar-background-sector] icon: --chart-track-fill on the page: 1.32:1 → 1.06:1, ΔE fg/bg 0.107 → 0.039
- content-first/dark chart [&_.recharts-rectangle.recharts-tooltip-cursor] icon: --chart-cursor-fill on the page: 1.32:1 → 1.06:1, ΔE fg/bg 0.107 → 0.039
- accessible-first/dark chart [&_.recharts-radial-bar-background-sector] icon: --chart-track-fill on the page: 1.24:1 → 1.07:1, ΔE fg/bg 0.107 → 0.046
- accessible-first/dark chart [&_.recharts-rectangle.recharts-tooltip-cursor] icon: --chart-cursor-fill on the page: 1.24:1 → 1.07:1, ΔE fg/bg 0.107 → 0.046
- brand-expressive/dark chart [&_.recharts-radial-bar-background-sector] icon: --chart-track-fill on the page: 1.31:1 → 1.05:1, ΔE fg/bg 0.119 → 0.042
- brand-expressive/dark chart [&_.recharts-rectangle.recharts-tooltip-cursor] icon: --chart-cursor-fill on the page: 1.31:1 → 1.05:1, ΔE fg/bg 0.119 → 0.042
- multi-brand/aster-dark chart [&_.recharts-radial-bar-background-sector] icon: --chart-track-fill on the page: 1.38:1 → 1.03:1, ΔE fg/bg 0.151 → 0.044
- multi-brand/birch-dark chart [&_.recharts-radial-bar-background-sector] icon: --chart-track-fill on the page: 1.38:1 → 1.03:1, ΔE fg/bg 0.151 → 0.044
- … 4 more in scorecard.json

### `component-pairs.moved`

Component pairs where a side moved past ΔE 0.02

- 4256 pairs compared

### `component-pairs.flagged-components`

Components with a flagged pair (see component-pairs.md)

- accordion
- alert
- alert-dialog
- attachment
- avatar
- badge
- breadcrumb
- bubble
- button
- button-group
- … 38 more in scorecard.json

