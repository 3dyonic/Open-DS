---
composite_data: "./color.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 2
title: "Color"
description: "Multi-brand: How color carries action, state and brand."
---

# Color

How color carries action, state and brand.

- :sample{kind="color" value="var(--color-neutral-0)"} `color.neutral.0`
- :sample{kind="color" value="var(--color-neutral-50)"} `color.neutral.50`
- :sample{kind="color" value="var(--color-neutral-100)"} `color.neutral.100`
- :sample{kind="color" value="var(--color-neutral-200)"} `color.neutral.200`
- :sample{kind="color" value="var(--color-neutral-300)"} `color.neutral.300`
- :sample{kind="color" value="var(--color-neutral-400)"} `color.neutral.400`
- :sample{kind="color" value="var(--color-neutral-500)"} `color.neutral.500`
- :sample{kind="color" value="var(--color-neutral-600)"} `color.neutral.600`
- :sample{kind="color" value="var(--color-neutral-700)"} `color.neutral.700`
- :sample{kind="color" value="var(--color-neutral-800)"} `color.neutral.800`
- :sample{kind="color" value="var(--color-neutral-900)"} `color.neutral.900`
- :sample{kind="color" value="var(--color-neutral-950)"} `color.neutral.950`
- :sample{kind="color" value="var(--color-surface-canvas)"} `color.surface.canvas`
- :sample{kind="color" value="var(--color-surface-default)"} `color.surface.default`
- :sample{kind="color" value="var(--color-surface-raised)"} `color.surface.raised`
- :sample{kind="color" value="var(--color-surface-sunken)"} `color.surface.sunken`
- :sample{kind="color" value="var(--color-surface-highlight)"} `color.surface.highlight`
- :sample{kind="color" value="var(--color-surface-pressed)"} `color.surface.pressed`
- :sample{kind="color" value="var(--color-surface-selected)"} `color.surface.selected`
- :sample{kind="color" value="var(--color-surface-inverse)"} `color.surface.inverse`
- :sample{kind="color" value="var(--color-surface-scrim)"} `color.surface.scrim`
- :sample{kind="color" value="var(--color-text-primary)"} `color.text.primary`
- :sample{kind="color" value="var(--color-text-secondary)"} `color.text.secondary`
- :sample{kind="color" value="var(--color-text-muted)"} `color.text.muted`
- :sample{kind="color" value="var(--color-text-inverse)"} `color.text.inverse`
- :sample{kind="color" value="var(--color-text-on-action)"} `color.text.on-action`
- :sample{kind="color" value="var(--color-text-link)"} `color.text.link`
- :sample{kind="color" value="var(--color-text-on-danger)"} `color.text.on-danger`
- :sample{kind="color" value="var(--color-text-on-light)"} `color.text.on-light`
- :sample{kind="color" value="var(--color-text-on-dark)"} `color.text.on-dark`
- :sample{kind="color" value="var(--color-text-info-on-light)"} `color.text.info-on-light`
- :sample{kind="color" value="var(--color-text-info-on-dark)"} `color.text.info-on-dark`
- :sample{kind="color" value="var(--color-text-success-on-light)"} `color.text.success-on-light`
- :sample{kind="color" value="var(--color-text-success-on-dark)"} `color.text.success-on-dark`
- :sample{kind="color" value="var(--color-text-warning-on-light)"} `color.text.warning-on-light`
- :sample{kind="color" value="var(--color-text-warning-on-dark)"} `color.text.warning-on-dark`
- :sample{kind="color" value="var(--color-text-danger-on-light)"} `color.text.danger-on-light`
- :sample{kind="color" value="var(--color-text-danger-on-dark)"} `color.text.danger-on-dark`
- :sample{kind="color" value="var(--color-border-default)"} `color.border.default`
- :sample{kind="color" value="var(--color-border-strong)"} `color.border.strong`

::::brand{id="aster" name="Aster"}
::specimen{id="color/key/aster"}
::::

::::brand{id="birch" name="Birch"}
::specimen{id="color/key/birch"}
::::

::::brand{id="coral" name="Coral"}
::specimen{id="color/key/coral"}
::::

## Surfaces

The canvas, then the surfaces content sits on, in aster-light and aster-dark and birch-light and birch-dark and coral-light and coral-dark.

::::brand{id="aster" name="Aster"}
::surface-stack{id="aster"}
::::

::::brand{id="birch" name="Birch"}
::surface-stack{id="birch"}
::::

::::brand{id="coral" name="Coral"}
::surface-stack{id="coral"}
::::

## Status colors in use

Each status label always gets the same color, with its dot, so color is never the only cue. The ratio is the status color on its subtle fill, computed from the tokens.

::::brand{id="aster" name="Aster"}
::specimen{id="color/status/aster"}
::::

::::brand{id="birch" name="Birch"}
::specimen{id="color/status/birch"}
::::

::::brand{id="coral" name="Coral"}
::specimen{id="color/status/coral"}
::::

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which color roles does it need? | Those and brand accents | Each brand brings its own accent ramp. |
| How many emphasis levels do actions need? | Three | Primary, secondary and ghost in every brand. |
| How is the palette defined? | Shared neutrals, a ramp per brand | Shared neutrals; each brand sets its own ramp. |
| How saturated is the palette? | Balanced | Balanced, so any brand hue works. |
| Where does color carry meaning first? | Brand moments | Brand color shows on actions and headlines. |

## Tokens

Each token points to another token. Values live only on primitives, below.

