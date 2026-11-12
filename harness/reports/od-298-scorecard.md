# Scheme quality scorecard

Base: `origin/master` (48ded0add0). Candidate: `origin/feat/od-297-accepted-decisions` (33b0e31417).

**Fail.** 15 gated criteria moved the wrong way: derived.share, derived.literal-values, invariants.compact-step, blast-radius.answer-orphans, repetition.repeated-sentences, shift.approval-unapproved, relations.wcag-level-drops, relations.ladder-order, relations.distinct-lost.normal, relations.distinct-lost.deuteranopia, relations.distinct-lost.protanopia, relations.distinct-lost.tritanopia, relations.shared-split, component-pairs.level-drops, component-pairs.difference-shrunk.

Every number is computed by code from the two checkouts. Run `open-ds compare --base <ref>` to produce it again.

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
| `derived.share` | 0.6176 | 0.5936 | -0.0240 | ↑ higher is better | **fail** |
| `derived.literal-values` | 702 | 786 | +84 | ↓ lower is better | **fail** |
| `derived.component-literals` | 8 | 6 | -2 | ↓ lower is better | pass |
| `invariants.failures` | 18 | 5 | -13 | ↓ lower is better | pass |
| `invariants.spacing-map` | 0 | 0 | 0 | ↓ lower is better | pass |
| `invariants.color-scale` | 0 | 0 | 0 | ↓ lower is better | pass |
| `invariants.focus-ring` | 0 | not present |  | ↓ lower is better | pass |
| `invariants.compact-step` | 0 | 1 | +1 | ↓ lower is better | **fail** |
| `invariants.nested-radius` | 4 | 4 | 0 | ↓ lower is better | pass |
| `invariants.dark-ladder` | 14 | 0 | -14 | ↓ lower is better | pass |
| `blast-radius.answer-orphans` | 814 | 1787 | +973 | ↓ lower is better | **fail** |
| `blast-radius.answer-orphan-share` | 1 | 1 | 0 | shown, not gated | — |
| `blast-radius.anchor-orphans` | 76 | 75 | -1 | ↓ lower is better | pass |
| `blast-radius.hidden-couplings` | 0 | 0 | 0 | ↓ lower is better | pass |
| `accessibility.wcag-failures` | 0 | 0 | 0 | ↓ lower is better | pass |
| `accessibility.wcag-waiting` | 0 | 0 | 0 | shown, not gated | — |
| `accessibility.apca-warnings` | 108 | 107 | -1 | ↓ lower is better | pass |
| `accessibility.hit-area` | 0 | 0 | 0 | ↓ lower is better | pass |
| `accessibility.text-not-rem` | 0 | 0 | 0 | ↓ lower is better | pass |
| `motion.reduced-motion-transforms` | 0 | 0 | 0 | ↓ lower is better | pass |
| `motion.duration-caps` | 5 | 0 | -5 | ↓ lower is better | pass |
| `repetition.repeated-sentences` | 719 | 793 | +74 | ↓ lower is better | **fail** |
| `size.tokens` | 9046 | 9326 | +280 | shown, not gated | — |
| `size.css-bytes` | 2954890 | 3067744 | +112854 | shown, not gated | — |
| `size.unused-semantics` | 52 | 51 | -1 | ↓ lower is better | pass |
| `relations.contrast-margin` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.state-gap` | 0 | 0 | 0 | ↓ lower is better | pass |
| `curves.min-gap` | 25 | 25 | 0 | ↓ lower is better | pass |
| `curves.grades` | 119 | 119 | 0 | shown, not gated | — |
| `derived.new-literals` | 0 | 35 | +35 | shown, not gated | — |
| `derived.new-literals-unreasoned` | 0 | 0 | 0 | ↓ lower is better | pass |
| `shift.moves` | 0 | 25 | +25 | shown, not gated | — |
| `shift.review-unreasoned` | 0 | 0 | 0 | ↓ lower is better | pass |
| `shift.approval-unapproved` | 0 | 25 | +25 | ↓ lower is better | **fail** |
| `shift.hue` | 0 | 0 | 0 | ↓ lower is better | pass |
| `shift.key-colors` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.wcag-level-drops` | 0 | 6 | +6 | ↓ lower is better | **fail** |
| `relations.step-order` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.ladder-order` | 0 | 14 | +14 | ↓ lower is better | **fail** |
| `relations.state-sign` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.distinct-lost.normal` | 0 | 14 | +14 | ↓ lower is better | **fail** |
| `relations.distinct-lost.deuteranopia` | 0 | 14 | +14 | ↓ lower is better | **fail** |
| `relations.distinct-lost.protanopia` | 0 | 14 | +14 | ↓ lower is better | **fail** |
| `relations.distinct-lost.tritanopia` | 0 | 16 | +16 | ↓ lower is better | **fail** |
| `relations.shared-split` | 0 | 32 | +32 | ↓ lower is better | **fail** |
| `component-pairs.level-drops` | 0 | 9 | +9 | ↓ lower is better | **fail** |
| `component-pairs.difference-shrunk` | 0 | 14 | +14 | ↓ lower is better | **fail** |
| `component-pairs.moved` | 0 | 395 | +395 | shown, not gated | — |
| `component-pairs.flagged-components` | 0 | 37 | +37 | shown, not gated | — |

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
| content-first | `compact-step` | minimum | pass | fail (1 of 1) |
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

- 691 of 691 values traced

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

Per scheme (base → candidate): dense-data 0.6183 → 0.5942; content-first 0.6107 → 0.5870; accessible-first 0.6183 → 0.5942; brand-expressive 0.5985 → 0.5755; multi-brand 0.6260 → 0.6014.

