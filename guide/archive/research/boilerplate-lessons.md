---
title: "Boilerplate lessons: what to learn for the Open DS boilerplate format"
description: "Contributor note from the first preview: Boilerplate lessons: what to learn for the Open DS boilerplate format."
---

# Boilerplate lessons: what to learn for the Open DS boilerplate format

Scope: each Open DS recipe leads to a full design system boilerplate. This file lists what the mined tools teach about the boilerplate format. Every lesson cites a fetched page. Items marked **PO call** are product decisions. Research does not decide them.

## Top 5 lessons

1. **Ship one small item schema, not a loose folder.** shadcn registry items hold `name`, `type`, `dependencies`, `registryDependencies`, `devDependencies`, `files[]` and `cssVars {theme, light, dark}`. One JSON file can describe a whole piece. A recipe could output one such item per scope. Source: https://ui.shadcn.com/docs/registry/registry-item-json
2. **Split choices into "locked at first run" and "changeable later".** shadcn locks `style`, `tailwind.baseColor` and `tailwind.cssVariables` at init. The config file `components.json` lists every field (`style`, `rsc`, `tsx`, `tailwind.{css, baseColor, cssVariables, prefix}`, `aliases`). The boilerplate needs the same list with a lock flag per choice. Sources: https://ui.shadcn.com/docs/components-json
3. **Use three token tiers and name them the same way in every pack.** DTCG naming guide, Primer and Material all use three tiers: base/reference, alias/functional/system, component. Names follow category + property (`color.background.error`), with no abbreviations. Sources: https://www.designtokens.org/tr/2025.10/format/ ; https://primer.style/foundations/color/overview ; https://raw.githubusercontent.com/material-components/material-web/main/docs/theming/README.md
4. **Pair every surface color with its on-color by one fixed rule.** shadcn uses `x` / `x-foreground`. daisyUI uses `x` / `x-content`. Material uses `on-x`. MUI uses `contrastText`. The boilerplate must pick one rule and apply it to all roles. Sources: https://ui.shadcn.com/docs/theming ; https://daisyui.com/docs/themes/ ; https://m3.material.io/styles/color/system/how-the-system-works ; https://mui.com/material-ui/customization/palette/
5. **Output DTCG as the neutral file and transform it per platform.** DTCG 2025.10 is stable but "not a W3C Standard". Its color value is an object (`colorSpace`, `components`, `alpha`, optional hex fallback). Style Dictionary v4 reads DTCG or classic format, never both in one run. Style Dictionary transforms set the name case per platform (camel, kebab, snake, constant, human). Sources: https://www.designtokens.org/tr/2025.10/color/ ; https://styledictionary.com/info/tokens/ ; https://styledictionary.com/reference/hooks/transforms/predefined/

## All lessons

