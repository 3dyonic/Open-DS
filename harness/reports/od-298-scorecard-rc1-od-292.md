# Scheme quality scorecard

Base: `origin/RC1` (37a0b96863). Candidate: `origin/feat/od-292-build-generates` (48723d293a).

**Pass.** No gated criterion moved the wrong way.

Every number is computed by code from the two checkouts. Run `open-ds compare --base <ref>` to produce it again. Each gated count is gated per scheme (and per scheme and theme where it applies): a breach in one part fails, whatever the total does.

## Notes

- `invariants.floating-not-defined`: Floating not defined in dense-data, content-first, accessible-first, brand-expressive, multi-brand: no color.surface.floating, so the dark surface ladder is not checked above the raised surface. Not gated.
- `blast-radius.answers-generate-nothing`: Answers do not generate values. dense-data: 79 of 79 answer changes move no value; content-first: 79 of 79 answer changes move no value; accessible-first: 79 of 79 answer changes move no value; brand-expressive: 79 of 79 answer changes move no value; multi-brand: 79 of 79 answer changes move no value. Their trace links are not counted as orphans.
- `blast-radius.answer-orphans`: Counts only answers that move a value. No answer moves one, so it is 0 by construction, not a clean result.
- `accessibility.apca-warnings`: APCA Lc is a warning only, by the owner's decision: shown, never gated.
- `curves.grades`: Contrast grades are reported, not gated (gradesGated: false), by the owner's decision. They gate once OD-299 lands.

| Criterion | Base | Candidate | Delta | Direction | Result |
| --- | ---: | ---: | ---: | --- | --- |
| `traceability.traced-share` | 1 | 1 | 0 | ↑ higher is better | pass |
| `traceability.untraced` | 0 | 0 | 0 | ↓ lower is better | pass |
| `traceability.weak` | 144 | 144 | 0 | ↓ lower is better | pass |
| `traceability.weak.own` | 21 | 21 | 0 | ↓ lower is better | pass |
| `traceability.weak.exact-rule` | 18 | 18 | 0 | ↓ lower is better | pass |
| `traceability.weak.borrowed` | 105 | 105 | 0 | ↓ lower is better | pass |
| `traceability.weak.linked` | 0 | 0 | 0 | ↓ lower is better | pass |
| `traceability.weak.none` | 0 | 0 | 0 | ↓ lower is better | pass |
| `derived.share` | 0.8941 | 0.8941 | 0 | ↑ higher is better | pass |
| `derived.literal-values` | 196 | 196 | 0 | ↓ lower is better | pass |
| `derived.component-literals` | 8 | 8 | 0 | ↓ lower is better | pass |
| `invariants.failures` | 18 | 18 | 0 | ↓ lower is better | pass |
| `invariants.spacing-map` | 0 | 0 | 0 | ↓ lower is better | pass |
| `invariants.color-scale` | 0 | 0 | 0 | ↓ lower is better | pass |
| `invariants.focus-ring` | 0 | 0 | 0 | ↓ lower is better | pass |
| `invariants.compact-step` | 0 | 0 | 0 | ↓ lower is better | pass |
| `invariants.nested-radius` | 4 | 4 | 0 | ↓ lower is better | pass |
| `invariants.dark-ladder` | 14 | 14 | 0 | ↓ lower is better | pass |
| `invariants.floating-not-defined` | 5 | 5 | 0 | shown, not gated | — |
| `generation.answer-driven` | 0 | 0 | 0 | ↑ higher is better | pass |
| `generation.answer-driven-share` | 0 | 0 | 0 | ↑ higher is better | pass |
| `blast-radius.answers-generate-nothing` | 395 | 395 | 0 | shown, not gated | — |
| `blast-radius.answer-orphans` | 0 | 0 | 0 | ↓ lower is better | pass |
| `blast-radius.answer-orphan-share` | not present | not present |  | shown, not gated | — |
| `blast-radius.anchor-orphans` | 35 | 35 | 0 | ↓ lower is better | pass |
| `blast-radius.hidden-couplings` | 0 | 0 | 0 | ↓ lower is better | pass |
| `accessibility.wcag-failures` | 0 | 0 | 0 | ↓ lower is better | pass |
| `accessibility.wcag-waiting` | 0 | 0 | 0 | shown, not gated | — |
| `accessibility.apca-warnings` | 108 | 108 | 0 | ↓ lower is better, not gated | — |
| `accessibility.hit-area` | 0 | 0 | 0 | ↓ lower is better | pass |
| `accessibility.text-not-rem` | 0 | 0 | 0 | ↓ lower is better | pass |
| `motion.reduced-motion-transforms` | 0 | 0 | 0 | ↓ lower is better | pass |
| `motion.duration-caps` | 5 | 5 | 0 | ↓ lower is better | pass |
| `repetition.repeated-sentences` | 724 | 724 | 0 | ↓ lower is better | pass |
| `size.tokens` | 9091 | 9091 | 0 | shown, not gated | — |
| `size.css-bytes` | 2967388 | 2967388 | 0 | shown, not gated | — |
| `size.unused-semantics` | 52 | 52 | 0 | ↓ lower is better | pass |
| `relations.contrast-margin` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.state-gap` | 0 | 0 | 0 | ↓ lower is better | pass |
| `curves.min-gap` | 25 | 25 | 0 | ↓ lower is better | pass |
| `curves.grades` | 119 | 119 | 0 | shown, not gated | — |
| `derived.new-literals` | 0 | 0 | 0 | shown, not gated | — |
| `derived.new-literals-unreasoned` | 0 | 0 | 0 | ↓ lower is better | pass |
| `shift.moves` | 0 | 0 | 0 | shown, not gated | — |
| `shift.review-unreasoned` | 0 | 0 | 0 | ↓ lower is better | pass |
| `shift.approval-unapproved` | 0 | 0 | 0 | ↓ lower is better | pass |
| `shift.hue` | 0 | 0 | 0 | ↓ lower is better | pass |
| `shift.key-colors` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.wcag-level-drops` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.step-order` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.ladder-order` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.state-sign` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.distinct-lost.normal` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.distinct-lost.deuteranopia` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.distinct-lost.protanopia` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.distinct-lost.tritanopia` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.shared-split` | 0 | 0 | 0 | ↓ lower is better | pass |
| `component-pairs.level-drops` | 0 | 0 | 0 | ↓ lower is better | pass |
| `component-pairs.difference-shrunk` | 0 | 0 | 0 | ↓ lower is better | pass |
| `component-pairs.moved` | 0 | 0 | 0 | shown, not gated | — |
| `component-pairs.flagged-components` | 0 | 0 | 0 | shown, not gated | — |