::::brand{id="aster" name="Aster"}
| Token | Points to, light | Points to, dark |
| --- | --- | --- |
| `color.neutral.0` | `aster.theme.light.color.neutral.0` → `color.slate-deep.light.0` | `aster.theme.dark.color.neutral.0` → `color.slate-deep.dark.0` |
| `color.neutral.50` | `aster.theme.light.color.neutral.50` → `color.slate-deep.light.50` | `aster.theme.dark.color.neutral.50` → `color.slate-deep.dark.50` |
| `color.neutral.100` | `aster.theme.light.color.neutral.100` → `color.slate-deep.light.100` | `aster.theme.dark.color.neutral.100` → `color.slate-deep.dark.100` |
| `color.neutral.200` | `aster.theme.light.color.neutral.200` → `color.slate-deep.light.200` | `aster.theme.dark.color.neutral.200` → `color.slate-deep.dark.200` |
| `color.neutral.300` | `aster.theme.light.color.neutral.300` → `color.slate-deep.light.300` | `aster.theme.dark.color.neutral.300` → `color.slate-deep.dark.300` |
| `color.neutral.400` | `aster.theme.light.color.neutral.400` → `color.slate-deep.light.400` | `aster.theme.dark.color.neutral.400` → `color.slate-deep.dark.400` |
| `color.neutral.500` | `aster.theme.light.color.neutral.500` → `color.slate-deep.light.500` | `aster.theme.dark.color.neutral.500` → `color.slate-deep.dark.500` |
| `color.neutral.600` | `aster.theme.light.color.neutral.600` → `color.slate-deep.light.600` | `aster.theme.dark.color.neutral.600` → `color.slate-deep.dark.600` |
| `color.neutral.700` | `aster.theme.light.color.neutral.700` → `color.slate-deep.light.700` | `aster.theme.dark.color.neutral.700` → `color.slate-deep.dark.700` |
| `color.neutral.800` | `aster.theme.light.color.neutral.800` → `color.slate-deep.light.800` | `aster.theme.dark.color.neutral.800` → `color.slate-deep.dark.800` |
| `color.neutral.900` | `aster.theme.light.color.neutral.900` → `color.slate-deep.light.900` | `aster.theme.dark.color.neutral.900` → `color.slate-deep.dark.900` |
| `color.neutral.950` | `aster.theme.light.color.neutral.950` → `color.slate-deep.light.950` | `aster.theme.dark.color.neutral.950` → `color.slate-deep.dark.950` |
| `color.surface.canvas` | `aster.theme.light.color.surface.canvas` → `color.neutral.50` → `aster.theme.light.color.neutral.50` → `color.slate-deep.light.50` | `aster.theme.dark.color.surface.canvas` → `color.neutral.0` → `aster.theme.dark.color.neutral.0` → `color.slate-deep.dark.0` |
| `color.surface.default` | `aster.theme.light.color.surface.default` → `color.neutral.0` → `aster.theme.light.color.neutral.0` → `color.slate-deep.light.0` | `aster.theme.dark.color.surface.default` → `color.neutral.50` → `aster.theme.dark.color.neutral.50` → `color.slate-deep.dark.50` |
| `color.surface.raised` | `aster.theme.light.color.surface.raised` → `color.neutral.0` → `aster.theme.light.color.neutral.0` → `color.slate-deep.light.0` | `aster.theme.dark.color.surface.raised` → `color.neutral.50` → `aster.theme.dark.color.neutral.50` → `color.slate-deep.dark.50` |
| `color.surface.sunken` | `aster.theme.light.color.surface.sunken` → `color.neutral.100` → `aster.theme.light.color.neutral.100` → `color.slate-deep.light.100` | `aster.theme.dark.color.surface.sunken` → `color.neutral.100` → `aster.theme.dark.color.neutral.100` → `color.slate-deep.dark.100` |
| `color.surface.highlight` | `aster.theme.light.color.surface.highlight` → `color.neutral.100` → `aster.theme.light.color.neutral.100` → `color.slate-deep.light.100` | `aster.theme.dark.color.surface.highlight` → `color.neutral.100` → `aster.theme.dark.color.neutral.100` → `color.slate-deep.dark.100` |
| `color.surface.pressed` | `aster.theme.light.color.surface.pressed` → `color.neutral.200` → `aster.theme.light.color.neutral.200` → `color.slate-deep.light.200` | `aster.theme.dark.color.surface.pressed` → `color.neutral.200` → `aster.theme.dark.color.neutral.200` → `color.slate-deep.dark.200` |
| `color.surface.selected` | `aster.theme.light.color.surface.selected` → `color.teal.light.100` | `aster.theme.dark.color.surface.selected` → `color.teal.dark.100` |
| `color.surface.inverse` | `aster.theme.light.color.surface.inverse` → `color.neutral.900` → `aster.theme.light.color.neutral.900` → `color.slate-deep.light.900` | `aster.theme.dark.color.surface.inverse` → `color.neutral.900` → `aster.theme.dark.color.neutral.900` → `color.slate-deep.dark.900` |
| `color.surface.scrim` | `aster.theme.light.color.surface.scrim` → `color.black.light.scrim` | `aster.theme.dark.color.surface.scrim` → `color.black.dark.scrim` |
| `color.text.primary` | `aster.theme.light.color.text.primary` → `color.neutral.900` → `aster.theme.light.color.neutral.900` → `color.slate-deep.light.900` | `aster.theme.dark.color.text.primary` → `color.neutral.900` → `aster.theme.dark.color.neutral.900` → `color.slate-deep.dark.900` |
| `color.text.secondary` | `aster.theme.light.color.text.secondary` → `color.neutral.700` → `aster.theme.light.color.neutral.700` → `color.slate-deep.light.700` | `aster.theme.dark.color.text.secondary` → `color.neutral.500` → `aster.theme.dark.color.neutral.500` → `color.slate-deep.dark.500` |
| `color.text.muted` | `aster.theme.light.color.text.muted` → `color.neutral.600` → `aster.theme.light.color.neutral.600` → `color.slate-deep.light.600` | `aster.theme.dark.color.text.muted` → `color.neutral.400` → `aster.theme.dark.color.neutral.400` → `color.slate-deep.dark.400` |
| `color.text.inverse` | `aster.theme.light.color.text.inverse` → `color.text.on-dark` → `aster.theme.base.color.text.on-dark` → `color.slate-deep.light.0` | `aster.theme.dark.color.text.inverse` → `color.text.on-light` → `aster.theme.base.color.text.on-light` → `color.slate-deep.light.900` |
| `color.text.on-action` | `aster.theme.light.color.text.on-action` → `color.text.on-dark` → `aster.theme.base.color.text.on-dark` → `color.slate-deep.light.0` | `aster.theme.dark.color.text.on-action` → `color.text.on-light` → `aster.theme.base.color.text.on-light` → `color.slate-deep.light.900` |
| `color.text.link` | `aster.theme.light.color.text.link` → `color.teal.light.700` | `aster.theme.dark.color.text.link` → `color.teal.dark.700` |
| `color.text.on-danger` | `aster.theme.light.color.text.on-danger` → `color.text.on-dark` → `aster.theme.base.color.text.on-dark` → `color.slate-deep.light.0` | `aster.theme.dark.color.text.on-danger` → `color.text.on-light` → `aster.theme.base.color.text.on-light` → `color.slate-deep.light.900` |
| `color.text.on-light` | `aster.theme.base.color.text.on-light` → `color.slate-deep.light.900` | `aster.theme.base.color.text.on-light` → `color.slate-deep.light.900` |
| `color.text.on-dark` | `aster.theme.base.color.text.on-dark` → `color.slate-deep.light.0` | `aster.theme.base.color.text.on-dark` → `color.slate-deep.light.0` |
| `color.text.info-on-light` | `aster.theme.base.color.text.info-on-light` → `color.blue.light.800` | `aster.theme.base.color.text.info-on-light` → `color.blue.light.800` |
| `color.text.info-on-dark` | `aster.theme.base.color.text.info-on-dark` → `color.blue.light.100` | `aster.theme.base.color.text.info-on-dark` → `color.blue.light.100` |
| `color.text.success-on-light` | `aster.theme.base.color.text.success-on-light` → `color.green.light.800` | `aster.theme.base.color.text.success-on-light` → `color.green.light.800` |
| `color.text.success-on-dark` | `aster.theme.base.color.text.success-on-dark` → `color.green.light.100` | `aster.theme.base.color.text.success-on-dark` → `color.green.light.100` |
| `color.text.warning-on-light` | `aster.theme.base.color.text.warning-on-light` → `color.amber.light.800` | `aster.theme.base.color.text.warning-on-light` → `color.amber.light.800` |
| `color.text.warning-on-dark` | `aster.theme.base.color.text.warning-on-dark` → `color.amber.light.100` | `aster.theme.base.color.text.warning-on-dark` → `color.amber.light.100` |
| `color.text.danger-on-light` | `aster.theme.base.color.text.danger-on-light` → `color.red.light.800` | `aster.theme.base.color.text.danger-on-light` → `color.red.light.800` |
| `color.text.danger-on-dark` | `aster.theme.base.color.text.danger-on-dark` → `color.red.light.100` | `aster.theme.base.color.text.danger-on-dark` → `color.red.light.100` |
| `color.border.default` | `aster.theme.light.color.border.default` → `color.neutral.200` → `aster.theme.light.color.neutral.200` → `color.slate-deep.light.200` | `aster.theme.dark.color.border.default` → `color.neutral.200` → `aster.theme.dark.color.neutral.200` → `color.slate-deep.dark.200` |
| `color.border.strong` | `aster.theme.light.color.border.strong` → `color.neutral.500` → `aster.theme.light.color.neutral.500` → `color.slate-deep.light.500` | `aster.theme.dark.color.border.strong` → `color.neutral.400` → `aster.theme.dark.color.neutral.400` → `color.slate-deep.dark.400` |
| `color.border.focus` | `aster.theme.light.color.border.focus` → `color.teal.light.600` | `aster.theme.dark.color.border.focus` → `color.teal.dark.600` |
| `color.border.selected` | `aster.theme.light.color.border.selected` → `color.teal.light.600` | `aster.theme.dark.color.border.selected` → `color.teal.dark.600` |
| `color.action.primary.@` | `aster.theme.light.color.action.primary.@` → `color.teal.light.600` | `aster.theme.dark.color.action.primary.@` → `color.teal.dark.600` |
| `color.action.primary.hover` | `aster.theme.light.color.action.primary.hover` → `color.teal.light.700` | `aster.theme.dark.color.action.primary.hover` → `color.teal.dark.700` |
| `color.action.secondary.@` | `aster.theme.light.color.action.secondary.@` → `color.neutral.0` → `aster.theme.light.color.neutral.0` → `color.slate-deep.light.0` | `aster.theme.dark.color.action.secondary.@` → `color.neutral.50` → `aster.theme.dark.color.neutral.50` → `color.slate-deep.dark.50` |
| `color.action.secondary.hover` | `aster.theme.light.color.action.secondary.hover` → `color.neutral.100` → `aster.theme.light.color.neutral.100` → `color.slate-deep.light.100` | `aster.theme.dark.color.action.secondary.hover` → `color.neutral.100` → `aster.theme.dark.color.neutral.100` → `color.slate-deep.dark.100` |
| `color.action.danger.@` | `aster.theme.light.color.action.danger.@` → `color.red.light.600` | `aster.theme.dark.color.action.danger.@` → `color.red.dark.600` |
| `color.action.danger.hover` | `aster.theme.light.color.action.danger.hover` → `color.red.light.700` | `aster.theme.dark.color.action.danger.hover` → `color.red.dark.700` |
| `color.status.info.@` | `aster.theme.light.color.status.info.@` → `color.blue.light.600` | `aster.theme.dark.color.status.info.@` → `color.blue.dark.600` |
| `color.status.info.subtle` | `aster.theme.light.color.status.info.subtle` → `color.blue.light.100` | `aster.theme.dark.color.status.info.subtle` → `color.blue.dark.100` |
| `color.status.success.@` | `aster.theme.light.color.status.success.@` → `color.green.light.600` | `aster.theme.dark.color.status.success.@` → `color.green.dark.600` |
| `color.status.success.subtle` | `aster.theme.light.color.status.success.subtle` → `color.green.light.100` | `aster.theme.dark.color.status.success.subtle` → `color.green.dark.100` |
| `color.status.warning.@` | `aster.theme.light.color.status.warning.@` → `color.amber.light.600` | `aster.theme.dark.color.status.warning.@` → `color.amber.dark.600` |
| `color.status.warning.subtle` | `aster.theme.light.color.status.warning.subtle` → `color.amber.light.100` | `aster.theme.dark.color.status.warning.subtle` → `color.amber.dark.100` |
| `color.status.danger.@` | `aster.theme.light.color.status.danger.@` → `color.red.light.600` | `aster.theme.dark.color.status.danger.@` → `color.red.dark.600` |
| `color.status.danger.subtle` | `aster.theme.light.color.status.danger.subtle` → `color.red.light.100` | `aster.theme.dark.color.status.danger.subtle` → `color.red.dark.100` |
| `color.category.1.@` | `aster.theme.light.color.category.1.@` → `color.teal.light.600` | `aster.theme.dark.color.category.1.@` → `color.teal.dark.600` |
| `color.category.1.subtle` | `aster.theme.light.color.category.1.subtle` → `color.teal.light.100` | `aster.theme.dark.color.category.1.subtle` → `color.teal.dark.100` |
| `color.category.2.@` | `aster.theme.light.color.category.2.@` → `color.purple.light.600` | `aster.theme.dark.color.category.2.@` → `color.purple.dark.600` |
| `color.category.2.subtle` | `aster.theme.light.color.category.2.subtle` → `color.purple.light.100` | `aster.theme.dark.color.category.2.subtle` → `color.purple.dark.100` |
| `color.category.3.@` | `aster.theme.light.color.category.3.@` → `color.orange.light.600` | `aster.theme.dark.color.category.3.@` → `color.orange.dark.600` |
| `color.category.3.subtle` | `aster.theme.light.color.category.3.subtle` → `color.orange.light.100` | `aster.theme.dark.color.category.3.subtle` → `color.orange.dark.100` |
| `color.category.4.@` | `aster.theme.light.color.category.4.@` → `color.blue.light.600` | `aster.theme.dark.color.category.4.@` → `color.blue.dark.600` |
| `color.category.4.subtle` | `aster.theme.light.color.category.4.subtle` → `color.blue.light.100` | `aster.theme.dark.color.category.4.subtle` → `color.blue.dark.100` |
| `color.category.5.@` | `aster.theme.light.color.category.5.@` → `color.green.light.600` | `aster.theme.dark.color.category.5.@` → `color.green.dark.600` |
| `color.category.5.subtle` | `aster.theme.light.color.category.5.subtle` → `color.green.light.100` | `aster.theme.dark.color.category.5.subtle` → `color.green.dark.100` |
| `color.disabled.text` | `aster.theme.light.color.disabled.text` → `color.neutral.500` → `aster.theme.light.color.neutral.500` → `color.slate-deep.light.500` | `aster.theme.dark.color.disabled.text` → `color.neutral.500` → `aster.theme.dark.color.neutral.500` → `color.slate-deep.dark.500` |
| `color.disabled.surface` | `aster.theme.light.color.disabled.surface` → `color.neutral.100` → `aster.theme.light.color.neutral.100` → `color.slate-deep.light.100` | `aster.theme.dark.color.disabled.surface` → `color.neutral.100` → `aster.theme.dark.color.neutral.100` → `color.slate-deep.dark.100` |
| `color.disabled.border` | `aster.theme.light.color.disabled.border` → `color.neutral.200` → `aster.theme.light.color.neutral.200` → `color.slate-deep.light.200` | `aster.theme.dark.color.disabled.border` → `color.neutral.200` → `aster.theme.dark.color.neutral.200` → `color.slate-deep.dark.200` |
::::

