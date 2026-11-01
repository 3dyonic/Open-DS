---
title: "The Figma kit"
description: "What the Figma kit of each scheme holds, and how to generate or update it from the scheme with pnpm figma-kit."
---

# The Figma kit

Each scheme has a Figma kit (OD-149). It is generated from the scheme, like the tokens, Storybook and docs, so it never drifts from the code.

## What a kit holds

- **Variables.** Two collections, Semantic and Component, with one mode per theme (Light and Dark; for Multi-brand, light and dark for each brand). Component variables alias semantic ones, as in `tokens.css`. Every variable carries its CSS name as its web code syntax, for example `var(--button-primary-background)`, and a scope, so it shows only where it fits.
- **Styles.** A text style per type role, in the scheme's font (Inter when Figma does not have it), and effect styles for elevation.
- **Foundations.** Every colour in every theme, the type roles, and the spacing, size and radius scale, all bound to the variables.
- **Components.** The ones with component keys: button, input, checkbox and switch, badge, card, table, tabs, menu and tooltip. They read only component variables. The full inventory is listed on the Scheme page.
- **The cover.** The scheme's name and summary in its own colours, a button from the kit, and its themes and counts.
- **The Scheme page.** Every question with its answer, why and because, then the voice, when to use what, and the inventory.

## Make or update a kit

```bash
pnpm --dir tokens build
```

```bash
pnpm figma-kit dense-data
```

`pnpm figma-kit all` writes two things:

- **`figma/plugin/`** (committed): the "Open DS kits" development plugin with every scheme's kit. In Figma desktop: Plugins, Development, Import plugin from manifest, and pick `figma/plugin/manifest.json`. Open a kit file, run the plugin, pick the scheme (it guesses from the file name) and press Build the kit. Running it again rebuilds the kit.
- **`figma/kits/<scheme>/`** (not committed): the same steps as separate scripts, for the Figma MCP (`use_figma`). Large steps can be split finer with `FIGMA_KIT_PART=12000`.

A rebuild replaces the kit's own collections, styles and pages, and nothing else. The cover is the first frame of the first page, so it is the file's thumbnail.

The links to the published kits live in `figma/kits.json`; each scheme page on the site links to its kit.