## Relations per scheme

| Scheme | Relation | Kind | Base | Candidate |
| --- | --- | --- | --- | --- |
| dense-data | `spacing-map` | recorded | pass | pass |
| dense-data | `color-scale` | recorded | pass | pass |
| dense-data | `focus-ring` | minimum | pass | pass |
| dense-data | `compact-step` | minimum | pass | pass |
| dense-data | `nested-radius` | minimum | pass | pass |
| dense-data | `dark-ladder` | minimum | fail (2 of 2) | fail (2 of 2) |
| dense-data | `duration-caps` | minimum | pass | pass |
| dense-data | `hit-area` | minimum | pass | pass |
| content-first | `spacing-map` | recorded | pass | pass |
| content-first | `color-scale` | recorded | pass | pass |
| content-first | `focus-ring` | minimum | pass | pass |
| content-first | `compact-step` | minimum | pass | pass |
| content-first | `nested-radius` | minimum | fail (1 of 1) | fail (1 of 1) |
| content-first | `dark-ladder` | minimum | fail (2 of 2) | fail (2 of 2) |
| content-first | `duration-caps` | minimum | fail (2 of 2) | fail (2 of 2) |
| content-first | `hit-area` | minimum | pass | pass |
| accessible-first | `spacing-map` | recorded | pass | pass |
| accessible-first | `color-scale` | recorded | pass | pass |
| accessible-first | `focus-ring` | minimum | pass | pass |
| accessible-first | `compact-step` | minimum | pass | pass |
| accessible-first | `nested-radius` | minimum | fail (1 of 1) | fail (1 of 1) |
| accessible-first | `dark-ladder` | minimum | fail (2 of 2) | fail (2 of 2) |
| accessible-first | `duration-caps` | minimum | fail (1 of 2) | fail (1 of 2) |
| accessible-first | `hit-area` | minimum | pass | pass |
| brand-expressive | `spacing-map` | recorded | pass | pass |
| brand-expressive | `color-scale` | recorded | pass | pass |
| brand-expressive | `focus-ring` | minimum | pass | pass |
| brand-expressive | `compact-step` | minimum | pass | pass |
| brand-expressive | `nested-radius` | minimum | fail (1 of 1) | fail (1 of 1) |
| brand-expressive | `dark-ladder` | minimum | fail (2 of 2) | fail (2 of 2) |
| brand-expressive | `duration-caps` | minimum | pass | pass |
| brand-expressive | `hit-area` | minimum | pass | pass |
| multi-brand | `spacing-map` | recorded | pass | pass |
| multi-brand | `color-scale` | recorded | pass | pass |
| multi-brand | `focus-ring` | minimum | pass | pass |
| multi-brand | `compact-step` | minimum | pass | pass |
| multi-brand | `nested-radius` | minimum | fail (1 of 1) | fail (1 of 1) |
| multi-brand | `dark-ladder` | minimum | fail (6 of 6) | fail (6 of 6) |
| multi-brand | `duration-caps` | minimum | fail (2 of 2) | fail (2 of 2) |
| multi-brand | `hit-area` | minimum | pass | pass |