::::brand{id="birch" name="Birch"}
| Token | Points to, light | Points to, dark |
| --- | --- | --- |
| `color.neutral.0` | `birch.theme.light.color.neutral.0` → `color.slate-deep.light.0` | `birch.theme.dark.color.neutral.0` → `color.slate-deep.dark.0` |
| `color.neutral.50` | `birch.theme.light.color.neutral.50` → `color.slate-deep.light.50` | `birch.theme.dark.color.neutral.50` → `color.slate-deep.dark.50` |
| `color.neutral.100` | `birch.theme.light.color.neutral.100` → `color.slate-deep.light.100` | `birch.theme.dark.color.neutral.100` → `color.slate-deep.dark.100` |
| `color.neutral.200` | `birch.theme.light.color.neutral.200` → `color.slate-deep.light.200` | `birch.theme.dark.color.neutral.200` → `color.slate-deep.dark.200` |
| `color.neutral.300` | `birch.theme.light.color.neutral.300` → `color.slate-deep.light.300` | `birch.theme.dark.color.neutral.300` → `color.slate-deep.dark.300` |
| `color.neutral.400` | `birch.theme.light.color.neutral.400` → `color.slate-deep.light.400` | `birch.theme.dark.color.neutral.400` → `color.slate-deep.dark.400` |
| `color.neutral.500` | `birch.theme.light.color.neutral.500` → `color.slate-deep.light.500` | `birch.theme.dark.color.neutral.500` → `color.slate-deep.dark.500` |
| `color.neutral.600` | `birch.theme.light.color.neutral.600` → `color.slate-deep.light.600` | `birch.theme.dark.color.neutral.600` → `color.slate-deep.dark.600` |
| `color.neutral.700` | `birch.theme.light.color.neutral.700` → `color.slate-deep.light.700` | `birch.theme.dark.color.neutral.700` → `color.slate-deep.dark.700` |
| `color.neutral.800` | `birch.theme.light.color.neutral.800` → `color.slate-deep.light.800` | `birch.theme.dark.color.neutral.800` → `color.slate-deep.dark.800` |
| `color.neutral.900` | `birch.theme.light.color.neutral.900` → `color.slate-deep.light.900` | `birch.theme.dark.color.neutral.900` → `color.slate-deep.dark.900` |
| `color.neutral.950` | `birch.theme.light.color.neutral.950` → `color.slate-deep.light.950` | `birch.theme.dark.color.neutral.950` → `color.slate-deep.dark.950` |
| `color.surface.canvas` | `birch.theme.light.color.surface.canvas` → `color.neutral.50` → `birch.theme.light.color.neutral.50` → `color.slate-deep.light.50` | `birch.theme.dark.color.surface.canvas` → `color.neutral.0` → `birch.theme.dark.color.neutral.0` → `color.slate-deep.dark.0` |
| `color.surface.default` | `birch.theme.light.color.surface.default` → `color.neutral.0` → `birch.theme.light.color.neutral.0` → `color.slate-deep.light.0` | `birch.theme.dark.color.surface.default` → `color.neutral.50` → `birch.theme.dark.color.neutral.50` → `color.slate-deep.dark.50` |
| `color.surface.raised` | `birch.theme.light.color.surface.raised` → `color.neutral.0` → `birch.theme.light.color.neutral.0` → `color.slate-deep.light.0` | `birch.theme.dark.color.surface.raised` → `color.neutral.50` → `birch.theme.dark.color.neutral.50` → `color.slate-deep.dark.50` |
| `color.surface.sunken` | `birch.theme.light.color.surface.sunken` → `color.neutral.100` → `birch.theme.light.color.neutral.100` → `color.slate-deep.light.100` | `birch.theme.dark.color.surface.sunken` → `color.neutral.100` → `birch.theme.dark.color.neutral.100` → `color.slate-deep.dark.100` |
| `color.surface.highlight` | `birch.theme.light.color.surface.highlight` → `color.neutral.100` → `birch.theme.light.color.neutral.100` → `color.slate-deep.light.100` | `birch.theme.dark.color.surface.highlight` → `color.neutral.100` → `birch.theme.dark.color.neutral.100` → `color.slate-deep.dark.100` |
| `color.surface.pressed` | `birch.theme.light.color.surface.pressed` → `color.neutral.200` → `birch.theme.light.color.neutral.200` → `color.slate-deep.light.200` | `birch.theme.dark.color.surface.pressed` → `color.neutral.200` → `birch.theme.dark.color.neutral.200` → `color.slate-deep.dark.200` |
| `color.surface.selected` | `birch.theme.light.color.surface.selected` → `color.purple.light.100` | `birch.theme.dark.color.surface.selected` → `color.purple.dark.100` |
| `color.surface.inverse` | `birch.theme.light.color.surface.inverse` → `color.neutral.900` → `birch.theme.light.color.neutral.900` → `color.slate-deep.light.900` | `birch.theme.dark.color.surface.inverse` → `color.neutral.900` → `birch.theme.dark.color.neutral.900` → `color.slate-deep.dark.900` |
| `color.surface.scrim` | `birch.theme.light.color.surface.scrim` → `color.black.light.scrim` | `birch.theme.dark.color.surface.scrim` → `color.black.dark.scrim` |
| `color.text.primary` | `birch.theme.light.color.text.primary` → `color.neutral.900` → `birch.theme.light.color.neutral.900` → `color.slate-deep.light.900` | `birch.theme.dark.color.text.primary` → `color.neutral.900` → `birch.theme.dark.color.neutral.900` → `color.slate-deep.dark.900` |
| `color.text.secondary` | `birch.theme.light.color.text.secondary` → `color.neutral.700` → `birch.theme.light.color.neutral.700` → `color.slate-deep.light.700` | `birch.theme.dark.color.text.secondary` → `color.neutral.500` → `birch.theme.dark.color.neutral.500` → `color.slate-deep.dark.500` |
| `color.text.muted` | `birch.theme.light.color.text.muted` → `color.neutral.600` → `birch.theme.light.color.neutral.600` → `color.slate-deep.light.600` | `birch.theme.dark.color.text.muted` → `color.neutral.400` → `birch.theme.dark.color.neutral.400` → `color.slate-deep.dark.400` |
| `color.text.inverse` | `birch.theme.light.color.text.inverse` → `color.text.on-dark` → `birch.theme.base.color.text.on-dark` → `color.slate-deep.light.0` | `birch.theme.dark.color.text.inverse` → `color.text.on-light` → `birch.theme.base.color.text.on-light` → `color.slate-deep.light.900` |
| `color.text.on-action` | `birch.theme.light.color.text.on-action` → `color.text.on-dark` → `birch.theme.base.color.text.on-dark` → `color.slate-deep.light.0` | `birch.theme.dark.color.text.on-action` → `color.text.on-light` → `birch.theme.base.color.text.on-light` → `color.slate-deep.light.900` |
| `color.text.link` | `birch.theme.light.color.text.link` → `color.purple.light.700` | `birch.theme.dark.color.text.link` → `color.purple.dark.700` |
| `color.text.on-danger` | `birch.theme.light.color.text.on-danger` → `color.text.on-dark` → `birch.theme.base.color.text.on-dark` → `color.slate-deep.light.0` | `birch.theme.dark.color.text.on-danger` → `color.text.on-light` → `birch.theme.base.color.text.on-light` → `color.slate-deep.light.900` |
| `color.text.on-light` | `birch.theme.base.color.text.on-light` → `color.slate-deep.light.900` | `birch.theme.base.color.text.on-light` → `color.slate-deep.light.900` |
| `color.text.on-dark` | `birch.theme.base.color.text.on-dark` → `color.slate-deep.light.0` | `birch.theme.base.color.text.on-dark` → `color.slate-deep.light.0` |
| `color.text.info-on-light` | `birch.theme.base.color.text.info-on-light` → `color.blue.light.800` | `birch.theme.base.color.text.info-on-light` → `color.blue.light.800` |
| `color.text.info-on-dark` | `birch.theme.base.color.text.info-on-dark` → `color.blue.light.100` | `birch.theme.base.color.text.info-on-dark` → `color.blue.light.100` |
| `color.text.success-on-light` | `birch.theme.base.color.text.success-on-light` → `color.green.light.800` | `birch.theme.base.color.text.success-on-light` → `color.green.light.800` |
| `color.text.success-on-dark` | `birch.theme.base.color.text.success-on-dark` → `color.green.light.100` | `birch.theme.base.color.text.success-on-dark` → `color.green.light.100` |
| `color.text.warning-on-light` | `birch.theme.base.color.text.warning-on-light` → `color.amber.light.800` | `birch.theme.base.color.text.warning-on-light` → `color.amber.light.800` |
| `color.text.warning-on-dark` | `birch.theme.base.color.text.warning-on-dark` → `color.amber.light.100` | `birch.theme.base.color.text.warning-on-dark` → `color.amber.light.100` |
| `color.text.danger-on-light` | `birch.theme.base.color.text.danger-on-light` → `color.red.light.800` | `birch.theme.base.color.text.danger-on-light` → `color.red.light.800` |
| `color.text.danger-on-dark` | `birch.theme.base.color.text.danger-on-dark` → `color.red.light.100` | `birch.theme.base.color.text.danger-on-dark` → `color.red.light.100` |
| `color.border.default` | `birch.theme.light.color.border.default` → `color.neutral.200` → `birch.theme.light.color.neutral.200` → `color.slate-deep.light.200` | `birch.theme.dark.color.border.default` → `color.neutral.200` → `birch.theme.dark.color.neutral.200` → `color.slate-deep.dark.200` |
| `color.border.strong` | `birch.theme.light.color.border.strong` → `color.neutral.500` → `birch.theme.light.color.neutral.500` → `color.slate-deep.light.500` | `birch.theme.dark.color.border.strong` → `color.neutral.400` → `birch.theme.dark.color.neutral.400` → `color.slate-deep.dark.400` |
| `color.border.focus` | `birch.theme.light.color.border.focus` → `color.purple.light.600` | `birch.theme.dark.color.border.focus` → `color.purple.dark.600` |
| `color.border.selected` | `birch.theme.light.color.border.selected` → `color.purple.light.600` | `birch.theme.dark.color.border.selected` → `color.purple.dark.600` |
| `color.action.primary.@` | `birch.theme.light.color.action.primary.@` → `color.purple.light.600` | `birch.theme.dark.color.action.primary.@` → `color.purple.dark.600` |
| `color.action.primary.hover` | `birch.theme.light.color.action.primary.hover` → `color.purple.light.700` | `birch.theme.dark.color.action.primary.hover` → `color.purple.dark.700` |
| `color.action.secondary.@` | `birch.theme.light.color.action.secondary.@` → `color.neutral.0` → `birch.theme.light.color.neutral.0` → `color.slate-deep.light.0` | `birch.theme.dark.color.action.secondary.@` → `color.neutral.50` → `birch.theme.dark.color.neutral.50` → `color.slate-deep.dark.50` |
| `color.action.secondary.hover` | `birch.theme.light.color.action.secondary.hover` → `color.neutral.100` → `birch.theme.light.color.neutral.100` → `color.slate-deep.light.100` | `birch.theme.dark.color.action.secondary.hover` → `color.neutral.100` → `birch.theme.dark.color.neutral.100` → `color.slate-deep.dark.100` |
| `color.action.danger.@` | `birch.theme.light.color.action.danger.@` → `color.red.light.600` | `birch.theme.dark.color.action.danger.@` → `color.red.dark.600` |
| `color.action.danger.hover` | `birch.theme.light.color.action.danger.hover` → `color.red.light.700` | `birch.theme.dark.color.action.danger.hover` → `color.red.dark.700` |
| `color.status.info.@` | `birch.theme.light.color.status.info.@` → `color.blue.light.600` | `birch.theme.dark.color.status.info.@` → `color.blue.dark.600` |
| `color.status.info.subtle` | `birch.theme.light.color.status.info.subtle` → `color.blue.light.100` | `birch.theme.dark.color.status.info.subtle` → `color.blue.dark.100` |
| `color.status.success.@` | `birch.theme.light.color.status.success.@` → `color.green.light.600` | `birch.theme.dark.color.status.success.@` → `color.green.dark.600` |
| `color.status.success.subtle` | `birch.theme.light.color.status.success.subtle` → `color.green.light.100` | `birch.theme.dark.color.status.success.subtle` → `color.green.dark.100` |
| `color.status.warning.@` | `birch.theme.light.color.status.warning.@` → `color.amber.light.600` | `birch.theme.dark.color.status.warning.@` → `color.amber.dark.600` |
| `color.status.warning.subtle` | `birch.theme.light.color.status.warning.subtle` → `color.amber.light.100` | `birch.theme.dark.color.status.warning.subtle` → `color.amber.dark.100` |
| `color.status.danger.@` | `birch.theme.light.color.status.danger.@` → `color.red.light.600` | `birch.theme.dark.color.status.danger.@` → `color.red.dark.600` |
| `color.status.danger.subtle` | `birch.theme.light.color.status.danger.subtle` → `color.red.light.100` | `birch.theme.dark.color.status.danger.subtle` → `color.red.dark.100` |
| `color.category.1.@` | `birch.theme.light.color.category.1.@` → `color.teal.light.600` | `birch.theme.dark.color.category.1.@` → `color.teal.dark.600` |
| `color.category.1.subtle` | `birch.theme.light.color.category.1.subtle` → `color.teal.light.100` | `birch.theme.dark.color.category.1.subtle` → `color.teal.dark.100` |
| `color.category.2.@` | `birch.theme.light.color.category.2.@` → `color.purple.light.600` | `birch.theme.dark.color.category.2.@` → `color.purple.dark.600` |
| `color.category.2.subtle` | `birch.theme.light.color.category.2.subtle` → `color.purple.light.100` | `birch.theme.dark.color.category.2.subtle` → `color.purple.dark.100` |
| `color.category.3.@` | `birch.theme.light.color.category.3.@` → `color.orange.light.600` | `birch.theme.dark.color.category.3.@` → `color.orange.dark.600` |
| `color.category.3.subtle` | `birch.theme.light.color.category.3.subtle` → `color.orange.light.100` | `birch.theme.dark.color.category.3.subtle` → `color.orange.dark.100` |
| `color.category.4.@` | `birch.theme.light.color.category.4.@` → `color.blue.light.600` | `birch.theme.dark.color.category.4.@` → `color.blue.dark.600` |
| `color.category.4.subtle` | `birch.theme.light.color.category.4.subtle` → `color.blue.light.100` | `birch.theme.dark.color.category.4.subtle` → `color.blue.dark.100` |
| `color.category.5.@` | `birch.theme.light.color.category.5.@` → `color.green.light.600` | `birch.theme.dark.color.category.5.@` → `color.green.dark.600` |
| `color.category.5.subtle` | `birch.theme.light.color.category.5.subtle` → `color.green.light.100` | `birch.theme.dark.color.category.5.subtle` → `color.green.dark.100` |
| `color.disabled.text` | `birch.theme.light.color.disabled.text` → `color.neutral.500` → `birch.theme.light.color.neutral.500` → `color.slate-deep.light.500` | `birch.theme.dark.color.disabled.text` → `color.neutral.500` → `birch.theme.dark.color.neutral.500` → `color.slate-deep.dark.500` |
| `color.disabled.surface` | `birch.theme.light.color.disabled.surface` → `color.neutral.100` → `birch.theme.light.color.neutral.100` → `color.slate-deep.light.100` | `birch.theme.dark.color.disabled.surface` → `color.neutral.100` → `birch.theme.dark.color.neutral.100` → `color.slate-deep.dark.100` |
| `color.disabled.border` | `birch.theme.light.color.disabled.border` → `color.neutral.200` → `birch.theme.light.color.neutral.200` → `color.slate-deep.light.200` | `birch.theme.dark.color.disabled.border` → `color.neutral.200` → `birch.theme.dark.color.neutral.200` → `color.slate-deep.dark.200` |
::::