| # | Lesson | Evidence | Source |
|---|---|---|---|
| 1 | One item schema per piece (files, dependencies, cssVars light/dark) | shadcn registry item | https://ui.shadcn.com/docs/registry/registry-item-json |
| 2 | Config file with init-locked fields | shadcn components.json | https://ui.shadcn.com/docs/components-json |
| 3 | Three token tiers; names by category + property | DTCG, Primer, Material | https://www.designtokens.org/tr/2025.10/format/ |
| 4 | Fixed on-color pairing rule | shadcn, daisyUI, Material, MUI | https://ui.shadcn.com/docs/theming |
| 5 | DTCG neutral file + per-platform transforms | DTCG color, Style Dictionary | https://www.designtokens.org/tr/2025.10/color/ |
| 6 | A prefix option and a CSS variable root option avoid clashes. Defaults seen: `:root` (daisyUI), `:where(:root, :host)` (Chakra), `:where(html)` (Open Props); prefix fields `tailwind.prefix`, `prefix`, `cssVarsPrefix`. | shadcn, daisyUI, Chakra, Open Props | https://daisyui.com/docs/config/ ; https://chakra-ui.com/docs/theming/overview |
| 7 | Themes are combinations, not copies. Tokens Studio: a theme is a set of token sets. DTCG resolver: sets and orthogonal modifiers; one permutation gives one output. | Tokens Studio, DTCG resolver | https://docs.tokens.studio/manage-themes/themes-overview ; https://www.designtokens.org/tr/2025.10/resolver/ |
| 8 | Theme switch needs one documented mechanism: `.dark` class (shadcn), `data-theme` attribute (daisyUI), `appearance` prop (Radix Themes), media query (Open Props). daisyUI also flags one default theme and one prefers-dark theme. | four starters | https://ui.shadcn.com/docs/theming ; https://daisyui.com/docs/themes/ ; https://www.radix-ui.com/themes/docs/theme/dark-mode |
| 9 | Open code vs package is a delivery choice. Copy-in (shadcn CLI + registry, Park UI "open code") lets users edit files. Package (Chakra, MUI, Radix Themes) lets users update by version. CSS-only (Open Props) has no build step. | starters | https://park-ui.com/docs ; https://ui.shadcn.com/docs/components-json |
| 10 | Name by role on top, numbers underneath. Radix: 12 steps with fixed use per step. Tailwind: 50-950. Polaris: value-based (`space-100`). Atlassian: `space.100`. Keep one rule per pack. | Radix, Tailwind, Polaris, Atlassian | https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale ; https://tailwindcss.com/docs/colors |
| 11 | A single global knob can scale a whole system. Radix Themes: `scaling` 90-110% and `radius` factor (none 0, small 0.75, medium 1, large 1.5, full 1.5) feed `calc(base * scaling * radius-factor)`. daisyUI: `radius-selector/field/box`, `size-selector/field`, `border`, `depth`, `noise`. | Radix Themes, daisyUI | https://unpkg.com/@radix-ui/themes@latest/tokens/base.css ; https://unpkg.com/daisyui@latest/theme/light.css |
| 12 | Fluid vs fixed is an output choice. Utopia needs min and max viewport plus a ratio at each end. Open Props ships fixed and fluid sizes. | Utopia, Open Props | https://utopia.fyi/type/calculator/ ; https://unpkg.com/open-props@latest/src/props.sizes.css |
| 13 | Make the pack AI-readable: `llms.txt` and `.md` copies (Knapsack docs), a shadcn MCP server in nav, Chakra "Agent Skills", Supernova MCP read and write. | docs sites | https://docs.knapsack.cloud/ ; https://ui.shadcn.com/docs/theming ; https://chakra-ui.com/docs/theming/overview ; https://www.supernova.io/mcp |
| 14 | Record the decision source next to the value. DTCG tokens have `$description` and `$extensions`; Style Dictionary has `comment`. Open DS can put the cited source URL into `$description` or an extension. This is a proposal. | DTCG, Style Dictionary | https://www.designtokens.org/tr/2025.10/format/ ; https://styledictionary.com/info/tokens/ |
| 15 | Show the calculation scheme as text, not as code. Material, Leonardo and Utopia publish the method (HCT tone roles, target contrast, two-scale interpolation) while the user's tool computes values. This matches the Round 2 scope. | M3, Leonardo, Utopia | https://m3.material.io/styles/color/system/how-the-system-works ; https://raw.githubusercontent.com/adobe/leonardo/main/packages/contrast-colors/README.md ; https://utopia.fyi/type/calculator/ |
| 16 | A visual editor sits on top of the same file. tweakcn edits Tailwind + shadcn/ui themes with presets. Material Theme Builder and Tokens Studio are Figma plugins. | tweakcn, M3, Tokens Studio | https://raw.githubusercontent.com/jnsahaj/tweakcn/main/README.md |
| 17 | Test the pack with a drift check. Knapsack measures fidelity and drift of AI output against the design system. | Knapsack | https://www.knapsack.cloud/ |
| 18 | Component tokens map to system tokens and live near the component. | DTCG; Material | https://www.designtokens.org/tr/2025.10/format/ ; https://raw.githubusercontent.com/material-components/material-web/main/docs/theming/README.md |
| 19 | Keep a changelog and a version rule (OD-26 Q8 and Q9). No mined tool page gave a better answer than Jira. Open question. | gap | n/a |

## Cautions

- **Specify** shows "Saying Goodbye: The End of Specify". Do not copy its model as a live standard. https://www.specifyapp.com/
- Radix Colors states that the scales are not meant to be customized. A recipe that edits scales leaves the Radix scheme. https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette
- Material warns that a custom type scale may stop token updates from Material. Record "custom" as a branch that loses upstream updates. https://m3.material.io/styles/typography/type-scale-tokens
- **PO call:** which tier of boilerplate (tokens only, tokens + CSS, tokens + components) each recipe produces. The mined starters ship components; Open DS scope says "full DS boilerplate". Research does not set this.
- The Round 1 brief `market-fit.md` calls Open DS a builder of tokens "with checks". That wording is superseded by the Round 2 scope: Open DS records decisions and calculation schemes with cited options. Positioning needs a rewrite (Content Writer, PO).