## Detail

### `traceability.traced-share`

Share of semantic values that reach an answer

Per scheme (base → candidate): dense-data 1 → 1; content-first 1 → 1; accessible-first 1 → 1; brand-expressive 1 → 1; multi-brand 1 → 1.

- 661 of 661 values traced

### `traceability.untraced`

Semantic values that reach no answer

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

### `traceability.weak`

Values whose reason does not explain them (weakReasons)

Per scheme (base → candidate): dense-data 26 → 26; content-first 30 → 30; accessible-first 29 → 29; brand-expressive 28 → 28; multi-brand 31 → 31.

- dense-data: size.icon, the same reason as icon.stroke-width
- dense-data: radius.control, the same reason as radius.badge, radius.surface
- dense-data: radius.badge, the same reason as radius.control, radius.surface
- dense-data: radius.surface, the same reason as radius.control, radius.badge
- dense-data: type.display.font-size, only a rule for its whole group explains it
- dense-data: type.display.line-height, only a rule for its whole group explains it
- dense-data: type.display.font-weight, only a rule for its whole group explains it
- dense-data: type.title.font-size, only a rule for its whole group explains it
- dense-data: type.title.line-height, only a rule for its whole group explains it
- dense-data: type.title.font-weight, only a rule for its whole group explains it
- … 134 more in scorecard.json

### `traceability.weak.own`

Weak reasons of kind "own"

Per scheme (base → candidate): dense-data 3 → 3; content-first 5 → 5; accessible-first 5 → 5; brand-expressive 4 → 4; multi-brand 4 → 4.

- dense-data: radius.control, the same reason as radius.badge, radius.surface
- dense-data: radius.badge, the same reason as radius.control, radius.surface
- dense-data: radius.surface, the same reason as radius.control, radius.badge
- content-first: radius.control, the reason is under 6 words
- content-first: radius.badge, the reason is under 6 words
- content-first: radius.surface, the reason is under 6 words
- content-first: elevation.card, the reason is under 6 words
- content-first: elevation.overlay, the reason is under 6 words
- accessible-first: radius.control, the reason is under 6 words
- accessible-first: radius.badge, the reason is under 6 words
- … 11 more in scorecard.json

### `traceability.weak.exact-rule`

Weak reasons of kind "exact-rule"

Per scheme (base → candidate): dense-data 2 → 2; content-first 4 → 4; accessible-first 3 → 3; brand-expressive 3 → 3; multi-brand 6 → 6.

- dense-data: size.icon, the same reason as icon.stroke-width
- dense-data: icon.stroke-width, the same reason as size.icon
- content-first: size.control.default, the reason is under 6 words
- content-first: size.row, the reason is under 6 words
- content-first: size.icon, the same reason as icon.stroke-width
- content-first: icon.stroke-width, the same reason as size.icon
- accessible-first: space.gap.default, the reason is under 6 words
- accessible-first: size.icon, the same reason as icon.stroke-width
- accessible-first: icon.stroke-width, the same reason as size.icon
- brand-expressive: space.gap.default, the reason is under 6 words
- … 8 more in scorecard.json

### `traceability.weak.borrowed`

Weak reasons of kind "borrowed"

Per scheme (base → candidate): dense-data 21 → 21; content-first 21 → 21; accessible-first 21 → 21; brand-expressive 21 → 21; multi-brand 21 → 21.