::::brand{id="coral" name="Coral"}
| Token | Points to, light | Points to, dark |
| --- | --- | --- |
| `color.neutral.0` | `coral.theme.light.color.neutral.0` → `color.slate-deep.light.0` | `coral.theme.dark.color.neutral.0` → `color.slate-deep.dark.0` |
| `color.neutral.50` | `coral.theme.light.color.neutral.50` → `color.slate-deep.light.50` | `coral.theme.dark.color.neutral.50` → `color.slate-deep.dark.50` |
| `color.neutral.100` | `coral.theme.light.color.neutral.100` → `color.slate-deep.light.100` | `coral.theme.dark.color.neutral.100` → `color.slate-deep.dark.100` |
| `color.neutral.200` | `coral.theme.light.color.neutral.200` → `color.slate-deep.light.200` | `coral.theme.dark.color.neutral.200` → `color.slate-deep.dark.200` |
| `color.neutral.300` | `coral.theme.light.color.neutral.300` → `color.slate-deep.light.300` | `coral.theme.dark.color.neutral.300` → `color.slate-deep.dark.300` |
| `color.neutral.400` | `coral.theme.light.color.neutral.400` → `color.slate-deep.light.400` | `coral.theme.dark.color.neutral.400` → `color.slate-deep.dark.400` |
| `color.neutral.500` | `coral.theme.light.color.neutral.500` → `color.slate-deep.light.500` | `coral.theme.dark.color.neutral.500` → `color.slate-deep.dark.500` |
| `color.neutral.600` | `coral.theme.light.color.neutral.600` → `color.slate-deep.light.600` | `coral.theme.dark.color.neutral.600` → `color.slate-deep.dark.600` |
| `color.neutral.700` | `coral.theme.light.color.neutral.700` → `color.slate-deep.light.700` | `coral.theme.dark.color.neutral.700` → `color.slate-deep.dark.700` |
| `color.neutral.800` | `coral.theme.light.color.neutral.800` → `color.slate-deep.light.800` | `coral.theme.dark.color.neutral.800` → `color.slate-deep.dark.800` |
| `color.neutral.900` | `coral.theme.light.color.neutral.900` → `color.slate-deep.light.900` | `coral.theme.dark.color.neutral.900` → `color.slate-deep.dark.900` |
| `color.neutral.950` | `coral.theme.light.color.neutral.950` → `color.slate-deep.light.950` | `coral.theme.dark.color.neutral.950` → `color.slate-deep.dark.950` |
| `color.surface.canvas` | `coral.theme.light.color.surface.canvas` → `color.neutral.50` → `coral.theme.light.color.neutral.50` → `color.slate-deep.light.50` | `coral.theme.dark.color.surface.canvas` → `color.neutral.0` → `coral.theme.dark.color.neutral.0` → `color.slate-deep.dark.0` |
| `color.surface.default` | `coral.theme.light.color.surface.default` → `color.neutral.0` → `coral.theme.light.color.neutral.0` → `color.slate-deep.light.0` | `coral.theme.dark.color.surface.default` → `color.neutral.50` → `coral.theme.dark.color.neutral.50` → `color.slate-deep.dark.50` |
| `color.surface.raised` | `coral.theme.light.color.surface.raised` → `color.neutral.0` → `coral.theme.light.color.neutral.0` → `color.slate-deep.light.0` | `coral.theme.dark.color.surface.raised` → `color.neutral.50` → `coral.theme.dark.color.neutral.50` → `color.slate-deep.dark.50` |
| `color.surface.sunken` | `coral.theme.light.color.surface.sunken` → `color.neutral.100` → `coral.theme.light.color.neutral.100` → `color.slate-deep.light.100` | `coral.theme.dark.color.surface.sunken` → `color.neutral.100` → `coral.theme.dark.color.neutral.100` → `color.slate-deep.dark.100` |
| `color.surface.highlight` | `coral.theme.light.color.surface.highlight` → `color.neutral.100` → `coral.theme.light.color.neutral.100` → `color.slate-deep.light.100` | `coral.theme.dark.color.surface.highlight` → `color.neutral.100` → `coral.theme.dark.color.neutral.100` → `color.slate-deep.dark.100` |
| `color.surface.pressed` | `coral.theme.light.color.surface.pressed` → `color.neutral.200` → `coral.theme.light.color.neutral.200` → `color.slate-deep.light.200` | `coral.theme.dark.color.surface.pressed` → `color.neutral.200` → `coral.theme.dark.color.neutral.200` → `color.slate-deep.dark.200` |
| `color.surface.selected` | `coral.theme.light.color.surface.selected` → `color.orange.light.100` | `coral.theme.dark.color.surface.selected` → `color.orange.dark.100` |
| `color.surface.inverse` | `coral.theme.light.color.surface.inverse` → `color.neutral.900` → `coral.theme.light.color.neutral.900` → `color.slate-deep.light.900` | `coral.theme.dark.color.surface.inverse` → `color.neutral.900` → `coral.theme.dark.color.neutral.900` → `color.slate-deep.dark.900` |
| `color.surface.scrim` | `coral.theme.light.color.surface.scrim` → `color.black.light.scrim` | `coral.theme.dark.color.surface.scrim` → `color.black.dark.scrim` |
| `color.text.primary` | `coral.theme.light.color.text.primary` → `color.neutral.900` → `coral.theme.light.color.neutral.900` → `color.slate-deep.light.900` | `coral.theme.dark.color.text.primary` → `color.neutral.900` → `coral.theme.dark.color.neutral.900` → `color.slate-deep.dark.900` |
| `color.text.secondary` | `coral.theme.light.color.text.secondary` → `color.neutral.700` → `coral.theme.light.color.neutral.700` → `color.slate-deep.light.700` | `coral.theme.dark.color.text.secondary` → `color.neutral.500` → `coral.theme.dark.color.neutral.500` → `color.slate-deep.dark.500` |
| `color.text.muted` | `coral.theme.light.color.text.muted` → `color.neutral.600` → `coral.theme.light.color.neutral.600` → `color.slate-deep.light.600` | `coral.theme.dark.color.text.muted` → `color.neutral.400` → `coral.theme.dark.color.neutral.400` → `color.slate-deep.dark.400` |
| `color.text.inverse` | `coral.theme.light.color.text.inverse` → `color.text.on-dark` → `coral.theme.base.color.text.on-dark` → `color.slate-deep.light.0` | `coral.theme.dark.color.text.inverse` → `color.text.on-light` → `coral.theme.base.color.text.on-light` → `color.slate-deep.light.900` |
| `color.text.on-action` | `coral.theme.light.color.text.on-action` → `color.text.on-dark` → `coral.theme.base.color.text.on-dark` → `color.slate-deep.light.0` | `coral.theme.dark.color.text.on-action` → `color.text.on-light` → `coral.theme.base.color.text.on-light` → `color.slate-deep.light.900` |
| `color.text.link` | `coral.theme.light.color.text.link` → `color.orange.light.700` | `coral.theme.dark.color.text.link` → `color.orange.dark.700` |
| `color.text.on-danger` | `coral.theme.light.color.text.on-danger` → `color.text.on-dark` → `coral.theme.base.color.text.on-dark` → `color.slate-deep.light.0` | `coral.theme.dark.color.text.on-danger` → `color.text.on-light` → `coral.theme.base.color.text.on-light` → `color.slate-deep.light.900` |
| `color.text.on-light` | `coral.theme.base.color.text.on-light` → `color.slate-deep.light.900` | `coral.theme.base.color.text.on-light` → `color.slate-deep.light.900` |
| `color.text.on-dark` | `coral.theme.base.color.text.on-dark` → `color.slate-deep.light.0` | `coral.theme.base.color.text.on-dark` → `color.slate-deep.light.0` |
| `color.text.info-on-light` | `coral.theme.base.color.text.info-on-light` → `color.blue.light.800` | `coral.theme.base.color.text.info-on-light` → `color.blue.light.800` |
| `color.text.info-on-dark` | `coral.theme.base.color.text.info-on-dark` → `color.blue.light.100` | `coral.theme.base.color.text.info-on-dark` → `color.blue.light.100` |
| `color.text.success-on-light` | `coral.theme.base.color.text.success-on-light` → `color.green.light.800` | `coral.theme.base.color.text.success-on-light` → `color.green.light.800` |
| `color.text.success-on-dark` | `coral.theme.base.color.text.success-on-dark` → `color.green.light.100` | `coral.theme.base.color.text.success-on-dark` → `color.green.light.100` |
| `color.text.warning-on-light` | `coral.theme.base.color.text.warning-on-light` → `color.amber.light.800` | `coral.theme.base.color.text.warning-on-light` → `color.amber.light.800` |
| `color.text.warning-on-dark` | `coral.theme.base.color.text.warning-on-dark` → `color.amber.light.100` | `coral.theme.base.color.text.warning-on-dark` → `color.amber.light.100` |
| `color.text.danger-on-light` | `coral.theme.base.color.text.danger-on-light` → `color.red.light.800` | `coral.theme.base.color.text.danger-on-light` → `color.red.light.800` |
| `color.text.danger-on-dark` | `coral.theme.base.color.text.danger-on-dark` → `color.red.light.100` | `coral.theme.base.color.text.danger-on-dark` → `color.red.light.100` |
| `color.border.default` | `coral.theme.light.color.border.default` → `color.neutral.200` → `coral.theme.light.color.neutral.200` → `color.slate-deep.light.200` | `coral.theme.dark.color.border.default` → `color.neutral.200` → `coral.theme.dark.color.neutral.200` → `color.slate-deep.dark.200` |
| `color.border.strong` | `coral.theme.light.color.border.strong` → `color.neutral.500` → `coral.theme.light.color.neutral.500` → `color.slate-deep.light.500` | `coral.theme.dark.color.border.strong` → `color.neutral.400` → `coral.theme.dark.color.neutral.400` → `color.slate-deep.dark.400` |
| `color.border.focus` | `coral.theme.light.color.border.focus` → `color.orange.light.600` | `coral.theme.dark.color.border.focus` → `color.orange.dark.600` |
| `color.border.selected` | `coral.theme.light.color.border.selected` → `color.orange.light.600` | `coral.theme.dark.color.border.selected` → `color.orange.dark.600` |
| `color.action.primary.@` | `coral.theme.light.color.action.primary.@` → `color.orange.light.600` | `coral.theme.dark.color.action.primary.@` → `color.orange.dark.600` |
| `color.action.primary.hover` | `coral.theme.light.color.action.primary.hover` → `color.orange.light.700` | `coral.theme.dark.color.action.primary.hover` → `color.orange.dark.700` |
| `color.action.secondary.@` | `coral.theme.light.color.action.secondary.@` → `color.neutral.0` → `coral.theme.light.color.neutral.0` → `color.slate-deep.light.0` | `coral.theme.dark.color.action.secondary.@` → `color.neutral.50` → `coral.theme.dark.color.neutral.50` → `color.slate-deep.dark.50` |
| `color.action.secondary.hover` | `coral.theme.light.color.action.secondary.hover` → `color.neutral.100` → `coral.theme.light.color.neutral.100` → `color.slate-deep.light.100` | `coral.theme.dark.color.action.secondary.hover` → `color.neutral.100` → `coral.theme.dark.color.neutral.100` → `color.slate-deep.dark.100` |
| `color.action.danger.@` | `coral.theme.light.color.action.danger.@` → `color.red.light.600` | `coral.theme.dark.color.action.danger.@` → `color.red.dark.600` |
| `color.action.danger.hover` | `coral.theme.light.color.action.danger.hover` → `color.red.light.700` | `coral.theme.dark.color.action.danger.hover` → `color.red.dark.700` |
| `color.status.info.@` | `coral.theme.light.color.status.info.@` → `color.blue.light.600` | `coral.theme.dark.color.status.info.@` → `color.blue.dark.600` |
| `color.status.info.subtle` | `coral.theme.light.color.status.info.subtle` → `color.blue.light.100` | `coral.theme.dark.color.status.info.subtle` → `color.blue.dark.100` |
| `color.status.success.@` | `coral.theme.light.color.status.success.@` → `color.green.light.600` | `coral.theme.dark.color.status.success.@` → `color.green.dark.600` |
| `color.status.success.subtle` | `coral.theme.light.color.status.success.subtle` → `color.green.light.100` | `coral.theme.dark.color.status.success.subtle` → `color.green.dark.100` |
| `color.status.warning.@` | `coral.theme.light.color.status.warning.@` → `color.amber.light.600` | `coral.theme.dark.color.status.warning.@` → `color.amber.dark.600` |
| `color.status.warning.subtle` | `coral.theme.light.color.status.warning.subtle` → `color.amber.light.100` | `coral.theme.dark.color.status.warning.subtle` → `color.amber.dark.100` |
| `color.status.danger.@` | `coral.theme.light.color.status.danger.@` → `color.red.light.600` | `coral.theme.dark.color.status.danger.@` → `color.red.dark.600` |
| `color.status.danger.subtle` | `coral.theme.light.color.status.danger.subtle` → `color.red.light.100` | `coral.theme.dark.color.status.danger.subtle` → `color.red.dark.100` |
| `color.category.1.@` | `coral.theme.light.color.category.1.@` → `color.teal.light.600` | `coral.theme.dark.color.category.1.@` → `color.teal.dark.600` |
| `color.category.1.subtle` | `coral.theme.light.color.category.1.subtle` → `color.teal.light.100` | `coral.theme.dark.color.category.1.subtle` → `color.teal.dark.100` |
| `color.category.2.@` | `coral.theme.light.color.category.2.@` → `color.purple.light.600` | `coral.theme.dark.color.category.2.@` → `color.purple.dark.600` |
| `color.category.2.subtle` | `coral.theme.light.color.category.2.subtle` → `color.purple.light.100` | `coral.theme.dark.color.category.2.subtle` → `color.purple.dark.100` |
| `color.category.3.@` | `coral.theme.light.color.category.3.@` → `color.orange.light.600` | `coral.theme.dark.color.category.3.@` → `color.orange.dark.600` |
| `color.category.3.subtle` | `coral.theme.light.color.category.3.subtle` → `color.orange.light.100` | `coral.theme.dark.color.category.3.subtle` → `color.orange.dark.100` |
| `color.category.4.@` | `coral.theme.light.color.category.4.@` → `color.blue.light.600` | `coral.theme.dark.color.category.4.@` → `color.blue.dark.600` |
| `color.category.4.subtle` | `coral.theme.light.color.category.4.subtle` → `color.blue.light.100` | `coral.theme.dark.color.category.4.subtle` → `color.blue.dark.100` |
| `color.category.5.@` | `coral.theme.light.color.category.5.@` → `color.green.light.600` | `coral.theme.dark.color.category.5.@` → `color.green.dark.600` |
| `color.category.5.subtle` | `coral.theme.light.color.category.5.subtle` → `color.green.light.100` | `coral.theme.dark.color.category.5.subtle` → `color.green.dark.100` |
| `color.disabled.text` | `coral.theme.light.color.disabled.text` → `color.neutral.500` → `coral.theme.light.color.neutral.500` → `color.slate-deep.light.500` | `coral.theme.dark.color.disabled.text` → `color.neutral.500` → `coral.theme.dark.color.neutral.500` → `color.slate-deep.dark.500` |
| `color.disabled.surface` | `coral.theme.light.color.disabled.surface` → `color.neutral.100` → `coral.theme.light.color.neutral.100` → `color.slate-deep.light.100` | `coral.theme.dark.color.disabled.surface` → `color.neutral.100` → `coral.theme.dark.color.neutral.100` → `color.slate-deep.dark.100` |
| `color.disabled.border` | `coral.theme.light.color.disabled.border` → `color.neutral.200` → `coral.theme.light.color.neutral.200` → `color.slate-deep.light.200` | `coral.theme.dark.color.disabled.border` → `color.neutral.200` → `coral.theme.dark.color.neutral.200` → `color.slate-deep.dark.200` |
::::

