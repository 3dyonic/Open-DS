# Scheme quality scorecard

Base: `origin/master` (48ded0add0). Candidate: `origin/feat/trace-engine` (acba8949e9).

**Fail.** 1 gated criteria moved the wrong way: blast-radius.answer-orphans.

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
| `derived.share` | 0.6176 | 0.6205 | +0.0029 | ↑ higher is better | pass |
| `derived.literal-values` | 702 | 702 | 0 | ↓ lower is better | pass |
| `derived.component-literals` | 8 | 8 | 0 | ↓ lower is better | pass |
| `invariants.failures` | 18 | 18 | 0 | ↓ lower is better | pass |
| `invariants.spacing-map` | 0 | 0 | 0 | ↓ lower is better | pass |
| `invariants.color-scale` | 0 | 0 | 0 | ↓ lower is better | pass |
| `invariants.focus-ring` | 0 | 0 | 0 | ↓ lower is better | pass |
| `invariants.compact-step` | 0 | 0 | 0 | ↓ lower is better | pass |
| `invariants.nested-radius` | 4 | 4 | 0 | ↓ lower is better | pass |
| `invariants.dark-ladder` | 14 | 14 | 0 | ↓ lower is better | pass |
| `blast-radius.answer-orphans` | 814 | 1661 | +847 | ↓ lower is better | **fail** |
| `blast-radius.answer-orphan-share` | 1 | 1 | 0 | shown, not gated | — |
| `blast-radius.anchor-orphans` | 76 | 75 | -1 | ↓ lower is better | pass |
| `blast-radius.hidden-couplings` | 0 | 0 | 0 | ↓ lower is better | pass |
| `accessibility.wcag-failures` | 0 | 0 | 0 | ↓ lower is better | pass |
| `accessibility.wcag-waiting` | 0 | 0 | 0 | shown, not gated | — |
| `accessibility.apca-warnings` | 108 | 108 | 0 | ↓ lower is better | pass |
| `accessibility.hit-area` | 0 | 0 | 0 | ↓ lower is better | pass |
| `accessibility.text-not-rem` | 0 | 0 | 0 | ↓ lower is better | pass |
| `motion.reduced-motion-transforms` | 0 | 0 | 0 | ↓ lower is better | pass |
| `motion.duration-caps` | 5 | 5 | 0 | ↓ lower is better | pass |
| `repetition.repeated-sentences` | 719 | 696 | -23 | ↓ lower is better | pass |
| `size.tokens` | 9046 | 9091 | +45 | shown, not gated | — |
| `size.css-bytes` | 2954890 | 2967388 | +12498 | shown, not gated | — |
| `size.unused-semantics` | 52 | 52 | 0 | ↓ lower is better | pass |
| `relations.contrast-margin` | 0 | 0 | 0 | ↓ lower is better | pass |
| `relations.state-gap` | 0 | 0 | 0 | ↓ lower is better | pass |
| `curves.min-gap` | 25 | 25 | 0 | ↓ lower is better | pass |
| `curves.grades` | 119 | 119 | 0 | shown, not gated | — |
| `derived.new-literals` | 0 | 5 | +5 | shown, not gated | — |
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

Per scheme (base → candidate): dense-data 0.8244 → 1; content-first 0.8015 → 1; accessible-first 0.8015 → 1; brand-expressive 0.7955 → 1; multi-brand 0.7939 → 1.

- 661 of 661 values traced

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

Per scheme (base → candidate): dense-data 0.6183 → 0.6212; content-first 0.6107 → 0.6136; accessible-first 0.6183 → 0.6212; brand-expressive 0.5985 → 0.6015; multi-brand 0.6260 → 0.6288.

- relation: 98
- alias: 0
- scale: 1050
- literal: 702

### `derived.literal-values`

Semantic values (per brand and mode) that end on a raw literal

Per scheme (base → candidate): dense-data 100 → 100; content-first 102 → 102; accessible-first 100 → 100; brand-expressive 106 → 106; multi-brand 294 → 294.