- dense-data: type.display.font-size, only a rule for its whole group explains it
- dense-data: type.display.line-height, only a rule for its whole group explains it
- dense-data: type.display.font-weight, only a rule for its whole group explains it
- dense-data: type.title.font-size, only a rule for its whole group explains it
- dense-data: type.title.line-height, only a rule for its whole group explains it
- dense-data: type.title.font-weight, only a rule for its whole group explains it
- dense-data: type.heading.font-size, only a rule for its whole group explains it
- dense-data: type.heading.line-height, only a rule for its whole group explains it
- dense-data: type.heading.font-weight, only a rule for its whole group explains it
- dense-data: type.body.font-size, only a rule for its whole group explains it
- … 95 more in scorecard.json

### `traceability.weak.linked`

Weak reasons of kind "linked"

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

### `traceability.weak.none`

Weak reasons of kind "none"

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

### `derived.share`

Share of semantic values (per brand and mode) derived from a scale, relation or alias

Per scheme (base → candidate): dense-data 0.9015 → 0.9015; content-first 0.8939 → 0.8939; accessible-first 0.9015 → 0.9015; brand-expressive 0.8797 → 0.8797; multi-brand 0.8939 → 0.8939.

- relation: 98
- alias: 0
- scale: 1556
- literal: 196

### `derived.literal-values`

Semantic values (per brand and mode) that end on a raw literal

Per scheme (base → candidate): dense-data 26 → 26; content-first 28 → 28; accessible-first 26 → 26; brand-expressive 32 → 32; multi-brand 84 → 84.

- dense-data: type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.easing.standard, elevation.card, elevation.overlay, icon.stroke-width
- content-first: radius.badge, type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.easing.standard, elevation.card, elevation.overlay, icon.stroke-width
- accessible-first: type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.easing.standard, elevation.card, elevation.overlay, icon.stroke-width
- brand-expressive: radius.control, radius.badge, type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.duration.hero, motion.easing.standard, elevation.card, elevation.overlay, icon.stroke-width
- multi-brand: type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.easing.standard, elevation.card, elevation.overlay, icon.stroke-width, radius.badge, radius.control

### `derived.component-literals`

Raw hex, px and ms literals in component code and CSS that bypass the tokens

- px: 6, ms: 2
- ui/src/components/chart.tsx:204 2px
- ui/src/components/chart.tsx:207 1.5px
- ui/src/components/chart.tsx:289 2px
- ui/src/components/command.tsx:82 300px
- ui/src/components/drawer.tsx:62 100px
- ui/src/components/navigation-menu.tsx:72 1px
- ui/src/styles.css:24 0.01ms
- ui/src/styles.css:25 0.01ms

### `invariants.failures`

Failing relation checks, all invariants

Per scheme (base → candidate): dense-data 2 → 2; content-first 3 → 3; accessible-first 3 → 3; brand-expressive 3 → 3; multi-brand 7 → 7.

- dense-data: spacing-map pass, color-scale pass, focus-ring pass, compact-step pass, nested-radius pass, dark-ladder fail, duration-caps pass, hit-area pass
- content-first: spacing-map pass, color-scale pass, focus-ring pass, compact-step pass, nested-radius fail, dark-ladder fail, duration-caps fail, hit-area pass
- accessible-first: spacing-map pass, color-scale pass, focus-ring pass, compact-step pass, nested-radius fail, dark-ladder fail, duration-caps fail, hit-area pass
- brand-expressive: spacing-map pass, color-scale pass, focus-ring pass, compact-step pass, nested-radius fail, dark-ladder fail, duration-caps pass, hit-area pass
- multi-brand: spacing-map pass, color-scale pass, focus-ring pass, compact-step pass, nested-radius fail, dark-ladder fail, duration-caps fail, hit-area pass

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

- dense-data: pass
- content-first: pass
- accessible-first: pass
- brand-expressive: pass
- multi-brand: pass

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

Per scheme (base → candidate): dense-data 2 → 2; content-first 2 → 2; accessible-first 2 → 2; brand-expressive 2 → 2; multi-brand 6 → 6.

- dense-data: fail (not present: color.surface.floating)
-   default: sunken < default: lightness 0.295 vs 0.221
-   default: default < raised: lightness 0.221 vs 0.221
- content-first: fail (not present: color.surface.floating)
-   default: sunken < default: lightness 0.287 vs 0.225
-   default: default < raised: lightness 0.225 vs 0.225
- accessible-first: fail (not present: color.surface.floating)
-   default: sunken < default: lightness 0.252 vs 0.191
-   default: default < raised: lightness 0.191 vs 0.191
- brand-expressive: fail (not present: color.surface.floating)
- … 9 more in scorecard.json

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

