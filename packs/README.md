# Decision packs

These files are the dictionary. A question is one decision. An option is one cited answer.
Open DS does not calculate colors or tokens from these files.

Copy limits: why is at most 35 words. when_to_choose starts with "Choose this if" or "Choose this when" and is at most 25 words. trade_offs has 1 to 3 costs, at most 15 words each. A purpose effect reason is 1 to 280 characters. Set `evidence_limited` to true when no source backs the claim. The site shows that as the neutral tag Evidence is limited.

Option ids:

## purpose

- `product-type`: `dense-data`, `content`, `commerce`, `calm`, `consumer`
- `users-and-context`: `public`, `operators`, `mixed`
- `accessibility-target`: `wcag-22-aa`, `wcag-22-aaa`
- `platforms`: `web`, `native`, `web-and-native`
- `team`: `solo-starting`, `small-team`, `large-team`
- `brand-variance`: `single-brand`, `multi-brand`
- `density`: `compact`, `comfortable`, `spacious`
- `voice`: `plain`, `warm`, `precise`

## global

- `contrast-metric`: `wcag22`, `apca`
- `scale-direction`: `low-is-light`, `high-is-light`
- `css-unit`: `rem`, `px`
- `structure-theme-separation`: `separate`, `combined`

## color-primitives

- `color-space`: `oklch`, `hsl`, `lab`, `srgb`
- `step-distance`: `deltae2000`, `lightness-delta`, `contrast-step`
- `scale-direction` references `global:scale-direction` override `low-is-light`
- `step-count`: `nine`, `ten`, `eleven`, `twelve`, `custom`
- `lightness-curve`: `linear`, `ease`, `perceptual`
- `chroma-hue-shift`: `none`, `chroma-taper`, `hue-warm`, `hue-cool`
- `seed-input`: `hex`, `oklch-parts`
- `on-color-pairing`: `surface-pair`, `unrelated-names`

## accessibility

- `contrast-check`: `guaranteed-by-scale`, `checked-afterwards`

## typography

- `font-family`: `system-sans`, `system-serif`, `system-mono`
- `type-scale-ratio`: `major-second`, `minor-third`, `major-third`, `perfect-fourth`
- `base-font-size`: `size-14`, `size-16`, `size-18`
- `line-height`: `tight`, `normal`, `loose`
- `css-unit` references `global:css-unit`

## spacing

- `spacing-base`: `base-4`, `base-8`
- `spacing-scale`: `linear`, `geometric`
- `css-unit` references `global:css-unit`

## radius

- `radius-base`: `sharp`, `radius-4`, `radius-8`, `radius-12`, `pill`
- `radius-progression`: `none`, `linear`, `geometric`
- `css-unit` references `global:css-unit`

## theming

- `theme-shape`: `sets-and-modifiers`, `single-set`

## delivery

- `shareable-item`: `full-boilerplate`, `tokens-only`
- `locked-at-init`: `lock-core`, `lock-nothing`