- dense-data: type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.easing.standard, color.neutral.0, color.neutral.50, color.neutral.100, color.neutral.200, color.neutral.300, color.neutral.400, color.neutral.500, color.neutral.600, color.neutral.700, color.neutral.800, color.neutral.900, color.neutral.950, color.surface.canvas, color.surface.default, color.surface.raised, color.surface.sunken, color.surface.highlight, color.surface.pressed, color.surface.inverse, color.surface.scrim, color.text.primary, color.text.secondary, color.text.muted, color.text.inverse, color.text.on-action, color.text.on-danger, color.text.on-light, color.text.on-dark, color.border.default, color.border.strong, color.action.secondary, color.action.secondary.hover, color.category.5, color.category.5.subtle, color.disabled.text, color.disabled.surface, color.disabled.border, elevation.card, elevation.overlay, icon.stroke-width
- content-first: radius.badge, type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.easing.standard, color.neutral.0, color.neutral.50, color.neutral.100, color.neutral.200, color.neutral.300, color.neutral.400, color.neutral.500, color.neutral.600, color.neutral.700, color.neutral.800, color.neutral.900, color.neutral.950, color.surface.canvas, color.surface.default, color.surface.raised, color.surface.sunken, color.surface.highlight, color.surface.pressed, color.surface.inverse, color.surface.scrim, color.text.primary, color.text.secondary, color.text.muted, color.text.inverse, color.text.on-action, color.text.on-danger, color.text.on-light, color.text.on-dark, color.border.default, color.border.strong, color.action.secondary, color.action.secondary.hover, color.category.5, color.category.5.subtle, color.disabled.text, color.disabled.surface, color.disabled.border, elevation.card, elevation.overlay, icon.stroke-width
- accessible-first: type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.easing.standard, color.neutral.0, color.neutral.50, color.neutral.100, color.neutral.200, color.neutral.300, color.neutral.400, color.neutral.500, color.neutral.600, color.neutral.700, color.neutral.800, color.neutral.900, color.neutral.950, color.surface.canvas, color.surface.default, color.surface.raised, color.surface.sunken, color.surface.highlight, color.surface.pressed, color.surface.inverse, color.surface.scrim, color.text.primary, color.text.secondary, color.text.muted, color.text.inverse, color.text.on-action, color.text.on-danger, color.text.on-light, color.text.on-dark, color.border.default, color.border.strong, color.action.secondary, color.action.secondary.hover, color.category.5, color.category.5.subtle, color.disabled.text, color.disabled.surface, color.disabled.border, elevation.card, elevation.overlay, icon.stroke-width
- brand-expressive: radius.control, radius.badge, type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.duration.hero, motion.easing.standard, color.neutral.0, color.neutral.50, color.neutral.100, color.neutral.200, color.neutral.300, color.neutral.400, color.neutral.500, color.neutral.600, color.neutral.700, color.neutral.800, color.neutral.900, color.neutral.950, color.surface.canvas, color.surface.default, color.surface.raised, color.surface.sunken, color.surface.highlight, color.surface.pressed, color.surface.inverse, color.surface.scrim, color.text.primary, color.text.secondary, color.text.muted, color.text.inverse, color.text.on-action, color.text.on-danger, color.text.on-light, color.text.on-dark, color.border.default, color.border.strong, color.action.secondary, color.action.secondary.hover, color.category.5, color.category.5.subtle, color.disabled.text, color.disabled.surface, color.disabled.border, elevation.card, elevation.overlay, icon.stroke-width
- multi-brand: type.display.font-family, type.title.font-family, type.heading.font-family, type.body.font-family, type.label.font-family, type.caption.font-family, type.data.font-family, motion.duration.feedback, motion.duration.panels, motion.easing.standard, color.neutral.0, color.neutral.50, color.neutral.100, color.neutral.200, color.neutral.300, color.neutral.400, color.neutral.500, color.neutral.600, color.neutral.700, color.neutral.800, color.neutral.900, color.neutral.950, color.surface.canvas, color.surface.default, color.surface.raised, color.surface.sunken, color.surface.highlight, color.surface.pressed, color.surface.inverse, color.surface.scrim, color.text.primary, color.text.secondary, color.text.muted, color.text.inverse, color.text.on-action, color.text.on-danger, color.text.on-light, color.text.on-dark, color.border.default, color.border.strong, color.action.secondary, color.action.secondary.hover, color.disabled.text, color.disabled.surface, color.disabled.border, elevation.card, elevation.overlay, icon.stroke-width, radius.badge, radius.control

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
-   default: sunken < default: lightness 0.277 vs 0.205
-   default: default < raised: lightness 0.205 vs 0.205
- … 7 more in scorecard.json