- dense-data: 0 of 132 traced tokens
- content-first: 0 of 132 traced tokens
- accessible-first: 0 of 132 traced tokens
- brand-expressive: 0 of 133 traced tokens
- multi-brand: 0 of 132 traced tokens

### `generation.answer-driven-share`

Share of traced semantic tokens that an answer they cite drives (may only rise, per scheme)

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

- 0 of 661 traced tokens move with an answer they cite

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

Per scheme (base → candidate): dense-data 7 → 7; content-first 7 → 7; accessible-first 7 → 7; brand-expressive 7 → 7; multi-brand 7 → 7.

- dense-data base-step (space.4: 0.25rem → 0.3125rem): 6 — component-spacing-map.x12, component-spacing-map.x2, component-spacing-map.x3, component-spacing-map.x4, component-spacing-map.x6, component-spacing-map.x8
- dense-data control-height (size.32 → size.24): 1 — size.control.compact
- content-first base-step (space.4: 0.25rem → 0.3125rem): 6 — component-spacing-map.x12, component-spacing-map.x2, component-spacing-map.x3, component-spacing-map.x4, component-spacing-map.x6, component-spacing-map.x8
- content-first control-height (size.48 → size.40): 1 — size.control.compact
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

Per scheme (base → candidate): dense-data 15 → 15; content-first 20 → 20; accessible-first 16 → 16; brand-expressive 13 → 13; multi-brand 44 → 44.

- dense-data/dark: color.text.muted on color.surface.canvas Lc -49.4, floor 60
- dense-data/dark: color.text.muted on color.surface.default Lc -48.5, floor 60
- dense-data/dark: color.text.muted on color.surface.raised Lc -48.5, floor 60
- dense-data/dark: color.text.muted on color.surface.sunken Lc -45.6, floor 60
- dense-data/dark: color.text.muted on color.surface.highlight Lc -45.6, floor 60
- dense-data/dark: color.text.muted on color.surface.selected Lc -46.0, floor 60
- dense-data/dark: color.text.on-light on color.action.primary Lc 57.4, floor 60
- dense-data/dark: color.text.on-light on color.action.danger Lc 55.6, floor 60
- dense-data/dark: color.text.on-action on color.action.primary Lc 57.4, floor 60
- dense-data/dark: color.text.on-danger on color.action.danger Lc 55.6, floor 60
- … 98 more in scorecard.json

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

Per scheme (base → candidate): dense-data 0 → 0; content-first 2 → 2; accessible-first 1 → 1; brand-expressive 0 → 0; multi-brand 2 → 2.

- dense-data: pass
- content-first: fail
-   motion.duration.feedback is 200ms; the feedback cap is 150ms
-   motion.duration.panels is 320ms; the panels cap is 300ms
- accessible-first: fail
-   motion.duration.feedback is 200ms; the feedback cap is 150ms
- brand-expressive: pass
- multi-brand: fail
-   motion.duration.feedback is 200ms; the feedback cap is 150ms
-   motion.duration.panels is 320ms; the panels cap is 300ms

### `repetition.repeated-sentences`

Extra copies of sentences repeated across reasons, token names taken out

Per scheme (base → candidate): dense-data 75 → 75; content-first 75 → 75; accessible-first 74 → 74; brand-expressive 74 → 74; multi-brand 426 → 426.

- dense-data: ×25 "one product one brand ramp on cool neutrals" (answer color.definition; pick default/light color.neutral.0; pick default/light color.neutral.50; …)
- dense-data: ×24 "the scheme's neutral is slate" (pick default/light color.neutral.0; pick default/light color.neutral.50; pick default/light color.neutral.100; …)
- dense-data: ×5 "small corners keep dense rows straight" (answer shape.values; usage control-corner; pick default/base radius.control; …)
- dense-data: ×3 "experts do not need more" (answer accessibility.roles; pick default/light color.surface.pressed; pick default/dark color.surface.pressed)
- dense-data: ×3 "only menus and dialogs float" (answer elevation.roles; pick default/light elevation.card; pick default/dark elevation.card)
- dense-data: ×3 "subtle shadows keep the grid crisp" (answer elevation.values; pick default/light elevation.overlay; pick default/dark elevation.overlay)
- dense-data: ×2 "a quiet tint behind danger" (pick default/light color.status.danger.subtle; pick default/dark color.status.danger.subtle)
- dense-data: ×2 "a quiet tint behind info" (pick default/light color.status.info.subtle; pick default/dark color.status.info.subtle)
- dense-data: ×2 "a quiet tint behind success" (pick default/light color.status.success.subtle; pick default/dark color.status.success.subtle)
- dense-data: ×2 "a quiet tint behind warning" (pick default/light color.status.warning.subtle; pick default/dark color.status.warning.subtle)
- … 202 more in scorecard.json