- relation: 98
- alias: 0
- scale: 1050
- literal: 786

### `derived.literal-values`

Semantic values (per brand and mode) that end on a raw literal

Per scheme (base → candidate): dense-data 100 → 112; content-first 102 → 114; accessible-first 100 → 112; brand-expressive 106 → 118; multi-brand 294 → 330.

- dense-data: type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.duration.exit, motion.easing.standard, motion.easing.enter, motion.easing.exit, motion.easing.exit-offscreen, motion.easing.emphasize, color.neutral.0, color.neutral.50, color.neutral.100, color.neutral.200, color.neutral.300, color.neutral.400, color.neutral.500, color.neutral.600, color.neutral.700, color.neutral.800, color.neutral.900, color.neutral.950, color.surface.canvas, color.surface.default, color.surface.raised, color.surface.sunken, color.surface.highlight, color.surface.pressed, color.surface.inverse, color.surface.scrim, color.text.primary, color.text.secondary, color.text.muted, color.text.inverse, color.text.on-action, color.text.on-danger, color.text.on-light, color.text.on-dark, color.border.default, color.border.raised, color.border.strong, color.action.secondary, color.action.secondary.hover, color.category.5, color.category.5.subtle, color.disabled.text, color.disabled.surface, color.disabled.border, elevation.card, elevation.overlay, icon.stroke-width
- content-first: radius.badge, type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.duration.exit, motion.easing.standard, motion.easing.enter, motion.easing.exit, motion.easing.exit-offscreen, motion.easing.emphasize, color.neutral.0, color.neutral.50, color.neutral.100, color.neutral.200, color.neutral.300, color.neutral.400, color.neutral.500, color.neutral.600, color.neutral.700, color.neutral.800, color.neutral.900, color.neutral.950, color.surface.canvas, color.surface.default, color.surface.raised, color.surface.sunken, color.surface.highlight, color.surface.pressed, color.surface.inverse, color.surface.scrim, color.text.primary, color.text.secondary, color.text.muted, color.text.inverse, color.text.on-action, color.text.on-danger, color.text.on-light, color.text.on-dark, color.border.default, color.border.raised, color.border.strong, color.action.secondary, color.action.secondary.hover, color.category.5, color.category.5.subtle, color.disabled.text, color.disabled.surface, color.disabled.border, elevation.card, elevation.overlay, icon.stroke-width
- accessible-first: type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.duration.exit, motion.easing.standard, motion.easing.enter, motion.easing.exit, motion.easing.exit-offscreen, motion.easing.emphasize, color.neutral.0, color.neutral.50, color.neutral.100, color.neutral.200, color.neutral.300, color.neutral.400, color.neutral.500, color.neutral.600, color.neutral.700, color.neutral.800, color.neutral.900, color.neutral.950, color.surface.canvas, color.surface.default, color.surface.raised, color.surface.sunken, color.surface.highlight, color.surface.pressed, color.surface.inverse, color.surface.scrim, color.text.primary, color.text.secondary, color.text.muted, color.text.inverse, color.text.on-action, color.text.on-danger, color.text.on-light, color.text.on-dark, color.border.default, color.border.raised, color.border.strong, color.action.secondary, color.action.secondary.hover, color.category.5, color.category.5.subtle, color.disabled.text, color.disabled.surface, color.disabled.border, elevation.card, elevation.overlay, icon.stroke-width
- brand-expressive: radius.control, radius.badge, type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.duration.exit, motion.duration.hero, motion.easing.standard, motion.easing.enter, motion.easing.exit, motion.easing.exit-offscreen, motion.easing.emphasize, color.neutral.0, color.neutral.50, color.neutral.100, color.neutral.200, color.neutral.300, color.neutral.400, color.neutral.500, color.neutral.600, color.neutral.700, color.neutral.800, color.neutral.900, color.neutral.950, color.surface.canvas, color.surface.default, color.surface.raised, color.surface.sunken, color.surface.highlight, color.surface.pressed, color.surface.inverse, color.surface.scrim, color.text.primary, color.text.secondary, color.text.muted, color.text.inverse, color.text.on-action, color.text.on-danger, color.text.on-light, color.text.on-dark, color.border.default, color.border.raised, color.border.strong, color.action.secondary, color.action.secondary.hover, color.category.5, color.category.5.subtle, color.disabled.text, color.disabled.surface, color.disabled.border, elevation.card, elevation.overlay, icon.stroke-width
- multi-brand: type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.duration.exit, motion.easing.standard, motion.easing.enter, motion.easing.exit, motion.easing.exit-offscreen, motion.easing.emphasize, color.neutral.0, color.neutral.50, color.neutral.100, color.neutral.200, color.neutral.300, color.neutral.400, color.neutral.500, color.neutral.600, color.neutral.700, color.neutral.800, color.neutral.900, color.neutral.950, color.surface.canvas, color.surface.default, color.surface.raised, color.surface.sunken, color.surface.highlight, color.surface.pressed, color.surface.inverse, color.surface.scrim, color.text.primary, color.text.secondary, color.text.muted, color.text.inverse, color.text.on-action, color.text.on-danger, color.text.on-light, color.text.on-dark, color.border.default, color.border.raised, color.border.strong, color.action.secondary, color.action.secondary.hover, color.disabled.text, color.disabled.surface, color.disabled.border, elevation.card, elevation.overlay, icon.stroke-width, radius.badge, radius.control

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

