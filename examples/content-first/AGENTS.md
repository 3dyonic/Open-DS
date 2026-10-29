Status: provisional

# Agent rules

The recipe fingerprint is 959b2a933ce60398053742e27cfc75431340f989c7ac0d5137161d24f27cd064.

Do use the theme tokens for color, type, radius, and motion.
Do not put raw colors, font sizes, or radii in component files.
Do not change locked fields after init.

## Chain from Purpose

- Purpose: People come to read.
- People come to read, so compact density works against the page.
- Body copy needs a 1.5 line height.
- The recipe picks a large type scale and spacing base 8. No pack rule links those two.

<!-- decisions:start -->
## Decision rules

- decision: accessibility-target
  Do follow option `wcag-22-aa`.
  Do not drop the reason: AA is the commitment for this public site. AAA is a later choice.

- decision: base-font-size
  Do follow option `size-18`.
  Do not drop the reason: A larger body gives reading more presence.

- decision: brand-variance
  Do follow option `single-brand`.
  Do not drop the reason: This starter is one brand. A second brand is out of this recipe.

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
  Do not drop the reason: Reading pages need room around the text.

- decision: font-family
  Do follow option `system-sans`.
  Do not drop the reason: A system sans font is enough until a custom font is chosen.

- decision: lightness-curve
  Do follow option `perceptual`.
  Do not drop the reason: Most interface color sits in the middle of the ramp.

- decision: line-height
  Do follow option `normal`.
  Do not drop the reason: Body copy needs a 1.5 line height.

- decision: locked-at-init
  Do follow option `lock-core`.
  Do not drop the reason: Tiers, the on-color pair, and CSS variable names stay fixed after init.

- decision: on-color-pairing
  Do follow option `surface-pair`.
  Do not drop the reason: Text and its surface should use one pair: surface and on-surface.

- decision: platforms
  Do follow option `web`.
  Do not drop the reason: The first surface is the website.

- decision: product-type
  Do follow option `content`.
  Do not drop the reason: People come to read.

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
  Do follow option `base-8`.
  Do not drop the reason: The recipe uses a generous 8-point base. Comfortable density does not require it.

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
  Do not drop the reason: A theme change must not require edits inside the components.

- decision: team
  Do follow option `solo-starting`.
  Do not drop the reason: One person maintains this starter, so the list stays short.

- decision: theme-shape
  Do follow option `sets-and-modifiers`.
  Do not drop the reason: Light and dark are modifiers on one theme, not two products.

- decision: token-tiers
  Do follow option `three-tier`.
  Do not drop the reason: The starter keeps primitive, semantic, and component tiers.

- decision: type-scale-ratio
  Do follow option `perfect-fourth`.
  Do not drop the reason: A large type scale comes first. No pack rule ties it to the spacing base.

- decision: users-and-context
  Do follow option `public`.
  Do not drop the reason: Most people arrive without an account and without training.

- decision: voice
  Do follow option `warm`.
  Do not drop the reason: The words should sound human and direct, not cute.

<!-- decisions:end -->
