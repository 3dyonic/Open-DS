---
composite_data: "./typography.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 1
title: "Typography"
description: "Brand expressive: How text is set: roles, sizes and line height."
---

# Typography

How text is set: roles, sizes and line height.

::type-roles{id="typography"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which text roles does it need? | Core and expressive display | A big expressive display role carries the brand. |
| How many steps does the type scale take? | Fine steps, so pages can set their own rhythm | Fine steps give big moments room. |
| How are sizes and line heights defined? | A ratio, line heights in proportion | Ratios suit the big display sizes. |
| How large is body text? | Regular | Regular body; the display does the shouting. |
| Where does type do the most work? | Headlines and hero | Type does its work in headlines. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `type.display.font-family` | `brand-expressive.theme.base.type.display.font-family` → `font.family.bricolage-grotesque` |
| `type.display.font-size` | `font.size.56` |
| `type.display.line-height` | `font.line-height.1_8` |
| `type.display.font-weight` | `font.weight.800` |
| `type.title.font-family` | `brand-expressive.theme.base.type.title.font-family` → `font.family.bricolage-grotesque` |
| `type.title.font-size` | `font.size.40` |
| `type.title.line-height` | `font.line-height.1_1` |
| `type.title.font-weight` | `font.weight.800` |
| `type.heading.font-family` | `brand-expressive.theme.base.type.heading.font-family` → `font.family.bricolage-grotesque` |
| `type.heading.font-size` | `font.size.28` |
| `type.heading.line-height` | `font.line-height.1_1` |
| `type.heading.font-weight` | `font.weight.700` |
| `type.body.font-family` | `brand-expressive.theme.base.type.body.font-family` → `font.family.dm-sans` |
| `type.body.font-size` | `font.size.17` |
| `type.body.line-height` | `font.line-height.1_55` |
| `type.body.font-weight` | `font.weight.400` |
| `type.label.font-family` | `brand-expressive.theme.base.type.label.font-family` → `font.family.dm-sans` |
| `type.label.font-size` | `font.size.15` |
| `type.label.line-height` | `font.line-height.1_1` |
| `type.label.font-weight` | `font.weight.700` |
| `type.caption.font-family` | `brand-expressive.theme.base.type.caption.font-family` → `font.family.dm-sans` |
| `type.caption.font-size` | `font.size.14` |
| `type.caption.line-height` | `font.line-height.1_55` |
| `type.caption.font-weight` | `font.weight.400` |
| `type.data.font-family` | `brand-expressive.theme.base.type.data.font-family` → `font.family.dm-sans` |
| `type.data.font-size` | `font.size.17` |
| `type.data.line-height` | `font.line-height.1_55` |
| `type.data.font-weight` | `font.weight.400` |

The raw values these tokens end at are on [Primitives › Type](../primitives/type).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Page title | type.display | type.title | The display role carries the brand in every hero. |
| A number in a table | type.body | A mono font | Tables are rare and never compared column by column, so mono digits add nothing. The brand font keeps the voice. |
| Paragraph or help text | type.body, short | Long paragraphs | Short copy keeps the energy. |
| Field label or column header | type.label | type.caption | Labels stay readable on vivid color. |
