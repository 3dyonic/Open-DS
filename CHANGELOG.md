# Changelog

All notable changes to this project are documented in this file.

The format is based on Keep a Changelog, and this project uses semantic versioning.

## [Unreleased]

### Breaking

- The gap colour behind a focus ring has one name in every component: `<component>-focus-ring-offset-color`. It replaces `*-focus-ring-offset`, `*-focus-ring-offset-focus` and `*/focus-ring/offset-color` in 31 component keys (OD-328). The values do not change. `--focus-ring-offset` stays the 2px gap.
- A scheme ships `--icon-size-large` only when it answers two icon sizes; Brand expressive reads the new decision token `size.icon.large` (OD-326).
- `open-ds compare --write-baseline` is now `--write-benchmark`, and it writes `harness/quality-benchmark.json` (OD-337). The file holds the last release's quality numbers, and the gate fails a number that gets worse.
- Every scheme drops its 305 deprecated aliases (301 component keys, and `radius.container`, `border-width.focus`, `border-width.focus-offset` and `opacity.disabled`) and the opacity option that only `opacity.disabled` read. Read the token that each alias named in its `$deprecated` note.

### Added

- One layer order in every scheme, so a menu opened in a dialog, a toast and a tooltip are never hidden (OD-324). Six decision tokens set it: `layer.sticky` (100), `layer.backdrop` (1000), `layer.modal` (1100), `layer.dropdown` (1200), `layer.toast` (1300) and `layer.tooltip` (1400). They read one shared z-index set that the loader adds to every scheme. Each floating component reads its own `--<component>-layer` key; dialogs, alert dialogs, sheets and drawers also read `--<component>-backdrop-layer`, and the sidebar and the data table header read the sticky layer. Tailwind gets the classes `z-sticky`, `z-backdrop`, `z-modal`, `z-dropdown`, `z-toast` and `z-tooltip`; its own `z-0` to `z-50` stay.
- Agents find the layer order: `find_token` returns each `layer.*` token with its class (`z-modal`), and `get_context build` lists the six layers in its full answer (`section all`).
- Two shape radii replace `radius.full` and `radius.999` (OD-286). `radius.round` (50%) makes a circle of a square: avatars, radio dots, thumbs and round buttons. `radius.pill` (`calc(infinity * 1px)`) makes a capsule of any box: tracks, progress, the scroll thumb and pill controls.
- A usage rule for every foundation token in every scheme: 57 situations, each with what to use, what not to use, and why (OD-286).
- Foundation pages show each token group as a sample, its tokens with their values, and its rules (OD-287).
- `guide/contributing/adr/002-scoped-schemes.md`: the proposal for schemes split by scope (OD-288).

### Changed

- A wait has one shape on any semantic token or theme pick, base or mode: `$extensions["open-ds"].waits` with `for`, `why` and `approved_by` (OD-343). It covers the token's connections and its rule. Only a wait that names `approved_by` lets a break pass; a wait without it is a listed failure. `for` says what the wait is for in plain words, and the scheme schema rejects a ticket key in it. The three waits on record now say "a brand decision: the primary moves away from the danger red, or danger may differ per brand"; none is approved.
- The type gate checks every role against every role one step below it, the same pairs the token cards show (OD-339). It finds 10 more pairs that are less than one ratio step apart.
- A colour slot rule or a measured rule that does not hold is a gap, unless the token has an approved wait (OD-340). Twelve rules break today.
- `harness/connections-baseline.json` lists each gap by name (scheme, connection or rule, tokens), not as a count per connection (OD-344). A new gap fails, and a listed gap that holds now fails until it is taken out. Spacing, the component spacing map, elevation, motion and accessibility are strict: a gap there fails even when listed. The list holds 57 gaps today.
- The tools offer only the keys a scheme's answers create: `find_token`, `get_context` and `get_key` leave out `icon/size-large` in a scheme with one icon size, and `get_key` says which answer creates it.
- `get_key`, `why`, `get_context` and `find_token` name the token a key reads without its `@`, as the token map and `get_component` do: `size.icon`, not `size.icon.@`.
- The display line height is 1.1 in Brand expressive and 1.2 in Multi-brand (it was 1.8).
- The Figma kit writes both shape radii as 9999. Figma caps a corner at half the shorter side, so 9999 draws the pill and the circle.