The raw values these tokens end at are on [Primitives › Color](../primitives/color).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| A selected row or item | color.surface.selected (from the brand) | A fixed blue | Selection follows the brand color. |
| An error message | color.status.danger and a sentence | The brand color | Status colors are shared, never branded. |
| A link | color.text.link (from the brand) | A fixed blue | Links take the brand's color, so they look native in each brand. A fixed blue would clash with some brands. |
| A status | Badge with a word | A brand color as status | Brand hues vary, so meaning needs a word. |
| The action that completes the task | Button primary, one per view | Two primaries | One clear action per view. Two primaries split attention. |
| An alternative or cancel | Button secondary | A second primary | The alternative steps back, so the one primary stays clear. A second primary would compete with it. |
| Delete or remove | Button secondary, then confirm with Button danger | Button primary | Confirm before destroying data. |

## Status urgency

Status colors go up in urgency: info, then warning, then danger. Pick the level that matches the real risk. Never go up a level to get attention. Success sits outside the order.

`color.status.info.@` → `color.status.warning.@` → `color.status.danger.@`

## Surfaces: when, and for what effect

A surface tells people where they are in depth, or which item they are on. Each one has a job; using the wrong one breaks the reading order.

| Surface | Its job | Use it for | Not for |
| --- | --- | --- | --- |
| :sample{kind="dot" value="var(--color-surface-canvas)"} **Canvas** | The page background behind everything. | Page and app background | Cards and panels on the page: `color.surface.default` |
| :sample{kind="dot" value="var(--color-surface-default)"} **Default** | The base fill for content. | Cards, Panels, Inputs, Table body | The page behind content: `color.surface.canvas`; Menus and popovers above content: `color.surface.raised` |
| :sample{kind="dot" value="var(--color-surface-raised)"} **Raised** | Fills that float above content. | Menus, Popovers, Dialogs | Cards in the page flow: `color.surface.default` |
| :sample{kind="dot" value="var(--color-surface-sunken)"} **Sunken** | A recessed fill, a step below content. | Table headers, Wells | A selected item: `color.surface.selected`; An item the pointer or the keyboard is on: `color.surface.highlight` |
| :sample{kind="dot" value="var(--color-surface-highlight)"} **Highlight** | The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark. | Highlighted menu items, Highlighted options, Hover rows, Open submenu triggers | Table headers and wells: `color.surface.sunken`; A selected or current item: `color.surface.selected` |
| :sample{kind="dot" value="var(--color-surface-pressed)"} **Pressed** | The fill of an item while it is pressed. Where the scheme gives pressed its own value, one step past the highlight; where pressed reuses hover, the highlight's step. | Pressed menu buttons, Pressed list items | The item the pointer or the keyboard is on: `color.surface.highlight` |
| :sample{kind="dot" value="var(--color-surface-selected)"} **Selected** | The fill of a selected or current item, or a toggle that is on. | Selected rows, Current menu item, Toggles that are on | Hover: `color.surface.sunken`; The main action: `color.action.primary.@` |
| :sample{kind="dot" value="var(--color-surface-inverse)"} **Inverse** | A reversed fill for small, short-lived messages. | Tooltips, Toasts | Large areas: `color.surface.default` |
| :sample{kind="dot" value="var(--color-surface-scrim)"} **Scrim** | The see-through layer behind a modal. | Behind dialogs and sheets | A solid fill: `color.surface.raised` |