Per scheme (base → candidate): dense-data 2 → 0; content-first 3 → 2; accessible-first 3 → 1; brand-expressive 3 → 1; multi-brand 7 → 1.

- dense-data: spacing-map pass, color-scale pass, focus-ring not present, compact-step pass, nested-radius pass, dark-ladder pass, duration-caps pass, hit-area pass
- content-first: spacing-map pass, color-scale pass, focus-ring not present, compact-step fail, nested-radius fail, dark-ladder pass, duration-caps pass, hit-area pass
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

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 1; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

- dense-data: pass
- content-first: fail
-   size.control.compact is 40px; one step below the 48px default is 44px
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

### `blast-radius.answer-orphans`

Tokens the trace ties to an answer that do not move when the answer changes

Per scheme (base → candidate): dense-data 164 → 351; content-first 157 → 346; accessible-first 168 → 360; brand-expressive 162 → 367; multi-brand 163 → 363.

- dense-data people.q1 (experts → occasional): 1 — motion.duration.panels
- dense-data people.q2 (aa → aa-plus): 2 — focus.ring.offset, focus.ring.width
- dense-data content.q1 (numbers → long-text): 8 — type.caption.font-family, type.caption.font-size, type.caption.font-weight, type.caption.line-height, type.data.font-family, type.data.font-size, type.data.font-weight, type.data.line-height
- dense-data content.q2 (a-lot → moderate): 29 — border-width.default, radius.control, radius.element, radius.surface, size.control.compact, size.control.default, size.control.large, size.row, …
- dense-data tasks.q1 (compare → read): 15 — color.surface.selected, radius.badge, space.inset.cell-x, type.data.font-family, type.data.font-size, type.data.font-weight, type.data.line-height, type.display.font-family, …
- dense-data tasks.q2 (constantly → sometimes): 4 — icon.stroke-width, radius.option, size.icon, space.inset.control-x
- dense-data human.q1 (place → attention): 2 — space.gap.group, type.data.line-height
- dense-data human.q2 (learned → fresh): 9 — color.disabled.border, color.disabled.surface, color.disabled.text, color.text.link, space.gap.tight, type.title.font-family, type.title.font-size, type.title.font-weight, …
- dense-data outcomes.q1 (time-on-task → reading-comfort): 6 — motion.duration.panels, motion.easing.standard, type.body.font-family, type.body.font-size, type.body.font-weight, type.body.line-height
- dense-data outcomes.q2 (wrong-record → lost-place): 3 — color.status.danger, focus.ring.offset, space.gap.default
- dense-data brand.q1 (precise → warm): 5 — radius.badge, radius.control, radius.element, radius.option, radius.surface
- dense-data brand.q2 (quiet → present): 13 — border-width.default, icon.stroke-width, motion.easing.standard, size.icon, type.body.font-weight, type.caption.font-family, type.caption.font-size, type.caption.font-weight, …
- … 205 more in scorecard.json

### `blast-radius.answer-orphan-share`

Share of the answer links the trace claims that a changed answer does not move

- 1787 of 1787 answer links do not move

### `blast-radius.anchor-orphans`

Tokens an anchor's chain or relations tie to it that do not move when it changes

Per scheme (base → candidate): dense-data 15 → 15; content-first 15 → 15; accessible-first 15 → 15; brand-expressive 16 → 15; multi-brand 15 → 15.

