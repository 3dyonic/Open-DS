---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 1
title: "Typography"
description: "Multi-brand: How text is set: roles, sizes and line height."
---

# Typography

How text is set: roles, sizes and line height.

- **display** 32px · 1.8 · 700

  :sample[Your plan]{kind="type" role="display"}
- **title** 24px · 1.2 · 600

  :sample[Your plan]{kind="type" role="title"}
- **heading** 20px · 1.2 · 600

  :sample[Standard plan]{kind="type" role="heading"}
- **body** 16px · 1.5 · 400

  :sample[A customer signs up for a plan on the Birch site, then manages it in the shared account area.]{kind="type" role="body"}
- **label** 14px · 1.2 · 600

  :sample[Get started]{kind="type" role="label"}
- **caption** 13px · 1.5 · 400

  :sample[A customer signs up for a plan on the Birch site, then manages it in the shared account area.]{kind="type" role="caption"}
- **data** 16px · 1.5 · 400

  :sample[Plan Standard · Next payment 12.00 · Orders this year 9 · Member since 2024]{kind="type" role="data"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which text roles does it need? | Core: heading, body, label | One set of roles across brands. |
| How many steps does the type scale take? | One step per kind of text | One size per kind of text suits every brand font. |
| How are sizes and line heights defined? | A ratio, line heights in proportion | Ratios work with every brand font. |
| How large is body text? | Regular | Regular body size suits all brands. |
| Where does type do the most work? | Forms and labels | Sign-up and account forms carry most text. |

## Tokens

Each token points to another token. Values live only on primitives, below.

::::brand{id="aster" name="Aster"}
| Token | Points to |
| --- | --- |
| `type.display.font-family` | `aster.theme.base.type.display.font-family` → `font.family.inter` |
| `type.display.font-size` | `font.size.32` |
| `type.display.line-height` | `font.line-height.1_8` |
| `type.display.font-weight` | `font.weight.700` |
| `type.title.font-family` | `aster.theme.base.type.title.font-family` → `font.family.inter` |
| `type.title.font-size` | `font.size.24` |
| `type.title.line-height` | `font.line-height.1_2` |
| `type.title.font-weight` | `font.weight.600` |
| `type.heading.font-family` | `aster.theme.base.type.heading.font-family` → `font.family.inter` |
| `type.heading.font-size` | `font.size.20` |
| `type.heading.line-height` | `font.line-height.1_2` |
| `type.heading.font-weight` | `font.weight.600` |
| `type.body.font-family` | `aster.theme.base.type.body.font-family` → `font.family.inter` |
| `type.body.font-size` | `font.size.16` |
| `type.body.line-height` | `font.line-height.1_5` |
| `type.body.font-weight` | `font.weight.400` |
| `type.label.font-family` | `aster.theme.base.type.label.font-family` → `font.family.inter` |
| `type.label.font-size` | `font.size.14` |
| `type.label.line-height` | `font.line-height.1_2` |
| `type.label.font-weight` | `font.weight.600` |
| `type.caption.font-family` | `aster.theme.base.type.caption.font-family` → `font.family.inter` |
| `type.caption.font-size` | `font.size.13` |
| `type.caption.line-height` | `font.line-height.1_5` |
| `type.caption.font-weight` | `font.weight.400` |
| `type.data.font-family` | `aster.theme.base.type.data.font-family` → `font.family.inter` |
| `type.data.font-size` | `font.size.16` |
| `type.data.line-height` | `font.line-height.1_5` |
| `type.data.font-weight` | `font.weight.400` |
::::

::::brand{id="birch" name="Birch"}
| Token | Points to |
| --- | --- |
| `type.display.font-family` | `birch.theme.base.type.display.font-family` → `font.family.plus-jakarta-sans` |
| `type.display.font-size` | `font.size.32` |
| `type.display.line-height` | `font.line-height.1_8` |
| `type.display.font-weight` | `font.weight.700` |
| `type.title.font-family` | `birch.theme.base.type.title.font-family` → `font.family.plus-jakarta-sans` |
| `type.title.font-size` | `font.size.24` |
| `type.title.line-height` | `font.line-height.1_2` |
| `type.title.font-weight` | `font.weight.600` |
| `type.heading.font-family` | `birch.theme.base.type.heading.font-family` → `font.family.plus-jakarta-sans` |
| `type.heading.font-size` | `font.size.20` |
| `type.heading.line-height` | `font.line-height.1_2` |
| `type.heading.font-weight` | `font.weight.600` |
| `type.body.font-family` | `birch.theme.base.type.body.font-family` → `font.family.plus-jakarta-sans` |
| `type.body.font-size` | `font.size.16` |
| `type.body.line-height` | `font.line-height.1_5` |
| `type.body.font-weight` | `font.weight.400` |
| `type.label.font-family` | `birch.theme.base.type.label.font-family` → `font.family.plus-jakarta-sans` |
| `type.label.font-size` | `font.size.14` |
| `type.label.line-height` | `font.line-height.1_2` |
| `type.label.font-weight` | `font.weight.600` |
| `type.caption.font-family` | `birch.theme.base.type.caption.font-family` → `font.family.plus-jakarta-sans` |
| `type.caption.font-size` | `font.size.13` |
| `type.caption.line-height` | `font.line-height.1_5` |
| `type.caption.font-weight` | `font.weight.400` |
| `type.data.font-family` | `birch.theme.base.type.data.font-family` → `font.family.plus-jakarta-sans` |
| `type.data.font-size` | `font.size.16` |
| `type.data.line-height` | `font.line-height.1_5` |
| `type.data.font-weight` | `font.weight.400` |
::::

::::brand{id="coral" name="Coral"}
| Token | Points to |
| --- | --- |
| `type.display.font-family` | `coral.theme.base.type.display.font-family` → `font.family.poppins` |
| `type.display.font-size` | `font.size.32` |
| `type.display.line-height` | `font.line-height.1_8` |
| `type.display.font-weight` | `font.weight.700` |
| `type.title.font-family` | `coral.theme.base.type.title.font-family` → `font.family.poppins` |
| `type.title.font-size` | `font.size.24` |
| `type.title.line-height` | `font.line-height.1_2` |
| `type.title.font-weight` | `font.weight.600` |
| `type.heading.font-family` | `coral.theme.base.type.heading.font-family` → `font.family.poppins` |
| `type.heading.font-size` | `font.size.20` |
| `type.heading.line-height` | `font.line-height.1_2` |
| `type.heading.font-weight` | `font.weight.600` |
| `type.body.font-family` | `coral.theme.base.type.body.font-family` → `font.family.poppins` |
| `type.body.font-size` | `font.size.16` |
| `type.body.line-height` | `font.line-height.1_5` |
| `type.body.font-weight` | `font.weight.400` |
| `type.label.font-family` | `coral.theme.base.type.label.font-family` → `font.family.poppins` |
| `type.label.font-size` | `font.size.14` |
| `type.label.line-height` | `font.line-height.1_2` |
| `type.label.font-weight` | `font.weight.600` |
| `type.caption.font-family` | `coral.theme.base.type.caption.font-family` → `font.family.poppins` |
| `type.caption.font-size` | `font.size.13` |
| `type.caption.line-height` | `font.line-height.1_5` |
| `type.caption.font-weight` | `font.weight.400` |
| `type.data.font-family` | `coral.theme.base.type.data.font-family` → `font.family.poppins` |
| `type.data.font-size` | `font.size.16` |
| `type.data.line-height` | `font.line-height.1_5` |
| `type.data.font-weight` | `font.weight.400` |
::::

The raw values these tokens end at are on [Primitives › Type](../primitives/type).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Page title | type.title in the brand font | A brand-specific style | Roles stay shared; only the brand font changes. |
| A number in a table | type.body | A mono font | Prices sit in sentences and offers, not in columns to compare, so a mono font adds nothing in any brand. |
| Paragraph or help text | type.body | type.caption | Regular body size suits every brand. |
| Field label or column header | type.label | type.caption | Labels stay readable in every brand. |