## What each color is for

| Token | What it is for | Not for |
| --- | --- | --- |
| `color.surface.canvas` | The page background behind everything. | Cards and panels on the page: `color.surface.default` |
| `color.surface.default` | The base fill for content. | The page behind content: `color.surface.canvas`; Menus and popovers above content: `color.surface.raised` |
| `color.surface.raised` | Fills that float above content. | Cards in the page flow: `color.surface.default` |
| `color.surface.sunken` | A recessed fill, a step below content. | A selected item: `color.surface.selected`; An item the pointer or the keyboard is on: `color.surface.highlight` |
| `color.surface.highlight` | The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark. | Table headers and wells: `color.surface.sunken`; A selected or current item: `color.surface.selected` |
| `color.surface.pressed` | The fill of an item while it is pressed. Where the scheme gives pressed its own value, one step past the highlight; where pressed reuses hover, the highlight's step. | The item the pointer or the keyboard is on: `color.surface.highlight` |
| `color.surface.selected` | The fill of a selected or current item, or a toggle that is on. | Hover: `color.surface.sunken`; The main action: `color.action.primary.@` |
| `color.surface.inverse` | A reversed fill for small, short-lived messages. | Large areas: `color.surface.default` |
| `color.surface.scrim` | The see-through layer behind a modal. | A solid fill: `color.surface.raised` |
| `color.text.primary` | Body text and headings. | Text on the main action: `color.text.on-action`; Text on an inverse fill: `color.text.inverse` |
| `color.text.secondary` | Supporting text. | The main content: `color.text.primary` |
| `color.text.muted` | The quietest text. | Anything people must read to act: `color.text.secondary`; A disabled control: `color.disabled.text` |
| `color.text.inverse` | Text on an inverse fill. | Text on the page: `color.text.primary` |
| `color.text.on-light` | Text on any fill whose tone is light, in either mode: the light mode's body text. | Text on the page's own surfaces: `color.text.primary` |
| `color.text.on-dark` | Text on any fill whose tone is dark, in either mode: white. | Text on the page's own surfaces: `color.text.primary` |
| `color.text.info-on-light` | The label on a light info fill, such as its tint in light mode: a fixed color from the light scale (800). | Info text on the page: `color.status.info.@` |
| `color.text.info-on-dark` | The label on a dark info fill, such as its tint in dark mode: a fixed color from the light scale (100, adjusted so its hue shows). | Info text on the page: `color.status.info.@` |
| `color.text.success-on-light` | The label on a light success fill, such as its tint in light mode: a fixed color from the light scale (800). | Success text on the page: `color.status.success.@` |
| `color.text.success-on-dark` | The label on a dark success fill, such as its tint in dark mode: a fixed color from the light scale (100, adjusted so its hue shows). | Success text on the page: `color.status.success.@` |
| `color.text.warning-on-light` | The label on a light warning fill, such as its tint in light mode: a fixed color from the light scale (800). | Warning text on the page: `color.status.warning.@` |
| `color.text.warning-on-dark` | The label on a dark warning fill, such as its tint in dark mode: a fixed color from the light scale (100, adjusted so its hue shows). | Warning text on the page: `color.status.warning.@` |
| `color.text.danger-on-light` | The label on a light danger fill, such as its tint in light mode: a fixed color from the light scale (800). | Danger text on the page: `color.status.danger.@` |
| `color.text.danger-on-dark` | The label on a dark danger fill, such as its tint in dark mode: a fixed color from the light scale (100, adjusted so its hue shows). | Danger text on the page: `color.status.danger.@` |
| `color.text.on-action` | Text and icons on the main action's fill. | Text on the page: `color.text.primary` |
| `color.text.on-danger` | Text on the danger fill: its tone's main text. | Text on the main action: `color.text.on-action` |
| `color.text.link` | Links in running text. | Buttons: `color.action.primary.@` |
| `color.border.default` | Quiet edges and dividers. Decorative, so it has no contrast minimum. | The edge of a control people must find: `color.border.strong` |
| `color.border.strong` | The edge of a control people must find. | A divider: `color.border.default` |
| `color.border.focus` | The focus ring. | A selected item: `color.surface.selected` |
| `color.border.selected` | The edge that marks a selected item, beside its fill, so selection is never color alone. | Keyboard focus: `color.border.focus`; The fill of a selected item: `color.surface.selected` |
| `color.action.primary.@` | The one main action in a view. | A second action in the same view: `color.action.secondary.@`; Links in text: `color.text.link`; News or status: `color.status.info.@` |
| `color.action.primary.hover` | The main action under the pointer. | The resting state: `color.action.primary.@` |
| `color.action.secondary.@` | The fill of other actions. | The main action: `color.action.primary.@` |
| `color.action.secondary.hover` | Other actions under the pointer. | The resting state: `color.action.secondary.@` |
| `color.action.danger.@` | The fill of a destructive commit: the confirm of a delete. | The first step of a delete: `color.action.secondary.@`; An error message: `color.status.danger.@` |
| `color.action.danger.hover` | The danger fill on hover. | The resting fill: `color.action.danger.@` |
| `color.status.info.@` | Neutral news: something changed and no action is needed. The lowest level of the urgency order. | Something needs a check: `color.status.warning.@`; The main action: `color.action.primary.@`; The info badge label: `color.text.info-on-light` |
| `color.status.info.subtle` | The fill behind info status. | Large page areas: `color.surface.default` |
| `color.status.warning.@` | Caution: something may go wrong or needs a check, and it can be fixed. | An error, or an action that cannot be undone: `color.status.danger.@`; News that needs no action: `color.status.info.@`; The warning badge label: `color.text.warning-on-light` |
| `color.status.warning.subtle` | The fill behind warning status. | Large page areas: `color.surface.default` |
| `color.status.danger.@` | Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out. | Caution or advice: `color.status.warning.@`; Getting attention: `color.status.info.@`; The danger badge label: `color.text.danger-on-light` |
| `color.status.danger.subtle` | The fill behind danger status. | Large page areas: `color.surface.default` |
| `color.status.success.@` | Confirmation that something worked. It sits outside the urgency order. | The main action: `color.action.primary.@`; Brand color: `color.action.primary.@`; The success badge label: `color.text.success-on-light` |
| `color.status.success.subtle` | The fill behind success status. | Large page areas: `color.surface.default` |
| `color.category.1.@` | Category 1: tells one item or series from another. It carries no meaning. | Status or risk: `color.status.warning.@`; Tag text: `color.text.primary` |
| `color.category.1.subtle` | Category 1: the fill of a tag. | A status badge: `color.status.info.subtle` |
| `color.category.2.@` | Category 2: tells one item or series from another. It carries no meaning. | Status or risk: `color.status.warning.@`; Tag text: `color.text.primary` |
| `color.category.2.subtle` | Category 2: the fill of a tag. | A status badge: `color.status.info.subtle` |
| `color.category.3.@` | Category 3: tells one item or series from another. It carries no meaning. | Status or risk: `color.status.warning.@`; Tag text: `color.text.primary` |
| `color.category.3.subtle` | Category 3: the fill of a tag. | A status badge: `color.status.info.subtle` |
| `color.category.4.@` | Category 4: tells one item or series from another. It carries no meaning. | Status or risk: `color.status.warning.@`; Tag text: `color.text.primary` |
| `color.category.4.subtle` | Category 4: the fill of a tag. | A status badge: `color.status.info.subtle` |
| `color.category.5.@` | Category 5: tells one item or series from another. It carries no meaning. | Status or risk: `color.status.warning.@`; Tag text: `color.text.primary` |
| `color.category.5.subtle` | Category 5: the fill of a tag. | A status badge: `color.status.info.subtle` |
| `color.disabled.text` | Text and icons of a control that cannot be used right now. | Quiet text that still works: `color.text.muted` |
| `color.disabled.surface` | The fill of a control that cannot be used right now. | A quiet fill that still works: `color.surface.sunken` |
| `color.disabled.border` | The edge of a control that cannot be used right now. | An enabled control: `color.border.strong` |

