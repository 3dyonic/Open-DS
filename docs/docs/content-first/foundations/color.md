---
composite_data: "./color.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 2
title: "Color"
description: "Content first: How color carries action, state and brand."
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
| Which color roles does it need? | Surface, text, action and status | Reading needs few color roles. |
| How many emphasis levels do actions need? | Three | Primary, secondary and a text link. |
| How is the palette defined? | Neutrals and one brand ramp | Warm paper neutrals and one ink ramp. |
| How saturated is the palette? | Balanced | A calm, balanced palette. |
| Where does color carry meaning first? | Links and actions | Color marks links inside the text. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Mode | Points to |
| --- | --- | --- |
| `color.neutral.0` | light | `content-first.theme.light.color.neutral.0` → `color.stone.light.0` |
| | dark | `content-first.theme.dark.color.neutral.0` → `color.stone.dark.0` |
| `color.neutral.50` | light | `content-first.theme.light.color.neutral.50` → `color.stone.light.50` |
| | dark | `content-first.theme.dark.color.neutral.50` → `color.stone.dark.50` |
| `color.neutral.100` | light | `content-first.theme.light.color.neutral.100` → `color.stone.light.100` |
| | dark | `content-first.theme.dark.color.neutral.100` → `color.stone.dark.100` |
| `color.neutral.200` | light | `content-first.theme.light.color.neutral.200` → `color.stone.light.200` |
| | dark | `content-first.theme.dark.color.neutral.200` → `color.stone.dark.200` |
| `color.neutral.300` | light | `content-first.theme.light.color.neutral.300` → `color.stone.light.300` |
| | dark | `content-first.theme.dark.color.neutral.300` → `color.stone.dark.300` |
| `color.neutral.400` | light | `content-first.theme.light.color.neutral.400` → `color.stone.light.400` |
| | dark | `content-first.theme.dark.color.neutral.400` → `color.stone.dark.400` |
| `color.neutral.500` | light | `content-first.theme.light.color.neutral.500` → `color.stone.light.500` |
| | dark | `content-first.theme.dark.color.neutral.500` → `color.stone.dark.500` |
| `color.neutral.600` | light | `content-first.theme.light.color.neutral.600` → `color.stone.light.600` |
| | dark | `content-first.theme.dark.color.neutral.600` → `color.stone.dark.600` |
| `color.neutral.700` | light | `content-first.theme.light.color.neutral.700` → `color.stone.light.700` |
| | dark | `content-first.theme.dark.color.neutral.700` → `color.stone.dark.700` |
| `color.neutral.800` | light | `content-first.theme.light.color.neutral.800` → `color.stone.light.800` |
| | dark | `content-first.theme.dark.color.neutral.800` → `color.stone.dark.800` |
| `color.neutral.900` | light | `content-first.theme.light.color.neutral.900` → `color.stone.light.900` |
| | dark | `content-first.theme.dark.color.neutral.900` → `color.stone.dark.900` |
| `color.neutral.950` | light | `content-first.theme.light.color.neutral.950` → `color.stone.light.950` |
| | dark | `content-first.theme.dark.color.neutral.950` → `color.stone.dark.950` |
| `color.neutral.floor` | light | `content-first.theme.light.color.neutral.floor` → `color.stone.light.0` |
| | dark | `content-first.theme.dark.color.neutral.floor` → `color.stone.dark.floor` |
| `color.surface.canvas` | light | `content-first.theme.light.color.surface.canvas` → `color.neutral.50` → `content-first.theme.light.color.neutral.50` → `color.stone.light.50` |
| | dark | `content-first.theme.dark.color.surface.canvas` → `color.neutral.0` → `content-first.theme.dark.color.neutral.0` → `color.stone.dark.0` |
| `color.surface.default` | light | `content-first.theme.light.color.surface.default` → `color.neutral.0` → `content-first.theme.light.color.neutral.0` → `color.stone.light.0` |
| | dark | `content-first.theme.dark.color.surface.default` → `color.neutral.50` → `content-first.theme.dark.color.neutral.50` → `color.stone.dark.50` |
| `color.surface.raised` | light | `content-first.theme.light.color.surface.raised` → `color.neutral.0` → `content-first.theme.light.color.neutral.0` → `color.stone.light.0` |
| | dark | `content-first.theme.dark.color.surface.raised` → `color.neutral.100` → `content-first.theme.dark.color.neutral.100` → `color.stone.dark.100` |
| `color.surface.sunken` | light | `content-first.theme.light.color.surface.sunken` → `color.neutral.100` → `content-first.theme.light.color.neutral.100` → `color.stone.light.100` |
| | dark | `content-first.theme.dark.color.surface.sunken` → `color.neutral.floor` → `content-first.theme.dark.color.neutral.floor` → `color.stone.dark.floor` |
| `color.surface.highlight` | light | `content-first.theme.light.color.surface.highlight` → `color.neutral.100` → `content-first.theme.light.color.neutral.100` → `color.stone.light.100` |
| | dark | `content-first.theme.dark.color.surface.highlight` → `color.neutral.floor` → `content-first.theme.dark.color.neutral.floor` → `color.stone.dark.floor` |
| `color.surface.pressed` | light | `content-first.theme.light.color.surface.pressed` → `color.neutral.200` → `content-first.theme.light.color.neutral.200` → `color.stone.light.200` |
| | dark | `content-first.theme.dark.color.surface.pressed` → `color.neutral.200` → `content-first.theme.dark.color.neutral.200` → `color.stone.dark.200` |
| `color.surface.selected` | light | `content-first.theme.light.color.surface.selected` → `color.navy.light.100` |
| | dark | `content-first.theme.dark.color.surface.selected` → `color.navy.dark.100` |
| `color.surface.inverse` | light | `content-first.theme.light.color.surface.inverse` → `color.neutral.900` → `content-first.theme.light.color.neutral.900` → `color.stone.light.900` |
| | dark | `content-first.theme.dark.color.surface.inverse` → `color.neutral.900` → `content-first.theme.dark.color.neutral.900` → `color.stone.dark.900` |
| `color.surface.scrim` | light | `content-first.theme.light.color.surface.scrim` → `color.black.light.scrim` |
| | dark | `content-first.theme.dark.color.surface.scrim` → `color.black.dark.scrim` |
| `color.text.primary` | light | `content-first.theme.light.color.text.primary` → `color.neutral.900` → `content-first.theme.light.color.neutral.900` → `color.stone.light.900` |
| | dark | `content-first.theme.dark.color.text.primary` → `color.neutral.900` → `content-first.theme.dark.color.neutral.900` → `color.stone.dark.900` |
| `color.text.secondary` | light | `content-first.theme.light.color.text.secondary` → `color.neutral.700` → `content-first.theme.light.color.neutral.700` → `color.stone.light.700` |
| | dark | `content-first.theme.dark.color.text.secondary` → `color.neutral.500` → `content-first.theme.dark.color.neutral.500` → `color.stone.dark.500` |
| `color.text.muted` | light | `content-first.theme.light.color.text.muted` → `color.neutral.600` → `content-first.theme.light.color.neutral.600` → `color.stone.light.600` |
| | dark | `content-first.theme.dark.color.text.muted` → `color.neutral.400` → `content-first.theme.dark.color.neutral.400` → `color.stone.dark.400` |
| `color.text.inverse` | light | `content-first.theme.light.color.text.inverse` → `color.text.on-dark` → `content-first.theme.base.color.text.on-dark` → `color.stone.light.0` |
| | dark | `content-first.theme.dark.color.text.inverse` → `color.text.on-light` → `content-first.theme.base.color.text.on-light` → `color.stone.light.900` |
| `color.text.on-action` | light | `content-first.theme.light.color.text.on-action` → `color.text.on-dark` → `content-first.theme.base.color.text.on-dark` → `color.stone.light.0` |
| | dark | `content-first.theme.dark.color.text.on-action` → `color.text.on-light` → `content-first.theme.base.color.text.on-light` → `color.stone.light.900` |
| `color.text.link` | light | `content-first.theme.light.color.text.link` → `color.navy.light.700` |
| | dark | `content-first.theme.dark.color.text.link` → `color.navy.dark.700` |
| `color.text.on-danger` | light | `content-first.theme.light.color.text.on-danger` → `color.text.on-dark` → `content-first.theme.base.color.text.on-dark` → `color.stone.light.0` |
| | dark | `content-first.theme.dark.color.text.on-danger` → `color.text.on-light` → `content-first.theme.base.color.text.on-light` → `color.stone.light.900` |
| `color.text.on-light` | light | `content-first.theme.base.color.text.on-light` → `color.stone.light.900` |
| | dark | `content-first.theme.base.color.text.on-light` → `color.stone.light.900` |
| `color.text.on-dark` | light | `content-first.theme.base.color.text.on-dark` → `color.stone.light.0` |
| | dark | `content-first.theme.base.color.text.on-dark` → `color.stone.light.0` |
| `color.text.info-on-light` | light | `content-first.theme.base.color.text.info-on-light` → `color.blue.light.800` |
| | dark | `content-first.theme.base.color.text.info-on-light` → `color.blue.light.800` |
| `color.text.info-on-dark` | light | `content-first.theme.base.color.text.info-on-dark` → `color.blue.light.100` |
| | dark | `content-first.theme.base.color.text.info-on-dark` → `color.blue.light.100` |
| `color.text.success-on-light` | light | `content-first.theme.base.color.text.success-on-light` → `color.green.light.800` |
| | dark | `content-first.theme.base.color.text.success-on-light` → `color.green.light.800` |
| `color.text.success-on-dark` | light | `content-first.theme.base.color.text.success-on-dark` → `color.green.light.100` |
| | dark | `content-first.theme.base.color.text.success-on-dark` → `color.green.light.100` |
| `color.text.warning-on-light` | light | `content-first.theme.base.color.text.warning-on-light` → `color.amber.light.800` |
| | dark | `content-first.theme.base.color.text.warning-on-light` → `color.amber.light.800` |
| `color.text.warning-on-dark` | light | `content-first.theme.base.color.text.warning-on-dark` → `color.amber.light.100` |
| | dark | `content-first.theme.base.color.text.warning-on-dark` → `color.amber.light.100` |
| `color.text.danger-on-light` | light | `content-first.theme.base.color.text.danger-on-light` → `color.red.light.800` |
| | dark | `content-first.theme.base.color.text.danger-on-light` → `color.red.light.800` |
| `color.text.danger-on-dark` | light | `content-first.theme.base.color.text.danger-on-dark` → `color.red.light.100` |
| | dark | `content-first.theme.base.color.text.danger-on-dark` → `color.red.light.100` |
| `color.border.default` | light | `content-first.theme.light.color.border.default` → `color.neutral.200` → `content-first.theme.light.color.neutral.200` → `color.stone.light.200` |
| | dark | `content-first.theme.dark.color.border.default` → `color.neutral.200` → `content-first.theme.dark.color.neutral.200` → `color.stone.dark.200` |
| `color.border.raised` | light | `content-first.theme.light.color.border.raised` → `color.neutral.200` → `content-first.theme.light.color.neutral.200` → `color.stone.light.200` |
| | dark | `content-first.theme.dark.color.border.raised` → `color.neutral.200` → `content-first.theme.dark.color.neutral.200` → `color.stone.dark.200` |
| `color.border.strong` | light | `content-first.theme.light.color.border.strong` → `color.neutral.500` → `content-first.theme.light.color.neutral.500` → `color.stone.light.500` |
| | dark | `content-first.theme.dark.color.border.strong` → `color.neutral.400` → `content-first.theme.dark.color.neutral.400` → `color.stone.dark.400` |
| `color.border.focus` | light | `content-first.theme.light.color.border.focus` → `color.navy.light.600` |
| | dark | `content-first.theme.dark.color.border.focus` → `color.navy.dark.600` |
| `color.border.selected` | light | `content-first.theme.light.color.border.selected` → `color.navy.light.600` |
| | dark | `content-first.theme.dark.color.border.selected` → `color.navy.dark.600` |
| `color.action.primary.@` | light | `content-first.theme.light.color.action.primary.@` → `color.navy.light.600` |
| | dark | `content-first.theme.dark.color.action.primary.@` → `color.navy.dark.600` |
| `color.action.primary.hover` | light | `content-first.theme.light.color.action.primary.hover` → `color.navy.light.700` |
| | dark | `content-first.theme.dark.color.action.primary.hover` → `color.navy.dark.700` |
| `color.action.secondary.@` | light | `content-first.theme.light.color.action.secondary.@` → `color.neutral.0` → `content-first.theme.light.color.neutral.0` → `color.stone.light.0` |
| | dark | `content-first.theme.dark.color.action.secondary.@` → `color.neutral.50` → `content-first.theme.dark.color.neutral.50` → `color.stone.dark.50` |
| `color.action.secondary.hover` | light | `content-first.theme.light.color.action.secondary.hover` → `color.neutral.100` → `content-first.theme.light.color.neutral.100` → `color.stone.light.100` |
| | dark | `content-first.theme.dark.color.action.secondary.hover` → `color.neutral.100` → `content-first.theme.dark.color.neutral.100` → `color.stone.dark.100` |
| `color.action.danger.@` | light | `content-first.theme.light.color.action.danger.@` → `color.red.light.600` |
| | dark | `content-first.theme.dark.color.action.danger.@` → `color.red.dark.600` |
| `color.action.danger.hover` | light | `content-first.theme.light.color.action.danger.hover` → `color.red.light.700` |
| | dark | `content-first.theme.dark.color.action.danger.hover` → `color.red.dark.700` |
| `color.status.info.@` | light | `content-first.theme.light.color.status.info.@` → `color.blue.light.600` |
| | dark | `content-first.theme.dark.color.status.info.@` → `color.blue.dark.600` |
| `color.status.info.subtle` | light | `content-first.theme.light.color.status.info.subtle` → `color.blue.light.100` |
| | dark | `content-first.theme.dark.color.status.info.subtle` → `color.blue.dark.100` |
| `color.status.success.@` | light | `content-first.theme.light.color.status.success.@` → `color.green.light.600` |
| | dark | `content-first.theme.dark.color.status.success.@` → `color.green.dark.600` |
| `color.status.success.subtle` | light | `content-first.theme.light.color.status.success.subtle` → `color.green.light.100` |
| | dark | `content-first.theme.dark.color.status.success.subtle` → `color.green.dark.100` |
| `color.status.warning.@` | light | `content-first.theme.light.color.status.warning.@` → `color.amber.light.600` |
| | dark | `content-first.theme.dark.color.status.warning.@` → `color.amber.dark.600` |
| `color.status.warning.subtle` | light | `content-first.theme.light.color.status.warning.subtle` → `color.amber.light.100` |
| | dark | `content-first.theme.dark.color.status.warning.subtle` → `color.amber.dark.100` |
| `color.status.danger.@` | light | `content-first.theme.light.color.status.danger.@` → `color.red.light.600` |
| | dark | `content-first.theme.dark.color.status.danger.@` → `color.red.dark.600` |
| `color.status.danger.subtle` | light | `content-first.theme.light.color.status.danger.subtle` → `color.red.light.100` |
| | dark | `content-first.theme.dark.color.status.danger.subtle` → `color.red.dark.100` |
| `color.category.1.@` | light | `content-first.theme.light.color.category.1.@` → `color.navy.light.600` |
| | dark | `content-first.theme.dark.color.category.1.@` → `color.navy.dark.600` |
| `color.category.1.subtle` | light | `content-first.theme.light.color.category.1.subtle` → `color.navy.light.100` |
| | dark | `content-first.theme.dark.color.category.1.subtle` → `color.navy.dark.100` |
| `color.category.2.@` | light | `content-first.theme.light.color.category.2.@` → `color.blue.light.600` |
| | dark | `content-first.theme.dark.color.category.2.@` → `color.blue.dark.600` |
| `color.category.2.subtle` | light | `content-first.theme.light.color.category.2.subtle` → `color.blue.light.100` |
| | dark | `content-first.theme.dark.color.category.2.subtle` → `color.blue.dark.100` |
| `color.category.3.@` | light | `content-first.theme.light.color.category.3.@` → `color.green.light.600` |
| | dark | `content-first.theme.dark.color.category.3.@` → `color.green.dark.600` |
| `color.category.3.subtle` | light | `content-first.theme.light.color.category.3.subtle` → `color.green.light.100` |
| | dark | `content-first.theme.dark.color.category.3.subtle` → `color.green.dark.100` |
| `color.category.4.@` | light | `content-first.theme.light.color.category.4.@` → `color.amber.light.600` |
| | dark | `content-first.theme.dark.color.category.4.@` → `color.amber.dark.600` |
| `color.category.4.subtle` | light | `content-first.theme.light.color.category.4.subtle` → `color.amber.light.100` |
| | dark | `content-first.theme.dark.color.category.4.subtle` → `color.amber.dark.100` |
| `color.category.5.@` | light | `content-first.theme.light.color.category.5.@` → `color.neutral.500` → `content-first.theme.light.color.neutral.500` → `color.stone.light.500` |
| | dark | `content-first.theme.dark.color.category.5.@` → `color.neutral.700` → `content-first.theme.dark.color.neutral.700` → `color.stone.dark.700` |
| `color.category.5.subtle` | light | `content-first.theme.light.color.category.5.subtle` → `color.neutral.100` → `content-first.theme.light.color.neutral.100` → `color.stone.light.100` |
| | dark | `content-first.theme.dark.color.category.5.subtle` → `color.neutral.100` → `content-first.theme.dark.color.neutral.100` → `color.stone.dark.100` |
| `color.disabled.text` | light | `content-first.theme.light.color.disabled.text` → `color.neutral.500` → `content-first.theme.light.color.neutral.500` → `color.stone.light.500` |
| | dark | `content-first.theme.dark.color.disabled.text` → `color.neutral.500` → `content-first.theme.dark.color.neutral.500` → `color.stone.dark.500` |
| `color.disabled.surface` | light | `content-first.theme.light.color.disabled.surface` → `color.neutral.100` → `content-first.theme.light.color.neutral.100` → `color.stone.light.100` |
| | dark | `content-first.theme.dark.color.disabled.surface` → `color.neutral.100` → `content-first.theme.dark.color.neutral.100` → `color.stone.dark.100` |
| `color.disabled.border` | light | `content-first.theme.light.color.disabled.border` → `color.neutral.200` → `content-first.theme.light.color.neutral.200` → `color.stone.light.200` |
| | dark | `content-first.theme.dark.color.disabled.border` → `color.neutral.200` → `content-first.theme.dark.color.neutral.200` → `color.stone.dark.200` |