### `size.tokens`

Semantic and component tokens

Per scheme (base → candidate): dense-data 1818 → 1818; content-first 1818 → 1818; accessible-first 1818 → 1818; brand-expressive 1819 → 1819; multi-brand 1818 → 1818.

- dense-data: 132 semantic, 1686 component
- content-first: 132 semantic, 1686 component
- accessible-first: 132 semantic, 1686 component
- brand-expressive: 133 semantic, 1686 component
- multi-brand: 132 semantic, 1686 component

### `size.css-bytes`

Bytes of each scheme's generated tokens.css

Per scheme (base → candidate): dense-data 423854 → 423854; content-first 423839 → 423839; accessible-first 424064 → 424064; brand-expressive 424036 → 424036; multi-brand 1271595 → 1271595.

- dense-data: 423854 bytes, 1818 custom properties
- content-first: 423839 bytes, 1818 custom properties
- accessible-first: 424064 bytes, 1818 custom properties
- brand-expressive: 424036 bytes, 1819 custom properties
- multi-brand: 1271595 bytes, 1818 custom properties

### `size.unused-semantics`

Semantic tokens no token, CSS or component reads

Per scheme (base → candidate): dense-data 10 → 10; content-first 10 → 10; accessible-first 11 → 11; brand-expressive 11 → 11; multi-brand 10 → 10.

- dense-data: color.category.1.subtle, color.category.2.subtle, color.category.3.subtle, color.category.4.subtle, color.category.5.subtle, color.neutral.300, color.neutral.800, color.neutral.950, color.status.info, color.status.warning
- content-first: color.category.1.subtle, color.category.2.subtle, color.category.3.subtle, color.category.4.subtle, color.category.5.subtle, color.neutral.300, color.neutral.800, color.neutral.950, color.status.info, color.status.warning
- accessible-first: color.category.1.subtle, color.category.2.subtle, color.category.3.subtle, color.category.4.subtle, color.category.5.subtle, color.neutral.300, color.neutral.400, color.neutral.800, color.neutral.950, color.status.info, color.status.warning
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

### `derived.new-literals-unreasoned`

Literals new in the candidate with no recorded reason

### `shift.moves`

Color tokens that moved, per scheme, brand and mode, every move listed by tier

- approval: 0
- review: 0
- pass: 0

### `shift.review-unreasoned`

Moves in the review tier (ΔE 0.02 to 0.05) with no new recorded reason

### `shift.approval-unapproved`

Moves over ΔE 0.05 (or a role's own limit) that the owner has not approved

### `shift.hue`

Chromatic tokens (C > 0.05) whose hue turned more than 5°

### `shift.key-colors`

Brand key colors that changed with no adjustment recorded

### `relations.wcag-level-drops`

Contrast pairs that drop a WCAG level (under 3, 3, 4.5, 7)

### `relations.step-order`

Scale steps that swap their lightness order

### `relations.ladder-order`

Surface ladder rungs that swap their lightness order

### `relations.state-sign`

State steps (rest → hover → pressed) whose lightness change flips sign

### `relations.distinct-lost.normal`

Pairs distinct on base that are no longer distinct (ΔE 0.02), normal vision

### `relations.distinct-lost.deuteranopia`

Pairs distinct on base that are no longer distinct (ΔE 0.02), deuteranopia simulated

### `relations.distinct-lost.protanopia`

Pairs distinct on base that are no longer distinct (ΔE 0.02), protanopia simulated

### `relations.distinct-lost.tritanopia`

Pairs distinct on base that are no longer distinct (ΔE 0.02), tritanopia simulated

### `relations.shared-split`

Colors that were one color on base and are split now

### `component-pairs.level-drops`

Component pairs whose contrast drops a WCAG level

### `component-pairs.difference-shrunk`

Component pairs whose foreground-to-background ΔE fell below 0.1

### `component-pairs.moved`

Component pairs where a side moved past ΔE 0.02

- 4284 pairs compared

### `component-pairs.flagged-components`

Components with a flagged pair (see component-pairs.md)

