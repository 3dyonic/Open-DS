---
composite_data: "./typography.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 1
title: "Typography"
description: "Accessible first: How text is set: roles, sizes and line height."
---

# Typography

How text is set: roles, sizes and line height.

::type-roles{id="typography"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which text roles does it need? | Core: heading, body, label | Few roles keep pages predictable. |
| How many steps does the type scale take? | Only the steps the screens need | Only the sizes the screens need, each clearly different. |
| How are sizes and line heights defined? | A ratio, line heights in proportion | Line height grows with text size for zoom users. |
| How large is body text? | Large | Large text is readable for more people. |
| Where does type do the most work? | Forms and labels | Type matters most in form labels and hints. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `type.display.font-family` | `accessible-first.theme.base.type.display.font-family` → `font.family.atkinson-hyperlegible` |
| `type.display.font-size` | `font.size.36` |
| `type.display.line-height` | `font.line-height.1_25` |
| `type.display.font-weight` | `font.weight.700` |
| `type.title.font-family` | `accessible-first.theme.base.type.title.font-family` → `font.family.atkinson-hyperlegible` |
| `type.title.font-size` | `font.size.28` |
| `type.title.line-height` | `font.line-height.1_25` |
| `type.title.font-weight` | `font.weight.700` |
| `type.heading.font-family` | `accessible-first.theme.base.type.heading.font-family` → `font.family.atkinson-hyperlegible` |
| `type.heading.font-size` | `font.size.22` |
| `type.heading.line-height` | `font.line-height.1_25` |
| `type.heading.font-weight` | `font.weight.700` |
| `type.body.font-family` | `accessible-first.theme.base.type.body.font-family` → `font.family.atkinson-hyperlegible` |
| `type.body.font-size` | `font.size.19` |
| `type.body.line-height` | `font.line-height.1_6` |
| `type.body.font-weight` | `font.weight.400` |
| `type.label.font-family` | `accessible-first.theme.base.type.label.font-family` → `font.family.atkinson-hyperlegible` |
| `type.label.font-size` | `font.size.18` |
| `type.label.line-height` | `font.line-height.1_6` |
| `type.label.font-weight` | `font.weight.700` |
| `type.caption.font-family` | `accessible-first.theme.base.type.caption.font-family` → `font.family.atkinson-hyperlegible` |
| `type.caption.font-size` | `font.size.16` |
| `type.caption.line-height` | `font.line-height.1_6` |
| `type.caption.font-weight` | `font.weight.400` |
| `type.data.font-family` | `accessible-first.theme.base.type.data.font-family` → `font.family.atkinson-hyperlegible` |
| `type.data.font-size` | `font.size.19` |
| `type.data.line-height` | `font.line-height.1_6` |
| `type.data.font-weight` | `font.weight.400` |

The raw values these tokens end at are on [Primitives › Type](../primitives/type).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Page title | type.title | type.display | The same title size on every page tells people where they are. The display size changes from page to page and pushes the content down. |
| A number in a table | type.body | A small or mono font | Every number must be readable at large size. |
| Paragraph or help text | type.body, short sentences | type.caption | Large text and short lines lower effort. |
| Field label or column header | type.label, above the field, always visible | A placeholder as the label | Labels must stay visible while typing. |