## Pairs at a glance

Which text may sit on which fill, and the contrast it keeps there. Each fill is shown in its own color, with every text that may sit on it. Fills are grouped by their tone in each mode: light fills take `color.text.on-light`, dark fills take `color.text.on-dark`. The harness checks every pair.

::::brand{id="aster" name="Aster"}
::pairs-chart{id="aster"}
::::

::::brand{id="birch" name="Birch"}
::pairs-chart{id="birch"}
::::

::::brand{id="coral" name="Coral"}
::pairs-chart{id="coral"}
::::

## The tone of each fill

Every fill says whether it is light or dark, in each mode, and that picks the text on it. A fill can change tone between modes: the same token, the other text.

::::brand{id="aster" name="Aster"}
Every fill changes tone between light and dark mode.

| Fill | Light mode | Dark mode |
| --- | --- | --- |
| `surface.canvas` | :sample{kind="tone" value="#F8FAFC" ink="#0F172A"} light | :sample{kind="tone" value="#020617" ink="#FFFFFF"} dark |
| `surface.default` | :sample{kind="tone" value="#FFFFFF" ink="#0F172A"} light | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} dark |
| `surface.raised` | :sample{kind="tone" value="#FFFFFF" ink="#0F172A"} light | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} dark |
| `surface.sunken` | :sample{kind="tone" value="#F1F5F9" ink="#0F172A"} light | :sample{kind="tone" value="#1E293B" ink="#FFFFFF"} dark |
| `surface.highlight` | :sample{kind="tone" value="#F1F5F9" ink="#0F172A"} light | :sample{kind="tone" value="#1E293B" ink="#FFFFFF"} dark |
| `surface.pressed` | :sample{kind="tone" value="#E2E8F0" ink="#0F172A"} light | :sample{kind="tone" value="#334155" ink="#FFFFFF"} dark |
| `surface.selected` | :sample{kind="tone" value="#DEF3F0" ink="#0F172A"} light | :sample{kind="tone" value="#012C28" ink="#FFFFFF"} dark |
| `surface.inverse` | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} dark | :sample{kind="tone" value="#F8FAFC" ink="#0F172A"} light |
| `action.primary` | :sample{kind="tone" value="#0F766E" ink="#FFFFFF"} dark | :sample{kind="tone" value="#7FCFC6" ink="#0F172A"} light |
| `action.primary.hover` | :sample{kind="tone" value="#015852" ink="#FFFFFF"} dark | :sample{kind="tone" value="#A1DCD4" ink="#0F172A"} light |
| `action.danger` | :sample{kind="tone" value="#C42B2B" ink="#FFFFFF"} dark | :sample{kind="tone" value="#F28B8B" ink="#0F172A"} light |
| `action.danger.hover` | :sample{kind="tone" value="#981519" ink="#FFFFFF"} dark | :sample{kind="tone" value="#FAA9A8" ink="#0F172A"} light |
| `action.secondary` | :sample{kind="tone" value="#FFFFFF" ink="#0F172A"} light | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} dark |
| `action.secondary.hover` | :sample{kind="tone" value="#F1F5F9" ink="#0F172A"} light | :sample{kind="tone" value="#1E293B" ink="#FFFFFF"} dark |
| `status.info.subtle` | :sample{kind="tone" value="#D3E4FF" ink="#0F172A"} light | :sample{kind="tone" value="#0D2244" ink="#FFFFFF"} dark |
| `status.warning.subtle` | :sample{kind="tone" value="#FEE8CF" ink="#0F172A"} light | :sample{kind="tone" value="#332201" ink="#FFFFFF"} dark |
| `status.danger.subtle` | :sample{kind="tone" value="#FFDBD8" ink="#0F172A"} light | :sample{kind="tone" value="#410C11" ink="#FFFFFF"} dark |
| `status.success.subtle` | :sample{kind="tone" value="#DBF7DF" ink="#0F172A"} light | :sample{kind="tone" value="#012A14" ink="#FFFFFF"} dark |
::::

