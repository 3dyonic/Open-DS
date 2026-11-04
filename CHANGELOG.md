# Changelog

All notable changes to this project are documented in this file.

The format is based on Keep a Changelog, and this project uses semantic versioning.

## [0.2.0] - 2026-11-04

### Added

- Every component has its own token API: each part reads a token of its own that aliases a semantic (OD-234). `get_component`, `get_context` and `open-ds component` give agents the whole API, with each token's primitive and value per theme.
- The component spacing map: spacing inside a component is 4px × a multiplier × the scheme's rhythm, a multiple of 4px, at most 64px (OD-235). `open-ds spacing` and `get_component_spacing_map` show it.
- Named Tailwind spacing utilities from the scheme: `gap-section`, `p-container`, `px-control`, `p-map-x6`.
- `check_ui` flags a spacing written as a number and names the role or step to use.
- Whole color scales in OKLCH, with decision hints, and `open-ds scales` and `get_scales` (OD-223, OD-230).

### Changed

- Components follow each scheme's type, weight, control sizes and spacing. Before, they used Tailwind's fixed values in every scheme, so Content first, Accessible first, Brand expressive and Multi-brand look different. Dense data barely changes.
- Every spacing a scheme decides sits on the 4px grid, at most 64px. Brand expressive's section gap goes from 96px to 64px.
- US English throughout: `color`, not `colour` (for example `semantics.key_colors` in the grammar).

### Upgrading a created project

- Run `npx open-ds context --write`, then `npm run tokens`.
- Replace spacing written as numbers with the named utilities. `npx open-ds check .` lists each one with its replacement.

## [0.1.0] - 2026-10-29

### Added

- Decision packs for purpose, global schemes, color primitives, type, space, radius, accessibility, theming, and delivery.
- A Python validator that checks recipes and boilerplate manifests, with reject and lie cases.
- A FastMCP server with list_scopes, get_questions, get_option, and check_recipe.
- A static website to browse the catalog and build a recipe.
- The provisional 3dyonic recipe and an authored boilerplate.
- A private local CLI with working init and check. add and diff are stubs.
