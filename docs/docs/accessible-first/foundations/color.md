---
composite_data: "./color.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 2
title: "Color"
description: "Accessible first: How color carries action, state and brand."
---

# Color

How color carries action, state and brand.

::token-swatches{id="color"}

::color-keys{id="default"}

## Surfaces

The canvas, then the surfaces content sits on, in light and dark.

::surface-stack{id="default"}

## Status colors in use

Each status label always gets the same color, with its dot, so color is never the only cue. The ratio is the status color on its subtle fill, computed from the tokens.

::status-colors{id="default"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which color roles does it need? | Surface, text, action and status | Few color roles, each with one clear meaning. |
| How many emphasis levels do actions need? | Two | Primary and secondary only; fewer choices, fewer errors. |
| How is the palette defined? | Neutrals and one brand ramp | True neutrals and one strong blue, checked for contrast. |
| How saturated is the palette? | Balanced | Strong but not loud color. |
| Where does color carry meaning first? | Links and actions | Links and actions must be found by everyone. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to, light | Points to, dark |
| --- | --- | --- |
| `color.neutral.0` | `accessible-first.theme.light.color.neutral.0` → `color.gray.light.0` | `accessible-first.theme.dark.color.neutral.0` → `color.gray.dark.0` |
| `color.neutral.50` | `accessible-first.theme.light.color.neutral.50` → `color.gray.light.50` | `accessible-first.theme.dark.color.neutral.50` → `color.gray.dark.50` |
| `color.neutral.100` | `accessible-first.theme.light.color.neutral.100` → `color.gray.light.100` | `accessible-first.theme.dark.color.neutral.100` → `color.gray.dark.100` |
| `color.neutral.200` | `accessible-first.theme.light.color.neutral.200` → `color.gray.light.200` | `accessible-first.theme.dark.color.neutral.200` → `color.gray.dark.200` |
| `color.neutral.300` | `accessible-first.theme.light.color.neutral.300` → `color.gray.light.300` | `accessible-first.theme.dark.color.neutral.300` → `color.gray.dark.300` |
| `color.neutral.400` | `accessible-first.theme.light.color.neutral.400` → `color.gray.light.400` | `accessible-first.theme.dark.color.neutral.400` → `color.gray.dark.400` |
| `color.neutral.500` | `accessible-first.theme.light.color.neutral.500` → `color.gray.light.500` | `accessible-first.theme.dark.color.neutral.500` → `color.gray.dark.500` |
| `color.neutral.600` | `accessible-first.theme.light.color.neutral.600` → `color.gray.light.600` | `accessible-first.theme.dark.color.neutral.600` → `color.gray.dark.600` |
| `color.neutral.700` | `accessible-first.theme.light.color.neutral.700` → `color.gray.light.700` | `accessible-first.theme.dark.color.neutral.700` → `color.gray.dark.700` |
| `color.neutral.800` | `accessible-first.theme.light.color.neutral.800` → `color.gray.light.800` | `accessible-first.theme.dark.color.neutral.800` → `color.gray.dark.800` |
| `color.neutral.900` | `accessible-first.theme.light.color.neutral.900` → `color.gray.light.900` | `accessible-first.theme.dark.color.neutral.900` → `color.gray.dark.900` |
| `color.neutral.950` | `accessible-first.theme.light.color.neutral.950` → `color.gray.light.950` | `accessible-first.theme.dark.color.neutral.950` → `color.gray.dark.950` |
| `color.surface.canvas` | `accessible-first.theme.light.color.surface.canvas` → `color.neutral.50` → `accessible-first.theme.light.color.neutral.50` → `color.gray.light.50` | `accessible-first.theme.dark.color.surface.canvas` → `color.neutral.0` → `accessible-first.theme.dark.color.neutral.0` → `color.gray.dark.0` |
| `color.surface.default` | `accessible-first.theme.light.color.surface.default` → `color.neutral.0` → `accessible-first.theme.light.color.neutral.0` → `color.gray.light.0` | `accessible-first.theme.dark.color.surface.default` → `color.neutral.50` → `accessible-first.theme.dark.color.neutral.50` → `color.gray.dark.50` |
| `color.surface.raised` | `accessible-first.theme.light.color.surface.raised` → `color.neutral.0` → `accessible-first.theme.light.color.neutral.0` → `color.gray.light.0` | `accessible-first.theme.dark.color.surface.raised` → `color.neutral.50` → `accessible-first.theme.dark.color.neutral.50` → `color.gray.dark.50` |
| `color.surface.sunken` | `accessible-first.theme.light.color.surface.sunken` → `color.neutral.100` → `accessible-first.theme.light.color.neutral.100` → `color.gray.light.100` | `accessible-first.theme.dark.color.surface.sunken` → `color.neutral.100` → `accessible-first.theme.dark.color.neutral.100` → `color.gray.dark.100` |
| `color.surface.highlight` | `accessible-first.theme.light.color.surface.highlight` → `color.neutral.100` → `accessible-first.theme.light.color.neutral.100` → `color.gray.light.100` | `accessible-first.theme.dark.color.surface.highlight` → `color.neutral.100` → `accessible-first.theme.dark.color.neutral.100` → `color.gray.dark.100` |
| `color.surface.pressed` | `accessible-first.theme.light.color.surface.pressed` → `color.neutral.200` → `accessible-first.theme.light.color.neutral.200` → `color.gray.light.200` | `accessible-first.theme.dark.color.surface.pressed` → `color.neutral.200` → `accessible-first.theme.dark.color.neutral.200` → `color.gray.dark.200` |
| `color.surface.selected` | `accessible-first.theme.light.color.surface.selected` → `color.blue.light.100` | `accessible-first.theme.dark.color.surface.selected` → `color.blue.dark.100` |
| `color.surface.inverse` | `accessible-first.theme.light.color.surface.inverse` → `color.neutral.900` → `accessible-first.theme.light.color.neutral.900` → `color.gray.light.900` | `accessible-first.theme.dark.color.surface.inverse` → `color.neutral.900` → `accessible-first.theme.dark.color.neutral.900` → `color.gray.dark.900` |
| `color.surface.scrim` | `accessible-first.theme.light.color.surface.scrim` → `color.black.light.scrim` | `accessible-first.theme.dark.color.surface.scrim` → `color.black.dark.scrim` |
| `color.text.primary` | `accessible-first.theme.light.color.text.primary` → `color.neutral.900` → `accessible-first.theme.light.color.neutral.900` → `color.gray.light.900` | `accessible-first.theme.dark.color.text.primary` → `color.neutral.900` → `accessible-first.theme.dark.color.neutral.900` → `color.gray.dark.900` |
| `color.text.secondary` | `accessible-first.theme.light.color.text.secondary` → `color.neutral.700` → `accessible-first.theme.light.color.neutral.700` → `color.gray.light.700` | `accessible-first.theme.dark.color.text.secondary` → `color.neutral.700` → `accessible-first.theme.dark.color.neutral.700` → `color.gray.dark.700` |
| `color.text.muted` | `accessible-first.theme.light.color.text.muted` → `color.neutral.500` → `accessible-first.theme.light.color.neutral.500` → `color.gray.light.500` | `accessible-first.theme.dark.color.text.muted` → `color.neutral.600` → `accessible-first.theme.dark.color.neutral.600` → `color.gray.dark.600` |
| `color.text.inverse` | `accessible-first.theme.light.color.text.inverse` → `color.text.on-dark` → `accessible-first.theme.base.color.text.on-dark` → `color.gray.light.0` | `accessible-first.theme.dark.color.text.inverse` → `color.text.on-light` → `accessible-first.theme.base.color.text.on-light` → `color.gray.light.900` |
| `color.text.on-action` | `accessible-first.theme.light.color.text.on-action` → `color.text.on-dark` → `accessible-first.theme.base.color.text.on-dark` → `color.gray.light.0` | `accessible-first.theme.dark.color.text.on-action` → `color.text.on-light` → `accessible-first.theme.base.color.text.on-light` → `color.gray.light.900` |
| `color.text.link` | `accessible-first.theme.light.color.text.link` → `color.blue.light.700` | `accessible-first.theme.dark.color.text.link` → `color.blue.dark.700` |
| `color.text.on-danger` | `accessible-first.theme.light.color.text.on-danger` → `color.text.on-dark` → `accessible-first.theme.base.color.text.on-dark` → `color.gray.light.0` | `accessible-first.theme.dark.color.text.on-danger` → `color.text.on-light` → `accessible-first.theme.base.color.text.on-light` → `color.gray.light.900` |
| `color.text.on-light` | `accessible-first.theme.base.color.text.on-light` → `color.gray.light.900` | `accessible-first.theme.base.color.text.on-light` → `color.gray.light.900` |
| `color.text.on-dark` | `accessible-first.theme.base.color.text.on-dark` → `color.gray.light.0` | `accessible-first.theme.base.color.text.on-dark` → `color.gray.light.0` |
| `color.text.info-on-light` | `accessible-first.theme.base.color.text.info-on-light` → `color.teal.light.800` | `accessible-first.theme.base.color.text.info-on-light` → `color.teal.light.800` |
| `color.text.info-on-dark` | `accessible-first.theme.base.color.text.info-on-dark` → `color.teal.light.100` | `accessible-first.theme.base.color.text.info-on-dark` → `color.teal.light.100` |
| `color.text.success-on-light` | `accessible-first.theme.base.color.text.success-on-light` → `color.green.light.800` | `accessible-first.theme.base.color.text.success-on-light` → `color.green.light.800` |
| `color.text.success-on-dark` | `accessible-first.theme.base.color.text.success-on-dark` → `color.green.light.100` | `accessible-first.theme.base.color.text.success-on-dark` → `color.green.light.100` |
| `color.text.warning-on-light` | `accessible-first.theme.base.color.text.warning-on-light` → `color.amber.light.800` | `accessible-first.theme.base.color.text.warning-on-light` → `color.amber.light.800` |
| `color.text.warning-on-dark` | `accessible-first.theme.base.color.text.warning-on-dark` → `color.amber.light.100` | `accessible-first.theme.base.color.text.warning-on-dark` → `color.amber.light.100` |
| `color.text.danger-on-light` | `accessible-first.theme.base.color.text.danger-on-light` → `color.red.light.800` | `accessible-first.theme.base.color.text.danger-on-light` → `color.red.light.800` |
| `color.text.danger-on-dark` | `accessible-first.theme.base.color.text.danger-on-dark` → `color.red.light.100` | `accessible-first.theme.base.color.text.danger-on-dark` → `color.red.light.100` |
| `color.border.default` | `accessible-first.theme.light.color.border.default` → `color.neutral.200` → `accessible-first.theme.light.color.neutral.200` → `color.gray.light.200` | `accessible-first.theme.dark.color.border.default` → `color.neutral.200` → `accessible-first.theme.dark.color.neutral.200` → `color.gray.dark.200` |
| `color.border.strong` | `accessible-first.theme.light.color.border.strong` → `color.neutral.500` → `accessible-first.theme.light.color.neutral.500` → `color.gray.light.500` | `accessible-first.theme.dark.color.border.strong` → `color.neutral.500` → `accessible-first.theme.dark.color.neutral.500` → `color.gray.dark.500` |
| `color.border.focus` | `accessible-first.theme.light.color.border.focus` → `color.blue.light.600` | `accessible-first.theme.dark.color.border.focus` → `color.blue.dark.600` |
| `color.border.selected` | `accessible-first.theme.light.color.border.selected` → `color.blue.light.600` | `accessible-first.theme.dark.color.border.selected` → `color.blue.dark.600` |
| `color.action.primary.@` | `accessible-first.theme.light.color.action.primary.@` → `color.blue.light.600` | `accessible-first.theme.dark.color.action.primary.@` → `color.blue.dark.600` |
| `color.action.primary.hover` | `accessible-first.theme.light.color.action.primary.hover` → `color.blue.light.700` | `accessible-first.theme.dark.color.action.primary.hover` → `color.blue.dark.700` |
| `color.action.secondary.@` | `accessible-first.theme.light.color.action.secondary.@` → `color.neutral.0` → `accessible-first.theme.light.color.neutral.0` → `color.gray.light.0` | `accessible-first.theme.dark.color.action.secondary.@` → `color.neutral.50` → `accessible-first.theme.dark.color.neutral.50` → `color.gray.dark.50` |
| `color.action.secondary.hover` | `accessible-first.theme.light.color.action.secondary.hover` → `color.neutral.100` → `accessible-first.theme.light.color.neutral.100` → `color.gray.light.100` | `accessible-first.theme.dark.color.action.secondary.hover` → `color.neutral.100` → `accessible-first.theme.dark.color.neutral.100` → `color.gray.dark.100` |
| `color.action.danger.@` | `accessible-first.theme.light.color.action.danger.@` → `color.red.light.700` | `accessible-first.theme.dark.color.action.danger.@` → `color.red.dark.600` |
| `color.action.danger.hover` | `accessible-first.theme.light.color.action.danger.hover` → `color.red.light.800` | `accessible-first.theme.dark.color.action.danger.hover` → `color.red.dark.700` |
| `color.status.info.@` | `accessible-first.theme.light.color.status.info.@` → `color.teal.light.600` | `accessible-first.theme.dark.color.status.info.@` → `color.teal.dark.600` |
| `color.status.info.subtle` | `accessible-first.theme.light.color.status.info.subtle` → `color.teal.light.100` | `accessible-first.theme.dark.color.status.info.subtle` → `color.teal.dark.100` |
| `color.status.success.@` | `accessible-first.theme.light.color.status.success.@` → `color.green.light.600` | `accessible-first.theme.dark.color.status.success.@` → `color.green.dark.600` |
| `color.status.success.subtle` | `accessible-first.theme.light.color.status.success.subtle` → `color.green.light.100` | `accessible-first.theme.dark.color.status.success.subtle` → `color.green.dark.100` |
| `color.status.warning.@` | `accessible-first.theme.light.color.status.warning.@` → `color.amber.light.600` | `accessible-first.theme.dark.color.status.warning.@` → `color.amber.dark.600` |
| `color.status.warning.subtle` | `accessible-first.theme.light.color.status.warning.subtle` → `color.amber.light.100` | `accessible-first.theme.dark.color.status.warning.subtle` → `color.amber.dark.100` |
| `color.status.danger.@` | `accessible-first.theme.light.color.status.danger.@` → `color.red.light.700` | `accessible-first.theme.dark.color.status.danger.@` → `color.red.dark.600` |
| `color.status.danger.subtle` | `accessible-first.theme.light.color.status.danger.subtle` → `color.red.light.100` | `accessible-first.theme.dark.color.status.danger.subtle` → `color.red.dark.100` |
| `color.category.1.@` | `accessible-first.theme.light.color.category.1.@` → `color.blue.light.600` | `accessible-first.theme.dark.color.category.1.@` → `color.blue.dark.600` |
| `color.category.1.subtle` | `accessible-first.theme.light.color.category.1.subtle` → `color.blue.light.100` | `accessible-first.theme.dark.color.category.1.subtle` → `color.blue.dark.100` |
| `color.category.2.@` | `accessible-first.theme.light.color.category.2.@` → `color.teal.light.600` | `accessible-first.theme.dark.color.category.2.@` → `color.teal.dark.600` |
| `color.category.2.subtle` | `accessible-first.theme.light.color.category.2.subtle` → `color.teal.light.100` | `accessible-first.theme.dark.color.category.2.subtle` → `color.teal.dark.100` |
| `color.category.3.@` | `accessible-first.theme.light.color.category.3.@` → `color.green.light.600` | `accessible-first.theme.dark.color.category.3.@` → `color.green.dark.600` |
| `color.category.3.subtle` | `accessible-first.theme.light.color.category.3.subtle` → `color.green.light.100` | `accessible-first.theme.dark.color.category.3.subtle` → `color.green.dark.100` |
| `color.category.4.@` | `accessible-first.theme.light.color.category.4.@` → `color.amber.light.600` | `accessible-first.theme.dark.color.category.4.@` → `color.amber.dark.600` |
| `color.category.4.subtle` | `accessible-first.theme.light.color.category.4.subtle` → `color.amber.light.100` | `accessible-first.theme.dark.color.category.4.subtle` → `color.amber.dark.100` |
| `color.category.5.@` | `accessible-first.theme.light.color.category.5.@` → `color.neutral.500` → `accessible-first.theme.light.color.neutral.500` → `color.gray.light.500` | `accessible-first.theme.dark.color.category.5.@` → `color.neutral.700` → `accessible-first.theme.dark.color.neutral.700` → `color.gray.dark.700` |
| `color.category.5.subtle` | `accessible-first.theme.light.color.category.5.subtle` → `color.neutral.100` → `accessible-first.theme.light.color.neutral.100` → `color.gray.light.100` | `accessible-first.theme.dark.color.category.5.subtle` → `color.neutral.100` → `accessible-first.theme.dark.color.neutral.100` → `color.gray.dark.100` |
| `color.disabled.text` | `accessible-first.theme.light.color.disabled.text` → `color.neutral.500` → `accessible-first.theme.light.color.neutral.500` → `color.gray.light.500` | `accessible-first.theme.dark.color.disabled.text` → `color.neutral.500` → `accessible-first.theme.dark.color.neutral.500` → `color.gray.dark.500` |
| `color.disabled.surface` | `accessible-first.theme.light.color.disabled.surface` → `color.neutral.100` → `accessible-first.theme.light.color.neutral.100` → `color.gray.light.100` | `accessible-first.theme.dark.color.disabled.surface` → `color.neutral.100` → `accessible-first.theme.dark.color.neutral.100` → `color.gray.dark.100` |
| `color.disabled.border` | `accessible-first.theme.light.color.disabled.border` → `color.neutral.200` → `accessible-first.theme.light.color.neutral.200` → `color.gray.light.200` | `accessible-first.theme.dark.color.disabled.border` → `color.neutral.200` → `accessible-first.theme.dark.color.neutral.200` → `color.gray.dark.200` |

The raw values these tokens end at are on [Primitives › Color](../primitives/color).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| A selected row or item | color.surface.selected and a check icon | Color alone | Selection never relies on color alone. |
| An error message | color.status.danger, an icon and a sentence next to the field | Color alone | People must know what went wrong and where. |
| A link | color.text.link, underlined | Color only | Underline works without color perception. |
| A status | Badge with an icon and a word | Color alone | Status must survive no color and a screen reader. |
| The action that completes the task | Button primary, one per page | Two primaries | One clear next step. Two primaries make people stop and compare, which adds effort. |
| An alternative or cancel | Button secondary | A text link | Every action looks like a button people can find. |
| Delete or remove | Button secondary, then a confirm page with Button danger | Button primary | A confirm step prevents a costly error. |

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

::pairs-chart{id="default"}

## The tone of each fill

Every fill says whether it is light or dark, in each mode, and that picks the text on it. A fill can change tone between modes: the same token, the other text.

Every fill changes tone between light and dark mode.

| Fill | Light mode | Dark mode |
| --- | --- | --- |
| `surface.canvas` | :sample{kind="tone" value="#F7F7F7" ink="#141414"} light | :sample{kind="tone" value="#0A0A0A" ink="#FFFFFF"} dark |
| `surface.default` | :sample{kind="tone" value="#FFFFFF" ink="#141414"} light | :sample{kind="tone" value="#141414" ink="#FFFFFF"} dark |
| `surface.raised` | :sample{kind="tone" value="#FFFFFF" ink="#141414"} light | :sample{kind="tone" value="#141414" ink="#FFFFFF"} dark |
| `surface.sunken` | :sample{kind="tone" value="#EDEDED" ink="#141414"} light | :sample{kind="tone" value="#222222" ink="#FFFFFF"} dark |
| `surface.highlight` | :sample{kind="tone" value="#EDEDED" ink="#141414"} light | :sample{kind="tone" value="#222222" ink="#FFFFFF"} dark |
| `surface.pressed` | :sample{kind="tone" value="#D6D6D6" ink="#141414"} light | :sample{kind="tone" value="#333333" ink="#FFFFFF"} dark |
| `surface.selected` | :sample{kind="tone" value="#E2EDFF" ink="#141414"} light | :sample{kind="tone" value="#102547" ink="#FFFFFF"} dark |
| `surface.inverse` | :sample{kind="tone" value="#141414" ink="#FFFFFF"} dark | :sample{kind="tone" value="#F7F7F7" ink="#141414"} light |
| `action.primary` | :sample{kind="tone" value="#0B4FC0" ink="#FFFFFF"} dark | :sample{kind="tone" value="#8AB4F8" ink="#141414"} light |
| `action.primary.hover` | :sample{kind="tone" value="#013895" ink="#FFFFFF"} dark | :sample{kind="tone" value="#A7C8FC" ink="#141414"} light |
| `action.danger` | :sample{kind="tone" value="#981519" ink="#FFFFFF"} dark | :sample{kind="tone" value="#F28B8B" ink="#141414"} light |
| `action.danger.hover` | :sample{kind="tone" value="#6D0008" ink="#FFFFFF"} dark | :sample{kind="tone" value="#FAA9A8" ink="#141414"} light |
| `action.secondary` | :sample{kind="tone" value="#FFFFFF" ink="#141414"} light | :sample{kind="tone" value="#141414" ink="#FFFFFF"} dark |
| `action.secondary.hover` | :sample{kind="tone" value="#EDEDED" ink="#141414"} light | :sample{kind="tone" value="#222222" ink="#FFFFFF"} dark |
| `status.info.subtle` | :sample{kind="tone" value="#CDF4F0" ink="#141414"} light | :sample{kind="tone" value="#012F2C" ink="#FFFFFF"} dark |
| `status.warning.subtle` | :sample{kind="tone" value="#FEE8CF" ink="#141414"} light | :sample{kind="tone" value="#372500" ink="#FFFFFF"} dark |
| `status.danger.subtle` | :sample{kind="tone" value="#FFDBD8" ink="#141414"} light | :sample{kind="tone" value="#451014" ink="#FFFFFF"} dark |
| `status.success.subtle` | :sample{kind="tone" value="#DBF7DF" ink="#141414"} light | :sample{kind="tone" value="#012E16" ink="#FFFFFF"} dark |
