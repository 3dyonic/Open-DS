# What this design system serves

A public content site with one warm brand. The values are provisional.

This boilerplate is an authored starter. Open DS did not calculate the token values. The neutral token file uses the DTCG format.

<!-- decisions:start -->
## Decisions

### accessibility-target

- decision: accessibility-target
- Option: `wcag-22-aa`
- Reason: AA is the commitment for this public site. AAA is a later choice.
- Source: W3C WAI, WCAG 2.2 contrast minimum
- Cost: Some large text can still be hard to read.

### base-font-size

- decision: base-font-size
- Option: `size-16`
- Reason: Body text should start at the common 16 pixel browser default.
- Source: GOV.UK, Typography
- Cost: Dense tools often want smaller text.

### brand-variance

- decision: brand-variance
- Option: `single-brand`
- Reason: This starter is one brand. A second brand is out of this recipe.
- Source: Material, Color tokens
- Cost: A later brand means a new theme pass.

### chroma-hue-shift

- decision: chroma-hue-shift
- Option: `hue-warm`
- Reason: The provisional brand is warm, so darker steps may shift warmer.
- Source: Radix, Palette composition
- Cost: A cool brand will look muddy.

### color-space

- decision: color-space
- Option: `oklch`
- Reason: The ramp scheme is described in OKLCH so lightness can stay even.
- Source: CSS Color, CSS Color Module Level 4
- Cost: Older tools may not show OKLCH.

### contrast-check

- decision: contrast-check
- Option: `checked-afterwards`
- Reason: Contrast is a review step. This dictionary does not measure it.
- Source: W3C WAI, WCAG 2.2 contrast minimum
- Cost: A pretty scale can fail the review.

### contrast-metric

- decision: contrast-metric
- Option: `wcag22`
- Reason: The accessibility target names WCAG 2.2, so the metric should match it.
- Source: W3C WAI, WCAG 2.2 contrast minimum
- Cost: The number is not a full reading test.

### css-unit

- decision: css-unit
- Option: `rem`
- Reason: Type and space should follow the reader's font size.
- Source: CSS Values, rem units
- Cost: A pixel-perfect mock is harder.

### density

- decision: density
- Option: `comfortable`
- Reason: Reading pages need room. Compact density is for tools.
- Source: GOV.UK, Typography
- Cost: Tables show fewer rows.

### font-family

- decision: font-family
- Option: `system-sans`
- Reason: A system sans font is enough until a custom font is chosen.
- Source: GOV.UK, Typography
- Cost: The look changes by platform.

### lightness-curve

- decision: lightness-curve
- Option: `perceptual`
- Reason: Most interface color sits in the middle of the ramp.
- Source: Radix, Palette composition
- Cost: The ends move faster.

### line-height

- decision: line-height
- Option: `normal`
- Reason: Body copy needs a 1.5 line height so lines do not collide.
- Source: GOV.UK, Typography
- Cost: Tight UI labels can look tall.

### locked-at-init

- decision: locked-at-init
- Option: `lock-core`
- Reason: Tiers, the on-color pair, and CSS variable names stay fixed after init.
- Source: shadcn/ui, components.json
- Cost: A later rename is a breaking change.

### on-color-pairing

- decision: on-color-pairing
- Option: `surface-pair`
- Reason: Text and its surface should use one pair: surface and on-surface.
- Source: Material, Color roles
- Cost: You do not get a second naming scheme.

### platforms

- decision: platforms
- Option: `web`
- Reason: The first surface is the website.
- Source: CSS Values, rem units
- Cost: Native apps will need a later pass.

### product-type

- decision: product-type
- Option: `content`
- Reason: People come to read pages, not to operate a dense tool.
- Source: GOV.UK, Typography
- Cost: Dense screens can feel sparse.

### radius-base

- decision: radius-base
- Option: `radius-8`
- Reason: Controls should feel soft but still look like controls.
- Source: Tailwind, Customizing colors
- Cost: A sharp brand will look too round.

### radius-progression

- decision: radius-progression
- Option: `geometric`
- Reason: Cards can be rounder than inputs without a long list of steps.
- Source: Tailwind, Customizing colors
- Cost: The steps are harder to remember.

### scale-direction

- decision: scale-direction
- Option: `low-is-light`
- Reason: The step names should run from 50 light toward 1000 dark.
- Source: Tailwind, Customizing colors
- Cost: You give up a 100 to 0 lightness name.

### seed-input

- decision: seed-input
- Option: `hex`
- Reason: One provisional hex is enough to name the terracotta seed.
- Source: CSS Color, CSS Color Module Level 4
- Cost: Hex hides the lightness and chroma.

### shareable-item

- decision: shareable-item
- Option: `full-boilerplate`
- Reason: A team should get tokens, CSS, and components together.
- Source: shadcn/ui, Registry item
- Cost: The package is heavier than tokens alone.

### spacing-base

- decision: spacing-base
- Option: `base-4`
- Reason: A 4 pixel base is fine enough for a reading layout.
- Source: Material, Spacing
- Cost: The scale has more steps to name.

### spacing-scale

- decision: spacing-scale
- Option: `linear`
- Reason: Even space steps are easier to remember in a small system.
- Source: Material, Spacing
- Cost: Large gaps grow slowly.

### step-count

- decision: step-count
- Option: `eleven`
- Reason: Eleven names match the 50 to 950 set people already expect.
- Source: Tailwind, Customizing colors
- Cost: You have more tokens to name.

### step-distance

- decision: step-distance
- Option: `lightness-delta`
- Reason: Equal lightness steps are easier to explain than deltaE2000.
- Source: Leonardo, Color theory
- Cost: Perceived gaps can still vary.

### structure-theme-separation

- decision: structure-theme-separation
- Option: `separate`
- Reason: A theme change must not require edits inside the components.
- Source: DTCG, Design Tokens format
- Cost: You keep two layers in the repo.

### team

- decision: team
- Option: `solo-starting`
- Reason: One person maintains this starter, so the list stays short.
- Source: GOV.UK, Style guide
- Cost: Later teams may need more written rules.

### theme-shape

- decision: theme-shape
- Option: `sets-and-modifiers`
- Reason: Light and dark are modifiers on one theme, not two products.
- Source: Material, Color tokens
- Cost: You maintain more than one set.

### type-scale-ratio

- decision: type-scale-ratio
- Option: `major-third`
- Reason: A 1.25 ratio keeps headings clear without a huge jump.
- Source: GOV.UK, Typography
- Cost: Small screens may need fewer steps.

### users-and-context

- decision: users-and-context
- Option: `public`
- Reason: Most people arrive without an account and without training.
- Source: GOV.UK, Style guide
- Cost: You explain more on every page.

### voice

- decision: voice
- Option: `warm`
- Reason: The words should sound human and direct, not cute.
- Source: Nielsen Norman Group, Tone of voice
- Cost: Serious errors can sound too soft.

<!-- decisions:end -->

## Files

- `theme/` holds color, type, radius, and motion.
- `structure/` holds component anatomy, states, and inner spacing.
- Swap `theme/` without editing `structure/`.
- `manifest.json` lists each piece, its files, its deps, and the light and dark CSS variables.

## Locked after init

Token tiers, the surface / on-surface pair, and the CSS variable names stay fixed.
