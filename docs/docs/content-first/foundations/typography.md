---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 1
title: "Typography"
description: "Content first: How text is set: roles, sizes and line height."
---

# Typography

How text is set: roles, sizes and line height.

- **display** 44px · 1.15 · 600

  :sample[Your reading list]{kind="type" role="display"}
- **title** 36px · 1.15 · 600

  :sample[Your reading list]{kind="type" role="title"}
- **heading** 28px · 1.15 · 600

  :sample[Planting a winter garden]{kind="type" role="heading"}
- **body** 18px · 1.65 · 400

  :sample[A reader arrives from search on a phone and reads a long guide in one sitting.]{kind="type" role="body"}
- **label** 16px · 1.45 · 600

  :sample[Keep reading]{kind="type" role="label"}
- **caption** 14px · 1.45 · 400

  :sample[A reader arrives from search on a phone and reads a long guide in one sitting.]{kind="type" role="caption"}
- **data** 18px · 1.65 · 400

  :sample[Guides saved 4 · Finished this month 11 · Minutes read 186 · Next issue Friday]{kind="type" role="data"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which text roles does it need? | Core and editorial display | A lead and a display role open articles. |
| How many steps does the type scale take? | Fine steps, so pages can set their own rhythm | Long pages need a clear hierarchy of headings, with fine steps between them. |
| How are sizes and line heights defined? | A ratio, line heights in proportion | Line height is a ratio, so it grows with the text. |
| How large is body text? | Large | Large body text is easy on the eyes. |
| Where does type do the most work? | Articles and long text | Type does its work in articles. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `type.display.font-family` | `content-first.theme.base.type.display.font-family` → `font.family.source-serif-4` |
| `type.display.font-size` | `font.size.44` |
| `type.display.line-height` | `font.line-height.1_15` |
| `type.display.font-weight` | `font.weight.600` |
| `type.title.font-family` | `content-first.theme.base.type.title.font-family` → `font.family.source-serif-4` |
| `type.title.font-size` | `font.size.36` |
| `type.title.line-height` | `font.line-height.1_15` |
| `type.title.font-weight` | `font.weight.600` |
| `type.heading.font-family` | `content-first.theme.base.type.heading.font-family` → `font.family.source-serif-4` |
| `type.heading.font-size` | `font.size.28` |
| `type.heading.line-height` | `font.line-height.1_15` |
| `type.heading.font-weight` | `font.weight.600` |
| `type.body.font-family` | `content-first.theme.base.type.body.font-family` → `font.family.source-serif-4` |
| `type.body.font-size` | `font.size.18` |
| `type.body.line-height` | `font.line-height.1_65` |
| `type.body.font-weight` | `font.weight.400` |
| `type.label.font-family` | `content-first.theme.base.type.label.font-family` → `font.family.inter` |
| `type.label.font-size` | `font.size.16` |
| `type.label.line-height` | `font.line-height.1_45` |
| `type.label.font-weight` | `font.weight.600` |
| `type.caption.font-family` | `content-first.theme.base.type.caption.font-family` → `font.family.inter` |
| `type.caption.font-size` | `font.size.14` |
| `type.caption.line-height` | `font.line-height.1_45` |
| `type.caption.font-weight` | `font.weight.400` |
| `type.data.font-family` | `content-first.theme.base.type.data.font-family` → `font.family.source-serif-4` |
| `type.data.font-size` | `font.size.18` |
| `type.data.line-height` | `font.line-height.1_65` |
| `type.data.font-weight` | `font.weight.400` |

The raw values these tokens end at are on [Primitives › Type](../primitives/type).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Page title | type.title | type.display (landing only) | Display is kept for the landing moment; article titles stay calm. |
| A number in a table | type.body | A mono font | Tables are rare and read row by row, so digits never need to line up in columns. A mono font would break the reading voice. |
| Paragraph or help text | type.body, at most 65 characters a line | type.caption | A large size and short lines make long text easy on the eyes. |
| Field label or column header | type.label | type.caption | Caption is too faint for a label people must read. |
