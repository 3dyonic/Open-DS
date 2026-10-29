Status: provisional

# Agent rules

The recipe fingerprint is 7345e78d17f0821b3791c71b6d6b366efba7630921dbb69d43f21a00d18f894a.

Do use the theme tokens for color, type, radius, and motion.
Do not put raw colors, font sizes, or radii in component files.
Do not change locked fields after init.

## Chain from Purpose

- Purpose: Several brands on one set of components.
- Multi-brand needs separate theme tiers. Add Separate to finish your recipe.
- The recipe picks three token tiers so a brand change needs no component edits.

<!-- decisions:start -->
## Decision rules

- decision: accessibility-target
  Do follow option `wcag-22-aa`.
  Do not drop the reason: AA is the commitment for this public site. AAA is a later choice.

- decision: base-font-size
  Do follow option `size-16`.
  Do not drop the reason: Body text should start at the common 16 pixel browser default.

- decision: brand-variance
  Do follow option `multi-brand`.
  Do not drop the reason: Several brands share one set of components.

- decision: chroma-hue-shift
  Do follow option `hue-warm`.
  Do not drop the reason: The provisional brand is warm, so darker steps may shift warmer.

- decision: color-space
  Do follow option `oklch`.
  Do not drop the reason: The ramp scheme is described in OKLCH so lightness can stay even.

- decision: contrast-check
  Do follow option `checked-afterwards`.
  Do not drop the reason: Contrast is a review step. This dictionary does not measure it.

- decision: contrast-metric
  Do follow option `wcag22`.
  Do not drop the reason: The accessibility target names WCAG 2.2, so the metric should match it.

- decision: css-unit
  Do follow option `rem`.
  Do not drop the reason: Type and space should follow the reader's font size.

- decision: default-theme
  Do follow option `light`.
  Do not drop the reason: The page opens on the light set. Dark is a modifier.

- decision: density
  Do follow option `comfortable`.
  Do not drop the reason: Reading pages need room. Compact density is for tools.

- decision: font-family
  Do follow option `system-sans`.
  Do not drop the reason: A system sans font is enough until a custom font is chosen.

- decision: lightness-curve
  Do follow option `perceptual`.
  Do not drop the reason: Most interface color sits in the middle of the ramp.

- decision: line-height
  Do follow option `normal`.
  Do not drop the reason: Body copy needs a 1.5 line height so lines do not collide.

- decision: locked-at-init
  Do follow option `lock-core`.
  Do not drop the reason: Tiers, the on-color pair, and CSS variable names stay fixed after init.

- decision: on-color-pairing
  Do follow option `surface-pair`.
  Do not drop the reason: Each brand keeps its own surface and on-surface pair.

- decision: platforms
  Do follow option `web`.
  Do not drop the reason: The first surface is the website.

- decision: product-type
  Do follow option `content`.
  Do not drop the reason: People come to read pages, not to operate a dense tool.

- decision: radius-base
  Do follow option `radius-8`.
  Do not drop the reason: Controls should feel soft but still look like controls.

- decision: radius-progression
  Do follow option `geometric`.
  Do not drop the reason: Cards can be rounder than inputs without a long list of steps.

- decision: scale-direction
  Do follow option `low-is-light`.
  Do not drop the reason: The step names should run from 50 light toward 1000 dark.

- decision: seed-input
  Do follow option `hex`.
  Do not drop the reason: One provisional hex is enough to name the terracotta seed.

- decision: shareable-item
  Do follow option `full-boilerplate`.
  Do not drop the reason: A team should get tokens, CSS, and components together.

- decision: spacing-base
  Do follow option `base-4`.
  Do not drop the reason: A 4 pixel base is fine enough for a reading layout.

- decision: spacing-scale
  Do follow option `linear`.
  Do not drop the reason: Even space steps are easier to remember in a small system.

- decision: step-count
  Do follow option `eleven`.
  Do not drop the reason: Eleven names match the 50 to 950 set people already expect.

- decision: step-distance
  Do follow option `lightness-delta`.
  Do not drop the reason: Equal lightness steps are easier to explain than deltaE2000.

- decision: structure-theme-separation
  Do follow option `separate`.
  Do not drop the reason: Two brands can share components only when theme values stay outside the components.

- decision: team
  Do follow option `large-team`.
  Do not drop the reason: A large team keeps core names locked after setup.

- decision: theme-shape
  Do follow option `sets-and-modifiers`.
  Do not drop the reason: Brands are modifiers on one theme.

- decision: token-tiers
  Do follow option `three-tier`.
  Do not drop the reason: Three tiers keep brand values outside the components.

- decision: type-scale-ratio
  Do follow option `major-third`.
  Do not drop the reason: A 1.25 ratio keeps headings clear without a huge jump.

- decision: users-and-context
  Do follow option `public`.
  Do not drop the reason: Most people arrive without an account and without training.

- decision: voice
  Do follow option `warm`.
  Do not drop the reason: The words should sound human and direct, not cute.

<!-- decisions:end -->