### `blast-radius.answer-orphans`

Tokens the trace ties to an answer that do not move when the answer changes

Per scheme (base → candidate): dense-data 164 → 326; content-first 157 → 325; accessible-first 168 → 330; brand-expressive 162 → 343; multi-brand 163 → 337.

- dense-data people.q1 (experts → occasional): 1 — motion.duration.panels
- dense-data people.q2 (aa → aa-plus): 2 — border-width.focus, border-width.focus-offset
- dense-data content.q1 (numbers → long-text): 8 — type.caption.font-family, type.caption.font-size, type.caption.font-weight, type.caption.line-height, type.data.font-family, type.data.font-size, type.data.font-weight, type.data.line-height
- dense-data content.q2 (a-lot → moderate): 28 — border-width.default, radius.element, radius.surface, size.control.compact, size.control.default, size.control.large, size.row, space.gap.default, …
- dense-data tasks.q1 (compare → read): 15 — color.surface.selected, radius.badge, space.inset.cell-x, type.data.font-family, type.data.font-size, type.data.font-weight, type.data.line-height, type.display.font-family, …
- dense-data tasks.q2 (constantly → sometimes): 4 — icon.stroke-width, radius.option, size.icon, space.inset.control-x
- dense-data human.q1 (place → attention): 2 — space.gap.group, type.data.line-height
- dense-data human.q2 (learned → fresh): 7 — color.text.link, opacity.disabled, space.gap.tight, type.title.font-family, type.title.font-size, type.title.font-weight, type.title.line-height
- dense-data outcomes.q1 (time-on-task → reading-comfort): 6 — motion.duration.panels, motion.easing.standard, type.body.font-family, type.body.font-size, type.body.font-weight, type.body.line-height
- dense-data outcomes.q2 (wrong-record → lost-place): 3 — border-width.focus-offset, color.status.danger, space.gap.default
- dense-data brand.q1 (precise → warm): 3 — radius.element, radius.option, radius.surface
- dense-data brand.q2 (quiet → present): 13 — border-width.default, icon.stroke-width, motion.easing.standard, size.icon, type.body.font-weight, type.caption.font-family, type.caption.font-size, type.caption.font-weight, …
- … 204 more in scorecard.json

### `blast-radius.answer-orphan-share`

Share of the answer links the trace claims that a changed answer does not move

- 1661 of 1661 answer links do not move

### `blast-radius.anchor-orphans`

Tokens an anchor's chain or relations tie to it that do not move when it changes

Per scheme (base → candidate): dense-data 15 → 15; content-first 15 → 15; accessible-first 15 → 15; brand-expressive 16 → 15; multi-brand 15 → 15.