::::brand{id="birch" name="Birch"}
Every fill changes tone between light and dark mode.

| Fill | Light mode | Dark mode |
| --- | --- | --- |
| `surface.canvas` | :sample{kind="tone" value="#F8FAFC" ink="#0F172A"} light | :sample{kind="tone" value="#020617" ink="#FFFFFF"} dark |
| `surface.default` | :sample{kind="tone" value="#FFFFFF" ink="#0F172A"} light | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} dark |
| `surface.raised` | :sample{kind="tone" value="#FFFFFF" ink="#0F172A"} light | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} dark |
| `surface.sunken` | :sample{kind="tone" value="#F1F5F9" ink="#0F172A"} light | :sample{kind="tone" value="#1E293B" ink="#FFFFFF"} dark |
| `surface.highlight` | :sample{kind="tone" value="#F1F5F9" ink="#0F172A"} light | :sample{kind="tone" value="#1E293B" ink="#FFFFFF"} dark |
| `surface.pressed` | :sample{kind="tone" value="#E2E8F0" ink="#0F172A"} light | :sample{kind="tone" value="#334155" ink="#FFFFFF"} dark |
| `surface.selected` | :sample{kind="tone" value="#EDEAFE" ink="#0F172A"} light | :sample{kind="tone" value="#271745" ink="#FFFFFF"} dark |
| `surface.inverse` | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} dark | :sample{kind="tone" value="#F8FAFC" ink="#0F172A"} light |
| `action.primary` | :sample{kind="tone" value="#6D28D9" ink="#FFFFFF"} dark | :sample{kind="tone" value="#B79DF7" ink="#0F172A"} light |
| `action.primary.hover` | :sample{kind="tone" value="#5212AA" ink="#FFFFFF"} dark | :sample{kind="tone" value="#C9B7FC" ink="#0F172A"} light |
| `action.danger` | :sample{kind="tone" value="#C42B2B" ink="#FFFFFF"} dark | :sample{kind="tone" value="#F28B8B" ink="#0F172A"} light |
| `action.danger.hover` | :sample{kind="tone" value="#981519" ink="#FFFFFF"} dark | :sample{kind="tone" value="#FAA9A8" ink="#0F172A"} light |
| `action.secondary` | :sample{kind="tone" value="#FFFFFF" ink="#0F172A"} light | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} dark |
| `action.secondary.hover` | :sample{kind="tone" value="#F1F5F9" ink="#0F172A"} light | :sample{kind="tone" value="#1E293B" ink="#FFFFFF"} dark |
| `status.info.subtle` | :sample{kind="tone" value="#D3E4FF" ink="#0F172A"} light | :sample{kind="tone" value="#0D2244" ink="#FFFFFF"} dark |
| `status.warning.subtle` | :sample{kind="tone" value="#FEE8CF" ink="#0F172A"} light | :sample{kind="tone" value="#332201" ink="#FFFFFF"} dark |
| `status.danger.subtle` | :sample{kind="tone" value="#FFDBD8" ink="#0F172A"} light | :sample{kind="tone" value="#410C11" ink="#FFFFFF"} dark |
| `status.success.subtle` | :sample{kind="tone" value="#DBF7DF" ink="#0F172A"} light | :sample{kind="tone" value="#012A14" ink="#FFFFFF"} dark |
::::

::::brand{id="coral" name="Coral"}
Every fill changes tone between light and dark mode.

| Fill | Light mode | Dark mode |
| --- | --- | --- |
| `surface.canvas` | :sample{kind="tone" value="#F8FAFC" ink="#0F172A"} light | :sample{kind="tone" value="#020617" ink="#FFFFFF"} dark |
| `surface.default` | :sample{kind="tone" value="#FFFFFF" ink="#0F172A"} light | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} dark |
| `surface.raised` | :sample{kind="tone" value="#FFFFFF" ink="#0F172A"} light | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} dark |
| `surface.sunken` | :sample{kind="tone" value="#F1F5F9" ink="#0F172A"} light | :sample{kind="tone" value="#1E293B" ink="#FFFFFF"} dark |
| `surface.highlight` | :sample{kind="tone" value="#F1F5F9" ink="#0F172A"} light | :sample{kind="tone" value="#1E293B" ink="#FFFFFF"} dark |
| `surface.pressed` | :sample{kind="tone" value="#E2E8F0" ink="#0F172A"} light | :sample{kind="tone" value="#334155" ink="#FFFFFF"} dark |
| `surface.selected` | :sample{kind="tone" value="#FEEBE4" ink="#0F172A"} light | :sample{kind="tone" value="#3F1702" ink="#FFFFFF"} dark |
| `surface.inverse` | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} dark | :sample{kind="tone" value="#F8FAFC" ink="#0F172A"} light |
| `action.primary` | :sample{kind="tone" value="#C2410C" ink="#FFFFFF"} dark · waits for OD-225 | :sample{kind="tone" value="#F7A67F" ink="#0F172A"} light · waits for OD-225 |
| `action.primary.hover` | :sample{kind="tone" value="#942D02" ink="#FFFFFF"} dark | :sample{kind="tone" value="#FCBD9F" ink="#0F172A"} light |
| `action.danger` | :sample{kind="tone" value="#C42B2B" ink="#FFFFFF"} dark | :sample{kind="tone" value="#F28B8B" ink="#0F172A"} light |
| `action.danger.hover` | :sample{kind="tone" value="#981519" ink="#FFFFFF"} dark | :sample{kind="tone" value="#FAA9A8" ink="#0F172A"} light |
| `action.secondary` | :sample{kind="tone" value="#FFFFFF" ink="#0F172A"} light | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} dark |
| `action.secondary.hover` | :sample{kind="tone" value="#F1F5F9" ink="#0F172A"} light | :sample{kind="tone" value="#1E293B" ink="#FFFFFF"} dark |
| `status.info.subtle` | :sample{kind="tone" value="#D3E4FF" ink="#0F172A"} light | :sample{kind="tone" value="#0D2244" ink="#FFFFFF"} dark |
| `status.warning.subtle` | :sample{kind="tone" value="#FEE8CF" ink="#0F172A"} light | :sample{kind="tone" value="#332201" ink="#FFFFFF"} dark |
| `status.danger.subtle` | :sample{kind="tone" value="#FFDBD8" ink="#0F172A"} light | :sample{kind="tone" value="#410C11" ink="#FFFFFF"} dark |
| `status.success.subtle` | :sample{kind="tone" value="#DBF7DF" ink="#0F172A"} light | :sample{kind="tone" value="#012A14" ink="#FFFFFF"} dark |
::::