### Deprecated

- `radius.container` and its CSS variable `--radius-container`: use `radius.surface` (`--radius-surface`). The old name keeps its value until the next minor release.

### Removed

- The semantic `radius.round` and its CSS variable `--radius-round`. Components read the primitive `radius.round` or `radius.pill`, by the shape they draw. In a created project, replace `var(--radius-round)` with `50%` for a circle, or with `calc(infinity * 1px)` for a capsule.

### Upgrading a created project

- `radius.round` and `radius.pill` are CSS values, not DTCG dimensions: DTCG has no dimension for `calc()` or a percentage. A tool that needs a number reads 9999 for both.

## [0.3.0] - 2026-11-05

### Added

- An Anatomy page for every component, in every scheme (OD-229): the parts people see, numbered on a drawing, and how each decision reaches each part, from the answer through the rule to the token and the value. `get_anatomy` (MCP) and `open-ds anatomy` give agents the same reference.
- The Open DS anatomy Figma plugin, attached to every release as `open-ds-anatomy-plugin.zip`. It draws each component's anatomy in a scheme's anatomy file, bound to that scheme's Figma kit, lists what the kit is missing, and exports the images the docs show. Dense data's drawings are in; the other schemes show Dense data's drawings, and say so, until their own are exported.
- `radius.option`: an option's corner is its panel's corner less the panel's padding, so options nest in menus and lists (OD-246).
- The typeface is a decision, with its question, considerations and an answer in every scheme (OD-245).
- Every theme pick says why (OD-241).

### Changed

- Components read keys that name their parts, so one decision changes one part (OD-243). Floating panels (menus, lists, popovers, dialogs) read one overlay decision for their corner, elevation and border. The gap ledger falls from 56 gaps to 9 in Dense data.
- Hand-faded colors are gone: a destructive highlight or an invalid halo reads the danger tint instead of a faded red.
- The alert dialog reads the dialog's panel decisions; descriptions read the secondary text color; selected surfaces read the selected tint; the menubar is the control height (it was 1rem).
- Accessible first's danger color and dark-mode secondary and muted text follow its 7:1 contrast floor.
- The shadcn bridge follows: `--accent` and `--sidebar-accent` read `surface.highlight`, `--radius-sm` reads `radius.option`.
- The docs build in seconds instead of minutes.

### Deprecated

- Component keys whose job moved to a key that names the part. Each keeps its value and its CSS variable until the next minor release and says what replaces it (`get_component` lists them, with `replaced_by`).

### Upgrading a created project

- Run `npm run tokens` to write the new variables. Code that reads a deprecated key keeps working; move it to the key named in `replaced_by` before the next minor release.

## [0.2.1] - 2026-11-05

### Added

- Decision reference, a docs page in every scheme (OD-239). It shows each question, its answer, why, what it came from, and every answer, rule and variant it decided. It starts with a calm intro and a simple tree from the first answers to the token values. Its section menu sits in the left sidebar.
- `get_decision_reference` (MCP) and `open-ds decisions` give agents the same reference. `get_answer` now also returns what each answer decided.
- Every usage rule shows its why, and the why says why the alternative is worse. 29 reasons were rewritten.

### Changed

- The docs scheme and brand pickers, and the website's pickers, are a simple menu instead of a native select (OD-240).
- In the docs, text on a toned fill follows the fill's tone: on-light or on-dark, never the link color (OD-222, OD-240). A created project's docs get the same fix.
- Schemes are listed in one order everywhere, from the grammar's `scheme_order`: Dense data, Content first, Accessible first, Brand expressive, Multi-brand.
- The motion sample on a scheme's home page plays once, and again on hover, instead of looping.

### Upgrading a created project

- Run `npm run tokens` to write the new docs variables.

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