The raw values these tokens end at are on [Primitives › Color](../primitives/color).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| A selected row or item | color.surface.selected | Bold text only | A tint shows the choice clearly on warm paper. |
| An error message | color.status.danger and a plain sentence | Color alone | The sentence says what to fix; color only draws the eye. |
| A link | color.text.link, underlined | Color without underline | Readers expect links to be underlined inside text. |
| A status | Badge pill with a word | An icon alone | Status is rare, so readers never learn an icon for it. A word is clear the first time. |
| The action that completes the task | Button primary, one per section | Two primaries side by side | One clear action per section. Two primaries make the reader choose before they have read. |
| An alternative or cancel | Button ghost as a text link | A second boxed button | A link feels lighter and does not compete. |
| Delete or remove | Button secondary with the full verb, then confirm with Button danger | Button primary | Naming the verb and confirming prevents a mistake. |

## Status urgency

Status colors go up in urgency: info, then warning, then danger. Pick the level that matches the real risk. Never go up a level to get attention. Success sits outside the order.

`color.status.info.@` → `color.status.warning.@` → `color.status.danger.@`

## Surfaces: when, and for what effect

A surface tells people where they are in depth, or which item they are on. Each one has a job; using the wrong one breaks the reading order.

| Surface | Its job | Use it for | Not for |
| --- | --- | --- | --- |
| :sample{kind="dot" value="var(--color-surface-canvas)"} **Canvas** | The page background behind everything. | Page and app background | Cards and panels on the page: `color.surface.default` |
| :sample{kind="dot" value="var(--color-surface-default)"} **Default** | The base fill for content. | Cards, Panels, Inputs, Table body | The page behind content: `color.surface.canvas`; Menus and popovers above content: `color.surface.raised` |
| :sample{kind="dot" value="var(--color-surface-raised)"} **Raised** | Fills that float above content. In dark, one step lighter than content, so height reads by tone. | Menus, Popovers, Dialogs | Cards in the page flow: `color.surface.default` |
| :sample{kind="dot" value="var(--color-surface-sunken)"} **Sunken** | A recessed fill, a step below content. | Table headers, Wells | A selected item: `color.surface.selected`; An item the pointer or the keyboard is on: `color.surface.highlight` |
| :sample{kind="dot" value="var(--color-surface-highlight)"} **Highlight** | The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surfaces it sits on: darker in light, and darker in dark too, as raised layers take the lighter step. | Highlighted menu items, Highlighted options, Hover rows, Open submenu triggers | Table headers and wells: `color.surface.sunken`; A selected or current item: `color.surface.selected` |
| :sample{kind="dot" value="var(--color-surface-pressed)"} **Pressed** | The fill of an item while it is pressed. Where the scheme gives pressed its own value, one step past the highlight; where pressed reuses hover, the highlight's step. | Pressed menu buttons, Pressed list items | The item the pointer or the keyboard is on: `color.surface.highlight` |
| :sample{kind="dot" value="var(--color-surface-selected)"} **Selected** | The fill of a selected or current item, or a toggle that is on. | Selected rows, Current menu item, Toggles that are on | Hover: `color.surface.sunken`; The main action: `color.action.primary.@` |
| :sample{kind="dot" value="var(--color-surface-inverse)"} **Inverse** | A reversed fill for small, short-lived messages. | Tooltips, Toasts | Large areas: `color.surface.default` |
| :sample{kind="dot" value="var(--color-surface-scrim)"} **Scrim** | The see-through layer behind a modal. | Behind dialogs and sheets | A solid fill: `color.surface.raised` |

## What each color is for

| Token | What it is for | Not for |
| --- | --- | --- |
| `color.surface.canvas` | The page background behind everything. | Cards and panels on the page: `color.surface.default` |
| `color.surface.default` | The base fill for content. | The page behind content: `color.surface.canvas`; Menus and popovers above content: `color.surface.raised` |
| `color.surface.raised` | Fills that float above content. In dark, one step lighter than content, so height reads by tone. | Cards in the page flow: `color.surface.default` |
| `color.surface.sunken` | A recessed fill, a step below content. | A selected item: `color.surface.selected`; An item the pointer or the keyboard is on: `color.surface.highlight` |
| `color.surface.highlight` | The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surfaces it sits on: darker in light, and darker in dark too, as raised layers take the lighter step. | Table headers and wells: `color.surface.sunken`; A selected or current item: `color.surface.selected` |
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
| `color.border.raised` | The 1px edge of a raised layer. In dark, a solid step lighter than the raised surface, so the edge shows where a shadow cannot. | Dividers and card borders in the page flow: `color.border.default`; The edge of a control people must find: `color.border.strong` |
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

**Every fill changes tone between light and dark mode.**

::fill-tones{id="default"}