- dense-data base-step (space.4: 0.25rem → 0.3125rem): 6 — component-spacing-map.x12, component-spacing-map.x2, component-spacing-map.x3, component-spacing-map.x4, component-spacing-map.x6, component-spacing-map.x8
- dense-data key-color (violet light key #4B3FD9 → #8F15AF, violet dark key #A9A3F6 → #D694D6): 8 — color.action.primary, color.action.primary.hover, color.border.focus, color.border.selected, color.category.1, color.category.1.subtle, color.surface.selected, color.text.link
- dense-data control-height (size.32 → size.24): 1 — size.control.compact
- content-first base-step (space.4: 0.25rem → 0.3125rem): 6 — component-spacing-map.x12, component-spacing-map.x2, component-spacing-map.x3, component-spacing-map.x4, component-spacing-map.x6, component-spacing-map.x8
- content-first key-color (navy light key #1E3A5F → #3D315B, navy dark key #8FA6C4 → #A69EC1): 8 — color.action.primary, color.action.primary.hover, color.border.focus, color.border.selected, color.category.1, color.category.1.subtle, color.surface.selected, color.text.link
- content-first control-height (size.48 → size.44): 1 — size.control.compact
- accessible-first base-step (space.4: 0.25rem → 0.3125rem): 6 — component-spacing-map.x12, component-spacing-map.x2, component-spacing-map.x3, component-spacing-map.x4, component-spacing-map.x6, component-spacing-map.x8
- accessible-first key-color (blue light key #0B4FC0 → #6D32AF, blue dark key #8AB4F8 → #BDA3EE): 8 — color.action.primary, color.action.primary.hover, color.border.focus, color.border.selected, color.category.1, color.category.1.subtle, color.surface.selected, color.text.link
- accessible-first control-height (size.52 → size.56): 1 — size.control.compact
- brand-expressive base-step (space.4: 0.25rem → 0.3125rem): 6 — component-spacing-map.x12, component-spacing-map.x2, component-spacing-map.x3, component-spacing-map.x4, component-spacing-map.x6, component-spacing-map.x8
- brand-expressive key-color (pink light key #D61F7A → #D14203, pink dark key #F59ACA → #FF9D91): 8 — color.action.primary, color.action.primary.hover, color.border.focus, color.border.selected, color.category.1, color.category.1.subtle, color.surface.selected, color.text.link
- brand-expressive control-height (size.52 → size.60): 1 — size.control.compact
- … 3 more in scorecard.json

### `blast-radius.hidden-couplings`

Tokens that move when an answer or anchor changes, with no trace link to it

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

### `accessibility.wcag-failures`

Grammar pairs below their WCAG contrast (pairs on a fill that waits for a fix excluded)

Per scheme (base → candidate): dense-data 0 → 0; content-first 0 → 0; accessible-first 0 → 0; brand-expressive 0 → 0; multi-brand 0 → 0.

- 1344 pairs measured

### `accessibility.wcag-waiting`

Grammar pairs below their WCAG contrast on a fill that records it waits for a fix

### `accessibility.apca-warnings`

Grammar pairs whose APCA Lc is under the readability floor for their role (warning)

Per scheme (base → candidate): dense-data 15 → 15; content-first 20 → 19; accessible-first 16 → 16; brand-expressive 13 → 13; multi-brand 44 → 44.

- dense-data/dark: color.text.muted on color.surface.canvas Lc -49.4, floor 60
- dense-data/dark: color.text.muted on color.surface.default Lc -48.5, floor 60
- dense-data/dark: color.text.muted on color.surface.raised Lc -45.6, floor 60
- dense-data/dark: color.text.muted on color.surface.sunken Lc -49.4, floor 60
- dense-data/dark: color.text.muted on color.surface.highlight Lc -49.4, floor 60
- dense-data/dark: color.text.muted on color.surface.selected Lc -46.0, floor 60
- dense-data/dark: color.text.on-light on color.action.primary Lc 57.4, floor 60
- dense-data/dark: color.text.on-light on color.action.danger Lc 55.6, floor 60
- dense-data/dark: color.text.on-action on color.action.primary Lc 57.4, floor 60
- dense-data/dark: color.text.on-danger on color.action.danger Lc 55.6, floor 60
- dense-data/dark: color.status.info on color.surface.default Lc -59.6, floor 60
- dense-data/dark: color.status.danger on color.surface.canvas Lc -55.0, floor 60
- … 95 more in scorecard.json

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

Per scheme (base → candidate): dense-data 75 → 80; content-first 73 → 81; accessible-first 76 → 83; brand-expressive 73 → 77; multi-brand 422 → 472.

- dense-data: ×25 "one product one brand ramp on cool neutrals" (answer color.definition; pick default/light color.neutral.0; pick default/light color.neutral.50; …)
- dense-data: ×24 "the scheme's neutral is slate" (pick default/light color.neutral.0; pick default/light color.neutral.50; pick default/light color.neutral.100; …)
- dense-data: ×4 "distance does this by grouping what is near and separating what is far as the eye reads proximity gestalt so a gap between groups stays clearly larger than a gap inside one" (token space.gap.tight; token space.gap.default; token space.gap.group; …)
- dense-data: ×3 "2 5 5: 44px at aaa and padding or a label can make it larger than the box" (token size.control.default; token size.control.compact; token size.control.large)
- dense-data: ×3 "height does this by setting the hit area a finger or a pointer must hit" (token size.control.default; token size.control.compact; token size.control.large)
- dense-data: ×3 "padding does this by keeping content off the edge of its box so the content reads as part of that box and by setting the size of the box with the content" (token space.inset.control-x; token space.inset.container; token space.inset.cell-x)
- dense-data: ×3 "wcag measures the hit area not the drawn box 2 5 8: 24px at aa" (token size.control.default; token size.control.compact; token size.control.large)
- dense-data: ×2 "a quiet tint behind danger" (pick default/light color.status.danger.subtle; pick default/dark color.status.danger.subtle)
- dense-data: ×2 "a quiet tint behind info" (pick default/light color.status.info.subtle; pick default/dark color.status.info.subtle)
- dense-data: ×2 "a quiet tint behind success" (pick default/light color.status.success.subtle; pick default/dark color.status.success.subtle)
- content-first: ×25 "warm paper neutrals and one ink ramp" (answer color.definition; pick default/light color.neutral.0; pick default/light color.neutral.50; …)
- content-first: ×24 "the scheme's neutral is stone" (pick default/light color.neutral.0; pick default/light color.neutral.50; pick default/light color.neutral.100; …)
- … 38 more in scorecard.json

### `size.tokens`

Semantic and component tokens

Per scheme (base → candidate): dense-data 1809 → 1865; content-first 1809 → 1865; accessible-first 1809 → 1865; brand-expressive 1810 → 1866; multi-brand 1809 → 1865.

- dense-data: 138 semantic, 1727 component
- content-first: 138 semantic, 1727 component
- accessible-first: 138 semantic, 1727 component
- brand-expressive: 139 semantic, 1727 component
- multi-brand: 138 semantic, 1727 component

### `size.css-bytes`

Bytes of each scheme's generated tokens.css

Per scheme (base → candidate): dense-data 422088 → 438134; content-first 422049 → 438075; accessible-first 422302 → 438330; brand-expressive 422232 → 438500; multi-brand 1266219 → 1314705.

- dense-data: 438134 bytes, 1868 custom properties
- content-first: 438075 bytes, 1868 custom properties
- accessible-first: 438330 bytes, 1868 custom properties
- brand-expressive: 438500 bytes, 1869 custom properties
- multi-brand: 1314705 bytes, 1868 custom properties

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
- accessible-first: red.light 100 → 200 differ by 0.010
- brand-expressive: taupe.light 0 → 50 differ by 0.017
- … 13 more in scorecard.json

### `curves.grades`

Step pairs under their contrast grade (400 apart 3:1, 500 apart 4.5:1, 700 apart 7:1)

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
- dense-data: green.dark 400 and 900 are 4.02:1, need 4.5:1
- dense-data: green.dark 500 and 900 are 2.73:1, need 3:1
- … 107 more in scorecard.json

### `derived.new-literals`

Literals new in the candidate

- dense-data: motion.duration.exit (why: We use 120ms (fast) for a layer that closes in order to finish the exit move within the productive 150ms. The duration does this by removing the layer in fewer frames than an open takes, as nothing in it needs reading any more. So experts get the page back at once, because productive exits stay short (motion.roles) and there is one speed (motion.count).)
- dense-data: motion.easing.enter (why: We use the standard easing for a panel that appears in order to do the enter move. The curve does this by spending most of the change in the first frames, so the layer is in place before it slows. So experts can read a menu almost as soon as it opens, because easing is a standard ease-out (motion.definition) in a productive family (motion.roles).)
- dense-data: motion.easing.exit (why: We use the strong-out easing (0.23, 1, 0.32, 1) for a layer that closes in place in order to do the exit move of the productive family. The curve does this by covering most of the way in the first third of its time, then easing to a stop. So a closed popover is gone before the next click, because productive exits take a strong ease-out (motion.roles) and easing never springs here (motion.definition).)
- dense-data: motion.easing.exit-offscreen (why: We use the strong-out easing as well for a drawer or sheet that slides off the screen, in order to keep every exit of a productive family on one fast curve. The curve does this by moving fastest at the start, so the panel clears the view with no slow tail. So the content under a closing sheet comes back at once, because only an expressive family accelerates what leaves the screen (motion.roles), and easing is a plain ease-out (motion.definition).)
- dense-data: motion.easing.emphasize (why: We use the standard easing for a moment that calls for attention in order to give the emphasize move no overshoot. The curve does this by stopping at its target without passing it. So a new message draws the eye by its change, not by a bounce, because the family is productive (motion.roles) and easing is a standard ease-out, never a spring (motion.definition).)
- dense-data: color.border.raised (why: neutral.200: We use the default line's step for the edge of menus, dialogs and other raised layers, in order to give separation between a layer and what lies under it. The ring does this by a 1px line, 1.3:1 on surface.raised, beside the light shadow that does most of the lift. So experts see where a menu ends on any page, because raised layers keep an edge (elevation.definition) and a decorative line has no contrast floor (accessibility.definition).)
- dense-data: icon.stroke-width (why: A 1.5px stroke width on Lucide's 24px grid keeps outline icons light, so they never outweigh the dense text beside them.)
- content-first: motion.duration.exit (why: We use 150ms (moderate) for a layer that closes in order to finish the exit move within the productive 150ms. The duration does this by removing the layer in fewer frames than an open takes, as nothing in it needs reading any more. So readers get the page back at once, because productive exits stay short (motion.roles) and there are two speeds (motion.count).)
- content-first: motion.easing.enter (why: We use the standard easing for a panel that appears in order to do the enter move. The curve does this by spending most of the change in the first frames, so the layer is in place before it slows. So readers can read a menu almost as soon as it opens, because easing is a standard ease-out (motion.definition) in a productive family (motion.roles).)
- content-first: motion.easing.exit (why: We use the strong-out easing (0.23, 1, 0.32, 1) for a layer that closes in place in order to do the exit move of the productive family. The curve does this by covering most of the way in the first third of its time, then easing to a stop. So a closed popover is gone before the next click, because productive exits take a strong ease-out (motion.roles) and easing never springs here (motion.definition).)
- content-first: motion.easing.exit-offscreen (why: We use the strong-out easing as well for a drawer or sheet that slides off the screen, in order to keep every exit of a productive family on one fast curve. The curve does this by moving fastest at the start, so the panel clears the view with no slow tail. So the content under a closing sheet comes back at once, because only an expressive family accelerates what leaves the screen (motion.roles), and easing is a plain ease-out (motion.definition).)
- content-first: motion.easing.emphasize (why: We use the standard easing for a moment that calls for attention in order to give the emphasize move no overshoot. The curve does this by stopping at its target without passing it. So a new message draws the eye by its change, not by a bounce, because the family is productive (motion.roles) and easing is a standard ease-out, never a spring (motion.definition).)
- … 23 more in scorecard.json

### `derived.new-literals-unreasoned`

Literals new in the candidate with no recorded reason

### `shift.moves`

Color tokens that moved, per scheme, brand and mode, every move listed by tier

- approval: 25
-   dense-data/dark color.surface.raised: #161B23 → #262D38, ΔE 0.075 (approval, surface limits)
-   dense-data/dark color.surface.sunken: #262D38 → #0D1117, ΔE 0.119 (approval, surface limits)
-   dense-data/dark color.surface.highlight: #262D38 → #0D1117, ΔE 0.119 (approval, surface limits)
-   dense-data/dark color.surface.pressed: #262D38 → #0D1117, ΔE 0.119 (approval, surface limits)
-   content-first/dark color.surface.raised: #1F1B16 → #2E2A24, ΔE 0.062 (approval, surface limits)
-   content-first/dark color.surface.sunken: #2E2A24 → #14110D, ΔE 0.107 (approval, surface limits)
-   content-first/dark color.surface.highlight: #2E2A24 → #14110D, ΔE 0.107 (approval, surface limits)
-   accessible-first/dark color.surface.default: #141414 → #222222, ΔE 0.061 (approval, surface limits)
-   accessible-first/dark color.surface.raised: #141414 → #333333, ΔE 0.130 (approval, surface limits)
-   accessible-first/dark color.surface.sunken: #222222 → #141414, ΔE 0.061 (approval, surface limits)
-   accessible-first/dark color.surface.highlight: #222222 → #141414, ΔE 0.061 (approval, surface limits)
- … 16 more in scorecard.json

### `shift.review-unreasoned`

Moves in the review tier (ΔE 0.02 to 0.05) with no new recorded reason

### `shift.approval-unapproved`

Moves over ΔE 0.05 (or a role's own limit) that the owner has not approved

- dense-data/dark color.surface.raised: #161B23 → #262D38, ΔE 0.075 (approval, surface limits)
- dense-data/dark color.surface.sunken: #262D38 → #0D1117, ΔE 0.119 (approval, surface limits)
- dense-data/dark color.surface.highlight: #262D38 → #0D1117, ΔE 0.119 (approval, surface limits)
- dense-data/dark color.surface.pressed: #262D38 → #0D1117, ΔE 0.119 (approval, surface limits)
- content-first/dark color.surface.raised: #1F1B16 → #2E2A24, ΔE 0.062 (approval, surface limits)
- content-first/dark color.surface.sunken: #2E2A24 → #14110D, ΔE 0.107 (approval, surface limits)
- content-first/dark color.surface.highlight: #2E2A24 → #14110D, ΔE 0.107 (approval, surface limits)
- accessible-first/dark color.surface.default: #141414 → #222222, ΔE 0.061 (approval, surface limits)
- accessible-first/dark color.surface.raised: #141414 → #333333, ΔE 0.130 (approval, surface limits)
- accessible-first/dark color.surface.sunken: #222222 → #141414, ΔE 0.061 (approval, surface limits)
- accessible-first/dark color.surface.highlight: #222222 → #141414, ΔE 0.061 (approval, surface limits)
- accessible-first/dark color.surface.pressed: #333333 → #0A0A0A, ΔE 0.176 (approval, surface limits)
- … 13 more in scorecard.json

### `shift.hue`

Chromatic tokens (C > 0.05) whose hue turned more than 5°

### `shift.key-colors`

Brand key colors that changed with no adjustment recorded

### `relations.wcag-level-drops`

Contrast pairs that drop a WCAG level (under 3, 3, 4.5, 7)

- dense-data/dark: color.border.focus on color.surface.raised 7.62:1 → 6.11:1
- accessible-first/dark: color.text.muted on color.surface.raised 8.89:1 → 6.09:1
- accessible-first/dark: color.border.strong on color.surface.raised 6.07:1 → 4.17:1
- accessible-first/dark: color.border.focus on color.surface.raised 8.74:1 → 6.00:1
- accessible-first/dark: color.status.danger on color.surface.default 7.76:1 → 6.70:1
- multi-brand/birch-dark: color.border.focus on color.surface.raised 7.80:1 → 6.39:1

### `relations.step-order`

Scale steps that swap their lightness order

### `relations.ladder-order`

Surface ladder rungs that swap their lightness order

- dense-data/dark: color.surface.sunken and color.surface.default swap lightness order
- dense-data/dark: color.surface.sunken and color.surface.raised swap lightness order
- content-first/dark: color.surface.sunken and color.surface.default swap lightness order
- content-first/dark: color.surface.sunken and color.surface.raised swap lightness order
- accessible-first/dark: color.surface.sunken and color.surface.default swap lightness order
- accessible-first/dark: color.surface.sunken and color.surface.raised swap lightness order
- brand-expressive/dark: color.surface.sunken and color.surface.default swap lightness order
- brand-expressive/dark: color.surface.sunken and color.surface.raised swap lightness order
- multi-brand/aster-dark: color.surface.sunken and color.surface.default swap lightness order
- multi-brand/aster-dark: color.surface.sunken and color.surface.raised swap lightness order
- multi-brand/birch-dark: color.surface.sunken and color.surface.default swap lightness order
- multi-brand/birch-dark: color.surface.sunken and color.surface.raised swap lightness order
- … 2 more in scorecard.json

### `relations.state-sign`

State steps (rest → hover → pressed) whose lightness change flips sign

### `relations.distinct-lost.normal`

Pairs distinct on base that are no longer distinct (ΔE 0.02), normal vision

- dense-data/dark: color.surface.canvas and color.surface.sunken were ΔE 0.119 apart, now 0.000
- dense-data/dark: color.surface.canvas and color.surface.highlight were ΔE 0.119 apart, now 0.000
- dense-data/dark: color.surface.canvas and color.surface.pressed were ΔE 0.119 apart, now 0.000
- content-first/dark: color.surface.canvas and color.surface.sunken were ΔE 0.107 apart, now 0.000
- content-first/dark: color.surface.canvas and color.surface.highlight were ΔE 0.107 apart, now 0.000
- accessible-first/dark: color.surface.canvas and color.surface.pressed were ΔE 0.176 apart, now 0.000
- brand-expressive/dark: color.surface.canvas and color.surface.sunken were ΔE 0.119 apart, now 0.000
- brand-expressive/dark: color.surface.canvas and color.surface.highlight were ΔE 0.119 apart, now 0.000
- multi-brand/aster-dark: color.surface.canvas and color.surface.sunken were ΔE 0.151 apart, now 0.000
- multi-brand/aster-dark: color.surface.canvas and color.surface.highlight were ΔE 0.151 apart, now 0.000
- multi-brand/birch-dark: color.surface.canvas and color.surface.sunken were ΔE 0.151 apart, now 0.000
- multi-brand/birch-dark: color.surface.canvas and color.surface.highlight were ΔE 0.151 apart, now 0.000
- … 2 more in scorecard.json

### `relations.distinct-lost.deuteranopia`

Pairs distinct on base that are no longer distinct (ΔE 0.02), deuteranopia simulated

- dense-data/dark: color.surface.canvas and color.surface.sunken were ΔE 0.119 apart, now 0.000
- dense-data/dark: color.surface.canvas and color.surface.highlight were ΔE 0.119 apart, now 0.000
- dense-data/dark: color.surface.canvas and color.surface.pressed were ΔE 0.119 apart, now 0.000
- content-first/dark: color.surface.canvas and color.surface.sunken were ΔE 0.107 apart, now 0.000
- content-first/dark: color.surface.canvas and color.surface.highlight were ΔE 0.107 apart, now 0.000
- accessible-first/dark: color.surface.canvas and color.surface.pressed were ΔE 0.176 apart, now 0.000
- brand-expressive/dark: color.surface.canvas and color.surface.sunken were ΔE 0.121 apart, now 0.000
- brand-expressive/dark: color.surface.canvas and color.surface.highlight were ΔE 0.121 apart, now 0.000
- multi-brand/aster-dark: color.surface.canvas and color.surface.sunken were ΔE 0.150 apart, now 0.000
- multi-brand/aster-dark: color.surface.canvas and color.surface.highlight were ΔE 0.150 apart, now 0.000
- multi-brand/birch-dark: color.surface.canvas and color.surface.sunken were ΔE 0.150 apart, now 0.000
- multi-brand/birch-dark: color.surface.canvas and color.surface.highlight were ΔE 0.150 apart, now 0.000
- … 2 more in scorecard.json

### `relations.distinct-lost.protanopia`

Pairs distinct on base that are no longer distinct (ΔE 0.02), protanopia simulated

- dense-data/dark: color.surface.canvas and color.surface.sunken were ΔE 0.120 apart, now 0.000
- dense-data/dark: color.surface.canvas and color.surface.highlight were ΔE 0.120 apart, now 0.000
- dense-data/dark: color.surface.canvas and color.surface.pressed were ΔE 0.120 apart, now 0.000
- content-first/dark: color.surface.canvas and color.surface.sunken were ΔE 0.108 apart, now 0.000
- content-first/dark: color.surface.canvas and color.surface.highlight were ΔE 0.108 apart, now 0.000
- accessible-first/dark: color.surface.canvas and color.surface.pressed were ΔE 0.176 apart, now 0.000
- brand-expressive/dark: color.surface.canvas and color.surface.sunken were ΔE 0.114 apart, now 0.000
- brand-expressive/dark: color.surface.canvas and color.surface.highlight were ΔE 0.114 apart, now 0.000
- multi-brand/aster-dark: color.surface.canvas and color.surface.sunken were ΔE 0.150 apart, now 0.000
- multi-brand/aster-dark: color.surface.canvas and color.surface.highlight were ΔE 0.150 apart, now 0.000
- multi-brand/birch-dark: color.surface.canvas and color.surface.sunken were ΔE 0.150 apart, now 0.000
- multi-brand/birch-dark: color.surface.canvas and color.surface.highlight were ΔE 0.150 apart, now 0.000
- … 2 more in scorecard.json

### `relations.distinct-lost.tritanopia`

Pairs distinct on base that are no longer distinct (ΔE 0.02), tritanopia simulated

- dense-data/dark: color.surface.canvas and color.surface.sunken were ΔE 0.119 apart, now 0.000
- dense-data/dark: color.surface.canvas and color.surface.highlight were ΔE 0.119 apart, now 0.000
- dense-data/dark: color.surface.canvas and color.surface.pressed were ΔE 0.119 apart, now 0.000
- dense-data/dark: color.surface.raised and color.surface.selected were ΔE 0.069 apart, now 0.012
- content-first/dark: color.surface.canvas and color.surface.sunken were ΔE 0.109 apart, now 0.000
- content-first/dark: color.surface.canvas and color.surface.highlight were ΔE 0.109 apart, now 0.000
- accessible-first/dark: color.surface.canvas and color.surface.pressed were ΔE 0.176 apart, now 0.000
- brand-expressive/dark: color.surface.canvas and color.surface.sunken were ΔE 0.121 apart, now 0.000
- brand-expressive/dark: color.surface.canvas and color.surface.highlight were ΔE 0.121 apart, now 0.000
- multi-brand/aster-dark: color.surface.canvas and color.surface.sunken were ΔE 0.146 apart, now 0.000
- multi-brand/aster-dark: color.surface.canvas and color.surface.highlight were ΔE 0.146 apart, now 0.000
- multi-brand/aster-dark: color.surface.raised and color.surface.selected were ΔE 0.066 apart, now 0.020
- … 4 more in scorecard.json

### `relations.shared-split`

Colors that were one color on base and are split now

- dense-data/dark: color.surface.raised no longer shares color.surface.default's color (#262D38 vs #161B23)
- dense-data/dark: color.action.secondary.hover no longer shares color.surface.sunken's color (#262D38 vs #0D1117)
- dense-data/dark: color.category.5.subtle no longer shares color.surface.sunken's color (#262D38 vs #0D1117)
- dense-data/dark: color.disabled.surface no longer shares color.surface.sunken's color (#262D38 vs #0D1117)
- content-first/dark: color.surface.raised no longer shares color.surface.default's color (#2E2A24 vs #1F1B16)
- content-first/dark: color.action.secondary.hover no longer shares color.surface.sunken's color (#2E2A24 vs #14110D)
- content-first/dark: color.category.5.subtle no longer shares color.surface.sunken's color (#2E2A24 vs #14110D)
- content-first/dark: color.disabled.surface no longer shares color.surface.sunken's color (#2E2A24 vs #14110D)
- accessible-first/dark: color.surface.raised no longer shares color.surface.default's color (#333333 vs #222222)
- accessible-first/dark: color.text.inverse no longer shares color.surface.default's color (#141414 vs #222222)
- accessible-first/dark: color.text.on-action no longer shares color.surface.default's color (#141414 vs #222222)
- accessible-first/dark: color.text.on-danger no longer shares color.surface.default's color (#141414 vs #222222)
- … 20 more in scorecard.json

### `component-pairs.level-drops`

Component pairs whose contrast drops a WCAG level

- dense-data/dark menubar data-[variant=destructive] text: --menubar-item-label-destructive on --menubar-content-background: 7.28:1 → 5.84:1, ΔE fg/bg 0.543 → 0.472
- content-first/dark menubar data-[variant=destructive] text: --menubar-item-label-destructive on --menubar-content-background: 7.21:1 → 6.00:1, ΔE fg/bg 0.535 → 0.475
- accessible-first/dark alert rest text: --alert-destructive-label on --alert-destructive-background: 7.76:1 → 6.70:1, ΔE fg/bg 0.570 → 0.511
- accessible-first/dark alert *:data-[slot=alert-description] text: --alert-destructive-description-label on --alert-destructive-background: 7.76:1 → 6.70:1, ΔE fg/bg 0.570 → 0.511
- accessible-first/dark menubar data-[variant=destructive] text: --menubar-item-label-destructive on --menubar-content-background: 7.76:1 → 5.32:1, ΔE fg/bg 0.570 → 0.444
- brand-expressive/dark menubar data-[variant=destructive] text: --menubar-item-label-destructive on --menubar-content-background: 7.58:1 → 6.26:1, ΔE fg/bg 0.553 → 0.481
- multi-brand/aster-dark menubar data-[variant=destructive] text: --menubar-item-label-destructive on --menubar-content-background: 7.52:1 → 6.16:1, ΔE fg/bg 0.559 → 0.490
- multi-brand/birch-dark menubar data-[variant=destructive] text: --menubar-item-label-destructive on --menubar-content-background: 7.52:1 → 6.16:1, ΔE fg/bg 0.559 → 0.490
- multi-brand/coral-dark menubar data-[variant=destructive] text: --menubar-item-label-destructive on --menubar-content-background: 7.52:1 → 6.16:1, ΔE fg/bg 0.559 → 0.490

### `component-pairs.difference-shrunk`

Component pairs whose foreground-to-background ΔE fell below 0.1

- dense-data/dark chart [&_.recharts-radial-bar-background-sector] icon: --chart-track-fill on the page: 1.37:1 → 1.00:1, ΔE fg/bg 0.119 → 0.000
- dense-data/dark chart [&_.recharts-rectangle.recharts-tooltip-cursor] icon: --chart-cursor-fill on the page: 1.37:1 → 1.00:1, ΔE fg/bg 0.119 → 0.000
- content-first/dark chart [&_.recharts-radial-bar-background-sector] icon: --chart-track-fill on the page: 1.32:1 → 1.00:1, ΔE fg/bg 0.107 → 0.000
- content-first/dark chart [&_.recharts-rectangle.recharts-tooltip-cursor] icon: --chart-cursor-fill on the page: 1.32:1 → 1.00:1, ΔE fg/bg 0.107 → 0.000
- accessible-first/dark chart [&_.recharts-radial-bar-background-sector] icon: --chart-track-fill on the page: 1.24:1 → 1.07:1, ΔE fg/bg 0.107 → 0.046
- accessible-first/dark chart [&_.recharts-rectangle.recharts-tooltip-cursor] icon: --chart-cursor-fill on the page: 1.24:1 → 1.07:1, ΔE fg/bg 0.107 → 0.046
- brand-expressive/dark chart [&_.recharts-radial-bar-background-sector] icon: --chart-track-fill on the page: 1.31:1 → 1.00:1, ΔE fg/bg 0.119 → 0.000
- brand-expressive/dark chart [&_.recharts-rectangle.recharts-tooltip-cursor] icon: --chart-cursor-fill on the page: 1.31:1 → 1.00:1, ΔE fg/bg 0.119 → 0.000
- multi-brand/aster-dark chart [&_.recharts-radial-bar-background-sector] icon: --chart-track-fill on the page: 1.38:1 → 1.00:1, ΔE fg/bg 0.151 → 0.000
- multi-brand/birch-dark chart [&_.recharts-radial-bar-background-sector] icon: --chart-track-fill on the page: 1.38:1 → 1.00:1, ΔE fg/bg 0.151 → 0.000
- multi-brand/coral-dark chart [&_.recharts-radial-bar-background-sector] icon: --chart-track-fill on the page: 1.38:1 → 1.00:1, ΔE fg/bg 0.151 → 0.000
- multi-brand/aster-dark chart [&_.recharts-rectangle.recharts-tooltip-cursor] icon: --chart-cursor-fill on the page: 1.38:1 → 1.00:1, ΔE fg/bg 0.151 → 0.000
- … 2 more in scorecard.json

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
- bubble
- button
- button-group
- card
- chart
- combobox
- … 25 more in scorecard.json