- dense-data base-step (space.4: 0.25rem → 0.3125rem): 6 — component-spacing-map.x12, component-spacing-map.x2, component-spacing-map.x3, component-spacing-map.x4, component-spacing-map.x6, component-spacing-map.x8
- dense-data key-color (violet light key #4B3FD9 → #8F15AF, violet dark key #A9A3F6 → #D694D6): 8 — color.action.primary, color.action.primary.hover, color.border.focus, color.border.selected, color.category.1, color.category.1.subtle, color.surface.selected, color.text.link
- dense-data control-height (size.32 → size.24): 1 — size.control.compact
- content-first base-step (space.4: 0.25rem → 0.3125rem): 6 — component-spacing-map.x12, component-spacing-map.x2, component-spacing-map.x3, component-spacing-map.x4, component-spacing-map.x6, component-spacing-map.x8
- content-first key-color (navy light key #1E3A5F → #3D315B, navy dark key #8FA6C4 → #A69EC1): 8 — color.action.primary, color.action.primary.hover, color.border.focus, color.border.selected, color.category.1, color.category.1.subtle, color.surface.selected, color.text.link
- content-first control-height (size.48 → size.40): 1 — size.control.compact
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
- dense-data/dark: color.status.info on color.surface.default Lc -59.6, floor 60
- dense-data/dark: color.status.danger on color.surface.canvas Lc -55.0, floor 60
- … 96 more in scorecard.json

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

Per scheme (base → candidate): dense-data 75 → 72; content-first 73 → 69; accessible-first 76 → 73; brand-expressive 73 → 67; multi-brand 422 → 415.

- dense-data: ×25 "one product one brand ramp on cool neutrals" (answer color.definition; pick default/light color.neutral.0; pick default/light color.neutral.50; …)
- dense-data: ×24 "the scheme's neutral is slate" (pick default/light color.neutral.0; pick default/light color.neutral.50; pick default/light color.neutral.100; …)
- dense-data: ×3 "experts do not need more" (answer accessibility.roles; pick default/light color.surface.pressed; pick default/dark color.surface.pressed)
- dense-data: ×3 "only menus and dialogs float" (answer elevation.roles; pick default/light elevation.card; pick default/dark elevation.card)
- dense-data: ×3 "subtle shadows keep the grid crisp" (answer elevation.values; pick default/light elevation.overlay; pick default/dark elevation.overlay)
- dense-data: ×2 "a quiet tint behind danger" (pick default/light color.status.danger.subtle; pick default/dark color.status.danger.subtle)
- dense-data: ×2 "a quiet tint behind info" (pick default/light color.status.info.subtle; pick default/dark color.status.info.subtle)
- dense-data: ×2 "a quiet tint behind success" (pick default/light color.status.success.subtle; pick default/dark color.status.success.subtle)
- dense-data: ×2 "a quiet tint behind warning" (pick default/light color.status.warning.subtle; pick default/dark color.status.warning.subtle)
- dense-data: ×2 "a see-through layer that dims the page behind a modal so the dialog is the one thing to act on" (pick default/light color.surface.scrim; pick default/dark color.surface.scrim)
- content-first: ×25 "warm paper neutrals and one ink ramp" (answer color.definition; pick default/light color.neutral.0; pick default/light color.neutral.50; …)
- content-first: ×24 "the scheme's neutral is stone" (pick default/light color.neutral.0; pick default/light color.neutral.50; pick default/light color.neutral.100; …)
- … 38 more in scorecard.json

### `size.tokens`

Semantic and component tokens

Per scheme (base → candidate): dense-data 1809 → 1818; content-first 1809 → 1818; accessible-first 1809 → 1818; brand-expressive 1810 → 1819; multi-brand 1809 → 1818.

- dense-data: 132 semantic, 1686 component
- content-first: 132 semantic, 1686 component
- accessible-first: 132 semantic, 1686 component
- brand-expressive: 133 semantic, 1686 component
- multi-brand: 132 semantic, 1686 component

### `size.css-bytes`

Bytes of each scheme's generated tokens.css

Per scheme (base → candidate): dense-data 422088 → 423854; content-first 422049 → 423839; accessible-first 422302 → 424064; brand-expressive 422232 → 424036; multi-brand 1266219 → 1271595.

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

- dense-data: icon.stroke-width (why: A 1.5px stroke width on Lucide's 24px grid keeps outline icons light, so they never outweigh the dense text beside them.)
- content-first: icon.stroke-width (why: A 1.5px stroke width is the outline style the icon answer names; a thin line keeps icons quiet beside the text.)
- accessible-first: icon.stroke-width (why: Every icon draws with a bold 2px stroke width on Lucide's 24px grid, so its lines stay visible with low vision and on small screens.)
- brand-expressive: icon.stroke-width (why: Icons use a 1.75 stroke width on Lucide's 24px grid, a firm line that carries the brand's bold warmth.)
- multi-brand: icon.stroke-width (why: A stroke width of 1.5px draws the one outline set every brand shares; brands change the icon color, never its weight.)

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

- 4256 pairs compared

### `component-pairs.flagged-components`

Components with a flagged pair (see component-pairs.md)

